"use strict";

const { EmbedBuilder } = require("discord.js");
const { buildCommercialSettingsDefaults } = require("./database/defaults");

const COMMERCIAL_PLAN_KEYS = new Set(["free", "pro"]);
const PLAN_WEIGHTS = {
  free: 1,
  pro: 2,
};

function toDateOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toShortStringOrNull(value, maxLen) {
  if (value === null || value === undefined) return null;
  const out = String(value).trim();
  if (!out) return null;
  return out.slice(0, maxLen);
}

function normalizeCommercialPlan(value, fallback = "free") {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "enterprise") return "pro";
  if (COMMERCIAL_PLAN_KEYS.has(raw)) return raw;
  return fallback;
}

function sanitizeCommercialSettings(value, fallback = buildCommercialSettingsDefaults()) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const defaults = {
    ...buildCommercialSettingsDefaults(),
    ...(fallback || {}),
  };

  return {
    plan: normalizeCommercialPlan(source.plan, normalizeCommercialPlan(defaults.plan, "free")),
    plan_source: toShortStringOrNull(source.plan_source, 80) || defaults.plan_source,
    plan_started_at: toDateOrNull(source.plan_started_at ?? defaults.plan_started_at),
    plan_expires_at: toDateOrNull(source.plan_expires_at ?? defaults.plan_expires_at),
    plan_note: toShortStringOrNull(source.plan_note, 500),
    supporter_enabled: source.supporter_enabled === true,
    supporter_started_at: toDateOrNull(source.supporter_started_at ?? defaults.supporter_started_at),
    supporter_expires_at: toDateOrNull(source.supporter_expires_at ?? defaults.supporter_expires_at),
    updated_at: toDateOrNull(source.updated_at ?? defaults.updated_at) || new Date(),
  };
}

function isStillActive(expiresAt, now = new Date()) {
  if (!expiresAt) return true;
  return expiresAt.getTime() > now.getTime();
}

function resolveCommercialState(settingsRecord = {}, nowInput = new Date()) {
  const now = toDateOrNull(nowInput) || new Date();
  const fallback = buildCommercialSettingsDefaults();
  const compatPlan = normalizeCommercialPlan(
    settingsRecord?.dashboard_general_settings?.opsPlan,
    fallback.plan,
  );
  const commercialSettings = sanitizeCommercialSettings(
    settingsRecord?.commercial_settings,
    {
      ...fallback,
      plan: compatPlan,
      plan_source:
        settingsRecord?.commercial_settings?.plan_source ||
        (compatPlan === "pro" ? "legacy_dashboard" : fallback.plan_source),
    },
  );

  const planExpired = commercialSettings.plan === "pro"
    && !isStillActive(commercialSettings.plan_expires_at, now);
  const effectivePlan = commercialSettings.plan === "pro" && !planExpired
    ? "pro"
    : "free";
  const supporterActive = commercialSettings.supporter_enabled === true
    && isStillActive(commercialSettings.supporter_expires_at, now);

  return {
    commercialSettings,
    storedPlan: commercialSettings.plan,
    effectivePlan,
    planExpired,
    isPro: effectivePlan === "pro",
    supporterActive,
    isSupporter: supporterActive,
    planSource: commercialSettings.plan_source,
    planNote: commercialSettings.plan_note,
    planStartedAt: commercialSettings.plan_started_at,
    planExpiresAt: commercialSettings.plan_expires_at,
    supporterStartedAt: commercialSettings.supporter_started_at,
    supporterExpiresAt: commercialSettings.supporter_expires_at,
  };
}

function buildCommercialSettingsPatch(currentSettings, changes = {}, options = {}) {
  const now = toDateOrNull(options.now) || new Date();
  const current = resolveCommercialState(currentSettings, now);
  const mergedSettings = sanitizeCommercialSettings(
    {
      ...current.commercialSettings,
      ...(changes || {}),
      updated_at: now,
    },
    current.commercialSettings,
  );
  const resolved = resolveCommercialState(
    {
      ...(currentSettings || {}),
      commercial_settings: mergedSettings,
      dashboard_general_settings: {
        ...(currentSettings?.dashboard_general_settings || {}),
        opsPlan: mergedSettings.plan,
      },
    },
    now,
  );

  return {
    commercial_settings: resolved.commercialSettings,
    dashboard_general_settings: {
      ...(currentSettings?.dashboard_general_settings || {}),
      opsPlan: resolved.effectivePlan,
    },
  };
}

function getPlanWeight(plan) {
  return PLAN_WEIGHTS[normalizeCommercialPlan(plan, "free")] || PLAN_WEIGHTS.free;
}

function hasRequiredPlan(settingsRecord, requiredPlan = "free") {
  const state = resolveCommercialState(settingsRecord);
  return getPlanWeight(state.effectivePlan) >= getPlanWeight(requiredPlan);
}

function formatDateForDisplay(value) {
  const parsed = toDateOrNull(value);
  if (!parsed) return "Not set";
  return parsed.toISOString().slice(0, 10);
}

function buildCommercialStatusLines(settingsRecord = {}) {
  const state = resolveCommercialState(settingsRecord);
  const lines = [
    `Current plan: \`${state.effectivePlan}\``,
    `Stored plan: \`${state.storedPlan}\``,
    `Plan source: \`${state.planSource || "unknown"}\``,
    `Plan expires: ${state.planExpiresAt ? `\`${formatDateForDisplay(state.planExpiresAt)}\`` : "Never"}`,
    `Supporter: ${state.supporterActive ? "Enabled" : "Inactive"}`,
  ];

  if (state.planExpired) {
    lines.push("Plan status: `expired -> running as free`");
  }
  if (state.planNote) {
    lines.push(`Plan note: ${state.planNote}`);
  }
  if (state.supporterExpiresAt) {
    lines.push(`Supporter expires: \`${formatDateForDisplay(state.supporterExpiresAt)}\``);
  }

  return lines;
}

function buildProRequiredEmbed(settingsRecord = {}, featureLabel = "This feature") {
  const state = resolveCommercialState(settingsRecord);
  return new EmbedBuilder()
    .setColor(0xF1C40F)
    .setTitle("Pro required")
    .setDescription(
      `**${featureLabel}** is part of the Pro plan.\n` +
      "Ask the bot owner to activate Pro for this server manually.",
    )
    .addFields(
      { name: "Current plan", value: `\`${state.effectivePlan}\``, inline: true },
      {
        name: "Supporter",
        value: state.supporterActive ? "Enabled" : "Inactive",
        inline: true,
      },
    )
    .setFooter({
      text: "Donations never unlock premium features. Supporter status is recognition only.",
    })
    .setTimestamp();
}

module.exports = {
  COMMERCIAL_PLAN_KEYS,
  normalizeCommercialPlan,
  sanitizeCommercialSettings,
  resolveCommercialState,
  buildCommercialSettingsPatch,
  getPlanWeight,
  hasRequiredPlan,
  buildCommercialStatusLines,
  buildProRequiredEmbed,
};
