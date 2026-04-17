"use strict";

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { modActions, tempBans, mutes, settings } = require("../../../utils/database");
const { parseDuration, getFutureDate, validateDuration, formatDuration } = require("../../../utils/parseDuration");
const { requireSupportServer } = require("../../../utils/supportServerOnly");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");
const { withDescriptionLocalizations, localizedChoice } = require("../../../utils/slashLocalizations");
const logger = require("../../../utils/structuredLogger");

module.exports = {
  data: withDescriptionLocalizations(
    new SlashCommandBuilder()
      .setName("mod")
      .setDescription(t("en", "mod.slash.description"))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addSubcommand(sub =>
        withDescriptionLocalizations(
          sub
            .setName("ban")
            .setDescription(t("en", "mod.slash.subcommands.ban.description")),
          "mod.slash.subcommands.ban.description"
        )
          .addUserOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("user")
                .setDescription(t("en", "mod.slash.options.user")),
              "mod.slash.options.user"
            )
              .setRequired(true)
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("reason")
                .setDescription(t("en", "mod.slash.options.reason")),
              "mod.slash.options.reason"
            )
              .setRequired(true)
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("duration")
                .setDescription(t("en", "mod.slash.options.duration")),
              "mod.slash.options.duration"
            )
              .addChoices(
                localizedChoice("permanent", "mod.slash.choices.duration.permanent"),
                localizedChoice("1h", "mod.slash.choices.duration.1h"),
                localizedChoice("1d", "mod.slash.choices.duration.1d"),
                localizedChoice("7d", "mod.slash.choices.duration.7d"),
                localizedChoice("30d", "mod.slash.choices.duration.30d")
              )
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("delete_messages")
                .setDescription(t("en", "mod.slash.options.delete_messages")),
              "mod.slash.options.delete_messages"
            )
              .addChoices(
                localizedChoice("0", "mod.slash.choices.delete_messages.0"),
                localizedChoice("3600", "mod.slash.choices.delete_messages.3600"),
                localizedChoice("86400", "mod.slash.choices.delete_messages.86400"),
                localizedChoice("604800", "mod.slash.choices.delete_messages.604800")
              )
          )
      )
      .addSubcommand(sub =>
        withDescriptionLocalizations(
          sub
            .setName("unban")
            .setDescription(t("en", "mod.slash.subcommands.unban.description")),
          "mod.slash.subcommands.unban.description"
        )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("user_id")
                .setDescription(t("en", "mod.slash.options.user_id")),
              "mod.slash.options.user_id"
            )
              .setRequired(true)
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("reason")
                .setDescription(t("en", "mod.slash.options.reason")),
              "mod.slash.options.reason"
            )
          )
      )
      .addSubcommand(sub =>
        withDescriptionLocalizations(
          sub
            .setName("kick")
            .setDescription(t("en", "mod.slash.subcommands.kick.description")),
          "mod.slash.subcommands.kick.description"
        )
          .addUserOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("user")
                .setDescription(t("en", "mod.slash.options.user")),
              "mod.slash.options.user"
            )
              .setRequired(true)
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("reason")
                .setDescription(t("en", "mod.slash.options.reason")),
              "mod.slash.options.reason"
            )
              .setRequired(true)
          )
      )
      .addSubcommand(sub =>
        withDescriptionLocalizations(
          sub
            .setName("timeout")
            .setDescription(t("en", "mod.slash.subcommands.timeout.description")),
          "mod.slash.subcommands.timeout.description"
        )
          .addUserOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("user")
                .setDescription(t("en", "mod.slash.options.user")),
              "mod.slash.options.user"
            )
              .setRequired(true)
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("duration")
                .setDescription(t("en", "mod.slash.options.duration")),
              "mod.slash.options.duration"
            )
              .setRequired(true)
              .addChoices(
                localizedChoice("1m", "mod.slash.choices.duration.1m"),
                localizedChoice("1h", "mod.slash.choices.duration.1h"),
                localizedChoice("1d", "mod.slash.choices.duration.1d"),
                localizedChoice("7d", "mod.slash.choices.duration.7d"),
                localizedChoice("28d", "mod.slash.choices.duration.28d")
              )
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("reason")
                .setDescription(t("en", "mod.slash.options.reason")),
              "mod.slash.options.reason"
            )
              .setRequired(true)
          )
      )
      .addSubcommand(sub =>
        withDescriptionLocalizations(
          sub
            .setName("mute")
            .setDescription(t("en", "mod.slash.subcommands.mute.description")),
          "mod.slash.subcommands.mute.description"
        )
          .addUserOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("user")
                .setDescription(t("en", "mod.slash.options.user")),
              "mod.slash.options.user"
            )
              .setRequired(true)
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("duration")
                .setDescription(t("en", "mod.slash.options.duration")),
              "mod.slash.options.duration"
            )
              .setRequired(true)
              .addChoices(
                localizedChoice("1h", "mod.slash.choices.duration.1h"),
                localizedChoice("1d", "mod.slash.choices.duration.1d"),
                localizedChoice("7d", "mod.slash.choices.duration.7d"),
                localizedChoice("30d", "mod.slash.choices.duration.30d"),
                localizedChoice("permanent", "mod.slash.choices.duration.permanent")
              )
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("reason")
                .setDescription(t("en", "mod.slash.options.reason")),
              "mod.slash.options.reason"
            )
              .setRequired(true)
          )
      )
      .addSubcommand(sub =>
        withDescriptionLocalizations(
          sub
            .setName("unmute")
            .setDescription(t("en", "mod.slash.subcommands.unmute.description")),
          "mod.slash.subcommands.unmute.description"
        )
          .addUserOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("user")
                .setDescription(t("en", "mod.slash.options.user")),
              "mod.slash.options.user"
            )
              .setRequired(true)
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("reason")
                .setDescription(t("en", "mod.slash.options.reason")),
              "mod.slash.options.reason"
            )
          )
      )
      .addSubcommand(sub =>
        withDescriptionLocalizations(
          sub
            .setName("history")
            .setDescription(t("en", "mod.slash.subcommands.history.description")),
          "mod.slash.subcommands.history.description"
        )
          .addUserOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("user")
                .setDescription(t("en", "mod.slash.options.user")),
              "mod.slash.options.user"
            )
              .setRequired(true)
          )
          .addIntegerOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("limit")
                .setDescription(t("en", "mod.slash.options.limit")),
              "mod.slash.options.limit"
            )
              .setMinValue(1)
              .setMaxValue(50)
          )
      )
      .addSubcommand(sub =>
        withDescriptionLocalizations(
          sub
            .setName("purge")
            .setDescription(t("en", "mod.slash.subcommands.purge.description")),
          "mod.slash.subcommands.purge.description"
        )
          .addIntegerOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("amount")
                .setDescription(t("en", "mod.slash.options.amount")),
              "mod.slash.options.amount"
            )
              .setRequired(true)
              .setMinValue(1)
              .setMaxValue(100)
          )
          .addUserOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("user")
                .setDescription(t("en", "mod.slash.options.user")),
              "mod.slash.options.user"
            )
          )
          .addStringOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("contains")
                .setDescription(t("en", "mod.slash.options.contains")),
              "mod.slash.options.contains"
            )
          )
      )
      .addSubcommand(sub =>
        withDescriptionLocalizations(
          sub
            .setName("slowmode")
            .setDescription(t("en", "mod.slash.subcommands.slowmode.description")),
          "mod.slash.subcommands.slowmode.description"
        )
          .addIntegerOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("seconds")
                .setDescription(t("en", "mod.slash.options.seconds")),
              "mod.slash.options.seconds"
            )
              .setRequired(true)
              .setMinValue(0)
              .setMaxValue(21600)
          )
          .addChannelOption(opt =>
            withDescriptionLocalizations(
              opt
                .setName("channel")
                .setDescription(t("en", "mod.slash.options.channel")),
              "mod.slash.options.channel"
            )
          )
      ),
    "mod.slash.description"
  ),

  async execute(interaction) {
    const isAllowed = await requireSupportServer(interaction);
    if (!isAllowed) return;

    const guildSettings = await settings.get(interaction.guildId);
    const lang = resolveGuildLanguage(guildSettings);

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "ban":
        return this.handleBan(interaction, lang);
      case "unban":
        return this.handleUnban(interaction, lang);
      case "kick":
        return this.handleKick(interaction, lang);
      case "timeout":
        return this.handleTimeout(interaction, lang);
      case "mute":
        return this.handleMute(interaction, lang);
      case "unmute":
        return this.handleUnmute(interaction, lang);
      case "history":
        return this.handleHistory(interaction, lang);
      case "purge":
        return this.handlePurge(interaction, lang);
      case "slowmode":
        return this.handleSlowmode(interaction, lang);
    }
  },

  async handleBan(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const durationStr = interaction.options.getString("duration");
    const deleteSeconds = parseInt(interaction.options.getString("delete_messages") || "0", 10);

    try {
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      if (member) {
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
          return interaction.editReply({
            content: t(lang, "mod.errors.user_hierarchy", { action: "ban" }),
            ephemeral: true
          });
        }

        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
          return interaction.editReply({
            content: t(lang, "mod.errors.bot_hierarchy", { action: "ban" }),
            ephemeral: true
          });
        }
      }

      let expiresAt = null;
      if (durationStr) {
        const validation = validateDuration(durationStr, 60000, 365 * 24 * 60 * 60 * 1000);
        if (!validation.valid) {
          return interaction.editReply({
            content: `❌ ${validation.error}`,
            ephemeral: true
          });
        }
        expiresAt = getFutureDate(durationStr);
      }

      await interaction.guild.members.ban(user.id, {
        reason: `${reason} | By: ${interaction.user.tag}`,
        deleteMessageSeconds: deleteSeconds
      });

      await modActions.record({
        guild_id: interaction.guildId,
        user_id: user.id,
        moderator_id: interaction.user.id,
        action_type: "ban",
        reason: reason,
        duration: durationStr,
        metadata: {
          delete_message_seconds: deleteSeconds,
          temporary: !!durationStr
        }
      });

      if (expiresAt) {
        await tempBans.add(interaction.guildId, user.id, expiresAt.toISOString(), reason, interaction.user.id);
      }

      const extra = durationStr 
        ? t(lang, "mod.ban_extra.duration", { duration: formatDuration(parseDuration(durationStr)) })
        : t(lang, "mod.ban_extra.permanent");
      
      const extraMsg = extra + (deleteSeconds > 0 ? `\n${t(lang, "mod.ban_extra.messages_deleted", { hours: (deleteSeconds / 3600).toString() })}` : "");

      return interaction.editReply({
        content: t(lang, "mod.success.banned", { user: user.tag, reason, extra: extraMsg }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('mod', 'Error banning user', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "mod.errors.ban_failed"),
        ephemeral: true
      });
    }
  },

  async handleUnban(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.options.getString("user_id");
    const reason = interaction.options.getString("reason") || "No reason provided";

    try {
      const bans = await interaction.guild.bans.fetch();
      const ban = bans.get(userId);

      if (!ban) {
        return interaction.editReply({
          content: t(lang, "mod.errors.not_banned"),
          ephemeral: true
        });
      }

      await interaction.guild.members.unban(userId, `${reason} | By: ${interaction.user.tag}`);

      await modActions.record({
        guild_id: interaction.guildId,
        user_id: userId,
        moderator_id: interaction.user.id,
        action_type: "unban",
        reason: reason
      });

      await tempBans.remove(interaction.guildId, userId);

      return interaction.editReply({
        content: t(lang, "mod.success.unbanned", { user: ban.user.tag, reason }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('mod', 'Error unbanning user', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "mod.errors.unban_failed"),
        ephemeral: true
      });
    }
  },

  async handleKick(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    try {
      const member = await interaction.guild.members.fetch(user.id);

      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.editReply({
          content: t(lang, "mod.errors.user_hierarchy", { action: "kick" }),
          ephemeral: true
        });
      }

      if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.editReply({
          content: t(lang, "mod.errors.bot_hierarchy", { action: "kick" }),
          ephemeral: true
        });
      }

      await member.kick(`${reason} | By: ${interaction.user.tag}`);

      await modActions.record({
        guild_id: interaction.guildId,
        user_id: user.id,
        moderator_id: interaction.user.id,
        action_type: "kick",
        reason: reason
      });

      return interaction.editReply({
        content: t(lang, "mod.success.kicked", { user: user.tag, reason }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('mod', 'Error kicking user', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "mod.errors.kick_failed"),
        ephemeral: true
      });
    }
  },

  async handleTimeout(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser("user");
    const durationStr = interaction.options.getString("duration");
    const reason = interaction.options.getString("reason");

    const validation = validateDuration(durationStr, 60000, 28 * 24 * 60 * 60 * 1000);
    if (!validation.valid) {
      return interaction.editReply({
        content: `❌ ${validation.error}`,
        ephemeral: true
      });
    }

    try {
      const member = await interaction.guild.members.fetch(user.id);

      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.editReply({
          content: t(lang, "mod.errors.user_hierarchy", { action: "timeout" }),
          ephemeral: true
        });
      }

      await member.timeout(validation.ms, `${reason} | By: ${interaction.user.tag}`);

      await modActions.record({
        guild_id: interaction.guildId,
        user_id: user.id,
        moderator_id: interaction.user.id,
        action_type: "timeout",
        reason: reason,
        duration: durationStr
      });

      return interaction.editReply({
        content: t(lang, "mod.success.timeout", { user: user.tag, duration: formatDuration(validation.ms), reason }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('mod', 'Error timing out user', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "mod.errors.timeout_failed"),
        ephemeral: true
      });
    }
  },

  async handleMute(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser("user");
    const durationStr = interaction.options.getString("duration");
    const reason = interaction.options.getString("reason");

    const validation = validateDuration(durationStr, 60000, 365 * 24 * 60 * 60 * 1000); // min 1m, max 1y
    if (!validation.valid) {
      return interaction.editReply({
        content: `❌ ${validation.error}`,
        ephemeral: true
      });
    }

    try {
      const member = await interaction.guild.members.fetch(user.id);

      // Buscar o crear rol "Muted"
      let muteRole = interaction.guild.roles.cache.find(r => r.name === "Muted");
      if (!muteRole) {
        muteRole = await interaction.guild.roles.create({
          name: "Muted",
          color: 0x818386,
          permissions: [],
          reason: "Auto-created mute role"
        });

        // Configurar permisos en todos los canales
        const channels = interaction.guild.channels.cache;
        for (const [, channel] of channels) {
          if (channel.isTextBased()) {
            await channel.permissionOverwrites.create(muteRole, {
              SendMessages: false,
              AddReactions: false,
              CreatePublicThreads: false,
              CreatePrivateThreads: false,
              SendMessagesInThreads: false
            }).catch(() => {});
          }
        }
      }

      // Aplicar rol
      await member.roles.add(muteRole, `${reason} | By: ${interaction.user.tag}`);

      const expiresAt = getFutureDate(durationStr);

      // Registrar en base de datos
      await mutes.add(interaction.guildId, user.id, expiresAt.toISOString(), reason, interaction.user.id);

      await modActions.record({
        guild_id: interaction.guildId,
        user_id: user.id,
        moderator_id: interaction.user.id,
        action_type: "mute",
        reason: reason,
        duration: durationStr
      });

      return interaction.editReply({
        content: t(lang, "mod.success.muted", { user: user.tag, duration: formatDuration(validation.ms), reason }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('mod', 'Error muting user', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "mod.errors.mute_failed"),
        ephemeral: true
      });
    }
  },

  async handleUnmute(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    try {
      const member = await interaction.guild.members.fetch(user.id);
      const muteRole = interaction.guild.roles.cache.find(r => r.name === "Muted");

      if (!muteRole || !member.roles.cache.has(muteRole.id)) {
        return interaction.editReply({
          content: t(lang, "mod.errors.not_muted"),
          ephemeral: true
        });
      }

      // Remover rol
      await member.roles.remove(muteRole, `${reason} | By: ${interaction.user.tag}`);

      // Actualizar base de datos
      await mutes.remove(interaction.guildId, user.id);

      await modActions.record({
        guild_id: interaction.guildId,
        user_id: user.id,
        moderator_id: interaction.user.id,
        action_type: "unmute",
        reason: reason
      });

      return interaction.editReply({
        content: t(lang, "mod.success.unmuted", { user: user.tag, reason }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('mod', 'Error unmuting user', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "mod.errors.unmute_failed"),
        ephemeral: true
      });
    }
  },

  async handleHistory(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser("user");
    const limit = interaction.options.getInteger("limit") || 10;

    try {
      const history = await modActions.getHistory(interaction.guildId, user.id, limit);

      if (history.length === 0) {
        return interaction.editReply({
          content: t(lang, "mod.errors.no_history", { user: user.tag }),
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(t(lang, "mod.history.title", { user: user.tag }))
        .setThumbnail(user.displayAvatarURL())
        .setColor(0xFEE75C)
        .setDescription(
          history.map((action, i) => {
            const moderator = `<@${action.moderator_id}>`;
            const timestamp = `<t:${Math.floor(new Date(action.created_at).getTime() / 1000)}:R>`;
            const duration = action.duration ? ` | Duration: ${action.duration}` : "";
            return t(lang, "mod.history.entry", {
              index: (i + 1).toString(),
              action: action.action_type.toUpperCase(),
              moderator,
              timestamp,
              reason: action.reason,
              duration
            });
          }).join("\n\n")
        )
        .setFooter({ text: t(lang, "mod.history.footer", { count: history.length.toString() }) });

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      logger.error('mod', 'Error fetching history', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "mod.errors.history_failed"),
        ephemeral: true
      });
    }
  },

  async handlePurge(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const amount = interaction.options.getInteger("amount");
    const user = interaction.options.getUser("user");
    const contains = interaction.options.getString("contains");

    try {
      // Fetch messages
      const messages = await interaction.channel.messages.fetch({ limit: Math.min(amount + 50, 100) });

      let toDelete = Array.from(messages.values());

      // Filtrar por usuario
      if (user) {
        toDelete = toDelete.filter(m => m.author.id === user.id);
      }

      // Filtrar por contenido
      if (contains) {
        toDelete = toDelete.filter(m => m.content.toLowerCase().includes(contains.toLowerCase()));
      }

      // Limitar cantidad
      toDelete = toDelete.slice(0, amount);

      // Filtrar mensajes muy antiguos (>14 días)
      const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
      toDelete = toDelete.filter(m => m.createdTimestamp > twoWeeksAgo);

      if (toDelete.length === 0) {
        return interaction.editReply({
          content: t(lang, "mod.errors.no_messages"),
          ephemeral: true
        });
      }

      // Bulk delete
      await interaction.channel.bulkDelete(toDelete, true);

      // Registrar
      await modActions.record({
        guild_id: interaction.guildId,
        user_id: user?.id || "all",
        moderator_id: interaction.user.id,
        action_type: "purge",
        reason: `Purged ${toDelete.length} messages`,
        metadata: {
          amount: toDelete.length,
          user_filter: user?.id,
          contains_filter: contains
        }
      });

      const reply = await interaction.editReply({
        content: t(lang, "mod.success.purged", { count: toDelete.length.toString() }),
        ephemeral: true
      });

      setTimeout(() => {
        reply.delete().catch(() => {});
      }, 5000);
    } catch (error) {
      logger.error('mod', 'Error purging messages', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "mod.errors.purge_failed"),
        ephemeral: true
      });
    }
  },

  async handleSlowmode(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const seconds = interaction.options.getInteger("seconds");
    const channel = interaction.options.getChannel("channel") || interaction.channel;

    try {
      await channel.setRateLimitPerUser(seconds, `Set by ${interaction.user.tag}`);

      if (seconds === 0) {
        return interaction.editReply({
          content: t(lang, "mod.success.slowmode_disabled", { channel: channel.toString() }),
          ephemeral: true
        });
      }

      return interaction.editReply({
        content: t(lang, "mod.success.slowmode_set", { seconds: seconds.toString(), channel: channel.toString() }),
        ephemeral: true
      });
    } catch (error) {
      logger.error('mod', 'Error setting slowmode', { error: error?.message || String(error) });
      return interaction.editReply({
        content: t(lang, "mod.errors.slowmode_failed"),
        ephemeral: true
      });
    }
  }
};
