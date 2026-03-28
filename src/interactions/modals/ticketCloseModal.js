const { EmbedBuilder } = require("discord.js");
const TH = require("../../handlers/ticketHandler");
const { notes, settings, tickets, ticketEvents } = require("../../utils/database");
const { checkStaff } = require("../../utils/commandUtils");
const E = require("../../utils/embeds");

module.exports = {
  customId: "ticket_close_modal",
  async execute(interaction) {
    try {
      const ticket = await tickets.get(interaction.channel.id);
      if (!ticket) {
        return interaction.reply({
          embeds: [E.errorEmbed("Este canal no corresponde a un ticket valido.")],
          flags: 64,
        });
      }

      if (ticket.status === "closed") {
        return interaction.reply({
          embeds: [E.errorEmbed("Este ticket ya esta cerrado.")],
          flags: 64,
        });
      }

      const guildSettings = await settings.get(interaction.guild.id);
      const isStaff = checkStaff(interaction.member, guildSettings);

      if (!isStaff) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.ERROR)
              .setTitle("Permiso denegado")
              .setDescription("Solo el staff puede cerrar tickets.")
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
          title: "Close note added",
          description: `${interaction.user.tag} added an internal close note before closing ticket #${ticket.ticket_id}.`,
          metadata: {
            notePreview: String(internalNotes).slice(0, 160),
          },
        }).catch(() => {});
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle("Procesando cierre")
            .setDescription("Iniciando el proceso de cierre y generacion de transcripcion..."),
        ],
        flags: 64,
      });

      try {
        await TH.closeTicket(interaction, reason || null);
      } catch (closeError) {
        console.error("[TICKET CLOSE ERROR]", closeError);
        try {
          await interaction.channel.send({
            embeds: [E.errorEmbed("No pude cerrar el ticket automaticamente. Intentalo de nuevo o avisa a un administrador.")],
          });
        } catch {
          // Ignore if the channel no longer exists.
        }
      }

    } catch (error) {
      console.error("[TICKET CLOSE MODAL ERROR]", error);
      return interaction.reply({
        embeds: [E.errorEmbed("Ocurrio un error al procesar el cierre del ticket. Intentalo de nuevo mas tarde.")],
        flags: 64,
      });
    }
  },
};
