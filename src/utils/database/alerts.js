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

const alerts = {
  collection() { return getDB().collection("alerts"); },

  async add(guildId, platform, channelIdOrName, discordChannelId) {
    try {
      validateInput(guildId, "string", { required: true });
      validateInput(platform, "string", { required: true });
      validateInput(channelIdOrName, "string", { required: true });
      validateInput(discordChannelId, "string", { required: true });

      // Verificar si ya existe una alerta para este canal/plataforma en este servidor
      const existing = await this.collection().findOne({
        guild_id: guildId,
        platform: platform.toLowerCase(),
        channel_id: channelIdOrName
      });

      if (existing) {
        throw new Error("Ya existe una alerta para este canal en esta plataforma");
      }

      const alert = {
        _id: new ObjectId(),
        guild_id: guildId,
        platform: platform.toLowerCase(),
        channel_id: channelIdOrName,
        discord_channel_id: discordChannelId,
        last_id: null,
        last_notified: null,
        created_at: now(),
        created_by: null,
        enabled: true
      };

      await this.collection().insertOne(alert);
      return alert;
    } catch (error) {
      logError("alerts.add", error, { guildId, platform, channelIdOrName });
      throw error;
    }
  },

  async remove(alertId) {
    try {
      const result = await this.collection().deleteOne({ _id: new ObjectId(alertId) });
      return result.deletedCount > 0;
    } catch (error) {
      logError("alerts.remove", error, { alertId });
      return false;
    }
  },

  async getAll() {
    try {
      return await this.collection().find({ enabled: true }).toArray();
    } catch (error) {
      logError("alerts.getAll", error);
      return [];
    }
  },

  async getByGuild(guildId) {
    try {
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      logError("alerts.getByGuild", error, { guildId });
      return [];
    }
  },

  async updateLastId(alertId, newLastId) {
    try {
      await this.collection().updateOne(
        { _id: new ObjectId(alertId) },
        { $set: { last_id: newLastId, last_notified: now() } }
      );
      return true;
    } catch (error) {
      logError("alerts.updateLastId", error, { alertId, newLastId });
      return false;
    }
  },

  async getById(alertId) {
    try {
      return await this.collection().findOne({ _id: new ObjectId(alertId) }) || null;
    } catch (error) {
      logError("alerts.getById", error, { alertId });
      return null;
    }
  },

  async toggle(alertId) {
    try {
      const alert = await this.collection().findOne({ _id: new ObjectId(alertId) });
      if (!alert) return null;

      const newEnabled = !alert.enabled;
      await this.collection().updateOne(
        { _id: new ObjectId(alertId) },
        { $set: { enabled: newEnabled } }
      );

      return { ...alert, enabled: newEnabled };
    } catch (error) {
      logError("alerts.toggle", error, { alertId });
      return null;
    }
  }
};

// Exportar todo

module.exports = { alerts };
