"use strict";

const { ObjectId } = require("mongodb");
const chalk = require("../../../chalk-compat");
const { buildTicketStatsPipeline, mapTicketStatsResult } = require("./ticketStats");
const { buildSlaMetrics } = require("./ticketSlaMetrics");
const { resolveTicketSlaMinutes } = require("../ticketSlaRules");
const { writeErrorLogEntry } = require("../errorLogger");
const {
  buildSettingsDefaults,
  buildLevelSettingsDefaults,
  buildVerifSettingsDefaults,
  buildWelcomeSettingsDefaults,
  buildModlogSettingsDefaults,
  buildSuggestSettingsDefaults,
} = require("./defaults");
const {
  sanitizeSettingsRecord,
  sanitizeSettingsPatch,
  hasSettingsDrift,
} = require("../settingsSchema");

const AUTO_RESPONSES_CACHE_TTL_MS = 30 * 1000;
const autoResponsesEnabledCache = new Map();

function now() { return new Date(); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function toValidDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toObjectId(value) {
  if (!value) return null;
  if (value instanceof ObjectId) return value;
  try {
    return new ObjectId(String(value));
  } catch {
    return null;
  }
}

function hydratePollRecord(poll) {
  if (!poll) return null;
  const id = poll.id || (poll._id && typeof poll._id.toString === "function" ? poll._id.toString() : null);
  return id ? { ...poll, id } : { ...poll };
}

function hydratePollList(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => hydratePollRecord(item)).filter(Boolean);
}

function getAutoResponsesCache(guildId) {
  const cached = autoResponsesEnabledCache.get(guildId);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    autoResponsesEnabledCache.delete(guildId);
    return null;
  }
  return cached.items;
}

function setAutoResponsesCache(guildId, items) {
  autoResponsesEnabledCache.set(guildId, {
    items,
    expiresAt: Date.now() + AUTO_RESPONSES_CACHE_TTL_MS,
  });
  return items;
}

function clearAutoResponsesCache(guildId) {
  if (!guildId) {
    autoResponsesEnabledCache.clear();
    return;
  }
  autoResponsesEnabledCache.delete(guildId);
}

async function logError(context, error, extra = {}) {
  const errorLog = {
    context,
    message: error.message || String(error),
    stack: error.stack,
    ...extra,
    timestamp: now(),
  };

  console.error(chalk.red("[ERROR] " + context + ":"), error.message);

  try {
    await writeErrorLogEntry(errorLog);
  } catch {
    // Silencioso si falla el logging
  }

  return errorLog;
}

function validateInput(value, type, options = {}) {
  const { minLength, maxLength, pattern, allowedChars } = options;

  if (value === undefined || value === null) {
    if (options.required) throw new Error("Campo requerido");
    return value;
  }

  if (typeof value === "string") {
    if (minLength && value.length < minLength) {
      throw new Error("M?nimo " + minLength + " caracteres");
    }
    if (maxLength && value.length > maxLength) {
      throw new Error("M?ximo " + maxLength + " caracteres");
    }
    if (pattern && !pattern.test(value)) {
      throw new Error("Formato inv?lido");
    }
    if (allowedChars) {
      const invalid = value.split("").filter((char) => !allowedChars.includes(char));
      if (invalid.length > 0) {
        throw new Error("Caracteres no permitidos: " + invalid.join(", "));
      }
    }
  }

  return value;
}

function sanitizeString(str, maxLen = 1000) {
  if (!str || typeof str !== "string") return "";
  return str.slice(0, maxLen).trim();
}

function sanitizeChannelName(name) {
  if (!name || typeof name !== "string") return "";
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 32);
}

function normalizeTicketWorkflowStatus(value, fallback = "new") {
  const allowed = new Set([
    "new",
    "triage",
    "waiting_user",
    "waiting_staff",
    "escalated",
    "resolved",
    "closed",
  ]);
  const normalized = String(value || "").trim().toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeTicketQueueType(value, fallback = "support") {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "community") return "community";
  if (normalized === "support") return "support";
  return fallback;
}

function normalizeTicketPriority(value, fallback = "normal") {
  const allowed = new Set(["low", "normal", "high", "urgent"]);
  const normalized = String(value || "").trim().toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeTicketTags(value) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((tag) => sanitizeString(String(tag || ""), 40).toLowerCase())
        .filter(Boolean)
    )
  ).slice(0, 20);
}

function inferTicketQueueType(categoryId) {
  const normalized = String(categoryId || "").trim().toLowerCase();
  if (!normalized) return "support";
  if (["report", "partnership", "staff", "association", "staff_app"].includes(normalized)) {
    return "community";
  }
  return "support";
}

module.exports = {
  ObjectId,
  buildTicketStatsPipeline,
  mapTicketStatsResult,
  buildSlaMetrics,
  resolveTicketSlaMinutes,
  buildSettingsDefaults,
  buildLevelSettingsDefaults,
  buildVerifSettingsDefaults,
  buildWelcomeSettingsDefaults,
  buildModlogSettingsDefaults,
  buildSuggestSettingsDefaults,
  sanitizeSettingsRecord,
  sanitizeSettingsPatch,
  hasSettingsDrift,
  now,
  uid,
  toValidDate,
  toObjectId,
  hydratePollRecord,
  hydratePollList,
  getAutoResponsesCache,
  setAutoResponsesCache,
  clearAutoResponsesCache,
  logError,
  validateInput,
  sanitizeString,
  sanitizeChannelName,
  normalizeTicketWorkflowStatus,
  normalizeTicketQueueType,
  normalizeTicketPriority,
  normalizeTicketTags,
  inferTicketQueueType,
};
