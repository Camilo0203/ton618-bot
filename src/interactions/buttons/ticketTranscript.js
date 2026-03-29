const { generateTranscript } = require("../../utils/transcript");
const { tickets, settings } = require("../../utils/database");
const { PermissionFlagsBits } = require("discord.js");
const E = require("../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

module.exports = {
  customId: "ticket_transcript",
  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    try {
      const guildSettings = await settings.get(interaction.guild.id);
      const language = resolveInteractionLanguage(interaction, guildSettings);
      const ticket = await tickets.get(interaction.channel.id);
      if (!ticket) {
        return interaction.editReply({
          content: t(language, "ticket.transcript_button.not_ticket"),
        });
      }

      const isStaff = interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
        (guildSettings.support_role && interaction.member.roles.cache.has(guildSettings.support_role)) ||
        (guildSettings.admin_role && interaction.member.roles.cache.has(guildSettings.admin_role));

      if (!isStaff) {
        return interaction.editReply({
          embeds: [E.errorEmbed(t(language, "ticket.command.only_staff_transcript"))],
        });
      }

      const transcriptResult = await generateTranscript(interaction.channel, ticket, interaction.guild);
      if (!transcriptResult?.success || !transcriptResult.attachment) {
        return interaction.editReply({
          content: t(language, "ticket.transcript_button.unavailable_now"),
        });
      }

      return interaction.editReply({
        content: t(language, "ticket.transcript_button.intro"),
        files: [transcriptResult.attachment],
      });
    } catch (error) {
      console.error("[TICKET TRANSCRIPT ERROR]", error);
      const guildSettings = await settings.get(interaction.guild.id).catch(() => null);
      const language = resolveInteractionLanguage(interaction, guildSettings);
      return interaction.editReply({
        content: t(language, "ticket.transcript_button.error"),
      });
    }
  },
};
