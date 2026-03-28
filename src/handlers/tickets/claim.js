"use strict";

const {
  tickets,
  settings,
  staffStats,
  E,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("./context");
const {
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_ASSIGNED,
  replyError,
  recordTicketEventSafe,
  sendLog,
} = require("./shared");
const {
  updateTicketControlPanelEmbed,
  updateTicketControlPanelComponents,
} = require("../../utils/ticketEmbedUpdater");

async function claimTicket(interaction) {
  await interaction.deferReply({ flags: 64 });
  console.log("[CLAIM] Starting ticket claim flow");

  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "This is not a ticket channel.");
  if (ticket.status === "closed") return replyError(interaction, "You cannot claim a closed ticket.");

  const guild = interaction.guild;
  const s = await settings.get(guild.id);

  // Validar que el usuario sea staff
  const isStaff = interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
    (s.support_role && interaction.member.roles.cache.has(s.support_role)) ||
    (s.admin_role && interaction.member.roles.cache.has(s.admin_role));

  if (!isStaff) {
    return replyError(interaction, "Only staff can claim tickets.");
  }

  if (ticket.claimed_by) {
    if (ticket.claimed_by === interaction.user.id) {
      return replyError(interaction, "You already claimed this ticket.");
    }
    return replyError(interaction, `Already claimed by <@${ticket.claimed_by}>. Use \`/ticket unclaim\` first.`);
  }
  
  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, "I could not verify my permissions in this server.");
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "I need the `Manage Channels` permission to claim this ticket.");
  }

  const updateResult = await tickets.claim(interaction.channel.id, interaction.user.id, interaction.user.tag, {
    workflow_status: "triage",
    status_label: "En Atención",
  });

  if (!updateResult) {
    const latestTicket = await tickets.get(interaction.channel.id).catch(() => null);
    if (latestTicket?.claimed_by && latestTicket.claimed_by !== interaction.user.id) {
      return replyError(interaction, `This ticket was claimed by <@${latestTicket.claimed_by}> while your request was being processed.`);
    }
    return replyError(interaction, "There was an error while updating the ticket in the database. Please try again.");
  }

  await staffStats.incrementClaimed(guild.id, interaction.user.id).catch(err => {
    console.error('[CLAIM STATS ERROR]', err.message);
  });
  console.log('[CLAIM] BD actualizada correctamente');
  
  // Actualizar topic del canal
  try {
    const currentTopic = interaction.channel.topic || "";
    const newTopic = currentTopic.includes("Staff:") 
      ? currentTopic.replace(/Staff: <@\d+>/, `Staff: <@${interaction.user.id}>`)
      : `${currentTopic} | Staff: <@${interaction.user.id}>`;
    await interaction.channel.setTopic(newTopic);
    console.log('[CLAIM] Topic del canal actualizado');
  } catch (error) {
    console.error("[CLAIM TOPIC ERROR]", error.message);
    // Continuar con el proceso aunque falle el cambio de topic
  }

  const permissionUpdates = [
    interaction.channel.permissionOverwrites.edit(interaction.user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      ManageMessages: true,
      EmbedLinks: true,
      AddReactions: true,
    }).then(() => {
      console.log('[CLAIM] Permisos del usuario reclamante actualizados');
      return { role: 'claimer', success: true };
    }).catch(error => {
      console.error(`[CLAIM PERMISSIONS ERROR] Usuario reclamante: ${error.message}`);
      return { role: 'claimer', success: false, error: error.message };
    }),
  ];

  const permResults = await Promise.all(permissionUpdates);
  const claimerPermSuccess = permResults.find(r => r.role === 'claimer')?.success;
  
  if (!claimerPermSuccess) {
    console.error('[CLAIM] CRITICAL: No se pudieron dar permisos al reclamante');
  }

  try {
    await updateTicketControlPanelEmbed(interaction.channel, updateResult, {
      color: 0x57F287,
      thumbnail: interaction.user.displayAvatarURL({ dynamic: true }),
      updateClaimed: true,
      updateAssigned: true,
      updateStatus: true,
    });
    await updateTicketControlPanelComponents(interaction.channel, updateResult);
    console.log('[CLAIM] Panel de control actualizado');
  } catch (e) {
    console.error("[CLAIM UPDATE EMBED]", e.message);
  }

  let dmEnviado = false;
  if (s.dm_alerts !== false) {
    try {
      const user = await interaction.client.users.fetch(ticket.user_id).catch(() => null);
      if (user) {
        const channelLink = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`;

        const dmEmbed = new EmbedBuilder()
          .setColor(0x57F287)
          .setTitle("Your ticket is being handled")
          .setDescription(
            `Your ticket **#${ticket.ticket_id}** in **${interaction.guild.name}** now has an assigned staff member.\n\n` +
            `**Assigned staff:** ${interaction.user.tag}\n` +
            `**${TICKET_FIELD_CATEGORY}:** ${ticket.category}\n` +
            `**Channel:** [Go to ticket](${channelLink})\n\n` +
            "Use the link above to jump directly into your ticket and continue the conversation."
          )
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `${interaction.guild.name} - TON618 Tickets` })
          .setTimestamp();

        await user.send({ embeds: [dmEmbed] });
        dmEnviado = true;
        console.log("[CLAIM] DM sent to the ticket owner");
      }
    } catch (dmError) {
      console.error(`[DM ERROR] Could not send a DM to user ${ticket.user_id}: ${dmError.message}`);
    }
  }

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_claimed",
    visibility: "internal",
    title: "Ticket claimed",
    description: `${interaction.user.tag} claimed ticket #${ticket.ticket_id}.`,
    metadata: {
      notifiedUserByDm: dmEnviado,
      permissionResults: permResults,
    },
  });

  await sendLog(guild, s, "claim", interaction.user, updateResult, {
    "Claimed by": `<@${interaction.user.id}>`,
  }).catch(err => console.error('[CLAIM LOG ERROR]', err.message));

  console.log("[CLAIM] Flow completed successfully");
  
  const warningMessages = [];
  if (!claimerPermSuccess) {
    warningMessages.push("⚠️ No se pudieron actualizar tus permisos completamente.");
  }
  if (!dmEnviado && s.dm_alerts !== false) {
    warningMessages.push("El usuario no pudo ser notificado por DM (DMs desactivados).");
  }

  return interaction.editReply({
    embeds: [new EmbedBuilder()
      .setColor(E.Colors.SUCCESS)
      .setTitle("✅ Ticket reclamado")
      .setDescription(
        `Has reclamado el ticket **#${ticket.ticket_id}** correctamente.\n\n` +
        (dmEnviado ? "✉️ Se notifico al usuario por DM." : "") +
        (warningMessages.length ? `\n\n${warningMessages.join('\n')}` : "")
      )
      .setFooter({ 
        text: "TON618 Tickets",
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp()],
  });
}

async function unclaimTicket(interaction) {
  await interaction.deferReply({ flags: 64 });

  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.status === "closed") return replyError(interaction, "No puedes liberar un ticket cerrado.");
  if (!ticket.claimed_by) return replyError(interaction, "Este ticket no esta reclamado.");

  const s = await settings.get(interaction.guild.id);
  const hasAdminPermission = interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
    || interaction.member?.permissions?.has(PermissionFlagsBits.Administrator);
  const hasConfiguredAdminRole = Boolean(s.admin_role && interaction.member.roles.cache.has(s.admin_role));
  const isAdmin = hasAdminPermission || hasConfiguredAdminRole;
  const isClaimer = ticket.claimed_by === interaction.user.id;
  
  if (!isAdmin && !isClaimer) {
    return replyError(interaction, "Solo quien reclamo el ticket o un administrador puede liberarlo.");
  }

  const updateResult = await tickets.update(interaction.channel.id, {
    claimed_by: null,
    claimed_by_tag: null,
    workflow_status: "waiting_staff",
    status_label: "Buscando Staff",
  });

  if (!updateResult) {
    return replyError(interaction, "Error al actualizar el ticket en la base de datos.");
  }

  // Actualizar topic del canal para remover staff
  try {
    const currentTopic = interaction.channel.topic || "";
    const newTopic = currentTopic.replace(/\s*\|\s*Staff: <@\d+>/, "");
    await interaction.channel.setTopic(newTopic);
    console.log('[UNCLAIM] Topic del canal actualizado');
  } catch (error) {
    console.error("[UNCLAIM TOPIC ERROR]", error.message);
  }
  
  const permissionRestores = [];

  if (ticket.claimed_by && ticket.claimed_by !== ticket.assigned_to) {
    permissionRestores.push(
      interaction.channel.permissionOverwrites.delete(ticket.claimed_by)
        .then(() => ({ role: 'previous_claimer', success: true }))
        .catch(error => ({ role: 'previous_claimer', success: false, error: error.message }))
    );
  }

  const permResults = await Promise.all(permissionRestores);
  
  try {
    await updateTicketControlPanelEmbed(interaction.channel, updateResult, {
      color: 0x5865F2,
      updateClaimed: true,
      updateAssigned: true,
      updateStatus: true,
    });
    await updateTicketControlPanelComponents(interaction.channel, updateResult);
  } catch (e) {
    console.error("[UNCLAIM UPDATE EMBED]", e.message);
  }

  await recordTicketEventSafe({
    guild_id: interaction.guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_unclaimed",
    visibility: "internal",
    title: "Ticket liberado",
    description: `${interaction.user.tag} libero el ticket #${ticket.ticket_id}.`,
    metadata: {
      previousClaimer: ticket.claimed_by,
      permissionResults: permResults,
    },
  });

  await sendLog(interaction.guild, s, "unclaim", interaction.user, updateResult, {
    "Liberado por": `<@${interaction.user.id}>`,
    "Anteriormente reclamado por": `<@${ticket.claimed_by}>`,
  }).catch(err => console.error('[UNCLAIM LOG ERROR]', err.message));

  const permWarnings = permResults.filter(r => !r.success);
  
  return interaction.editReply({ 
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.WARNING)
        .setTitle("🔓 Ticket liberado")
        .setDescription(
          "El ticket ha sido liberado. Cualquier miembro del staff puede reclamarlo ahora." +
          (permWarnings.length ? `\n\n⚠️ Algunos permisos no se pudieron restaurar completamente.` : "")
        )
        .setFooter({ 
          text: "TON618 Tickets",
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()
    ] 
  });
}

// -----------------------------------------------------
//   ASIGNAR STAFF
// -----------------------------------------------------
async function assignTicket(interaction, staffUser) {
  await interaction.deferReply({ flags: 64 });

  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.status === "closed") return replyError(interaction, "No puedes asignar un ticket cerrado.");

  const guild = interaction.guild;
  const s = await settings.get(guild.id);

  // Validar que quien ejecuta la asignación sea staff
  const isExecutorStaff = interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
    (s.support_role && interaction.member.roles.cache.has(s.support_role)) ||
    (s.admin_role && interaction.member.roles.cache.has(s.admin_role));

  if (!isExecutorStaff) {
    return replyError(interaction, "Solo el staff puede asignar tickets.");
  }

  if (staffUser.bot) {
    return replyError(interaction, "No puedes asignar el ticket a un bot.");
  }

  if (staffUser.id === ticket.user_id) {
    return replyError(interaction, "No puedes asignar el ticket al usuario que lo creó.");
  }

  const staffMember = await guild.members.fetch(staffUser.id).catch(() => null);
  if (!staffMember) {
    return replyError(interaction, "No se pudo encontrar al miembro del staff en el servidor.");
  }

  const isStaffMember = staffMember.permissions.has(PermissionFlagsBits.Administrator) ||
    (s.support_role && staffMember.roles.cache.has(s.support_role)) ||
    (s.admin_role && staffMember.roles.cache.has(s.admin_role));

  if (!isStaffMember) {
    return replyError(interaction, "Solo puedes asignar el ticket a miembros del staff (con rol de soporte o administrador).");
  }

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, "No pude verificar mis permisos en el servidor.");
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "No tengo el permiso 'Gestionar Canales' necesario para asignar tickets.");
  }

  try {
    await interaction.channel.permissionOverwrites.edit(staffUser, {
      ViewChannel: true, 
      SendMessages: true, 
      ReadMessageHistory: true, 
      AttachFiles: true,
      ManageMessages: true,
      EmbedLinks: true,
      AddReactions: true,
    });
  } catch (error) {
    console.error('[ASSIGN PERMISSIONS ERROR]', error.message);
    return replyError(interaction, `Error al dar permisos al staff: ${error.message}`);
  }

  const updateResult = await tickets.update(interaction.channel.id, {
    assigned_to: staffUser.id,
    assigned_to_tag: staffUser.tag,
    workflow_status: "assigned",
  });

  if (!updateResult) {
    return replyError(interaction, "Error al actualizar el ticket en la base de datos.");
  }

  await staffStats.incrementAssigned(guild.id, staffUser.id).catch(err => {
    console.error('[ASSIGN STATS ERROR]', err.message);
  });

  // Actualizar topic del canal para incluir staff asignado
  try {
    const currentTopic = interaction.channel.topic || "";
    const newTopic = currentTopic.includes("Staff:") 
      ? currentTopic.replace(/Staff: <@\d+>/, `Staff: <@${staffUser.id}>`)
      : `${currentTopic} | Staff: <@${staffUser.id}>`;
    await interaction.channel.setTopic(newTopic);
    console.log('[ASSIGN] Topic del canal actualizado');
  } catch (error) {
    console.error("[ASSIGN TOPIC ERROR]", error.message);
  }

  try {
    const msgs = await interaction.channel.messages.fetch({ limit: 10 });
    const ticketMsg = msgs.find(m => 
      m.author.id === interaction.client.user.id && 
      m.embeds.length > 0 &&
      isTicketControlPanelTitle(m.embeds[0].title)
    );
    
    if (ticketMsg) {
      const oldEmbed = ticketMsg.embeds[0];
      const hasAssignedField = oldEmbed.fields?.some((field) => normalizeTicketFieldName(field.name) === TICKET_FIELD_ASSIGNED);
      
      if (hasAssignedField) {
        const newFields = oldEmbed.fields.map(f => {
          if (normalizeTicketFieldName(f.name) === TICKET_FIELD_ASSIGNED) {
            return { name: TICKET_FIELD_ASSIGNED, value: `<@${staffUser.id}>`, inline: f.inline };
          }
          return f;
        });
        const newEmbed = EmbedBuilder.from(oldEmbed).setFields(newFields);
        await ticketMsg.edit({ embeds: [newEmbed] });
      } else {
        const newEmbed = EmbedBuilder.from(oldEmbed)
          .addFields({ name: TICKET_FIELD_ASSIGNED, value: `<@${staffUser.id}>`, inline: true });
        await ticketMsg.edit({ embeds: [newEmbed] });
      }
      console.log('[ASSIGN] Embed actualizado correctamente');
    }
  } catch (e) {
    console.error("[ASSIGN UPDATE EMBED]", e.message);
  }

  await sendLog(guild, s, "assign", interaction.user, updateResult, { 
    "Asignado a": `<@${staffUser.id}>`,
    "Asignado por": `<@${interaction.user.id}>`,
  }).catch(err => console.error('[ASSIGN LOG ERROR]', err.message));

  let dmSent = false;
  if (s.dm_alerts !== false) {
    try {
      const channelLink = `https://discord.com/channels/${guild.id}/${ticket.channel_id}`;
      await staffUser.send({ 
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.INFO)
            .setTitle("📌 Ticket asignado")
            .setDescription(
              `Se te ha asignado el ticket **#${ticket.ticket_id}** en **${guild.name}**.\n\n` +
              `**${TICKET_FIELD_CATEGORY}:** ${ticket.category}\n` +
              `**Usuario:** <@${ticket.user_id}>\n` +
              `**Canal:** [Ir al ticket](${channelLink})\n\n` +
              `Por favor, revisa el ticket lo antes posible.`
            )
            .setFooter({ text: `${guild.name} - TON618 Tickets` })
            .setTimestamp()
        ] 
      });
      dmSent = true;
    } catch (dmError) {
      console.error(`[DM ERROR] No se pudo enviar DM al staff ${staffUser.id}: ${dmError.message}`);
    }
  }

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_assigned",
    visibility: "internal",
    title: "Ticket asignado",
    description: `${interaction.user.tag} asigno el ticket #${ticket.ticket_id} a ${staffUser.tag}.`,
    metadata: {
      assigneeId: staffUser.id,
      assigneeLabel: staffUser.tag,
      notifiedByDm: dmSent,
    },
  });

  const warnings = [];
  if (!dmSent && s.dm_alerts !== false) {
    warnings.push("No se pudo notificar al staff por DM (DMs desactivados).");
  }

  return interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.INFO)
        .setTitle("✅ Ticket asignado")
        .setDescription(
          `El ticket **#${ticket.ticket_id}** ha sido asignado a <@${staffUser.id}>.\n\n` +
          (dmSent ? "✉️ Se notificó al staff por DM." : "") +
          (warnings.length ? `\n\n⚠️ ${warnings.join(' ')}` : "")
        )
        .setFooter({ 
          text: "TON618 Tickets",
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()
    ],
  });
}

// -----------------------------------------------------
//   ANADIR / QUITAR USUARIO
// -----------------------------------------------------

module.exports = {
  claimTicket,
  unclaimTicket,
  assignTicket,
};
