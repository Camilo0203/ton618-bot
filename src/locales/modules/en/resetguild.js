module.exports = {
  resetguild: {
    error: "❌ An error occurred during the reset.",
    guild_not_found: "❌ Guild not found with ID: `{{guildId}}`",
    owner_only: "🔒 This command is restricted to the bot owner.",
    reset_description: "Configuration has been reset for guild: `{{guildId}}`",
    reset_title: "🗑️ Guild Reset Complete",
    slash: {
      description: "Reset configuration for a specific guild (Owner only)",
      options: {
        guild_id: "Guild ID to reset (leave empty for this guild)",
        preserve_pro: "Preserve PRO/premium status",
        preserve_tickets: "Preserve active tickets",
        reason: "Reason for the reset"
      }
    }
  }
};
