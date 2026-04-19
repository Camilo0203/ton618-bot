"use strict";

/**
 * Quick Start Command
 * Guided setup for new users - Shows step-by-step configuration wizard
 */

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { settings } = require("../../../utils/database");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");
const { COLORS, BRAND, ICONS, createInfoEmbed } = require("../../../utils/brand");

// Setup steps configuration - now using localization keys
const SETUP_STEPS = [
  { key: "language", command: "/setup language", emoji: "🌐", essential: true },
  { key: "tickets", command: "/setup wizard", emoji: "🎫", essential: true },
  { key: "welcome", command: "/setup welcome", emoji: "👋", essential: false },
  { key: "automod", command: "/setup automod bootstrap", emoji: "🛡️", essential: false },
  { key: "verification", command: "/setup verification", emoji: "✅", essential: false },
  { key: "logs", command: "/setup logs", emoji: "📊", essential: false },
];

/**
 * Check which setup steps are completed
 */
async function getSetupProgress(guildId, guild) {
  const s = await settings.get(guildId);
  const progress = {
    language: Boolean(s?.language_onboarding_completed || s?.bot_language),
    tickets: Boolean(s?.dashboard_channel && s?.panel_channel_id),
    welcome: Boolean(s?.welcome_channel),
    automod: Boolean(s?.automod_enabled),
    verification: Boolean(s?.verification_enabled || s?.verification_panel_channel_id),
    logs: Boolean(s?.log_channel),
  };

  const completed = Object.values(progress).filter(Boolean).length;
  const total = Object.keys(progress).length;
  const percentage = Math.round((completed / total) * 100);

  return { progress, completed, total, percentage };
}

/**
 * Build progress bar
 */
function buildProgressBar(percentage) {
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  return "█".repeat(filled) + "░".repeat(empty) + ` ${percentage}%`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quickstart")
    .setDescription("Get started with TON618 - Step-by-step setup guide")
    .setDescriptionLocalizations({
      "es-ES": "Comienza con TON618 - Guía de configuración paso a paso",
      "en-US": "Get started with TON618 - Step-by-step setup guide",
    }),

  async execute(interaction) {
    const guildId = interaction.guild?.id;
    if (!guildId) {
      return interaction.reply({
        content: t("es", "quickstart.guild_only"),
        flags: 64,
      });
    }

    const s = await settings.get(guildId);
    const language = resolveGuildLanguage(s, interaction.guild?.preferredLocale || "en");
    const { progress, completed, total, percentage } = await getSetupProgress(guildId, interaction.guild);

    // Build status list
    const statusLines = SETUP_STEPS.map((step, index) => {
      const stepKey = step.key;
      const isDone = progress[stepKey];
      const statusKey = isDone ? "quickstart.status_done" : "quickstart.status_pending";
      const status = isDone 
        ? `${ICONS.success} **${t(language, statusKey)}**` 
        : `${ICONS.arrow_right} ${t(language, statusKey)}`;
      const essential = step.essential ? ` ${ICONS.zap}` : "";
      const stepName = t(language, `quickstart.steps.${stepKey}.name`);
      return `${step.emoji} ${stepName}${essential}\n   ${status}: \`${step.command}\``;
    });

    const progressText = buildProgressBar(percentage);
    const stepsCompletedText = t(language, "quickstart.steps_completed", { completed, total });
    const headerText = `**${t(language, "quickstart.setup_progress")}**\n${progressText}\n\n${stepsCompletedText}`;

    const nextStepsText = `**${t(language, "quickstart.recommended_next")}**`;

    // Find first incomplete essential step
    const nextEssential = SETUP_STEPS.find((step) => {
      return step.essential && !progress[step.key];
    });

    const quickTip = t(language, "quickstart.tip", { command: nextEssential?.command || "/setup wizard" });

    const embed = new EmbedBuilder()
      .setTitle(`${ICONS.bot} ${BRAND.NAME} - ${t(language, "quickstart.title")}`)
      .setDescription(`${headerText}\n\n${nextStepsText}\n\n${statusLines.join("\n\n")}\n\n${quickTip}`)
      .setColor(COLORS.PRIMARY)
      .setFooter({ text: `${BRAND.NAME} • ${t(language, "quickstart.footer")}` })
      .setTimestamp();

    // Action buttons
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("quickstart_wizard")
        .setLabel(t(language, "quickstart.button_wizard"))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("quickstart_docs")
        .setLabel(t(language, "quickstart.button_docs"))
        .setStyle(ButtonStyle.Link)
        .setURL(BRAND.WEBSITE)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("quickstart_support")
        .setLabel(t(language, "quickstart.button_support"))
        .setStyle(ButtonStyle.Link)
        .setURL(BRAND.SUPPORT_URL)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row1, row2],
      flags: 64,
    });
  },
};
