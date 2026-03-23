"use strict";

const { staffStatus } = require("./context");

function normalizePresenceStatus(member) {
  const status = String(member?.presence?.status || "").toLowerCase();
  if (!status) return "offline";
  return status;
}

function pickRoundRobin(candidates, lastAssignedId) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  const ordered = [...candidates].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  if (!lastAssignedId) return ordered[0];

  const idx = ordered.findIndex((member) => member.id === lastAssignedId);
  if (idx < 0) return ordered[0];
  return ordered[(idx + 1) % ordered.length];
}

function selectAutoAssignee({
  members = [],
  awayIds = new Set(),
  lastAssignedId = null,
  requireOnline = true,
  respectAway = true,
} = {}) {
  const allCandidates = members.filter((member) => member && member.user?.bot !== true);
  if (!allCandidates.length) return null;

  let filtered = allCandidates;
  if (respectAway) {
    filtered = filtered.filter((member) => !awayIds.has(member.id));
  }

  if (requireOnline) {
    const onlineStatuses = new Set(["online", "dnd", "idle"]);
    const onlineFiltered = filtered.filter((member) => onlineStatuses.has(normalizePresenceStatus(member)));
    if (onlineFiltered.length > 0) {
      filtered = onlineFiltered;
    }
  }

  if (!filtered.length) return null;
  return pickRoundRobin(filtered, lastAssignedId);
}

function buildAutoAssignRoleIds(guildSettings, category) {
  const ids = new Set();
  if (guildSettings?.support_role) ids.add(guildSettings.support_role);
  if (guildSettings?.admin_role) ids.add(guildSettings.admin_role);
  for (const roleId of category?.pingRoles || []) {
    if (roleId) ids.add(roleId);
  }
  return Array.from(ids);
}

async function collectAutoAssignMembers(guild, roleIds) {
  const membersById = new Map();

  for (const roleId of roleIds) {
    const role = guild.roles.cache.get(roleId)
      || await guild.roles.fetch(roleId).catch(() => null);
    if (!role) continue;
    for (const [, member] of role.members) {
      membersById.set(member.id, member);
    }
  }

  if (membersById.size > 0) {
    return Array.from(membersById.values());
  }

  for (const [, member] of guild.members.cache) {
    if (roleIds.some((roleId) => member.roles.cache.has(roleId))) {
      membersById.set(member.id, member);
    }
  }

  if (membersById.size > 0) {
    return Array.from(membersById.values());
  }

  const allowFullFetch = ["1", "true", "yes", "on"].includes(
    String(process.env.AUTO_ASSIGN_ALLOW_FULL_MEMBER_FETCH || "").trim().toLowerCase()
  );
  if (!allowFullFetch) return [];

  const allMembers = await guild.members.fetch().catch(() => null);
  if (!allMembers) return [];

  for (const [, member] of allMembers) {
    if (roleIds.some((roleId) => member.roles.cache.has(roleId))) {
      membersById.set(member.id, member);
    }
  }

  return Array.from(membersById.values());
}

async function resolveAutoAssignee(guild, guildSettings, category) {
  if (!guildSettings?.auto_assign_enabled) return null;

  const roleIds = buildAutoAssignRoleIds(guildSettings, category);
  if (!roleIds.length) return null;

  const candidates = await collectAutoAssignMembers(guild, roleIds);
  if (!candidates.length) return null;

  const respectAway = guildSettings.auto_assign_respect_away !== false;
  const requireOnline = guildSettings.auto_assign_require_online !== false;
  const awayRows = respectAway ? await staffStatus.getAway(guild.id) : [];
  const awayIds = new Set((awayRows || []).map((row) => row.staff_id).filter(Boolean));

  return selectAutoAssignee({
    members: candidates,
    awayIds,
    lastAssignedId: guildSettings.auto_assign_last_staff_id || null,
    requireOnline,
    respectAway,
  });
}

module.exports = {
  buildAutoAssignRoleIds,
  collectAutoAssignMembers,
  resolveAutoAssignee,
  pickRoundRobin,
  selectAutoAssignee,
};
