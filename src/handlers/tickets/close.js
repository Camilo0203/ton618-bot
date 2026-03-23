"use strict";

const {
  tickets,
  settings,
  staffStats,
  generateTranscript,
  updateDashboard,
  E,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("./context");
const { TICKET_FIELD_CATEGORY, replyError, recordTicketEventSafe, sendLog } = require("./shared");
const { sendRating } = require("./rating");

async function closeTicket(interaction, reason = null) {
  const channel = interaction.channel;
  const ticket = await tickets.get(channel.id);
  
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.status === "closed") return replyError(interaction, "Este ticket ya esta cerrado.");

  const guild = interaction.guild;
  const s = await settings.get(guild.id);
  const user = await interaction.client.users.fetch(ticket.user_id).catch(() => null);

  // Verificar si la interaccion ya fue respondida o diferida antes de llamar a deferReply
  if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

  // Actualizar el ticket en la base de datos
  await tickets.close(channel.id, interaction.user.id, reason);
  await staffStats.incrementClosed(guild.id, interaction.user.id);

  const closed = await tickets.get(channel.id);

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_closed",
    visibility: "system",
    title: "Ticket cerrado",
    description: `${interaction.user.tag} cerro el ticket #${ticket.ticket_id}.`,
    metadata: {
      reason: reason || null,
    },
  });

  // Deshabilitar botones
  await disableButtons(channel);

  // Generar transcripcion
  let transcriptMsg = null;
  let transcriptAttachment = null;
  try {
    const { attachment } = await generateTranscript(channel, closed, guild);
    transcriptAttachment = attachment;
    
    if (s.transcript_channel) {
      const tCh = guild.channels.cache.get(s.transcript_channel);
      if (tCh) {
        transcriptMsg = await tCh.send({
          embeds: [transcriptEmbed(closed, {
            closedByStaff: interaction.user.id,
            closedAt: Date.now(),
            botAvatarUrl: interaction.client.user.displayAvatarURL({ dynamic: true }),
          })],
          files: [attachment],
        });
        await tickets.update(channel.id, { transcript_url: transcriptMsg.url });
      }
    }
  } catch (e) { 
    console.error("[TRANSCRIPT ERROR]", e.message); 
  }

// -----------------------------------------------------
  //   DM PROFESIONAL CON TRANSCRIPT ADJUNTO
// -----------------------------------------------------
  
  // Leer configuraciones de DM desde la base de datos
  const dmEnabled = s.dm_on_close === true;
  const dmTranscriptEnabled = s.dm_transcripts === true;
  const dmAlertsEnabled = s.dm_alerts === true;
  
  if (dmEnabled && user && dmAlertsEnabled) {
    try {
      // Calcular duracion exacta
      const createdAt = new Date(ticket.created_at);
      const closedAt = new Date();
      const durationMs = closedAt - createdAt;
      
      // Formatear duracion en formato legible
      const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let durationText = "";
      if (days > 0) durationText += `${days}d `;
      if (hours > 0) durationText += `${hours}h `;
      durationText += `${minutes}m`;
      
      // Construir el embed profesional de despedida (estilo factura/recibo)
      const dmEmbed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({ 
          name: guild.name, 
          iconURL: guild.iconURL({ dynamic: true }) 
        })
        .setTitle("Recibo de soporte")
        .setDescription(
          "Gracias por contactar con nuestro equipo de soporte. Aqui tienes un resumen de tu ticket."
        )
        .addFields(
          { name: "Ticket", value: `#${ticket.ticket_id}`, inline: true },
          { name: TICKET_FIELD_CATEGORY, value: ticket.category || "General", inline: true },
          { name: "Fecha de apertura", value: `<t:${Math.floor(createdAt.getTime() / 1000)}:F>`, inline: false },
          { name: "Fecha de cierre", value: `<t:${Math.floor(closedAt.getTime() / 1000)}:F>`, inline: true },
          { name: "Duracion total", value: durationText, inline: true },
          { name: "Razon de cierre", value: reason || "No se proporciono una razon", inline: false },
          { name: "Atendido por", value: ticket.claimed_by ? `<@${ticket.claimed_by}>` : `<@${interaction.user.id}>`, inline: true },
          { name: "Mensajes", value: `${ticket.message_count || 0}`, inline: true },
        )
        .setFooter({ 
          text: "Gracias por confiar en nuestro soporte - TON618 Tickets", 
          iconURL: channel.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();

      // Anadir enlace de transcripcion si existe
      if (transcriptMsg) {
        dmEmbed.addFields({ 
          name: "Transcripcion en linea", 
          value: `[Ver transcripcion completa](${transcriptMsg.url})`,
          inline: false 
        });
      }

      // Preparar archivos adjuntos (transcript HTML)
      const attachmentFiles = [];
      
      if (dmTranscriptEnabled && transcriptAttachment) {
        // Adjuntar el archivo de transcript si esta habilitado
        attachmentFiles.push(transcriptAttachment);
      }

      // Envio critico: try/catch estricto para evitar crasheo
      await user.send({ 
        embeds: [dmEmbed],
        files: attachmentFiles.length > 0 ? attachmentFiles : undefined
      }).then(() => {
        console.log(`[DM] Transcript sent to user ${user.id} for ticket #${ticket.ticket_id}`);
      });
      
    } catch (dmError) {
      // Error critico: el usuario tiene los DMs cerrados o bloqueados
      console.error(`[DM ERROR] No se pudo enviar DM al usuario ${user.id}:`, dmError.message);
      
      // Notificar en el canal de logs si esta configurado
      if (s.log_channel) {
        const logCh = guild.channels.cache.get(s.log_channel);
        if (logCh) {
          try {
            await logCh.send({
              embeds: [new EmbedBuilder()
                .setColor(E.Colors.WARNING)
                .setTitle("Aviso: DM no enviado")
                .setDescription(`No se pudo enviar el mensaje de cierre por DM al usuario <@${user.id}>.\n\n**Posible causa:** El usuario tiene los mensajes directos cerrados o ha bloqueado al bot.\n\n**Ticket:** #${ticket.ticket_id}`)
                .addFields(
                  { name: "Transcripcion disponible", value: transcriptMsg ? `[aqui](${transcriptMsg.url})` : "No disponible", inline: true },
                )
                .setTimestamp()]
            }).catch(() => {});
          } catch (logError) {
            console.error(`[DM ERROR] Could not send log to log channel:`, logError.message);
          }
        }
      }
    }
  }

  // Responder al comando de cierre
  // Usar editReply si la interaccion fue diferida, o followUp si ya fue respondida
  if (interaction.deferred) {
    await interaction.editReply({ embeds: [E.ticketClosed(closed, interaction.user.id, reason)] });
  } else if (interaction.replied) {
    await interaction.followUp({ embeds: [E.ticketClosed(closed, interaction.user.id, reason)] });
  }

  // Rating por DM (habilitado por defecto)
  if (user) {
    const staffWhoHandled = closed.claimed_by || closed.assigned_to || interaction.user.id;
    await sendRating(user, ticket, channel, staffWhoHandled);
  }

  // Enviar log y actualizar dashboard
  await sendLog(guild, s, "close", interaction.user, closed, {
    "Razon": reason || "Sin razon",
    "Duracion": E.duration(ticket.created_at),
    "Usuario": `<@${ticket.user_id}>`,
  });

  await updateDashboard(guild);
  
  // Mensaje de cierre y eliminacion retrasada
  await channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.WARNING)
        .setTitle("Cerrando ticket")
        .setDescription(
          `Este ticket sera eliminado en **5 segundos**...\n\n` +
          "Se ha enviado una transcripcion completa al usuario por mensaje directo."
        )
        .setFooter({ 
          text: "TON618 Tickets",
          iconURL: channel.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()
    ]
  });
  
  // Eliminar el canal despues de 5 segundos
  setTimeout(() => channel.delete().catch(() => {}), 5000);
}

// -----------------------------------------------------
//   REABRIR TICKET
// -----------------------------------------------------

async function disableButtons(channel) {
  try {
    const msgs = await channel.messages.fetch({ limit: 15 });
    for (const msg of msgs.values()) {
      if (msg.author.id === channel.client.user.id && msg.components.length > 0) {
        const rows = msg.components.map(row => {
          const r = ActionRowBuilder.from(row);
          r.components = r.components.map(c => ButtonBuilder.from(c).setDisabled(true));
          return r;
        });
        await msg.edit({ components: rows }).catch(() => {});
      }
    }
  } catch (error) {
    console.error("[DISABLE BUTTONS ERROR]", error.message);
  }
}

function transcriptEmbed(ticket, options = {}) {
  const closedByStaff = options.closedByStaff || null;
  const closedAt = options.closedAt || null;
  const botAvatarUrl = options.botAvatarUrl || null;
  // Formatear fecha de cierre
  const fechaCierre = closedAt 
    ? `<t:${Math.floor(closedAt / 1000)}:F>` 
    : (ticket.closed_at ? `<t:${Math.floor(new Date(ticket.closed_at).getTime() / 1000)}:F>` : "No disponible");
  
  // Staff que cerro el ticket
  const staffCierra = closedByStaff 
    ? `<@${closedByStaff}>` 
    : (ticket.closed_by ? `<@${ticket.closed_by}>` : "Desconocido");
  
  return new EmbedBuilder()
    .setTitle("Transcripcion de ticket")
    .setColor(0x5865F2)
    .addFields(
      { name: "Ticket", value: `#${ticket.ticket_id}`, inline: true },
      { name: "Usuario", value: `<@${ticket.user_id}>`, inline: true },
      { name: TICKET_FIELD_CATEGORY, value: ticket.category, inline: true },
      { name: "Duracion", value: E.duration(ticket.created_at), inline: true },
      { name: "Staff", value: staffCierra, inline: true },
      { name: "Cerrado", value: fechaCierre, inline: true },
      { name: "Mensajes", value: `${ticket.message_count || 0}`, inline: true },
      { name: "Rating", value: ticket.rating ? `${ticket.rating}/5` : "Sin calificar", inline: true },
    )
    .setFooter({ 
      text: "TON618 Tickets",
      iconURL: botAvatarUrl || undefined,
    })
    .setTimestamp();
}

module.exports = {
  closeTicket,
  disableButtons,
  transcriptEmbed,
};
