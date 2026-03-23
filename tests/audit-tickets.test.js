const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const auditCommand = require("../src/commands/admin/config/audit");

const originalListForAudit = db.tickets.listForAudit;

function createInteraction() {
  const calls = { deferReply: [], editReply: [], reply: [] };
  return {
    guild: { id: "g1" },
    options: {
      getSubcommand: () => "tickets",
      getString: (name) => {
        if (name === "estado") return "open";
        if (name === "prioridad") return "high";
        if (name === "categoria") return "bug";
        if (name === "desde") return "2026-03-01";
        if (name === "hasta") return "2026-03-10";
        return null;
      },
      getInteger: (name) => (name === "limite" ? 100 : null),
    },
    deferReply: async (payload) => {
      calls.deferReply.push(payload);
    },
    editReply: async (payload) => {
      calls.editReply.push(payload);
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  db.tickets.listForAudit = async () => ([{
    ticket_id: "0001",
    channel_id: "c1",
    user_id: "u1",
    status: "open",
    category_id: "bug",
    category: "Bug",
    priority: "high",
    created_at: new Date("2026-03-10T00:00:00.000Z"),
  }]);
});

test.after(() => {
  db.tickets.listForAudit = originalListForAudit;
});

test("/audit tickets adjunta CSV cuando hay resultados", async () => {
  const interaction = createInteraction();
  await auditCommand.execute(interaction);

  assert.equal(interaction.__calls.deferReply.length, 1);
  assert.equal(interaction.__calls.editReply.length, 1);
  const payload = interaction.__calls.editReply[0];
  assert.equal(Array.isArray(payload.files), true);
  assert.equal(payload.files.length, 1);
});
