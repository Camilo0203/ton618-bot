const test = require("node:test");
const assert = require("node:assert/strict");

const {
  resolveTicketSlaMinutes,
  getSlaSweepFloorMinutes,
} = require("../src/utils/ticketSlaRules");

test("resolveTicketSlaMinutes prioriza categoria sobre prioridad y base", () => {
  const settings = {
    sla_minutes: 120,
    sla_overrides_priority: { high: 60 },
    sla_overrides_category: { billing: 30 },
  };
  const ticket = { priority: "high", category_id: "billing" };
  assert.equal(resolveTicketSlaMinutes(settings, ticket, "alert"), 30);
});

test("resolveTicketSlaMinutes usa reglas de escalado", () => {
  const settings = {
    sla_escalation_minutes: 180,
    sla_escalation_overrides_priority: { urgent: 45 },
    sla_escalation_overrides_category: {},
  };
  const ticket = { priority: "urgent", category_id: "support" };
  assert.equal(resolveTicketSlaMinutes(settings, ticket, "escalation"), 45);
});

test("getSlaSweepFloorMinutes retorna el menor umbral configurado", () => {
  const settings = {
    sla_minutes: 90,
    sla_overrides_priority: { high: 40 },
    sla_overrides_category: { bug: 25 },
  };
  assert.equal(getSlaSweepFloorMinutes(settings, "alert"), 25);
});
