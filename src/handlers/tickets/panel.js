"use strict";

const {
  tickets,
  categories,
  buildTicketPanelPayload,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  settings,
} = require("./context");

async function sendPanel(channel, guild) {
  const openTicketCount = await tickets.countOpenByGuild(guild.id);
  const settingsRecord = await settings.get(guild.id).catch(() => null);
  const payload = buildTicketPanelPayload({
    guild,
    categories,
    openTicketCount,
    settingsRecord,
  });
  return channel.send(payload);
}

function buildModal(category) {
  const modal = new ModalBuilder()
    .setCustomId(`ticket_modal_${category.id}`)
    .setTitle(`${category.label}`.substring(0, 45));

  const questions = (category.questions || ["How can we help you?"]).slice(0, 5);
  questions.forEach((question, index) => {
    modal.addComponents(new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(`answer_${index}`)
        .setLabel(question.substring(0, 45))
        .setStyle(index === 0 ? TextInputStyle.Paragraph : TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(500)
        .setPlaceholder(index === 0 ? "Describe your issue with as much detail as possible..." : "Type your answer here...")
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
