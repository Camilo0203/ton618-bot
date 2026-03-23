const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const ticketsSetup = require("../src/commands/admin/config/setup/tickets");

const originalSettingsUpdate = db.settings.update;
const originalSettingsGet = db.settings.get;

function createInteraction(optionMap = {}) {
  const calls = { reply: [] };
  return {
    options: {
      getInteger: (name) => (name in optionMap ? optionMap[name] : null),
      getBoolean: (name) => (name in optionMap ? optionMap[name] : null),
      getString: (name) => (name in optionMap ? optionMap[name] : null),
      getRole: (name) => (name in optionMap ? optionMap[name] : null),
      getChannel: (name) => (name in optionMap ? optionMap[name] : null),
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  db.settings.update = async () => true;
  db.settings.get = async () => ({
    auto_assign_enabled: true,
    auto_assign_require_online: true,
    auto_assign_respect_away: true,
    sla_overrides_priority: { high: 45 },
  });
});

test.after(() => {
  db.settings.update = originalSettingsUpdate;
  db.settings.get = originalSettingsGet;
});

test("setup/tickets autoasignacion persiste flags", async () => {
  let updated = null;
  db.settings.update = async (_gid, payload) => {
    updated = payload;
    return true;
  };

  const interaction = createInteraction({
    activo: true,
    solo_online: false,
    respetar_ausentes: true,
  });

  const handled = await ticketsSetup.execute({
    interaction,
    group: "tickets",
    sub: "autoasignacion",
    gid: "g1",
    s: {},
  });

  assert.equal(handled, true);
  assert.deepEqual(updated, {
    auto_assign_enabled: true,
    auto_assign_require_online: false,
    auto_assign_respect_away: true,
  });
  assert.equal(interaction.__calls.reply.length, 1);
});

test("setup/tickets sla-regla actualiza override por prioridad", async () => {
  let updated = null;
  db.settings.update = async (_gid, payload) => {
    updated = payload;
    return true;
  };
  db.settings.get = async () => ({
    sla_overrides_priority: { high: 45 },
  });

  const interaction = createInteraction({
    tipo: "alerta",
    minutos: 45,
    prioridad: "high",
    categoria: null,
  });

  const handled = await ticketsSetup.execute({
    interaction,
    group: "tickets",
    sub: "sla-regla",
    gid: "g1",
    s: { sla_overrides_priority: {} },
  });

  assert.equal(handled, true);
  assert.deepEqual(updated, {
    sla_overrides_priority: { high: 45 },
  });
  assert.equal(interaction.__calls.reply.length, 1);
});
