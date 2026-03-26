"use strict";

const { getDB } = require("./core");
const { logError, validateInput, sanitizeString } = require("./helpers");

const ticketCategories = {
  collection() {
    return getDB().collection("ticket_categories");
  },

  async getByGuild(guildId) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      const categories = await this.collection()
        .find({ guild_id: guildId })
        .sort({ order: 1, created_at: 1 })
        .toArray();
      return categories;
    } catch (error) {
      logError("ticketCategories.getByGuild", error, { guildId });
      return [];
    }
  },

  async getById(guildId, categoryId) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      validateInput(categoryId, "string", { required: true, maxLength: 100 });
      return await this.collection().findOne({
        guild_id: guildId,
        category_id: categoryId,
      });
    } catch (error) {
      logError("ticketCategories.getById", error, { guildId, categoryId });
      return null;
    }
  },

  async create(guildId, data) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      validateInput(data.category_id, "string", { required: true, maxLength: 100 });
      validateInput(data.label, "string", { required: true, maxLength: 100 });
      validateInput(data.description, "string", { required: true, maxLength: 200 });

      const existing = await this.getById(guildId, data.category_id);
      if (existing) {
        throw new Error(`Ya existe una categoría con el ID "${data.category_id}"`);
      }

      const count = await this.collection().countDocuments({ guild_id: guildId });
      if (count >= 25) {
        throw new Error("Has alcanzado el límite máximo de 25 categorías por servidor");
      }

      const category = {
        guild_id: guildId,
        category_id: sanitizeString(data.category_id, 100),
        label: sanitizeString(data.label, 100),
        description: sanitizeString(data.description, 200),
        emoji: data.emoji ? sanitizeString(data.emoji, 50) : null,
        color: data.color || 0x5865F2,
        discord_category_id: data.discord_category_id || null,
        ping_roles: Array.isArray(data.ping_roles) ? data.ping_roles.slice(0, 5) : [],
        welcome_message: data.welcome_message ? sanitizeString(data.welcome_message, 1000) : null,
        questions: Array.isArray(data.questions) ? data.questions.slice(0, 5).map(q => sanitizeString(q, 200)) : [],
        priority: ["low", "normal", "high", "urgent"].includes(data.priority) ? data.priority : "normal",
        enabled: data.enabled !== false,
        order: count,
        created_at: new Date(),
        updated_at: new Date(),
      };

      await this.collection().insertOne(category);
      return category;
    } catch (error) {
      logError("ticketCategories.create", error, { guildId, data });
      throw error;
    }
  },

  async update(guildId, categoryId, updates) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      validateInput(categoryId, "string", { required: true, maxLength: 100 });

      const existing = await this.getById(guildId, categoryId);
      if (!existing) {
        throw new Error(`No se encontró la categoría "${categoryId}"`);
      }

      const updateData = {
        updated_at: new Date(),
      };

      if (updates.label !== undefined) {
        updateData.label = sanitizeString(updates.label, 100);
      }
      if (updates.description !== undefined) {
        updateData.description = sanitizeString(updates.description, 200);
      }
      if (updates.emoji !== undefined) {
        updateData.emoji = updates.emoji ? sanitizeString(updates.emoji, 50) : null;
      }
      if (updates.color !== undefined) {
        updateData.color = updates.color;
      }
      if (updates.discord_category_id !== undefined) {
        updateData.discord_category_id = updates.discord_category_id;
      }
      if (updates.ping_roles !== undefined) {
        updateData.ping_roles = Array.isArray(updates.ping_roles) ? updates.ping_roles.slice(0, 5) : [];
      }
      if (updates.welcome_message !== undefined) {
        updateData.welcome_message = updates.welcome_message ? sanitizeString(updates.welcome_message, 1000) : null;
      }
      if (updates.questions !== undefined) {
        updateData.questions = Array.isArray(updates.questions) ? updates.questions.slice(0, 5).map(q => sanitizeString(q, 200)) : [];
      }
      if (updates.priority !== undefined && ["low", "normal", "high", "urgent"].includes(updates.priority)) {
        updateData.priority = updates.priority;
      }
      if (updates.enabled !== undefined) {
        updateData.enabled = Boolean(updates.enabled);
      }
      if (updates.order !== undefined) {
        updateData.order = Number(updates.order);
      }

      await this.collection().updateOne(
        { guild_id: guildId, category_id: categoryId },
        { $set: updateData }
      );

      return await this.getById(guildId, categoryId);
    } catch (error) {
      logError("ticketCategories.update", error, { guildId, categoryId, updates });
      throw error;
    }
  },

  async delete(guildId, categoryId) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      validateInput(categoryId, "string", { required: true, maxLength: 100 });

      const result = await this.collection().deleteOne({
        guild_id: guildId,
        category_id: categoryId,
      });

      return result.deletedCount > 0;
    } catch (error) {
      logError("ticketCategories.delete", error, { guildId, categoryId });
      return false;
    }
  },

  async deleteAllByGuild(guildId) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      await this.collection().deleteMany({ guild_id: guildId });
    } catch (error) {
      logError("ticketCategories.deleteAllByGuild", error, { guildId });
    }
  },

  async countByGuild(guildId) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      return await this.collection().countDocuments({ guild_id: guildId });
    } catch (error) {
      logError("ticketCategories.countByGuild", error, { guildId });
      return 0;
    }
  },

  async reorder(guildId, categoryOrders) {
    try {
      validateInput(guildId, "string", { required: true, maxLength: 50 });
      
      const bulkOps = categoryOrders.map(({ category_id, order }) => ({
        updateOne: {
          filter: { guild_id: guildId, category_id },
          update: { $set: { order, updated_at: new Date() } },
        },
      }));

      if (bulkOps.length > 0) {
        await this.collection().bulkWrite(bulkOps);
      }
    } catch (error) {
      logError("ticketCategories.reorder", error, { guildId, categoryOrders });
    }
  },
};

module.exports = { ticketCategories };
