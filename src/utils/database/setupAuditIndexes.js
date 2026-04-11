"use strict";

/**
 * Setup Audit Trail Indexes
 * Creates necessary MongoDB indexes for efficient audit trail querying
 * Run this once during deployment or when setting up the database
 */

const { getDB } = require("./core");

/**
 * Create all audit trail indexes
 */
async function setupAuditIndexes() {
  try {
    const db = getDB();
    const collection = db.collection("audit_trail");

    console.log("[AUDIT SETUP] Creating audit trail indexes...");

    // Primary query patterns
    await collection.createIndex(
      { "created_at": -1 },
      { name: "idx_created_at_desc", background: true }
    );
    console.log("[AUDIT SETUP] ✓ Index: created_at (descending)");

    await collection.createIndex(
      { "action": 1, "created_at": -1 },
      { name: "idx_action_created", background: true }
    );
    console.log("[AUDIT SETUP] ✓ Index: action + created_at");

    await collection.createIndex(
      { "actor.user_id": 1, "created_at": -1 },
      { name: "idx_actor_created", background: true }
    );
    console.log("[AUDIT SETUP] ✓ Index: actor.user_id + created_at");

    await collection.createIndex(
      { "target.guild_id": 1, "created_at": -1 },
      { name: "idx_guild_created", background: true }
    );
    console.log("[AUDIT SETUP] ✓ Index: target.guild_id + created_at");

    // Severity-based queries for alerts
    await collection.createIndex(
      { "severity": 1, "created_at": -1 },
      { name: "idx_severity_created", background: true }
    );
    console.log("[AUDIT SETUP] ✓ Index: severity + created_at");

    // Type-based queries
    await collection.createIndex(
      { "type": 1, "created_at": -1 },
      { name: "idx_type_created", background: true }
    );
    console.log("[AUDIT SETUP] ✓ Index: type + created_at");

    // Compound index for admin action queries
    await collection.createIndex(
      { "action": 1, "actor.user_id": 1, "created_at": -1 },
      { name: "idx_action_actor_created", background: true }
    );
    console.log("[AUDIT SETUP] ✓ Index: action + actor + created_at");

    // High severity alerts optimization (compound index without partial filter)
    await collection.createIndex(
      { "severity": 1, "action": 1, "created_at": -1 },
      { name: "idx_high_severity_alerts", background: true }
    );
    console.log("[AUDIT SETUP] ✓ Index: severity + action + created_at");

    // TTL index for automatic cleanup of old audit logs (90 days)
    // Uncomment if you want automatic deletion of old logs
    // await collection.createIndex(
    //   { "created_at": 1 },
    //   { name: "idx_ttl_cleanup", expireAfterSeconds: 90 * 24 * 60 * 60 }
    // );

    console.log("[AUDIT SETUP] ✓ All audit trail indexes created successfully");
    return true;
  } catch (error) {
    console.error("[AUDIT SETUP] Failed to create indexes:", error.message);
    return false;
  }
}

/**
 * Verify indexes exist
 */
async function verifyAuditIndexes() {
  try {
    const db = getDB();
    const collection = db.collection("audit_trail");
    const indexes = await collection.indexes();

    const requiredIndexes = [
      "idx_created_at_desc",
      "idx_action_created",
      "idx_actor_created",
      "idx_guild_created",
      "idx_severity_created",
      "idx_type_created",
      "idx_action_actor_created",
      "idx_high_severity_alerts",
    ];

    const existingNames = indexes.map((i) => i.name);
    const missing = requiredIndexes.filter((name) => !existingNames.includes(name));

    if (missing.length > 0) {
      console.warn("[AUDIT SETUP] Missing indexes:", missing);
      return false;
    }

    console.log("[AUDIT SETUP] ✓ All required indexes verified");
    return true;
  } catch (error) {
    console.error("[AUDIT SETUP] Failed to verify indexes:", error.message);
    return false;
  }
}

module.exports = {
  setupAuditIndexes,
  verifyAuditIndexes,
};
