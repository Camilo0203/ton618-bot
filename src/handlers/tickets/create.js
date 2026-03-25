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
  categories,
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
  replyError,
  priorityLabel,
  recordTicketEventSafe,
  resolveQueueTypeFromCategory,
  sendLog,
  resolveTicketCreateErrorMessage,
} = require("./shared");

async function createTicket(interaction, categoryId, answers = []) {
  const guild = interaction.guild;
  const user = interaction.user;
  const s = await settings.get(guild.id);
  const category = categories.find((entry) => entry.id === categoryId);
  let requestMember = interaction.member ?? null;
  let channel = null;
  let ticket = null;
  const postCreateWarnings = [];

  if (!category) return replyError(interaction, "Categoria no encontrada.");
  if (isCategoryBlockedByIncident(s, category.id)) {
    return replyError(interaction, resolveIncidentMessage(s));
  }

  const sanitizedAnswers = sanitizeTicketAnswers(Array.isArray(answers) ? answers : [], {
    minLength: 3,
    firstMinLength: 8,
    maxLength: 500,
  });
  if (!sanitizedAnswers.valid) {
    return replyError(interaction, "El formulario no es valido. Amplia la primera respuesta.");
  }
  answers = sanitizedAnswers.answers;

  if ((s.min_days > 0 || s.verify_role) && !requestMember?.roles?.cache) {
    requestMember = await guild.members.fetch(user.id).catch(() => null);
  }

  if (s.min_days > 0 && requestMember?.joinedTimestamp) {
    const days = (Date.now() - requestMember.joinedTimestamp) / 86400000;
    if (days < s.min_days) {
      return replyError(interaction, `Debes llevar al menos **${s.min_days} dia(s)** en el servidor para abrir un ticket.`);
    }
  }

  if (s.global_ticket_limit > 0) {
    const totalOpen = await tickets.countOpenByGuild(guild.id);
    if (totalOpen >= s.global_ticket_limit) {
      return replyError(interaction, `El servidor ha alcanzado el limite global de **${s.global_ticket_limit}** tickets abiertos. Por favor, espera a que se libere espacio.`);
    }
  }

  const maxPerUser = s.max_tickets || 3;
  const openTicketCount = await tickets.countByUser(user.id, guild.id);
  if (openTicketCount >= maxPerUser) {
    const openTickets = await tickets.getOpenReferencesByUser(user.id, guild.id, maxPerUser);
    const openMentions = openTickets.map((openTicket) => `<#${openTicket.channel_id}>`).join(", ");
    return replyError(interaction, `Ya tienes **${openTicketCount}/${maxPerUser}** tickets abiertos${openMentions ? `: ${openMentions}` : "."}`);
  }

  if (s.cooldown_minutes > 0) {
    const remaining = await cooldowns.check(user.id, guild.id, s.cooldown_minutes);
    if (remaining) {
      return replyError(interaction, `Debes esperar **${remaining} minuto(s)** antes de abrir otro ticket.`);
    }
  }

  if (s.maintenance_mode) {
    return interaction.reply({ embeds: [E.maintenanceEmbed(s.maintenance_reason)], flags: 64 });
  }

  const banned = await blacklist.check(user.id, guild.id);
  if (banned) return replyError(interaction, `Estas en la lista negra.\n**Razon:** ${banned.reason || "Sin razon"}`);

  if (s.verify_role && requestMember && !requestMember.roles.cache.has(s.verify_role)) {
    return replyError(interaction, `Necesitas el rol <@&${s.verify_role}> para abrir tickets.`);
  }

  await interaction.deferReply({ flags: 64 });

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return interaction.editReply({
      embeds: [E.errorEmbed("No pude verificar mis permisos en el servidor.")]
    });
  }

  const requiredPermissions = [
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageRoles,
  ];

  const missingPermissions = requiredPermissions.filter(perm => !botMember.permissions.has(perm));
  if (missingPermissions.length > 0) {
    return interaction.editReply({
      embeds: [E.errorEmbed(
        "No tengo los permisos necesarios para crear tickets.\n\n" +
        "Permisos requeridos: Gestionar canales, Ver canales, Enviar mensajes, Gestionar roles."
      )]
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
          PermissionFlagsBits.AddReactions
        ] 
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
          PermissionFlagsBits.AttachFiles
        ] 
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
          PermissionFlagsBits.AddReactions
        ] 
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
          PermissionFlagsBits.EmbedLinks
        ] 
      });
    }

    category.pingRoles?.forEach((roleId) => {
      if (roleId && !perms.find((perm) => perm.id === roleId)) {
        perms.push({ 
          id: roleId, 
          allow: [
            PermissionFlagsBits.ViewChannel, 
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ] 
        });
      }
    });

    const channelOptions = {
      name: channelName,
      type: ChannelType.GuildText,
      topic: `Ticket de <@${user.id}> | ${category.label} | #${ticketId}${autoAssignee ? ` | Staff: <@${autoAssignee.id}>` : ''}`,
      permissionOverwrites: perms,
    };

    if (category.categoryId) channelOptions.parent = category.categoryId;

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
      if (pings.length > 0) {
        await channel.send({
          content: `> <@${user.id}>, tu ticket **#${ticketId}** fue creado.\n\n${pings.join(" ")}`,
        });
      } else {
        await channel.send({
          content: `> <@${user.id}>, tu ticket **#${ticketId}** fue creado. Describe tu situacion con detalle.`,
        });
      }
    } catch (channelGreetingError) {
      console.error("[TICKET OPEN MESSAGE ERROR]", channelGreetingError);
      postCreateWarnings.push("No se pudo publicar el mensaje inicial del ticket.");
    }

    const controlPanel = new EmbedBuilder()
      .setTitle("Panel de Control")
      .setDescription(
        `Este es el panel de control para el ticket **#${ticketId}**.\n` +
        "Utiliza los botones de abajo para gestionar este ticket."
      )
      .addFields(
        { name: "Usuario", value: `<@${user.id}>`, inline: true },
        { name: TICKET_FIELD_CATEGORY, value: category.label, inline: true },
        { name: "ID", value: `#${ticketId}`, inline: true },
        { name: "Creado", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        { name: TICKET_FIELD_PRIORITY, value: priorityLabel(category.priority || "normal"), inline: true },
        { name: "Estado", value: "<:greendot:1486126957526782002> Abierto", inline: true }
      )
      .setColor(category.color || 0x5865F2)
      .setFooter({
        text: `${guild.name} - TON618 Tickets`,
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
        .map((answer, index) => `**${questions[index] || `Pregunta ${index + 1}`}**\n${answer}`)
        .join("\n\n");
      controlPanel.addFields({ name: "Formulario", value: qaText.substring(0, 1000) });
    }

    const controlButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_close")
        .setLabel("Cerrar")
        .setEmoji("\u{1F512}")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("ticket_claim")
        .setLabel("Reclamar")
        .setEmoji("\u{1F44B}")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("ticket_transcript")
        .setLabel("Transcripcion")
        .setEmoji("\u{1F4C4}")
        .setStyle(ButtonStyle.Secondary)
    );

    const quickActions = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("staff_quick_actions")
        .setPlaceholder("\u26A1 Acciones R\u00E1pidas de Staff...")
        .addOptions([
          { label: "Prioridad: Baja", value: "priority_low", emoji: "1486126771605606450" },
          { label: "Prioridad: Normal", value: "priority_normal", emoji: "1486126775330275379" },
          { label: "Prioridad: Alta", value: "priority_high", emoji: "1486126769697329212" },
          { label: "Prioridad: Urgente", value: "priority_urgent", emoji: "1486126773212152034" },
          { label: "Estado: En Espera", value: "status_wait", emoji: "1486126959531528242" },
          { label: "Estado: Pendiente Cliente", value: "status_pending", emoji: "1486126957526782002" },
          { label: "Estado: En Revisi\u00F3n", value: "status_review", emoji: "1486126956243193886" },
        ])
    );

    try {
      await channel.send({
        embeds: [controlPanel],
        components: [controlButtons, quickActions],
      });
    } catch (controlPanelError) {
      console.error("[TICKET CONTROL PANEL ERROR]", controlPanelError);
      postCreateWarnings.push("No se pudo publicar el panel de control.");
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
      title: "Ticket creado",
      description: `Se abrio el ticket #${ticketId} en la categoria ${category.label}.`,
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
              .setTitle("Ticket Creado")
              .setDescription(
                `Tu ticket **#${ticketId}** ha sido creado en **${guild.name}**.\n` +
                `Canal: <#${channel.id}>\n\n` +
                "Te avisaremos cuando el staff responda."
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
        console.log(`[DM ERROR] No se pudo enviar DM al usuario ${user.id}: ${dmError.message}`);
      }
    }

    await sendLog(guild, s, "open", user, ticket, { "Canal": `<#${channel.id}>` });
    await updateDashboard(guild);

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("Ticket Creado Correctamente")
          .setDescription(
            `Tu ticket ha sido creado: <#${channel.id}> | **#${ticketId}**\n\n` +
            "Por favor, dirigete al canal para continuar con tu consulta." +
            (postCreateWarnings.length ? `\n\nAviso: ${postCreateWarnings.join(" ")}` : "")
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
        console.log(`[TICKET CLEANUP] Canal ${channel.id} eliminado tras error`);
      } catch (cleanupError) {
        console.error("[TICKET CLEANUP ERROR]", cleanupError.message);
      }
    }

    if (ticket?.ticket_id) {
      try {
        await tickets.delete(channel?.id);
        console.log(`[TICKET CLEANUP] Ticket ${ticket.ticket_id} eliminado de BD tras error`);
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
