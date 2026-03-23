const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { settings } = require("../../../../utils/database");
const { updateDashboard } = require("../../../../handlers/dashboardHandler");
const { categories } = require("../../../../../config");
const { buildTicketPanelPayload } = require("../../../../domain/tickets/panelPayload");

const PRO_PLAYBOOKS = ["sla_escalation", "incident_mode", "customer_recovery"];

function register(builder) {
  return builder.addSubcommand((sub) =>
    sub
      .setName("wizard")
      .setDescription("Asistente guiado para configuracion inicial")
      .addChannelOption((o) =>
        o
          .setName("dashboard")
          .setDescription("Canal principal de dashboard y panel")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addChannelOption((o) =>
        o
          .setName("logs")
          .setDescription("Canal de logs (opcional)")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(false)
      )
      .addChannelOption((o) =>
        o
          .setName("transcripts")
          .setDescription("Canal de transcripts (opcional)")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(false)
      )
      .addRoleOption((o) =>
        o.setName("staff").setDescription("Rol de staff (opcional)").setRequired(false)
      )
      .addRoleOption((o) =>
        o.setName("admin").setDescription("Rol admin del bot (opcional)").setRequired(false)
      )
      .addStringOption((o) =>
        o
          .setName("plan_ops")
          .setDescription("Plan operativo inicial del servidor")
          .setRequired(false)
          .addChoices(
            { name: "Free", value: "free" },
            { name: "Pro operativo", value: "pro" },
            { name: "Enterprise", value: "enterprise" },
          )
      )
      .addIntegerOption((o) =>
        o
          .setName("sla_alerta")
          .setDescription("Minutos para alerta SLA base (opcional)")
          .setMinValue(0)
          .setMaxValue(1440)
          .setRequired(false)
      )
      .addIntegerOption((o) =>
        o
          .setName("sla_escalado")
          .setDescription("Minutos para escalado SLA base (opcional)")
          .setMinValue(0)
          .setMaxValue(10080)
          .setRequired(false)
      )
      .addBooleanOption((o) =>
        o
          .setName("publicar_panel")
          .setDescription("Publicar panel de tickets inmediatamente")
          .setRequired(false)
      )
  );
}

function canSendPanel(channel, botMember) {
  if (!channel || !botMember) return false;
  const perms = channel.permissionsFor(botMember);
  if (!perms) return false;
  return (
    perms.has(PermissionFlagsBits.ViewChannel) &&
    perms.has(PermissionFlagsBits.SendMessages) &&
    perms.has(PermissionFlagsBits.EmbedLinks)
  );
}

async function publishPanel({ guild, channel, supportRoleId }) {
  const payload = buildTicketPanelPayload({
    guild,
    categories,
  });

  if (supportRoleId) {
    payload.embeds[0].addFields({
      name: "Staff",
      value: `<@&${supportRoleId}>`,
      inline: true,
    });
  }

  const message = await channel.send(payload);

  await settings.update(guild.id, { panel_message_id: message.id });
  return message.id;
}

function line(ok, label, value) {
  return `${ok ? "OK" : "PEND"} ${label}: ${value}`;
}

async function execute(ctx) {
  const { interaction, group, sub, gid } = ctx;
  if (!(group === null && sub === "wizard")) return false;

  const dashboard = interaction.options.getChannel("dashboard", true);
  const logs = interaction.options.getChannel("logs");
  const transcripts = interaction.options.getChannel("transcripts");
  const staffRole = interaction.options.getRole("staff");
  const adminRole = interaction.options.getRole("admin");
  const opsPlan = interaction.options.getString("plan_ops") || "free";
  const slaAlertMinutes = interaction.options.getInteger("sla_alerta");
  const slaEscalationMinutes = interaction.options.getInteger("sla_escalado");
  const publishNow = interaction.options.getBoolean("publicar_panel") !== false;

  await interaction.deferReply({ flags: 64 });

  const updates = {
    dashboard_channel: dashboard.id,
    panel_channel_id: dashboard.id,
  };
  if (logs) updates.log_channel = logs.id;
  if (transcripts) updates.transcript_channel = transcripts.id;
  if (staffRole) updates.support_role = staffRole.id;
  if (adminRole) updates.admin_role = adminRole.id;
  updates.dashboard_general_settings = {
    ...(updates.dashboard_general_settings || {}),
    ...(await settings.get(gid))?.dashboard_general_settings,
    opsPlan,
  };
  updates.disabled_playbooks = opsPlan === "free" ? PRO_PLAYBOOKS : [];
  if (typeof slaAlertMinutes === "number") {
    updates.sla_minutes = slaAlertMinutes;
  }
  if (typeof slaEscalationMinutes === "number") {
    updates.sla_escalation_enabled = slaEscalationMinutes > 0;
    updates.sla_escalation_minutes = slaEscalationMinutes;
  }

  await settings.update(gid, updates);
  await updateDashboard(interaction.guild, true).catch(() => {});

  let panelStatus = "omitido";
  if (publishNow) {
    const botMember = interaction.guild.members.me;
    if (!canSendPanel(dashboard, botMember)) {
      panelStatus = "sin permisos";
    } else {
      try {
        await publishPanel({
          guild: interaction.guild,
          channel: dashboard,
          supportRoleId: staffRole?.id || null,
        });
        panelStatus = "publicado";
      } catch (error) {
        panelStatus = `error: ${error?.message || "desconocido"}`;
      }
    }
  }

  const current = await settings.get(gid);
  const embed = new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle("Setup Wizard completado")
    .setDescription("Configuracion base aplicada correctamente.")
    .addFields(
      {
        name: "Resumen",
        value:
          line(true, "Dashboard", `<#${current.dashboard_channel}>`) + "\n" +
          line(Boolean(current.log_channel), "Logs", current.log_channel ? `<#${current.log_channel}>` : "no configurado") + "\n" +
          line(Boolean(current.transcript_channel), "Transcripts", current.transcript_channel ? `<#${current.transcript_channel}>` : "no configurado") + "\n" +
          line(Boolean(current.support_role), "Staff role", current.support_role ? `<@&${current.support_role}>` : "no configurado") + "\n" +
          line(Boolean(current.admin_role), "Admin role", current.admin_role ? `<@&${current.admin_role}>` : "no configurado") + "\n" +
          line(true, "Plan ops", current.dashboard_general_settings?.opsPlan || opsPlan) + "\n" +
          line(current.sla_minutes > 0, "SLA alerta", current.sla_minutes > 0 ? `${current.sla_minutes} min` : "sin SLA base") + "\n" +
          line(current.sla_escalation_enabled, "SLA escalado", current.sla_escalation_enabled ? `${current.sla_escalation_minutes} min` : "desactivado") + "\n" +
          line(panelStatus === "publicado", "Panel tickets", panelStatus),
        inline: false,
      },
      {
        name: "Siguiente paso recomendado",
        value:
          "Abre `/ticket playbook list` dentro de un ticket para validar recomendaciones vivas.\n" +
          "Si estas en Free, empieza con triage_support. En Pro, activa SLA e incident mode cuanto antes.",
        inline: false,
      }
    )
    .setFooter({ text: "Puedes volver a ejecutar /setup wizard en cualquier momento" })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
  return true;
}

module.exports = {
  register,
  execute,
};
