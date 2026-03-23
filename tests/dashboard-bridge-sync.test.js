const test = require("node:test");
const assert = require("node:assert/strict");

const { __test } = require("../src/utils/dashboardBridgeSync");

test("buildDashboardConfigPayload refleja el idioma del bot y conserva ajustes del panel", () => {
  const payload = __test.buildDashboardConfigPayload({
    bot_language: "en",
    dashboard_general_settings: {
      commandMode: "prefix",
      prefix: "?",
      timezone: "America/Bogota",
      moderationPreset: "strict",
      opsPlan: "pro",
    },
    dashboard_moderation_settings: {
      antiSpamEnabled: false,
      antiSpamThreshold: 12,
      linkFilterEnabled: false,
      capsFilterEnabled: false,
      capsPercentageLimit: 55,
      duplicateFilterEnabled: false,
      duplicateWindowSeconds: 90,
      raidProtectionEnabled: true,
      raidPreset: "lockdown",
    },
    dashboard_preferences: {
      defaultSection: "analytics",
      compactMode: true,
      showAdvancedCards: false,
    },
  });

  assert.deepEqual(payload.general_settings, {
    language: "en",
    commandMode: "prefix",
    prefix: "?",
    timezone: "America/Bogota",
    moderationPreset: "strict",
    opsPlan: "pro",
  });
  assert.deepEqual(payload.moderation_settings, {
    antiSpamEnabled: false,
    antiSpamThreshold: 12,
    linkFilterEnabled: false,
    capsFilterEnabled: false,
    capsPercentageLimit: 55,
    duplicateFilterEnabled: false,
    duplicateWindowSeconds: 90,
    raidProtectionEnabled: true,
    raidPreset: "lockdown",
  });
  assert.deepEqual(payload.dashboard_preferences, {
    defaultSection: "analytics",
    compactMode: true,
    showAdvancedCards: false,
  });
  assert.equal(payload.updated_by, null);
});

test("buildSettingsPatchFromDashboardRow traduce la fila de Supabase a patch de Mongo", () => {
  const patch = __test.buildSettingsPatchFromDashboardRow({
    general_settings: {
      language: "en",
      commandMode: "prefix",
      prefix: "??",
      timezone: "America/Bogota",
      moderationPreset: "relaxed",
      opsPlan: "enterprise",
    },
    moderation_settings: {
      antiSpamEnabled: false,
      antiSpamThreshold: 7,
      linkFilterEnabled: false,
      capsFilterEnabled: true,
      capsPercentageLimit: 45,
      duplicateFilterEnabled: true,
      duplicateWindowSeconds: 30,
      raidProtectionEnabled: false,
      raidPreset: "off",
    },
    dashboard_preferences: {
      defaultSection: "moderation",
      compactMode: true,
      showAdvancedCards: false,
    },
    updated_at: "2026-03-13T15:30:00.000Z",
  });

  assert.equal(patch.bot_language, "en");
  assert.deepEqual(patch.dashboard_general_settings, {
    language: "en",
    commandMode: "prefix",
    prefix: "??",
    timezone: "America/Bogota",
    moderationPreset: "relaxed",
    opsPlan: "enterprise",
  });
  assert.deepEqual(patch.dashboard_moderation_settings, {
    antiSpamEnabled: false,
    antiSpamThreshold: 7,
    linkFilterEnabled: false,
    capsFilterEnabled: true,
    capsPercentageLimit: 45,
    duplicateFilterEnabled: true,
    duplicateWindowSeconds: 30,
    raidProtectionEnabled: false,
    raidPreset: "off",
  });
  assert.deepEqual(patch.dashboard_preferences, {
    defaultSection: "moderation",
    compactMode: true,
    showAdvancedCards: false,
  });
  assert.equal(patch.dashboard_source_updated_at.toISOString(), "2026-03-13T15:30:00.000Z");
  assert.ok(patch.dashboard_last_synced_at instanceof Date);
});

test("shouldApplyDashboardRow solo aplica filas mas nuevas que la ultima importada", () => {
  assert.equal(
    __test.shouldApplyDashboardRow(
      { dashboard_source_updated_at: "2026-03-13T16:00:00.000Z" },
      { updated_at: "2026-03-13T15:59:59.000Z" }
    ),
    false
  );

  assert.equal(
    __test.shouldApplyDashboardRow(
      { dashboard_source_updated_at: "2026-03-13T16:00:00.000Z" },
      { updated_at: "2026-03-13T16:00:01.000Z" }
    ),
    true
  );
});

test("mapServerRolesMutationPayload traduce selectores del panel a claves Mongo", () => {
  const patch = __test.mapServerRolesMutationPayload({
    dashboardChannelId: "123456789012345678",
    ticketPanelChannelId: "223456789012345678",
    logsChannelId: "323456789012345678",
    transcriptChannelId: "",
    weeklyReportChannelId: "423456789012345678",
    liveMembersChannelId: "523456789012345678",
    liveRoleChannelId: "623456789012345678",
    liveRoleId: "723456789012345678",
    supportRoleId: "823456789012345678",
    adminRoleId: "923456789012345678",
    verifyRoleId: "103456789012345678",
  });

  assert.deepEqual(patch, {
    dashboard_channel: "123456789012345678",
    panel_channel_id: "223456789012345678",
    log_channel: "323456789012345678",
    transcript_channel: null,
    weekly_report_channel: "423456789012345678",
    live_members_channel: "523456789012345678",
    live_role_channel: "623456789012345678",
    live_role_id: "723456789012345678",
    support_role: "823456789012345678",
    admin_role: "923456789012345678",
    verify_role: "103456789012345678",
  });
});

test("mapCommandsMutationPayload normaliza overrides y comandos deshabilitados", () => {
  const patch = __test.mapCommandsMutationPayload({
    disabledCommands: ["Ping", "help", "ping"],
    simpleHelpMode: false,
    rateLimitEnabled: true,
    rateLimitWindowSeconds: 12,
    rateLimitMaxActions: 6,
    rateLimitBypassAdmin: false,
    commandRateLimitEnabled: true,
    commandRateLimitWindowSeconds: 25,
    commandRateLimitMaxActions: 3,
    commandRateLimitOverrides: {
      ping: { maxActions: 2, windowSeconds: 10, enabled: true },
      Help: 7,
    },
  });

  assert.deepEqual(patch.disabled_commands, ["ping", "help"]);
  assert.equal(patch.simple_help_mode, false);
  assert.deepEqual(patch.command_rate_limit_overrides, {
    ping: {
      max_actions: 2,
      window_seconds: 10,
      enabled: true,
    },
    help: {
      max_actions: 7,
      window_seconds: 20,
      enabled: true,
    },
  });
});

test("playbooks vivos respetan plan operativo y toggles por servidor", () => {
  const records = {
    settingsRecord: {
      bot_language: "es",
      dashboard_general_settings: {
        opsPlan: "free",
      },
      disabled_playbooks: ["triage_support"],
    },
  };

  const definitions = __test.buildPlaybookDefinitionRows("g1", records);
  const triage = definitions.find((row) => row.playbook_id === "triage_support");
  const sla = definitions.find((row) => row.playbook_id === "sla_escalation");

  assert.equal(triage?.is_enabled, false);
  assert.equal(sla?.is_enabled, false);

  const recommendations = __test.buildTicketRecommendationRows(
    "g1",
    [{
      ticket_id: "1042",
      channel_id: "c-1042",
      user_id: "u-1",
      user_tag: "Camilo QA",
      status: "open",
      workflow_status: "waiting_staff",
      claimed_by: null,
      assigned_to: null,
      first_staff_response: null,
      message_count: 1,
      priority: "normal",
      sla_state: "warning",
      sla_target_minutes: 30,
      queue_type: "support",
      category_id: "billing",
      category: "Billing",
      tags: [],
      created_at: "2026-03-23T15:00:00.000Z",
      updated_at: "2026-03-23T15:20:00.000Z",
      last_activity: "2026-03-23T15:20:00.000Z",
    }],
    {
      settingsRecord: {
        bot_language: "es",
        dashboard_general_settings: {
          opsPlan: "free",
        },
      },
    },
  );

  assert.deepEqual(
    recommendations.recommendationRows.map((row) => row.playbook_id),
    ["triage_support"],
  );
});
