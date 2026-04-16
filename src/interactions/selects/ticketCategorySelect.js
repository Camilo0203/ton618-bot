const {
  MessageFlags,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const TH = require("../../handlers/ticketHandler");
const { settings, blacklist, tickets, cooldowns } = require("../../utils/database");
const E = require("../../utils/embeds");
const { isCategoryBlockedByIncident, resolveIncidentMessage } = require("../../domain/tickets/incidentMode");
const { getCategoryById } = require("../../utils/categoryResolver");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");
const logger = require("../../utils/structuredLogger");

module.exports = {
  customId: "ticket_category_select",
  async execute(interaction) {
    try {
      const guildId = interaction.guild.id;
      const categoryId = interaction.values[0];
      const category = await getCategoryById(guildId, categoryId);
      const guildSettings = await settings.get(guildId);
      const language = resolveInteractionLanguage(interaction, guildSettings);

      if (!category) {
        return interaction.reply({
          embeds: [
            E.errorEmbed(t(language, "ticket.picker.category_missing")),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      if (isCategoryBlockedByIncident(guildSettings, category.id)) {
        return interaction.reply({
          embeds: [E.errorEmbed(resolveIncidentMessage(guildSettings))],
          flags: MessageFlags.Ephemeral,
        });
      }

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
          flags: MessageFlags.Ephemeral,
        });
      }

      const banned = await blacklist.check(interaction.user.id, guildId);
      if (banned) {
        return interaction.reply({
          embeds: [
            E.errorEmbed(t(language, "ticket.picker.access_denied_description", {
              reason: banned.reason || t(language, "common.value.none"),
            })),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      const maxTickets = guildSettings.max_tickets || 3;
      const openCount = await tickets.countByUser(interaction.user.id, guildId);
      if (openCount >= maxTickets) {
        const openTickets = await tickets.getOpenReferencesByUser(interaction.user.id, guildId, maxTickets);
        const ticketList = openTickets
          .map((ticket) => `- <#${ticket.channel_id}> (${ticket.category || t(language, "ticket.create_flow.general_category")})`)
          .join("\n");

        return interaction.reply({
          embeds: [
            E.errorEmbed(
              t(language, "ticket.picker.limit_reached_description", {
                openCount,
                maxTickets,
                ticketList,
              })
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      if (guildSettings.cooldown_minutes > 0) {
        const remaining = await cooldowns.check(interaction.user.id, guildId, guildSettings.cooldown_minutes);
        if (remaining) {
          return interaction.reply({
            embeds: [
              E.errorEmbed(t(language, "ticket.picker.cooldown", { minutes: remaining })),
            ],
            flags: MessageFlags.Ephemeral,
          });
        }
      }

      if (guildSettings.min_days > 0) {
        const member = interaction.member?.joinedTimestamp
          ? interaction.member
          : await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
        if (member?.joinedTimestamp) {
          const days = (Date.now() - member.joinedTimestamp) / 86400000;
          if (days < guildSettings.min_days) {
            return interaction.reply({
              embeds: [
                E.errorEmbed(t(language, "ticket.picker.min_days", {
                  days: guildSettings.min_days,
                  currentDays: Math.floor(days),
                })),
              ],
              flags: MessageFlags.Ephemeral,
            });
          }
        }
      }

      const unratedTickets = await tickets.getUnratedClosedTickets(interaction.user.id, guildId);
      if (unratedTickets && unratedTickets.length > 0) {
        const ticketListDetailed = unratedTickets.map((ticket, index) => {
          const closedDate = ticket.closed_at
            ? `<t:${Math.floor(new Date(ticket.closed_at).getTime() / 1000)}:R>`
            : t(language, "common.value.no_data");
          return `${index + 1}. **Ticket #${ticket.ticket_id}** - ${ticket.category || t(language, "ticket.create_flow.general_category")} (Closed ${closedDate})`;
        }).join("\n");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xF39C12)
              .setTitle(t(language, "ticket.picker.pending_ratings_title"))
              .setDescription(t(language, "ticket.picker.pending_ratings_description", {
                count: unratedTickets.length,
                tickets: ticketListDetailed,
              }))
              .setFooter({ text: t(language, "ticket.picker.pending_ratings_footer") })
              .setTimestamp(),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`resend_ratings_${interaction.user.id}`)
                .setLabel(t(language, "ticket.picker.resend_ratings_button"))
                .setStyle(ButtonStyle.Primary)
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      const modal = TH.buildModal(category, language);
      return interaction.showModal(modal);
    } catch (error) {
      logger.error("ticket.category_select", "Unhandled error in category select", { guildId: interaction.guild?.id, error: error?.message || String(error) });
      const language = resolveInteractionLanguage(interaction);
      return interaction.reply({
        embeds: [
          E.errorEmbed(t(language, "ticket.picker.processing_error")),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
