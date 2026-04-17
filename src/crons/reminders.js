"use strict";

const { EmbedBuilder } = require("discord.js");
const { reminders, settings } = require("../utils/database");
const { createJobQueue } = require("../utils/jobQueue");
const { resolveGuildLanguage, t } = require("../utils/i18n");
const E = require("../utils/embeds");
const logger = require("../utils/structuredLogger");

function createTask(client) {
  const remindersQueue = createJobQueue("reminders-delivery", {
    concurrency: Number(process.env.REMINDERS_QUEUE_CONCURRENCY || 4),
    maxQueueSize: Number(process.env.REMINDERS_QUEUE_MAX_SIZE || 2000),
    timeoutMs: Number(process.env.REMINDERS_QUEUE_TIMEOUT_MS || 60000),
  });

  async function deliverReminder(rem) {
    const user = await client.users.fetch(rem.user_id).catch(() => null);
    if (!user) return;

    const guildSettings = await settings.get(rem.guild_id).catch(() => null);
    const language = resolveGuildLanguage(guildSettings);

    const elapsed = Date.now() - new Date(rem.created_at).getTime();
    const mins = Math.floor(elapsed / 60000);
    const timeStr = E.duration(mins, language);

    const embeds = [
      new EmbedBuilder()
        .setColor(E.Colors.WARNING)
        .setTitle(t(language, "crons.reminders.title"))
        .setDescription(rem.text)
        .addFields({
          name: t(language, "crons.reminders.field_ago", { time: timeStr }),
          value: "\u200B",
          inline: true,
        })
        .setFooter({ text: t(language, "crons.reminders.footer") })
        .setTimestamp(),
    ];

    const dmSent = await user.send({ embeds }).then(() => true).catch(() => false);

    if (dmSent || !rem.channel_id) return;

    const guild = client.guilds.cache.get(rem.guild_id);
    const channel = guild?.channels?.cache?.get(rem.channel_id);
    if (!channel) return;

    await channel.send({
      content: `<@${rem.user_id}>`,
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.WARNING)
          .setTitle(t(language, "crons.reminders.title"))
          .setDescription(rem.text)
          .setTimestamp(),
      ],
    }).catch(() => {});
  }

  return async function dispatchRemindersTick() {
    await reminders.cleanup();
    const pending = await reminders.getPending();
    const jobs = [];

    for (const rem of pending) {
      try {
        await reminders.markFired(rem.id);
        jobs.push(
          remindersQueue.add(() => deliverReminder(rem)).catch((error) => {
            logger.error('reminders', 'Reminders queue error', { error: error?.message || String(error) });
          })
        );
      } catch (error) {
        logger.error('reminders', 'Reminder processing error', { error: error?.message || String(error) });
      }
    }

    await Promise.all(jobs);
  };
}

module.exports = { createTask };
