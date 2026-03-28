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
  StringSelectMenuBuilder,
  PermissionFlagsBits,
} = require("./context");
const { TICKET_FIELD_CATEGORY, replyError, recordTicketEventSafe, sendLog } = require("./shared");
const { sendRating } = require("./rating");
const {
  updateTicketControlPanelEmbed,
  updateTicketControlPanelComponents,
} = require("../../utils/ticketEmbedUpdater");

const CHANNEL_DELETE_DELAY_MS = 5000;

async function closeTicket(interaction, reason = null) {
  const channel = interaction.channel;
  const ticket = await tickets.get(channel.id);

  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.status === "closed") return replyError(interaction, "Este ticket ya esta cerrado.");

  const guild = interaction.guild;
  const s = await settings.get(guild.id);
  const user = await interaction.client.users.fetch(ticket.user_id).catch(() => null);

  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ flags: 64 });
  }

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, "No pude verificar mis permisos en el servidor.");
  }

  const channelPerms = channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "No tengo el permiso 'Gestionar Canales' necesario para cerrar este ticket.");
  }

  const closeResult = await tickets.close(channel.id, interaction.user.id, reason);
  if (!closeResult) {
    const latestTicket = await tickets.get(channel.id).catch(() => null);
    if (latestTicket?.status === "closed") {
      return replyError(interaction, "Este ticket ya fue cerrado mientras se procesaba tu solicitud.");
    }
    return replyError(interaction, "Error al cerrar el ticket en la base de datos. Intenta de nuevo.");
  }

  const closed = {
    ...closeResult,
    message_count: closeResult.message_count || ticket.message_count || 0,
  };

  await staffStats.incrementClosed(guild.id, interaction.user.id).catch((error) => {
    console.error("[CLOSE STATS ERROR]", error.message);
  });

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

  await updateTicketControlPanelEmbed(channel, closed, {
    color: E.Colors.ERROR,
    updateStatus: true,
    updateClaimed: true,
    updateAssigned: true,
  }).catch((error) => {
    console.error("[CLOSE PANEL EMBED ERROR]", error.message);
  });

  await disableButtons(channel, closed).catch((error) => {
    console.error("[DISABLE BUTTONS ERROR]", error.message);
  });

  let transcriptMsg = null;
  let transcriptAttachment = null;
  let transcriptError = null;
  let canDeleteChannel = false;

  try {
    const transcriptResult = await generateTranscript(channel, closed, guild);
    if (!transcriptResult?.success || !transcriptResult.attachment) {
      transcriptError = "No se pudo generar la transcripcion. El canal permanecera cerrado para evitar perdida de historial.";
    } else {
      transcriptAttachment = transcriptResult.attachment;
      closed.message_count = transcriptResult.messageCount ?? closed.message_count;

      if (!s.transcript_channel) {
        transcriptError = "No hay un canal de transcripciones configurado. El canal permanecera cerrado y no se eliminara automaticamente.";
      } else {
        const transcriptChannel = guild.channels.cache.get(s.transcript_channel)
          || await guild.channels.fetch(s.transcript_channel).catch(() => null);

        if (!transcriptChannel) {
          transcriptError = "El canal de transcripciones configurado no existe o no es accesible. El canal no se eliminara automaticamente.";
        } else {
          try {
            transcriptMsg = await transcriptChannel.send({
              embeds: [transcriptEmbed(closed, {
                closedByStaff: interaction.user.id,
                closedAt: Date.now(),
                botAvatarUrl: interaction.client.user.displayAvatarURL({ dynamic: true }),
              })],
              files: [transcriptAttachment],
            });

            if (transcriptMsg?.url) {
              await tickets.update(channel.id, { transcript_url: transcriptMsg.url }).catch((error) => {
                console.error("[CLOSE TRANSCRIPT URL ERROR]", error.message);
              });
            }

            canDeleteChannel = true;
          } catch (error) {
            console.error("[TRANSCRIPT SEND ERROR]", error.message);
            transcriptError = "No se pudo enviar la transcripcion al canal configurado. El canal no se eliminara automaticamente.";
          }
        }
      }
    }
  } catch (error) {
    console.error("[TRANSCRIPT ERROR]", error.message);
    transcriptError = "Error al generar la transcripcion. El canal permanecera cerrado para evitar perdida de historial.";
  }

  const dmEnabled = s.dm_on_close !== false;
  const dmTranscriptEnabled = s.dm_transcripts === true;
  const dmAlertsEnabled = s.dm_alerts !== false;
  let dmSent = false;

  if (dmEnabled && user && dmAlertsEnabled) {
    try {
      const createdAt = new Date(ticket.created_at);
      const closedAt = new Date();
      const durationText = formatDuration(createdAt, closedAt);

      const dmEmbed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setTitle("Recibo de soporte")
        .setDescription("Gracias por contactar con nuestro equipo de soporte. Aqui tienes un resumen de tu ticket.")
        .addFields(
          { name: "Ticket", value: `#${ticket.ticket_id}`, inline: true },
          { name: TICKET_FIELD_CATEGORY, value: ticket.category || "General", inline: true },
          { name: "Fecha de apertura", value: `<t:${Math.floor(createdAt.getTime() / 1000)}:F>`, inline: false },
          { name: "Fecha de cierre", value: `<t:${Math.floor(closedAt.getTime() / 1000)}:F>`, inline: true },
          { name: "Duracion total", value: durationText, inline: true },
          { name: "Razon de cierre", value: reason || "No se proporciono una razon", inline: false },
          { name: "Atendido por", value: ticket.claimed_by ? `<@${ticket.claimed_by}>` : `<@${interaction.user.id}>`, inline: true },
          { name: "Mensajes", value: `${closed.message_count || 0}`, inline: true },
        )
        .setFooter({
          text: "Gracias por confiar en nuestro soporte - TON618 Tickets",
          iconURL: channel.client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      if (transcriptMsg?.url) {
        dmEmbed.addFields({
          name: "Transcripcion en linea",
          value: `[Ver transcripcion completa](${transcriptMsg.url})`,
          inline: false,
        });
      }

      const attachmentFiles = [];
      if (dmTranscriptEnabled && transcriptAttachment) {
        attachmentFiles.push(transcriptAttachment);
      }

      await user.send({
        embeds: [dmEmbed],
        files: attachmentFiles.length > 0 ? attachmentFiles : undefined,
      });
      dmSent = true;
    } catch (error) {
      console.error(`[DM ERROR] No se pudo enviar DM al usuario ${user.id}:`, error.message);
      dmSent = false;

      if (s.log_channel) {
        const logChannel = guild.channels.cache.get(s.log_channel);
        if (logChannel) {
          await logChannel.send({
            embeds: [new EmbedBuilder()
              .setColor(E.Colors.WARNING)
              .setTitle("Aviso: DM no enviado")
              .setDescription(
                `No se pudo enviar el mensaje de cierre por DM al usuario <@${user.id}>.\n\n` +
                `**Posible causa:** El usuario tiene los mensajes directos cerrados o ha bloqueado al bot.\n\n` +
                `**Ticket:** #${ticket.ticket_id}`
              )
              .addFields({
                name: "Transcripcion disponible",
                value: transcriptMsg ? `[aqui](${transcriptMsg.url})` : "No disponible",
                inline: true,
              })
              .setTimestamp()],
          }).catch(() => {});
        }
      }
    }
  }

  const closeEmbed = E.ticketClosed(closed, interaction.user.id, reason);
  const warnings = [];
  if (transcriptError) warnings.push(transcriptError);
  if (!dmSent && dmAlertsEnabled) warnings.push("No se pudo enviar DM al usuario.");
  if (!canDeleteChannel) warnings.push("El canal no sera eliminado automaticamente hasta que la transcripcion quede archivada.");

  if (warnings.length > 0 && closeEmbed.data?.description) {
    closeEmbed.setDescription(`${closeEmbed.data.description}\n\n${warnings.join("\n")}`);
  }

  if (interaction.deferred && !interaction.replied) {
    await interaction.editReply({ embeds: [closeEmbed] }).catch((error) => {
      console.error("[CLOSE REPLY ERROR]", error.message);
    });
  } else if (interaction.replied) {
    await interaction.followUp({ embeds: [closeEmbed], flags: 64 }).catch((error) => {
      console.error("[CLOSE FOLLOWUP ERROR]", error.message);
    });
  }

  if (user && s.dm_alerts !== false) {
    const staffWhoHandled = closed.claimed_by || closed.assigned_to || interaction.user.id;
    await sendRating(user, closed, channel, staffWhoHandled).catch((error) => {
      console.error("[RATING ERROR]", error.message);
    });
  }

  await sendLog(guild, s, "close", interaction.user, closed, {
    "Razon": reason || "Sin razon",
    "Duracion": E.duration(ticket.created_at),
    "Usuario": `<@${ticket.user_id}>`,
    "Transcripcion": transcriptMsg?.url || "No disponible",
  }).catch((error) => console.error("[CLOSE LOG ERROR]", error.message));

  await updateDashboard(guild).catch((error) => {
    console.error("[DASHBOARD UPDATE ERROR]", error.message);
  });

  try {
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(canDeleteChannel ? E.Colors.WARNING : E.Colors.INFO)
          .setTitle(canDeleteChannel ? "Cerrando ticket" : "Ticket cerrado")
          .setDescription(
            canDeleteChannel
              ? `Este ticket sera eliminado en **${CHANNEL_DELETE_DELAY_MS / 1000} segundos**.\n\n`
                + (dmSent
                  ? "Se envio un resumen al usuario por mensaje directo."
                  : "No se pudo notificar al usuario por DM.")
              : "El ticket ya fue cerrado, pero el canal permanecera disponible hasta que la transcripcion pueda archivarse de forma segura."
          )
          .setFooter({
            text: "TON618 Tickets",
            iconURL: channel.client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  } catch (error) {
    console.error("[CLOSE FINAL MESSAGE ERROR]", error.message);
  }

  if (canDeleteChannel) {
    scheduleChannelDeletion(channel);
  }
}

async function disableButtons(channel, ticket = null) {
  try {
    if (ticket) {
      await updateTicketControlPanelComponents(channel, ticket, { disabled: true }).catch(() => false);
    }

    const msgs = await channel.messages.fetch({ limit: 15 });
    for (const msg of msgs.values()) {
      if (msg.author.id !== channel.client.user.id || msg.components.length === 0) continue;

      const rows = msg.components.map((row) => {
        const newRow = ActionRowBuilder.from(row);
        newRow.components = newRow.components.map((component) => disableComponent(component));
        return newRow;
      });

      await msg.edit({ components: rows }).catch(() => {});
    }
  } catch (error) {
    console.error("[DISABLE BUTTONS ERROR]", error.message);
  }
}

function disableComponent(component) {
  if (component.type === 2) {
    return ButtonBuilder.from(component).setDisabled(true);
  }

  if (component.type === 3) {
    return StringSelectMenuBuilder.from(component).setDisabled(true);
  }

  return component;
}

function formatDuration(startDate, endDate) {
  const durationMs = Math.max(0, endDate - startDate);
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  let durationText = "";
  if (days > 0) durationText += `${days}d `;
  if (hours > 0) durationText += `${hours}h `;
  durationText += `${minutes}m`;
  return durationText.trim();
}

function scheduleChannelDeletion(channel) {
  setTimeout(async () => {
    try {
      await channel.delete("Ticket cerrado");
      console.log(`[CLOSE] Canal ${channel.id} eliminado correctamente`);
    } catch (error) {
      console.error(`[CLOSE DELETE ERROR] No se pudo eliminar el canal ${channel.id}:`, error.message);
    }
  }, CHANNEL_DELETE_DELAY_MS);
}

function transcriptEmbed(ticket, options = {}) {
  const closedByStaff = options.closedByStaff || null;
  const closedAt = options.closedAt || null;
  const botAvatarUrl = options.botAvatarUrl || null;
  const fechaCierre = closedAt
    ? `<t:${Math.floor(closedAt / 1000)}:F>`
    : (ticket.closed_at ? `<t:${Math.floor(new Date(ticket.closed_at).getTime() / 1000)}:F>` : "No disponible");
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
