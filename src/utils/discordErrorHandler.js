"use strict";

/**
 * Discord API Error Handler
 * Provides standardized error handling, logging, and user-friendly messages
 * for all Discord API operations.
 */

const { DiscordAPIError, RESTJSONErrorCodes } = require("discord.js");
const { logStructured } = require("./observability");

// Error severity levels
const SEVERITY = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
};

// Common Discord error codes and their user-friendly messages
const ERROR_MESSAGES = {
  [RESTJSONErrorCodes.UnknownChannel]: {
    userMessage: "channel_not_found",
    severity: SEVERITY.WARNING,
    logMessage: "Channel not found or deleted",
  },
  [RESTJSONErrorCodes.UnknownMember]: {
    userMessage: "member_not_found",
    severity: SEVERITY.WARNING,
    logMessage: "Member not found in guild",
  },
  [RESTJSONErrorCodes.UnknownRole]: {
    userMessage: "role_not_found",
    severity: SEVERITY.WARNING,
    logMessage: "Role not found",
  },
  [RESTJSONErrorCodes.MissingPermissions]: {
    userMessage: "bot_missing_permissions",
    severity: SEVERITY.ERROR,
    logMessage: "Bot lacks required permissions",
  },
  [RESTJSONErrorCodes.MissingAccess]: {
    userMessage: "bot_missing_access",
    severity: SEVERITY.ERROR,
    logMessage: "Bot lacks access to resource",
  },
  [RESTJSONErrorCodes.GuildOwner]: {
    userMessage: "cannot_modify_owner",
    severity: SEVERITY.WARNING,
    logMessage: "Cannot modify guild owner",
  },
  [RESTJSONErrorCodes.InvalidPermissions]: {
    userMessage: "invalid_permissions",
    severity: SEVERITY.ERROR,
    logMessage: "Invalid permissions specified",
  },
  [RESTJSONErrorCodes.MaxGuilds]: {
    userMessage: "max_guilds_reached",
    severity: SEVERITY.ERROR,
    logMessage: "Maximum guild limit reached",
  },
  [RESTJSONErrorCodes.MaxRoles]: {
    userMessage: "max_roles_reached",
    severity: SEVERITY.ERROR,
    logMessage: "Maximum roles limit reached",
  },
  [RESTJSONErrorCodes.MaxChannels]: {
    userMessage: "max_channels_reached",
    severity: SEVERITY.ERROR,
    logMessage: "Maximum channels limit reached",
  },
  [RESTJSONErrorCodes.BotBeingRateLimited]: {
    userMessage: "rate_limited",
    severity: SEVERITY.WARNING,
    logMessage: "Bot is being rate limited",
  },
  [RESTJSONErrorCodes.TooManyMessages]: {
    userMessage: "too_many_messages",
    severity: SEVERITY.WARNING,
    logMessage: "Too many messages to delete",
  },
  [RESTJSONErrorCodes.CannotDeleteCommunity]: {
    userMessage: "cannot_delete_community",
    severity: SEVERITY.ERROR,
    logMessage: "Cannot delete community guild",
  },
  [RESTJSONErrorCodes.CannotModifySystemMessage]: {
    userMessage: "cannot_modify_message",
    severity: SEVERITY.WARNING,
    logMessage: "Cannot modify system message",
  },
};

/**
 * Parse Discord API error and return structured information
 * @param {Error} error - The error thrown by Discord API
 * @param {Object} context - Additional context about the operation
 * @returns {Object} - Structured error information
 */
function parseDiscordError(error, context = {}) {
  // Default error structure
  const result = {
    isDiscordError: false,
    code: null,
    status: null,
    severity: SEVERITY.ERROR,
    userMessage: "unknown_error",
    logMessage: error?.message || "Unknown error",
    shouldRetry: false,
    retryAfter: null,
  };

  if (error instanceof DiscordAPIError) {
    result.isDiscordError = true;
    result.code = error.code;
    result.status = error.status;

    // Check for known error codes
    const knownError = ERROR_MESSAGES[error.code];
    if (knownError) {
      result.userMessage = knownError.userMessage;
      result.logMessage = knownError.logMessage;
      result.severity = knownError.severity;
    } else {
      // Unknown Discord error - use the message
      result.logMessage = `Discord API Error ${error.code}: ${error.message}`;
    }

    // Determine if retry is appropriate
    result.shouldRetry = error.status >= 500 || error.code === RESTJSONErrorCodes.BotBeingRateLimited;
    result.retryAfter = error.retryAfter || null;
  } else if (error?.code === "ECONNRESET" || error?.code === "ETIMEDOUT") {
    result.logMessage = `Network error: ${error.message}`;
    result.severity = SEVERITY.WARNING;
    result.shouldRetry = true;
  } else if (error?.name === "AbortError") {
    result.logMessage = `Request aborted: ${error.message}`;
    result.severity = SEVERITY.WARNING;
    result.shouldRetry = true;
  }

  return result;
}

/**
 * Log Discord error with structured logging
 * @param {Error} error - The error
 * @param {string} operation - The operation being performed
 * @param {Object} context - Additional context
 */
function logDiscordError(error, operation, context = {}) {
  const parsed = parseDiscordError(error, context);

  logStructured(parsed.severity, "discord.api.error", {
    operation,
    ...context,
    errorCode: parsed.code,
    errorStatus: parsed.status,
    message: parsed.logMessage,
    shouldRetry: parsed.shouldRetry,
  });

  return parsed;
}

/**
 * Safely execute a Discord API operation with standardized error handling
 * @param {Function} operation - Async function to execute
 * @param {string} operationName - Name of the operation for logging
 * @param {Object} context - Additional context
 * @param {Object} options - Execution options
 * @returns {Promise<{success: boolean, data?: any, error?: Object}>}
 */
async function safeDiscordOperation(operation, operationName, context = {}, options = {}) {
  const { maxRetries = 0, retryDelay = 1000, silent = false } = options;
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      lastError = error;
      const parsed = parseDiscordError(error, context);

      if (!silent) {
        logDiscordError(error, operationName, {
          ...context,
          attempt: attempt + 1,
          maxRetries,
        });
      }

      // Check if we should retry
      if (attempt < maxRetries && parsed.shouldRetry) {
        const delay = parsed.retryAfter ? parsed.retryAfter * 1000 : retryDelay * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }

      // Don't retry - return error
      return {
        success: false,
        error: parsed,
        rawError: error,
      };
    }
  }

  return {
    success: false,
    error: parseDiscordError(lastError, context),
    rawError: lastError,
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a standardized catch handler for Discord operations
 * @param {string} operationName - Name for logging
 * @param {Object} context - Context data
 * @returns {Function} - Error handler function
 */
function createErrorHandler(operationName, context = {}) {
  return (error) => {
    const parsed = logDiscordError(error, operationName, context);
    return parsed;
  };
}

/**
 * Get user-friendly error message key based on error
 * @param {Error} error - Discord API error
 * @returns {string} - Translation key for user message
 */
function getUserErrorMessage(error) {
  const parsed = parseDiscordError(error);
  return parsed.userMessage;
}

module.exports = {
  parseDiscordError,
  logDiscordError,
  safeDiscordOperation,
  createErrorHandler,
  getUserErrorMessage,
  SEVERITY,
  ERROR_MESSAGES,
};
