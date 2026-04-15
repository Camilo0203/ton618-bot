const { settings, ticketEvents, tickets } = require("../../utils/database");
const { checkStaff } = require("../../utils/commandUtils");
const E = require("../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");
const { updateTicketControlPanelEmbed } = require("../../utils/ticketEmbedUpdater");
const { formatTicketWorkflowStatus, priorityLabel } = require("../../handlers/tickets/shared");

module.exports = {
  customId: "staff_quick_actions",
  async execute(interaction) {
    try {
      await interaction.deferReply({ flags: 64 });

      const guildSettings = await settings.get(interaction.guild.id);
      const language = resolveInteractionLanguage(interaction, guildSettings);
      if (!checkStaff(interaction.member, guildSettings)) {
        return interaction.editReply({
          embeds: [E.errorEmbed(t(language, "ticket.quick_feedback.only_staff"))],
        });
      }

      const action = interaction.values[0];
      const channel = interaction.channel;
      const ticket = await tickets.get(channel.id);

      if (!ticket) {
        return interaction.editReply({
          embeds: [E.errorEmbed(t(language, "ticket.quick_feedback.not_found"))],
        });
      }
      if (ticket.status === "closed") {
        return interaction.editReply({
          embeds: [E.errorEmbed(t(language, "ticket.quick_feedback.closed"))],
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
            title: t(language, "ticket.quick_feedback.priority_event_title"),
            description: t(language, "ticket.quick_feedback.priority_event_description", {
              userTag: interaction.user.tag,
              ticketId: ticket.ticket_id,
              priority: newPriority,
            }),
            metadata: {
              source: "staff_quick_actions",
              priority: newPriority,
            },
          }).catch(() => {});

          await interaction.editReply({
            embeds: [E.successEmbed(t(language, "ticket.quick_feedback.priority_updated", {
              label: priorityLabel(newPriority, language),
              userId: interaction.user.id,
            }))],
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
            title: t(language, "ticket.quick_feedback.workflow_event_title"),
            description: t(language, "ticket.quick_feedback.workflow_event_description", {
              userTag: interaction.user.tag,
              ticketId: ticket.ticket_id,
              status: newWorkflowStatus,
            }),
            metadata: {
              source: "staff_quick_actions",
              workflowStatus: newWorkflowStatus,
            },
          }).catch(() => {});

          await interaction.editReply({
            embeds: [E.successEmbed(t(language, "ticket.quick_feedback.workflow_updated", {
              label: newStatusLabel,
              userId: interaction.user.id,
            }))],
          });
          break;
        }
        case "add_staff": {
          return interaction.editReply({
            content: t(language, "ticket.quick_feedback.add_staff_prompt"),
          });
        }
        default:
          return interaction.editReply({ content: t(language, "ticket.quick_feedback.unknown_action") });
      }
    } catch (error) {
      console.error("[STAFF QUICK ACTIONS ERROR]", error);
      const guildSettings = await settings.get(interaction.guild.id).catch(() => null);
      const language = resolveInteractionLanguage(interaction, guildSettings);

      if (interaction.deferred) {
        return interaction.editReply({
          embeds: [E.errorEmbed(t(language, "ticket.quick_feedback.processing_error"))],
        }).catch(() => {});
      }

      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "ticket.quick_feedback.processing_error"))],
        flags: 64,
      }).catch(() => {});
    }
  },
};
