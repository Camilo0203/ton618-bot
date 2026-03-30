const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const { clearGuildSettingsCache } = require("../src/utils/accessControl");
const pingCommand = require("../src/commands/public/utility/ping");
const helpCommand = require("../src/commands/public/utility/help");
const ticketCommand = require("../src/commands/staff/tickets/ticket");
const verifyCommand = require("../src/commands/admin/config/verify");
const setupCommand = require("../src/commands/admin/config/setup");
const warnCommand = require("../src/commands/staff/moderation/warn");
const modlogsCommand = require("../src/commands/staff/moderation/modlogs");

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
      channels: { cache: { size: { } } },
    },
    reply: async (payload) => {
      calls.push(payload);
    },
  };

  interaction.client.channels.cache.size = 8;

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

test("help responde en espanol cuando bot_language es es", async () => {
  db.settings.get = async () => ({
    bot_language: "es",
    simple_help_mode: true,
    admin_role: null,
    support_role: null,
  });

  const calls = [];
  const interaction = {
    guild: { id: "g1", name: "GuildX" },
    user: { id: "u1" },
    locale: "en-US",
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
  const embed = calls[0].embeds[0].data;
  assert.equal(embed.title, "Ayuda: /ping");
  assert.match(embed.description, /Categor/);
  assert.doesNotMatch(embed.description, /Category: \*\*Utilities\*\*/);
});

test("los slash core P1 exponen localizacion nativa en descripciones y opciones", () => {
  const ticketJson = ticketCommand.data.toJSON();
  const verifyJson = verifyCommand.data.toJSON();
  const setupJson = setupCommand.data.toJSON();
  const warnJson = warnCommand.data.toJSON();
  const modlogsJson = modlogsCommand.data.toJSON();

  for (const json of [ticketJson, verifyJson, setupJson, warnJson, modlogsJson]) {
    assert.equal(typeof json.description_localizations["en-US"], "string");
    assert.equal(typeof json.description_localizations["en-GB"], "string");
    assert.equal(typeof json.description_localizations["es-ES"], "string");
    assert.equal(typeof json.description_localizations["es-419"], "string");
    assert.equal(json.name_localizations, undefined);
  }

  assert.equal(
    ticketJson.options.find((option) => option.name === "open").description_localizations["es-419"],
    "Abre un ticket nuevo"
  );

  const verifyQuestionPool = verifyJson.options.find((option) => option.name === "question-pool");
  assert.equal(
    verifyQuestionPool.description_localizations["en-GB"],
    "Manage the random verification question pool"
  );

  const verifyCaptchaChoices = verifyJson.options
    .find((option) => option.name === "security")
    .options.find((option) => option.name === "captcha_type")
    .choices;
  assert.equal(typeof verifyCaptchaChoices[0].name_localizations["es-ES"], "string");

  const setupWelcome = setupJson.options.find((option) => option.name === "welcome");
  assert.equal(
    setupWelcome.description_localizations["es-ES"],
    "Configura los mensajes de bienvenida y el onboarding"
  );

  const warnUserOption = warnJson.options
    .find((option) => option.name === "add")
    .options.find((option) => option.name === "user");
  assert.equal(warnUserOption.description_localizations["en-US"], "Member to warn");

  const modlogsEventChoices = modlogsJson.options
    .find((option) => option.name === "config")
    .options.find((option) => option.name === "event")
    .choices;
  assert.equal(modlogsEventChoices[0].name_localizations["es-419"], "Baneos");
});
