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
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { configT } = require("./i18n");
const { withDescriptionLocalizations } = require("../../../utils/slashLocalizations");

function fmtChannel(id, language) {
  return id ? `<#${id}>` : configT(language, "common.not_set");
}

function fmtRole(id, language) {
  return id ? `<@&${id}>` : configT(language, "common.not_set");
}

function fmtToggle(
  value,
  enabledLabel = "Enabled",
  disabledLabel = "Disabled"
) {
  return value ? enabledLabel : disabledLabel;
}

function fmtGlobalLimit(value, language) {
  return Number(value || 0) > 0
    ? `\`${Number(value)}\``
    : configT(language, "common.no_limit");
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

function fmtPanelStatus(settingsRecord, language) {
  if (!settingsRecord?.panel_channel_id) {
    return configT(language, "tickets.panel_status.not_configured");
  }
  if (settingsRecord.panel_message_id) {
    return configT(language, "tickets.panel_status.published");
  }
  return configT(language, "tickets.panel_status.pending");
}

function countRules(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return 0;
  return Object.keys(record).length;
}

function priorityBadge(priority, language) {
  return t(language, `ticket.priority.${priority}`) || t(language, "ticket.priority.normal");
}

function truncate(text, maxLength) {
  const value = String(text || "").trim();
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}

function summarizeIncidentScope(settingsRecord, categories, language) {
  if (!settingsRecord?.incident_mode_enabled) {
    return configT(language, "tickets.incident.inactive");
  }

  const pausedIds = Array.isArray(settingsRecord.incident_paused_categories)
    ? settingsRecord.incident_paused_categories.filter(Boolean)
    : [];

  if (pausedIds.length === 0) return configT(language, "common.all_categories");

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

function summarizeIncidentMessage(settingsRecord, language) {
  if (!settingsRecord?.incident_mode_enabled) {
    return configT(language, "common.not_applicable");
  }
  return settingsRecord?.incident_message
    ? truncate(settingsRecord.incident_message, 120)
    : configT(language, "tickets.incident.default_message");
}

function summarizeCategories(categories, language) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return configT(language, "tickets.categories.none");
  }

  const lines = categories.slice(0, 6).map((category) => {
    const emoji = category.emoji ? `${category.emoji} ` : "";
    const status = category.enabled === false
      ? configT(language, "tickets.categories.off")
      : configT(language, "tickets.categories.on");
    const discordCategory = category.discord_category_id
      ? `<#${category.discord_category_id}>`
      : configT(language, "common.no_channel");
    const pingCount = Array.isArray(category.ping_roles) ? category.ping_roles.length : 0;

    return (
      `- ${emoji}**${category.label || category.category_id}** | ` +
      `${priorityBadge(category.priority, language)} | ${status} | ${discordCategory} | ${configT(language, "tickets.categories.pings", { count: pingCount })}`
    );
  });

  if (categories.length > 6) {
    lines.push(`- ${configT(language, "tickets.categories.more", { count: categories.length - 6 })}`);
  }

  return lines.join("\n");
}

function summarizeCustomizationValue(value, fallback) {
  return value ? truncate(value, 120) : fallback;
}

function buildTicketConfigEmbed(guild, settingsRecord, categories, language) {
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
    .setTitle(configT(language, "command.tickets_title", { guild: guild.name }))
    .setDescription(configT(language, "command.tickets_description"))
    .addFields(
      {
        name: configT(language, "tickets.fields.channels_roles"),
        value:
          `${configT(language, "tickets.labels.panel")}: ${fmtChannel(settingsRecord?.panel_channel_id, language)}\n` +
          `${configT(language, "tickets.labels.panel_status")}: ${fmtPanelStatus(settingsRecord, language)}\n` +
          `${configT(language, "tickets.labels.logs")}: ${fmtChannel(settingsRecord?.log_channel, language)}\n` +
          `${configT(language, "tickets.labels.transcripts")}: ${fmtChannel(settingsRecord?.transcript_channel, language)}\n` +
          `${configT(language, "tickets.labels.staff")}: ${fmtRole(settingsRecord?.support_role, language)}\n` +
          `${configT(language, "tickets.labels.admin")}: ${fmtRole(settingsRecord?.admin_role, language)}`,
        inline: false,
      },
      {
        name: configT(language, "tickets.fields.commercial_status"),
        value: buildCommercialStatusLines(settingsRecord, language).join("\n"),
        inline: false,
      },
      {
        name: configT(language, "tickets.fields.panel_messaging"),
        value:
          `${configT(language, "tickets.labels.public_panel_title")}: ${summarizeCustomizationValue(settingsRecord?.ticket_panel_title, configT(language, "common.default"))}\n` +
          `${configT(language, "tickets.labels.public_panel_description")}: ${summarizeCustomizationValue(settingsRecord?.ticket_panel_description, configT(language, "common.default"))}\n` +
          `${configT(language, "tickets.labels.welcome_message")}: ${summarizeCustomizationValue(settingsRecord?.ticket_welcome_message, configT(language, "common.default"))}\n` +
          `${configT(language, "tickets.labels.control_embed_title")}: ${summarizeCustomizationValue(settingsRecord?.ticket_control_panel_title, configT(language, "common.default"))}\n` +
          `${configT(language, "tickets.labels.control_embed_description")}: ${summarizeCustomizationValue(settingsRecord?.ticket_control_panel_description, configT(language, "common.default"))}\n` +
          `${configT(language, "tickets.labels.public_panel_color")}: ${settingsRecord?.ticket_panel_color || configT(language, "common.default")}\n` +
          `${configT(language, "tickets.labels.control_embed_color")}: ${settingsRecord?.ticket_control_panel_color || configT(language, "common.default")}`,
        inline: false,
      },
      {
        name: configT(language, "tickets.fields.limits_access"),
        value:
          `${configT(language, "tickets.labels.max_per_user")}: \`${Number(settingsRecord?.max_tickets || 3)}\`\n` +
          `${configT(language, "tickets.labels.global_limit")}: ${fmtGlobalLimit(settingsRecord?.global_ticket_limit, language)}\n` +
          `${configT(language, "tickets.labels.cooldown")}: ${fmtMinutes(settingsRecord?.cooldown_minutes, configT(language, "common.disabled"))}\n` +
          `${configT(language, "tickets.labels.minimum_days")}: ${Number(settingsRecord?.min_days || 0)}\n` +
          `${configT(language, "tickets.labels.simple_help")}: ${fmtToggle(settingsRecord?.simple_help_mode !== false, configT(language, "common.enabled"), configT(language, "common.disabled"))}`,
        inline: false,
      },
      {
        name: configT(language, "tickets.fields.sla_automation"),
        value:
          `${configT(language, "tickets.labels.base_sla")}: ${fmtMinutes(slaMinutes, configT(language, "common.disabled"))}\n` +
          `${configT(language, "tickets.labels.smart_ping")}: ${fmtMinutes(smartPingMinutes, configT(language, "common.disabled"))}\n` +
          `${configT(language, "tickets.labels.auto_close")}: ${fmtMinutes(autoCloseMinutes, configT(language, "common.disabled"))}\n` +
          `${configT(language, "tickets.labels.auto_assignment")}: ${fmtToggle(settingsRecord?.auto_assign_enabled, configT(language, "common.enabled"), configT(language, "common.disabled"))}\n` +
          `${configT(language, "tickets.labels.online_only")}: ${fmtToggle(settingsRecord?.auto_assign_require_online, configT(language, "common.yes"), configT(language, "common.no"))}\n` +
          `${configT(language, "tickets.labels.respect_away")}: ${fmtToggle(settingsRecord?.auto_assign_respect_away, configT(language, "common.yes"), configT(language, "common.no"))}`,
        inline: false,
      },
      {
        name: configT(language, "tickets.fields.escalation_reporting"),
        value:
          `${configT(language, "tickets.labels.sla_escalation")}: ${fmtToggle(settingsRecord?.sla_escalation_enabled, configT(language, "common.enabled"), configT(language, "common.disabled"))}\n` +
          `${configT(language, "tickets.labels.threshold")}: ${fmtMinutes(settingsRecord?.sla_escalation_minutes, configT(language, "common.disabled"))}\n` +
          `${configT(language, "tickets.labels.channel")}: ${fmtChannel(settingsRecord?.sla_escalation_channel || reportChannelId, language)}\n` +
          `${configT(language, "tickets.labels.role")}: ${fmtRole(settingsRecord?.sla_escalation_role, language)}\n` +
          `${configT(language, "tickets.labels.sla_overrides")}: \`${slaRuleCount}\`\n` +
          `${configT(language, "tickets.labels.escalation_overrides")}: \`${escalationRuleCount}\`\n` +
          `${configT(language, "tickets.labels.daily_report")}: ${settingsRecord?.daily_sla_report_enabled ? fmtChannel(reportChannelId, language) : configT(language, "common.disabled")}\n` +
          `${configT(language, "tickets.labels.weekly_report")}: ${fmtChannel(settingsRecord?.weekly_report_channel, language)}`,
        inline: false,
      },
      {
        name: configT(language, "tickets.fields.incident_mode"),
        value:
          `${configT(language, "tickets.labels.status")}: ${fmtToggle(settingsRecord?.incident_mode_enabled, configT(language, "common.enabled"), configT(language, "common.disabled"))}\n` +
          `${configT(language, "tickets.labels.scope")}: ${summarizeIncidentScope(settingsRecord, categories, language)}\n` +
          `${configT(language, "tickets.labels.message")}: ${summarizeIncidentMessage(settingsRecord, language)}`,
        inline: false,
      },
      {
        name: configT(language, "tickets.fields.configured_categories", {
          count: Array.isArray(categories) ? categories.length : 0,
        }),
        value: summarizeCategories(categories, language),
        inline: false,
      }
    )
    .setFooter({
      text: commercialState.isPro
        ? configT(language, "tickets.footers.pro")
        : configT(language, "tickets.footers.free"),
    })
    .setTimestamp();
}

let commandBuilder = new SlashCommandBuilder()
  .setName("config")
  .setDescription(t("en", "config.slash.description"))
  .setDescriptionLocalizations(require("../../../utils/slashLocalizations").localeMapFromKey("config.slash.description"))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcommand) =>
    withDescriptionLocalizations(
      subcommand
        .setName("status")
        .setDescription(t("en", "config.slash.subcommands.status.description")),
      "config.slash.subcommands.status.description"
    )
  )
  .addSubcommand((subcommand) =>
    withDescriptionLocalizations(
      subcommand
        .setName("tickets")
        .setDescription(t("en", "config.slash.subcommands.tickets.description")),
      "config.slash.subcommands.tickets.description"
    )
  )
  .addSubcommand((subcommand) =>
    withDescriptionLocalizations(
      subcommand
        .setName("center")
        .setDescription(t("en", "config.slash.subcommands.center.description")),
      "config.slash.subcommands.center.description"
    )
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
    const language = resolveInteractionLanguage(interaction, currentSettings);

    if (sub === "center" || sub === "centro") {
      return interaction.reply({
        ...(await buildCenterPayload(interaction.guild, interaction.user.id, "general")),
        flags: 64,
      });
    }

    if (sub === "status" || sub === "estado") {
      const commercialLines = buildCommercialStatusLines(currentSettings, language);
      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle(configT(language, "command.status_title"))
        .addFields(
          { name: configT(language, "status.ticket_panel"), value: fmtChannel(currentSettings.panel_channel_id, language), inline: true },
          { name: configT(language, "status.logs"), value: fmtChannel(currentSettings.log_channel, language), inline: true },
          { name: configT(language, "status.transcripts"), value: fmtChannel(currentSettings.transcript_channel, language), inline: true },
          { name: configT(language, "status.live_members"), value: fmtChannel(currentSettings.live_members_channel, language), inline: true },
          { name: configT(language, "status.live_role_channel"), value: fmtChannel(currentSettings.live_role_channel, language), inline: true },
          { name: configT(language, "status.live_role"), value: fmtRole(currentSettings.live_role_id, language), inline: true },
          { name: configT(language, "status.staff_role"), value: fmtRole(currentSettings.support_role, language), inline: true },
          { name: configT(language, "status.admin_role"), value: fmtRole(currentSettings.admin_role, language), inline: true },
          { name: configT(language, "status.max_tickets"), value: `\`${currentSettings.max_tickets || 3}\``, inline: true },
          {
            name: configT(language, "status.simple_help"),
            value: currentSettings.simple_help_mode === false
              ? configT(language, "common.disabled")
              : configT(language, "common.enabled"),
            inline: true,
          },
          {
            name: configT(language, "status.commercial"),
            value: commercialLines.join("\n").slice(0, 1024),
            inline: false,
          },
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (sub === "tickets") {
      const categories = await ticketCategories.getByGuild(gid);
      const embed = buildTicketConfigEmbed(interaction.guild, currentSettings, categories, language);
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    return interaction.reply({
      content: configT(language, "command.center_unavailable"),
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
