const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const { SETTINGS_SCHEMA_VERSION } = require("../src/utils/settingsSchema");

const originalCollection = db.settings.collection;

test.after(() => {
  db.settings.collection = originalCollection;
});

test("settings.incrementCounter no envia ticket_counter en $setOnInsert", async () => {
  let capturedUpdate = null;

  db.settings.collection = () => ({
    findOneAndUpdate: async (_filter, update) => {
      capturedUpdate = update;
      return { ticket_counter: 20 };
    },
  });

  const nextTicketNumber = await db.settings.incrementCounter("guild-1");

  assert.equal(nextTicketNumber, 20);
  assert.equal(Object.hasOwn(capturedUpdate.$setOnInsert, "ticket_counter"), false);
  assert.equal(Object.hasOwn(capturedUpdate.$setOnInsert, "settings_schema_version"), false);
  assert.equal(capturedUpdate.$inc.ticket_counter, 1);
  assert.equal(capturedUpdate.$set.settings_schema_version, SETTINGS_SCHEMA_VERSION);
});

test("settings.incrementCounter propaga errores de Mongo en vez de devolver 1", async () => {
  db.settings.collection = () => ({
    findOneAndUpdate: async () => {
      throw new Error("write conflict");
    },
  });

  await assert.rejects(
    () => db.settings.incrementCounter("guild-1"),
    /write conflict/
  );
});
