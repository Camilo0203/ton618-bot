const { settings, ticketEvents, tickets } = require("../../utils/database");
const { checkStaff } = require("../../utils/commandUtils");
const E = require("../../utils/embeds");
const { updateTicketControlPanelEmbed } = require("../../utils/ticketEmbedUpdater");
const { formatTicketWorkflowStatus, priorityLabel } = require("../../handlers/tickets/shared");

module.exports = {
  customId: "staff_quick_actions",
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const guildSettings = await settings.get(interaction.guild.id);
      if (!checkStaff(interaction.member, guildSettings)) {
        return interaction.editReply({
          embeds: [E.errorEmbed("Only staff can use these actions.")],
        });
      }

      const action = interaction.values[0];
      const channel = interaction.channel;
      const ticket = await tickets.get(channel.id);

      if (!ticket) {
        return interaction.editReply({
          embeds: [E.errorEmbed("Ticket information was not found.")],
        });
      }
      if (ticket.status === "closed") {
        return interaction.editReply({
          embeds: [E.errorEmbed("Quick actions are not available on closed tickets.")],
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
          await ticketEvents.add({
            guild_id: interaction.guild.id,
            ticket_id: ticket.ticket_id,
            channel_id: channel.id,
            actor_id: interaction.user.id,
            actor_kind: "staff",
            actor_label: interaction.user.tag,
            event_type: "ticket_priority_changed",
            visibility: "internal",
            title: "Priority updated",
            description: `${interaction.user.tag} updated ticket #${ticket.ticket_id} priority to ${newPriority} from quick actions.`,
            metadata: {
              source: "staff_quick_actions",
              priority: newPriority,
            },
          }).catch(() => {});

          await interaction.editReply({
            embeds: [E.successEmbed(`Ticket priority updated to **${priorityLabel(newPriority)}** by <@${interaction.user.id}>.`)],
          });
          break;
        }
        case "status_wait":
        case "status_pending":
        case "status_review": {
          const workflowStatusMap = {
            status_wait: "waiting_staff",
            status_pending: "waiting_user",
            status_review: "triage",
          };
          const newWorkflowStatus = workflowStatusMap[action];
          const newStatusLabel = formatTicketWorkflowStatus(newWorkflowStatus);

          await tickets.update(channel.id, {
            workflow_status: newWorkflowStatus,
            status_label: newStatusLabel,
          });

          const updatedTicket = await tickets.get(channel.id);
          await updateTicketControlPanelEmbed(channel, updatedTicket);
          await ticketEvents.add({
            guild_id: interaction.guild.id,
            ticket_id: ticket.ticket_id,
            channel_id: channel.id,
            actor_id: interaction.user.id,
            actor_kind: "staff",
            actor_label: interaction.user.tag,
            event_type: "ticket_status_changed",
            visibility: "internal",
            title: "Workflow status updated",
            description: `${interaction.user.tag} updated ticket #${ticket.ticket_id} workflow status to ${newWorkflowStatus} from quick actions.`,
            metadata: {
              source: "staff_quick_actions",
              workflowStatus: newWorkflowStatus,
            },
          }).catch(() => {});

          await interaction.editReply({
            embeds: [E.successEmbed(`Ticket status updated to **${newStatusLabel}** by <@${interaction.user.id}>.`)],
          });
          break;
        }
        case "add_staff": {
          return interaction.editReply({
            content: "Mention the staff member you want to add to this ticket.",
          });
        }
        default:
          return interaction.editReply({ content: "Unknown action." });
      }
    } catch (error) {
      console.error("[STAFF QUICK ACTIONS ERROR]", error);

      if (interaction.deferred) {
        return interaction.editReply({
          embeds: [E.errorEmbed("There was an error while processing this action.")],
        }).catch(() => {});
      }

      return interaction.reply({
        embeds: [E.errorEmbed("There was an error while processing this action.")],
        flags: 64,
      }).catch(() => {});
    }
  },
};
