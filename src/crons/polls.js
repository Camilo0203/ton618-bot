"use strict";

const { EmbedBuilder } = require("discord.js");
const { polls, settings } = require("../utils/database");
const { buildPollEmbed } = require("../handlers/pollHandler");
const { resolveGuildLanguage, t } = require("../utils/i18n");
const E = require("../utils/embeds");

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

        const s = await settings.get(poll.guild_id).catch(() => null);
        const lang = resolveGuildLanguage(s);

        const finalEmbed = buildPollEmbed(poll, true);
        await msg.edit({ embeds: [finalEmbed], components: [] }).catch(() => {});
        await channel.send({
          embeds: [new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle(t(lang, "crons.polls.ended_title"))
            .setDescription(t(lang, "crons.polls.ended_desc", { question: poll.question }))
            .setTimestamp()],
        }).catch(() => {});
      } catch (error) {
        console.error("[POLL END]", error?.message || error);
      }
    }
  };
}

module.exports = { createTask };
