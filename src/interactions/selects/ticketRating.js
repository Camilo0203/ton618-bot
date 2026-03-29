const { EmbedBuilder } = require("discord.js");
const { settings, staffRatings, ticketEvents, tickets } = require("../../utils/database");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

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
      const guildId = interaction.guild?.id || interaction.guildId || null;
      const guildSettings = guildId ? await settings.get(guildId).catch(() => null) : null;
      const language = resolveInteractionLanguage(interaction, guildSettings);
      const parts = interaction.customId.split("_");
      if (parts.length < 5) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: t(language, "ticket.rating.invalid_identifier_title"),
              description: t(language, "ticket.rating.invalid_identifier_description"),
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
              title: t(language, "ticket.rating.invalid_value_title"),
              description: t(language, "ticket.rating.invalid_value_description"),
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
              title: t(language, "ticket.rating.not_found_title"),
              description: t(language, "ticket.rating.not_found_description"),
            }),
          ],
        });
      }

      if (ticket.user_id !== interaction.user.id) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: t(language, "ticket.rating.unavailable_title"),
              description: t(language, "ticket.rating.unavailable_description"),
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
              title: t(language, "ticket.rating.already_recorded_title"),
              description: t(language, "ticket.rating.already_recorded_description", { rating: ticket.rating }),
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
              title: t(language, "ticket.rating.already_recorded_title"),
              description: t(language, "ticket.rating.already_recorded_processing"),
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
        title: t(language, "ticket.rating.event_title"),
        description: t(language, "ticket.rating.event_description", {
          userTag: interaction.user.tag,
          ticketId,
          rating: ratingValue,
        }),
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
            title: t(language, "ticket.rating.thanks_title"),
            description: t(language, "ticket.rating.thanks_description", { rating: ratingValue }),
          }),
        ],
      });
    } catch (error) {
      console.error("[TICKET RATING ERROR]", error);
      const guildId = interaction.guild?.id || interaction.guildId || null;
      const guildSettings = guildId ? await settings.get(guildId).catch(() => null) : null;
      const language = resolveInteractionLanguage(interaction, guildSettings);
      return interaction.editReply({
        embeds: [
          buildReplyEmbed({
            color: 0xED4245,
            title: t(language, "ticket.rating.save_failed_title"),
            description: t(language, "ticket.rating.save_failed_description"),
          }),
        ],
      });
    }
  },
};
