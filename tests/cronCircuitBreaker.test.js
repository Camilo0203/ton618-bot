const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getOrCreateBreaker,
  runCronWithProtection,
  getCronBreakerStatus,
  getAllCronStatuses,
  resetCronBreaker,
} = require("../src/utils/cronCircuitBreaker");

test.afterEach(() => {
  resetCronBreaker("test-cron");
  resetCronBreaker("test-cron-2");
});

test("cronCircuitBreaker creates breaker on demand", () => {
  const breaker = getOrCreateBreaker("test-cron");
  assert.ok(breaker);
  assert.equal(breaker.name, "cron-test-cron");
});

test("cronCircuitBreaker runs function with protection", async () => {
  let executed = false;
  
  const result = await runCronWithProtection("test-cron", async () => {
    executed = true;
    return "success";
  });
  
  assert.equal(executed, true);
  assert.equal(result, "success");
});

test("cronCircuitBreaker catches failures", async () => {
  let errorThrown = false;
  
  await runCronWithProtection("test-cron", async () => {
    throw new Error("test error");
  }).catch(() => {
    errorThrown = true;
  });
  
  assert.equal(errorThrown, true);
});

test("cronCircuitBreaker exposes status", () => {
  const status = getCronBreakerStatus("test-cron-nonexistent");
  assert.equal(status, null);
  
  getOrCreateBreaker("test-cron-2");
  const status2 = getCronBreakerStatus("test-cron-2");
  assert.ok(status2);
  assert.ok(status2.state);
});