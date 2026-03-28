const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const staffCommand = require("../src/commands/staff/moderation/staff");
const { replyError } = require("../src/handlers/tickets/shared");
const { notes } = require("../src/utils/database/notes");
const { ticketEvents } = require("../src/utils/database/ticketEvents");
const { ticketCreateLocks } = require("../src/utils/database/ticketCreateLocks");

const originalSettingsGet = db.settings.get;
const originalTicketsGetOpenByStaff = db.tickets.getOpenByStaff;
const originalTicketsGetByUser = db.tickets.getByUser;
const originalNotesCollection = notes.collection;
const originalTicketEventsCollection = ticketEvents.collection;
const originalTicketCreateLocksCollection = ticketCreateLocks.collection;

test.after(() => {
  db.settings.get = originalSettingsGet;
  db.tickets.getOpenByStaff = originalTicketsGetOpenByStaff;
  db.tickets.getByUser = originalTicketsGetByUser;
  notes.collection = originalNotesCollection;
  ticketEvents.collection = originalTicketEventsCollection;
  ticketCreateLocks.collection = originalTicketCreateLocksCollection;
});

test("replyError edits deferred interactions instead of creating orphan followups", async () => {
  const calls = {
    editReply: [],
    followUp: [],
  };

  const interaction = {
    deferred: true,
    replied: false,
    client: {
      user: {
        displayAvatarURL: () => "https://example.com/bot.png",
      },
    },
    editReply: async (payload) => {
      calls.editReply.push(payload);
    },
    followUp: async (payload) => {
      calls.followUp.push(payload);
    },
  };

  await replyError(interaction, "Deferred failure");

  assert.equal(calls.editReply.length, 1);
  assert.equal(calls.followUp.length, 0);
});

test("staff my-tickets uses open ownership data instead of requester-created tickets", async () => {
  const replies = [];

  db.settings.get = async () => ({ support_role: "support-role", admin_role: null });
  db.tickets.getOpenByStaff = async () => ([
    {
      ticket_id: "0001",
      channel_id: "channel-1",
      category: "Billing",
      priority: "high",
      claimed_by: "staff-1",
      assigned_to: null,
    },
    {
      ticket_id: "0002",
      channel_id: "channel-2",
      category: "Technical",
      priority: "low",
      claimed_by: null,
      assigned_to: "staff-1",
    },
  ]);
  db.tickets.getByUser = async () => {
    throw new Error("getByUser should not be used for /staff my-tickets");
  };

  const interaction = {
    options: {
      getSubcommand: () => "my-tickets",
    },
    guild: {
      id: "guild-1",
    },
    user: {
      id: "staff-1",
    },
    member: {
      permissions: {
        has: () => false,
      },
      roles: {
        cache: {
          has: (roleId) => roleId === "support-role",
        },
      },
    },
    reply: async (payload) => {
      replies.push(payload);
    },
  };

  await staffCommand.execute(interaction);

  assert.equal(replies.length, 1);
  const description = replies[0].embeds[0].data.description;
  assert.match(description, /Claimed/);
  assert.match(description, /Assigned/);
  assert.match(description, /#0001/);
  assert.match(description, /#0002/);
});

test("notes queries stay scoped to the guild when provided", async () => {
  const calls = [];

  notes.collection = () => ({
    find(query) {
      calls.push({ type: "find", query });
      return {
        sort(sortSpec) {
          calls.push({ type: "sort", sortSpec });
          return {
            toArray: async () => [],
          };
        },
      };
    },
    deleteMany: async (query) => {
      calls.push({ type: "deleteMany", query });
    },
  });

  await notes.get("0001", "guild-A");
  await notes.clear("0001", "guild-A");

  assert.deepEqual(calls[0].query, { ticket_id: "0001", guild_id: "guild-A" });
  assert.deepEqual(calls[2].query, { ticket_id: "0001", guild_id: "guild-A" });
});

test("ticket event lookups and cleanup stay scoped to the guild when provided", async () => {
  const calls = [];

  ticketEvents.collection = () => ({
    find(query) {
      calls.push({ type: "find", query });
      return {
        sort(sortSpec) {
          calls.push({ type: "sort", sortSpec });
          return {
            limit(limitValue) {
              calls.push({ type: "limit", limitValue });
              return {
                toArray: async () => [],
              };
            },
          };
        },
      };
    },
    deleteMany: async (query) => {
      calls.push({ type: "deleteMany", query });
    },
  });

  await ticketEvents.listByTicket("0007", "guild-B", 25);
  await ticketEvents.clearByTicket("0007", "guild-B");

  assert.deepEqual(calls[0].query, { ticket_id: "0007", guild_id: "guild-B" });
  assert.equal(calls[2].limitValue, 25);
  assert.deepEqual(calls[3].query, { ticket_id: "0007", guild_id: "guild-B" });
});

test("ticket create lock returns false when a concurrent opener already holds the lock", async () => {
  ticketCreateLocks.collection = () => ({
    findOneAndUpdate: async () => {
      const error = new Error("duplicate key");
      error.code = 11000;
      throw error;
    },
  });

  const acquired = await ticketCreateLocks.acquire("guild-1", "user-1");
  assert.equal(acquired, false);
});
