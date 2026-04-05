"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { ticketEvents, tickets } = require("../utils/database");
const { getGuildSettings } = require("../utils/accessControl");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { shouldSendAutoCloseWarning, shouldAutoCloseTicket } = require("../utils/ticketLifecycleAlerts");
const { generateTranscript } = require("../utils/transcript");
const {
  updateTicketControlPanelEmbed,
  updateTicketControlPanelComponents,
} = require("../utils/ticketEmbedUpdater");
const { transcriptEmbed } = require("../handlers/tickets/close");
const { resolveGuildLanguage, t } = require("../utils/i18n");
const E = require("../utils/embeds");

function register(client) {
  cron.schedule("*/10 * * * *", async () => {
    await runSingleFlight("tickets.auto_close", async () => {
      await runGuildTask(client, "tickets.auto_close", async (guild) => {
        const s = await getGuildSettings(guild.id);
        const autoCloseHours = s.auto_close_hours || 0;
        const autoCloseMinutes = s.auto_close_minutes || 0;
        const autoCloseTotalMinutes = autoCloseHours > 0 ? autoCloseHours * 60 : autoCloseMinutes;
        if (!s || autoCloseTotalMinutes <= 0) return;

        const lang = resolveGuildLanguage(s);

        // Warning phase
        if (autoCloseTotalMinutes > 30) {
          const warningCandidates = await tickets.getInactive(guild.id, autoCloseTotalMinutes - 30);
          for (const ticket of warningCandidates) {
            if (!shouldSendAutoCloseWarning(ticket, autoCloseTotalMinutes)) continue;
            const channel = guild.channels.cache.get(ticket.channel_id);
            if (!channel) continue;

            const warningSent = await channel.send({
              embeds: [new EmbedBuilder()
                .setColor(E.Colors.WARNING)
                .setDescription(t(lang, "crons.auto_close.warning_desc", { user: ticket.user_id }))
                .setTimestamp()],
            }).then(() => true).catch(() => false);

            if (warningSent) {
              await tickets.markAutoCloseWarned(ticket.channel_id);
            }
          }
        }

        // Closing phase
        const closeCandidates = await tickets.getInactive(guild.id, autoCloseTotalMinutes);
        for (const ticket of closeCandidates) {
          if (!shouldAutoCloseTicket(ticket, autoCloseTotalMinutes)) continue;

          const channel = guild.channels.cache.get(ticket.channel_id);
          const closeReason = t(lang, "crons.auto_close.event_desc", { ticketId: ticket.ticket_id });

          if (!channel) {
            await tickets.close(ticket.channel_id, client.user.id, closeReason);
            continue;
          }

          const closed = await tickets.close(ticket.channel_id, client.user.id, closeReason);
          if (!closed) continue;

          await ticketEvents.add({
            guild_id: guild.id,
            ticket_id: ticket.ticket_id,
            channel_id: channel.id,
            actor_id: client.user.id,
            actor_kind: "bot",
            actor_label: client.user.tag,
            event_type: "ticket_auto_closed",
            visibility: "system",
            title: t(lang, "crons.auto_close.embed_title_auto"),
            description: closeReason,
            metadata: {
              reason: closeReason,
              autoCloseMinutes: autoCloseTotalMinutes,
            },
          }).catch(() => null);

          await updateTicketControlPanelEmbed(channel, closed, {
            color: 0xED4245,
            updateStatus: true,
            updateClaimed: true,
            updateAssigned: true,
          }).catch(() => false);
          await updateTicketControlPanelComponents(channel, closed, { disabled: true }).catch(() => false);

          let transcriptArchived = false;
          let archiveWarning = null;

          try {
            const transcriptResult = await generateTranscript(channel, closed, guild);
            if (!transcriptResult?.success || !transcriptResult.attachment) {
              archiveWarning = t(lang, "crons.auto_close.archive_warning_transcript");
            } else if (!s.transcript_channel) {
              archiveWarning = t(lang, "crons.auto_close.archive_warning_no_channel");
            } else {
              const transcriptChannel = guild.channels.cache.get(s.transcript_channel)
                || await guild.channels.fetch(s.transcript_channel).catch(() => null);

              if (!transcriptChannel) {
                archiveWarning = t(lang, "crons.auto_close.archive_warning_inaccessible");
              } else {
                const transcriptMsg = await transcriptChannel.send({
                  embeds: [transcriptEmbed({
                    ...closed,
                    message_count: transcriptResult.messageCount ?? closed.message_count,
                  }, {
                    closedByStaff: client.user.id,
                    closedAt: Date.now(),
                    botAvatarUrl: client.user.displayAvatarURL({ dynamic: true }),
                  })],
                  files: [transcriptResult.attachment],
                });

                if (transcriptMsg?.url) {
                  await tickets.update(channel.id, { transcript_url: transcriptMsg.url }).catch(() => null);
                }

                transcriptArchived = true;
              }
            }
          } catch (error) {
            console.error("[AUTO CLOSE TRANSCRIPT ERROR]", error.message);
            archiveWarning = t(lang, "crons.auto_close.archive_warning_error");
          }

          await channel.send({
            embeds: [new EmbedBuilder()
              .setColor(transcriptArchived ? E.Colors.ERROR : E.Colors.WARNING)
              .setTitle(t(lang, transcriptArchived ? "crons.auto_close.embed_title_auto" : "crons.auto_close.embed_title_manual"))
              .setDescription(
                transcriptArchived
                  ? t(lang, "crons.auto_close.embed_desc_auto")
                  : archiveWarning
              )
              .setTimestamp()],
          }).catch(() => {});

          if (!transcriptArchived) continue;

          setTimeout(() => {
            channel.delete().catch(() => {});
          }, 8000);
        }
      });
    });
  });
}

module.exports = { register };
