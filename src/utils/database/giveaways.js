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

const giveaways = {
  collection() { return getDB().collection("giveaways"); },

  _normalize(doc) {
    if (!doc) return null;
    return {
      ...doc,
      id: doc._id?.toString() || doc.id,
      participants: Array.isArray(doc.participants) ? doc.participants : [],
    };
  },

  async create(data) {
    try {
      const entry = {
        _id: new ObjectId(),
        message_id: data.message_id,
        channel_id: data.channel_id,
        guild_id: data.guild_id,
        prize: sanitizeString(data.prize, 500),
        description: data.description ? sanitizeString(data.description, 1000) : null,
        winners_count: Number(data.winners_count || 1),
        created_by: data.created_by,
        host_user_id: data.host_user_id || data.created_by,
        emoji: data.emoji || "🎉",
        requirements: data.requirements || { type: "none" },
        created_at: now(),
        end_at: data.end_at,
        ended: false,
        ended_at: null,
        participants: [],
        winner_ids: [],
      };
      await this.collection().insertOne(entry);
      return this._normalize(entry);
    } catch (error) {
      logError("giveaways.create", error, { data });
      throw error;
    }
  },

  async getByMessage(messageId) {
    try {
      const row = await this.collection().findOne({ message_id: messageId });
      return this._normalize(row);
    } catch (error) {
      logError("giveaways.getByMessage", error, { messageId });
      return null;
    }
  },

  async addParticipant(messageId, userId) {
    try {
      const result = await this.collection().findOneAndUpdate(
        { message_id: messageId, ended: false },
        { $addToSet: { participants: userId } },
        { returnDocument: "after" }
      );
      return this._normalize(result);
    } catch (error) {
      logError("giveaways.addParticipant", error, { messageId, userId });
      return null;
    }
  },

  async markEnded(messageId, winnerIds = []) {
    try {
      const result = await this.collection().findOneAndUpdate(
        { message_id: messageId },
        { $set: { ended: true, ended_at: now(), winner_ids: winnerIds } },
        { returnDocument: "after" }
      );
      return this._normalize(result);
    } catch (error) {
      logError("giveaways.markEnded", error, { messageId, winnerIds });
      return null;
    }
  },

  async updateWinners(messageId, winnerIds = []) {
    try {
      const result = await this.collection().findOneAndUpdate(
        { message_id: messageId },
        { $set: { winner_ids: winnerIds, ended_at: now() } },
        { returnDocument: "after" }
      );
      return this._normalize(result);
    } catch (error) {
      logError("giveaways.updateWinners", error, { messageId, winnerIds });
      return null;
    }
  },

  async getExpiredActive(limit = 50) {
    try {
      const nowIso = now();
      const rows = await this.collection()
        .find({ ended: false, end_at: { $lte: nowIso } })
        .sort({ end_at: 1 })
        .limit(limit)
        .toArray();
      return rows.map(r => this._normalize(r));
    } catch (error) {
      logError("giveaways.getExpiredActive", error);
      return [];
    }
  },

  async getActive(limit = 200) {
    try {
      const rows = await this.collection()
        .find({ ended: false })
        .sort({ end_at: 1 })
        .limit(limit)
        .toArray();
      return rows.map(r => this._normalize(r));
    } catch (error) {
      logError("giveaways.getActive", error);
      return [];
    }
  },

  async removeParticipant(messageId, userId) {
    try {
      const result = await this.collection().findOneAndUpdate(
        { message_id: messageId, ended: false },
        { $pull: { participants: userId } },
        { returnDocument: "after" }
      );
      return this._normalize(result);
    } catch (error) {
      logError("giveaways.removeParticipant", error, { messageId, userId });
      return null;
    }
  },

  async cancel(messageId) {
    try {
      const result = await this.collection().findOneAndUpdate(
        { message_id: messageId },
        { $set: { ended: true, ended_at: now(), cancelled: true } },
        { returnDocument: "after" }
      );
      return this._normalize(result);
    } catch (error) {
      logError("giveaways.cancel", error, { messageId });
      return null;
    }
  },

  async getByGuild(guildId, includeEnded = false) {
    try {
      const query = { guild_id: guildId };
      if (!includeEnded) {
        query.ended = false;
      }
      const rows = await this.collection()
        .find(query)
        .sort({ created_at: -1 })
        .limit(50)
        .toArray();
      return rows.map(r => this._normalize(r));
    } catch (error) {
      logError("giveaways.getByGuild", error, { guildId });
      return [];
    }
  },
};

// ─────────────────────────────────────────────────────
//   AUTO RESPONSES
// ─────────────────────────────────────────────────────

module.exports = { giveaways };
