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

const notes = {
  collection() { return getDB().collection("notes"); },
  
  async add(ticketId, staffId, note, guildId = null) {
    try {
      validateInput(ticketId, "string", { required: true });
      validateInput(note, "string", { required: true, maxLength: 500 });
      if (guildId !== null) {
        validateInput(guildId, "string", { required: true, maxLength: 50 });
      }
      
      const entry = {
        _id: new ObjectId(),
        guild_id: guildId || null,
        ticket_id: ticketId,
        staff_id: staffId,
        note: sanitizeString(note, 500),
        created_at: now()
      };
      
      await this.collection().insertOne(entry);
      return entry;
    } catch (error) {
      logError("notes.add", error, { ticketId, staffId, guildId });
      throw error;
    }
  },

  async get(ticketId, guildId = null) {
    try {
      const query = { ticket_id: ticketId };
      if (guildId !== null) {
        query.guild_id = guildId;
      }

      return await this.collection()
        .find(query)
        .sort({ created_at: 1 })
        .toArray();
    } catch (error) {
      logError("notes.get", error, { ticketId, guildId });
      return [];
    }
  },

  async delete(id) {
    try {
      await this.collection().deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      logError("notes.delete", error, { id });
    }
  },

  async clear(ticketId, guildId = null) {
    try {
      const query = { ticket_id: ticketId };
      if (guildId !== null) {
        query.guild_id = guildId;
      }
      await this.collection().deleteMany(query);
    } catch (error) {
      logError("notes.clear", error, { ticketId, guildId });
    }
  },
};

// ─────────────────────────────────────────────────────
//   BLACKLIST
// ─────────────────────────────────────────────────────

module.exports = { notes };
