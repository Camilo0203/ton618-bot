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

const cooldowns = {
  collection() { return getDB().collection("cooldowns"); },
  
  async set(userId, guildId) {
    try {
      await this.collection().deleteMany({ user_id: userId, guild_id: guildId });
      await this.collection().insertOne({
        user_id: userId,
        guild_id: guildId,
        last_ticket_at: now()
      });
    } catch (error) {}
  },

  async check(userId, guildId, minutes) {
    try {
      const entry = await this.collection().findOne({ user_id: userId, guild_id: guildId });
      if (!entry) return null;
      
      const diff = (Date.now() - new Date(entry.last_ticket_at).getTime()) / 60000;
      if (diff < minutes) return Math.ceil(minutes - diff);
      return null;
    } catch (error) {
      return null;
    }
  },
};

module.exports = { cooldowns };
