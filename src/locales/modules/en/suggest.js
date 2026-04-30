module.exports = {
  suggest: {
    audit: {
      approved: "Approved",
      rejected: "Rejected",
      status_updated: "Status updated",
      thread_reason: "Thread reason"
    },
    buttons: {
      approve: "✅ Approve",
      reject: "Reject",
      staff_note: "Add Note (Pro)",
      vote_down: "👎 Against",
      vote_up: "👍 Support"
    },
    cooldown: {
      description: "You must wait **{{minutes}} minutes** before sending another suggestion.",
      title: "⏱️ Cooldown Active"
    },
    dm: {
      description: "Your suggestion **#{{num}}** in **{{guildName}}** was reviewed.",
      field_suggestion: "📝 Your suggestion",
      title_approved: "✅ Your suggestion was Approved",
      title_rejected: "❌ Your suggestion was Rejected"
    },
    embed: {
      author_anonymous: "Anonymous",
      debate_footer: "Keep it respectful",
      debate_title: "Discussion: Suggestion #{{num}}",
      field_author: "👤 Author",
      field_staff_comment: "💬 Staff comment",
      field_staff_note: "💬 Staff Note",
      field_status: "📝 Status",
      field_submitted: "📅 Submitted",
      field_votes: "👍 {{up}}  •  👎 {{down}}  •  {{pct}}% approval",
      footer_reviewed: "Reviewed by {{reviewer}} • {{status}}",
      footer_status: "Status: {{status}}",
      no_description: "> (No description)",
      title: "{{emoji}} Suggestion #{{num}}"
    },
    emoji: {
      approved: "✅",
      pending: "⏳",
      rejected: "❌"
    },
    errors: {
      already_reviewed: "This suggestion has already been reviewed.",
      already_status: "❌ This suggestion was already {{status}}.",
      channel_not_configured: "The suggestions channel was not found.",
      interaction_error: "❌ Invalid interaction.",
      invalid_data: "Provide at least a title or description.",
      manage_messages_required: "❌ You need 'Manage Messages' permission to review suggestions.",
      not_exists: "❌ This suggestion no longer exists.",
      pro_required: "Suggest notes require **TON618 Pro**.",
      processing_error: "❌ Error processing suggestion.",
      system_disabled: "The suggestion system is not enabled on this server.",
      vote_error: "❌ Error registering your vote."
    },
    modal: {
      field_description_label: "Description",
      field_description_placeholder: "Explain your idea...",
      field_title_label: "Title",
      field_title_placeholder: "e.g., Add a music channel",
      title: "💡 New Suggestion"
    },
    placeholder: "⏳ Creating suggestion...",
    slash: {
      description: "💡 Send a suggestion for the server"
    },
    status: {
      approved: "✅ Approved",
      pending: "⏳ Pending",
      rejected: "❌ Rejected"
    },
    success: {
      auto_thread_created: "Discussion thread created automatically.",
      staff_note_updated: "Staff note updated for suggestion #{{num}}.",
      status_updated: "✅ Suggestion **#{{num}}** marked as **{{status}}**.",
      submitted_description: "Your suggestion **#{{num}}** has been published in {{channel}}.",
      submitted_footer: "Thank you for your feedback!",
      submitted_title: "✅ Suggestion Submitted",
      vote_registered: "✅ Vote registered. ({{emoji}})"
    }
  }
};
