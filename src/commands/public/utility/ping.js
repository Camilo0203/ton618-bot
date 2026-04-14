const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { getGuildSettings, getOwnerId } = require("../../../utils/accessControl");
const { COLORS, BRAND, ICONS, addStandardFooter } = require("../../../utils/brand");

function formatUptime(ms) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return String(num);
}

function resolvePingColor(pingMs) {
  if (pingMs > 200) return COLORS.ERROR;     // High latency - red
  if (pingMs > 100) return COLORS.WARNING;   // Medium latency - yellow
  return COLORS.SUCCESS;                      // Good latency - green
}

module.exports = {
  access: "owner",
  meta: {
    hidden: true,
    privateOnly: true,
  },
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("View bot latency and stats")
    .setDescriptionLocalizations({
      "es-ES": "Ver latencia y estadisticas del bot",
      "en-US": "View bot latency and stats",
      "en-GB": "View bot latency and stats",
    }),

  async execute(interaction) {
    const ownerId = getOwnerId(interaction.client);
    if (ownerId && interaction.user?.id !== ownerId) {
      const guildSettings = interaction.guildId ? await getGuildSettings(interaction.guildId) : null;
      const language = resolveInteractionLanguage(interaction, guildSettings);
      await interaction.reply({
        content: t(language, "poll.errors.owner_only"),
        flags: 64,
      });
      return;
    }

    const guildSettings = interaction.guildId ? await getGuildSettings(interaction.guildId) : null;
    const language = resolveInteractionLanguage(interaction, guildSettings);
    const pingMs = interaction.client.ws.ping;
    const uptimeMs = interaction.client.uptime || 0;
    const pingColor = resolvePingColor(pingMs);

    const totalMembers = [...interaction.client.guilds.cache.values()].reduce(
      (acc, guild) => acc + (guild.memberCount || 0), 0
    );

    const embed = new EmbedBuilder()
      .setTitle(`${ICONS.bot} ${t(language, "ping.title")}`)
      .setDescription(`**${BRAND.NAME}** ${BRAND.VERSION}`)
      .setColor(pingColor)
      .addFields(
        { name: `${ICONS.zap} ${t(language, "ping.field.latency")}`, value: `\`${pingMs}ms\``, inline: true },
        { name: `${ICONS.clock} ${t(language, "ping.field.uptime")}`, value: `\`${formatUptime(uptimeMs)}\``, inline: true },
        { name: `${ICONS.guild} ${t(language, "ping.field.guilds")}`, value: `\`${interaction.client.guilds.cache.size}\``, inline: true },
        { name: `${ICONS.user} Users`, value: `\`${formatNumber(totalMembers)}\``, inline: true },
        { name: `${ICONS.channel} Channels`, value: `\`${interaction.client.channels.cache.size}\``, inline: true },
        { name: `${ICONS.heart} Status`, value: "`Operational`", inline: true }
      )
      .setTimestamp();

    addStandardFooter(embed, language);

    await interaction.reply({ embeds: [embed] });
  },
};
