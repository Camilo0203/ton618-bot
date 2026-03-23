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

const ticketEvents = {
  collection() { return getDB().collection("ticketEvents"); },

  async add(data) {
    try {
      validateInput(data.guild_id, "string", { required: true, maxLength: 50 });
      validateInput(data.ticket_id, "string", { required: true, maxLength: 20 });
      validateInput(data.event_type, "string", { required: true, maxLength: 80 });
      validateInput(data.title, "string", { required: true, maxLength: 120 });
      validateInput(data.description, "string", { required: true, maxLength: 1000 });

      const visibility = ["public", "internal", "system"].includes(String(data.visibility || ""))
        ? String(data.visibility)
        : "system";
      const actorKind = ["customer", "staff", "bot", "system"].includes(String(data.actor_kind || ""))
        ? String(data.actor_kind)
        : "system";

      const entry = {
        _id: new ObjectId(),
        event_id: data.event_id || uid(),
        guild_id: data.guild_id,
        ticket_id: data.ticket_id,
        channel_id: data.channel_id || null,
        actor_id: data.actor_id || null,
        actor_kind: actorKind,
        actor_label: sanitizeString(data.actor_label || "", 120) || null,
        event_type: sanitizeString(data.event_type, 80),
        visibility,
        title: sanitizeString(data.title, 120),
        description: sanitizeString(data.description, 1000),
        metadata: data.metadata && typeof data.metadata === "object" && !Array.isArray(data.metadata)
          ? data.metadata
          : {},
        created_at: now(),
      };

      await this.collection().insertOne(entry);
      return entry;
    } catch (error) {
      logError("ticketEvents.add", error, { data });
      return null;
    }
  },

  async listByGuild(guildId, limit = 300) {
    try {
      const safeLimit = Math.max(1, Math.min(1000, Number(limit) || 300));
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ created_at: -1 })
        .limit(safeLimit)
        .toArray();
    } catch (error) {
      logError("ticketEvents.listByGuild", error, { guildId, limit });
      return [];
    }
  },

  async listByTicket(ticketId, limit = 120) {
    try {
      const safeLimit = Math.max(1, Math.min(500, Number(limit) || 120));
      return await this.collection()
        .find({ ticket_id: ticketId })
        .sort({ created_at: -1 })
        .limit(safeLimit)
        .toArray();
    } catch (error) {
      logError("ticketEvents.listByTicket", error, { ticketId, limit });
      return [];
    }
  },

  async clearByTicket(ticketId) {
    try {
      await this.collection().deleteMany({ ticket_id: ticketId });
      return true;
    } catch (error) {
      logError("ticketEvents.clearByTicket", error, { ticketId });
      return false;
    }
  },
};

module.exports = { ticketEvents };
