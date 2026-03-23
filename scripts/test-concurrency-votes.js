const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { connectDB, getDB, polls, suggestions } = require("../src/utils/database");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function runPollsTest() {
  const guildId = `test_guild_${Date.now()}`;
  const channelId = `test_channel_${Date.now()}`;
  const messageId = `test_message_poll_${Date.now()}`;
  const creatorId = "test_creator";

  const poll = await polls.create(
    guildId,
    channelId,
    messageId,
    creatorId,
    "Test de concurrencia",
    ["A", "B", "C"],
    new Date(Date.now() + 60 * 60 * 1000),
    false
  );

  const users = Array.from({ length: 80 }, (_, index) => `user_${index + 1}`);
  const operations = [];

  for (const userId of users) {
    const votesForUser = randomInt(4, 8);
    for (let index = 0; index < votesForUser; index += 1) {
      const optionId = randomInt(0, 2);
      operations.push(polls.vote(poll._id.toString(), userId, [optionId]));
    }
  }

  await Promise.all(operations);
  const updated = await polls.collection().findOne({ _id: poll._id });
  assert(updated, "No se pudo recuperar la encuesta de prueba.");

  const appearancesByUser = new Map();
  for (const option of updated.options) {
    for (const userId of option.votes) {
      appearancesByUser.set(userId, (appearancesByUser.get(userId) || 0) + 1);
    }
  }

  for (const userId of users) {
    const count = appearancesByUser.get(userId) || 0;
    assert(count <= 1, `Inconsistencia en polls.vote: ${userId} aparece ${count} veces.`);
  }

  await polls.collection().deleteOne({ _id: poll._id });
  return {
    users: users.length,
    operations: operations.length,
  };
}

async function runSuggestionsTest() {
  const guildId = `test_guild_${Date.now()}`;
  const messageId = `test_message_suggestion_${Date.now()}`;
  const channelId = `test_channel_${Date.now()}`;
  const authorId = "author_1";

  const suggestion = await suggestions.create(
    guildId,
    authorId,
    "Sugerencia de prueba concurrencia",
    messageId,
    channelId
  );

  const users = Array.from({ length: 100 }, (_, index) => `s_user_${index + 1}`);
  const operations = [];

  for (const userId of users) {
    const votesForUser = randomInt(6, 12);
    for (let index = 0; index < votesForUser; index += 1) {
      const type = Math.random() > 0.5 ? "up" : "down";
      operations.push(suggestions.vote(suggestion._id.toString(), userId, type));
    }
  }

  await Promise.all(operations);
  const updated = await suggestions.collection().findOne({ _id: suggestion._id });
  assert(updated, "No se pudo recuperar la sugerencia de prueba.");

  const upSet = new Set(updated.upvotes || []);
  const downSet = new Set(updated.downvotes || []);

  assert(upSet.size === (updated.upvotes || []).length, "Hay duplicados en upvotes.");
  assert(downSet.size === (updated.downvotes || []).length, "Hay duplicados en downvotes.");

  for (const userId of upSet) {
    assert(!downSet.has(userId), `Inconsistencia en suggestions.vote: ${userId} quedo en ambos lados.`);
  }

  await suggestions.collection().deleteOne({ _id: suggestion._id });
  return {
    users: users.length,
    operations: operations.length,
  };
}

async function main() {
  await connectDB();

  const db = getDB();
  if (!db) throw new Error("No se pudo conectar a MongoDB.");

  console.log("Iniciando test de concurrencia de votos...");

  const pollsResult = await runPollsTest();
  console.log(`Polls OK: ${pollsResult.operations} operaciones con ${pollsResult.users} usuarios.`);

  const suggestionsResult = await runSuggestionsTest();
  console.log(`Suggestions OK: ${suggestionsResult.operations} operaciones con ${suggestionsResult.users} usuarios.`);

  console.log("Test de concurrencia completado sin inconsistencias.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fallo el test de concurrencia:", error.message);
    process.exit(1);
  });
