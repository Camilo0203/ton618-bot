function normalizeCommandName(name) {
  return String(name || "").trim().toLowerCase();
}

function getDisabledCommandSet(guildSettings) {
  const list = Array.isArray(guildSettings?.disabled_commands)
    ? guildSettings.disabled_commands
    : [];

  const set = new Set();
  for (const item of list) {
    const normalized = normalizeCommandName(item);
    if (normalized) set.add(normalized);
  }
  return set;
}

function isCommandDisabled(commandName, guildSettings) {
  const normalized = normalizeCommandName(commandName);
  if (!normalized) return false;
  return getDisabledCommandSet(guildSettings).has(normalized);
}

module.exports = {
  normalizeCommandName,
  isCommandDisabled,
  getDisabledCommandSet,
};
