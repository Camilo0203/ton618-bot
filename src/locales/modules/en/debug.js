module.exports = {
  debug: {
    access_denied: "You do not have permission to use debug commands.",
    description: {
      automod: "Owner-only live count of TON618-managed AutoMod rules across connected guilds.",
      cache: "Discord.js manages cache automatically.",
      health: "Active-window snapshot plus the latest persisted heartbeat.",
      voice: "Music queues are managed per guild."
    },
    field: {
      api_ping: "API ping",
      cached_channels: "Cached channels",
      cached_users: "Cached users",
      channels: "Channels",
      deploy: "Deploy",
      external: "External",
      guild_coverage: "Guild Coverage",
      guilds: "Guilds",
      guilds_attention: "Guilds Needing Attention",
      guilds_live_rules: "Guilds With Live TON618 Rules",
      heap_total: "Heap total",
      heap_used: "Heap used",
      heartbeat: "Heartbeat",
      interaction_window: "Interaction window",
      progress: "Progress",
      quick_state: "Quick state",
      rss: "RSS",
      top_errors: "Top errors",
      uptime: "Uptime",
      users: "Users"
    },
    no_connected_guilds: "There are no connected guilds.",
    options: {
      "debug_entitlements_set-plan_expires_in_days_expires_in_days": "Optional duration in days for Pro",
      "debug_entitlements_set-plan_guild_id_guild_id": "Target guild ID",
      "debug_entitlements_set-plan_note_note": "Optional internal note",
      "debug_entitlements_set-plan_tier_tier": "Plan tier",
      "debug_entitlements_set-supporter_active_active": "Enable or disable supporter recognition",
      "debug_entitlements_set-supporter_expires_in_days_expires_in_days": "Optional duration in days for supporter status",
      "debug_entitlements_set-supporter_guild_id_guild_id": "Target guild ID",
      "debug_entitlements_set-supporter_note_note": "Optional internal note",
      debug_entitlements_status_guild_id_guild_id: "Target guild ID"
    },
    slash: {
      description: "Owner-only diagnostics and entitlement tools",
      subcommands: {
        automod_badge: {
          description: "View live AutoMod badge progress across guilds"
        },
        cache: {
          description: "View bot cache sizes"
        },
        entitlements_set_plan: {
          description: "Set a guild plan manually"
        },
        entitlements_set_supporter: {
          description: "Enable or disable supporter recognition"
        },
        entitlements_status: {
          description: "Inspect the effective plan and supporter state for a guild"
        },
        guilds: {
          description: "List connected guilds"
        },
        health: {
          description: "View live health and heartbeat state"
        },
        memory: {
          description: "View process memory usage"
        },
        status: {
          description: "View bot status and deploy info"
        },
        voice: {
          description: "View music subsystem status"
        }
      }
    },
    title: {
      automod: "AutoMod Badge Progress",
      cache: "Cache State",
      entitlements: "Guild Entitlements",
      guilds: "Connected Guilds",
      health: "Bot Health",
      memory: "Memory Usage",
      plan_updated: "Plan Updated",
      status: "Bot Status",
      supporter_updated: "Supporter Updated",
      voice: "Music Subsystem"
    },
    unknown_subcommand: "Unknown subcommand.",
    value: {
      app_flag_present: "App flag present: {{value}}",
      automod_enabled: "AutoMod enabled: `{{count}}`",
      error_rate: "Error rate: **{{state}}** ({{value}}%, threshold {{threshold}}%)",
      failed_partial_sync: "Failed or partial sync: `{{count}}`",
      heartbeat: "Last seen: `{{lastSeen}}`\nGuilds: `{{guilds}}`",
      high: "HIGH",
      interaction_totals: "Total: `{{total}}`\nOK/Error/Denied/Rate: `{{ok}}/{{errors}}/{{denied}}/{{rateLimited}}`",
      managed_rules: "Managed rules: `{{count}}`",
      missing_permissions: "Missing permissions: `{{count}}`",
      no: "No",
      ok: "OK",
      ping_state: "Ping: **{{state}}** ({{value}}ms, threshold {{threshold}}ms)",
      remaining_to_goal: "Remaining to {{goal}}: `{{count}}`",
      yes: "Yes"
    }
  }
};
