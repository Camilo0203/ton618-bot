const {
  settings,
  verifSettings,
  welcomeSettings,
  suggestSettings,
  modlogSettings,
  configBackups,
} = require("./database");
const { buildConfigBackup, parseAndSanitizeBackup } = require("./configBackup");

async function buildCurrentConfigSnapshot(guildId) {
  const [s, v, w, sg, m] = await Promise.all([
    settings.get(guildId),
    verifSettings.get(guildId),
    welcomeSettings.get(guildId),
    suggestSettings.get(guildId),
    modlogSettings.get(guildId),
  ]);

  return buildConfigBackup({
    settings: s,
    verify: v,
    welcome: w,
    suggest: sg,
    modlogs: m,
  });
}

async function saveCurrentConfigBackup({ guildId, actorId = null, source = "manual" }) {
  const snapshot = await buildCurrentConfigSnapshot(guildId);
  return configBackups.create(guildId, snapshot, { actorId, source });
}

async function applyBackupSnapshot(guildId, snapshot) {
  const sanitized = parseAndSanitizeBackup(JSON.stringify(snapshot));
  const syncOptions = {
    skipDashboardSync: true,
    dashboardSyncReason: "configBackup.restore",
  };
  await settings.update(guildId, sanitized.settings, syncOptions);
  await verifSettings.update(guildId, sanitized.verify, syncOptions);
  await welcomeSettings.update(guildId, sanitized.welcome, syncOptions);
  await suggestSettings.update(guildId, sanitized.suggest, syncOptions);
  await modlogSettings.update(guildId, sanitized.modlogs, syncOptions);
  return sanitized;
}

module.exports = {
  buildCurrentConfigSnapshot,
  saveCurrentConfigBackup,
  applyBackupSnapshot,
};
