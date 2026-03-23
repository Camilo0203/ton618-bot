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

const reminders = {
  collection() { return getDB().collection("reminders"); },

  _normalize(doc) {
    if (!doc) return null;
    return { ...doc, id: doc._id?.toString() || doc.id };
  },
  
  async create(userId, guildId, channelId, text, fireAt) {
    try {
      validateInput(text, "string", { required: true, maxLength: 1000 });
      
      const entry = {
        _id: new ObjectId(),
        user_id: userId,
        guild_id: guildId,
        channel_id: channelId,
        text: sanitizeString(text, 1000),
        fire_at: fireAt,
        created_at: now(),
        fired: false
      };
      
      await this.collection().insertOne(entry);
      return entry._id.toString();
    } catch (error) {
      logError("reminders.create", error, { userId, guildId });
      throw error;
    }
  },

  async getPending() {
    try {
      const now_ = now();
      return await this.collection()
        .find({ fired: false, fire_at: { $lte: now_ } })
        .toArray()
        .then(rows => rows.map(r => this._normalize(r)));
    } catch (error) {
      logError("reminders.getPending", error);
      return [];
    }
  },

  async markFired(id) {
    try {
      if (!id) return;
      await this.collection().updateOne(
        { _id: new ObjectId(id) },
        { $set: { fired: true } }
      );
    } catch (error) {
      logError("reminders.markFired", error, { id });
    }
  },

  async getByUser(userId, guildId) {
    try {
      return await this.collection()
        .find({ user_id: userId, guild_id: guildId, fired: false })
        .sort({ fire_at: 1 })
        .toArray()
        .then(rows => rows.map(r => this._normalize(r)));
    } catch (error) {
      logError("reminders.getByUser", error, { userId, guildId });
      return [];
    }
  },

  async delete(id, userId) {
    try {
      const result = await this.collection().deleteOne({ _id: new ObjectId(id), user_id: userId });
      return result.deletedCount > 0;
    } catch (error) {
      logError("reminders.delete", error, { id, userId });
      return false;
    }
  },

  async cleanup() {
    try {
      const cutoff = new Date(Date.now() - 7 * 24 * 3600000).toISOString();
      await this.collection().deleteMany({
        $or: [
          { fired: true },
          { fire_at: { $lt: cutoff } }
        ]
      });
    } catch (error) {
      logError("reminders.cleanup", error);
    }
  },
};

// ─────────────────────────────────────────────────────────────
//   GIVEAWAYS
// ─────────────────────────────────────────────────────────────

module.exports = { reminders };
