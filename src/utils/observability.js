const state = {
  startedAt: Date.now(),
  interactionsTotal: 0,
  interactionsByStatus: new Map(),
  interactionsByKind: new Map(),
  operations: new Map(),
  errorsByScope: new Map(),
};

let reporterInterval = null;
const errorAlertState = new Map();

function incMap(map, key, delta = 1) {
  map.set(key, (map.get(key) || 0) + delta);
}

function toMs(startNs) {
  const diffNs = process.hrtime.bigint() - startNs;
  return Number(diffNs / 1000000n);
}

function nowIso() {
  return new Date().toISOString();
}

function logStructured(level, event, payload = {}) {
  const line = {
    ts: nowIso(),
    level,
    event,
    ...payload,
  };
  const out = JSON.stringify(line);
  if (level === "error") {
    console.error(out);
  } else if (level === "warn") {
    console.warn(out);
  } else {
    // Only print 'info' JSON logs if explicitly requested via environment variable,
    // otherwise they spam the terminal with unreadable data in local environments.
    if (process.env.ENABLE_JSON_LOGS === "true") {
      console.log(out);
    }
  }
}

function recordInteractionMetric({
  kind,
  name,
  status = "ok",
  durationMs = 0,
  guildId = null,
}) {
  state.interactionsTotal += 1;
  incMap(state.interactionsByStatus, status);
  incMap(state.interactionsByKind, kind || "unknown");

  const key = `${kind || "unknown"}::${name || "unknown"}`;
  const op = state.operations.get(key) || {
    kind: kind || "unknown",
    name: name || "unknown",
    count: 0,
    ok: 0,
    error: 0,
    denied: 0,
    rate_limited: 0,
    totalMs: 0,
    maxMs: 0,
    minMs: Number.MAX_SAFE_INTEGER,
    guilds: new Set(),
  };

  op.count += 1;
  op.totalMs += durationMs;
  op.maxMs = Math.max(op.maxMs, durationMs);
  op.minMs = Math.min(op.minMs, durationMs);
  if (status === "ok") op.ok += 1;
  if (status === "error") op.error += 1;
  if (status === "denied") op.denied += 1;
  if (status === "rate_limited") op.rate_limited += 1;
  if (guildId) op.guilds.add(guildId);
  state.operations.set(key, op);
}

function recordError(scope = "unknown") {
  incMap(state.errorsByScope, scope);
  maybeEmitErrorSpike(scope);
}

function maybeEmitErrorSpike(scope) {
  const threshold = Math.max(1, Number(process.env.ERROR_ALERT_THRESHOLD || 5));
  const cooldownMs = Math.max(10_000, Number(process.env.ERROR_ALERT_COOLDOWN_MS || 300_000));
  const now = Date.now();

  const current = errorAlertState.get(scope) || {
    count: 0,
    nextAllowedAt: 0,
  };
  current.count += 1;

  if (current.count >= threshold && now >= current.nextAllowedAt) {
    logStructured("warn", "error.spike", {
      scope,
      count: current.count,
      threshold,
      cooldownMs,
    });
    current.count = 0;
    current.nextAllowedAt = now + cooldownMs;
  }

  errorAlertState.set(scope, current);
}

function mapToObject(map) {
  const out = {};
  for (const [k, v] of map.entries()) out[k] = v;
  return out;
}

function topSlowOperations(limit = 5) {
  return Array.from(state.operations.values())
    .filter((op) => op.count > 0)
    .map((op) => ({
      kind: op.kind,
      name: op.name,
      count: op.count,
      avgMs: Math.round(op.totalMs / op.count),
      maxMs: op.maxMs,
      errorRatePct: Math.round((op.error / op.count) * 100),
    }))
    .sort((a, b) => b.avgMs - a.avgMs)
    .slice(0, limit);
}

function topErroredOperations(limit = 5) {
  return Array.from(state.operations.values())
    .filter((op) => op.error > 0)
    .map((op) => ({
      kind: op.kind,
      name: op.name,
      count: op.count,
      errors: op.error,
      errorRatePct: Math.round((op.error / op.count) * 100),
      avgMs: Math.round(op.totalMs / op.count),
    }))
    .sort((a, b) => b.errors - a.errors || b.errorRatePct - a.errorRatePct)
    .slice(0, limit);
}

function buildWindowSummary() {
  const elapsedSec = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
  return {
    windowSec: elapsedSec,
    interactionsTotal: state.interactionsTotal,
    interactionsPerSec: Number((state.interactionsTotal / elapsedSec).toFixed(3)),
    byStatus: mapToObject(state.interactionsByStatus),
    byKind: mapToObject(state.interactionsByKind),
    errorsByScope: mapToObject(state.errorsByScope),
    topSlow: topSlowOperations(5),
    topErrors: topErroredOperations(5),
  };
}

function resetWindow() {
  state.startedAt = Date.now();
  state.interactionsTotal = 0;
  state.interactionsByStatus.clear();
  state.interactionsByKind.clear();
  state.operations.clear();
  state.errorsByScope.clear();
  errorAlertState.clear();
}

function flushWindowSummary() {
  const summary = buildWindowSummary();
  resetWindow();
  return summary;
}

function startMetricsReporter(options = {}) {
  if (reporterInterval) return;
  const intervalMs = Math.max(10_000, Number(options.intervalMs || 300_000));
  reporterInterval = setInterval(() => {
    const summary = flushWindowSummary();
    if (!summary.interactionsTotal) return;
    logStructured("info", "metrics.window", summary);
  }, intervalMs);
}

function stopMetricsReporter() {
  if (!reporterInterval) return;
  clearInterval(reporterInterval);
  reporterInterval = null;
}

module.exports = {
  toMs,
  logStructured,
  recordError,
  recordInteractionMetric,
  buildWindowSummary,
  flushWindowSummary,
  startMetricsReporter,
  stopMetricsReporter,
};
