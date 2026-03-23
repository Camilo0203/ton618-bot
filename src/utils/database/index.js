"use strict";

const { connectDB, ensureIndexes, getDB, closeDB, isDbUnavailableError, toDbUnavailableError } = require("./core");
const { logError, validateInput, sanitizeString, sanitizeChannelName } = require("./helpers");
const { tickets } = require("./tickets");
const { ticketEvents } = require("./ticketEvents");
const { notes } = require("./notes");
const { blacklist, modlogSettings, warnings } = require("./moderation");
const { settings } = require("./settings");
const { staffStats, staffRatings, staffStatus } = require("./staff");
const { levels, levelSettings } = require("./levels");
const { reminders } = require("./reminders");
const { giveaways } = require("./giveaways");
const { autoResponses } = require("./autoResponses");
const { polls } = require("./polls");
const { tags } = require("./tags");
const { cooldowns } = require("./cooldowns");
const { verifSettings, verifCodes, verifLogs } = require("./verification");
const { welcomeSettings } = require("./welcome");
const { suggestSettings, suggestions } = require("./suggestions");
const { configBackups } = require("./configBackups");
const { auditLogs } = require("./auditLogs");
const { alerts } = require("./alerts");

module.exports = {
  connectDB,
  ensureIndexes,
  getDB,
  closeDB,
  isDbUnavailableError,
  toDbUnavailableError,
  logError,
  validateInput,
  sanitizeString,
  sanitizeChannelName,
  tickets,
  ticketEvents,
  notes,
  blacklist,
  settings,
  staffStats,
  staffRatings,
  tags,
  cooldowns,
  staffStatus,
  verifSettings,
  verifCodes,
  welcomeSettings,
  modlogSettings,
  levelSettings,
  levels,
  reminders,
  giveaways,
  suggestSettings,
  suggestions,
  polls,
  autoResponses,
  verifLogs,
  configBackups,
  auditLogs,
  warnings,
  alerts,
};
