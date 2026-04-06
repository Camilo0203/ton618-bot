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
const { resolveGuildLanguage, t } = require("../../../../utils/i18n");
const { setupT } = require("./i18n");
const { withDescriptionLocalizations, localizedChoice } = require("../../../../utils/slashLocalizations");

const PRO_PLAYBOOKS = PLAYBOOK_DEFINITIONS.map((playbook) => playbook.playbookId);

function register(builder) {
  return builder.addSubcommand((sub) =>
    withDescriptionLocalizations(
      sub
        .setName("wizard")
        .setDescription(t("en", "setup.wizard.description"))
        .addChannelOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("dashboard")
              .setDescription(t("en", "setup.wizard.option_dashboard"))
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(true),
            "setup.wizard.option_dashboard"
          )
        )
        .addChannelOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("logs")
              .setDescription(t("en", "setup.wizard.option_logs"))
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false),
            "setup.wizard.option_logs"
          )
        )
        .addChannelOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("transcripts")
              .setDescription(t("en", "setup.wizard.option_transcripts"))
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false),
            "setup.wizard.option_transcripts"
          )
        )
        .addRoleOption((option) =>
          withDescriptionLocalizations(
            option.setName("staff").setDescription(t("en", "setup.wizard.option_staff")).setRequired(false),
            "setup.wizard.option_staff"
          )
        )
        .addRoleOption((option) =>
          withDescriptionLocalizations(
            option.setName("admin").setDescription(t("en", "setup.wizard.option_admin")).setRequired(false),
            "setup.wizard.option_admin"
          )
        )
        .addStringOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("plan")
              .setDescription(t("en", "setup.wizard.option_plan"))
              .setRequired(false)
              .addChoices(
                { name: "Free", value: "free" },
                { name: "Pro", value: "pro" },
              ),
            "setup.wizard.option_plan"
          )
        )
        .addIntegerOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("sla-warning-minutes")
              .setDescription(t("en", "setup.wizard.option_sla_warning"))
              .setMinValue(0)
              .setMaxValue(1440)
              .setRequired(false),
            "setup.wizard.option_sla_warning"
          )
        )
        .addIntegerOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("sla-escalation-minutes")
              .setDescription(t("en", "setup.wizard.option_sla_escalation"))
              .setMinValue(0)
              .setMaxValue(10080)
              .setRequired(false),
            "setup.wizard.option_sla_escalation"
          )
        )
        .addBooleanOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("publish-panel")
              .setDescription(t("en", "setup.wizard.option_publish_panel"))
              .setRequired(false),
            "setup.wizard.option_publish_panel"
          )
        ),
      "setup.wizard.description"
    )
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

  const settingsRecord = await settings.get(guild.id);
  const language = resolveGuildLanguage(settingsRecord, "en");
  const payload = buildTicketPanelPayload({
    guild,
    categories,
    settingsRecord,
  });

  if (supportRoleId) {
    payload.embeds[0].addFields({
      name: t(language, "ticket.rating.prompt_staff_label"),
      value: `<@&${supportRoleId}>`,
      inline: true,
    });
  }

  const message = await channel.send(payload);
  await settings.update(guild.id, { panel_message_id: message.id });
  return message.id;
}

function line(ok, label, value, language) {
  const status = ok ? "OK" : setupT(language, "general.common.disabled").toUpperCase();
  return `**${status}** ${label}: ${value}`;
}

async function execute(ctx) {
  const { interaction, group, sub, gid, s } = ctx;
  if (!(group === null && sub === "wizard")) return false;

  const language = resolveGuildLanguage(s, "en");
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
      panelStatus = "missing_permissions";
    } else {
      try {
        await publishPanel({
          guild: interaction.guild,
          channel: dashboard,
          supportRoleId: staffRole?.id || null,
        });
        panelStatus = "published";
      } catch (error) {
        panelStatus = "error";
        console.error("Wizard publish error:", error);
      }
    }
  }

  const current = await settings.get(gid);
  const commercialState = resolveCommercialState(current);
  
  const statusLabel = setupT(language, `general.wizard.panel_status.${panelStatus}`, {
    error: panelStatus === "error" ? "Unknown" : ""
  });

  const embed = new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle(setupT(language, "general.wizard.title"))
    .setDescription(setupT(language, "general.wizard.description"))
    .addFields(
      {
        name: setupT(language, "general.wizard.summary_label"),
        value:
          line(true, setupT(language, "general.info.dashboard_channel"), `<#${current.dashboard_channel}>`, language) + "\n" +
          line(Boolean(current.log_channel), setupT(language, "general.info.logs"), current.log_channel ? `<#${current.log_channel}>` : setupT(language, "general.common.not_configured"), language) + "\n" +
          line(Boolean(current.transcript_channel), setupT(language, "general.info.transcripts"), current.transcript_channel ? `<#${current.transcript_channel}>` : setupT(language, "general.common.not_configured"), language) + "\n" +
          line(Boolean(current.support_role), setupT(language, "general.info.support_role"), current.support_role ? `<@&${current.support_role}>` : setupT(language, "general.common.not_configured"), language) + "\n" +
          line(Boolean(current.admin_role), setupT(language, "general.info.admin_role"), current.admin_role ? `<@&${current.admin_role}>` : setupT(language, "general.common.not_configured"), language) + "\n" +
          line(true, setupT(language, "general.info.language"), t(language, `common.language.${current.bot_language || "en"}`), language) + "\n" +
          line(true, setupT(language, "general.info.auto_close"), formatMinutes(current.auto_close_minutes, language), language) + "\n" +
          line(panelStatus === "published", setupT(language, "general.info.ticket_panel"), statusLabel, language),
        inline: false,
      },
      {
        name: setupT(language, "general.wizard.next_step_label"),
        value: commercialState.isPro
          ? setupT(language, "general.wizard.pro_next_step")
          : setupT(language, "general.wizard.free_next_step"),
        inline: false,
      },
    )
    .setFooter({ text: setupT(language, "general.wizard.footer") })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
  return true;
}

function formatMinutes(value, language) {
  return value > 0
    ? setupT(language, "general.common.minutes", { value })
    : setupT(language, "general.common.disabled");
}

module.exports = {
  register,
  execute,
};
