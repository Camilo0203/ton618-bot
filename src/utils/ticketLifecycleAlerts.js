function toDateOrNull(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function minutesSince(dateValue, nowMs) {
  const d = toDateOrNull(dateValue);
  if (!d) return null;
  return (nowMs - d.getTime()) / 60000;
}

function shouldSendAutoCloseWarning(ticket, autoCloseTotalMinutes, nowMs = Date.now()) {
  if (!ticket || autoCloseTotalMinutes <= 30) return false;
  if (ticket.auto_close_warned_at) return false;

  const inactiveMinutes = minutesSince(ticket.last_activity, nowMs);
  if (inactiveMinutes === null) return false;

  const warningAt = autoCloseTotalMinutes - 30;
  return inactiveMinutes >= warningAt && inactiveMinutes < autoCloseTotalMinutes;
}

function shouldAutoCloseTicket(ticket, autoCloseTotalMinutes, nowMs = Date.now()) {
  if (!ticket || autoCloseTotalMinutes <= 0) return false;
  const inactiveMinutes = minutesSince(ticket.last_activity, nowMs);
  if (inactiveMinutes === null) return false;
  return inactiveMinutes >= autoCloseTotalMinutes;
}

function shouldSendSlaAlert(ticket, slaTotalMinutes, nowMs = Date.now()) {
  if (!ticket || slaTotalMinutes <= 0) return false;
  if (ticket.sla_alerted_at) return false;
  if (ticket.first_staff_response) return false;

  const waitMinutes = minutesSince(ticket.created_at, nowMs);
  if (waitMinutes === null) return false;
  return waitMinutes >= slaTotalMinutes;
}

function shouldSendSmartPing(ticket, smartPingTotalMinutes, nowMs = Date.now()) {
  if (!ticket || smartPingTotalMinutes <= 0) return false;
  if (ticket.smart_ping_sent_at) return false;
  if (ticket.first_staff_response) return false;

  const waitMinutes = minutesSince(ticket.created_at, nowMs);
  if (waitMinutes === null) return false;
  return waitMinutes >= smartPingTotalMinutes;
}

function shouldEscalateSla(ticket, escalationMinutes, nowMs = Date.now()) {
  if (!ticket || escalationMinutes <= 0) return false;
  if (ticket.sla_escalated_at) return false;
  if (ticket.first_staff_response) return false;

  const waitMinutes = minutesSince(ticket.created_at, nowMs);
  if (waitMinutes === null) return false;
  return waitMinutes >= escalationMinutes;
}

module.exports = {
  shouldSendAutoCloseWarning,
  shouldAutoCloseTicket,
  shouldSendSlaAlert,
  shouldSendSmartPing,
  shouldEscalateSla,
};
