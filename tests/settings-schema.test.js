const test = require("node:test");
const assert = require("node:assert/strict");

const {
  SETTINGS_SCHEMA_VERSION,
  sanitizeSettingsRecord,
  sanitizeSettingsPatch,
  hasSettingsDrift,
} = require("../src/utils/settingsSchema");

test("sanitizeSettingsRecord normaliza tipos y aplica limites", () => {
  const raw = {
    guild_id: "g1",
    max_tickets: 99,
    rate_limit_window_seconds: "2",
    command_rate_limit_enabled: "true",
    command_rate_limit_window_seconds: 9999,
    command_rate_limit_max_actions: 0,
    sla_escalation_enabled: "true",
    sla_escalation_minutes: "99999",
    sla_escalation_role: "<@&123456789012345678>",
    sla_escalation_channel: "<#123456789012345679>",
    ticket_panel_title: " Support Center Deluxe ",
    ticket_panel_description: "  Pro panel copy  ",
    ticket_panel_color: "5865f2",
    ticket_welcome_message: " Hi {user} ",
    ticket_control_panel_title: " Ops Console ",
    ticket_control_panel_description: " Manage {ticket} ",
    ticket_control_panel_color: "#12AB34",
    command_rate_limit_overrides: {
      ping: { max_actions: "3", window_seconds: "15", enabled: true },
      "??": { max_actions: 99 },
    },
    disabled_commands: ["PING", "ping", "invalid command"],
    bot_language: "en-US",
    dashboard_general_settings: {
      commandMode: "PREFIX",
      prefix: "  $$demo  ",
      timezone: "America/Bogota",
      moderationPreset: "STRICT",
      opsPlan: "ENTERPRISE",
    },
    dashboard_moderation_settings: {
      antiSpamThreshold: "200",
      capsPercentageLimit: "10",
      duplicateWindowSeconds: "500",
      raidPreset: "LOCKDOWN",
    },
    automod_enabled: "true",
    automod_presets: ["SPAM", "invites", "??", "scam", "spam"],
    automod_alert_channel: "<#123456789012345680>",
    automod_exempt_roles: ["<@&123456789012345681>", "<@&123456789012345681>", "bad"],
    automod_exempt_channels: ["<#123456789012345682>", "not-a-channel"],
    automod_managed_rule_ids: {
      spam: "969707018069872670",
      bogus: "123456789012345678",
    },
    automod_last_sync_status: "PARTIAL",
    automod_last_sync_summary: " synced with warnings ",
    automod_last_sync_at: "2026-03-01T12:00:00.000Z",
    automod_action_overrides: {
      enableAlerts: "false",
      timeoutSeconds: "999999999",
      timeoutPresets: ["spam", "scam", "bogus"],
    },
    automod_keyword_overrides: {
      inviteAllowList: [" discord.gg/partners ", "DISCORD.GG/PARTNERS"],
      scamKeywords: [" FREE NITRO ", "wallet drain", ""],
    },
    disabled_playbooks: [" SLA_ESCALATION ", "incident_mode", "??"],
    dashboard_preferences: {
      defaultSection: "ANALYTICS",
      compactMode: "true",
      showAdvancedCards: "false",
    },
  };

  const out = sanitizeSettingsRecord("g1", raw);
  assert.equal(out.max_tickets, 10);
  assert.equal(out.rate_limit_window_seconds, 3);
  assert.equal(out.command_rate_limit_enabled, true);
  assert.equal(out.command_rate_limit_window_seconds, 300);
  assert.equal(out.command_rate_limit_max_actions, 1);
  assert.equal(out.sla_escalation_enabled, true);
  assert.equal(out.sla_escalation_minutes, 10080);
  assert.equal(out.sla_escalation_role, "123456789012345678");
  assert.equal(out.sla_escalation_channel, "123456789012345679");
  assert.equal(out.ticket_panel_title, "Support Center Deluxe");
  assert.equal(out.ticket_panel_description, "Pro panel copy");
  assert.equal(out.ticket_panel_color, "#5865F2");
  assert.equal(out.ticket_welcome_message, "Hi {user}");
  assert.equal(out.ticket_control_panel_title, "Ops Console");
  assert.equal(out.ticket_control_panel_description, "Manage {ticket}");
  assert.equal(out.ticket_control_panel_color, "#12AB34");
  assert.deepEqual(out.disabled_commands, ["ping"]);
  assert.deepEqual(out.command_rate_limit_overrides, {
    ping: { max_actions: 3, window_seconds: 15, enabled: true },
  });
  assert.equal(out.bot_language, "en");
  assert.deepEqual(out.dashboard_general_settings, {
    language: "en",
    commandMode: "prefix",
    prefix: "$$dem",
    timezone: "America/Bogota",
    moderationPreset: "strict",
    opsPlan: "enterprise",
  });
  assert.equal(out.commercial_settings.plan, "enterprise");
  assert.deepEqual(out.dashboard_moderation_settings, {
    antiSpamEnabled: true,
    antiSpamThreshold: 20,
    linkFilterEnabled: true,
    capsFilterEnabled: true,
    capsPercentageLimit: 20,
    duplicateFilterEnabled: true,
    duplicateWindowSeconds: 300,
    raidProtectionEnabled: true,
    raidPreset: "lockdown",
  });
  assert.equal(out.automod_enabled, true);
  assert.deepEqual(out.automod_presets, ["spam", "invites", "scam"]);
  assert.equal(out.automod_alert_channel, "123456789012345680");
  assert.deepEqual(out.automod_exempt_roles, ["123456789012345681"]);
  assert.deepEqual(out.automod_exempt_channels, ["123456789012345682"]);
  assert.deepEqual(out.automod_managed_rule_ids, {
    spam: "969707018069872670",
  });
  assert.equal(out.automod_last_sync_status, "partial");
  assert.equal(out.automod_last_sync_summary, "synced with warnings");
  assert.equal(out.automod_last_sync_at.toISOString(), "2026-03-01T12:00:00.000Z");
  assert.deepEqual(out.automod_action_overrides, {
    enableAlerts: false,
    timeoutSeconds: 2419200,
    timeoutPresets: ["spam", "scam"],
  });
  assert.deepEqual(out.automod_keyword_overrides, {
    inviteAllowList: ["discord.gg/partners"],
    scamKeywords: ["FREE NITRO", "wallet drain"],
  });
  assert.deepEqual(out.dashboard_preferences, {
    defaultSection: "analytics",
    compactMode: true,
    showAdvancedCards: false,
  });
  assert.deepEqual(out.disabled_playbooks, ["sla_escalation", "incident_mode"]);
  assert.equal(out.settings_schema_version, SETTINGS_SCHEMA_VERSION);
});

test("sanitizeSettingsPatch ignora claves desconocidas y conserva schema", () => {
  const current = sanitizeSettingsRecord("g1", { guild_id: "g1" });
  const { sanitizedPatch, unknownKeys } = sanitizeSettingsPatch("g1", current, {
    max_tickets: 7,
    custom_field: "x",
  });

  assert.equal(sanitizedPatch.max_tickets, 7);
  assert.equal(sanitizedPatch.settings_schema_version, SETTINGS_SCHEMA_VERSION);
  assert.deepEqual(unknownKeys, ["custom_field"]);
});

test("sanitizeSettingsRecord acepta secciones nuevas del dashboard sin romper valores legacy", () => {
  const currentContract = sanitizeSettingsRecord("g1", {
    guild_id: "g1",
    dashboard_preferences: {
      defaultSection: "SERVER_ROLES",
    },
  });
  const legacyContract = sanitizeSettingsRecord("g1", {
    guild_id: "g1",
    dashboard_preferences: {
      defaultSection: "moderation",
    },
  });

  assert.equal(currentContract.dashboard_preferences.defaultSection, "server_roles");
  assert.equal(legacyContract.dashboard_preferences.defaultSection, "system");
});

test("hasSettingsDrift detecta documentos fuera de esquema", () => {
  const clean = sanitizeSettingsRecord("g1", { guild_id: "g1" });
  const dirty = { ...clean, max_tickets: 0, settings_schema_version: 1 };
  assert.equal(hasSettingsDrift(dirty, clean), true);
  assert.equal(hasSettingsDrift(clean, clean), false);
});
