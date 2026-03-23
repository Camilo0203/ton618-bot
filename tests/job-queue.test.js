const test = require("node:test");
const assert = require("node:assert/strict");
const { createJobQueue } = require("../src/utils/jobQueue");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("jobQueue respeta concurrencia", async () => {
  const queue = createJobQueue("test", { concurrency: 2, timeoutMs: 5000 });
  let running = 0;
  let maxRunning = 0;

  const jobs = Array.from({ length: 8 }, (_, i) =>
    queue.add(async () => {
      running += 1;
      maxRunning = Math.max(maxRunning, running);
      await sleep(20);
      running -= 1;
      return i;
    })
  );

  const results = await Promise.all(jobs);
  assert.equal(maxRunning <= 2, true);
  assert.equal(results.length, 8);
});

test("jobQueue timeout corta jobs colgados", async () => {
  const queue = createJobQueue("timeout-test", { concurrency: 1, timeoutMs: 5000 });

  await assert.rejects(
    () => queue.add(async () => {
      await sleep(100);
    }, { timeoutMs: 30 }),
    /timeout/i
  );
});
