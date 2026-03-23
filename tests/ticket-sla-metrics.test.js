const test = require("node:test");
const assert = require("node:assert/strict");

const { buildSlaMetrics } = require("../src/utils/database/ticketSlaMetrics");

function minutesAgo(now, minutes) {
  return new Date(now - minutes * 60000).toISOString();
}

test("buildSlaMetrics calcula breached, promedio y porcentaje", () => {
  const now = new Date("2026-03-10T00:00:00.000Z").getTime();
  const metrics = buildSlaMetrics([
    {
      status: "open",
      created_at: minutesAgo(now, 120),
      first_staff_response: null,
      sla_escalated_at: null,
    },
    {
      status: "open",
      created_at: minutesAgo(now, 130),
      first_staff_response: null,
      sla_escalated_at: minutesAgo(now, 20),
    },
    {
      status: "closed",
      created_at: minutesAgo(now, 90),
      first_staff_response: minutesAgo(now, 70),
    },
    {
      status: "closed",
      created_at: minutesAgo(now, 60),
      first_staff_response: minutesAgo(now, 20),
    },
  ], 60, now);

  assert.equal(metrics.totalTickets, 4);
  assert.equal(metrics.openBreached, 2);
  assert.equal(metrics.escalatedOpen, 1);
  assert.equal(metrics.firstResponseCount, 2);
  assert.equal(metrics.firstResponseWithinSla, 2);
  assert.equal(metrics.avgFirstResponseMinutes, 30);
  assert.equal(metrics.withinSlaPct, 100);
});
