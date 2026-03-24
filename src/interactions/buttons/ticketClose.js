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
          embeds: [E.errorEmbed("Este canal no corresponde a un ticket válido.")],
          flags: 64,
        });
      }

      if (ticket.status === "closed") {
        return interaction.reply({
          embeds: [E.errorEmbed("Este ticket ya está cerrado.")],
          flags: 64,
        });
      }

      const guild = interaction.guild;
      const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
      if (!botMember) {
        return interaction.reply({
          embeds: [E.errorEmbed("No pude verificar mis permisos en el servidor.")],
          flags: 64,
        });
      }

      const channelPerms = interaction.channel.permissionsFor(botMember);
      if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({
          embeds: [E.errorEmbed("No tengo el permiso 'Gestionar Canales' necesario para cerrar tickets.")],
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
              .setTitle("Permiso denegado")
              .setDescription("Solo el staff puede cerrar tickets.")
              .setFooter({ text: "TON618 Tickets" }),
          ],
          flags: 64,
        });
      }

      const modal = new ModalBuilder()
        .setCustomId("ticket_close_modal")
        .setTitle(`Cerrar ticket #${ticket.ticket_id}`);

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("close_reason")
            .setLabel("Motivo de cierre")
            .setPlaceholder("Ej: problema resuelto, solicitud completada...")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(500)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("internal_notes")
            .setLabel("Notas internas")
            .setPlaceholder("Notas adicionales visibles solo para staff...")
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
          embeds: [E.errorEmbed("Ocurrió un error al abrir el formulario de cierre. Inténtalo de nuevo.")],
          flags: 64,
        }).catch(() => {});
      }
      
      return interaction.reply({
        embeds: [E.errorEmbed("Ocurrió un error al abrir el formulario de cierre. Inténtalo de nuevo.")],
        flags: 64,
      }).catch(() => {});
    }
  },
};
