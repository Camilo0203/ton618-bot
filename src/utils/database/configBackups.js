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

const configBackups = {
  collection() { return getDB().collection("configBackups"); },

  _retention() {
    const value = Number(process.env.CONFIG_BACKUP_RETENTION || 20);
    if (!Number.isFinite(value) || value <= 0) return 20;
    return Math.max(1, Math.min(200, Math.floor(value)));
  },

  async cleanupGuild(guildId, retention = null) {
    try {
      validateInput(guildId, "string", { required: true });
      const keep = retention === null ? this._retention() : Math.max(1, Math.floor(Number(retention) || 1));
      const overflow = await this.collection()
        .find({ guild_id: guildId })
        .sort({ created_at: -1 })
        .skip(keep)
        .project({ _id: 1 })
        .toArray();

      if (!overflow.length) return 0;
      const result = await this.collection().deleteMany({
        _id: { $in: overflow.map((item) => item._id) },
      });
      return Number(result?.deletedCount || 0);
    } catch (error) {
      logError("configBackups.cleanupGuild", error, { guildId, retention });
      return 0;
    }
  },

  async cleanupAll(retention = null) {
    try {
      const keep = retention === null ? this._retention() : Math.max(1, Math.floor(Number(retention) || 1));
      const guilds = await this.collection().distinct("guild_id");
      let deleted = 0;
      for (const guildId of guilds) {
        deleted += await this.cleanupGuild(guildId, keep);
      }
      return deleted;
    } catch (error) {
      logError("configBackups.cleanupAll", error, { retention });
      return 0;
    }
  },

  async create(guildId, payload, meta = {}) {
    try {
      validateInput(guildId, "string", { required: true });
      if (!payload || typeof payload !== "object") {
        throw new Error("Payload de backup invalido");
      }

      const backup = {
        backup_id: uid(),
        guild_id: guildId,
        payload,
        schema_version: Number(payload.schema_version || 1),
        exported_at: payload.exported_at || new Date().toISOString(),
        source: meta.source || "manual",
        actor_id: meta.actorId || null,
        created_at: now(),
      };

      await this.collection().insertOne(backup);
      await this.cleanupGuild(guildId);

      return backup;
    } catch (error) {
      logError("configBackups.create", error, { guildId });
      return null;
    }
  },

  async listRecent(guildId, limit = 10) {
    try {
      const safeLimit = Math.max(1, Math.min(50, Number(limit) || 10));
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ created_at: -1 })
        .limit(safeLimit)
        .toArray();
    } catch (error) {
      logError("configBackups.listRecent", error, { guildId, limit });
      return [];
    }
  },

  async getById(guildId, backupId) {
    try {
      return await this.collection().findOne({ guild_id: guildId, backup_id: backupId }) || null;
    } catch (error) {
      logError("configBackups.getById", error, { guildId, backupId });
      return null;
    }
  },
};

module.exports = { configBackups };
