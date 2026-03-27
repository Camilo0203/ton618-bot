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

module.exports = {
  customId: "ticket_category_select",
  async execute(interaction) {
    try {
      const guildId = interaction.guild.id;
      const categoryId = interaction.values[0];
      const category = await getCategoryById(guildId, categoryId);

      if (!category) {
        return interaction.reply({
          embeds: [
            E.errorEmbed("That category was not found or is not available right now. Please choose a different option."),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      const guildSettings = await settings.get(guildId);

      if (isCategoryBlockedByIncident(guildSettings, category.id)) {
        return interaction.reply({
          embeds: [E.errorEmbed(resolveIncidentMessage(guildSettings))],
          flags: MessageFlags.Ephemeral,
        });
      }

      if (guildSettings.maintenance_mode) {
        return interaction.reply({
          embeds: [E.maintenanceEmbed(guildSettings.maintenance_reason)],
          flags: MessageFlags.Ephemeral,
        });
      }

      const banned = await blacklist.check(interaction.user.id, guildId);
      if (banned) {
        return interaction.reply({
          embeds: [
            E.errorEmbed(`You cannot create tickets right now.\n**Reason:** ${banned.reason || "No reason provided"}`),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      const maxTickets = guildSettings.max_tickets || 3;
      const openCount = await tickets.countByUser(interaction.user.id, guildId);
      if (openCount >= maxTickets) {
        const openTickets = await tickets.getOpenReferencesByUser(interaction.user.id, guildId, maxTickets);
        const ticketList = openTickets
          .map((ticket) => `- <#${ticket.channel_id}> (${ticket.category || "General"})`)
          .join("\n");

        return interaction.reply({
          embeds: [
            E.errorEmbed(
              `You already have **${openCount}/${maxTickets}** open tickets.\n\n` +
              `**Your active tickets:**\n${ticketList}\n\n` +
              "Please close one of your existing tickets before opening a new one."
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
              E.errorEmbed(
                `Please wait **${remaining} minute(s)** before opening another ticket.\n\n` +
                "This cooldown helps the team manage incoming requests more effectively."
              ),
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
                E.errorEmbed(
                  `You must be in the server for at least **${guildSettings.min_days} day(s)** to open a ticket.\n\n` +
                  `Current time in server: **${Math.floor(days)} day(s)**`
                ),
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
            : "Recently";
          return `${index + 1}. **Ticket #${ticket.ticket_id}** - ${ticket.category || "General"} (Closed ${closedDate})`;
        }).join("\n");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xF39C12)
              .setTitle("Pending ticket ratings")
              .setDescription(
                `You have **${unratedTickets.length}** closed ticket(s) waiting for a rating:\n\n` +
                ticketListDetailed +
                "\n\n**Why does rating matter?**\n" +
                "Your feedback helps us improve the service and is required before opening new tickets.\n\n" +
                "**Check your DMs** to find the pending rating prompts.\n" +
                "If you cannot find them, use the button below to resend them."
              )
              .setFooter({ text: "TON618 Tickets - Rating system" })
              .setTimestamp(),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`resend_ratings_${interaction.user.id}`)
                .setLabel("Resend rating prompts")
                .setStyle(ButtonStyle.Primary)
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      const modal = TH.buildModal(category);
      return interaction.showModal(modal);
    } catch (error) {
      console.error("[TICKET CATEGORY SELECT ERROR]", error);
      return interaction.reply({
        embeds: [
          E.errorEmbed("There was an error while processing your selection. Please try again later."),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
