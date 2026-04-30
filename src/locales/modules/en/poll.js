module.exports = {
  poll: {
    embed: {
      active_channel_deleted: "Channel Deleted",
      active_count_title: "📊 Active Polls ({{count}})",
      active_empty: "No active polls in this server.",
      active_footer: "Use /poll end <id> to end early",
      active_item_votes: "Votes",
      active_title: "📊 Active Polls",
      created_description: "Poll sent to {{channel}}.",
      created_title: "✅ Poll Created",
      field_created_by: "Created by",
      field_ends: "Ends",
      field_id: "Poll ID",
      field_in: "Time remaining",
      field_mode: "Voting Mode",
      field_options: "Options",
      field_question: "Question",
      field_required_role: "Required Role",
      field_total_votes: "Total Votes",
      footer_ended: "Voting closed",
      footer_multiple: "You can vote for multiple options",
      footer_single: "Only one option allowed",
      mode_multiple: "Multiple Choice",
      mode_single: "Single Choice",
      status_anonymous: "Hidden Results",
      status_ended: "Poll Ended",
      title_ended_prefix: "🏁 Ended:",
      title_prefix: "🗳️ Poll:",
      vote_plural: "votes",
      vote_singular: "vote"
    },
    errors: {
      manage_messages_required: "You need 'Manage Messages' permission.",
      max_duration: "Poll cannot last more than 30 days.",
      max_options: "You can only have up to 10 options.",
      max_votes_reached: "You can only vote for up to {{max}} options.",
      min_duration: "Poll must last at least 1 minute.",
      min_options: "You need at least 2 options.",
      option_too_long: "An option is too long (max 80 chars).",
      poll_not_found: "Poll with ID `{{id}}` not found.",
      pro_required: "✨ This requires **TON618 Pro**.",
      role_required: "You must have the <@&{{roleId}}> role to vote.",
      unknown_subcommand: "Unknown poll subcommand."
    },
    placeholder: "📊 Loading poll...",
    slash: {
      description: "Interactive polling system",
      options: {
        anonymous: "Hide results until end (Pro)",
        channel: "Target channel",
        duration: "Duration (e.g., 1h, 30m, 1d)",
        id: "Poll ID (last 6 characters)",
        max_votes: "Max options allowed (Pro)",
        multiple: "Allow multiple votes",
        options: "Options separated by |",
        question: "Poll question",
        required_role: "Requirement to vote (Pro)"
      },
      subcommands: {
        create: {
          description: "Create a new poll"
        },
        end: {
          description: "End a poll early"
        },
        list: {
          description: "View active polls"
        }
      }
    },
    success: {
      ended: "✅ The poll **\"{{question}}\"** has been ended.",
      vote_active_multiple: "Your current votes: {{options}}",
      vote_active_single: "You voted for: **{{option}}**",
      vote_removed: "Your vote has been removed."
    }
  },
  "poll.errors.owner_only": "Only the server owner can use this poll option."
};
