const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { premiumService } = require('../../services/premiumService');
const { createPremiumEmbed } = require('../../utils/premiumMiddleware');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('premium')
    .setDescription('Check premium status for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  category: 'public',

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const guildId = interaction.guildId;
      const premium = await premiumService.checkGuildPremium(guildId);
      
      const embed = createPremiumEmbed(guildId, premium);
      
      await interaction.editReply({
        embeds: [embed],
      });

    } catch (error) {
      console.error('Error in premium command:', error);
      await interaction.editReply({
        content: '❌ An error occurred while checking premium status.',
        ephemeral: true,
      });
    }
  },
};
