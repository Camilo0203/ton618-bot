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

const settings = {
  collection() { return getDB().collection("settings"); },
  
  _default(guildId) {
    return buildSettingsDefaults(guildId, now);
  },

  async get(guildId) {
    try {
      const existing = await this.collection().findOne({ guild_id: guildId });

      if (!existing) {
        const created = sanitizeSettingsRecord(guildId, this._default(guildId));
        await this.collection().insertOne(created);
        return created;
      }

      const sanitized = sanitizeSettingsRecord(guildId, existing);
      if (hasSettingsDrift(existing, sanitized)) {
        await this.collection().updateOne(
          { guild_id: guildId },
          { $set: sanitized }
        );
      }

      return { ...existing, ...sanitized };
    } catch (error) {
      logError("settings.get", error, { guildId });
      return sanitizeSettingsRecord(guildId, this._default(guildId));
    }
  },

  async update(guildId, data, options = {}) {
    try {
      validateInput(guildId, "string", { required: true });

      const existing = await this.collection().findOne({ guild_id: guildId });
      const base = existing || this._default(guildId);
      const { sanitizedPatch, unknownKeys } = sanitizeSettingsPatch(guildId, base, data || {});

      if (unknownKeys.length > 0) {
        logError("settings.update.unknown_keys", new Error(`Claves ignoradas: ${unknownKeys.join(", ")}`), { guildId });
      }

      if (!existing) {
        const created = sanitizeSettingsRecord(guildId, { ...base, ...(data || {}) });
        await this.collection().insertOne(created);
        if (!options.skipDashboardSync) {
          try {
            const { hasDashboardRelevantChange, queueDashboardConfigExport } = require("../dashboardBridgeSync");
            if (hasDashboardRelevantChange(data || {})) {
              queueDashboardConfigExport(guildId, created, {
                reason: options.dashboardSyncReason || "settings.insert",
              });
            }
          } catch (syncError) {
            logError("settings.dashboardSync.insert_queue", syncError, { guildId });
          }
        }
        return created;
      }

      await this.collection().updateOne(
        { guild_id: guildId },
        { $set: sanitizedPatch }
      );

      const updated = await this.get(guildId);
      if (!options.skipDashboardSync) {
        try {
          const { hasDashboardRelevantChange, queueDashboardConfigExport } = require("../dashboardBridgeSync");
          if (hasDashboardRelevantChange(data || {})) {
            queueDashboardConfigExport(guildId, updated, {
              reason: options.dashboardSyncReason || "settings.update",
            });
          }
        } catch (syncError) {
          logError("settings.dashboardSync.update_queue", syncError, { guildId });
        }
      }

      return updated;
    } catch (error) {
      if (isDbUnavailableError(error)) throw toDbUnavailableError(error, "settings.update");
      logError("settings.update", error, { guildId, data });
      return null;
    }
  },

  async incrementCounter(guildId) {
    try {
      const defaultDoc = sanitizeSettingsRecord(guildId, this._default(guildId));
      const { ticket_counter, settings_schema_version, ...defaultDocWithoutCounter } = defaultDoc;
      const result = await this.collection().findOneAndUpdate(
        { guild_id: guildId },
        {
          $setOnInsert: defaultDocWithoutCounter,
          $inc: { ticket_counter: 1 },
          $set: { settings_schema_version: settings_schema_version ?? defaultDoc.settings_schema_version },
        },
        { upsert: true, returnDocument: "after" }
      );
      return result?.ticket_counter || 1;
    } catch (error) {
      if (isDbUnavailableError(error)) throw toDbUnavailableError(error, "settings.incrementCounter");
      logError("settings.incrementCounter", error, { guildId });
      throw error;
    }
  },
};

// ─────────────────────────────────────────────────────
//   STAFF STATS
// ─────────────────────────────────────────────────────

module.exports = { settings };
