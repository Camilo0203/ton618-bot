const {
  buildSettingsDefaults,
  buildDashboardGeneralSettingsDefaults,
  buildDashboardModerationSettingsDefaults,
  buildDashboardPreferencesDefaults,
} = require("./database/defaults");

const SETTINGS_SCHEMA_VERSION = 2;
const DISCORD_ID_RE = /^\d{16,22}$/;
const COMMAND_NAME_RE = /^[a-z0-9_-]{1,64}$/;
const CATEGORY_ID_RE = /^[a-z0-9_-]{1,64}$/;
const PRIORITY_KEYS = new Set(["low", "normal", "high", "urgent"]);
const LANGUAGE_KEYS = new Set(["es", "en"]);
const DASHBOARD_COMMAND_MODE_KEYS = new Set(["mention", "prefix"]);
const DASHBOARD_MODERATION_PRESET_KEYS = new Set(["relaxed", "balanced", "strict"]);
const DASHBOARD_RAID_PRESET_KEYS = new Set(["off", "balanced", "lockdown"]);
const OPS_PLAN_KEYS = new Set(["free", "pro", "enterprise"]);
// Keep this list aligned with ton618-web `dashboardSectionIds`.
// We still accept the legacy `moderation` value for backwards compatibility with older Mongo records.
const DASHBOARD_SECTION_KEYS = new Set([
  "overview",
  "inbox",
  "general",
  "moderation",
  "server_roles",
  "tickets",
  "verification",
  "welcome",
  "suggestions",
  "modlogs",
  "commands",
  "system",
  "activity",
  "analytics",
]);

function toBool(value, fallback) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function toInt(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
}

function toDiscordIdOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const sanitized = String(value).replace(/[^\d]/g, "");
  return DISCORD_ID_RE.test(sanitized) ? sanitized : null;
}

function toShortStringOrNull(value, maxLen) {
  if (value === null || value === undefined) return null;
  const out = String(value).trim();
  if (!out) return null;
  return out.slice(0, maxLen);
}

function toDate(value, fallback) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function toDateOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sanitizeLanguage(value, fallback) {
  const candidate = String(value || "").trim().toLowerCase();
  if (LANGUAGE_KEYS.has(candidate)) return candidate;
  if (candidate.startsWith("es")) return "es";
  if (candidate.startsWith("en")) return "en";
  return fallback;
}

function sanitizeDashboardGeneralSettings(value, fallback = buildDashboardGeneralSettingsDefaults()) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const defaults = { ...fallback };

  const commandMode = String(source.commandMode || "").trim().toLowerCase();
  const moderationPreset = String(source.moderationPreset || "").trim().toLowerCase();
  const prefix = String(source.prefix || defaults.prefix).trim();
  const timezone = toShortStringOrNull(source.timezone, 80) || defaults.timezone;

  return {
    language: sanitizeLanguage(source.language, defaults.language),
    commandMode: DASHBOARD_COMMAND_MODE_KEYS.has(commandMode) ? commandMode : defaults.commandMode,
    prefix: prefix ? prefix.slice(0, 5) : defaults.prefix,
    timezone,
    moderationPreset: DASHBOARD_MODERATION_PRESET_KEYS.has(moderationPreset)
      ? moderationPreset
      : defaults.moderationPreset,
    opsPlan: OPS_PLAN_KEYS.has(String(source.opsPlan || "").trim().toLowerCase())
      ? String(source.opsPlan || "").trim().toLowerCase()
      : defaults.opsPlan,
  };
}

function sanitizeDashboardModerationSettings(value, fallback = buildDashboardModerationSettingsDefaults()) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const defaults = { ...fallback };
  const raidPreset = String(source.raidPreset || "").trim().toLowerCase();

  return {
    antiSpamEnabled: toBool(source.antiSpamEnabled, defaults.antiSpamEnabled),
    antiSpamThreshold: toInt(source.antiSpamThreshold, 2, 20, defaults.antiSpamThreshold),
    linkFilterEnabled: toBool(source.linkFilterEnabled, defaults.linkFilterEnabled),
    capsFilterEnabled: toBool(source.capsFilterEnabled, defaults.capsFilterEnabled),
    capsPercentageLimit: toInt(source.capsPercentageLimit, 20, 100, defaults.capsPercentageLimit),
    duplicateFilterEnabled: toBool(source.duplicateFilterEnabled, defaults.duplicateFilterEnabled),
    duplicateWindowSeconds: toInt(source.duplicateWindowSeconds, 10, 300, defaults.duplicateWindowSeconds),
    raidProtectionEnabled: toBool(source.raidProtectionEnabled, defaults.raidProtectionEnabled),
    raidPreset: DASHBOARD_RAID_PRESET_KEYS.has(raidPreset) ? raidPreset : defaults.raidPreset,
  };
}

function sanitizeDashboardPreferences(value, fallback = buildDashboardPreferencesDefaults()) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const defaults = { ...fallback };
  const requestedDefaultSection = String(source.defaultSection || "").trim().toLowerCase();
  const defaultSection = requestedDefaultSection === "moderation"
    ? "system"
    : requestedDefaultSection;

  return {
    defaultSection: DASHBOARD_SECTION_KEYS.has(defaultSection)
      ? defaultSection
      : defaults.defaultSection,
    compactMode: toBool(source.compactMode, defaults.compactMode),
    showAdvancedCards: toBool(source.showAdvancedCards, defaults.showAdvancedCards),
  };
}

function sanitizeCommandNames(value) {
  if (!Array.isArray(value)) return [];
  const names = value
    .map((item) => String(item || "").trim().toLowerCase())
    .filter((item) => COMMAND_NAME_RE.test(item));
  return Array.from(new Set(names));
}

function sanitizeCommandRateLimitOverrides(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out = {};

  for (const [rawName, rawConfig] of Object.entries(value)) {
    const name = String(rawName || "").trim().toLowerCase();
    if (!COMMAND_NAME_RE.test(name)) continue;

    if (typeof rawConfig === "number" || typeof rawConfig === "string") {
      out[name] = {
        max_actions: toInt(rawConfig, 1, 50, 4),
        window_seconds: 20,
      };
      continue;
    }

    if (!rawConfig || typeof rawConfig !== "object" || Array.isArray(rawConfig)) continue;

    out[name] = {
      max_actions: toInt(rawConfig.max_actions, 1, 50, 4),
      window_seconds: toInt(rawConfig.window_seconds, 1, 300, 20),
      enabled: toBool(rawConfig.enabled, true),
    };
  }

  return out;
}

function sanitizeCategoryIds(value) {
  if (!Array.isArray(value)) return [];
  const out = value
    .map((item) => String(item || "").trim().toLowerCase())
    .filter((item) => CATEGORY_ID_RE.test(item));
  return Array.from(new Set(out));
}

function sanitizePlaybookKeys(value) {
  if (!Array.isArray(value)) return [];
  const out = value
    .map((item) => String(item || "").trim().toLowerCase())
    .filter((item) => CATEGORY_ID_RE.test(item));
  return Array.from(new Set(out));
}

function sanitizeSlaOverrides(value, keyType) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out = {};
  for (const [rawKey, rawMinutes] of Object.entries(value)) {
    const key = String(rawKey || "").trim().toLowerCase();
    const valid = keyType === "priority"
      ? PRIORITY_KEYS.has(key)
      : CATEGORY_ID_RE.test(key);
    if (!valid) continue;
    const minutes = toInt(rawMinutes, 1, 10080, 0);
    if (minutes > 0) out[key] = minutes;
  }
  return out;
}

function knownSettingsKeys() {
  return Object.keys(buildSettingsDefaults("__schema__", () => new Date(0)));
}

function sanitizeSettingsRecord(guildId, raw = {}, options = {}) {
  const dateFactory = options.dateFactory || (() => new Date());
  const defaults = buildSettingsDefaults(guildId, dateFactory);
  const source = raw && typeof raw === "object" ? raw : {};
  const out = { ...defaults };

  out.guild_id = guildId || toShortStringOrNull(source.guild_id, 64) || defaults.guild_id;

  out.log_channel = toDiscordIdOrNull(source.log_channel);
  out.logsChannelId = toDiscordIdOrNull(source.logsChannelId);
  out.transcript_channel = toDiscordIdOrNull(source.transcript_channel);
  out.dashboard_channel = toDiscordIdOrNull(source.dashboard_channel);
  out.dashboard_message_id = toDiscordIdOrNull(source.dashboard_message_id);
  out.weekly_report_channel = toDiscordIdOrNull(source.weekly_report_channel);
  out.daily_sla_report_channel = toDiscordIdOrNull(source.daily_sla_report_channel);
  out.live_members_channel = toDiscordIdOrNull(source.live_members_channel);
  out.live_role_channel = toDiscordIdOrNull(source.live_role_channel);
  out.live_role_id = toDiscordIdOrNull(source.live_role_id);
  out.support_role = toDiscordIdOrNull(source.support_role);
  out.admin_role = toDiscordIdOrNull(source.admin_role);
  out.verify_role = toDiscordIdOrNull(source.verify_role);
  out.panel_message_id = toDiscordIdOrNull(source.panel_message_id);
  out.panel_channel_id = toDiscordIdOrNull(source.panel_channel_id);
  out.sla_escalation_role = toDiscordIdOrNull(source.sla_escalation_role);
  out.sla_escalation_channel = toDiscordIdOrNull(source.sla_escalation_channel);
  out.auto_assign_last_staff_id = toDiscordIdOrNull(source.auto_assign_last_staff_id);

  out.max_tickets = toInt(source.max_tickets, 1, 10, defaults.max_tickets);
  out.global_ticket_limit = toInt(source.global_ticket_limit, 0, 500, defaults.global_ticket_limit);
  out.cooldown_minutes = toInt(source.cooldown_minutes, 0, 1440, defaults.cooldown_minutes);
  out.min_days = toInt(source.min_days, 0, 365, defaults.min_days);
  out.auto_close_hours = toInt(source.auto_close_hours, 0, 168, defaults.auto_close_hours);
  out.sla_hours = toInt(source.sla_hours, 0, 168, defaults.sla_hours);
  out.smart_ping_hours = toInt(source.smart_ping_hours, 0, 168, defaults.smart_ping_hours);
  out.auto_close_minutes = toInt(source.auto_close_minutes, 0, 10080, defaults.auto_close_minutes);
  out.sla_minutes = toInt(source.sla_minutes, 0, 1440, defaults.sla_minutes);
  out.smart_ping_minutes = toInt(source.smart_ping_minutes, 0, 1440, defaults.smart_ping_minutes);
  out.sla_escalation_minutes = toInt(
    source.sla_escalation_minutes,
    0,
    10080,
    defaults.sla_escalation_minutes
  );
  out.rate_limit_window_seconds = toInt(
    source.rate_limit_window_seconds,
    3,
    120,
    defaults.rate_limit_window_seconds
  );
  out.rate_limit_max_actions = toInt(source.rate_limit_max_actions, 1, 50, defaults.rate_limit_max_actions);
  out.command_rate_limit_window_seconds = toInt(
    source.command_rate_limit_window_seconds,
    1,
    300,
    defaults.command_rate_limit_window_seconds
  );
  out.command_rate_limit_max_actions = toInt(
    source.command_rate_limit_max_actions,
    1,
    50,
    defaults.command_rate_limit_max_actions
  );
  out.ticket_counter = toInt(source.ticket_counter, 0, Number.MAX_SAFE_INTEGER, defaults.ticket_counter);

  out.dm_on_open = toBool(source.dm_on_open, defaults.dm_on_open);
  out.dm_on_close = toBool(source.dm_on_close, defaults.dm_on_close);
  out.dm_transcripts = toBool(source.dm_transcripts, defaults.dm_transcripts);
  out.dm_alerts = toBool(source.dm_alerts, defaults.dm_alerts);
  out.bot_language = sanitizeLanguage(source.bot_language, defaults.bot_language);
  out.daily_sla_report_enabled = toBool(
    source.daily_sla_report_enabled,
    defaults.daily_sla_report_enabled
  );
  out.simple_help_mode = toBool(source.simple_help_mode, defaults.simple_help_mode);
  out.log_edits = toBool(source.log_edits, defaults.log_edits);
  out.log_deletes = toBool(source.log_deletes, defaults.log_deletes);
  out.maintenance_mode = toBool(source.maintenance_mode, defaults.maintenance_mode);
  out.rate_limit_enabled = toBool(source.rate_limit_enabled, defaults.rate_limit_enabled);
  out.rate_limit_bypass_admin = toBool(source.rate_limit_bypass_admin, defaults.rate_limit_bypass_admin);
  out.command_rate_limit_enabled = toBool(
    source.command_rate_limit_enabled,
    defaults.command_rate_limit_enabled
  );
  out.sla_escalation_enabled = toBool(
    source.sla_escalation_enabled,
    defaults.sla_escalation_enabled
  );
  out.auto_assign_enabled = toBool(source.auto_assign_enabled, defaults.auto_assign_enabled);
  out.auto_assign_require_online = toBool(
    source.auto_assign_require_online,
    defaults.auto_assign_require_online
  );
  out.auto_assign_respect_away = toBool(
    source.auto_assign_respect_away,
    defaults.auto_assign_respect_away
  );
  out.incident_mode_enabled = toBool(source.incident_mode_enabled, defaults.incident_mode_enabled);

  out.maintenance_reason = toShortStringOrNull(source.maintenance_reason, 500);
  out.incident_message = toShortStringOrNull(source.incident_message, 500);
  out.dashboard_general_settings = sanitizeDashboardGeneralSettings(
    source.dashboard_general_settings,
    defaults.dashboard_general_settings
  );
  out.dashboard_moderation_settings = sanitizeDashboardModerationSettings(
    source.dashboard_moderation_settings,
    defaults.dashboard_moderation_settings
  );
  out.dashboard_preferences = sanitizeDashboardPreferences(
    source.dashboard_preferences,
    defaults.dashboard_preferences
  );
  out.dashboard_source_updated_at = toDateOrNull(source.dashboard_source_updated_at);
  out.dashboard_last_synced_at = toDateOrNull(source.dashboard_last_synced_at);
  out.incident_paused_categories = sanitizeCategoryIds(source.incident_paused_categories);
  out.disabled_commands = sanitizeCommandNames(source.disabled_commands);
  out.command_rate_limit_overrides = sanitizeCommandRateLimitOverrides(source.command_rate_limit_overrides);
  out.sla_overrides_priority = sanitizeSlaOverrides(source.sla_overrides_priority, "priority");
  out.sla_overrides_category = sanitizeSlaOverrides(source.sla_overrides_category, "category");
  out.sla_escalation_overrides_priority = sanitizeSlaOverrides(
    source.sla_escalation_overrides_priority,
    "priority"
  );
  out.sla_escalation_overrides_category = sanitizeSlaOverrides(
    source.sla_escalation_overrides_category,
    "category"
  );
  out.disabled_playbooks = sanitizePlaybookKeys(source.disabled_playbooks);
  out.settings_schema_version = SETTINGS_SCHEMA_VERSION;
  out.created_at = toDate(source.created_at, defaults.created_at);

  return out;
}

function sanitizeSettingsPatch(guildId, currentSettings, patch = {}, options = {}) {
  const sourcePatch = patch && typeof patch === "object" ? patch : {};
  const dateFactory = options.dateFactory || (() => new Date());
  const merged = sanitizeSettingsRecord(
    guildId,
    { ...(currentSettings || {}), ...sourcePatch, guild_id: guildId },
    { dateFactory }
  );

  const keys = new Set(knownSettingsKeys());
  const protectedKeys = new Set(["guild_id", "created_at"]);
  const sanitizedPatch = {};
  const unknownKeys = [];

  for (const key of Object.keys(sourcePatch)) {
    if (!keys.has(key)) {
      unknownKeys.push(key);
      continue;
    }
    if (protectedKeys.has(key)) continue;
    sanitizedPatch[key] = merged[key];
  }

  sanitizedPatch.settings_schema_version = SETTINGS_SCHEMA_VERSION;
  return { sanitizedPatch, unknownKeys, merged };
}

function isSame(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function hasSettingsDrift(rawSettings, sanitizedSettings) {
  if (!rawSettings || typeof rawSettings !== "object") return true;
  const keys = new Set([...knownSettingsKeys(), "settings_schema_version"]);
  for (const key of keys) {
    if (!isSame(rawSettings[key], sanitizedSettings[key])) return true;
  }
  return false;
}

module.exports = {
  SETTINGS_SCHEMA_VERSION,
  sanitizeSettingsRecord,
  sanitizeSettingsPatch,
  hasSettingsDrift,
  sanitizeCommandRateLimitOverrides,
  sanitizeDashboardGeneralSettings,
  sanitizeDashboardModerationSettings,
  sanitizeDashboardPreferences,
};
