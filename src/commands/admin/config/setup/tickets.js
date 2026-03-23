const {
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const { settings } = require("../../../../utils/database");
const { categories } = require("../../../../../config");
const E = require("../../../../utils/embeds");
const { buildTicketPanelPayload } = require("../../../../domain/tickets/panelPayload");

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("tickets")
      .setDescription("Configuracion del sistema de tickets")
      .addSubcommand((s) => s.setName("panel").setDescription("Crear el panel premium de tickets en el canal configurado"))
      .addSubcommand((s) =>
        s
          .setName("sla")
          .setDescription("Configurar SLA y escalado basico")
          .addIntegerOption((o) =>
            o
              .setName("minutos")
              .setDescription("Minutos para alerta SLA (0 desactiva)")
              .setMinValue(0)
              .setMaxValue(1440)
              .setRequired(true)
          )
          .addBooleanOption((o) =>
            o
              .setName("escalado_activo")
              .setDescription("Activar escalado automatico")
              .setRequired(false)
          )
          .addIntegerOption((o) =>
            o
              .setName("escalado_minutos")
              .setDescription("Minutos para escalado (0 desactiva)")
              .setMinValue(0)
              .setMaxValue(10080)
              .setRequired(false)
          )
          .addRoleOption((o) =>
            o
              .setName("rol_escalado")
              .setDescription("Rol a mencionar en escalado")
              .setRequired(false)
          )
          .addChannelOption((o) =>
            o
              .setName("canal_escalado")
              .setDescription("Canal para alertas de escalado")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("sla-regla")
          .setDescription("Configurar reglas SLA por prioridad o categoria")
          .addStringOption((o) =>
            o
              .setName("tipo")
              .setDescription("Tipo de regla")
              .setRequired(true)
              .addChoices(
                { name: "Alerta SLA", value: "alerta" },
                { name: "Escalado SLA", value: "escalado" }
              )
          )
          .addIntegerOption((o) =>
            o
              .setName("minutos")
              .setDescription("Minutos de la regla (0 elimina)")
              .setRequired(true)
              .setMinValue(0)
              .setMaxValue(10080)
          )
          .addStringOption((o) =>
            o
              .setName("prioridad")
              .setDescription("Prioridad objetivo")
              .setRequired(false)
              .addChoices(
                { name: "Baja", value: "low" },
                { name: "Normal", value: "normal" },
                { name: "Alta", value: "high" },
                { name: "Urgente", value: "urgent" }
              )
          )
          .addStringOption((o) => {
            o
              .setName("categoria")
              .setDescription("Categoria objetivo")
              .setRequired(false);
            for (const category of categories.slice(0, 25)) {
              o.addChoices({ name: category.label.slice(0, 100), value: category.id });
            }
            return o;
          })
      )
      .addSubcommand((s) =>
        s
          .setName("autoasignacion")
          .setDescription("Activar/desactivar autoasignacion de tickets")
          .addBooleanOption((o) =>
            o
              .setName("activo")
              .setDescription("Estado de autoasignacion")
              .setRequired(true)
          )
          .addBooleanOption((o) =>
            o
              .setName("solo_online")
              .setDescription("Solo asignar staff online/idle/dnd")
              .setRequired(false)
          )
          .addBooleanOption((o) =>
            o
              .setName("respetar_ausentes")
              .setDescription("Excluir staff marcado como ausente")
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("incidente")
          .setDescription("Pausar apertura de tickets por incidente")
          .addBooleanOption((o) =>
            o
              .setName("activo")
              .setDescription("Activar o desactivar modo incidente")
              .setRequired(true)
          )
          .addStringOption((o) =>
            o
              .setName("categorias")
              .setDescription("IDs de categoria separadas por coma (vacío = todas)")
              .setRequired(false)
          )
          .addStringOption((o) =>
            o
              .setName("mensaje")
              .setDescription("Mensaje para usuarios al intentar abrir ticket")
              .setMaxLength(500)
              .setRequired(false)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("reporte-diario")
          .setDescription("Configurar reporte diario de SLA y productividad")
          .addBooleanOption((o) =>
            o
              .setName("activo")
              .setDescription("Activar o desactivar reporte diario")
              .setRequired(true)
          )
          .addChannelOption((o) =>
            o
              .setName("canal")
              .setDescription("Canal destino del reporte (usa logs si se omite)")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false)
          )
      )
  );
}

async function handleSlaConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const slaMinutes = interaction.options.getInteger("minutos");
  const escalationEnabledOption = interaction.options.getBoolean("escalado_activo");
  const escalationMinutesOption = interaction.options.getInteger("escalado_minutos");
  const escalationRole = interaction.options.getRole("rol_escalado");
  const escalationChannel = interaction.options.getChannel("canal_escalado");

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
      embeds: [E.errorEmbed("Si activas el escalado, define `escalado_minutos` mayor a 0.")],
      flags: 64,
    });
    return true;
  }

  if (payload.sla_escalation_enabled && !payload.sla_escalation_channel && !s.log_channel) {
    await interaction.reply({
      embeds: [E.errorEmbed("Configura `canal_escalado` o un canal de logs antes de activar escalado.")],
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
        .setTitle("SLA de tickets actualizado")
        .setDescription(
          `SLA base: **${updated.sla_minutes > 0 ? `${updated.sla_minutes} min` : "Desactivado"}**\n` +
            `Escalado: **${updated.sla_escalation_enabled ? "Activo" : "Inactivo"}**`
        )
        .addFields(
          {
            name: "Umbral de escalado",
            value: updated.sla_escalation_minutes > 0 ? `${updated.sla_escalation_minutes} min` : "No configurado",
            inline: true,
          },
          {
            name: "Canal de escalado",
            value: escalationChannelId ? `<#${escalationChannelId}>` : "No configurado",
            inline: true,
          },
          {
            name: "Rol de escalado",
            value: updated.sla_escalation_role ? `<@&${updated.sla_escalation_role}>` : "No configurado",
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
  const type = interaction.options.getString("tipo", true);
  const minutes = interaction.options.getInteger("minutos", true);
  const priority = interaction.options.getString("prioridad");
  const categoryId = interaction.options.getString("categoria");

  if ((!priority && !categoryId) || (priority && categoryId)) {
    await interaction.reply({
      embeds: [E.errorEmbed("Define solo uno: `prioridad` o `categoria`.")],
      flags: 64,
    });
    return true;
  }

  const isEscalation = type === "escalado";
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
        .setTitle("Regla SLA actualizada")
        .setDescription(
          `Tipo: **${isEscalation ? "Escalado" : "Alerta"}**\n` +
            `Objetivo: **${isPriorityRule ? `Prioridad ${key}` : `Categoria ${key}`}**\n` +
            `Valor: **${stored > 0 ? `${stored} min` : "Eliminada"}**`
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleAutoAssignConfig(ctx) {
  const { interaction, gid } = ctx;
  const enabled = interaction.options.getBoolean("activo", true);
  const requireOnline = interaction.options.getBoolean("solo_online");
  const respectAway = interaction.options.getBoolean("respetar_ausentes");

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
        .setTitle("Autoasignacion actualizada")
        .addFields(
          { name: "Estado", value: updated.auto_assign_enabled ? "Activo" : "Inactivo", inline: true },
          { name: "Solo online", value: updated.auto_assign_require_online ? "Si" : "No", inline: true },
          { name: "Respeta ausentes", value: updated.auto_assign_respect_away ? "Si" : "No", inline: true }
        )
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleIncidentConfig(ctx) {
  const { interaction, gid, s } = ctx;
  const enabled = interaction.options.getBoolean("activo", true);
  const rawCategories = interaction.options.getString("categorias");
  const message = interaction.options.getString("mensaje");

  const { values: parsedCategories, invalid } = parseIncidentCategories(rawCategories);
  if (invalid.length > 0) {
    await interaction.reply({
      embeds: [E.errorEmbed(`Categorias invalidas: \`${invalid.join(", ")}\``)],
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
        .setTitle(enabled ? "Modo incidente activado" : "Modo incidente desactivado")
        .setDescription(
          enabled
            ? (
              affectedLabels.length
                ? `Categorias pausadas: **${affectedLabels.join(", ")}**`
                : "Categorias pausadas: **todas**"
            )
            : "La apertura de tickets vuelve a la normalidad."
        )
        .addFields({
          name: "Mensaje al usuario",
          value: updated.incident_message || "Predeterminado",
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
  const enabled = interaction.options.getBoolean("activo", true);
  const channel = interaction.options.getChannel("canal");

  const currentChannel = s.daily_sla_report_channel || null;
  const nextChannel = channel ? channel.id : currentChannel;

  if (enabled && !nextChannel && !s.log_channel && !s.weekly_report_channel) {
    await interaction.reply({
      embeds: [E.errorEmbed("Configura un `canal` o define canal de logs/reporte semanal antes de activar.")],
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
        .setTitle("Reporte diario actualizado")
        .addFields(
          { name: "Estado", value: updated.daily_sla_report_enabled ? "Activo" : "Inactivo", inline: true },
          { name: "Canal", value: effectiveChannelId ? `<#${effectiveChannelId}>` : "No configurado", inline: true }
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

  if (!s.panel_channel_id) {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.ERROR)
          .setTitle("Canal no configurado")
          .setDescription(
            "No hay un canal de tickets configurado para este servidor.\n\n" +
              "Usa `/setup general dashboard #canal` para configurarlo."
          )
          .setTimestamp(),
      ],
    });
    return true;
  }

  const channel = interaction.guild.channels.cache.get(s.panel_channel_id);
  if (!channel) {
    await interaction.editReply({
      embeds: [
        E.errorEmbed(
          `El canal configurado (<#${s.panel_channel_id}>) no existe o no es accesible.\n\n` +
            "Reconfigura el canal con `/setup general dashboard #canal`."
        ),
      ],
    });
    return true;
  }

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
          `No tengo los permisos necesarios en ${channel}.\n\n` +
            "Asegurate de que el bot tenga:\n" +
            "- Ver Canal\n" +
            "- Enviar Mensajes\n" +
            "- Insertar enlaces"
        ),
      ],
    });
    return true;
  }

  const payload = buildTicketPanelPayload({
    guild: interaction.guild,
    categories,
  });

  try {
    const msg = await channel.send(payload);

    await settings.update(gid, { panel_message_id: msg.id });

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("Panel premium configurado correctamente")
          .setDescription(
            `El panel de tickets fue enviado a ${channel}.\n\n` +
              "Los usuarios pueden seleccionar una categoria para abrir un ticket privado.\n\n" +
              (s.support_role
                ? `Rol de soporte activo: <@&${s.support_role}>`
                : "Nota: no hay un rol de soporte configurado. Usa `/setup general staff-role @rol`.")
          )
          .setTimestamp(),
      ],
    });
  } catch (err) {
    console.error("[SETUP-TICKETS PANEL ERROR]", err);
    await interaction.editReply({
      embeds: [
        E.errorEmbed(
          "Error al enviar el panel de tickets. Verifica que el bot tenga permisos para enviar mensajes en el canal configurado."
        ),
      ],
    });
  }

  return true;
}

async function execute(ctx) {
  const { group, sub } = ctx;
  if (group !== "tickets") return false;
  if (sub === "sla") return handleSlaConfig(ctx);
  if (sub === "sla-regla") return handleSlaRuleConfig(ctx);
  if (sub === "autoasignacion") return handleAutoAssignConfig(ctx);
  if (sub === "incidente") return handleIncidentConfig(ctx);
  if (sub === "reporte-diario") return handleDailyReportConfig(ctx);
  if (sub === "panel") return handlePanelConfig(ctx);
  return false;
}

module.exports = {
  register,
  execute,
};
