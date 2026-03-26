"use strict";

function nowIso() {
  return new Date().toISOString();
}

function createHealthState(startedAt = Date.now()) {
  return {
    startedAt,
    shuttingDown: false,
    mongoConnected: false,
    discordReady: false,
    ghostPort: null,
    lastMongoPingAt: null,
    lastMongoPingOkAt: null,
    lastDiscordEvent: "boot",
    lastDiscordEventAt: null,
    discordCloseCode: null,
  };
}

function markDiscordGatewayEvent(healthState, eventName, ready, details = {}) {
  if (!healthState) return healthState;

  healthState.discordReady = Boolean(ready);
  healthState.lastDiscordEvent = eventName || (ready ? "ready" : "not_ready");
  healthState.lastDiscordEventAt = details.at || nowIso();

  if (Object.prototype.hasOwnProperty.call(details, "closeCode")) {
    healthState.discordCloseCode = details.closeCode ?? null;
  }

  return healthState;
}

function updateMongoHealth(healthState, connected, details = {}) {
  if (!healthState) return healthState;

  const checkedAt = details.checkedAt || nowIso();
  healthState.mongoConnected = Boolean(connected);
  healthState.lastMongoPingAt = checkedAt;

  if (connected) {
    healthState.lastMongoPingOkAt = checkedAt;
  }

  return healthState;
}

function isProcessHealthy({
  healthState,
  mongoConnected = healthState?.mongoConnected,
  discordReady = healthState?.discordReady,
}) {
  return Boolean(healthState && mongoConnected && discordReady && !healthState.shuttingDown);
}

function formatMemoryUsage(memoryUsage = process.memoryUsage()) {
  return {
    heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
  };
}

function buildHealthPayload({ healthState, buildInfo, client = null, memoryUsage = null }) {
  return {
    status: isProcessHealthy({ healthState }) ? "ok" : "degraded",
    startedAt: new Date(healthState.startedAt).toISOString(),
    uptimeSec: Math.floor(process.uptime()),
    shuttingDown: healthState.shuttingDown,
    mongoConnected: healthState.mongoConnected,
    lastMongoPingAt: healthState.lastMongoPingAt,
    lastMongoPingOkAt: healthState.lastMongoPingOkAt,
    discordReady: healthState.discordReady,
    lastDiscordEvent: healthState.lastDiscordEvent,
    lastDiscordEventAt: healthState.lastDiscordEventAt,
    discordCloseCode: healthState.discordCloseCode,
    ghostPort: healthState.ghostPort,
    version: buildInfo.version,
    commit: buildInfo.commit,
    shortCommit: buildInfo.shortCommit,
    deployTag: buildInfo.deployTag,
    fingerprint: buildInfo.fingerprint,
    memory: formatMemoryUsage(memoryUsage || process.memoryUsage()),
    discord: {
      ping: client?.ws?.ping ?? null,
      guilds: client?.guilds?.cache?.size ?? 0,
    },
  };
}

module.exports = {
  createHealthState,
  markDiscordGatewayEvent,
  updateMongoHealth,
  isProcessHealthy,
  buildHealthPayload,
};
