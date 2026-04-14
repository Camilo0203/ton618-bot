const test = require("node:test");
const assert = require("node:assert/strict");

const userRL = require("../src/utils/userRateLimiter");
const guildRL = require("../src/utils/guildRateLimiter");
const globalRL = require("../src/utils/globalRateLimiter");

test("Integrated: user + guild + global rate limiting works together", () => {
  userRL.resetUserRateLimit("u1");
  guildRL.resetGuildRateLimit("g1");
  
  const userResult = userRL.checkUserRateLimit("u1", "ticket");
  const guildResult = guildRL.checkGuildRateLimit("g1", "ticket");
  const globalResult = globalRL.checkGlobalRateLimit();
  
  assert.equal(userResult.allowed, true);
  assert.equal(guildResult.allowed, true);
  assert.equal(globalResult.allowed, true);
  
  const userAfterLimit = userRL.checkUserRateLimit("u1", "ticket");
  const guildAfterLimit = guildRL.checkGuildRateLimit("g1", "ticket");
  
  const userConfig = userRL.getConfig();
  assert.equal(userAfterLimit.allowed, userConfig.defaultMaxRequests > 1);
  
  const guildConfig = guildRL.getConfig();
  assert.equal(guildAfterLimit.allowed, guildConfig.defaultMaxRequests > 1);
});

test("Integrated: rate limiters expose stats", () => {
  const globalStats = globalRL.getGlobalStats();
  
  assert.equal(typeof globalStats.currentCount, 'number');
  assert.equal(typeof globalStats.maxRequests, 'number');
  assert.equal(typeof globalStats.remaining, 'number');
});