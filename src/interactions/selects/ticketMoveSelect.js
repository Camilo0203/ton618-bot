const TH = require("../../handlers/ticketHandler");
const { settings, tickets } = require("../../utils/database");
const commandUtils = require("../../utils/commandUtils");
const E = require("../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

module.exports = {
  customId: "ticket_move_select",
  async execute(interaction) {
    try {
      const guildSettings = await settings.get(interaction.guild.id);
      const fallbackLanguage =
        guildSettings?.bot_language ||
        interaction?.locale ||
        interaction?.guildLocale ||
        interaction?.guild?.preferredLocale
          ? "en"
          : "es";
      const language = resolveInteractionLanguage(interaction, guildSettings, fallbackLanguage);
      const ticket = await tickets.get(interaction.channel.id);
      if (!ticket) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "ticket.command.not_ticket_channel"))],
          flags: 64,
        });
      }

      if (!commandUtils.checkStaff(interaction.member, guildSettings)) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "ticket.command.only_staff_move"))],
          flags: 64,
        });
      }

      const newCategoryId = interaction.values?.[0];
      if (!newCategoryId) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "ticket.picker.category_missing"))],
          flags: 64,
        });
      }

      return TH.moveTicket(interaction, newCategoryId);
    } catch (error) {
      console.error("[TICKET MOVE SELECT ERROR]", error);
      const guildSettings = await settings.get(interaction.guild.id).catch(() => null);
      const fallbackLanguage =
        guildSettings?.bot_language ||
        interaction?.locale ||
        interaction?.guildLocale ||
        interaction?.guild?.preferredLocale
          ? "en"
          : "es";
      const language = resolveInteractionLanguage(interaction, guildSettings, fallbackLanguage);
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "ticket.move_select.move_failed"))],
        flags: 64,
      }).catch(() => {});
    }
  },
};
