/**
 * Parse environment variable as boolean.
 * Accepts: true/false, 1/0, yes/no, on/off (case-insensitive)
 * @param value - Environment variable value
 * @param fallback - Default value if undefined/null/empty
 * @returns Parsed boolean or fallback
 */
export function parseBoolean(value: unknown, fallback: boolean = false): boolean {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

/**
 * Parse a value into a valid TCP port or fallback.
 * @param value - Raw port value
 * @param fallback - Default port if invalid
 * @returns Valid port number or fallback
 */
export function parsePort(value: unknown, fallback: number | null = null): number | null {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = Number(value);
  if (!Number.isInteger(normalized) || normalized < 1 || normalized > 65535) {
    return fallback;
  }
  return normalized;
}

interface ResolveRuntimePortOptions {
  defaultPort?: number;
}

/**
 * Resolve the runtime port considering platform overrides and environment.
 * @param env - Environment variables object
 * @param options - Resolution options
 * @returns Resolved port number
 */
export function resolveRuntimePort(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
  options: ResolveRuntimePortOptions = {}
): number {
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
