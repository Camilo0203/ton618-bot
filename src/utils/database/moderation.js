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

const blacklist = {
  collection() { return getDB().collection("blacklist"); },
  
  async add(userId, guildId, reason, addedBy) {
    try {
      validateInput(userId, "string", { required: true });
      validateInput(guildId, "string", { required: true });
      
      // Verificar si ya existe
      const existing = await this.collection().findOne({ user_id: userId, guild_id: guildId });
      if (existing) return;
      
      const entry = {
        _id: new ObjectId(),
        user_id: userId,
        guild_id: guildId,
        reason: sanitizeString(reason, 500),
        added_by: addedBy,
        added_at: now()
      };
      
      await this.collection().insertOne(entry);
    } catch (error) {
      logError("blacklist.add", error, { userId, guildId });
      throw error;
    }
  },

  async remove(userId, guildId) {
    try {
      const result = await this.collection().deleteOne({ user_id: userId, guild_id: guildId });
      return { changes: result.deletedCount };
    } catch (error) {
      logError("blacklist.remove", error, { userId, guildId });
      return { changes: 0 };
    }
  },

  async check(userId, guildId) {
    try {
      return await this.collection().findOne({ user_id: userId, guild_id: guildId }) || null;
    } catch (error) {
      logError("blacklist.check", error, { userId, guildId });
      return null;
    }
  },

  async getAll(guildId) {
    try {
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ added_at: -1 })
        .toArray();
    } catch (error) {
      logError("blacklist.getAll", error, { guildId });
      return [];
    }
  },
};

// ─────────────────────────────────────────────────────
//   SETTINGS
// ─────────────────────────────────────────────────────

const modlogSettings = {
  collection() { return getDB().collection("modlogSettings"); },
  
  _default(guildId) {
    return buildModlogSettingsDefaults(guildId);
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
            reason: options.dashboardSyncReason || "modlogSettings.update",
            delayMs: 1500,
          });
        } catch (syncError) {
          logError("modlogSettings.dashboardSync.update_queue", syncError, { guildId });
        }
      }
      return this.get(guildId);
    } catch (error) {
      return null;
    }
  },
};

const warnings = {
  collection() { return getDB().collection("warnings"); },

  async add(guildId, userId, reason, moderatorId) {
    try {
      validateInput(guildId, "string", { required: true });
      validateInput(userId, "string", { required: true });
      validateInput(reason, "string", { required: true, maxLength: 1000 });
      validateInput(moderatorId, "string", { required: true });

      const warning = {
        _id: new ObjectId(),
        guild_id: guildId,
        user_id: userId,
        reason: sanitizeString(reason, 1000),
        moderator_id: moderatorId,
        created_at: now()
      };

      await this.collection().insertOne(warning);
      return warning;
    } catch (error) {
      logError("warnings.add", error, { guildId, userId, moderatorId });
      throw error;
    }
  },

  async get(guildId, userId) {
    try {
      return await this.collection()
        .find({ guild_id: guildId, user_id: userId })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      logError("warnings.get", error, { guildId, userId });
      return [];
    }
  },

  async remove(warningId) {
    try {
      const result = await this.collection().deleteOne({ _id: new ObjectId(warningId) });
      return result.deletedCount > 0;
    } catch (error) {
      logError("warnings.remove", error, { warningId });
      return false;
    }
  },

  async getAll(guildId) {
    try {
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      logError("warnings.getAll", error, { guildId });
      return [];
    }
  },

  async getCount(guildId, userId) {
    try {
      return await this.collection().countDocuments({ guild_id: guildId, user_id: userId });
    } catch (error) {
      logError("warnings.getCount", error, { guildId, userId });
      return 0;
    }
  },
};

// ─────────────────────────────────────────────────────
//   ALERTS (YouTube & Twitch)
// ─────────────────────────────────────────────────────

module.exports = { blacklist, modlogSettings, warnings };
