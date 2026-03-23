const test = require("node:test");
const assert = require("node:assert/strict");

const {
  shouldSendAutoCloseWarning,
  shouldAutoCloseTicket,
  shouldSendSlaAlert,
  shouldSendSmartPing,
  shouldEscalateSla,
} = require("../src/utils/ticketLifecycleAlerts");

const NOW = new Date("2026-03-09T12:00:00.000Z").getTime();

function minutesAgo(minutes) {
  return new Date(NOW - minutes * 60000).toISOString();
}

test("auto-close warning se envia solo en la ventana correcta y una sola vez", () => {
  const ticket = {
    last_activity: minutesAgo(95),
    auto_close_warned_at: null,
  };

  assert.equal(shouldSendAutoCloseWarning(ticket, 120, NOW), true);
  assert.equal(shouldSendAutoCloseWarning({ ...ticket, auto_close_warned_at: minutesAgo(10) }, 120, NOW), false);
  assert.equal(shouldSendAutoCloseWarning({ ...ticket, last_activity: minutesAgo(121) }, 120, NOW), false);
});

test("auto-close cierra cuando supera el limite", () => {
  const ticket = { last_activity: minutesAgo(120) };
  assert.equal(shouldAutoCloseTicket(ticket, 120, NOW), true);
  assert.equal(shouldAutoCloseTicket({ last_activity: minutesAgo(119) }, 120, NOW), false);
});

test("SLA y smart ping no se repiten y respetan respuesta de staff", () => {
  const baseTicket = {
    created_at: minutesAgo(40),
    first_staff_response: null,
  };

  assert.equal(shouldSendSlaAlert({ ...baseTicket, sla_alerted_at: null }, 30, NOW), true);
  assert.equal(shouldSendSlaAlert({ ...baseTicket, sla_alerted_at: minutesAgo(1) }, 30, NOW), false);
  assert.equal(shouldSendSlaAlert({ ...baseTicket, first_staff_response: minutesAgo(5) }, 30, NOW), false);

  assert.equal(shouldSendSmartPing({ ...baseTicket, smart_ping_sent_at: null }, 30, NOW), true);
  assert.equal(shouldSendSmartPing({ ...baseTicket, smart_ping_sent_at: minutesAgo(1) }, 30, NOW), false);
  assert.equal(shouldSendSmartPing({ ...baseTicket, first_staff_response: minutesAgo(5) }, 30, NOW), false);
});

test("escalado SLA es idempotente y se detiene cuando staff responde", () => {
  const baseTicket = {
    created_at: minutesAgo(90),
    first_staff_response: null,
    sla_escalated_at: null,
  };

  assert.equal(shouldEscalateSla(baseTicket, 60, NOW), true);
  assert.equal(shouldEscalateSla({ ...baseTicket, sla_escalated_at: minutesAgo(1) }, 60, NOW), false);
  assert.equal(shouldEscalateSla({ ...baseTicket, first_staff_response: minutesAgo(5) }, 60, NOW), false);
});
