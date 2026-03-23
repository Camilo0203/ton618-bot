const {
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { settings, tickets } = require("../../utils/database");
const { checkStaff } = require("../../utils/commandUtils");
const E = require("../../utils/embeds");

module.exports = {
  customId: "ticket_close",
  async execute(interaction) {
    try {
      const ticket = await tickets.get(interaction.channel.id);
      if (!ticket) {
        return interaction.reply({
          embeds: [E.errorEmbed("Este canal no corresponde a un ticket valido.")],
          flags: 64,
        });
      }

      if (ticket.status === "closed") {
        return interaction.reply({
          embeds: [E.errorEmbed("Este ticket ya esta cerrado.")],
          flags: 64,
        });
      }

      const guildSettings = await settings.get(interaction.guild.id);
      const isStaff = checkStaff(interaction.member, guildSettings);
      const isCreator = interaction.user.id === ticket.user_id;

      if (!isStaff && !isCreator) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.ERROR)
              .setTitle("Permiso denegado")
              .setDescription("Solo el creador del ticket o el staff pueden cerrarlo.")
              .setFooter({ text: "TON618 Tickets" }),
          ],
          flags: 64,
        });
      }

      const modal = new ModalBuilder()
        .setCustomId("ticket_close_modal")
        .setTitle(`Cerrar ticket #${ticket.ticket_id}`);

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("close_reason")
            .setLabel("Motivo de cierre")
            .setPlaceholder("Ej: problema resuelto, solicitud completada...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(500)
        )
      );

      if (isStaff) {
        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("internal_notes")
              .setLabel("Notas internas")
              .setPlaceholder("Notas adicionales visibles solo para staff...")
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false)
              .setMaxLength(500)
          )
        );
      }

      return interaction.showModal(modal);
    } catch (error) {
      console.error("[TICKET CLOSE ERROR]", error);
      return interaction.reply({
        embeds: [E.errorEmbed("Ocurrio un error al abrir el formulario de cierre. Intentalo de nuevo mas tarde.")],
        flags: 64,
      });
    }
  },
};
