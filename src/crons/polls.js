"use strict";

const { EmbedBuilder } = require("discord.js");
const { polls } = require("../utils/database");
const { buildPollEmbed } = require("../handlers/pollHandler");

function createTask(client) {
  return async function finalizeExpiredPollsTick() {
    const expired = await polls.getExpired();

    for (const poll of expired) {
      try {
        await polls.end(poll.id);
        const guild = client.guilds.cache.get(poll.guild_id);
        if (!guild) continue;
        const channel = guild.channels.cache.get(poll.channel_id);
        if (!channel) continue;
        const msg = await channel.messages.fetch(poll.message_id).catch(() => null);
        if (!msg) continue;

        const finalEmbed = buildPollEmbed(poll, true);
        await msg.edit({ embeds: [finalEmbed], components: [] }).catch(() => {});
        await channel.send({
          embeds: [new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("Encuesta finalizada")
            .setDescription(`La encuesta **"${poll.question}"** ha terminado.`)
            .setTimestamp()],
        }).catch(() => {});
      } catch (error) {
        console.error("[POLL END]", error?.message || error);
      }
    }
  };
}

module.exports = { createTask };
