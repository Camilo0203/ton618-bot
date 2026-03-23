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
} = require("./context");

async function sendPanel(channel, guild) {
  const openTicketCount = await tickets.countOpenByGuild(guild.id);
  const payload = buildTicketPanelPayload({
    guild,
    categories,
    openTicketCount,
  });
  return channel.send(payload);
}

function buildModal(category) {
  const modal = new ModalBuilder()
    .setCustomId(`ticket_modal_${category.id}`)
    .setTitle(`${category.label}`.substring(0, 45));

  // Anadir preguntas al modal (maximo 5)
  const questions = (category.questions || ["En que podemos ayudarte?"]).slice(0, 5);
  questions.forEach((q, i) => {
    modal.addComponents(new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(`answer_${i}`)
        .setLabel(q.substring(0, 45))
        .setStyle(i === 0 ? TextInputStyle.Paragraph : TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(500)
        .setPlaceholder(i === 0 ? "Describe tu problema con el mayor detalle posible..." : "Tu respuesta aqui...")
    ));
  });
  
  return modal;
}

function buildTicketButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket_close")
      .setLabel("Cerrar")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("ticket_claim")
      .setLabel("Reclamar")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("ticket_transcript")
      .setLabel("Transcripcion")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("ticket_reopen")
      .setLabel("Reabrir")
      .setStyle(ButtonStyle.Primary),
  );
}

module.exports = {
  sendPanel,
  buildModal,
  buildTicketButtons,
};
