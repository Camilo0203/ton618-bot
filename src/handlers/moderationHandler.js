"use strict";

const { tempBans, mutes, modActions } = require("../utils/database");

class ModerationHandler {
  constructor(client) {
    this.client = client;
    this.checkInterval = null;
  }

  start() {
    // Revisar bans y mutes expirados cada minuto
    this.checkInterval = setInterval(() => {
      this.checkExpiredActions();
    }, 60000); // 1 minuto

    console.log("[ModerationHandler] Started - checking every 60 seconds");
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log("[ModerationHandler] Stopped");
    }
  }

  async checkExpiredActions() {
    try {
      await Promise.all([
        this.checkExpiredBans(),
        this.checkExpiredMutes()
      ]);
    } catch (error) {
      console.error("[ModerationHandler] Error checking expired actions:", error);
    }
  }

  async checkExpiredBans() {
    try {
      const expiredBans = await tempBans.getExpired(50);

      if (expiredBans.length === 0) return;

      console.log(`[ModerationHandler] Found ${expiredBans.length} expired ban(s)`);

      for (const ban of expiredBans) {
        await this.unbanUser(ban);
      }
    } catch (error) {
      console.error("[ModerationHandler] Error checking expired bans:", error);
    }
  }

  async checkExpiredMutes() {
    try {
      const expiredMutes = await mutes.getExpired(50);

      if (expiredMutes.length === 0) return;

      console.log(`[ModerationHandler] Found ${expiredMutes.length} expired mute(s)`);

      for (const mute of expiredMutes) {
        await this.unmuteUser(mute);
      }
    } catch (error) {
      console.error("[ModerationHandler] Error checking expired mutes:", error);
    }
  }

  async unbanUser(ban) {
    try {
      const guild = await this.client.guilds.fetch(ban.guild_id).catch(() => null);
      if (!guild) {
        console.error(`[ModerationHandler] Guild ${ban.guild_id} not found`);
        await tempBans.remove(ban.guild_id, ban.user_id);
        return;
      }

      // Verificar que el usuario esté baneado
      const bans = await guild.bans.fetch().catch(() => null);
      if (!bans || !bans.has(ban.user_id)) {
        console.log(`[ModerationHandler] User ${ban.user_id} is not banned in ${guild.name}`);
        await tempBans.remove(ban.guild_id, ban.user_id);
        return;
      }

      // Unban
      await guild.members.unban(ban.user_id, "Temporary ban expired");

      // Actualizar base de datos
      await tempBans.remove(ban.guild_id, ban.user_id);

      // Registrar acción
      await modActions.record({
        guild_id: ban.guild_id,
        user_id: ban.user_id,
        moderator_id: this.client.user.id,
        action_type: "unban",
        reason: "Temporary ban expired (automatic)"
      });

      console.log(`[ModerationHandler] Auto-unbanned user ${ban.user_id} in ${guild.name}`);
    } catch (error) {
      console.error(`[ModerationHandler] Error unbanning user ${ban.user_id}:`, error);
    }
  }

  async unmuteUser(mute) {
    try {
      const guild = await this.client.guilds.fetch(mute.guild_id).catch(() => null);
      if (!guild) {
        console.error(`[ModerationHandler] Guild ${mute.guild_id} not found`);
        await mutes.remove(mute.guild_id, mute.user_id);
        return;
      }

      const member = await guild.members.fetch(mute.user_id).catch(() => null);
      if (!member) {
        console.log(`[ModerationHandler] User ${mute.user_id} not in guild ${guild.name}`);
        await mutes.remove(mute.guild_id, mute.user_id);
        return;
      }

      const muteRole = guild.roles.cache.find(r => r.name === "Muted");
      if (!muteRole) {
        console.log(`[ModerationHandler] Muted role not found in ${guild.name}`);
        await mutes.remove(mute.guild_id, mute.user_id);
        return;
      }

      if (!member.roles.cache.has(muteRole.id)) {
        console.log(`[ModerationHandler] User ${mute.user_id} doesn't have muted role`);
        await mutes.remove(mute.guild_id, mute.user_id);
        return;
      }

      // Remover rol
      await member.roles.remove(muteRole, "Mute expired (automatic)");

      // Actualizar base de datos
      await mutes.remove(mute.guild_id, mute.user_id);

      // Registrar acción
      await modActions.record({
        guild_id: mute.guild_id,
        user_id: mute.user_id,
        moderator_id: this.client.user.id,
        action_type: "unmute",
        reason: "Mute expired (automatic)"
      });

      console.log(`[ModerationHandler] Auto-unmuted user ${mute.user_id} in ${guild.name}`);
    } catch (error) {
      console.error(`[ModerationHandler] Error unmuting user ${mute.user_id}:`, error);
    }
  }
}

module.exports = ModerationHandler;
