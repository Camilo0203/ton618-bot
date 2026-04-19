/**
 * Example Premium Command - Advanced Analytics
 * 
 * This command demonstrates how to protect a feature with premium checks.
 * It requires the server to have an active premium subscription.
 */

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { requirePremium } = require('../../utils/premiumMiddleware');
const { resolveInteractionLanguage, t } = require('../../utils/i18n');
const logger = require('../../utils/structuredLogger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('analytics')
    .setDescription('View advanced server analytics (Premium feature)')
    .setDescriptionLocalizations({
      'es-ES': 'Ver analíticas avanzadas del servidor (Función Premium)',
      'en-US': 'View advanced server analytics (Premium feature)',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  category: 'admin',

  async execute(interaction) {
    // Check if guild has premium
    const hasPremium = await requirePremium(interaction);
    if (!hasPremium) {
      // requirePremium already sent the error message
      return;
    }

    await interaction.deferReply();

    const language = resolveInteractionLanguage(interaction);

    try {
      // Premium feature code here
      const embed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle(t(language, 'premium_test.title'))
        .setDescription(t(language, 'premium_test.description'))
        .addFields(
          {
            name: t(language, 'premium_test.fields.active_members'),
            value: '1,234',
            inline: true,
          },
          {
            name: t(language, 'premium_test.fields.messages_today'),
            value: '5,678',
            inline: true,
          },
          {
            name: t(language, 'premium_test.fields.growth_rate'),
            value: '+12.5%',
            inline: true,
          }
        )
        .setFooter({ text: t(language, 'premium_test.footer') })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });

    } catch (error) {
      logger.error('premium-test', 'Analytics command error', { error: error?.message || String(error) });
      await interaction.editReply({
        content: t(language, 'premium_test.error'),
        ephemeral: true,
      });
    }
  },
};
