const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const {
  buildHealthSnapshot,
  getPersistedHealthSnapshot,
} = require("../../../utils/healthMonitor");
const { getBuildInfo } = require("../../../utils/buildInfo");
const { settings } = require("../../../utils/database");
const {
  AUTOMOD_BADGE_GOAL,
  buildAutomodPermissionReport,
  buildAutomodStatusSnapshot,
  humanizeAutomodPermission,
  summarizeAutomodBadgeProgress,
} = require("../../../utils/automod");
const {
  buildCommercialSettingsPatch,
  buildCommercialStatusLines,
  resolveCommercialState,
} = require("../../../utils/commercial");

function formatUptime(secondsTotal) {
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = Math.floor(secondsTotal % 60);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function formatHeartbeatAge(lastSeen) {
  if (!lastSeen) return "No persisted heartbeat";
  const ageMs = Date.now() - new Date(lastSeen).getTime();
  if (!Number.isFinite(ageMs) || ageMs < 0) return "Invalid data";
  const sec = Math.floor(ageMs / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  return `${h}h ${min % 60}m`;
}

function formatBuildValue(buildInfo) {
  return [
    `Fingerprint: \`${buildInfo.fingerprint}\``,
    `Version: \`${buildInfo.version}\``,
    `Commit: \`${buildInfo.shortCommit || "unknown"}\``,
    buildInfo.deployTag ? `Tag: \`${buildInfo.deployTag}\`` : null,
  ].filter(Boolean).join("\n");
}

function getOwnerId(interaction) {
  return process.env.OWNER_ID || interaction.client.application?.owner?.id;
}

function isOwner(interaction) {
  const ownerId = getOwnerId(interaction);
  return !ownerId || interaction.user.id === ownerId;
}

function normalizeDebugSubcommand(sub) {
  return sub === "salud" ? "health" : sub;
}

function addDays(baseDate, days) {
  const out = new Date(baseDate);
  out.setUTCDate(out.getUTCDate() + Number(days || 0));
  return out;
}

function buildCommercialStatusEmbed(title, guildId, guildName, settingsRecord) {
  const state = resolveCommercialState(settingsRecord);
  return new EmbedBuilder()
    .setColor(state.isPro ? 0x57F287 : 0x5865F2)
    .setTitle(title)
    .setDescription(
      `Guild: **${guildName || "Unknown"}**\n` +
      `Guild ID: \`${guildId}\``
    )
    .addFields({
      name: "Commercial status",
      value: buildCommercialStatusLines(settingsRecord).join("\n"),
      inline: false,
    })
    .setTimestamp();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Owner-only diagnostics and entitlement tools")
    .addSubcommand((s) => s.setName("status").setDescription("View bot status and deploy info"))
    .addSubcommand((s) => s.setName("automod-badge").setDescription("View live AutoMod badge progress across guilds"))
    .addSubcommand((s) => s.setName("health").setDescription("View live health and heartbeat state"))
    .addSubcommand((s) => s.setName("memory").setDescription("View process memory usage"))
    .addSubcommand((s) => s.setName("cache").setDescription("View bot cache sizes"))
    .addSubcommand((s) => s.setName("guilds").setDescription("List connected guilds"))
    .addSubcommand((s) => s.setName("voice").setDescription("View music subsystem status"))
    .addSubcommandGroup((group) =>
      group
        .setName("entitlements")
        .setDescription("Inspect or update guild commercial access")
        .addSubcommand((s) =>
          s
            .setName("status")
            .setDescription("Inspect the effective plan and supporter state for a guild")
            .addStringOption((o) => o.setName("guild_id").setDescription("Target guild ID").setRequired(true))
        )
        .addSubcommand((s) =>
          s
            .setName("set-plan")
            .setDescription("Set a guild plan manually")
            .addStringOption((o) => o.setName("guild_id").setDescription("Target guild ID").setRequired(true))
            .addStringOption((o) =>
              o
                .setName("tier")
                .setDescription("Plan tier")
                .setRequired(true)
                .addChoices(
                  { name: "Free", value: "free" },
                  { name: "Pro", value: "pro" },
                )
            )
            .addIntegerOption((o) =>
              o
                .setName("expires_in_days")
                .setDescription("Optional duration in days for Pro")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(3650)
            )
            .addStringOption((o) =>
              o
                .setName("note")
                .setDescription("Optional internal note")
                .setRequired(false)
                .setMaxLength(500)
            )
        )
        .addSubcommand((s) =>
          s
            .setName("set-supporter")
            .setDescription("Enable or disable supporter recognition")
            .addStringOption((o) => o.setName("guild_id").setDescription("Target guild ID").setRequired(true))
            .addBooleanOption((o) =>
              o.setName("active").setDescription("Enable or disable supporter recognition").setRequired(true)
            )
            .addIntegerOption((o) =>
              o
                .setName("expires_in_days")
                .setDescription("Optional duration in days for supporter status")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(3650)
            )
            .addStringOption((o) =>
              o
                .setName("note")
                .setDescription("Optional internal note")
                .setRequired(false)
                .setMaxLength(500)
            )
        )
    ),
  meta: {
    hidden: true,
  },

  async execute(interaction) {
    if (!isOwner(interaction)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xED4245)
            .setDescription("You do not have permission to use debug commands."),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    let group = null;
    try {
      group = interaction.options.getSubcommandGroup(false);
    } catch (_) {}

    const sub = normalizeDebugSubcommand(interaction.options.getSubcommand());

    if (group === "entitlements") {
      if (sub === "status") return this.entitlementStatus(interaction);
      if (sub === "set-plan") return this.setPlan(interaction);
      if (sub === "set-supporter") return this.setSupporter(interaction);
    }

    if (sub === "status") return this.status(interaction);
    if (sub === "automod-badge") return this.automodBadge(interaction);
    if (sub === "health") return this.health(interaction);
    if (sub === "memory") return this.memory(interaction);
    if (sub === "cache") return this.cache(interaction);
    if (sub === "guilds") return this.guilds(interaction);
    if (sub === "voice") return this.voice(interaction);

    return interaction.reply({
      content: "Unknown subcommand.",
      flags: MessageFlags.Ephemeral,
    });
  },

  async status(interaction) {
    const client = interaction.client;
    const buildInfo = getBuildInfo();
    const embed = new EmbedBuilder()
      .setTitle("Bot Status")
      .setColor(0x5865F2)
      .addFields(
        { name: "API ping", value: `\`${client.ws.ping}ms\``, inline: true },
        { name: "Uptime", value: `\`${formatUptime(process.uptime())}\``, inline: true },
        { name: "Guilds", value: `\`${client.guilds.cache.size}\``, inline: true },
        { name: "Cached users", value: `\`${client.users.cache.size}\``, inline: true },
        { name: "Cached channels", value: `\`${client.channels.cache.size}\``, inline: true },
        { name: "Deploy", value: formatBuildValue(buildInfo), inline: false }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async automodBadge(interaction) {
    const guildEntries = [];
    const issueLines = [];

    let application = interaction.client.application || null;
    if (application?.fetch) {
      application = await application.fetch().catch(() => application);
    }

    for (const guild of interaction.client.guilds.cache.values()) {
      const current = await settings.get(guild.id);

      let me = guild.members?.me || null;
      if (!me && guild.members?.fetchMe) {
        me = await guild.members.fetchMe().catch(() => null);
      }

      const permissionReport = buildAutomodPermissionReport(me?.permissions, current);
      let liveRules = [];

      if (permissionReport.ok) {
        try {
          const fetchedRules = await guild.autoModerationRules.fetch();
          liveRules = Array.from(fetchedRules.values());
        } catch (error) {
          permissionReport.ok = false;
          permissionReport.missing = ["MANAGE_GUILD"];
          issueLines.push(
            `- **${guild.name}**: could not inspect AutoMod rules (${error?.message || "unknown error"})`
          );
        }
      } else {
        issueLines.push(
          `- **${guild.name}**: missing ${permissionReport.missing
            .map(humanizeAutomodPermission)
            .join(", ")}`
        );
      }

      guildEntries.push({
        guildId: guild.id,
        guildName: guild.name,
        ...buildAutomodStatusSnapshot({
          settingsRecord: current,
          liveRules,
          permissionReport,
        }),
      });
    }

    const progress = summarizeAutomodBadgeProgress(guildEntries, {
      goal: AUTOMOD_BADGE_GOAL,
      appFlags: application?.flags || null,
    });

    const topGuildLines = guildEntries
      .filter((entry) => entry.liveManagedRuleCount > 0)
      .sort((a, b) => b.liveManagedRuleCount - a.liveManagedRuleCount)
      .slice(0, 8)
      .map((entry) => `- **${entry.guildName}**: \`${entry.liveManagedRuleCount}\` live rules`);

    const embed = new EmbedBuilder()
      .setColor(progress.remainingRuleCount === 0 ? 0x57F287 : 0x5865F2)
      .setTitle("AutoMod Badge Progress")
      .setDescription("Owner-only live count of TON618-managed AutoMod rules across connected guilds.")
      .addFields(
        {
          name: "Progress",
          value:
            `Managed rules: \`${progress.totalManagedRuleCount}\`\n` +
            `Remaining to ${AUTOMOD_BADGE_GOAL}: \`${progress.remainingRuleCount}\`\n` +
            `App flag present: ${progress.badgeFlagActive ? "Yes" : "No"}`,
          inline: false,
        },
        {
          name: "Guild Coverage",
          value:
            `AutoMod enabled: \`${progress.enabledGuildCount}\`\n` +
            `Missing permissions: \`${progress.missingPermissionsGuildCount}\`\n` +
            `Failed or partial sync: \`${progress.failedSyncGuildCount}\``,
          inline: false,
        }
      )
      .setTimestamp();

    if (topGuildLines.length) {
      embed.addFields({
        name: "Guilds With Live TON618 Rules",
        value: topGuildLines.join("\n").slice(0, 1024),
        inline: false,
      });
    }

    if (issueLines.length) {
      embed.addFields({
        name: "Guilds Needing Attention",
        value: issueLines.slice(0, 8).join("\n").slice(0, 1024),
        inline: false,
      });
    }

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  },

  async health(interaction) {
    const buildInfo = getBuildInfo();
    const pingWarnMs = Math.max(50, Number(process.env.HEALTH_PING_WARN_MS || 300));
    const errorWarnPct = Math.max(1, Number(process.env.HEALTH_ERROR_RATE_WARN_PCT || 25));

    const snapshot = buildHealthSnapshot(interaction.client);
    const persisted = await getPersistedHealthSnapshot();
    const topErrors = snapshot.summary?.topErrors || [];

    const pingState = snapshot.pingMs >= pingWarnMs ? "HIGH" : "OK";
    const errorState = snapshot.errorRatePct >= errorWarnPct ? "HIGH" : "OK";

    const embed = new EmbedBuilder()
      .setColor(errorState === "HIGH" || pingState === "HIGH" ? 0xE67E22 : 0x57F287)
      .setTitle("Bot Health")
      .setDescription("Active-window snapshot plus the latest persisted heartbeat.")
      .addFields(
        {
          name: "Quick state",
          value:
            `Ping: **${pingState}** (${snapshot.pingMs}ms, threshold ${pingWarnMs}ms)\n` +
            `Error rate: **${errorState}** (${snapshot.errorRatePct}%, threshold ${errorWarnPct}%)`,
          inline: false,
        },
        {
          name: "Interaction window",
          value:
            `Total: \`${snapshot.interactionsTotal}\`\n` +
            `OK/Error/Denied/Rate: \`${snapshot.byStatus.ok}/${snapshot.byStatus.errors}/${snapshot.byStatus.denied}/${snapshot.byStatus.rateLimited}\``,
          inline: false,
        },
        {
          name: "Heartbeat",
          value:
            `Last seen: \`${formatHeartbeatAge(persisted?.last_seen)}\`\n` +
            `Guilds: \`${persisted?.guilds ?? interaction.client.guilds.cache.size}\``,
          inline: false,
        },
        {
          name: "Deploy",
          value: formatBuildValue(buildInfo),
          inline: false,
        }
      )
      .setTimestamp();

    if (topErrors.length) {
      const lines = topErrors
        .slice(0, 3)
        .map((item, idx) => `${idx + 1}. ${item.kind}:${item.name} -> ${item.errors} errors`);
      embed.addFields({
        name: "Top errors",
        value: lines.join("\n").slice(0, 1024),
        inline: false,
      });
    }

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async memory(interaction) {
    const memory = process.memoryUsage();
    const formatMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

    const embed = new EmbedBuilder()
      .setTitle("Memory Usage")
      .setColor(0xFEE75C)
      .addFields(
        { name: "RSS", value: `\`${formatMB(memory.rss)}\``, inline: true },
        { name: "Heap total", value: `\`${formatMB(memory.heapTotal)}\``, inline: true },
        { name: "Heap used", value: `\`${formatMB(memory.heapUsed)}\``, inline: true },
        { name: "External", value: `\`${formatMB(memory.external)}\``, inline: true }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async cache(interaction) {
    const client = interaction.client;
    const embed = new EmbedBuilder()
      .setTitle("Cache State")
      .setColor(0x57F287)
      .setDescription("Discord.js manages cache automatically.")
      .addFields(
        { name: "Users", value: `\`${client.users.cache.size}\``, inline: true },
        { name: "Channels", value: `\`${client.channels.cache.size}\``, inline: true },
        { name: "Guilds", value: `\`${client.guilds.cache.size}\``, inline: true }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async guilds(interaction) {
    const guilds = interaction.client.guilds.cache.map((g) => ({
      name: g.name,
      id: g.id,
      members: g.memberCount,
    }));

    if (!guilds.length) {
      return interaction.reply({
        content: "There are no connected guilds.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Connected Guilds")
      .setColor(0x5865F2)
      .setDescription(
        guilds
          .slice(0, 20)
          .map((g) => `**${g.name}** (\`${g.id}\`) - ${g.members} members`)
          .join("\n")
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async voice(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Music Subsystem")
      .setColor(0x57F287)
      .setDescription("Music queues are managed per guild.")
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async entitlementStatus(interaction) {
    const guildId = interaction.options.getString("guild_id", true);
    const targetSettings = await settings.get(guildId);
    const guildName = interaction.client.guilds.cache.get(guildId)?.name || null;

    return interaction.reply({
      embeds: [
        buildCommercialStatusEmbed("Guild Entitlements", guildId, guildName, targetSettings),
      ],
      flags: MessageFlags.Ephemeral,
    });
  },

  async setPlan(interaction) {
    const guildId = interaction.options.getString("guild_id", true);
    const tier = interaction.options.getString("tier", true);
    const expiresInDays = interaction.options.getInteger("expires_in_days");
    const note = interaction.options.getString("note");
    const now = new Date();
    const current = await settings.get(guildId);
    const patch = buildCommercialSettingsPatch(current, {
      plan: tier,
      plan_source: "owner_debug",
      plan_started_at: tier === "pro" ? now : null,
      plan_expires_at: tier === "pro" && expiresInDays ? addDays(now, expiresInDays) : null,
      plan_note: note || null,
    }, { now });

    const updated = await settings.update(guildId, patch);
    const guildName = interaction.client.guilds.cache.get(guildId)?.name || null;

    return interaction.reply({
      embeds: [
        buildCommercialStatusEmbed("Plan Updated", guildId, guildName, updated || { ...current, ...patch }),
      ],
      flags: MessageFlags.Ephemeral,
    });
  },

  async setSupporter(interaction) {
    const guildId = interaction.options.getString("guild_id", true);
    const active = interaction.options.getBoolean("active", true);
    const expiresInDays = interaction.options.getInteger("expires_in_days");
    const note = interaction.options.getString("note");
    const now = new Date();
    const current = await settings.get(guildId);
    const state = resolveCommercialState(current, now);
    const patch = buildCommercialSettingsPatch(current, {
      supporter_enabled: active,
      supporter_started_at: active ? now : null,
      supporter_expires_at: active && expiresInDays ? addDays(now, expiresInDays) : null,
      plan_note: note || state.planNote || null,
    }, { now });

    const updated = await settings.update(guildId, patch);
    const guildName = interaction.client.guilds.cache.get(guildId)?.name || null;

    return interaction.reply({
      embeds: [
        buildCommercialStatusEmbed("Supporter Updated", guildId, guildName, updated || { ...current, ...patch }),
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
};

module.exports.alias = {
  help: { redirect: "help" },
  soporte: { redirect: "help", options: { seccion: "tickets" } },
  estadisticas: { redirect: "stats", subcommand: "server" },
};
