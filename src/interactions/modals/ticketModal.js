const TH = require("../../handlers/ticketHandler");
const config = require("../../../config");
const E = require("../../utils/embeds");
const { sanitizeTicketAnswers } = require("../../domain/tickets/formValidation");

module.exports = {
  customId: "ticket_modal_*", // El * indica que es un wildcard para cualquier ID que empiece con "ticket_modal_"
  async execute(interaction, client) {
    const catId = interaction.customId.replace("ticket_modal_", "");
    const category = config.categories.find(c => c.id === catId);
    
    const answers = [];
    (category?.questions || []).slice(0, 5).forEach((_, i) => {
      const v = interaction.fields.getTextInputValue("answer_" + i);
      if (v) answers.push(v);
    });

    const sanitized = sanitizeTicketAnswers(answers, {
      minLength: 3,
      firstMinLength: 8,
      maxLength: 500,
    });
    if (!sanitized.valid) {
      return interaction.reply({
        embeds: [E.errorEmbed("Tu primera respuesta es muy corta. Agrega mas contexto para crear el ticket.")],
        flags: 64,
      }).catch(() => {});
    }
    
    return TH.createTicket(interaction, catId, sanitized.answers);
  }
};
