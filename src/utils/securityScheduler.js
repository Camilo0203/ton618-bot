"use strict";

/**
 * Security Scheduler
 * Automatically runs security checks at regular intervals
 */

const { runSecurityChecks, clearOldAlerts } = require("./securityAlerts");

let checkInterval = null;
let cleanupInterval = null;
let discordClient = null;

const DEFAULT_CONFIG = {
  // Run security checks every 5 minutes
  CHECK_INTERVAL_MS: 5 * 60 * 1000,

  // Clean up old alerts every hour
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000,

  // Maximum age for alerts before cleanup (24 hours)
  MAX_ALERT_AGE_HOURS: 24,

  // Whether to log each check (verbose)
  VERBOSE: false,
};

/**
 * Start the security scheduler
 * @param {object} config - Configuration options
 * @param {object} client - Discord.js client for sending alerts
 */
function startSecurityScheduler(config = {}, client = null) {
  const options = { ...DEFAULT_CONFIG, ...config };

  // Store Discord client for alerts
  if (client) {
    discordClient = client;
  }

  // Stop any existing scheduler
  stopSecurityScheduler();

  console.log("[SECURITY SCHEDULER] Starting security monitoring...");
  console.log(`[SECURITY SCHEDULER] Check interval: ${options.CHECK_INTERVAL_MS / 1000}s`);
  console.log(`[SECURITY SCHEDULER] Cleanup interval: ${options.CLEANUP_INTERVAL_MS / 1000}s`);
  if (discordClient || process.env.SECURITY_ALERTS_WEBHOOK_URL) {
    console.log("[SECURITY SCHEDULER] Discord alerts: ENABLED");
  }

  // Run initial check with client
  runSecurityChecks(discordClient);

  // Schedule regular checks
  checkInterval = setInterval(async () => {
    if (options.VERBOSE) {
      console.log("[SECURITY SCHEDULER] Running scheduled security check...");
    }

    try {
      await runSecurityChecks(discordClient);
    } catch (error) {
      console.error("[SECURITY SCHEDULER] Error during security check:", error.message);
    }
  }, options.CHECK_INTERVAL_MS);

  // Schedule cleanup
  cleanupInterval = setInterval(async () => {
    if (options.VERBOSE) {
      console.log("[SECURITY SCHEDULER] Running alert cleanup...");
    }

    try {
      clearOldAlerts(options.MAX_ALERT_AGE_HOURS);
    } catch (error) {
      console.error("[SECURITY SCHEDULER] Error during cleanup:", error.message);
    }
  }, options.CLEANUP_INTERVAL_MS);

  console.log("[SECURITY SCHEDULER] Security monitoring active");
  return true;
}

/**
 * Stop the security scheduler
 */
function stopSecurityScheduler() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }

  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }

  console.log("[SECURITY SCHEDULER] Security monitoring stopped");
  return true;
}

/**
 * Run a manual security check
 * @param {object} client - Discord.js client for sending alerts
 */
async function manualSecurityCheck(client = null) {
  console.log("[SECURITY SCHEDULER] Running manual security check...");
  const checkClient = client || discordClient;
  return await runSecurityChecks(checkClient);
}

/**
 * Get scheduler status
 */
function getSchedulerStatus() {
  return {
    isRunning: checkInterval !== null && cleanupInterval !== null,
    checkIntervalMs: DEFAULT_CONFIG.CHECK_INTERVAL_MS,
    cleanupIntervalMs: DEFAULT_CONFIG.CLEANUP_INTERVAL_MS,
    maxAlertAgeHours: DEFAULT_CONFIG.MAX_ALERT_AGE_HOURS,
    discordAlertsEnabled: !!(discordClient || process.env.SECURITY_ALERTS_WEBHOOK_URL),
    discordClientConnected: !!discordClient,
    webhookConfigured: !!process.env.SECURITY_ALERTS_WEBHOOK_URL,
  };
}

module.exports = {
  startSecurityScheduler,
  stopSecurityScheduler,
  manualSecurityCheck,
  getSchedulerStatus,
  DEFAULT_CONFIG,
};
