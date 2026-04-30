module.exports = {
  mod: {
    ban_extra: {
      duration: "*Temp ban: {{duration}}*",
      messages_deleted: "*Messages deleted from last {{hours}}h*",
      permanent: "*Permanent ban*"
    },
    errors: {
      ban_failed: "❌ Error banning user.",
      bot_hierarchy: "❌ I cannot {{action}} this user because they have a higher or equal role than me.",
      history_failed: "❌ Error fetching moderation history.",
      kick_failed: "❌ Error kicking user.",
      mute_failed: "❌ Error muting user.",
      no_history: "ℹ️ No moderation history found for {{user}}.",
      no_messages: "❌ No messages matching the criteria found in the last 100 messages.",
      not_banned: "❌ This user is not banned in this server.",
      not_muted: "❌ This user is not muted.",
      purge_failed: "❌ Error deleting messages.",
      slowmode_failed: "❌ Error setting slowmode.",
      timeout_failed: "❌ Error timing out user.",
      unban_failed: "❌ Error unbanning user.",
      unmute_failed: "❌ Error unmuting user.",
      user_hierarchy: "❌ You cannot {{action}} this user because they have a higher or equal role than you."
    },
    history: {
      entry: "【{{index}}】 **{{action}}** — {{timestamp}}\n**Moderator:** {{moderator}}\n**Reason:** {{reason}}{{duration}}",
      footer: "Showing the {{count}} most recent actions",
      title: "🛡️ Moderation History - {{user}}"
    },
    slash: {
      choices: {
        delete_messages: {
          "0": "Don't delete",
          "3600": "Last hour",
          "86400": "Last 24 hours",
          "604800": "Last 7 days"
        },
        duration: {
          "1d": "1 day",
          "1h": "1 hour",
          "1m": "1 minute",
          "28d": "28 days",
          "30d": "30 days",
          "6h": "6 hours",
          "7d": "7 days",
          permanent: "Permanent"
        }
      },
      description: "Advanced moderation commands",
      options: {
        amount: "Number of messages to delete (1-100)",
        channel: "Channel to set slowmode for",
        contains: "Only delete messages containing this text",
        delete_messages: "Delete messages from the last...",
        duration: "Duration (e.g., 1h, 7d, 30d)",
        limit: "Number of actions to show",
        reason: "Reason for the action",
        seconds: "Slowmode duration in seconds (0 to disable)",
        user: "The target user",
        user_id: "Discord ID of the user to unban"
      },
      subcommands: {
        ban: {
          description: "Ban a user from the server"
        },
        history: {
          description: "View a user's moderation history"
        },
        kick: {
          description: "Kick a user from the server"
        },
        mute: {
          description: "Mute a user with a role"
        },
        purge: {
          description: "Delete multiple messages"
        },
        slowmode: {
          description: "Set slowmode for a channel"
        },
        timeout: {
          description: "Timeout a user (Discord native)"
        },
        unban: {
          description: "Unban a user"
        },
        unmute: {
          description: "Unmute a user"
        }
      }
    },
    success: {
      banned: "✅ **{{user}}** was banned.\n**Reason:** {{reason}}\n{{extra}}",
      kicked: "✅ **{{user}}** was kicked.\n**Reason:** {{reason}}",
      muted: "✅ **{{user}}** was muted for **{{duration}}**.\n**Reason:** {{reason}}",
      purged: "✅ Deleted **{{count}}** messages successfully.",
      slowmode_disabled: "✅ Slowmode disabled in {{channel}}.",
      slowmode_set: "✅ Slowmode set to **{{seconds}}s** in {{channel}}.",
      timeout: "✅ **{{user}}** was timed out for **{{duration}}**.\n**Reason:** {{reason}}",
      unbanned: "✅ **{{user}}** was unbanned.\n**Reason:** {{reason}}",
      unmuted: "✅ **{{user}}** is no longer muted.\n**Reason:** {{reason}}"
    }
  }
};
