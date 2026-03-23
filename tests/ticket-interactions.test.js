const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const TH = require("../src/handlers/ticketHandler");
const commandUtils = require("../src/utils/commandUtils");
const moveSelectHandler = require("../src/interactions/selects/ticketMoveSelect");
const ratingHandler = require("../src/interactions/selects/ticketRating");

const originalTicketsGet = db.tickets.get;
const originalTicketsUpdate = db.tickets.update;
const originalSettingsGet = db.settings.get;
const originalStaffRatingsAdd = db.staffRatings.add;
const originalCheckStaff = commandUtils.checkStaff;
const originalMoveTicket = TH.moveTicket;

test.after(() => {
  db.tickets.get = originalTicketsGet;
  db.tickets.update = originalTicketsUpdate;
  db.settings.get = originalSettingsGet;
  db.staffRatings.add = originalStaffRatingsAdd;
  commandUtils.checkStaff = originalCheckStaff;
  TH.moveTicket = originalMoveTicket;
});

test("ticket move select delega al handler cuando el staff elige una categoria", async () => {
  const calls = { reply: [] };
  db.tickets.get = async () => ({ channel_id: "c1", user_id: "u1" });
  db.settings.get = async () => ({ support_role: "r1" });
  commandUtils.checkStaff = () => true;

  let movedTo = null;
  TH.moveTicket = async (_interaction, categoryId) => {
    movedTo = categoryId;
  };

  const interaction = {
    channel: { id: "c1" },
    guild: { id: "g1" },
    member: { id: "staff1" },
    values: ["billing"],
    reply: async (payload) => { calls.reply.push(payload); },
  };

  await moveSelectHandler.execute(interaction);

  assert.equal(movedTo, "billing");
  assert.equal(calls.reply.length, 0);
});

test("ticket move select bloquea a usuarios sin permisos", async () => {
  const calls = { reply: [] };
  db.tickets.get = async () => ({ channel_id: "c1", user_id: "u1" });
  db.settings.get = async () => ({ support_role: "r1" });
  commandUtils.checkStaff = () => false;
  TH.moveTicket = async () => {
    throw new Error("no deberia ejecutarse");
  };

  const interaction = {
    channel: { id: "c1" },
    guild: { id: "g1" },
    member: { id: "u2" },
    values: ["billing"],
    reply: async (payload) => { calls.reply.push(payload); },
  };

  await moveSelectHandler.execute(interaction);

  assert.equal(calls.reply.length, 1);
  assert.equal(calls.reply[0].embeds[0].data.description.includes("Solo el staff"), true);
});

test("ticket rating registra la calificacion y limpia el menu", async () => {
  const calls = {
    deferReply: [],
    editReply: [],
    messageEdit: [],
  };

  db.tickets.get = async () => ({
    ticket_id: "0001",
    guild_id: "g1",
    user_id: "u1",
    rating: null,
  });

  let updated = null;
  db.tickets.update = async (_channelId, payload) => {
    updated = payload;
  };

  const rankingCalls = [];
  db.staffRatings.add = async (...args) => {
    rankingCalls.push(args);
  };

  const interaction = {
    customId: "ticket_rating_0001_c1_staff1",
    values: ["4"],
    user: { id: "u1" },
    deferReply: async (payload) => { calls.deferReply.push(payload); },
    editReply: async (payload) => { calls.editReply.push(payload); },
    message: {
      edit: async (payload) => { calls.messageEdit.push(payload); },
    },
  };

  await ratingHandler.execute(interaction);

  assert.equal(calls.deferReply.length, 1);
  assert.deepEqual(updated, { rating: 4 });
  assert.equal(rankingCalls.length, 1);
  assert.deepEqual(calls.messageEdit[0], { components: [] });
  assert.equal(calls.editReply[0].embeds[0].data.title, "Gracias por tu calificacion");
});

test("ticket rating evita registrar dos veces la misma encuesta", async () => {
  const calls = {
    deferReply: [],
    editReply: [],
    messageEdit: [],
  };

  db.tickets.get = async () => ({
    ticket_id: "0001",
    guild_id: "g1",
    user_id: "u1",
    rating: 5,
  });

  let updateCalled = false;
  let rankingCalled = false;
  db.tickets.update = async () => {
    updateCalled = true;
  };
  db.staffRatings.add = async () => {
    rankingCalled = true;
  };

  const interaction = {
    customId: "ticket_rating_0001_c1_staff1",
    values: ["4"],
    user: { id: "u1" },
    deferReply: async (payload) => { calls.deferReply.push(payload); },
    editReply: async (payload) => { calls.editReply.push(payload); },
    message: {
      edit: async (payload) => { calls.messageEdit.push(payload); },
    },
  };

  await ratingHandler.execute(interaction);

  assert.equal(updateCalled, false);
  assert.equal(rankingCalled, false);
  assert.equal(calls.messageEdit.length, 1);
  assert.equal(calls.editReply[0].embeds[0].data.title, "Calificacion ya registrada");
});
