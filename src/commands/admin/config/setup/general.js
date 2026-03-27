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

function formatChannel(id) {
  return id ? `<#${id}>` : "Not configured";
}

function formatRole(id) {
  return id ? `<@&${id}>` : "Not configured";
}

function formatToggle(value) {
  return value ? "Enabled" : "Disabled";
}

function formatMinutes(value) {
  return value > 0 ? `${value} min` : "Disabled";
}

function formatLanguageLabel(value) {
  const lang = normalizeLanguage(value, "en");
  return lang === "en" ? "English" : "Spanish";
}

async function ensureVoiceStatsPermissions(interaction, channel) {
  const botMember = interaction.guild.members.me;
  const canManage = channel.permissionsFor(botMember)?.has(PermissionFlagsBits.ManageChannels);
  if (canManage) return false;

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.ERROR)
        .setTitle("Missing permissions for live channel stats")
        .setDescription(`I cannot rename ${channel}.`)
        .addFields({ name: "Missing permission", value: "- Manage Channels" })
        .setFooter({ text: "Grant the permission and run the command again." })
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleDashboardSetup(ctx) {
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
      [PermissionFlagsBits.ViewChannel]: "View Channel",
      [PermissionFlagsBits.SendMessages]: "Send Messages",
      [PermissionFlagsBits.EmbedLinks]: "Embed Links",
      [PermissionFlagsBits.ReadMessageHistory]: "Read Message History",
    };

    const missingList = missing.map((permission) => `- ${labels[permission] || "Permission"}`).join("\n");
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.ERROR)
          .setTitle("Missing dashboard permissions")
          .setDescription(`I cannot use ${channel} as the dashboard channel.`)
          .addFields({ name: "Required permissions", value: missingList })
          .setFooter({ text: "Grant the missing permissions and run /setup general dashboard again." })
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
      name: `Dashboard Control | ${interaction.guild.name}`,
      iconURL: interaction.guild.iconURL({ dynamic: true }) || undefined,
    })
    .setTitle("Discord dashboard configured")
    .setDescription(
      `The live dashboard is now configured in ${channel}.\n` +
      "Support metrics will be published there and kept in sync automatically.",
    )
    .addFields(
      {
        name: "Operational summary",
        value:
          `Channel: ${channel}\n` +
          "Auto refresh: every 30 seconds\n" +
          "Manual control: Refresh Panel button",
        inline: false,
      },
      {
        name: "Checklist",
        value:
          "- Dashboard channel saved\n" +
          "- Bot permissions verified\n" +
          "- Dashboard message synchronized",
        inline: false,
      },
      {
        name: "Recommended next steps",
        value:
          "- /setup general staff-role @role\n" +
          "- /setup general logs #channel\n" +
          "- /setup general transcripts #channel",
        inline: false,
      },
    )
    .setTimestamp();

  const payload = { embeds: [embed], flags: 64 };
  if (dashboardUrl) {
    payload.components = [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(dashboardUrl).setLabel("Open Dashboard"),
      ),
    ];
  }

  await interaction.reply(payload);
  return true;
}

function buildInfoEmbed(interaction, current) {
  const dashboardUrl = current.dashboard_channel && current.dashboard_message_id
    ? `https://discord.com/channels/${interaction.guild.id}/${current.dashboard_channel}/${current.dashboard_message_id}`
    : null;

  return new EmbedBuilder()
    .setColor(E.Colors.PRIMARY)
    .setAuthor({
      name: `General Setup | ${interaction.guild.name}`,
      iconURL: interaction.guild.iconURL({ dynamic: true }) || undefined,
    })
    .setTitle("System configuration status")
    .setDescription("Consolidated view for support, automation, and operational controls.")
    .addFields(
      {
        name: "Channels",
        value:
          `Logs: ${formatChannel(current.log_channel)}\n` +
          `Transcripts: ${formatChannel(current.transcript_channel)}\n` +
          `Dashboard: ${formatChannel(current.dashboard_channel)}\n` +
          `Weekly report: ${formatChannel(current.weekly_report_channel)}\n` +
          `Ticket panel: ${formatChannel(current.panel_channel_id)}\n` +
          `Live members: ${formatChannel(current.live_members_channel)}\n` +
          `Live role: ${formatChannel(current.live_role_channel)}`,
        inline: false,
      },
      {
        name: "Roles",
        value:
          `Support: ${formatRole(current.support_role)}\n` +
          `Admin: ${formatRole(current.admin_role)}\n` +
          `Verification: ${formatRole(current.verify_role)}\n` +
          `Live role target: ${formatRole(current.live_role_id)}`,
        inline: false,
      },
      {
        name: "Ticket policies",
        value:
          `Max per user: ${current.max_tickets}\n` +
          `Global limit: ${current.global_ticket_limit || "Unlimited"}\n` +
          `Cooldown: ${formatMinutes(current.cooldown_minutes)}\n` +
          `Minimum days: ${current.min_days}`,
        inline: true,
      },
      {
        name: "Automation",
        value:
          `Auto-close: ${formatMinutes(current.auto_close_minutes)}\n` +
          `SLA warning: ${formatMinutes(current.sla_minutes)}\n` +
          `Smart ping: ${formatMinutes(current.smart_ping_minutes)}\n` +
          `SLA escalation: ${current.sla_escalation_enabled ? formatMinutes(current.sla_escalation_minutes) : "Disabled"}`,
        inline: true,
      },
      {
        name: "Status",
        value:
          `DM on open: ${formatToggle(current.dm_on_open)}\n` +
          `DM on close: ${formatToggle(current.dm_on_close)}\n` +
          `Language: ${formatLanguageLabel(current.bot_language)}\n` +
          `Log edits: ${formatToggle(current.log_edits)}\n` +
          `Log deletes: ${formatToggle(current.log_deletes)}\n` +
          `Maintenance: ${current.maintenance_mode ? `Enabled (${current.maintenance_reason || "no reason"})` : "Disabled"}`,
        inline: false,
      },
      {
        name: "Dashboard",
        value: dashboardUrl ? `[Open dashboard message](${dashboardUrl})` : "No dashboard message has been published yet.",
        inline: false,
      },
    )
    .setFooter({ text: `Historical tickets created: ${current.ticket_counter || 0}` })
    .setTimestamp();
}

async function execute(ctx) {
  const { interaction, group, sub, gid, s, ok } = ctx;
  if (group !== "general") return false;

  if (sub === "dashboard") {
    return handleDashboardSetup(ctx);
  }

  if (CHANNEL_SUBS[sub]) {
    const channel = getChannelOption(interaction);
    await settings.update(gid, { [CHANNEL_SUBS[sub]]: channel.id });
    return ok(`Channel for **${sub}** updated to ${channel}.`);
  }

  if (sub === "live-members") {
    const channel = getChannelOption(interaction);
    const blocked = await ensureVoiceStatsPermissions(interaction, channel);
    if (blocked) return true;

    await settings.update(gid, { live_members_channel: channel.id });
    await syncGuildLiveStats(interaction.guild, { hydrateMembers: true });
    return ok(`Live members channel updated to ${channel}.`);
  }

  if (sub === "live-role") {
    const channel = getChannelOption(interaction);
    const role = getRoleOption(interaction);
    const blocked = await ensureVoiceStatsPermissions(interaction, channel);
    if (blocked) return true;

    await settings.update(gid, {
      live_role_channel: channel.id,
      live_role_id: role.id,
    });
    await syncGuildLiveStats(interaction.guild, { hydrateMembers: true });
    return ok(`Live role channel updated to ${channel}, tracking ${role}.`);
  }

  if (sub === "staff-role") {
    const role = getRoleOption(interaction);
    await settings.update(gid, { support_role: role.id });
    return ok(`Support role updated to ${role}.`);
  }

  if (sub === "admin-role") {
    const role = getRoleOption(interaction);
    await settings.update(gid, { admin_role: role.id });
    return ok(`Bot admin role updated to ${role}.`);
  }

  if (sub === "verify-role") {
    const role = getRoleOption(interaction);
    await settings.update(gid, { verify_role: role ? role.id : null });
    return ok(role ? `Minimum role required to open tickets: ${role}` : "Minimum role requirement disabled.");
  }

  if (sub === "max-tickets") {
    const count = getIntegerOption(interaction, "count", "cantidad");
    await settings.update(gid, { max_tickets: count });
    return ok(`Maximum open tickets per user: **${count}**.`);
  }

  if (sub === "global-limit") {
    const count = getIntegerOption(interaction, "count", "cantidad");
    await settings.update(gid, { global_ticket_limit: count });
    return ok(count === 0 ? "Global ticket limit disabled." : `Global ticket limit: **${count}** open tickets.`);
  }

  if (sub === "cooldown") {
    const minutes = getIntegerOption(interaction, "minutes", "minutos");
    await settings.update(gid, { cooldown_minutes: minutes });
    return ok(minutes === 0 ? "Ticket cooldown disabled." : `Ticket cooldown set to **${minutes} minutes**.`);
  }

  if (sub === "min-days") {
    const days = getIntegerOption(interaction, "days", "dias");
    await settings.update(gid, { min_days: days });
    return ok(days === 0 ? "Minimum days requirement disabled." : `Minimum days in server set to **${days}**.`);
  }

  if (sub === "auto-close") {
    const minutes = getIntegerOption(interaction, "minutes", "minutos");
    await settings.update(gid, { auto_close_minutes: minutes });
    return ok(minutes === 0 ? "Auto-close disabled." : `Auto-close set to **${minutes} minutes** of inactivity.`);
  }

  if (sub === "sla") {
    const minutes = getIntegerOption(interaction, "minutes", "minutos");
    await settings.update(gid, { sla_minutes: minutes });
    return ok(minutes === 0 ? "SLA warning disabled." : `SLA warning threshold set to **${minutes} minutes**.`);
  }

  if (sub === "smart-ping") {
    const minutes = getIntegerOption(interaction, "minutes", "minutos");
    await settings.update(gid, { smart_ping_minutes: minutes });
    return ok(minutes === 0 ? "Smart ping disabled." : `Smart ping threshold set to **${minutes} minutes** without response.`);
  }

  if (sub === "dm-open") {
    const enabled = getBooleanOption(interaction, "enabled", "activado");
    await settings.update(gid, { dm_on_open: enabled });
    return ok(`Ticket open DM is now **${enabled ? "enabled" : "disabled"}**.`);
  }

  if (sub === "dm-close") {
    const enabled = getBooleanOption(interaction, "enabled", "activado");
    await settings.update(gid, { dm_on_close: enabled });
    return ok(`Ticket close DM is now **${enabled ? "enabled" : "disabled"}**.`);
  }

  if (sub === "log-edits") {
    const enabled = getBooleanOption(interaction, "enabled", "activado");
    await settings.update(gid, { log_edits: enabled });
    return ok(`Edited message logging is now **${enabled ? "enabled" : "disabled"}**.`);
  }

  if (sub === "log-deletes") {
    const enabled = getBooleanOption(interaction, "enabled", "activado");
    await settings.update(gid, { log_deletes: enabled });
    return ok(`Deleted message logging is now **${enabled ? "enabled" : "disabled"}**.`);
  }

  if (sub === "language") {
    const value = normalizeLanguage(getStringOption(interaction, "value", "valor"), "en");
    await settings.update(gid, { bot_language: value });
    const label = t(value, `setup.general.language_label_${value}`);
    return ok(t(value, "setup.general.language_set", { label }));
  }

  if (sub === "info") {
    await interaction.reply({ embeds: [buildInfoEmbed(interaction, s)], flags: 64 });
    return true;
  }

  return false;
}

module.exports = {
  register,
  execute,
};
