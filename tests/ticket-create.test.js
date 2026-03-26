const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const dashboardHandler = require("../src/handlers/dashboardHandler");
const ticketHandler = require("../src/handlers/ticketHandler");

const originalSettingsGet = db.settings.get;
const originalSettingsIncrementCounter = db.settings.incrementCounter;
const originalSettingsUpdate = db.settings.update;
const originalTicketsCountByUser = db.tickets.countByUser;
const originalTicketsGetOpenReferencesByUser = db.tickets.getOpenReferencesByUser;
const originalTicketsCountOpenByGuild = db.tickets.countOpenByGuild;
const originalTicketsCreate = db.tickets.create;
const originalBlacklistCheck = db.blacklist.check;
const originalCooldownSet = db.cooldowns.set;
const originalUpdateDashboard = dashboardHandler.updateDashboard;
const originalTicketCategoriesGetByGuild = db.ticketCategories.getByGuild;

test.after(() => {
  db.settings.get = originalSettingsGet;
  db.settings.incrementCounter = originalSettingsIncrementCounter;
  db.settings.update = originalSettingsUpdate;
  db.tickets.countByUser = originalTicketsCountByUser;
  db.tickets.getOpenReferencesByUser = originalTicketsGetOpenReferencesByUser;
  db.tickets.countOpenByGuild = originalTicketsCountOpenByGuild;
  db.tickets.create = originalTicketsCreate;
  db.blacklist.check = originalBlacklistCheck;
  db.cooldowns.set = originalCooldownSet;
  dashboardHandler.updateDashboard = originalUpdateDashboard;
  db.ticketCategories.getByGuild = originalTicketCategoriesGetByGuild;
});

test("createTicket limpia el canal si falla la persistencia del ticket", async () => {
  const editReplyCalls = [];
  let deleted = 0;

  db.ticketCategories.getByGuild = async () => [];
  db.settings.get = async () => ({
    min_days: 0,
    global_ticket_limit: 0,
    max_tickets: 3,
    cooldown_minutes: 0,
    maintenance_mode: false,
    maintenance_reason: null,
    verify_role: null,
    support_role: null,
    admin_role: null,
    dm_on_open: false,
    log_channel: null,
    dashboard_channel: null,
  });
  db.settings.incrementCounter = async () => 20;
  db.settings.update = async () => true;
  db.tickets.countByUser = async () => 0;
  db.tickets.getOpenReferencesByUser = async () => [];
  db.tickets.countOpenByGuild = async () => 0;
  db.tickets.getUnratedClosedTickets = async () => [];
  db.tickets.create = async () => {
    const error = new Error("duplicate key error");
    error.code = 11000;
    throw error;
  };
  db.blacklist.check = async () => null;
  db.cooldowns.set = async () => true;
  dashboardHandler.updateDashboard = async () => {};

  const createdChannel = {
    id: "ticket-channel-1",
    send: async () => true,
    delete: async () => {
      deleted += 1;
    },
  };

  const interaction = {
    guild: {
      id: "guild-1",
      name: "Guild 1",
      channels: {
        create: async () => createdChannel,
      },
      members: {
        fetch: async () => ({
          permissions: {
            has: () => true,
          },
        }),
      },
      iconURL: () => null,
    },
    user: {
      id: "user-1",
      tag: "user#0001",
      send: async () => true,
    },
    member: null,
    client: {
      user: {
        id: "bot-1",
        displayAvatarURL: () => "https://example.com/bot.png",
      },
    },
    deferReply: async () => true,
    editReply: async (payload) => {
      editReplyCalls.push(payload);
    },
  };

  await ticketHandler.createTicket(interaction, "partnership", [
    "prueba larga",
    "servidor de prueba",
    "queremos colaborar",
  ]);

  assert.equal(deleted, 1);
  assert.equal(editReplyCalls.length, 1);
});

test("createTicket no crea canal si falla la numeracion del ticket", async () => {
  const editReplyCalls = [];
  let channelCreateCalls = 0;

  db.settings.get = async () => ({
    min_days: 0,
    global_ticket_limit: 0,
    max_tickets: 3,
    cooldown_minutes: 0,
    maintenance_mode: false,
    maintenance_reason: null,
    verify_role: null,
    support_role: null,
    admin_role: null,
    dm_on_open: false,
    log_channel: null,
    dashboard_channel: null,
  });
  db.settings.incrementCounter = async () => {
    throw new Error("write conflict");
  };
  db.settings.update = async () => true;
  db.tickets.countByUser = async () => 0;
  db.tickets.getOpenReferencesByUser = async () => [];
  db.tickets.countOpenByGuild = async () => 0;
  db.tickets.create = async () => true;
  db.blacklist.check = async () => null;
  db.cooldowns.set = async () => true;
  dashboardHandler.updateDashboard = async () => {};

  const interaction = {
    guild: {
      id: "guild-1",
      name: "Guild 1",
      channels: {
        create: async () => {
          channelCreateCalls += 1;
          return { id: "ticket-channel-2" };
        },
      },
      members: {
        fetch: async () => null,
      },
      iconURL: () => null,
    },
    user: {
      id: "user-1",
      tag: "user#0001",
      send: async () => true,
    },
    member: null,
    client: {
      user: {
        id: "bot-1",
        displayAvatarURL: () => "https://example.com/bot.png",
      },
    },
    deferReply: async () => true,
    editReply: async (payload) => {
      editReplyCalls.push(payload);
    },
  };

  await ticketHandler.createTicket(interaction, "partnership", [
    "prueba larga",
    "servidor de prueba",
    "queremos colaborar",
  ]);

  assert.equal(channelCreateCalls, 0);
  assert.equal(editReplyCalls.length, 1);
});
