"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { tickets } = require("../utils/database");
const { getGuildSettings } = require("../utils/accessControl");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { shouldSendSlaAlert } = require("../utils/ticketLifecycleAlerts");
const { resolveTicketSlaMinutes, getSlaSweepFloorMinutes } = require("../utils/ticketSlaRules");
const { resolveGuildChannel } = require("./common");
const { resolveGuildLanguage, t } = require("../utils/i18n");

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

          const lang = resolveGuildLanguage(s);
          const mins = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
          const timeStr = mins >= 60
            ? t(lang, "sla_alerts.hours_minutes", { h: Math.floor(mins / 60), m: mins % 60 })
            : t(lang, "sla_alerts.minutes_plural", { count: mins });

          const sent = await logChannel.send({
            embeds: [new EmbedBuilder()
              .setColor(0xE67E22)
              .setTitle(t(lang, "sla_alerts.title"))
              .setDescription(t(lang, "sla_alerts.description", { channelId: ticket.channel_id, ticketId: ticket.ticket_id, time: timeStr }))
              .addFields(
                { name: t(lang, "sla_alerts.user"), value: `<@${ticket.user_id}>`, inline: true },
                { name: t(lang, "sla_alerts.category"), value: ticket.category || "General", inline: true },
                { name: t(lang, "sla_alerts.sla_limit"), value: t(lang, "sla_alerts.minutes_plural", { count: ticketSlaMinutes }), inline: true }
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
