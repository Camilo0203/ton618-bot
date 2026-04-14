const test = require("node:test");
const assert = require("node:assert/strict");

const {
  checkGlobalRateLimit,
  getGlobalStats,
  getConfig,
} = require("../src/utils/globalRateLimiter");

test.afterEach(() => {
  const { cleanupExpiredGlobalLimits } = require("../src/utils/globalRateLimiter");
  cleanupExpiredGlobalLimits();
});

test("globalRateLimiter permite solicitudes dentro del limite", () => {
  const result = checkGlobalRateLimit();
  assert.equal(result.allowed, true);
});

test("globalRateLimiter bloquea al superar el limite global", () => {
  const config = getConfig();
  
  for (let i = 0; i < config.defaultMaxRequests; i++) {
    checkGlobalRateLimit();
  }
  
  const result = checkGlobalRateLimit();
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "global_rate_limit");
});

test("globalRateLimiter expoa estadisticas", () => {
  const stats = getGlobalStats();
  assert.equal(typeof stats.currentCount, 'number');
  assert.equal(typeof stats.maxRequests, 'number');
  assert.equal(typeof stats.remaining, 'number');
});