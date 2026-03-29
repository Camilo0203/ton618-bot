const { queueBotStatsSync } = require("../utils/botStatsSync");
const { queueDashboardBridgeSync } = require("../utils/dashboardBridgeSync");
const { sendGuildLanguageOnboarding } = require("../utils/guildOnboarding");

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

    await sendGuildLanguageOnboarding(guild).catch((error) => {
      console.error("[GUILD LANGUAGE ONBOARDING ERROR]", error?.message || error);
    });
  },
};
