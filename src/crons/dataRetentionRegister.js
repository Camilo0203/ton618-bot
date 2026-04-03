"use strict";

/**
 * Cron job para Data Retention
 * Ejecuta limpieza de datos antiguos diariamente
 */

const cron = require("node-cron");
const chalk = require("../../chalk-compat");
const { runGlobalDataRetention } = require("./dataRetention");
const { logStructured } = require("../utils/observability");

const CRON_SCHEDULE = "0 3 * * *"; // 3:00 AM todos los días

function register(client) {
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log(chalk.blue("[DATA RETENTION] Iniciando limpieza programada..."));

    try {
      const results = await runGlobalDataRetention(client);
      console.log(chalk.green(`[DATA RETENTION] Completado: ${results.totalDeleted} registros eliminados en ${results.durationMs}ms`));

      logStructured("info", "data_retention.cron_completed", {
        totalGuilds: results.totalGuilds,
        processed: results.processed,
        failed: results.failed,
        totalDeleted: results.totalDeleted,
        durationMs: results.durationMs,
      });
    } catch (error) {
      console.error(chalk.red("[DATA RETENTION] Error:"), error.message);
      logStructured("error", "data_retention.cron_failed", {
        error: error.message,
        stack: error.stack,
      });
    }
  });

  console.log(chalk.blue(`[DATA RETENTION] Programado para ${CRON_SCHEDULE} (3:00 AM diario)`));
}

module.exports = { register };
