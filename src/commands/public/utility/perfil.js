const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { levels } = require("../../../utils/database");
const { economy } = require("../../../utils/economy");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { localeMapFromKey } = require("../../../utils/slashLocalizations");

async function resolveName(guild, userId, lang = "en") {
  const member = await guild.members.fetch(userId).catch(() => null);
  return member?.displayName || t(lang, "profile.embed.user_fallback", { id: String(userId).slice(-4) });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("perfil")
    .setDescription("Perfil ultra simple: nivel + economia")
    .setDescriptionLocalizations(localeMapFromKey("profile.slash.description"))
    .addSubcommand((s) =>
      s
        .setName("ver")
        .setDescription("Ver tu perfil o el de otro usuario")
        .setDescriptionLocalizations(localeMapFromKey("profile.slash.subcommands.ver.description"))
        .addUserOption((o) =>
          o
            .setName("usuario")
            .setDescription("Usuario a consultar")
            .setDescriptionLocalizations(localeMapFromKey("profile.slash.options.usuario"))
            .setRequired(false)
        )
    )
    .addSubcommand((s) =>
      s
        .setName("top")
        .setDescription("Ver top rapido de niveles y economia")
        .setDescriptionLocalizations(localeMapFromKey("profile.slash.subcommands.top.description"))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const lang = resolveInteractionLanguage(interaction);
    const gid = interaction.guild.id;

    if (sub === "ver") {
      const target = interaction.options.getUser("usuario") || interaction.user;
      const [eco, lvl, rank] = await Promise.all([
        economy.get(gid, target.id),
        levels.get(gid, target.id),
        levels.getRank(gid, target.id),
      ]);

      const totalMoney = (eco?.wallet || 0) + (eco?.bank || 0);
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(t(lang, "profile.embed.title", { username: target.username }))
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: t(lang, "profile.embed.field_level"), value: `\`${lvl?.level || 0}\``, inline: true },
          { name: t(lang, "profile.embed.field_total_xp"), value: `\`${lvl?.total_xp || 0}\``, inline: true },
          { name: t(lang, "profile.embed.field_rank"), value: `\`#${rank || "?"}\``, inline: true },
          { name: t(lang, "profile.embed.field_wallet"), value: `\`${eco?.wallet || 0}\` ${t(lang, "common.currency.coins")}`, inline: true },
          { name: t(lang, "profile.embed.field_bank"), value: `\`${eco?.bank || 0}\` ${t(lang, "common.currency.coins")}`, inline: true },
          { name: t(lang, "profile.embed.field_total"), value: `\`${totalMoney}\` ${t(lang, "common.currency.coins")}`, inline: true }
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    await interaction.deferReply();

    const [topLevels, topEco] = await Promise.all([
      levels.getLeaderboard(gid, 5),
      economy.getLeaderboard(gid, 5),
    ]);

    const levelLines = await Promise.all(
      topLevels.map(async (row, i) => `${i + 1}. **${await resolveName(interaction.guild, row.user_id, lang)}** - ${t(lang, "profile.embed.level_format", { level: row.level })}`)
    );
    const ecoLines = await Promise.all(
      topEco.map(async (row, i) => `${i + 1}. **${await resolveName(interaction.guild, row.user_id, lang)}** - ${t(lang, "profile.embed.coins_format", { amount: (row.total_earned || 0).toLocaleString() })}`)
    );

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle(t(lang, "profile.embed.top_title"))
      .addFields(
        { name: t(lang, "profile.embed.top_levels"), value: levelLines.join("\n") || t(lang, "profile.embed.no_data"), inline: false },
        { name: t(lang, "profile.embed.top_economy"), value: ecoLines.join("\n") || t(lang, "profile.embed.no_data"), inline: false }
      )
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  },
};
