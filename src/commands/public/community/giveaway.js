"use strict";

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { giveaways, settings } = require("../../../utils/database");
const { parseDuration, getFutureDate, validateDuration, getTimeRemaining, formatDuration } = require("../../../utils/parseDuration");
const { requireSupportServer } = require("../../../utils/supportServerOnly");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");
const { localeMapFromKey, localizedChoice } = require("../../../utils/slashLocalizations");
const logger = require("../../../utils/structuredLogger");

// Helper para limpiar ID de rol (quitar <@&, @, >, etc.)
function cleanRoleId(value) {
  if (!value) return value;
  // Remover <@&, <@, @, >, y espacios
  return value.replace(/[<@>&>]/g, '').trim();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Manage giveaways in the support server")
    .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub
        .setName("create")
        .setDescription("Create a new giveaway")
        .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.subcommands.create.description"))
        .addStringOption(opt =>
          opt
            .setName("prize")
            .setDescription("What are you giving away?")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.prize"))
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("duration")
            .setDescription("How long should the giveaway last? (e.g., 30s, 5m, 2h, 1d, 1w)")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.duration"))
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName("winners")
            .setDescription("Number of winners")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.winners"))
            .setMinValue(1)
            .setMaxValue(20)
        )
        .addChannelOption(opt =>
          opt
            .setName("channel")
            .setDescription("Channel to post the giveaway in (default: current)")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.channel"))
        )
        .addStringOption(opt =>
          opt
            .setName("requirement_type")
            .setDescription("Type of requirement to enter")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.requirement_type"))
            .addChoices(
              localizedChoice("none", "giveaway.choices.requirement_none"),
              localizedChoice("role", "giveaway.choices.requirement_role"),
              localizedChoice("level", "giveaway.choices.requirement_level"),
              localizedChoice("account_age", "giveaway.choices.requirement_account_age")
            )
        )
        .addStringOption(opt =>
          opt
            .setName("requirement_value")
            .setDescription("Value for the requirement (role ID, level number, or days)")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.requirement_value"))
        )
        .addStringOption(opt =>
          opt
            .setName("emoji")
            .setDescription("Emoji to react with (default: 🎉)")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.emoji"))
        )
        .addStringOption(opt =>
          opt
            .setName("description")
            .setDescription("Additional description for the giveaway")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.description"))
        )
        .addRoleOption(opt =>
          opt
            .setName("required_role_2")
            .setDescription("Additional role requirement (Pro)")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.required_role_2"))
        )
        .addRoleOption(opt =>
          opt
            .setName("bonus_role")
            .setDescription("Role that gives more chances to win (Pro)")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.bonus_role"))
        )
        .addIntegerOption(opt =>
          opt
            .setName("bonus_weight")
            .setDescription("Weight for the bonus role (e.g. 2 means double chance) (Pro)")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.bonus_weight"))
            .setMinValue(2)
            .setMaxValue(10)
        )
        .addIntegerOption(opt =>
          opt
            .setName("min_account_age")
            .setDescription("Minimum account age in days (Pro)")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.min_account_age"))
            .setMinValue(1)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("end")
        .setDescription("End a giveaway early")
        .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.subcommands.end.description"))
        .addStringOption(opt =>
          opt
            .setName("message_id")
            .setDescription("Message ID of the giveaway to end")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.message_id"))
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("reroll")
        .setDescription("Reroll winners for a giveaway")
        .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.subcommands.reroll.description"))
        .addStringOption(opt =>
          opt
            .setName("message_id")
            .setDescription("Message ID of the giveaway to reroll")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.message_id"))
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName("winners")
            .setDescription("Number of new winners to pick")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.winners"))
            .setMinValue(1)
            .setMaxValue(20)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("list")
        .setDescription("List all active giveaways")
        .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.subcommands.list.description"))
    )
    .addSubcommand(sub =>
      sub
        .setName("cancel")
        .setDescription("Cancel a giveaway without picking winners")
        .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.subcommands.cancel.description"))
        .addStringOption(opt =>
          opt
            .setName("message_id")
            .setDescription("Message ID of the giveaway to cancel")
            .setDescriptionLocalizations(localeMapFromKey("giveaway.slash.options.message_id"))
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const isAllowed = await requireSupportServer(interaction);
    if (!isAllowed) return;

    const guildSettings = await settings.get(interaction.guildId);
    const lang = resolveGuildLanguage(guildSettings);

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "create") {
      return this.handleCreate(interaction, lang);
    } else if (subcommand === "end") {
      return this.handleEnd(interaction, lang);
    } else if (subcommand === "reroll") {
      return this.handleReroll(interaction, lang);
    } else if (subcommand === "list") {
      return this.handleList(interaction, lang);
    } else if (subcommand === "cancel") {
      return this.handleCancel(interaction, lang);
    }
  },

  async handleCreate(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const prize = interaction.options.getString("prize");
    const durationStr = interaction.options.getString("duration");
    const winnersCount = interaction.options.getInteger("winners") || 1;
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const requirementType = interaction.options.getString("requirement_type") || "none";
    const requirementValue = interaction.options.getString("requirement_value");
    const emoji = interaction.options.getString("emoji") || "🎉";
    const description = interaction.options.getString("description");
    
    // Pro Options
    const requiredRole2 = interaction.options.getRole("required_role_2");
    const bonusRole = interaction.options.getRole("bonus_role");
    const bonusWeight = interaction.options.getInteger("bonus_weight") || 1;
    const minAccountAge = interaction.options.getInteger("min_account_age");

    const { getMembershipStatus } = require("../../../utils/membershipReminders");
    const status = await getMembershipStatus(interaction.guildId);

    if ((requiredRole2 || bonusRole || minAccountAge) && !status.isPro) {
      return interaction.editReply({
        content: t(lang, "poll.errors.pro_required"), // Re-using pro_required key
        ephemeral: true
      });
    }

    const validation = validateDuration(durationStr, 60000, 30 * 24 * 60 * 60 * 1000);
    if (!validation.valid) {
      return interaction.editReply({
        content: validation.error,
        ephemeral: true
      });
    }

    const endDate = getFutureDate(durationStr);

    const requirements = { 
      type: requirementType,
      required_role_2: requiredRole2?.id || null,
      bonus_role: bonusRole?.id || null,
      bonus_weight: bonusWeight,
      min_account_age_days_extra: minAccountAge || null
    };

    if (requirementType !== "none" && requirementValue) {
      if (requirementType === "role") {
        // Limpiar el ID del rol (quitar @, <@&, >, etc.)
        const cleanedRoleId = cleanRoleId(requirementValue);
        requirements.role_id = cleanedRoleId;
      } else if (requirementType === "level") {
        requirements.min_level = parseInt(requirementValue, 10);
      } else if (requirementType === "account_age") {
        requirements.min_account_age_days = parseInt(requirementValue, 10);
      }
    }

    const embed = new EmbedBuilder()
      .setTitle(t(lang, "giveaway.embed.title"))
      .setDescription(
        `**${t(lang, "giveaway.embed.prize")}:** ${prize}\n` +
        (description ? `${description}\n\n` : '\n') +
        `**${t(lang, "giveaway.embed.winners")}:** ${winnersCount}\n` +
        `**${t(lang, "giveaway.embed.ends")}:** <t:${Math.floor(endDate.getTime() / 1000)}:R>\n` +
        `**${t(lang, "giveaway.embed.hosted_by")}:** ${interaction.user}\n\n` +
        t(lang, "giveaway.embed.click_participant")
      )
      .setColor(0x00AE86)
      .setFooter({ 
        text: `${winnersCount} ${winnersCount > 1 ? t(lang, "giveaway.embed.winners") : t(lang, "giveaway.embed.winners").slice(0, -1)} | ${t(lang, "giveaway.embed.ends")}` 
      })
      .setTimestamp(endDate);

    if (requirementType !== "none" || requiredRole2 || bonusRole || minAccountAge) {
      let reqLines = [];
      
      if (requirementType === "role") {
        reqLines.push(t(lang, "giveaway.requirements.role", { role: `<@&${requirements.role_id}>` }));
      } else if (requirementType === "level") {
        reqLines.push(t(lang, "giveaway.requirements.level", { level: requirementValue }));
      } else if (requirementType === "account_age") {
        reqLines.push(t(lang, "giveaway.requirements.account_age", { days: requirementValue }));
      }

      if (requiredRole2) {
        reqLines.push(t(lang, "giveaway.success.requirement_role_2", { roleId: requiredRole2.id }));
      }

      if (minAccountAge && requirementType !== "account_age") {
        reqLines.push(t(lang, "giveaway.requirements.account_age", { days: minAccountAge }));
      }

      if (bonusRole) {
        reqLines.push(t(lang, "giveaway.success.requirement_bonus", { roleId: bonusRole.id, weight: bonusWeight }));
      }

      embed.addFields({ name: t(lang, "giveaway.embed.requirements"), value: reqLines.join("\n") });
    }

    try {
      const message = await channel.send({ embeds: [embed] });
      
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`giveaway_enter_${message.id}`)
            .setLabel(t(lang, "giveaway.embed.participate_label"))
            .setStyle(ButtonStyle.Primary)
        );
      
      await message.edit({ components: [row] });
      await message.react(emoji);

      await giveaways.create({
        message_id: message.id,
        channel_id: channel.id,
        guild_id: interaction.guildId,
        prize: prize,
        description: description,
        winners_count: winnersCount,
        created_by: interaction.user.id,
        host_user_id: interaction.user.id,
        emoji: emoji,
        requirements: requirements,
        end_at: endDate.toISOString(),
      });

      return interaction.editReply({
        content: t(lang, "giveaway.success.created", { channel: channel.toString(), url: message.url }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('giveaway', 'Error creating giveaway', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "giveaway.errors.create_failed"),
        ephemeral: true
      });
    }
  },

  async handleEnd(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const messageId = interaction.options.getString("message_id");

    const giveaway = await giveaways.getByMessage(messageId);
    if (!giveaway) {
      return interaction.editReply({
        content: t(lang, "giveaway.errors.not_found"),
        ephemeral: true
      });
    }

    if (giveaway.ended) {
      return interaction.editReply({
        content: t(lang, "giveaway.errors.already_ended"),
        ephemeral: true
      });
    }

    try {
      const channel = await interaction.client.channels.fetch(giveaway.channel_id);
      const message = await channel.messages.fetch(messageId);

      const winners = await this.selectWinners(message, giveaway, interaction.guild);

      if (winners.length === 0) {
        await giveaways.markEnded(messageId, []);
        
        const embed = EmbedBuilder.from(message.embeds[0])
          .setDescription(message.embeds[0].description + `\n\n**${t(lang, "giveaway.embed.status_ended")}:** ${t(lang, "giveaway.embed.status_no_participants")}`)
          .setColor(0xFF0000);

        await message.edit({ embeds: [embed] });

        return interaction.editReply({
          content: t(lang, "giveaway.errors.no_participants"),
          ephemeral: true
        });
      }

      const winnerIds = winners.map(w => w.id);
      await giveaways.markEnded(messageId, winnerIds);

      const embed = EmbedBuilder.from(message.embeds[0])
        .setDescription(
          message.embeds[0].description + 
          `\n\n**${t(lang, "giveaway.embed.status_ended")}**\n**${t(lang, "giveaway.embed.winners")}:** ${winners.map(w => w.toString()).join(", ")}`
        )
        .setColor(0xFFD700);

      await message.edit({ embeds: [embed] });

      await channel.send({
        content: t(lang, "giveaway.embed.winners_announcement", { 
          winners: winners.map(w => w.toString()).join(", "),
          prize: giveaway.prize
        })
      });

      return interaction.editReply({
        content: t(lang, "giveaway.success.ended", { winners: winners.map(w => w.tag).join(", ") }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('giveaway', 'Error ending giveaway', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "giveaway.errors.end_failed"),
        ephemeral: true
      });
    }
  },

  async handleReroll(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const messageId = interaction.options.getString("message_id");
    const winnersCount = interaction.options.getInteger("winners");

    const giveaway = await giveaways.getByMessage(messageId);
    if (!giveaway) {
      return interaction.editReply({
        content: t(lang, "giveaway.errors.not_found"),
        ephemeral: true
      });
    }

    if (!giveaway.ended) {
      return interaction.editReply({
        content: t(lang, "giveaway.errors.already_ended"),
        ephemeral: true
      });
    }

    try {
      const channel = await interaction.client.channels.fetch(giveaway.channel_id);
      const message = await channel.messages.fetch(messageId);

      const newWinnersCount = winnersCount || giveaway.winners_count;
      const winners = await this.selectWinners(message, { ...giveaway, winners_count: newWinnersCount }, interaction.guild);

      if (winners.length === 0) {
        return interaction.editReply({
          content: t(lang, "giveaway.errors.no_participants"),
          ephemeral: true
        });
      }

      const winnerIds = winners.map(w => w.id);
      await giveaways.updateWinners(messageId, winnerIds);

      await channel.send({
        content: t(lang, "giveaway.embed.reroll_announcement", {
          winners: winners.map(w => w.toString()).join(", "),
          prize: giveaway.prize
        })
      });

      return interaction.editReply({
        content: t(lang, "giveaway.success.rerolled", { winners: winners.map(w => w.tag).join(", ") }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('giveaway', 'Error rerolling giveaway', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "giveaway.errors.reroll_failed"),
        ephemeral: true
      });
    }
  },

  async handleList(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const activeGiveaways = await giveaways.getByGuild(interaction.guildId, false);

    if (activeGiveaways.length === 0) {
      return interaction.editReply({
        content: t(lang, "giveaway.errors.no_active"),
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`🎉 ${t(lang, "giveaway.embed.title")}`)
      .setColor(0x00AE86)
      .setDescription(
        activeGiveaways.map((g, i) => {
          const timeLeft = getTimeRemaining(g.end_at);
          return `**${i + 1}.** ${g.prize}\n` +
                 `└ ${t(lang, "giveaway.embed.ends")}: ${timeLeft} | ${t(lang, "giveaway.embed.winners")}: ${g.winners_count} | [Jump](https://discord.com/channels/${g.guild_id}/${g.channel_id}/${g.message_id})`;
        }).join("\n\n")
      )
      .setFooter({ 
        text: `${activeGiveaways.length} ${activeGiveaways.length > 1 ? t(lang, "giveaway.embed.winners") : t(lang, "giveaway.embed.winners").slice(0, -1)}` 
      });

    return interaction.editReply({ embeds: [embed], ephemeral: true });
  },

  async handleCancel(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const messageId = interaction.options.getString("message_id");

    const giveaway = await giveaways.getByMessage(messageId);
    if (!giveaway) {
      return interaction.editReply({
        content: t(lang, "giveaway.errors.not_found"),
        ephemeral: true
      });
    }

    if (giveaway.ended) {
      return interaction.editReply({
        content: t(lang, "giveaway.errors.already_ended"),
        ephemeral: true
      });
    }

    try {
      const channel = await interaction.client.channels.fetch(giveaway.channel_id);
      const message = await channel.messages.fetch(messageId);

      await giveaways.cancel(messageId);

      const embed = EmbedBuilder.from(message.embeds[0])
        .setDescription(message.embeds[0].description + `\n\n**${t(lang, "giveaway.embed.status_ended")}:** ${t(lang, "giveaway.embed.status_cancelled")}`)
        .setColor(0xFF0000);

      await message.edit({ embeds: [embed] });

      return interaction.editReply({
        content: t(lang, "giveaway.success.cancelled"),
        ephemeral: true
      });
    } catch (error) {
      logger.error('giveaway', 'Error cancelling giveaway', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "giveaway.errors.cancel_failed"),
        ephemeral: true
      });
    }
  },

  async selectWinners(message, giveaway, guild) {
    const { levels } = require("../../../utils/database");
    
    // Attempt to find reaction, but we use the participation button now mainly.
    // However, for compatibility, we can still fetch users from reactions.
    // BUT the best way is to use the participants list from the DB.
    const giveawayFull = await giveaways.getByMessage(message.id);
    const participantIds = giveawayFull.participants || [];

    if (participantIds.length === 0) return [];

    const validParticipants = [];
    const requirements = giveaway.requirements || {};

    for (const userId of participantIds) {
      try {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member) continue;

        let isValid = true;

        // Requirement 1 (Traditional)
        if (requirements.type === "role" && requirements.role_id) {
          if (!member.roles.cache.has(requirements.role_id)) isValid = false;
        } else if (requirements.type === "level" && requirements.min_level) {
          const userLevel = await levels.get(guild.id, userId);
          if (!userLevel || userLevel.level < requirements.min_level) isValid = false;
        } else if (requirements.type === "account_age" && requirements.min_account_age_days) {
          const accountAge = Date.now() - member.user.createdTimestamp;
          const requiredAge = requirements.min_account_age_days * 24 * 60 * 60 * 1000;
          if (accountAge < requiredAge) isValid = false;
        }

        // Pro Requirements (Combined)
        if (isValid && requirements.required_role_2) {
          if (!member.roles.cache.has(requirements.required_role_2)) isValid = false;
        }
        if (isValid && requirements.min_account_age_days_extra) {
          const accountAge = Date.now() - member.user.createdTimestamp;
          const requiredAge = requirements.min_account_age_days_extra * 24 * 60 * 60 * 1000;
          if (accountAge < requiredAge) isValid = false;
        }

        if (isValid) {
          // Calculate weight
          let weight = 1;
          if (requirements.bonus_role && member.roles.cache.has(requirements.bonus_role)) {
            weight = requirements.bonus_weight || 1;
          }
          
          validParticipants.push({ user: member.user, weight });
        }
      } catch (error) {
        continue;
      }
    }

    if (validParticipants.length === 0) return [];

    const winners = [];
    const winnersCount = Math.min(giveaway.winners_count, validParticipants.length);

    // Weighted selection
    for (let i = 0; i < winnersCount; i++) {
        const totalWeight = validParticipants.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        
        let winnerIndex = -1;
        for (let j = 0; j < validParticipants.length; j++) {
            random -= validParticipants[j].weight;
            if (random <= 0) {
                winnerIndex = j;
                break;
            }
        }

        if (winnerIndex !== -1) {
            winners.push(validParticipants[winnerIndex].user);
            validParticipants.splice(winnerIndex, 1);
        }
    }

    return winners;
  },
};
