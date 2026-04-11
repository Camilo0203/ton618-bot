"use strict";

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { sendGuildLanguageOnboarding } = require("../../utils/guildOnboarding");
const { settings } = require("../../utils/database");
const { resolveGuildLanguage, t } = require("../../utils/i18n");
const { logCommandExecution } = require("../../utils/auditLogger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send-tutorial")
    .setDescription("[OWNER] Re-send the language onboarding tutorial to a server")
    .addStringOption((opt) =>
      opt
        .setName("guild_id")
        .setDescription("Guild ID to send tutorial to (defaults to current server)")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    // Owner-only check
    const ownerId = process.env.OWNER_ID || process.env.DISCORD_OWNER_ID;
    if (interaction.user.id !== ownerId) {
      return interaction.reply({
        content: "❌ This command is only for the bot owner.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.options.getString("guild_id") || interaction.guildId;
    const guild = interaction.client.guilds.cache.get(guildId);

    if (!guild) {
      return interaction.editReply({
        content: `❌ Guild not found. The bot is not in guild \`${guildId}\`.`,
      });
    }

    // Reset the onboarding flag so it can be sent again
    const currentSettings = await settings.get(guildId);
    if (currentSettings?.language_onboarding_completed) {
      await settings.update(guildId, {
        language_onboarding_completed: false,
      });
    }

    // Send the onboarding
    const result = await sendGuildLanguageOnboarding(guild);

    if (result.delivered) {
      const language = resolveGuildLanguage(currentSettings);
      logCommandExecution(interaction, "send-tutorial", { guildId, delivered: true });
      
      return interaction.editReply({
        content: `✅ Tutorial sent successfully to **${guild.name}**!\n` +
          `📍 Delivery: ${result.delivery}${result.channelId ? ` (Channel: <#${result.channelId}>)` : ""}${result.userId ? ` (DM to: <@${result.userId}>)` : ""}`,
      });
    } else if (result.skipped) {
      return interaction.editReply({
        content: `ℹ️ Tutorial was already completed for **${guild.name}**. Reset and try again.`,
      });
    } else {
      return interaction.editReply({
        content: `❌ Failed to send tutorial to **${guild.name}**.\n` +
          `The bot may lack permissions or there are no writable channels.`,
      });
    }
  },
};
