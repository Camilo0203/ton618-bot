"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { tickets } = require("../utils/database");
const { getGuildSettings } = require("../utils/accessControl");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { shouldSendSmartPing } = require("../utils/ticketLifecycleAlerts");

function register(client) {
  cron.schedule("*/3 * * * *", async () => {
    await runSingleFlight("tickets.smart_ping", async () => {
      await runGuildTask(client, "tickets.smart_ping", async (guild) => {
        const s = await getGuildSettings(guild.id);
        const smartPingHours = s.smart_ping_hours || 0;
        const smartPingMinutes = s.smart_ping_minutes || 0;
        const smartPingTotalMinutes = smartPingHours > 0 ? smartPingHours * 60 : smartPingMinutes;
        if (!s || smartPingTotalMinutes <= 0) return;

        const waiting = await tickets.getWithoutStaffResponse(guild.id, smartPingTotalMinutes);
        for (const ticket of waiting) {
          if (!shouldSendSmartPing(ticket, smartPingTotalMinutes)) continue;
          const channel = guild.channels.cache.get(ticket.channel_id);
          if (!channel) continue;

          const timeStr = smartPingHours > 0 ? `${smartPingHours} hora(s)` : `${smartPingMinutes} minutos`;
          const ping = s.support_role ? `<@&${s.support_role}>` : "";

          const sent = await channel.send({
            content: ping || undefined,
            embeds: [new EmbedBuilder()
              .setColor(0xE67E22)
              .setTitle("Smart Ping - Atencion necesaria")
              .setDescription(`Este ticket lleva mas de **${timeStr}** sin respuesta del staff.`)
              .addFields(
                { name: "Usuario", value: `<@${ticket.user_id}>`, inline: true },
                { name: "Categoria", value: ticket.category, inline: true }
              )
              .setTimestamp()],
          }).then(() => true).catch(() => false);

          if (sent) {
            await tickets.markSmartPingSent(ticket.channel_id);
          }
        }
      });
    });
  });
}

module.exports = { register };
