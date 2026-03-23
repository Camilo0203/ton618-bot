const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const ticketsSetup = require("../src/commands/admin/config/setup/tickets");

const originalSettingsUpdate = db.settings.update;
const originalSettingsGet = db.settings.get;

function createInteraction({
  slaMinutes = 30,
  escalationEnabled = null,
  escalationMinutes = null,
  escalationRole = null,
  escalationChannel = null,
} = {}) {
  const calls = { reply: [] };
  return {
    options: {
      getInteger: (name) => {
        if (name === "minutos") return slaMinutes;
        if (name === "escalado_minutos") return escalationMinutes;
        return null;
      },
      getBoolean: (name) => (name === "escalado_activo" ? escalationEnabled : null),
      getRole: (name) => (name === "rol_escalado" ? escalationRole : null),
      getChannel: (name) => (name === "canal_escalado" ? escalationChannel : null),
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
    sla_minutes: 30,
    sla_escalation_enabled: false,
    sla_escalation_minutes: 0,
    sla_escalation_role: null,
    sla_escalation_channel: null,
    log_channel: "123456789012345678",
  });
});

test.after(() => {
  db.settings.update = originalSettingsUpdate;
  db.settings.get = originalSettingsGet;
});

test("setup/tickets sla persiste configuracion de escalado", async () => {
  let updated = null;
  db.settings.update = async (_gid, payload) => {
    updated = payload;
    return true;
  };
  db.settings.get = async () => ({
    sla_minutes: 30,
    sla_escalation_enabled: true,
    sla_escalation_minutes: 90,
    sla_escalation_role: "111111111111111111",
    sla_escalation_channel: "222222222222222222",
    log_channel: "333333333333333333",
  });

  const interaction = createInteraction({
    slaMinutes: 30,
    escalationEnabled: true,
    escalationMinutes: 90,
    escalationRole: { id: "111111111111111111" },
    escalationChannel: { id: "222222222222222222" },
  });

  const handled = await ticketsSetup.execute({
    interaction,
    group: "tickets",
    sub: "sla",
    gid: "g1",
    s: { log_channel: "333333333333333333" },
  });

  assert.equal(handled, true);
  assert.deepEqual(updated, {
    sla_minutes: 30,
    sla_escalation_enabled: true,
    sla_escalation_minutes: 90,
    sla_escalation_role: "111111111111111111",
    sla_escalation_channel: "222222222222222222",
  });
  assert.equal(interaction.__calls.reply.length, 1);
});

test("setup/tickets sla valida escalado sin minutos", async () => {
  let updateCalled = false;
  db.settings.update = async () => {
    updateCalled = true;
    return true;
  };

  const interaction = createInteraction({
    slaMinutes: 20,
    escalationEnabled: true,
    escalationMinutes: 0,
  });

  const handled = await ticketsSetup.execute({
    interaction,
    group: "tickets",
    sub: "sla",
    gid: "g1",
    s: { log_channel: "123456789012345678" },
  });

  assert.equal(handled, true);
  assert.equal(updateCalled, false);
  assert.equal(interaction.__calls.reply.length, 1);
});
