const { ChannelType, PermissionFlagsBits } = require("discord.js");
const { settings } = require("./database");

const pendingSyncs = new Map();

function clampChannelName(name) {
  return String(name || "").trim().slice(0, 100);
}

function buildMembersChannelName(memberCount) {
  return clampChannelName(`Miembros: ${memberCount || 0}`);
}

function buildRoleChannelName(roleName, count) {
  const safeRoleName = String(roleName || "Clientes").trim() || "Clientes";
  return clampChannelName(`${safeRoleName}: ${count || 0}`);
}

async function resolveChannel(guild, channelId) {
  if (!channelId) return null;
  return guild.channels.cache.get(channelId) || guild.channels.fetch(channelId).catch(() => null);
}

async function renameVoiceChannel(channel, nextName, guild) {
  if (!channel || channel.type !== ChannelType.GuildVoice) return;
  if (channel.name === nextName) return;

  const botMember = guild.members.me;
  if (!botMember) return;

  const canManage = channel.permissionsFor(botMember)?.has(PermissionFlagsBits.ManageChannels);
  if (!canManage) return;

  await channel.setName(nextName).catch((err) => { console.error("[liveStatsChannels] suppressed error:", err?.message || err); });
}

async function syncGuildLiveStats(guild, options = {}) {
  if (!guild?.available) return;

  const config = await settings.get(guild.id);
  const hasLiveStats = Boolean(config.live_members_channel || config.live_role_channel);
  if (!hasLiveStats) return;

  if (options.hydrateMembers && config.live_role_channel) {
    await guild.members.fetch().catch((err) => { console.error("[liveStatsChannels] suppressed error:", err?.message || err); });
  }

  if (config.live_members_channel) {
    const channel = await resolveChannel(guild, config.live_members_channel);
    await renameVoiceChannel(channel, buildMembersChannelName(guild.memberCount), guild);
  }

  if (config.live_role_channel) {
    const channel = await resolveChannel(guild, config.live_role_channel);
    const role = config.live_role_id ? guild.roles.cache.get(config.live_role_id) || await guild.roles.fetch(config.live_role_id).catch(() => null) : null;
    const roleCount = role?.members?.size || 0;
    await renameVoiceChannel(channel, buildRoleChannelName(role?.name, roleCount), guild);
  }
}

function queueGuildLiveStatsSync(guild, options = {}) {
  if (!guild?.id) return;

  const current = pendingSyncs.get(guild.id);
  if (current?.timer) {
    clearTimeout(current.timer);
  }

  const delayMs = Math.max(250, Number(options.delayMs) || 1500);
  const hydrateMembers = Boolean(options.hydrateMembers || current?.hydrateMembers);
  const timer = setTimeout(() => {
    pendingSyncs.delete(guild.id);
    void syncGuildLiveStats(guild, { hydrateMembers });
  }, delayMs);

  if (typeof timer.unref === "function") {
    timer.unref();
  }

  pendingSyncs.set(guild.id, { timer, hydrateMembers });
}

async function syncAllGuildLiveStats(client, options = {}) {
  const hydrateMembers = Boolean(options.hydrateMembers);
  for (const guild of client.guilds.cache.values()) {
    await syncGuildLiveStats(guild, { hydrateMembers });
  }
}

module.exports = {
  syncGuildLiveStats,
  queueGuildLiveStatsSync,
  syncAllGuildLiveStats,
};
