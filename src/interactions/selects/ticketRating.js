const { EmbedBuilder } = require("discord.js");
const { staffRatings, ticketEvents, tickets } = require("../../utils/database");

function buildReplyEmbed({ color, title, description }) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

module.exports = {
  customId: "ticket_rating_*",
  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    try {
      const parts = interaction.customId.split("_");
      if (parts.length < 5) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: "No pude registrar tu calificacion",
              description: "El identificador de esta encuesta no es valido.",
            }),
          ],
        });
      }

      const ticketId = parts[2];
      const channelId = parts[3];
      const staffId = parts[4];
      const ratingValue = Number.parseInt(interaction.values[0], 10);

      if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: "Calificacion invalida",
              description: "Selecciona una puntuacion entre 1 y 5 estrellas.",
            }),
          ],
        });
      }

      const ticket = await tickets.get(channelId);
      if (!ticket || ticket.ticket_id !== ticketId) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: "Ticket no encontrado",
              description: "No pude localizar el ticket asociado a esta calificacion.",
            }),
          ],
        });
      }

      if (ticket.user_id !== interaction.user.id) {
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0xED4245,
              title: "Encuesta no disponible",
              description: "Esta calificacion solo puede ser enviada por el creador del ticket.",
            }),
          ],
        });
      }

      if (ticket.rating) {
        await interaction.message.edit({ components: [] }).catch(() => {});
        return interaction.editReply({
          embeds: [
            buildReplyEmbed({
              color: 0x5865F2,
              title: "Calificacion ya registrada",
              description: `Ya habias valorado este ticket con **${ticket.rating} estrella(s)**.`,
            }),
          ],
        });
      }

      await tickets.update(channelId, { rating: ratingValue });
      await staffRatings.add(ticket.guild_id, staffId, ratingValue, ticketId, interaction.user.id);
      await ticketEvents.add({
        guild_id: ticket.guild_id,
        ticket_id: ticketId,
        channel_id: channelId,
        actor_id: interaction.user.id,
        actor_kind: "customer",
        actor_label: interaction.user.tag,
        event_type: "ticket_rated",
        visibility: "system",
        title: "Calificacion recibida",
        description: `${interaction.user.tag} califico el ticket #${ticketId} con ${ratingValue}/5.`,
        metadata: {
          rating: ratingValue,
          staffId,
        },
      }).catch(() => {});
      await interaction.message.edit({ components: [] }).catch(() => {});

      return interaction.editReply({
        embeds: [
          buildReplyEmbed({
            color: 0xF1C40F,
            title: "Gracias por tu calificacion",
            description:
              `Has calificado la atencion con **${ratingValue} estrella(s)**.\n\n` +
              "Tu opinion se registro correctamente y ayuda a mejorar el servicio.",
          }),
        ],
      });
    } catch (error) {
      console.error("[TICKET RATING ERROR]", error);
      return interaction.editReply({
        embeds: [
          buildReplyEmbed({
            color: 0xED4245,
            title: "No pude registrar tu calificacion",
            description: "Ocurrio un error inesperado. Intentalo de nuevo mas tarde.",
          }),
        ],
      });
    }
  },
};
