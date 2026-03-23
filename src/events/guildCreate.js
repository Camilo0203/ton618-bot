const { queueBotStatsSync } = require("../utils/botStatsSync");
const { queueDashboardBridgeSync } = require("../utils/dashboardBridgeSync");

module.exports = {
  name: "guildCreate",
  async execute(guild, client) {
    queueBotStatsSync(client, {
      reason: `guildCreate:${guild.id}`,
      delayMs: 1000,
    });
    queueDashboardBridgeSync(client, {
      reason: `guildCreate:${guild.id}`,
      delayMs: 1500,
    });
  },
};
