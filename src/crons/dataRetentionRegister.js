"use strict";

/**
 * Cron job para Data Retention
 * Ejecuta limpieza de datos antiguos diariamente
 */

const cron = require("node-cron");
const { runGlobalDataRetention } = require("./dataRetention");
const { logStructured } = require("../utils/observability");
const logger = require("../utils/structuredLogger");

const CRON_SCHEDULE = "0 3 * * *"; // 3:00 AM todos los días

function register(client) {
  cron.schedule(CRON_SCHEDULE, async () => {
    logger.info("cron.data_retention", "Iniciando limpieza programada");

    try {
      const results = await runGlobalDataRetention(client);
      logger.info("cron.data_retention", `Completado: ${results.totalDeleted} registros eliminados en ${results.durationMs}ms`);

      logStructured("info", "data_retention.cron_completed", {
        totalGuilds: results.totalGuilds,
        processed: results.processed,
        failed: results.failed,
        totalDeleted: results.totalDeleted,
        durationMs: results.durationMs,
      });
    } catch (error) {
      logger.error("cron.data_retention", "Error durante limpieza", { error: error.message });
      logStructured("error", "data_retention.cron_failed", {
        error: error.message,
        stack: error.stack,
      });
    }
  });

  logger.info("cron.data_retention", `Programado para ${CRON_SCHEDULE} (3:00 AM diario)`);
}

module.exports = { register };
