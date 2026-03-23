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
  // Respuesta inmediata: anadir deferReply al inicio para evitar timeout
  await interaction.deferReply({ flags: 64 });
  console.log('[CLAIM] Iniciando proceso de reclamacion de ticket');

  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.claimed_by) return replyError(interaction, `Ya reclamado por <@${ticket.claimed_by}>.`);

  const guild = interaction.guild;
  const s = await settings.get(guild.id);
  
  // Verificar que el bot tenga permisos de ManageChannels
  const botMember = await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember || !interaction.channel.permissionsFor(botMember).has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "No tengo los permisos necesarios (ManageChannels) para reclamar este ticket.");
  }
  
  // Verificacion de base de datos: actualizar BD antes de cambiar permisos
  await tickets.update(interaction.channel.id, {
    claimed_by: interaction.user.id,
    claimed_by_tag: interaction.user.tag,
    workflow_status: "triage",
  });
  await staffStats.incrementClaimed(guild.id, interaction.user.id);
  console.log('[CLAIM] BD actualizada correctamente');
  
  // Actualizar topic del canal
  try {
    await interaction.channel.setTopic(`${interaction.channel.topic || ""} | Staff: ${interaction.user.tag}`);
    console.log('[CLAIM] Topic del canal actualizado');
  } catch (error) {
    console.error("[CLAIM TOPIC ERROR]", error.message);
    // Continuar con el proceso aunque falle el cambio de topic
  }

  // ===== LOGICA DE PERMISOS A PRUEBA DE ERRORES =====
  // Quitar permisos de escritura a otros staff (solo mantener lectura)
  let permisosStaffActualizados = false;
  if (s.support_role) {
    try {
      await interaction.channel.permissionOverwrites.edit(s.support_role, {
        ViewChannel: true,
        SendMessages: false,
        ReadMessageHistory: true,
        ManageMessages: false,
      });
      permisosStaffActualizados = true;
      console.log('[CLAIM] Permisos del rol de soporte actualizados');
    } catch (error) {
      console.error(`[CLAIM PERMISSIONS ERROR] No se pudieron actualizar los permisos para el rol de soporte: ${error.message}`);
      // Continuar con el proceso aunque falle este permiso especifico
    }
  }
  
  if (s.admin_role && s.admin_role !== s.support_role) {
    try {
      await interaction.channel.permissionOverwrites.edit(s.admin_role, {
        ViewChannel: true,
        SendMessages: false,
        ReadMessageHistory: true,
        ManageMessages: false,
      });
      console.log('[CLAIM] Permisos del rol de admin actualizados');
    } catch (error) {
      console.error(`[CLAIM PERMISSIONS ERROR] No se pudieron actualizar los permisos para el rol de admin: ${error.message}`);
      // Continuar con el proceso aunque falle este permiso especifico
    }
  }
  
  // Dar permisos completos al staff que reclamo el ticket
  try {
    await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      ManageMessages: true,
    });
    console.log('[CLAIM] Permisos del usuario reclamante actualizados');
  } catch (error) {
    console.error(`[CLAIM PERMISSIONS ERROR] No se pudieron actualizar los permisos para el usuario ${interaction.user.id}: ${error.message}`);
    
    // Si no se pudieron quitar permisos al rol de staff pero el ticket esta reclamado en BD,
    // al menos intentamos dar permisos al reclamante
    if (!permisosStaffActualizados) {
      console.log('[CLAIM] Intentando metodo alternativo para dar permisos al reclamante');
    }
  }
  // =================================

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
              { label: "Prioridad: Baja", value: "priority_low", emoji: "\u{1F7E2}" },
              { label: "Prioridad: Normal", value: "priority_normal", emoji: "\u{1F535}" },
              { label: "Prioridad: Alta", value: "priority_high", emoji: "\u{1F7E1}" },
              { label: "Prioridad: Urgente", value: "priority_urgent", emoji: "\u{1F534}" },
              { label: "Estado: En Espera", value: "status_wait", emoji: "\u23F3" },
              { label: "Estado: Pendiente Cliente", value: "status_pending", emoji: "\u{1F464}" },
              { label: "Estado: En Revisi\u00F3n", value: "status_review", emoji: "\u{1F50D}" },
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

  // Enviar DM al usuario notificando que su ticket ha sido reclamado
  let dmEnviado = false;
  try {
    const user = await interaction.client.users.fetch(ticket.user_id);
    const channelLink = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`;

    const dmEmbed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("Tu ticket esta siendo atendido")
      .setDescription(
        `Tu ticket **#${ticket.ticket_id}** en **${interaction.guild.name}** ya tiene a alguien atendiendolo.\n\n` +
        `**Staff asignado:** <@${interaction.user.id}>\n` +
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
  } catch (dmError) {
    console.error(`[DM ERROR] No se pudo enviar DM al usuario ${ticket.user_id}: ${dmError.message}`);
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
    },
  });

  // Enviar mensaje de confirmacion
  console.log('[CLAIM] Proceso completado con exito');
  return interaction.editReply({
    embeds: [new EmbedBuilder()
      .setColor(E.Colors.SUCCESS)
      .setTitle("Ticket reclamado")
      .setDescription(
        `Has reclamado el ticket **#${ticket.ticket_id}** correctamente.\n` +
        (dmEnviado ? "Se notifico al usuario por DM." : "No se pudo notificar al usuario (DMs desactivados).")
      )
      .setFooter({ 
        text: "TON618 Tickets",
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp()],
  });
}

async function unclaimTicket(interaction) {
  // Respuesta inmediata: anadir deferReply al inicio para evitar timeout
  await interaction.deferReply({ flags: 64 });

  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (!ticket.claimed_by) return replyError(interaction, "Este ticket no esta reclamado.");

  // Verificar que quien libera es quien reclamo el ticket o un admin
  const s = await settings.get(interaction.guild.id);
  const hasAdminPermission = interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
    || interaction.member?.permissions?.has(PermissionFlagsBits.Administrator);
  const hasConfiguredAdminRole = Boolean(s.admin_role && interaction.member.roles.cache.has(s.admin_role));
  const isAdmin = hasAdminPermission || hasConfiguredAdminRole;
  const isClaimer = ticket.claimed_by === interaction.user.id;
  
  if (!isAdmin && !isClaimer) {
    return replyError(interaction, "Solo quien reclamo el ticket o un administrador puede liberarlo.");
  }

  // Actualizar en base de datos
  await tickets.update(interaction.channel.id, {
    claimed_by: null,
    claimed_by_tag: null,
    workflow_status: "waiting_staff",
  });
  
  // Restaurar permisos para el staff
  if (s.support_role) {
    await interaction.channel.permissionOverwrites.edit(s.support_role, {
      SendMessages: true,
      ManageMessages: true,
    }).catch(() => {});
  }
  
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
    metadata: {},
  });

  return interaction.editReply({ 
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.WARNING)
        .setTitle("Ticket liberado")
        .setDescription("El ticket ha sido liberado. Cualquier miembro del staff puede reclamarlo ahora.")
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
  // Respuesta inmediata: anadir deferReply al inicio para evitar timeout
  await interaction.deferReply({ flags: 64 });

  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");

  const guild = interaction.guild;
  const s = await settings.get(guild.id);

  // Dar permisos al staff asignado
  await interaction.channel.permissionOverwrites.edit(staffUser, {
    ViewChannel: true, 
    SendMessages: true, 
    ReadMessageHistory: true, 
    AttachFiles: true,
    ManageMessages: true
  }).catch(() => {});

  // Actualizar en base de datos
  await tickets.update(interaction.channel.id, {
    assigned_to: staffUser.id,
    assigned_to_tag: staffUser.tag,
  });
  await staffStats.incrementAssigned(guild.id, staffUser.id);

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
      // Verificar si ya existe el campo "Asignado a"
      const hasAssignedField = oldEmbed.fields?.some((field) => normalizeTicketFieldName(field.name) === TICKET_FIELD_ASSIGNED);
      
      if (!hasAssignedField) {
        const newEmbed = EmbedBuilder.from(oldEmbed)
          .addFields({ name: TICKET_FIELD_ASSIGNED, value: `<@${staffUser.id}>`, inline: true });
        
        await ticketMsg.edit({ embeds: [newEmbed] });
      }
    }
  } catch (e) {
    console.error("[ASSIGN UPDATE EMBED]", e.message);
  }

  // Enviar log
  await sendLog(guild, s, "assign", interaction.user, ticket, { "Asignado a": `<@${staffUser.id}>` });

  // Notificar al staff asignado por DM
  try {
    await staffUser.send({ 
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.INFO)
          .setTitle("Ticket asignado")
          .setDescription(
            `Se te ha asignado el ticket **#${ticket.ticket_id}** en **${guild.name}**.\n\n` +
            `**${TICKET_FIELD_CATEGORY}:** ${ticket.category}\n` +
            `**Usuario:** <@${ticket.user_id}>\n` +
            `**Canal:** <#${ticket.channel_id}>\n\n` +
            `Por favor, revisa el ticket lo antes posible.`
          )
          .setFooter({ text: `${guild.name} - TON618 Tickets` })
          .setTimestamp()
      ] 
    });
  } catch (dmError) {
    console.error(`[DM ERROR] No se pudo enviar DM al staff ${staffUser.id}: ${dmError.message}`);
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
    },
  });

  return interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.INFO)
        .setTitle("Ticket asignado")
        .setDescription(`El ticket ha sido asignado a <@${staffUser.id}>.\nRecibira acceso y notificacion.`)
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
