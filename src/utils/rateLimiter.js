const buckets = new Map();
let lastCleanupAt = 0;

const CLEANUP_INTERVAL_MS = 60 * 1000;

function cleanup(now) {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return;
  lastCleanupAt = now;

  for (const [key, entry] of buckets.entries()) {
    if (!entry || entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function buildKey(guildId, userId, scope = "global") {
  const g = guildId || "dm";
  return `${g}::${userId}::${scope}`;
}

function checkUserRateLimit({
  guildId,
  userId,
  scope = "global",
  windowSeconds = 10,
  maxActions = 8,
}) {
  const now = Date.now();
  cleanup(now);

  const key = buildKey(guildId, userId, scope);
  const windowMs = Math.max(1, Number(windowSeconds || 10)) * 1000;
  const max = Math.max(1, Number(maxActions || 8));

  let entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
  }

  entry.count += 1;
  buckets.set(key, entry);

  if (entry.count <= max) {
    return {
      limited: false,
      remaining: Math.max(0, max - entry.count),
      retryAfterMs: 0,
      retryAfterSec: 0,
    };
  }

  const retryAfterMs = Math.max(0, entry.resetAt - now);
  return {
    limited: true,
    remaining: 0,
    retryAfterMs,
    retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)),
  };
}

function resetRateLimiter() {
  buckets.clear();
  lastCleanupAt = 0;
}

module.exports = {
  checkUserRateLimit,
  resetRateLimiter,
};
