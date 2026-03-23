"use strict";

const { EmbedBuilder } = require("discord.js");
const { reminders } = require("../utils/database");
const { createJobQueue } = require("../utils/jobQueue");

function createTask(client) {
  const remindersQueue = createJobQueue("reminders-delivery", {
    concurrency: Number(process.env.REMINDERS_QUEUE_CONCURRENCY || 4),
    maxQueueSize: Number(process.env.REMINDERS_QUEUE_MAX_SIZE || 2000),
    timeoutMs: Number(process.env.REMINDERS_QUEUE_TIMEOUT_MS || 60000),
  });

  async function deliverReminder(rem) {
    const user = await client.users.fetch(rem.user_id).catch(() => null);
    if (!user) return;

    const elapsed = Date.now() - new Date(rem.created_at).getTime();
    const mins = Math.floor(elapsed / 60000);
    const timeStr = mins < 60
      ? `${mins}m`
      : mins < 1440
        ? `${Math.floor(mins / 60)}h ${mins % 60}m`
        : `${Math.floor(mins / 1440)}d`;

    const dmSent = await user.send({
      embeds: [new EmbedBuilder()
        .setColor(0xFEE75C)
        .setTitle("Recordatorio")
        .setDescription(rem.text)
        .addFields({ name: "Establecido hace", value: timeStr, inline: true })
        .setFooter({ text: "Recordatorio de TON618" })
        .setTimestamp()],
    }).then(() => true).catch(() => false);

    if (dmSent || !rem.channel_id) return;

    const guild = client.guilds.cache.get(rem.guild_id);
    const channel = guild?.channels?.cache?.get(rem.channel_id);
    await channel?.send({
      content: `<@${rem.user_id}>`,
      embeds: [new EmbedBuilder()
        .setColor(0xFEE75C)
        .setTitle("Recordatorio")
        .setDescription(rem.text)
        .setTimestamp()],
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
            console.error("[REMINDERS QUEUE]", error.message);
          })
        );
      } catch (error) {
        console.error("[REMINDERS]", error?.message || error);
      }
    }

    await Promise.all(jobs);
  };
}

module.exports = { createTask };
