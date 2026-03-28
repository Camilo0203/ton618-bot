const { generateTranscript } = require("../../utils/transcript");
const { tickets, settings } = require("../../utils/database");
const { PermissionFlagsBits } = require("discord.js");
const E = require("../../utils/embeds");

module.exports = {
  customId: "ticket_transcript",
  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    try {
      const ticket = await tickets.get(interaction.channel.id);
      if (!ticket) {
        return interaction.editReply({
          content: "I could not generate the transcript because this channel is no longer registered as a ticket.",
        });
      }

      const guildSettings = await settings.get(interaction.guild.id);
      const isStaff = interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
        (guildSettings.support_role && interaction.member.roles.cache.has(guildSettings.support_role)) ||
        (guildSettings.admin_role && interaction.member.roles.cache.has(guildSettings.admin_role));

      if (!isStaff) {
        return interaction.editReply({
          embeds: [E.errorEmbed("Only staff can generate transcripts.")],
        });
      }

      const transcriptResult = await generateTranscript(interaction.channel, ticket, interaction.guild);
      if (!transcriptResult?.success || !transcriptResult.attachment) {
        return interaction.editReply({
          content: "I could not generate the ticket transcript right now.",
        });
      }

      return interaction.editReply({
        content: "Here is the manual transcript for this ticket:",
        files: [transcriptResult.attachment],
      });
    } catch (error) {
      console.error("[TICKET TRANSCRIPT ERROR]", error);
      return interaction.editReply({
        content: "There was an error while generating the transcript. Please try again later.",
      });
    }
  },
};
