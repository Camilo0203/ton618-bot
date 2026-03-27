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
            .setTitle("Profile")
            .setDescription("Use `/perfil ver` to see your profile.\nUse `/perfil top` to view the quick ranking.")
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
              .setDescription("Only administrators can use quick configuration."),
          ],
          flags: 64,
        });
      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("Quick Configuration")
            .setDescription(
              "Use `/config center` to open the interactive control panel.\n" +
              "If you need something more advanced, use `/setup`."
            ),
        ],
        flags: 64,
      });
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle("Quick Help")
          .setDescription(
            "Key commands:\n" +
            "- `/menu`\n" +
            "- `/fun`\n" +
            "- `/ticket open`\n" +
            "- `/perfil ver`\n" +
            "- `/staff my-tickets` (staff)\n" +
            "- `/config status` (admin)\n" +
            "- `/help`"
          )
          .setTimestamp(),
      ],
      flags: 64,
    });
  },
};
