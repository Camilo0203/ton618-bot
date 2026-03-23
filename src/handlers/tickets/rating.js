"use strict";

const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require("./context");
const { TICKET_FIELD_CATEGORY } = require("./shared");

async function sendRating(user, ticket, channel, staffId) {
  try {
    // Crear un embed premium para la calificacion
    const embed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setTitle("Como calificarias la atencion recibida?")
      .setDescription(
        `Hola <@${user.id}>, tu ticket **#${ticket.ticket_id}** ha sido cerrado.\n\n` +
        "Nos encantaria conocer tu opinion sobre la atencion que recibiste. Tu feedback nos ayuda a mejorar nuestro servicio."
      )
      .addFields(
        { name: "Staff que te atendio", value: `<@${staffId}>`, inline: true },
        { name: TICKET_FIELD_CATEGORY, value: ticket.category || "General", inline: true }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter({ 
        text: "Tu opinion es importante para nosotros - Esta calificacion expira en 10 minutos",
        iconURL: user.client?.user?.displayAvatarURL({ dynamic: true }) || channel.client.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    // Opciones de calificacion mejoradas
    const options = [
      {
        label: "1 estrella",
        value: "1",
        description: "La atencion no cumplio mis expectativas",
      },
      {
        label: "2 estrellas",
        value: "2",
        description: "La atencion fue aceptable pero mejorable",
      },
      {
        label: "3 estrellas",
        value: "3",
        description: "La atencion fue correcta y adecuada",
      },
      {
        label: "4 estrellas",
        value: "4",
        description: "La atencion fue muy profesional",
      },
      {
        label: "5 estrellas",
        value: "5",
        description: "La atencion supero mis expectativas",
      }
    ];
    
    // Crear el menu de seleccion
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`ticket_rating_${ticket.ticket_id}_${channel.id}_${staffId}`)
        .setPlaceholder("Selecciona una calificacion...")
        .addOptions(options)
    );
    
    // Enviar el mensaje de calificacion
    await user.send({ embeds: [embed], components: [row] });
  } catch (error) {
    console.error("[RATING ERROR]", error.message);
  }
}

// -----------------------------------------------------
//   HELPERS
// -----------------------------------------------------

module.exports = { sendRating };
