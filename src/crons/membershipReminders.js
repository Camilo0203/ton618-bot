"use strict";

const cron = require("node-cron");
const { processMembershipReminders } = require("../utils/membershipReminders");
const logger = require("../utils/structuredLogger");

/**
 * Cron job para enviar recordatorios de membresía
 * Se ejecuta cada hora para verificar guilds con membresía próxima a vencer
 */
function register(client) {
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Ejecutar solo a las 10:00 AM (hora del servidor) para no molestar
    // O si es modo desarrollo, ejecutar siempre
    const isDevMode = process.env.NODE_ENV === "development";

    if (!isDevMode && (hour !== 10 || minute > 5)) {
      // Solo a las 10:00 AM, con tolerancia de 5 minutos
      return;
    }

    logger.info("cron.membership_reminders", "Starting reminder check", { timestamp: now.toISOString() });

    try {
      const results = await processMembershipReminders(client);

      logger.info("cron.membership_reminders", "Reminder check completed", { checked: results.checked, reminded: results.reminded, errors: results.errors });

      if (results.reminded > 0) {
        logger.debug("cron.membership_reminders", "Reminders sent", { details: results.details.filter(d => d.sent) });
      }
    } catch (error) {
      logger.error("cron.membership_reminders", "Fatal error during reminder check", { error: error?.message || String(error) });
    }
  });
}

module.exports = { register };
