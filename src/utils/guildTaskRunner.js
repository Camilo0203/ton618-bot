const { createJobQueue } = require("./jobQueue");
const { logStructured } = require("./observability");

const runningTasks = new Set();
const queuesByTask = new Map();

function toPositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function resolveQueue(taskName, options = {}) {
  const existing = queuesByTask.get(taskName);
  if (existing) return existing;

  const queue = createJobQueue(`guild-task:${taskName}`, {
    concurrency: toPositiveInt(
      options.concurrency || process.env.GUILD_TASK_CONCURRENCY,
      3
    ),
    maxQueueSize: toPositiveInt(
      options.maxQueueSize || process.env.GUILD_TASK_MAX_QUEUE,
      5000
    ),
    timeoutMs: toPositiveInt(
      options.timeoutMs || process.env.GUILD_TASK_TIMEOUT_MS,
      120000
    ),
  });
  queuesByTask.set(taskName, queue);
  return queue;
}

async function runSingleFlight(taskName, fn) {
  if (runningTasks.has(taskName)) {
    logStructured("warn", "scheduler.task.skip_overlapping", { taskName });
    return false;
  }

  runningTasks.add(taskName);
  try {
    await fn();
    return true;
  } finally {
    runningTasks.delete(taskName);
  }
}

async function runGuildTask(client, taskName, handler, options = {}) {
  const guilds = Array.from(client.guilds.cache.values());
  if (!guilds.length) return { total: 0, failed: 0 };

  const queue = resolveQueue(taskName, options);
  let failed = 0;

  await Promise.all(
    guilds.map((guild) =>
      queue
        .add(() => handler(guild), { timeoutMs: options.timeoutMs })
        .catch((error) => {
          failed += 1;
          logStructured("error", "scheduler.guild_task.error", {
            taskName,
            guildId: guild.id,
            error: error?.message || String(error),
          });
        })
    )
  );

  return {
    total: guilds.length,
    failed,
  };
}

module.exports = {
  runSingleFlight,
  runGuildTask,
};
