const { EmbedBuilder } = require("discord.js");
const { settings } = require("../../utils/database");
const E = require("../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

module.exports = {
  customId: "ticket_faq",
  async execute(interaction) {
    let language = "en";
    try {
      const guildSettings = interaction.guildId
        ? await settings.get(interaction.guildId).catch(() => null)
        : null;
      language = resolveInteractionLanguage(interaction, guildSettings);
      const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setAuthor({
          name: t(language, "ticket.faq.title"),
          iconURL: interaction.guild.iconURL({ dynamic: true }) || undefined,
        })
        .setDescription(t(language, "ticket.faq.description"))
        .addFields(
          {
            name: t(language, "ticket.faq.q1_question"),
            value: t(language, "ticket.faq.q1_answer"),
          },
          {
            name: t(language, "ticket.faq.q2_question"),
            value: t(language, "ticket.faq.q2_answer"),
          },
          {
            name: t(language, "ticket.faq.q3_question"),
            value: t(language, "ticket.faq.q3_answer"),
          },
          {
            name: t(language, "ticket.faq.q4_question"),
            value: t(language, "ticket.faq.q4_answer"),
          }
        )
        .setFooter({
          text: t(language, "ticket.faq.footer"),
        })
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        flags: 64,
      });
    } catch (error) {
      console.error("[TICKET FAQ ERROR]", error);
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "ticket.faq.load_failed"))],
        flags: 64,
      });
    }
  },
};
