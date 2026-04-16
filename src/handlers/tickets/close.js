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
const { replyError, recordTicketEventSafe, sendLog } = require("./shared");
const { sendRating } = require("./rating");
const {
  updateTicketControlPanelEmbed,
  updateTicketControlPanelComponents,
} = require("../../utils/ticketEmbedUpdater");
const { resolveGuildLanguage, t } = require("../../utils/i18n");
const { hasRequiredPlan } = require("../../utils/commercial");
const logger = require("../../utils/structuredLogger");

const CHANNEL_DELETE_DELAY_MS = 5000;

async function closeTicket(interaction, reason = null) {
  const channel = interaction.channel;
  const guild = interaction.guild;
  const settingsRecord = await settings.get(guild.id);
  const language = resolveGuildLanguage(settingsRecord);
  const ticket = await tickets.get(channel.id);

  if (!ticket) {
    return replyError(interaction, t(language, "ticket.command.not_ticket_channel"), language);
  }
  if (ticket.status === "closed") {
    return replyError(interaction, t(language, "ticket.lifecycle.close.already_closed"), language);
  }

  const user = await interaction.client.users.fetch(ticket.user_id).catch(() => null);

  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ flags: 64 });
  }

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, t(language, "ticket.lifecycle.close.verify_permissions"), language);
  }

  const channelPerms = channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, t(language, "ticket.lifecycle.close.manage_channels_required"), language);
  }

  const closeResult = await tickets.close(channel.id, interaction.user.id, reason);
  if (!closeResult) {
    const latestTicket = await tickets.get(channel.id).catch(() => null);
    if (latestTicket?.status === "closed") {
      return replyError(interaction, t(language, "ticket.lifecycle.close.already_closed_during_request"), language);
    }
    return replyError(interaction, t(language, "ticket.lifecycle.close.database_error"), language);
  }

  const closed = {
    ...closeResult,
    message_count: closeResult.message_count || ticket.message_count || 0,
  };

  await staffStats.incrementClosed(guild.id, interaction.user.id).catch((error) => {
    logger.warn("ticket.close", "Failed to increment closed stats", { guildId: guild.id, error: error.message });
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
    title: t(language, "ticket.lifecycle.close.event_title"),
    description: t(language, "ticket.lifecycle.close.event_description", {
      userTag: interaction.user.tag,
      ticketId: ticket.ticket_id,
    }),
    metadata: {
      reason: reason || null,
    },
  });

  await updateTicketControlPanelEmbed(channel, closed, {
    language,
    color: E.Colors.ERROR,
    updateStatus: true,
    updateClaimed: true,
    updateAssigned: true,
  }).catch((error) => {
    logger.warn("ticket.close", "Failed to update control panel embed", { channelId: channel.id, error: error.message });
  });

  await disableButtons(channel, closed).catch((error) => {
    logger.warn("ticket.close", "Failed to disable buttons", { channelId: channel.id, error: error.message });
  });

  const isPro = hasRequiredPlan(settingsRecord, "pro");
  const proBadge = isPro
    ? t(language, "ticket.auto_reply.pro_badge")
    : t(language, "ticket.panel.author_name") || "TON618 Tickets";
  const proFooter = isPro
    ? t(language, "ticket.auto_reply.pro_footer_small")
    : t(language, "ticket.auto_reply.footer_free") || "TON618 Tickets";

  let transcriptMsg = null;
  let transcriptAttachment = null;
  let transcriptError = null;
  let canDeleteChannel = false;

  try {
    const transcriptResult = await generateTranscript(channel, closed, guild);
    if (!transcriptResult?.success || !transcriptResult.attachment) {
      transcriptError = t(language, "ticket.lifecycle.close.transcript_generate_failed");
    } else {
      transcriptAttachment = transcriptResult.attachment;
      closed.message_count = transcriptResult.messageCount ?? closed.message_count;

      if (!settingsRecord.transcript_channel) {
        transcriptError = t(language, "ticket.lifecycle.close.transcript_channel_missing");
      } else {
        const transcriptChannel = guild.channels.cache.get(settingsRecord.transcript_channel)
          || await guild.channels.fetch(settingsRecord.transcript_channel).catch(() => null);

        if (!transcriptChannel) {
          transcriptError = t(language, "ticket.lifecycle.close.transcript_channel_unavailable");
        } else {
          try {
            transcriptMsg = await transcriptChannel.send({
              embeds: [transcriptEmbed(closed, {
                language,
                closedByStaff: interaction.user.id,
                closedAt: Date.now(),
                botAvatarUrl: interaction.client.user.displayAvatarURL({ dynamic: true }),
                isPro,
              })],
              files: [transcriptAttachment],
            });

            if (transcriptMsg?.url) {
              await tickets.update(channel.id, { transcript_url: transcriptMsg.url }).catch((error) => {
                logger.warn("ticket.close", "Failed to save transcript URL", { channelId: channel.id, error: error.message });
              });
            }

            canDeleteChannel = true;
          } catch (error) {
            logger.error("ticket.close", "Failed to send transcript to channel", { channelId: channel.id, error: error.message });
            transcriptError = t(language, "ticket.lifecycle.close.transcript_send_failed");
          }
        }
      }
    }
  } catch (error) {
    logger.error("ticket.close", "Failed to generate transcript", { channelId: channel.id, error: error.message });
    transcriptError = t(language, "ticket.lifecycle.close.transcript_generate_error");
  }

  const dmEnabled = settingsRecord.dm_on_close !== false;
  const dmTranscriptEnabled = settingsRecord.dm_transcripts === true;
  const dmAlertsEnabled = settingsRecord.dm_alerts !== false;
  let dmSent = false;

  if (dmEnabled && user && dmAlertsEnabled) {
    try {
      const createdAt = new Date(ticket.created_at);
      const closedAt = new Date();
      const durationText = formatDuration(createdAt, closedAt);

      const dmEmbed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({
          name: `${guild.name} | ${proBadge}`,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setTitle(t(language, "ticket.lifecycle.close.dm_receipt_title"))
        .setDescription(t(language, "ticket.lifecycle.close.dm_receipt_description"))
        .addFields(
          { name: t(language, "ticket.lifecycle.close.dm_field_ticket"), value: `#${ticket.ticket_id}`, inline: true },
          { name: t(language, "ticket.lifecycle.close.dm_field_category"), value: ticket.category || "General", inline: true },
          { name: t(language, "ticket.lifecycle.close.dm_field_opened"), value: `<t:${Math.floor(createdAt.getTime() / 1000)}:F>`, inline: false },
          { name: t(language, "ticket.lifecycle.close.dm_field_closed"), value: `<t:${Math.floor(closedAt.getTime() / 1000)}:F>`, inline: true },
          { name: t(language, "ticket.lifecycle.close.dm_field_duration"), value: durationText, inline: true },
          { name: t(language, "ticket.lifecycle.close.dm_field_reason"), value: reason || t(language, "ticket.lifecycle.close.dm_no_reason"), inline: false },
          { name: t(language, "ticket.lifecycle.close.dm_field_handled_by"), value: ticket.claimed_by ? `<@${ticket.claimed_by}>` : `<@${interaction.user.id}>`, inline: true },
          { name: t(language, "ticket.lifecycle.close.dm_field_messages"), value: `${closed.message_count || 0}`, inline: true },
        )
        .setFooter({
          text: proFooter,
          iconURL: channel.client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      if (transcriptMsg?.url) {
        dmEmbed.addFields({
          name: t(language, "ticket.lifecycle.close.dm_field_transcript"),
          value: `[${t(language, "ticket.lifecycle.close.dm_transcript_link")}](${transcriptMsg.url})`,
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
      logger.warn("ticket.close.dm", "Could not send DM to user", { userId: user?.id, error: error.message });
      dmSent = false;

      if (settingsRecord.log_channel) {
        const logChannel = guild.channels.cache.get(settingsRecord.log_channel);
        if (logChannel) {
          await logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(E.Colors.WARNING)
                .setTitle(t(language, "ticket.lifecycle.close.dm_warning_title"))
                .setDescription(t(language, "ticket.lifecycle.close.dm_warning_description", {
                  userId: user.id,
                  ticketId: ticket.ticket_id,
                }))
                .addFields({
                  name: t(language, "ticket.lifecycle.close.dm_warning_transcript"),
                  value: transcriptMsg ? `[${t(language, "ticket.lifecycle.close.dm_transcript_link")}](${transcriptMsg.url})` : t(language, "ticket.lifecycle.close.dm_warning_unavailable"),
                  inline: true,
                })
                .setTimestamp(),
            ],
          }).catch(() => {});
        }
      }
    }
  }

  const warnings = [];
  if (transcriptError) warnings.push(transcriptError);
  if (!dmSent && dmAlertsEnabled) warnings.push(t(language, "ticket.lifecycle.close.warning_dm_failed"));
  if (!canDeleteChannel) warnings.push(t(language, "ticket.lifecycle.close.warning_channel_not_deleted"));

  const replyTitle = canDeleteChannel
    ? t(language, "ticket.lifecycle.close.result_closing_title")
    : t(language, "ticket.lifecycle.close.result_closed_title");
  const replyDescription = canDeleteChannel
    ? t(language, "ticket.lifecycle.close.result_closing_description", {
      seconds: CHANNEL_DELETE_DELAY_MS / 1000,
      dmStatus: dmSent
        ? t(language, "ticket.lifecycle.close.result_dm_sent")
        : t(language, "ticket.lifecycle.close.result_dm_failed"),
    })
    : t(language, "ticket.lifecycle.close.result_closed_description");

  const closeEmbed = new EmbedBuilder()
    .setColor(canDeleteChannel ? E.Colors.WARNING : E.Colors.INFO)
    .setAuthor({ name: proBadge })
    .setTitle(replyTitle)
    .setDescription(warnings.length ? `${replyDescription}\n\n${warnings.join("\n")}` : replyDescription)
    .setFooter({
      text: proFooter,
      iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  if (interaction.deferred && !interaction.replied) {
    await interaction.editReply({ embeds: [closeEmbed] }).catch((error) => {
      logger.warn("ticket.close", "Failed to edit reply", { error: error.message });
    });
  } else if (interaction.replied) {
    await interaction.followUp({ embeds: [closeEmbed], flags: 64 }).catch((error) => {
      logger.warn("ticket.close", "Failed to send followup", { error: error.message });
    });
  }

  if (user && settingsRecord.dm_alerts !== false) {
    const staffWhoHandled = closed.claimed_by || closed.assigned_to || interaction.user.id;
    await sendRating(user, closed, channel, staffWhoHandled).catch((error) => {
      logger.warn("ticket.close", "Failed to send rating DM", { userId: user?.id, error: error.message });
    });
  }

  await sendLog(guild, settingsRecord, "close", interaction.user, closed, {
    [t(language, "ticket.lifecycle.close.log_reason")]: reason || t(language, "ticket.lifecycle.close.dm_no_reason"),
    [t(language, "ticket.lifecycle.close.log_duration")]: E.duration(ticket.created_at),
    [t(language, "ticket.lifecycle.close.log_user")]: `<@${ticket.user_id}>`,
    [t(language, "ticket.lifecycle.close.log_transcript")]: transcriptMsg?.url || t(language, "ticket.lifecycle.close.log_unavailable"),
  }).catch((error) => logger.warn("ticket.close", "Failed to send close log", { guildId: guild.id, error: error.message }));

  await updateDashboard(guild).catch((error) => {
    logger.warn("ticket.close", "Failed to update dashboard", { guildId: guild.id, error: error.message });
  });

  try {
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(canDeleteChannel ? E.Colors.WARNING : E.Colors.INFO)
          .setAuthor({ name: proBadge })
          .setTitle(replyTitle)
          .setDescription(replyDescription)
          .setFooter({
            text: proFooter,
            iconURL: channel.client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  } catch (error) {
    logger.warn("ticket.close", "Failed to send final message to channel", { channelId: channel.id, error: error.message });
  }

  if (canDeleteChannel) {
    scheduleChannelDeletion(channel, t(language, "ticket.lifecycle.close.delete_reason"));
  }
}

async function disableButtons(channel, ticket = null) {
  try {
    if (ticket) {
      await updateTicketControlPanelComponents(channel, ticket, { disabled: true }).catch(() => false);
    }

    const messages = await channel.messages.fetch({ limit: 15 });
    for (const message of messages.values()) {
      if (message.author.id !== channel.client.user.id || message.components.length === 0) continue;

      const rows = message.components.map((row) => {
        const newRow = ActionRowBuilder.from(row);
        newRow.components = newRow.components.map((component) => disableComponent(component));
        return newRow;
      });

      await message.edit({ components: rows }).catch(() => {});
    }
  } catch (error) {
    logger.warn("ticket.close", "Failed to disable buttons", { error: error.message });
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

function scheduleChannelDeletion(channel, reason) {
  setTimeout(async () => {
    try {
      await channel.delete(reason);
      logger.info("ticket.close", "Channel deleted successfully", { channelId: channel.id });
    } catch (error) {
      logger.error("ticket.close", "Could not delete channel", { channelId: channel.id, error: error.message });
    }
  }, CHANNEL_DELETE_DELAY_MS);
}

function transcriptEmbed(ticket, options = {}) {
  const language = options.language || "en";
  const closedByStaff = options.closedByStaff || null;
  const closedAt = options.closedAt || null;
  const botAvatarUrl = options.botAvatarUrl || null;
  const isPro = options.isPro === true;
  const closedAtValue = closedAt
    ? `<t:${Math.floor(closedAt / 1000)}:F>`
    : (ticket.closed_at ? `<t:${Math.floor(new Date(ticket.closed_at).getTime() / 1000)}:F>` : t(language, "ticket.lifecycle.close.transcript_closed_unavailable"));
  const closedByValue = closedByStaff
    ? `<@${closedByStaff}>`
    : (ticket.closed_by ? `<@${ticket.closed_by}>` : t(language, "ticket.lifecycle.close.transcript_closed_unknown"));

  const footerText = isPro
    ? t(language, "ticket.auto_reply.pro_footer_small")
    : t(language, "ticket.auto_reply.footer_free");

  return new EmbedBuilder()
    .setTitle(t(language, "ticket.lifecycle.close.transcript_embed_title"))
    .setColor(0x5865F2)
    .addFields(
      { name: t(language, "ticket.lifecycle.close.dm_field_ticket"), value: `#${ticket.ticket_id}`, inline: true },
      { name: t(language, "ticket.lifecycle.close.transcript_field_user"), value: `<@${ticket.user_id}>`, inline: true },
      { name: t(language, "ticket.field_category"), value: ticket.category, inline: true },
      { name: t(language, "ticket.lifecycle.close.transcript_field_duration"), value: E.duration(ticket.created_at), inline: true },
      { name: t(language, "ticket.lifecycle.close.transcript_field_staff"), value: closedByValue, inline: true },
      { name: t(language, "ticket.lifecycle.close.transcript_field_closed"), value: closedAtValue, inline: true },
      { name: t(language, "ticket.lifecycle.close.transcript_field_messages"), value: `${ticket.message_count || 0}`, inline: true },
      { name: t(language, "ticket.lifecycle.close.transcript_field_rating"), value: ticket.rating ? `${ticket.rating}/5` : t(language, "ticket.lifecycle.close.transcript_rating_none"), inline: true },
    )
    .setFooter({
      text: footerText,
      iconURL: botAvatarUrl || undefined,
    })
    .setTimestamp();
}

module.exports = {
  closeTicket,
  disableButtons,
  transcriptEmbed,
};
