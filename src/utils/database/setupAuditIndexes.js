"use strict";

/**
 * Setup Audit Trail Indexes
 * Creates necessary MongoDB indexes for efficient audit trail querying
 * Run this once during deployment or when setting up the database
 */

const { getDB } = require("./core");
const logger = require("../structuredLogger");

/**
 * Create all audit trail indexes
 */
async function setupAuditIndexes() {
  try {
    const db = getDB();
    const collection = db.collection("audit_trail");

    logger.info('setupAuditIndexes', 'Creating audit trail indexes');

    // Primary query patterns
    await collection.createIndex(
      { "created_at": -1 },
      { name: "idx_created_at_desc", background: true }
    );
    logger.debug('setupAuditIndexes', 'Created index: created_at (descending)');

    await collection.createIndex(
      { "action": 1, "created_at": -1 },
      { name: "idx_action_created", background: true }
    );
    logger.debug('setupAuditIndexes', 'Created index: action + created_at');

    await collection.createIndex(
      { "actor.user_id": 1, "created_at": -1 },
      { name: "idx_actor_created", background: true }
    );
    logger.debug('setupAuditIndexes', 'Created index: actor.user_id + created_at');

    await collection.createIndex(
      { "target.guild_id": 1, "created_at": -1 },
      { name: "idx_guild_created", background: true }
    );
    logger.debug('setupAuditIndexes', 'Created index: target.guild_id + created_at');

    // Severity-based queries for alerts
    await collection.createIndex(
      { "severity": 1, "created_at": -1 },
      { name: "idx_severity_created", background: true }
    );
    logger.debug('setupAuditIndexes', 'Created index: severity + created_at');

    // Type-based queries
    await collection.createIndex(
      { "type": 1, "created_at": -1 },
      { name: "idx_type_created", background: true }
    );
    logger.debug('setupAuditIndexes', 'Created index: type + created_at');

    // Compound index for admin action queries
    await collection.createIndex(
      { "action": 1, "actor.user_id": 1, "created_at": -1 },
      { name: "idx_action_actor_created", background: true }
    );
    logger.debug('setupAuditIndexes', 'Created index: action + actor + created_at');

    // High severity alerts optimization (compound index without partial filter)
    await collection.createIndex(
      { "severity": 1, "action": 1, "created_at": -1 },
      { name: "idx_high_severity_alerts", background: true }
    );
    logger.debug('setupAuditIndexes', 'Created index: severity + action + created_at');

    // TTL index for automatic cleanup of old audit logs (90 days)
    // Uncomment if you want automatic deletion of old logs
    // await collection.createIndex(
    //   { "created_at": 1 },
    //   { name: "idx_ttl_cleanup", expireAfterSeconds: 90 * 24 * 60 * 60 }
    // );

    logger.info('setupAuditIndexes', 'All audit trail indexes created successfully');
    return true;
  } catch (error) {
    logger.error('setupAuditIndexes', 'Failed to create indexes', { error: error?.message || String(error) });
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
      logger.warn('setupAuditIndexes', 'Missing indexes', { missing });
      return false;
    }

    logger.info('setupAuditIndexes', 'All required indexes verified');
    return true;
  } catch (error) {
    logger.error('setupAuditIndexes', 'Failed to verify indexes', { error: error?.message || String(error) });
    return false;
  }
}

module.exports = {
  setupAuditIndexes,
  verifyAuditIndexes,
};
