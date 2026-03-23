"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { tickets } = require("../utils/database");
const { getGuildSettings } = require("../utils/accessControl");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { shouldSendAutoCloseWarning, shouldAutoCloseTicket } = require("../utils/ticketLifecycleAlerts");

function register(client) {
  cron.schedule("*/10 * * * *", async () => {
    await runSingleFlight("tickets.auto_close", async () => {
      await runGuildTask(client, "tickets.auto_close", async (guild) => {
        const s = await getGuildSettings(guild.id);
        const autoCloseHours = s.auto_close_hours || 0;
        const autoCloseMinutes = s.auto_close_minutes || 0;
        const autoCloseTotalMinutes = autoCloseHours > 0 ? autoCloseHours * 60 : autoCloseMinutes;
        if (!s || autoCloseTotalMinutes <= 0) return;

        if (autoCloseTotalMinutes > 30) {
          const warningCandidates = await tickets.getInactive(guild.id, autoCloseTotalMinutes - 30);
          for (const ticket of warningCandidates) {
            if (!shouldSendAutoCloseWarning(ticket, autoCloseTotalMinutes)) continue;
            const channel = guild.channels.cache.get(ticket.channel_id);
            if (!channel) continue;

            const warningSent = await channel.send({
              embeds: [new EmbedBuilder()
                .setColor(0xFEE75C)
                .setDescription(`⚠️ <@${ticket.user_id}> Este ticket sera cerrado automaticamente en ~30 minutos por inactividad.\nResponde para evitar el cierre.`)
                .setTimestamp()],
            }).then(() => true).catch(() => false);

            if (warningSent) {
              await tickets.markAutoCloseWarned(ticket.channel_id);
            }
          }
        }

        const closeCandidates = await tickets.getInactive(guild.id, autoCloseTotalMinutes);
        for (const ticket of closeCandidates) {
          if (!shouldAutoCloseTicket(ticket, autoCloseTotalMinutes)) continue;

          const channel = guild.channels.cache.get(ticket.channel_id);
          if (!channel) {
            await tickets.close(ticket.channel_id, client.user.id, "Canal eliminado");
            continue;
          }

          await tickets.close(ticket.channel_id, client.user.id, "Cierre automatico por inactividad");
          await channel.send({
            embeds: [new EmbedBuilder()
              .setColor(0xED4245)
              .setTitle("Ticket Cerrado Automaticamente")
              .setDescription("Este ticket fue cerrado por inactividad.")
              .setTimestamp()],
          }).catch(() => {});

          setTimeout(() => {
            channel.delete().catch(() => {});
          }, 8000);
        }
      });
    });
  });
}

module.exports = { register };
