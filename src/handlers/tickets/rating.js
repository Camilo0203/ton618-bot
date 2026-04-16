"use strict";

const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require("./context");
const { settings } = require("../../utils/database");
const { resolveGuildLanguage, t } = require("../../utils/i18n");
const logger = require("../../utils/structuredLogger");

function buildRatingOptions(language) {
  return [1, 2, 3, 4, 5].map((value) => ({
    label: t(language, `ticket.rating.prompt_option_${value}_label`),
    value: String(value),
    description: t(language, `ticket.rating.prompt_option_${value}_description`),
  }));
}

async function sendRating(user, ticket, channel, staffId) {
  try {
    const guildSettings = ticket?.guild_id
      ? await settings.get(ticket.guild_id).catch(() => null)
      : null;
    const language = resolveGuildLanguage(guildSettings, "en");
    const clientUser = user.client?.user || channel?.client?.user || null;

    const embed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setTitle(t(language, "ticket.rating.prompt_title"))
      .setDescription(
        t(language, "ticket.rating.prompt_description", {
          userId: user.id,
          ticketId: ticket.ticket_id,
        })
      )
      .addFields(
        {
          name: t(language, "ticket.rating.prompt_staff_label"),
          value: `<@${staffId}>`,
          inline: true,
        },
        {
          name: t(language, "common.labels.category"),
          value: ticket.category || t(language, "ticket.rating.prompt_category_fallback"),
          inline: true,
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: t(language, "ticket.rating.prompt_footer"),
        iconURL: clientUser?.displayAvatarURL({ dynamic: true }) || undefined,
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`ticket_rating_${ticket.ticket_id}_${ticket.channel_id}_${staffId}`)
        .setPlaceholder(t(language, "ticket.rating.prompt_placeholder"))
        .addOptions(buildRatingOptions(language))
    );

    await user.send({ embeds: [embed], components: [row] });
  } catch (error) {
    logger.warn("ticket.rating", "Failed to send rating DM", { userId: user?.id, error: error.message });
  }
}

module.exports = { sendRating };
