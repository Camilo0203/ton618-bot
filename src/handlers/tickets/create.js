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

async function createTicket(interaction, categoryId, answers = []) {
  const guild = interaction.guild;
  const user = interaction.user;
  const s = await settings.get(guild.id);
  const allCategories = await getCategoriesForGuild(guild.id);
  const category = allCategories.find((entry) => entry.id === categoryId);

  let requestMember = interaction.member ?? null;
  let channel = null;
  let ticket = null;
  const postCreateWarnings = [];

  const hasCats = await hasCategories(guild.id);
  if (!hasCats) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.ERROR)
          .setTitle("Ticket system not configured")
          .setDescription(
            "The ticket system is not configured correctly.\n\n" +
            "**Problem:** there are no ticket categories configured.\n\n" +
            "**Fix:** an administrator must create categories with:\n" +
            "`/config category add`\n\n" +
            "Contact the server administration team to resolve this issue."
          )
          .setFooter({ text: "TON618 Tickets - Configuration error" }),
      ],
      flags: 64,
    });
  }

  if (!category) return replyError(interaction, "Category not found.");
  if (isCategoryBlockedByIncident(s, category.id)) {
    return replyError(interaction, resolveIncidentMessage(s));
  }

  const sanitizedAnswers = sanitizeTicketAnswers(Array.isArray(answers) ? answers : [], {
    minLength: 3,
    firstMinLength: 8,
    maxLength: 500,
  });
  if (!sanitizedAnswers.valid) {
    return replyError(interaction, "The form is not valid. Please expand the first answer.");
  }
  answers = sanitizedAnswers.answers;

  if ((s.min_days > 0 || s.verify_role) && !requestMember?.roles?.cache) {
    requestMember = await guild.members.fetch(user.id).catch(() => null);
  }

  if (s.min_days > 0 && requestMember?.joinedTimestamp) {
    const days = (Date.now() - requestMember.joinedTimestamp) / 86400000;
    if (days < s.min_days) {
      return replyError(interaction, `You must be in the server for at least **${s.min_days} day(s)** to open a ticket.`);
    }
  }

  if (s.global_ticket_limit > 0) {
    const totalOpen = await tickets.countOpenByGuild(guild.id);
    if (totalOpen >= s.global_ticket_limit) {
      return replyError(
        interaction,
        `This server reached the global limit of **${s.global_ticket_limit}** open tickets. Please wait until space is available.`
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
      `You already have **${openTicketCount}/${maxPerUser}** open tickets${openMentions ? `: ${openMentions}` : "."}`
    );
  }

  if (s.cooldown_minutes > 0) {
    const remaining = await cooldowns.check(user.id, guild.id, s.cooldown_minutes);
    if (remaining) {
      return replyError(interaction, `Please wait **${remaining} minute(s)** before opening another ticket.`);
    }
  }

  if (s.maintenance_mode) {
    return interaction.reply({ embeds: [E.maintenanceEmbed(s.maintenance_reason)], flags: 64 });
  }

  const banned = await blacklist.check(user.id, guild.id);
  if (banned) {
    return replyError(interaction, `You are blacklisted.\n**Reason:** ${banned.reason || "No reason provided"}`);
  }

  if (s.verify_role && requestMember && !requestMember.roles.cache.has(s.verify_role)) {
    return replyError(interaction, `You need the role <@&${s.verify_role}> to open tickets.`);
  }

  const unratedTickets = await tickets.getUnratedClosedTickets(user.id, guild.id);
  if (unratedTickets && unratedTickets.length > 0) {
    const ticketListDetailed = unratedTickets.map((item, index) => {
      const closedDate = item.closed_at
        ? `<t:${Math.floor(new Date(item.closed_at).getTime() / 1000)}:R>`
        : "Recently";
      return `${index + 1}. **Ticket #${item.ticket_id}** - ${item.category || "General"} (Closed ${closedDate})`;
    }).join("\n");

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.WARNING)
          .setTitle("Pending ticket ratings")
          .setDescription(
            `You have **${unratedTickets.length}** closed ticket(s) waiting for a rating:\n\n` +
            ticketListDetailed +
            "\n\n**Why does rating matter?**\n" +
            "Your feedback helps us improve the service and is required before opening new tickets.\n\n" +
            "**Check your DMs** to find the pending rating prompts.\n" +
            "If you cannot find them, use the button below to resend them."
          )
          .setFooter({ text: "TON618 Tickets - Rating system" })
          .setTimestamp(),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`resend_ratings_${user.id}`)
            .setLabel("Resend rating prompts")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
      flags: 64,
    });
  }

  await interaction.deferReply({ flags: 64 });

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return interaction.editReply({
      embeds: [E.errorEmbed("I could not verify my permissions in this server.")],
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
        E.errorEmbed(
          "I do not have the permissions required to create tickets.\n\n" +
          "Required permissions: Manage Channels, View Channel, Send Messages, Manage Roles."
        ),
      ],
    });
  }

  try {
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
      postCreateWarnings.push("The welcome message could not be sent.");
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
        { name: "User", value: `<@${user.id}>`, inline: true },
        { name: TICKET_FIELD_CATEGORY, value: category.label, inline: true },
        { name: "Ticket ID", value: `#${ticketId}`, inline: true },
        { name: "Created", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        { name: TICKET_FIELD_PRIORITY, value: priorityLabel(category.priority || "normal"), inline: true },
        { name: TICKET_FIELD_STATUS, value: formatTicketWorkflowStatus("open"), inline: true }
      )
      .setColor(controlPresentation.color)
      .setFooter({
        text: controlPresentation.footer,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    if (autoAssignee?.id) {
      controlPanel.addFields({
        name: TICKET_FIELD_ASSIGNED,
        value: `<@${autoAssignee.id}>`,
        inline: true,
      });
    }

    if (answers?.length) {
      const questions = category.questions || [];
      const qaText = answers
        .map((answer, index) => `**${questions[index] || `Question ${index + 1}`}**\n${answer}`)
        .join("\n\n");
      controlPanel.addFields({ name: "Submitted form", value: qaText.substring(0, 1000) });
    }

    const controlButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_close")
        .setLabel("Close")
        .setEmoji("\u{1F512}")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("ticket_claim")
        .setLabel("Claim")
        .setEmoji("\u{1F44B}")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("ticket_transcript")
        .setLabel("Transcript")
        .setEmoji("\u{1F4C4}")
        .setStyle(ButtonStyle.Secondary)
    );

    const quickActions = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("staff_quick_actions")
        .setPlaceholder("Quick staff actions...")
        .addOptions(buildStaffQuickActionOptions())
    );

    try {
      await channel.send({
        embeds: [controlPanel],
        components: [controlButtons, quickActions],
      });
    } catch (controlPanelError) {
      console.error("[TICKET CONTROL PANEL ERROR]", controlPanelError);
      postCreateWarnings.push("The control panel could not be sent.");
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
              .setTitle("Ticket created")
              .setDescription(
                `Your ticket **#${ticketId}** has been created in **${guild.name}**.\n` +
                `Channel: <#${channel.id}>\n\n` +
                "We will let you know when the staff replies."
              )
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setFooter({
                text: `${guild.name} - TON618 Tickets`,
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
          .setTitle("Ticket created successfully")
          .setDescription(
            `Your ticket has been created: <#${channel.id}> | **#${ticketId}**\n\n` +
            "Please go to the channel to continue your request." +
            (postCreateWarnings.length ? `\n\nWarning: ${postCreateWarnings.join(" ")}` : "")
          )
          .setFooter({
            text: `${guild.name} - TON618 Tickets`,
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

    await interaction.editReply({
      embeds: [E.errorEmbed(resolveTicketCreateErrorMessage(err))],
    });
  }
}

module.exports = { createTicket };
