const test = require("node:test");
const assert = require("node:assert/strict");
const { Collection } = require("discord.js");

const db = require("../src/utils/database");
const actionHandler = require("../src/interactions/selects/setupCommandsPanelAction");
const targetHandler = require("../src/interactions/selects/setupCommandsPanelTarget");

const originalSettingsGet = db.settings.get;
const originalSettingsUpdate = db.settings.update;

const baseSettings = {
  disabled_commands: [],
  log_channel: null,
};

const settingsStore = new Map();

function getSettings(guildId) {
  if (!settingsStore.has(guildId)) {
    settingsStore.set(guildId, { ...baseSettings });
  }
  return settingsStore.get(guildId);
}

function createInteraction({
  customId,
  value,
  guildId = "g1",
  userId = "u1",
  admin = true,
  availableCommands = ["setup", "ping", "music"],
} = {}) {
  const calls = { update: [], reply: [] };
  const commands = new Collection();
  for (const name of availableCommands) {
    commands.set(name, { data: { name }, execute: async () => {} });
  }

  return {
    customId,
    values: [value],
    user: { id: userId },
    memberPermissions: { has: () => admin },
    guild: { id: guildId, name: "Guild 1", channels: { cache: new Collection() } },
    client: { commands },
    update: async (payload) => { calls.update.push(payload); },
    reply: async (payload) => { calls.reply.push(payload); },
    __calls: calls,
  };
}

test.beforeEach(() => {
  settingsStore.clear();
  db.settings.get = async (guildId) => ({ ...getSettings(guildId) });
  db.settings.update = async (guildId, data) => {
    const next = { ...getSettings(guildId), ...data };
    settingsStore.set(guildId, next);
    return { ...next };
  };
});

test.after(() => {
  db.settings.get = originalSettingsGet;
  db.settings.update = originalSettingsUpdate;
});

test("panel action select cambia de modo sin error", async () => {
  const interaction = createInteraction({
    customId: "setup_cmd_panel_action|u1",
    value: "estado",
  });

  await actionHandler.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 0);
  assert.equal(interaction.__calls.update.length, 1);
});

test("panel target select deshabilita comando en settings", async () => {
  const interaction = createInteraction({
    customId: "setup_cmd_panel_target|u1|deshabilitar",
    value: "ping",
  });

  await targetHandler.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 0);
  assert.equal(interaction.__calls.update.length, 1);
  assert.deepEqual(getSettings("g1").disabled_commands, ["ping"]);
});
