"use strict";

const { tickets, settings, updateDashboard, E, EmbedBuilder, PermissionFlagsBits } = require("./context");
const { replyError, recordTicketEventSafe, sendLog } = require("./shared");
const {
  updateTicketControlPanelEmbed,
  updateTicketControlPanelComponents,
} = require("../../utils/ticketEmbedUpdater");
const { resolveGuildLanguage, t } = require("../../utils/i18n");

async function reopenTicket(interaction) {
  const s = await settings.get(interaction.guild.id);
  const language = resolveGuildLanguage(s);
  const channel = interaction.channel;
  const ticket = await tickets.get(channel.id);
  if (!ticket) return replyError(interaction, t(language, "ticket.command.not_ticket_channel"), language);
  if (ticket.status === "open") return replyError(interaction, t(language, "ticket.lifecycle.reopen.already_open"), language);

  const guild = interaction.guild;

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, t(language, "ticket.lifecycle.reopen.verify_permissions"), language);
  }

  const channelPerms = channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, t(language, "ticket.lifecycle.reopen.manage_channels_required"), language);
  }

  const user = await interaction.client.users.fetch(ticket.user_id).catch(() => null);
  if (!user) {
    return replyError(interaction, t(language, "ticket.lifecycle.reopen.user_missing"), language);
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
      return replyError(interaction, t(language, "ticket.lifecycle.reopen.reopened_during_request"), language);
    }
    return replyError(interaction, t(language, "ticket.lifecycle.reopen.database_error"), language);
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
    title: t(language, "ticket.lifecycle.reopen.result_title"),
    description: `${interaction.user.tag} ${t(language, "ticket.lifecycle.reopen.result_title").toLowerCase()} #${ticket.ticket_id}.`,
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
            .setTitle(t(language, "ticket.lifecycle.reopen.dm_title"))
            .setDescription(
              t(language, "ticket.lifecycle.reopen.dm_description", {
                ticketId: ticket.ticket_id,
                guild: guild.name,
                staff: interaction.user.tag,
                channelLink,
              })
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
    warnings.push(t(language, "ticket.lifecycle.reopen.dm_warning"));
  }

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle(t(language, "ticket.lifecycle.reopen.result_title"))
        .setDescription(
          t(language, "ticket.lifecycle.reopen.result_description", {
            ticketId: ticket.ticket_id,
            count: reopened.reopen_count || 0,
            dmLine: dmSent ? t(language, "ticket.lifecycle.reopen.dm_line") : "",
            warningLine: warnings.length ? t(language, "ticket.lifecycle.reopen.warning_line", { warning: warnings.join(" ") }) : "",
          })
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
