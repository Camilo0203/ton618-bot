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
  
  async add(ticketId, staffId, note) {
    try {
      validateInput(ticketId, "string", { required: true });
      validateInput(note, "string", { required: true, maxLength: 500 });
      
      const entry = {
        _id: new ObjectId(),
        ticket_id: ticketId,
        staff_id: staffId,
        note: sanitizeString(note, 500),
        created_at: now()
      };
      
      await this.collection().insertOne(entry);
      return entry;
    } catch (error) {
      logError("notes.add", error, { ticketId, staffId });
      throw error;
    }
  },

  async get(ticketId) {
    try {
      return await this.collection()
        .find({ ticket_id: ticketId })
        .sort({ created_at: 1 })
        .toArray();
    } catch (error) {
      logError("notes.get", error, { ticketId });
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

  async clear(ticketId) {
    try {
      await this.collection().deleteMany({ ticket_id: ticketId });
    } catch (error) {
      logError("notes.clear", error, { ticketId });
    }
  },
};

// ─────────────────────────────────────────────────────
//   BLACKLIST
// ─────────────────────────────────────────────────────

module.exports = { notes };
