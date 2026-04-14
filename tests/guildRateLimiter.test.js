const test = require("node:test");
const assert = require("node:assert/strict");

const {
  checkGuildRateLimit,
  resetGuildRateLimit,
  getGuildStats,
  getConfig,
} = require("../src/utils/guildRateLimiter");

test.afterEach(() => {
  resetGuildRateLimit("test-guild");
});

test("guildRateLimiter permite solicitudes dentro del limite", () => {
  const result = checkGuildRateLimit("test-guild", "ticket");
  assert.equal(result.allowed, true);
  assert.equal(result.retryAfter, 0);
});

test("guildRateLimiter bloquea despues del limite", () => {
  const config = getConfig();
  const originalMax = config.defaultMaxRequests;
  
  for (let i = 0; i < originalMax; i++) {
    checkGuildRateLimit("test-guild", "ticket");
  }
  
  const result = checkGuildRateLimit("test-guild", "ticket");
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "guild_rate_limit");
});

test("guildRateLimiter resetea por guild y comando", () => {
  checkGuildRateLimit("test-guild", "ticket");
  checkGuildRateLimit("test-guild", "ticket");
  
  resetGuildRateLimit("test-guild", "ticket");
  
  const result = checkGuildRateLimit("test-guild", "ticket");
  assert.equal(result.allowed, true);
});

test("guildRateLimiter permite sin guildId valido", () => {
  const result = checkGuildRateLimit(null, "ticket");
  assert.equal(result.allowed, true);
  
  const result2 = checkGuildRateLimit("test-guild", null);
  assert.equal(result2.allowed, true);
});