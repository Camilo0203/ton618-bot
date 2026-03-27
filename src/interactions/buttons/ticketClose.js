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

module.exports = {
  customId: "ticket_close",
  async execute(interaction) {
    try {
      const ticket = await tickets.get(interaction.channel.id);
      if (!ticket) {
        return interaction.reply({
          embeds: [E.errorEmbed("This channel does not belong to a valid ticket.")],
          flags: 64,
        });
      }

      if (ticket.status === "closed") {
        return interaction.reply({
          embeds: [E.errorEmbed("This ticket is already closed.")],
          flags: 64,
        });
      }

      const guild = interaction.guild;
      const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
      if (!botMember) {
        return interaction.reply({
          embeds: [E.errorEmbed("I could not verify my permissions in this server.")],
          flags: 64,
        });
      }

      const channelPerms = interaction.channel.permissionsFor(botMember);
      if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({
          embeds: [E.errorEmbed("I need the `Manage Channels` permission to close tickets.")],
          flags: 64,
        });
      }

      const guildSettings = await settings.get(guild.id);
      const isStaff = checkStaff(interaction.member, guildSettings);

      if (!isStaff) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.ERROR)
              .setTitle("Permission denied")
              .setDescription("Only staff can close tickets.")
              .setFooter({ text: "TON618 Tickets" }),
          ],
          flags: 64,
        });
      }

      const modal = new ModalBuilder()
        .setCustomId("ticket_close_modal")
        .setTitle(`Close ticket #${ticket.ticket_id}`);

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("close_reason")
            .setLabel("Closing reason")
            .setPlaceholder("Example: resolved, duplicate, request completed...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(500)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("internal_notes")
            .setLabel("Internal notes")
            .setPlaceholder("Extra staff-only notes...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(500)
        )
      );

      return interaction.showModal(modal);
    } catch (error) {
      console.error("[TICKET CLOSE BUTTON ERROR]", error);

      if (interaction.replied || interaction.deferred) {
        return interaction.followUp({
          embeds: [E.errorEmbed("There was an error while opening the close form. Please try again.")],
          flags: 64,
        }).catch(() => {});
      }

      return interaction.reply({
        embeds: [E.errorEmbed("There was an error while opening the close form. Please try again.")],
        flags: 64,
      }).catch(() => {});
    }
  },
};
