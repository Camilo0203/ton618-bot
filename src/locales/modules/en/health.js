module.exports = {
  health: {
    active: "Active",
    all_permissions: "All permissions present",
    checks: {
      database: "Database",
      handlers: "Handlers",
      memory: "Memory",
      permissions: "Bot Permissions",
      uptime: "Uptime",
      version: "Version"
    },
    connected: "Connected",
    embed: {
      checks_title: "Diagnostics",
      description: "System status: {{status}}\nServer: {{guild}}",
      errors_title: "Critical Errors",
      footer: "Completed in {{elapsed}}ms • Discord.js {{discordjs}} • Node {{node}}",
      title: "🔍 System Diagnostics",
      warnings_title: "Warnings"
    },
    errors: {
      database: "Database connection error: {{error}}"
    },
    handlers_status: "Giveaways: {{giveaway}}, Stats: {{stats}}",
    inactive: "Inactive",
    memory_usage: "{{used}} MB / {{total}} MB",
    missing_count: "Missing {{count}} permissions",
    no_checks: "Could not perform checks",
    no_data: "No data (first time)",
    slash: {
      description: "Check bot status and diagnostics"
    },
    status: {
      critical: "Critical",
      healthy: "Healthy",
      warning: "Warnings"
    },
    unknown: "unknown",
    unknown_error: "Unknown error",
    uptime_format: "{{hours}}h {{minutes}}m",
    warnings: {
      handlers_inactive: "Some handlers are inactive",
      high_memory: "High memory usage: {{mb}} MB",
      missing_permissions: "Missing {{count}} bot permissions"
    }
  }
};
