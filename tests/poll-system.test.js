const test = require("node:test");
const assert = require("node:assert/strict");

const db = require("../src/utils/database");
const pollCommand = require("../src/commands/public/utility/poll");
const pollVoteButton = require("../src/interactions/buttons/pollVote");
const { buildPollEmbed, buildPollButtons } = require("../src/handlers/pollHandler");

const originalPolls = {
  create: db.polls.create,
  getByGuild: db.polls.getByGuild,
  end: db.polls.end,
  vote: db.polls.vote,
};

test.afterEach(() => {
  db.polls.create = originalPolls.create;
  db.polls.getByGuild = originalPolls.getByGuild;
  db.polls.end = originalPolls.end;
  db.polls.vote = originalPolls.vote;
});

function makePoll(overrides = {}) {
  return {
    id: "507f1f77bcf86cd799439011",
    guild_id: "g1",
    channel_id: "c1",
    message_id: "m1",
    creator_id: "u1",
    question: "Pregunta de prueba",
    options: [
      { id: 0, text: "Opcion A", votes: [] },
      { id: 1, text: "Opcion B", votes: [] },
    ],
    allow_multiple: false,
    ended: false,
    ends_at: new Date(Date.now() + 3600000).toISOString(),
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

test("buildPoll helpers usan _id como fallback cuando no existe id", () => {
  const poll = makePoll({
    id: undefined,
    _id: { toString: () => "507f1f77bcf86cd799439099" },
  });

  const embed = buildPollEmbed(poll);
  const buttons = buildPollButtons(poll);

  assert.match(embed.data.footer.text, /439099$/);
  assert.equal(buttons[0].components[0].data.custom_id, "poll_vote_507f1f77bcf86cd799439099_0");
});

test("/poll crear espera la persistencia y usa el id real de la encuesta", async () => {
  let createCalled = false;
  const placeholderEdits = [];
  const replies = [];
  const poll = makePoll();

  db.polls.create = async (...args) => {
    createCalled = true;
    assert.equal(args[0], "g1");
    assert.equal(args[1], "c1");
    return poll;
  };

  const targetChannel = {
    id: "c1",
    send: async () => ({
      id: "m1",
      edit: async (payload) => placeholderEdits.push(payload),
    }),
    toString: () => "<#c1>",
  };

  const interaction = {
    guild: { id: "g1" },
    channel: targetChannel,
    user: { id: "u1" },
    options: {
      getSubcommand: () => "crear",
      getString: (name) => {
        if (name === "pregunta") return "Pregunta de prueba";
        if (name === "opciones") return "Opcion A | Opcion B";
        if (name === "duracion") return "1h";
        return null;
      },
      getBoolean: () => false,
      getChannel: () => null,
    },
    reply: async (payload) => replies.push(payload),
  };

  await pollCommand.execute(interaction);

  assert.equal(createCalled, true);
  assert.equal(placeholderEdits.length, 1);
  assert.equal(placeholderEdits[0].components[0].components[0].data.custom_id, `poll_vote_${poll.id}_0`);
  assert.equal(replies.length, 1);
  const idField = replies[0].embeds[0].data.fields.find((field) => field.name === "ID");
  assert.equal(idField.value, "`439011`");
});

test("/poll lista espera getByGuild y renderiza encuestas activas", async () => {
  const edits = [];
  db.polls.getByGuild = async () => [makePoll()];

  const interaction = {
    guild: {
      id: "g1",
      channels: { cache: new Map([["c1", { id: "c1" }]]) },
    },
    options: { getSubcommand: () => "lista" },
    deferReply: async () => {},
    editReply: async (payload) => edits.push(payload),
  };
  interaction.guild.channels.cache.get = (id) => (id === "c1" ? { id, toString: () => `<#${id}>` } : null);

  await pollCommand.execute(interaction);

  assert.equal(edits.length, 1);
  assert.match(edits[0].embeds[0].data.description, /439011/);
});

test("/poll finalizar espera end y actualiza el mensaje final", async () => {
  const poll = makePoll();
  const messageEdits = [];
  const replies = [];
  let endedId = null;

  db.polls.getByGuild = async () => [poll];
  db.polls.end = async (id) => {
    endedId = id;
    return true;
  };

  const interaction = {
    guild: {
      id: "g1",
      channels: {
        cache: {
          get: () => ({
            messages: {
              fetch: async () => ({
                edit: async (payload) => messageEdits.push(payload),
              }),
            },
          }),
        },
      },
    },
    member: { permissions: { has: () => true } },
    options: {
      getSubcommand: () => "finalizar",
      getString: () => "439011",
    },
    reply: async (payload) => replies.push(payload),
  };

  await pollCommand.execute(interaction);

  assert.equal(endedId, poll.id);
  assert.equal(messageEdits.length, 1);
  assert.deepEqual(messageEdits[0].components, []);
  assert.equal(replies.length, 1);
});

test("pollVote actualiza la encuesta y confirma el voto al usuario", async () => {
  const updates = [];
  const followUps = [];
  let voteCall = null;

  db.polls.vote = async (id, userId, optionIds, options) => {
    voteCall = { id, userId, optionIds, options };
    return makePoll({
      options: [
        { id: 0, text: "Opcion A", votes: [userId] },
        { id: 1, text: "Opcion B", votes: [] },
      ],
    });
  };

  const interaction = {
    customId: "poll_vote_507f1f77bcf86cd799439011_0",
    user: { id: "u1" },
    update: async (payload) => updates.push(payload),
    followUp: async (payload) => followUps.push(payload),
  };

  await pollVoteButton.execute(interaction);

  assert.deepEqual(voteCall, {
    id: "507f1f77bcf86cd799439011",
    userId: "u1",
    optionIds: [0],
    options: { toggle: true },
  });
  assert.equal(updates.length, 1);
  assert.equal(updates[0].components[0].components[0].data.custom_id, "poll_vote_507f1f77bcf86cd799439011_0");
  assert.equal(followUps.length, 1);
  assert.match(followUps[0].embeds[0].data.description, /Opcion A/);
});
