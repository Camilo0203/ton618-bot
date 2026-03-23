const test = require("node:test");
const assert = require("node:assert/strict");

const { validateEnv } = require("../src/utils/env");

function buildBaseEnv(overrides = {}) {
  return {
    DISCORD_TOKEN: "x".repeat(40),
    MONGO_URI: "mongodb://localhost:27017/ton618_bot",
    ...overrides,
  };
}

test("validateEnv acepta flags booleanos validos para intents privilegiados", () => {
  const env = buildBaseEnv({
    MESSAGE_CONTENT_ENABLED: "false",
    GUILD_PRESENCES_ENABLED: "0",
  });

  const result = validateEnv(env);
  assert.deepEqual(result.errors, []);
});

test("validateEnv rechaza valores invalidos en MESSAGE_CONTENT_ENABLED", () => {
  const env = buildBaseEnv({
    MESSAGE_CONTENT_ENABLED: "maybe",
  });

  const result = validateEnv(env);
  assert.equal(
    result.errors.some((e) => e.includes("MESSAGE_CONTENT_ENABLED")),
    true
  );
});

test("validateEnv rechaza valores invalidos en GUILD_PRESENCES_ENABLED", () => {
  const env = buildBaseEnv({
    GUILD_PRESENCES_ENABLED: "sometimes",
  });

  const result = validateEnv(env);
  assert.equal(
    result.errors.some((e) => e.includes("GUILD_PRESENCES_ENABLED")),
    true
  );
});

test("validateEnv rechaza valores invalidos en ERROR_LOG_TO_FILE", () => {
  const env = buildBaseEnv({
    ERROR_LOG_TO_FILE: "perhaps",
  });

  const result = validateEnv(env);
  assert.equal(
    result.errors.some((e) => e.includes("ERROR_LOG_TO_FILE")),
    true
  );
});
