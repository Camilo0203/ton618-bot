function buildSettingsDefaults(guildId, dateFactory = () => new Date()) {
  return {
    guild_id: guildId,
    log_channel: null,
    logsChannelId: null,
    transcript_channel: null,
    dashboard_channel: null,
    dashboard_message_id: null,
    weekly_report_channel: null,
    daily_sla_report_enabled: false,
    daily_sla_report_channel: null,
    live_members_channel: null,
    live_role_channel: null,
    live_role_id: null,
    support_role: null,
    admin_role: null,
    verify_role: null,
    max_tickets: 3,
    global_ticket_limit: 0,
    cooldown_minutes: 0,
    min_days: 0,
    auto_close_hours: 0,
    sla_hours: 0,
    smart_ping_hours: 0,
    auto_close_minutes: 0,
    sla_minutes: 0,
    smart_ping_minutes: 0,
    sla_escalation_enabled: false,
    sla_escalation_minutes: 0,
    sla_escalation_role: null,
    sla_escalation_channel: null,
    sla_overrides_priority: {},
    sla_overrides_category: {},
    sla_escalation_overrides_priority: {},
    sla_escalation_overrides_category: {},
    auto_assign_enabled: false,
    auto_assign_require_online: true,
    auto_assign_respect_away: true,
    auto_assign_last_staff_id: null,
    incident_mode_enabled: false,
    incident_paused_categories: [],
    incident_message: null,
    dm_on_open: true,
    dm_on_close: true,
    dm_transcripts: true,
    dm_alerts: true,
    bot_language: "es",
    simple_help_mode: true,
    log_edits: true,
    log_deletes: true,
    maintenance_mode: false,
    maintenance_reason: null,
    rate_limit_enabled: true,
    rate_limit_window_seconds: 10,
    rate_limit_max_actions: 8,
    rate_limit_bypass_admin: true,
    command_rate_limit_enabled: true,
    command_rate_limit_window_seconds: 20,
    command_rate_limit_max_actions: 4,
    command_rate_limit_overrides: {},
    dashboard_general_settings: buildDashboardGeneralSettingsDefaults(),
    dashboard_moderation_settings: buildDashboardModerationSettingsDefaults(),
    dashboard_preferences: buildDashboardPreferencesDefaults(),
    dashboard_source_updated_at: null,
    dashboard_last_synced_at: null,
    disabled_commands: [],
    settings_schema_version: 2,
    ticket_counter: 0,
    panel_message_id: null,
    panel_channel_id: null,
    created_at: dateFactory(),
  };
}

function buildDashboardGeneralSettingsDefaults() {
  return {
    language: "es",
    commandMode: "mention",
    prefix: "!",
    timezone: "UTC",
    moderationPreset: "balanced",
  };
}

function buildDashboardModerationSettingsDefaults() {
  return {
    antiSpamEnabled: true,
    antiSpamThreshold: 6,
    linkFilterEnabled: true,
    capsFilterEnabled: true,
    capsPercentageLimit: 70,
    duplicateFilterEnabled: true,
    duplicateWindowSeconds: 45,
    raidProtectionEnabled: true,
    raidPreset: "balanced",
  };
}

function buildDashboardPreferencesDefaults() {
  return {
    defaultSection: "overview",
    compactMode: false,
    showAdvancedCards: true,
  };
}

function buildLevelSettingsDefaults(guildId) {
  return {
    guild_id: guildId,
    enabled: false,
    channel: null,
    xp_per_message: 15,
    xp_cooldown: 60,
    xp_min: 10,
    xp_max: 25,
    levelup_message: "🎉 ¡Felicidades {mention}! Subiste al **nivel {level}**! 🏆",
    ignored_channels: [],
    ignored_roles: [],
    role_rewards: [],
    double_xp_roles: [],
    stack_roles: true,
  };
}

function buildVerifSettingsDefaults(guildId) {
  return {
    guild_id: guildId,
    enabled: false,
    mode: "button",
    channel: null,
    verified_role: null,
    unverified_role: null,
    log_channel: null,
    panel_message_id: null,
    panel_title: "✅ Verificación",
    panel_description: "Para acceder al servidor, debes verificarte.",
    panel_color: "57F287",
    panel_image: null,
    question: "¿Leíste las reglas del servidor?",
    question_answer: "si",
    antiraid_enabled: false,
    antiraid_joins: 10,
    antiraid_seconds: 10,
    antiraid_action: "pause",
    dm_on_verify: true,
    kick_unverified_hours: 0,
  };
}

function buildWelcomeSettingsDefaults(guildId) {
  return {
    guild_id: guildId,
    welcome_enabled: false,
    welcome_channel: null,
    welcome_message: "¡Bienvenido/a **{mention}** al servidor **{server}**! 🎉",
    welcome_color: "5865F2",
    welcome_title: "👋 ¡Bienvenido/a!",
    welcome_banner: null,
    welcome_thumbnail: true,
    welcome_footer: "¡Espero que disfrutes tu estadía!",
    welcome_dm: false,
    welcome_dm_message: "¡Hola **{user}**! Bienvenido/a a **{server}**.",
    welcome_autorole: null,
    goodbye_enabled: false,
    goodbye_channel: null,
    goodbye_message: "**{user}** ha abandonado el servidor.",
    goodbye_color: "ED4245",
    goodbye_title: "👋 Hasta luego",
    goodbye_thumbnail: true,
    goodbye_footer: "Espero verte de nuevo pronto.",
  };
}

function buildModlogSettingsDefaults(guildId) {
  return {
    guild_id: guildId,
    enabled: false,
    channel: null,
    log_bans: true,
    log_unbans: true,
    log_kicks: true,
    log_msg_delete: true,
    log_msg_edit: true,
    log_role_add: true,
    log_role_remove: true,
    log_nickname: true,
    log_joins: false,
    log_leaves: false,
    log_voice: false,
  };
}

function buildSuggestSettingsDefaults(guildId) {
  return {
    guild_id: guildId,
    enabled: false,
    channel: null,
    log_channel: null,
    approved_channel: null,
    rejected_channel: null,
    dm_on_result: true,
    require_reason: false,
    cooldown_minutes: 5,
    anonymous: false,
  };
}

module.exports = {
  buildSettingsDefaults,
  buildDashboardGeneralSettingsDefaults,
  buildDashboardModerationSettingsDefaults,
  buildDashboardPreferencesDefaults,
  buildLevelSettingsDefaults,
  buildVerifSettingsDefaults,
  buildWelcomeSettingsDefaults,
  buildModlogSettingsDefaults,
  buildSuggestSettingsDefaults,
};
