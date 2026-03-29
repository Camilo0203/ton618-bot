const test = require("node:test");
const assert = require("node:assert/strict");

const runtime = require("../src/utils/dashboardBridge/runtime");
const metrics = require("../src/utils/dashboardBridge/metrics");

const originalListWorkspaceByGuild = runtime.tickets.listWorkspaceByGuild;
const originalResolveTicketSlaSnapshot = metrics.resolveTicketSlaSnapshot;

test.after(() => {
  runtime.tickets.listWorkspaceByGuild = originalListWorkspaceByGuild;
  metrics.resolveTicketSlaSnapshot = originalResolveTicketSlaSnapshot;
  delete require.cache[require.resolve("../src/utils/dashboardBridge/tickets")];
});

test("buildTicketInboxRows normaliza contadores y tags para el sync del dashboard", async () => {
  runtime.tickets.listWorkspaceByGuild = async () => ([
    {
      ticket_id: "1042",
      channel_id: "ticket-chan-1",
      user_id: "user-1",
      user_tag: "Camilo QA",
      queue_type: "support",
      category_id: "billing",
      category: "Billing",
      subject: "Need help",
      status: "open",
      created_at: "2026-03-28T10:00:00.000Z",
      updated_at: "2026-03-28T10:05:00.000Z",
      last_activity: "2026-03-28T10:06:00.000Z",
      message_count: "7",
      staff_message_count: "2",
      reopen_count: "1",
      tags: ["vip", "vip", "billing"],
    },
  ]);
  metrics.resolveTicketSlaSnapshot = () => ({
    slaTargetMinutes: 30,
    slaDueAt: null,
    slaState: "warning",
  });

  delete require.cache[require.resolve("../src/utils/dashboardBridge/tickets")];
  const { buildTicketInboxRows } = require("../src/utils/dashboardBridge/tickets");

  const rows = await buildTicketInboxRows({ id: "guild-1" }, { settingsRecord: {} });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].message_count, 7);
  assert.equal(rows[0].staff_message_count, 2);
  assert.equal(rows[0].reopen_count, 1);
  assert.deepEqual(rows[0].tags, ["vip", "billing"]);
});
