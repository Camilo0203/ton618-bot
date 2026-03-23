"use strict";

const cron = require("node-cron");
const { tickets, staffStats } = require("../utils/database");
const { getGuildSettings } = require("../utils/accessControl");
const { weeklyReportEmbed } = require("../utils/embeds");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { safeRun } = require("./common");

function register(client) {
  cron.schedule("0 9 * * 1", async () => {
    await runSingleFlight("weekly.report", async () => {
      await runGuildTask(client, "weekly.report", async (guild) => {
        const s = await getGuildSettings(guild.id);
        if (!s || !s.weekly_report_channel) return;
        const channel = guild.channels.cache.get(s.weekly_report_channel);
        if (!channel) return;

        await safeRun("WEEKLY REPORT", async () => {
          const stats = await tickets.getStats(guild.id);
          const leaderboard = await staffStats.getLeaderboard(guild.id);
          await channel.send({ embeds: [weeklyReportEmbed(stats, guild, leaderboard)] });
        });
      });
    });
  });
}

module.exports = { register };
