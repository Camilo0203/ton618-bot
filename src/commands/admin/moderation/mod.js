"use strict";

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagBits } = require("discord.js");
const { modActions, tempBans, mutes, settings } = require("../../../utils/database");
const { parseDuration, getFutureDate, validateDuration, formatDuration } = require("../../../utils/parseDuration");
const { requireSupportServer } = require("../../../utils/supportServerOnly");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Advanced moderation commands")
    .setDefaultMemberPermissions(PermissionFlagBits.ModerateMembers)
    .addSubcommand(sub =>
      sub
        .setName("ban")
        .setDescription("Ban a user from the server")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to ban")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("reason")
            .setDescription("Reason for the ban")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("duration")
            .setDescription("Duration for temporary ban (e.g., 1h, 7d, 30d)")
        )
        .addStringOption(opt =>
          opt
            .setName("delete_messages")
            .setDescription("Delete messages from the last...")
            .addChoices(
              { name: "Don't delete", value: "0" },
              { name: "1 hour", value: "3600" },
              { name: "24 hours", value: "86400" },
              { name: "7 days", value: "604800" }
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("unban")
        .setDescription("Unban a user")
        .addStringOption(opt =>
          opt
            .setName("user_id")
            .setDescription("User ID to unban")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("reason")
            .setDescription("Reason for unbanning")
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("kick")
        .setDescription("Kick a user from the server")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to kick")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("reason")
            .setDescription("Reason for the kick")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("timeout")
        .setDescription("Timeout a user (Discord native)")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to timeout")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("duration")
            .setDescription("Duration (e.g., 5m, 1h, 1d - max 28d)")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("reason")
            .setDescription("Reason for the timeout")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("mute")
        .setDescription("Mute a user with a role")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to mute")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("duration")
            .setDescription("Duration (e.g., 5m, 1h, 1d)")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("reason")
            .setDescription("Reason for the mute")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("unmute")
        .setDescription("Unmute a user")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to unmute")
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("reason")
            .setDescription("Reason for unmuting")
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("history")
        .setDescription("View moderation history for a user")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to check")
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName("limit")
            .setDescription("Number of actions to show (default: 10)")
            .setMinValue(1)
            .setMaxValue(50)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("purge")
        .setDescription("Delete multiple messages")
        .addIntegerOption(opt =>
          opt
            .setName("amount")
            .setDescription("Number of messages to delete (1-100)")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        )
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("Only delete messages from this user")
        )
        .addStringOption(opt =>
          opt
            .setName("contains")
            .setDescription("Only delete messages containing this text")
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("slowmode")
        .setDescription("Set slowmode for a channel")
        .addIntegerOption(opt =>
          opt
            .setName("seconds")
            .setDescription("Slowmode duration in seconds (0 to disable)")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(21600)
        )
        .addChannelOption(opt =>
          opt
            .setName("channel")
            .setDescription("Channel to set slowmode in (default: current)")
        )
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
      console.error("Error banning user:", error);
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
      console.error("Error unbanning user:", error);
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
      console.error("Error kicking user:", error);
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
      console.error("Error timing out user:", error);
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
      console.error("Error muting user:", error);
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
      console.error("Error unmuting user:", error);
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
      console.error("Error fetching history:", error);
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
      console.error("Error purging messages:", error);
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
      console.error("Error setting slowmode:", error);
      return interaction.editReply({
        content: t(lang, "mod.errors.slowmode_failed"),
        ephemeral: true
      });
    }
  },
};
