"use strict";

const { getDB } = require("./core");
const { ObjectId, now, logError, validateInput, sanitizeString } = require("./helpers");

const reactionRoles = {
  collection() { return getDB().collection("reaction_roles"); },

  async add(guildId, messageId, channelId, emoji, roleId, mode = "toggle") {
    try {
      validateInput(guildId, "string", { required: true });
      validateInput(messageId, "string", { required: true });
      validateInput(channelId, "string", { required: true });
      validateInput(emoji, "string", { required: true });
      validateInput(roleId, "string", { required: true });

      const entry = {
        _id: new ObjectId(),
        guild_id: guildId,
        message_id: messageId,
        channel_id: channelId,
        emoji: emoji,
        role_id: roleId,
        mode: mode, // toggle, add-only, remove-only
        created_at: now(),
      };

      await this.collection().insertOne(entry);
      return entry;
    } catch (error) {
      logError("reactionRoles.add", error, { guildId, messageId, emoji, roleId });
      throw error;
    }
  },

  async remove(guildId, messageId, emoji) {
    try {
      const result = await this.collection().deleteOne({
        guild_id: guildId,
        message_id: messageId,
        emoji: emoji,
      });
      return result.deletedCount > 0;
    } catch (error) {
      logError("reactionRoles.remove", error, { guildId, messageId, emoji });
      return false;
    }
  },

  async getByMessage(messageId) {
    try {
      const rows = await this.collection()
        .find({ message_id: messageId })
        .toArray();
      return rows;
    } catch (error) {
      logError("reactionRoles.getByMessage", error, { messageId });
      return [];
    }
  },

  async getByGuild(guildId) {
    try {
      const rows = await this.collection()
        .find({ guild_id: guildId })
        .toArray();
      return rows;
    } catch (error) {
      logError("reactionRoles.getByGuild", error, { guildId });
      return [];
    }
  },

  async findByReaction(messageId, emoji) {
    try {
      const row = await this.collection().findOne({
        message_id: messageId,
        emoji: emoji,
      });
      return row;
    } catch (error) {
      logError("reactionRoles.findByReaction", error, { messageId, emoji });
      return null;
    }
  },

  async removeAllForMessage(messageId) {
    try {
      const result = await this.collection().deleteMany({ message_id: messageId });
      return result.deletedCount;
    } catch (error) {
      logError("reactionRoles.removeAllForMessage", error, { messageId });
      return 0;
    }
  },
};

const autoRoleSettings = {
  collection() { return getDB().collection("auto_role_settings"); },

  async get(guildId) {
    try {
      const row = await this.collection().findOne({ guild_id: guildId });
      if (!row) {
        return {
          guild_id: guildId,
          join_role_id: null,
          join_role_delay: 0,
          join_role_exclude_bots: true,
          level_roles: [], // [{ level: 5, role_id: "123", mode: "add" }]
          level_roles_mode: "stack", // stack or replace
        };
      }
      return row;
    } catch (error) {
      logError("autoRoleSettings.get", error, { guildId });
      return null;
    }
  },

  async setJoinRole(guildId, roleId, delay = 0, excludeBots = true) {
    try {
      await this.collection().updateOne(
        { guild_id: guildId },
        {
          $set: {
            join_role_id: roleId,
            join_role_delay: delay,
            join_role_exclude_bots: excludeBots,
            updated_at: now(),
          },
          $setOnInsert: {
            guild_id: guildId,
            created_at: now(),
          },
        },
        { upsert: true }
      );
      return true;
    } catch (error) {
      logError("autoRoleSettings.setJoinRole", error, { guildId, roleId });
      return false;
    }
  },

  async addLevelRole(guildId, level, roleId, mode = "add") {
    try {
      await this.collection().updateOne(
        { guild_id: guildId },
        {
          $push: {
            level_roles: { level: Number(level), role_id: roleId, mode: mode },
          },
          $set: { updated_at: now() },
          $setOnInsert: {
            guild_id: guildId,
            created_at: now(),
          },
        },
        { upsert: true }
      );
      return true;
    } catch (error) {
      logError("autoRoleSettings.addLevelRole", error, { guildId, level, roleId });
      return false;
    }
  },

  async removeLevelRole(guildId, level) {
    try {
      await this.collection().updateOne(
        { guild_id: guildId },
        {
          $pull: { level_roles: { level: Number(level) } },
          $set: { updated_at: now() },
        }
      );
      return true;
    } catch (error) {
      logError("autoRoleSettings.removeLevelRole", error, { guildId, level });
      return false;
    }
  },

  async setLevelRolesMode(guildId, mode) {
    try {
      await this.collection().updateOne(
        { guild_id: guildId },
        {
          $set: {
            level_roles_mode: mode,
            updated_at: now(),
          },
          $setOnInsert: {
            guild_id: guildId,
            created_at: now(),
          },
        },
        { upsert: true }
      );
      return true;
    } catch (error) {
      logError("autoRoleSettings.setLevelRolesMode", error, { guildId, mode });
      return false;
    }
  },
};

module.exports = {
  reactionRoles,
  autoRoleSettings,
};
