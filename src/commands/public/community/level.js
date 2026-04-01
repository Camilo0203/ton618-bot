"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { levels, levelSettings, settings } = require("../../../utils/database");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("View level and XP information")
    .addSubcommand(sub =>
      sub
        .setName("view")
        .setDescription("View your level or another user's level")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to view level for (default: yourself)")
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("rank")
        .setDescription("View your rank on the leaderboard")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to view rank for (default: yourself)")
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("leaderboard")
        .setDescription("View the server leaderboard")
        .addIntegerOption(opt =>
          opt
            .setName("page")
            .setDescription("Page number to view")
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
        content: t(lang, "level.errors.disabled"),
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
        content: t(lang, "level.errors.user_not_found"),
        ephemeral: true
      });
    }

    const userData = await levels.get(interaction.guildId, targetUser.id);
    const level = userData.level || 0;
    const totalXp = userData.total_xp || 0;
    const messages = userData.messages || 0;

    // Calcular XP para el siguiente nivel
    const xpForCurrentLevel = levels.xpForLevel(level);
    const xpForNextLevel = levels.xpForLevel(level + 1);
    const xpProgress = totalXp - levels.xpForLevel(level);
    const xpNeeded = xpForNextLevel;
    const progressPercent = Math.floor((xpProgress / xpNeeded) * 100);

    // Crear barra de progreso
    const barLength = 20;
    const filledBars = Math.floor((progressPercent / 100) * barLength);
    const emptyBars = barLength - filledBars;
    const progressBar = "█".repeat(filledBars) + "░".repeat(emptyBars);

    const embed = new EmbedBuilder()
      .setAuthor({ 
        name: targetUser.tag, 
        iconURL: targetUser.displayAvatarURL() 
      })
      .setColor(member.displayHexColor || 0x5865F2)
      .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
      .addFields(
        { 
          name: t(lang, "level.embed.level"), 
          value: `**${level}**`, 
          inline: true 
        },
        { 
          name: t(lang, "level.embed.total_xp"), 
          value: `**${totalXp.toLocaleString()}** XP`, 
          inline: true 
        },
        { 
          name: t(lang, "level.embed.messages"), 
          value: `**${messages.toLocaleString()}**`, 
          inline: true 
        },
        { 
          name: t(lang, "level.embed.progress"), 
          value: `${progressBar}\n${xpProgress.toLocaleString()} / ${xpNeeded.toLocaleString()} XP (${progressPercent}%)`,
          inline: false 
        }
      )
      .setFooter({ text: t(lang, "level.embed.footer") })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },

  async handleRank(interaction, lang) {
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: t(lang, "level.errors.user_not_found"),
        ephemeral: true
      });
    }

    const userData = await levels.get(interaction.guildId, targetUser.id);
    const rank = await levels.getRank(interaction.guildId, targetUser.id);

    if (!rank) {
      return interaction.reply({
        content: t(lang, "level.errors.no_rank"),
        ephemeral: true
      });
    }

    const level = userData.level || 0;
    const totalXp = userData.total_xp || 0;

    const embed = new EmbedBuilder()
      .setAuthor({ 
        name: targetUser.tag, 
        iconURL: targetUser.displayAvatarURL() 
      })
      .setColor(member.displayHexColor || 0x5865F2)
      .setDescription(
        `${t(lang, "level.rank.description", { 
          rank: `**#${rank}**`, 
          level: `**${level}**`, 
          xp: `**${totalXp.toLocaleString()}**` 
        })}`
      )
      .setThumbnail(targetUser.displayAvatarURL({ size: 128 }))
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
        content: t(lang, "level.errors.invalid_page", { max: totalPages })
      });
    }

    const pageUsers = allUsers.slice(skip, skip + perPage);

    if (pageUsers.length === 0) {
      return interaction.editReply({
        content: t(lang, "level.errors.no_data")
      });
    }

    let description = "";
    for (let i = 0; i < pageUsers.length; i++) {
      const userData = pageUsers[i];
      const position = skip + i + 1;
      const user = await interaction.client.users.fetch(userData.user_id).catch(() => null);
      const username = user ? user.tag : t(lang, "level.leaderboard.unknown_user");
      
      let medal = "";
      if (position === 1) medal = "🥇";
      else if (position === 2) medal = "🥈";
      else if (position === 3) medal = "🥉";
      else medal = `**${position}.**`;

      description += `${medal} ${username}\n`;
      description += `└ ${t(lang, "level.leaderboard.stats", { 
        level: userData.level || 0, 
        xp: (userData.total_xp || 0).toLocaleString() 
      })}\n\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle(`📊 ${t(lang, "level.leaderboard.title")}`)
      .setDescription(description)
      .setColor(0x5865F2)
      .setFooter({ 
        text: t(lang, "level.leaderboard.footer", { 
          page, 
          total: totalPages, 
          users: allUsers.length 
        }) 
      })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
