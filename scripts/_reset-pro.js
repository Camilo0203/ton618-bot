"use strict";
require("dotenv").config();
const { MongoClient } = require("mongodb");
const GUILD_ID = "1495872739658043512";

async function main() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB || "ton618");
  const result = await db.collection("settings").updateOne(
    { guild_id: GUILD_ID },
    {
      $set: {
        "commercial_settings.plan": "free",
        "commercial_settings.plan_source": null,
        "commercial_settings.plan_started_at": null,
        "commercial_settings.plan_expires_at": null,
        "commercial_settings.updated_at": new Date(),
        "dashboard_general_settings.opsPlan": "free",
      },
    }
  );
  console.log("matched:", result.matchedCount, "modified:", result.modifiedCount);
  await client.close();
}

main().catch((e) => { console.error(e.message); process.exit(1); });
