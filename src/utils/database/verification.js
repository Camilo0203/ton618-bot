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

const verifSettings = {
  collection() { return getDB().collection("verifSettings"); },
  
  _default(guildId) {
    return buildVerifSettingsDefaults(guildId);
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
            reason: options.dashboardSyncReason || "verifSettings.update",
            delayMs: 1500,
          });
        } catch (syncError) {
          logError("verifSettings.dashboardSync.update_queue", syncError, { guildId });
        }
      }
      return this.get(guildId);
    } catch (error) {
      return null;
    }
  },
};

const verifCodes = {
  collection() { return getDB().collection("verifCodes"); },
  
  async generate(userId, guildId) {
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expires_at = new Date(Date.now() + 10 * 60000);
      
      await this.collection().deleteMany({ user_id: userId, guild_id: guildId });
      await this.collection().insertOne({
        user_id: userId,
        guild_id: guildId,
        code,
        created_at: now(),
        expires_at
      });
      
      return code;
    } catch (error) {
      logError("verifCodes.generate", error, { userId, guildId });
      throw error;
    }
  },

  async verify(userId, guildId, inputCode) {
    try {
      const entry = await this.collection().findOne({ user_id: userId, guild_id: guildId });
      if (!entry) return { valid: false, reason: "no_code" };
      
      if (new Date(entry.expires_at) < new Date()) {
        await this.collection().deleteOne({ _id: entry._id });
        return { valid: false, reason: "expired" };
      }
      
      if (entry.code !== inputCode.toUpperCase().trim()) {
        return { valid: false, reason: "wrong" };
      }
      
      await this.collection().deleteOne({ _id: entry._id });
      return { valid: true };
    } catch (error) {
      logError("verifCodes.verify", error, { userId, guildId });
      return { valid: false, reason: "error" };
    }
  },

  async getActive(userId, guildId) {
    try {
      const entry = await this.collection().findOne({ 
        user_id: userId, 
        guild_id: guildId,
        $expr: { $gt: [{ $toDate: "$expires_at" }, new Date()] }
      });
      return entry ? entry.code : null;
    } catch (error) {
      return null;
    }
  },

  async cleanup() {
    try {
      await this.collection().deleteMany({
        $expr: { $lt: [{ $toDate: "$expires_at" }, new Date()] }
      });
    } catch (error) {}
  },
};

const verifLogs = {
  collection() { return getDB().collection("verifLogs"); },
  async add(guildId, userId, status, reason = null) {
    try { await this.collection().insertOne({ guild_id: guildId, user_id: userId, status, reason, created_at: now() }); } catch (error) {}
  },
  async getStats(guildId) {
    try {
      const all = await this.collection().find({ guild_id: guildId }).toArray();
      return { total: all.length, verified: all.filter(l => l.status === "verified").length, failed: all.filter(l => l.status === "failed").length, kicked: all.filter(l => l.status === "kicked").length };
    } catch(e) { return {total:0, verified:0, failed:0, kicked:0}; }
  },
  async getRecent(guildId, limit = 5) {
    try { return await this.collection().find({ guild_id: guildId }).sort({ created_at: -1 }).limit(limit).toArray(); } catch(e) { return []; }
  }
};

// ─────────────────────────────────────────────────────
//   WARNINGS
// ─────────────────────────────────────────────────────

module.exports = { verifSettings, verifCodes, verifLogs };
