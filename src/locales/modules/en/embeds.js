module.exports = {
  embeds: {
    ticket: {
      closed: {
        fields: {
          closed_by: "Closed by",
          duration: "Duration",
          messages: "Messages",
          reason: "Reason",
          ticket: "Ticket"
        },
        no_reason: "No reason provided",
        title: "Ticket closed"
      },
      info: {
        fields: {
          assigned_to: "Assigned to",
          category: "Category",
          claimed_by: "Claimed by",
          created: "Created",
          creator: "Creator",
          duration: "Duration",
          first_response: "First response",
          messages: "Messages",
          priority: "Priority",
          reopens: "Reopens",
          status: "Status",
          subject: "Subject"
        },
        first_response_value: "{{minutes}} min",
        status_closed: "Closed",
        status_open: "Open",
        title: "Ticket #{{ticketId}}"
      },
      log: {
        actions: {
          add: "User added",
          assign: "Ticket assigned",
          autoclose: "Ticket auto-closed",
          claim: "Ticket claimed",
          close: "Ticket closed",
          default: "Action",
          delete: "Message deleted",
          edit: "Message edited",
          move: "Category changed",
          open: "Ticket opened",
          priority: "Priority changed",
          rate: "Ticket rated",
          remove: "User removed",
          reopen: "Ticket reopened",
          sla: "SLA alert",
          smartping: "No staff response",
          transcript: "Transcript generated",
          unassign: "Assignment removed",
          unclaim: "Ticket released"
        },
        fields: {
          by: "By",
          category: "Category",
          ticket: "Ticket"
        },
        footer: "UID: {{userId}}"
      },
      open: {
        author: "Ticket #{{ticketId}} | {{category}}",
        default_welcome: "Hello <@{{userId}}>! Welcome to our support system. A staff member will assist you soon.",
        footer: "Use the buttons below to manage this ticket",
        form_field: "Form information",
        question_fallback: "Question {{index}}",
        summary: "**Request summary:**\n- **User:** <@{{userId}}>\n- **Category:** {{category}}\n- **Priority:** {{priority}}\n- **Created:** <t:{{createdAt}}:R>"
      },
      reopened: {
        description: "<@{{userId}}> reopened this ticket.\nA staff member will resume the conversation soon.",
        fields: {
          reopens: "Reopens"
        },
        title: "Ticket reopened"
      }
    }
  }
};
