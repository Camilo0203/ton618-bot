const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB || "ton618_bot";

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in environment variables.");
  process.exit(1);
}

const FIELD_MAP = {
  tickets: ["created_at", "closed_at", "last_activity", "first_staff_response", "reopened_at"],
  notes: ["created_at"],
  blacklist: ["added_at"],
  settings: ["created_at"],
  staffStats: ["last_updated"],
  staffRatings: ["created_at"],
  levels: ["last_xp_at"],
  reminders: ["fire_at", "created_at"],
  giveaways: ["created_at", "end_at", "ended_at"],
  polls: ["created_at", "ends_at", "ended_at"],
  verifCodes: ["created_at", "expires_at"],
  verifLogs: ["created_at"],
  warnings: ["created_at"],
  alerts: ["created_at", "last_notified"],
  suggestions: ["created_at", "reviewed_at"],
  counters: ["created_at"],
};

function asDateExpression(fieldName) {
  return {
    $convert: {
      input: `$${fieldName}`,
      to: "date",
      onError: `$${fieldName}`,
      onNull: `$${fieldName}`,
    },
  };
}

async function migrateField(collection, field) {
  const filter = { [field]: { $type: "string" } };
  const before = await collection.countDocuments(filter);
  if (!before) return { before: 0, after: 0, modified: 0 };

  const result = await collection.updateMany(filter, [{ $set: { [field]: asDateExpression(field) } }]);
  const after = await collection.countDocuments(filter);

  return {
    before,
    after,
    modified: result.modifiedCount || 0,
  };
}

async function run() {
  const client = new MongoClient(MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

  await client.connect();
  const db = client.db(DB_NAME);

  let totalBefore = 0;
  let totalAfter = 0;
  let totalModified = 0;

  console.log(`Migrating string dates to Date in DB ${DB_NAME}`);

  for (const [collectionName, fields] of Object.entries(FIELD_MAP)) {
    const collection = db.collection(collectionName);

    for (const field of fields) {
      try {
        const { before, after, modified } = await migrateField(collection, field);
        totalBefore += before;
        totalAfter += after;
        totalModified += modified;

        if (before > 0) {
          console.log(`${collectionName}.${field}: ${before} string(s), modified ${modified}, pending ${after}`);
        }
      } catch (error) {
        console.error(`Error in ${collectionName}.${field}: ${error.message}`);
      }
    }
  }

  console.log("Migration finished.");
  console.log(`Total strings detected: ${totalBefore}`);
  console.log(`Total documents modified: ${totalModified}`);
  console.log(`Total strings pending: ${totalAfter}`);

  await client.close();
  process.exit(0);
}

run().catch((error) => {
  console.error("Fatal migration error:", error.message);
  process.exit(1);
});
