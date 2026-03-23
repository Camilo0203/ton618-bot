function buildSlaMetrics(tickets = [], slaTotalMinutes = 0, nowMs = Date.now(), resolveMinutes = null) {
  let openBreached = 0;
  let escalatedOpen = 0;
  let firstResponseCount = 0;
  let firstResponseEvaluatedCount = 0;
  let firstResponseWithinSla = 0;
  let firstResponseTotalMinutes = 0;

  for (const ticket of tickets) {
    const createdAt = new Date(ticket.created_at);
    if (Number.isNaN(createdAt.getTime())) continue;

    const firstResponseDate = ticket.first_staff_response
      ? new Date(ticket.first_staff_response)
      : null;
    const hasFirstResponse = firstResponseDate && !Number.isNaN(firstResponseDate.getTime());

    const ticketSlaMinutes = typeof resolveMinutes === "function"
      ? Math.max(0, Math.floor(Number(resolveMinutes(ticket)) || 0))
      : slaTotalMinutes;

    if (!hasFirstResponse && ticket.status === "open" && ticketSlaMinutes > 0) {
      const waitMinutes = (nowMs - createdAt.getTime()) / 60000;
      if (waitMinutes >= ticketSlaMinutes) openBreached += 1;
    }

    if (ticket.status === "open" && ticket.sla_escalated_at) {
      escalatedOpen += 1;
    }

    if (!hasFirstResponse) continue;
    const firstResponseMinutes = Math.max(0, (firstResponseDate.getTime() - createdAt.getTime()) / 60000);
    firstResponseCount += 1;
    firstResponseTotalMinutes += firstResponseMinutes;
    if (ticketSlaMinutes > 0) {
      firstResponseEvaluatedCount += 1;
      if (firstResponseMinutes <= ticketSlaMinutes) {
        firstResponseWithinSla += 1;
      }
    }
  }

  return {
    totalTickets: tickets.length,
    openBreached,
    escalatedOpen,
    firstResponseCount,
    firstResponseWithinSla,
    avgFirstResponseMinutes: firstResponseCount > 0
      ? Math.round(firstResponseTotalMinutes / firstResponseCount)
      : null,
    withinSlaPct: firstResponseEvaluatedCount > 0
      ? Math.round((firstResponseWithinSla / firstResponseEvaluatedCount) * 100)
      : null,
  };
}

module.exports = {
  buildSlaMetrics,
};
