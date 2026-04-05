"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { tickets } = require("../utils/database");
const { getGuildSettings } = require("../utils/accessControl");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { shouldEscalateSla } = require("../utils/ticketLifecycleAlerts");
const { resolveTicketSlaMinutes, getSlaSweepFloorMinutes } = require("../utils/ticketSlaRules");
const { resolveGuildChannel } = require("./common");
const { resolveGuildLanguage, t } = require("../utils/i18n");

function register(client) {
  cron.schedule("*/5 * * * *", async () => {
    await runSingleFlight("tickets.sla_escalation", async () => {
      await runGuildTask(client, "tickets.sla_escalation", async (guild) => {
        const s = await getGuildSettings(guild.id);
        if (!s || s.sla_escalation_enabled !== true) return;

        const sweepFloorMinutes = getSlaSweepFloorMinutes(s, "escalation");
        if (sweepFloorMinutes <= 0) return;

        const escalationChannelId = s.sla_escalation_channel || s.log_channel || null;
        if (!escalationChannelId) return;

        const escalationChannel = await resolveGuildChannel(guild, escalationChannelId);
        if (!escalationChannel) return;

        const waiting = await tickets.getWithoutStaffResponse(guild.id, sweepFloorMinutes);
        for (const ticket of waiting) {
          const escalationMinutes = resolveTicketSlaMinutes(s, ticket, "escalation");
          if (escalationMinutes <= 0) continue;
          if (!shouldEscalateSla(ticket, escalationMinutes)) continue;

          const lang = resolveGuildLanguage(s);
          const ping = s.sla_escalation_role ? `<@&${s.sla_escalation_role}>` : (s.support_role ? `<@&${s.support_role}>` : null);
          const sent = await escalationChannel.send({
            content: ping || undefined,
            embeds: [new EmbedBuilder()
              .setColor(0xED4245)
              .setTitle(t(lang, "sla_escalation.title"))
              .setDescription(
                t(lang, "sla_escalation.description", {
                  channelId: ticket.channel_id,
                  ticketId: ticket.ticket_id,
                  limit: escalationMinutes,
                })
              )
              .addFields(
                { name: t(lang, "sla_escalation.user"), value: `<@${ticket.user_id}>`, inline: true },
                { name: t(lang, "sla_escalation.category"), value: ticket.category || "General", inline: true }
              )
              .setTimestamp()],
          }).then(() => true).catch(() => false);

          if (sent) {
            await tickets.markSlaEscalated(ticket.channel_id);
          }
        }
      });
    });
  });
}

module.exports = { register };
