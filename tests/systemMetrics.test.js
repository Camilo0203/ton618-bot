const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getSystemMetrics,
  getHealthSummary,
  startMetricsReporter,
  stopMetricsReporter,
} = require("../src/utils/systemMetrics");

test("systemMetrics returns valid metrics", () => {
  const metrics = getSystemMetrics();
  
  assert.ok(metrics.timestamp);
  assert.ok(metrics.uptime >= 0);
  assert.ok(metrics.memory);
  assert.ok(metrics.memory.heapUsed >= 0);
  assert.ok(metrics.memory.heapTotal >= 0);
  assert.ok(metrics.rateLimits);
});

test("systemMetrics includes rate limit stats", () => {
  const metrics = getSystemMetrics();
  
  assert.ok(metrics.rateLimits.global);
  assert.ok(metrics.rateLimits.global.currentCount >= 0);
  assert.ok(metrics.rateLimits.guild);
});

test("getHealthSummary returns health object", () => {
  const health = getHealthSummary();
  
  assert.ok(health.status);
  assert.ok(Array.isArray(health.checks));
});

test("metricsReporter starts and stops", () => {
  startMetricsReporter(1000);
  
  const metrics1 = getSystemMetrics();
  assert.ok(metrics1);
  
  stopMetricsReporter();
  
  const metrics2 = getSystemMetrics();
  assert.ok(metrics2);
});