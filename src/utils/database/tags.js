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

const tags = {
  collection() { return getDB().collection("tags"); },
  
  async create(guildId, name, content, createdBy) {
    try {
      const existing = await this.collection().findOne({ guild_id: guildId, name });
      if (existing) throw new Error("Ya existe");
      
      const tag = {
        _id: new ObjectId(),
        guild_id: guildId,
        name: sanitizeString(name, 50),
        content: sanitizeString(content, 2000),
        created_by: createdBy,
        uses: 0,
        created_at: now()
      };
      
      await this.collection().insertOne(tag);
      return tag;
    } catch (error) {
      logError("tags.create", error, { guildId, name });
      throw error;
    }
  },

  async get(guildId, name) {
    try {
      return await this.collection().findOne({ guild_id: guildId, name }) || null;
    } catch (error) {
      return null;
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

  async use(guildId, name) {
    try {
      await this.collection().updateOne(
        { guild_id: guildId, name },
        { $inc: { uses: 1 } }
      );
    } catch (error) {}
  },

  async update(guildId, name, content) {
    try {
      const result = await this.collection().findOneAndUpdate(
        { guild_id: guildId, name },
        { $set: { content: sanitizeString(content, 2000) } },
        { returnDocument: "after" }
      );
      return result;
    } catch (error) {
      return null;
    }
  },

  async delete(guildId, name) {
    try {
      await this.collection().deleteOne({ guild_id: guildId, name });
    } catch (error) {}
  },
};

module.exports = { tags };
