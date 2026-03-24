require("dotenv").config({ path: [".env.local", ".env"], quiet: true });
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const chalk   = require("./chalk-compat");
const fs      = require("fs");
const path    = require("path");
const http    = require("http");

// ── Conectar a MongoDB
const { connectDB, closeDB } = require("./src/utils/database");
const { getBuildInfo } = require("./src/utils/buildInfo");
const { validateEnv } = require("./src/utils/env");
const { logStructured, recordError, stopMetricsReporter, flushWindowSummary } = require("./src/utils/observability");
const { loadAndValidateCommands } = require("./src/utils/commandLoader");
const { parseBoolean } = require("./src/utils/envHelpers");

async function startBot() {
  const buildInfo = getBuildInfo();
  const healthState = {
    startedAt: Date.now(),
    shuttingDown: false,
    mongoConnected: false,
    discordReady: false,
    ghostPort: null,
  };
  let ghostServer = null;
  let shutdownInProgress = false;

  const envCheck = validateEnv();
  if (envCheck.warnings.length) {
    envCheck.warnings.forEach((w) => console.warn(chalk.yellow(`⚠️ ENV: ${w}`)));
  }
  if (envCheck.errors.length) {
    envCheck.errors.forEach((e) => console.error(chalk.red(`❌ ENV: ${e}`)));
    process.exit(1);
  }

  console.log(chalk.cyan(`Build activo: ${buildInfo.fingerprint}`));
  logStructured("info", "bot.build", {
    version: buildInfo.version,
    commit: buildInfo.commit,
    shortCommit: buildInfo.shortCommit,
    deployTag: buildInfo.deployTag,
    fingerprint: buildInfo.fingerprint,
    commitSource: buildInfo.commitSource,
  });

  // ── Servidor fantasma para engañar al host (HolyHosting/Pterodactyl)
  const preferredPort = Number(process.env.SERVER_PORT || process.env.PORT || 8080);
  const host = '0.0.0.0';
  const maxPortAttempts = 20;

  function startGhostServer() {
    ghostServer = http.createServer(async (req, res) => {
      const url = req.url || "/";
      if (url.startsWith("/health") || url.startsWith("/ready")) {
        const healthy = healthState.mongoConnected && healthState.discordReady && !healthState.shuttingDown;
        const memUsage = process.memoryUsage();
        const payload = {
          status: healthy ? "ok" : "degraded",
          startedAt: new Date(healthState.startedAt).toISOString(),
          uptimeSec: Math.floor(process.uptime()),
          shuttingDown: healthState.shuttingDown,
          mongoConnected: healthState.mongoConnected,
          discordReady: healthState.discordReady,
          ghostPort: healthState.ghostPort,
          version: buildInfo.version,
          commit: buildInfo.commit,
          shortCommit: buildInfo.shortCommit,
          deployTag: buildInfo.deployTag,
          fingerprint: buildInfo.fingerprint,
          memory: {
            heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
            heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
            rssMB: Math.round(memUsage.rss / 1024 / 1024),
          },
          discord: {
            ping: client?.ws?.ping ?? null,
            guilds: client?.guilds?.cache?.size ?? 0,
          },
        };
        res.writeHead(healthy ? 200 : 503, { "Content-Type": "application/json" });
        res.end(JSON.stringify(payload));
        return;
      }

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Bot Activo - ${buildInfo.fingerprint}`);
    });

    const tryListen = (port, attempt = 1) => {
      const onError = (err) => {
        if (err.code === "EADDRINUSE" && attempt < maxPortAttempts) {
          const nextPort = port + 1;
          console.log(chalk.yellow(`Puerto ${port} en uso, probando ${nextPort}...`));
          tryListen(nextPort, attempt + 1);
          return;
        }
        console.error(chalk.red("No se pudo iniciar el servidor fantasma:"), err.message);
      };

      ghostServer.once("error", onError);

      ghostServer.listen(port, host, () => {
        ghostServer.removeListener("error", onError);
        healthState.ghostPort = port;
        if (port !== preferredPort) {
          console.log(chalk.yellow(`Puerto ${preferredPort} ocupado. Usando ${host}:${port} para servidor fantasma.`));
        }
        console.log(chalk.cyan(`Servidor fantasma escuchando en ${host}:${port} (host keepalive)`));
      });
    };

    tryListen(preferredPort);
  }

  startGhostServer();

  try {
    console.log(chalk.yellow("🔄 Conectando a MongoDB..."));
    await connectDB();
    healthState.mongoConnected = true;
    console.log(chalk.green("✅ MongoDB conectado correctamente\n"));
  } catch (error) {
    console.error(chalk.red("❌ Error fatal: No se pudo conectar a MongoDB"));
    process.exit(1);
  }
  // ── Cliente de Discord
  const messageContentEnabled = parseBoolean(process.env.MESSAGE_CONTENT_ENABLED, true);
  const guildPresencesEnabled = parseBoolean(process.env.GUILD_PRESENCES_ENABLED, true);
  const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ];
  if (messageContentEnabled) intents.push(GatewayIntentBits.MessageContent);
  if (guildPresencesEnabled) intents.push(GatewayIntentBits.GuildPresences);

  const client = new Client({
    intents,
    partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
  });

  client.commands = new Collection();
  client.once("clientReady", () => {
    healthState.discordReady = true;
  });
  
  const commandsPath = path.join(__dirname, "src/commands");
  console.log(chalk.blue("Cargando comandos desde:"), commandsPath);
  const { commands: loadedCommands, validationErrors } = loadAndValidateCommands(commandsPath);
  if (validationErrors.length) {
    validationErrors.forEach((e) => console.error(chalk.red(`[VALIDATION] ${e}`)));
    process.exit(1);
  }
  for (const command of loadedCommands) {
    client.commands.set(command.data.name, command);
    console.log(chalk.gray(`  Cargado: ${command.data.name}`));
  }
  console.log(chalk.green(`Total de comandos cargados: ${client.commands.size}\n`));


  // ── Cargar eventos automáticamente
  const eventsDir   = path.join(__dirname, "src/events");
  const eventFiles  = fs.readdirSync(eventsDir).filter(f => f.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(path.join(eventsDir, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  // ── Manejo de errores global
  process.on("unhandledRejection", (err) => {
    console.error(chalk.red("[ERROR]"), err?.message || err);
    recordError("process.unhandledRejection");
    logStructured("error", "process.unhandled_rejection", {
      error: err?.message || String(err),
    });
    shutdownGracefully("unhandledRejection").catch(() => process.exit(1));
  });
  process.on("uncaughtException", (err) => {
    console.error(chalk.red("[EXCEPTION]"), err?.message || err);
    recordError("process.uncaughtException");
    logStructured("error", "process.uncaught_exception", {
      error: err?.message || String(err),
    });
    shutdownGracefully("uncaughtException").catch(() => process.exit(1));
  });
  client.on("error", err => {
    console.error(chalk.red("[CLIENT ERROR]"), err?.message);
    recordError("client.error");
    logStructured("error", "discord.client.error", {
      error: err?.message || String(err),
    });
  });

  async function shutdownGracefully(signal) {
    if (shutdownInProgress) return;
    shutdownInProgress = true;
    healthState.shuttingDown = true;

    logStructured("warn", "process.shutdown.start", { signal });

    const forceTimer = setTimeout(() => {
      logStructured("error", "process.shutdown.force_exit", { signal });
      process.exit(1);
    }, Number(process.env.SHUTDOWN_FORCE_TIMEOUT_MS || 15000));

    try {
      try {
        if (client?.isReady()) {
          client.destroy();
          healthState.discordReady = false;
        }
      } catch (error) {
        logStructured("error", "process.shutdown.client_error", {
          signal,
          error: error?.message || String(error),
        });
      }

      try {
        if (ghostServer) {
          await new Promise((resolve) => ghostServer.close(() => resolve()));
        }
      } catch (error) {
        logStructured("error", "process.shutdown.http_error", {
          signal,
          error: error?.message || String(error),
        });
      }

      try {
        await closeDB();
        healthState.mongoConnected = false;
      } catch (error) {
        logStructured("error", "process.shutdown.db_error", {
          signal,
          error: error?.message || String(error),
        });
      }

      stopMetricsReporter();
      const summary = flushWindowSummary();
      if (summary.interactionsTotal) {
        logStructured("info", "metrics.final_window", summary);
      }

      logStructured("info", "process.shutdown.done", { signal });
      clearTimeout(forceTimer);
      process.exit(0);
    } catch (error) {
      clearTimeout(forceTimer);
      logStructured("error", "process.shutdown.error", {
        signal,
        error: error?.message || String(error),
      });
      process.exit(1);
    }
  }

  process.on("SIGINT", () => {
    shutdownGracefully("SIGINT").catch(() => process.exit(1));
  });
  process.on("SIGTERM", () => {
    shutdownGracefully("SIGTERM").catch(() => process.exit(1));
  });

  console.log(chalk.blue(`
╔══════════════════════════════════════════╗
║        🌌  TON618 (DISCORD)             ║
║      Ejecutándose Independiente          ║
╚══════════════════════════════════════════╝
`));
  // ── Iniciar sesión en Discord
  client.login(process.env.DISCORD_TOKEN).catch(err => {
    console.error(chalk.red("\n❌ Error al iniciar:"), err.message);
    console.error(chalk.yellow("💡 Verifica que DISCORD_TOKEN en .env sea correcto.\n"));
    process.exit(1);
  });
}
// Iniciar el bot
startBot();
