const cron = require("node-cron");
const chalk = require("../../chalk-compat");

const { startAlertChecker } = require("../utils/alertChecker");
const { startMetricsReporter, logStructured } = require("../utils/observability");
const { startBotStatsSync } = require("../utils/botStatsSync");
const { startDashboardBridge } = require("../utils/dashboardBridgeSync");
const { syncAllGuildLiveStats } = require("../utils/liveStatsChannels");
const { startHealthMonitor } = require("../utils/healthMonitor");
const { runSingleFlight } = require("../utils/guildTaskRunner");
const { safeRun } = require("../crons/common");
const { createTask: createRemindersTask } = require("../crons/reminders");
const { createTask: createPollsTask } = require("../crons/polls");

const cronRegistrars = [
  require("../crons/presence"),
  require("../crons/dashboardSync"),
  require("../crons/autoClose"),
  require("../crons/slaAlerts"),
  require("../crons/slaEscalation"),
  require("../crons/smartPing"),
  require("../crons/dailySlaReport"),
  require("../crons/weeklyReports"),
  require("../crons/verificationAutoKick"),
  require("../crons/deletedChannels"),
  require("../crons/configBackups"),
  require("../crons/auditCleanup"),
  require("../crons/botStats"),
];

function buildMinuteOpsTick({
  safeRunFn,
  runSingleFlightFn,
  remindersTask,
  pollsTask,
}) {
  return async function runMinuteOpsTick() {
    await safeRunFn("MINUTE REMINDERS", () => runSingleFlightFn("reminders.dispatch", remindersTask));
    await safeRunFn("MINUTE POLLS", () => runSingleFlightFn("polls.finalize_expired", pollsTask));
  };
}

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    console.log(chalk.green(`\nConectado como ${chalk.bold(client.user.tag)}`));
    console.log(chalk.blue(`Servidores: ${chalk.bold(client.guilds.cache.size)}`));
    console.log(chalk.yellow("TON618 listo\n"));

    logStructured("info", "bot.ready", {
      botTag: client.user.tag,
      guilds: client.guilds.cache.size,
    });

    startMetricsReporter({
      intervalMs: Number(process.env.METRICS_REPORT_INTERVAL_MS || 300000),
    });
    startBotStatsSync(client);
    startDashboardBridge(client);
    await syncAllGuildLiveStats(client, { hydrateMembers: false });
    await startHealthMonitor(client);

    for (const registrar of cronRegistrars) {
      registrar.register(client);
    }

    const runMinuteOpsTick = buildMinuteOpsTick({
      safeRunFn: safeRun,
      runSingleFlightFn: runSingleFlight,
      remindersTask: createRemindersTask(client),
      pollsTask: createPollsTask(client),
    });

    cron.schedule("* * * * *", () => {
      void runMinuteOpsTick();
    });

    console.log(chalk.green("Todos los cron jobs activos"));

    try {
      await startAlertChecker(client);
      console.log(chalk.green("Sistema de alertas iniciado"));
    } catch (error) {
      console.error(chalk.red("Error al iniciar el sistema de alertas:"), error.message);
    }
  },
};

module.exports.__test = {
  buildMinuteOpsTick,
};
