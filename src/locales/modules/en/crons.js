module.exports = {
  crons: {
    auto_close: {
      archive_warning_error: "Archive warning error",
      archive_warning_inaccessible: "Archive warning inaccessible",
      archive_warning_transcript: "Archive warning transcript",
      embed_desc_auto: "This ticket was closed due to inactivity and will be deleted soon.",
      embed_title_auto: "Ticket closed automatically",
      embed_title_manual: "Embed title manual",
      event_desc: "Ticket #{{ticketId}} was closed due to inactivity.",
      title: "Ticket closed automatically",
      warning_desc: "⚠️ <@{{user}}> This ticket will be automatically closed soon due to inactivity."
    },
    messageDelete: {
      fields: {
        author: "Author",
        channel: "Channel",
        content: "Content"
      },
      footer: "Message ID: {{id}}",
      no_text: "*(no text)*",
      title: "Deleted message",
      unknown_author: "Unknown"
    },
    modlog: {
      ban_title: "🔨 User Banned",
      edit_title: "✏️ Message Edited",
      fields: {
        after: "After",
        author: "👤 Author",
        before: "Before",
        channel: "📍 Channel",
        executor: "🛡️ Executed by",
        link: "Message Link",
        reason: "Reason",
        user: "👤 User"
      },
      no_reason: "No reason specified",
      unban_title: "✅ User Unbanned"
    },
    polls: {
      ended_desc: "The poll **\"{{question}}\"** has finished.",
      ended_title: "Poll Ended"
    },
    reminders: {
      field_ago: "Field ago",
      footer: "Recordatorio de TON618",
      title: "Title"
    }
  }
};
