const { EmbedBuilder } = require("discord.js");
const { staffRatings, ticketEvents, tickets } = require("../../utils/database");

function buildReplyEmbed({ color, title, description }) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

module.exports = {
  customId: "ticket_rating_*",
  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    try {
      const parts = interaction.customId.split("_");
      if (parts.length < 5) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: "Could not save your rating",
              description: "The identifier for this rating prompt is invalid.",
            }),
          ],
        });
      }

      const ticketId = parts[2];
      const channelId = parts[3];
      const staffId = parts[4];
      const ratingValue = Number.parseInt(interaction.values[0], 10);

      if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: "Invalid rating",
              description: "Select a score between 1 and 5 stars.",
            }),
          ],
        });
      }

      const ticket = await tickets.get(channelId);
      if (!ticket || ticket.ticket_id !== ticketId) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: "Ticket not found",
              description: "I could not find the ticket linked to this rating prompt.",
            }),
          ],
        });
      }

      if (ticket.user_id !== interaction.user.id) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: "Rating unavailable",
              description: "Only the creator of this ticket can submit this rating.",
            }),
          ],
        });
      }

      if (ticket.rating) {
        await interaction.message.edit({ components: [] }).catch(() => {});
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0x5865F2,
              title: "Rating already recorded",
              description: `You already rated this ticket with **${ticket.rating} star(s)**.`,
            }),
          ],
        });
      }

      const storedTicket = await tickets.setRatingIfUnset(channelId, ratingValue);
      if (!storedTicket) {
        await interaction.message.edit({ components: [] }).catch(() => {});
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0x5865F2,
              title: "Rating already recorded",
              description: "This ticket was rated while your response was being processed.",
            }),
          ],
        });
      }

      await staffRatings.add(ticket.guild_id, staffId, ratingValue, ticketId, interaction.user.id);
      await ticketEvents.add({
        guild_id: ticket.guild_id,
        ticket_id: ticketId,
        channel_id: channelId,
        actor_id: interaction.user.id,
        actor_kind: "customer",
        actor_label: interaction.user.tag,
        event_type: "ticket_rated",
        visibility: "system",
        title: "Rating received",
        description: `${interaction.user.tag} rated ticket #${ticketId} with ${ratingValue}/5.`,
        metadata: {
          rating: ratingValue,
          staffId,
        },
      }).catch(() => {});
      await interaction.message.edit({ components: [] }).catch(() => {});

      return interaction.editReply({
        embeds: [
          buildReplyEmbed({
            color: 0xF1C40F,
            title: "Thanks for your rating",
            description:
              `You rated the support experience **${ratingValue} star(s)**.\n\n` +
              "Your feedback was recorded successfully and helps improve the service.",
          }),
        ],
      });
    } catch (error) {
      console.error("[TICKET RATING ERROR]", error);
      return interaction.editReply({
        embeds: [
          buildReplyEmbed({
            color: 0xED4245,
            title: "Could not save your rating",
            description: "An unexpected error occurred. Please try again later.",
          }),
        ],
      });
    }
  },
};
