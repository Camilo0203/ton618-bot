"use strict";

const { getDB, isDbUnavailableError, toDbUnavailableError } = require("./core");
const {
  ObjectId,
  buildTicketStatsPipeline,
  mapTicketStatsResult,
  buildSlaMetrics,
  resolveTicketSlaMinutes,
  buildSettingsDefaults,
  buildLevelSettingsDefaults,
  buildVerifSettingsDefaults,
  buildWelcomeSettingsDefaults,
  buildModlogSettingsDefaults,
  buildSuggestSettingsDefaults,
  sanitizeSettingsRecord,
  sanitizeSettingsPatch,
  hasSettingsDrift,
  now,
  uid,
  toValidDate,
  toObjectId,
  hydratePollRecord,
  hydratePollList,
  getAutoResponsesCache,
  setAutoResponsesCache,
  clearAutoResponsesCache,
  logError,
  validateInput,
  sanitizeString,
  sanitizeChannelName,
  normalizeTicketWorkflowStatus,
  normalizeTicketQueueType,
  normalizeTicketPriority,
  normalizeTicketTags,
  inferTicketQueueType,
} = require("./helpers");

const suggestSettings = {
  collection() { return getDB().collection("suggestSettings"); },
  
  _default(guildId) {
    return buildSuggestSettingsDefaults(guildId);
  },

  async get(guildId) {
    try {
      let s = await this.collection().findOne({ guild_id: guildId });
      if (!s) {
        s = this._default(guildId);
        await this.collection().insertOne(s);
      }
      return s;
    } catch (error) {
      return this._default(guildId);
    }
  },

  async update(guildId, data, options = {}) {
    try {
      await this.collection().updateOne(
        { guild_id: guildId },
        { $set: data },
        { upsert: true }
      );
      if (!options.skipDashboardSync) {
        try {
          const { queueDashboardBridgeSync } = require("../dashboardBridgeSync");
          queueDashboardBridgeSync(null, {
            guildId,
            reason: options.dashboardSyncReason || "suggestSettings.update",
            delayMs: 1500,
          });
        } catch (syncError) {
          logError("suggestSettings.dashboardSync.update_queue", syncError, { guildId });
        }
      }
      return this.get(guildId);
    } catch (error) {
      return null;
    }
  },
};

const counters = {
  collection() { return getDB().collection("counters"); },

  async next(guildId, name) {
    try {
      const result = await this.collection().findOneAndUpdate(
        { guild_id: guildId, name },
        {
          $inc: { seq: 1 },
          $setOnInsert: { created_at: now() },
        },
        { upsert: true, returnDocument: "after" }
      );

      return result?.seq || 1;
    } catch (error) {
      logError("counters.next", error, { guildId, name });
      return 1;
    }
  },
};

const suggestions = {
  collection() { return getDB().collection("suggestions"); },
  
  async create(guildId, userId, text, messageId, channelId) {
    try {
      const num = await counters.next(guildId, "suggestions");
      
      const suggestion = {
        _id: new ObjectId(),
        num,
        guild_id: guildId,
        user_id: userId,
        text: sanitizeString(text, 1000),
        title: null,
        description: null,
        message_id: messageId,
        channel_id: channelId,
        thread_id: null,
        status: "pending",
        upvotes: [],
        downvotes: [],
        staff_comment: null,
        reviewed_by: null,
        created_at: now()
      };
      
      await this.collection().insertOne(suggestion);
      return suggestion;
    } catch (error) {
      logError("suggestions.create", error, { guildId, userId });
      throw error;
    }
  },

  // Nueva función para crear sugerencias con título y descripción (para Modal)
  async createWithDetails(guildId, userId, title, description, messageId, channelId) {
    try {
      const num = await counters.next(guildId, "suggestions");
      
      const suggestion = {
        _id: new ObjectId(),
        num,
        guild_id: guildId,
        user_id: userId,
        text: title || description || "", // Mantener compatibility con campo original
        title: sanitizeString(title, 200),
        description: sanitizeString(description, 2000),
        message_id: messageId,
        channel_id: channelId,
        thread_id: null,
        status: "pending",
        upvotes: [],
        downvotes: [],
        staff_comment: null,
        reviewed_by: null,
        created_at: now()
      };
      
      await this.collection().insertOne(suggestion);
      return suggestion;
    } catch (error) {
      logError("suggestions.createWithDetails", error, { guildId, userId, title });
      throw error;
    }
  },

  async getByMessage(messageId) {
    try {
      return await this.collection().findOne({ message_id: messageId }) || null;
    } catch (error) {
      return null;
    }
  },

  async vote(id, userId, type) {
    try {
      const suggestionId = new ObjectId(id);
      if (type !== "up" && type !== "down") return null;

      const isUp = type === "up";
      const voteField = isUp ? "upvotes" : "downvotes";
      const oppositeField = isUp ? "downvotes" : "upvotes";

      const result = await this.collection().updateOne(
        { _id: suggestionId },
        [
          {
            $set: {
              [oppositeField]: {
                $filter: {
                  input: `$${oppositeField}`,
                  as: "v",
                  cond: { $ne: ["$$v", userId] },
                },
              },
              [voteField]: {
                $let: {
                  vars: {
                    withoutUser: {
                      $filter: {
                        input: `$${voteField}`,
                        as: "v",
                        cond: { $ne: ["$$v", userId] },
                      },
                    },
                    hasVote: { $in: [userId, `$${voteField}`] },
                  },
                  in: {
                    $cond: [
                      "$$hasVote",
                      "$$withoutUser",
                      { $concatArrays: ["$$withoutUser", [userId]] },
                    ],
                  },
                },
              },
            },
          },
        ]
      );

      if (!result.matchedCount) return null;
      return await this.collection().findOne({ _id: suggestionId });
    } catch (error) {
      logError("suggestions.vote", error, { id, userId, type });
      return null;
    }
  },

  async setStatus(id, status, reviewedBy, comment = null) {
    try {
      await this.collection().updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status,
            reviewed_by: reviewedBy,
            staff_comment: sanitizeString(comment, 500),
            reviewed_at: now()
          }
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  },

  async getStats(guildId) {
    try {
      const all = await this.collection()
        .find({ guild_id: guildId })
        .toArray();
      
      return {
        total: all.length,
        pending: all.filter(s => s.status === "pending").length,
        approved: all.filter(s => s.status === "approved").length,
        rejected: all.filter(s => s.status === "rejected").length
      };
    } catch (error) {
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  },
};

module.exports = { suggestSettings, suggestions };
