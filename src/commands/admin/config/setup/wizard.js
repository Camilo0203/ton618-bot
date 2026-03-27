const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { settings } = require("../../../../utils/database");
const { updateDashboard } = require("../../../../handlers/dashboardHandler");
const { categories } = require("../../../../../config");
const { buildTicketPanelPayload } = require("../../../../domain/tickets/panelPayload");
const { PLAYBOOK_DEFINITIONS } = require("../../../../utils/dashboardBridge/playbooks");
const { buildCommercialSettingsPatch, resolveCommercialState } = require("../../../../utils/commercial");

const PRO_PLAYBOOKS = PLAYBOOK_DEFINITIONS.map((playbook) => playbook.playbookId);

function register(builder) {
  return builder.addSubcommand((sub) =>
    sub
      .setName("wizard")
      .setDescription("Guided setup for a new support server")
      .addChannelOption((option) =>
        option
          .setName("dashboard")
          .setDescription("Main dashboard and panel channel")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      )
      .addChannelOption((option) =>
        option
          .setName("logs")
          .setDescription("Log channel (optional)")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(false),
      )
      .addChannelOption((option) =>
        option
          .setName("transcripts")
          .setDescription("Transcript channel (optional)")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(false),
      )
      .addRoleOption((option) =>
        option.setName("staff").setDescription("Staff role (optional)").setRequired(false),
      )
      .addRoleOption((option) =>
        option.setName("admin").setDescription("Bot admin role (optional)").setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName("plan")
          .setDescription("Initial server plan")
          .setRequired(false)
          .addChoices(
            { name: "Free", value: "free" },
            { name: "Pro", value: "pro" },
          ),
      )
      .addIntegerOption((option) =>
        option
          .setName("sla-warning-minutes")
          .setDescription("Base SLA warning threshold in minutes")
          .setMinValue(0)
          .setMaxValue(1440)
          .setRequired(false),
      )
      .addIntegerOption((option) =>
        option
          .setName("sla-escalation-minutes")
          .setDescription("Base SLA escalation threshold in minutes")
          .setMinValue(0)
          .setMaxValue(10080)
          .setRequired(false),
      )
      .addBooleanOption((option) =>
        option
          .setName("publish-panel")
          .setDescription("Publish the ticket panel immediately")
          .setRequired(false),
      ),
  );
}

function canSendPanel(channel, botMember) {
  if (!channel || !botMember) return false;
  const perms = channel.permissionsFor(botMember);
  if (!perms) return false;
  return (
    perms.has(PermissionFlagsBits.ViewChannel)
    && perms.has(PermissionFlagsBits.SendMessages)
    && perms.has(PermissionFlagsBits.EmbedLinks)
  );
}

async function publishPanel({ guild, channel, supportRoleId }) {
  if (!categories || categories.length === 0) {
    throw new Error(
      "No ticket categories are configured yet. " +
      "Configure at least one category in config.js before using the ticket system.",
    );
  }

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
  return `${ok ? "OK" : "PENDING"} ${label}: ${value}`;
}

async function execute(ctx) {
  const { interaction, group, sub, gid } = ctx;
  if (!(group === null && sub === "wizard")) return false;

  const dashboard = interaction.options.getChannel("dashboard", true);
  const logs = interaction.options.getChannel("logs");
  const transcripts = interaction.options.getChannel("transcripts");
  const staffRole = interaction.options.getRole("staff");
  const adminRole = interaction.options.getRole("admin");
  const currentSettings = await settings.get(gid);
  const opsPlan = interaction.options.getString("plan")
    || interaction.options.getString("plan_ops")
    || "free";
  const slaAlertMinutes = interaction.options.getInteger("sla-warning-minutes")
    ?? interaction.options.getInteger("sla_alerta");
  const slaEscalationMinutes = interaction.options.getInteger("sla-escalation-minutes")
    ?? interaction.options.getInteger("sla_escalado");
  const publishNow = (interaction.options.getBoolean("publish-panel")
    ?? interaction.options.getBoolean("publicar_panel")) !== false;

  await interaction.deferReply({ flags: 64 });

  const updates = {
    dashboard_channel: dashboard.id,
    panel_channel_id: dashboard.id,
  };

  if (logs) updates.log_channel = logs.id;
  if (transcripts) updates.transcript_channel = transcripts.id;
  if (staffRole) updates.support_role = staffRole.id;
  if (adminRole) updates.admin_role = adminRole.id;

  Object.assign(
    updates,
    buildCommercialSettingsPatch(currentSettings, {
      plan: opsPlan,
      plan_source: "setup_wizard",
      plan_started_at: opsPlan === "pro" ? new Date() : null,
      plan_expires_at: null,
      plan_note: "Configured from /setup wizard",
    }),
  );

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

  let panelStatus = "skipped";
  if (publishNow) {
    const botMember = interaction.guild.members.me;
    if (!canSendPanel(dashboard, botMember)) {
      panelStatus = "missing permissions";
    } else {
      try {
        await publishPanel({
          guild: interaction.guild,
          channel: dashboard,
          supportRoleId: staffRole?.id || null,
        });
        panelStatus = "published";
      } catch (error) {
        panelStatus = `error: ${error?.message || "unknown"}`;
      }
    }
  }

  const current = await settings.get(gid);
  const commercialState = resolveCommercialState(current);
  const embed = new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle("Setup wizard completed")
    .setDescription("Baseline configuration applied successfully.")
    .addFields(
      {
        name: "Summary",
        value:
          line(true, "Dashboard", `<#${current.dashboard_channel}>`) + "\n" +
          line(Boolean(current.log_channel), "Logs", current.log_channel ? `<#${current.log_channel}>` : "not set") + "\n" +
          line(Boolean(current.transcript_channel), "Transcripts", current.transcript_channel ? `<#${current.transcript_channel}>` : "not set") + "\n" +
          line(Boolean(current.support_role), "Staff role", current.support_role ? `<@&${current.support_role}>` : "not set") + "\n" +
          line(Boolean(current.admin_role), "Admin role", current.admin_role ? `<@&${current.admin_role}>` : "not set") + "\n" +
          line(true, "Plan", commercialState.effectivePlan) + "\n" +
          line(current.sla_minutes > 0, "SLA warning", current.sla_minutes > 0 ? `${current.sla_minutes} min` : "disabled") + "\n" +
          line(current.sla_escalation_enabled, "SLA escalation", current.sla_escalation_enabled ? `${current.sla_escalation_minutes} min` : "disabled") + "\n" +
          line(panelStatus === "published", "Ticket panel", panelStatus),
        inline: false,
      },
      {
        name: "Recommended next step",
        value: commercialState.isPro
          ? "Open `/ticket playbook list` inside a ticket to validate live operational recommendations.\nThen tune `/setup tickets sla`, `/setup tickets incident`, and daily reporting."
          : "Run `/setup tickets panel` and `/config tickets` to validate the free core.\nWhen you are ready for SLA automation and playbooks, ask the owner to activate Pro.",
        inline: false,
      },
    )
    .setFooter({ text: "You can run /setup wizard again at any time" })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
  return true;
}

module.exports = {
  register,
  execute,
};
