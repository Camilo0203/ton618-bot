const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const { clearGuildSettingsCache } = require("../src/utils/accessControl");
const pingCommand = require("../src/commands/public/utility/ping");
const helpCommand = require("../src/commands/public/utility/help");

const originalSettingsGet = db.settings.get;
const originalOwnerId = process.env.OWNER_ID;

test.beforeEach(() => {
  clearGuildSettingsCache("*");
  delete process.env.OWNER_ID;
});

test.after(() => {
  db.settings.get = originalSettingsGet;
  if (originalOwnerId) {
    process.env.OWNER_ID = originalOwnerId;
  } else {
    delete process.env.OWNER_ID;
  }
  clearGuildSettingsCache("*");
});

test("ping usa bot_language del servidor por encima del locale", async () => {
  db.settings.get = async () => ({
    bot_language: "en",
    simple_help_mode: true,
    admin_role: null,
    support_role: null,
  });

  const calls = [];
  const interaction = {
    guildId: "g1",
    locale: "es-ES",
    user: { id: "owner-1" },
    client: {
      ws: { ping: 42 },
      uptime: 61000,
      guilds: { cache: { size: 2 } },
      users: { cache: { size: 5 } },
      channels: { cache: { size: 8 } },
    },
    reply: async (payload) => {
      calls.push(payload);
    },
  };

  await pingCommand.execute(interaction);

  assert.equal(calls.length, 1);
  const fields = calls[0].embeds[0].data.fields.map((field) => field.name);
  assert.ok(fields.includes("Bot Latency"));
});

test("ping denies non-owner when OWNER_ID is configured", async () => {
  process.env.OWNER_ID = "owner-1";

  const calls = [];
  const interaction = {
    guildId: "g1",
    user: { id: "not-owner" },
    client: {
      ws: { ping: 42 },
      uptime: 61000,
      guilds: { cache: { size: 2 } },
      users: { cache: { size: 5 } },
      channels: { cache: { size: 8 } },
    },
    reply: async (payload) => {
      calls.push(payload);
    },
  };

  await pingCommand.execute(interaction);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].content, "Only the bot owner can use this command.");
  assert.equal(calls[0].flags, 64);
});

test("help responde en ingles cuando bot_language es en", async () => {
  db.settings.get = async () => ({
    bot_language: "en",
    simple_help_mode: true,
    admin_role: null,
    support_role: null,
  });

  const calls = [];
  const interaction = {
    guild: { id: "g1", name: "GuildX" },
    user: { id: "u1" },
    locale: "es-ES",
    member: {
      permissions: { has: () => false },
      roles: { cache: { has: () => false } },
    },
    client: {
      commands: new Map([
        [
          "ping",
          {
            data: {
              name: "ping",
              toJSON: () => ({ name: "ping", description: "Ping bot", options: [] }),
            },
            meta: { scope: "public", category: "utility" },
          },
        ],
      ]),
    },
    options: {
      getString: () => "ping",
    },
    reply: async (payload) => {
      calls.push(payload);
    },
  };

  await helpCommand.execute(interaction);

  assert.equal(calls.length, 1);
  const title = calls[0].embeds[0].data.title;
  assert.equal(title, "Help: /ping");
});
