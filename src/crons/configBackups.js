"use strict";

const cron = require("node-cron");
const { configBackups } = require("../utils/database");
const { saveCurrentConfigBackup } = require("../utils/configBackupVersioning");
const { logStructured } = require("../utils/observability");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");

function register(client) {
  if (process.env.CONFIG_AUTO_BACKUP_ENABLED === "false") {
    return;
  }

  const backupCron = process.env.CONFIG_AUTO_BACKUP_CRON || "0 */4 * * *";
  cron.schedule(backupCron, async () => {
    await runSingleFlight("config.auto_backup", async () => {
      let created = 0;
      await runGuildTask(client, "config.auto_backup", async (guild) => {
        const backup = await saveCurrentConfigBackup({
          guildId: guild.id,
          actorId: client.user.id,
          source: "auto_schedule",
        });
        if (backup?.backup_id) created += 1;
      });

      const deleted = await configBackups.cleanupAll();
      logStructured("info", "config.backup.auto", {
        created,
        deleted,
        guilds: client.guilds.cache.size,
        cron: backupCron,
      });
    });
  });
}

module.exports = { register };
