const {
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const { settings, ticketCategories } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { buildTicketPanelPayload } = require("../../../../domain/tickets/panelPayload");
const { hasRequiredPlan, buildProRequiredEmbed, buildProUpgradeButton } = require("../../../../utils/commercial");
const { getCategoriesForGuild } = require("../../../../utils/categoryResolver");
const { normalizeHexColor } = require("../../../../utils/ticketCustomization");
const { normalizeLanguage, resolveGuildLanguage, t } = require("../../../../utils/i18n");
const { setupT } = require("./i18n");
const {
  withDescriptionLocalizations,
  localizedChoice,
} = require("../../../../utils/slashLocalizations");

const PREMIUM_TICKET_SETUP_SUBS = new Set([
  "sla-rule",
  "auto-assignment",
  "incident",
  "daily-report",
  "control-embed",
  "welcome-message",
  "category",
]);

function normalizeTicketsSubcommand(sub) {
  const raw = String(sub || "").trim().toLowerCase();
  const aliases = {
    "sla-regla": "sla-rule",
    autoasignacion: "auto-assignment",
    incidente: "incident",
    "reporte-diario": "daily-report",
    "mensaje-bienvenida": "welcome-message",
    "embed-control": "control-embed",
  };
  return aliases[raw] || raw;
}

function getIntegerOption(interaction, primary, legacy = null) {
  return interaction.options.getInteger(primary) ?? (legacy ? interaction.options.getInteger(legacy) : null);
}

function getBooleanOption(interaction, primary, legacy = null) {
  return interaction.options.getBoolean(primary) ?? (legacy ? interaction.options.getBoolean(legacy) : null);
}

function getStringOption(interaction, primary, legacy = null) {
  return interaction.options.getString(primary) ?? (legacy ? interaction.options.getString(legacy) : null);
}

function getRoleOption(interaction, primary, legacy = null) {
  return interaction.options.getRole(primary) ?? (legacy ? interaction.options.getRole(legacy) : null);
}

function getChannelOption(interaction, primary, legacy = null) {
  return interaction.options.getChannel(primary) ?? (legacy ? interaction.options.getChannel(legacy) : null);
}

function summarizeCustomization(language, value) {
  const out = String(value || "").trim();
  if (!out) return setupT(language, "tickets.common.default");
  return out.length > 100 ? `${out.slice(0, 97)}...` : out;
}

function buildCustomizationHelp(title, description, lines = []) {
  return new EmbedBuilder()
    .setColor(E.Colors.SUCCESS)
    .setTitle(title)
    .setDescription(description)
    .addFields(...lines)
    .setTimestamp();
}

function resolveSetupLanguage(settingsRecord) {
  return normalizeLanguage(settingsRecord?.bot_language, "en");
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    withDescriptionLocalizations(
      group
        .setName("tickets")
        .setDescription(t("en", "setup.tickets.group_description")),
      "setup.tickets.group_description"
    )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s.setName("panel").setDescription(t("en", "setup.tickets.panel_description")),
          "setup.tickets.panel_description"
        )
      )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("sla")
            .setDescription(t("en", "setup.tickets.sla_description")),
          "setup.tickets.sla_description"
        )
          .addIntegerOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("warning-minutes")
                .setDescription(t("en", "setup.tickets.option_warning_minutes")),
              "setup.tickets.option_warning_minutes"
            )
              .setMinValue(0)
              .setMaxValue(1440)
              .setRequired(true)
          )
          .addBooleanOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("escalation-enabled")
                .setDescription(t("en", "setup.tickets.option_escalation_enabled")),
              "setup.tickets.option_escalation_enabled"
            )
              .setRequired(false)
          )
          .addIntegerOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("escalation-minutes")
                .setDescription(t("en", "setup.tickets.option_escalation_minutes")),
              "setup.tickets.option_escalation_minutes"
            )
              .setMinValue(0)
              .setMaxValue(10080)
              .setRequired(false)
          )
          .addRoleOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("escalation-role")
                .setDescription(t("en", "setup.tickets.option_escalation_role")),
              "setup.tickets.option_escalation_role"
            )
              .setRequired(false)
          )
          .addChannelOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("escalation-channel")
                .setDescription(t("en", "setup.tickets.option_escalation_channel")),
              "setup.tickets.option_escalation_channel"
            )
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("sla-rule")
            .setDescription(t("en", "setup.tickets.sla_rule_description")),
          "setup.tickets.sla_rule_description"
        )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("type")
                .setDescription(t("en", "setup.tickets.option_rule_type")),
              "setup.tickets.option_rule_type"
            )
              .setRequired(true)
              .addChoices(
                localizedChoice("warning", "setup.tickets.choice_sla_warning"),
                localizedChoice("escalation", "setup.tickets.choice_sla_escalation")
              )
          )
          .addIntegerOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("minutes")
                .setDescription(t("en", "setup.tickets.option_rule_minutes")),
              "setup.tickets.option_rule_minutes"
            )
              .setRequired(true)
              .setMinValue(0)
              .setMaxValue(10080)
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("priority")
                .setDescription(t("en", "setup.tickets.option_target_priority")),
              "setup.tickets.option_target_priority"
            )
              .setRequired(false)
              .addChoices(
                localizedChoice("low", "ticket.priority.low"),
                localizedChoice("normal", "ticket.priority.normal"),
                localizedChoice("high", "ticket.priority.high"),
                localizedChoice("urgent", "ticket.priority.urgent")
              )
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("category")
                .setDescription(t("en", "setup.tickets.option_target_category")),
              "setup.tickets.option_target_category"
            )
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("auto-assignment")
            .setDescription(t("en", "setup.tickets.auto_assignment_description")),
          "setup.tickets.auto_assignment_description"
        )
          .addBooleanOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("active")
                .setDescription(t("en", "setup.tickets.option_active")),
              "setup.tickets.option_active"
            )
              .setRequired(true)
          )
          .addBooleanOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("require-online")
                .setDescription(t("en", "setup.tickets.option_require_online")),
              "setup.tickets.option_require_online"
            )
              .setRequired(false)
          )
          .addBooleanOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("respect-away")
                .setDescription(t("en", "setup.tickets.option_respect_away")),
              "setup.tickets.option_respect_away"
            )
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("incident")
            .setDescription(t("en", "setup.tickets.incident_description")),
          "setup.tickets.incident_description"
        )
          .addBooleanOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("active")
                .setDescription(t("en", "setup.tickets.option_active")),
              "setup.tickets.option_active"
            )
              .setRequired(true)
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("categories")
                .setDescription(t("en", "setup.tickets.option_categories")),
              "setup.tickets.option_categories"
            )
              .setRequired(false)
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("message")
                .setDescription(t("en", "setup.tickets.option_incident_message")),
              "setup.tickets.option_incident_message"
            )
              .setMaxLength(500)
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("daily-report")
            .setDescription(t("en", "setup.tickets.daily_report_description")),
          "setup.tickets.daily_report_description"
        )
          .addBooleanOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("active")
                .setDescription(t("en", "setup.tickets.option_active")),
              "setup.tickets.option_active"
            )
              .setRequired(true)
          )
          .addChannelOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("channel")
                .setDescription(t("en", "setup.tickets.option_report_channel")),
              "setup.tickets.option_report_channel"
            )
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("panel-style")
            .setDescription(t("en", "setup.tickets.panel_style_description")),
          "setup.tickets.panel_style_description"
        )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("title")
                .setDescription(t("en", "setup.tickets.option_panel_title")),
              "setup.tickets.option_panel_title"
            )
              .setMaxLength(120)
              .setRequired(false)
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("description")
                .setDescription(t("en", "setup.tickets.option_panel_description")),
              "setup.tickets.option_panel_description"
            )
              .setMaxLength(1200)
              .setRequired(false)
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("footer")
                .setDescription(t("en", "setup.tickets.option_panel_footer")),
              "setup.tickets.option_panel_footer"
            )
              .setMaxLength(200)
              .setRequired(false)
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("color")
                .setDescription(t("en", "setup.tickets.option_color")),
              "setup.tickets.option_color"
            )
              .setMaxLength(7)
              .setRequired(false)
          )
          .addBooleanOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("reset")
                .setDescription(t("en", "setup.tickets.option_reset")),
              "setup.tickets.option_reset"
            )
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("welcome-message")
            .setDescription(t("en", "setup.tickets.welcome_message_description")),
          "setup.tickets.welcome_message_description"
        )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("message")
                .setDescription(t("en", "setup.tickets.option_welcome_message")),
              "setup.tickets.option_welcome_message"
            )
              .setMaxLength(1500)
              .setRequired(false)
          )
          .addBooleanOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("reset")
                .setDescription(t("en", "setup.tickets.option_reset")),
              "setup.tickets.option_reset"
            )
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("control-embed")
            .setDescription(t("en", "setup.tickets.control_embed_description")),
          "setup.tickets.control_embed_description"
        )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("title")
                .setDescription(t("en", "setup.tickets.option_control_title")),
              "setup.tickets.option_control_title"
            )
              .setMaxLength(120)
              .setRequired(false)
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("description")
                .setDescription(t("en", "setup.tickets.option_control_description")),
              "setup.tickets.option_control_description"
            )
              .setMaxLength(1200)
              .setRequired(false)
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("footer")
                .setDescription(t("en", "setup.tickets.option_control_footer")),
              "setup.tickets.option_control_footer"
            )
              .setMaxLength(200)
              .setRequired(false)
          )
          .addStringOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("color")
                .setDescription(t("en", "setup.tickets.option_color")),
              "setup.tickets.option_color"
            )
              .setMaxLength(7)
              .setRequired(false)
          )
          .addBooleanOption((o) =>
            withDescriptionLocalizations(
              o
                .setName("reset")
                .setDescription(t("en", "setup.tickets.option_reset")),
              "setup.tickets.option_reset"
            )
              .setRequired(false)
          )
      )
  );
}

async function handleSlaConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const language = resolveSetupLanguage(s);
  const slaMinutes = getIntegerOption(interaction, "warning-minutes", "minutos");
  const escalationEnabledOption = getBooleanOption(interaction, "escalation-enabled", "escalado_activo");
  const escalationMinutesOption = getIntegerOption(interaction, "escalation-minutes", "escalado_minutos");
  const escalationRole = getRoleOption(interaction, "escalation-role", "rol_escalado");
  const escalationChannel = getChannelOption(interaction, "escalation-channel", "canal_escalado");

  const payload = {
    sla_minutes: slaMinutes,
    sla_escalation_enabled: escalationEnabledOption ?? s.sla_escalation_enabled ?? false,
    sla_escalation_minutes: escalationMinutesOption ?? s.sla_escalation_minutes ?? 0,
    sla_escalation_role: escalationRole ? escalationRole.id : (s.sla_escalation_role || null),
    sla_escalation_channel: escalationChannel ? escalationChannel.id : (s.sla_escalation_channel || null),
  };

  if (slaMinutes === 0) {
    payload.sla_escalation_enabled = false;
    payload.sla_escalation_minutes = escalationMinutesOption ?? 0;
  }

  if (payload.sla_escalation_enabled && payload.sla_escalation_minutes <= 0) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.escalation_minutes_required"))],
      flags: 64,
    });
    return true;
  }

  if (payload.sla_escalation_enabled && !payload.sla_escalation_channel && !s.log_channel) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.escalation_channel_required"))],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, payload);
  const updated = await settings.get(gid);
  const escalationChannelId = updated.sla_escalation_channel || updated.log_channel || null;

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle(setupT(language, "tickets.sla.title"))
        .setDescription(
          `${setupT(language, "tickets.sla.base")}: **${updated.sla_minutes > 0 ? setupT(language, "tickets.common.minutes", { value: updated.sla_minutes }) : setupT(language, "tickets.common.disabled")}**\n` +
            `${setupT(language, "tickets.sla.escalation")}: **${updated.sla_escalation_enabled ? setupT(language, "tickets.common.enabled") : setupT(language, "tickets.common.disabled")}**`
        )
        .addFields(
          {
            name: setupT(language, "tickets.sla.threshold"),
            value: updated.sla_escalation_minutes > 0
              ? setupT(language, "tickets.common.minutes", { value: updated.sla_escalation_minutes })
              : setupT(language, "tickets.common.not_configured"),
            inline: true,
          },
          {
            name: setupT(language, "tickets.sla.channel"),
            value: escalationChannelId ? `<#${escalationChannelId}>` : setupT(language, "tickets.common.not_configured"),
            inline: true,
          },
          {
            name: setupT(language, "tickets.sla.role"),
            value: updated.sla_escalation_role
              ? `<@&${updated.sla_escalation_role}>`
              : setupT(language, "tickets.common.not_configured"),
            inline: true,
          }
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

function parseIncidentCategories(rawValue, availableCategories = []) {
  if (!rawValue) return { values: [], invalid: [] };
  const knownIds = new Set((availableCategories || []).map((category) => category.id));
  const parsed = String(rawValue)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const unique = Array.from(new Set(parsed));
  const invalid = unique.filter((id) => !knownIds.has(id));
  const values = unique.filter((id) => knownIds.has(id));
  return { values, invalid };
}

async function handleSlaRuleConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const language = resolveSetupLanguage(s);
  const type = getStringOption(interaction, "type", "tipo");
  const minutes = getIntegerOption(interaction, "minutes", "minutos");
  const priority = getStringOption(interaction, "priority", "prioridad");
  const categoryId = getStringOption(interaction, "category", "categoria");
  const availableCategories = await getCategoriesForGuild(gid);
  const validCategoryIds = new Set(availableCategories.map((category) => category.id));

  if ((!priority && !categoryId) || (priority && categoryId)) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.exact_target"))],
      flags: 64,
    });
    return true;
  }

  const normalizedType = type === "escalado" ? "escalation" : (type === "alerta" ? "warning" : type);
  const isEscalation = normalizedType === "escalation";
  const isPriorityRule = Boolean(priority);
  const key = String(priority || categoryId).trim().toLowerCase();

  if (categoryId && !validCategoryIds.has(key)) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.category_not_configured", { category: key }))],
      flags: 64,
    });
    return true;
  }

  const targetField = isEscalation
    ? (isPriorityRule ? "sla_escalation_overrides_priority" : "sla_escalation_overrides_category")
    : (isPriorityRule ? "sla_overrides_priority" : "sla_overrides_category");
  const currentMap = s[targetField] && typeof s[targetField] === "object"
    ? { ...s[targetField] }
    : {};

  if (minutes <= 0) {
    delete currentMap[key];
  } else {
    currentMap[key] = minutes;
  }

  await settings.update(gid, { [targetField]: currentMap });
  const updated = await settings.get(gid);
  const stored = Number(updated?.[targetField]?.[key] || 0);

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle(setupT(language, "tickets.override.title"))
        .setDescription(
          `${setupT(language, "tickets.override.type")}: **${isEscalation ? setupT(language, "tickets.override.escalation") : setupT(language, "tickets.override.warning")}**\n` +
            `${setupT(language, "tickets.override.target")}: **${isPriorityRule ? setupT(language, "tickets.override.priority_target", { target: key }) : setupT(language, "tickets.override.category_target", { target: key })}**\n` +
            `${setupT(language, "tickets.override.value")}: **${stored > 0 ? setupT(language, "tickets.common.minutes", { value: stored }) : setupT(language, "tickets.common.removed")}**`
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleAutoAssignConfig(ctx) {
  const { interaction, gid } = ctx;
  const language = resolveSetupLanguage(ctx.s);
  const enabled = getBooleanOption(interaction, "active", "activo");
  const requireOnline = getBooleanOption(interaction, "require-online", "solo_online");
  const respectAway = getBooleanOption(interaction, "respect-away", "respetar_ausentes");

  const payload = {
    auto_assign_enabled: enabled,
  };
  if (requireOnline !== null) payload.auto_assign_require_online = requireOnline;
  if (respectAway !== null) payload.auto_assign_respect_away = respectAway;
  if (!enabled) payload.auto_assign_last_staff_id = null;

  await settings.update(gid, payload);
  const updated = await settings.get(gid);

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle(setupT(language, "tickets.auto_assignment.title"))
        .addFields(
          {
            name: setupT(language, "tickets.auto_assignment.status"),
            value: updated.auto_assign_enabled
              ? setupT(language, "tickets.common.enabled")
              : setupT(language, "tickets.common.disabled"),
            inline: true,
          },
          {
            name: setupT(language, "tickets.auto_assignment.require_online"),
            value: updated.auto_assign_require_online
              ? setupT(language, "tickets.common.yes")
              : setupT(language, "tickets.common.no"),
            inline: true,
          },
          {
            name: setupT(language, "tickets.auto_assignment.respect_away"),
            value: updated.auto_assign_respect_away
              ? setupT(language, "tickets.common.yes")
              : setupT(language, "tickets.common.no"),
            inline: true,
          }
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleIncidentConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const language = resolveSetupLanguage(s);
  const enabled = getBooleanOption(interaction, "active", "activo");
  const rawCategories = getStringOption(interaction, "categories", "categorias");
  const message = getStringOption(interaction, "message", "mensaje");
  const availableCategories = await getCategoriesForGuild(gid);

  const { values: parsedCategories, invalid } = parseIncidentCategories(rawCategories, availableCategories);
  if (invalid.length > 0) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.invalid_categories", { categories: invalid.join(", ") }))],
      flags: 64,
    });
    return true;
  }

  const payload = {
    incident_mode_enabled: enabled,
    incident_paused_categories: enabled ? parsedCategories : [],
    incident_message: message === null
      ? (enabled ? (s.incident_message || null) : null)
      : (String(message).trim() || null),
  };

  await settings.update(gid, payload);
  const updated = await settings.get(gid);
  const affectedLabels = (updated.incident_paused_categories || [])
    .map((id) => availableCategories.find((category) => category.id === id)?.label || id);

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(enabled ? E.Colors.WARNING : E.Colors.SUCCESS)
        .setTitle(
          enabled
            ? setupT(language, "tickets.incident.enabled_title")
            : setupT(language, "tickets.incident.disabled_title")
        )
        .setDescription(
          enabled
            ? setupT(language, "tickets.incident.paused_categories", {
                categories: affectedLabels.length
                  ? affectedLabels.join(", ")
                  : setupT(language, "tickets.common.all_categories"),
              })
            : setupT(language, "tickets.incident.resumed")
        )
        .addFields({
          name: setupT(language, "tickets.incident.user_message"),
          value: updated.incident_message || setupT(language, "tickets.common.default"),
          inline: false,
        })
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleDailyReportConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const language = resolveSetupLanguage(s);
  const enabled = getBooleanOption(interaction, "active", "activo");
  const channel = getChannelOption(interaction, "channel", "canal");

  const currentChannel = s.daily_sla_report_channel || null;
  const nextChannel = channel ? channel.id : currentChannel;

  if (enabled && !nextChannel && !s.log_channel && !s.weekly_report_channel) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.daily_report_channel_required"))],
      flags: 64,
    });
    return true;
  }

  const payload = {
    daily_sla_report_enabled: enabled,
    daily_sla_report_channel: nextChannel,
  };

  await settings.update(gid, payload);
  const updated = await settings.get(gid);
  const effectiveChannelId = updated.daily_sla_report_channel || updated.log_channel || updated.weekly_report_channel || null;

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle(setupT(language, "tickets.daily_report.title"))
        .addFields(
          {
            name: setupT(language, "tickets.daily_report.status"),
            value: updated.daily_sla_report_enabled
              ? setupT(language, "tickets.common.enabled")
              : setupT(language, "tickets.common.disabled"),
            inline: true,
          },
          {
            name: setupT(language, "tickets.daily_report.channel"),
            value: effectiveChannelId
              ? `<#${effectiveChannelId}>`
              : setupT(language, "tickets.common.not_configured"),
            inline: true,
          }
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handlePanelStyleConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const language = resolveSetupLanguage(s);
  const reset = getBooleanOption(interaction, "reset");

  if (reset) {
    await settings.update(gid, {
      ticket_panel_title: null,
      ticket_panel_description: null,
      ticket_panel_footer: null,
      ticket_panel_color: null,
    });

    await interaction.reply({
      embeds: [
        buildCustomizationHelp(
          setupT(language, "tickets.customization.panel_reset_title"),
          setupT(language, "tickets.customization.panel_reset_description"),
          [
            {
              name: setupT(language, "tickets.customization.title_label"),
              value: setupT(language, "tickets.common.default"),
              inline: true,
            },
            {
              name: setupT(language, "tickets.customization.description_label"),
              value: setupT(language, "tickets.common.default"),
              inline: true,
            },
            {
              name: setupT(language, "tickets.customization.color_label"),
              value: setupT(language, "tickets.common.default"),
              inline: true,
            },
          ],
        ),
      ],
      flags: 64,
    });
    return true;
  }

  const title = getStringOption(interaction, "title");
  const description = getStringOption(interaction, "description");
  const footer = getStringOption(interaction, "footer");
  const color = getStringOption(interaction, "color");
  const normalizedColor = color === null ? null : normalizeHexColor(color);

  if (color !== null && !normalizedColor) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.invalid_color"))],
      flags: 64,
    });
    return true;
  }

  if (title === null && description === null && footer === null && color === null) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.update_or_reset"))],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, {
    ...(title !== null ? { ticket_panel_title: String(title).trim() || null } : {}),
    ...(description !== null ? { ticket_panel_description: String(description).trim() || null } : {}),
    ...(footer !== null ? { ticket_panel_footer: String(footer).trim() || null } : {}),
    ...(color !== null ? { ticket_panel_color: normalizedColor } : {}),
  });
  const updated = await settings.get(gid);

  await interaction.reply({
    embeds: [
      buildCustomizationHelp(
        setupT(language, "tickets.customization.panel_updated_title"),
        setupT(language, "tickets.customization.panel_updated_description"),
        [
          {
            name: setupT(language, "tickets.customization.title_label"),
            value: summarizeCustomization(language, updated.ticket_panel_title),
            inline: false,
          },
          {
            name: setupT(language, "tickets.customization.description_label"),
            value: summarizeCustomization(language, updated.ticket_panel_description),
            inline: false,
          },
          {
            name: setupT(language, "tickets.customization.footer_label"),
            value: summarizeCustomization(language, updated.ticket_panel_footer),
            inline: false,
          },
          {
            name: setupT(language, "tickets.customization.color_label"),
            value: updated.ticket_panel_color || setupT(language, "tickets.common.default"),
            inline: true,
          },
        ],
      ),
    ],
    flags: 64,
  });
  return true;
}

async function handleWelcomeMessageConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const language = resolveSetupLanguage(s);
  const reset = getBooleanOption(interaction, "reset");
  const message = getStringOption(interaction, "message");

  if (reset) {
    await settings.update(gid, { ticket_welcome_message: null });
    await interaction.reply({
      embeds: [
        buildCustomizationHelp(
          setupT(language, "tickets.customization.welcome_reset_title"),
          setupT(language, "tickets.customization.welcome_reset_description"),
          [
            {
              name: setupT(language, "tickets.customization.placeholders_label"),
              value: "`{user}` `{ticket}` `{category}` `{guild}` `{staff_mentions}`",
              inline: false,
            },
          ],
        ),
      ],
      flags: 64,
    });
    return true;
  }

  if (message === null) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.message_or_reset"))],
      flags: 64,
    });
    return true;
  }

  const nextMessage = String(message).trim();
  if (!nextMessage) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.message_empty"))],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, { ticket_welcome_message: nextMessage });

  await interaction.reply({
    embeds: [
      buildCustomizationHelp(
        setupT(language, "tickets.customization.welcome_updated_title"),
        setupT(language, "tickets.customization.welcome_updated_description"),
        [
          {
            name: setupT(language, "tickets.customization.current_message_label"),
            value: summarizeCustomization(language, nextMessage),
            inline: false,
          },
          {
            name: setupT(language, "tickets.customization.placeholders_label"),
            value: "`{user}` `{ticket}` `{category}` `{guild}` `{staff_mentions}`",
            inline: false,
          },
        ],
      ),
    ],
    flags: 64,
  });
  return true;
}

async function handleControlEmbedConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const language = resolveSetupLanguage(s);
  const reset = getBooleanOption(interaction, "reset");

  if (reset) {
    await settings.update(gid, {
      ticket_control_panel_title: null,
      ticket_control_panel_description: null,
      ticket_control_panel_footer: null,
      ticket_control_panel_color: null,
    });
    await interaction.reply({
      embeds: [
        buildCustomizationHelp(
          setupT(language, "tickets.customization.control_reset_title"),
          setupT(language, "tickets.customization.control_reset_description"),
          [
            {
              name: setupT(language, "tickets.customization.title_label"),
              value: setupT(language, "tickets.common.default"),
              inline: true,
            },
            {
              name: setupT(language, "tickets.customization.description_label"),
              value: setupT(language, "tickets.common.default"),
              inline: true,
            },
            {
              name: setupT(language, "tickets.customization.color_label"),
              value: setupT(language, "tickets.common.default"),
              inline: true,
            },
          ],
        ),
      ],
      flags: 64,
    });
    return true;
  }

  const title = getStringOption(interaction, "title");
  const description = getStringOption(interaction, "description");
  const footer = getStringOption(interaction, "footer");
  const color = getStringOption(interaction, "color");
  const normalizedColor = color === null ? null : normalizeHexColor(color);

  if (color !== null && !normalizedColor) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.invalid_color"))],
      flags: 64,
    });
    return true;
  }

  if (title === null && description === null && footer === null && color === null) {
    await interaction.reply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.update_or_reset"))],
      flags: 64,
    });
    return true;
  }

  await settings.update(gid, {
    ...(title !== null ? { ticket_control_panel_title: String(title).trim() || null } : {}),
    ...(description !== null ? { ticket_control_panel_description: String(description).trim() || null } : {}),
    ...(footer !== null ? { ticket_control_panel_footer: String(footer).trim() || null } : {}),
    ...(color !== null ? { ticket_control_panel_color: normalizedColor } : {}),
  });
  const updated = await settings.get(gid);

  await interaction.reply({
    embeds: [
      buildCustomizationHelp(
        setupT(language, "tickets.customization.control_updated_title"),
        setupT(language, "tickets.customization.control_updated_description"),
        [
          {
            name: setupT(language, "tickets.customization.title_label"),
            value: summarizeCustomization(language, updated.ticket_control_panel_title),
            inline: false,
          },
          {
            name: setupT(language, "tickets.customization.description_label"),
            value: summarizeCustomization(language, updated.ticket_control_panel_description),
            inline: false,
          },
          {
            name: setupT(language, "tickets.customization.footer_label"),
            value: summarizeCustomization(language, updated.ticket_control_panel_footer),
            inline: false,
          },
          {
            name: setupT(language, "tickets.customization.color_label"),
            value: updated.ticket_control_panel_color || setupT(language, "tickets.common.default"),
            inline: true,
          },
        ],
      ),
    ],
    flags: 64,
  });
  return true;
}

async function handlePanelConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const language = resolveSetupLanguage(s);

  await interaction.deferReply({ flags: 64 });

  const channel = interaction.channel;
  const botMember = interaction.guild.members.me;
  const permsInChannel = channel.permissionsFor(botMember);
  if (
    !permsInChannel.has(PermissionFlagsBits.ViewChannel) ||
    !permsInChannel.has(PermissionFlagsBits.SendMessages) ||
    !permsInChannel.has(PermissionFlagsBits.EmbedLinks)
  ) {
    await interaction.editReply({
      embeds: [
        E.errorEmbed(setupT(language, "tickets.errors.publish_permissions", { channel })),
      ],
    });
    return true;
  }

  const configuredCategories = await getCategoriesForGuild(gid);

  if (!configuredCategories || configuredCategories.length === 0) {
    await interaction.editReply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.no_categories"))],
    });
    return true;
  }

  let payload;
  try {
    payload = buildTicketPanelPayload({
      guild: interaction.guild,
      categories: configuredCategories,
      settingsRecord: s,
    });
  } catch (error) {
    await interaction.editReply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.build_panel", { error: error.message }))],
    });
    return true;
  }

  try {
    const msg = await channel.send(payload);
    await settings.update(gid, { panel_message_id: msg.id });

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle(setupT(language, "tickets.panel.published_title"))
          .setDescription(setupT(language, "tickets.panel.published_description", {
            channel,
            staffNote: s.support_role
              ? setupT(language, "tickets.panel.staff_role_active", { role: `<@&${s.support_role}>` })
              : setupT(language, "tickets.panel.staff_role_missing"),
          }))
          .setTimestamp(),
      ],
    });
  } catch (err) {
    console.error("[SETUP-TICKETS PANEL ERROR]", err);
    await interaction.editReply({
      embeds: [E.errorEmbed(setupT(language, "tickets.errors.publish_failed"))],
    });
  }

  return true;
}

async function execute(ctx) {
  const { group, s } = ctx;
  if (group !== "tickets") return false;

  const sub = normalizeTicketsSubcommand(ctx.sub);

  if (PREMIUM_TICKET_SETUP_SUBS.has(sub) && !hasRequiredPlan(s, "pro")) {
    const lang = resolveGuildLanguage(s);
    const upgradeRow = buildProUpgradeButton(lang);
    await ctx.interaction.reply({
      embeds: [buildProRequiredEmbed(s, `Setup /tickets ${sub}`, lang)],
      components: upgradeRow ? [upgradeRow] : [],
      flags: 64,
    });
    return true;
  }

  if (sub === "sla") return handleSlaConfig({ ...ctx, sub });
  if (sub === "sla-rule") return handleSlaRuleConfig({ ...ctx, sub });
  if (sub === "auto-assignment") return handleAutoAssignConfig({ ...ctx, sub });
  if (sub === "incident") return handleIncidentConfig({ ...ctx, sub });
  if (sub === "daily-report") return handleDailyReportConfig({ ...ctx, sub });
  if (sub === "panel-style") return handlePanelStyleConfig({ ...ctx, sub });
  if (sub === "welcome-message") return handleWelcomeMessageConfig({ ...ctx, sub });
  if (sub === "control-embed") return handleControlEmbedConfig({ ...ctx, sub });
  if (sub === "panel") return handlePanelConfig({ ...ctx, sub });
  return false;
}

module.exports = {
  register,
  execute,
  __test: {
    normalizeTicketsSubcommand,
  },
};
