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

const levels = {
  collection() { return getDB().collection("levels"); },
  
  _key(guildId, userId) { return `${guildId}::${userId}`; },
  
  xpForLevel(level) { return Math.floor(100 * Math.pow(level, 1.5) + 100); },
  
  levelFromXp(totalXp) {
    let level = 0;
    let xpNeeded = 0;
    while (totalXp >= xpNeeded + this.xpForLevel(level + 1)) {
      xpNeeded += this.xpForLevel(level + 1);
      level++;
    }
    return level;
  },

  async addXp(guildId, userId, amount) {
    try {
      const key = this._key(guildId, userId);
      const nowDate = now();
      const entry = await this.collection().findOneAndUpdate(
        { key },
        {
          $setOnInsert: {
            key,
            guild_id: guildId,
            user_id: userId,
            xp: 0,
            level: 0,
            total_xp: 0,
            last_xp_at: null,
            messages: 0,
          },
          $inc: { total_xp: amount, messages: 1 },
          $set: { last_xp_at: nowDate },
        },
        { upsert: true, returnDocument: "after" }
      );

      const totalXp = Number(entry?.total_xp) || 0;
      const previousLevel = Number(entry?.level) || 0;
      const newLevel = this.levelFromXp(totalXp);
      const leveled = newLevel > previousLevel;

      if (newLevel > previousLevel) {
        await this.collection().updateOne(
          { key, level: { $lt: newLevel } },
          { $set: { level: newLevel } }
        );
      }

      return { leveled, level: newLevel, total_xp: totalXp };
    } catch (error) {
      logError("levels.addXp", error, { guildId, userId, amount });
      return { leveled: false, level: 0, total_xp: 0 };
    }
  },

  async get(guildId, userId) {
    try {
      const key = this._key(guildId, userId);
      return await this.collection().findOne({ key }) || {
        guild_id: guildId,
        user_id: userId,
        xp: 0,
        level: 0,
        total_xp: 0,
        messages: 0
      };
    } catch (error) {
      logError("levels.get", error, { guildId, userId });
      return { level: 0, total_xp: 0 };
    }
  },

  async getLeaderboard(guildId, limit = 15) {
    try {
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ total_xp: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logError("levels.getLeaderboard", error, { guildId });
      return [];
    }
  },

  async getRank(guildId, userId) {
    try {
      const leaderboard = await this.getLeaderboard(guildId, 9999);
      const idx = leaderboard.findIndex(e => e.user_id === userId);
      return idx === -1 ? null : idx + 1;
    } catch (error) {
      logError("levels.getRank", error, { guildId, userId });
      return null;
    }
  },

  async setXp(guildId, userId, amount) {
    try {
      const key = this._key(guildId, userId);
      await this.collection().updateOne(
        { key },
        { 
          $set: { 
            total_xp: amount,
            level: this.levelFromXp(amount)
          }
        },
        { upsert: true }
      );
    } catch (error) {
      logError("levels.setXp", error, { guildId, userId, amount });
    }
  },

  async reset(guildId, userId) {
    try {
      const key = this._key(guildId, userId);
      await this.collection().deleteOne({ key });
    } catch (error) {
      logError("levels.reset", error, { guildId, userId });
    }
  },
};

// ─────────────────────────────────────────────────────
//   LEVEL SETTINGS
// ─────────────────────────────────────────────────────
const levelSettings = {
  collection() { return getDB().collection("levelSettings"); },
  
  _default(guildId) {
    return buildLevelSettingsDefaults(guildId);
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
      logError("levelSettings.get", error, { guildId });
      return this._default(guildId);
    }
  },

  async update(guildId, data) {
    try {
      await this.collection().updateOne(
        { guild_id: guildId },
        { $set: data },
        { upsert: true }
      );
      return this.get(guildId);
    } catch (error) {
      logError("levelSettings.update", error, { guildId, data });
      return null;
    }
  },
};

// ─────────────────────────────────────────────────────
//   REMINDERS
// ─────────────────────────────────────────────────────

module.exports = { levels, levelSettings };
