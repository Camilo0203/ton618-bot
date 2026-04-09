"use strict";

/**
 * Quick Start Command
 * Guided setup for new users - Shows step-by-step configuration wizard
 */

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { settings } = require("../../../utils/database");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");
const { COLORS, BRAND, ICONS, createInfoEmbed } = require("../../../utils/brand");

// Setup steps configuration
const SETUP_STEPS = {
  en: [
    {
      name: "Language",
      description: "Set your server language (English/Español)",
      command: "/setup language",
      emoji: "🌐",
      essential: true,
    },
    {
      name: "Ticket System",
      description: "Configure support tickets with the setup wizard",
      command: "/setup wizard",
      emoji: "🎫",
      essential: true,
    },
    {
      name: "Welcome Messages",
      description: "Set up automatic welcome messages",
      command: "/setup welcome",
      emoji: "👋",
      essential: false,
    },
    {
      name: "AutoMod Protection",
      description: "Enable automatic moderation and anti-spam",
      command: "/setup automod bootstrap",
      emoji: "🛡️",
      essential: false,
    },
    {
      name: "Verification System",
      description: "Add verification requirements for new members",
      command: "/setup verification",
      emoji: "✅",
      essential: false,
    },
    {
      name: "Logs & Monitoring",
      description: "Configure log channels for moderation events",
      command: "/setup logs",
      emoji: "📊",
      essential: false,
    },
  ],
  es: [
    {
      name: "Idioma",
      description: "Configura el idioma del servidor (English/Español)",
      command: "/setup language",
      emoji: "🌐",
      essential: true,
    },
    {
      name: "Sistema de Tickets",
      description: "Configura tickets de soporte con el asistente",
      command: "/setup wizard",
      emoji: "🎫",
      essential: true,
    },
    {
      name: "Mensajes de Bienvenida",
      description: "Activa mensajes automáticos de bienvenida",
      command: "/setup welcome",
      emoji: "👋",
      essential: false,
    },
    {
      name: "Protección AutoMod",
      description: "Habilita moderación automática y anti-spam",
      command: "/setup automod bootstrap",
      emoji: "🛡️",
      essential: false,
    },
    {
      name: "Sistema de Verificación",
      description: "Agrega requisitos de verificación para nuevos miembros",
      command: "/setup verification",
      emoji: "✅",
      essential: false,
    },
    {
      name: "Registros y Monitoreo",
      description: "Configura canales de logs para eventos de moderación",
      command: "/setup logs",
      emoji: "📊",
      essential: false,
    },
  ],
};

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
        content: "This command only works in servers.",
        flags: 64,
      });
    }

    const s = await settings.get(guildId);
    const language = resolveGuildLanguage(s, interaction.guild?.preferredLocale || "en");
    const steps = SETUP_STEPS[language] || SETUP_STEPS.en;
    const { progress, completed, total, percentage } = await getSetupProgress(guildId, interaction.guild);

    // Build status list
    const statusLines = steps.map((step, index) => {
      const stepKey = ["language", "tickets", "welcome", "automod", "verification", "logs"][index];
      const isDone = progress[stepKey];
      const status = isDone ? `${ICONS.success} **${language === "es" ? "Completado" : "Done"}**` : `${ICONS.arrow_right} ${language === "es" ? "Pendiente" : "Pending"}`;
      const essential = step.essential ? ` ${ICONS.zap}` : "";
      return `${step.emoji} ${step.name}${essential}\n   ${status}: \`${step.command}\``;
    });

    const progressText = buildProgressBar(percentage);
    const headerText = language === "es"
      ? `**Progreso de Configuración**\n${progressText}\n\n${completed} de ${total} pasos completados`
      : `**Setup Progress**\n${progressText}\n\n${completed} of ${total} steps completed`;

    const nextStepsText = language === "es"
      ? `**Próximos pasos recomendados:**`
      : `**Recommended next steps:**`;

    // Find first incomplete essential step
    const nextEssential = steps.find((step, index) => {
      const stepKey = ["language", "tickets", "welcome", "automod", "verification", "logs"][index];
      return step.essential && !progress[stepKey];
    });

    const quickTip = language === "es"
      ? `💡 **Consejo:** Usa \`${nextEssential?.command || "/setup wizard"}\` para continuar`
      : `💡 **Tip:** Use \`${nextEssential?.command || "/setup wizard"}\` to continue`;

    const embed = new EmbedBuilder()
      .setTitle(`${ICONS.bot} ${BRAND.NAME} - ${language === "es" ? "Guía Rápida" : "Quick Start"}`)
      .setDescription(`${headerText}\n\n${nextStepsText}\n\n${statusLines.join("\n\n")}\n\n${quickTip}`)
      .setColor(COLORS.PRIMARY)
      .setFooter({ text: `${BRAND.NAME} • ${language === "es" ? "Usa /help para más comandos" : "Use /help for more commands"}` })
      .setTimestamp();

    // Action buttons
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("quickstart_wizard")
        .setLabel(language === "es" ? "🚀 Iniciar Asistente" : "🚀 Start Wizard")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("quickstart_docs")
        .setLabel(language === "es" ? "📖 Documentación" : "📖 Documentation")
        .setStyle(ButtonStyle.Link)
        .setURL(BRAND.WEBSITE)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("quickstart_support")
        .setLabel(language === "es" ? "💬 Servidor de Soporte" : "💬 Support Server")
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
