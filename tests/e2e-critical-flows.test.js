const test = require("node:test");
const assert = require("node:assert/strict");
const { Collection } = require("discord.js");

const db = require("../src/utils/database");
const interactionEvent = require("../src/events/interactionCreate");
const { resetRateLimiter } = require("../src/utils/rateLimiter");
const dashboardHandler = require("../src/handlers/dashboardHandler");

const originalSettingsGet = db.settings.get;
const originalSettingsUpdate = db.settings.update;
const originalAuditAdd = db.auditLogs.add;
const originalUpdateDashboard = dashboardHandler.updateDashboard;

function createCommandInteraction(commandName, userId = "u1") {
  const calls = { reply: [], followUp: [], update: [] };
  return {
    guildId: "g1",
    guild: { id: "g1" },
    member: { permissions: { has: () => false }, roles: { cache: { has: () => false } } },
    memberPermissions: { has: () => false },
    user: { id: userId, username: `user-${userId}` },
    commandName,
    type: 2,
    replied: false,
    deferred: false,
    isChatInputCommand: () => true,
    isAutocomplete: () => false,
    isButton: () => false,
    isStringSelectMenu: () => false,
    isModalSubmit: () => false,
    reply: async (payload) => { calls.reply.push(payload); },
    followUp: async (payload) => { calls.followUp.push(payload); },
    update: async (payload) => { calls.update.push(payload); },
    __calls: calls,
  };
}

test.beforeEach(() => {
  interactionEvent.__test.clearHandlers();
  interactionEvent.__test.clearSettingsCache();
  interactionEvent.__test.seedHandler("button", "__dummy__", { customId: "__dummy__", execute: async () => {} });
  resetRateLimiter();
});

test.after(() => {
  db.settings.get = originalSettingsGet;
  db.settings.update = originalSettingsUpdate;
  db.auditLogs.add = originalAuditAdd;
  dashboardHandler.updateDashboard = originalUpdateDashboard;
});

test("E2E: rate limit por comando bloquea spam y audita evento", async () => {
  const auditEntries = [];
  db.auditLogs.add = async (entry) => {
    auditEntries.push(entry);
    return entry;
  };
  db.settings.get = async () => ({
    rate_limit_enabled: false,
    rate_limit_bypass_admin: true,
    command_rate_limit_enabled: true,
    command_rate_limit_window_seconds: 60,
    command_rate_limit_max_actions: 1,
    command_rate_limit_overrides: {},
    disabled_commands: [],
  });

  let executions = 0;
  const commands = new Collection();
  commands.set("ping", {
    data: { name: "ping" },
    meta: { scope: "public" },
    execute: async () => {
      executions += 1;
    },
  });

  const client = { commands };
  const first = createCommandInteraction("ping", "u-rate");
  const second = createCommandInteraction("ping", "u-rate");

  await interactionEvent.execute(first, client);
  await interactionEvent.execute(second, client);

  assert.equal(executions, 1);
  assert.equal(second.__calls.reply.length, 1);
  assert.equal(
    auditEntries.some((entry) => entry.status === "rate_limited" && entry.action === "ping"),
    true
  );
});

test("E2E: setup wizard carga y exporta correctamente", async () => {
  const wizardPath = require.resolve("../src/commands/admin/config/setup/wizard");
  delete require.cache[wizardPath];
  const wizard = require(wizardPath);

  assert.equal(typeof wizard.register, 'function');
  assert.equal(typeof wizard.execute, 'function');
});
