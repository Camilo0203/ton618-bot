const test = require("node:test");
const assert = require("node:assert/strict");

function freshDistributedLocks() {
  delete require.cache[require.resolve("../src/utils/distributedLocks")];
  delete require.cache[require.resolve("../src/utils/database/core")];
  const databaseCore = require("../src/utils/database/core");
  const distributedLocks = require("../src/utils/distributedLocks");
  return { databaseCore, distributedLocks };
}

test("distributedLocks adquiere un lock y expone stats", async () => {
  const { databaseCore, distributedLocks } = freshDistributedLocks();
  const mockCollection = {
    insertOne: async () => ({ insertedId: "lock-1" }),
  };

  databaseCore.getDb = () => ({
    collection: () => mockCollection,
  });

  const result = await distributedLocks.acquireLock("ticket:create:g:u");
  assert.equal(result.acquired, true);
  assert.equal(result.name, "ticket:create:g:u");

  const stats = distributedLocks.getStats();
  assert.equal(stats.localLocks >= 1, true);
  assert.equal(typeof stats.instanceId, "string");
});

test("distributedLocks detecta lock ocupado sin sobreescribirlo", async () => {
  const { databaseCore, distributedLocks } = freshDistributedLocks();
  const futureDate = new Date(Date.now() + 60_000);
  const mockCollection = {
    insertOne: async () => {
      const error = new Error("duplicate key");
      error.code = 11000;
      throw error;
    },
    findOne: async () => ({
      lock_name: "ticket:create:g:u",
      instance_id: "instance-other",
      expires_at: futureDate,
    }),
  };

  databaseCore.getDb = () => ({
    collection: () => mockCollection,
  });

  const result = await distributedLocks.acquireLock("ticket:create:g:u");
  assert.equal(result.acquired, false);
  assert.equal(result.heldBy, "instance-other");
  assert.equal(result.expiresAt, futureDate);
});

test("distributedLocks toma locks expirados y los libera", async () => {
  const { databaseCore, distributedLocks } = freshDistributedLocks();
  const expiredAt = new Date(Date.now() - 1_000);
  let deleteFilter = null;
  const mockCollection = {
    insertOne: async () => {
      const error = new Error("duplicate key");
      error.code = 11000;
      throw error;
    },
    findOne: async () => ({
      lock_name: "ticket:create:g:u",
      instance_id: "instance-old",
      expires_at: expiredAt,
      version: 1,
    }),
    findOneAndUpdate: async () => ({ value: { ok: true } }),
    deleteOne: async (filter) => {
      deleteFilter = filter;
      return { deletedCount: 1 };
    },
  };

  databaseCore.getDb = () => ({
    collection: () => mockCollection,
  });

  const result = await distributedLocks.acquireLock("ticket:create:g:u");
  assert.equal(result.acquired, true);
  assert.equal(result.wasExpired, true);

  const released = await distributedLocks.releaseLock("ticket:create:g:u");
  assert.equal(released, true);
  assert.equal(deleteFilter.lock_name, "ticket:create:g:u");
});

test("distributedLocks falla de forma clara si no hay DB", async () => {
  const { databaseCore, distributedLocks } = freshDistributedLocks();
  databaseCore.getDb = () => null;
  databaseCore.getDB = () => {
    throw new Error("Base de datos no conectada");
  };

  await assert.rejects(
    distributedLocks.acquireLock("ticket:create:g:u"),
    /Database not connected/
  );

  assert.equal(await distributedLocks.releaseLock("ticket:create:g:u"), false);
  assert.equal(await distributedLocks.cleanupExpiredLocks(), 0);
});

test("distributedLocks exporta configuracion valida", () => {
  const { distributedLocks } = freshDistributedLocks();
  assert.equal(distributedLocks.CONFIG.defaultLockTimeoutMs > 0, true);
  assert.equal(distributedLocks.CONFIG.heartbeatIntervalMs > 0, true);
  assert.equal(distributedLocks.CONFIG.maxLockDurationMs > 0, true);
});
