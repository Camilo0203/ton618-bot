const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");

const originalSettingsGet = db.settings.get;
const originalWarningsAdd = db.warnings.add;
const originalWarningsGetCount = db.warnings.getCount;

let warnCommand = null;

function createInteraction({ language = "en", reason = "Spam links" } = {}) {
  const calls = { reply: [] };
  const warnedUser = {
    id: "user-1",
    username: "Target",
    toString() {
      return "<@user-1>";
    },
    displayAvatarURL() {
      return "https://example.com/avatar.png";
    },
  };

  return {
    locale: language === "es" ? "es-ES" : "en-US",
    guild: {
      id: "guild-1",
      members: {
        cache: {
          get: () => null,
        },
      },
    },
    user: {
      id: "mod-1",
      toString() {
        return "<@mod-1>";
      },
    },
    options: {
      getSubcommand: () => "add",
      getUser: (name) => (name === "user" ? warnedUser : null),
      getString: (name) => (name === "reason" ? reason : null),
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  delete require.cache[require.resolve("../src/commands/staff/moderation/warn")];

  db.warnings.add = async () => ({ _id: "warn-1" });
  db.warnings.getCount = async () => 1;
  db.settings.get = async () => ({ bot_language: "en" });

  warnCommand = require("../src/commands/staff/moderation/warn");
});

test.after(() => {
  db.settings.get = originalSettingsGet;
  db.warnings.add = originalWarningsAdd;
  db.warnings.getCount = originalWarningsGetCount;
});

test("/warn add responde en ingles cuando el servidor usa en", async () => {
  const interaction = createInteraction({ language: "en", reason: "Spam links" });

  await warnCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const embed = interaction.__calls.reply[0].embeds[0].data;
  assert.equal(embed.title, "Warning added");
  assert.equal(embed.fields[2].name, "Reason");
  assert.match(embed.description, /warned successfully/i);
});

test("/warn add responde en espanol cuando el servidor usa es", async () => {
  db.settings.get = async () => ({ bot_language: "es" });
  const interaction = createInteraction({ language: "es", reason: "Enlaces no permitidos" });

  await warnCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const embed = interaction.__calls.reply[0].embeds[0].data;
  assert.equal(embed.title, "Advertencia agregada");
  assert.equal(embed.fields[2].name, "Motivo");
  assert.doesNotMatch(embed.description, /warned successfully/i);
});
