"use strict";

const { tickets, settings, updateDashboard, E, EmbedBuilder } = require("./context");
const { replyError, recordTicketEventSafe, sendLog } = require("./shared");
const { buildTicketButtons } = require("./panel");

async function reopenTicket(interaction) {
  const channel = interaction.channel;
  const ticket = await tickets.get(channel.id);
  if (!ticket) return replyError(interaction, "Este no es un canal de ticket.");
  if (ticket.status === "open") return replyError(interaction, "Este ticket ya esta abierto.");

  const guild = interaction.guild;
  const s = await settings.get(guild.id);
  const user = await interaction.client.users.fetch(ticket.user_id).catch(() => null);

  // Restaurar permisos del usuario
  await channel.permissionOverwrites.edit(ticket.user_id, {
    ViewChannel: true, SendMessages: true, ReadMessageHistory: true,
  }).catch(() => {});

  // Actualizar en la base de datos
  await tickets.reopen(channel.id, interaction.user.id);
  const reopened = await tickets.get(channel.id);

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_reopened",
    visibility: "system",
    title: "Ticket reabierto",
    description: `${interaction.user.tag} reabrio el ticket #${ticket.ticket_id}.`,
    metadata: {
      reopenCount: reopened?.reopen_count || 0,
    },
  });

  // Enviar mensaje de reapertura
  await channel.send({
    embeds: [E.ticketReopened(reopened, interaction.user.id)],
    components: [buildTicketButtons()],
  });

  // Notificar al usuario por DM
  if (user) {
    try {
      await user.send({ 
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle("Ticket reabierto")
            .setDescription(
              `Tu ticket **#${ticket.ticket_id}** en **${guild.name}** ha sido reabierto por <@${interaction.user.id}>.\n\n` +
              "Puedes volver al canal para continuar la conversacion."
            )
          .setFooter({ 
            text: `${guild.name} - TON618 Tickets`, 
            iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) 
          })

            .setTimestamp()
        ] 
      });
    } catch (dmError) {
      console.log(`[DM ERROR] No se pudo enviar DM al usuario ${user.id}: ${dmError.message}`);
    }
  }

  // Log y dashboard
  await sendLog(guild, s, "reopen", interaction.user, reopened, { "Reaperturas": reopened.reopen_count });
  await updateDashboard(guild);
  
  return interaction.reply({ 
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("Ticket reabierto")
        .setDescription("El ticket ha sido reabierto correctamente.")
        .setFooter({ 
          text: "TON618 Tickets",
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()
    ], 
    flags: 64 
  });
}

// -----------------------------------------------------
//   RECLAMAR / LIBERAR TICKET PREMIUM
// -----------------------------------------------------

module.exports = { reopenTicket };
