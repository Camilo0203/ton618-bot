const { logStructured } = require("./observability");

const userLimits = new Map();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

function getUserLimitKey(userId, commandName) {
  return `${userId}::${commandName}`;
}

function getConfig() {
  return {
    defaultMaxRequests: Number(process.env.USER_RATE_LIMIT_MAX_REQUESTS || 5),
    defaultWindowMs: Number(process.env.USER_RATE_LIMIT_WINDOW_MS || 60000),
    backoffMultiplier: Number(process.env.USER_RATE_LIMIT_BACKOFF || 2),
    maxBackoffMs: Number(process.env.USER_RATE_LIMIT_MAX_BACKOFF_MS || 300000),
  };
}

function checkUserRateLimit(userId, commandName, options = {}) {
  if (!userId || !commandName) {
    return { allowed: true, retryAfter: 0 };
  }

  const config = getConfig();
  const maxRequests = options.maxRequests || config.defaultMaxRequests;
  const windowMs = options.windowMs || config.defaultWindowMs;
  const key = getUserLimitKey(userId, commandName);
  const now = Date.now();

  let limitData = userLimits.get(key);

  if (!limitData || now >= limitData.resetAt) {
    limitData = {
      count: 0,
      resetAt: now + windowMs,
      violations: 0,
      backoffUntil: 0,
    };
    userLimits.set(key, limitData);
  }

  if (now < limitData.backoffUntil) {
    const retryAfter = Math.ceil((limitData.backoffUntil - now) / 1000);
    logStructured("warn", "rate_limit.user.backoff", {
      userId,
      commandName,
      retryAfter,
      violations: limitData.violations,
    });
    return { allowed: false, retryAfter, reason: "backoff" };
  }

  if (limitData.count >= maxRequests) {
    limitData.violations += 1;
    const backoffMs = Math.min(
      windowMs * Math.pow(config.backoffMultiplier, limitData.violations - 1),
      config.maxBackoffMs
    );
    limitData.backoffUntil = now + backoffMs;
    const retryAfter = Math.ceil(backoffMs / 1000);

    logStructured("warn", "rate_limit.user.exceeded", {
      userId,
      commandName,
      count: limitData.count,
      maxRequests,
      violations: limitData.violations,
      retryAfter,
    });

    return { allowed: false, retryAfter, reason: "rate_limit" };
  }

  limitData.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function resetUserRateLimit(userId, commandName) {
  if (!userId) return;
  if (commandName) {
    userLimits.delete(getUserLimitKey(userId, commandName));
  } else {
    for (const key of userLimits.keys()) {
      if (key.startsWith(`${userId}::`)) {
        userLimits.delete(key);
      }
    }
  }
}

function cleanupExpiredLimits() {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, data] of userLimits.entries()) {
    if (now >= data.resetAt && now >= data.backoffUntil) {
      userLimits.delete(key);
      cleaned += 1;
    }
  }
  if (cleaned > 0) {
    logStructured("info", "rate_limit.user.cleanup", { cleaned });
  }
}

const cleanupTimer = setInterval(cleanupExpiredLimits, CLEANUP_INTERVAL_MS);
if (typeof cleanupTimer.unref === "function") {
  cleanupTimer.unref();
}

module.exports = {
  checkUserRateLimit,
  resetUserRateLimit,
  cleanupExpiredLimits,
  getConfig,
};
