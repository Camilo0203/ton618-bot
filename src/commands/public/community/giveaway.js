"use strict";

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { giveaways, settings } = require("../../../utils/database");
const { parseDuration, getFutureDate, validateDuration, getTimeRemaining, formatDuration } = require("../../../utils/parseDuration");
const { requireSupportServer } = require("../../../utils/supportServerOnly");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");

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
    .setDescriptionLocalizations({
      "es-ES": "Gestionar sorteos en el servidor de soporte",
      "es-419": "Gestionar sorteos en el servidor de soporte"
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub
        .setName("create")
        .setDescription("Create a new giveaway")
        .setDescriptionLocalizations({
          "es-ES": "Crear un nuevo sorteo",
          "es-419": "Crear un nuevo sorteo"
        })
        .addStringOption(opt =>
          opt
            .setName("prize")
            .setDescription("What are you giving away?")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("duration")
            .setDescription("How long should the giveaway last? (e.g., 1h, 2d, 1w)")
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName("winners")
            .setDescription("Number of winners")
            .setMinValue(1)
            .setMaxValue(20)
        )
        .addChannelOption(opt =>
          opt
            .setName("channel")
            .setDescription("Channel to post the giveaway in")
        )
        .addStringOption(opt =>
          opt
            .setName("requirement_type")
            .setDescription("Participation requirements")
            .addChoices(
              { name: "None - Anyone can enter", value: "none" },
              { name: "Role - Must have a specific role", value: "role" },
              { name: "Level - Must be at least a certain level", value: "level" },
              { name: "Account Age - Account must be X days old", value: "account_age" }
            )
        )
        .addStringOption(opt =>
          opt
            .setName("requirement_value")
            .setDescription("Value for the requirement (role ID, level number, or days)")
        )
        .addStringOption(opt =>
          opt
            .setName("emoji")
            .setDescription("Emoji to react with (default: 🎉)")
        )
        .addStringOption(opt =>
          opt
            .setName("description")
            .setDescription("Additional description for the giveaway")
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("end")
        .setDescription("End a giveaway early")
        .setDescriptionLocalizations({
          "es-ES": "Finalizar un sorteo anticipadamente",
          "es-419": "Finalizar un sorteo anticipadamente"
        })
        .addStringOption(opt =>
          opt
            .setName("message_id")
            .setDescription("ID of the giveaway message")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("reroll")
        .setDescription("Reroll winners for a giveaway")
        .setDescriptionLocalizations({
          "es-ES": "Reseleccionar ganadores de un sorteo",
          "es-419": "Reseleccionar ganadores de un sorteo"
        })
        .addStringOption(opt =>
          opt
            .setName("message_id")
            .setDescription("ID of the giveaway message")
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName("winners")
            .setDescription("Number of new winners to pick")
            .setMinValue(1)
            .setMaxValue(20)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("list")
        .setDescription("List all active giveaways")
        .setDescriptionLocalizations({
          "es-ES": "Listar todos los sorteos activos",
          "es-419": "Listar todos los sorteos activos"
        })
    )
    .addSubcommand(sub =>
      sub
        .setName("cancel")
        .setDescription("Cancel a giveaway without picking winners")
        .setDescriptionLocalizations({
          "es-ES": "Cancelar un sorteo sin elegir ganadores",
          "es-419": "Cancelar un sorteo sin elegir ganadores"
        })
        .addStringOption(opt =>
          opt
            .setName("message_id")
            .setDescription("ID of the giveaway message")
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

    const validation = validateDuration(durationStr, 60000, 30 * 24 * 60 * 60 * 1000);
    if (!validation.valid) {
      return interaction.editReply({
        content: validation.error,
        ephemeral: true
      });
    }

    const endDate = getFutureDate(durationStr);

    const requirements = { type: requirementType };
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
        `**Haz clic en el botón 🎉 Participar para entrar al sorteo!**`
      )
      .setColor(0x00AE86)
      .setFooter({ text: `${winnersCount} ${winnersCount > 1 ? t(lang, "giveaway.embed.winners").toLowerCase() : t(lang, "giveaway.embed.winners").toLowerCase().slice(0, -1)} | ${t(lang, "giveaway.embed.ends")}` })
      .setTimestamp(endDate);

    if (requirementType !== "none") {
      let reqText = "";
      if (requirementType === "role") {
        const cleanedRoleId = cleanRoleId(requirementValue);
        reqText = t(lang, "giveaway.requirements.role", { role: `<@&${cleanedRoleId}>` });
      } else if (requirementType === "level") {
        reqText = t(lang, "giveaway.requirements.level", { level: requirementValue });
      } else if (requirementType === "account_age") {
        reqText = t(lang, "giveaway.requirements.account_age", { days: requirementValue });
      }
      embed.addFields({ name: t(lang, "giveaway.embed.requirements"), value: reqText });
    }

    try {
      // Primero enviar el mensaje para obtener el ID
      const message = await channel.send({ embeds: [embed] });
      
      // Crear botón de participar con el ID real del mensaje
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`giveaway_enter_${message.id}`)
            .setLabel('🎉 Participar')
            .setStyle(ButtonStyle.Primary)
        );
      
      // Actualizar mensaje con el botón
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
      console.error("Error creating giveaway:", error);
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
      console.error("Error ending giveaway:", error);
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
      console.error("Error rerolling giveaway:", error);
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
      .setFooter({ text: `${activeGiveaways.length} ${activeGiveaways.length > 1 ? 'giveaways' : 'giveaway'}` });

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
      console.error("Error cancelling giveaway:", error);
      return interaction.editReply({
        content: t(lang, "giveaway.errors.cancel_failed"),
        ephemeral: true
      });
    }
  },

  async selectWinners(message, giveaway, guild) {
    const { levels } = require("../../../utils/database");
    
    const reaction = message.reactions.cache.find(r => r.emoji.name === giveaway.emoji || r.emoji.toString() === giveaway.emoji);
    if (!reaction) return [];

    const users = await reaction.users.fetch();
    let participants = users.filter(u => !u.bot).map(u => u);

    if (giveaway.requirements.type !== "none") {
      const validParticipants = [];

      for (const user of participants) {
        let isValid = true;

        try {
          const member = await guild.members.fetch(user.id);
          
          if (giveaway.requirements.type === "role" && giveaway.requirements.role_id) {
            isValid = member.roles.cache.has(giveaway.requirements.role_id);
          } else if (giveaway.requirements.type === "level" && giveaway.requirements.min_level) {
            const userLevel = await levels.get(guild.id, user.id);
            isValid = userLevel && userLevel.level >= giveaway.requirements.min_level;
          } else if (giveaway.requirements.type === "account_age" && giveaway.requirements.min_account_age_days) {
            const accountAge = Date.now() - user.createdTimestamp;
            const requiredAge = giveaway.requirements.min_account_age_days * 24 * 60 * 60 * 1000;
            isValid = accountAge >= requiredAge;
          }

          if (isValid) {
            validParticipants.push(user);
          }
        } catch (error) {
          continue;
        }
      }

      participants = validParticipants;
    }

    if (participants.length === 0) return [];

    const winners = [];
    const winnersCount = Math.min(giveaway.winners_count, participants.length);

    for (let i = 0; i < winnersCount; i++) {
      const randomIndex = Math.floor(Math.random() * participants.length);
      winners.push(participants[randomIndex]);
      participants.splice(randomIndex, 1);
    }

    return winners;
  },
};
