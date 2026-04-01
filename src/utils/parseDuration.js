"use strict";

/**
 * Parse duration strings like "1h", "2d", "1w" into milliseconds
 * @param {string} durationStr - Duration string (e.g., "1h", "30m", "7d")
 * @returns {number|null} Duration in milliseconds, or null if invalid
 */
function parseDuration(durationStr) {
  if (!durationStr || typeof durationStr !== 'string') {
    return null;
  }

  const match = durationStr.match(/^(\d+)([smhdw])$/i);
  if (!match) {
    return null;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  const multipliers = {
    s: 1000,                    // seconds
    m: 60 * 1000,              // minutes
    h: 60 * 60 * 1000,         // hours
    d: 24 * 60 * 60 * 1000,    // days
    w: 7 * 24 * 60 * 60 * 1000 // weeks
  };

  if (!multipliers[unit]) {
    return null;
  }

  return value * multipliers[unit];
}

/**
 * Format milliseconds into a human-readable duration
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration (e.g., "2 hours", "3 days")
 */
function formatDuration(ms) {
  if (!ms || ms < 0) {
    return "0 seconds";
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  }
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Get a future timestamp from a duration string
 * @param {string} durationStr - Duration string (e.g., "1h", "2d")
 * @returns {Date|null} Future date, or null if invalid
 */
function getFutureDate(durationStr) {
  const ms = parseDuration(durationStr);
  if (!ms) {
    return null;
  }

  return new Date(Date.now() + ms);
}

/**
 * Get remaining time as a formatted string
 * @param {Date|string} endDate - End date
 * @returns {string} Formatted remaining time
 */
function getTimeRemaining(endDate) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end - now;

  if (diff <= 0) {
    return "Ended";
  }

  return formatDuration(diff);
}

/**
 * Validate duration string
 * @param {string} durationStr - Duration string to validate
 * @param {number} minMs - Minimum duration in milliseconds (optional)
 * @param {number} maxMs - Maximum duration in milliseconds (optional)
 * @returns {{valid: boolean, error?: string, ms?: number}}
 */
function validateDuration(durationStr, minMs = null, maxMs = null) {
  const ms = parseDuration(durationStr);
  
  if (!ms) {
    return {
      valid: false,
      error: "Invalid duration format. Use format like: 30s, 5m, 2h, 1d, 1w"
    };
  }

  if (minMs !== null && ms < minMs) {
    return {
      valid: false,
      error: `Duration must be at least ${formatDuration(minMs)}`
    };
  }

  if (maxMs !== null && ms > maxMs) {
    return {
      valid: false,
      error: `Duration cannot exceed ${formatDuration(maxMs)}`
    };
  }

  return { valid: true, ms };
}

module.exports = {
  parseDuration,
  formatDuration,
  getFutureDate,
  getTimeRemaining,
  validateDuration,
};
