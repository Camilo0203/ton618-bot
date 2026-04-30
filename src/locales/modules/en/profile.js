module.exports = {
  profile: {
    embed: {
      coins_format: "{{amount}} coins",
      field_bank: "Bank",
      field_level: "Level",
      field_rank: "Rank",
      field_total: "Net Worth",
      field_total_xp: "Total XP",
      field_wallet: "Wallet",
      level_format: "Level {{level}}",
      no_data: "No participants yet.",
      page_format: "Page {{current}} of {{total}}",
      title: "{{username}}'s Profile",
      top_economy: "💰 Richest Members",
      top_levels: "📊 Top Levels",
      top_title: "🏆 Leaderboard",
      user_fallback: "User #{{id}}"
    },
    slash: {
      description: "Simple profile: level + economy",
      options: {
        user: "User to inspect"
      },
      subcommands: {
        top: {
          description: "View leaderboard"
        },
        view: {
          description: "View a profile"
        }
      }
    }
  }
};
