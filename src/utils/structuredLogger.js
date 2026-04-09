"use strict";

/**
 * Structured Logger - Replaces console.log for production safety
 * Only logs appropriate levels based on environment
 */

const chalk = require("../../chalk-compat");
const { parseBoolean } = require("./envHelpers");

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const COLORS = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "gray",
};

function getMinLogLevel() {
  const envLevel = String(process.env.LOG_LEVEL || "").toLowerCase();
  if (LOG_LEVELS[envLevel] !== undefined) {
    return LOG_LEVELS[envLevel];
  }
  // Default: error/warn in production, info in development
  return process.env.NODE_ENV === "production" ? LOG_LEVELS.warn : LOG_LEVELS.info;
}

function shouldLog(level) {
  return LOG_LEVELS[level] <= getMinLogLevel();
}

function formatTimestamp() {
  return new Date().toISOString();
}

function createStructuredLog(level, context, message, meta = {}) {
  return {
    timestamp: formatTimestamp(),
    level,
    context,
    message,
    ...meta,
    env: process.env.NODE_ENV || "development",
  };
}

/**
 * Log a structured message
 * @param {string} level - error, warn, info, debug
 * @param {string} context - dot-notation context (e.g., "startup.mongo")
 * @param {string} message - human readable message
 * @param {object} meta - additional metadata
 */
function log(level, context, message, meta = {}) {
  if (!shouldLog(level)) {
    return;
  }

  const structured = createStructuredLog(level, context, message, meta);

  // In production with JSON logs enabled, output JSON
  const jsonLogsEnabled = parseBoolean(process.env.ENABLE_JSON_LOGS, false);
  if (process.env.NODE_ENV === "production" && jsonLogsEnabled) {
    console.log(JSON.stringify(structured));
    return;
  }

  // Development/pretty mode
  const colorFn = chalk[COLORS[level]] || ((x) => x);
  const prefix = `[${structured.timestamp}] [${level.toUpperCase()}] [${context}]`;

  if (level === "error") {
    console.error(colorFn(prefix), message);
    if (meta.error || meta.stack) {
      console.error(colorFn("  →"), meta.error || meta.stack);
    }
  } else if (level === "warn") {
    console.warn(colorFn(prefix), message);
  } else {
    console.log(colorFn(prefix), message);
  }

  // Log additional metadata in debug mode
  if (level === "debug" && Object.keys(meta).length > 0) {
    console.log(colorFn("  →"), meta);
  }
}

// Convenience methods
const logger = {
  error: (context, message, meta) => log("error", context, message, meta),
  warn: (context, message, meta) => log("warn", context, message, meta),
  info: (context, message, meta) => log("info", context, message, meta),
  debug: (context, message, meta) => log("debug", context, message, meta),

  // Legacy compatibility with logStructured
  structured: (level, context, meta = {}) => {
    log(level, context, meta.message || "", meta);
  },

  // Startup logging helper
  startup: (stage, message, type = "info") => {
    const colorFn = chalk[type] || chalk.blue;
    if (shouldLog("info")) {
      console.log(colorFn(`[startup:${stage}] ${message}`));
    }
  },
};

module.exports = logger;
