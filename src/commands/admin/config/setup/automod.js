"use strict";

const {
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const { settings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { t, resolveInteractionLanguage } = require("../../../../utils/i18n");
const {
  withDescriptionLocalizations,
  localizedChoice,
} = require("../../../../utils/slashLocalizations");
const {
  AUTOMOD_PRESET_KEYS,
  buildAutomodDesiredRules,
  matchManagedAutomodRules,
  planAutomodSync,
  buildAutomodPermissionReport,
  humanizeAutomodPermission,
  buildAutomodStatusSnapshot,
  executeAutomodSyncPlan,
  getPresetLabel,
} = require("../../../../utils/automod");

const EXEMPT_CHANNEL_TYPES = [
  ChannelType.GuildText,
  ChannelType.GuildAnnouncement,
  ChannelType.PublicThread,
  ChannelType.PrivateThread,
  ChannelType.AnnouncementThread,
  ChannelType.GuildForum,
];

function getChannelOption(interaction, primary = "channel", legacy = "canal") {
  return interaction.options.getChannel(primary) || interaction.options.getChannel(legacy);
}

function getRoleOption(interaction, primary = "role", legacy = "rol") {
  return interaction.options.getRole(primary) || interaction.options.getRole(legacy);
}

function getStringOption(interaction, primary, legacy = null) {
  return interaction.options.getString(primary) ?? (legacy ? interaction.options.getString(legacy) : null);
}

function getBooleanOption(interaction, primary, legacy = null) {
  return interaction.options.getBoolean(primary) ?? (legacy ? interaction.options.getBoolean(legacy) : null);
}

function truncate(text, maxLength) {
  const out = String(text || "").trim();
  if (!out) return "";
  if (out.length <= maxLength) return out;
  return `${out.slice(0, Math.max(0, maxLength - 3))}...`;
}

function formatTimestamp(value, fallback) {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return `<t:${Math.floor(parsed.getTime() / 1000)}:R>`;
}

function summarizeMentionList(ids, formatter, emptyText, limit = 5) {
  const list = Array.isArray(ids) ? ids.filter(Boolean) : [];
  if (list.length === 0) return emptyText;
  const visible = list.slice(0, limit).map(formatter);
  const remaining = list.length - visible.length;
  return remaining > 0 ? `${visible.join(", ")} +${remaining}` : visible.join(", ");
}

function buildApplyHint(settingsRecord, language) {
  if (settingsRecord?.automod_enabled) {
    return t(language, "setup.automod.hint_sync");
  }
  return t(language, "setup.automod.hint_bootstrap");
}

function buildPermissionFailureSummary(actionLabel, permissionReport, language) {
  const missing = Array.isArray(permissionReport?.missing)
    ? permissionReport.missing.map(humanizeAutomodPermission).filter(Boolean)
    : [];

  if (missing.length > 0) {
    return t(language, "setup.automod.permission_failure", { action: actionLabel, permissions: missing.join(", ") });
  }

  return t(language, "setup.automod.permission_failure_generic", { action: actionLabel });
}

function countSuccessfulMutations(result = {}) {
  return (
    (result.created?.length || 0) +
    (result.updated?.length || 0) +
    (result.skipped?.length || 0)
  );
}

async function resolveGuildMemberMe(guild) {
  if (guild?.members?.me) return guild.members.me;
  if (guild?.members?.fetchMe) {
    return guild.members.fetchMe().catch(() => null);
  }
  return null;
}

async function getPermissionReport(guild, settingsRecord) {
  const me = await resolveGuildMemberMe(guild);
  const permissionReport = buildAutomodPermissionReport(me?.permissions, settingsRecord);
  return { me, permissionReport };
}

async function persistSyncState(gid, patch = {}) {
  return settings.update(gid, patch);
}

function buildStatusEmbed(guild, snapshot, language) {
  const activeRules = snapshot.ruleStatuses
    .filter((rule) => rule.active)
    .map((rule) => {
      const state = rule.present ? t(language, "setup.automod.rule_live") : t(language, "setup.automod.rule_missing");
      return `- **${rule.label}**: ${state}`;
    })
    .join("\n") || t(language, "setup.automod.no_presets");

  const missingPermissions = snapshot.missingPermissions.length
    ? snapshot.missingPermissions.map(humanizeAutomodPermission).join(", ")
    : t(language, "setup.automod.permissions_ok");

  const embedColor = snapshot.missingPermissions.length
    ? E.Colors.WARNING
    : snapshot.enabled
      ? E.Colors.SUCCESS
      : E.Colors.INFO;

  const alertChannel = snapshot.alertChannelId
    ? `<#${snapshot.alertChannelId}>`
    : t(language, "setup.automod.alert_not_configured");
  const exemptRoles = summarizeMentionList(snapshot.exemptRoleIds, (id) => `<@&${id}>`, t(language, "setup.automod.none"));
  const exemptChannels = summarizeMentionList(snapshot.exemptChannelIds, (id) => `<#${id}>`, t(language, "setup.automod.none"));
  const lastSync = formatTimestamp(snapshot.lastSyncAt, t(language, "setup.automod.never"));
  const syncSummary = truncate(snapshot.lastSyncSummary || t(language, "setup.automod.no_sync_recorded"), 240);

  return new EmbedBuilder()
    .setColor(embedColor)
    .setTitle(t(language, "setup.automod.status_title", { guildName: guild.name }))
    .setDescription(
      snapshot.enabled
        ? t(language, "setup.automod.status_enabled")
        : t(language, "setup.automod.status_disabled")
    )
    .addFields(
      {
        name: t(language, "setup.automod.field_managed_rules"),
        value:
          t(language, "setup.automod.live_count", { live: snapshot.liveManagedRuleCount, desired: snapshot.desiredRuleCount }) + "\n" +
          t(language, "setup.automod.stored_rule_ids", { count: snapshot.storedManagedRuleCount }) + "\n" +
          activeRules,
        inline: false,
      },
      {
        name: t(language, "setup.automod.field_alerts_exemptions"),
        value:
          t(language, "setup.automod.alert_channel", { channel: alertChannel }) + "\n" +
          t(language, "setup.automod.exempt_roles", { roles: exemptRoles }) + "\n" +
          t(language, "setup.automod.exempt_channels", { channels: exemptChannels }),
        inline: false,
      },
      {
        name: t(language, "setup.automod.field_sync_state"),
        value:
          t(language, "setup.automod.last_sync", { timestamp: lastSync }) + "\n" +
          t(language, "setup.automod.sync_result", { status: snapshot.lastSyncStatus }) + "\n" +
          t(language, "setup.automod.sync_summary", { summary: syncSummary }),
        inline: false,
      },
      {
        name: t(language, "setup.automod.field_permissions"),
        value: missingPermissions,
        inline: false,
      }
    )
    .setTimestamp();
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    withDescriptionLocalizations(
      group
        .setName("automod")
        .setDescription(t("en", "setup.automod.group_description")),
      "setup.automod.group_description"
    )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("bootstrap")
            .setDescription(t("en", "setup.automod.bootstrap_description")),
          "setup.automod.bootstrap_description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("status")
            .setDescription(t("en", "setup.automod.status_description")),
          "setup.automod.status_description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("sync")
            .setDescription(t("en", "setup.automod.sync_description")),
          "setup.automod.sync_description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("disable")
            .setDescription(t("en", "setup.automod.disable_description")),
          "setup.automod.disable_description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("channel-alert")
            .setDescription(t("en", "setup.automod.channel_alert_description")),
          "setup.automod.channel_alert_description"
        )
          .addChannelOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("channel")
                .setDescription(t("en", "setup.automod.option_channel")),
              "setup.automod.option_channel"
            )
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("clear")
                .setDescription(t("en", "setup.automod.option_clear")),
              "setup.automod.option_clear"
            )
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("exempt-channel")
            .setDescription(t("en", "setup.automod.exempt_channel_description")),
          "setup.automod.exempt_channel_description"
        )
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("action")
                .setDescription(t("en", "setup.automod.option_action")),
              "setup.automod.option_action"
            )
              .setRequired(true)
              .addChoices(
                localizedChoice("add", "setup.automod.choice_add"),
                localizedChoice("remove", "setup.automod.choice_remove"),
                localizedChoice("reset", "setup.automod.choice_reset")
              )
          )
          .addChannelOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("channel")
                .setDescription(t("en", "setup.automod.option_target_channel")),
              "setup.automod.option_target_channel"
            )
              .addChannelTypes(...EXEMPT_CHANNEL_TYPES)
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("exempt-role")
            .setDescription(t("en", "setup.automod.exempt_role_description")),
          "setup.automod.exempt_role_description"
        )
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("action")
                .setDescription(t("en", "setup.automod.option_action")),
              "setup.automod.option_action"
            )
              .setRequired(true)
              .addChoices(
                localizedChoice("add", "setup.automod.choice_add"),
                localizedChoice("remove", "setup.automod.choice_remove"),
                localizedChoice("reset", "setup.automod.choice_reset")
              )
          )
          .addRoleOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("role")
                .setDescription(t("en", "setup.automod.option_target_role")),
              "setup.automod.option_target_role"
            )
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("preset")
            .setDescription(t("en", "setup.automod.preset_description")),
          "setup.automod.preset_description"
        )
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("name")
                .setDescription(t("en", "setup.automod.option_preset_name")),
              "setup.automod.option_preset_name"
            )
              .setRequired(true)
              .addChoices(
                localizedChoice("spam", "setup.automod.preset_spam"),
                localizedChoice("invites", "setup.automod.preset_invites"),
                localizedChoice("scam", "setup.automod.preset_scam"),
                localizedChoice("all", "setup.automod.preset_all")
              )
          )
          .addBooleanOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("enabled")
                .setDescription(t("en", "setup.automod.option_enabled")),
              "setup.automod.option_enabled"
            )
              .setRequired(true)
          )
      )
  );
}

async function handleStatus(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, current);
  const { permissionReport } = await getPermissionReport(interaction.guild, current);

  let liveRules = [];
  if (permissionReport.ok) {
    try {
      const fetchedRules = await interaction.guild.autoModerationRules.fetch();
      liveRules = Array.from(fetchedRules.values());
    } catch (_) {
      liveRules = [];
    }
  }

  const snapshot = buildAutomodStatusSnapshot({
    settingsRecord: current,
    liveRules,
    permissionReport,
  });

  await interaction.reply({
    embeds: [buildStatusEmbed(interaction.guild, snapshot, language)],
    flags: 64,
  });
  return true;
}

async function handleBootstrap(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, current);
  const desiredRules = buildAutomodDesiredRules(current);

  if (desiredRules.length === 0) {
    await interaction.reply({
      embeds: [
        E.errorEmbed(t(language, "setup.automod.error_no_presets")),
      ],
      flags: 64,
    });
    return true;
  }

  const { permissionReport } = await getPermissionReport(interaction.guild, current);
  if (!permissionReport.ok) {
    const summary = buildPermissionFailureSummary("bootstrap", permissionReport, language);
    await persistSyncState(gid, {
      automod_last_sync_at: new Date(),
      automod_last_sync_status: "failed",
      automod_last_sync_summary: summary,
    });
    await interaction.reply({
      embeds: [E.errorEmbed(summary)],
      flags: 64,
    });
    return true;
  }

  await interaction.deferReply({ ephemeral: true });

  let fetchedRules;
  try {
    fetchedRules = await interaction.guild.autoModerationRules.fetch();
  } catch (error) {
    const summary = error?.message
      ? t(language, "setup.automod.fetch_error", { action: "bootstrap", message: error.message })
      : t(language, "setup.automod.fetch_error_generic");
    await persistSyncState(gid, {
      automod_last_sync_at: new Date(),
      automod_last_sync_status: "failed",
      automod_last_sync_summary: summary,
    });
    await interaction.editReply({ embeds: [E.errorEmbed(summary)] });
    return true;
  }

  const managedRules = matchManagedAutomodRules(fetchedRules, current);
  const plan = planAutomodSync({
    desiredRules,
    managedRules,
  });
  const result = await executeAutomodSyncPlan(interaction.guild, plan, {
    actionLabel: "bootstrap",
  });

  const hasLiveManagedRules = countSuccessfulMutations(result) > 0;
  await persistSyncState(gid, {
    automod_enabled: hasLiveManagedRules,
    automod_managed_rule_ids: result.ruleIds,
    automod_last_sync_at: new Date(),
    automod_last_sync_status: result.status,
    automod_last_sync_summary: result.summary,
  });

  const summaryLine =
    result.created.length > 0
      ? t(language, "setup.automod.bootstrap_created", { count: result.created.length, plural: result.created.length === 1 ? "" : "s" })
      : t(language, "setup.automod.bootstrap_no_new");
  const detailLine = result.summary ? `\n${result.summary}.` : "";
  const embedFactory = result.failed.length > 0 ? E.warningEmbed : E.successEmbed;

  await interaction.editReply({
    embeds: [
      embedFactory(
        `${summaryLine}${detailLine}`
      ),
    ],
  });
  return true;
}

async function handleSync(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, current);

  if (!current.automod_enabled) {
    await interaction.reply({
      embeds: [
        E.errorEmbed(t(language, "setup.automod.error_not_enabled")),
      ],
      flags: 64,
    });
    return true;
  }

  const desiredRules = buildAutomodDesiredRules(current);
  if (desiredRules.length === 0) {
    await interaction.reply({
      embeds: [
        E.errorEmbed(t(language, "setup.automod.error_no_active_presets")),
      ],
      flags: 64,
    });
    return true;
  }

  const { permissionReport } = await getPermissionReport(interaction.guild, current);
  if (!permissionReport.ok) {
    const summary = buildPermissionFailureSummary("sync", permissionReport, language);
    await persistSyncState(gid, {
      automod_last_sync_at: new Date(),
      automod_last_sync_status: "failed",
      automod_last_sync_summary: summary,
    });
    await interaction.reply({
      embeds: [E.errorEmbed(summary)],
      flags: 64,
    });
    return true;
  }

  await interaction.deferReply({ ephemeral: true });

  let fetchedRules;
  try {
    fetchedRules = await interaction.guild.autoModerationRules.fetch();
  } catch (error) {
    const summary = error?.message
      ? t(language, "setup.automod.fetch_error", { action: "sync", message: error.message })
      : t(language, "setup.automod.fetch_error_generic");
    await persistSyncState(gid, {
      automod_last_sync_at: new Date(),
      automod_last_sync_status: "failed",
      automod_last_sync_summary: summary,
    });
    await interaction.editReply({ embeds: [E.errorEmbed(summary)] });
    return true;
  }

  const managedRules = matchManagedAutomodRules(fetchedRules, current);
  const plan = planAutomodSync({ desiredRules, managedRules });
  const result = await executeAutomodSyncPlan(interaction.guild, plan, {
    actionLabel: "sync",
  });

  await persistSyncState(gid, {
    automod_enabled: current.automod_enabled,
    automod_managed_rule_ids: result.ruleIds,
    automod_last_sync_at: new Date(),
    automod_last_sync_status: result.status,
    automod_last_sync_summary: result.summary,
  });

  const detailLine = t(language, "setup.automod.sync_summary_line", {
    updated: result.updated.length,
    updatedPlural: result.updated.length === 1 ? "" : "s",
    created: result.created.length,
    createdPlural: result.created.length === 1 ? "" : "s",
    removed: result.removed.length,
    removedPlural: result.removed.length === 1 ? "" : "s",
  });
  const embedFactory = result.failed.length > 0 ? E.warningEmbed : E.successEmbed;

  await interaction.editReply({
    embeds: [
      embedFactory(`${detailLine}\n${result.summary}.`),
    ],
  });
  return true;
}

async function handleDisable(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, current);
  const { permissionReport } = await getPermissionReport(interaction.guild, current);

  if (!permissionReport.ok) {
    const summary = buildPermissionFailureSummary("disable", permissionReport, language);
    await persistSyncState(gid, {
      automod_last_sync_at: new Date(),
      automod_last_sync_status: "failed",
      automod_last_sync_summary: summary,
    });
    await interaction.reply({
      embeds: [E.errorEmbed(summary)],
      flags: 64,
    });
    return true;
  }

  await interaction.deferReply({ ephemeral: true });

  let fetchedRules;
  try {
    fetchedRules = await interaction.guild.autoModerationRules.fetch();
  } catch (error) {
    const summary = error?.message
      ? t(language, "setup.automod.fetch_error", { action: "disable", message: error.message })
      : t(language, "setup.automod.fetch_error_generic");
    await persistSyncState(gid, {
      automod_last_sync_at: new Date(),
      automod_last_sync_status: "failed",
      automod_last_sync_summary: summary,
    });
    await interaction.editReply({ embeds: [E.errorEmbed(summary)] });
    return true;
  }

  const managedRules = matchManagedAutomodRules(fetchedRules, current);
  const removalPlan = {
    create: [],
    update: [],
    skip: [],
    remove: Object.entries(managedRules).map(([key, rule]) => ({
      key,
      current: rule,
    })),
  };
  const result = await executeAutomodSyncPlan(interaction.guild, removalPlan, {
    actionLabel: "disable",
  });

  const remainingRuleIds = result.ruleIds;
  const disableSucceeded = Object.keys(remainingRuleIds).length === 0;
  await persistSyncState(gid, {
    automod_enabled: disableSucceeded ? false : current.automod_enabled,
    automod_managed_rule_ids: remainingRuleIds,
    automod_last_sync_at: new Date(),
    automod_last_sync_status: disableSucceeded ? "disabled" : result.status,
    automod_last_sync_summary: disableSucceeded
      ? (result.removed.length
          ? t(language, "setup.automod.disable_removed", { count: result.removed.length, plural: result.removed.length === 1 ? "" : "s" })
          : t(language, "setup.automod.disable_no_rules"))
      : result.summary,
  });

  const embedFactory = disableSucceeded ? E.successEmbed : E.warningEmbed;
  await interaction.editReply({
    embeds: [
      embedFactory(
        disableSucceeded
          ? (result.removed.length
              ? t(language, "setup.automod.disable_removed", { count: result.removed.length, plural: result.removed.length === 1 ? "" : "s" })
              : t(language, "setup.automod.disable_no_rules"))
          : t(language, "setup.automod.disable_partial", { removed: result.removed.length, removedPlural: result.removed.length === 1 ? "" : "s", preserved: Object.keys(remainingRuleIds).length })
      ),
    ],
  });
  return true;
}

async function handleAlertChannel(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, current);
  const clear = Boolean(getBooleanOption(interaction, "clear"));
  const channel = getChannelOption(interaction, "channel");

  if (!channel && !clear) {
    await interaction.reply({
      embeds: [E.errorEmbed(t(language, "setup.automod.error_provide_channel_or_clear"))],
      flags: 64,
    });
    return true;
  }

  const nextChannelId = clear ? null : channel.id;
  await settings.update(gid, { automod_alert_channel: nextChannelId });

  const hint = buildApplyHint(current, language);
  await interaction.reply({
    embeds: [
      E.successEmbed(
        clear
          ? t(language, "setup.automod.success_alert_cleared", { hint })
          : t(language, "setup.automod.success_alert_set", { channel: `<#${nextChannelId}>`, hint })
      ),
    ],
    flags: 64,
  });
  return true;
}

async function handleExemptChannel(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, current);
  const action = String(getStringOption(interaction, "action") || "").trim().toLowerCase();
  const channel = getChannelOption(interaction, "channel");
  const existing = Array.isArray(current.automod_exempt_channels)
    ? [...current.automod_exempt_channels]
    : [];

  if (action !== "reset" && !channel) {
    await interaction.reply({
      embeds: [E.errorEmbed(t(language, "setup.automod.error_provide_channel_or_reset"))],
      flags: 64,
    });
    return true;
  }

  let next = existing;
  if (action === "add") {
    if (existing.includes(channel.id)) {
      await interaction.reply({
        embeds: [E.infoEmbed("AutoMod", t(language, "setup.automod.info_already_exempt_channel", { channel: channel.toString() }), interaction.client)],
        flags: 64,
      });
      return true;
    }
    if (existing.length >= 50) {
      await interaction.reply({
        embeds: [E.errorEmbed(t(language, "setup.automod.error_max_exempt_channels"))],
        flags: 64,
      });
      return true;
    }
    next = [...existing, channel.id];
  } else if (action === "remove") {
    next = existing.filter((id) => id !== channel.id);
  } else if (action === "reset") {
    next = [];
  } else {
    await interaction.reply({
      embeds: [E.errorEmbed(t(language, "setup.automod.error_unknown_action"))],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, { automod_exempt_channels: next });
  const hint = buildApplyHint(current, language);
  await interaction.reply({
    embeds: [
      E.successEmbed(
        t(language, "setup.automod.success_exempt_channels_updated", { count: next.length, hint })
      ),
    ],
    flags: 64,
  });
  return true;
}

async function handleExemptRole(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, current);
  const action = String(getStringOption(interaction, "action") || "").trim().toLowerCase();
  const role = getRoleOption(interaction, "role");
  const existing = Array.isArray(current.automod_exempt_roles)
    ? [...current.automod_exempt_roles]
    : [];

  if (action !== "reset" && !role) {
    await interaction.reply({
      embeds: [E.errorEmbed(t(language, "setup.automod.error_provide_role_or_reset"))],
      flags: 64,
    });
    return true;
  }

  let next = existing;
  if (action === "add") {
    if (existing.includes(role.id)) {
      await interaction.reply({
        embeds: [E.infoEmbed("AutoMod", t(language, "setup.automod.info_already_exempt_role", { role: role.toString() }), interaction.client)],
        flags: 64,
      });
      return true;
    }
    if (existing.length >= 20) {
      await interaction.reply({
        embeds: [E.errorEmbed(t(language, "setup.automod.error_max_exempt_roles"))],
        flags: 64,
      });
      return true;
    }
    next = [...existing, role.id];
  } else if (action === "remove") {
    next = existing.filter((id) => id !== role.id);
  } else if (action === "reset") {
    next = [];
  } else {
    await interaction.reply({
      embeds: [E.errorEmbed(t(language, "setup.automod.error_unknown_action"))],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, { automod_exempt_roles: next });
  const hint = buildApplyHint(current, language);
  await interaction.reply({
    embeds: [
      E.successEmbed(
        t(language, "setup.automod.success_exempt_roles_updated", { count: next.length, hint })
      ),
    ],
    flags: 64,
  });
  return true;
}

async function handlePreset(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, current);
  const preset = String(getStringOption(interaction, "name") || "").trim().toLowerCase();
  const enabled = Boolean(getBooleanOption(interaction, "enabled"));
  const currentPresets = Array.isArray(current.automod_presets)
    ? [...current.automod_presets]
    : [];

  let nextPresets;
  if (preset === "all") {
    nextPresets = enabled ? [...AUTOMOD_PRESET_KEYS] : [];
  } else if (AUTOMOD_PRESET_KEYS.includes(preset)) {
    const nextSet = new Set(currentPresets);
    if (enabled) {
      nextSet.add(preset);
    } else {
      nextSet.delete(preset);
    }
    nextPresets = AUTOMOD_PRESET_KEYS.filter((key) => nextSet.has(key));
  } else {
    await interaction.reply({
      embeds: [E.errorEmbed(t(language, "setup.automod.error_unknown_preset"))],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, { automod_presets: nextPresets });

  const summary = nextPresets.length
    ? nextPresets.map((key) => getPresetLabel(key)).join(", ")
    : t(language, "setup.automod.presets_none");
  const followUp = nextPresets.length
    ? buildApplyHint(current, language)
    : t(language, "setup.automod.hint_disable");

  await interaction.reply({
    embeds: [
      E.successEmbed(t(language, "setup.automod.success_presets_updated", { summary, followUp })),
    ],
    flags: 64,
  });
  return true;
}

async function execute(ctx) {
  if (ctx.group !== "automod") return false;

  if (ctx.sub === "status") return handleStatus(ctx);
  if (ctx.sub === "bootstrap") return handleBootstrap(ctx);
  if (ctx.sub === "sync") return handleSync(ctx);
  if (ctx.sub === "disable") return handleDisable(ctx);
  if (ctx.sub === "channel-alert") return handleAlertChannel(ctx);
  if (ctx.sub === "exempt-channel") return handleExemptChannel(ctx);
  if (ctx.sub === "exempt-role") return handleExemptRole(ctx);
  if (ctx.sub === "preset") return handlePreset(ctx);
  return false;
}

module.exports = {
  register,
  execute,
};
