"use strict";

const { getDB, isDbUnavailableError, toDbUnavailableError } = require("./core");
const { now, validateInput, sanitizeString, logError } = require("./helpers");

const embedTemplates = {
  collection() { return getDB().collection("embed_templates"); },

  async create(data) {
    try {
      validateInput(data.guild_id, "string", { required: true });
      validateInput(data.name, "string", { required: true, maxLength: 100 });
      validateInput(data.created_by, "string", { required: true });

      const template = {
        guild_id: data.guild_id,
        name: sanitizeString(data.name, 100),
        description: sanitizeString(data.description, 500) || null,
        created_by: data.created_by,
        embed_data: data.embed_data, // Store JSON object of embed
        created_at: now(),
        updated_at: now(),
      };

      await this.collection().insertOne(template);
      return template;
    } catch (error) {
      if (isDbUnavailableError(error)) throw toDbUnavailableError(error, "embedTemplates.create");
      logError("embedTemplates.create", error, { data });
      throw error;
    }
  },

  async get(guildId, name) {
    try {
      return await this.collection().findOne({ guild_id: guildId, name: name }) || null;
    } catch (error) {
      logError("embedTemplates.get", error, { guildId, name });
      return null;
    }
  },

  async list(guildId) {
    try {
      return await this.collection().find({ guild_id: guildId }).toArray();
    } catch (error) {
      logError("embedTemplates.list", error, { guildId });
      return [];
    }
  },

  async update(guildId, name, data) {
    try {
      const patch = { ...data, updated_at: now() };
      const result = await this.collection().findOneAndUpdate(
        { guild_id: guildId, name: name },
        { $set: patch },
        { returnDocument: "after" }
      );
      return result;
    } catch (error) {
      logError("embedTemplates.update", error, { guildId, name, data });
      return null;
    }
  },

  async delete(guildId, name) {
    try {
      await this.collection().deleteOne({ guild_id: guildId, name: name });
      return true;
    } catch (error) {
      logError("embedTemplates.delete", error, { guildId, name });
      return false;
    }
  }
};

module.exports = { embedTemplates };
