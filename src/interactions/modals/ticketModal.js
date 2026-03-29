const TH = require("../../handlers/ticketHandler");
const E = require("../../utils/embeds");
const { sanitizeTicketAnswers } = require("../../domain/tickets/formValidation");
const { getCategoryById } = require("../../utils/categoryResolver");
const { settings } = require("../../utils/database");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

module.exports = {
  customId: "ticket_modal_*", // El * indica que es un wildcard para cualquier ID que empiece con "ticket_modal_"
  async execute(interaction, client) {
    const catId = interaction.customId.replace("ticket_modal_", "");
    const category = await getCategoryById(interaction.guild.id, catId);
    const guildSettings = await settings.get(interaction.guild.id);
    const language = resolveInteractionLanguage(interaction, guildSettings);
    if (!category) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "ticket.modal.category_unavailable"))],
        flags: 64,
      }).catch(() => {});
    }
    
    const answers = [];
    for (let i = 0; i < 5; i += 1) {
      try {
        const value = interaction.fields.getTextInputValue("answer_" + i);
        if (value) answers.push(value);
      } catch {
        break;
      }
    }

    const sanitized = sanitizeTicketAnswers(answers, {
      minLength: 3,
      firstMinLength: 8,
      maxLength: 500,
    });
    if (!sanitized.valid) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "ticket.modal.first_answer_short"))],
        flags: 64,
      }).catch(() => {});
    }
    
    return TH.createTicket(interaction, catId, sanitized.answers);
  }
};
