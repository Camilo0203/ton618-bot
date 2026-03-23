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

const staffStats = {
  collection() { return getDB().collection("staffStats"); },
  
  _key(guildId, staffId) { return `${guildId}::${staffId}`; },

  async _incrementCounter(guildId, staffId, field) {
    const key = this._key(guildId, staffId);
    const nowDate = now();
    await this.collection().updateOne(
      { key },
      {
        $setOnInsert: {
          key,
          guild_id: guildId,
          staff_id: staffId,
          tickets_closed: 0,
          tickets_claimed: 0,
          tickets_assigned: 0,
          created_at: nowDate,
        },
        $inc: { [field]: 1 },
        $set: { last_updated: nowDate },
      },
      { upsert: true }
    );
  },

  async incrementClosed(guildId, staffId) {
    try {
      await this._incrementCounter(guildId, staffId, "tickets_closed");
    } catch (error) {
      logError("staffStats.incrementClosed", error, { guildId, staffId });
    }
  },

  async incrementClaimed(guildId, staffId) {
    try {
      await this._incrementCounter(guildId, staffId, "tickets_claimed");
    } catch (error) {
      logError("staffStats.incrementClaimed", error, { guildId, staffId });
    }
  },

  async incrementAssigned(guildId, staffId) {
    try {
      await this._incrementCounter(guildId, staffId, "tickets_assigned");
    } catch (error) {
      logError("staffStats.incrementAssigned", error, { guildId, staffId });
    }
  },

  async getLeaderboard(guildId, limit = 10) {
    try {
      return await this.collection()
        .find({ guild_id: guildId })
        .sort({ tickets_closed: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logError("staffStats.getLeaderboard", error, { guildId });
      return [];
    }
  },

  async get(guildId, staffId) {
    try {
      return await this.collection().findOne({ key: this._key(guildId, staffId) }) || null;
    } catch (error) {
      logError("staffStats.get", error, { guildId, staffId });
      return null;
    }
  },
};

// ─────────────────────────────────────────────────────
//   STAFF RATINGS
// ─────────────────────────────────────────────────────

const staffRatings = {
  collection() { return getDB().collection("staffRatings"); },
  
  async add(guildId, staffId, rating, ticketId, userId, comment = null) {
    try {
      validateInput(rating, "number", { required: true, minLength: 1, maxLength: 5 });
      
      const entry = {
        _id: new ObjectId(),
        guild_id: guildId,
        staff_id: staffId,
        rating,
        ticket_id: ticketId,
        user_id: userId,
        comment: sanitizeString(comment, 500),
        created_at: now()
      };
      
      await this.collection().insertOne(entry);
      return entry;
    } catch (error) {
      logError("staffRatings.add", error, { guildId, staffId, rating });
      throw error;
    }
  },

  async getStaffStats(guildId, staffId) {
    try {
      const all = await this.collection()
        .find({ guild_id: guildId, staff_id: staffId })
        .toArray();
      
      const total = all.length;
      if (!total) return { total: 0, avg: null, dist: { 1:0,2:0,3:0,4:0,5:0 }, recent: [] };
      
      const avg = all.reduce((s, r) => s + r.rating, 0) / total;
      const dist = { 1:0, 2:0, 3:0, 4:0, 5:0 };
      all.forEach(r => dist[r.rating]++);
      const recent = all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
      
      return { total, avg: Math.round(avg * 100) / 100, dist, recent };
    } catch (error) {
      logError("staffRatings.getStaffStats", error, { guildId, staffId });
      return { total: 0, avg: null };
    }
  },

  async getLeaderboard(guildId, minRatings = 1) {
    try {
      const all = await this.collection()
        .find({ guild_id: guildId })
        .toArray();
      
      const byStaff = {};
      for (const r of all) {
        if (!byStaff[r.staff_id]) byStaff[r.staff_id] = [];
        byStaff[r.staff_id].push(r.rating);
      }
      
      return Object.entries(byStaff)
        .filter(([, ratings]) => ratings.length >= minRatings)
        .map(([staffId, ratings]) => ({
          staff_id: staffId,
          total: ratings.length,
          avg: Math.round((ratings.reduce((s, r) => s + r, 0) / ratings.length) * 100) / 100,
        }))
        .sort((a, b) => b.avg - a.avg || b.total - a.total)
        .slice(0, 15);
    } catch (error) {
      logError("staffRatings.getLeaderboard", error, { guildId });
      return [];
    }
  },

  async getHistory(guildId, staffId, limit = 10) {
    try {
      return await this.collection()
        .find({ guild_id: guildId, staff_id: staffId })
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logError("staffRatings.getHistory", error, { guildId, staffId });
      return [];
    }
  },
};

// ─────────────────────────────────────────────────────
//   LEVELS
// ─────────────────────────────────────────────────────

const staffStatus = {
  collection() { return getDB().collection("staffStatus"); },
  
  _key(guildId, staffId) { return `${guildId}::${staffId}`; },
  
  async setAway(guildId, staffId, reason) {
    try {
      await this.collection().updateOne(
        { _id: this._key(guildId, staffId) },
        { 
          $set: { 
            guild_id: guildId, 
            staff_id: staffId, 
            is_away: true, 
            away_reason: sanitizeString(reason, 200), 
            away_since: now() 
          }
        },
        { upsert: true }
      );
    } catch (error) {}
  },

  async setOnline(guildId, staffId) {
    try {
      await this.collection().deleteOne({ _id: this._key(guildId, staffId) });
    } catch (error) {}
  },

  async isAway(guildId, staffId) {
    try {
      const e = await this.collection().findOne({ _id: this._key(guildId, staffId) });
      return e ? e.is_away : false;
    } catch (error) {
      return false;
    }
  },

  async getAway(guildId) {
    try {
      return await this.collection()
        .find({ guild_id: guildId, is_away: true })
        .toArray();
    } catch (error) {
      return [];
    }
  },
};

module.exports = { staffStats, staffRatings, staffStatus };
