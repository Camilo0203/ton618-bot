"use strict";

/**
 * Global Rate Limiter - Rate limiting a nivel de todo el bot
 * Previene ataques DDoS a nivel global
 */

const { logStructured } = require("./observability");

const globalLimits = new Map();
const CLEANUP_INTERVAL_MS = 60 * 1000;

function getConfig() {
  return {
    defaultMaxRequests: Number(process.env.GLOBAL_RATE_LIMIT_MAX_REQUESTS || 1000),
    defaultWindowMs: Number(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS || 60000),
  };
}

function checkGlobalRateLimit(options = {}) {
  const config = getConfig();
  const maxRequests = options.maxRequests || config.defaultMaxRequests;
  const windowMs = options.windowMs || config.defaultWindowMs;
  const now = Date.now();

  let limitData = globalLimits.get("__global__");

  if (!limitData || now >= limitData.resetAt) {
    limitData = {
      count: 0,
      resetAt: now + windowMs,
    };
    globalLimits.set("__global__", limitData);
  }

  if (limitData.count >= maxRequests) {
    const retryAfter = Math.ceil((limitData.resetAt - now) / 1000);
    logStructured("error", "rate_limit.global.exceeded", {
      count: limitData.count,
      maxRequests,
      retryAfter,
    });
    return { allowed: false, retryAfter, reason: "global_rate_limit" };
  }

  limitData.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function getGlobalStats() {
  const config = getConfig();
  const global = globalLimits.get("__global__") || { count: 0, resetAt: 0 };
  const now = Date.now();
  
  return {
    currentCount: global.count,
    maxRequests: config.defaultMaxRequests,
    remaining: Math.max(0, config.defaultMaxRequests - global.count),
    resetAt: global.resetAt,
    timeUntilReset: Math.max(0, global.resetAt - now),
  };
}

function cleanupExpiredGlobalLimits() {
  const now = Date.now();
  const global = globalLimits.get("__global__");
  
  if (global && now >= global.resetAt) {
    globalLimits.delete("__global__");
    logStructured("info", "rate_limit.global.cleanup");
  }
}

const cleanupTimer = setInterval(cleanupExpiredGlobalLimits, CLEANUP_INTERVAL_MS);
if (typeof cleanupTimer.unref === "function") {
  cleanupTimer.unref();
}

module.exports = {
  checkGlobalRateLimit,
  getGlobalStats,
  cleanupExpiredGlobalLimits,
  getConfig,
};