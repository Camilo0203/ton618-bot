const { EmbedBuilder } = require("discord.js");
const TH = require("../../handlers/ticketHandler");
const { notes, settings, tickets, ticketEvents } = require("../../utils/database");
const { checkStaff } = require("../../utils/commandUtils");
const E = require("../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

module.exports = {
  customId: "ticket_close_modal",
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

      const isStaff = checkStaff(interaction.member, guildSettings);

      if (!isStaff) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.ERROR)
              .setTitle(t(language, "ticket.close_button.permission_denied_title"))
              .setDescription(t(language, "ticket.close_button.permission_denied_description"))
              .setFooter({ text: "TON618 Tickets" }),
          ],
          flags: 64,
        });
      }

      const reason = interaction.fields.getTextInputValue("close_reason");
      let internalNotes = null;

      try {
        internalNotes = interaction.fields.getTextInputValue("internal_notes");
      } catch {
        internalNotes = null;
      }

      if (internalNotes) {
        await notes.add(ticket.ticket_id, interaction.user.id, internalNotes, interaction.guild.id);
        await ticketEvents.add({
          guild_id: interaction.guild.id,
          ticket_id: ticket.ticket_id,
          channel_id: interaction.channel.id,
          actor_id: interaction.user.id,
          actor_kind: "staff",
          actor_label: interaction.user.tag,
          event_type: "ticket_close_note_added",
          visibility: "internal",
          title: t(language, "ticket.close_button.close_note_event_title"),
          description: t(language, "ticket.close_button.close_note_event_description", {
            userTag: interaction.user.tag,
            ticketId: ticket.ticket_id,
          }),
          metadata: {
            notePreview: String(internalNotes).slice(0, 160),
          },
        }).catch(() => {});
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle(t(language, "ticket.close_button.processing_title"))
            .setDescription(t(language, "ticket.close_button.processing_description")),
        ],
        flags: 64,
      });

      try {
        await TH.closeTicket(interaction, reason || null);
      } catch (closeError) {
        console.error("[TICKET CLOSE ERROR]", closeError);
        try {
          await interaction.channel.send({
            embeds: [E.errorEmbed(t(language, "ticket.close_button.auto_close_failed"))],
          });
        } catch {
          // Ignore if the channel no longer exists.
        }
      }

    } catch (error) {
      console.error("[TICKET CLOSE MODAL ERROR]", error);
      const guildSettings = await settings.get(interaction.guild.id).catch(() => null);
      const language = resolveInteractionLanguage(interaction, guildSettings);
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "ticket.close_button.modal_error"))],
        flags: 64,
      });
    }
  },
};
