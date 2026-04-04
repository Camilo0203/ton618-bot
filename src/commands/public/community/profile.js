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
    .setName("profile")
    .setDescription("Ultra simple profile: level + economy")
    .setDescriptionLocalizations(localeMapFromKey("profile.slash.description"))
    .addSubcommand((s) =>
      s
        .setName("view")
        .setDescription("View your profile or another user's")
        .setDescriptionLocalizations(localeMapFromKey("profile.slash.subcommands.view.description"))
        .addUserOption((o) =>
          o
            .setName("user")
            .setDescription("User to query")
            .setDescriptionLocalizations(localeMapFromKey("profile.slash.options.user"))
            .setRequired(false)
        )
    )
    .addSubcommand((s) =>
      s
        .setName("top")
        .setDescription("View quick leaderboard of levels and economy")
        .setDescriptionLocalizations(localeMapFromKey("profile.slash.subcommands.top.description"))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const lang = resolveInteractionLanguage(interaction);
    const gid = interaction.guild.id;

    if (sub === "view") {
      const target = interaction.options.getUser("user") || interaction.user;
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
