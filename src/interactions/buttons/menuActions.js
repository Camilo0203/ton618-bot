const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const createTicketButton = require("./createTicket");

module.exports = {
  customId: "menu_*",

  async execute(interaction, client) {
    if (interaction.customId === "menu_ticket") {
      return createTicketButton.execute(interaction, client);
    }

    if (interaction.customId === "menu_perfil") {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57f287)
            .setTitle("Perfil")
            .setDescription("Usa `/perfil ver` para ver tu perfil.\nUsa `/perfil top` para ver el ranking rapido.")
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (interaction.customId === "menu_config") {
      const isAdmin = interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);
      if (!isAdmin) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xed4245)
              .setDescription("Solo administradores pueden usar la configuracion rapida."),
          ],
          flags: 64,
        });
      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("Configuracion Rapida")
            .setDescription(
              "Usa `/config centro` para abrir el panel interactivo.\n" +
              "Si necesitas algo mas avanzado, usa `/setup`."
            ),
        ],
        flags: 64,
      });
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle("Ayuda Rapida")
          .setDescription(
            "Comandos clave:\n" +
            "- `/menu`\n" +
            "- `/fun`\n" +
            "- `/ticket open`\n" +
            "- `/perfil ver`\n" +
            "- `/staff mytickets` (staff)\n" +
            "- `/config estado` (admin)\n" +
            "- `/help`"
          )
          .setTimestamp(),
      ],
      flags: 64,
    });
  },
};
