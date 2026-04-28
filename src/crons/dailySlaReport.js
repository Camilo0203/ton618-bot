"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { tickets } = require("../utils/database");
const { getGuildSettings } = require("../utils/accessControl");
const { hasRequiredPlan } = require("../utils/commercial");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { resolveGuildChannel } = require("./common");
const { resolveGuildLanguage, t } = require("../utils/i18n");

function register(client) {
  cron.schedule("15 9 * * *", async () => {
    await runSingleFlight("daily.sla_report", async () => {
      await runGuildTask(client, "daily.sla_report", async (guild) => {
        const s = await getGuildSettings(guild.id);
        if (!s || s.daily_sla_report_enabled !== true) return;
        if (!hasRequiredPlan(s, "pro")) return;

        const channelId = s.daily_sla_report_channel || s.log_channel || s.weekly_report_channel || null;
        if (!channelId) return;
        const channel = await resolveGuildChannel(guild, channelId);
        if (!channel) return;

        const lang = resolveGuildLanguage(s);
        const from = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const to = new Date();

        const slaHours = s.sla_hours || 0;
        const baseSlaMinutes = slaHours > 0 ? slaHours * 60 : (s.sla_minutes || 0);
        const slaSettings = baseSlaMinutes !== (s.sla_minutes || 0)
          ? { ...s, sla_minutes: baseSlaMinutes }
          : s;

        const [summary, metrics] = await Promise.all([
          tickets.getDailySummary(guild.id, { from, to }),
          tickets.getSlaMetrics(guild.id, baseSlaMinutes, slaSettings),
        ]);

        const topStaffText = summary.topStaff.length
          ? summary.topStaff
            .map((entry, index) => `${index + 1}. <@${entry.staff_id}> (${entry.closed})`)
            .join("\n")
          : t(lang, "daily_sla_report.no_closures");

        const avgText = metrics.avgFirstResponseMinutes === null
          ? t(lang, "daily_sla_report.no_data")
          : `${metrics.avgFirstResponseMinutes} min`;
        const withinText = metrics.withinSlaPct === null
          ? t(lang, "daily_sla_report.no_sla_threshold")
          : `${metrics.withinSlaPct}%`;
        const fromTs = Math.floor(from.getTime() / 1000);
        const toTs = Math.floor(to.getTime() / 1000);

        await channel.send({
          embeds: [new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(t(lang, "daily_sla_report.title"))
            .setDescription(t(lang, "daily_sla_report.window", { from: `<t:${fromTs}:f>`, to: `<t:${toTs}:f>` }))
            .addFields(
              { name: t(lang, "daily_sla_report.opened_24h"), value: String(summary.opened), inline: true },
              { name: t(lang, "daily_sla_report.closed_24h"), value: String(summary.closed), inline: true },
              { name: t(lang, "daily_sla_report.avg_first_response"), value: avgText, inline: true },
              { name: t(lang, "daily_sla_report.open_out_of_sla"), value: String(metrics.openBreached), inline: true },
              { name: t(lang, "daily_sla_report.open_escalated"), value: String(metrics.escalatedOpen), inline: true },
              { name: t(lang, "daily_sla_report.sla_compliance"), value: withinText, inline: true },
              { name: t(lang, "daily_sla_report.top_staff"), value: topStaffText, inline: false }
            )
            .setTimestamp()],
        }).catch((err) => { console.error("[dailySlaReport] suppressed error:", err?.message || err); });
      });
    });
  });
}

module.exports = { register };

