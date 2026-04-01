"use strict";

const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    // Fetch partial reactions
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Error fetching reaction:", error);
        return;
      }
    }

    // Obtener handlers del cliente
    const { giveawayHandler, autoRoleHandler } = reaction.client;

    // Procesar giveaways
    if (giveawayHandler) {
      try {
        await giveawayHandler.handleReactionAdd(reaction, user);
      } catch (error) {
        console.error("[messageReactionAdd] Error in giveawayHandler:", error);
      }
    }

    // Procesar auto-roles
    if (autoRoleHandler) {
      try {
        await autoRoleHandler.handleReactionAdd(reaction, user);
      } catch (error) {
        console.error("[messageReactionAdd] Error in autoRoleHandler:", error);
      }
    }
  },
};
