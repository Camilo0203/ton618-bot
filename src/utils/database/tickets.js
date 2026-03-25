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

const { ticketEvents } = require("./ticketEvents");

const tickets = {
  collection() { return getDB().collection("tickets"); },
  
  async create(data) {
    try {
      validateInput(data.channel_id, "string", { required: true, maxLength: 50 });
      validateInput(data.guild_id, "string", { required: true, maxLength: 50 });
      validateInput(data.user_id, "string", { required: true, maxLength: 50 });
      validateInput(data.category, "string", { maxLength: 100 });
      
      const ticket = {
        _id: new ObjectId(),
        ticket_id:            data.ticket_id,
        channel_id:           data.channel_id,
        guild_id:             data.guild_id,
        user_id:              data.user_id,
        user_tag:             data.user_tag || null,
        category:             data.category || "general",
        category_id:          data.category_id || null,
        status:               "open",
        workflow_status:      normalizeTicketWorkflowStatus(data.workflow_status, "new"),
        queue_type:           normalizeTicketQueueType(data.queue_type, inferTicketQueueType(data.category_id)),
        priority:             normalizeTicketPriority(data.priority, "normal"),
        claimed_by:           data.claimed_by || null,
        claimed_by_tag:       data.claimed_by_tag || null,
        status_label:         data.status_label || "Buscando Staff",
        claimed_at:           data.claimed_by ? now() : null,
        assigned_to:          data.assigned_to || null,
        assigned_to_tag:      data.assigned_to_tag || null,
        subject:              data.subject || null,
        created_at:           now(),
        updated_at:           now(),
        closed_at:            null,
        closed_by:            null,
        close_reason:         null,
        resolved_at:          null,
        last_activity:        now(),
        last_customer_message_at: now(),
        last_staff_message_at: null,
        message_count:        0,
        staff_message_count:  0,
        first_staff_response: null,
        auto_close_warned_at: null,
        sla_alerted_at: null,
        smart_ping_sent_at: null,
        sla_escalated_at: null,
        tags:                 normalizeTicketTags(data.tags),
        sla_state:            "healthy",
        rating:               null,
        csat_rating:          null,
        rating_comment:       null,
        csat_comment:         null,
        transcript_url:       null,
        answers:              data.answers || null,
        reopen_count:         0,
        reopened_at:          null,
        reopened_by:          null,
      };
      
      await this.collection().insertOne(ticket);
      return ticket;
    } catch (error) {
      if (isDbUnavailableError(error)) throw toDbUnavailableError(error, "tickets.create");
      logError("tickets.create", error, { data });
      throw error;
    }
  },

  async get(channelId) {
    try {
      return await this.collection().findOne({ channel_id: channelId }) || null;
    } catch (error) {
      logError("tickets.get", error, { channelId });
      return null;
    }
  },

  async getById(id, guildId = null) {
    try {
      const query = { ticket_id: id };
      if (guildId) query.guild_id = guildId;
      return await this.collection().findOne(query) || null;
    } catch (error) {
      logError("tickets.getById", error, { id, guildId });
      return null;
    }
  },

  async getByUser(userId, guildId, status = "open") {
    try {
      return await this.collection()
        .find({ user_id: userId, guild_id: guildId, status })
        .toArray();
    } catch (error) {
      logError("tickets.getByUser", error, { userId, guildId, status });
      return [];
    }
  },

  async countByUser(userId, guildId, status = "open") {
    try {
      return await this.collection().countDocuments({ user_id: userId, guild_id: guildId, status });
    } catch (error) {
      logError("tickets.countByUser", error, { userId, guildId, status });
      return 0;
    }
  },

  async getOpenReferencesByUser(userId, guildId, limit = 10) {
    try {
      const safeLimit = Math.max(1, Number(limit || 10));
      return await this.collection()
        .find(
          { user_id: userId, guild_id: guildId, status: "open" },
          { projection: { channel_id: 1, category: 1 } }
        )
        .sort({ created_at: -1 })
        .limit(safeLimit)
        .toArray();
    } catch (error) {
      logError("tickets.getOpenReferencesByUser", error, { userId, guildId, limit });
      return [];
    }
  },

  async getAllOpen(guildId) {
    try {
      return await this.collection()
        .find({ guild_id: guildId, status: "open" })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      logError("tickets.getAllOpen", error, { guildId });
      return [];
    }
  },

  async countOpenByGuild(guildId) {
    try {
      return await this.collection().countDocuments({ guild_id: guildId, status: "open" });
    } catch (error) {
      logError("tickets.countOpenByGuild", error, { guildId });
      return 0;
    }
  },

  async getAllByGuild(guildId) {
    try {
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      logError("tickets.getAllByGuild", error, { guildId });
      return [];
    }
  },

  async update(channelId, data) {
    try {
      validateInput(channelId, "string", { required: true });

      const patch = { ...data };
      const nowDate = now();

      if (Object.prototype.hasOwnProperty.call(patch, "workflow_status")) {
        patch.workflow_status = normalizeTicketWorkflowStatus(
          patch.workflow_status,
          "triage"
        );
      }

      if (Object.prototype.hasOwnProperty.call(patch, "queue_type")) {
        patch.queue_type = normalizeTicketQueueType(patch.queue_type);
      }

      if (Object.prototype.hasOwnProperty.call(patch, "priority")) {
        patch.priority = normalizeTicketPriority(patch.priority, "normal");
      }

      if (Object.prototype.hasOwnProperty.call(patch, "tags")) {
        patch.tags = normalizeTicketTags(patch.tags);
      }

      if (Object.prototype.hasOwnProperty.call(patch, "claimed_by")) {
        patch.claimed_at = patch.claimed_by ? nowDate : null;
      }

      if (Object.prototype.hasOwnProperty.call(patch, "assigned_to")) {
        patch.assigned_to = patch.assigned_to || null;
      }

      if (Object.prototype.hasOwnProperty.call(patch, "status_label")) {
        patch.status_label = sanitizeString(patch.status_label, 50);
      }

      if (Object.prototype.hasOwnProperty.call(patch, "rating")) {
        patch.csat_rating = patch.rating ?? null;
      }

      if (Object.prototype.hasOwnProperty.call(patch, "rating_comment")) {
        patch.csat_comment = patch.rating_comment ?? null;
      }
      
      const result = await this.collection().findOneAndUpdate(
        { channel_id: channelId },
        { $set: { ...patch, updated_at: nowDate, last_activity: nowDate } },
        { returnDocument: "after" }
      );
      return result;
    } catch (error) {
      if (isDbUnavailableError(error)) throw toDbUnavailableError(error, "tickets.update");
      logError("tickets.update", error, { channelId, data });
      return null;
    }
  },

  async close(channelId, closedBy, reason) {
    return this.update(channelId, {
      status: "closed",
      workflow_status: "closed",
      closed_at: now(),
      closed_by: closedBy,
      close_reason: sanitizeString(reason, 500),
      resolved_at: now(),
      auto_close_warned_at: null,
      sla_alerted_at: null,
      smart_ping_sent_at: null,
      sla_escalated_at: null,
      sla_state: "resolved",
    });
  },

  async reopen(channelId, reopenedBy) {
    const t = await this.get(channelId);
    if (!t) return null;
    
    return this.update(channelId, {
      status: "open",
      workflow_status: "triage",
      closed_at: null,
      closed_by: null,
      close_reason: null,
      resolved_at: null,
      reopened_at: now(),
      reopened_by: reopenedBy,
      reopen_count: (t.reopen_count || 0) + 1,
      auto_close_warned_at: null,
      sla_alerted_at: null,
      smart_ping_sent_at: null,
      sla_escalated_at: null,
      sla_state: "healthy",
    });
  },

  async incrementMessages(channelId, isStaff = false) {
    try {
      const nowDate = now();
      const update = {
        $inc: {
          message_count: 1,
          ...(isStaff ? { staff_message_count: 1 } : {}),
        },
        $set: {
          last_activity: nowDate,
          updated_at: nowDate,
          ...(isStaff
            ? {
                last_staff_message_at: nowDate,
                workflow_status: "waiting_user",
              }
            : {
                last_customer_message_at: nowDate,
                workflow_status: "waiting_staff",
              }),
        },
        $unset: {
          auto_close_warned_at: "",
          sla_alerted_at: "",
          smart_ping_sent_at: "",
          sla_escalated_at: "",
        },
      };

      await this.collection().updateOne({ channel_id: channelId }, update);

      if (isStaff) {
        await this.collection().updateOne(
          { channel_id: channelId, first_staff_response: null },
          { $set: { first_staff_response: nowDate, updated_at: nowDate } }
        );
      }
    } catch (error) {
      logError("tickets.incrementMessages", error, { channelId, isStaff });
    }
  },

  async markAutoCloseWarned(channelId) {
    try {
      await this.collection().updateOne(
        { channel_id: channelId, status: "open" },
        { $set: { auto_close_warned_at: now() } }
      );
      return true;
    } catch (error) {
      logError("tickets.markAutoCloseWarned", error, { channelId });
      return false;
    }
  },

  async markSlaAlerted(channelId) {
    try {
      await this.collection().updateOne(
        { channel_id: channelId, status: "open" },
        { $set: { sla_alerted_at: now() } }
      );
      return true;
    } catch (error) {
      logError("tickets.markSlaAlerted", error, { channelId });
      return false;
    }
  },

  async markSmartPingSent(channelId) {
    try {
      await this.collection().updateOne(
        { channel_id: channelId, status: "open" },
        { $set: { smart_ping_sent_at: now() } }
      );
      return true;
    } catch (error) {
      logError("tickets.markSmartPingSent", error, { channelId });
      return false;
    }
  },

  async markSlaEscalated(channelId) {
    try {
      await this.collection().updateOne(
        { channel_id: channelId, status: "open" },
        { $set: { sla_escalated_at: now() } }
      );
      return true;
    } catch (error) {
      logError("tickets.markSlaEscalated", error, { channelId });
      return false;
    }
  },

  async setRating(channelId, rating, comment = null) {
    return this.update(channelId, { 
      rating, 
      rating_comment: sanitizeString(comment, 500),
      csat_rating: rating,
      csat_comment: sanitizeString(comment, 500),
    });
  },

  async listWorkspaceByGuild(guildId, limit = 150) {
    try {
      const safeLimit = Math.max(1, Math.min(500, Number(limit) || 150));
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ status: 1, updated_at: -1, last_activity: -1, created_at: -1 })
        .limit(safeLimit)
        .toArray();
    } catch (error) {
      logError("tickets.listWorkspaceByGuild", error, { guildId, limit });
      return [];
    }
  },

  async addTag(channelId, tag) {
    const normalizedTag = sanitizeString(String(tag || ""), 40).toLowerCase();
    if (!normalizedTag) return null;

    try {
      await this.collection().updateOne(
        { channel_id: channelId },
        {
          $addToSet: { tags: normalizedTag },
          $set: { updated_at: now(), last_activity: now() },
        }
      );
      return this.get(channelId);
    } catch (error) {
      logError("tickets.addTag", error, { channelId, tag: normalizedTag });
      return null;
    }
  },

  async removeTag(channelId, tag) {
    const normalizedTag = sanitizeString(String(tag || ""), 40).toLowerCase();
    if (!normalizedTag) return null;

    try {
      await this.collection().updateOne(
        { channel_id: channelId },
        {
          $pull: { tags: normalizedTag },
          $set: { updated_at: now(), last_activity: now() },
        }
      );
      return this.get(channelId);
    } catch (error) {
      logError("tickets.removeTag", error, { channelId, tag: normalizedTag });
      return null;
    }
  },

  async getInactive(guildId, minutes) {
    try {
      const cutoff = new Date(Date.now() - minutes * 60000);
      const primary = await this.collection()
        .find({
          guild_id: guildId,
          status: "open",
          last_activity: { $lt: cutoff },
        })
        .toArray();

      const legacy = await this.collection()
        .find({
          guild_id: guildId,
          status: "open",
          last_activity: { $type: "string" },
        })
        .toArray();

      if (!legacy.length) return primary;

      const seenChannels = new Set(primary.map((ticket) => ticket.channel_id));
      for (const ticket of legacy) {
        const lastActivity = toValidDate(ticket.last_activity);
        if (!lastActivity || lastActivity >= cutoff) continue;
        if (seenChannels.has(ticket.channel_id)) continue;
        primary.push(ticket);
      }

      return primary;
    } catch (error) {
      logError("tickets.getInactive", error, { guildId, minutes });
      return [];
    }
  },

  async getWithoutStaffResponse(guildId, minutes) {
    try {
      const cutoff = new Date(Date.now() - minutes * 60000);
      const primary = await this.collection()
        .find({
          guild_id: guildId,
          status: "open",
          first_staff_response: null,
          created_at: { $lt: cutoff },
        })
        .toArray();

      const legacy = await this.collection()
        .find({
          guild_id: guildId,
          status: "open",
          first_staff_response: null,
          created_at: { $type: "string" },
        })
        .toArray();

      if (!legacy.length) return primary;

      const seenChannels = new Set(primary.map((ticket) => ticket.channel_id));
      for (const ticket of legacy) {
        const createdAt = toValidDate(ticket.created_at);
        if (!createdAt || createdAt >= cutoff) continue;
        if (seenChannels.has(ticket.channel_id)) continue;
        primary.push(ticket);
      }

      return primary;
    } catch (error) {
      logError("tickets.getWithoutStaffResponse", error, { guildId, minutes });
      return [];
    }
  },

  async getStats(guildId) {
    try {
      const pipeline = buildTicketStatsPipeline(guildId, new Date());
      const aggregated = await this.collection().aggregate(pipeline).toArray();
      return mapTicketStatsResult(aggregated);
    } catch (error) {
      logError("tickets.getStats", error, { guildId });
      return {
        total: 0,
        open: 0,
        closed: 0,
        openedToday: 0,
        closedToday: 0,
        openedWeek: 0,
        closedWeek: 0,
        avg_rating: null,
        topCategories: [],
      };
    }
  },

  async getOpenWithoutStaffResponse(guildId) {
    try {
      return await this.collection()
        .find({
          guild_id: guildId,
          status: "open",
          first_staff_response: null,
        })
        .toArray();
    } catch (error) {
      logError("tickets.getOpenWithoutStaffResponse", error, { guildId });
      return [];
    }
  },

  async getSlaMetrics(guildId, slaTotalMinutes = 0, guildSettings = null) {
    try {
      const all = await this.collection()
        .find({ guild_id: guildId })
        .project({
          category_id: 1,
          priority: 1,
          status: 1,
          created_at: 1,
          first_staff_response: 1,
          sla_escalated_at: 1,
        })
        .toArray();
      const resolver = guildSettings
        ? (ticket) => resolveTicketSlaMinutes(guildSettings, ticket, "alert")
        : null;
      return buildSlaMetrics(all, slaTotalMinutes, Date.now(), resolver);
    } catch (error) {
      logError("tickets.getSlaMetrics", error, { guildId, slaTotalMinutes });
      return {
        totalTickets: 0,
        openBreached: 0,
        escalatedOpen: 0,
        firstResponseCount: 0,
        firstResponseWithinSla: 0,
        avgFirstResponseMinutes: null,
        withinSlaPct: null,
      };
    }
  },

  async getDailySummary(guildId, options = {}) {
    try {
      const from = options.from instanceof Date ? options.from : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const to = options.to instanceof Date ? options.to : new Date();

      const [opened, closed, topStaff] = await Promise.all([
        this.collection().countDocuments({
          guild_id: guildId,
          created_at: { $gte: from, $lte: to },
        }),
        this.collection().countDocuments({
          guild_id: guildId,
          status: "closed",
          closed_at: { $gte: from, $lte: to },
        }),
        this.collection().aggregate([
          {
            $match: {
              guild_id: guildId,
              status: "closed",
              closed_at: { $gte: from, $lte: to },
              closed_by: { $ne: null },
            },
          },
          {
            $group: {
              _id: "$closed_by",
              closed: { $sum: 1 },
            },
          },
          { $sort: { closed: -1 } },
          { $limit: 5 },
        ]).toArray(),
      ]);

      return {
        opened,
        closed,
        topStaff: topStaff.map((item) => ({
          staff_id: item._id,
          closed: item.closed,
        })),
      };
    } catch (error) {
      logError("tickets.getDailySummary", error, { guildId });
      return { opened: 0, closed: 0, topStaff: [] };
    }
  },

  async listForAudit(guildId, filters = {}) {
    try {
      const query = { guild_id: guildId };
      if (filters.status && filters.status !== "all") {
        query.status = filters.status;
      }
      if (filters.priority) {
        query.priority = filters.priority;
      }
      if (filters.categoryId) {
        query.category_id = filters.categoryId;
      }
      if (filters.createdFrom || filters.createdTo) {
        query.created_at = {};
        if (filters.createdFrom) query.created_at.$gte = filters.createdFrom;
        if (filters.createdTo) query.created_at.$lte = filters.createdTo;
      }

      const limit = Math.max(1, Math.min(500, Number(filters.limit) || 100));
      return await this.collection()
        .find(query)
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logError("tickets.listForAudit", error, { guildId, filters });
      return [];
    }
  },

  async delete(channelId) {
    try {
      const ticket = await this.get(channelId);
      await this.collection().deleteOne({ channel_id: channelId });
      if (ticket?.ticket_id) {
        await ticketEvents.clearByTicket(ticket.ticket_id).catch(() => {});
      }
    } catch (error) {
      logError("tickets.delete", error, { channelId });
    }
  },

  async getUnratedClosedTickets(userId, guildId) {
    try {
      return await this.collection()
        .find({
          user_id: userId,
          guild_id: guildId,
          status: "closed",
          $or: [
            { rating: { $exists: false } },
            { rating: null },
            { rating: 0 }
          ]
        })
        .sort({ closed_at: -1 })
        .limit(5)
        .toArray();
    } catch (error) {
      logError("tickets.getUnratedClosedTickets", error, { userId, guildId });
      return [];
    }
  },
};

// ─────────────────────────────────────────────────────
//   NOTAS
// ─────────────────────────────────────────────────────

module.exports = { tickets };
