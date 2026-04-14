/**
 * Script one-time: activa plan PRO en un servidor de pruebas directamente en MongoDB.
 * Uso: node scripts/activate-pro.js <GUILD_ID> [dias]
 * Ejemplo lifetime: node scripts/activate-pro.js 123456789012345678
 * Ejemplo 365 dias: node scripts/activate-pro.js 123456789012345678 365
 */
"use strict";

require("dotenv").config();
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || "ton618";

async function main() {
  const guildId = process.argv[2];
  const days = process.argv[3] ? parseInt(process.argv[3], 10) : null; // null = lifetime

  if (!guildId) {
    console.error("❌ Debes pasar el GUILD_ID como primer argumento.");
    console.error("   Uso: node scripts/activate-pro.js <GUILD_ID> [dias]");
    process.exit(1);
  }

  if (!MONGO_URI) {
    console.error("❌ MONGO_URI no está definido en .env");
    process.exit(1);
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(MONGO_DB);
  const col = db.collection("settings");

  const now = new Date();
  const planExpiresAt = days ? new Date(now.getTime() + days * 24 * 60 * 60 * 1000) : null;

  const patch = {
    "commercial_settings.plan": "pro",
    "commercial_settings.plan_source": "manual_script",
    "commercial_settings.plan_started_at": now,
    "commercial_settings.plan_expires_at": planExpiresAt,
    "commercial_settings.updated_at": now,
    "dashboard_general_settings.opsPlan": "pro",
  };

  const result = await col.updateOne(
    { guild_id: guildId },
    { $set: patch },
    { upsert: false }
  );

  await client.close();

  if (result.matchedCount === 0) {
    console.error(`❌ No se encontró el servidor ${guildId} en la BD. ¿Ya corriste /setup en ese servidor?`);
    process.exit(1);
  }

  const expMsg = planExpiresAt
    ? `hasta ${planExpiresAt.toISOString().slice(0, 10)}`
    : "LIFETIME (sin expiración)";

  console.log(`✅ Servidor ${guildId} activado como PRO ${expMsg}`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
