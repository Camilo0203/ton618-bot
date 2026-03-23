const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { settings } = require("../../../../utils/database");
const { updateDashboard } = require("../../../../handlers/dashboardHandler");
const { categories } = require("../../../../../config");
const { buildTicketPanelPayload } = require("../../../../domain/tickets/panelPayload");

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
          line(panelStatus === "publicado", "Panel tickets", panelStatus),
        inline: false,
      },
      {
        name: "Siguiente paso recomendado",
        value: "Revisa detalles avanzados con `/setup general info` o `/config centro`.",
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
