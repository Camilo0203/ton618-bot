const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createDetailedHealthCheck,
  STATE,
} = require("../src/utils/healthCheck");

test("healthCheck returns comprehensive status", () => {
  const health = createDetailedHealthCheck();
  
  assert.ok(health.status);
  assert.ok(health.timestamp);
  assert.ok(health.version);
  assert.ok(health.uptime >= 0);
  assert.ok(health.checks);
  assert.ok(health.checks.process);
  assert.ok(health.checks.rateLimits);
});

test("healthCheck includes rate limit info", () => {
  const health = createDetailedHealthCheck();
  
  assert.ok(health.checks.rateLimits.global);
  assert.ok(typeof health.checks.rateLimits.global.currentCount, 'number');
  assert.ok(typeof health.checks.rateLimits.global.maxRequests, 'number');
});

test("healthCheck exposes state constants", () => {
  assert.equal(STATE.OK, 'ok');
  assert.equal(STATE.DEGRADED, 'degraded');
  assert.equal(STATE.DOWN, 'down');
});