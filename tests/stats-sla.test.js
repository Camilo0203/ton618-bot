const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const statsCommand = require("../src/commands/admin/config/stats");

const originalTicketsGetSlaMetrics = db.tickets.getSlaMetrics;
const originalSettingsGet = db.settings.get;

function createInteraction() {
  const calls = { reply: [] };
  return {
    guild: { id: "g1", name: "Guild 1" },
    options: {
      getSubcommand: () => "sla",
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  db.settings.get = async () => ({
    sla_minutes: 60,
    sla_escalation_enabled: true,
    sla_escalation_minutes: 120,
    dashboard_general_settings: { opsPlan: "pro" },
    commercial_settings: { plan: "pro" },
  });
  db.tickets.getSlaMetrics = async () => ({
    totalTickets: 10,
    openBreached: 2,
    escalatedOpen: 1,
    firstResponseCount: 6,
    firstResponseWithinSla: 4,
    avgFirstResponseMinutes: 48,
    withinSlaPct: 67,
  });
});

test.after(() => {
  db.tickets.getSlaMetrics = originalTicketsGetSlaMetrics;
  db.settings.get = originalSettingsGet;
});

test("stats sla responde embed con metricas", async () => {
  const interaction = createInteraction();
  await statsCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const payload = interaction.__calls.reply[0];
  assert.equal(Array.isArray(payload.embeds), true);
  assert.equal(payload.embeds.length, 1);
  const embed = payload.embeds[0];
  assert.equal(embed.data.title.includes("SLA"), true);
});
