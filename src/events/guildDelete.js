const { queueBotStatsSync } = require("../utils/botStatsSync");
const { removeGuildFromDashboard } = require("../utils/dashboardBridgeSync");

module.exports = {
  name: "guildDelete",
  async execute(guild, client) {
    queueBotStatsSync(client, {
      reason: `guildDelete:${guild.id}`,
      delayMs: 1000,
    });
    await removeGuildFromDashboard(guild.id);
  },
};
