const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const { blacklist, settings, tickets } = require("../../utils/database");
const E = require("../../utils/embeds");
const config = require("../../../config");
const { normalizeCategories } = require("../../domain/tickets/panelPayload");

module.exports = {
  customId: "create_ticket",
  async execute(interaction) {
    try {
      const guildSettings = await settings.get(interaction.guild.id);

      if (guildSettings.maintenance_mode) {
        return interaction.reply({
          embeds: [E.maintenanceEmbed(guildSettings.maintenance_reason)],
          flags: 64,
        });
      }

      const banned = await blacklist.check(interaction.user.id, interaction.guild.id);
      if (banned) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.ERROR)
              .setTitle("Acceso denegado")
              .setDescription(
                `No puedes crear tickets en este momento.\n**Motivo:** ${banned.reason || "Sin motivo especificado"}`
              )
              .setFooter({ text: "Si crees que esto es un error, contacta a un administrador." }),
          ],
          flags: 64,
        });
      }

      const maxTickets = guildSettings.max_tickets || 3;
      const openCount = await tickets.countByUser(interaction.user.id, interaction.guild.id);
      if (openCount >= maxTickets) {
        const openTickets = await tickets.getOpenReferencesByUser(interaction.user.id, interaction.guild.id, maxTickets);
        const ticketList = openTickets
          .map((ticket) => `- <#${ticket.channel_id}> (${ticket.category || "General"})`)
          .join("\n");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.WARNING)
              .setTitle("Limite de tickets alcanzado")
              .setDescription(
                `Ya tienes **${openCount}/${maxTickets}** tickets abiertos.\n\n` +
                `**Tus tickets activos:**\n${ticketList}\n\n` +
                "Cierra alguno de tus tickets actuales antes de abrir uno nuevo."
              )
              .setFooter({ text: "TON618 Tickets" })
              .setTimestamp(),
          ],
          flags: 64,
        });
      }

      const categoryOptions = normalizeCategories(config.categories).slice(0, 25);
      if (!categoryOptions.length) {
        return interaction.reply({
          embeds: [E.errorEmbed("No hay categorias configuradas para tickets en este servidor.")],
          flags: 64,
        });
      }

      const selectMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ticket_category_select")
          .setPlaceholder("Selecciona el tipo de ticket...")
          .addOptions(
            categoryOptions.map((category) => ({
              label: category.label,
              description: category.description,
              value: category.id,
              ...(category.emoji ? { emoji: category.emoji } : {}),
            }))
          )
      );

      const embed = new EmbedBuilder()
        .setColor(E.Colors.PRIMARY)
        .setTitle("Crear nuevo ticket")
        .setDescription(
          "Selecciona la categoria que mejor encaje con tu consulta para que podamos atenderte mas rapido.\n\n" +
          "Cada categoria dirige tu solicitud al equipo adecuado."
        )
        .setFooter({
          text: `${interaction.guild.name} | TON618 Tickets`,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        components: [selectMenu],
        flags: 64,
      });
    } catch (error) {
      console.error("[CREATE TICKET ERROR]", error);
      return interaction.reply({
        embeds: [E.errorEmbed("Ocurrio un error al preparar el formulario del ticket. Intentalo de nuevo mas tarde.")],
        flags: 64,
      });
    }
  },
};
