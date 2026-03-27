const { EmbedBuilder } = require("discord.js");
const E = require("../../utils/embeds");

module.exports = {
  customId: "ticket_faq",
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setAuthor({
          name: "Frequently Asked Questions",
          iconURL: interaction.guild.iconURL({ dynamic: true }) || undefined,
        })
        .setDescription(
          "Here are the most common answers people need before opening a ticket. A quick check here can save you waiting time."
        )
        .addFields(
          {
            name: "How do I buy a product or membership?",
            value: "Go to our official store, or open a ticket in the **Sales** category if you need step-by-step help.",
          },
          {
            name: "How do I request a refund?",
            value: "Open a **Support / Billing** ticket and include your payment receipt plus transaction ID so the team can review it.",
          },
          {
            name: "I want to report a user",
            value: "For a valid report, include clear screenshots or videos and explain the situation in a **Reports** ticket.",
          },
          {
            name: "I want to apply for a partnership",
            value: "Partnership requests are handled through **Partnership** tickets. Make sure you meet the minimum requirements first.",
          }
        )
        .setFooter({
          text: "Still need help? Pick a category from the dropdown menu to open a ticket.",
        })
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        flags: 64,
      });
    } catch (error) {
      console.error("[TICKET FAQ ERROR]", error);
      return interaction.reply({
        embeds: [E.errorEmbed("We could not load the FAQ right now. Please try again later.")],
        flags: 64,
      });
    }
  },
};
