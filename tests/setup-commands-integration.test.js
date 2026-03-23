const test = require("node:test");
const assert = require("node:assert/strict");
const { Collection } = require("discord.js");

const db = require("../src/utils/database");
const interactionEvent = require("../src/events/interactionCreate");
const setupCommand = require("../src/commands/admin/config/setup");

const originalSettingsGet = db.settings.get;
const originalSettingsUpdate = db.settings.update;

const baseSettings = {
  rate_limit_enabled: false,
  rate_limit_bypass_admin: true,
  rate_limit_max_actions: 999,
  rate_limit_window_seconds: 1,
  admin_role: "role-admin",
  support_role: "role-support",
  disabled_commands: [],
  log_channel: null,
};

const settingsStore = new Map();

function getStoredSettings(guildId) {
  if (!settingsStore.has(guildId)) {
    settingsStore.set(guildId, { ...baseSettings, guild_id: guildId });
  }
  return settingsStore.get(guildId);
}

function createCommandInteraction({
  commandName,
  group = null,
  sub = null,
  commandOption = null,
  admin = true,
  client = null,
} = {}) {
  const calls = { reply: [], followUp: [], update: [] };

  return {
    client,
    guildId: "g1",
    guild: {
      id: "g1",
      name: "Guild 1",
      channels: { cache: new Collection() },
    },
    member: {
      permissions: { has: () => admin },
      roles: { cache: { has: () => false } },
    },
    memberPermissions: { has: () => admin },
    user: { id: "u-admin", username: "admin" },
    commandName,
    customId: "x",
    type: 2,
    replied: false,
    deferred: false,
    options: {
      getSubcommandGroup: (required = true) => {
        if (group !== null) return group;
        if (required) throw new Error("Missing subcommand group");
        return null;
      },
      getSubcommand: (required = true) => {
        if (sub !== null) return sub;
        if (required) throw new Error("Missing subcommand");
        return null;
      },
      getString: (name, required = false) => {
        if (name === "comando") {
          if (commandOption !== null) return commandOption;
          if (required) throw new Error("Missing command option");
          return null;
        }
        return null;
      },
    },

    isChatInputCommand: () => true,
    isAutocomplete: () => false,
    isButton: () => false,
    isStringSelectMenu: () => false,
    isModalSubmit: () => false,

    reply: async (payload) => {
      calls.reply.push(payload);
    },
    followUp: async (payload) => {
      calls.followUp.push(payload);
    },
    update: async (payload) => {
      calls.update.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  settingsStore.clear();
  db.settings.get = async (guildId) => ({ ...getStoredSettings(guildId) });
  db.settings.update = async (guildId, data) => {
    const current = getStoredSettings(guildId);
    const next = { ...current, ...data };
    settingsStore.set(guildId, next);
    return { ...next };
  };
  interactionEvent.__test.clearHandlers();
  interactionEvent.__test.clearSettingsCache();
  interactionEvent.__test.seedHandler("button", "__dummy__", { customId: "__dummy__", execute: async () => {} });
});

test.after(() => {
  db.settings.get = originalSettingsGet;
  db.settings.update = originalSettingsUpdate;
});

test("flujo /setup comandos deshabilitar-habilitar-reset afecta router", async () => {
  let pingExecutions = 0;
  const commands = new Collection();

  setupCommand.meta = { scope: "admin", category: "config" };
  commands.set("setup", setupCommand);
  commands.set("ping", {
    data: { name: "ping" },
    meta: { scope: "public" },
    execute: async () => {
      pingExecutions += 1;
    },
  });
  commands.set("music", {
    data: { name: "music" },
    meta: { scope: "public" },
    execute: async () => {},
  });

  const client = { commands };

  const disablePing = createCommandInteraction({
    client,
    commandName: "setup",
    group: "comandos",
    sub: "deshabilitar",
    commandOption: "ping",
    admin: true,
  });
  await interactionEvent.execute(disablePing, client);
  assert.deepEqual(getStoredSettings("g1").disabled_commands, ["ping"]);

  const pingDenied = createCommandInteraction({ commandName: "ping", admin: false });
  pingDenied.client = client;
  await interactionEvent.execute(pingDenied, client);
  assert.equal(pingExecutions, 0);
  assert.equal(pingDenied.__calls.reply.length, 1);

  const enablePing = createCommandInteraction({
    client,
    commandName: "setup",
    group: "comandos",
    sub: "habilitar",
    commandOption: "ping",
    admin: true,
  });
  await interactionEvent.execute(enablePing, client);
  assert.deepEqual(getStoredSettings("g1").disabled_commands, []);

  const pingAllowed = createCommandInteraction({ commandName: "ping", admin: false });
  pingAllowed.client = client;
  await interactionEvent.execute(pingAllowed, client);
  assert.equal(pingExecutions, 1);

  const disablePingAgain = createCommandInteraction({
    client,
    commandName: "setup",
    group: "comandos",
    sub: "deshabilitar",
    commandOption: "ping",
    admin: true,
  });
  await interactionEvent.execute(disablePingAgain, client);

  const disableMusic = createCommandInteraction({
    client,
    commandName: "setup",
    group: "comandos",
    sub: "deshabilitar",
    commandOption: "music",
    admin: true,
  });
  await interactionEvent.execute(disableMusic, client);
  assert.deepEqual(getStoredSettings("g1").disabled_commands, ["music", "ping"]);

  const resetAll = createCommandInteraction({
    client,
    commandName: "setup",
    group: "comandos",
    sub: "reset",
    admin: true,
  });
  await interactionEvent.execute(resetAll, client);
  assert.deepEqual(getStoredSettings("g1").disabled_commands, []);
});
