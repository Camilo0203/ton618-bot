const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { settings, ticketCategories } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { buildCenterPayload } = require("./configCenter");
const categoryModule = require("./category");

function fmtChannel(id) {
  return id ? `<#${id}>` : "No configurado";
}

function fmtRole(id) {
  return id ? `<@&${id}>` : "No configurado";
}

function fmtToggle(value, enabledLabel = "Activo", disabledLabel = "Inactivo") {
  return value ? enabledLabel : disabledLabel;
}

function fmtGlobalLimit(value) {
  return Number(value || 0) > 0 ? `\`${Number(value)}\`` : "Sin limite";
}

function readMinutes(record, minutesKey, hoursKey) {
  const minutes = Number(record?.[minutesKey] || 0);
  if (minutes > 0) return minutes;

  const hours = Number(record?.[hoursKey] || 0);
  return hours > 0 ? hours * 60 : 0;
}

function fmtMinutes(value, disabledLabel = "Desactivado") {
  const minutes = Number(value || 0);
  if (minutes <= 0) return disabledLabel;
  if (minutes < 60) return `${minutes} min`;
  if (minutes % 60 === 0) return `${minutes / 60} h`;
  return `${minutes} min`;
}

function fmtPanelStatus(settingsRecord) {
  if (!settingsRecord?.panel_channel_id) return "No configurado";
  if (settingsRecord.panel_message_id) return "Publicado";
  return "Canal listo, panel pendiente";
}

function countRules(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return 0;
  return Object.keys(record).length;
}

function priorityBadge(priority) {
  const labels = {
    low: "Verde",
    normal: "Amarilla",
    high: "Naranja",
    urgent: "Roja",
  };
  return labels[priority] || "Amarilla";
}

function truncate(text, maxLength) {
  const value = String(text || "").trim();
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}

function summarizeIncidentScope(settingsRecord, categories) {
  if (!settingsRecord?.incident_mode_enabled) return "Inactivo";

  const pausedIds = Array.isArray(settingsRecord.incident_paused_categories)
    ? settingsRecord.incident_paused_categories.filter(Boolean)
    : [];

  if (pausedIds.length === 0) return "Todas las categorias";

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
  if (!settingsRecord?.incident_mode_enabled) return "No aplica";
  return settingsRecord?.incident_message
    ? truncate(settingsRecord.incident_message, 120)
    : "Predeterminado";
}

function summarizeCategories(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return "No hay categorias configuradas. Usa `/config category list` para revisarlas.";
  }

  const lines = categories.slice(0, 6).map((category) => {
    const emoji = category.emoji ? `${category.emoji} ` : "";
    const status = category.enabled === false ? "OFF" : "ON";
    const discordCategory = category.discord_category_id
      ? `<#${category.discord_category_id}>`
      : "sin canal";
    const pingCount = Array.isArray(category.ping_roles) ? category.ping_roles.length : 0;

    return (
      `- ${emoji}**${category.label || category.category_id}** | ` +
      `${priorityBadge(category.priority)} | ${status} | ${discordCategory} | pings ${pingCount}`
    );
  });

  if (categories.length > 6) {
    lines.push(`- ... y ${categories.length - 6} categoria(s) mas`);
  }

  return lines.join("\n");
}

function buildTicketConfigEmbed(guild, settingsRecord, categories) {
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
    .setTitle(`Tickets - ${guild.name}`)
    .setDescription(
      "Vista rapida del sistema de tickets para validar canales, limites, SLA y automatizaciones."
    )
    .addFields(
      {
        name: "Canales y Roles",
        value:
          `Panel: ${fmtChannel(settingsRecord?.panel_channel_id)}\n` +
          `Estado panel: ${fmtPanelStatus(settingsRecord)}\n` +
          `Logs: ${fmtChannel(settingsRecord?.log_channel)}\n` +
          `Transcripts: ${fmtChannel(settingsRecord?.transcript_channel)}\n` +
          `Staff: ${fmtRole(settingsRecord?.support_role)}\n` +
          `Admin: ${fmtRole(settingsRecord?.admin_role)}`,
        inline: false,
      },
      {
        name: "Limites y Acceso",
        value:
          `Max por usuario: \`${Number(settingsRecord?.max_tickets || 3)}\`\n` +
          `Limite global: ${fmtGlobalLimit(settingsRecord?.global_ticket_limit)}\n` +
          `Cooldown: ${fmtMinutes(settingsRecord?.cooldown_minutes, "Sin cooldown")}\n` +
          `Minimo de dias: ${Number(settingsRecord?.min_days || 0)}\n` +
          `Ayuda simple: ${fmtToggle(settingsRecord?.simple_help_mode !== false, "Activa", "Inactiva")}`,
        inline: false,
      },
      {
        name: "SLA y Automatizacion",
        value:
          `SLA base: ${fmtMinutes(slaMinutes)}\n` +
          `Smart ping: ${fmtMinutes(smartPingMinutes)}\n` +
          `Auto-close: ${fmtMinutes(autoCloseMinutes)}\n` +
          `Autoasignacion: ${fmtToggle(settingsRecord?.auto_assign_enabled)}\n` +
          `Solo online: ${fmtToggle(settingsRecord?.auto_assign_require_online, "Si", "No")}\n` +
          `Respeta ausentes: ${fmtToggle(settingsRecord?.auto_assign_respect_away, "Si", "No")}`,
        inline: false,
      },
      {
        name: "Escalado y Reportes",
        value:
          `Escalado SLA: ${fmtToggle(settingsRecord?.sla_escalation_enabled)}\n` +
          `Umbral: ${fmtMinutes(settingsRecord?.sla_escalation_minutes)}\n` +
          `Canal: ${fmtChannel(settingsRecord?.sla_escalation_channel || reportChannelId)}\n` +
          `Rol: ${fmtRole(settingsRecord?.sla_escalation_role)}\n` +
          `Reglas SLA: \`${slaRuleCount}\`\n` +
          `Reglas escalado: \`${escalationRuleCount}\`\n` +
          `Reporte diario: ${settingsRecord?.daily_sla_report_enabled ? fmtChannel(reportChannelId) : "Inactivo"}\n` +
          `Reporte semanal: ${fmtChannel(settingsRecord?.weekly_report_channel)}`,
        inline: false,
      },
      {
        name: "Modo Incidente",
        value:
          `Estado: ${fmtToggle(settingsRecord?.incident_mode_enabled)}\n` +
          `Alcance: ${summarizeIncidentScope(settingsRecord, categories)}\n` +
          `Mensaje: ${summarizeIncidentMessage(settingsRecord)}`,
        inline: false,
      },
      {
        name: `Categorias Configuradas (${Array.isArray(categories) ? categories.length : 0})`,
        value: summarizeCategories(categories),
        inline: false,
      }
    )
    .setFooter({
      text: "Sugerencia: usa /setup tickets ... para editar y /config category list para revisar el detalle completo.",
    })
    .setTimestamp();
}

let commandBuilder = new SlashCommandBuilder()
  .setName("config")
  .setDescription("Configuracion ultra simple para admins")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcommand) =>
    subcommand.setName("estado").setDescription("Ver estado actual")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("tickets")
      .setDescription("Ver configuracion operativa completa de tickets")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("centro")
      .setDescription("Abrir centro interactivo con menus y botones")
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

    if (sub === "centro") {
      return interaction.reply({
        ...(await buildCenterPayload(interaction.guild, interaction.user.id, "general")),
        flags: 64,
      });
    }

    if (sub === "estado") {
      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("Estado de Configuracion")
        .addFields(
          { name: "Panel tickets", value: fmtChannel(currentSettings.panel_channel_id), inline: true },
          { name: "Logs", value: fmtChannel(currentSettings.log_channel), inline: true },
          { name: "Transcripts", value: fmtChannel(currentSettings.transcript_channel), inline: true },
          { name: "Live miembros", value: fmtChannel(currentSettings.live_members_channel), inline: true },
          { name: "Live rol", value: fmtChannel(currentSettings.live_role_channel), inline: true },
          { name: "Rol live", value: fmtRole(currentSettings.live_role_id), inline: true },
          { name: "Rol staff", value: fmtRole(currentSettings.support_role), inline: true },
          { name: "Rol admin", value: fmtRole(currentSettings.admin_role), inline: true },
          { name: "Max tickets", value: `\`${currentSettings.max_tickets || 3}\``, inline: true },
          {
            name: "Ayuda simple",
            value: currentSettings.simple_help_mode === false ? "Desactivada" : "Activada",
            inline: true,
          }
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
      content: "Subcomando no disponible. Usa `/config centro`.",
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
