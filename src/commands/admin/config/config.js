const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { settings, ticketCategories } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { buildCenterPayload } = require("./configCenter");
const categoryModule = require("./category");
const { buildCommercialStatusLines, resolveCommercialState } = require("../../../utils/commercial");

function fmtChannel(id) {
  return id ? `<#${id}>` : "Not configured";
}

function fmtRole(id) {
  return id ? `<@&${id}>` : "Not configured";
}

function fmtToggle(value, enabledLabel = "Enabled", disabledLabel = "Disabled") {
  return value ? enabledLabel : disabledLabel;
}

function fmtGlobalLimit(value) {
  return Number(value || 0) > 0 ? `\`${Number(value)}\`` : "No limit";
}

function readMinutes(record, minutesKey, hoursKey) {
  const minutes = Number(record?.[minutesKey] || 0);
  if (minutes > 0) return minutes;

  const hours = Number(record?.[hoursKey] || 0);
  return hours > 0 ? hours * 60 : 0;
}

function fmtMinutes(value, disabledLabel = "Disabled") {
  const minutes = Number(value || 0);
  if (minutes <= 0) return disabledLabel;
  if (minutes < 60) return `${minutes} min`;
  if (minutes % 60 === 0) return `${minutes / 60} h`;
  return `${minutes} min`;
}

function fmtPanelStatus(settingsRecord) {
  if (!settingsRecord?.panel_channel_id) return "Not configured";
  if (settingsRecord.panel_message_id) return "Published";
  return "Channel ready, panel pending";
}

function countRules(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return 0;
  return Object.keys(record).length;
}

function priorityBadge(priority) {
  const labels = {
    low: "Low",
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
  };
  return labels[priority] || "Normal";
}

function truncate(text, maxLength) {
  const value = String(text || "").trim();
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}

function summarizeIncidentScope(settingsRecord, categories) {
  if (!settingsRecord?.incident_mode_enabled) return "Inactive";

  const pausedIds = Array.isArray(settingsRecord.incident_paused_categories)
    ? settingsRecord.incident_paused_categories.filter(Boolean)
    : [];

  if (pausedIds.length === 0) return "All categories";

  const labelMap = new Map(
    (Array.isArray(categories) ? categories : []).map((category) => [
      category.category_id,
      category.label || category.category_id,
    ])
  );

  const labels = pausedIds.map((id) => labelMap.get(id) || id);
  const visible = labels.slice(0, 3);
  const remaining = labels.length - visible.length;
  return remaining > 0 ? `${visible.join(", ")} +${remaining}` : visible.join(", ");
}

function summarizeIncidentMessage(settingsRecord) {
  if (!settingsRecord?.incident_mode_enabled) return "Not applicable";
  return settingsRecord?.incident_message
    ? truncate(settingsRecord.incident_message, 120)
    : "Default";
}

function summarizeCategories(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return "No categories configured yet. Use `/config category list` to review them.";
  }

  const lines = categories.slice(0, 6).map((category) => {
    const emoji = category.emoji ? `${category.emoji} ` : "";
    const status = category.enabled === false ? "OFF" : "ON";
    const discordCategory = category.discord_category_id
      ? `<#${category.discord_category_id}>`
      : "no channel";
    const pingCount = Array.isArray(category.ping_roles) ? category.ping_roles.length : 0;

    return (
      `- ${emoji}**${category.label || category.category_id}** | ` +
      `${priorityBadge(category.priority)} | ${status} | ${discordCategory} | pings ${pingCount}`
    );
  });

  if (categories.length > 6) {
    lines.push(`- ... and ${categories.length - 6} more category(ies)`);
  }

  return lines.join("\n");
}

function buildTicketConfigEmbed(guild, settingsRecord, categories) {
  const commercialState = resolveCommercialState(settingsRecord);
  const autoCloseMinutes = readMinutes(settingsRecord, "auto_close_minutes", "auto_close_hours");
  const smartPingMinutes = readMinutes(settingsRecord, "smart_ping_minutes", "smart_ping_hours");
  const slaMinutes = readMinutes(settingsRecord, "sla_minutes", "sla_hours");
  const escalationRuleCount =
    countRules(settingsRecord?.sla_escalation_overrides_priority) +
    countRules(settingsRecord?.sla_escalation_overrides_category);
  const slaRuleCount =
    countRules(settingsRecord?.sla_overrides_priority) +
    countRules(settingsRecord?.sla_overrides_category);
  const reportChannelId =
    settingsRecord?.daily_sla_report_channel ||
    settingsRecord?.log_channel ||
    settingsRecord?.weekly_report_channel ||
    null;

  return new EmbedBuilder()
    .setColor(E.Colors.INFO)
    .setTitle(`Ticket Operations - ${guild.name}`)
    .setDescription(
      "Operational snapshot of the ticket system: channels, limits, SLA posture, automation, and commercial status."
    )
    .addFields(
      {
        name: "Channels and Roles",
        value:
          `Panel: ${fmtChannel(settingsRecord?.panel_channel_id)}\n` +
          `Panel status: ${fmtPanelStatus(settingsRecord)}\n` +
          `Logs: ${fmtChannel(settingsRecord?.log_channel)}\n` +
          `Transcripts: ${fmtChannel(settingsRecord?.transcript_channel)}\n` +
          `Staff: ${fmtRole(settingsRecord?.support_role)}\n` +
          `Admin: ${fmtRole(settingsRecord?.admin_role)}`,
        inline: false,
      },
      {
        name: "Commercial Status",
        value: buildCommercialStatusLines(settingsRecord).join("\n"),
        inline: false,
      },
      {
        name: "Limits and Access",
        value:
          `Max per user: \`${Number(settingsRecord?.max_tickets || 3)}\`\n` +
          `Global limit: ${fmtGlobalLimit(settingsRecord?.global_ticket_limit)}\n` +
          `Cooldown: ${fmtMinutes(settingsRecord?.cooldown_minutes, "No cooldown")}\n` +
          `Minimum days in guild: ${Number(settingsRecord?.min_days || 0)}\n` +
          `Simple help: ${fmtToggle(settingsRecord?.simple_help_mode !== false, "Enabled", "Disabled")}`,
        inline: false,
      },
      {
        name: "SLA and Automation",
        value:
          `Base SLA: ${fmtMinutes(slaMinutes)}\n` +
          `Smart ping: ${fmtMinutes(smartPingMinutes)}\n` +
          `Auto-close: ${fmtMinutes(autoCloseMinutes)}\n` +
          `Auto assignment: ${fmtToggle(settingsRecord?.auto_assign_enabled)}\n` +
          `Online only: ${fmtToggle(settingsRecord?.auto_assign_require_online, "Yes", "No")}\n` +
          `Respect away status: ${fmtToggle(settingsRecord?.auto_assign_respect_away, "Yes", "No")}`,
        inline: false,
      },
      {
        name: "Escalation and Reporting",
        value:
          `SLA escalation: ${fmtToggle(settingsRecord?.sla_escalation_enabled)}\n` +
          `Threshold: ${fmtMinutes(settingsRecord?.sla_escalation_minutes)}\n` +
          `Channel: ${fmtChannel(settingsRecord?.sla_escalation_channel || reportChannelId)}\n` +
          `Role: ${fmtRole(settingsRecord?.sla_escalation_role)}\n` +
          `SLA overrides: \`${slaRuleCount}\`\n` +
          `Escalation overrides: \`${escalationRuleCount}\`\n` +
          `Daily report: ${settingsRecord?.daily_sla_report_enabled ? fmtChannel(reportChannelId) : "Disabled"}\n` +
          `Weekly report: ${fmtChannel(settingsRecord?.weekly_report_channel)}`,
        inline: false,
      },
      {
        name: "Incident Mode",
        value:
          `Status: ${fmtToggle(settingsRecord?.incident_mode_enabled)}\n` +
          `Scope: ${summarizeIncidentScope(settingsRecord, categories)}\n` +
          `Message: ${summarizeIncidentMessage(settingsRecord)}`,
        inline: false,
      },
      {
        name: `Configured Categories (${Array.isArray(categories) ? categories.length : 0})`,
        value: summarizeCategories(categories),
        inline: false,
      }
    )
    .setFooter({
      text: commercialState.isPro
        ? "Use /setup tickets ... to tune advanced automation and /config category list for the full category detail."
        : "Use /setup tickets panel for the free core setup, or ask the owner to activate Pro for advanced ops features.",
    })
    .setTimestamp();
}

let commandBuilder = new SlashCommandBuilder()
  .setName("config")
  .setDescription("Compact configuration center for admins")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcommand) =>
    subcommand.setName("status").setDescription("View the current system status")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("tickets")
      .setDescription("View the full operational ticket configuration")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("center")
      .setDescription("Open the interactive control center")
  );

if (categoryModule.register) {
  commandBuilder = categoryModule.register(commandBuilder);
}

module.exports = {
  data: commandBuilder,

  async execute(interaction) {
    const gid = interaction.guild.id;
    const sub = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup(false);

    if (group === "category" && categoryModule.execute) {
      return categoryModule.execute({ interaction, group, sub });
    }

    const currentSettings = await settings.get(gid);

    if (sub === "center" || sub === "centro") {
      return interaction.reply({
        ...(await buildCenterPayload(interaction.guild, interaction.user.id, "general")),
        flags: 64,
      });
    }

    if (sub === "status" || sub === "estado") {
      const commercialLines = buildCommercialStatusLines(currentSettings);
      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("Configuration Status")
        .addFields(
          { name: "Ticket panel", value: fmtChannel(currentSettings.panel_channel_id), inline: true },
          { name: "Logs", value: fmtChannel(currentSettings.log_channel), inline: true },
          { name: "Transcripts", value: fmtChannel(currentSettings.transcript_channel), inline: true },
          { name: "Live members", value: fmtChannel(currentSettings.live_members_channel), inline: true },
          { name: "Live role channel", value: fmtChannel(currentSettings.live_role_channel), inline: true },
          { name: "Live role", value: fmtRole(currentSettings.live_role_id), inline: true },
          { name: "Staff role", value: fmtRole(currentSettings.support_role), inline: true },
          { name: "Admin role", value: fmtRole(currentSettings.admin_role), inline: true },
          { name: "Max tickets", value: `\`${currentSettings.max_tickets || 3}\``, inline: true },
          {
            name: "Simple help",
            value: currentSettings.simple_help_mode === false ? "Disabled" : "Enabled",
            inline: true,
          },
          {
            name: "Commercial",
            value: commercialLines.join("\n").slice(0, 1024),
            inline: false,
          },
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (sub === "tickets") {
      const categories = await ticketCategories.getByGuild(gid);
      const embed = buildTicketConfigEmbed(interaction.guild, currentSettings, categories);
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    return interaction.reply({
      content: "Subcommand not available. Use `/config center`.",
      flags: 64,
    });
  },

  async autocomplete(interaction) {
    const group = interaction.options.getSubcommandGroup(false);

    if (group === "category" && categoryModule.autocomplete) {
      return categoryModule.autocomplete(interaction);
    }
  },

  __test: {
    buildTicketConfigEmbed,
    summarizeCategories,
    summarizeIncidentScope,
    summarizeIncidentMessage,
  },
};
