"use strict";

const { tickets, settings, E, categories, EmbedBuilder, updateDashboard } = require("./context");
const {
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_PRIORITY,
  replyError,
  recordTicketEventSafe,
  normalizeTicketFieldName,
  resolveQueueTypeFromCategory,
  sendLog,
  priorityLabel,
} = require("./shared");

async function addUser(interaction, user) {
  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.status === "closed") return replyError(interaction, "No puedes añadir usuarios a un ticket cerrado.");
  
  if (user.bot) {
    return replyError(interaction, "No puedes añadir bots al ticket.");
  }

  if (user.id === ticket.user_id) {
    return replyError(interaction, "Este usuario ya es el creador del ticket.");
  }

  const guild = interaction.guild;
  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, "No pude verificar mis permisos en el servidor.");
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "No tengo el permiso 'Gestionar Canales' necesario para añadir usuarios.");
  }

  try {
    await interaction.channel.permissionOverwrites.edit(user, {
      ViewChannel: true, 
      SendMessages: true, 
      ReadMessageHistory: true, 
      AttachFiles: true,
      EmbedLinks: true,
      AddReactions: true,
    });
  } catch (error) {
    console.error('[ADD USER ERROR]', error.message);
    return replyError(interaction, `Error al dar permisos al usuario: ${error.message}`);
  }

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "user_added",
    visibility: "internal",
    title: "Usuario añadido",
    description: `${interaction.user.tag} añadió a ${user.tag} al ticket #${ticket.ticket_id}.`,
    metadata: {
      addedUserId: user.id,
      addedUserTag: user.tag,
    },
  });
  
  return interaction.reply({ 
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("➕ Usuario añadido")
        .setDescription(`<@${user.id}> ha sido añadido al ticket y puede ver el canal.`)
        .setFooter({ 
          text: "TON618 Tickets",
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()
    ] 
  });
}

async function removeUser(interaction, user) {
  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.status === "closed") return replyError(interaction, "No puedes quitar usuarios de un ticket cerrado.");
  if (user.id === ticket.user_id) return replyError(interaction, "No puedes quitar al creador del ticket.");
  
  const guild = interaction.guild;
  const s = await settings.get(guild.id);

  if (user.id === interaction.client.user.id) {
    return replyError(interaction, "No puedes quitar al bot del ticket.");
  }

  if (s.support_role && user.id === s.support_role) {
    return replyError(interaction, "No puedes quitar el rol de soporte del ticket.");
  }

  if (s.admin_role && user.id === s.admin_role) {
    return replyError(interaction, "No puedes quitar el rol de administrador del ticket.");
  }

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, "No pude verificar mis permisos en el servidor.");
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "No tengo el permiso 'Gestionar Canales' necesario para quitar usuarios.");
  }

  try {
    await interaction.channel.permissionOverwrites.delete(user);
  } catch (error) {
    console.error('[REMOVE USER ERROR]', error.message);
    return replyError(interaction, `Error al quitar permisos al usuario: ${error.message}`);
  }

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "user_removed",
    visibility: "internal",
    title: "Usuario quitado",
    description: `${interaction.user.tag} quitó a ${user.tag} del ticket #${ticket.ticket_id}.`,
    metadata: {
      removedUserId: user.id,
      removedUserTag: user.tag,
    },
  });
  
  return interaction.reply({ 
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("➖ Usuario quitado")
        .setDescription(`<@${user.id}> ha sido quitado del ticket y ya no puede verlo.`)
        .setFooter({ 
          text: "TON618 Tickets",
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()
    ] 
  });
}

// -----------------------------------------------------
//   MOVER CATEGORIA
// -----------------------------------------------------
async function moveTicket(interaction, newCategoryId) {
  await interaction.deferReply({ flags: 64 });

  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.status === "closed") return replyError(interaction, "No puedes mover un ticket cerrado.");
  
  const newCategory = categories.find(c => c.id === newCategoryId);
  if (!newCategory) return replyError(interaction, "Categoria no encontrada.");

  if (ticket.category_id === newCategoryId) {
    return replyError(interaction, "El ticket ya está en esta categoría.");
  }

  const guild = interaction.guild;
  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, "No pude verificar mis permisos en el servidor.");
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "No tengo el permiso 'Gestionar Canales' necesario para mover tickets.");
  }

  const oldCategory = ticket.category;
  const oldCategoryId = ticket.category_id;
  
  const updateResult = await tickets.update(interaction.channel.id, { 
    category: newCategory.label, 
    category_id: newCategory.id, 
    queue_type: resolveQueueTypeFromCategory(newCategory.id),
    priority: newCategory.priority || "normal" 
  });

  if (!updateResult) {
    return replyError(interaction, "Error al actualizar la categoría del ticket en la base de datos.");
  }

  const s = await settings.get(guild.id);

  if (newCategory.categoryId) {
    try {
      await interaction.channel.setParent(newCategory.categoryId, { lockPermissions: false });
      console.log(`[MOVE] Canal movido a la categoría de Discord ${newCategory.categoryId}`);
    } catch (error) {
      console.error('[MOVE PARENT ERROR]', error.message);
    }
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
      
      // Actualizar los campos de categoria y prioridad
      const newFields = oldEmbed.fields.map(f => {
        const normalizedFieldName = normalizeTicketFieldName(f.name);
        if (normalizedFieldName === TICKET_FIELD_CATEGORY) {
          return { name: TICKET_FIELD_CATEGORY, value: newCategory.label, inline: f.inline };
        }
        if (normalizedFieldName === TICKET_FIELD_PRIORITY) {
          return { name: TICKET_FIELD_PRIORITY, value: priorityLabel(newCategory.priority || "normal"), inline: f.inline };
        }
        return { ...f, name: normalizedFieldName };
      });
      
      const newEmbed = EmbedBuilder.from(oldEmbed)
        .setColor(newCategory.color || 0x5865F2)
        .setFields(newFields);
      
      await ticketMsg.edit({ embeds: [newEmbed] });
    }
  } catch (e) {
    console.error("[MOVE UPDATE EMBED]", e.message);
  }

  const updatedTicket = await tickets.get(interaction.channel.id);
  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_moved",
    visibility: "internal",
    title: "Categoria actualizada",
    description: `${interaction.user.tag} movio el ticket #${ticket.ticket_id} de ${oldCategory} a ${newCategory.label}.`,
    metadata: {
      previousCategory: oldCategory,
      previousCategoryId: oldCategoryId,
      nextCategory: newCategory.label,
      nextCategoryId: newCategory.id,
      newPriority: newCategory.priority || "normal",
    },
  });
  
  await sendLog(guild, s, "move", interaction.user, updatedTicket, {
    "Anterior": oldCategory, 
    "Nueva": newCategory.label,
    "Prioridad actualizada": priorityLabel(newCategory.priority || "normal"),
  }).catch(err => console.error('[MOVE LOG ERROR]', err.message));

  return interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(newCategory.color || E.Colors.INFO)
        .setTitle("📂 Categoría cambiada")
        .setDescription(
          `Ticket movido de **${oldCategory}** → **${newCategory.label}**\n\n` +
          `**Nueva prioridad:** ${priorityLabel(newCategory.priority || "normal")}`
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
//   RATING PREMIUM (por DM al usuario)
// -----------------------------------------------------

module.exports = {
  addUser,
  removeUser,
  moveTicket,
};
