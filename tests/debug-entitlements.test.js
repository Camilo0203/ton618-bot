const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const debugCommand = require("../src/commands/developer/system/debug");

const originalOwnerId = process.env.OWNER_ID;
const originalSettingsGet = db.settings.get;
const originalSettingsUpdate = db.settings.update;

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
  assert.match(fieldValue, /Current plan: `pro`/);
  assert.match(fieldValue, /Supporter: Enabled/);
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

  assert.equal(capturedPatch.commercial_settings.plan, "pro");
  assert.equal(capturedPatch.commercial_settings.plan_source, "owner_debug");
  assert.equal(capturedPatch.commercial_settings.plan_note, "Founding beta");
  assert.equal(capturedPatch.dashboard_general_settings.opsPlan, "pro");
  assert.equal(interaction.__calls.reply[0].embeds[0].data.title, "Plan Updated");
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

  assert.equal(capturedPatch.commercial_settings.supporter_enabled, true);
  assert.equal(capturedPatch.commercial_settings.plan, "free");
  assert.equal(capturedPatch.dashboard_general_settings.opsPlan, "free");

  const fieldValue = interaction.__calls.reply[0].embeds[0].data.fields[0].value;
  assert.match(fieldValue, /Supporter: Enabled/);
});
