"use strict";

const {
  tickets,
  settings,
  staffStats,
  E,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("./context");
const {
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_ASSIGNED,
  TICKET_FIELD_CLAIMED,
  replyError,
  recordTicketEventSafe,
  normalizeTicketFieldName,
  sendLog,
} = require("./shared");

async function claimTicket(interaction) {
  await interaction.deferReply({ flags: 64 });
  console.log('[CLAIM] Iniciando proceso de reclamacion de ticket');

  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.status === "closed") return replyError(interaction, "No puedes reclamar un ticket cerrado.");

  const guild = interaction.guild;
  const s = await settings.get(guild.id);

  // Validar que el usuario sea staff
  const isStaff = interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
    (s.support_role && interaction.member.roles.cache.has(s.support_role)) ||
    (s.admin_role && interaction.member.roles.cache.has(s.admin_role));

  if (!isStaff) {
    return replyError(interaction, "Solo el staff puede reclamar tickets.");
  }

  if (ticket.claimed_by) {
    if (ticket.claimed_by === interaction.user.id) {
      return replyError(interaction, "Ya has reclamado este ticket.");
    }
    return replyError(interaction, `Ya reclamado por <@${ticket.claimed_by}>. Usa /ticket unclaim primero.`);
  }
  
  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, "No pude verificar mis permisos en el servidor.");
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "No tengo el permiso 'Gestionar Canales' necesario para reclamar este ticket.");
  }

  const freshTicket = await tickets.get(interaction.channel.id);
  if (freshTicket?.claimed_by && freshTicket.claimed_by !== interaction.user.id) {
    return replyError(interaction, `Este ticket fue reclamado por <@${freshTicket.claimed_by}> mientras procesaba tu solicitud.`);
  }

  const updateResult = await tickets.update(interaction.channel.id, {
    claimed_by: interaction.user.id,
    claimed_by_tag: interaction.user.tag,
    workflow_status: "triage",
    status_label: "En Atención",
  });

  if (!updateResult) {
    return replyError(interaction, "Error al actualizar el ticket en la base de datos. Intenta de nuevo.");
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

  const permissionUpdates = [];
  
  if (s.support_role) {
    permissionUpdates.push(
      interaction.channel.permissionOverwrites.edit(s.support_role, {
        ViewChannel: true,
        SendMessages: false,
        ReadMessageHistory: true,
        ManageMessages: false,
      }).then(() => {
        console.log('[CLAIM] Permisos del rol de soporte actualizados');
        return { role: 'support', success: true };
      }).catch(error => {
        console.error(`[CLAIM PERMISSIONS ERROR] Rol de soporte: ${error.message}`);
        return { role: 'support', success: false, error: error.message };
      })
    );
  }
  
  if (s.admin_role && s.admin_role !== s.support_role) {
    permissionUpdates.push(
      interaction.channel.permissionOverwrites.edit(s.admin_role, {
        ViewChannel: true,
        SendMessages: false,
        ReadMessageHistory: true,
        ManageMessages: false,
      }).then(() => {
        console.log('[CLAIM] Permisos del rol de admin actualizados');
        return { role: 'admin', success: true };
      }).catch(error => {
        console.error(`[CLAIM PERMISSIONS ERROR] Rol de admin: ${error.message}`);
        return { role: 'admin', success: false, error: error.message };
      })
    );
  }

  permissionUpdates.push(
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
    })
  );

  const permResults = await Promise.all(permissionUpdates);
  const claimerPermSuccess = permResults.find(r => r.role === 'claimer')?.success;
  
  if (!claimerPermSuccess) {
    console.error('[CLAIM] CRITICAL: No se pudieron dar permisos al reclamante');
  }

  // Actualizacion del mensaje: logica mas robusta para editar el embed
  try {
    const msgs = await interaction.channel.messages.fetch({ limit: 10 });
    const ticketMsg = msgs.find(m => 
      m.author.id === interaction.client.user.id && 
      m.embeds.length > 0 &&
      m.embeds[0].title?.includes("Panel de Control")
    );
    
    if (ticketMsg) {
      const oldEmbed = ticketMsg.embeds[0];
      
      // Crear un nuevo embed preservando todas las propiedades del original
      const newEmbed = new EmbedBuilder()
        .setTitle(oldEmbed.title || "Panel de Control")
        .setDescription(oldEmbed.description || "")
        .setColor(0x57F287) // Verde para tickets reclamados
        .setFooter(oldEmbed.footer)
        .setTimestamp(oldEmbed.timestamp ? new Date(oldEmbed.timestamp) : new Date());
      
      // Copiar todos los campos existentes
      if (oldEmbed.fields && oldEmbed.fields.length > 0) {
        oldEmbed.fields.forEach(field => {
          const normalizedFieldName = normalizeTicketFieldName(field.name);
          if (normalizedFieldName !== TICKET_FIELD_CLAIMED) {
            newEmbed.addFields({ 
              name: normalizedFieldName, 
              value: field.value, 
              inline: field.inline 
            });
          }
        });
      }
      
      // Anadir el campo de reclamado y actualizar topic
      newEmbed.addFields({ 
        name: TICKET_FIELD_CLAIMED, 
        value: `<@${interaction.user.id}>`, 
        inline: true 
      });

      // Mejorar el thumbnail con el avatar del staff para un toque personal
      newEmbed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));
      
      // Actualizar los botones (deshabilitar el boton de reclamar)
      const oldComponents = ticketMsg.components;
      const newComponents = oldComponents.map(row => {
        const newRow = ActionRowBuilder.from(row);
        newRow.components = newRow.components.map(component => {
          if (component.type === 2) { // Button
            const newButton = ButtonBuilder.from(component);
            if (component.customId === "ticket_claim") {
              newButton.setDisabled(true);
              newButton.setLabel("Reclamado");
              newButton.setStyle(ButtonStyle.Secondary);
            }
            return newButton;
          }
          return component;
        });
        return newRow;
      });

      // Incluir el menu de acciones rapidas si no estaba
      if (newComponents.length < 2) {
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
        newComponents.push(quickActions);
      }
      
      await ticketMsg.edit({ embeds: [newEmbed], components: newComponents });
      console.log('[CLAIM] Mensaje editado correctamente');
    } else {
      console.log('[CLAIM] No se encontro el mensaje del panel de control');
    }
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
          .setTitle("Tu ticket esta siendo atendido")
          .setDescription(
            `Tu ticket **#${ticket.ticket_id}** en **${interaction.guild.name}** ya tiene a alguien atendiendolo.\n\n` +
            `**Staff asignado:** ${interaction.user.tag}\n` +
            `**${TICKET_FIELD_CATEGORY}:** ${ticket.category}\n` +
            `**Canal:** [Ir al ticket](${channelLink})\n\n` +
            "Haz clic en el enlace de arriba para ir directamente a tu ticket y continuar la conversacion."
          )
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `${interaction.guild.name} - TON618 Tickets` })
          .setTimestamp();

        await user.send({ embeds: [dmEmbed] });
        dmEnviado = true;
        console.log('[CLAIM] DM enviado al usuario');
      }
    } catch (dmError) {
      console.error(`[DM ERROR] No se pudo enviar DM al usuario ${ticket.user_id}: ${dmError.message}`);
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
    title: "Ticket reclamado",
    description: `${interaction.user.tag} reclamo el ticket #${ticket.ticket_id}.`,
    metadata: {
      notifiedUserByDm: dmEnviado,
      permissionResults: permResults,
    },
  });

  await sendLog(guild, s, "claim", interaction.user, updateResult, {
    "Reclamado por": `<@${interaction.user.id}>`,
  }).catch(err => console.error('[CLAIM LOG ERROR]', err.message));

  console.log('[CLAIM] Proceso completado con exito');
  
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

  if (s.support_role) {
    permissionRestores.push(
      interaction.channel.permissionOverwrites.edit(s.support_role, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
        ManageMessages: true,
        AttachFiles: true,
        EmbedLinks: true,
        AddReactions: true,
      }).then(() => ({ role: 'support', success: true }))
        .catch(error => ({ role: 'support', success: false, error: error.message }))
    );
  }

  if (s.admin_role && s.admin_role !== s.support_role) {
    permissionRestores.push(
      interaction.channel.permissionOverwrites.edit(s.admin_role, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
        ManageMessages: true,
        AttachFiles: true,
        EmbedLinks: true,
      }).then(() => ({ role: 'admin', success: true }))
        .catch(error => ({ role: 'admin', success: false, error: error.message }))
    );
  }

  if (ticket.claimed_by && ticket.claimed_by !== interaction.user.id) {
    permissionRestores.push(
      interaction.channel.permissionOverwrites.delete(ticket.claimed_by)
        .then(() => ({ role: 'previous_claimer', success: true }))
        .catch(error => ({ role: 'previous_claimer', success: false, error: error.message }))
    );
  }

  const permResults = await Promise.all(permissionRestores);
  
  // Actualizar el embed del ticket
  try {
    const msgs = await interaction.channel.messages.fetch({ limit: 10 });
    const ticketMsg = msgs.find(m => 
      m.author.id === interaction.client.user.id && 
      m.embeds.length > 0 &&
      m.embeds[0].title?.includes("Panel de Control")
    );
    
    if (ticketMsg) {
      const oldEmbed = ticketMsg.embeds[0];
      const newFields = oldEmbed.fields.filter((field) => normalizeTicketFieldName(field.name) !== TICKET_FIELD_CLAIMED);
      
      const newEmbed = EmbedBuilder.from(oldEmbed)
        .setColor(0x5865F2) // Volver al color original
        .setFields(newFields);
      
      // Actualizar los botones (habilitar el boton de reclamar)
      const oldComponents = ticketMsg.components;
      const newComponents = oldComponents.map(row => {
        const newRow = ActionRowBuilder.from(row);
        newRow.components = newRow.components.map(button => {
          const newButton = ButtonBuilder.from(button);
          if (button.customId === "ticket_claim") {
            newButton.setDisabled(false);
            newButton.setLabel("Reclamar");
          }
          return newButton;
        });
        return newRow;
      });
      
      await ticketMsg.edit({ embeds: [newEmbed], components: newComponents });
    }
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
      m.embeds[0].title?.includes("Panel de Control")
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
