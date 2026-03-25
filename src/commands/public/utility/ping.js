const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { getGuildSettings } = require("../../../utils/accessControl");

function formatUptime(ms) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function resolvePingColor(pingMs) {
  if (pingMs > 200) return 0xed4245;
  if (pingMs > 100) return 0xfee75c;
  return 0x57f287;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ver latencia y estadisticas del bot")
    .setDescriptionLocalizations({
      "en-US": "View bot latency and stats",
      "en-GB": "View bot latency and stats",
    }),

  async execute(interaction) {
    const SUPPORT_SERVER_ID = "1214106731022655488";
    
    if (interaction.guildId !== SUPPORT_SERVER_ID) {
      return interaction.reply({
        content: "❌ Este comando solo está disponible en el servidor de soporte del bot.",
        ephemeral: true
      });
    }

    const guildSettings = interaction.guildId ? await getGuildSettings(interaction.guildId) : null;
    const language = resolveInteractionLanguage(interaction, guildSettings);
    const pingMs = interaction.client.ws.ping;
    const uptimeMs = interaction.client.uptime || 0;
    const pingColor = resolvePingColor(pingMs);

    const embed = new EmbedBuilder()
      .setTitle(t(language, "ping.title"))
      .setColor(pingColor)
      .addFields(
        { name: t(language, "ping.field.latency"), value: `\`${pingMs}ms\``, inline: true },
        { name: t(language, "ping.field.uptime"), value: `\`${formatUptime(uptimeMs)}\``, inline: true },
        { name: t(language, "ping.field.guilds"), value: `\`${interaction.client.guilds.cache.size}\``, inline: true },
        { name: t(language, "ping.field.users"), value: `\`${interaction.client.users.cache.size}\``, inline: true },
        { name: t(language, "ping.field.channels"), value: `\`${interaction.client.channels.cache.size}\``, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
