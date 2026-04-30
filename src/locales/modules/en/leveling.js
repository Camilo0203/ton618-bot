module.exports = {
  leveling: {
    embed: {
      field_level_name: "Level",
      field_progress_name: "Progress",
      field_total_xp_name: "Total XP",
      footer: "Stay active to level up!",
      level: "Level",
      messages: "Messages",
      progress: "Progress",
      title: "{{user}}'s Profile",
      total_xp: "Total XP"
    },
    errors: {
      disabled: "❌ Leveling system is disabled in this server.",
      invalid_page: "❌ Invalid page. Max page is {{max}}.",
      no_data: "❌ No leaderboard data found.",
      no_rank: "❌ You don't have a position yet. Send some messages!",
      user_not_found: "❌ User not found."
    },
    leaderboard: {
      empty: "No data found for this server yet.",
      footer: "Page {{page}}/{{total}} • {{users}} total users",
      stats: "Level: {{level}} | XP: {{xp}}",
      title: "Server Leaderboard - {{guild}}",
      unknown_user: "User Unknown"
    },
    rank: {
      description: "Your current position is #{{rank}} out of {{total}} with level {{level}}.",
      footer: "XP: {{xp}} / {{next}} ({{remaining}} remaining)",
      no_xp: "You don't have any XP yet. Send some messages!",
      title: "{{user}}'s Rank"
    },
    slash: {
      description: "Interactive leveling system",
      options: {
        page: "Page number to view",
        user: "The target user"
      },
      subcommands: {
        leaderboard: {
          description: "View the server leaderboard"
        },
        rank: {
          description: "View your rank on the leaderboard"
        },
        view: {
          description: "View your level or another user's level"
        }
      }
    },
    status_disabled: "❌ Leveling system is currently disabled."
  },
  "leveling.embed.field_level_name": "Level",
  "leveling.embed.field_progress_name": "Progress",
  "leveling.embed.field_total_xp_name": "Total XP",
  "leveling.embed.title": "Level Profile: {{user}}",
  "leveling.leaderboard.empty": "No leaderboard data is available yet.",
  "leveling.rank.footer": "Keep chatting to earn more XP.",
  "leveling.rank.no_xp": "No XP recorded yet.",
  "leveling.rank.title": "Rank for {{user}}",
  "leveling.status_disabled": "Leveling is currently disabled on this server.",
  "leveling.user_not_found": "Could not find that user."
};
