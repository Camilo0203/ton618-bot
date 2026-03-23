const { EmbedBuilder } = require("discord.js");
const { getDB } = require("./database");
const { getGuildSettings } = require("./accessControl");
const { buildWindowSummary, logStructured } = require("./observability");

const HEARTBEAT_DOC_ID = "main";
const alertThrottle = new Map();

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getConfig() {
  return {
    heartbeatMs: Math.max(30_000, toNumber(process.env.HEALTH_HEARTBEAT_MS, 60_000)),
    evaluateMs: Math.max(60_000, toNumber(process.env.HEALTH_EVALUATE_MS, 300_000)),
    alertCooldownMs: Math.max(60_000, toNumber(process.env.HEALTH_ALERT_COOLDOWN_MS, 900_000)),
    pingWarnMs: Math.max(50, toNumber(process.env.HEALTH_PING_WARN_MS, 300)),
    errorRateWarnPct: Math.max(1, toNumber(process.env.HEALTH_ERROR_RATE_WARN_PCT, 25)),
    minInteractionsForErrorAlert: Math.max(1, toNumber(process.env.HEALTH_MIN_INTERACTIONS, 20)),
    downtimeThresholdMs: Math.max(60_000, toNumber(process.env.HEALTH_DOWNTIME_THRESHOLD_MS, 600_000)),
  };
}

function shouldThrottle(key, cooldownMs) {
  const now = Date.now();
  const nextAllowedAt = alertThrottle.get(key) || 0;
  if (nextAllowedAt > now) return true;
  alertThrottle.set(key, now + cooldownMs);
  return false;
}

async function readHeartbeat() {
  try {
    return await getDB().collection("botHealth").findOne({ id: HEARTBEAT_DOC_ID });
  } catch {
    return null;
  }
}

async function getPersistedHealthSnapshot() {
  return readHeartbeat();
}

async function writeHeartbeat(client, snapshot) {
  try {
    await getDB().collection("botHealth").updateOne(
      { id: HEARTBEAT_DOC_ID },
      {
        $set: {
          id: HEARTBEAT_DOC_ID,
          bot_tag: client.user?.tag || null,
          guilds: client.guilds?.cache?.size || 0,
          ping_ms: client.ws?.ping ?? null,
          interactions_total: snapshot.interactionsTotal,
          interactions_per_sec: snapshot.interactionsPerSec,
          by_status: snapshot.byStatus,
          by_kind: snapshot.byKind,
          last_seen: new Date(),
        },
      },
      { upsert: true }
    );
  } catch (error) {
    logStructured("warn", "health.heartbeat.write_failed", {
      error: error?.message || String(error),
    });
  }
}

function buildHealthSnapshot(client) {
  const summary = buildWindowSummary();
  const byStatus = summary.byStatus || {};
  const ok = Number(byStatus.ok || 0);
  const errors = Number(byStatus.error || 0);
  const denied = Number(byStatus.denied || 0);
  const rateLimited = Number(byStatus.rate_limited || 0);
  const total = Math.max(0, Number(summary.interactionsTotal || 0));
  const errorRatePct = total > 0 ? Math.round((errors / total) * 100) : 0;

  return {
    summary,
    pingMs: Number(client.ws?.ping || 0),
    interactionsTotal: total,
    errorRatePct,
    byStatus: { ok, errors, denied, rateLimited },
  };
}

async function sendAlertToGuildLogs(client, buildEmbed, options = {}) {
  const guildEntries = Array.from(client.guilds.cache.values());
  for (const guild of guildEntries) {
    try {
      const guildSettings = await getGuildSettings(guild.id);
      const logChannelId = guildSettings?.log_channel;
      if (!logChannelId) continue;
      const channel = guild.channels.cache.get(logChannelId)
        || await guild.channels.fetch(logChannelId).catch(() => null);
      if (!channel) continue;

      const throttleKey = `${guild.id}::${options.alertType || "health"}`;
      if (shouldThrottle(throttleKey, options.alertCooldownMs || 900_000)) continue;

      const embed = buildEmbed(guild);
      await channel.send({ embeds: [embed] }).catch(() => {});
    } catch {}
  }
}

async function alertDowntimeRecovery(client, previousHeartbeat, config) {
  if (!previousHeartbeat?.last_seen) return;
  const lastSeenAt = new Date(previousHeartbeat.last_seen).getTime();
  if (!Number.isFinite(lastSeenAt)) return;

  const downtimeMs = Date.now() - lastSeenAt;
  if (downtimeMs < config.downtimeThresholdMs) return;

  const downtimeMinutes = Math.max(1, Math.round(downtimeMs / 60000));
  await sendAlertToGuildLogs(
    client,
    (guild) => new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle("Salud del bot: recuperacion de caida")
      .setDescription(
        `El bot volvio a estar activo en **${guild.name}**.\n` +
        `Tiempo estimado sin heartbeat: **${downtimeMinutes} min**.`
      )
      .setTimestamp(),
    { alertType: "downtime_recovery", alertCooldownMs: config.alertCooldownMs }
  );
}

async function evaluateHealth(client, config) {
  const snapshot = buildHealthSnapshot(client);
  await writeHeartbeat(client, snapshot);

  const shouldWarnPing = snapshot.pingMs >= config.pingWarnMs;
  const shouldWarnErrors =
    snapshot.interactionsTotal >= config.minInteractionsForErrorAlert &&
    snapshot.errorRatePct >= config.errorRateWarnPct;

  if (shouldWarnPing) {
    await sendAlertToGuildLogs(
      client,
      (guild) => new EmbedBuilder()
        .setColor(0xE67E22)
        .setTitle("Salud del bot: ping alto")
        .setDescription(
          `Ping actual: **${snapshot.pingMs}ms** (umbral ${config.pingWarnMs}ms)\n` +
          `Servidor: **${guild.name}**`
        )
        .addFields(
          { name: "Interacciones ventana", value: `\`${snapshot.interactionsTotal}\``, inline: true },
          { name: "Error rate", value: `\`${snapshot.errorRatePct}%\``, inline: true }
        )
        .setTimestamp(),
      { alertType: "ping_high", alertCooldownMs: config.alertCooldownMs }
    );
  }

  if (shouldWarnErrors) {
    await sendAlertToGuildLogs(
      client,
      (guild) => new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle("Salud del bot: error rate alto")
        .setDescription(
          `Error rate: **${snapshot.errorRatePct}%** (umbral ${config.errorRateWarnPct}%)\n` +
          `Servidor: **${guild.name}**`
        )
        .addFields(
          { name: "Interacciones ventana", value: `\`${snapshot.interactionsTotal}\``, inline: true },
          { name: "Errores", value: `\`${snapshot.byStatus.errors}\``, inline: true },
          { name: "Ping", value: `\`${snapshot.pingMs}ms\``, inline: true }
        )
        .setTimestamp(),
      { alertType: "error_rate_high", alertCooldownMs: config.alertCooldownMs }
    );
  }
}

async function startHealthMonitor(client) {
  const config = getConfig();
  const previousHeartbeat = await readHeartbeat();
  await alertDowntimeRecovery(client, previousHeartbeat, config);

  await evaluateHealth(client, config);

  const heartbeatTimer = setInterval(() => {
    const snapshot = buildHealthSnapshot(client);
    void writeHeartbeat(client, snapshot);
  }, config.heartbeatMs);
  if (typeof heartbeatTimer.unref === "function") heartbeatTimer.unref();

  const evaluateTimer = setInterval(() => {
    void evaluateHealth(client, config);
  }, config.evaluateMs);
  if (typeof evaluateTimer.unref === "function") evaluateTimer.unref();
}

module.exports = {
  startHealthMonitor,
  buildHealthSnapshot,
  getPersistedHealthSnapshot,
};
