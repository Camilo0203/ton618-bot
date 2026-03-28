"use strict";

const { tickets, settings, updateDashboard, E, EmbedBuilder, PermissionFlagsBits } = require("./context");
const { replyError, recordTicketEventSafe, sendLog } = require("./shared");
const {
  updateTicketControlPanelEmbed,
  updateTicketControlPanelComponents,
} = require("../../utils/ticketEmbedUpdater");

async function reopenTicket(interaction) {
  const channel = interaction.channel;
  const ticket = await tickets.get(channel.id);
  if (!ticket) return replyError(interaction, "This is not a ticket channel.");
  if (ticket.status === "open") return replyError(interaction, "This ticket is already open.");

  const guild = interaction.guild;
  const s = await settings.get(guild.id);

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, "I could not verify my permissions in this server.");
  }

  const channelPerms = channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, "I need the `Manage Channels` permission to reopen this ticket.");
  }

  const user = await interaction.client.users.fetch(ticket.user_id).catch(() => null);
  if (!user) {
    return replyError(interaction, "I could not find the user who created this ticket.");
  }

  await channel.permissionOverwrites.edit(ticket.user_id, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true,
    AttachFiles: true,
    EmbedLinks: true,
    AddReactions: true,
  }).catch((error) => {
    console.error("[REOPEN PERMISSIONS ERROR]", error.message);
  });

  const reopenResult = await tickets.reopen(channel.id, interaction.user.id);
  if (!reopenResult) {
    const latestTicket = await tickets.get(channel.id).catch(() => null);
    if (latestTicket?.status === "open") {
      return replyError(interaction, "This ticket was already reopened while your request was being processed.");
    }
    return replyError(interaction, "There was an error while reopening the ticket in the database.");
  }

  const reopened = reopenResult;

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_reopened",
    visibility: "public",
    title: "Ticket reopened",
    description: `${interaction.user.tag} reopened ticket #${ticket.ticket_id}.`,
    metadata: {
      reopenCount: reopened.reopen_count || 0,
      previousClosedBy: ticket.closed_by,
      previousCloseReason: ticket.close_reason,
    },
  });

  const panelEmbedUpdated = await updateTicketControlPanelEmbed(channel, reopened, {
    color: E.Colors.SUCCESS,
    updateStatus: true,
    updateClaimed: true,
    updateAssigned: true,
  }).catch(() => false);

  const panelComponentsUpdated = await updateTicketControlPanelComponents(channel, reopened, {
    disabled: false,
  }).catch(() => false);

  if (!panelEmbedUpdated || !panelComponentsUpdated) {
    await channel.send({
      embeds: [E.ticketReopened(reopened, interaction.user.id)],
    }).catch((error) => {
      console.error("[REOPEN MESSAGE ERROR]", error.message);
    });
  }

  let dmSent = false;
  if (user && s.dm_alerts !== false) {
    try {
      const channelLink = `https://discord.com/channels/${guild.id}/${channel.id}`;
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle("Ticket reopened")
            .setDescription(
              `Your ticket **#${ticket.ticket_id}** in **${guild.name}** was reopened by ${interaction.user.tag}.\n\n` +
              `**Channel:** [Go to ticket](${channelLink})\n\n` +
              "You can go back to the channel and continue the conversation."
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
      console.error(`[DM ERROR] Could not send a DM to user ${user.id}: ${dmError.message}`);
    }
  }

  await sendLog(guild, s, "reopen", interaction.user, reopened, {
    Reopens: String(reopened.reopen_count || 0),
    "Reopened by": `<@${interaction.user.id}>`,
  }).catch((error) => console.error("[REOPEN LOG ERROR]", error.message));

  await updateDashboard(guild).catch((error) => {
    console.error("[DASHBOARD UPDATE ERROR]", error.message);
  });

  const warnings = [];
  if (!dmSent && s.dm_alerts !== false) {
    warnings.push("The user could not be notified by DM (DMs may be disabled).");
  }

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("Ticket reopened")
        .setDescription(
          `Ticket **#${ticket.ticket_id}** was reopened successfully.\n\n` +
          `**Total reopens:** ${reopened.reopen_count || 0}` +
          (dmSent ? "\nThe user was notified by DM." : "") +
          (warnings.length ? `\n\nWarning: ${warnings.join(" ")}` : "")
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

module.exports = { reopenTicket };
