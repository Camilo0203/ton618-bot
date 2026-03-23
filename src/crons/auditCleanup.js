"use strict";

const cron = require("node-cron");
const { auditLogs } = require("../utils/database");
const { logStructured } = require("../utils/observability");

function register() {
  cron.schedule("30 3 * * *", async () => {
    const retentionDays = Math.max(7, Number(process.env.AUDIT_LOG_RETENTION_DAYS || 90));
    const deleted = await auditLogs.cleanupOlderThan(retentionDays);
    if (deleted > 0) {
      logStructured("info", "audit.cleanup", { deleted, retentionDays });
    }
  });
}

module.exports = { register };
