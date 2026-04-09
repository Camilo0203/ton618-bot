"use strict";

/**
 * Quick Start Button Handler
 * Handles interactions from quickstart command buttons
 */

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { settings } = require("../../utils/database");
const { resolveGuildLanguage, t } = require("../../utils/i18n");
const { COLORS, BRAND, ICONS } = require("../../utils/brand");

module.exports = {
  customId: "quickstart_",
  async execute(interaction) {
    const customId = interaction.customId;
    const guildId = interaction.guild?.id;
    
    if (!guildId) return;

    const s = await settings.get(guildId);
    const language = resolveGuildLanguage(s, interaction.guild?.preferredLocale || "en");

    if (customId === "quickstart_wizard") {
      // Show wizard guidance
      const embed = new EmbedBuilder()
        .setTitle(`${ICONS.ticket} ${language === "es" ? "Asistente de Configuración" : "Setup Wizard"}`)
        .setDescription(
          language === "es"
            ? `Para configurar tu sistema de tickets, usa el comando:\n\n**\`/setup wizard\`**\n\nEste asistente te guiará paso a paso para configurar:\n• Canal de dashboard\n• Canal de logs\n• Rol de soporte\n• Panel de tickets`
            : `To set up your ticket system, use the command:\n\n**\`/setup wizard\`**\n\nThis wizard will guide you step-by-step to configure:\n• Dashboard channel\n• Logs channel\n• Support role\n• Ticket panel`
        )
        .setColor(COLORS.INFO)
        .setFooter({ text: BRAND.FOOTER_TEXT });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel(language === "es" ? "Abrir Documentación" : "Open Documentation")
          .setURL(BRAND.WEBSITE)
          .setStyle(ButtonStyle.Link)
      );

      await interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    }
  },
};
