const DEFAULT_DISABLED_COMMAND_FILES = Object.freeze([
  "public/utility/cumpleanos.js",
  "public/utility/embed.js",
  "public/economy/levels.js",
  "public/economy/rank.js",
  "public/utility/giveaway.js",
  "public/utility/perfil.js",
  "public/utility/poll.js",
  "public/utility/suggest.js",
]);

function normalizePath(value) {
  return String(value || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\.\//, "");
}

function parseListEnv(rawValue) {
  if (!rawValue || typeof rawValue !== "string") return [];
  return rawValue
    .split(",")
    .map((item) => normalizePath(item))
    .filter(Boolean);
}

function resolveCommandFileFlags(env = process.env) {
  const disabled = new Set(DEFAULT_DISABLED_COMMAND_FILES.map((item) => normalizePath(item)));
  const enabledOverrides = parseListEnv(env.COMMANDS_ENABLED_FILES);
  const disabledOverrides = parseListEnv(env.COMMANDS_DISABLED_FILES);

  for (const file of enabledOverrides) {
    disabled.delete(file);
  }
  for (const file of disabledOverrides) {
    disabled.add(file);
  }

  return {
    disabledFiles: disabled,
  };
}

module.exports = {
  DEFAULT_DISABLED_COMMAND_FILES,
  parseListEnv,
  resolveCommandFileFlags,
};
