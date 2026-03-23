const test = require("node:test");
const assert = require("node:assert/strict");

const readyEvent = require("../src/events/ready");

test("buildMinuteOpsTick ejecuta tareas minuto en orden con single-flight", async () => {
  const labels = [];
  const singleFlightKeys = [];
  const executed = [];

  const tick = readyEvent.__test.buildMinuteOpsTick({
    safeRunFn: async (label, fn) => {
      labels.push(label);
      await fn();
    },
    runSingleFlightFn: async (taskName, fn) => {
      singleFlightKeys.push(taskName);
      await fn();
      return true;
    },
    remindersTask: async () => executed.push("reminders"),
    pollsTask: async () => executed.push("polls"),
  });

  await tick();

  assert.deepEqual(labels, [
    "MINUTE REMINDERS",
    "MINUTE POLLS",
  ]);
  assert.deepEqual(singleFlightKeys, [
    "reminders.dispatch",
    "polls.finalize_expired",
  ]);
  assert.deepEqual(executed, ["reminders", "polls"]);
});

test("buildMinuteOpsTick permite continuar si safeRun controla un fallo", async () => {
  const singleFlightKeys = [];
  const executed = [];

  const tick = readyEvent.__test.buildMinuteOpsTick({
    safeRunFn: async (_label, fn) => {
      try {
        await fn();
      } catch {}
    },
    runSingleFlightFn: async (taskName, fn) => {
      singleFlightKeys.push(taskName);
      await fn();
      return true;
    },
    remindersTask: async () => {
      throw new Error("boom");
    },
    pollsTask: async () => executed.push("polls"),
  });

  await tick();

  assert.deepEqual(singleFlightKeys, [
    "reminders.dispatch",
    "polls.finalize_expired",
  ]);
  assert.deepEqual(executed, ["polls"]);
});

