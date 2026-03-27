const test = require("node:test");
const assert = require("node:assert/strict");

const { buildConfigBackup, parseAndSanitizeBackup } = require("../src/utils/configBackup");

test("buildConfigBackup genera schema_version 2 e incluye disabled_commands", () => {
  const backup = buildConfigBackup({
    settings: { disabled_commands: ["ping", "music"], bot_language: "en" },
    verify: {},
    welcome: {},
    suggest: {},
    modlogs: {},
  });

  assert.equal(backup.schema_version, 2);
  assert.deepEqual(backup.settings.disabled_commands, ["ping", "music"]);
  assert.equal(backup.settings.bot_language, "en");
});

test("parseAndSanitizeBackup normaliza disabled_commands", () => {
  const parsed = parseAndSanitizeBackup(JSON.stringify({
    settings: {
      disabled_commands: ["PING", "ping", "music", "??", 42],
    },
    verify: {},
    welcome: {},
    suggest: {},
    modlogs: {},
  }));

  assert.deepEqual(parsed.settings.disabled_commands, ["ping", "music", "42"]);
});

test("parseAndSanitizeBackup normaliza configuracion de escalado SLA", () => {
  const parsed = parseAndSanitizeBackup(JSON.stringify({
    settings: {
      sla_escalation_enabled: "true",
      sla_escalation_minutes: 99999,
      sla_escalation_role: "<@&123456789012345678>",
      sla_escalation_channel: "<#123456789012345679>",
    },
    verify: {},
    welcome: {},
    suggest: {},
    modlogs: {},
  }));

  assert.equal(parsed.settings.sla_escalation_enabled, true);
  assert.equal(parsed.settings.sla_escalation_minutes, 10080);
  assert.equal(parsed.settings.sla_escalation_role, "123456789012345678");
  assert.equal(parsed.settings.sla_escalation_channel, "123456789012345679");
});

test("parseAndSanitizeBackup conserva configuracion de AutoMod y omite estado runtime", () => {
  const parsed = parseAndSanitizeBackup(JSON.stringify({
    settings: {
      automod_enabled: "true",
      automod_presets: ["SPAM", "invites", "??"],
      automod_alert_channel: "<#123456789012345680>",
      automod_exempt_roles: ["<@&123456789012345681>", "bad"],
      automod_exempt_channels: ["<#123456789012345682>", "bad"],
      automod_action_overrides: {
        enableAlerts: "false",
        timeoutSeconds: 120,
        timeoutPresets: ["scam", "bad"],
      },
      automod_keyword_overrides: {
        inviteAllowList: [" discord.gg/partners "],
        scamKeywords: [" free nitro "],
      },
      automod_managed_rule_ids: {
        spam: "123456789012345683",
      },
      automod_last_sync_status: "failed",
    },
    verify: {},
    welcome: {},
    suggest: {},
    modlogs: {},
  }));

  assert.equal(parsed.settings.automod_enabled, true);
  assert.deepEqual(parsed.settings.automod_presets, ["spam", "invites"]);
  assert.equal(parsed.settings.automod_alert_channel, "123456789012345680");
  assert.deepEqual(parsed.settings.automod_exempt_roles, ["123456789012345681"]);
  assert.deepEqual(parsed.settings.automod_exempt_channels, ["123456789012345682"]);
  assert.deepEqual(parsed.settings.automod_action_overrides, {
    enableAlerts: false,
    timeoutSeconds: 120,
    timeoutPresets: ["scam"],
  });
  assert.deepEqual(parsed.settings.automod_keyword_overrides, {
    inviteAllowList: ["discord.gg/partners"],
    scamKeywords: ["free nitro"],
  });
  assert.equal(Object.hasOwn(parsed.settings, "automod_managed_rule_ids"), false);
  assert.equal(Object.hasOwn(parsed.settings, "automod_last_sync_status"), false);
});
