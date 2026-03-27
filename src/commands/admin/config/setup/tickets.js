const {
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const { settings } = require("../../../../utils/database");
const { categories } = require("../../../../../config");
const E = require("../../../../utils/embeds");
const { buildTicketPanelPayload } = require("../../../../domain/tickets/panelPayload");
const { hasRequiredPlan, buildProRequiredEmbed } = require("../../../../utils/commercial");

const PREMIUM_TICKET_SETUP_SUBS = new Set([
  "sla",
  "sla-rule",
  "auto-assignment",
  "incident",
  "daily-report",
]);

function normalizeTicketsSubcommand(sub) {
  const raw = String(sub || "").trim().toLowerCase();
  const aliases = {
    "sla-regla": "sla-rule",
    autoasignacion: "auto-assignment",
    incidente: "incident",
    "reporte-diario": "daily-report",
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

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("tickets")
      .setDescription("Configure the ticket system")
      .addSubcommand((s) => s.setName("panel").setDescription("Publish the ticket panel in the current channel"))
      .addSubcommand((s) =>
        s
          .setName("sla")
          .setDescription("Configure SLA thresholds and escalation")
          .addIntegerOption((o) =>
            o
              .setName("warning-minutes")
              .setDescription("Minutes before the SLA warning triggers (0 disables)")
              .setMinValue(0)
              .setMaxValue(1440)
              .setRequired(true)
          )
          .addBooleanOption((o) =>
            o
              .setName("escalation-enabled")
              .setDescription("Enable automatic escalation")
              .setRequired(false)
          )
          .addIntegerOption((o) =>
            o
              .setName("escalation-minutes")
              .setDescription("Minutes before escalation (0 disables)")
              .setMinValue(0)
              .setMaxValue(10080)
              .setRequired(false)
          )
          .addRoleOption((o) =>
            o
              .setName("escalation-role")
              .setDescription("Role to mention on escalation")
              .setRequired(false)
          )
          .addChannelOption((o) =>
            o
              .setName("escalation-channel")
              .setDescription("Channel for escalation alerts")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("sla-rule")
          .setDescription("Configure SLA overrides by priority or category")
          .addStringOption((o) =>
            o
              .setName("type")
              .setDescription("Rule type")
              .setRequired(true)
              .addChoices(
                { name: "SLA warning", value: "warning" },
                { name: "SLA escalation", value: "escalation" }
              )
          )
          .addIntegerOption((o) =>
            o
              .setName("minutes")
              .setDescription("Rule threshold in minutes (0 removes it)")
              .setRequired(true)
              .setMinValue(0)
              .setMaxValue(10080)
          )
          .addStringOption((o) =>
            o
              .setName("priority")
              .setDescription("Target priority")
              .setRequired(false)
              .addChoices(
                { name: "Low", value: "low" },
                { name: "Normal", value: "normal" },
                { name: "High", value: "high" },
                { name: "Urgent", value: "urgent" }
              )
          )
          .addStringOption((o) => {
            o
              .setName("category")
              .setDescription("Target category")
              .setRequired(false);
            for (const category of categories.slice(0, 25)) {
              o.addChoices({ name: category.label.slice(0, 100), value: category.id });
            }
            return o;
          })
      )
      .addSubcommand((s) =>
        s
          .setName("auto-assignment")
          .setDescription("Configure automatic staff assignment")
          .addBooleanOption((o) =>
            o
              .setName("active")
              .setDescription("Enable or disable auto-assignment")
              .setRequired(true)
          )
          .addBooleanOption((o) =>
            o
              .setName("require-online")
              .setDescription("Only assign staff that are online/idle/dnd")
              .setRequired(false)
          )
          .addBooleanOption((o) =>
            o
              .setName("respect-away")
              .setDescription("Exclude staff marked as away")
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("incident")
          .setDescription("Pause ticket intake during incidents")
          .addBooleanOption((o) =>
            o
              .setName("active")
              .setDescription("Enable or disable incident mode")
              .setRequired(true)
          )
          .addStringOption((o) =>
            o
              .setName("categories")
              .setDescription("Comma-separated category IDs (empty = all categories)")
              .setRequired(false)
          )
          .addStringOption((o) =>
            o
              .setName("message")
              .setDescription("Message shown to users when intake is paused")
              .setMaxLength(500)
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("daily-report")
          .setDescription("Configure the daily SLA and productivity report")
          .addBooleanOption((o) =>
            o
              .setName("active")
              .setDescription("Enable or disable the daily report")
              .setRequired(true)
          )
          .addChannelOption((o) =>
            o
              .setName("channel")
              .setDescription("Target channel for the report (falls back to logs)")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
      )
  );
}

async function handleSlaConfig(ctx) {
  const { interaction, gid, s } = ctx;
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
      embeds: [E.errorEmbed("If escalation is enabled, `escalation-minutes` must be greater than 0.")],
      flags: 64,
    });
    return true;
  }

  if (payload.sla_escalation_enabled && !payload.sla_escalation_channel && !s.log_channel) {
    await interaction.reply({
      embeds: [E.errorEmbed("Set `escalation-channel` or a logs channel before enabling escalation.")],
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
        .setTitle("Ticket SLA updated")
        .setDescription(
          `Base SLA: **${updated.sla_minutes > 0 ? `${updated.sla_minutes} min` : "Disabled"}**\n` +
            `Escalation: **${updated.sla_escalation_enabled ? "Enabled" : "Disabled"}**`
        )
        .addFields(
          {
            name: "Escalation threshold",
            value: updated.sla_escalation_minutes > 0 ? `${updated.sla_escalation_minutes} min` : "Not configured",
            inline: true,
          },
          {
            name: "Escalation channel",
            value: escalationChannelId ? `<#${escalationChannelId}>` : "Not configured",
            inline: true,
          },
          {
            name: "Escalation role",
            value: updated.sla_escalation_role ? `<@&${updated.sla_escalation_role}>` : "Not configured",
            inline: true,
          }
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

function parseIncidentCategories(rawValue) {
  if (!rawValue) return { values: [], invalid: [] };
  const knownIds = new Set(categories.map((category) => category.id));
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
  const type = getStringOption(interaction, "type", "tipo");
  const minutes = getIntegerOption(interaction, "minutes", "minutos");
  const priority = getStringOption(interaction, "priority", "prioridad");
  const categoryId = getStringOption(interaction, "category", "categoria");

  if ((!priority && !categoryId) || (priority && categoryId)) {
    await interaction.reply({
      embeds: [E.errorEmbed("Choose exactly one target: `priority` or `category`.")],
      flags: 64,
    });
    return true;
  }

  const normalizedType = type === "escalado" ? "escalation" : (type === "alerta" ? "warning" : type);
  const isEscalation = normalizedType === "escalation";
  const isPriorityRule = Boolean(priority);
  const key = String(priority || categoryId).trim().toLowerCase();
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
        .setTitle("SLA override updated")
        .setDescription(
          `Type: **${isEscalation ? "Escalation" : "Warning"}**\n` +
            `Target: **${isPriorityRule ? `Priority ${key}` : `Category ${key}`}**\n` +
            `Value: **${stored > 0 ? `${stored} min` : "Removed"}**`
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleAutoAssignConfig(ctx) {
  const { interaction, gid } = ctx;
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
        .setTitle("Auto-assignment updated")
        .addFields(
          { name: "Status", value: updated.auto_assign_enabled ? "Enabled" : "Disabled", inline: true },
          { name: "Require online", value: updated.auto_assign_require_online ? "Yes" : "No", inline: true },
          { name: "Respect away", value: updated.auto_assign_respect_away ? "Yes" : "No", inline: true }
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleIncidentConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const enabled = getBooleanOption(interaction, "active", "activo");
  const rawCategories = getStringOption(interaction, "categories", "categorias");
  const message = getStringOption(interaction, "message", "mensaje");

  const { values: parsedCategories, invalid } = parseIncidentCategories(rawCategories);
  if (invalid.length > 0) {
    await interaction.reply({
      embeds: [E.errorEmbed(`Invalid categories: \`${invalid.join(", ")}\``)],
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
    .map((id) => categories.find((category) => category.id === id)?.label || id);

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(enabled ? E.Colors.WARNING : E.Colors.SUCCESS)
        .setTitle(enabled ? "Incident mode enabled" : "Incident mode disabled")
        .setDescription(
          enabled
            ? (
              affectedLabels.length
                ? `Paused categories: **${affectedLabels.join(", ")}**`
                : "Paused categories: **all**"
            )
            : "Ticket intake is back to normal."
        )
        .addFields({
          name: "User-facing message",
          value: updated.incident_message || "Default",
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
  const enabled = getBooleanOption(interaction, "active", "activo");
  const channel = getChannelOption(interaction, "channel", "canal");

  const currentChannel = s.daily_sla_report_channel || null;
  const nextChannel = channel ? channel.id : currentChannel;

  if (enabled && !nextChannel && !s.log_channel && !s.weekly_report_channel) {
    await interaction.reply({
      embeds: [E.errorEmbed("Set a `channel`, logs channel, or weekly report channel before enabling this report.")],
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
        .setTitle("Daily report updated")
        .addFields(
          { name: "Status", value: updated.daily_sla_report_enabled ? "Enabled" : "Disabled", inline: true },
          { name: "Channel", value: effectiveChannelId ? `<#${effectiveChannelId}>` : "Not configured", inline: true }
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handlePanelConfig(ctx) {
  const { interaction, gid, s } = ctx;

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
        E.errorEmbed(
          `I do not have the required permissions in ${channel}.\n\n` +
            "Make sure the bot has:\n" +
            "- View Channel\n" +
            "- Send Messages\n" +
            "- Embed Links"
        ),
      ],
    });
    return true;
  }

  if (!categories || categories.length === 0) {
    await interaction.editReply({
      embeds: [
        E.errorEmbed(
          "No ticket categories are configured yet.\n\n" +
          "Configure at least one category in `config.js` before publishing the panel."
        ),
      ],
    });
    return true;
  }

  let payload;
  try {
    payload = buildTicketPanelPayload({
      guild: interaction.guild,
      categories,
    });
  } catch (error) {
    await interaction.editReply({
      embeds: [
        E.errorEmbed(
          "Error while building the ticket panel.\n\n" +
          error.message
        ),
      ],
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
          .setTitle("Ticket panel published")
          .setDescription(
            `The ticket panel was sent to ${channel}.\n\n` +
              "Users can now select a category and open a private ticket.\n\n" +
              (s.support_role
                ? `Active staff role: <@&${s.support_role}>`
                : "Note: there is no staff role configured yet. Use `/setup general staff-role @role`.")
          )
          .setTimestamp(),
      ],
    });
  } catch (err) {
    console.error("[SETUP-TICKETS PANEL ERROR]", err);
    await interaction.editReply({
      embeds: [
        E.errorEmbed(
          "Could not send the ticket panel. Verify that the bot can send messages in this channel."
        ),
      ],
    });
  }

  return true;
}

async function execute(ctx) {
  const { group, s } = ctx;
  if (group !== "tickets") return false;

  const sub = normalizeTicketsSubcommand(ctx.sub);

  if (PREMIUM_TICKET_SETUP_SUBS.has(sub) && !hasRequiredPlan(s, "pro")) {
    await ctx.interaction.reply({
      embeds: [buildProRequiredEmbed(s, `Setup /tickets ${sub}`)],
      flags: 64,
    });
    return true;
  }

  if (sub === "sla") return handleSlaConfig({ ...ctx, sub });
  if (sub === "sla-rule") return handleSlaRuleConfig({ ...ctx, sub });
  if (sub === "auto-assignment") return handleAutoAssignConfig({ ...ctx, sub });
  if (sub === "incident") return handleIncidentConfig({ ...ctx, sub });
  if (sub === "daily-report") return handleDailyReportConfig({ ...ctx, sub });
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
