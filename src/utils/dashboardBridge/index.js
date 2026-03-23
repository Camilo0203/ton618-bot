"use strict";

const { hasDashboardRelevantChange } = require("./config");
const {
  buildDashboardConfigPayload,
  buildSettingsPatchFromDashboardRow,
  shouldApplyDashboardRow,
  mapGeneralMutationPayload,
  mapServerRolesMutationPayload,
  mapTicketsMutationPayload,
  mapVerificationMutationPayload,
  mapWelcomeMutationPayload,
  mapSuggestionMutationPayload,
  mapModlogMutationPayload,
  mapCommandsMutationPayload,
  mapSystemMutationPayload,
  normalizeIncomingCommandRateLimitOverrides,
  normalizeOutgoingCommandRateLimitOverrides,
} = require("./transforms");
const {
  startDashboardBridge,
  syncDashboardBridge,
  queueDashboardBridgeSync,
  queueDashboardConfigExport,
  removeGuildFromDashboard,
} = require("./sync");

module.exports = {
  startDashboardBridge,
  syncDashboardBridge,
  queueDashboardBridgeSync,
  queueDashboardConfigExport,
  removeGuildFromDashboard,
  hasDashboardRelevantChange,
  __test: {
    buildDashboardConfigPayload,
    buildSettingsPatchFromDashboardRow,
    shouldApplyDashboardRow,
    mapGeneralMutationPayload,
    mapServerRolesMutationPayload,
    mapTicketsMutationPayload,
    mapVerificationMutationPayload,
    mapWelcomeMutationPayload,
    mapSuggestionMutationPayload,
    mapModlogMutationPayload,
    mapCommandsMutationPayload,
    mapSystemMutationPayload,
    normalizeIncomingCommandRateLimitOverrides,
    normalizeOutgoingCommandRateLimitOverrides,
  },
};
