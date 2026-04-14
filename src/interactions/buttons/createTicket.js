const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const { blacklist, settings, tickets } = require("../../utils/database");
const E = require("../../utils/embeds");
const { getCategoriesForGuild } = require("../../utils/categoryResolver");
const { normalizeCategories } = require("../../domain/tickets/panelPayload");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

module.exports = {
  customId: "create_ticket",
  async execute(interaction) {
    try {
      const guildSettings = await settings.get(interaction.guild.id);
      const language = resolveInteractionLanguage(interaction, guildSettings);

      if (guildSettings.maintenance_mode) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.WARNING)
              .setTitle(t(language, "ticket.maintenance.title"))
              .setDescription(t(language, "ticket.maintenance.description", {
                reason: guildSettings.maintenance_reason || t(language, "ticket.maintenance.scheduled"),
              })),
          ],
          flags: 64,
        });
      }

      const banned = await blacklist.check(interaction.user.id, interaction.guild.id);
      if (banned) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.ERROR)
              .setTitle(t(language, "ticket.picker.access_denied_title"))
              .setDescription(t(language, "ticket.picker.access_denied_description", {
                reason: banned.reason || t(language, "common.value.none"),
              }))
              .setFooter({ text: t(language, "ticket.picker.access_denied_footer") }),
          ],
          flags: 64,
        });
      }

      const maxTickets = guildSettings.max_tickets || 3;
      const openCount = await tickets.countByUser(interaction.user.id, interaction.guild.id);
      if (openCount >= maxTickets) {
        const openTickets = await tickets.getOpenReferencesByUser(interaction.user.id, interaction.guild.id, maxTickets);
        const ticketList = openTickets
          .map((ticket) => `- <#${ticket.channel_id}> (${ticket.category || t(language, "ticket.create_flow.general_category")})`)
          .join("\n");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.WARNING)
              .setTitle(t(language, "ticket.picker.limit_reached_title"))
              .setDescription(t(language, "ticket.picker.limit_reached_description", {
                openCount,
                maxTickets,
                ticketList,
              }))
              .setFooter({ text: t(language, "ticket.footer") })
              .setTimestamp(),
          ],
          flags: 64,
        });
      }

      const categoryOptions = normalizeCategories(await getCategoriesForGuild(interaction.guild.id), language).slice(0, 25);
      if (!categoryOptions.length) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "ticket.picker.no_categories"))],
          flags: 64,
        });
      }

      const selectMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ticket_category_select")
          .setPlaceholder(t(language, "ticket.picker.select_placeholder"))
          .addOptions(
            categoryOptions.map((category) => ({
              label: category.labelKey ? t(language, category.labelKey) : category.label,
              description: category.descriptionKey ? t(language, category.descriptionKey) : category.description,
              value: category.id,
              ...(category.emoji ? { emoji: category.emoji } : {}),
            }))
          )
      );

      const embed = new EmbedBuilder()
        .setColor(E.Colors.PRIMARY)
        .setTitle(t(language, "ticket.picker.select_title"))
        .setDescription(t(language, "ticket.picker.select_description"))
        .setFooter({
          text: `${interaction.guild.name} | ${t(language, "ticket.footer")}`,
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
      const language = resolveInteractionLanguage(interaction);
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "ticket.picker.processing_error"))],
        flags: 64,
      });
    }
  },
};
