const test = require("node:test");
const assert = require("node:assert/strict");

function freshShutdownManager() {
  delete require.cache[require.resolve("../src/utils/shutdownManager")];
  return require("../src/utils/shutdownManager");
}

test("shutdownManager registra y completa operaciones", () => {
  const shutdownManager = freshShutdownManager();
  const operationId = shutdownManager.registerOperation("ticket_create", { guildId: "g1" });

  assert.equal(typeof operationId, "string");
  assert.equal(shutdownManager.getActiveOperations().total, 1);

  shutdownManager.completeOperation(operationId);
  assert.equal(shutdownManager.getActiveOperations().total, 0);
});

test("shutdownManager bloquea nuevas operaciones durante el shutdown", async () => {
  const shutdownManager = freshShutdownManager();
  const shutdownPromise = shutdownManager.initiateShutdown({ reason: "test" });

  assert.equal(shutdownManager.isShuttingDown(), true);
  assert.throws(() => shutdownManager.registerOperation("ticket_create", {}), /Cannot register new operations/);

  const result = await shutdownPromise;
  assert.equal(result.state, shutdownManager.SHUTDOWN_STATE.COMPLETE);
});

test("shutdownManager limpia tracking aunque la operacion falle", async () => {
  const shutdownManager = freshShutdownManager();

  await assert.rejects(
    shutdownManager.withShutdownTracking("failing_op", { id: 1 }, async () => {
      throw new Error("boom");
    }),
    /boom/
  );

  assert.equal(shutdownManager.getActiveOperations().total, 0);
});

test("shutdownManager middleware delega en idle y rechaza en shutdown", async () => {
  let handlerCalls = 0;
  let replyCalls = 0;

  {
    const shutdownManager = freshShutdownManager();
    const middleware = shutdownManager.shutdownMiddleware(async () => {
      handlerCalls += 1;
    });
    await middleware({
      reply: async () => {
        replyCalls += 1;
      },
    });
    assert.equal(handlerCalls, 1);
    assert.equal(replyCalls, 0);
  }

  {
    const shutdownManager = freshShutdownManager();
    const shutdownPromise = shutdownManager.initiateShutdown({ reason: "test" });
    const middleware = shutdownManager.shutdownMiddleware(async () => {
      handlerCalls += 1;
    });
    await middleware({
      reply: async () => {
        replyCalls += 1;
      },
    });
    await shutdownPromise;
  }

  assert.equal(replyCalls >= 1, true);
});

test("shutdownManager expone estado y constantes validas", () => {
  const shutdownManager = freshShutdownManager();
  const state = shutdownManager.getShutdownState();

  assert.equal(state.state, shutdownManager.SHUTDOWN_STATE.IDLE);
  assert.equal(typeof shutdownManager.CONFIG.drainTimeoutMs, "number");
  assert.equal(shutdownManager.SHUTDOWN_STATE.COMPLETE, "complete");
});
