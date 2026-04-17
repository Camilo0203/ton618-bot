"use strict";

/**
 * Security Alerts System
 * Monitors audit trail for suspicious patterns and sends alerts
 */

const { getDB } = require("./database/core");
const { queryAuditTrail } = require("./auditLogger");
const { sendSecurityAlert } = require("./discordAlerts");
const logger = require("./structuredLogger");

// Alert thresholds
const ALERT_THRESHOLDS = {
  // Pro code brute force
  FAILED_REDEEM_ATTEMPTS: 5,           // per hour
  FAILED_REDEEM_WINDOW_MS: 60 * 60 * 1000, // 1 hour

  // Code generation abuse
  CODES_GENERATED_PER_HOUR: 20,        // max codes per hour
  CODES_GENERATED_WINDOW_MS: 60 * 60 * 1000, // 1 hour

  // Suspicious patterns
  ADMIN_ACTIONS_PER_MINUTE: 10,        // per admin per minute
  ADMIN_ACTIONS_WINDOW_MS: 60 * 1000,  // 1 minute

  // Multiple guild access
  GUILDS_ACCESSED_PER_HOUR: 10,        // per user per hour

  // Error rate
  ERROR_RATE_THRESHOLD: 0.5,           // 50% error rate in 10 minutes
  ERROR_RATE_MIN_COMMANDS: 10,         // minimum commands to trigger
  ERROR_RATE_WINDOW_MS: 10 * 60 * 1000, // 10 minutes
};

// Alert severity levels
const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

/**
 * Security Alert Structure
 */
class SecurityAlert {
  constructor(type, severity, message, details, recommendations = []) {
    this.id = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.severity = severity;
    this.message = message;
    this.details = details;
    this.recommendations = recommendations;
    this.created_at = new Date();
    this.acknowledged = false;
  }
}

/**
 * Alert manager - stores and manages alerts
 */
class AlertManager {
  constructor() {
    this.alerts = [];
    this.maxAlerts = 1000;
    this.alertHistory = new Map(); // Track when alerts were last sent
  }

  /**
   * Add a new alert (with deduplication)
   */
  addAlert(alert, client = null) {
    // Deduplication: don't send same alert type for same user within 5 minutes
    const dedupKey = `${alert.type}_${alert.details?.userId || 'system'}`;
    const lastSent = this.alertHistory.get(dedupKey);
    const now = Date.now();

    if (lastSent && (now - lastSent) < 5 * 60 * 1000) {
      return null; // Duplicate, skip
    }

    this.alertHistory.set(dedupKey, now);
    this.alerts.unshift(alert);

    // Keep only last N alerts
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(0, this.maxAlerts);
    }

    // Log alert
    logger.warn("securityAlerts", `Security alert: ${alert.type}`, { severity: alert.severity, message: alert.message });

    // Send Discord alert for critical and warning alerts
    if (alert.severity === 'critical' || alert.severity === 'warning') {
      // Use stored client or pass null for webhook-only
      const discordClient = this.discordClient || null;
      const { sendSecurityAlert } = require('./discordAlerts');
      sendSecurityAlert(alert, discordClient).catch(error => {
        logger.error("securityAlerts", "Failed to send Discord alert", { error: error?.message || String(error) });
      });
    }

    return alert;
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(limit = 50, severity = null) {
    let filtered = this.alerts;
    if (severity) {
      filtered = this.alerts.filter(a => a.severity === severity);
    }
    return filtered.slice(0, limit);
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledged_at = new Date();
      return true;
    }
    return false;
  }

  /**
   * Clear old alerts
   */
  clearOldAlerts(maxAgeHours = 24) {
    const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(a => a.created_at > cutoff);
  }
}

const alertManager = new AlertManager();

/**
 * Check for Pro code brute force attempts
 */
async function checkProBruteForce() {
  const since = new Date(Date.now() - ALERT_THRESHOLDS.FAILED_REDEEM_WINDOW_MS);

  try {
    const db = getDB();
    const collection = db.collection('audit_trail');

    // Aggregate failed redeem attempts by user
    const attempts = await collection.aggregate([
      {
        $match: {
          action: { $in: ['pro.redeem_failed', 'pro.redeem_error'] },
          created_at: { $gte: since },
        },
      },
      {
        $group: {
          _id: '$actor.user_id',
          count: { $sum: 1 },
          userTag: { $first: '$actor.user_tag' },
          attempts: {
            $push: {
              time: '$created_at',
              reason: '$beforeState.reason',
              guild: '$target.guild_id',
            },
          },
        },
      },
      {
        $match: {
          count: { $gte: ALERT_THRESHOLDS.FAILED_REDEEM_ATTEMPTS },
        },
      },
    ]).toArray();

    for (const user of attempts) {
      const alert = new SecurityAlert(
        'PRO_BRUTE_FORCE',
        ALERT_SEVERITY.CRITICAL,
        `User ${user.userTag} has ${user.count} failed Pro code redeem attempts in the last hour`,
        {
          userId: user._id,
          userTag: user.userTag,
          attemptCount: user.count,
          attempts: user.attempts.slice(0, 10), // Last 10 attempts
          threshold: ALERT_THRESHOLDS.FAILED_REDEEM_ATTEMPTS,
        },
        [
          'Consider temporarily blocking this user from /pro commands',
          'Review if any codes were guessed correctly',
          'Check if user is using automated tools',
        ]
      );
      alertManager.addAlert(alert);
    }

    return attempts.length > 0;
  } catch (error) {
    logger.error("securityAlerts", "Error checking brute force", { error: error?.message || String(error) });
    return false;
  }
}

/**
 * Check for excessive code generation
 */
async function checkCodeGenerationAbuse() {
  const since = new Date(Date.now() - ALERT_THRESHOLDS.CODES_GENERATED_WINDOW_MS);

  try {
    const db = getDB();
    const collection = db.collection('audit_trail');

    const generations = await collection.aggregate([
      {
        $match: {
          action: 'proadmin.generate',
          created_at: { $gte: since },
        },
      },
      {
        $group: {
          _id: '$actor.user_id',
          count: { $sum: '$afterState.codes_generated' },
          userTag: { $first: '$actor.user_tag' },
          generations: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gte: ALERT_THRESHOLDS.CODES_GENERATED_PER_HOUR },
        },
      },
    ]).toArray();

    for (const user of generations) {
      const alert = new SecurityAlert(
        'CODE_GENERATION_ABUSE',
        ALERT_SEVERITY.WARNING,
        `Admin ${user.userTag} generated ${user.count} Pro codes in the last hour (${user.generations} sessions)`,
        {
          userId: user._id,
          userTag: user.userTag,
          codesGenerated: user.count,
          generationSessions: user.generations,
          threshold: ALERT_THRESHOLDS.CODES_GENERATED_PER_HOUR,
        },
        [
          'Verify this is legitimate business activity',
          'Review if codes were properly assigned to customers',
          'Check for unauthorized admin access',
        ]
      );
      alertManager.addAlert(alert);
    }

    return generations.length > 0;
  } catch (error) {
    logger.error("securityAlerts", "Error checking code generation", { error: error?.message || String(error) });
    return false;
  }
}

/**
 * Check for excessive admin actions
 */
async function checkAdminActionAbuse() {
  const since = new Date(Date.now() - ALERT_THRESHOLDS.ADMIN_ACTIONS_WINDOW_MS);

  try {
    const db = getDB();
    const collection = db.collection('audit_trail');

    const actions = await collection.aggregate([
      {
        $match: {
          type: 'admin_action',
          created_at: { $gte: since },
        },
      },
      {
        $group: {
          _id: '$actor.user_id',
          count: { $sum: 1 },
          userTag: { $first: '$actor.user_tag' },
          actions: { $addToSet: '$action' },
        },
      },
      {
        $match: {
          count: { $gte: ALERT_THRESHOLDS.ADMIN_ACTIONS_PER_MINUTE },
        },
      },
    ]).toArray();

    for (const user of actions) {
      const alert = new SecurityAlert(
        'ADMIN_ACTION_ABUSE',
        ALERT_SEVERITY.WARNING,
        `Admin ${user.userTag} performed ${user.count} admin actions in the last minute`,
        {
          userId: user._id,
          userTag: user.userTag,
          actionCount: user.count,
          actions: user.actions,
          threshold: ALERT_THRESHOLDS.ADMIN_ACTIONS_PER_MINUTE,
        },
        [
          'Verify this is not unauthorized automated activity',
          'Check if admin credentials may be compromised',
          'Review the specific actions performed',
        ]
      );
      alertManager.addAlert(alert);
    }

    return actions.length > 0;
  } catch (error) {
    logger.error("securityAlerts", "Error checking admin actions", { error: error?.message || String(error) });
    return false;
  }
}

/**
 * Check for high error rates
 */
async function checkHighErrorRate() {
  const since = new Date(Date.now() - ALERT_THRESHOLDS.ERROR_RATE_WINDOW_MS);

  try {
    const db = getDB();
    const collection = db.collection('audit_trail');

    const stats = await collection.aggregate([
      {
        $match: {
          type: 'command_execution',
          created_at: { $gte: since },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          errors: {
            $sum: { $cond: [{ $eq: ['$details.success', false] }, 1, 0] },
          },
        },
      },
    ]).toArray();

    if (stats.length === 0) return false;

    const { total, errors } = stats[0];
    if (total < ALERT_THRESHOLDS.ERROR_RATE_MIN_COMMANDS) return false;

    const errorRate = errors / total;

    if (errorRate >= ALERT_THRESHOLDS.ERROR_RATE_THRESHOLD) {
      const alert = new SecurityAlert(
        'HIGH_ERROR_RATE',
        ALERT_SEVERITY.WARNING,
        `System experiencing ${(errorRate * 100).toFixed(1)}% error rate in the last 10 minutes`,
        {
          totalCommands: total,
          failedCommands: errors,
          errorRate: errorRate.toFixed(3),
          threshold: ALERT_THRESHOLDS.ERROR_RATE_THRESHOLD,
          timeWindow: '10 minutes',
        },
        [
          'Check database connectivity',
          'Review recent deployments for bugs',
          'Check Discord API status',
          'Review error logs for patterns',
        ]
      );
      alertManager.addAlert(alert);
      return true;
    }

    return false;
  } catch (error) {
    logger.error("securityAlerts", "Error checking error rate", { error: error?.message || String(error) });
    return false;
  }
}

/**
 * Run all security checks
 * @param {object} client - Discord.js client for sending alerts
 */
async function runSecurityChecks(client = null) {
  logger.info("securityAlerts", "Running security checks");

  // Store client in alert manager for Discord notifications
  if (client) {
    alertManager.discordClient = client;
  }

  const results = await Promise.allSettled([
    checkProBruteForce(),
    checkCodeGenerationAbuse(),
    checkAdminActionAbuse(),
    checkHighErrorRate(),
  ]);

  const triggered = results
    .filter(r => r.status === 'fulfilled' && r.value === true)
    .length;

  logger.info("securityAlerts", "Checks complete", { triggered });

  return triggered;
}

/**
 * Get current alerts
 */
function getAlerts(options = {}) {
  const { limit = 50, severity = null, unacknowledged = false } = options;

  let alerts = alertManager.alerts;

  if (severity) {
    alerts = alerts.filter(a => a.severity === severity);
  }

  if (unacknowledged) {
    alerts = alerts.filter(a => !a.acknowledged);
  }

  return alerts.slice(0, limit);
}

/**
 * Acknowledge an alert
 */
function acknowledgeAlert(alertId) {
  return alertManager.acknowledgeAlert(alertId);
}

/**
 * Clear old alerts
 */
function clearOldAlerts(maxAgeHours = 24) {
  alertManager.clearOldAlerts(maxAgeHours);
}

module.exports = {
  AlertManager,
  SecurityAlert,
  ALERT_THRESHOLDS,
  ALERT_SEVERITY,
  alertManager,
  checkProBruteForce,
  checkCodeGenerationAbuse,
  checkAdminActionAbuse,
  checkHighErrorRate,
  runSecurityChecks,
  getAlerts,
  acknowledgeAlert,
  clearOldAlerts,
};
