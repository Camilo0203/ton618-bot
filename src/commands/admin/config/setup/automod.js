"use strict";

const {
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const { settings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
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

function formatTimestamp(value, fallback = "Never") {
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

function buildApplyHint(settingsRecord) {
  if (settingsRecord?.automod_enabled) {
    return "Run `/setup automod sync` to apply this change to Discord.";
  }
  return "Run `/setup automod bootstrap` when you're ready to create the managed rules.";
}

function buildPermissionFailureSummary(actionLabel, permissionReport) {
  const missing = Array.isArray(permissionReport?.missing)
    ? permissionReport.missing.map(humanizeAutomodPermission).filter(Boolean)
    : [];

  if (missing.length > 0) {
    return `Skipped ${actionLabel}: missing ${missing.join(", ")}.`;
  }

  return `Skipped ${actionLabel}: permission check failed.`;
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

function buildStatusEmbed(guild, snapshot) {
  const activeRules = snapshot.ruleStatuses
    .filter((rule) => rule.active)
    .map((rule) => {
      const state = rule.present ? "live" : "missing";
      return `- **${rule.label}**: ${state}`;
    })
    .join("\n") || "No AutoMod presets selected.";

  const missingPermissions = snapshot.missingPermissions.length
    ? snapshot.missingPermissions.map(humanizeAutomodPermission).join(", ")
    : "All required permissions are present";

  const embedColor = snapshot.missingPermissions.length
    ? E.Colors.WARNING
    : snapshot.enabled
      ? E.Colors.SUCCESS
      : E.Colors.INFO;

  return new EmbedBuilder()
    .setColor(embedColor)
    .setTitle(`AutoMod Status - ${guild.name}`)
    .setDescription(
      snapshot.enabled
        ? "TON618 AutoMod management is enabled for this guild."
        : "TON618 AutoMod management is disabled for this guild."
    )
    .addFields(
      {
        name: "Managed Rules",
        value:
          `Live count: \`${snapshot.liveManagedRuleCount}/${snapshot.desiredRuleCount}\`\n` +
          `Stored rule IDs: \`${snapshot.storedManagedRuleCount}\`\n` +
          activeRules,
        inline: false,
      },
      {
        name: "Alerts and Exemptions",
        value:
          `Alert channel: ${snapshot.alertChannelId ? `<#${snapshot.alertChannelId}>` : "Not configured"}\n` +
          `Exempt roles: ${summarizeMentionList(snapshot.exemptRoleIds, (id) => `<@&${id}>`, "None")}\n` +
          `Exempt channels: ${summarizeMentionList(snapshot.exemptChannelIds, (id) => `<#${id}>`, "None")}`,
        inline: false,
      },
      {
        name: "Sync State",
        value:
          `Last sync: ${formatTimestamp(snapshot.lastSyncAt)}\n` +
          `Result: \`${snapshot.lastSyncStatus}\`\n` +
          `Summary: ${truncate(snapshot.lastSyncSummary || "No sync recorded yet.", 240)}`,
        inline: false,
      },
      {
        name: "Permissions",
        value: missingPermissions,
        inline: false,
      }
    )
    .setTimestamp();
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("automod")
      .setDescription("Configure TON618-managed Discord AutoMod")
      .addSubcommand((sub) =>
        sub
          .setName("bootstrap")
          .setDescription("Enable TON618 AutoMod management and create the selected rule pack")
      )
      .addSubcommand((sub) =>
        sub
          .setName("status")
          .setDescription("View AutoMod status, live managed rules, and sync health")
      )
      .addSubcommand((sub) =>
        sub
          .setName("sync")
          .setDescription("Reconcile TON618 AutoMod settings with Discord")
      )
      .addSubcommand((sub) =>
        sub
          .setName("disable")
          .setDescription("Remove only TON618-managed AutoMod rules and disable management")
      )
      .addSubcommand((sub) =>
        sub
          .setName("channel-alert")
          .setDescription("Set or clear the alert channel used by TON618 AutoMod")
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("Alert log channel")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            option
              .setName("clear")
              .setDescription("Clear the configured alert channel")
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("exempt-channel")
          .setDescription("Add, remove, or reset AutoMod-exempt channels")
          .addStringOption((option) =>
            option
              .setName("action")
              .setDescription("Update mode")
              .setRequired(true)
              .addChoices(
                { name: "Add", value: "add" },
                { name: "Remove", value: "remove" },
                { name: "Reset", value: "reset" }
              )
          )
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("Target channel")
              .addChannelTypes(...EXEMPT_CHANNEL_TYPES)
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("exempt-role")
          .setDescription("Add, remove, or reset AutoMod-exempt roles")
          .addStringOption((option) =>
            option
              .setName("action")
              .setDescription("Update mode")
              .setRequired(true)
              .addChoices(
                { name: "Add", value: "add" },
                { name: "Remove", value: "remove" },
                { name: "Reset", value: "reset" }
              )
          )
          .addRoleOption((option) =>
            option
              .setName("role")
              .setDescription("Target role")
              .setRequired(false)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("preset")
          .setDescription("Enable or disable a TON618-managed AutoMod preset")
          .addStringOption((option) =>
            option
              .setName("name")
              .setDescription("Preset to update")
              .setRequired(true)
              .addChoices(
                { name: "Spam prevention", value: "spam" },
                { name: "Invite link blocking", value: "invites" },
                { name: "Scam phrase blocking", value: "scam" },
                { name: "All managed presets", value: "all" }
              )
          )
          .addBooleanOption((option) =>
            option
              .setName("enabled")
              .setDescription("Whether the preset should be active")
              .setRequired(true)
          )
      )
  );
}

async function handleStatus(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
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
    embeds: [buildStatusEmbed(interaction.guild, snapshot)],
    flags: 64,
  });
  return true;
}

async function handleBootstrap(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const desiredRules = buildAutomodDesiredRules(current);

  if (desiredRules.length === 0) {
    await interaction.reply({
      embeds: [
        E.errorEmbed(
          "No AutoMod presets are active. Enable at least one preset before bootstrapping."
        ),
      ],
      flags: 64,
    });
    return true;
  }

  const { permissionReport } = await getPermissionReport(interaction.guild, current);
  if (!permissionReport.ok) {
    const summary = buildPermissionFailureSummary("bootstrap", permissionReport);
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
    const summary = `Skipped bootstrap: ${error?.message || "Could not inspect AutoMod rules."}`;
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
      ? `Created ${result.created.length} TON618 AutoMod rule${result.created.length === 1 ? "" : "s"}.`
      : "No new TON618 AutoMod rules were needed.";
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

  if (!current.automod_enabled) {
    await interaction.reply({
      embeds: [
        E.errorEmbed(
          "AutoMod is not enabled for this guild yet. Run `/setup automod bootstrap` first."
        ),
      ],
      flags: 64,
    });
    return true;
  }

  const desiredRules = buildAutomodDesiredRules(current);
  if (desiredRules.length === 0) {
    await interaction.reply({
      embeds: [
        E.errorEmbed(
          "No AutoMod presets are active. Re-enable a preset or use `/setup automod disable`."
        ),
      ],
      flags: 64,
    });
    return true;
  }

  const { permissionReport } = await getPermissionReport(interaction.guild, current);
  if (!permissionReport.ok) {
    const summary = buildPermissionFailureSummary("sync", permissionReport);
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
    const summary = `Skipped sync: ${error?.message || "Could not inspect AutoMod rules."}`;
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

  const detailLine =
    `Updated ${result.updated.length} rule${result.updated.length === 1 ? "" : "s"}, ` +
    `recreated ${result.created.length} missing rule${result.created.length === 1 ? "" : "s"}, ` +
    `removed ${result.removed.length} stale rule${result.removed.length === 1 ? "" : "s"}.`;
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
  const { permissionReport } = await getPermissionReport(interaction.guild, current);

  if (!permissionReport.ok) {
    const summary = buildPermissionFailureSummary("disable", permissionReport);
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
    const summary = `Skipped disable: ${error?.message || "Could not inspect AutoMod rules."}`;
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
          ? `Removed ${result.removed.length} TON618-managed AutoMod rules.`
          : "No TON618-managed AutoMod rules were present.")
      : result.summary,
  });

  const embedFactory = disableSucceeded ? E.successEmbed : E.warningEmbed;
  await interaction.editReply({
    embeds: [
      embedFactory(
        disableSucceeded
          ? (result.removed.length
              ? `Removed ${result.removed.length} TON618-managed AutoMod rule${result.removed.length === 1 ? "" : "s"}.`
              : "No TON618-managed AutoMod rules were present.")
          : `Removed ${result.removed.length} rule${result.removed.length === 1 ? "" : "s"}, preserved ${Object.keys(remainingRuleIds).length} due to errors.`
      ),
    ],
  });
  return true;
}

async function handleAlertChannel(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const clear = Boolean(getBooleanOption(interaction, "clear"));
  const channel = getChannelOption(interaction, "channel");

  if (!channel && !clear) {
    await interaction.reply({
      embeds: [E.errorEmbed("Provide `channel`, or set `clear: true`.")],
      flags: 64,
    });
    return true;
  }

  const nextChannelId = clear ? null : channel.id;
  await settings.update(gid, { automod_alert_channel: nextChannelId });

  await interaction.reply({
    embeds: [
      E.successEmbed(
        clear
          ? `AutoMod alert channel cleared.\n${buildApplyHint(current)}`
          : `AutoMod alert channel set to <#${nextChannelId}>.\n${buildApplyHint(current)}`
      ),
    ],
    flags: 64,
  });
  return true;
}

async function handleExemptChannel(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const action = String(getStringOption(interaction, "action") || "").trim().toLowerCase();
  const channel = getChannelOption(interaction, "channel");
  const existing = Array.isArray(current.automod_exempt_channels)
    ? [...current.automod_exempt_channels]
    : [];

  if (action !== "reset" && !channel) {
    await interaction.reply({
      embeds: [E.errorEmbed("Provide `channel`, or use `action: reset`.")],
      flags: 64,
    });
    return true;
  }

  let next = existing;
  if (action === "add") {
    if (existing.includes(channel.id)) {
      await interaction.reply({
        embeds: [E.infoEmbed("AutoMod", `${channel} is already exempt.`, interaction.client)],
        flags: 64,
      });
      return true;
    }
    if (existing.length >= 50) {
      await interaction.reply({
        embeds: [E.errorEmbed("AutoMod only supports up to 50 exempt channels per guild.")],
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
      embeds: [E.errorEmbed("Unknown action. Use add, remove, or reset.")],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, { automod_exempt_channels: next });
  await interaction.reply({
    embeds: [
      E.successEmbed(
        `AutoMod exempt channels updated. Total: \`${next.length}\`.\n${buildApplyHint(current)}`
      ),
    ],
    flags: 64,
  });
  return true;
}

async function handleExemptRole(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
  const action = String(getStringOption(interaction, "action") || "").trim().toLowerCase();
  const role = getRoleOption(interaction, "role");
  const existing = Array.isArray(current.automod_exempt_roles)
    ? [...current.automod_exempt_roles]
    : [];

  if (action !== "reset" && !role) {
    await interaction.reply({
      embeds: [E.errorEmbed("Provide `role`, or use `action: reset`.")],
      flags: 64,
    });
    return true;
  }

  let next = existing;
  if (action === "add") {
    if (existing.includes(role.id)) {
      await interaction.reply({
        embeds: [E.infoEmbed("AutoMod", `${role} is already exempt.`, interaction.client)],
        flags: 64,
      });
      return true;
    }
    if (existing.length >= 20) {
      await interaction.reply({
        embeds: [E.errorEmbed("AutoMod only supports up to 20 exempt roles per guild.")],
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
      embeds: [E.errorEmbed("Unknown action. Use add, remove, or reset.")],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, { automod_exempt_roles: next });
  await interaction.reply({
    embeds: [
      E.successEmbed(
        `AutoMod exempt roles updated. Total: \`${next.length}\`.\n${buildApplyHint(current)}`
      ),
    ],
    flags: 64,
  });
  return true;
}

async function handlePreset(ctx) {
  const { interaction, gid } = ctx;
  const current = await settings.get(gid);
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
      embeds: [E.errorEmbed("Unknown preset selection.")],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, { automod_presets: nextPresets });

  const summary = nextPresets.length
    ? nextPresets.map((key) => getPresetLabel(key)).join(", ")
    : "No presets selected";
  const followUp = nextPresets.length
    ? buildApplyHint(current)
    : "Use `/setup automod disable` to remove existing rules, or re-enable a preset before syncing.";

  await interaction.reply({
    embeds: [
      E.successEmbed(`AutoMod presets updated: ${summary}.\n${followUp}`),
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
