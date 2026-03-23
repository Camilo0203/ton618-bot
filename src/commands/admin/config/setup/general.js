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

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("general")
      .setDescription("Configuracion general del sistema")
      .addSubcommand((s) => s.setName("info").setDescription("Ver la configuracion actual"))
      .addSubcommand((s) =>
        s
          .setName("logs")
          .setDescription("Canal de logs")
          .addChannelOption((o) =>
            o.setName("canal").setDescription("Canal").addChannelTypes(ChannelType.GuildText).setRequired(true)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("transcripts")
          .setDescription("Canal de transcripciones")
          .addChannelOption((o) =>
            o.setName("canal").setDescription("Canal").addChannelTypes(ChannelType.GuildText).setRequired(true)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("dashboard")
          .setDescription("Canal del dashboard en tiempo real")
          .addChannelOption((o) =>
            o.setName("canal").setDescription("Canal").addChannelTypes(ChannelType.GuildText).setRequired(true)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("weekly-report")
          .setDescription("Canal para reporte semanal automatico")
          .addChannelOption((o) =>
            o.setName("canal").setDescription("Canal").addChannelTypes(ChannelType.GuildText).setRequired(true)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("live-members")
          .setDescription("Canal de voz que mostrara el total de miembros")
          .addChannelOption((o) =>
            o.setName("canal").setDescription("Canal de voz").addChannelTypes(ChannelType.GuildVoice).setRequired(true)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("live-role")
          .setDescription("Canal de voz que mostrara cuantas personas tienen un rol")
          .addChannelOption((o) =>
            o.setName("canal").setDescription("Canal de voz").addChannelTypes(ChannelType.GuildVoice).setRequired(true)
          )
          .addRoleOption((o) => o.setName("rol").setDescription("Rol a contar").setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("staff-role")
          .setDescription("Rol del equipo de soporte")
          .addRoleOption((o) => o.setName("rol").setDescription("Rol").setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("admin-role")
          .setDescription("Rol de administrador del bot")
          .addRoleOption((o) => o.setName("rol").setDescription("Rol").setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("verify-role")
          .setDescription("Rol minimo para abrir tickets (0 para desactivar)")
          .addRoleOption((o) => o.setName("rol").setDescription("Rol requerido").setRequired(false))
      )
      .addSubcommand((s) =>
        s
          .setName("max-tickets")
          .setDescription("Maximo de tickets por usuario")
          .addIntegerOption((o) => o.setName("cantidad").setDescription("1-10").setMinValue(1).setMaxValue(10).setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("global-limit")
          .setDescription("Limite global de tickets abiertos (0=sin limite)")
          .addIntegerOption((o) => o.setName("cantidad").setDescription("0-500").setMinValue(0).setMaxValue(500).setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("cooldown")
          .setDescription("Tiempo de espera entre tickets en minutos (0=desactivado)")
          .addIntegerOption((o) => o.setName("minutos").setDescription("Minutos").setMinValue(0).setMaxValue(1440).setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("min-days")
          .setDescription("Dias minimos en el servidor para abrir tickets (0=desactivado)")
          .addIntegerOption((o) => o.setName("dias").setDescription("Dias").setMinValue(0).setMaxValue(365).setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("auto-close")
          .setDescription("Auto-cierre por inactividad en minutos (0=desactivado)")
          .addIntegerOption((o) => o.setName("minutos").setDescription("Minutos").setMinValue(0).setMaxValue(10080).setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("sla")
          .setDescription("Alerta SLA si no hay respuesta en X minutos (0=desactivado)")
          .addIntegerOption((o) => o.setName("minutos").setDescription("Minutos").setMinValue(0).setMaxValue(1440).setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("smart-ping")
          .setDescription("Ping al staff si no responde en X minutos (0=desactivado)")
          .addIntegerOption((o) => o.setName("minutos").setDescription("Minutos").setMinValue(0).setMaxValue(1440).setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("dm-open")
          .setDescription("DM de confirmacion al abrir ticket")
          .addBooleanOption((o) => o.setName("activado").setDescription("Si/No").setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("dm-close")
          .setDescription("DM de notificacion al cerrar ticket")
          .addBooleanOption((o) => o.setName("activado").setDescription("Si/No").setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("log-edits")
          .setDescription("Registrar mensajes editados en tickets")
          .addBooleanOption((o) => o.setName("activado").setDescription("Si/No").setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("log-deletes")
          .setDescription("Registrar mensajes eliminados en tickets")
          .addBooleanOption((o) => o.setName("activado").setDescription("Si/No").setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("language")
          .setDescription("Idioma por defecto del bot en este servidor")
          .addStringOption((o) =>
            o
              .setName("valor")
              .setDescription("es o en")
              .setRequired(true)
              .addChoices(
                { name: "Espanol", value: "es" },
                { name: "English", value: "en" }
              )
          )
      )
  );
}

function formatChannel(id) {
  return id ? `<#${id}>` : "No configurado";
}

function formatRole(id) {
  return id ? `<@&${id}>` : "No configurado";
}

function formatToggle(value) {
  return value ? "Activo" : "Inactivo";
}

function formatMinutes(value) {
  return value > 0 ? `${value} min` : "Desactivado";
}

function formatLanguageLabel(value) {
  const lang = normalizeLanguage(value, "es");
  return lang === "en" ? "English" : "Espanol";
}

async function ensureVoiceStatsPermissions(interaction, channel) {
  const botMember = interaction.guild.members.me;
  const canManage = channel.permissionsFor(botMember)?.has(PermissionFlagsBits.ManageChannels);
  if (canManage) return false;

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.ERROR)
        .setTitle("Error de permisos para canal live")
        .setDescription(`No puedo renombrar ${channel}.`)
        .addFields({ name: "Permiso faltante", value: "- Administrar canales" })
        .setFooter({ text: "Otorga el permiso y repite el comando." })
        .setTimestamp(),
    ],
    flags: 64,
  });

  return true;
}

async function handleDashboardSetup(ctx) {
  const { interaction, gid } = ctx;
  const channel = interaction.options.getChannel("canal");
  const botMember = interaction.guild.members.me;

  const requiredPermissions = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.ReadMessageHistory,
  ];

  const missing = requiredPermissions.filter((perm) => !channel.permissionsFor(botMember)?.has(perm));
  if (missing.length) {
    const labels = {
      [PermissionFlagsBits.ViewChannel]: "Ver canal",
      [PermissionFlagsBits.SendMessages]: "Enviar mensajes",
      [PermissionFlagsBits.EmbedLinks]: "Insertar enlaces",
      [PermissionFlagsBits.ReadMessageHistory]: "Leer historial",
    };

    const missingList = missing.map((perm) => `- ${labels[perm] || "Permiso"}`).join("\n");
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.ERROR)
          .setTitle("Error de permisos para Dashboard")
          .setDescription(`No puedo usar ${channel} como canal del dashboard.`)
          .addFields({ name: "Permisos faltantes", value: missingList })
          .setFooter({ text: "Otorga los permisos y repite /setup general dashboard" })
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
      name: `Panel de Control | ${interaction.guild.name}`,
      iconURL: interaction.guild.iconURL({ dynamic: true }) || undefined,
    })
    .setTitle("Dashboard en Discord configurado")
    .setDescription(
      `El dashboard en tiempo real quedo configurado en ${channel}.\n` +
      "El sistema publica metricas del soporte y se actualiza automaticamente."
    )
    .addFields(
      {
        name: "Resumen operativo",
        value:
          `Canal: ${channel}\n` +
          `Auto-actualizacion: cada 30 segundos\n` +
          `Boton manual: Actualizar Panel`,
        inline: false,
      },
      {
        name: "Checklist",
        value:
          "- Canal de dashboard asignado\n" +
          "- Permisos del bot verificados\n" +
          "- Mensaje del panel sincronizado",
        inline: false,
      },
      {
        name: "Siguientes pasos recomendados",
        value:
          "- /setup general staff-role @rol\n" +
          "- /setup general logs #canal\n" +
          "- /setup general transcripts #canal",
        inline: false,
      }
    )
    .setTimestamp();

  const payload = { embeds: [embed], flags: 64 };
  if (dashboardUrl) {
    payload.components = [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(dashboardUrl).setLabel("Abrir Dashboard")
      ),
    ];
  }

  await interaction.reply(payload);
  return true;
}

function buildInfoEmbed(interaction, s) {
  const dashboardUrl = s.dashboard_channel && s.dashboard_message_id
    ? `https://discord.com/channels/${interaction.guild.id}/${s.dashboard_channel}/${s.dashboard_message_id}`
    : null;

  return new EmbedBuilder()
    .setColor(E.Colors.PRIMARY)
    .setAuthor({
      name: `Setup General | ${interaction.guild.name}`,
      iconURL: interaction.guild.iconURL({ dynamic: true }) || undefined,
    })
    .setTitle("Estado de configuracion del sistema")
    .setDescription("Vista consolidada para operaciones, soporte y automatizaciones.")
    .addFields(
      {
        name: "Canales",
        value:
          `Logs: ${formatChannel(s.log_channel)}\n` +
          `Transcripts: ${formatChannel(s.transcript_channel)}\n` +
          `Dashboard: ${formatChannel(s.dashboard_channel)}\n` +
          `Reporte semanal: ${formatChannel(s.weekly_report_channel)}\n` +
          `Panel tickets: ${formatChannel(s.panel_channel_id)}\n` +
          `Live miembros: ${formatChannel(s.live_members_channel)}\n` +
          `Live rol: ${formatChannel(s.live_role_channel)}`,
        inline: false,
      },
      {
        name: "Roles",
        value:
          `Soporte: ${formatRole(s.support_role)}\n` +
          `Admin: ${formatRole(s.admin_role)}\n` +
          `Verificacion: ${formatRole(s.verify_role)}\n` +
          `Rol live: ${formatRole(s.live_role_id)}`,
        inline: false,
      },
      {
        name: "Politicas de ticket",
        value:
          `Max por usuario: ${s.max_tickets}\n` +
          `Limite global: ${s.global_ticket_limit || "Sin limite"}\n` +
          `Cooldown: ${formatMinutes(s.cooldown_minutes)}\n` +
          `Minimo de dias: ${s.min_days}`,
        inline: true,
      },
      {
        name: "Automatizacion",
        value:
          `Auto-close: ${formatMinutes(s.auto_close_minutes)}\n` +
          `SLA: ${formatMinutes(s.sla_minutes)}\n` +
          `Smart ping: ${formatMinutes(s.smart_ping_minutes)}\n` +
          `Escalado SLA: ${s.sla_escalation_enabled ? `${formatMinutes(s.sla_escalation_minutes)}` : "Inactivo"}`,
        inline: true,
      },
      {
        name: "Estado",
        value:
          `DM al abrir: ${formatToggle(s.dm_on_open)}\n` +
          `DM al cerrar: ${formatToggle(s.dm_on_close)}\n` +
          `Idioma: ${formatLanguageLabel(s.bot_language)}\n` +
          `Log edits: ${formatToggle(s.log_edits)}\n` +
          `Log deletes: ${formatToggle(s.log_deletes)}\n` +
          `Mantenimiento: ${s.maintenance_mode ? `Activo (${s.maintenance_reason || "sin razon"})` : "Inactivo"}`,
        inline: false,
      },
      {
        name: "Dashboard",
        value: dashboardUrl ? `[Abrir mensaje del dashboard](${dashboardUrl})` : "Aun no hay mensaje publicado.",
        inline: false,
      }
    )
    .setFooter({ text: `Tickets creados historicos: ${s.ticket_counter || 0}` })
    .setTimestamp();
}

async function execute(ctx) {
  const { interaction, group, sub, gid, s, ok } = ctx;
  if (group !== "general") return false;

  if (sub === "dashboard") {
    return handleDashboardSetup(ctx);
  }

  if (CHANNEL_SUBS[sub]) {
    const channel = interaction.options.getChannel("canal");
    await settings.update(gid, { [CHANNEL_SUBS[sub]]: channel.id });
    return ok(`Canal **${sub}** configurado: ${channel}`);
  }

  if (sub === "live-members") {
    const channel = interaction.options.getChannel("canal");
    const blocked = await ensureVoiceStatsPermissions(interaction, channel);
    if (blocked) return true;

    await settings.update(gid, { live_members_channel: channel.id });
    await syncGuildLiveStats(interaction.guild, { hydrateMembers: true });
    return ok(`Canal live de miembros configurado: ${channel}`);
  }

  if (sub === "live-role") {
    const channel = interaction.options.getChannel("canal");
    const role = interaction.options.getRole("rol");
    const blocked = await ensureVoiceStatsPermissions(interaction, channel);
    if (blocked) return true;

    await settings.update(gid, {
      live_role_channel: channel.id,
      live_role_id: role.id,
    });
    await syncGuildLiveStats(interaction.guild, { hydrateMembers: true });
    return ok(`Canal live del rol configurado: ${channel} contando a ${role}`);
  }

  if (sub === "staff-role") {
    const role = interaction.options.getRole("rol");
    await settings.update(gid, { support_role: role.id });
    return ok(`Rol de soporte configurado: ${role}`);
  }

  if (sub === "admin-role") {
    const role = interaction.options.getRole("rol");
    await settings.update(gid, { admin_role: role.id });
    return ok(`Rol de admin configurado: ${role}`);
  }

  if (sub === "verify-role") {
    const role = interaction.options.getRole("rol");
    await settings.update(gid, { verify_role: role ? role.id : null });
    return ok(role ? `Rol minimo requerido: ${role}` : "Rol minimo desactivado.");
  }

  if (sub === "max-tickets") {
    const amount = interaction.options.getInteger("cantidad");
    await settings.update(gid, { max_tickets: amount });
    return ok(`Maximo de tickets por usuario: **${amount}**`);
  }

  if (sub === "global-limit") {
    const amount = interaction.options.getInteger("cantidad");
    await settings.update(gid, { global_ticket_limit: amount });
    return ok(amount === 0 ? "Limite global desactivado." : `Limite global: **${amount}** tickets.`);
  }

  if (sub === "cooldown") {
    const minutes = interaction.options.getInteger("minutos");
    await settings.update(gid, { cooldown_minutes: minutes });
    return ok(minutes === 0 ? "Cooldown desactivado." : `Cooldown: **${minutes} minutos**.`);
  }

  if (sub === "min-days") {
    const days = interaction.options.getInteger("dias");
    await settings.update(gid, { min_days: days });
    return ok(days === 0 ? "Dias minimos desactivado." : `Dias minimos en el servidor: **${days}**.`);
  }

  if (sub === "auto-close") {
    const minutes = interaction.options.getInteger("minutos");
    await settings.update(gid, { auto_close_minutes: minutes });
    return ok(minutes === 0 ? "Auto-cierre desactivado." : `Auto-cierre: **${minutes} minutos** de inactividad.`);
  }

  if (sub === "sla") {
    const minutes = interaction.options.getInteger("minutos");
    await settings.update(gid, { sla_minutes: minutes });
    return ok(minutes === 0 ? "Alerta SLA desactivada." : `SLA: alerta en **${minutes} minutos**.`);
  }

  if (sub === "smart-ping") {
    const minutes = interaction.options.getInteger("minutos");
    await settings.update(gid, { smart_ping_minutes: minutes });
    return ok(minutes === 0 ? "Smart ping desactivado." : `Smart ping: **${minutes} minutos** sin respuesta.`);
  }

  if (sub === "dm-open") {
    const enabled = interaction.options.getBoolean("activado");
    await settings.update(gid, { dm_on_open: enabled });
    return ok(`DM al abrir ticket: **${enabled ? "Activo" : "Inactivo"}**`);
  }

  if (sub === "dm-close") {
    const enabled = interaction.options.getBoolean("activado");
    await settings.update(gid, { dm_on_close: enabled });
    return ok(`DM al cerrar ticket: **${enabled ? "Activo" : "Inactivo"}**`);
  }

  if (sub === "log-edits") {
    const enabled = interaction.options.getBoolean("activado");
    await settings.update(gid, { log_edits: enabled });
    return ok(`Log de ediciones: **${enabled ? "Activo" : "Inactivo"}**`);
  }

  if (sub === "log-deletes") {
    const enabled = interaction.options.getBoolean("activado");
    await settings.update(gid, { log_deletes: enabled });
    return ok(`Log de eliminaciones: **${enabled ? "Activo" : "Inactivo"}**`);
  }

  if (sub === "language") {
    const value = normalizeLanguage(interaction.options.getString("valor", true), "es");
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
