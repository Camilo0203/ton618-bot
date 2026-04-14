"use strict";

/**
 * Health Check Enhancement
 * Provides detailed health status for monitoring
 */

const { logStructured } = require("./observability");
const { getSystemMetrics } = require("./systemMetrics");
const { getHealthSummary } = require("./systemMetrics");
const { getGlobalStats } = require("./globalRateLimiter");
const { getGuildStats } = require("./guildRateLimiter");

const STATE = {
  OK: 'ok',
  DEGRADED: 'degraded',
  DOWN: 'down',
};

function createDetailedHealthCheck(additionalChecks = {}) {
  const metrics = getSystemMetrics();
  const healthSummary = getHealthSummary();
  const globalStats = getGlobalStats();
  const guildStats = getGuildStats();
  
  const health = {
    status: STATE.OK,
    timestamp: new Date().toISOString(),
    version: process.env.BOT_VERSION || '3.0.0',
    uptime: Math.round(process.uptime()),
    checks: {
      process: {
        status: STATE.OK,
        memory: metrics.memory,
        uptime: metrics.uptime,
      },
      rateLimits: {
        status: globalStats.currentCount < globalStats.maxRequests * 0.9 ? STATE.OK : STATE.DEGRADED,
        global: globalStats,
        guild: {
          activeEntries: guildStats.activeEntries,
          atCapacity: guildStats.atCapacity,
        },
      },
      ...additionalChecks,
    },
  };
  
  if (healthSummary.status !== 'healthy') {
    health.status = STATE.DEGRADED;
  }
  
  if (metrics.memory.heapUsed > 400) {
    health.status = STATE.DEGRADED;
    health.checks.process.status = STATE.DEGRADED;
  }
  
  return health;
}

function healthCheckMiddleware(req, res) {
  const health = createDetailedHealthCheck();
  
  const statusCode = health.status === STATE.OK ? 200 : 503;
  
  res.status(statusCode).json(health);
}

module.exports = {
  STATE,
  createDetailedHealthCheck,
  healthCheckMiddleware,
};