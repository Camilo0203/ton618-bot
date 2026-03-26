function toInt(value, fallback = null) {
  const n = Number(value);
  return Number.isInteger(n) ? n : fallback;
}

function parseOptionalBoolean(value) {
  if (value === undefined || value === null || value === "") return null;
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return undefined;
}

function resolveValidationMode(env = process.env, options = {}) {
  const requestedMode = String(
    options.mode
    || env.TON618_ENV_VALIDATION_MODE
    || env.NODE_ENV
    || ""
  ).trim().toLowerCase();

  if (["prod", "production"].includes(requestedMode)) {
    return "production";
  }

  return "default";
}

function validateEnv(env = process.env, options = {}) {
  const errors = [];
  const warnings = [];
  const mode = resolveValidationMode(env, options);
  const strictProduction = mode === "production";

  const token = env.DISCORD_TOKEN;
  if (!token || token.trim().length < 30) {
    errors.push("DISCORD_TOKEN is missing or invalid.");
  }

  const mongoUri = env.MONGO_URI;
  if (!mongoUri || !/^mongodb(\+srv)?:\/\//i.test(mongoUri.trim())) {
    errors.push("MONGO_URI is missing or invalid (must start with mongodb:// or mongodb+srv://).");
  }

  const mongoDb = env.MONGO_DB;
  if (!mongoDb || !mongoDb.trim()) {
    warnings.push("MONGO_DB is not set. Using default 'ton618_bot'.");
  }

  const ownerId = env.OWNER_ID || env.DISCORD_OWNER_ID;
  if (!ownerId) {
    if (strictProduction) {
      errors.push("OWNER_ID is required in production for privileged and operator-only flows.");
    } else {
      warnings.push("OWNER_ID is not set. Developer-only commands may not behave as expected.");
    }
  } else if (!/^\d{16,22}$/.test(ownerId.trim())) {
    if (strictProduction) {
      errors.push("OWNER_ID format looks invalid. Expected a Discord snowflake.");
    } else {
      warnings.push("OWNER_ID format looks invalid. Expected a Discord snowflake.");
    }
  }

  const port = env.SERVER_PORT || env.PORT;
  if (port !== undefined) {
    const parsed = toInt(port, null);
    if (parsed === null || parsed < 1 || parsed > 65535) {
      errors.push("SERVER_PORT/PORT must be an integer between 1 and 65535.");
    }
  }

  const messageContentEnabled = parseOptionalBoolean(env.MESSAGE_CONTENT_ENABLED);
  if (env.MESSAGE_CONTENT_ENABLED !== undefined && messageContentEnabled === undefined) {
    errors.push("MESSAGE_CONTENT_ENABLED must be a boolean-like value (true/false, 1/0, yes/no, on/off).");
  }

  const guildPresencesEnabled = parseOptionalBoolean(env.GUILD_PRESENCES_ENABLED);
  if (env.GUILD_PRESENCES_ENABLED !== undefined && guildPresencesEnabled === undefined) {
    errors.push("GUILD_PRESENCES_ENABLED must be a boolean-like value (true/false, 1/0, yes/no, on/off).");
  }

  const errorLogToFile = parseOptionalBoolean(env.ERROR_LOG_TO_FILE);
  if (env.ERROR_LOG_TO_FILE !== undefined && errorLogToFile === undefined) {
    errors.push("ERROR_LOG_TO_FILE must be a boolean-like value (true/false, 1/0, yes/no, on/off).");
  }

  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (supabaseUrl && !supabaseKey) {
    warnings.push("SUPABASE_URL is set but no Supabase key was found. Bot stats sync will stay disabled.");
  }
  if (!supabaseUrl && supabaseKey) {
    warnings.push("A Supabase key is set but SUPABASE_URL is missing. Bot stats sync will stay disabled.");
  }
  if (supabaseUrl && supabaseKey && !env.SUPABASE_SERVICE_ROLE_KEY) {
    if (strictProduction) {
      errors.push("SUPABASE_SERVICE_ROLE_KEY is required in production whenever Supabase integration is configured.");
    } else {
      warnings.push("SUPABASE_SERVICE_ROLE_KEY is missing. Bot stats reads may work, but writes can fail while RLS is enabled.");
    }
  }

  return { errors, warnings };
}

module.exports = {
  resolveValidationMode,
  validateEnv,
};
