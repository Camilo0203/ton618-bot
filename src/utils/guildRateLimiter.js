"use strict";

/**
 * Guild Rate Limiter - Rate limiting a nivel de servidor
 * Previene que un guild con muchos miembros spamee comandos
 */

const { logStructured } = require("./observability");

const guildLimits = new Map();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

function getConfig() {
  return {
    defaultMaxRequests: Number(process.env.GUILD_RATE_LIMIT_MAX_REQUESTS || 100),
    defaultWindowMs: Number(process.env.GUILD_RATE_LIMIT_WINDOW_MS || 60000),
  };
}

function getGuildLimitKey(guildId, commandName) {
  return `${guildId}::${commandName}`;
}

function checkGuildRateLimit(guildId, commandName, options = {}) {
  if (!guildId || !commandName) {
    return { allowed: true, retryAfter: 0 };
  }

  const config = getConfig();
  const maxRequests = options.maxRequests || config.defaultMaxRequests;
  const windowMs = options.windowMs || config.defaultWindowMs;
  const key = getGuildLimitKey(guildId, commandName);
  const now = Date.now();

  let limitData = guildLimits.get(key);

  if (!limitData || now >= limitData.resetAt) {
    limitData = {
      count: 0,
      resetAt: now + windowMs,
    };
    guildLimits.set(key, limitData);
  }

  if (limitData.count >= maxRequests) {
    const retryAfter = Math.ceil((limitData.resetAt - now) / 1000);
    logStructured("warn", "rate_limit.guild.exceeded", {
      guildId,
      commandName,
      count: limitData.count,
      maxRequests,
      retryAfter,
    });
    return { allowed: false, retryAfter, reason: "guild_rate_limit" };
  }

  limitData.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function resetGuildRateLimit(guildId, commandName) {
  if (!guildId) return;
  if (commandName) {
    guildLimits.delete(getGuildLimitKey(guildId, commandName));
  } else {
    for (const key of guildLimits.keys()) {
      if (key.startsWith(`${guildId}::`)) {
        guildLimits.delete(key);
      }
    }
  }
}

function cleanupExpiredGuildLimits() {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, data] of guildLimits.entries()) {
    if (now >= data.resetAt) {
      guildLimits.delete(key);
      cleaned += 1;
    }
  }
  if (cleaned > 0) {
    logStructured("info", "rate_limit.guild.cleanup", { cleaned });
  }
}

function getGuildStats() {
  const now = Date.now();
  let active = 0;
  let atLimit = 0;

  for (const [key, data] of guildLimits.entries()) {
    if (now < data.resetAt) {
      active++;
      const config = getConfig();
      if (data.count >= config.defaultMaxRequests) {
        atLimit++;
      }
    }
  }

  return {
    activeEntries: active,
    atCapacity: atLimit,
  };
}

const cleanupTimer = setInterval(cleanupExpiredGuildLimits, CLEANUP_INTERVAL_MS);
if (typeof cleanupTimer.unref === "function") {
  cleanupTimer.unref();
}

module.exports = {
  checkGuildRateLimit,
  resetGuildRateLimit,
  cleanupExpiredGuildLimits,
  getGuildStats,
  getConfig,
  guildLimits,
};