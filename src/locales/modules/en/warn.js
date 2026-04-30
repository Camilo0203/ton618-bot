module.exports = {
  warn: {
    fields: {
      list: "Warnings",
      moderator: "Moderator",
      reason: "Reason",
      total: "Total warnings",
      user: "User"
    },
    options: {
      warn_add_reason_reason: "Reason for the warning",
      warn_add_user_user: "Member to warn",
      warn_check_user_user: "Member whose warnings you want to inspect",
      warn_remove_id_id: "Warning ID"
    },
    responses: {
      add_description: "{{user}} has been warned successfully.",
      add_title: "Warning added",
      auto_kick_failed: "Automatic action failed: I could not kick the member after reaching 5 warnings.",
      auto_kick_success: "Automatic action: the member was kicked after reaching 5 warnings.",
      auto_timeout_failed: "Automatic action failed: I could not timeout the member after reaching 3 warnings.",
      auto_timeout_success: "Automatic action: the member was timed out for 1 hour after reaching 3 warnings.",
      footer_id: "Warning ID: {{id}}",
      list_description: "Total stored warnings: **{{count}}**.",
      list_entry: "**{{index}}.** `{{id}}`\nReason: {{reason}}\nModerator: <@{{moderatorId}}>\nDate: <t:{{timestamp}}:R>",
      list_footer: "Use `/warn remove` with the warning ID to delete one entry.",
      list_title: "Warnings for {{user}}",
      none_description: "{{user}} has no warnings in this server.",
      none_title: "No warnings found",
      not_found_description: "I could not find a warning with ID `{{id}}`.",
      not_found_title: "Warning not found",
      remove_description: "Warning `{{id}}` was removed successfully.",
      remove_title: "Warning removed"
    },
    slash: {
      description: "Manage member warnings",
      options: {
        id: "Warning ID",
        reason: "Reason for the warning",
        user_inspect: "Member whose warnings you want to inspect",
        user_warn: "Member to warn"
      },
      subcommands: {
        add: {
          description: "Add a warning to a member"
        },
        check: {
          description: "View the warnings for a member"
        },
        remove: {
          description: "Remove one warning by ID"
        }
      }
    }
  }
};
