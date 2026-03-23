function createJobQueue(name, options = {}) {
  const concurrency = Math.max(1, Number(options.concurrency || 2));
  const maxQueueSize = Math.max(1, Number(options.maxQueueSize || 1000));
  const defaultTimeoutMs = Math.max(1000, Number(options.timeoutMs || 120000));

  const pending = [];
  let active = 0;

  function withTimeout(promise, timeoutMs) {
    if (!timeoutMs || timeoutMs <= 0) return promise;
    let timeoutId = null;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`Job timeout (${timeoutMs}ms)`)), timeoutMs);
      if (typeof timeoutId.unref === "function") timeoutId.unref();
    });

    return Promise.race([
      promise,
      timeoutPromise,
    ]).finally(() => {
      if (timeoutId) clearTimeout(timeoutId);
    });
  }

  function runNext() {
    while (active < concurrency && pending.length > 0) {
      const job = pending.shift();
      active += 1;

      (async () => {
        try {
          const result = await withTimeout(
            Promise.resolve().then(job.task),
            job.timeoutMs || defaultTimeoutMs
          );
          job.resolve(result);
        } catch (error) {
          job.reject(error);
        } finally {
          active -= 1;
          runNext();
        }
      })();
    }
  }

  async function add(task, meta = {}) {
    if (typeof task !== "function") {
      throw new Error(`[${name}] Job task must be a function.`);
    }

    if (pending.length >= maxQueueSize) {
      throw new Error(`[${name}] Queue overflow (${maxQueueSize}).`);
    }

    return await new Promise((resolve, reject) => {
      pending.push({
        task,
        resolve,
        reject,
        timeoutMs: meta.timeoutMs,
      });
      runNext();
    });
  }

  function stats() {
    return {
      name,
      active,
      pending: pending.length,
      concurrency,
      maxQueueSize,
    };
  }

  return {
    add,
    stats,
  };
}

module.exports = {
  createJobQueue,
};
