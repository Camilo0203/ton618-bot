"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { levels, levelSettings, settings } = require("../../../utils/database");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");
const { localeMapFromKey } = require("../../../utils/slashLocalizations");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("View level and XP information")
    .setDescriptionLocalizations(localeMapFromKey("leveling.slash.description"))
    .addSubcommand(sub =>
      sub
        .setName("view")
        .setDescription("View your level or another user's level")
        .setDescriptionLocalizations(localeMapFromKey("leveling.slash.subcommands.view.description"))
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to view level for (default: yourself)")
            .setDescriptionLocalizations(localeMapFromKey("leveling.slash.options.user"))
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("rank")
        .setDescription("View your rank on the leaderboard")
        .setDescriptionLocalizations(localeMapFromKey("leveling.slash.subcommands.rank.description"))
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to view rank for (default: yourself)")
            .setDescriptionLocalizations(localeMapFromKey("leveling.slash.options.user"))
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("leaderboard")
        .setDescription("View the server leaderboard")
        .setDescriptionLocalizations(localeMapFromKey("leveling.slash.subcommands.leaderboard.description"))
        .addIntegerOption(opt =>
          opt
            .setName("page")
            .setDescription("Page number to view")
            .setDescriptionLocalizations(localeMapFromKey("leveling.slash.options.page"))
            .setMinValue(1)
        )
    ),

  async execute(interaction) {
    const guildSettings = await settings.get(interaction.guildId);
    const lang = resolveGuildLanguage(guildSettings);

    // Verificar si el sistema de niveles está habilitado
    const levelConfig = await levelSettings.get(interaction.guildId);
    if (!levelConfig || !levelConfig.enabled) {
      return interaction.reply({
        content: t(lang, "leveling.status_disabled"),
        ephemeral: true
      });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "view") {
      return this.handleView(interaction, lang);
    } else if (subcommand === "rank") {
      return this.handleRank(interaction, lang);
    } else if (subcommand === "leaderboard") {
      return this.handleLeaderboard(interaction, lang);
    }
  },

  async handleView(interaction, lang) {
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: t(lang, "leveling.user_not_found"),
        ephemeral: true
      });
    }

    const userData = await levels.get(interaction.guildId, targetUser.id);
    const level = userData.level || 0;
    const totalXp = userData.total_xp || 0;

    // Calcular XP para el siguiente nivel
    const xpForNextLevel = levels.xpForLevel(level + 1);
    const xpProgress = totalXp - levels.xpForLevel(level);
    const progressPercent = Math.floor((xpProgress / xpForNextLevel) * 100) || 0;

    // Crear barra de progreso
    const barLength = 20;
    const filledBars = Math.floor((progressPercent / 100) * barLength);
    const emptyBars = barLength - filledBars;
    const progressBar = "█".repeat(filledBars) + "░".repeat(Math.max(0, emptyBars));

    const embed = new EmbedBuilder()
      .setAuthor({ 
        name: targetUser.tag, 
        iconURL: targetUser.displayAvatarURL() 
      })
      .setColor(member.displayHexColor || 0x5865F2)
      .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
      .setTitle(t(lang, "leveling.embed.title", { user: targetUser.username }))
      .addFields(
        { 
          name: t(lang, "leveling.embed.field_level_name"), 
          value: `**${level}**`, 
          inline: true 
        },
        { 
          name: t(lang, "leveling.embed.field_total_xp_name"), 
          value: `**${totalXp.toLocaleString()}** XP`, 
          inline: true 
        },
        { 
          name: t(lang, "leveling.embed.field_progress_name"), 
          value: `${progressBar}\n${xpProgress.toLocaleString()} / ${xpForNextLevel.toLocaleString()} XP (${progressPercent}%)`,
          inline: false 
        }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async handleRank(interaction, lang) {
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: t(lang, "leveling.user_not_found"),
        ephemeral: true
      });
    }

    const userData = await levels.get(interaction.guildId, targetUser.id);
    const rank = await levels.getRank(interaction.guildId, targetUser.id);

    if (!rank) {
      return interaction.reply({
        content: t(lang, "leveling.rank.no_xp"),
        ephemeral: true
      });
    }

    const totalMembers = interaction.guild.memberCount;
    const page = Math.ceil(rank / 10);

    const embed = new EmbedBuilder()
      .setAuthor({ 
        name: targetUser.tag, 
        iconURL: targetUser.displayAvatarURL() 
      })
      .setTitle(t(lang, "leveling.rank.title", { user: targetUser.username }))
      .setColor(member.displayHexColor || 0x5865F2)
      .setDescription(
        t(lang, "leveling.rank.description", { 
          rank: rank, 
          total: totalMembers,
          page: page
        })
      )
      .setThumbnail(targetUser.displayAvatarURL({ size: 128 }))
      .setFooter({
        text: t(lang, "leveling.rank.footer", {
          xp: (userData.total_xp || 0).toLocaleString(),
          next: levels.xpForLevel((userData.level || 0) + 1).toLocaleString(),
          remaining: (levels.xpForLevel((userData.level || 0) + 1) - (userData.total_xp || 0)).toLocaleString()
        })
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async handleLeaderboard(interaction, lang) {
    await interaction.deferReply();

    const page = interaction.options.getInteger("page") || 1;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const allUsers = await levels.getLeaderboard(interaction.guildId, 1000);
    const totalPages = Math.ceil(allUsers.length / perPage);

    if (page > totalPages && totalPages > 0) {
      return interaction.editReply({
        content: `❌ Max page is ${totalPages}`
      });
    }

    const pageUsers = allUsers.slice(skip, skip + perPage);

    if (pageUsers.length === 0) {
      return interaction.editReply({
        content: t(lang, "leveling.leaderboard.empty")
      });
    }

    let description = "";
    for (let i = 0; i < pageUsers.length; i++) {
        const userData = pageUsers[i];
        const position = skip + i + 1;
        const user = await interaction.client.users.fetch(userData.user_id).catch(() => null);
        const username = user ? user.tag : `User ${userData.user_id}`;
        
        let medal = "";
        if (position === 1) medal = "🥇";
        else if (position === 2) medal = "🥈";
        else if (position === 3) medal = "🥉";
        else medal = `**${position}.**`;

        description += `${medal} ${username} - Lv ${userData.level || 0} (${(userData.total_xp || 0).toLocaleString()} XP)\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle(t(lang, "leveling.leaderboard.title", { guild: interaction.guild.name }))
      .setDescription(description)
      .setColor(0x5865F2)
      .setFooter({ 
        text: t(lang, "profile.embed.page_format", { 
          current: page, 
          total: totalPages || 1
        }) 
      })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
