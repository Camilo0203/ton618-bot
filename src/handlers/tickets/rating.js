"use strict";

const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require("./context");
const { TICKET_FIELD_CATEGORY } = require("./shared");

async function sendRating(user, ticket, channel, staffId) {
  try {
    const embed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setTitle("Rate the support you received")
      .setDescription(
        `Hi <@${user.id}>, your ticket **#${ticket.ticket_id}** has been closed.\n\n` +
        "**Rating required:** you must rate this ticket before opening new tickets in the future.\n\n" +
        "Your feedback helps us improve the service and maintain a strong support experience."
      )
      .addFields(
        { name: "Staff member", value: `<@${staffId}>`, inline: true },
        { name: TICKET_FIELD_CATEGORY, value: ticket.category || "General", inline: true }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: "Your opinion matters to us",
        iconURL: user.client?.user?.displayAvatarURL({ dynamic: true }) || channel.client.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    const options = [
      {
        label: "1 star",
        value: "1",
        description: "The support did not meet my expectations",
      },
      {
        label: "2 stars",
        value: "2",
        description: "The support was acceptable but needs improvement",
      },
      {
        label: "3 stars",
        value: "3",
        description: "The support was solid and acceptable",
      },
      {
        label: "4 stars",
        value: "4",
        description: "The support was very professional",
      },
      {
        label: "5 stars",
        value: "5",
        description: "The support exceeded my expectations",
      }
    ];

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`ticket_rating_${ticket.ticket_id}_${channel.id}_${staffId}`)
        .setPlaceholder("Select a rating...")
        .addOptions(options)
    );

    await user.send({ embeds: [embed], components: [row] });
  } catch (error) {
    console.error("[RATING ERROR]", error.message);
  }
}

module.exports = { sendRating };
