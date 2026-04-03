"use strict";

const cron = require("node-cron");
const { processMembershipReminders } = require("../utils/membershipReminders");

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

    console.log(`[MEMBERSHIP CRON] Starting reminder check at ${now.toISOString()}`);

    try {
      const results = await processMembershipReminders(client);

      console.log(`[MEMBERSHIP CRON] Completed: ${results.checked} guilds checked, ${results.reminded} reminders sent, ${results.errors} errors`);

      if (results.reminded > 0) {
        console.log("[MEMBERSHIP CRON] Details:", results.details.filter(d => d.sent));
      }
    } catch (error) {
      console.error("[MEMBERSHIP CRON] Fatal error:", error);
    }
  });
}

module.exports = { register };
