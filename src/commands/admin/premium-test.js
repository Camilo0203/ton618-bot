/**
 * Example Premium Command - Advanced Analytics
 * 
 * This command demonstrates how to protect a feature with premium checks.
 * It requires the server to have an active premium subscription.
 */

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { requirePremium } = require('../../utils/premiumMiddleware');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('analytics')
    .setDescription('View advanced server analytics (Premium feature)')
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

    try {
      // Premium feature code here
      const embed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('📊 Advanced Server Analytics')
        .setDescription('This is a premium-only feature!')
        .addFields(
          {
            name: '👥 Active Members',
            value: '1,234',
            inline: true,
          },
          {
            name: '💬 Messages Today',
            value: '5,678',
            inline: true,
          },
          {
            name: '📈 Growth Rate',
            value: '+12.5%',
            inline: true,
          }
        )
        .setFooter({ text: 'TON618 Pro Analytics' })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });

    } catch (error) {
      console.error('Error in analytics command:', error);
      await interaction.editReply({
        content: '❌ An error occurred while fetching analytics.',
        ephemeral: true,
      });
    }
  },
};
