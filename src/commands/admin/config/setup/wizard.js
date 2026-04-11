const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  RoleSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { settings } = require("../../../../utils/database");
const { updateDashboard } = require("../../../../handlers/dashboardHandler");
const { categories } = require("../../../../../config");
const { buildTicketPanelPayload } = require("../../../../domain/tickets/panelPayload");
const { resolveCommercialState } = require("../../../../utils/commercial");
const { resolveGuildLanguage, t } = require("../../../../utils/i18n");
const { setupT } = require("./i18n");
const { withDescriptionLocalizations } = require("../../../../utils/slashLocalizations");

function register(builder) {
  return builder.addSubcommand((sub) =>
    withDescriptionLocalizations(
      sub
        .setName("wizard")
        .setDescription(t("en", "setup.wizard.description")),
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
      "Configure at least one category in config.js before using the ticket system."
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

function getInteractiveReply(messageLike, interaction) {
  if (messageLike && typeof messageLike.createMessageComponentCollector === "function") {
    return messageLike;
  }

  if (typeof interaction.fetchReply === "function") {
    return interaction.fetchReply();
  }

  return null;
}

async function finishWizard(interaction, gid, language, wizardState, options = {}) {
  const { showSavingState = true } = options;
  if (showSavingState) {
    const saveEmbed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setDescription(`🔄 ${setupT(language, "general.wizard.interactive.saving")}`);
    await interaction.editReply({ embeds: [saveEmbed], components: [] });
  }

  if (!wizardState.dashboard) {
    const errEmbed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription("❌ You must explicitly select a Dashboard channel to finish setup.");
    await interaction.editReply({ embeds: [errEmbed], components: [] }).catch(() => {});
    return;
  }

  const updates = {
    dashboard_channel: wizardState.dashboard.id,
  };

  if (wizardState.logs) updates.log_channel = wizardState.logs.id;
  if (wizardState.transcripts) updates.transcript_channel = wizardState.transcripts.id;
  if (wizardState.supportRole) updates.support_role = wizardState.supportRole.id;
  if (wizardState.adminRole) updates.admin_role = wizardState.adminRole.id;
  if (wizardState.opsPlan) updates.dashboard_general_settings = { opsPlan: wizardState.opsPlan };
  if (Number.isInteger(wizardState.slaMinutes)) updates.sla_minutes = wizardState.slaMinutes;
  if (Number.isInteger(wizardState.slaEscalationMinutes) && wizardState.slaEscalationMinutes > 0) {
    updates.sla_escalation_enabled = true;
    updates.sla_escalation_minutes = wizardState.slaEscalationMinutes;
  }
  if (Array.isArray(wizardState.disabledPlaybooks)) updates.disabled_playbooks = wizardState.disabledPlaybooks;

  await settings.update(gid, updates);
  await updateDashboard(interaction.guild, true).catch(() => {});

  let panelStatus = "skipped";
  if (wizardState.publishPanel) {
    const botMember = interaction.guild.members.me;
    if (!canSendPanel(wizardState.dashboard, botMember)) {
      panelStatus = "missing_permissions";
    } else {
      try {
        await publishPanel({
          guild: interaction.guild,
          channel: wizardState.dashboard,
          supportRoleId: wizardState.supportRole?.id || null,
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
    error: panelStatus === "error" ? "Unknown" : "",
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
          line(panelStatus === "published", setupT(language, "general.info.ticket_panel"), statusLabel, language),
        inline: false,
      },
      {
        name: setupT(language, "general.wizard.next_step_label"),
        value: commercialState.isPro
          ? setupT(language, "general.wizard.pro_next_step")
          : setupT(language, "general.wizard.free_next_step"),
        inline: false,
      }
    )
    .setFooter({ text: setupT(language, "general.wizard.footer") })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed], components: [] });
}

async function execute(ctx) {
  const { interaction, group, sub, gid, s } = ctx;
  if (!(group === null && sub === "wizard")) return false;

  const language = resolveGuildLanguage(s, "en");
  await interaction.deferReply({ flags: 64 });

  const wizardState = {
    dashboard: null,
    logs: null,
    transcripts: null,
    supportRole: null,
    adminRole: null,
    publishPanel: false,
    opsPlan: interaction.options?.getString?.("plan_ops") || null,
    slaMinutes: interaction.options?.getInteger?.("sla_alerta") ?? null,
    slaEscalationMinutes: interaction.options?.getInteger?.("sla_escalado") ?? null,
    disabledPlaybooks: [],
  };

  let currentStep = 1;

  const getStepContent = (step) => {
    const embed = new EmbedBuilder().setColor(0x5865F2);
    const components = [];

    const skipButton = new ButtonBuilder()
      .setCustomId("wiz_skip")
      .setLabel(setupT(language, "general.wizard.interactive.button_skip"))
      .setStyle(ButtonStyle.Secondary);

    if (step === 1) {
      embed.setDescription(setupT(language, "general.wizard.interactive.step_dashboard"));
      const select = new ChannelSelectMenuBuilder()
        .setCustomId("wiz_dashboard")
        .setPlaceholder(setupT(language, "general.wizard.interactive.placeholder_channel"))
        .setChannelTypes(ChannelType.GuildText)
        .setMaxValues(1);
      components.push(new ActionRowBuilder().addComponents(select));
    } else if (step === 2) {
      embed.setDescription(setupT(language, "general.wizard.interactive.step_logs"));
      const select = new ChannelSelectMenuBuilder()
        .setCustomId("wiz_logs")
        .setPlaceholder(setupT(language, "general.wizard.interactive.placeholder_channel"))
        .setChannelTypes(ChannelType.GuildText)
        .setMaxValues(1);
      components.push(new ActionRowBuilder().addComponents(select));
      components.push(new ActionRowBuilder().addComponents(skipButton));
    } else if (step === 3) {
      embed.setDescription(setupT(language, "general.wizard.interactive.step_transcripts"));
      const select = new ChannelSelectMenuBuilder()
        .setCustomId("wiz_transcripts")
        .setPlaceholder(setupT(language, "general.wizard.interactive.placeholder_channel"))
        .setChannelTypes(ChannelType.GuildText)
        .setMaxValues(1);
      components.push(new ActionRowBuilder().addComponents(select));
      components.push(new ActionRowBuilder().addComponents(skipButton));
    } else if (step === 4) {
      embed.setDescription(setupT(language, "general.wizard.interactive.step_staff"));
      const select = new RoleSelectMenuBuilder()
        .setCustomId("wiz_staff")
        .setPlaceholder(setupT(language, "general.wizard.interactive.placeholder_staff_role"))
        .setMaxValues(1);
      components.push(new ActionRowBuilder().addComponents(select));
      components.push(new ActionRowBuilder().addComponents(skipButton));
    } else if (step === 5) {
      embed.setDescription(setupT(language, "general.wizard.interactive.step_publish"));
      const btnYes = new ButtonBuilder()
        .setCustomId("wiz_publish_yes")
        .setLabel(setupT(language, "general.wizard.interactive.button_yes"))
        .setStyle(ButtonStyle.Success);
      const btnNo = new ButtonBuilder()
        .setCustomId("wiz_publish_no")
        .setLabel(setupT(language, "general.wizard.interactive.button_no"))
        .setStyle(ButtonStyle.Secondary);
      components.push(new ActionRowBuilder().addComponents(btnYes, btnNo));
    }

    return { embeds: [embed], components };
  };

  const supportsInteractiveFlow =
    typeof interaction.fetchReply === "function"
    || typeof interaction.reply === "function";

  if (!supportsInteractiveFlow) {
    wizardState.dashboard = interaction.options?.getChannel?.("dashboard") || null;
    wizardState.logs = interaction.options?.getChannel?.("logs") || null;
    wizardState.transcripts = interaction.options?.getChannel?.("transcripts") || null;
    wizardState.supportRole = interaction.options?.getRole?.("staff") || null;
    wizardState.adminRole = interaction.options?.getRole?.("admin") || null;
    wizardState.publishPanel = interaction.options?.getBoolean?.("publicar_panel") ?? false;
    await finishWizard(interaction, gid, language, wizardState, { showSavingState: false });
    return true;
  }

  const initialReply = await interaction.editReply(getStepContent(1));
  const message = await getInteractiveReply(initialReply, interaction);

  if (!message || typeof message.createMessageComponentCollector !== "function") {
    wizardState.dashboard = interaction.options?.getChannel?.("dashboard") || null;
    wizardState.logs = interaction.options?.getChannel?.("logs") || null;
    wizardState.transcripts = interaction.options?.getChannel?.("transcripts") || null;
    wizardState.supportRole = interaction.options?.getRole?.("staff") || null;
    wizardState.adminRole = interaction.options?.getRole?.("admin") || null;
    wizardState.publishPanel = interaction.options?.getBoolean?.("publicar_panel") ?? false;
    await finishWizard(interaction, gid, language, wizardState, { showSavingState: false });
    return true;
  }

  const collector = message.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 300000,
  });

  collector.on("collect", async (i) => {
    await i.deferUpdate();

    if (i.isChannelSelectMenu()) {
      if (currentStep === 1) wizardState.dashboard = i.channels.first();
      else if (currentStep === 2) wizardState.logs = i.channels.first();
      else if (currentStep === 3) wizardState.transcripts = i.channels.first();
    } else if (i.isRoleSelectMenu()) {
      if (currentStep === 4) wizardState.supportRole = i.roles.first();
    } else if (i.isButton()) {
      if (currentStep === 5) {
        wizardState.publishPanel = i.customId === "wiz_publish_yes";
      }
    }

    currentStep++;
    if (currentStep > 5) {
      collector.stop("completed");
    } else {
      await interaction.editReply(getStepContent(currentStep));
    }
  });

  collector.on("end", async (_collected, reason) => {
    if (reason !== "completed") {
      const errEmbed = new EmbedBuilder()
        .setColor(0xED4245)
        .setDescription(`❌ ${setupT(language, "general.wizard.interactive.timeout")}`);
      await interaction.editReply({ embeds: [errEmbed], components: [] }).catch(() => {});
      return;
    }

    await finishWizard(interaction, gid, language, wizardState);
  });

  return true;
}

module.exports = {
  register,
  execute,
};
