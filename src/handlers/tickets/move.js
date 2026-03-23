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
  
  // Dar permisos al usuario
  await interaction.channel.permissionOverwrites.edit(user, {
    ViewChannel: true, 
    SendMessages: true, 
    ReadMessageHistory: true, 
    AttachFiles: true,
  });
  
  return interaction.reply({ 
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("Usuario anadido")
        .setDescription(`<@${user.id}> ha sido anadido al ticket.`)
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
  if (user.id === ticket.user_id) return replyError(interaction, "No puedes quitar al creador del ticket.");
  
  // Quitar permisos al usuario
  await interaction.channel.permissionOverwrites.delete(user).catch(() => {});
  
  return interaction.reply({ 
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("Usuario quitado")
        .setDescription(`<@${user.id}> ha sido quitado del ticket.`)
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
  // Respuesta inmediata: anadir deferReply al inicio para evitar timeout
  await interaction.deferReply({ flags: 64 });

  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  const newCategory = categories.find(c => c.id === newCategoryId);
  if (!newCategory) return replyError(interaction, "Categoria no encontrada.");

  const oldCategory = ticket.category;
  await tickets.update(interaction.channel.id, { 
    category: newCategory.label, 
    category_id: newCategory.id, 
    queue_type: resolveQueueTypeFromCategory(newCategory.id),
    priority: newCategory.priority || "normal" 
  });

  const guild = interaction.guild;
  const s = await settings.get(guild.id);

  // Mover a la categoria de Discord si esta configurada
  if (newCategory.categoryId) {
    await interaction.channel.setParent(newCategory.categoryId, { lockPermissions: false }).catch(() => {});
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
      nextCategory: newCategory.label,
      nextCategoryId: newCategory.id,
    },
  });
  await sendLog(guild, s, "move", interaction.user, updatedTicket, {
    "Anterior": oldCategory, 
    "Nueva": newCategory.label,
  });

  return interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.INFO)
        .setTitle("Categoria cambiada")
        .setDescription(`Ticket movido de **${oldCategory}** -> **${newCategory.label}**`)
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
