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

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, "No pude verificar mis permisos en el servidor.");
  }

  const channelPerms = channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "No tengo el permiso 'Gestionar Canales' necesario para reabrir este ticket.");
  }

  const user = await interaction.client.users.fetch(ticket.user_id).catch(() => null);
  if (!user) {
    return replyError(interaction, "No se pudo encontrar al usuario que creó este ticket.");
  }

  await channel.permissionOverwrites.edit(ticket.user_id, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true,
    AttachFiles: true,
    EmbedLinks: true,
    AddReactions: true,
  }).catch(err => {
    console.error('[REOPEN PERMISSIONS ERROR]', err.message);
  });

  const reopenResult = await tickets.reopen(channel.id, interaction.user.id);
  if (!reopenResult) {
    return replyError(interaction, "Error al reabrir el ticket en la base de datos.");
  }
  
  const reopened = await tickets.get(channel.id);
  if (!reopened) {
    return replyError(interaction, "Error al obtener los datos del ticket reabierto.");
  }

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_reopened",
    visibility: "public",
    title: "Ticket reabierto",
    description: `${interaction.user.tag} reabrio el ticket #${ticket.ticket_id}.`,
    metadata: {
      reopenCount: reopened.reopen_count || 0,
      previousClosedBy: ticket.closed_by,
      previousCloseReason: ticket.close_reason,
    },
  });

  await channel.send({
    embeds: [E.ticketReopened(reopened, interaction.user.id)],
    components: [buildTicketButtons()],
  }).catch(err => {
    console.error('[REOPEN MESSAGE ERROR]', err.message);
  });

  let dmSent = false;
  if (user && s.dm_alerts !== false) {
    try {
      const channelLink = `https://discord.com/channels/${guild.id}/${channel.id}`;
      await user.send({ 
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle("🔓 Ticket reabierto")
            .setDescription(
              `Tu ticket **#${ticket.ticket_id}** en **${guild.name}** ha sido reabierto por ${interaction.user.tag}.\n\n` +
              `**Canal:** [Ir al ticket](${channelLink})\n\n` +
              "Puedes volver al canal para continuar la conversacion."
            )
            .setFooter({ 
              text: `${guild.name} - TON618 Tickets`, 
              iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp()
        ] 
      });
      dmSent = true;
    } catch (dmError) {
      console.error(`[DM ERROR] No se pudo enviar DM al usuario ${user.id}: ${dmError.message}`);
    }
  }

  await sendLog(guild, s, "reopen", interaction.user, reopened, { 
    "Reaperturas": String(reopened.reopen_count || 0),
    "Reabierto por": `<@${interaction.user.id}>`,
  }).catch(err => console.error('[REOPEN LOG ERROR]', err.message));
  
  await updateDashboard(guild).catch(err => {
    console.error('[DASHBOARD UPDATE ERROR]', err.message);
  });
  
  const warnings = [];
  if (!dmSent && s.dm_alerts !== false) {
    warnings.push("No se pudo notificar al usuario por DM (DMs desactivados).");
  }

  return interaction.reply({ 
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("✅ Ticket reabierto")
        .setDescription(
          `El ticket **#${ticket.ticket_id}** ha sido reabierto correctamente.\n\n` +
          `**Reaperturas totales:** ${reopened.reopen_count || 0}` +
          (dmSent ? "\n✉️ Se notificó al usuario por DM." : "") +
          (warnings.length ? `\n\n⚠️ ${warnings.join(' ')}` : "")
        )
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
