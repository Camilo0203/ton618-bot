const { StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { settings, tickets } = require("../../utils/database");
const { checkStaff } = require("../../utils/commandUtils");
const E = require("../../utils/embeds");
const TH = require("../../handlers/ticketHandler");
const { updateTicketControlPanelEmbed } = require("../../utils/ticketEmbedUpdater");

module.exports = {
  customId: "staff_quick_actions",
  async execute(interaction) {
    try {
      const guildSettings = await settings.get(interaction.guild.id);
      if (!checkStaff(interaction.member, guildSettings)) {
        return interaction.reply({
          embeds: [E.errorEmbed("Solo el staff puede utilizar estas acciones.")],
          flags: 64
        });
      }

      const action = interaction.values[0];
      const channel = interaction.channel;
      const ticket = await tickets.get(channel.id);

      if (!ticket) {
        return interaction.reply({
          embeds: [E.errorEmbed("No se encontró información del ticket.")],
          flags: 64
        });
      }

      switch (action) {
        case "priority_low":
        case "priority_normal":
        case "priority_high":
        case "priority_urgent": {
          const newPriority = action.split("_")[1];
          await tickets.update(channel.id, { priority: newPriority });
          
          const updatedTicket = await tickets.get(channel.id);
          await updateTicketControlPanelEmbed(channel, updatedTicket);
          
          await interaction.reply({
            embeds: [E.successEmbed(`Prioridad cambiada a **${E.priorityLabel(newPriority)}** por <@${interaction.user.id}>.`) ]
          });
          break;
        }
        case "status_wait":
        case "status_pending":
        case "status_review": {
          const statusLabels = {
            status_wait: "En Espera",
            status_pending: "Pendiente de Usuario",
            status_review: "En Revisión"
          };
          const workflowStatusMap = {
            status_wait: "waiting_staff",
            status_pending: "waiting_user",
            status_review: "triage"
          };
          const newStatusLabel = statusLabels[action];
          const newWorkflowStatus = workflowStatusMap[action];
          
          await tickets.update(channel.id, { 
            workflow_status: newWorkflowStatus,
            status_label: newStatusLabel
          });
          
          const updatedTicket = await tickets.get(channel.id);
          await updateTicketControlPanelEmbed(channel, updatedTicket);
          
          await interaction.reply({
            embeds: [E.successEmbed(`Estado del ticket cambiado a **${newStatusLabel}** por <@${interaction.user.id}>.`)]
          });
          break;
        }
        case "add_staff": {
          return interaction.reply({
            content: "Menciona al staff que deseas añadir a este ticket.",
            flags: 64
          });
          // Nota: Esto requeriría un message collector o un modal con Input de ID
        }
        default:
          return interaction.reply({ content: "Acción no reconocida.", flags: 64 });
      }
    } catch (error) {
      console.error("[STAFF QUICK ACTIONS ERROR]", error);
      return interaction.reply({
        embeds: [E.errorEmbed("Ocurrió un error al procesar la acción.")],
        flags: 64
      });
    }
  }
};
