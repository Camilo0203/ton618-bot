"use strict";

/**
 * System Metrics - Comprehensive health and performance monitoring
 */

const { logStructured } = require("./observability");
const userRateLimiter = require("./userRateLimiter");
const guildRateLimiter = require("./guildRateLimiter");
const globalRateLimiter = require("./globalRateLimiter");

function getSystemMetrics() {
  const now = Date.now();
  const memory = process.memoryUsage();
  
  return {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      rss: Math.round(memory.rss / 1024 / 1024),
      external: Math.round(memory.external / 1024 / 1024),
    },
    eventLoop: {
      max: Math.round(performance.now()),
    },
    rateLimits: {
      global: globalRateLimiter.getGlobalStats(),
      guild: guildRateLimiter.getGuildStats(),
    },
  };
}

function logSystemMetrics() {
  const metrics = getSystemMetrics();
  logStructured("info", "system.metrics", metrics);
  return metrics;
}

function getHealthSummary() {
  const metrics = getSystemMetrics();
  
  const health = {
    status: "healthy",
    checks: [],
  };
  
  if (metrics.memory.heapUsed > 350) {
    health.checks.push({ name: "memory", status: "warning", message: "Heap usage high" });
  }
  
  if (metrics.eventLoop.max > 50) {
    health.checks.push({ name: "event_loop", status: "warning", message: "Event loop slow" });
  }
  
  if (health.checks.length > 0) {
    health.status = "degraded";
  }
  
  return health;
}

let metricsInterval = null;

function startMetricsReporter(intervalMs = 60000) {
  if (metricsInterval) {
    return;
  }
  
  metricsInterval = setInterval(() => {
    logSystemMetrics();
  }, intervalMs);
  
  if (typeof metricsInterval.unref === "function") {
    metricsInterval.unref();
  }
  
  logStructured("info", "system.metrics_reporter_started", { intervalMs });
}

function stopMetricsReporter() {
  if (metricsInterval) {
    clearInterval(metricsInterval);
    metricsInterval = null;
    logStructured("info", "system.metrics_reporter_stopped");
  }
}

module.exports = {
  getSystemMetrics,
  logSystemMetrics,
  getHealthSummary,
  startMetricsReporter,
  stopMetricsReporter,
};