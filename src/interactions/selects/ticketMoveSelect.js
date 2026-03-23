const TH = require("../../handlers/ticketHandler");
const { settings, tickets } = require("../../utils/database");
const commandUtils = require("../../utils/commandUtils");
const E = require("../../utils/embeds");

module.exports = {
  customId: "ticket_move_select",
  async execute(interaction) {
    try {
      const ticket = await tickets.get(interaction.channel.id);
      if (!ticket) {
        return interaction.reply({
          embeds: [E.errorEmbed("Este canal no corresponde a un ticket valido.")],
          flags: 64,
        });
      }

      const guildSettings = await settings.get(interaction.guild.id);
      if (!commandUtils.checkStaff(interaction.member, guildSettings)) {
        return interaction.reply({
          embeds: [E.errorEmbed("Solo el staff puede mover tickets.")],
          flags: 64,
        });
      }

      const newCategoryId = interaction.values?.[0];
      if (!newCategoryId) {
        return interaction.reply({
          embeds: [E.errorEmbed("Selecciona una categoria valida para mover el ticket.")],
          flags: 64,
        });
      }

      return TH.moveTicket(interaction, newCategoryId);
    } catch (error) {
      console.error("[TICKET MOVE SELECT ERROR]", error);
      return interaction.reply({
        embeds: [E.errorEmbed("No pude mover el ticket en este momento. Intentalo de nuevo mas tarde.")],
        flags: 64,
      }).catch(() => {});
    }
  },
};
