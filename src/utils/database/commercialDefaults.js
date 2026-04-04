"use strict";

/**
 * Builds the default commercial settings for a guild.
 * @param {Function} dateFactory A function that returns the current date.
 * @returns {Object} Default commercial settings.
 */
function buildCommercialSettingsDefaults(dateFactory = () => new Date()) {
  return {
    plan: "free",
    plan_source: "self_serve_default",
    plan_started_at: null,
    plan_expires_at: null,
    plan_note: null,
    supporter_enabled: false,
    supporter_started_at: null,
    supporter_expires_at: null,
    updated_at: dateFactory(),
  };
}

module.exports = {
  buildCommercialSettingsDefaults,
};
