const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const createTicketButton = require("./createTicket");
const { settings } = require("../../utils/database");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

module.exports = {
  customId: "menu_*",

  async execute(interaction, client) {
    const guildSettings = interaction.guildId
      ? await settings.get(interaction.guildId).catch(() => null)
      : null;
    const language = resolveInteractionLanguage(interaction, guildSettings);

    if (interaction.customId === "menu_ticket") {
      return createTicketButton.execute(interaction, client);
    }

    if (interaction.customId === "menu_perfil") {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57f287)
            .setTitle(t(language, "menuActions.profile.title"))
            .setDescription(t(language, "menuActions.profile.description"))
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
              .setDescription(t(language, "menuActions.config.admin_only")),
          ],
          flags: 64,
        });
      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle(t(language, "menuActions.config.title"))
            .setDescription(t(language, "menuActions.config.description")),
        ],
        flags: 64,
      });
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle(t(language, "menuActions.help.title"))
          .setDescription(t(language, "menuActions.help.description"))
          .setTimestamp(),
      ],
      flags: 64,
    });
  },
};
