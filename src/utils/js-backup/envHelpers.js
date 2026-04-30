/**
 * Parse environment variable as boolean.
 * Accepts: true/false, 1/0, yes/no, on/off (case-insensitive)
 * @param {*} value - Environment variable value
 * @param {boolean} fallback - Default value if undefined/null/empty
 * @returns {boolean}
 */
function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

function parsePort(value, fallback = null) {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = Number(value);
  if (!Number.isInteger(normalized) || normalized < 1 || normalized > 65535) {
    return fallback;
  }
  return normalized;
}

function resolveRuntimePort(env = process.env, options = {}) {
  const defaultPort = parsePort(options.defaultPort, 80) || 80;
  const requestedMode = String(
    env.TON618_ENV_VALIDATION_MODE
    || env.NODE_ENV
    || ""
  ).trim().toLowerCase();
  const strictProduction = ["prod", "production"].includes(requestedMode);

  const platformPort = parsePort(env.PORT, null);
  if (platformPort !== null) return platformPort;

  if (strictProduction) {
    return defaultPort;
  }

  const localPort = parsePort(env.SERVER_PORT, null);
  if (localPort !== null) return localPort;

  return defaultPort;
}

module.exports = {
  parseBoolean,
  parsePort,
  resolveRuntimePort,
};
