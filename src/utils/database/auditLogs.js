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

const auditLogs = {
  collection() { return getDB().collection("auditLogs"); },

  async add(entry = {}) {
    try {
      const guildId = String(entry.guild_id || entry.guildId || "").trim();
      if (!guildId) return null;

      const actorIdRaw = entry.actor_id || entry.actorId || null;
      const targetIdRaw = entry.target_id || entry.targetId || null;
      const actionRaw = entry.action || "unknown";
      const kindRaw = entry.kind || "unknown";
      const statusRaw = entry.status || "ok";
      const sourceRaw = entry.source || "interaction";

      const doc = {
        _id: new ObjectId(),
        guild_id: guildId,
        actor_id: actorIdRaw ? String(actorIdRaw) : null,
        target_id: targetIdRaw ? String(targetIdRaw) : null,
        action: sanitizeString(String(actionRaw), 120),
        kind: sanitizeString(String(kindRaw), 40),
        status: sanitizeString(String(statusRaw), 40),
        source: sanitizeString(String(sourceRaw), 80),
        metadata: entry.metadata && typeof entry.metadata === "object" ? entry.metadata : {},
        created_at: now(),
      };

      await this.collection().insertOne(doc);
      return doc;
    } catch (error) {
      const message = error?.message || "";
      if (!message.includes("Base de datos no conectada")) {
        logError("auditLogs.add", error, { kind: entry?.kind, action: entry?.action });
      }
      return null;
    }
  },

  async listByGuild(guildId, options = {}) {
    try {
      validateInput(guildId, "string", { required: true });
      const safeLimit = Math.max(1, Math.min(200, Number(options.limit) || 50));
      const query = { guild_id: guildId };

      if (options.actorId) query.actor_id = String(options.actorId);
      if (options.kind) query.kind = String(options.kind);
      if (options.action) query.action = String(options.action);
      if (options.status) query.status = String(options.status);

      return await this.collection()
        .find(query)
        .sort({ created_at: -1 })
        .limit(safeLimit)
        .toArray();
    } catch (error) {
      logError("auditLogs.listByGuild", error, { guildId, options });
      return [];
    }
  },

  async cleanupOlderThan(days = 90) {
    try {
      const safeDays = Math.max(1, Math.min(365, Number(days) || 90));
      const cutoff = new Date(Date.now() - safeDays * 24 * 60 * 60 * 1000);
      const result = await this.collection().deleteMany({ created_at: { $lt: cutoff } });
      return Number(result?.deletedCount || 0);
    } catch (error) {
      logError("auditLogs.cleanupOlderThan", error, { days });
      return 0;
    }
  },
};

module.exports = { auditLogs };
