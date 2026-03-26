const { logStructured } = require("./observability");
const BOT_STATS_HTTP_TIMEOUT_MS = Math.max(3000, Number(process.env.BOT_STATS_HTTP_TIMEOUT_MS || 10000));

const state = {
  bootstrapped: false,
  rowId: null,
  commandCount: 0,
  uptimePercentage: 99.9,
  pendingCommandIncrements: 0,
  syncTimer: null,
  syncInFlight: null,
  intervalId: null,
};

async function fetchWithTimeout(url, options = {}, timeoutMs = BOT_STATS_HTTP_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1000, timeoutMs));
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function getConfig() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  return {
    url,
    key,
    enabled: Boolean(url && key),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}

function getMissingConfigFields(config) {
  const missing = [];
  if (!config.url) {
    missing.push("SUPABASE_URL");
  }
  if (!config.key) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY");
  }
  return missing;
}

function getHeaders(config, includeBody = false) {
  const headers = {
    apikey: config.key,
    Authorization: `Bearer ${config.key}`,
  };

  if (includeBody) {
    headers["Content-Type"] = "application/json";
    headers.Prefer = "return=representation";
  }

  return headers;
}

async function readLatestRow(config) {
  const response = await fetchWithTimeout(
    `${config.url}/rest/v1/bot_stats?select=id,commands_executed,uptime_percentage&order=updated_at.desc&limit=1`,
    {
      headers: getHeaders(config),
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase read failed with status ${response.status}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function writeRow(config, payload) {
  if (state.rowId) {
    const response = await fetchWithTimeout(
      `${config.url}/rest/v1/bot_stats?id=eq.${encodeURIComponent(state.rowId)}`,
      {
        method: "PATCH",
        headers: getHeaders(config, true),
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase update failed with status ${response.status}`);
    }

    const rows = await response.json();
    return Array.isArray(rows) ? rows[0] || null : null;
  }

  const response = await fetchWithTimeout(`${config.url}/rest/v1/bot_stats`, {
    method: "POST",
    headers: getHeaders(config, true),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed with status ${response.status}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function ensureBootstrapped(config) {
  if (state.bootstrapped) {
    return;
  }

  const row = await readLatestRow(config);
  state.rowId = row?.id || null;
  state.commandCount = Number(row?.commands_executed) || 0;

  const uptime = Number(row?.uptime_percentage);
  state.uptimePercentage = Number.isFinite(uptime) ? uptime : 99.9;
  state.bootstrapped = true;
}

function collectSnapshot(client) {
  let users = 0;
  for (const guild of client.guilds.cache.values()) {
    users += Number(guild.memberCount) || 0;
  }

  return {
    servers: client.guilds.cache.size,
    users,
  };
}

function getUptimePercentage() {
  const configured = Number(process.env.BOT_STATS_UPTIME_PERCENTAGE);
  if (Number.isFinite(configured) && configured >= 0 && configured <= 100) {
    return Number(configured.toFixed(2));
  }

  return state.uptimePercentage || 99.9;
}

async function syncBotStats(client, reason = "manual") {
  const config = getConfig();
  if (!config.enabled || !client?.isReady?.()) {
    return;
  }

  if (state.syncInFlight) {
    return state.syncInFlight;
  }

  const pendingIncrement = state.pendingCommandIncrements;
  state.pendingCommandIncrements = 0;

  state.syncInFlight = (async () => {
    try {
      await ensureBootstrapped(config);

      const snapshot = collectSnapshot(client);
      const payload = {
        servers: snapshot.servers,
        users: snapshot.users,
        commands_executed: state.commandCount + pendingIncrement,
        uptime_percentage: getUptimePercentage(),
        updated_at: new Date().toISOString(),
      };

      const row = await writeRow(config, payload);
      if (row?.id) {
        state.rowId = row.id;
      }

      state.commandCount = payload.commands_executed;
      state.uptimePercentage = payload.uptime_percentage;

      logStructured("info", "bot.stats.sync", {
        reason,
        servers: payload.servers,
        users: payload.users,
        commandsExecuted: payload.commands_executed,
      });
    } catch (error) {
      state.pendingCommandIncrements += pendingIncrement;
      logStructured("error", "bot.stats.sync_error", {
        reason,
        error: error?.message || String(error),
        usingServiceRole: config.hasServiceRole,
      });
    } finally {
      state.syncInFlight = null;
    }
  })();

  return state.syncInFlight;
}

function queueBotStatsSync(client, options = {}) {
  const { commandIncrement = 0, reason = "queued", delayMs = 2000 } = options;
  const config = getConfig();

  if (!config.enabled) {
    return;
  }

  if (commandIncrement > 0) {
    state.pendingCommandIncrements += commandIncrement;
  }

  if (state.syncTimer) {
    return;
  }

  state.syncTimer = setTimeout(() => {
    state.syncTimer = null;
    void syncBotStats(client, reason);
  }, Math.max(0, Number(delayMs) || 0));

  if (typeof state.syncTimer.unref === "function") {
    state.syncTimer.unref();
  }
}

function startBotStatsSync(client) {
  const config = getConfig();
  if (!config.url) {
    logStructured("warn", "bot.stats.disabled", {
      type: "config",
      reason: "missing_supabase_url",
      missing: getMissingConfigFields(config),
      message: "Bot stats sync disabled because Supabase configuration is incomplete.",
    });
    return;
  }

  if (!config.key) {
    logStructured("warn", "bot.stats.disabled", {
      type: "config",
      reason: "missing_supabase_key",
      missing: getMissingConfigFields(config),
      message: "Bot stats sync disabled because Supabase configuration is incomplete.",
    });
    return;
  }

  if (!config.hasServiceRole) {
    logStructured("warn", "bot.stats.partial_config", {
      type: "config",
      reason: "missing_service_role_key",
      missing: ["SUPABASE_SERVICE_ROLE_KEY"],
      note: "Reads may work, but writes can fail with anon keys while RLS is enabled.",
    });
  }

  if (!state.intervalId) {
    const intervalMs = Math.max(15000, Number(process.env.BOT_STATS_SYNC_INTERVAL_MS || 60000));
    state.intervalId = setInterval(() => {
      void syncBotStats(client, "interval");
    }, intervalMs);

    if (typeof state.intervalId.unref === "function") {
      state.intervalId.unref();
    }
  }

  void syncBotStats(client, "ready");
}

module.exports = {
  startBotStatsSync,
  queueBotStatsSync,
  syncBotStats,
};
