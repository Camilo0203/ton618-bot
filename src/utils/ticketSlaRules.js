const PRIORITY_KEYS = new Set(["low", "normal", "high", "urgent"]);

function normalizePriority(value) {
  const key = String(value || "").trim().toLowerCase();
  return PRIORITY_KEYS.has(key) ? key : "normal";
}

function normalizeCategoryId(value) {
  return String(value || "").trim().toLowerCase();
}

function toPositiveInt(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const out = Math.floor(parsed);
  return out > 0 ? out : fallback;
}

function readOverride(mapValue, key) {
  if (!mapValue || typeof mapValue !== "object" || Array.isArray(mapValue)) return 0;
  return toPositiveInt(mapValue[key], 0);
}

function configuredMinutes(settings, type = "alert") {
  const isEscalation = type === "escalation";
  const base = toPositiveInt(
    isEscalation ? settings?.sla_escalation_minutes : settings?.sla_minutes,
    0
  );
  const byPriority = isEscalation
    ? settings?.sla_escalation_overrides_priority
    : settings?.sla_overrides_priority;
  const byCategory = isEscalation
    ? settings?.sla_escalation_overrides_category
    : settings?.sla_overrides_category;

  const values = [base];
  for (const value of Object.values(byPriority || {})) {
    const minutes = toPositiveInt(value, 0);
    if (minutes > 0) values.push(minutes);
  }
  for (const value of Object.values(byCategory || {})) {
    const minutes = toPositiveInt(value, 0);
    if (minutes > 0) values.push(minutes);
  }
  return values.filter((value) => value > 0);
}

function resolveTicketSlaMinutes(settings, ticket, type = "alert") {
  const priority = normalizePriority(ticket?.priority);
  const categoryId = normalizeCategoryId(ticket?.category_id);

  const isEscalation = type === "escalation";
  const base = toPositiveInt(
    isEscalation ? settings?.sla_escalation_minutes : settings?.sla_minutes,
    0
  );
  const byPriority = isEscalation
    ? settings?.sla_escalation_overrides_priority
    : settings?.sla_overrides_priority;
  const byCategory = isEscalation
    ? settings?.sla_escalation_overrides_category
    : settings?.sla_overrides_category;

  let minutes = base;
  const priorityOverride = readOverride(byPriority, priority);
  if (priorityOverride > 0) minutes = priorityOverride;
  const categoryOverride = readOverride(byCategory, categoryId);
  if (categoryOverride > 0) minutes = categoryOverride;
  return minutes;
}

function parseSlaRuleKey({ priority, categoryId }) {
  const p = priority ? normalizePriority(priority) : null;
  const c = categoryId ? normalizeCategoryId(categoryId) : null;
  if (!p && !c) return null;
  return { priority: p, categoryId: c };
}

function getSlaSweepFloorMinutes(settings, type = "alert") {
  const values = configuredMinutes(settings, type);
  if (!values.length) return 0;
  return Math.min(...values);
}

module.exports = {
  normalizePriority,
  resolveTicketSlaMinutes,
  parseSlaRuleKey,
  getSlaSweepFloorMinutes,
};
