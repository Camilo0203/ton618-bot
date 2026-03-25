const { tickets } = require("../../utils/database");
const { sendRating } = require("../../handlers/tickets/rating");
const E = require("../../utils/embeds");

module.exports = {
  customId: "resend_ratings_*",
  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    try {
      const userId = interaction.customId.split("_")[2];
      
      // Verificar que el usuario que hace clic es el mismo del botón
      if (interaction.user.id !== userId) {
        return interaction.editReply({
          embeds: [E.errorEmbed("Este botón solo puede ser usado por el usuario correspondiente.")],
        });
      }

      const guildId = interaction.guild.id;
      const unratedTickets = await tickets.getUnratedClosedTickets(userId, guildId);

      if (!unratedTickets || unratedTickets.length === 0) {
        return interaction.editReply({
          embeds: [
            E.successEmbed(
              "✅ **¡Genial!**\n\n" +
              "Ya no tienes tickets pendientes de calificación.\n" +
              "Puedes abrir un nuevo ticket cuando lo necesites."
            ),
          ],
        });
      }

      let successCount = 0;
      let failCount = 0;

      for (const ticket of unratedTickets) {
        try {
          const staffId = ticket.claimed_by || ticket.assigned_to || ticket.closed_by;
          if (!staffId) continue;

          const channel = await interaction.client.channels.fetch(ticket.channel_id).catch(() => null);
          await sendRating(interaction.user, ticket, channel, staffId);
          successCount++;
        } catch (error) {
          console.error(`[RESEND RATING ERROR] Ticket #${ticket.ticket_id}:`, error.message);
          failCount++;
        }
      }

      if (successCount > 0) {
        return interaction.editReply({
          embeds: [
            E.successEmbed(
              `✅ **Calificaciones reenviadas**\n\n` +
              `Se han reenviado **${successCount} calificación(es)** a tus mensajes directos.\n\n` +
              `📬 **Revisa tus DMs** para calificar los tickets pendientes.\n\n` +
              (failCount > 0 ? `⚠️ No se pudieron reenviar ${failCount} calificación(es).` : "")
            ),
          ],
        });
      } else {
        return interaction.editReply({
          embeds: [
            E.errorEmbed(
              "❌ **No se pudieron reenviar las calificaciones**\n\n" +
              "Asegúrate de tener los mensajes directos abiertos y vuelve a intentarlo."
            ),
          ],
        });
      }
    } catch (error) {
      console.error("[RESEND RATINGS ERROR]", error);
      return interaction.editReply({
        embeds: [
          E.errorEmbed(
            "Ocurrió un error al reenviar las calificaciones. Inténtalo de nuevo más tarde."
          ),
        ],
      });
    }
  },
};
