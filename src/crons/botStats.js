"use strict";

const { getDB } = require("../utils/database");
const { logStructured } = require("../utils/observability");

function register(client) {
  let firstStatsSync = true;

  const saveStats = async () => {
    try {
      const db = getDB();
      const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

      await db.collection("botStats").updateOne(
        { id: "main" },
        {
          $set: {
            botName: client.user.username,
            botAvatar: client.user.displayAvatarURL({ format: "png", size: 256 }),
            serverCount: client.guilds.cache.size,
            userCount: totalUsers,
            ping: client.ws.ping,
            uptime: process.uptime(),
          },
        },
        { upsert: true }
      );

      if (firstStatsSync) {
        logStructured("info", "cron.bot_stats.first_sync", { serverCount: client.guilds.cache.size });
        firstStatsSync = false;
      }
    } catch (error) {
      logStructured("error", "cron.bot_stats.save_failed", { error: error?.message || String(error) });
    }
  };

  void saveStats();
  const statsInterval = setInterval(() => void saveStats(), 60000);
  if (typeof statsInterval.unref === "function") statsInterval.unref();
}

module.exports = { register };
