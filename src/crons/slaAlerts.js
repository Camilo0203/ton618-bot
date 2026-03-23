"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { tickets } = require("../utils/database");
const { getGuildSettings } = require("../utils/accessControl");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { shouldSendSlaAlert } = require("../utils/ticketLifecycleAlerts");
const { resolveTicketSlaMinutes, getSlaSweepFloorMinutes } = require("../utils/ticketSlaRules");
const { resolveGuildChannel } = require("./common");

function register(client) {
  cron.schedule("*/5 * * * *", async () => {
    await runSingleFlight("tickets.sla_alert", async () => {
      await runGuildTask(client, "tickets.sla_alert", async (guild) => {
        const s = await getGuildSettings(guild.id);
        if (!s || !s.log_channel) return;

        const slaHours = s.sla_hours || 0;
        const baseSlaMinutes = slaHours > 0 ? slaHours * 60 : (s.sla_minutes || 0);
        const slaSettings = baseSlaMinutes !== (s.sla_minutes || 0)
          ? { ...s, sla_minutes: baseSlaMinutes }
          : s;
        const sweepFloorMinutes = getSlaSweepFloorMinutes(slaSettings, "alert");
        if (sweepFloorMinutes <= 0) return;

        const waiting = await tickets.getWithoutStaffResponse(guild.id, sweepFloorMinutes);
        const logChannel = await resolveGuildChannel(guild, s.log_channel);
        if (!logChannel) return;

        for (const ticket of waiting) {
          const ticketSlaMinutes = resolveTicketSlaMinutes(slaSettings, ticket, "alert");
          if (ticketSlaMinutes <= 0) continue;
          if (!shouldSendSlaAlert(ticket, ticketSlaMinutes)) continue;

          const mins = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
          const timeStr = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins} minutos`;

          const sent = await logChannel.send({
            embeds: [new EmbedBuilder()
              .setColor(0xE67E22)
              .setTitle("Alerta SLA - Sin respuesta del staff")
              .setDescription(`El ticket <#${ticket.channel_id}> **#${ticket.ticket_id}** lleva **${timeStr}** sin respuesta del staff.`)
              .addFields(
                { name: "Usuario", value: `<@${ticket.user_id}>`, inline: true },
                { name: "Categoria", value: ticket.category, inline: true },
                { name: "Limite SLA", value: `${ticketSlaMinutes} minutos`, inline: true }
              )
              .setTimestamp()],
          }).then(() => true).catch(() => false);

          if (sent) {
            await tickets.markSlaAlerted(ticket.channel_id);
          }
        }
      });
    });
  });
}

module.exports = { register };
