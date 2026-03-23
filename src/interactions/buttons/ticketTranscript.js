const { generateTranscript } = require("../../utils/transcript");
const { tickets } = require("../../utils/database");

module.exports = {
  customId: "ticket_transcript",
  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    try {
      const ticket = await tickets.get(interaction.channel.id);
      if (!ticket) {
        return interaction.editReply({
          content: "No pude generar la transcripcion porque este canal ya no esta registrado como ticket.",
        });
      }

      const { attachment } = await generateTranscript(interaction.channel, ticket, interaction.guild);
      if (!attachment) {
        return interaction.editReply({
          content: "No pude generar la transcripcion del ticket en este momento.",
        });
      }

      return interaction.editReply({
        content: "Aqui tienes la transcripcion manual del ticket:",
        files: [attachment],
      });
    } catch (error) {
      console.error("[TICKET TRANSCRIPT ERROR]", error);
      return interaction.editReply({
        content: "Ocurrio un error al generar la transcripcion. Intentalo de nuevo mas tarde.",
      });
    }
  },
};
