const {
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
} = require("discord.js");
const { settings, tickets } = require("../../utils/database");
const { checkStaff } = require("../../utils/commandUtils");
const E = require("../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

module.exports = {
  customId: "ticket_close",
  async execute(interaction) {
    try {
      const guildSettings = await settings.get(interaction.guild.id);
      const language = resolveInteractionLanguage(interaction, guildSettings);
      const ticket = await tickets.get(interaction.channel.id);
      if (!ticket) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "ticket.command.not_ticket_channel"))],
          flags: 64,
        });
      }

      if (ticket.status === "closed") {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "ticket.close_button.already_closed"))],
          flags: 64,
        });
      }

      const guild = interaction.guild;
      const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
      if (!botMember) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "ticket.close_button.bot_member_missing"))],
          flags: 64,
        });
      }

      const channelPerms = interaction.channel.permissionsFor(botMember);
      if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "ticket.close_button.missing_manage_channels"))],
          flags: 64,
        });
      }

      const isStaff = checkStaff(interaction.member, guildSettings);

      if (!isStaff) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.ERROR)
              .setTitle(t(language, "ticket.close_button.permission_denied_title"))
              .setDescription(t(language, "ticket.close_button.permission_denied_description"))
              .setFooter({ text: t(language, "common.footer.tickets") }),
          ],
          flags: 64,
        });
      }

      const modal = new ModalBuilder()
        .setCustomId("ticket_close_modal")
        .setTitle(t(language, "ticket.close_button.modal_title", { ticketId: ticket.ticket_id }));

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("close_reason")
            .setLabel(t(language, "ticket.close_button.reason_label"))
            .setPlaceholder(t(language, "ticket.close_button.reason_placeholder"))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(500)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("internal_notes")
            .setLabel(t(language, "ticket.close_button.notes_label"))
            .setPlaceholder(t(language, "ticket.close_button.notes_placeholder"))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(500)
        )
      );

      return interaction.showModal(modal);
    } catch (error) {
      console.error("[TICKET CLOSE BUTTON ERROR]", error);
      const guildSettings = await settings.get(interaction.guild.id).catch(() => null);
      const language = resolveInteractionLanguage(interaction, guildSettings);

      if (interaction.replied || interaction.deferred) {
        return interaction.followUp({
          embeds: [E.errorEmbed(t(language, "ticket.close_button.open_form_error"))],
          flags: 64,
        }).catch(() => {});
      }

      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "ticket.close_button.open_form_error"))],
        flags: 64,
      }).catch(() => {});
    }
  },
};
