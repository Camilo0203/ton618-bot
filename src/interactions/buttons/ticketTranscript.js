const { generateTranscript } = require("../../utils/transcript");
const { tickets, settings } = require("../../utils/database");
const { PermissionFlagsBits } = require("discord.js");
const E = require("../../utils/embeds");

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

      const guildSettings = await settings.get(interaction.guild.id);
      const isStaff = interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
        (guildSettings.support_role && interaction.member.roles.cache.has(guildSettings.support_role)) ||
        (guildSettings.admin_role && interaction.member.roles.cache.has(guildSettings.admin_role));

      if (!isStaff) {
        return interaction.editReply({
          embeds: [E.errorEmbed("Solo el staff puede generar transcripciones.")],
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
