const test = require("node:test");
const assert = require("node:assert/strict");
const {
  AutoModerationActionType,
  AutoModerationRuleTriggerType,
} = require("discord.js");

const {
  APPLICATION_AUTOMOD_BADGE_FLAG,
  buildAutomodDesiredRules,
  planAutomodSync,
  buildAutomodStatusSnapshot,
  summarizeAutomodBadgeProgress,
} = require("../src/utils/automod");

test("buildAutomodDesiredRules creates the TON618 rule pack with safe defaults", () => {
  const rules = buildAutomodDesiredRules({
    automod_presets: ["spam", "invites", "scam"],
    automod_alert_channel: "channel-alert",
    automod_exempt_roles: ["role-1", "role-1", "role-2"],
    automod_exempt_channels: ["channel-1", "channel-2"],
    automod_keyword_overrides: {
      inviteAllowList: ["discord.gg/partners"],
      scamKeywords: ["wallet drain"],
    },
  });

  assert.equal(rules.length, 3);

  const spamRule = rules.find((rule) => rule.key === "spam");
  const inviteRule = rules.find((rule) => rule.key === "invites");
  const scamRule = rules.find((rule) => rule.key === "scam");

  assert.equal(spamRule.triggerType, AutoModerationRuleTriggerType.Spam);
  assert.deepEqual(
    spamRule.actions.map((action) => action.type),
    [AutoModerationActionType.BlockMessage, AutoModerationActionType.SendAlertMessage]
  );

  assert.equal(inviteRule.triggerType, AutoModerationRuleTriggerType.Keyword);
  assert.equal(inviteRule.triggerMetadata.keywordFilter.includes("*discord.gg/*"), true);
  assert.deepEqual(inviteRule.triggerMetadata.allowList, ["discord.gg/partners"]);

  assert.equal(scamRule.triggerMetadata.keywordFilter.includes("wallet drain"), true);
  assert.equal(
    scamRule.actions.some((action) => action.type === AutoModerationActionType.Timeout),
    false
  );

  assert.deepEqual(spamRule.exemptRoles, ["role-1", "role-2"]);
  assert.deepEqual(spamRule.exemptChannels, ["channel-1", "channel-2"]);
});

test("planAutomodSync identifies create, update, skip, and remove decisions idempotently", () => {
  const baseRules = buildAutomodDesiredRules({
    automod_presets: ["spam", "invites", "scam"],
    automod_alert_channel: "alerts",
  });
  const spamRule = baseRules.find((rule) => rule.key === "spam");
  const inviteRule = baseRules.find((rule) => rule.key === "invites");
  const scamRule = baseRules.find((rule) => rule.key === "scam");

  const managedRules = {
    spam: { id: "rule-1", ...spamRule },
    invites: {
      id: "rule-2",
      ...inviteRule,
      actions: inviteRule.actions.filter((action) => action.type !== AutoModerationActionType.SendAlertMessage),
    },
    archived: { id: "rule-3", name: "TON618 • Old Rule" },
  };

  const plan = planAutomodSync({
    desiredRules: [spamRule, inviteRule, scamRule],
    managedRules,
  });

  assert.deepEqual(plan.create.map((item) => item.key), ["scam"]);
  assert.deepEqual(plan.update.map((item) => item.key), ["invites"]);
  assert.deepEqual(plan.skip.map((item) => item.key), ["spam"]);
  assert.deepEqual(plan.remove.map((item) => item.key), ["archived"]);
});

test("status snapshot and badge progress aggregate live AutoMod counts safely", () => {
  const snapshot = buildAutomodStatusSnapshot({
    settingsRecord: {
      automod_enabled: true,
      automod_presets: ["spam", "invites", "scam"],
      automod_alert_channel: "channel-alert",
      automod_exempt_roles: ["role-1"],
      automod_exempt_channels: ["channel-1"],
      automod_managed_rule_ids: {
        spam: "rule-1",
        invites: "rule-2",
      },
      automod_last_sync_status: "partial",
      automod_last_sync_summary: "updated 2, failed 1",
    },
    liveRules: [
      { id: "rule-1", name: "TON618 • Spam Protection" },
      { id: "other-1", name: "Manual Rule" },
    ],
    permissionReport: {
      okay: false,
      missing: ["MANAGE_GUILD"],
    },
  });

  assert.equal(snapshot.enabled, true);
  assert.equal(snapshot.desiredRuleCount, 3);
  assert.equal(snapshot.liveManagedRuleCount, 1);
  assert.equal(snapshot.storedManagedRuleCount, 2);
  assert.deepEqual(snapshot.missingPermissions, ["MANAGE_GUILD"]);
  assert.equal(snapshot.ruleStatuses.find((rule) => rule.key === "spam").present, true);
  assert.equal(snapshot.ruleStatuses.find((rule) => rule.key === "invites").present, false);

  const progress = summarizeAutomodBadgeProgress(
    [
      snapshot,
      {
        enabled: true,
        liveManagedRuleCount: 27,
        missingPermissions: [],
        lastSyncStatus: "success",
      },
    ],
    {
      goal: 100,
      appFlags: APPLICATION_AUTOMOD_BADGE_FLAG,
    }
  );

  assert.equal(progress.totalManagedRuleCount, 28);
  assert.equal(progress.remainingRuleCount, 72);
  assert.equal(progress.enabledGuildCount, 2);
  assert.equal(progress.missingPermissionsGuildCount, 1);
  assert.equal(progress.failedSyncGuildCount, 1);
  assert.equal(progress.badgeFlagActive, true);
});
