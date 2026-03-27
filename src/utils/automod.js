"use strict";

const {
  AutoModerationActionType,
  AutoModerationRuleEventType,
  AutoModerationRuleTriggerType,
  ApplicationFlagsBitField,
  PermissionFlagsBits,
} = require("discord.js");

const AUTOMOD_BADGE_GOAL = 100;
const APPLICATION_AUTOMOD_BADGE_FLAG =
  ApplicationFlagsBitField.Flags.ApplicationAutoModerationRuleCreateBadge;

const DEFAULT_INVITE_KEYWORDS = Object.freeze([
  "*discord.gg/*",
  "*discord.com/invite/*",
  "*discordapp.com/invite/*",
]);

const DEFAULT_SCAM_KEYWORDS = Object.freeze([
  "free nitro",
  "claim your nitro",
  "gift inventory",
  "steam gift",
  "steam giveaway",
  "verify your wallet",
  "seed phrase",
  "recovery phrase",
  "crypto giveaway",
  "double your",
]);

const AUTOMOD_PRESET_DEFINITIONS = Object.freeze({
  spam: Object.freeze({
    key: "spam",
    label: "Spam prevention",
    name: "TON618 • Spam Protection",
    triggerType: AutoModerationRuleTriggerType.Spam,
    supportsTimeout: false,
    blockMessage:
      "TON618 blocked a message that looked like spam. Contact staff if this was a mistake.",
  }),
  invites: Object.freeze({
    key: "invites",
    label: "Invite link blocking",
    name: "TON618 • Invite Link Filter",
    triggerType: AutoModerationRuleTriggerType.Keyword,
    supportsTimeout: true,
    blockMessage:
      "TON618 blocks Discord invite links in this server. Ask staff if you need an exception.",
  }),
  scam: Object.freeze({
    key: "scam",
    label: "Scam phrase blocking",
    name: "TON618 • Scam Phrase Filter",
    triggerType: AutoModerationRuleTriggerType.Keyword,
    supportsTimeout: true,
    blockMessage:
      "TON618 blocked a message that matched the scam phrase filter. Contact staff if this was a mistake.",
  }),
});

const AUTOMOD_PRESET_KEYS = Object.freeze(Object.keys(AUTOMOD_PRESET_DEFINITIONS));
const AUTOMOD_TIMEOUT_COMPATIBLE_PRESETS = new Set(
  AUTOMOD_PRESET_KEYS.filter((key) => AUTOMOD_PRESET_DEFINITIONS[key].supportsTimeout)
);
const AUTOMOD_SYNC_STATUS_KEYS = new Set([
  "never",
  "success",
  "partial",
  "failed",
  "disabled",
  "skipped",
]);

function buildAutomodPresetSelectionDefaults() {
  return [...AUTOMOD_PRESET_KEYS];
}

function buildAutomodActionOverridesDefaults() {
  return {
    enableAlerts: true,
    timeoutSeconds: 0,
    timeoutPresets: [],
  };
}

function buildAutomodKeywordOverridesDefaults() {
  return {
    inviteAllowList: [],
    scamKeywords: [],
  };
}

function uniqueStrings(values, maxItems = Infinity, maxLength = 60) {
  if (!Array.isArray(values)) return [];
  const out = [];
  const seen = new Set();

  for (const value of values) {
    const normalized = String(value || "").trim();
    if (!normalized) continue;
    const trimmed = normalized.slice(0, maxLength);
    const dedupeKey = trimmed.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(trimmed);
    if (out.length >= maxItems) break;
  }

  return out;
}

function sortValues(values) {
  return [...values].sort((a, b) => {
    if (a === b) return 0;
    return String(a).localeCompare(String(b), "en");
  });
}

function getPresetDefinition(key) {
  return AUTOMOD_PRESET_DEFINITIONS[key] || null;
}

function getPresetLabel(key) {
  return getPresetDefinition(key)?.label || key;
}

function getPresetName(key) {
  return getPresetDefinition(key)?.name || key;
}

function getActiveAutomodPresets(settingsRecord = {}) {
  const configured = Array.isArray(settingsRecord.automod_presets)
    ? settingsRecord.automod_presets
    : buildAutomodPresetSelectionDefaults();

  const out = configured
    .map((value) => String(value || "").trim().toLowerCase())
    .filter((value) => AUTOMOD_PRESET_DEFINITIONS[value]);

  return Array.from(new Set(out));
}

function resolveTimeoutPresetSelection(settingsRecord = {}) {
  const overrides = settingsRecord.automod_action_overrides || {};
  return uniqueStrings(overrides.timeoutPresets, AUTOMOD_PRESET_KEYS.length, 20)
    .map((value) => value.toLowerCase())
    .filter((value) => AUTOMOD_PRESET_DEFINITIONS[value]);
}

function buildAutomodActions(ruleKey, settingsRecord = {}) {
  const definition = getPresetDefinition(ruleKey);
  if (!definition) return [];

  const overrides = settingsRecord.automod_action_overrides || {};
  const actions = [
    {
      type: AutoModerationActionType.BlockMessage,
      metadata: { customMessage: definition.blockMessage },
    },
  ];

  if (overrides.enableAlerts !== false && settingsRecord.automod_alert_channel) {
    actions.push({
      type: AutoModerationActionType.SendAlertMessage,
      metadata: { channel: settingsRecord.automod_alert_channel },
    });
  }

  const timeoutSeconds = Number(overrides.timeoutSeconds || 0);
  const timeoutPresets = resolveTimeoutPresetSelection(settingsRecord);
  if (
    timeoutSeconds > 0 &&
    definition.supportsTimeout &&
    timeoutPresets.includes(ruleKey)
  ) {
    actions.push({
      type: AutoModerationActionType.Timeout,
      metadata: { durationSeconds: timeoutSeconds },
    });
  }

  return actions;
}

function buildAutomodDesiredRules(settingsRecord = {}) {
  const activePresets = getActiveAutomodPresets(settingsRecord);
  const exemptRoles = uniqueStrings(settingsRecord.automod_exempt_roles, 20, 22);
  const exemptChannels = uniqueStrings(settingsRecord.automod_exempt_channels, 50, 22);
  const keywordOverrides = settingsRecord.automod_keyword_overrides || {};
  const inviteAllowList = uniqueStrings(keywordOverrides.inviteAllowList, 100, 60);
  const scamKeywords = uniqueStrings(
    [...DEFAULT_SCAM_KEYWORDS, ...(keywordOverrides.scamKeywords || [])],
    100,
    60
  );

  return activePresets.map((key) => {
    const definition = AUTOMOD_PRESET_DEFINITIONS[key];
    const rule = {
      key,
      label: definition.label,
      name: definition.name,
      eventType: AutoModerationRuleEventType.MessageSend,
      triggerType: definition.triggerType,
      actions: buildAutomodActions(key, settingsRecord),
      enabled: true,
      exemptRoles,
      exemptChannels,
    };

    if (key === "invites") {
      rule.triggerMetadata = {
        keywordFilter: [...DEFAULT_INVITE_KEYWORDS],
        allowList: inviteAllowList,
      };
    } else if (key === "scam") {
      rule.triggerMetadata = {
        keywordFilter: scamKeywords,
      };
    }

    return rule;
  });
}

function normalizeActionMetadata(metadata = {}) {
  return {
    channelId: metadata.channelId || metadata.channel || null,
    durationSeconds: Number.isFinite(Number(metadata.durationSeconds))
      ? Number(metadata.durationSeconds)
      : null,
    customMessage: metadata.customMessage ? String(metadata.customMessage) : null,
  };
}

function normalizeAction(action = {}) {
  return {
    type: Number(action.type || 0),
    metadata: normalizeActionMetadata(action.metadata || {}),
  };
}

function normalizeTriggerMetadata(metadata = {}) {
  return {
    keywordFilter: sortValues(uniqueStrings(metadata.keywordFilter, 1000, 60)),
    regexPatterns: sortValues(uniqueStrings(metadata.regexPatterns, 10, 260)),
    presets: sortValues(
      Array.isArray(metadata.presets)
        ? metadata.presets.map((value) => Number(value)).filter(Number.isFinite)
        : []
    ),
    allowList: sortValues(uniqueStrings(metadata.allowList, 1000, 60)),
    mentionTotalLimit: Number.isFinite(Number(metadata.mentionTotalLimit))
      ? Number(metadata.mentionTotalLimit)
      : null,
    mentionRaidProtectionEnabled: Boolean(metadata.mentionRaidProtectionEnabled),
  };
}

function normalizeRuleShape(rule = {}) {
  return {
    name: String(rule.name || "").trim(),
    eventType: Number(rule.eventType || 0),
    triggerType: Number(rule.triggerType || 0),
    enabled: rule.enabled !== false,
    triggerMetadata: normalizeTriggerMetadata(rule.triggerMetadata || {}),
    actions: sortValues(
      (Array.isArray(rule.actions) ? rule.actions : []).map((action) =>
        JSON.stringify(normalizeAction(action))
      )
    ),
    exemptRoles: sortValues(uniqueStrings(rule.exemptRoles, 20, 22)),
    exemptChannels: sortValues(uniqueStrings(rule.exemptChannels, 50, 22)),
  };
}

function rulesAreEquivalent(existingRule, desiredRule) {
  return (
    JSON.stringify(normalizeRuleShape(existingRule)) ===
    JSON.stringify(normalizeRuleShape(desiredRule))
  );
}

function normalizeRuleList(rules) {
  if (!rules) return [];
  if (Array.isArray(rules)) return rules;
  if (typeof rules.values === "function") return Array.from(rules.values());
  return Object.values(rules);
}

function matchManagedAutomodRules(existingRules, settingsRecord = {}) {
  const storedRuleIds =
    settingsRecord.automod_managed_rule_ids &&
    typeof settingsRecord.automod_managed_rule_ids === "object" &&
    !Array.isArray(settingsRecord.automod_managed_rule_ids)
      ? settingsRecord.automod_managed_rule_ids
      : {};

  const available = new Map(
    normalizeRuleList(existingRules)
      .filter((rule) => rule && rule.id)
      .map((rule) => [String(rule.id), rule])
  );
  const matched = {};

  for (const key of AUTOMOD_PRESET_KEYS) {
    const storedId = storedRuleIds[key];
    if (!storedId || !available.has(storedId)) continue;
    matched[key] = available.get(storedId);
    available.delete(storedId);
  }

  for (const key of AUTOMOD_PRESET_KEYS) {
    if (matched[key]) continue;
    const ruleName = getPresetName(key);
    const fallback = Array.from(available.values()).find(
      (rule) => String(rule.name || "").trim() === ruleName
    );
    if (!fallback) continue;
    matched[key] = fallback;
    available.delete(fallback.id);
  }

  return matched;
}

function planAutomodSync({ desiredRules = [], managedRules = {} }) {
  const desiredByKey = new Map(
    desiredRules.map((rule) => [rule.key, rule])
  );
  const create = [];
  const update = [];
  const skip = [];
  const remove = [];

  for (const desiredRule of desiredRules) {
    const currentRule = managedRules[desiredRule.key] || null;
    if (!currentRule) {
      create.push({ key: desiredRule.key, desired: desiredRule });
      continue;
    }

    if (rulesAreEquivalent(currentRule, desiredRule)) {
      skip.push({ key: desiredRule.key, current: currentRule, desired: desiredRule });
      continue;
    }

    update.push({ key: desiredRule.key, current: currentRule, desired: desiredRule });
  }

  for (const key of Object.keys(managedRules || {})) {
    if (desiredByKey.has(key)) continue;
    remove.push({ key, current: managedRules[key] });
  }

  return { create, update, skip, remove };
}

function buildAutomodPermissionReport(permissionSource, settingsRecord = {}) {
  const hasPermission = (permission) => {
    if (permissionSource?.has) return permissionSource.has(permission);
    if (permissionSource instanceof Set) return permissionSource.has(permission);
    if (Array.isArray(permissionSource)) return permissionSource.includes(permission);
    return false;
  };

  const missing = [];
  if (!hasPermission(PermissionFlagsBits.ManageGuild)) {
    missing.push("MANAGE_GUILD");
  }

  const timeoutEnabled = buildAutomodDesiredRules(settingsRecord).some((rule) =>
    rule.actions.some((action) => action.type === AutoModerationActionType.Timeout)
  );

  if (timeoutEnabled && !hasPermission(PermissionFlagsBits.ModerateMembers)) {
    missing.push("MODERATE_MEMBERS");
  }

  return {
    ok: missing.length === 0,
    missing,
    timeoutEnabled,
  };
}

function humanizeAutomodPermission(permission) {
  if (permission === "MANAGE_GUILD") return "Manage Server";
  if (permission === "MODERATE_MEMBERS") return "Moderate Members";
  return permission;
}

function buildAutomodStatusSnapshot({
  settingsRecord = {},
  liveRules = [],
  permissionReport = { ok: true, missing: [] },
} = {}) {
  const activePresets = getActiveAutomodPresets(settingsRecord);
  const desiredRules = buildAutomodDesiredRules(settingsRecord);
  const managedRules = matchManagedAutomodRules(liveRules, settingsRecord);
  const ruleStatuses = AUTOMOD_PRESET_KEYS.map((key) => ({
    key,
    label: getPresetLabel(key),
    name: getPresetName(key),
    active: activePresets.includes(key),
    present: Boolean(managedRules[key]),
    ruleId:
      managedRules[key]?.id ||
      settingsRecord?.automod_managed_rule_ids?.[key] ||
      null,
  }));

  return {
    enabled: Boolean(settingsRecord.automod_enabled),
    activePresetCount: activePresets.length,
    desiredRuleCount: desiredRules.length,
    liveManagedRuleCount: ruleStatuses.filter((rule) => rule.present).length,
    storedManagedRuleCount: Object.values(
      settingsRecord.automod_managed_rule_ids || {}
    ).filter(Boolean).length,
    alertChannelId: settingsRecord.automod_alert_channel || null,
    exemptRoleIds: uniqueStrings(settingsRecord.automod_exempt_roles, 20, 22),
    exemptChannelIds: uniqueStrings(settingsRecord.automod_exempt_channels, 50, 22),
    lastSyncAt: settingsRecord.automod_last_sync_at || null,
    lastSyncStatus: AUTOMOD_SYNC_STATUS_KEYS.has(settingsRecord.automod_last_sync_status)
      ? settingsRecord.automod_last_sync_status
      : "never",
    lastSyncSummary: settingsRecord.automod_last_sync_summary || null,
    missingPermissions: Array.isArray(permissionReport.missing)
      ? permissionReport.missing
      : [],
    ruleStatuses,
  };
}

function formatAutomodSyncSummary(result = {}) {
  const counts = {
    created: result.created?.length || 0,
    updated: result.updated?.length || 0,
    skipped: result.skipped?.length || 0,
    removed: result.removed?.length || 0,
    failed: result.failed?.length || 0,
  };

  const parts = [];
  if (counts.created) parts.push(`created ${counts.created}`);
  if (counts.updated) parts.push(`updated ${counts.updated}`);
  if (counts.removed) parts.push(`removed ${counts.removed}`);
  if (counts.skipped) parts.push(`skipped ${counts.skipped}`);
  if (counts.failed) parts.push(`failed ${counts.failed}`);

  return parts.length ? parts.join(", ") : "No changes were needed.";
}

function resolveAutomodSyncStatus(result = {}) {
  const successCount =
    (result.created?.length || 0) +
    (result.updated?.length || 0) +
    (result.skipped?.length || 0) +
    (result.removed?.length || 0);
  const failedCount = result.failed?.length || 0;

  if (failedCount === 0) return "success";
  if (successCount === 0) return "failed";
  return "partial";
}

function toRuleMutationOptions(rule, reason) {
  const payload = {
    name: rule.name,
    eventType: rule.eventType,
    triggerType: rule.triggerType,
    actions: rule.actions.map((action) => ({
      type: action.type,
      metadata: action.metadata,
    })),
    enabled: rule.enabled !== false,
    exemptRoles: rule.exemptRoles,
    exemptChannels: rule.exemptChannels,
    reason,
  };

  if (rule.triggerMetadata && Object.keys(rule.triggerMetadata).length > 0) {
    payload.triggerMetadata = rule.triggerMetadata;
  }

  return payload;
}

async function executeAutomodSyncPlan(guild, plan, options = {}) {
  const actionLabel = String(options.actionLabel || "sync").trim() || "sync";
  const result = {
    created: [],
    updated: [],
    skipped: [],
    removed: [],
    failed: [],
    ruleIds: {},
  };

  for (const item of plan.skip || []) {
    result.skipped.push(item.key);
    if (item.current?.id) {
      result.ruleIds[item.key] = item.current.id;
    }
  }

  for (const item of plan.create || []) {
    try {
      const createdRule = await guild.autoModerationRules.create(
        toRuleMutationOptions(
          item.desired,
          `TON618 AutoMod ${actionLabel}: create ${item.desired.name}`
        )
      );
      result.created.push(item.key);
      result.ruleIds[item.key] = createdRule.id;
    } catch (error) {
      result.failed.push({
        key: item.key,
        step: "create",
        message: error?.message || String(error),
      });
    }
  }

  for (const item of plan.update || []) {
    try {
      const updatedRule = await guild.autoModerationRules.edit(
        item.current.id,
        toRuleMutationOptions(
          item.desired,
          `TON618 AutoMod ${actionLabel}: update ${item.desired.name}`
        )
      );
      result.updated.push(item.key);
      result.ruleIds[item.key] = updatedRule.id;
    } catch (error) {
      result.failed.push({
        key: item.key,
        step: "update",
        message: error?.message || String(error),
      });
      if (item.current?.id) {
        result.ruleIds[item.key] = item.current.id;
      }
    }
  }

  for (const item of plan.remove || []) {
    try {
      await guild.autoModerationRules.delete(
        item.current.id,
        `TON618 AutoMod ${actionLabel}: remove ${item.current.name || item.key}`
      );
      result.removed.push(item.key);
    } catch (error) {
      result.failed.push({
        key: item.key,
        step: "remove",
        message: error?.message || String(error),
      });
      if (item.current?.id) {
        result.ruleIds[item.key] = item.current.id;
      }
    }
  }

  result.status = resolveAutomodSyncStatus(result);
  result.summary = formatAutomodSyncSummary(result);
  return result;
}

function summarizeAutomodBadgeProgress(entries = [], options = {}) {
  const goal = Math.max(1, Number(options.goal || AUTOMOD_BADGE_GOAL));
  const totalManagedRuleCount = entries.reduce(
    (total, entry) =>
      total +
      Number(
        entry.liveManagedRuleCount ??
          entry.managedRuleCount ??
          entry.ruleCount ??
          0
      ),
    0
  );
  const enabledGuildCount = entries.filter((entry) => entry.enabled).length;
  const missingPermissionsGuildCount = entries.filter(
    (entry) => Array.isArray(entry.missingPermissions) && entry.missingPermissions.length > 0
  ).length;
  const failedSyncGuildCount = entries.filter((entry) =>
    ["failed", "partial"].includes(String(entry.lastSyncStatus || "").toLowerCase())
  ).length;
  const remainingRuleCount = Math.max(0, goal - totalManagedRuleCount);

  let badgeFlagActive = false;
  const appFlags = options.appFlags || null;
  if (typeof appFlags?.has === "function") {
    badgeFlagActive = appFlags.has(APPLICATION_AUTOMOD_BADGE_FLAG);
  } else if (typeof appFlags === "number") {
    badgeFlagActive = Boolean(appFlags & APPLICATION_AUTOMOD_BADGE_FLAG);
  }

  return {
    goal,
    totalManagedRuleCount,
    remainingRuleCount,
    enabledGuildCount,
    missingPermissionsGuildCount,
    failedSyncGuildCount,
    badgeFlagActive,
  };
}

module.exports = {
  AUTOMOD_BADGE_GOAL,
  AUTOMOD_PRESET_KEYS,
  AUTOMOD_PRESET_DEFINITIONS,
  AUTOMOD_SYNC_STATUS_KEYS,
  APPLICATION_AUTOMOD_BADGE_FLAG,
  buildAutomodPresetSelectionDefaults,
  buildAutomodActionOverridesDefaults,
  buildAutomodKeywordOverridesDefaults,
  getActiveAutomodPresets,
  getPresetDefinition,
  getPresetLabel,
  getPresetName,
  buildAutomodActions,
  buildAutomodDesiredRules,
  matchManagedAutomodRules,
  planAutomodSync,
  buildAutomodPermissionReport,
  humanizeAutomodPermission,
  buildAutomodStatusSnapshot,
  formatAutomodSyncSummary,
  resolveAutomodSyncStatus,
  executeAutomodSyncPlan,
  summarizeAutomodBadgeProgress,
};
