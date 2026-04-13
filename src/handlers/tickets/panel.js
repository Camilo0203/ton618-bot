"use strict";

const {
  tickets,
  buildTicketPanelPayload,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  settings,
} = require("./context");
const { getCategoriesForGuild } = require("../../utils/categoryResolver");
const { t } = require("../../utils/i18n");

async function sendPanel(channel, guild) {
  const openTicketCount = await tickets.countOpenByGuild(guild.id);
  const settingsRecord = await settings.get(guild.id).catch(() => null);
  const categories = await getCategoriesForGuild(guild.id);
  const payload = buildTicketPanelPayload({
    guild,
    categories,
    openTicketCount,
    settingsRecord,
  });
  return channel.send(payload);
}

function buildModal(category, language = "en") {
  // Resolve label from labelKey if available, otherwise use label
  const label = category.labelKey 
    ? t(language, category.labelKey) 
    : category.label || category.id;
  
  const modal = new ModalBuilder()
    .setCustomId(`ticket_modal_${category.id}`)
    .setTitle(`${label}`.substring(0, 45));

  const defaultQuestions = [t(language, "ticket.modal.default_question")];
  const questions = (category.questions || defaultQuestions).slice(0, 5);

  // Translate questions if they are translation keys, otherwise use as-is
  const translatedQuestions = questions.map(q => {
    // Check if this looks like a translation key (contains dots and no spaces)
    if (q.includes(".") && !q.includes(" ")) {
      const translated = t(language, q);
      return translated !== q ? translated : q;
    }
    return q;
  });

  const placeholders = [
    t(language, "ticket.modal.placeholder_detailed"),
    t(language, "ticket.modal.placeholder_answer"),
    t(language, "ticket.modal.placeholder_answer"),
    t(language, "ticket.modal.placeholder_answer"),
    t(language, "ticket.modal.placeholder_answer"),
  ];

  translatedQuestions.forEach((question, index) => {
    modal.addComponents(new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(`answer_${index}`)
        .setLabel(question.substring(0, 45))
        .setStyle(index === 0 ? TextInputStyle.Paragraph : TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(500)
        .setPlaceholder(placeholders[index] || placeholders[1])
    ));
  });

  return modal;
}

function buildTicketButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket_close")
      .setLabel("Close")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("ticket_claim")
      .setLabel("Claim")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("ticket_transcript")
      .setLabel("Transcript")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("ticket_reopen")
      .setLabel("Reopen")
      .setStyle(ButtonStyle.Primary),
  );
}

module.exports = {
  sendPanel,
  buildModal,
  buildTicketButtons,
};
