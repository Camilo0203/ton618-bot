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

function register(client) {
  cron.schedule("*/10 * * * *", async () => {
    await runSingleFlight("tickets.auto_close", async () => {
      await runGuildTask(client, "tickets.auto_close", async (guild) => {
        const s = await getGuildSettings(guild.id);
        const autoCloseHours = s.auto_close_hours || 0;
        const autoCloseMinutes = s.auto_close_minutes || 0;
        const autoCloseTotalMinutes = autoCloseHours > 0 ? autoCloseHours * 60 : autoCloseMinutes;
        if (!s || autoCloseTotalMinutes <= 0) return;

        if (autoCloseTotalMinutes > 30) {
          const warningCandidates = await tickets.getInactive(guild.id, autoCloseTotalMinutes - 30);
          for (const ticket of warningCandidates) {
            if (!shouldSendAutoCloseWarning(ticket, autoCloseTotalMinutes)) continue;
            const channel = guild.channels.cache.get(ticket.channel_id);
            if (!channel) continue;

            const warningSent = await channel.send({
              embeds: [new EmbedBuilder()
                .setColor(0xFEE75C)
                .setDescription(`⚠️ <@${ticket.user_id}> Este ticket sera cerrado automaticamente en ~30 minutos por inactividad.\nResponde para evitar el cierre.`)
                .setTimestamp()],
            }).then(() => true).catch(() => false);

            if (warningSent) {
              await tickets.markAutoCloseWarned(ticket.channel_id);
            }
          }
        }

        const closeCandidates = await tickets.getInactive(guild.id, autoCloseTotalMinutes);
        for (const ticket of closeCandidates) {
          if (!shouldAutoCloseTicket(ticket, autoCloseTotalMinutes)) continue;

          const channel = guild.channels.cache.get(ticket.channel_id);
          if (!channel) {
            await tickets.close(ticket.channel_id, client.user.id, "Canal eliminado");
            continue;
          }

          const closed = await tickets.close(ticket.channel_id, client.user.id, "Cierre automatico por inactividad");
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
            title: "Ticket cerrado automaticamente",
            description: `El ticket #${ticket.ticket_id} fue cerrado por inactividad.`,
            metadata: {
              reason: "Cierre automatico por inactividad",
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
              archiveWarning = "No se pudo generar la transcripcion del ticket. El canal quedara cerrado pero no se eliminara.";
            } else if (!s.transcript_channel) {
              archiveWarning = "No hay canal de transcripciones configurado. El canal quedara cerrado pero no se eliminara.";
            } else {
              const transcriptChannel = guild.channels.cache.get(s.transcript_channel)
                || await guild.channels.fetch(s.transcript_channel).catch(() => null);

              if (!transcriptChannel) {
                archiveWarning = "El canal de transcripciones configurado no es accesible. El canal no se eliminara.";
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
            archiveWarning = "Ocurrio un error al archivar la transcripcion. El canal quedara cerrado pero no se eliminara.";
          }

          await channel.send({
            embeds: [new EmbedBuilder()
              .setColor(transcriptArchived ? 0xED4245 : 0xFEE75C)
              .setTitle(transcriptArchived ? "Ticket cerrado automaticamente" : "Ticket cerrado sin borrar canal")
              .setDescription(
                transcriptArchived
                  ? "Este ticket fue cerrado por inactividad y sera eliminado en unos segundos."
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
