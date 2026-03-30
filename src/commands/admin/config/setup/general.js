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
const {
  withDescriptionLocalizations,
  localizedChoice,
} = require("../../../../utils/slashLocalizations");

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
    withDescriptionLocalizations(
      group
        .setName("general")
        .setDescription(t("en", "setup.general.group_description")),
      "setup.general.group_description"
    )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub.setName("info").setDescription(t("en", "setup.general.info_description")),
          "setup.general.info_description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("logs")
            .setDescription(t("en", "setup.general.logs_description")),
          "setup.general.logs_description"
        )
          .addChannelOption((option) =>
            withDescriptionLocalizations(
              option.setName("channel").setDescription(t("en", "setup.general.option_channel")),
              "setup.general.option_channel"
            ).addChannelTypes(ChannelType.GuildText).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("transcripts")
            .setDescription(t("en", "setup.general.transcripts_description")),
          "setup.general.transcripts_description"
        )
          .addChannelOption((option) =>
            withDescriptionLocalizations(
              option.setName("channel").setDescription(t("en", "setup.general.option_channel")),
              "setup.general.option_channel"
            ).addChannelTypes(ChannelType.GuildText).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("dashboard")
            .setDescription(t("en", "setup.general.dashboard_description")),
          "setup.general.dashboard_description"
        )
          .addChannelOption((option) =>
            withDescriptionLocalizations(
              option.setName("channel").setDescription(t("en", "setup.general.option_channel")),
              "setup.general.option_channel"
            ).addChannelTypes(ChannelType.GuildText).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("weekly-report")
            .setDescription(t("en", "setup.general.weekly_report_description")),
          "setup.general.weekly_report_description"
        )
          .addChannelOption((option) =>
            withDescriptionLocalizations(
              option.setName("channel").setDescription(t("en", "setup.general.option_channel")),
              "setup.general.option_channel"
            ).addChannelTypes(ChannelType.GuildText).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("live-members")
            .setDescription(t("en", "setup.general.live_members_description")),
          "setup.general.live_members_description"
        )
          .addChannelOption((option) =>
            withDescriptionLocalizations(
              option.setName("channel").setDescription(t("en", "setup.general.option_voice_channel")),
              "setup.general.option_voice_channel"
            ).addChannelTypes(ChannelType.GuildVoice).setRequired(true),
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("live-role")
            .setDescription(t("en", "setup.general.live_role_description")),
          "setup.general.live_role_description"
        )
          .addChannelOption((option) =>
            withDescriptionLocalizations(
              option.setName("channel").setDescription(t("en", "setup.general.option_voice_channel")),
              "setup.general.option_voice_channel"
            ).addChannelTypes(ChannelType.GuildVoice).setRequired(true),
          )
          .addRoleOption((option) =>
            withDescriptionLocalizations(
              option.setName("role").setDescription(t("en", "setup.general.option_role_to_count")),
              "setup.general.option_role_to_count"
            ).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("staff-role")
            .setDescription(t("en", "setup.general.staff_role_description")),
          "setup.general.staff_role_description"
        )
          .addRoleOption((option) =>
            withDescriptionLocalizations(
              option.setName("role").setDescription(t("en", "setup.general.option_role")),
              "setup.general.option_role"
            ).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("admin-role")
            .setDescription(t("en", "setup.general.admin_role_description")),
          "setup.general.admin_role_description"
        )
          .addRoleOption((option) =>
            withDescriptionLocalizations(
              option.setName("role").setDescription(t("en", "setup.general.option_role")),
              "setup.general.option_role"
            ).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("verify-role")
            .setDescription(t("en", "setup.general.verify_role_description")),
          "setup.general.verify_role_description"
        )
          .addRoleOption((option) =>
            withDescriptionLocalizations(
              option.setName("role").setDescription(t("en", "setup.general.option_verify_role")),
              "setup.general.option_verify_role"
            ).setRequired(false)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("max-tickets")
            .setDescription(t("en", "setup.general.max_tickets_description")),
          "setup.general.max_tickets_description"
        )
          .addIntegerOption((option) =>
            withDescriptionLocalizations(
              option.setName("count").setDescription(t("en", "setup.general.option_count")),
              "setup.general.option_count"
            ).setMinValue(1).setMaxValue(10).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("global-limit")
            .setDescription(t("en", "setup.general.global_limit_description")),
          "setup.general.global_limit_description"
        )
          .addIntegerOption((option) =>
            withDescriptionLocalizations(
              option.setName("count").setDescription(t("en", "setup.general.option_count")),
              "setup.general.option_count"
            ).setMinValue(0).setMaxValue(500).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("cooldown")
            .setDescription(t("en", "setup.general.cooldown_description")),
          "setup.general.cooldown_description"
        )
          .addIntegerOption((option) =>
            withDescriptionLocalizations(
              option.setName("minutes").setDescription(t("en", "setup.general.option_minutes")),
              "setup.general.option_minutes"
            ).setMinValue(0).setMaxValue(1440).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("min-days")
            .setDescription(t("en", "setup.general.min_days_description")),
          "setup.general.min_days_description"
        )
          .addIntegerOption((option) =>
            withDescriptionLocalizations(
              option.setName("days").setDescription(t("en", "setup.general.option_days")),
              "setup.general.option_days"
            ).setMinValue(0).setMaxValue(365).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("auto-close")
            .setDescription(t("en", "setup.general.auto_close_description")),
          "setup.general.auto_close_description"
        )
          .addIntegerOption((option) =>
            withDescriptionLocalizations(
              option.setName("minutes").setDescription(t("en", "setup.general.option_minutes")),
              "setup.general.option_minutes"
            ).setMinValue(0).setMaxValue(10080).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("sla")
            .setDescription(t("en", "setup.general.sla_description")),
          "setup.general.sla_description"
        )
          .addIntegerOption((option) =>
            withDescriptionLocalizations(
              option.setName("minutes").setDescription(t("en", "setup.general.option_minutes")),
              "setup.general.option_minutes"
            ).setMinValue(0).setMaxValue(1440).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("smart-ping")
            .setDescription(t("en", "setup.general.smart_ping_description")),
          "setup.general.smart_ping_description"
        )
          .addIntegerOption((option) =>
            withDescriptionLocalizations(
              option.setName("minutes").setDescription(t("en", "setup.general.option_minutes")),
              "setup.general.option_minutes"
            ).setMinValue(0).setMaxValue(1440).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("dm-open")
            .setDescription(t("en", "setup.general.dm_open_description")),
          "setup.general.dm_open_description"
        )
          .addBooleanOption((option) =>
            withDescriptionLocalizations(
              option.setName("enabled").setDescription(t("en", "setup.general.option_enabled")),
              "setup.general.option_enabled"
            ).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("dm-close")
            .setDescription(t("en", "setup.general.dm_close_description")),
          "setup.general.dm_close_description"
        )
          .addBooleanOption((option) =>
            withDescriptionLocalizations(
              option.setName("enabled").setDescription(t("en", "setup.general.option_enabled")),
              "setup.general.option_enabled"
            ).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("log-edits")
            .setDescription(t("en", "setup.general.log_edits_description")),
          "setup.general.log_edits_description"
        )
          .addBooleanOption((option) =>
            withDescriptionLocalizations(
              option.setName("enabled").setDescription(t("en", "setup.general.option_enabled")),
              "setup.general.option_enabled"
            ).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("log-deletes")
            .setDescription(t("en", "setup.general.log_deletes_description")),
          "setup.general.log_deletes_description"
        )
          .addBooleanOption((option) =>
            withDescriptionLocalizations(
              option.setName("enabled").setDescription(t("en", "setup.general.option_enabled")),
              "setup.general.option_enabled"
            ).setRequired(true)
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("language")
            .setDescription(t("en", "setup.general.language_description")),
          "setup.general.language_description"
        )
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("value")
                .setDescription(t("en", "setup.general.option_language_value")),
              "setup.general.option_language_value"
            )
              .setRequired(true)
              .addChoices(
                localizedChoice("en", "common.language.en"),
                localizedChoice("es", "common.language.es"),
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
