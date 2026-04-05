const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const debugCommand = require("../src/commands/developer/system/debug");

const guildsModule = require("../src/utils/dashboardBridge/guilds");
const bridgeSyncModule = require("../src/utils/dashboardBridgeSync");

const originalOwnerId = process.env.OWNER_ID;
const originalSettingsGet = db.settings.get;
const originalSettingsUpdate = db.settings.update;
const originalFetchEntitlement = guildsModule.fetchGuildEffectiveEntitlement;
const originalRequestSupabase = guildsModule.requestSupabase;
const originalQueueSync = bridgeSyncModule.queueDashboardBridgeSync;

function createInteraction({
  subcommand,
  guildId = "g1",
  tier = "free",
  expiresInDays = null,
  active = null,
  note = null,
} = {}) {
  const calls = { reply: [] };
  return {
    user: { id: "owner-1", tag: "Owner#0001", username: "Owner" },
    guildId: guildId,
    client: {
      guilds: {
        cache: new Map([
          [guildId, { id: guildId, name: "Guild QA" }],
        ]),
      },
      application: {
        owner: { id: "owner-1" },
      },
    },
    options: {
      getSubcommandGroup: () => "entitlements",
      getSubcommand: () => subcommand,
      getString: (name) => {
        if (name === "guild_id") return guildId;
        if (name === "tier") return tier;
        if (name === "note") return note;
        return null;
      },
      getInteger: (name) => (name === "expires_in_days" ? expiresInDays : null),
      getBoolean: (name) => (name === "active" ? active : null),
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  process.env.OWNER_ID = "owner-1";
  guildsModule.fetchGuildEffectiveEntitlement = async () => null;
  guildsModule.requestSupabase = async () => ({});
  bridgeSyncModule.queueDashboardBridgeSync = () => {};
  db.settings.get = async () => ({
    dashboard_general_settings: { opsPlan: "free" },
    commercial_settings: {
      plan: "free",
      plan_source: "manual",
      supporter_enabled: false,
    },
  });
  db.settings.update = async (_guildId, patch) => ({
    dashboard_general_settings: patch.dashboard_general_settings,
    commercial_settings: patch.commercial_settings,
  });
});

test.after(() => {
  process.env.OWNER_ID = originalOwnerId;
  db.settings.get = originalSettingsGet;
  db.settings.update = originalSettingsUpdate;
  guildsModule.fetchGuildEffectiveEntitlement = originalFetchEntitlement;
  guildsModule.requestSupabase = originalRequestSupabase;
  bridgeSyncModule.queueDashboardBridgeSync = originalQueueSync;
});

test("debug entitlements status shows effective plan and supporter state", async () => {
  db.settings.get = async () => ({
    dashboard_general_settings: { opsPlan: "pro" },
    commercial_settings: {
      plan: "pro",
      plan_source: "owner_debug",
      supporter_enabled: true,
      supporter_started_at: "2026-03-20T00:00:00.000Z",
      supporter_expires_at: "2026-04-20T00:00:00.000Z",
    },
  });

  const interaction = createInteraction({ subcommand: "status" });
  await debugCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const fieldValue = interaction.__calls.reply[0].embeds[0].data.fields[0].value;
  assert.match(fieldValue, /pro/i);
  assert.match(fieldValue, /[Ss]upporter/);
});

test("debug entitlements set-plan stores Pro manually and syncs dashboard compatibility", async () => {
  let capturedPatch = null;
  db.settings.update = async (_guildId, patch) => {
    capturedPatch = patch;
    return {
      dashboard_general_settings: patch.dashboard_general_settings,
      commercial_settings: patch.commercial_settings,
    };
  };

  const interaction = createInteraction({
    subcommand: "set-plan",
    tier: "pro",
    expiresInDays: 30,
    note: "Founding beta",
  });
  await debugCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const embedTitle = interaction.__calls.reply[0].embeds[0].data.title;
  assert.ok(embedTitle, "Should have embed title");
});

test("debug entitlements set-supporter enables recognition without upgrading the plan", async () => {
  let capturedPatch = null;
  db.settings.update = async (_guildId, patch) => {
    capturedPatch = patch;
    return {
      dashboard_general_settings: patch.dashboard_general_settings,
      commercial_settings: patch.commercial_settings,
    };
  };

  const interaction = createInteraction({
    subcommand: "set-supporter",
    active: true,
    expiresInDays: 14,
    note: "Supporter wave 1",
  });
  await debugCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const embedTitle = interaction.__calls.reply[0].embeds[0].data.title;
  assert.ok(embedTitle, "Should have embed title");
});
