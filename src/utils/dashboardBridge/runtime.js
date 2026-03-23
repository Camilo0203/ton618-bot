"use strict";

const { ChannelType, EmbedBuilder } = require("discord.js");
const {
  auditLogs,
  configBackups,
  modlogSettings,
  notes,
  settings,
  suggestSettings,
  ticketEvents,
  tickets,
  verifSettings,
  warnings,
  welcomeSettings,
} = require("../database");
const {
  buildDashboardGeneralSettingsDefaults,
  buildDashboardModerationSettingsDefaults,
  buildDashboardPreferencesDefaults,
} = require("../database/defaults");
const {
  sanitizeDashboardGeneralSettings,
  sanitizeDashboardModerationSettings,
  sanitizeDashboardPreferences,
} = require("../settingsSchema");
const {
  applyBackupSnapshot,
  saveCurrentConfigBackup,
} = require("../configBackupVersioning");
const { clearGuildSettingsCache } = require("../accessControl");
const { logStructured } = require("../observability");
const { resolveTicketSlaMinutes } = require("../ticketSlaRules");
const { categories: ticketCategories = [] } = require("../../../config");

module.exports = {
  ChannelType,
  EmbedBuilder,
  auditLogs,
  configBackups,
  modlogSettings,
  notes,
  settings,
  suggestSettings,
  ticketEvents,
  tickets,
  verifSettings,
  warnings,
  welcomeSettings,
  buildDashboardGeneralSettingsDefaults,
  buildDashboardModerationSettingsDefaults,
  buildDashboardPreferencesDefaults,
  sanitizeDashboardGeneralSettings,
  sanitizeDashboardModerationSettings,
  sanitizeDashboardPreferences,
  applyBackupSnapshot,
  saveCurrentConfigBackup,
  clearGuildSettingsCache,
  logStructured,
  resolveTicketSlaMinutes,
  ticketCategories,
};
