function isRateLimitedType(interaction) {
  const isAnySelectMenu = typeof interaction.isAnySelectMenu === "function"
    ? interaction.isAnySelectMenu()
    : interaction.isStringSelectMenu();
  return (
    interaction.isChatInputCommand() ||
    interaction.isButton() ||
    isAnySelectMenu ||
    interaction.isModalSubmit()
  );
}

function getInteractionMetricKey(interaction) {
  const isAnySelectMenu = typeof interaction.isAnySelectMenu === "function"
    ? interaction.isAnySelectMenu()
    : interaction.isStringSelectMenu();
  if (interaction.isChatInputCommand()) return { kind: "command", name: interaction.commandName };
  if (interaction.isAutocomplete()) return { kind: "autocomplete", name: interaction.commandName };
  if (interaction.isButton()) return { kind: "button", name: interaction.customId };
  if (isAnySelectMenu) return { kind: "select", name: interaction.customId };
  if (interaction.isModalSubmit()) return { kind: "modal", name: interaction.customId };
  return { kind: "interaction", name: "unknown" };
}

function clampInt(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
}

function resolveCommandRateLimitConfig(guildSettings, commandName) {
  if (!guildSettings || guildSettings.command_rate_limit_enabled !== true) {
    return { enabled: false, maxActions: 0, windowSeconds: 0 };
  }

  let maxActions = clampInt(guildSettings.command_rate_limit_max_actions, 1, 50, 4);
  let windowSeconds = clampInt(guildSettings.command_rate_limit_window_seconds, 1, 300, 20);

  const overrides = guildSettings.command_rate_limit_overrides;
  if (overrides && typeof overrides === "object" && !Array.isArray(overrides)) {
    const override = overrides[commandName];
    if (override !== undefined) {
      if (override && typeof override === "object" && !Array.isArray(override)) {
        if (override.enabled === false) {
          return { enabled: false, maxActions, windowSeconds };
        }
        maxActions = clampInt(override.max_actions, 1, 50, maxActions);
        windowSeconds = clampInt(override.window_seconds, 1, 300, windowSeconds);
      } else if (typeof override === "number" || typeof override === "string") {
        maxActions = clampInt(override, 1, 50, maxActions);
      }
    }
  }

  return { enabled: true, maxActions, windowSeconds };
}

module.exports = {
  isRateLimitedType,
  getInteractionMetricKey,
  clampInt,
  resolveCommandRateLimitConfig,
};
