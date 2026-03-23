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

const autoResponses = {
  collection() { return getDB().collection("autoResponses"); },
  
  async create(guildId, trigger, response, createdBy) {
    try {
      validateInput(trigger, "string", { required: true, maxLength: 100 });
      validateInput(response, "string", { required: true, maxLength: 2000 });
      const normalizedTrigger = trigger.toLowerCase().trim();
      const sanitizedResponse = sanitizeString(response, 2000);
      const nowDate = now();

      // Verificar si ya existe
      const existing = await this.collection().findOne({ guild_id: guildId, trigger: normalizedTrigger });
      if (existing) {
        // Actualizar existente
        await this.collection().updateOne(
          { _id: existing._id },
          { $set: { response: sanitizedResponse, updated_by: createdBy, updated_at: nowDate } }
        );
        clearAutoResponsesCache(guildId);
        return { ...existing, response: sanitizedResponse, updated_by: createdBy, updated_at: nowDate };
      }
      
      const entry = {
        _id: new ObjectId(),
        guild_id: guildId,
        trigger: normalizedTrigger,
        response: sanitizedResponse,
        created_by: createdBy,
        created_at: nowDate,
        uses: 0,
        enabled: true
      };
      
      await this.collection().insertOne(entry);
      clearAutoResponsesCache(guildId);
      return entry;
    } catch (error) {
      logError("autoResponses.create", error, { guildId, trigger });
      throw error;
    }
  },

  async get(guildId, trigger) {
    try {
      return await this.collection().findOne({ 
        guild_id: guildId, 
        trigger: trigger.toLowerCase(),
        enabled: true 
      }) || null;
    } catch (error) {
      return null;
    }
  },

  async match(guildId, message) {
    try {
      if (!message) return null;

      const msgLower = message.toLowerCase().trim();
      const exact = await this.collection().findOne({
        guild_id: guildId,
        enabled: true,
        trigger: msgLower,
      });
      if (exact) return exact;

      const all = await this.getEnabled(guildId, { useCache: true });
      for (const ar of all) {
        if (msgLower.includes(ar.trigger)) {
          return ar;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  },

  async use(guildId, trigger) {
    try {
      await this.collection().updateOne(
        { guild_id: guildId, trigger: trigger.toLowerCase() },
        { $inc: { uses: 1 } }
      );
    } catch (error) {
      logError("autoResponses.use", error, { guildId, trigger });
    }
  },

  async toggle(guildId, trigger) {
    try {
      const ar = await this.collection().findOne({ guild_id: guildId, trigger: trigger.toLowerCase() });
      if (!ar) return null;
      
      const newEnabled = !ar.enabled;
      await this.collection().updateOne(
        { _id: ar._id },
        { $set: { enabled: newEnabled } }
      );
      clearAutoResponsesCache(guildId);
      
      return { ...ar, enabled: newEnabled };
    } catch (error) {
      return null;
    }
  },

  async delete(guildId, trigger) {
    try {
      const result = await this.collection().deleteOne({ 
        guild_id: guildId, 
        trigger: trigger.toLowerCase() 
      });
      clearAutoResponsesCache(guildId);
      return result.deletedCount > 0;
    } catch (error) {
      return false;
    }
  },

  async getAll(guildId) {
    try {
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ uses: -1 })
        .toArray();
    } catch (error) {
      return [];
    }
  },

  async getEnabled(guildId, options = {}) {
    try {
      const { useCache = false } = options;
      if (useCache) {
        const cached = getAutoResponsesCache(guildId);
        if (cached) return cached;
      }

      const enabled = await this.collection()
        .find({ guild_id: guildId, enabled: true })
        .project({ _id: 1, guild_id: 1, trigger: 1, response: 1, created_by: 1, created_at: 1, uses: 1, enabled: 1 })
        .toArray();

      enabled.sort((a, b) => b.trigger.length - a.trigger.length);
      return useCache ? setAutoResponsesCache(guildId, enabled) : enabled;
    } catch (error) {
      return [];
    }
  },
};

// ─────────────────────────────────────────────────────
//   POLLS
// ─────────────────────────────────────────────────────

module.exports = { autoResponses };
