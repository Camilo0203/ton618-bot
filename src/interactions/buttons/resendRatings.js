const { settings, tickets } = require("../../utils/database");
const { sendRating } = require("../../handlers/tickets/rating");
const E = require("../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");
const logger = require("../../utils/structuredLogger");

module.exports = {
  customId: "resend_ratings_*",
  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });
    let language = "en";

    try {
      const userId = interaction.customId.split("_")[2];
      const guildSettings = interaction.guildId
        ? await settings.get(interaction.guildId).catch(() => null)
        : null;
      language = resolveInteractionLanguage(interaction, guildSettings);

      if (interaction.user.id !== userId) {
        return interaction.editReply({
          embeds: [E.errorEmbed(t(language, "ticket.rating.resend_wrong_user"))],
        });
      }

      const guildId = interaction.guild.id;
      const unratedTickets = await tickets.getUnratedClosedTickets(userId, guildId);

      if (!unratedTickets || unratedTickets.length === 0) {
        return interaction.editReply({
          embeds: [
            E.successEmbed(t(language, "ticket.rating.resend_clear")),
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
          logger.error('resendRatings', `Error resending rating for ticket #${ticket.ticket_id}`, { error: error?.message || String(error) });
          failCount++;
        }
      }

      if (successCount > 0) {
        return interaction.editReply({
          embeds: [
            E.successEmbed(
              t(language, "ticket.rating.resend_sent", {
                successCount,
                warning:
                  failCount > 0
                    ? `\n\n${t(language, "ticket.rating.resend_partial_warning", { failCount })}`
                    : "",
              })
            ),
          ],
        });
      }

      return interaction.editReply({
        embeds: [
          E.errorEmbed(t(language, "ticket.rating.resend_failed")),
        ],
      });
    } catch (error) {
      logger.error('resendRatings', 'Error resending ratings', { error: error?.message || String(error) });
      return interaction.editReply({
        embeds: [
          E.errorEmbed(t(language, "ticket.rating.resend_error")),
        ],
      });
    }
  },
};
