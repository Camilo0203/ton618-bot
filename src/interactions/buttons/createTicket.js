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
              .setTitle("Access denied")
              .setDescription(
                `You cannot create tickets right now.\n**Reason:** ${banned.reason || "No reason provided"}`
              )
              .setFooter({ text: "If you think this is a mistake, contact an administrator." }),
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
              .setTitle("Ticket limit reached")
              .setDescription(
                `You already have **${openCount}/${maxTickets}** open tickets.\n\n` +
                `**Your active tickets:**\n${ticketList}\n\n` +
                "Close one of your current tickets before opening a new one."
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
          embeds: [E.errorEmbed("There are no ticket categories configured for this server.")],
          flags: 64,
        });
      }

      const selectMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ticket_category_select")
          .setPlaceholder("Select the ticket type...")
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
        .setTitle("Create a new ticket")
        .setDescription(
          "Select the category that best fits your request so the right team can help you faster.\n\n" +
          "Each category routes your request to the appropriate staff."
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
        embeds: [E.errorEmbed("There was an error while preparing the ticket form. Please try again later.")],
        flags: 64,
      });
    }
  },
};
