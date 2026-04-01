"use strict";

const { EmbedBuilder } = require("discord.js");
const { giveaways, levels } = require("../utils/database");

class GiveawayHandler {
  constructor(client) {
    this.client = client;
    this.checkInterval = null;
  }

  start() {
    // Revisar giveaways expirados cada minuto
    this.checkInterval = setInterval(() => {
      this.checkExpiredGiveaways();
    }, 60000); // 1 minuto

    console.log("[GiveawayHandler] Started - checking every 60 seconds");
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log("[GiveawayHandler] Stopped");
    }
  }

  async checkExpiredGiveaways() {
    try {
      const expired = await giveaways.getExpiredActive(50);

      if (expired.length === 0) return;

      console.log(`[GiveawayHandler] Found ${expired.length} expired giveaway(s)`);

      for (const giveaway of expired) {
        await this.endGiveaway(giveaway);
      }
    } catch (error) {
      console.error("[GiveawayHandler] Error checking expired giveaways:", error);
    }
  }

  async endGiveaway(giveaway) {
    try {
      const channel = await this.client.channels.fetch(giveaway.channel_id);
      if (!channel) {
        console.error(`[GiveawayHandler] Channel ${giveaway.channel_id} not found`);
        await giveaways.markEnded(giveaway.message_id, []);
        return;
      }

      const message = await channel.messages.fetch(giveaway.message_id);
      if (!message) {
        console.error(`[GiveawayHandler] Message ${giveaway.message_id} not found`);
        await giveaways.markEnded(giveaway.message_id, []);
        return;
      }

      const guild = channel.guild;

      // Seleccionar ganadores
      const winners = await this.selectWinners(message, giveaway, guild);

      if (winners.length === 0) {
        await giveaways.markEnded(giveaway.message_id, []);
        
        const embed = EmbedBuilder.from(message.embeds[0])
          .setDescription(message.embeds[0].description + "\n\n**Status:** Ended - No valid participants")
          .setColor(0xFF0000);

        await message.edit({ embeds: [embed] });

        console.log(`[GiveawayHandler] Giveaway ${giveaway.message_id} ended with no winners`);
        return;
      }

      // Actualizar base de datos
      const winnerIds = winners.map(w => w.id);
      await giveaways.markEnded(giveaway.message_id, winnerIds);

      // Actualizar embed
      const embed = EmbedBuilder.from(message.embeds[0])
        .setDescription(
          message.embeds[0].description + 
          `\n\n**Status:** Ended\n**Winners:** ${winners.map(w => w.toString()).join(", ")}`
        )
        .setColor(0xFFD700);

      await message.edit({ embeds: [embed] });

      // Anunciar ganadores
      await channel.send({
        content: `🎉 **GIVEAWAY ENDED** 🎉\n\nCongratulations ${winners.map(w => w.toString()).join(", ")}! You won **${giveaway.prize}**!`
      });

      console.log(`[GiveawayHandler] Giveaway ${giveaway.message_id} ended successfully with ${winners.length} winner(s)`);
    } catch (error) {
      console.error(`[GiveawayHandler] Error ending giveaway ${giveaway.message_id}:`, error);
    }
  }

  async selectWinners(message, giveaway, guild) {
    // Obtener reacciones
    const reaction = message.reactions.cache.find(r => 
      r.emoji.name === giveaway.emoji || r.emoji.toString() === giveaway.emoji
    );
    
    if (!reaction) return [];

    const users = await reaction.users.fetch();
    let participants = users.filter(u => !u.bot).map(u => u);

    // Aplicar filtros de requisitos
    if (giveaway.requirements && giveaway.requirements.type !== "none") {
      const validParticipants = [];

      for (const user of participants) {
        let isValid = true;

        // Verificar que el usuario siga en el servidor
        try {
          const member = await guild.members.fetch(user.id);
          
          if (giveaway.requirements.type === "role" && giveaway.requirements.role_id) {
            isValid = member.roles.cache.has(giveaway.requirements.role_id);
          } else if (giveaway.requirements.type === "level" && giveaway.requirements.min_level) {
            const userLevel = await levels.get(guild.id, user.id);
            isValid = userLevel && userLevel.level >= giveaway.requirements.min_level;
          } else if (giveaway.requirements.type === "account_age" && giveaway.requirements.min_account_age_days) {
            const accountAge = Date.now() - user.createdTimestamp;
            const requiredAge = giveaway.requirements.min_account_age_days * 24 * 60 * 60 * 1000;
            isValid = accountAge >= requiredAge;
          }

          if (isValid) {
            validParticipants.push(user);
          }
        } catch (error) {
          // Usuario ya no está en el servidor
          continue;
        }
      }

      participants = validParticipants;
    }

    if (participants.length === 0) return [];

    // Seleccionar ganadores aleatorios
    const winners = [];
    const winnersCount = Math.min(giveaway.winners_count, participants.length);

    for (let i = 0; i < winnersCount; i++) {
      const randomIndex = Math.floor(Math.random() * participants.length);
      winners.push(participants[randomIndex]);
      participants.splice(randomIndex, 1);
    }

    return winners;
  }

  async handleReactionAdd(reaction, user) {
    // Verificar si es un giveaway
    if (user.bot) return;

    const giveaway = await giveaways.getByMessage(reaction.message.id);
    if (!giveaway || giveaway.ended) return;

    // Verificar que sea el emoji correcto
    const emojiMatch = reaction.emoji.name === giveaway.emoji || reaction.emoji.toString() === giveaway.emoji;
    if (!emojiMatch) return;

    // Agregar participante
    await giveaways.addParticipant(reaction.message.id, user.id);
  }

  async handleReactionRemove(reaction, user) {
    // Verificar si es un giveaway
    if (user.bot) return;

    const giveaway = await giveaways.getByMessage(reaction.message.id);
    if (!giveaway || giveaway.ended) return;

    // Verificar que sea el emoji correcto
    const emojiMatch = reaction.emoji.name === giveaway.emoji || reaction.emoji.toString() === giveaway.emoji;
    if (!emojiMatch) return;

    // Remover participante
    await giveaways.removeParticipant(reaction.message.id, user.id);
  }
}

module.exports = GiveawayHandler;
