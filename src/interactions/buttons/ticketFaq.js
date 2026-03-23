const { EmbedBuilder } = require("discord.js");
const E = require("../../utils/embeds");

module.exports = {
  customId: "ticket_faq",
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setAuthor({
          name: "Preguntas Frecuentes (FAQ)",
          iconURL: interaction.guild.iconURL({ dynamic: true }) || undefined,
        })
        .setDescription("Aquí tienes las respuestas a las dudas más comunes antes de abrir un ticket. ¡Revísalas! Podrías ahorrarte tiempo de espera.")
        .addFields(
          {
            name: "💳 ¿Cómo compro un producto/membresía?",
            value: "Dirígete a nuestra tienda oficial o abre un ticket en la categoría de **Ventas** para recibir asistencia paso a paso.",
          },
          {
            name: "🔄 ¿Cómo solicito un reembolso?",
            value: "Abre un ticket de **Soporte/Facturación** aportando tu comprobante de pago e ID de transacción. Nuestro equipo lo evaluará.",
          },
          {
            name: "🚨 Quiero reportar a un usuario",
            value: "Para que tu reporte sea válido, por favor adjunta capturas de pantalla o vídeos (sin recortar) y describe claramente la situación en un ticket de **Reportes**.",
          },
          {
            name: "🤝 Me gustaría hacer una alianza/partnership",
            value: "Las postulaciones para alianzas se manejan vía tickets de **Alianzas**. Asegúrate de cumplir con los requisitos mínimos publicados en la comunidad.",
          }
        )
        .setFooter({
          text: "¿No encuentras la respuesta? Selecciona una categoría del menú desplegable para hablar con nosotros.",
        })
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        /**
         * FLAGS: 64 ensures this is an EMPHEMERAL message
         * so it does not clutter the ticket panel channel.
         */
        flags: 64,
      });
    } catch (error) {
      console.error("[TICKET FAQ ERROR]", error);
      return interaction.reply({
        embeds: [E.errorEmbed("No pudimos cargar las Preguntas Frecuentes en este momento. Inténtalo más tarde.")],
        flags: 64,
      });
    }
  },
};
