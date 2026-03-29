const {
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { settings } = require("../../../../utils/database");
const { updateDashboard } = require("../../../../handlers/dashboardHandler");
const { syncGuildLiveStats } = require("../../../../utils/liveStatsChannels");
const E = require("../../../../utils/embeds");
const { normalizeLanguage, t } = require("../../../../utils/i18n");
const { setGuildLanguage } = require("../../../../utils/languageService");
const { setupT } = require("./i18n");

const CHANNEL_SUBS = {
  logs: "log_channel",
  transcripts: "transcript_channel",
  "weekly-report": "weekly_report_channel",
};

function getChannelOption(interaction) {
  return interaction.options.getChannel("channel")
    || interaction.options.getChannel("canal");
}

function getRoleOption(interaction) {
  return interaction.options.getRole("role")
    || interaction.options.getRole("rol");
}

function getIntegerOption(interaction, primary, legacy) {
  return interaction.options.getInteger(primary)
    ?? interaction.options.getInteger(legacy);
}

function getBooleanOption(interaction, primary, legacy) {
  return interaction.options.getBoolean(primary)
    ?? interaction.options.getBoolean(legacy);
}

function getStringOption(interaction, primary, legacy) {
  return interaction.options.getString(primary)
    ?? interaction.options.getString(legacy);
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("general")
      .setDescription("Configure global support system settings")
      .addSubcommand((sub) => sub.setName("info").setDescription("View the current configuration"))
      .addSubcommand((sub) =>
        sub
          .setName("logs")
          .setDescription("Set the log channel")
          .addChannelOption((option) =>
            option.setName("channel").setDescription("Log channel").addChannelTypes(ChannelType.GuildText).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        sub
          .setName("transcripts")
          .setDescription("Set the transcript channel")
          .addChannelOption((option) =>
            option.setName("channel").setDescription("Transcript channel").addChannelTypes(ChannelType.GuildText).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        sub
          .setName("dashboard")
          .setDescription("Set the live dashboard channel")
          .addChannelOption((option) =>
            option.setName("channel").setDescription("Dashboard channel").addChannelTypes(ChannelType.GuildText).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        sub
          .setName("weekly-report")
          .setDescription("Set the weekly report channel")
          .addChannelOption((option) =>
            option.setName("channel").setDescription("Weekly report channel").addChannelTypes(ChannelType.GuildText).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        sub
          .setName("live-members")
          .setDescription("Select the voice channel that will display total members")
          .addChannelOption((option) =>
            option.setName("channel").setDescription("Voice channel").addChannelTypes(ChannelType.GuildVoice).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        sub
          .setName("live-role")
          .setDescription("Select the voice channel that will display the size of a role")
          .addChannelOption((option) =>
            option.setName("channel").setDescription("Voice channel").addChannelTypes(ChannelType.GuildVoice).setRequired(true),
          )
          .addRoleOption((option) => option.setName("role").setDescription("Role to count").setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("staff-role")
          .setDescription("Set the support staff role")
          .addRoleOption((option) => option.setName("role").setDescription("Support role").setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("admin-role")
          .setDescription("Set the bot admin role")
          .addRoleOption((option) => option.setName("role").setDescription("Admin role").setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("verify-role")
          .setDescription("Set the minimum role required to open tickets")
          .addRoleOption((option) => option.setName("role").setDescription("Required role (leave empty to disable)").setRequired(false)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("max-tickets")
          .setDescription("Set the maximum open tickets per user")
          .addIntegerOption((option) => option.setName("count").setDescription("1 to 10").setMinValue(1).setMaxValue(10).setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("global-limit")
          .setDescription("Set the global open ticket limit")
          .addIntegerOption((option) => option.setName("count").setDescription("0 to 500").setMinValue(0).setMaxValue(500).setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("cooldown")
          .setDescription("Set the cooldown between new tickets in minutes")
          .addIntegerOption((option) => option.setName("minutes").setDescription("Minutes").setMinValue(0).setMaxValue(1440).setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("min-days")
          .setDescription("Set the minimum days a user must stay in the server before opening tickets")
          .addIntegerOption((option) => option.setName("days").setDescription("Days").setMinValue(0).setMaxValue(365).setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("auto-close")
          .setDescription("Set inactivity auto-close in minutes")
          .addIntegerOption((option) => option.setName("minutes").setDescription("Minutes").setMinValue(0).setMaxValue(10080).setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("sla")
          .setDescription("Set the SLA warning threshold in minutes")
          .addIntegerOption((option) => option.setName("minutes").setDescription("Minutes").setMinValue(0).setMaxValue(1440).setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("smart-ping")
          .setDescription("Set the smart ping threshold in minutes")
          .addIntegerOption((option) => option.setName("minutes").setDescription("Minutes").setMinValue(0).setMaxValue(1440).setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("dm-open")
          .setDescription("Enable or disable the DM sent when a ticket is opened")
          .addBooleanOption((option) => option.setName("enabled").setDescription("Whether the DM is enabled").setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("dm-close")
          .setDescription("Enable or disable the DM sent when a ticket is closed")
          .addBooleanOption((option) => option.setName("enabled").setDescription("Whether the DM is enabled").setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("log-edits")
          .setDescription("Enable or disable edited message logging inside tickets")
          .addBooleanOption((option) => option.setName("enabled").setDescription("Whether edit logging is enabled").setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("log-deletes")
          .setDescription("Enable or disable deleted message logging inside tickets")
          .addBooleanOption((option) => option.setName("enabled").setDescription("Whether delete logging is enabled").setRequired(true)),
      )
      .addSubcommand((sub) =>
        sub
          .setName("language")
          .setDescription("Set the default bot language for this server")
          .addStringOption((option) =>
            option
              .setName("value")
              .setDescription("Language code")
              .setRequired(true)
              .addChoices(
                { name: "English", value: "en" },
                { name: "Spanish", value: "es" },
              ),
          ),
      ),
  );
}

function formatChannel(id, language) {
  return id ? `<#${id}>` : setupT(language, "general.common.not_configured");
}

function formatRole(id, language) {
  return id ? `<@&${id}>` : setupT(language, "general.common.not_configured");
}

function formatToggle(value, language) {
  return value
    ? setupT(language, "general.common.enabled")
    : setupT(language, "general.common.disabled");
}

function formatMinutes(value, language) {
  return value > 0
    ? setupT(language, "general.common.minutes", { value })
    : setupT(language, "general.common.disabled");
}

function formatLanguageLabel(value, language) {
  const lang = normalizeLanguage(value, "en");
  return t(language, `common.language.${lang}`);
}

async function ensureVoiceStatsPermissions(interaction, channel, language) {
  const botMember = interaction.guild.members.me;
  const canManage = channel.permissionsFor(botMember)?.has(PermissionFlagsBits.ManageChannels);
  if (canManage) return false;

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.ERROR)
        .setTitle(setupT(language, "general.live_stats.missing_permissions_title"))
        .setDescription(
          setupT(language, "general.live_stats.missing_permissions_description", {
            channel: String(channel),
          })
        )
        .addFields({
          name: setupT(language, "general.live_stats.missing_permission_label"),
          value: `- ${setupT(language, "general.permissions.manage_channels")}`,
        })
        .setFooter({
          text: setupT(language, "general.live_stats.missing_permissions_footer"),
        })
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleDashboardSetup(ctx, language) {
  const { interaction, gid } = ctx;
  const channel = getChannelOption(interaction);
  const botMember = interaction.guild.members.me;

  const requiredPermissions = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.ReadMessageHistory,
  ];

  const missing = requiredPermissions.filter((permission) => !channel.permissionsFor(botMember)?.has(permission));
  if (missing.length) {
    const labels = {
      [PermissionFlagsBits.ViewChannel]: setupT(language, "general.permissions.view_channel"),
      [PermissionFlagsBits.SendMessages]: setupT(language, "general.permissions.send_messages"),
      [PermissionFlagsBits.EmbedLinks]: setupT(language, "general.permissions.embed_links"),
      [PermissionFlagsBits.ReadMessageHistory]: setupT(language, "general.permissions.read_history"),
    };

    const missingList = missing
      .map((permission) => `- ${labels[permission] || setupT(language, "general.permissions.fallback")}`)
      .join("\n");
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.ERROR)
          .setTitle(setupT(language, "general.dashboard.missing_permissions_title"))
          .setDescription(
            setupT(language, "general.dashboard.missing_permissions_description", {
              channel: String(channel),
            })
          )
          .addFields({
            name: setupT(language, "general.dashboard.required_permissions"),
            value: missingList,
          })
          .setFooter({
            text: setupT(language, "general.dashboard.missing_permissions_footer"),
          })
          .setTimestamp(),
      ],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, { dashboard_channel: channel.id });
  await updateDashboard(interaction.guild, true);

  const updated = await settings.get(gid);
  const dashboardUrl = updated.dashboard_message_id
    ? `https://discord.com/channels/${gid}/${channel.id}/${updated.dashboard_message_id}`
    : null;

  const embed = new EmbedBuilder()
    .setColor(E.Colors.SUCCESS)
    .setAuthor({
      name: setupT(language, "general.dashboard.author", {
        guild: interaction.guild.name,
      }),
      iconURL: interaction.guild.iconURL({ dynamic: true }) || undefined,
    })
    .setTitle(setupT(language, "general.dashboard.configured_title"))
    .setDescription(
      setupT(language, "general.dashboard.configured_description", {
        channel: String(channel),
      })
    )
    .addFields(
      {
        name: setupT(language, "general.dashboard.operational_summary"),
        value: setupT(language, "general.dashboard.operational_summary_value", {
          channel: String(channel),
        }),
        inline: false,
      },
      {
        name: setupT(language, "general.dashboard.checklist"),
        value: setupT(language, "general.dashboard.checklist_value"),
        inline: false,
      },
      {
        name: setupT(language, "general.dashboard.next_steps"),
        value: setupT(language, "general.dashboard.next_steps_value"),
        inline: false,
      },
    )
    .setTimestamp();

  const payload = { embeds: [embed], flags: 64 };
  if (dashboardUrl) {
    payload.components = [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(dashboardUrl)
          .setLabel(setupT(language, "general.dashboard.open_button")),
      ),
    ];
  }

  await interaction.reply(payload);
  return true;
}

function buildInfoEmbed(interaction, current, language) {
  const dashboardUrl = current.dashboard_channel && current.dashboard_message_id
    ? `https://discord.com/channels/${interaction.guild.id}/${current.dashboard_channel}/${current.dashboard_message_id}`
    : null;

  return new EmbedBuilder()
    .setColor(E.Colors.PRIMARY)
    .setAuthor({
      name: setupT(language, "general.info.author", {
        guild: interaction.guild.name,
      }),
      iconURL: interaction.guild.iconURL({ dynamic: true }) || undefined,
    })
    .setTitle(setupT(language, "general.info.title"))
    .setDescription(setupT(language, "general.info.description"))
    .addFields(
      {
        name: setupT(language, "general.info.channels"),
        value:
          `${setupT(language, "general.info.logs")}: ${formatChannel(current.log_channel, language)}\n` +
          `${setupT(language, "general.info.transcripts")}: ${formatChannel(current.transcript_channel, language)}\n` +
          `${setupT(language, "general.info.dashboard_channel")}: ${formatChannel(current.dashboard_channel, language)}\n` +
          `${setupT(language, "general.info.weekly_report")}: ${formatChannel(current.weekly_report_channel, language)}\n` +
          `${setupT(language, "general.info.ticket_panel")}: ${formatChannel(current.panel_channel_id, language)}\n` +
          `${setupT(language, "general.info.live_members")}: ${formatChannel(current.live_members_channel, language)}\n` +
          `${setupT(language, "general.info.live_role")}: ${formatChannel(current.live_role_channel, language)}`,
        inline: false,
      },
      {
        name: setupT(language, "general.info.roles"),
        value:
          `${setupT(language, "general.info.support_role")}: ${formatRole(current.support_role, language)}\n` +
          `${setupT(language, "general.info.admin_role")}: ${formatRole(current.admin_role, language)}\n` +
          `${setupT(language, "general.info.verification_role")}: ${formatRole(current.verify_role, language)}\n` +
          `${setupT(language, "general.info.live_role_target")}: ${formatRole(current.live_role_id, language)}`,
        inline: false,
      },
      {
        name: setupT(language, "general.info.ticket_policies"),
        value:
          `${setupT(language, "general.info.max_per_user")}: ${current.max_tickets}\n` +
          `${setupT(language, "general.info.global_limit")}: ${current.global_ticket_limit || setupT(language, "general.common.unlimited")}\n` +
          `${setupT(language, "general.info.cooldown")}: ${formatMinutes(current.cooldown_minutes, language)}\n` +
          `${setupT(language, "general.info.minimum_days")}: ${current.min_days}`,
        inline: true,
      },
      {
        name: setupT(language, "general.info.automation"),
        value:
          `${setupT(language, "general.info.auto_close")}: ${formatMinutes(current.auto_close_minutes, language)}\n` +
          `${setupT(language, "general.info.sla_warning")}: ${formatMinutes(current.sla_minutes, language)}\n` +
          `${setupT(language, "general.info.smart_ping")}: ${formatMinutes(current.smart_ping_minutes, language)}\n` +
          `${setupT(language, "general.info.sla_escalation")}: ${current.sla_escalation_enabled ? formatMinutes(current.sla_escalation_minutes, language) : setupT(language, "general.common.disabled")}`,
        inline: true,
      },
      {
        name: setupT(language, "general.info.status"),
        value:
          `${setupT(language, "general.info.dm_open")}: ${formatToggle(current.dm_on_open, language)}\n` +
          `${setupT(language, "general.info.dm_close")}: ${formatToggle(current.dm_on_close, language)}\n` +
          `${setupT(language, "general.info.language")}: ${formatLanguageLabel(current.bot_language, language)}\n` +
          `${setupT(language, "general.info.log_edits")}: ${formatToggle(current.log_edits, language)}\n` +
          `${setupT(language, "general.info.log_deletes")}: ${formatToggle(current.log_deletes, language)}\n` +
          `${setupT(language, "general.info.maintenance")}: ${current.maintenance_mode ? setupT(language, "general.info.maintenance_enabled", {
            reason: current.maintenance_reason || setupT(language, "general.common.no_reason"),
          }) : setupT(language, "general.common.disabled")}`,
        inline: false,
      },
      {
        name: setupT(language, "general.info.dashboard"),
        value: dashboardUrl
          ? `[${setupT(language, "general.info.dashboard_link")}](${dashboardUrl})`
          : setupT(language, "general.info.dashboard_missing"),
        inline: false,
      },
    )
    .setFooter({
      text: setupT(language, "general.info.history_footer", {
        count: current.ticket_counter || 0,
      }),
    })
    .setTimestamp();
}

async function execute(ctx) {
  const { interaction, group, sub, gid, s, ok, er } = ctx;
  const language = normalizeLanguage(s?.bot_language, "en");
  if (group !== "general") return false;

  if (sub === "dashboard") {
    return handleDashboardSetup(ctx, language);
  }

  if (CHANNEL_SUBS[sub]) {
    const channel = getChannelOption(interaction);
    await settings.update(gid, { [CHANNEL_SUBS[sub]]: channel.id });
    const channelLabels = {
      logs: setupT(language, "general.info.logs"),
      transcripts: setupT(language, "general.info.transcripts"),
      "weekly-report": setupT(language, "general.info.weekly_report"),
    };
    return ok(
      setupT(language, "general.success.channel_updated", {
        label: channelLabels[sub] || sub,
        target: String(channel),
      })
    );
  }

  if (sub === "live-members") {
    const channel = getChannelOption(interaction);
    const blocked = await ensureVoiceStatsPermissions(interaction, channel, language);
    if (blocked) return true;

    await settings.update(gid, { live_members_channel: channel.id });
    await syncGuildLiveStats(interaction.guild, { hydrateMembers: true });
    return ok(
      setupT(language, "general.success.live_members_updated", {
        channel: String(channel),
      })
    );
  }

  if (sub === "live-role") {
    const channel = getChannelOption(interaction);
    const role = getRoleOption(interaction);
    const blocked = await ensureVoiceStatsPermissions(interaction, channel, language);
    if (blocked) return true;

    await settings.update(gid, {
      live_role_channel: channel.id,
      live_role_id: role.id,
    });
    await syncGuildLiveStats(interaction.guild, { hydrateMembers: true });
    return ok(
      setupT(language, "general.success.live_role_updated", {
        channel: String(channel),
        role: String(role),
      })
    );
  }

  if (sub === "staff-role") {
    const role = getRoleOption(interaction);
    await settings.update(gid, { support_role: role.id });
    return ok(
      setupT(language, "general.success.support_role_updated", {
        role: String(role),
      })
    );
  }

  if (sub === "admin-role") {
    const role = getRoleOption(interaction);
    await settings.update(gid, { admin_role: role.id });
    return ok(
      setupT(language, "general.success.admin_role_updated", {
        role: String(role),
      })
    );
  }

  if (sub === "verify-role") {
    const role = getRoleOption(interaction);
    await settings.update(gid, { verify_role: role ? role.id : null });
    return ok(
      role
        ? setupT(language, "general.success.verify_role_updated", {
            role: String(role),
          })
        : setupT(language, "general.success.verify_role_disabled")
    );
  }

  if (sub === "max-tickets") {
    const count = getIntegerOption(interaction, "count", "cantidad");
    await settings.update(gid, { max_tickets: count });
    return ok(setupT(language, "general.success.max_tickets_updated", { count }));
  }

  if (sub === "global-limit") {
    const count = getIntegerOption(interaction, "count", "cantidad");
    await settings.update(gid, { global_ticket_limit: count });
    return ok(
      count === 0
        ? setupT(language, "general.success.global_limit_disabled")
        : setupT(language, "general.success.global_limit_updated", { count })
    );
  }

  if (sub === "cooldown") {
    const minutes = getIntegerOption(interaction, "minutes", "minutos");
    await settings.update(gid, { cooldown_minutes: minutes });
    return ok(
      minutes === 0
        ? setupT(language, "general.success.cooldown_disabled")
        : setupT(language, "general.success.cooldown_updated", { count: minutes })
    );
  }

  if (sub === "min-days") {
    const days = getIntegerOption(interaction, "days", "dias");
    await settings.update(gid, { min_days: days });
    return ok(
      days === 0
        ? setupT(language, "general.success.min_days_disabled")
        : setupT(language, "general.success.min_days_updated", { count: days })
    );
  }

  if (sub === "auto-close") {
    const minutes = getIntegerOption(interaction, "minutes", "minutos");
    await settings.update(gid, { auto_close_minutes: minutes });
    return ok(
      minutes === 0
        ? setupT(language, "general.success.auto_close_disabled")
        : setupT(language, "general.success.auto_close_updated", { count: minutes })
    );
  }

  if (sub === "sla") {
    const minutes = getIntegerOption(interaction, "minutes", "minutos");
    await settings.update(gid, { sla_minutes: minutes });
    return ok(
      minutes === 0
        ? setupT(language, "general.success.sla_disabled")
        : setupT(language, "general.success.sla_updated", { count: minutes })
    );
  }

  if (sub === "smart-ping") {
    const minutes = getIntegerOption(interaction, "minutes", "minutos");
    await settings.update(gid, { smart_ping_minutes: minutes });
    return ok(
      minutes === 0
        ? setupT(language, "general.success.smart_ping_disabled")
        : setupT(language, "general.success.smart_ping_updated", { count: minutes })
    );
  }

  if (sub === "dm-open") {
    const enabled = getBooleanOption(interaction, "enabled", "activado");
    await settings.update(gid, { dm_on_open: enabled });
    return ok(
      setupT(language, "general.success.dm_open_updated", {
        state: enabled
          ? setupT(language, "general.common.enabled")
          : setupT(language, "general.common.disabled"),
      })
    );
  }

  if (sub === "dm-close") {
    const enabled = getBooleanOption(interaction, "enabled", "activado");
    await settings.update(gid, { dm_on_close: enabled });
    return ok(
      setupT(language, "general.success.dm_close_updated", {
        state: enabled
          ? setupT(language, "general.common.enabled")
          : setupT(language, "general.common.disabled"),
      })
    );
  }

  if (sub === "log-edits") {
    const enabled = getBooleanOption(interaction, "enabled", "activado");
    await settings.update(gid, { log_edits: enabled });
    return ok(
      setupT(language, "general.success.log_edits_updated", {
        state: enabled
          ? setupT(language, "general.common.enabled")
          : setupT(language, "general.common.disabled"),
      })
    );
  }

  if (sub === "log-deletes") {
    const enabled = getBooleanOption(interaction, "enabled", "activado");
    await settings.update(gid, { log_deletes: enabled });
    return ok(
      setupT(language, "general.success.log_deletes_updated", {
        state: enabled
          ? setupT(language, "general.common.enabled")
          : setupT(language, "general.common.disabled"),
      })
    );
  }

  if (sub === "language") {
    const value = normalizeLanguage(getStringOption(interaction, "value", "valor"), "en");
    const updated = await setGuildLanguage(gid, value, interaction.user.id, {
      onboardingCompleted: true,
      source: "command.setup.general.language",
      reason: t(value, "setup.language.audit_reason_manual"),
    });
    if (!updated) {
      return er(t(value, "errors.language_save_failed"));
    }
    const label = t(value, `setup.general.language_label_${value}`);
    return ok(t(value, "setup.general.language_set", { label }));
  }

  if (sub === "info") {
    await interaction.reply({
      embeds: [buildInfoEmbed(interaction, s, language)],
      flags: 64,
    });
    return true;
  }

  return false;
}

module.exports = {
  register,
  execute,
};
