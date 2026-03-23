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

const welcomeSettings = {
  collection() { return getDB().collection("welcomeSettings"); },
  
  _default(guildId) {
    return buildWelcomeSettingsDefaults(guildId);
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
            reason: options.dashboardSyncReason || "welcomeSettings.update",
            delayMs: 1500,
          });
        } catch (syncError) {
          logError("welcomeSettings.dashboardSync.update_queue", syncError, { guildId });
        }
      }
      return this.get(guildId);
    } catch (error) {
      return null;
    }
  },
};

module.exports = { welcomeSettings };
