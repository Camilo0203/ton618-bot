"use strict";

const { serverStats, messageActivity } = require("../utils/database");
const logger = require("../utils/structuredLogger");

class StatsHandler {
  constructor(client) {
    this.client = client;
    this.snapshotInterval = null;
  }

  start() {
    // Tomar snapshot diario a medianoche
    this.scheduleNextSnapshot();
    
    logger.info('statsHandler', 'Started - daily snapshots scheduled');
  }

  stop() {
    if (this.snapshotInterval) {
      clearTimeout(this.snapshotInterval);
      this.snapshotInterval = null;
    }
    logger.info('statsHandler', 'Stopped');
  }

  scheduleNextSnapshot() {
    // Calcular tiempo hasta la próxima medianoche
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow - now;

    this.snapshotInterval = setTimeout(() => {
      this.takeAllSnapshots();
      this.scheduleNextSnapshot(); // Programar el siguiente
    }, msUntilMidnight);

    logger.info('statsHandler', `Next snapshot in ${Math.floor(msUntilMidnight / 1000 / 60)} minutes`);
  }

  async takeAllSnapshots() {
    try {
      logger.info('statsHandler', 'Taking daily snapshots for all guilds');

      for (const [guildId, guild] of this.client.guilds.cache) {
        await this.takeSnapshot(guild);
      }

      logger.info('statsHandler', 'Daily snapshots completed');
    } catch (error) {
      logger.error('statsHandler', 'Error taking snapshots', { error: error?.message || String(error) });
    }
  }

  async takeSnapshot(guild) {
    try {
      const members = await guild.members.fetch();
      const humans = members.filter(m => !m.user.bot);
      const bots = members.filter(m => m.user.bot);
      const online = members.filter(m => 
        m.presence?.status === "online" || 
        m.presence?.status === "idle" || 
        m.presence?.status === "dnd"
      );

      await serverStats.recordSnapshot(guild.id, {
        total_members: guild.memberCount,
        human_members: humans.size,
        bot_members: bots.size,
        online_members: online.size,
        total_channels: guild.channels.cache.size,
        total_roles: guild.roles.cache.size,
        total_emojis: guild.emojis.cache.size,
      });

      logger.info('statsHandler', `Snapshot taken for ${guild.name}`);
    } catch (error) {
      logger.error('statsHandler', `Error taking snapshot for ${guild.id}`, { error: error?.message || String(error) });
    }
  }

  async handleMessage(message) {
    // No trackear mensajes de bots
    if (message.author.bot) return;

    // No trackear DMs
    if (!message.guild) return;

    try {
      await messageActivity.recordMessage(
        message.guild.id,
        message.channel.id,
        message.author.id,
        message.createdTimestamp
      );
    } catch (error) {
      // Silenciar errores para no afectar el flujo normal
      // console.error("[StatsHandler] Error recording message:", error);
    }
  }
}

module.exports = StatsHandler;
