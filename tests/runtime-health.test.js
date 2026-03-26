const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createHealthState,
  markDiscordGatewayEvent,
  updateMongoHealth,
  isProcessHealthy,
  buildHealthPayload,
} = require("../src/utils/runtimeHealth");

test("runtime health refleja pings de Mongo y eventos del gateway", () => {
  const healthState = createHealthState(Date.parse("2026-03-26T10:00:00.000Z"));

  updateMongoHealth(healthState, true, { checkedAt: "2026-03-26T10:01:00.000Z" });
  markDiscordGatewayEvent(healthState, "clientReady", true, { at: "2026-03-26T10:01:02.000Z" });

  assert.equal(healthState.mongoConnected, true);
  assert.equal(healthState.lastMongoPingAt, "2026-03-26T10:01:00.000Z");
  assert.equal(healthState.lastMongoPingOkAt, "2026-03-26T10:01:00.000Z");
  assert.equal(healthState.discordReady, true);
  assert.equal(healthState.lastDiscordEvent, "clientReady");
  assert.equal(isProcessHealthy({ healthState }), true);

  markDiscordGatewayEvent(healthState, "shardDisconnect", false, {
    at: "2026-03-26T10:02:00.000Z",
    closeCode: 1006,
  });
  updateMongoHealth(healthState, false, { checkedAt: "2026-03-26T10:02:03.000Z" });

  assert.equal(healthState.discordReady, false);
  assert.equal(healthState.discordCloseCode, 1006);
  assert.equal(healthState.lastMongoPingOkAt, "2026-03-26T10:01:00.000Z");
  assert.equal(isProcessHealthy({ healthState }), false);
});

test("buildHealthPayload conserva el contrato publico del endpoint", () => {
  const healthState = createHealthState(Date.parse("2026-03-26T10:00:00.000Z"));
  updateMongoHealth(healthState, true, { checkedAt: "2026-03-26T10:01:00.000Z" });
  markDiscordGatewayEvent(healthState, "clientReady", true, { at: "2026-03-26T10:01:02.000Z" });
  healthState.ghostPort = 8080;

  const payload = buildHealthPayload({
    healthState,
    buildInfo: {
      version: "3.0.0",
      commit: "abc123",
      shortCommit: "abc123",
      deployTag: "prod",
      fingerprint: "3.0.0|abc123",
    },
    client: {
      ws: { ping: 42 },
      guilds: { cache: { size: 7 } },
    },
    memoryUsage: {
      heapUsed: 10 * 1024 * 1024,
      heapTotal: 20 * 1024 * 1024,
      rss: 50 * 1024 * 1024,
    },
  });

  assert.equal(payload.status, "ok");
  assert.equal(payload.mongoConnected, true);
  assert.equal(payload.discordReady, true);
  assert.equal(payload.fingerprint, "3.0.0|abc123");
  assert.equal(payload.ghostPort, 8080);
  assert.deepEqual(payload.memory, {
    heapUsedMB: 10,
    heapTotalMB: 20,
    rssMB: 50,
  });
  assert.deepEqual(payload.discord, {
    ping: 42,
    guilds: 7,
  });
});
