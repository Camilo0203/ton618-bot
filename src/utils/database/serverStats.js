"use strict";

const { getDB } = require("./core");
const { ObjectId, now, logError, validateInput } = require("./helpers");

const serverStats = {
  collection() { return getDB().collection("server_stats"); },

  async recordSnapshot(guildId, data) {
    try {
      validateInput(guildId, "string", { required: true });

      const snapshot = {
        _id: new ObjectId(),
        guild_id: guildId,
        timestamp: now(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        total_members: data.total_members || 0,
        human_members: data.human_members || 0,
        bot_members: data.bot_members || 0,
        online_members: data.online_members || 0,
        total_channels: data.total_channels || 0,
        total_roles: data.total_roles || 0,
        total_emojis: data.total_emojis || 0,
      };

      await this.collection().insertOne(snapshot);
      return snapshot;
    } catch (error) {
      logError("serverStats.recordSnapshot", error, { guildId, data });
      throw error;
    }
  },

  async getSnapshots(guildId, days = 30) {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      const rows = await this.collection()
        .find({
          guild_id: guildId,
          timestamp: { $gte: cutoff.toISOString() },
        })
        .sort({ timestamp: 1 })
        .toArray();

      return rows;
    } catch (error) {
      logError("serverStats.getSnapshots", error, { guildId, days });
      return [];
    }
  },

  async getLatestSnapshot(guildId) {
    try {
      const row = await this.collection()
        .findOne({ guild_id: guildId })
        .sort({ timestamp: -1 });
      return row;
    } catch (error) {
      logError("serverStats.getLatestSnapshot", error, { guildId });
      return null;
    }
  },
};

const messageActivity = {
  collection() { return getDB().collection("message_activity"); },

  async recordMessage(guildId, channelId, userId, timestamp = null) {
    try {
      validateInput(guildId, "string", { required: true });
      validateInput(channelId, "string", { required: true });
      validateInput(userId, "string", { required: true });

      const date = new Date(timestamp || Date.now());
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const hour = date.getHours();

      await this.collection().updateOne(
        {
          guild_id: guildId,
          date: dateStr,
          hour: hour,
        },
        {
          $inc: {
            total_messages: 1,
            [`channels.${channelId}`]: 1,
            [`users.${userId}`]: 1,
          },
          $setOnInsert: {
            guild_id: guildId,
            date: dateStr,
            hour: hour,
            created_at: now(),
          },
        },
        { upsert: true }
      );

      return true;
    } catch (error) {
      logError("messageActivity.recordMessage", error, { guildId, channelId, userId });
      return false;
    }
  },

  async getActivity(guildId, days = 7) {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const rows = await this.collection()
        .find({
          guild_id: guildId,
          date: { $gte: cutoffStr },
        })
        .sort({ date: 1, hour: 1 })
        .toArray();

      return rows;
    } catch (error) {
      logError("messageActivity.getActivity", error, { guildId, days });
      return [];
    }
  },

  async getTopChannels(guildId, days = 7, limit = 10) {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const pipeline = [
        {
          $match: {
            guild_id: guildId,
            date: { $gte: cutoffStr },
          },
        },
        {
          $project: {
            channels: { $objectToArray: "$channels" },
          },
        },
        { $unwind: "$channels" },
        {
          $group: {
            _id: "$channels.k",
            total: { $sum: "$channels.v" },
          },
        },
        { $sort: { total: -1 } },
        { $limit: limit },
      ];

      const results = await this.collection().aggregate(pipeline).toArray();
      return results.map(r => ({ channel_id: r._id, messages: r.total }));
    } catch (error) {
      logError("messageActivity.getTopChannels", error, { guildId, days });
      return [];
    }
  },

  async getTopUsers(guildId, days = 7, limit = 10) {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const pipeline = [
        {
          $match: {
            guild_id: guildId,
            date: { $gte: cutoffStr },
          },
        },
        {
          $project: {
            users: { $objectToArray: "$users" },
          },
        },
        { $unwind: "$users" },
        {
          $group: {
            _id: "$users.k",
            total: { $sum: "$users.v" },
          },
        },
        { $sort: { total: -1 } },
        { $limit: limit },
      ];

      const results = await this.collection().aggregate(pipeline).toArray();
      return results.map(r => ({ user_id: r._id, messages: r.total }));
    } catch (error) {
      logError("messageActivity.getTopUsers", error, { guildId, days });
      return [];
    }
  },

  async getPeakHours(guildId, days = 7) {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const pipeline = [
        {
          $match: {
            guild_id: guildId,
            date: { $gte: cutoffStr },
          },
        },
        {
          $group: {
            _id: "$hour",
            total: { $sum: "$total_messages" },
          },
        },
        { $sort: { _id: 1 } },
      ];

      const results = await this.collection().aggregate(pipeline).toArray();
      return results.map(r => ({ hour: r._id, messages: r.total }));
    } catch (error) {
      logError("messageActivity.getPeakHours", error, { guildId, days });
      return [];
    }
  },
};

module.exports = {
  serverStats,
  messageActivity,
};
