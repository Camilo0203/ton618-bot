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

const modActions = {
  collection() { return getDB().collection("mod_actions"); },

  async record(data) {
    try {
      validateInput(data.guild_id, "string", { required: true });
      validateInput(data.user_id, "string", { required: true });
      validateInput(data.moderator_id, "string", { required: true });
      validateInput(data.action_type, "string", { required: true });

      const entry = {
        _id: new ObjectId(),
        guild_id: data.guild_id,
        user_id: data.user_id,
        moderator_id: data.moderator_id,
        action_type: data.action_type, // ban, unban, kick, timeout, mute, unmute, warn, purge
        reason: sanitizeString(data.reason || "No reason provided", 500),
        duration: data.duration || null,
        metadata: data.metadata || {},
        created_at: now(),
      };

      await this.collection().insertOne(entry);
      return entry;
    } catch (error) {
      logError("modActions.record", error, { data });
      throw error;
    }
  },

  async getHistory(guildId, userId, limit = 50) {
    try {
      const rows = await this.collection()
        .find({ guild_id: guildId, user_id: userId })
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
      return rows;
    } catch (error) {
      logError("modActions.getHistory", error, { guildId, userId });
      return [];
    }
  },

  async getRecentActions(guildId, limit = 100) {
    try {
      const rows = await this.collection()
        .find({ guild_id: guildId })
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
      return rows;
    } catch (error) {
      logError("modActions.getRecentActions", error, { guildId });
      return [];
    }
  },
};

const tempBans = {
  collection() { return getDB().collection("temp_bans"); },

  async add(guildId, userId, expiresAt, reason, bannedBy) {
    try {
      validateInput(guildId, "string", { required: true });
      validateInput(userId, "string", { required: true });

      const entry = {
        _id: new ObjectId(),
        guild_id: guildId,
        user_id: userId,
        banned_by: bannedBy,
        reason: sanitizeString(reason || "No reason provided", 500),
        created_at: now(),
        expires_at: expiresAt,
        active: true,
      };

      await this.collection().insertOne(entry);
      return entry;
    } catch (error) {
      logError("tempBans.add", error, { guildId, userId });
      throw error;
    }
  },

  async remove(guildId, userId) {
    try {
      const result = await this.collection().updateOne(
        { guild_id: guildId, user_id: userId, active: true },
        { $set: { active: false, unbanned_at: now() } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      logError("tempBans.remove", error, { guildId, userId });
      return false;
    }
  },

  async getExpired(limit = 50) {
    try {
      const nowIso = now();
      const rows = await this.collection()
        .find({ active: true, expires_at: { $lte: nowIso } })
        .sort({ expires_at: 1 })
        .limit(limit)
        .toArray();
      return rows;
    } catch (error) {
      logError("tempBans.getExpired", error);
      return [];
    }
  },

  async isActive(guildId, userId) {
    try {
      const row = await this.collection().findOne({
        guild_id: guildId,
        user_id: userId,
        active: true,
      });
      return row !== null;
    } catch (error) {
      logError("tempBans.isActive", error, { guildId, userId });
      return false;
    }
  },
};

const mutes = {
  collection() { return getDB().collection("mutes"); },

  async add(guildId, userId, expiresAt, reason, mutedBy) {
    try {
      validateInput(guildId, "string", { required: true });
      validateInput(userId, "string", { required: true });

      const entry = {
        _id: new ObjectId(),
        guild_id: guildId,
        user_id: userId,
        muted_by: mutedBy,
        reason: sanitizeString(reason || "No reason provided", 500),
        created_at: now(),
        expires_at: expiresAt,
        active: true,
      };

      await this.collection().insertOne(entry);
      return entry;
    } catch (error) {
      logError("mutes.add", error, { guildId, userId });
      throw error;
    }
  },

  async remove(guildId, userId) {
    try {
      const result = await this.collection().updateOne(
        { guild_id: guildId, user_id: userId, active: true },
        { $set: { active: false, unmuted_at: now() } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      logError("mutes.remove", error, { guildId, userId });
      return false;
    }
  },

  async getExpired(limit = 50) {
    try {
      const nowIso = now();
      const rows = await this.collection()
        .find({ active: true, expires_at: { $lte: nowIso } })
        .sort({ expires_at: 1 })
        .limit(limit)
        .toArray();
      return rows;
    } catch (error) {
      logError("mutes.getExpired", error);
      return [];
    }
  },

  async isActive(guildId, userId) {
    try {
      const row = await this.collection().findOne({
        guild_id: guildId,
        user_id: userId,
        active: true,
      });
      return row !== null;
    } catch (error) {
      logError("mutes.isActive", error, { guildId, userId });
      return false;
    }
  },

  async getActive(guildId) {
    try {
      const rows = await this.collection()
        .find({ guild_id: guildId, active: true })
        .toArray();
      return rows;
    } catch (error) {
      logError("mutes.getActive", error, { guildId });
      return [];
    }
  },
};

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

module.exports = { blacklist, modlogSettings, warnings, modActions, tempBans, mutes };
