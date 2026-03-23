"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { tickets } = require("../utils/database");
const { getGuildSettings } = require("../utils/accessControl");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { resolveGuildChannel } = require("./common");

function register(client) {
  cron.schedule("15 9 * * *", async () => {
    await runSingleFlight("daily.sla_report", async () => {
      await runGuildTask(client, "daily.sla_report", async (guild) => {
        const s = await getGuildSettings(guild.id);
        if (!s || s.daily_sla_report_enabled !== true) return;

        const channelId = s.daily_sla_report_channel || s.log_channel || s.weekly_report_channel || null;
        if (!channelId) return;
        const channel = await resolveGuildChannel(guild, channelId);
        if (!channel) return;

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
          : "Sin cierres en las ultimas 24h";

        const avgText = metrics.avgFirstResponseMinutes === null
          ? "Sin datos"
          : `${metrics.avgFirstResponseMinutes} min`;
        const withinText = metrics.withinSlaPct === null
          ? "Sin umbral SLA"
          : `${metrics.withinSlaPct}%`;
        const fromTs = Math.floor(from.getTime() / 1000);
        const toTs = Math.floor(to.getTime() / 1000);

        await channel.send({
          embeds: [new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("Reporte diario SLA y productividad")
            .setDescription(`Ventana: <t:${fromTs}:f> - <t:${toTs}:f>`)
            .addFields(
              { name: "Tickets abiertos (24h)", value: String(summary.opened), inline: true },
              { name: "Tickets cerrados (24h)", value: String(summary.closed), inline: true },
              { name: "Primera respuesta promedio", value: avgText, inline: true },
              { name: "Abiertos fuera de SLA", value: String(metrics.openBreached), inline: true },
              { name: "Abiertos escalados", value: String(metrics.escalatedOpen), inline: true },
              { name: "Cumplimiento SLA", value: withinText, inline: true },
              { name: "Top staff por cierres", value: topStaffText, inline: false }
            )
            .setTimestamp()],
        }).catch(() => {});
      });
    });
  });
}

module.exports = { register };
