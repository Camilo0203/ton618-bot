"use strict";

const { connectDB, ensureIndexes, getDB, pingDB, closeDB, isDbUnavailableError, toDbUnavailableError } = require("./core");
const { logError, validateInput, sanitizeString, sanitizeChannelName } = require("./helpers");
const { tickets } = require("./tickets");
const { ticketEvents } = require("./ticketEvents");
const { ticketCategories } = require("./ticketCategories");
const { ticketCreateLocks } = require("./ticketCreateLocks");
const { notes } = require("./notes");
const { blacklist, modlogSettings, warnings, modActions, tempBans, mutes } = require("./moderation");
const { settings } = require("./settings");
const { staffStats, staffRatings, staffStatus } = require("./staff");
const { levels, levelSettings } = require("./levels");
const { reminders } = require("./reminders");
const { giveaways } = require("./giveaways");
const { autoResponses } = require("./autoResponses");
const { polls } = require("./polls");
const { tags } = require("./tags");
const { cooldowns } = require("./cooldowns");
const { reactionRoles, autoRoleSettings } = require("./autoRoles");
const { serverStats, messageActivity } = require("./serverStats");
const {
  verifSettings,
  verifCodes,
  verifCaptchas,
  verifMemberStates,
  verifMetrics,
  verifLogs,
} = require("./verification");
const { welcomeSettings } = require("./welcome");
const { suggestSettings, suggestions } = require("./suggestions");
const { configBackups } = require("./configBackups");
const { auditLogs } = require("./auditLogs");
const { alerts } = require("./alerts");
const { embedTemplates } = require("./embeds");

module.exports = {
  connectDB,
  ensureIndexes,
  getDB,
  pingDB,
  closeDB,
  isDbUnavailableError,
  toDbUnavailableError,
  logError,
  validateInput,
  sanitizeString,
  sanitizeChannelName,
  tickets,
  ticketEvents,
  ticketCategories,
  ticketCreateLocks,
  notes,
  blacklist,
  modActions,
  tempBans,
  mutes,
  settings,
  staffStats,
  staffRatings,
  tags,
  cooldowns,
  staffStatus,
  verifSettings,
  verifCodes,
  verifCaptchas,
  verifMemberStates,
  verifMetrics,
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
  reactionRoles,
  autoRoleSettings,
  serverStats,
  messageActivity,
  embedTemplates,
};
