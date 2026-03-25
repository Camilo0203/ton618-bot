const { MessageFlags } = require("discord.js");
const TH = require("../../handlers/ticketHandler");
const { settings, blacklist, tickets, cooldowns } = require("../../utils/database");
const E = require("../../utils/embeds");
const config = require("../../../config");
const { isCategoryBlockedByIncident, resolveIncidentMessage } = require("../../domain/tickets/incidentMode");

module.exports = {
  customId: "ticket_category_select",
  async execute(interaction) {
    try {
      const categoryId = interaction.values[0];
      const category = config.categories.find((entry) => entry.id === categoryId);

      if (!category) {
        return interaction.reply({
          embeds: [
            E.errorEmbed("Categoria no encontrada o no disponible en este momento. Por favor, selecciona otra categoria."),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      const guildId = interaction.guild.id;
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
            E.errorEmbed(`No puedes crear tickets en este momento.\n**Razon:** ${banned.reason || "Sin razon especificada"}`),
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
              `Ya tienes **${openCount}/${maxTickets}** tickets abiertos.\n\n` +
              `**Tus tickets activos:**\n${ticketList}\n\n` +
              "Por favor, cierra alguno de tus tickets existentes antes de abrir uno nuevo."
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
                `Por favor, espera **${remaining} minuto(s)** antes de abrir otro ticket.\n\n` +
                "Este limite de tiempo ayuda a nuestro equipo a gestionar mejor las solicitudes."
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
                  `Debes ser miembro del servidor durante al menos **${guildSettings.min_days} dia(s)** para poder abrir un ticket.\n\n` +
                  `Tiempo actual en el servidor: **${Math.floor(days)} dia(s)**`
                ),
              ],
              flags: MessageFlags.Ephemeral,
            });
          }
        }
      }

      // Verificar si el usuario tiene tickets cerrados sin calificar
      const unratedTickets = await tickets.getUnratedClosedTickets(interaction.user.id, guildId);
      if (unratedTickets && unratedTickets.length > 0) {
        const ticketList = unratedTickets.map(t => `#${t.ticket_id}`).join(", ");
        return interaction.reply({
          embeds: [
            E.errorEmbed(
              `⚠️ **Tienes ${unratedTickets.length} ticket(s) sin calificar:** ${ticketList}\n\n` +
              "Por favor, califica la atención recibida antes de abrir un nuevo ticket. Revisa tus mensajes directos."
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
          E.errorEmbed("Ha ocurrido un error al procesar tu seleccion. Por favor, intentalo de nuevo mas tarde."),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
