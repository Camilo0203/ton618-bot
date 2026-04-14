const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const dashboardHandler = require("../src/handlers/dashboardHandler");
const ticketHandler = require("../src/handlers/ticketHandler");
const categoryResolver = require("../src/utils/categoryResolver");

const originalSettingsGet = db.settings.get;
const originalSettingsIncrementCounter = db.settings.incrementCounter;
const originalSettingsUpdate = db.settings.update;
const originalTicketsCountByUser = db.tickets.countByUser;
const originalTicketsGetOpenReferencesByUser = db.tickets.getOpenReferencesByUser;
const originalTicketsCountOpenByGuild = db.tickets.countOpenByGuild;
const originalTicketsCreate = db.tickets.create;
const originalBlacklistCheck = db.blacklist.check;
const originalCooldownSet = db.cooldowns.set;
const originalTicketCreateLocksAcquire = db.ticketCreateLocks.acquire;
const originalTicketCreateLocksRelease = db.ticketCreateLocks.release;
const originalUpdateDashboard = dashboardHandler.updateDashboard;
const originalTicketCategoriesGetByGuild = db.ticketCategories.getByGuild;
const originalGetCategoriesForGuild = categoryResolver.getCategoriesForGuild;

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
  db.ticketCreateLocks.acquire = originalTicketCreateLocksAcquire;
  db.ticketCreateLocks.release = originalTicketCreateLocksRelease;
  dashboardHandler.updateDashboard = originalUpdateDashboard;
  db.ticketCategories.getByGuild = originalTicketCategoriesGetByGuild;
  categoryResolver.getCategoriesForGuild = originalGetCategoriesForGuild;
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
  db.ticketCreateLocks.acquire = async () => true;
  db.ticketCreateLocks.release = async () => true;
  dashboardHandler.updateDashboard = async () => {};

  const createdChannel = {
    id: "ticket-channel-1",
    send: async () => true,
    delete: async () => {
      deleted += 1;
    },
  };

  const interaction = {
    deferred: false,
    guild: {
      id: "guild-1",
      name: "Guild 1",
      channels: {
        create: async () => createdChannel,
      },
      members: {
        fetchMe: async () => ({
          permissions: {
            has: () => true,
          },
        }),
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
    deferReply: async () => {
      interaction.deferred = true;
      return true;
    },
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
  db.ticketCreateLocks.acquire = async () => true;
  db.ticketCreateLocks.release = async () => true;
  dashboardHandler.updateDashboard = async () => {};

  const interaction = {
    deferred: false,
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
        fetchMe: async () => ({
          permissions: {
            has: () => true,
          },
        }),
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
    deferReply: async () => {
      interaction.deferred = true;
      return true;
    },
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

test("createTicket aplica welcome message y control embed personalizados en Pro", async () => {
  const channelMessages = [];

  // Override getCategoriesForGuild to return the mocked categories
  categoryResolver.getCategoriesForGuild = async (guildId) => {
    console.log("getCategoriesForGuild called with:", guildId);
    const categories = [
      {
        id: "billing",
        labelKey: "ticket.categories.billing.label",
        descriptionKey: "ticket.categories.billing.description",
        label: "Billing",
        description: "Billing help",
        emoji: "💳",
        color: null,
        categoryId: null,
        pingRoles: [],
        welcomeMessage: null,
        questions: ["What happened?"],
        priority: "high",
      },
    ];
    console.log("Returning categories:", JSON.stringify(categories, null, 2));
    return categories;
  };

  db.ticketCategories.getByGuild = async () => ([
    {
      category_id: "billing",
      label: "Billing",
      description: "Billing help",
      emoji: "💳",
      enabled: true,
      priority: "high",
      ping_roles: [],
      questions: ["What happened?"],
      welcome_message: null,
    },
  ]);
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
    ticket_welcome_message: "Hello {user}, your case {ticket} for {category} is now open.",
    ticket_control_panel_title: "Ops Console",
    ticket_control_panel_description: "Manage {ticket} for {category}.",
    ticket_control_panel_footer: "{guild} • Premium Ops",
    ticket_control_panel_color: "#123ABC",
  });
  db.settings.incrementCounter = async () => 7;
  db.settings.update = async () => true;
  db.tickets.countByUser = async () => 0;
  db.tickets.getOpenReferencesByUser = async () => [];
  db.tickets.countOpenByGuild = async () => 0;
  db.tickets.getUnratedClosedTickets = async () => [];
  db.tickets.create = async (payload) => payload;
  db.blacklist.check = async () => null;
  db.cooldowns.set = async () => true;
  db.ticketCreateLocks.acquire = async () => true;
  db.ticketCreateLocks.release = async () => true;
  dashboardHandler.updateDashboard = async () => {};

  const createdChannel = {
    id: "ticket-channel-77",
    send: async (payload) => {
      channelMessages.push(payload);
      return true;
    },
    delete: async () => true,
  };

  const interaction = {
    deferred: false,
    guild: {
      id: "guild-2",
      name: "Guild 2",
      channels: {
        create: async () => createdChannel,
      },
      members: {
        fetchMe: async () => ({
          permissions: {
            has: () => true,
          },
        }),
        me: {
          permissions: {
            has: () => true,
          },
        },
        fetch: async () => ({
          permissions: {
            has: () => true,
          },
        }),
      },
      iconURL: () => null,
    },
    user: {
      id: "user-2",
      tag: "user#0002",
      send: async () => true,
    },
    member: {
      joinedTimestamp: Date.now() - 86400000,
      roles: { cache: { has: () => false } },
    },
    client: {
      user: {
        id: "bot-1",
        displayAvatarURL: () => "https://example.com/bot.png",
      },
    },
    deferReply: async () => {
      interaction.deferred = true;
      return true;
    },
    editReply: async () => true,
  };

  await ticketHandler.createTicket(interaction, "billing", [
    "A billing issue happened yesterday and I need help.",
  ]);

  console.log("Channel messages received:", channelMessages.length);
  if (channelMessages.length > 0) {
    console.log("Message 0:", JSON.stringify(channelMessages[0], null, 2));
  }
  if (channelMessages.length > 1) {
    console.log("Message 1:", JSON.stringify(channelMessages[1], null, 2));
  }

  assert.equal(channelMessages.length >= 2, true);
  // Welcome message should use the category label "Billing" not "General Support"
  assert.equal(channelMessages[0].content.includes("Hello <@user-2>, your case #0007 for Billing is now open."), true);
  assert.equal(channelMessages[0].content.includes("Hello <@user-2>, your case #0007 for Billing is now open."), true);
  assert.equal(channelMessages[1].embeds[0].data.title, "Ops Console");
  assert.equal(channelMessages[1].embeds[0].data.description, "Manage #0007 for Billing.");
  assert.equal(channelMessages[1].embeds[0].data.footer.text, "Guild 2 • Premium Ops");
});
