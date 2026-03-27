const { tickets } = require("../../utils/database");
const { sendRating } = require("../../handlers/tickets/rating");
const E = require("../../utils/embeds");

module.exports = {
  customId: "resend_ratings_*",
  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    try {
      const userId = interaction.customId.split("_")[2];

      if (interaction.user.id !== userId) {
        return interaction.editReply({
          embeds: [E.errorEmbed("This button can only be used by the matching user.")],
        });
      }

      const guildId = interaction.guild.id;
      const unratedTickets = await tickets.getUnratedClosedTickets(userId, guildId);

      if (!unratedTickets || unratedTickets.length === 0) {
        return interaction.editReply({
          embeds: [
            E.successEmbed(
              "**All clear!**\n\n" +
              "You no longer have any pending ticket ratings.\n" +
              "You can open a new ticket whenever you need one."
            ),
          ],
        });
      }

      let successCount = 0;
      let failCount = 0;

      for (const ticket of unratedTickets) {
        try {
          const staffId = ticket.claimed_by || ticket.assigned_to || ticket.closed_by;
          if (!staffId) continue;

          const channel = await interaction.client.channels.fetch(ticket.channel_id).catch(() => null);
          await sendRating(interaction.user, ticket, channel, staffId);
          successCount++;
        } catch (error) {
          console.error(`[RESEND RATING ERROR] Ticket #${ticket.ticket_id}:`, error.message);
          failCount++;
        }
      }

      if (successCount > 0) {
        return interaction.editReply({
          embeds: [
            E.successEmbed(
              `**Rating prompts resent**\n\n` +
              `We resent **${successCount}** rating prompt(s) to your DMs.\n\n` +
              `**Check your DMs** to rate the pending tickets.\n\n` +
              (failCount > 0 ? `Warning: ${failCount} prompt(s) could not be resent.` : "")
            ),
          ],
        });
      }

      return interaction.editReply({
        embeds: [
          E.errorEmbed(
            "**Could not resend the rating prompts**\n\n" +
            "Make sure your DMs are open and try again."
          ),
        ],
      });
    } catch (error) {
      console.error("[RESEND RATINGS ERROR]", error);
      return interaction.editReply({
        embeds: [
          E.errorEmbed("There was an error while resending the rating prompts. Please try again later."),
        ],
      });
    }
  },
};
