"use strict";

const { Events } = require("discord.js");
const logger = require("../utils/structuredLogger");

module.exports = {
  name: Events.MessageReactionRemove,
  async execute(reaction, user) {
    // Fetch partial reactions
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        logger.error('messageReactionRemove', 'Error fetching reaction', { error: error?.message || String(error) });
        return;
      }
    }

    // Obtener handlers del cliente
    const { giveawayHandler, autoRoleHandler } = reaction.client;

    // Procesar giveaways
    if (giveawayHandler) {
      try {
        await giveawayHandler.handleReactionRemove(reaction, user);
      } catch (error) {
        logger.error('messageReactionRemove', 'Error in giveawayHandler', { error: error?.message || String(error) });
      }
    }

    // Procesar auto-roles
    if (autoRoleHandler) {
      try {
        await autoRoleHandler.handleReactionRemove(reaction, user);
      } catch (error) {
        logger.error('messageReactionRemove', 'Error in autoRoleHandler', { error: error?.message || String(error) });
      }
    }
  },
};
