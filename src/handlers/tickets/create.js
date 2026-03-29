"use strict";

const {
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
  tickets,
  ticketCreateLocks,
  settings,
  blacklist,
  staffStats,
  cooldowns,
  E,
  sanitizeTicketAnswers,
  isCategoryBlockedByIncident,
  resolveIncidentMessage,
  updateDashboard,
} = require("./context");
const { resolveAutoAssignee } = require("./autoAssign");
const {
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_PRIORITY,
  TICKET_FIELD_ASSIGNED,
  TICKET_FIELD_STATUS,
  replyError,
  priorityLabel,
  recordTicketEventSafe,
  resolveQueueTypeFromCategory,
  sendLog,
  resolveTicketCreateErrorMessage,
  formatTicketWorkflowStatus,
  buildStaffQuickActionOptions,
} = require("./shared");
const {
  buildTicketWelcomeMessage,
  buildControlPanelPresentation,
} = require("../../utils/ticketCustomization");
const { getCategoriesForGuild, hasCategories } = require("../../utils/categoryResolver");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

async function createTicket(interaction, categoryId, answers = []) {
  const guild = interaction.guild;
  const user = interaction.user;
  const s = await settings.get(guild.id);
  const language = resolveInteractionLanguage(interaction, s);
  const allCategories = await getCategoriesForGuild(guild.id);
  const category = allCategories.find((entry) => entry.id === categoryId);

  let requestMember = interaction.member ?? null;
  let channel = null;
  let ticket = null;
  let creationLockAcquired = false;
  const postCreateWarnings = [];

  const hasCats = await hasCategories(guild.id);
  if (!hasCats) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.ERROR)
          .setTitle(t(language, "ticket.create_flow.system_not_configured_title"))
          .setDescription(t(language, "ticket.create_flow.system_not_configured_description"))
          .setFooter({ text: t(language, "ticket.create_flow.system_not_configured_footer") }),
      ],
      flags: 64,
    });
  }

  if (!category) return replyError(interaction, t(language, "ticket.create_flow.category_not_found"), language);
  if (isCategoryBlockedByIncident(s, category.id)) {
    return replyError(interaction, resolveIncidentMessage(s), language);
  }

  const sanitizedAnswers = sanitizeTicketAnswers(Array.isArray(answers) ? answers : [], {
    minLength: 3,
    firstMinLength: 8,
    maxLength: 500,
  });
  if (!sanitizedAnswers.valid) {
    return replyError(interaction, t(language, "ticket.create_flow.invalid_form"), language);
  }
  answers = sanitizedAnswers.answers;

  if ((s.min_days > 0 || s.verify_role) && !requestMember?.roles?.cache) {
    requestMember = await guild.members.fetch(user.id).catch(() => null);
  }

  if (s.min_days > 0 && requestMember?.joinedTimestamp) {
    const days = (Date.now() - requestMember.joinedTimestamp) / 86400000;
    if (days < s.min_days) {
      return replyError(interaction, t(language, "ticket.create_flow.min_days_required", {
        days: s.min_days,
      }), language);
    }
  }

  if (s.maintenance_mode) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.WARNING)
          .setTitle(t(language, "ticket.maintenance.title"))
          .setDescription(t(language, "ticket.maintenance.description", {
            reason: s.maintenance_reason || t(language, "ticket.maintenance.scheduled"),
          })),
      ],
      flags: 64,
    });
  }

  const banned = await blacklist.check(user.id, guild.id);
  if (banned) {
    return replyError(interaction, t(language, "ticket.create_flow.blacklisted", {
      reason: banned.reason || t(language, "common.value.none"),
    }), language);
  }

  if (s.verify_role && requestMember && !requestMember.roles.cache.has(s.verify_role)) {
    return replyError(interaction, t(language, "ticket.create_flow.verify_role_required", {
      roleId: s.verify_role,
    }), language);
  }

  const unratedTickets = await tickets.getUnratedClosedTickets(user.id, guild.id);
  if (unratedTickets && unratedTickets.length > 0) {
    const ticketListDetailed = unratedTickets.map((item, index) => {
      const closedDate = item.closed_at
        ? `<t:${Math.floor(new Date(item.closed_at).getTime() / 1000)}:R>`
        : t(language, "common.value.no_data");
      return `${index + 1}. **Ticket #${item.ticket_id}** - ${item.category || t(language, "ticket.create_flow.general_category")} (Closed ${closedDate})`;
    }).join("\n");

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.WARNING)
          .setTitle(t(language, "ticket.create_flow.pending_ratings_title"))
          .setDescription(t(language, "ticket.create_flow.pending_ratings_description", {
            count: unratedTickets.length,
            tickets: ticketListDetailed,
          }))
          .setFooter({ text: t(language, "ticket.create_flow.pending_ratings_footer") })
          .setTimestamp(),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`resend_ratings_${user.id}`)
            .setLabel(t(language, "ticket.create_flow.resend_ratings_button"))
            .setStyle(ButtonStyle.Primary)
        ),
      ],
      flags: 64,
    });
  }

  try {
    creationLockAcquired = await ticketCreateLocks.acquire(guild.id, user.id, 30_000);
    if (!creationLockAcquired) {
      return replyError(
        interaction,
        t(language, "ticket.create_flow.duplicate_request"),
        language
      );
    }

    if (s.global_ticket_limit > 0) {
      const totalOpen = await tickets.countOpenByGuild(guild.id);
      if (totalOpen >= s.global_ticket_limit) {
        return replyError(
          interaction,
          t(language, "ticket.create_flow.global_limit", { limit: s.global_ticket_limit }),
          language
        );
      }
    }

    const maxPerUser = s.max_tickets || 3;
    const openTicketCount = await tickets.countByUser(user.id, guild.id);
    if (openTicketCount >= maxPerUser) {
      const openTickets = await tickets.getOpenReferencesByUser(user.id, guild.id, maxPerUser);
      const openMentions = openTickets.map((openTicket) => `<#${openTicket.channel_id}>`).join(", ");
      return replyError(
        interaction,
        t(language, "ticket.create_flow.user_limit", {
          openCount: openTicketCount,
          maxPerUser,
          suffix: openMentions ? `: ${openMentions}` : ".",
        }),
        language
      );
    }

    if (s.cooldown_minutes > 0) {
      const remaining = await cooldowns.check(user.id, guild.id, s.cooldown_minutes);
      if (remaining) {
        return replyError(interaction, t(language, "ticket.create_flow.cooldown", {
          minutes: remaining,
        }), language);
      }
    }

    await interaction.deferReply({ flags: 64 });

    const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
    if (!botMember) {
      return interaction.editReply({
        embeds: [E.errorEmbed(t(language, "ticket.create_flow.self_permissions_error"))],
      });
    }

    const requiredPermissions = [
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ManageRoles,
    ];

    const missingPermissions = requiredPermissions.filter((permission) => !botMember.permissions.has(permission));
    if (missingPermissions.length > 0) {
      return interaction.editReply({
        embeds: [
          E.errorEmbed(t(language, "ticket.create_flow.missing_permissions")),
        ],
      });
    }

    const ticketNumber = await settings.incrementCounter(guild.id);
    const ticketId = String(ticketNumber).padStart(4, "0");
    const channelName = `${process.env.TICKET_PREFIX || "ticket"}-${ticketId}`;
    let autoAssignee = null;

    try {
      autoAssignee = await resolveAutoAssignee(guild, s, category);
    } catch (assignError) {
      console.error("[AUTO ASSIGN]", assignError?.message || assignError);
    }

    const perms = [
      { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      {
        id: user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.AddReactions,
        ],
      },
      {
        id: interaction.client.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.AttachFiles,
        ],
      },
    ];

    if (s.support_role) {
      perms.push({
        id: s.support_role,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.ManageMessages,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.AddReactions,
        ],
      });
    }
    if (s.admin_role && s.admin_role !== s.support_role) {
      perms.push({
        id: s.admin_role,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.EmbedLinks,
        ],
      });
    }

    category.pingRoles?.forEach((roleId) => {
      if (roleId && !perms.find((perm) => perm.id === roleId)) {
        perms.push({
          id: roleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        });
      }
    });

    const channelOptions = {
      name: channelName,
      type: ChannelType.GuildText,
      topic: `Ticket for <@${user.id}> | ${category.label} | #${ticketId}${autoAssignee ? ` | Staff: <@${autoAssignee.id}>` : ""}`,
      permissionOverwrites: perms,
    };

    if (category.categoryId) {
      channelOptions.parent = category.categoryId;
      console.log(`[TICKET CREATE] Creating channel under Discord category ${category.categoryId}`);
    } else {
      console.log(`[TICKET CREATE] No Discord category configured for ${category.id}`);
    }

    channel = await guild.channels.create(channelOptions);

    ticket = await tickets.create({
      ticket_id: ticketId,
      channel_id: channel.id,
      guild_id: guild.id,
      user_id: user.id,
      user_tag: user.tag,
      category: category.label,
      category_id: category.id,
      queue_type: resolveQueueTypeFromCategory(category.id),
      priority: category.priority || "normal",
      assigned_to: autoAssignee?.id || null,
      assigned_to_tag: autoAssignee?.tag || null,
      subject: answers[0]?.substring(0, 100) || null,
      answers: answers.length ? JSON.stringify(answers) : null,
    });

    if (autoAssignee?.id) {
      await staffStats.incrementAssigned(guild.id, autoAssignee.id);
      await settings.update(guild.id, { auto_assign_last_staff_id: autoAssignee.id }).catch(() => {});
    }

    await cooldowns.set(user.id, guild.id);

    const pings = [];
    if (s.support_role) {
      pings.push(`<@&${s.support_role}>`);
    }
    category.pingRoles?.forEach((roleId) => {
      const mention = `<@&${roleId}>`;
      if (roleId && !pings.includes(mention)) pings.push(mention);
    });
    if (autoAssignee?.id && !pings.includes(`<@${autoAssignee.id}>`)) {
      pings.push(`<@${autoAssignee.id}>`);
    }

    try {
      const greetingContent = buildTicketWelcomeMessage({
        settingsRecord: s,
        category,
        guildName: guild.name,
        userMention: `<@${user.id}>`,
        ticketId,
        categoryLabel: category.label,
        pings,
      });

      await channel.send({ content: greetingContent });
    } catch (channelGreetingError) {
      console.error("[TICKET OPEN MESSAGE ERROR]", channelGreetingError);
      postCreateWarnings.push(t(language, "ticket.create_flow.welcome_message_failed"));
    }

    const controlPresentation = buildControlPanelPresentation({
      guild,
      settingsRecord: s,
      ticketId,
      categoryLabel: category.label,
      userMention: `<@${user.id}>`,
      fallbackColor: category.color || 0x5865F2,
    });

    const controlPanel = new EmbedBuilder()
      .setTitle(controlPresentation.title)
      .setDescription(controlPresentation.description)
      .addFields(
        { name: t(language, "common.labels.user"), value: `<@${user.id}>`, inline: true },
        { name: t(language, "common.labels.category"), value: category.label, inline: true },
        { name: t(language, "common.labels.ticket_id"), value: `#${ticketId}`, inline: true },
        { name: t(language, "common.labels.created"), value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        { name: t(language, "common.labels.priority"), value: priorityLabel(category.priority || "normal", language), inline: true },
        { name: t(language, "common.labels.status"), value: formatTicketWorkflowStatus("open", language), inline: true }
      )
      .setColor(controlPresentation.color)
      .setFooter({
        text: controlPresentation.footer,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    if (autoAssignee?.id) {
      controlPanel.addFields({
        name: t(language, "common.labels.assigned_to"),
        value: `<@${autoAssignee.id}>`,
        inline: true,
      });
    }

    if (answers?.length) {
      const questions = category.questions || [];
      const qaText = answers
        .map((answer, index) => `**${questions[index] || t(language, "ticket.create_flow.question_fallback", { index: index + 1 })}**\n${answer}`)
        .join("\n\n");
      controlPanel.addFields({ name: t(language, "ticket.create_flow.submitted_form"), value: qaText.substring(0, 1000) });
    }

    const controlButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_close")
        .setLabel(t(language, "ticket.buttons.close"))
        .setEmoji("\u{1F512}")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("ticket_claim")
        .setLabel(t(language, "ticket.buttons.claim"))
        .setEmoji("\u{1F44B}")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("ticket_transcript")
        .setLabel(t(language, "ticket.buttons.transcript"))
        .setEmoji("\u{1F4C4}")
        .setStyle(ButtonStyle.Secondary)
    );

    const quickActions = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("staff_quick_actions")
        .setPlaceholder(t(language, "ticket.quick_actions.placeholder"))
        .addOptions(buildStaffQuickActionOptions(language))
    );

    try {
      await channel.send({
        embeds: [controlPanel],
        components: [controlButtons, quickActions],
      });
    } catch (controlPanelError) {
      console.error("[TICKET CONTROL PANEL ERROR]", controlPanelError);
      postCreateWarnings.push(t(language, "ticket.create_flow.control_panel_failed"));
    }

    await recordTicketEventSafe({
      guild_id: guild.id,
      ticket_id: ticketId,
      channel_id: channel.id,
      actor_id: user.id,
      actor_kind: "customer",
      actor_label: user.tag,
      event_type: "ticket_created",
      visibility: "public",
      title: "Ticket created",
      description: `Ticket #${ticketId} was opened in category ${category.label}.`,
      metadata: {
        categoryId: category.id,
        categoryLabel: category.label,
        priority: category.priority || "normal",
        autoAssignedTo: autoAssignee?.id || null,
      },
    });

    if (s.dm_on_open) {
      try {
        await user.send({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.SUCCESS)
              .setTitle(t(language, "ticket.create_flow.dm_created_title"))
              .setDescription(t(language, "ticket.create_flow.dm_created_description", {
                ticketId,
                guild: guild.name,
                channelId: channel.id,
              }))
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setFooter({
                text: `${guild.name} - ${t(language, "ticket.footer")}`,
                iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp(),
          ],
        });
      } catch (dmError) {
        console.log(`[DM ERROR] Could not send a DM to user ${user.id}: ${dmError.message}`);
      }
    }

    await sendLog(guild, s, "open", user, ticket, { Channel: `<#${channel.id}>` });
    await updateDashboard(guild);

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle(t(language, "ticket.create_flow.created_success_title"))
          .setDescription(t(language, "ticket.create_flow.created_success_description", {
            channelId: channel.id,
            ticketId,
            warningText: postCreateWarnings.length
              ? `\n\n${t(language, "common.labels.warnings")}: ${postCreateWarnings.join(" ")}`
              : "",
          }))
          .setFooter({
            text: `${guild.name} - ${t(language, "ticket.footer")}`,
            iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  } catch (err) {
    console.error("[TICKET ERROR]", err);

    if (channel) {
      try {
        await channel.delete("Cleanup after failed ticket creation");
        console.log(`[TICKET CLEANUP] Channel ${channel.id} deleted after error`);
      } catch (cleanupError) {
        console.error("[TICKET CLEANUP ERROR]", cleanupError.message);
      }
    }

    if (ticket?.ticket_id) {
      try {
        await tickets.delete(channel?.id);
        console.log(`[TICKET CLEANUP] Ticket ${ticket.ticket_id} deleted from DB after error`);
      } catch (dbCleanupError) {
        console.error("[TICKET DB CLEANUP ERROR]", dbCleanupError.message);
      }
    }

    const errorPayload = {
      embeds: [E.errorEmbed(resolveTicketCreateErrorMessage(err, language))],
      ...(interaction.deferred || interaction.replied ? {} : { flags: 64 }),
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(errorPayload).catch(() => {});
    } else {
      await interaction.reply(errorPayload).catch(() => {});
    }
  } finally {
    if (creationLockAcquired) {
      await ticketCreateLocks.release(guild.id, user.id).catch(() => {});
    }
  }
}

module.exports = { createTicket };
