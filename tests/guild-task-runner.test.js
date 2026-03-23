const test = require("node:test");
const assert = require("node:assert/strict");

const { runSingleFlight, runGuildTask } = require("../src/utils/guildTaskRunner");

function makeClient(guildIds) {
  return {
    guilds: {
      cache: new Map(guildIds.map((id) => [id, { id }])),
    },
  };
}

test("runSingleFlight evita ejecucion solapada del mismo task", async () => {
  let executions = 0;
  const task = async () => {
    executions += 1;
    await new Promise((resolve) => setTimeout(resolve, 30));
  };

  const [a, b] = await Promise.all([
    runSingleFlight("task-a", task),
    runSingleFlight("task-a", task),
  ]);

  assert.equal(a || b, true);
  assert.equal(executions, 1);
});

test("runGuildTask recorre guilds y acumula fallos", async () => {
  const client = makeClient(["g1", "g2", "g3"]);
  const seen = [];

  const stats = await runGuildTask(client, "task-b", async (guild) => {
    seen.push(guild.id);
    if (guild.id === "g2") throw new Error("boom");
  }, { concurrency: 2, timeoutMs: 1000 });

  assert.equal(stats.total, 3);
  assert.equal(stats.failed, 1);
  assert.deepEqual(seen.sort(), ["g1", "g2", "g3"]);
});
