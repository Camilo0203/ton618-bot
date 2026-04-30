module.exports = {
  interaction: {
    command_disabled: "The command `/{{commandName}}` is disabled on this server.",
    dashboard_refresh: {
      success: "✅ Dashboard updated! Statistics refreshed successfully."
    },
    db_unavailable: "Database temporarily unavailable. Please try again in a few seconds.",
    error_generic: "Generic error",
    rate_limit: {
      command: "Temporary limit for `/{{commandName}}`. Wait **{{retryAfterSec}}s** before retrying.",
      global: "You're going too fast. Wait **{{retryAfterSec}}s** before using another interaction."
    },
    shutdown: {
      rebooting: "The bot is currently restarting to apply updates. Please try again in 15 seconds."
    },
    tag_delete: {
      cancelled: "❌ Deletion cancelled.",
      error: "An error occurred while deleting the tag.",
      success: "✅ Tag **{{name}}** has been deleted."
    },
    unexpected: "An unexpected error occurred while executing this command. Please contact an administrator."
  }
};
