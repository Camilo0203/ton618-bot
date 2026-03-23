function normalizeCategoryId(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeCategoryList(value) {
  if (!Array.isArray(value)) return [];
  const out = value
    .map((item) => normalizeCategoryId(item))
    .filter((item) => /^[a-z0-9_-]{1,64}$/.test(item));
  return Array.from(new Set(out));
}

function isCategoryBlockedByIncident(guildSettings, categoryId) {
  if (!guildSettings || guildSettings.incident_mode_enabled !== true) return false;

  const paused = normalizeCategoryList(guildSettings.incident_paused_categories);
  if (!paused.length) return true;
  return paused.includes(normalizeCategoryId(categoryId));
}

function resolveIncidentMessage(guildSettings) {
  const custom = String(guildSettings?.incident_message || "").trim();
  if (custom) return custom;
  return "Estamos en modo incidente. Esta categoria de tickets esta temporalmente pausada.";
}

module.exports = {
  normalizeCategoryList,
  isCategoryBlockedByIncident,
  resolveIncidentMessage,
};
