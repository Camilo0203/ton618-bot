module.exports = {
  "common": {
    "currency": {
      "coins": "coins"
    },
    "labels": {
      "channel": "Channel",
      "status": "Status",
      "user": "User",
      "category": "Category",
      "ticket_id": "Ticket ID",
      "created": "Created",
      "priority": "Priority",
      "verified_role": "Verified Role",
      "mode": "Mode",
      "unverified_role": "Unverified Role",
      "panel_message": "Panel Message",
      "notes": "Notes",
      "error": "Error"
    },
    "value": {
      "no_data": "No data"
    },
    "language": {
      "en": "English",
      "es": "Spanish"
    },
    "state": {
      "disabled": "Disabled",
      "enabled": "Enabled"
    },
    "buttons": {
      "enter_code": "Enter Code",
      "resend_code": "Resend Code",
      "english": "English",
      "spanish": "Spanish"
    },
    "errors": {
      "bot_missing_permissions": "The bot is missing the following permissions to perform this action: {{permissions}}."
    },
    "all": "All",
    "none": "None",
    "no_reason": "No reason",
    "open": "Open",
    "closed": "Closed"
  },
  "access": {
    "owner_only": "This command is only for the bot owner.",
    "admin_required": "You need administrator permissions to use this command.",
    "staff_required": "You need staff permissions to use this command.",
    "guild_only": "This command can only be used inside a server.",
    "default": "You do not have permission to use this command."
  },
  "interaction": {
    "rate_limit": {
      "command": "Temporary limit for `/{{commandName}}`. Wait **{{retryAfterSec}}s** before trying again.",
      "global": "You are going too fast. Wait **{{retryAfterSec}}s** before using another interaction."
    },
    "command_disabled": "The `/{{commandName}}` command is disabled in this server.",
    "db_unavailable": "Database is temporarily unavailable. Please try again in a few seconds.",
    "unexpected": "An unexpected error occurred.",
    "tag_delete": {
      "success": "✅ Tag **{{name}}** has been deleted.",
      "error": "An error occurred while deleting the tag.",
      "cancelled": "❌ Deletion cancelled."
    },
    "dashboard_refresh": {
      "success": "✅ Dashboard updated! Statistics have been successfully refreshed."
    }
  },
  "onboarding": {
    "title": "Welcome to TON618 / Bienvenido a TON618",
    "description": "Choose the primary language for this server / Elige el idioma principal de este servidor.",
    "body": "TON618 can operate in English or Spanish. Pick the default language for this guild now. You can change it later with `/setup language`.",
    "footer": "If nobody selects a language, TON618 will keep English as the default until it is configured manually.",
    "posted_title": "Language onboarding sent",
    "posted_description": "A language selection prompt was delivered for this server. TON618 will keep English until an administrator chooses a language.",
    "confirm_title": "Server language updated",
    "confirm_description": "TON618 will now operate in **{{label}}** for this server.",
    "dm_fallback_subject": "TON618 language setup",
    "dm_fallback_intro": "I could not post the onboarding prompt in a writable server channel, so I am sending it here.",
    "delivery_failed": "TON618 joined the server, but I could not deliver the language onboarding prompt in a writable channel or DM."
  },
  "setup": {
    "general": {
      "language_set": "Bot language configured: **{{label}}**.",
      "language_label_es": "Spanish",
      "language_label_en": "English",
      "option_enabled": "Enable or disable",
      "language_description": "Review or update the bot language for this server",
      "option_language_value": "Language to use for visible bot responses",
      "group_description": "Configure the server operational settings",
      "info_description": "View current server configuration",
      "logs_description": "Set the channel for moderation logs",
      "transcripts_description": "Set the channel for ticket transcripts",
      "dashboard_description": "Set the channel for the dashboard",
      "weekly_report_description": "Set the channel for weekly reports",
      "live_members_description": "Set the voice channel for live member count",
      "live_role_description": "Set the voice channel for live role count",
      "staff_role_description": "Set the staff role",
      "admin_role_description": "Set the admin role",
      "verify_role_description": "Set the verification role",
      "max_tickets_description": "Set maximum tickets per user",
      "global_limit_description": "Set global ticket limit",
      "cooldown_description": "Set ticket creation cooldown",
      "min_days_description": "Set minimum account age in days",
      "smart_ping_description": "Configure smart ping settings",
      "dm_open_description": "Configure DM on ticket open",
      "dm_close_description": "Configure DM on ticket close",
      "log_edits_description": "Configure message edit logging",
      "log_deletes_description": "Configure message delete logging",
      "option_channel": "Channel",
      "option_voice_channel": "Voice channel",
      "option_role": "Role",
      "option_role_to_count": "Role to count",
      "option_verify_role": "Verification role (leave empty to disable)",
      "option_count": "Count",
      "option_minutes": "Minutes",
      "option_days": "Days",
      "auto_close_description": "Configure automatic ticket closing",
      "sla_description": "Configure SLA settings"
    },
    "language": {
      "title": "Server language",
      "description": "Review or update the operational language TON618 uses in this server.",
      "current_value": "TON618 is currently operating in **{{label}}**.",
      "onboarding_completed": "Completed",
      "onboarding_pending": "Pending",
      "updated_value": "Language changed to **{{label}}**. TON618 will use this language for visible responses in this guild.",
      "fallback_note": "Guilds without an explicit selection continue using English until an administrator sets a language.",
      "audit_reason_manual": "manual_language_change",
      "audit_reason_onboarding": "onboarding_language_selection"
    },
    "suggestions": {
      "group_description": "Configure the suggestions system",
      "enabled_description": "Enable or disable suggestions",
      "channel_description": "Set the channel used for suggestions"
    },
    "confessions": {
      "group_description": "Configure anonymous confessions",
      "configure_description": "Set the channel and role used for confessions"
    },
    "panel": {
      "owner_only": "Only the user who opened this panel can use it.",
      "admin_only": "Only administrators can use this panel.",
      "invalid_action": "Invalid action.",
      "invalid_command": "No valid command was selected.",
      "error_prefix": "Error: {{message}}",
      "default_action_failed": "The action could not be applied.",
      "default_reset_failed": "The reset could not be completed.",
      "action_applied": "Action applied.",
      "reset_applied": "Reset applied."
    },
    "commands": {
      "mode_enable": "Enable",
      "mode_status": "Status",
      "mode_disable": "Disable",
      "summary_available": "Available: **{{count}}**",
      "summary_disabled": "Disabled: **{{count}}**",
      "summary_current_mode": "Current mode: **{{mode}}**",
      "summary_candidates": "Candidates in menu: **{{visible}}**{{hiddenText}}",
      "hidden_suffix": " (+{{count}} hidden)",
      "summary_result": "Result: {{notice}}",
      "panel_title": "Server command controls",
      "placeholder_action": "Select an action",
      "option_disable_label": "Disable command",
      "option_disable_description": "Block a command in this server",
      "option_enable_label": "Enable command",
      "option_enable_description": "Restore a previously disabled command",
      "option_status_label": "Command status",
      "option_status_description": "Check whether a command is enabled",
      "option_list_label": "List disabled",
      "option_list_description": "Show the disabled command summary",
      "option_reset_label": "Reset all",
      "option_reset_description": "Re-enable every disabled command",
      "placeholder_target": "Command to {{action}}",
      "no_candidates_label": "No commands available",
      "no_candidates_description": "Switch actions to see more options",
      "candidate_description_status": "Check current status",
      "candidate_description_enable": "Enable command",
      "candidate_description_disable": "Disable command",
      "format_more": "- ... and {{count}} more",
      "list_none": "No commands are disabled in this server.\nAvailable: **{{available}}** | Enabled: **{{enabled}}**.",
      "list_heading": "Disabled commands ({{count}}):",
      "list_footer": "Available: **{{available}}** | Enabled: **{{enabled}}**.",
      "audit_disabled": "Command disabled",
      "audit_enabled": "Command enabled",
      "audit_reset": "Command reset",
      "audit_updated": "Command update",
      "audit_affected": "Affected command: `/{{command}}`",
      "audit_global": "A global command change was applied.",
      "audit_executed_by": "Executed by",
      "audit_server": "Server",
      "audit_before": "Before",
      "audit_after": "After",
      "list_embed_title": "Server commands",
      "status_embed_title": "Command status",
      "panel_notice": "Use the menus below to manage commands without typing names manually.",
      "unknown_command": "The command `/{{command}}` does not exist in this bot.",
      "status_result": "Status for `/{{command}}`: **{{state}}**.\nCurrently disabled commands: **{{count}}**.",
      "reset_noop": "No commands were disabled. Nothing to reset.",
      "reset_done": "Re-enabled **{{count}}** command(s).",
      "missing_command_name": "You must provide a valid command name.",
      "disable_setup_forbidden": "You cannot disable `/setup`, otherwise you could lock yourself out of configuration.",
      "already_disabled": "The command `/{{command}}` was already disabled.",
      "disabled_success": "Command `/{{command}}` disabled for this server.",
      "already_enabled": "The command `/{{command}}` was already enabled.",
      "enabled_success": "Command `/{{command}}` enabled again.",
      "group_description": "Manage which commands are available in this server",
      "disable_description": "Disable a command in this server",
      "enable_description": "Re-enable a previously disabled command",
      "status_description": "Check one command or view the current summary",
      "reset_description": "Re-enable every disabled command",
      "list_description": "List the commands currently disabled in this server",
      "panel_description": "Open the interactive command control panel"
    },
    "welcome": {
      "enabled_state": "Welcome messages are now **{{state}}**.",
      "channel_set": "Welcome channel set to {{channel}}.",
      "message_updated": "Welcome message updated.\nAvailable variables: {{vars}}",
      "title_updated": "Welcome title updated to **{{text}}**.",
      "invalid_color": "Invalid color. Use a 6 character hex code like `{{example}}`.",
      "color_updated": "Welcome color updated to **#{{hex}}**.",
      "footer_updated": "Welcome footer updated.",
      "invalid_url": "The URL must start with `https://`.",
      "banner_configured": "Welcome banner configured.",
      "banner_removed": "Welcome banner removed.",
      "visible": "Visible",
      "hidden": "Hidden",
      "avatar_state": "Member avatar in welcome messages: **{{state}}**.",
      "dm_state": "Welcome DM is now **{{state}}**.{{messageNote}}",
      "dm_message_note": "\nThe DM body was updated as well.",
      "autorole_set": "Auto role configured: {{role}}",
      "autorole_disabled": "Auto role disabled.",
      "test_requires_channel": "Configure a welcome channel first with `/setup welcome channel`.",
      "test_channel_missing": "Configured welcome channel not found.",
      "test_default_title": "Welcome!",
      "test_default_message": "Welcome {mention}!",
      "test_field_user": "User",
      "test_field_account_created": "Account created",
      "test_field_member_count": "Member count",
      "test_message_suffix": "*(test message)*",
      "test_sent": "Test welcome message sent to {{channel}}.",
      "group_description": "Configure welcome messages and onboarding prompts",
      "enabled_description": "Enable or disable welcome messages",
      "channel_description": "Set the channel used for welcome messages",
      "message_description": "Update the welcome message",
      "title_description": "Update the welcome embed title",
      "color_description": "Set the welcome embed color (hex)",
      "footer_description": "Update the welcome embed footer",
      "banner_description": "Set or clear the welcome banner image",
      "avatar_description": "Show or hide the new member avatar",
      "dm_description": "Configure the welcome direct message",
      "autorole_description": "Set the role assigned automatically on join",
      "test_description": "Send a test welcome message"
    },
    "goodbye": {
      "enabled_state": "Goodbye messages are now **{{state}}**.",
      "channel_set": "Goodbye channel set to {{channel}}.",
      "message_updated": "Goodbye message updated.\nAvailable variables: {{vars}}",
      "title_updated": "Goodbye title updated to **{{text}}**.",
      "invalid_color": "Invalid color. Use a 6 character hex code like `{{example}}`.",
      "color_updated": "Goodbye color updated to **#{{hex}}**.",
      "footer_updated": "Goodbye footer updated.",
      "visible": "Visible",
      "hidden": "Hidden",
      "avatar_state": "Member avatar in goodbye messages: **{{state}}**.",
      "test_requires_channel": "Configure a goodbye channel first with `/setup goodbye channel`.",
      "test_channel_missing": "Configured goodbye channel not found.",
      "test_default_title": "See you later",
      "test_default_message": "**{user}** left the server.",
      "test_field_user": "User",
      "test_field_user_id": "User ID",
      "test_field_remaining_members": "Remaining members",
      "test_field_roles": "Roles",
      "test_roles_value": "Test payload only",
      "test_sent": "Test goodbye message sent to {{channel}}.",
      "group_description": "Configure goodbye messages",
      "enabled_description": "Enable or disable goodbye messages",
      "channel_description": "Set the channel used for goodbye messages",
      "message_description": "Update the goodbye message",
      "title_description": "Update the goodbye embed title",
      "color_description": "Set the goodbye embed color (hex)",
      "footer_description": "Update the goodbye embed footer",
      "avatar_description": "Show or hide the departing member avatar",
      "test_description": "Send a test goodbye message"
    },
    "slash": {
      "description": "Configure the server operational settings",
      "subcommands": {
        "language": {
          "description": "Review or update the bot language for this server"
        }
      },
      "options": {
        "language_value": "Language to use for visible bot responses"
      },
      "choices": {
        "english": "English",
        "spanish": "Spanish"
      },
      "groups": {
        "commands": {
          "description": "Manage which commands are available in this server",
          "subcommands": {
            "disable": {
              "description": "Disable a command in this server"
            },
            "enable": {
              "description": "Re-enable a previously disabled command"
            },
            "status": {
              "description": "Check one command or view the current summary"
            },
            "reset": {
              "description": "Re-enable every disabled command"
            },
            "list": {
              "description": "List the commands currently disabled in this server"
            },
            "panel": {
              "description": "Open the interactive command control panel"
            }
          },
          "options": {
            "command_required": "Command name without `/`",
            "command_optional": "Command name without `/` (optional)"
          }
        },
        "welcome": {
          "description": "Configure welcome messages and onboarding prompts",
          "subcommands": {
            "enabled": {
              "description": "Enable or disable welcome messages"
            },
            "channel": {
              "description": "Set the channel used for welcome messages"
            },
            "message": {
              "description": "Update the welcome message. Variables: {{vars}}"
            },
            "title": {
              "description": "Update the welcome embed title"
            },
            "color": {
              "description": "Set the welcome embed color (hex)"
            },
            "footer": {
              "description": "Update the welcome embed footer"
            },
            "banner": {
              "description": "Set or clear the welcome banner image"
            },
            "avatar": {
              "description": "Show or hide the new member avatar"
            },
            "dm": {
              "description": "Configure the welcome direct message"
            },
            "autorole": {
              "description": "Set the role assigned automatically on join"
            },
            "test": {
              "description": "Send a test welcome message"
            }
          },
          "options": {
            "enabled": "Whether welcome messages remain enabled",
            "channel": "Welcome channel",
            "text": "Message content",
            "title_text": "Embed title",
            "hex": "Hex color without `#`",
            "footer_text": "Footer text",
            "url": "Image URL starting with `https://`",
            "show": "Show the member avatar",
            "dm_enabled": "Whether welcome DMs remain enabled",
            "dm_message": "DM content. Variables: {{vars}}",
            "role": "Role to assign on join (leave empty to disable)"
          }
        },
        "goodbye": {
          "description": "Configure goodbye messages",
          "subcommands": {
            "enabled": {
              "description": "Enable or disable goodbye messages"
            },
            "channel": {
              "description": "Set the channel used for goodbye messages"
            },
            "message": {
              "description": "Update the goodbye message. Variables: {{vars}}"
            },
            "title": {
              "description": "Update the goodbye embed title"
            },
            "color": {
              "description": "Set the goodbye embed color (hex)"
            },
            "footer": {
              "description": "Update the goodbye embed footer"
            },
            "avatar": {
              "description": "Show or hide the departing member avatar"
            },
            "test": {
              "description": "Send a test goodbye message"
            }
          },
          "options": {
            "enabled": "Whether goodbye messages remain enabled",
            "channel": "Goodbye channel",
            "text": "Message content",
            "title_text": "Embed title",
            "hex": "Hex color without `#`",
            "footer_text": "Footer text",
            "show": "Show the member avatar"
          }
        },
        "tickets": {
          "description": "Configure ticket system settings",
          "subcommands": {
            "panel": {
              "description": "Publish or update the ticket panel"
            },
            "sla": {
              "description": "Configure SLA warning and escalation"
            },
            "sla-rule": {
              "description": "Add or update an SLA rule by priority or category"
            },
            "panel-style": {
              "description": "Set the ticket panel style"
            },
            "auto-assignment": {
              "description": "Configure auto-assignment behavior"
            },
            "welcome-message": {
              "description": "Set a custom welcome message for new tickets"
            },
            "control-embed": {
              "description": "Customize the ticket control embed"
            }
          },
          "options": {
            "warning_minutes": "Minutes before SLA warning",
            "escalation_enabled": "Enable escalation",
            "escalation_minutes": "Minutes before escalation",
            "escalation_role": "Role to ping on escalation",
            "escalation_channel": "Channel for escalation alerts",
            "rule_type": "Rule type",
            "rule_minutes": "Minutes threshold",
            "target_priority": "Target priority",
            "target_category": "Target category",
            "style": "Panel style",
            "enabled": "Enable or disable",
            "mode": "Assignment mode",
            "require_online": "Require online status",
            "welcome_message": "Welcome message content",
            "reset": "Reset to default",
            "control_title": "Control embed title",
            "control_description": "Control embed description",
            "control_footer": "Control embed footer",
            "color": "Embed color (hex)"
          },
          "choices": {
            "sla_warning": "Warning",
            "sla_escalation": "Escalation",
            "style_buttons": "Buttons",
            "style_select": "Select menu",
            "mode_round_robin": "Round robin",
            "mode_random": "Random",
            "mode_least_active": "Least active"
          }
        },
        "automod": {
          "status_title": "AutoMod Status - {{guildName}}",
          "status_enabled": "TON618 AutoMod management is enabled for this guild.",
          "status_disabled": "TON618 AutoMod management is disabled for this guild.",
          "field_managed_rules": "Managed Rules",
          "field_alerts_exemptions": "Alerts and Exemptions",
          "field_sync_state": "Sync State",
          "field_permissions": "Permissions",
          "live_count": "Live count: `{{live}}/{{desired}}`",
          "stored_rule_ids": "Stored rule IDs: `{{count}}`",
          "no_presets": "No AutoMod presets selected.",
          "alert_channel": "Alert channel: {{channel}}",
          "alert_not_configured": "Not configured",
          "exempt_roles": "Exempt roles: {{roles}}",
          "exempt_channels": "Exempt channels: {{channels}}",
          "none": "None",
          "last_sync": "Last sync: {{timestamp}}",
          "never": "Never",
          "sync_result": "Result: `{{status}}`",
          "sync_summary": "Summary: {{summary}}",
          "no_sync_recorded": "No sync recorded yet.",
          "permissions_ok": "All required permissions are present",
          "rule_live": "live",
          "rule_missing": "missing",
          "error_no_presets": "No AutoMod presets are active. Enable at least one preset before bootstrapping.",
          "error_not_enabled": "AutoMod is not enabled for this guild yet. Run `/setup automod bootstrap` first.",
          "error_no_active_presets": "No AutoMod presets are active. Re-enable a preset or use `/setup automod disable`.",
          "error_provide_channel_or_clear": "Provide `channel`, or set `clear: true`.",
          "error_provide_channel_or_reset": "Provide `channel`, or use `action: reset`.",
          "error_provide_role_or_reset": "Provide `role`, or use `action: reset`.",
          "error_unknown_action": "Unknown action. Use add, remove, or reset.",
          "error_unknown_preset": "Unknown preset selection.",
          "info_already_exempt_channel": "{{channel}} is already exempt.",
          "info_already_exempt_role": "{{role}} is already exempt.",
          "error_max_exempt_channels": "AutoMod only supports up to 50 exempt channels per guild.",
          "error_max_exempt_roles": "AutoMod only supports up to 20 exempt roles per guild.",
          "success_alert_cleared": "AutoMod alert channel cleared.\n{{hint}}",
          "success_alert_set": "AutoMod alert channel set to {{channel}}.\n{{hint}}",
          "success_exempt_channels_updated": "AutoMod exempt channels updated. Total: `{{count}}`.\n{{hint}}",
          "success_exempt_roles_updated": "AutoMod exempt roles updated. Total: `{{count}}`.\n{{hint}}",
          "success_presets_updated": "AutoMod presets updated: {{summary}}.\n{{followUp}}",
          "presets_none": "No presets selected",
          "hint_sync": "Run `/setup automod sync` to apply this change to Discord.",
          "hint_bootstrap": "Run `/setup automod bootstrap` when you're ready to create the managed rules.",
          "hint_disable": "Use `/setup automod disable` to remove existing rules, or re-enable a preset before syncing.",
          "bootstrap_created": "Created {{count}} TON618 AutoMod rule{{plural}}.",
          "bootstrap_no_new": "No new TON618 AutoMod rules were needed.",
          "sync_summary_line": "Updated {{updated}} rule{{updatedPlural}}, recreated {{created}} missing rule{{createdPlural}}, removed {{removed}} stale rule{{removedPlural}}.",
          "disable_removed": "Removed {{count}} TON618-managed AutoMod rule{{plural}}.",
          "disable_no_rules": "No TON618-managed AutoMod rules were present.",
          "disable_partial": "Removed {{removed}} rule{{removedPlural}}, preserved {{preserved}} due to errors.",
          "permission_failure": "Skipped {{action}}: missing {{permissions}}.",
          "permission_failure_generic": "Skipped {{action}}: permission check failed.",
          "fetch_error": "Skipped {{action}}: {{message}}",
          "fetch_error_generic": "Could not inspect AutoMod rules.",
          "description": "Configure AutoMod rules and exemptions",
          "subcommands": {
            "bootstrap": {
              "description": "Create initial AutoMod rules"
            },
            "status": {
              "description": "View AutoMod configuration status"
            },
            "sync": {
              "description": "Sync AutoMod rules with current settings"
            },
            "disable": {
              "description": "Remove all managed AutoMod rules"
            },
            "channel-alert": {
              "description": "Set or clear the AutoMod alert channel"
            },
            "exempt-channel": {
              "description": "Manage exempt channels"
            },
            "exempt-role": {
              "description": "Manage exempt roles"
            },
            "preset": {
              "description": "Enable or disable an AutoMod preset"
            }
          },
          "options": {
            "channel": "Channel to receive AutoMod alerts",
            "clear": "Clear the alert channel",
            "action": "Action to perform",
            "target_channel": "Channel to exempt",
            "target_role": "Role to exempt",
            "preset_name": "Preset name",
            "enabled": "Enable or disable this preset"
          },
          "choices": {
            "add": "Add",
            "remove": "Remove",
            "reset": "Reset",
            "preset_spam": "Spam",
            "preset_invites": "Invites",
            "preset_scam": "Scam links",
            "preset_all": "All presets"
          }
        }
      }
    },
    "tickets": {
      "group_description": "Configure ticket system settings",
      "panel_description": "Publish or update the ticket panel",
      "sla_description": "Configure SLA warning and escalation",
      "sla_rule_description": "Add or update an SLA rule by priority or category",
      "panel_style_description": "Set the ticket panel style",
      "auto_assignment_description": "Configure auto-assignment behavior",
      "welcome_message_description": "Set a custom welcome message for new tickets",
      "control_embed_description": "Customize the ticket control embed",
      "option_warning_minutes": "Minutes before SLA warning",
      "option_escalation_enabled": "Enable escalation",
      "option_escalation_minutes": "Minutes before escalation",
      "option_escalation_role": "Role to ping on escalation",
      "option_escalation_channel": "Channel for escalation alerts",
      "option_rule_type": "Rule type",
      "option_rule_minutes": "Minutes threshold",
      "option_target_priority": "Target priority",
      "option_target_category": "Target category",
      "option_style": "Panel style",
      "option_enabled": "Enable or disable",
      "option_mode": "Assignment mode",
      "option_require_online": "Require online status",
      "option_welcome_message": "Welcome message content",
      "option_reset": "Reset to default",
      "option_control_title": "Control embed title",
      "option_control_description": "Control embed description",
      "option_control_footer": "Control embed footer",
      "option_color": "Embed color (hex)",
      "choice_sla_warning": "Warning",
      "choice_sla_escalation": "Escalation",
      "choice_style_buttons": "Buttons",
      "choice_style_select": "Select menu",
      "choice_mode_round_robin": "Round robin",
      "choice_mode_random": "Random",
      "choice_mode_least_active": "Least active",
      "incident_description": "Enable or disable incident mode",
      "daily_report_description": "Configure daily ticket reports",
      "option_active": "Enable or disable",
      "option_categories": "Affected categories (comma-separated IDs)",
      "option_incident_message": "Custom incident message",
      "option_report_channel": "Channel for daily reports",
      "option_panel_title": "Panel embed title",
      "option_panel_description": "Panel embed description",
      "option_panel_footer": "Panel embed footer",
      "option_respect_away": "Respect away status"
    },
    "automod": {
      "group_description": "Configure AutoMod rules and exemptions",
      "bootstrap_description": "Create initial AutoMod rules",
      "status_description": "View AutoMod configuration status",
      "sync_description": "Sync AutoMod rules with current settings",
      "disable_description": "Remove all managed AutoMod rules",
      "channel_alert_description": "Set or clear the AutoMod alert channel",
      "exempt_channel_description": "Manage exempt channels",
      "exempt_role_description": "Manage exempt roles",
      "preset_description": "Enable or disable an AutoMod preset",
      "option_channel": "Channel to receive AutoMod alerts",
      "option_clear": "Clear the alert channel",
      "option_action": "Action to perform",
      "option_target_channel": "Channel to exempt",
      "option_target_role": "Role to exempt",
      "option_preset_name": "Preset name",
      "option_enabled": "Enable or disable this preset",
      "choice_add": "Add",
      "choice_remove": "Remove",
      "choice_reset": "Reset",
      "choice_preset_spam": "Spam",
      "choice_preset_invites": "Invites",
      "choice_preset_scam": "Scam links",
      "choice_preset_all": "All presets",
      "preset_spam": "Spam",
      "preset_invites": "Invites",
      "preset_scam": "Scam links",
      "preset_all": "All presets"
    },
    "wizard": {
      "description": "Start the quick setup wizard",
      "option_dashboard": "Channel for the ticket dashboard",
      "option_logs": "Channel for ticket logs",
      "option_transcripts": "Channel for ticket transcripts",
      "option_staff": "Role for support staff",
      "option_admin": "Role for ticket administrators",
      "option_plan": "System operation plan",
      "option_sla_warning": "Minutes before first SLA warning",
      "option_sla_escalation": "Minutes before SLA escalation",
      "option_publish_panel": "Publish the ticket panel immediately"
    },
    "options": {
      "setup_language_value_value": "Language to use for visible bot responses",
      "setup_wizard_dashboard_dashboard": "Main dashboard and panel channel",
      "setup_wizard_logs_logs": "Log channel (optional)",
      "setup_wizard_transcripts_transcripts": "Transcript channel (optional)",
      "setup_wizard_staff_staff": "Staff role (optional)",
      "setup_wizard_admin_admin": "Bot admin role (optional)",
      "setup_wizard_plan_plan": "Initial server plan",
      "setup_wizard_sla-warning-minutes_sla-warning-minutes": "Base SLA warning threshold in minutes",
      "setup_wizard_sla-escalation-minutes_sla-escalation-minutes": "Base SLA escalation threshold in minutes",
      "setup_wizard_publish-panel_publish-panel": "Publish the ticket panel immediately",
      "setup_general_logs_channel_channel": "Channel",
      "setup_general_transcripts_channel_channel": "Channel",
      "setup_general_dashboard_channel_channel": "Channel",
      "setup_general_weekly-report_channel_channel": "Channel",
      "setup_general_live-members_channel_channel": "Voice channel",
      "setup_general_live-role_channel_channel": "Voice channel",
      "setup_general_live-role_role_role": "Role to count",
      "setup_general_staff-role_role_role": "Role",
      "setup_general_admin-role_role_role": "Role",
      "setup_general_verify-role_role_role": "Verification role (leave empty to disable)",
      "setup_general_max-tickets_count_count": "Count",
      "setup_general_global-limit_count_count": "Count",
      "setup_general_cooldown_minutes_minutes": "Minutes",
      "setup_general_min-days_days_days": "Days",
      "setup_general_auto-close_minutes_minutes": "Minutes",
      "setup_general_sla_minutes_minutes": "Minutes",
      "setup_general_smart-ping_minutes_minutes": "Minutes",
      "setup_general_dm-open_enabled_enabled": "Enable or disable",
      "setup_general_dm-close_enabled_enabled": "Enable or disable",
      "setup_general_log-edits_enabled_enabled": "Enable or disable",
      "setup_general_log-deletes_enabled_enabled": "Enable or disable",
      "setup_general_language_value_value": "Language to use for visible bot responses",
      "setup_automod_channel-alert_channel_channel": "Channel to receive AutoMod alerts",
      "setup_automod_channel-alert_clear_clear": "Clear the alert channel",
      "setup_automod_exempt-channel_action_action": "Action to perform",
      "setup_automod_exempt-channel_channel_channel": "Channel to exempt",
      "setup_automod_exempt-role_action_action": "Action to perform",
      "setup_automod_exempt-role_role_role": "Role to exempt",
      "setup_automod_preset_name_name": "Preset name",
      "setup_automod_preset_enabled_enabled": "Enable or disable this preset",
      "setup_tickets_sla_warning-minutes_warning-minutes": "Minutes before SLA warning",
      "setup_tickets_sla_escalation-enabled_escalation-enabled": "Enable escalation",
      "setup_tickets_sla_escalation-minutes_escalation-minutes": "Minutes before escalation",
      "setup_tickets_sla_escalation-role_escalation-role": "Role to ping on escalation",
      "setup_tickets_sla_escalation-channel_escalation-channel": "Channel for escalation alerts",
      "setup_tickets_sla-rule_type_type": "Rule type",
      "setup_tickets_sla-rule_minutes_minutes": "Minutes threshold",
      "setup_tickets_sla-rule_priority_priority": "Target priority",
      "setup_tickets_sla-rule_category_category": "Target category",
      "setup_tickets_auto-assignment_active_active": "Enable or disable",
      "setup_tickets_auto-assignment_require-online_require-online": "Require online status",
      "setup_tickets_auto-assignment_respect-away_respect-away": "Respect away status",
      "setup_tickets_incident_active_active": "Enable or disable",
      "setup_tickets_incident_categories_categories": "Affected categories (comma-separated IDs)",
      "setup_tickets_incident_message_message": "Custom incident message",
      "setup_tickets_daily-report_active_active": "Enable or disable",
      "setup_tickets_daily-report_channel_channel": "Channel for daily reports",
      "setup_tickets_panel-style_title_title": "Panel embed title",
      "setup_tickets_panel-style_description_description": "Panel embed description",
      "setup_tickets_panel-style_footer_footer": "Panel embed footer",
      "setup_tickets_panel-style_color_color": "Embed color (hex)",
      "setup_tickets_panel-style_reset_reset": "Reset to default",
      "setup_tickets_welcome-message_message_message": "Welcome message content",
      "setup_tickets_welcome-message_reset_reset": "Reset to default",
      "setup_tickets_control-embed_title_title": "Control embed title",
      "setup_tickets_control-embed_description_description": "Control embed description",
      "setup_tickets_control-embed_footer_footer": "Control embed footer",
      "setup_tickets_control-embed_color_color": "Embed color (hex)",
      "setup_tickets_control-embed_reset_reset": "Reset to default",
      "setup_suggestions_enabled_enabled_enabled": "Whether suggestions stay enabled",
      "setup_suggestions_channel_channel_channel": "Suggestions channel",
      "setup_confessions_configure_channel_channel": "Channel where confessions are posted",
      "setup_confessions_configure_role_role": "Role required to use confessions",
      "setup_welcome_enabled_enabled_enabled": "Whether welcome messages remain enabled",
      "setup_welcome_channel_channel_channel": "Welcome channel",
      "setup_welcome_message_text_text": "Message content",
      "setup_welcome_title_text_text": "Embed title",
      "setup_welcome_color_hex_hex": "Hex color without `#`",
      "setup_welcome_footer_text_text": "Footer text",
      "setup_welcome_banner_url_url": "Image URL starting with `https://`",
      "setup_welcome_avatar_show_show": "Show the member avatar",
      "setup_welcome_dm_enabled_enabled": "Whether welcome DMs remain enabled",
      "setup_welcome_dm_message_message": "DM content. Variables: `{mention}` `{user}` `{tag}` `{server}` `{count}` `{id}`",
      "setup_welcome_autorole_role_role": "Role to assign on join (leave empty to disable)",
      "setup_goodbye_enabled_enabled_enabled": "Whether goodbye messages remain enabled",
      "setup_goodbye_channel_channel_channel": "Goodbye channel",
      "setup_goodbye_message_text_text": "Message content",
      "setup_goodbye_title_text_text": "Embed title",
      "setup_goodbye_color_hex_hex": "Hex color without `#`",
      "setup_goodbye_footer_text_text": "Footer text",
      "setup_goodbye_avatar_show_show": "Show the member avatar",
      "setup_commands_disable_command_command": "Command name without `/`",
      "setup_commands_enable_command_command": "Command name without `/`",
      "setup_commands_status_command_command": "Command name without `/` (optional)"
    }
  },
  "status": {
    "commercial": "Commercial"
  },
  "verify": {
    "mode": {
      "button": "Button",
      "code": "DM code",
      "question": "Question"
    },
    "panel": {
      "title": "Verification",
      "description": "You need to verify before accessing the server. Click the button below to begin.",
      "footer": "{{guild}} • Verification",
      "start_label": "Verify me",
      "help_label": "Help"
    },
    "info": {
      "title": "Verification Configuration",
      "no_issues": "No issues detected.",
      "protection_footer": "Protection: {{failures}} failed attempts -> {{minutes}}m cooldown",
      "raid_action_pause": "Alert only",
      "raid_action_kick": "Kick automatically"
    },
    "inspection": {
      "channel_missing": "Verification channel is not configured.",
      "channel_deleted": "The configured verification channel no longer exists.",
      "channel_permissions": "I cannot publish the panel in {{channel}}. Missing permissions: {{permissions}}.",
      "verified_role_missing": "Verified role is not configured.",
      "verified_role_deleted": "The configured verified role no longer exists.",
      "verified_role_managed": "The verified role is managed by an integration and cannot be assigned by the bot.",
      "verified_role_unmanageable": "I cannot manage the verified role {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "unverified_role_deleted": "The configured unverified role no longer exists.",
      "unverified_role_managed": "The unverified role is managed by an integration and cannot be assigned by the bot.",
      "unverified_role_unmanageable": "I cannot manage the unverified role {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "roles_same": "Verified role and unverified role cannot be the same role.",
      "question_missing": "Question mode is enabled but the verification question is empty.",
      "answer_missing": "Question mode is enabled but the expected answer is empty.",
      "button_mode_antiraid_warning": "Button mode offers minimal protection against bots. Consider using 'code' or 'question' mode with anti-raid enabled.",
      "log_channel_deleted": "The configured verification log channel no longer exists.",
      "log_channel_permissions": "I cannot write to {{channel}}. Missing permissions: {{permissions}}.",
      "apply_verified_missing": "Verified role is not configured or no longer exists.",
      "apply_verified_unmanageable": "I cannot assign {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "apply_unverified_unmanageable": "I cannot remove {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "apply_role_update_failed": "I could not update the verification roles.",
      "welcome_autorole_missing": "The welcome auto-role is configured but no longer exists.",
      "welcome_autorole_failed": "I could not assign the welcome auto-role {{role}}.",
      "welcome_autorole_process_failed": "I could not process the welcome auto-role.",
      "revoke_verified_unmanageable": "I cannot remove {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "revoke_unverified_unmanageable": "I cannot assign {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "revoke_role_update_failed": "I could not update the verification roles.",
      "publish_failed": "I could not send or edit the verification panel in {{channel}}. Verify that I can send messages and embeds there."
    },
    "command": {
      "confirmation_dm": "Confirmation DM",
      "operational_health": "Operational health",
      "raid_threshold": "Raid threshold",
      "raid_action": "Raid action",
      "panel_saved_but_not_published": "The verification configuration was saved, but the panel could not be published.\n\n{{issues}}",
      "panel_refreshed": "Verification panel refreshed.",
      "panel_published": "Verification panel published.",
      "setup_failed": "I cannot finish the setup yet.\n\n{{issues}}",
      "setup_ready_title": "Verification Ready",
      "setup_ready_description": "The verification system is configured and the live panel is available.",
      "note_ticket_role_aligned": "Ticket minimum verification role was aligned automatically because it was not set.",
      "note_question_mode": "Question mode is active. Use `/verify question` if you want to replace the default challenge.",
      "panel_publish_failed": "The verification panel could not be published.\n\n{{issues}}",
      "enable_failed": "I cannot enable verification yet.\n\n{{issues}}",
      "enabled_state": "Verification is now **{{state}}**.",
      "mode_failed": "I cannot switch to **{{mode}}** yet.\n\n{{issues}}",
      "mode_changed": "Verification mode changed to **{{mode}}**. {{detail}}",
      "question_updated": "Verification question updated.",
      "message_require_one": "Provide at least one field to update: `title`, `description`, `color`, or `image`.",
      "invalid_color": "Invalid color. Use a 6-character hex value like `57F287`.",
      "invalid_image": "Image URL must start with `https://`.",
      "message_updated": "Verification panel updated. {{detail}}",
      "dm_updated": "Verification confirmation DM is now **{{state}}**.",
      "auto_kick_disabled": "Auto-kick for unverified members is now **disabled**.",
      "auto_kick_enabled": "Unverified members will be kicked after **{{hours}} hour(s)**.",
      "anti_raid_enabled": "Anti-raid is now **enabled**.\nThreshold: **{{joins}} joins** in **{{seconds}}s**.\nAction: **{{action}}**.",
      "anti_raid_disabled": "Anti-raid is now **disabled**.",
      "logs_permissions": "I cannot use {{channel}} for verification logs. Missing permissions: {{permissions}}.",
      "logs_set": "Verification logs will be sent to {{channel}}.",
      "force_bot": "Bots cannot be verified through the member verification flow.",
      "user_missing": "That user is not in this server.",
      "force_failed": "I could not verify <@{{userId}}>.\n\n{{issues}}",
      "force_success": "<@{{userId}}> was verified manually.{{warningText}}",
      "unverify_bot": "Bots do not use the member verification flow.",
      "unverify_failed": "I could not remove verification from <@{{userId}}>.\n\n{{issues}}",
      "unverify_success": "Verification removed from <@{{userId}}>.{{warningText}}",
      "stats_title": "Verification Stats",
      "stats_footer": "Stored verification events: {{total}}",
      "unknown_subcommand": "Unknown verification subcommand.",
      "security_title": "Security Settings",
      "security_footer": "Use /verify security with options to change settings",
      "min_account_age": "Min account age",
      "risk_escalation": "Risk escalation",
      "captcha_type": "CAPTCHA type",
      "captcha_math": "Math",
      "captcha_emoji": "Emoji count",
      "security_updated": "Security settings updated:\n{{changes}}",
      "security_age_set": "Minimum account age set to **{{days}} days**",
      "security_age_disabled": "Minimum account age check **disabled**",
      "security_risk_enabled": "Risk-based escalation **enabled**",
      "security_risk_disabled": "Risk-based escalation **disabled**",
      "security_captcha_set": "CAPTCHA type set to **{{type}}**",
      "pool_title": "Question Pool",
      "pool_empty": "No questions in the pool yet.\n\nUse `/verify question-pool add` to add questions.",
      "pool_footer": "Use /verify question-pool add to add questions",
      "pool_count": "{{count}} question(s) in pool",
      "pool_max_reached": "Maximum of 20 questions reached. Remove some before adding more.",
      "pool_added": "Question added: **{{question}}...**\nTotal questions: {{total}}",
      "pool_removed": "Question removed: **{{question}}...**\nRemaining: {{remaining}}",
      "pool_cleared": "Cleared {{count}} question(s) from the pool.",
      "pool_invalid_index": "Invalid index. Use a number between 1 and {{max}}.",
      "pool_pro_feature": "More than 5 questions in the pool",
      "risk_escalation_pro": "Risk-based verification escalation",
      "captcha_emoji_pro": "Emoji CAPTCHA type",
      "account_age_pro": "Account age requirement above {{max}} days",
      "force_log_title": "Member force-verified",
      "unverify_log_title": "Member unverified",
      "actor": "Actor",
      "member": "Member",
      "verified": "Verified",
      "failed": "Failed",
      "kicked": "Kicked",
      "starts": "Starts",
      "force_verified": "Force verified",
      "force_unverified": "Force unverified",
      "pending_members": "Pending members",
      "verified_members": "Verified members",
      "code_sends": "Code sends",
      "question_prompts": "Question prompts",
      "anti_raid_triggers": "Anti-raid triggers",
      "permission_errors": "Permission errors"
    },
    "handler": {
      "bot_missing_permissions": "The bot is missing permissions to verify you (Manage Roles).",
      "not_active": "Verification is not active in this server.",
      "member_not_found": "Your member profile could not be found in this server.",
      "already_verified": "You are already verified in this server.",
      "misconfigured": "Verification is currently misconfigured.\n\n{{issues}}",
      "too_many_attempts": "Too many failed attempts. Try again {{retryText}}.",
      "join_too_recent": "You joined too recently. Please wait {{retryText}} before verifying.",
      "account_too_new": "Your Discord account is too new. Accounts must be at least {{days}} days old to verify. Your account is {{currentDays}} days old.",
      "code_dm_title": "Verification Code",
      "code_dm_description": "Your verification code for **{{guild}}** is:\n\n# `{{code}}`\n\nThis code expires in **10 minutes**.\nReturn to the server and click **{{enterCodeLabel}}**.",
      "dm_failed": "I could not send you a DM.\n\nEnable direct messages for this server and try again.",
      "code_sent_title": "Code sent by DM",
      "code_sent_description": "An 8-character code was sent to your direct messages.\n\n1. Open your DM inbox and copy the code.\n2. Return here and click **{{enterCodeLabel}}**.\n\nThe code expires in **10 minutes**.",
      "code_sent_footer": "Resends are limited. Wait {{seconds}}s before requesting a new code.",
      "question_missing": "No verification question is configured. Ask an admin to run `/verify question`.",
      "question_modal_title": "Verification Question",
      "question_placeholder": "Type your answer here",
      "mode_invalid": "Verification mode is not configured correctly.",
      "help_title": "How verification works",
      "help_mode_button": "Click **Verify me** and the bot will verify you immediately.",
      "help_mode_code": "Click **Verify me**, check your DM inbox for the code, then enter it in the modal.",
      "help_mode_question": "Click **Verify me** and answer the verification question correctly.",
      "help_dm_problems_label": "DM problems?",
      "help_dm_problems": "Enable direct messages for this server and try again.",
      "help_attempts_label": "Attempts protection",
      "help_attempts": "After {{failures}} failed attempts, verification pauses for {{minutes}} minutes.",
      "help_blocked_label": "Still blocked?",
      "help_blocked": "Contact a server admin for manual help.",
      "enter_code_title": "Enter your code",
      "enter_code_label": "Code received by DM",
      "enter_code_placeholder": "Example: AB1C2D3E",
      "not_code_mode": "This verification mode does not use DM codes.",
      "code_reason_no_code": "No pending code was found. Click **Verify me** to generate a new one.",
      "code_reason_expired": "Your code expired. Click **Verify me** to generate a new one.",
      "code_reason_wrong": "Incorrect code. Try again.",
      "invalid_code": "Invalid verification code.",
      "incorrect_answer": "Incorrect answer. Read the question carefully and try again.{{cooldownText}}",
      "resend_wait": "Please wait before requesting another code. You can retry {{retryText}}.",
      "new_code_title": "New verification code",
      "new_code_description": "Your new verification code is:\n\n# `{{code}}`\n\nThis code expires in **10 minutes**.",
      "resend_dm_failed": "I could not send you a DM. Enable direct messages and try again.",
      "resend_success": "A new verification code was sent by DM.",
      "max_resends_reached": "You have reached the maximum number of code resends ({{max}}). Please wait or contact an admin.",
      "captcha_modal_title": "Security Check",
      "captcha_placeholder": "Type your answer",
      "captcha_reason_no_captcha": "No pending captcha found. Click **Verify me** to start again.",
      "captcha_reason_expired": "Your captcha expired. Click **Verify me** to get a new one.",
      "captcha_reason_wrong": "Incorrect answer. Try again.",
      "captcha_invalid": "Invalid captcha response.",
      "completion_failed": "I could not finish your verification because the role setup is not operational.\n\n{{issues}}",
      "completed_title": "Verification completed",
      "completed_description": "Welcome to **{{guild}}**, <@{{userId}}>. You now have full access to the server.",
      "verified_dm_title": "You are verified",
      "verified_dm_description": "You were verified successfully in **{{guild}}**.",
      "log_verified_title": "Member verified",
      "log_warning_none": "None"
    },
    "slash": {
      "description": "Configure the member verification system",
      "subcommands": {
        "setup": {
          "description": "Set up verification with the main channel and roles"
        },
        "panel": {
          "description": "Publish or refresh the verification panel"
        },
        "enabled": {
          "description": "Enable or disable verification"
        },
        "mode": {
          "description": "Change the verification mode"
        },
        "question": {
          "description": "Update the verification question and expected answer"
        },
        "message": {
          "description": "Customize the verification panel message"
        },
        "dm": {
          "description": "Enable or disable the verification confirmation DM"
        },
        "auto_kick": {
          "description": "Configure the auto-kick delay for unverified members"
        },
        "anti_raid": {
          "description": "Configure anti-raid protection for joins"
        },
        "logs": {
          "description": "Set the verification log channel"
        },
        "force": {
          "description": "Verify a member manually"
        },
        "unverify": {
          "description": "Remove verification from a member manually"
        },
        "stats": {
          "description": "View verification statistics"
        },
        "info": {
          "description": "View the current verification configuration"
        },
        "security": {
          "description": "Adjust account-age, CAPTCHA and risk settings"
        }
      },
      "options": {
        "channel": "Verification channel",
        "verified_role": "Role granted after verification",
        "mode": "Verification mode to use",
        "unverified_role": "Role assigned before verification",
        "enabled": "Whether the feature stays enabled",
        "type": "Verification mode to switch to",
        "prompt": "Verification prompt or question",
        "answer": "Expected answer",
        "title": "Panel title",
        "description": "Panel description",
        "color": "Embed color in hex without `#`",
        "image": "Image URL for the panel",
        "dm_enabled": "Whether confirmation DMs stay enabled",
        "hours": "Hours to wait before auto-kicking unverified members",
        "anti_raid_enabled": "Whether anti-raid protection stays enabled",
        "joins": "Join threshold before anti-raid triggers",
        "seconds": "Detection window in seconds",
        "action": "Action to take when anti-raid triggers",
        "log_channel": "Channel used for verification logs",
        "user_verify": "Member to verify manually",
        "user_unverify": "Member to unverify manually",
        "min_account_age": "Minimum account age in days",
        "risk_escalation": "Whether risky accounts should face stronger checks",
        "captcha_type": "CAPTCHA type to require"
      },
      "groups": {
        "question_pool": {
          "description": "Manage the random verification question pool",
          "subcommands": {
            "add": {
              "description": "Add a question to the pool"
            },
            "list": {
              "description": "List the current question pool"
            },
            "remove": {
              "description": "Remove one question from the pool"
            },
            "clear": {
              "description": "Clear the entire question pool"
            }
          },
          "options": {
            "question": "Question text",
            "answer": "Expected answer",
            "index": "Pool item number to remove"
          }
        }
      },
      "choices": {
        "mode": {
          "button": "Button",
          "code": "DM code",
          "question": "Question"
        },
        "anti_raid_action": {
          "pause": "Alert only",
          "kick": "Kick automatically"
        },
        "captcha_type": {
          "math": "Math",
          "emoji": "Emoji count"
        }
      }
    },
    "activity": {
      "anti_raid_triggered": "Anti-raid triggered",
      "unverified_kicked": "Unverified member kicked",
      "permission_error": "Permission error",
      "force_verified": "Manually verified",
      "force_unverified": "Verification removed manually",
      "panel_publish_failed": "Panel publish failed",
      "panel_published": "Panel published",
      "verified": "Verified",
      "unverified": "Unverified",
      "anti_raid": "Anti-raid",
      "kicked": "Kicked",
      "info": "Info"
    },
    "options": {
      "verify_setup_channel_channel": "Verification channel",
      "verify_setup_verified_role_verified_role": "Role granted after verification",
      "verify_setup_mode_mode": "Verification mode to use",
      "verify_setup_unverified_role_unverified_role": "Role assigned before verification",
      "verify_enabled_enabled_enabled": "Whether the feature stays enabled",
      "verify_mode_type_type": "Verification mode to switch to",
      "verify_question_prompt_prompt": "Verification prompt or question",
      "verify_question_answer_answer": "Expected answer",
      "verify_message_title_title": "Panel title",
      "verify_message_description_description": "Panel description",
      "verify_message_color_color": "Embed color in hex without `#`",
      "verify_message_image_image": "Image URL for the panel",
      "verify_dm_enabled_enabled": "Whether confirmation DMs stay enabled",
      "verify_auto-kick_hours_hours": "Hours to wait before auto-kicking unverified members",
      "verify_anti-raid_enabled_enabled": "Whether anti-raid protection stays enabled",
      "verify_anti-raid_joins_joins": "Join threshold before anti-raid triggers",
      "verify_anti-raid_seconds_seconds": "Detection window in seconds",
      "verify_anti-raid_action_action": "Action to take when anti-raid triggers",
      "verify_logs_channel_channel": "Channel used for verification logs",
      "verify_force_user_user": "Member to verify manually",
      "verify_unverify_user_user": "Member to unverify manually",
      "verify_question-pool_add_question_question": "Question text",
      "verify_question-pool_add_answer_answer": "Expected answer",
      "verify_question-pool_remove_index_index": "Pool item number to remove",
      "verify_security_min_account_age_min_account_age": "Minimum account age in days",
      "verify_security_risk_escalation_risk_escalation": "Whether risky accounts should face stronger checks",
      "verify_security_captcha_type_captcha_type": "CAPTCHA type to require"
    }
  },
  "staff": {
    "slash": {
      "description": "Staff tools and ticket management",
      "subcommands": {
        "away_on": {
          "description": "Mark yourself as away (won't receive ticket assignments)"
        },
        "away_off": {
          "description": "Mark yourself as available again"
        },
        "my_tickets": {
          "description": "View your assigned and claimed tickets"
        },
        "warn_add": {
          "description": "Add a warning to a user"
        },
        "warn_check": {
          "description": "Check warnings for a user"
        },
        "warn_remove": {
          "description": "Remove a warning by ID"
        }
      },
      "options": {
        "reason": "Reason for being away",
        "user": "User to warn or check",
        "warn_reason": "Reason for the warning",
        "warning_id": "Warning ID to remove"
      }
    },
    "moderation_required": "You need the `Moderate Members` permission for this subcommand.",
    "only_staff": "Only staff can use this command.",
    "away_on_title": "Away mode enabled",
    "away_on_description": "Your status is now **away**.{{reasonText}}",
    "away_on_footer": "Use /staff away-off when you are available again",
    "away_off": "You are now **available** for ticket work again.",
    "my_tickets_title": "My Tickets ({{count}})",
    "my_tickets_empty": "You do not currently own or hold any open tickets.",
    "ownership_claimed": "Claimed",
    "ownership_assigned": "Assigned",
    "ownership_watching": "Watching",
    "options": {
      "staff_away-on_reason_reason": "Reason for being away",
      "staff_warn-add_user_user": "User to warn or check",
      "staff_warn-add_reason_reason": "Reason for the warning",
      "staff_warn-check_user_user": "User to warn or check",
      "staff_warn-remove_id_id": "Warning ID to remove"
    }
  },
  "stats": {
    "server_title": "Ticket Operations - {{guild}}",
    "total": "Total",
    "open": "Open",
    "closed": "Closed",
    "today": "Today",
    "week": "This week",
    "avg_rating": "Average rating",
    "avg_response": "Avg response",
    "avg_close": "Avg close",
    "opened": "Opened",
    "no_data": "No data",
    "sla_title": "SLA - {{guild}}",
    "sla_description": "Operational SLA view for first response and escalation pressure.",
    "sla_threshold": "SLA threshold",
    "escalation": "Escalation",
    "escalation_threshold": "Escalation threshold",
    "sla_overrides": "SLA overrides",
    "escalation_overrides": "Escalation overrides",
    "open_out_of_sla": "Open tickets out of SLA",
    "open_escalated": "Open escalated tickets",
    "avg_first_response": "Avg first response",
    "sla_compliance": "SLA compliance",
    "tickets_evaluated": "Tickets evaluated",
    "no_sla_threshold": "No SLA threshold or no responses yet",
    "not_configured": "Not configured",
    "staff_no_data_title": "No data",
    "staff_no_data_description": "<@{{userId}}> does not have stats yet.",
    "no_ratings_yet": "No ratings yet",
    "ratings_count": "{{count}} ratings",
    "staff_title": "Staff Stats - {{user}}",
    "closed_tickets": "Closed tickets",
    "claimed_tickets": "Claimed tickets",
    "assigned_tickets": "Assigned tickets",
    "average_rating": "Average rating",
    "leaderboard_title": "Staff Leaderboard",
    "leaderboard_empty": "There is no staff data yet.",
    "leaderboard_closed": "closed",
    "leaderboard_claimed": "claimed",
    "ratings_title": "Ratings Leaderboard",
    "ratings_empty": "There are no ratings yet.",
    "period_all": "All time",
    "period_month": "Last month",
    "period_week": "Last week",
    "fallback_user": "User {{suffix}}",
    "fallback_staff": "Staff {{suffix}}",
    "staff_rating_title": "Ratings - {{user}}",
    "staff_rating_empty": "This staff member does not have recorded ratings yet.",
    "average_score": "Average score",
    "total_ratings": "Total ratings",
    "slash": {
      "description": "View ticket operations statistics",
      "subcommands": {
        "server": {
          "description": "View server-wide ticket metrics"
        },
        "sla": {
          "description": "View SLA compliance and escalation metrics"
        },
        "staff": {
          "description": "View stats for a staff member"
        },
        "leaderboard": {
          "description": "Rank staff by closed tickets"
        },
        "ratings": {
          "description": "Rank staff by ticket ratings"
        },
        "staff_rating": {
          "description": "View detailed ratings for a staff member"
        }
      }
    },
    "options": {
      "stats_staff_user_user": "Staff member to inspect",
      "stats_ratings_period_period": "Time period to display",
      "stats_staff-rating_user_user": "Staff member"
    }
  },
  "commercial": {
    "lines": {
      "current_plan": "Current plan: `{{plan}}`",
      "stored_plan": "Stored plan: `{{plan}}`",
      "plan_source": "Plan source: `{{source}}`",
      "plan_expires": "Plan expires: {{value}}",
      "supporter": "Supporter: {{value}}",
      "status_expired": "Plan status: `expired -> running as free`",
      "plan_note": "Plan note: {{note}}",
      "supporter_expires": "Supporter expires: `{{date}}`"
    },
    "values": {
      "unknown": "unknown",
      "never": "Never",
      "enabled": "Enabled",
      "inactive": "Inactive"
    },
    "pro_required": {
      "title": "Pro required",
      "description": "**{{feature}}** is part of the Pro plan.\nAsk the bot owner to activate Pro for this server manually.",
      "current_plan": "Current plan",
      "supporter": "Supporter",
      "upgrade_label": "🚀 Upgrade to Pro",
      "upgrade_cta": "Get Pro — open a ticket in our support server",
      "button_label": "Get Pro",
      "footer": "Donations never unlock premium features. Supporter status is recognition only."
    }
  },
  "premium": {
    "guild_only": "This command only works in servers.",
    "owner_only": "Only the server owner can use this command.",
    "error_fetching": "I couldn't fetch your membership information. Please try again later.",
    "error_generic": "An error occurred while processing your request.",
    "status_title": "Your Membership Status",
    "pro_active": "✅ You have an active PRO membership with access to all premium features.",
    "free_plan": "ℹ️ You're using the FREE plan. Upgrade to PRO to unlock advanced features.",
    "plan_label": "Plan",
    "status_label": "Status",
    "time_remaining": "Time remaining",
    "expires_tomorrow": "🚨 **Expires tomorrow!** Renew urgently.",
    "expires_soon": "⚠️ **Expires in {{days}} days!** Don't forget to renew.",
    "expires_week": "⏰ Expires in **{{days}} days**. Prepare to renew.",
    "expires_in": "📅 Expires in **{{days}} days**.",
    "started_at": "Started",
    "expires_at": "Expires on",
    "source_label": "Source",
    "supporter_status": "Supporter Status",
    "supporter_active": "✅ Active",
    "active": "Active",
    "reminder": {
      "title_7": "⏰ Your PRO membership expires in 7 days",
      "title_3": "⚠️ Your PRO membership expires in 3 days",
      "title_1": "🚨 Your PRO membership expires tomorrow",
      "description_7": "Your PRO membership for **{{guildName}}** will expire in **7 days**.\n\nRenew now to keep all premium features active.",
      "description_3": "Your PRO membership for **{{guildName}}** will expire in **3 days**.\n\nDon't lose access to premium features! Renew before it's too late.",
      "description_1": "⏰ **URGENT**: Your PRO membership for **{{guildName}}** expires **tomorrow**.\n\nRenew immediately or you will lose access to all premium features.",
      "field_server": "Server",
      "field_days_remaining": "Days remaining",
      "field_plan": "Plan",
      "footer": "TON618 - Membership System"
    },
    "upgrade_label": "🚀 Upgrade to Pro",
    "upgrade_cta": "Get Pro — open a ticket in our support server",
    "slash": {
      "description": "View your premium membership status",
      "status": "See how much time is left on your premium membership"
    }
  },
  "audit": {
    "slash": {
      "description": "Administrative audits and exports",
      "subcommands": {
        "tickets": {
          "description": "Export tickets to CSV with filters"
        }
      }
    },
    "options": {
      "status": "Filter by ticket status",
      "priority": "Filter by priority",
      "category": "Filter by category",
      "from": "Start date in YYYY-MM-DD",
      "to": "End date in YYYY-MM-DD",
      "limit": "Maximum rows (1-500)"
    },
    "unsupported_subcommand": "Unsupported subcommand.",
    "invalid_from": "Invalid 'from' date. Use YYYY-MM-DD.",
    "invalid_to": "Invalid 'to' date. Use YYYY-MM-DD.",
    "invalid_range": "'from' date must be before 'to' date.",
    "title": "Audit Export",
    "empty": "No tickets found matching those filters.",
    "rows": "Total rows",
    "status_label": "Status",
    "priority_label": "Priority",
    "category_label": "Category",
    "from_label": "From",
    "to_label": "To",
    "export_title": "📊 Audit Export Generated",
    "all": "All",
    "none": "None"
  },
  "debug": {
    "access_denied": "You do not have permission to use debug commands.",
    "unknown_subcommand": "Unknown subcommand.",
    "no_connected_guilds": "There are no connected guilds.",
    "title": {
      "status": "Bot Status",
      "automod": "AutoMod Badge Progress",
      "health": "Bot Health",
      "memory": "Memory Usage",
      "cache": "Cache State",
      "guilds": "Connected Guilds",
      "voice": "Music Subsystem",
      "entitlements": "Guild Entitlements",
      "plan_updated": "Plan Updated",
      "supporter_updated": "Supporter Updated"
    },
    "description": {
      "automod": "Owner-only live count of TON618-managed AutoMod rules across connected guilds.",
      "health": "Active-window snapshot plus the latest persisted heartbeat.",
      "cache": "Discord.js manages cache automatically.",
      "voice": "Music queues are managed per guild."
    },
    "field": {
      "api_ping": "API ping",
      "uptime": "Uptime",
      "guilds": "Guilds",
      "cached_users": "Cached users",
      "cached_channels": "Cached channels",
      "deploy": "Deploy",
      "progress": "Progress",
      "guild_coverage": "Guild Coverage",
      "quick_state": "Quick state",
      "interaction_window": "Interaction window",
      "heartbeat": "Heartbeat",
      "top_errors": "Top errors",
      "rss": "RSS",
      "heap_total": "Heap total",
      "heap_used": "Heap used",
      "external": "External",
      "users": "Users",
      "channels": "Channels",
      "guilds_live_rules": "Guilds With Live TON618 Rules",
      "guilds_attention": "Guilds Needing Attention"
    },
    "value": {
      "app_flag_present": "App flag present: {{value}}",
      "managed_rules": "Managed rules: `{{count}}`",
      "remaining_to_goal": "Remaining to {{goal}}: `{{count}}`",
      "automod_enabled": "AutoMod enabled: `{{count}}`",
      "missing_permissions": "Missing permissions: `{{count}}`",
      "failed_partial_sync": "Failed or partial sync: `{{count}}`",
      "ping_state": "Ping: **{{state}}** ({{value}}ms, threshold {{threshold}}ms)",
      "error_rate": "Error rate: **{{state}}** ({{value}}%, threshold {{threshold}}%)",
      "interaction_totals": "Total: `{{total}}`\nOK/Error/Denied/Rate: `{{ok}}/{{errors}}/{{denied}}/{{rateLimited}}`",
      "heartbeat": "Last seen: `{{lastSeen}}`\nGuilds: `{{guilds}}`",
      "yes": "Yes",
      "no": "No",
      "high": "HIGH",
      "ok": "OK"
    },
    "slash": {
      "description": "Owner-only diagnostics and entitlement tools",
      "subcommands": {
        "status": {
          "description": "View bot status and deploy info"
        },
        "automod_badge": {
          "description": "View live AutoMod badge progress across guilds"
        },
        "health": {
          "description": "View live health and heartbeat state"
        },
        "memory": {
          "description": "View process memory usage"
        },
        "cache": {
          "description": "View bot cache sizes"
        },
        "guilds": {
          "description": "List connected guilds"
        },
        "voice": {
          "description": "View music subsystem status"
        },
        "entitlements_set_plan": {
          "description": "Set a guild plan manually"
        },
        "entitlements_set_supporter": {
          "description": "Enable or disable supporter recognition"
        },
        "entitlements_status": {
          "description": "Inspect the effective plan and supporter state for a guild"
        }
      }
    },
    "options": {
      "debug_entitlements_status_guild_id_guild_id": "Target guild ID",
      "debug_entitlements_set-plan_guild_id_guild_id": "Target guild ID",
      "debug_entitlements_set-plan_tier_tier": "Plan tier",
      "debug_entitlements_set-plan_expires_in_days_expires_in_days": "Optional duration in days for Pro",
      "debug_entitlements_set-plan_note_note": "Optional internal note",
      "debug_entitlements_set-supporter_guild_id_guild_id": "Target guild ID",
      "debug_entitlements_set-supporter_active_active": "Enable or disable supporter recognition",
      "debug_entitlements_set-supporter_expires_in_days_expires_in_days": "Optional duration in days for supporter status",
      "debug_entitlements_set-supporter_note_note": "Optional internal note"
    }
  },
  "ticket": {
    "footer": "TON618 Tickets",
    "error_label": "Error",
    "field_category": "Category",
    "field_priority": "Priority",
    "field_assigned_to": "Assigned to",
    "priority": {
      "low": "Low",
      "normal": "Normal",
      "high": "High",
      "urgent": "Urgent"
    },
    "workflow": {
      "waiting_staff": "Waiting for staff",
      "waiting_user": "Waiting for user",
      "triage": "Under review",
      "assigned": "Assigned",
      "open": "Open",
      "closed": "Closed"
    },
    "quick_actions": {
      "priority_low": "Priority: Low",
      "priority_normal": "Priority: Normal",
      "priority_high": "Priority: High",
      "priority_urgent": "Priority: Urgent",
      "status_wait": "Status: Waiting for staff",
      "status_pending": "Status: Waiting for user",
      "status_review": "Status: Under review",
      "placeholder": "Quick staff actions..."
    },
    "quick_feedback": {
      "only_staff": "Only staff can use these actions.",
      "not_found": "Ticket information was not found.",
      "closed": "Quick actions are not available on closed tickets.",
      "priority_event_title": "Priority updated",
      "priority_event_description": "{{userTag}} updated ticket #{{ticketId}} priority to {{priority}} from quick actions.",
      "priority_updated": "Ticket priority updated to **{{label}}** by <@{{userId}}>.",
      "workflow_event_title": "Workflow status updated",
      "workflow_event_description": "{{userTag}} updated ticket #{{ticketId}} workflow status to {{status}} from quick actions.",
      "workflow_updated": "Ticket status updated to **{{label}}** by <@{{userId}}>.",
      "add_staff_prompt": "Mention the staff member you want to add to this ticket.",
      "unknown_action": "Unknown action.",
      "processing_error": "There was an error while processing this action."
    },
    "buttons": {
      "close": "Close",
      "claim": "Claim",
      "claimed": "Claimed",
      "transcript": "Transcript"
    },
    "rating": {
      "invalid_identifier_title": "Could not save your rating",
      "invalid_identifier_description": "The identifier for this rating prompt is invalid.",
      "invalid_value_title": "Invalid rating",
      "invalid_value_description": "Select a score between 1 and 5 stars.",
      "prompt_title": "Rate the support you received",
      "prompt_description": "Hi <@{{userId}}>, your ticket **#{{ticketId}}** has been closed.\n\n**Rating required:** you must rate this ticket before opening new tickets in the future.\n\nYour feedback helps us improve the service and maintain a strong support experience.",
      "prompt_staff_label": "Staff member",
      "prompt_category_fallback": "General",
      "prompt_footer": "Your opinion matters to us",
      "prompt_placeholder": "Select a rating...",
      "prompt_option_1_label": "1 star",
      "prompt_option_1_description": "The support did not meet my expectations",
      "prompt_option_2_label": "2 stars",
      "prompt_option_2_description": "The support was acceptable but needs improvement",
      "prompt_option_3_label": "3 stars",
      "prompt_option_3_description": "The support was solid and acceptable",
      "prompt_option_4_label": "4 stars",
      "prompt_option_4_description": "The support was very professional",
      "prompt_option_5_label": "5 stars",
      "prompt_option_5_description": "The support exceeded my expectations",
      "resend_wrong_user": "This button can only be used by the matching user.",
      "resend_clear": "**All clear!**\n\nYou no longer have any pending ticket ratings.\nYou can open a new ticket whenever you need one.",
      "resend_sent": "**Rating prompts resent**\n\nWe resent **{{successCount}}** rating prompt(s) to your DMs.\n\n**Check your DMs** to rate the pending tickets.{{warning}}",
      "resend_partial_warning": "Warning: {{failCount}} prompt(s) could not be resent.",
      "resend_failed": "**Could not resend the rating prompts**\n\nMake sure your DMs are open and try again.",
      "resend_error": "There was an error while resending the rating prompts. Please try again later.",
      "not_found_title": "Ticket not found",
      "not_found_description": "I could not find the ticket linked to this rating prompt.",
      "unavailable_title": "Rating unavailable",
      "unavailable_description": "Only the creator of this ticket can submit this rating.",
      "already_recorded_title": "Rating already recorded",
      "already_recorded_description": "You already rated this ticket with **{{rating}} star(s)**.",
      "already_recorded_processing": "This ticket was rated while your response was being processed.",
      "event_title": "Rating received",
      "event_description": "{{userTag}} rated ticket #{{ticketId}} with {{rating}}/5.",
      "thanks_title": "Thanks for your rating",
      "thanks_description": "You rated the support experience **{{rating}} star(s)**.\n\nYour feedback was recorded successfully and helps improve the service.",
      "save_failed_title": "Could not save your rating",
      "save_failed_description": "An unexpected error occurred. Please try again later."
    },
    "move_select": {
      "move_failed": "I could not move the ticket right now. Please try again later."
    },
    "transcript_button": {
      "not_ticket": "I could not generate the transcript because this channel is no longer registered as a ticket.",
      "unavailable_now": "I could not generate the ticket transcript right now.",
      "intro": "Here is the manual transcript for this ticket:",
      "error": "There was an error while generating the transcript. Please try again later."
    },
    "playbook": {
      "group_description": "Manage playbook recommendations",
      "list_description": "List active playbook recommendations",
      "confirm_description": "Confirm and apply a playbook recommendation",
      "dismiss_description": "Dismiss a playbook recommendation",
      "apply_macro_description": "Apply a playbook macro manually",
      "enable_description": "Enable a playbook for this server",
      "disable_description": "Disable a playbook for this server",
      "option_recommendation": "Recommendation ID",
      "option_playbook": "Playbook name"
    },
    "close_button": {
      "already_closed": "This ticket is already closed.",
      "bot_member_missing": "I could not verify my permissions in this server.",
      "missing_manage_channels": "I need the `Manage Channels` permission to close tickets.",
      "permission_denied_title": "Permission denied",
      "permission_denied_description": "Only staff can close tickets.",
      "modal_title": "Close ticket #{{ticketId}}",
      "reason_label": "Closing reason",
      "reason_placeholder": "Example: resolved, duplicate, request completed...",
      "notes_label": "Internal notes",
      "notes_placeholder": "Extra staff-only notes...",
      "close_note_event_title": "Close note added",
      "close_note_event_description": "{{userTag}} added an internal close note before closing ticket #{{ticketId}}.",
      "processing_title": "Processing closure",
      "processing_description": "Starting the close workflow and transcript generation...",
      "auto_close_failed": "I could not close the ticket automatically. Please try again or notify an administrator.",
      "modal_error": "There was an error while processing the ticket closure. Please try again later.",
      "open_form_error": "There was an error while opening the close form. Please try again."
    },
    "defaults": {
      "public_panel_title": "Need help? We're here for you.",
      "public_panel_description": "Open a private ticket by selecting the category that best fits your request.",
      "public_panel_footer": "{guild} • Professional support",
      "welcome_message": "Hi {user}, your ticket **{ticket}** has been created. Please share as much detail as possible.",
      "control_panel_title": "Ticket Control Panel",
      "control_panel_description": "This is the control panel for ticket **{ticket}**.\nUse the controls below to manage this ticket.",
      "control_panel_footer": "{guild} • TON618 Tickets"
    },
    "panel": {
      "categories_heading": "Choose a category",
      "categories_cta": "Choose an option from the menu below to get started.",
      "queue_name": "Current queue",
      "queue_value": "We currently have `{{openTicketCount}}` active ticket(s). We will reply as soon as possible.",
      "faq_button": "Frequently Asked Questions"
    },
    "create_flow": {
      "system_not_configured_title": "Ticket system not configured",
      "system_not_configured_description": "The ticket system is not configured correctly.\n\n**Problem:** there are no ticket categories configured.\n\n**Fix:** an administrator must create categories with:\n`/config category add`\n\nContact the server administration team to resolve this issue.",
      "system_not_configured_footer": "TON618 Tickets - Configuration error",
      "category_not_found": "Category not found.",
      "invalid_form": "The form is not valid. Please expand the first answer.",
      "min_days_required": "You must be in the server for at least **{{days}} day(s)** to open a ticket.",
      "blacklisted": "You are blacklisted.\n**Reason:** {{reason}}",
      "verify_role_required": "You need the role <@&{{roleId}}> to open tickets.",
      "pending_ratings_title": "Pending ticket ratings",
      "pending_ratings_description": "You have **{{count}}** closed ticket(s) waiting for a rating:\n\n{{tickets}}\n\n**Why does rating matter?**\nYour feedback helps us improve the service and is required before opening new tickets.\n\n**Check your DMs** to find the pending rating prompts.\nIf you cannot find them, use the button below to resend them.",
      "pending_ratings_footer": "TON618 Tickets - Rating system",
      "resend_ratings_button": "Resend rating prompts",
      "duplicate_request": "A ticket creation request is already being processed for you. Please wait a few seconds.",
      "global_limit": "This server reached the global limit of **{{limit}}** open tickets. Please wait until space is available.",
      "user_limit": "You already have **{{openCount}}/{{maxPerUser}}** open tickets{{suffix}}",
      "cooldown": "Please wait **{{minutes}} minute(s)** before opening another ticket.",
      "missing_permissions": "I do not have the permissions required to create tickets.\n\nRequired permissions: Manage Channels, View Channel, Send Messages, Manage Roles.",
      "self_permissions_error": "I could not verify my permissions in this server.",
      "welcome_message_failed": "The welcome message could not be sent.",
      "control_panel_failed": "The control panel could not be sent.",
      "dm_created_title": "Ticket created",
      "dm_created_description": "Your ticket **#{{ticketId}}** has been created in **{{guild}}**.\nChannel: <#{{channelId}}>\n\nWe will let you know when the staff replies.",
      "created_success_title": "Ticket created successfully",
      "created_success_description": "Your ticket has been created: <#{{channelId}}> | **#{{ticketId}}**\n\nPlease go to the channel to continue your request.{{warningText}}",
      "submitted_form": "Submitted form",
      "question_fallback": "Question {{index}}",
      "general_category": "General"
    },
    "create_errors": {
      "reserve_number": "I could not reserve an internal ticket number. Please try again in a few seconds.",
      "duplicate_number": "There was an internal conflict while numbering the ticket. Please try again.",
      "missing_permissions": "I do not have enough permissions to create or prepare the ticket channel.",
      "generic": "There was an error while creating the ticket. Verify my permissions or contact an administrator."
    },
    "faq": {
      "title": "Frequently Asked Questions",
      "description": "Here are the most common answers people need before opening a ticket. A quick check here can save you waiting time.",
      "q1_question": "How do I buy a product or membership?",
      "q1_answer": "Go to our official store, or open a ticket in the **Sales** category if you need step-by-step help.",
      "q2_question": "How do I request a refund?",
      "q2_answer": "Open a **Support / Billing** ticket and include your payment receipt plus transaction ID so the team can review it.",
      "q3_question": "I want to report a user",
      "q3_answer": "For a valid report, include clear screenshots or videos and explain the situation in a **Reports** ticket.",
      "q4_question": "I want to apply for a partnership",
      "q4_answer": "Partnership requests are handled through **Partnership** tickets. Make sure you meet the minimum requirements first.",
      "footer": "Still need help? Pick a category from the dropdown menu to open a ticket.",
      "load_failed": "We could not load the FAQ right now. Please try again later."
    },
    "picker": {
      "access_denied_title": "Access denied",
      "access_denied_description": "You cannot create tickets right now.\n**Reason:** {{reason}}",
      "access_denied_footer": "If you think this is a mistake, contact an administrator.",
      "limit_reached_title": "Ticket limit reached",
      "limit_reached_description": "You already have **{{openCount}}/{{maxTickets}}** open tickets.\n\n**Your active tickets:**\n{{ticketList}}\n\nClose one of your current tickets before opening a new one.",
      "no_categories": "There are no ticket categories configured for this server.",
      "select_title": "Create a new ticket",
      "select_description": "Select the category that best fits your request so the right team can help you faster.\n\nEach category routes your request to the appropriate staff.",
      "select_placeholder": "Select the ticket type...",
      "processing_error": "There was an error while preparing the ticket form. Please try again later.",
      "category_missing": "That category was not found or is not available right now. Please choose a different option.",
      "cooldown": "Please wait **{{minutes}} minute(s)** before opening another ticket.\n\nThis cooldown helps the team manage incoming requests more effectively.",
      "min_days": "You must be in the server for at least **{{days}} day(s)** to open a ticket.\n\nCurrent time in server: **{{currentDays}} day(s)**",
      "pending_ratings_title": "Pending ticket ratings",
      "pending_ratings_description": "You have **{{count}}** closed ticket(s) waiting for a rating:\n\n{{tickets}}\n\n**Why does rating matter?**\nYour feedback helps us improve the service and is required before opening new tickets.\n\n**Check your DMs** to find the pending rating prompts.\nIf you cannot find them, use the button below to resend them.",
      "pending_ratings_footer": "TON618 Tickets - Rating system",
      "resend_ratings_button": "Resend rating prompts"
    },
    "modal": {
      "category_unavailable": "This ticket category is no longer available. Please start again.",
      "first_answer_short": "Your first answer is too short. Add more context before creating the ticket."
    },
    "maintenance": {
      "title": "System under maintenance",
      "description": "The ticket system is temporarily disabled.\n\n**Reason:** {{reason}}\n\nPlease come back later.",
      "scheduled": "Scheduled maintenance"
    },
    "command": {
      "unknown_subcommand": "Unknown ticket subcommand.",
      "not_ticket_channel": "This is not a ticket channel.",
      "only_staff_close": "Only staff can close tickets.",
      "only_staff_reopen": "Only staff can reopen tickets.",
      "only_staff_claim": "Only staff can claim tickets.",
      "release_denied": "You do not have permission to release this ticket.",
      "only_staff_assign": "Only staff can assign tickets.",
      "only_staff_add": "Only staff can add users to the ticket.",
      "only_staff_remove": "Only staff can remove users from the ticket.",
      "only_staff_rename": "Only staff can rename tickets.",
      "valid_channel_name": "Provide a valid channel name.",
      "channel_renamed": "Channel renamed to **{{name}}**",
      "closed_priority_denied": "You cannot change the priority of a closed ticket.",
      "only_staff_priority": "Only staff can change ticket priority.",
      "priority_updated": "Priority updated to **{{label}}**",
      "only_staff_move": "Only staff can move tickets.",
      "no_other_categories": "No other categories are available.",
      "move_select_description": "Select the category you want to move this ticket to:",
      "move_select_placeholder": "Select the new category...",
      "only_staff_transcript": "Only staff can generate transcripts.",
      "transcript_failed": "Failed to generate the transcript.",
      "transcript_generated": "Transcript generated.",
      "only_staff_brief": "Only staff can view the case brief.",
      "only_staff_info": "Only staff can view ticket details.",
      "only_staff_other_history": "Only staff can view another user's ticket history.",
      "history_title": "Ticket history for {{user}}",
      "history_empty": "<@{{userId}}> has no tickets in this server.",
      "history_summary": "Summary",
      "history_open_now": "Open now",
      "history_recently_closed": "Recently closed",
      "no_rating": "No rating",
      "history_summary_value": "Total: **{{total}}** | Open: **{{open}}** | Closed: **{{closed}}**",
      "only_staff_notes": "Only staff can view or add notes.",
      "only_admin_clear_notes": "Only administrators can clear all ticket notes.",
      "notes_cleared": "All ticket notes were cleared.",
      "notes_cleared_event_description": "{{userTag}} cleared the internal notes for ticket #{{ticketId}}.",
      "note_limit_reached": "Ticket note limit reached (**{{max}}** notes max per ticket). Use `/ticket note clear` if you need to clean them up.",
      "note_added_title": "Internal note added",
      "note_added_event_description": "{{userTag}} added an internal note to ticket #{{ticketId}}.",
      "note_added_footer": "By {{userTag}} · {{count}}/{{max}}",
      "notes_title": "Ticket notes",
      "notes_empty": "There are no notes on this ticket yet.",
      "notes_list_title": "Ticket notes — #{{ticketId}} ({{count}}/{{max}})",
      "rename_event_title": "Channel renamed",
      "rename_event_description": "{{userTag}} renamed ticket #{{ticketId}} to {{name}}.",
      "priority_event_title": "Priority updated",
      "priority_event_description": "{{userTag}} changed ticket #{{ticketId}} priority to {{label}}."
    },
    "lifecycle": {
      "close": {
        "already_closed": "This ticket is already closed.",
        "verify_permissions": "I could not verify my permissions in this server.",
        "manage_channels_required": "I need the `Manage Channels` permission to close this ticket.",
        "already_closed_during_request": "This ticket was already closed while your request was being processed.",
        "database_error": "There was an error while closing the ticket in the database. Please try again.",
        "event_title": "Ticket closed",
        "event_description": "{{userTag}} closed ticket #{{ticketId}}.",
        "transcript_generate_failed": "The transcript could not be generated. The channel will remain closed to prevent history loss.",
        "transcript_channel_missing": "No transcript channel is configured. The channel will remain closed and will not be deleted automatically.",
        "transcript_channel_unavailable": "The configured transcript channel does not exist or is not accessible. The channel will not be deleted automatically.",
        "transcript_send_failed": "The transcript could not be sent to the configured channel. The channel will not be deleted automatically.",
        "transcript_generate_error": "There was an error generating the transcript. The channel will remain closed to prevent history loss.",
        "dm_receipt_title": "Support receipt",
        "dm_receipt_description": "Thanks for contacting our support team. Here is a summary of your ticket.",
        "dm_field_ticket": "Ticket",
        "dm_field_category": "Category",
        "dm_field_opened": "Opened at",
        "dm_field_closed": "Closed at",
        "dm_field_duration": "Total duration",
        "dm_field_reason": "Closing reason",
        "dm_field_handled_by": "Handled by",
        "dm_field_messages": "Messages",
        "dm_field_transcript": "Online transcript",
        "dm_transcript_link": "View full transcript",
        "dm_no_reason": "No reason provided",
        "dm_footer": "Thanks for trusting our support - TON618 Tickets",
        "dm_warning_title": "Warning: DM not delivered",
        "dm_warning_description": "The closing DM could not be sent to <@{{userId}}>.\n\n**Possible cause:** the user has DMs disabled or blocked the bot.\n\n**Ticket:** #{{ticketId}}",
        "dm_warning_transcript": "Transcript available",
        "dm_warning_unavailable": "Not available",
        "warning_dm_failed": "The user could not be notified by DM.",
        "warning_channel_not_deleted": "The channel will not be deleted automatically until the transcript is archived safely.",
        "log_reason": "Reason",
        "log_duration": "Duration",
        "log_user": "User",
        "log_transcript": "Transcript",
        "log_unavailable": "Not available",
        "result_closing_title": "Closing ticket",
        "result_closed_title": "Ticket closed",
        "result_closing_description": "This ticket will be deleted in **{{seconds}} seconds**.\n\n{{dmStatus}}",
        "result_closed_description": "The ticket was closed, but the channel will remain available until the transcript can be archived safely.",
        "result_dm_sent": "A summary was sent to the user by direct message.",
        "result_dm_failed": "The user could not be notified by DM.",
        "delete_reason": "Ticket closed",
        "transcript_embed_title": "Ticket transcript",
        "transcript_field_user": "User",
        "transcript_field_duration": "Duration",
        "transcript_field_staff": "Staff",
        "transcript_field_closed": "Closed",
        "transcript_field_messages": "Messages",
        "transcript_field_rating": "Rating",
        "transcript_rating_none": "No rating",
        "transcript_closed_unknown": "Unknown",
        "transcript_closed_unavailable": "Not available"
      },
      "reopen": {
        "already_open": "This ticket is already open.",
        "verify_permissions": "I could not verify my permissions in this server.",
        "manage_channels_required": "I need the `Manage Channels` permission to reopen this ticket.",
        "user_missing": "I could not find the user who created this ticket.",
        "reopened_during_request": "This ticket was already reopened while your request was being processed.",
        "database_error": "There was an error while reopening the ticket in the database.",
        "dm_title": "Ticket reopened",
        "dm_description": "Your ticket **#{{ticketId}}** in **{{guild}}** was reopened by {{staff}}.\n\n**Channel:** [Go to ticket]({{channelLink}})\n\nYou can go back to the channel and continue the conversation.",
        "result_title": "Ticket reopened",
        "result_description": "Ticket **#{{ticketId}}** was reopened successfully.\n\n**Total reopens:** {{count}}{{dmLine}}{{warningLine}}",
        "dm_line": "\nThe user was notified by DM.",
        "warning_line": "\n\nWarning: {{warning}}",
        "dm_warning": "The user could not be notified by DM (DMs may be disabled)."
      },
      "claim": {
        "closed_ticket": "You cannot claim a closed ticket.",
        "staff_only": "Only staff can claim tickets.",
        "verify_permissions": "I could not verify my permissions in this server.",
        "manage_channels_required": "I need the `Manage Channels` permission to claim this ticket.",
        "already_claimed_self": "You already claimed this ticket.",
        "already_claimed_other": "Already claimed by <@{{userId}}>. Use `/ticket unclaim` first.",
        "claimed_during_request": "This ticket was claimed by <@{{userId}}> while your request was being processed.",
        "database_error": "There was an error while updating the ticket in the database. Please try again.",
        "dm_title": "Your ticket is being handled",
        "dm_description": "Your ticket **#{{ticketId}}** in **{{guild}}** now has an assigned staff member.\n\n**Assigned staff:** {{staff}}\n**{{categoryLabel}}:** {{category}}\n**Channel:** [Go to ticket]({{channelLink}})\n\nUse the link above to jump directly into your ticket and continue the conversation.",
        "event_description": "{{userTag}} claimed ticket #{{ticketId}}.",
        "result_title": "Ticket claimed",
        "result_description": "You claimed ticket **#{{ticketId}}** successfully.{{dmLine}}{{warningBlock}}",
        "dm_line": "\n\nThe user was notified by DM.",
        "warning_permissions": "Your permissions could not be fully updated.",
        "warning_dm": "The user could not be notified by DM (DMs disabled).",
        "log_claimed_by": "Claimed by"
      },
      "unclaim": {
        "closed_ticket": "You cannot release a closed ticket.",
        "not_claimed": "This ticket is not claimed.",
        "denied": "Only the user who claimed the ticket or an administrator can release it.",
        "database_error": "There was an error while updating the ticket in the database.",
        "result_title": "Ticket released",
        "event_description": "{{userTag}} released ticket #{{ticketId}}.",
        "result_description": "The ticket has been released. Any staff member can claim it now.{{warningLine}}",
        "warning_permissions": "Some permissions could not be restored completely.",
        "log_released_by": "Released by",
        "log_previous_claimer": "Previously claimed by"
      },
      "assign": {
        "closed_ticket": "You cannot assign a closed ticket.",
        "staff_only": "Only staff can assign tickets.",
        "bot_denied": "You cannot assign the ticket to a bot.",
        "creator_denied": "You cannot assign the ticket to the user who created it.",
        "staff_member_missing": "I could not find that staff member in this server.",
        "invalid_assignee": "You can only assign the ticket to staff members (support role or administrator).",
        "verify_permissions": "I could not verify my permissions in this server.",
        "manage_channels_required": "I need the `Manage Channels` permission to assign tickets.",
        "assign_permissions_error": "There was an error while granting permissions to the assigned staff member: {{error}}",
        "database_error": "There was an error while updating the ticket in the database.",
        "dm_title": "Ticket assigned",
        "dm_description": "Ticket **#{{ticketId}}** in **{{guild}}** was assigned to you.\n\n**{{categoryLabel}}:** {{category}}\n**User:** <@{{userId}}>\n**Channel:** [Go to ticket]({{channelLink}})\n\nPlease review it as soon as possible.",
        "event_description": "{{userTag}} assigned ticket #{{ticketId}} to {{staffTag}}.",
        "result_title": "Ticket assigned",
        "result_description": "Ticket **#{{ticketId}}** was assigned to <@{{staffId}}>.{{dmLine}}{{warningLine}}",
        "dm_line": "\n\nThe staff member was notified by DM.",
        "dm_warning": "The staff member could not be notified by DM (DMs disabled).",
        "log_assigned_to": "Assigned to",
        "log_assigned_by": "Assigned by"
      },
      "members": {
        "add": {
          "closed_ticket": "You cannot add users to a closed ticket.",
          "bot_denied": "You cannot add bots to the ticket.",
          "creator_denied": "That user already owns this ticket.",
          "verify_permissions": "I could not verify my permissions in this server.",
          "manage_channels_required": "I need the `Manage Channels` permission to add users.",
          "permissions_error": "There was an error while granting permissions to the user: {{error}}",
          "event_title": "User added",
          "event_description": "{{userTag}} added {{targetTag}} to ticket #{{ticketId}}.",
          "result_title": "User added",
          "result_description": "<@{{userId}}> was added to the ticket and can now see the channel."
        },
        "remove": {
          "closed_ticket": "You cannot remove users from a closed ticket.",
          "creator_denied": "You cannot remove the ticket creator.",
          "bot_denied": "You cannot remove the bot from the ticket.",
          "support_role_denied": "You cannot remove the support role from the ticket.",
          "admin_role_denied": "You cannot remove the admin role from the ticket.",
          "verify_permissions": "I could not verify my permissions in this server.",
          "manage_channels_required": "I need the `Manage Channels` permission to remove users.",
          "permissions_error": "There was an error while removing permissions from the user: {{error}}",
          "event_title": "User removed",
          "event_description": "{{userTag}} removed {{targetTag}} from ticket #{{ticketId}}.",
          "result_title": "User removed",
          "result_description": "<@{{userId}}> was removed from the ticket and can no longer view it."
        },
        "move": {
          "closed_ticket": "You cannot move a closed ticket.",
          "category_not_found": "Category not found.",
          "already_in_category": "This ticket is already in that category.",
          "verify_permissions": "I could not verify my permissions in this server.",
          "manage_channels_required": "I need the `Manage Channels` permission to move tickets.",
          "database_error": "There was an error while updating the ticket category in the database.",
          "event_title": "Category updated",
          "event_description": "{{userTag}} moved ticket #{{ticketId}} from {{from}} to {{to}}.",
          "log_previous": "Previous",
          "log_new": "New",
          "log_priority": "Updated priority",
          "result_title": "Category changed",
          "result_description": "Ticket moved from **{{from}}** -> **{{to}}**\n\n**New priority:** {{priority}}"
        }
      }
    },
    "slash": {
      "description": "Manage support tickets",
      "subcommands": {
        "open": {
          "description": "Open a new ticket"
        },
        "close": {
          "description": "Close the current ticket"
        },
        "reopen": {
          "description": "Reopen the current ticket"
        },
        "claim": {
          "description": "Claim the current ticket"
        },
        "unclaim": {
          "description": "Release the current ticket"
        },
        "assign": {
          "description": "Assign the current ticket to a staff member"
        },
        "add": {
          "description": "Add a user to the current ticket"
        },
        "remove": {
          "description": "Remove a user from the current ticket"
        },
        "rename": {
          "description": "Rename the current ticket channel"
        },
        "priority": {
          "description": "Change the ticket priority"
        },
        "move": {
          "description": "Move the ticket to another category"
        },
        "transcript": {
          "description": "Generate a ticket transcript"
        },
        "brief": {
          "description": "Generate the case brief for this ticket"
        },
        "info": {
          "description": "View ticket details"
        },
        "history": {
          "description": "View a member's ticket history"
        }
      },
      "options": {
        "close_reason": "Reason for closing the ticket",
        "assign_staff": "Staff member who will own the ticket",
        "add_user": "User to add to the ticket",
        "remove_user": "User to remove from the ticket",
        "rename_name": "New channel name",
        "priority_level": "New priority level",
        "history_user": "Member whose history you want to inspect"
      },
      "groups": {
        "note": {
          "description": "Manage internal ticket notes",
          "subcommands": {
            "add": {
              "description": "Add an internal note to this ticket"
            },
            "list": {
              "description": "List internal notes for this ticket"
            },
            "clear": {
              "description": "Clear all internal notes from this ticket"
            }
          },
          "options": {
            "note": "Internal note content"
          }
        }
      },
      "choices": {
        "priority": {
          "low": "Low",
          "normal": "Normal",
          "high": "High",
          "urgent": "Urgent"
        }
      }
    },
    "options": {
      "ticket_close_reason_reason": "Reason for closing the ticket",
      "ticket_assign_staff_staff": "Staff member who will own the ticket",
      "ticket_add_user_user": "User to add to the ticket",
      "ticket_remove_user_user": "User to remove from the ticket",
      "ticket_rename_name_name": "New channel name",
      "ticket_priority_level_level": "New priority level",
      "ticket_history_user_user": "Member whose history you want to inspect",
      "ticket_note_add_note_note": "Internal note content",
      "ticket_playbook_confirm_recommendation_recommendation": "Recommendation ID",
      "ticket_playbook_dismiss_recommendation_recommendation": "Recommendation ID",
      "ticket_playbook_apply-macro_recommendation_recommendation": "Recommendation ID",
      "ticket_playbook_enable_playbook_playbook": "Playbook name",
      "ticket_playbook_disable_playbook_playbook": "Playbook name"
    }
  },
  "ping": {
    "description": "View bot latency and stats",
    "title": "PONG!",
    "field": {
      "latency": "Bot Latency",
      "uptime": "Uptime",
      "guilds": "Servers",
      "users": "Users",
      "channels": "Channels"
    }
  },
  "errors": {
    "language_permission": "Only a server administrator can choose the language for this guild.",
    "language_save_failed": "I could not save the server language. TON618 will keep English until the configuration succeeds.",
    "invalid_language_selection": "This language selection is no longer valid. Run `/setup language` to set it manually."
  },
  "warn": {
    "slash": {
      "description": "Manage member warnings",
      "subcommands": {
        "add": {
          "description": "Add a warning to a member"
        },
        "check": {
          "description": "View the warnings for a member"
        },
        "remove": {
          "description": "Remove one warning by ID"
        }
      },
      "options": {
        "user_warn": "Member to warn",
        "user_inspect": "Member whose warnings you want to inspect",
        "reason": "Reason for the warning",
        "id": "Warning ID"
      }
    },
    "fields": {
      "user": "User",
      "moderator": "Moderator",
      "reason": "Reason",
      "total": "Total warnings",
      "list": "Warnings"
    },
    "responses": {
      "add_title": "Warning added",
      "add_description": "{{user}} has been warned successfully.",
      "footer_id": "Warning ID: {{id}}",
      "auto_kick_success": "Automatic action: the member was kicked after reaching 5 warnings.",
      "auto_kick_failed": "Automatic action failed: I could not kick the member after reaching 5 warnings.",
      "auto_timeout_success": "Automatic action: the member was timed out for 1 hour after reaching 3 warnings.",
      "auto_timeout_failed": "Automatic action failed: I could not timeout the member after reaching 3 warnings.",
      "none_title": "No warnings found",
      "none_description": "{{user}} has no warnings in this server.",
      "list_title": "Warnings for {{user}}",
      "list_description": "Total stored warnings: **{{count}}**.",
      "list_entry": "**{{index}}.** `{{id}}`\nReason: {{reason}}\nModerator: <@{{moderatorId}}>\nDate: <t:{{timestamp}}:R>",
      "list_footer": "Use `/warn remove` with the warning ID to delete one entry.",
      "remove_title": "Warning removed",
      "remove_description": "Warning `{{id}}` was removed successfully.",
      "not_found_title": "Warning not found",
      "not_found_description": "I could not find a warning with ID `{{id}}`."
    },
    "options": {
      "warn_add_user_user": "Member to warn",
      "warn_add_reason_reason": "Reason for the warning",
      "warn_check_user_user": "Member whose warnings you want to inspect",
      "warn_remove_id_id": "Warning ID"
    }
  },
  "modlogs": {
    "slash": {
      "description": "Configure moderation logs",
      "subcommands": {
        "setup": {
          "description": "Enable modlogs and set the main log channel"
        },
        "enabled": {
          "description": "Enable or disable the modlog system"
        },
        "channel": {
          "description": "Change the modlog channel"
        },
        "config": {
          "description": "Enable or disable one logged event type"
        },
        "info": {
          "description": "View the current modlog configuration"
        }
      },
      "options": {
        "channel": "Text channel for moderation logs",
        "enabled": "Whether the feature stays enabled",
        "event": "Event type to configure",
        "event_enabled": "Whether that event type should be logged"
      },
      "choices": {
        "bans": "Bans",
        "unbans": "Unbans",
        "kicks": "Kicks",
        "message_delete": "Deleted messages",
        "message_edit": "Edited messages",
        "role_add": "Added roles",
        "role_remove": "Removed roles",
        "nickname": "Nickname changes",
        "joins": "Member joins",
        "leaves": "Member leaves"
      }
    },
    "events": {
      "bans": "Bans",
      "unbans": "Unbans",
      "kicks": "Kicks",
      "message_delete": "Deleted messages",
      "message_edit": "Edited messages",
      "role_add": "Added roles",
      "role_remove": "Removed roles",
      "nickname": "Nickname changes",
      "joins": "Member joins",
      "leaves": "Member leaves"
    },
    "fields": {
      "status": "Status",
      "channel": "Channel"
    },
    "responses": {
      "setup_title": "Modlogs configured",
      "setup_description": "Moderation logs are now active in {{channel}}.",
      "channel_required": "Set a modlog channel before enabling the system.",
      "enabled_state": "Modlogs are now **{{state}}**.",
      "channel_updated": "Modlog channel updated to {{channel}}.",
      "event_state": "{{event}} logging is now **{{state}}**.",
      "info_title": "Modlog configuration"
    },
    "options": {
      "modlogs_setup_channel_channel": "Text channel for moderation logs",
      "modlogs_enabled_enabled_enabled": "Whether the feature stays enabled",
      "modlogs_channel_channel_channel": "Text channel for moderation logs",
      "modlogs_config_event_event": "Event type to configure",
      "modlogs_config_enabled_enabled": "Whether that event type should be logged"
    }
  },
  "config": {
    "slash": {
      "description": "Server configuration and status",
      "subcommands": {
        "status": {
          "description": "View current server configuration"
        },
        "tickets": {
          "description": "View detailed ticket system configuration"
        },
        "center": {
          "description": "Open interactive configuration center"
        }
      }
    },
    "category": {
      "group_description": "Manage ticket categories",
      "add_description": "Add or link a ticket category",
      "option_id": "Category ID from config.js",
      "option_discord_category": "Discord category ID where tickets will be created",
      "remove_description": "Remove a ticket category",
      "remove_success_message": "**{{label}}** (`{{categoryId}}`) was removed.\n\nExisting tickets will not be modified.",
      "option_id_remove": "Category ID to remove",
      "list_description": "List all configured ticket categories",
      "edit_description": "Update an existing ticket category",
      "edit_success_message": "**{{label}}** was updated successfully.\n\nCategory ID: `{{categoryId}}`\nDescription: {{description}}\n{{emojiLine}}Priority: {{priority}}\n{{discordCategoryLine}}{{pingRolesLine}}{{welcomeLine}}Status: {{status}}",
      "option_id_edit": "Category ID to edit",
      "option_label": "Display label for the category",
      "option_description": "Category description",
      "option_emoji": "Emoji for the category",
      "option_priority": "Default priority for tickets in this category",
      "option_discord_category_edit": "Discord category ID",
      "option_ping_roles": "Roles to ping (comma-separated IDs)",
      "option_welcome_message": "Custom welcome message for this category",
      "toggle_description": "Enable or disable a ticket category",
      "option_id_toggle": "Category ID to toggle",
      "admin_only": "Only administrators can manage ticket categories.",
      "error_generic": "An error occurred while processing the command: {{message}}",
      "error_not_found": "The category `{{categoryId}}` was not found in config.js.",
      "error_no_category": "No category exists with ID `{{categoryId}}`.",
      "error_remove_failed": "The category could not be removed.",
      "error_no_fields": "You must provide at least one field to edit.",
      "add_title": "Category configured",
      "add_success_description": "**{{label}}** is now linked to a Discord category.\n\nCategory ID: `{{categoryId}}`\nDiscord category: `{{discordCategory}}`\n\nNew tickets created for this category will be placed inside that Discord category.\n\nVerification: {{verification}}",
      "add_verification_success": "Saved successfully",
      "add_verification_failed": "Save failed",
      "remove_title": "Category removed",
      "list_title_empty": "No ticket categories configured",
      "list_description_empty": "This server does not have any ticket categories configured yet.\n\nUse `/config category add` to connect a category from config.js to a Discord category.",
      "list_title": "Ticket categories ({{count}}/25)",
      "list_status_enabled": "Enabled",
      "list_status_disabled": "Disabled",
      "list_extras_discord": "Discord category linked",
      "list_extras_ping_roles": "{{count}} ping role(s)",
      "list_extras_welcome": "Custom welcome message",
      "edit_title": "Category updated",
      "edit_emoji_line": "Emoji: {{emoji}}\n",
      "edit_discord_line": "Discord category: `{{discordCategory}}`\n",
      "edit_ping_line": "Ping roles: {{count}}\n",
      "edit_welcome_line": "Custom welcome message: configured\n",
      "toggle_title_enabled": "Category enabled",
      "toggle_title_disabled": "Category disabled",
      "toggle_description_enabled": "**{{label}}** was enabled.\n\nUsers can select this category again when opening new tickets.",
      "toggle_description_disabled": "**{{label}}** was disabled.\n\nUsers can no longer select this category when opening new tickets.",
      "footer": "TON618 Tickets - Category Management"
    },
    "options": {
      "config_category_add_id_id": "Category ID from config.js",
      "config_category_add_discord_category_discord_category": "Discord category ID where tickets will be created",
      "config_category_remove_id_id": "Category ID to remove",
      "config_category_edit_id_id": "Category ID to edit",
      "config_category_edit_label_label": "Display label for the category",
      "config_category_edit_description_description": "Category description",
      "config_category_edit_emoji_emoji": "Emoji for the category",
      "config_category_edit_priority_priority": "Default priority for tickets in this category",
      "config_category_edit_discord_category_discord_category": "Discord category ID",
      "config_category_edit_ping_roles_ping_roles": "Roles to ping (comma-separated IDs)",
      "config_category_edit_welcome_message_welcome_message": "Custom welcome message for this category",
      "config_category_toggle_id_id": "Category ID to toggle"
    }
  },
  "menuActions": {
    "profile": {
      "title": "Profile",
      "description": "Use `/perfil ver` to view your profile.\nUse `/perfil top` to view the quick ranking."
    },
    "config": {
      "admin_only": "Only administrators can use quick configuration.",
      "title": "Quick configuration",
      "description": "Use `/config center` to open the interactive control panel.\nIf you need a deeper setup, use `/setup`."
    },
    "help": {
      "title": "Quick help",
      "description": "Key commands:\n- `/menu`\n- `/fun`\n- `/ticket open`\n- `/perfil ver`\n- `/staff my-tickets` (staff)\n- `/config status` (admin)\n- `/help`"
    }
  },
  "events": {
    "guildMemberAdd": {
      "anti_raid": {
        "title": "Anti-raid triggered",
        "description": "Detected **{{recentJoins}} joins** in **{{seconds}}s**.\nLatest join: **{{memberTag}}**",
        "fields": {
          "threshold": "Threshold",
          "action": "Action"
        },
        "action_kick": "Kick automatically",
        "action_alert": "Alert only"
      },
      "welcome": {
        "default_title": "Welcome!",
        "fields": {
          "user": "User",
          "member_count": "Member #"
        }
      },
      "dm": {
        "title": "Welcome to {{guild}}",
        "fields": {
          "verification_required": "Verification required",
          "verification_value": "Go to {{channel}} to verify and access the server."
        }
      },
      "modlog": {
        "title": "Member joined",
        "fields": {
          "user": "User",
          "account_created": "Account created",
          "member_count": "Member #"
        },
        "footer": "ID: {{id}}"
      }
    },
    "guildMemberRemove": {
      "goodbye": {
        "default_title": "Goodbye!",
        "default_message": "We are sorry to see **{user}** leave. We hope to see you again soon.",
        "fields": {
          "user": "User",
          "remaining_members": "Members remaining"
        },
        "remaining_members_value": "{{count}} members"
      },
      "modlog": {
        "title": "Member left",
        "fields": {
          "user": "User",
          "joined_at": "Joined",
          "remaining_members": "Members remaining",
          "roles": "Roles"
        },
        "no_roles": "None",
        "unknown_join": "Unknown",
        "footer": "ID: {{id}}"
      }
    },
    "guildMemberUpdate": {
      "unknown_executor": "Unknown",
      "footer": "ID: {{id}}",
      "nickname": {
        "title": "Nickname changed",
        "fields": {
          "user": "User",
          "before": "Before",
          "after": "After",
          "executor": "Executed by"
        }
      },
      "roles": {
        "title": "Roles updated",
        "fields": {
          "user": "User",
          "added": "Roles added",
          "removed": "Roles removed",
          "executor": "Executed by"
        }
      }
    },
    "messageDelete": {
      "title": "Deleted message",
      "fields": {
        "author": "Author",
        "channel": "Channel",
        "content": "Content"
      },
      "unknown_author": "Unknown",
      "no_text": "*(no text)*",
      "footer": "Message ID: {{id}}"
    }
  },
  "embeds": {
    "ticket": {
      "open": {
        "author": "Ticket #{{ticketId}} | {{category}}",
        "default_welcome": "Hello <@{{userId}}>! Welcome to our support system. A staff member will assist you soon.",
        "summary": "**Request summary:**\n- **User:** <@{{userId}}>\n- **Category:** {{category}}\n- **Priority:** {{priority}}\n- **Created:** <t:{{createdAt}}:R>",
        "footer": "Use the buttons below to manage this ticket",
        "question_fallback": "Question {{index}}",
        "form_field": "Form information"
      },
      "closed": {
        "title": "Ticket closed",
        "no_reason": "No reason provided",
        "fields": {
          "ticket": "Ticket",
          "closed_by": "Closed by",
          "reason": "Reason",
          "duration": "Duration",
          "messages": "Messages"
        }
      },
      "reopened": {
        "title": "Ticket reopened",
        "description": "<@{{userId}}> reopened this ticket.\nA staff member will resume the conversation soon.",
        "fields": {
          "reopens": "Reopens"
        }
      },
      "info": {
        "title": "Ticket #{{ticketId}}",
        "status_open": "Open",
        "status_closed": "Closed",
        "first_response_value": "{{minutes}} min",
        "fields": {
          "creator": "Creator",
          "category": "Category",
          "priority": "Priority",
          "status": "Status",
          "messages": "Messages",
          "duration": "Duration",
          "created": "Created",
          "claimed_by": "Claimed by",
          "assigned_to": "Assigned to",
          "subject": "Subject",
          "first_response": "First response",
          "reopens": "Reopens"
        }
      },
      "log": {
        "footer": "UID: {{userId}}",
        "fields": {
          "ticket": "Ticket",
          "by": "By",
          "category": "Category"
        },
        "actions": {
          "open": "Ticket opened",
          "close": "Ticket closed",
          "reopen": "Ticket reopened",
          "claim": "Ticket claimed",
          "unclaim": "Ticket released",
          "assign": "Ticket assigned",
          "unassign": "Assignment removed",
          "add": "User added",
          "remove": "User removed",
          "transcript": "Transcript generated",
          "rate": "Ticket rated",
          "move": "Category changed",
          "priority": "Priority changed",
          "edit": "Message edited",
          "delete": "Message deleted",
          "sla": "SLA alert",
          "smartping": "No staff response",
          "autoclose": "Ticket auto-closed",
          "default": "Action"
        }
      }
    }
  },
  "embed": {
    "slash": {
      "description": "✨ Custom embed builder",
      "subcommands": {
        "create": {
          "description": "Create and send an embed with interactive form"
        },
        "edit": {
          "description": "Edit an existing embed sent by the bot"
        },
        "quick": {
          "description": "Send a quick embed with title and description"
        },
        "announcement": {
          "description": "Professional announcement template"
        }
      },
      "options": {
        "channel": "Channel where to send the embed",
        "color": "HEX color without # (e.g., 5865F2)",
        "image": "Large image URL",
        "thumbnail": "Thumbnail URL (top right)",
        "footer": "Footer text",
        "author": "Author text (at the top)",
        "author_icon": "Author icon URL",
        "timestamp": "Show current date and time in footer",
        "mention": "Mention someone or a role with the embed (e.g., @Everyone)",
        "mensaje_id": "Message ID to edit",
        "title": "Title",
        "description": "Description",
        "text": "Announcement content"
      }
    },
    "errors": {
      "invalid_color": "Invalid color. Use HEX format with 6 characters without `#` (e.g., `5865F2`).",
      "invalid_image_url": "Image URL must start with `https://`.",
      "invalid_thumbnail_url": "Thumbnail URL must start with `https://`.",
      "channel_not_found": "Channel no longer exists.",
      "message_not_found": "Message not found. Verify the ID and channel.",
      "not_bot_message": "I can only edit messages sent by me.",
      "no_embeds": "That message has no embeds.",
      "form_expired": "❌ The form has expired. Run `/embed crear` again."
    },
    "modal": {
      "create_title": "✨ Create Embed",
      "edit_title": "✏️ Edit Embed",
      "field_title_label": "Title (empty = no title)",
      "field_description_label": "Description",
      "field_description_placeholder": "Write the embed content here...",
      "field_extra_label": "Extra fields (optional) — format: Name|Value|inline",
      "field_extra_placeholder": "Field name|Field value|true\nOther field|Other value|false",
      "field_color_label": "HEX color without # (e.g., 5865F2)"
    },
    "success": {
      "sent": "Embed sent in {{channel}}.",
      "announcement_sent": "Announcement sent in {{channel}}.",
      "edited": "Embed edited successfully."
    },
    "footer": {
      "sent_by": "Sent by {{username}}",
      "announcement": "{{guildName}} · Announcement"
    }
  },
  "poll": {
    "slash": {
      "description": "Interactive poll system",
      "subcommands": {
        "create": {
          "description": "Create a new poll with up to 10 options"
        },
        "end": {
          "description": "End a poll before it finishes"
        },
        "list": {
          "description": "View active polls in the server"
        }
      },
      "options": {
        "question": "Poll question",
        "options": "Options separated by |, for example: Option A | Option B",
        "duration": "Duration, for example: 1h, 30m, 2d, 1h30m",
        "multiple": "Allow multiple votes per user",
        "channel": "Channel where to publish the poll",
        "id": "Poll ID, last 6 characters"
      }
    },
    "errors": {
      "min_options": "You need at least 2 options separated by `|`.",
      "max_options": "Maximum 10 options per poll.",
      "option_too_long": "Each option can have a maximum of 80 characters.",
      "min_duration": "Minimum duration: 1 minute. Examples: `30m`, `2h`, `1d`, `1h30m`.",
      "max_duration": "Maximum duration: 30 days.",
      "manage_messages_required": "You need Manage Messages permission to end polls.",
      "poll_not_found": "Poll `{{id}}` not found. Use `/poll lista` to see active ones."
    },
    "embed": {
      "created_title": "Poll created",
      "created_description": "Your poll was published in {{channel}}.",
      "field_question": "Question",
      "field_options": "Options",
      "field_ends": "Ends",
      "field_in": "In",
      "field_mode": "Mode",
      "field_id": "ID",
      "mode_multiple": "Multiple vote",
      "mode_single": "One vote",
      "field_total_votes": "Total votes",
      "field_created_by": "Created by",
      "status_ended": "Ended",
      "title_prefix": "📊",
      "title_ended_prefix": "📊 [ENDED]",
      "footer_multiple": "You can vote for multiple options",
      "footer_single": "Only one vote per person",
      "footer_ended": "Poll ended",
      "vote_singular": "vote",
      "vote_plural": "votes",
      "active_title": "Active polls",
      "active_empty": "No active polls at this time.\nCreate one with `/poll crear`.",
      "active_count_title": "Active polls ({{count}})",
      "active_footer": "Use /poll finalizar [ID] to close one manually",
      "active_channel_deleted": "Deleted channel",
      "active_item_votes": "Votes"
    },
    "success": {
      "ended": "Poll **\"{{question}}\"** ended."
    },
    "placeholder": "Creating poll..."
  },
  "suggest": {
    "slash": {
      "description": "💡 Send a suggestion for the server"
    },
    "status": {
      "pending": "⏳ Pending",
      "approved": "✅ Approved",
      "rejected": "❌ Rejected"
    },
    "emoji": {
      "pending": "⏳",
      "approved": "✅",
      "rejected": "❌"
    },
    "errors": {
      "system_disabled": "The suggestion system is not enabled on this server.\nContact an administrator to enable it.",
      "channel_not_configured": "The configured suggestions channel was not found.\nContact an administrator.",
      "invalid_data": "You must provide at least a title or description for your suggestion.",
      "already_reviewed": "This suggestion has already been reviewed and no longer accepts votes.",
      "vote_error": "❌ Error registering your vote.",
      "not_exists": "❌ This suggestion no longer exists.",
      "manage_messages_required": "❌ You need **Manage Messages** permissions to review suggestions.",
      "already_status": "❌ This suggestion was already {{status}}.",
      "interaction_error": "❌ Interaction not valid.",
      "processing_error": "❌ An error occurred while processing the interaction."
    },
    "modal": {
      "title": "💡 New Suggestion",
      "field_title_label": "Suggestion title",
      "field_title_placeholder": "E.g., Add a music channel",
      "field_description_label": "Detailed description",
      "field_description_placeholder": "Explain your idea in more detail..."
    },
    "embed": {
      "title": "{{emoji}} Suggestion #{{num}}",
      "no_description": "> (No description)",
      "field_author": "👤 Author",
      "field_status": "📋 Status",
      "field_submitted": "📅 Submitted",
      "field_votes": "👍 {{up}}  •  👎 {{down}}  •  {{pct}}% approval",
      "footer_status": "Status: {{status}}",
      "footer_reviewed": "Reviewed by {{reviewer}} • {{status}}",
      "author_anonymous": "Anonymous",
      "field_staff_comment": "💬 Staff comment",
      "debate_title": "💬 Debate: Suggestion #{{num}}",
      "debate_footer": "Use this thread to discuss this suggestion"
    },
    "buttons": {
      "vote_up": "👍 Vote in Favor",
      "vote_down": "👎 Vote Against",
      "approve": "✅ Approve",
      "reject": "❌ Reject"
    },
    "success": {
      "submitted_title": "✅ Suggestion Submitted",
      "submitted_description": "Your suggestion **#{{num}}** has been published in {{channel}}.",
      "submitted_footer": "Thanks for your contribution!",
      "vote_registered": "✅ Your vote has been registered. ({{emoji}})",
      "status_updated": "✅ Suggestion **#{{num}}** marked as **{{status}}**."
    },
    "cooldown": {
      "title": "⏱️ Active Cooldown",
      "description": "You must wait **{{minutes}} minutes** before sending another suggestion."
    },
    "dm": {
      "title_approved": "✅ Your suggestion was Approved",
      "title_rejected": "❌ Your suggestion was Rejected",
      "description": "Your suggestion **#{{num}}** in **{{guildName}}** was reviewed.",
      "field_suggestion": "📝 Your suggestion"
    },
    "placeholder": "⏳ Creating suggestion..."
  },
  "profile": {
    "slash": {
      "description": "Ultra simple profile: level + economy",
      "subcommands": {
        "view": {
          "description": "View your profile or another user's"
        },
        "top": {
          "description": "View quick leaderboard of levels and economy"
        }
      },
      "options": {
        "user": "User to query"
      }
    },
    "embed": {
      "title": "Profile of {{username}}",
      "field_level": "Level",
      "field_total_xp": "Total XP",
      "field_rank": "Rank",
      "field_wallet": "Wallet",
      "field_bank": "Bank",
      "field_total": "Total",
      "top_title": "Quick Leaderboard",
      "top_levels": "Top Levels",
      "top_economy": "Top Economy",
      "no_data": "No data",
      "level_format": "Lv {{level}}",
      "coins_format": "{{amount}} coins",
      "user_fallback": "User {{id}}"
    }
  },
  "help": {
    "options": {
      "help_command_command": "Command name or usage path for direct help"
    }
  },
  "support_server": {
    "restricted": "❌ This command is only available in the official support server."
  },
  "giveaway": {
    "slash": {
      "description": "Manage giveaways in the support server",
      "subcommands": {
        "create": {
          "description": "Create a new giveaway",
          "options": {
            "prize": "What are you giving away?",
            "duration": "How long should the giveaway last? (e.g., 30s, 5m, 2h, 1d, 1w)",
            "winners": "Number of winners",
            "channel": "Channel to post the giveaway in (default: current)",
            "requirement_type": "Type of requirement to enter",
            "requirement_value": "Value for the requirement (role ID, level number, or days)",
            "emoji": "Emoji to react with (default: 🎉)",
            "description": "Additional description for the giveaway"
          }
        },
        "end": {
          "description": "End a giveaway early",
          "options": {
            "message_id": "ID of the giveaway message"
          }
        },
        "reroll": {
          "description": "Reroll winners for a giveaway",
          "options": {
            "message_id": "ID of the giveaway message",
            "winners": "Number of new winners to pick"
          }
        },
        "list": {
          "description": "List all active giveaways"
        },
        "cancel": {
          "description": "Cancel a giveaway without picking winners",
          "options": {
            "message_id": "ID of the giveaway message"
          }
        }
      }
    },
    "choices": {
      "requirement_none": "None - Anyone can enter",
      "requirement_role": "Role - Must have a specific role",
      "requirement_level": "Level - Must be at least a certain level",
      "requirement_account_age": "Account Age - Account must be X days old"
    },
    "options": {
      "giveaway_create_prize_prize": "What are you giving away?",
      "giveaway_create_duration_duration": "How long should the giveaway last? (e.g., 30s, 5m, 2h, 1d, 1w)",
      "giveaway_create_winners_winners": "Number of winners",
      "giveaway_create_channel_channel": "Channel to post the giveaway in (default: current)",
      "giveaway_create_requirement_type_requirement_type": "Type of requirement to enter",
      "giveaway_create_requirement_value_requirement_value": "Value for the requirement (role ID, level number, or days)",
      "giveaway_create_emoji_emoji": "Emoji to use for reactions (default: 🎉)",
      "giveaway_create_description_description": "Additional description for the giveaway",
      "giveaway_end_message_id_message_id": "Message ID of the giveaway to end",
      "giveaway_reroll_message_id_message_id": "Message ID of the giveaway to reroll",
      "giveaway_reroll_winners_winners": "Number of new winners to select",
      "giveaway_cancel_message_id_message_id": "Message ID of the giveaway to cancel"
    },
    "errors": {
      "invalid_duration": "❌ Invalid duration format. Use format like: 30s, 5m, 2h, 1d, 1w",
      "duration_too_short": "❌ Duration must be at least {{min}}",
      "duration_too_long": "❌ Duration cannot exceed {{max}}",
      "not_found": "❌ Giveaway not found. Make sure the message ID is correct.",
      "already_ended": "❌ This giveaway has already ended.",
      "create_failed": "❌ Failed to create giveaway. Please try again.",
      "end_failed": "❌ Failed to end giveaway. Please try again.",
      "reroll_failed": "❌ Failed to reroll giveaway. Please try again.",
      "cancel_failed": "❌ Failed to cancel giveaway. Please try again.",
      "no_participants": "❌ Giveaway ended but no valid participants were found.",
      "no_active": "📭 No active giveaways at the moment."
    },
    "success": {
      "created": "✅ Giveaway created successfully in {{channel}}!\n{{url}}",
      "ended": "✅ Giveaway ended successfully! Winners: {{winners}}",
      "rerolled": "✅ Giveaway rerolled! New winners: {{winners}}",
      "cancelled": "✅ Giveaway cancelled successfully."
    },
    "embed": {
      "title": "🎉 GIVEAWAY 🎉",
      "prize": "Prize",
      "winners": "Winners",
      "ends": "Ends",
      "hosted_by": "Hosted by",
      "react_to_enter": "React with {{emoji}} to enter!",
      "click_participant": "**Click the 🎉 Participate button to enter the giveaway!**",
      "participate_label": "🎉 Participate",
      "requirements": "📋 Requirements",
      "status_ended": "Ended",
      "status_cancelled": "❌ Cancelled",
      "status_no_participants": "Ended - No valid participants",
      "winners_announcement": "🎉 **GIVEAWAY ENDED** 🎉\n\nCongratulations {{winners}}! You won **{{prize}}**!",
      "reroll_announcement": "🎉 **GIVEAWAY REROLLED** 🎉\n\nNew winners: {{winners}}! You won **{{prize}}**!"
    },
    "requirements": {
      "role": "Must have role: {{role}}",
      "level": "Must be at least level {{level}}",
      "account_age": "Account must be at least {{days}} days old"
    }
  },
  "autorole": {
    "slash": {
      "description": "Configure automatic role assignment",
      "subcommands": {
        "reaction_add": {
          "description": "Add a reaction role to a message",
          "options": {
            "message_id": "ID of the message",
            "emoji": "Emoji to react with",
            "role": "Role to assign"
          }
        },
        "reaction_remove": {
          "description": "Remove a reaction role from a message",
          "options": {
            "message_id": "ID of the message",
            "emoji": "Emoji to remove"
          }
        },
        "reaction_panel": {
          "description": "Create a reaction role panel",
          "options": {
            "channel": "Channel to post the panel in"
          }
        },
        "join_set": {
          "description": "Set a role to be given when users join",
          "options": {
            "role": "Role to assign on join",
            "delay": "Delay in seconds before assigning (default: 0)",
            "exclude_bots": "Exclude bots from receiving the role"
          }
        },
        "join_remove": {
          "description": "Remove the join role"
        },
        "level_add": {
          "description": "Add a level role reward",
          "options": {
            "level": "Level required",
            "role": "Role to assign"
          }
        },
        "level_remove": {
          "description": "Remove a level role reward",
          "options": {
            "level": "Level to remove"
          }
        },
        "level_list": {
          "description": "List all level role rewards"
        },
        "level_mode": {
          "description": "Set level roles mode",
          "options": {
            "mode": "Mode (stack or replace)"
          }
        },
        "list": {
          "description": "List all auto-role configurations"
        }
      },
      "groups": {
        "reaction": "Manage reaction roles",
        "join": "Manage join roles",
        "level": "Manage level roles"
      }
    },
    "choices": {
      "mode_stack": "Stack - Keep all previous level roles",
      "mode_replace": "Replace - Remove previous level roles"
    },
    "options": {
      "autorole_reaction_add_message_id_message_id": "Message ID to add reaction role to",
      "autorole_reaction_add_emoji_emoji": "Emoji to react with",
      "autorole_reaction_add_role_role": "Role to assign when reacted",
      "autorole_reaction_remove_message_id_message_id": "Message ID to remove reaction role from",
      "autorole_reaction_remove_emoji_emoji": "Emoji to remove",
      "autorole_reaction_panel_channel_channel": "Channel to create the panel in (default: current)",
      "autorole_reaction_panel_title_title": "Title for the panel",
      "autorole_reaction_panel_description_description": "Description for the panel",
      "autorole_join_set_role_role": "Role to assign when users join",
      "autorole_join_set_delay_delay": "Delay in seconds before assigning the role",
      "autorole_join_set_exclude_bots_exclude_bots": "Exclude bots from receiving the role",
      "autorole_level_add_level_level": "Level required to receive the role",
      "autorole_level_add_role_role": "Role to assign at this level",
      "autorole_level_remove_level_level": "Level to remove the role from",
      "autorole_level_mode_mode_mode": "Mode for level roles (stack or replace)"
    },
    "errors": {
      "message_not_found": "❌ Message not found in this channel. Make sure the message ID is correct.",
      "role_hierarchy": "❌ I cannot assign this role because it's higher than or equal to my highest role.",
      "not_found": "❌ Reaction role not found.",
      "add_failed": "❌ Failed to add reaction role. Please try again.",
      "remove_failed": "❌ Failed to remove reaction role. Please try again.",
      "panel_failed": "❌ Failed to create panel. Please try again.",
      "join_set_failed": "❌ Failed to set join role. Please try again.",
      "join_remove_failed": "❌ Failed to remove join role. Please try again.",
      "level_add_failed": "❌ Failed to add level role. Please try again.",
      "level_remove_failed": "❌ Failed to remove level role. Please try again.",
      "no_level_roles": "📭 No level roles configured.",
      "no_autoroles": "📭 No auto-roles configured yet.",
      "list_failed": "❌ Failed to list auto-roles. Please try again."
    },
    "success": {
      "reaction_added": "✅ Reaction role added! Users who react with {{emoji}} will receive {{role}}.",
      "reaction_removed": "✅ Reaction role removed for {{emoji}}.",
      "panel_created": "✅ Reaction role panel created in {{channel}}!\n\nMessage ID: `{{messageId}}`\n\nUse `/autorole reaction add` to add roles to this panel.",
      "join_set": "✅ Join role set to {{role}}!\nDelay: {{delay}} seconds\nExclude bots: {{excludeBots}}",
      "join_removed": "✅ Join role removed.",
      "level_added": "✅ Level role added! Users who reach level {{level}} will receive {{role}}.",
      "level_removed": "✅ Level role removed for level {{level}}.",
      "mode_set": "✅ Level roles mode set to **{{mode}}**."
    },
    "panel": {
      "title": "🎭 Role Selection",
      "description": "React to this message to get roles!\n\nClick the reactions below to toggle your roles.",
      "footer": "React to get roles • Remove reaction to remove role"
    },
    "list": {
      "title": "🎭 Auto-Role Configuration",
      "join_role": "👋 Join Role",
      "join_role_value": "Role: {{role}}\nDelay: {{delay}}s\nExclude bots: {{excludeBots}}",
      "reaction_roles": "⚡ Reaction Roles",
      "level_roles": "📊 Level Roles ({{mode}})",
      "message": "Message"
    }
  },
  "mod": {
    "slash": {
      "description": "Advanced moderation commands",
      "subcommands": {
        "ban": {
          "description": "Ban a user from the server",
          "options": {
            "user": "User to ban",
            "reason": "Reason for the ban",
            "duration": "Duration for temporary ban (e.g., 30m, 2h, 7d)",
            "delete_messages": "Delete messages from the last X seconds"
          }
        },
        "unban": {
          "description": "Unban a user from the server",
          "options": {
            "user_id": "User ID to unban",
            "reason": "Reason for the unban"
          }
        },
        "kick": {
          "description": "Kick a user from the server",
          "options": {
            "user": "User to kick",
            "reason": "Reason for the kick"
          }
        },
        "timeout": {
          "description": "Timeout a user",
          "options": {
            "user": "User to timeout",
            "duration": "Duration for the timeout (e.g., 5m, 1h, 1d)",
            "reason": "Reason for the timeout"
          }
        },
        "mute": {
          "description": "Mute a user",
          "options": {
            "user": "User to mute",
            "duration": "Duration for the mute (e.g., 30m, 2h, 7d)",
            "reason": "Reason for the mute"
          }
        },
        "unmute": {
          "description": "Unmute a user",
          "options": {
            "user": "User to unmute",
            "reason": "Reason for the unmute"
          }
        },
        "history": {
          "description": "View moderation history for a user",
          "options": {
            "user": "User to view history for",
            "limit": "Number of actions to show"
          }
        },
        "purge": {
          "description": "Bulk delete messages",
          "options": {
            "amount": "Number of messages to delete",
            "user": "Only delete messages from this user",
            "contains": "Only delete messages containing this text"
          }
        },
        "slowmode": {
          "description": "Set slowmode for a channel",
          "options": {
            "seconds": "Slowmode duration in seconds (0 to disable)",
            "channel": "Channel to set slowmode in (default: current)"
          }
        }
      }
    },
    "choices": {
      "delete_messages_0": "Don't delete",
      "delete_messages_3600": "Last hour",
      "delete_messages_21600": "Last 6 hours",
      "delete_messages_86400": "Last 24 hours",
      "delete_messages_604800": "Last 7 days"
    },
    "options": {
      "mod_ban_user_user": "User to ban",
      "mod_ban_reason_reason": "Reason for the ban",
      "mod_ban_duration_duration": "Duration for temporary ban (e.g., 30m, 2h, 7d)",
      "mod_ban_delete_messages_delete_messages": "Delete messages from the last X seconds",
      "mod_unban_user_id_user_id": "User ID to unban",
      "mod_unban_reason_reason": "Reason for the unban",
      "mod_kick_user_user": "User to kick",
      "mod_kick_reason_reason": "Reason for the kick",
      "mod_timeout_user_user": "User to timeout",
      "mod_timeout_duration_duration": "Duration for the timeout (e.g., 5m, 1h, 1d)",
      "mod_timeout_reason_reason": "Reason for the timeout",
      "mod_mute_user_user": "User to mute",
      "mod_mute_duration_duration": "Duration for the mute (e.g., 30m, 2h, 7d)",
      "mod_mute_reason_reason": "Reason for the mute",
      "mod_unmute_user_user": "User to unmute",
      "mod_unmute_reason_reason": "Reason for the unmute",
      "mod_history_user_user": "User to view history for",
      "mod_history_limit_limit": "Number of actions to show",
      "mod_purge_amount_amount": "Number of messages to delete",
      "mod_purge_user_user": "Only delete messages from this user",
      "mod_purge_contains_contains": "Only delete messages containing this text",
      "mod_slowmode_seconds_seconds": "Slowmode duration in seconds (0 to disable)",
      "mod_slowmode_channel_channel": "Channel to set slowmode in (default: current)"
    },
    "errors": {
      "user_hierarchy": "❌ You cannot {{action}} this user because they have a higher or equal role.",
      "bot_hierarchy": "❌ I cannot {{action}} this user because they have a higher or equal role than me.",
      "not_banned": "❌ This user is not banned.",
      "not_muted": "❌ This user is not muted.",
      "ban_failed": "❌ Failed to ban user. Please check my permissions and try again.",
      "unban_failed": "❌ Failed to unban user. Please try again.",
      "kick_failed": "❌ Failed to kick user. Please try again.",
      "timeout_failed": "❌ Failed to timeout user. Please try again.",
      "mute_failed": "❌ Failed to mute user. Please try again.",
      "unmute_failed": "❌ Failed to unmute user. Please try again.",
      "history_failed": "❌ Failed to fetch moderation history. Please try again.",
      "purge_failed": "❌ Failed to purge messages. Please try again.",
      "slowmode_failed": "❌ Failed to set slowmode. Please try again.",
      "no_messages": "❌ No messages found to delete.",
      "no_history": "📭 No moderation history found for **{{user}}**."
    },
    "success": {
      "banned": "✅ **{{user}}** has been banned.\n**Reason:** {{reason}}\n{{extra}}",
      "unbanned": "✅ **{{user}}** has been unbanned.\n**Reason:** {{reason}}",
      "kicked": "✅ **{{user}}** has been kicked.\n**Reason:** {{reason}}",
      "timeout": "✅ **{{user}}** has been timed out for {{duration}}.\n**Reason:** {{reason}}",
      "muted": "✅ **{{user}}** has been muted for {{duration}}.\n**Reason:** {{reason}}",
      "unmuted": "✅ **{{user}}** has been unmuted.\n**Reason:** {{reason}}",
      "purged": "✅ Successfully deleted **{{count}}** message(s).",
      "slowmode_set": "✅ Slowmode set to **{{seconds}} second(s)** in {{channel}}.",
      "slowmode_disabled": "✅ Slowmode disabled in {{channel}}."
    },
    "ban_extra": {
      "duration": "**Duration:** {{duration}}",
      "permanent": "**Type:** Permanent",
      "messages_deleted": "**Messages deleted:** Last {{hours}} hour(s)"
    },
    "history": {
      "title": "📋 Moderation History - {{user}}",
      "footer": "Total actions: {{count}}",
      "entry": "**{{index}}.** {{action}} by {{moderator}} {{timestamp}}\n└ Reason: {{reason}}{{duration}}"
    }
  },
  "level": {
    "slash": {
      "description": "View level and XP information",
      "subcommands": {
        "view": {
          "description": "View your level or another user's level",
          "options": {
            "user": "User to view level for (default: yourself)"
          }
        },
        "rank": {
          "description": "View your rank on the leaderboard",
          "options": {
            "user": "User to view rank for (default: yourself)"
          }
        },
        "leaderboard": {
          "description": "View the server leaderboard",
          "options": {
            "page": "Page number to view"
          }
        }
      }
    },
    "options": {
      "level_view_user_user": "User to view level for (default: yourself)",
      "level_rank_user_user": "User to view rank for (default: yourself)",
      "level_leaderboard_page_page": "Page number to view"
    },
    "errors": {
      "disabled": "❌ The level system is not enabled on this server.",
      "user_not_found": "❌ User not found in this server.",
      "no_rank": "❌ This user has no rank yet. Send some messages to gain XP!",
      "invalid_page": "❌ Invalid page number. Maximum page: **{max}**",
      "no_data": "❌ No level data available yet."
    },
    "embed": {
      "level": "📊 Level",
      "total_xp": "✨ Total XP",
      "messages": "💬 Messages",
      "progress": "📈 Progress to Next Level",
      "footer": "Keep chatting to gain more XP!"
    },
    "rank": {
      "description": "🏆 Rank {rank} • Level {level} • {xp} XP"
    },
    "leaderboard": {
      "title": "Server Leaderboard",
      "unknown_user": "Unknown User",
      "stats": "Level {level} • {xp} XP",
      "footer": "Page {page}/{total} • {users} total users"
    }
  },
  "serverstats": {
    "slash": {
      "description": "View server statistics",
      "subcommands": {
        "overview": {
          "description": "View general server overview"
        },
        "members": {
          "description": "View member statistics",
          "options": {
            "period": "Time period to view statistics for"
          }
        },
        "activity": {
          "description": "View activity statistics",
          "options": {
            "period": "Time period to view statistics for"
          }
        },
        "growth": {
          "description": "View server growth statistics"
        },
        "support": {
          "description": "View support ticket statistics",
          "options": {
            "period": "Time period to view statistics for"
          }
        },
        "channels": {
          "description": "View channel activity statistics",
          "options": {
            "period": "Time period to view statistics for"
          }
        },
        "roles": {
          "description": "View role distribution statistics"
        }
      }
    },
    "choices": {
      "period_day": "Today",
      "period_week": "This Week",
      "period_month": "This Month",
      "period_all": "All Time"
    },
    "options": {
      "serverstats_members_period_period": "Time period to view statistics for",
      "serverstats_activity_period_period": "Time period to view statistics for",
      "serverstats_growth_period_period": "Time period to view statistics for",
      "serverstats_support_period_period": "Time period to view statistics for",
      "serverstats_channels_period_period": "Time period to view statistics for"
    },
    "errors": {
      "overview_failed": "❌ Failed to fetch server overview. Please try again.",
      "members_failed": "❌ Failed to fetch member statistics. Please try again.",
      "activity_failed": "❌ Failed to fetch activity statistics. Please try again.",
      "growth_failed": "❌ Failed to fetch growth statistics. Please try again.",
      "support_failed": "❌ Failed to fetch support statistics. Please try again.",
      "channels_failed": "❌ Failed to fetch channel statistics. Please try again.",
      "roles_failed": "❌ Failed to fetch role statistics. Please try again.",
      "no_data": "📊 Not enough data yet. {{type}} statistics will be available after a few days of tracking.",
      "no_activity": "📊 No channel activity data available yet."
    },
    "overview": {
      "title": "📊 {{server}} - Server Overview",
      "members": "👥 Members",
      "members_value": "**Total:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}\n**Online:** {{online}}",
      "channels": "📝 Channels",
      "channels_value": "**Total:** {{total}}\n**Text:** {{text}}\n**Voice:** {{voice}}",
      "roles": "🎭 Roles",
      "roles_value": "**Total:** {{total}}\n**Highest:** {{highest}}",
      "emojis": "😀 Emojis",
      "emojis_value": "**Total:** {{total}}\n**Static:** {{static}}\n**Animated:** {{animated}}",
      "info": "ℹ️ Server Info",
      "info_value": "**Owner:** {{owner}}\n**Created:** {{created}}\n**Boost Level:** {{boostLevel}}",
      "boosts": "🚀 Boosts",
      "boosts_value": "**Count:** {{count}}\n**Boosters:** {{boosters}}",
      "footer": "Server ID: {{id}}"
    },
    "members": {
      "title": "👥 Member Statistics - {{period}}",
      "current": "📈 Current Stats",
      "current_value": "**Total Members:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}",
      "new_members": "🆕 New Members",
      "new_members_value": "**Joined:** {{joined}}\n**Average/Day:** {{avgPerDay}}",
      "growth": "📊 Growth",
      "growth_value": "**Change:** {{change}}\n**Percentage:** {{percent}}%",
      "footer": "Period: {{period}}"
    },
    "activity": {
      "title": "📊 Activity Statistics - {{period}}",
      "messages": "💬 Messages",
      "messages_value": "**Total:** {{total}}\n**Avg/Day:** {{avgPerDay}}",
      "top_channels": "🔥 Top Channels",
      "top_users": "⭐ Most Active Users",
      "peak_hour": "⏰ Peak Hour",
      "peak_hour_value": "**{{hour}}:00 - {{hourEnd}}:00** with {{messages}} messages",
      "footer": "Period: {{period}}"
    },
    "growth": {
      "title": "📈 Server Growth Statistics",
      "30day": "📊 30-Day Growth",
      "30day_value": "**Total Change:** {{change}}\n**Percentage:** {{percent}}%\n**Start:** {{start}}\n**Current:** {{current}}",
      "trend": "📅 Recent Trend",
      "trend_value": "**Avg Daily Growth:** {{avgDaily}}\n**Projected (30d):** {{projected}}",
      "footer": "Based on last 30 days of data"
    },
    "support": {
      "title": "🎫 Support Statistics - {{period}}",
      "tickets": "📊 Tickets",
      "tickets_value": "**Total:** {{total}}\n**Open:** {{open}}\n**Closed:** {{closed}}",
      "response_times": "⏱️ Response Times",
      "response_times_value": "**Avg Response:** {{avgResponse}}\n**Avg Resolution:** {{avgResolution}}",
      "top_staff": "⭐ Top Staff (All Time)",
      "footer": "Period: {{period}}"
    },
    "channels": {
      "title": "📝 Channel Activity - {{period}}",
      "footer": "Period: {{period}} | Top 10 channels",
      "entry": "**{{index}}.** {{channel}}\n└ {{messages}} messages"
    },
    "roles": {
      "title": "🎭 Role Distribution",
      "footer": "Total roles: {{total}} | Showing top 15",
      "entry": "**{{index}}.** {{role}}\n└ {{count}} members ({{percent}}%)"
    },
    "periods": {
      "day": "Today",
      "week": "This Week",
      "month": "This Month",
      "all": "All Time"
    }
  },
  "transcript": {
    "title": "Ticket Transcript #{{ticketId}}",
    "error_generating": "Error generating transcript",
    "labels": {
      "ticket": "Ticket",
      "category": "Category",
      "created": "Created",
      "status": "Status",
      "open": "Open",
      "closed": "Closed",
      "duration": "Duration",
      "messages": "Messages",
      "attended_by": "Attended by",
      "rating": "Rating",
      "active": "Active",
      "no_messages": "No messages in this ticket",
      "generated_on": "Transcript generated on {{date}}"
    }
  },
  "dashboard": {
    "title": "📊 Control Center & Statistics",
    "description": "📡 *This panel updates in real time*",
    "global_stats": "📈 Global Statistics",
    "top_staff": "🏆 Top Staff",
    "away_staff": "💤 Away Staff",
    "observability": "📡 Observability",
    "total_tickets": "📊 Total Tickets",
    "open_tickets": "🟢 Open Tickets",
    "closed_today": "🔴 Closed Today",
    "opened_today": "📅 Opened Today",
    "no_data": "No data yet",
    "all_active": "All team members are active ✅",
    "no_recent_activity": "No recent activity recorded.",
    "auto_update": "🔄 Auto-update every 30s"
  },
  "stats": {
    "title": "📊 Statistics — {{guildName}}",
    "total": "🎫 Total",
    "open": "🟢 Open",
    "closed": "🔒 Closed",
    "today": "📅 Today",
    "opened": "Opened",
    "closed_cap": "Closed",
    "this_week": "📆 This week",
    "avg_rating": "⭐ Avg. Rating",
    "no_data": "No data",
    "response_time": "⚡ Response Time",
    "close_time": "⏱️ Close Time"
  },
  "weekly_report": {
    "title": "📆 Weekly Report — {{guildName}}",
    "description": "Summary of ticket activity over the last 7 days.",
    "tickets_opened": "🎫 Tickets opened",
    "tickets_closed": "🔒 Tickets closed",
    "currently_open": "🟢 Currently open",
    "avg_rating": "⭐ Average rating",
    "response_time": "⚡ Response time",
    "no_data": "No data",
    "top_staff": "🏆 Top Staff",
    "active_categories": "📁 Active Categories",
    "footer": "Automatic weekly report"
  },
  "leaderboard": {
    "title": "🏆 Staff Leaderboard",
    "no_data": "No staff data yet.",
    "closed": "closed",
    "claimed": "claimed"
  },
  "staff_rating": {
    "leaderboard_title": "🏆 Staff Leaderboard — Ratings",
    "no_ratings": "No ratings registered yet.\n\nRatings appear when users rate closed tickets.",
    "star_full": "⭐ full star",
    "star_half": "✨ half",
    "star_empty": "☆ empty",
    "profile_title": "📊 Ratings for {{username}}",
    "no_ratings_profile": "This staff member has no ratings registered yet.",
    "average": "⭐ Average",
    "total_ratings": "📊 Total ratings",
    "max": "🎯 Maximum possible",
    "distribution": "📈 Distribution",
    "trend_excellent": "🔥 Excellent",
    "trend_good": "✅ Good",
    "trend_average": "⚠️ Average",
    "trend_needs_improve": "❌ Needs improvement"
  },
  "observability": {
    "window": "Window",
    "interactions": "Interactions",
    "scope_errors": "Errors by scope",
    "top_error": "Top error"
  },
  "case_brief": {
    "title": "📋 Case Brief - Ticket #{{ticketId}}",
    "status": "Status",
    "open": "🟢 Open",
    "closed": "🔒 Closed",
    "risk_level": "Risk Level",
    "no_risk_factors": "No risk factors detected",
    "next_action": "Next Action",
    "operational_context": "Operational Context",
    "recommendations": "Recommendations",
    "footer": "Case Brief automatically generated by TON618",
    "pro_unlock_title": "Risk Analysis & Recommendations",
    "pro_unlock_description": "Upgrade to **Pro** to unlock the full Case Brief with risk analysis, smart recommendations, and next action suggestions.",
    "risks": {
      "high_priority_category": "High priority category",
      "urgent_priority": "Urgent priority",
      "outside_sla": "Outside SLA without response",
      "reopened_times": "Reopened {{count}} times",
      "extensive_conversation": "Extensive conversation (>50 messages)",
      "unassigned_30min": "Unassigned for more than 30 minutes"
    },
    "actions": {
      "closed_no_action": "Ticket closed. No action required.",
      "urgent_first_response": "🔴 **URGENT**: Give first response to user",
      "claim_or_assign": "Claim or assign ticket to a staff member",
      "near_sla_limit": "Resolve soon - near SLA limit",
      "urgent_priority_resolve": "Resolve with urgent priority",
      "review_reopen": "Review why it was reopened and resolve definitively",
      "continue_normal": "Continue normal ticket handling"
    },
    "context_labels": {
      "type": "Type",
      "age": "Age",
      "first_response": "1st response",
      "pending": "⚠️ Pending",
      "responsible": "Responsible",
      "assigned": "Assigned",
      "unassigned": "⚠️ Unassigned",
      "messages": "Messages",
      "reopenings": "Reopenings"
    },
    "recommendations_list": {
      "respond_immediately": "• Respond immediately to user",
      "use_claim": "• Use `/ticket claim` to take responsibility",
      "consider_priority": "• Consider escalating priority with `/ticket priority`",
      "escalate": "• Escalate to supervisor if unable to resolve soon",
      "review_history": "• Review history with `/ticket history` before closing",
      "document_resolution": "• Document resolution in internal notes",
      "verify_user": "• Verify if user still needs help",
      "continue_normal": "• Continue with normal resolution flow"
    }
  },
  "daily_sla_report": {
    "title": "Daily SLA & Productivity Report",
    "window": "Window: {{from}} - {{to}}",
    "opened_24h": "Tickets opened (24h)",
    "closed_24h": "Tickets closed (24h)",
    "avg_first_response": "Avg first response",
    "open_out_of_sla": "Open out of SLA",
    "open_escalated": "Open escalated",
    "sla_compliance": "SLA compliance",
    "top_staff": "Top staff by closures",
    "no_closures": "No closures in the last 24h",
    "no_data": "No data",
    "no_sla_threshold": "No SLA threshold"
  },
  "mod": {
    "slash": {
      "description": "Advanced moderation commands",
      "subcommands": {
        "ban": { "description": "Ban a user from the server" },
        "unban": { "description": "Unban a user" },
        "kick": { "description": "Kick a user from the server" },
        "timeout": { "description": "Timeout a user (Discord native)" },
        "mute": { "description": "Mute a user with a role" },
        "unmute": { "description": "Unmute a user" },
        "history": { "description": "View moderation history for a user" },
        "purge": { "description": "Delete multiple messages" },
        "slowmode": { "description": "Set slowmode for a channel" }
      },
      "options": {
        "user": "The user to target",
        "reason": "Reason for the action",
        "duration": "Duration (e.g., 1h, 7d, 30d)",
        "delete_messages": "Delete messages from the last...",
        "user_id": "Discord ID of the user to unban",
        "limit": "Number of actions to show",
        "amount": "Number of messages to delete (1-100)",
        "contains": "Only delete messages containing this text",
        "seconds": "Slowmode duration in seconds (0 to disable)",
        "channel": "Channel to set slowmode in"
      },
      "choices": {
        "duration": {
          "1m": "1 minute",
          "1h": "1 hour",
          "6h": "6 hours",
          "1d": "1 day",
          "7d": "7 days",
          "28d": "28 days",
          "30d": "30 days",
          "permanent": "Permanent"
        },
        "delete_messages": {
          "0": "Don't delete",
          "3600": "Last hour",
          "86400": "Last 24 hours",
          "604800": "Last 7 days"
        }
      }
    },
    "errors": {
      "user_hierarchy": "❌ You cannot {{action}} this user because they have a higher or equal role than you.",
      "bot_hierarchy": "❌ I cannot {{action}} this user because they have a higher or equal role than me.",
      "ban_failed": "❌ Failed to ban the user.",
      "unban_failed": "❌ Failed to unban the user.",
      "not_banned": "❌ This user is not banned from this server.",
      "kick_failed": "❌ Failed to kick the user.",
      "timeout_failed": "❌ Failed to timeout the user.",
      "mute_failed": "❌ Failed to mute the user.",
      "unmute_failed": "❌ Failed to unmute the user.",
      "not_muted": "❌ This user is not muted.",
      "history_failed": "❌ Failed to fetch moderation history.",
      "no_history": "ℹ️ No moderation history found for {{user}}.",
      "no_messages": "❌ No messages found matching the criteria in the last 100 messages.",
      "purge_failed": "❌ Failed to purge messages.",
      "slowmode_failed": "❌ Failed to set slowmode."
    },
    "success": {
      "banned": "✅ **{{user}}** was banned.\n**Reason:** {{reason}}\n{{extra}}",
      "unbanned": "✅ **{{user}}** was unbanned.\n**Reason:** {{reason}}",
      "kicked": "✅ **{{user}}** was kicked.\n**Reason:** {{reason}}",
      "timeout": "✅ **{{user}}** was timed out for **{{duration}}**.\n**Reason:** {{reason}}",
      "muted": "✅ **{{user}}** was muted for **{{duration}}**.\n**Reason:** {{reason}}",
      "unmuted": "✅ **{{user}}** was unmuted.\n**Reason:** {{reason}}",
      "purged": "✅ Successfully deleted **{{count}}** messages.",
      "slowmode_set": "✅ Slowmode set to **{{seconds}}s** in {{channel}}.",
      "slowmode_disabled": "✅ Slowmode disabled in {{channel}}."
    },
    "ban_extra": {
      "duration": "*Temporary ban: {{duration}}*",
      "permanent": "*Permanent ban*",
      "messages_deleted": "*Deleted messages from the last {{hours}}h*"
    },
    "history": {
      "title": "🛡️ Moderation History - {{user}}",
      "entry": "【{{index}}】 **{{action}}** — {{timestamp}}\n**Moderator:** {{moderator}}\n**Reason:** {{reason}}{{duration}}",
      "footer": "Showing {{count}} most recent actions"
    }
  },
  "config": {
    "slash": {
      "description": "Configure bot settings for this server",
      "subcommands": {
        "status": {
          "description": "View current bot configuration status"
        },
        "tickets": {
          "description": "View ticket system configuration"
        },
        "center": {
          "description": "Open the interactive Configuration Center"
        }
      }
    }
  },
  "staff": {
    "slash": {
      "description": "Staff operations and moderation commands",
      "subcommands": {
        "away_on": {
          "description": "Set your status as away (won't receive auto-assignments)"
        },
        "away_off": {
          "description": "Set your status as online"
        },
        "my_tickets": {
          "description": "View your currently assigned/claimed tickets"
        },
        "warn_add": {
          "description": "Add a warning to a user"
        },
        "warn_check": {
          "description": "Check warnings for a user"
        },
        "warn_remove": {
          "description": "Remove a specific warning by ID"
        }
      },
      "options": {
        "reason": "Reason for being away",
        "user": "The user to moderate",
        "warn_reason": "Reason for the warning",
        "warning_id": "The ID of the warning to remove"
      }
    }
  },
  "stats": {
    "title": "Server Statistics",
    "closed_cap": "Tickets Closed (24h)",
    "this_week": "Activity This Week",
    "response_time": "Average Response Time",
    "close_time": "Average Resolution Time",
    "slash": {
      "description": "View server statistics and SLA reports",
      "subcommands": {
        "server": {
          "description": "View general server growth and activity stats"
        },
        "sla": {
          "description": "View ticket SLA compliance report"
        },
        "staff": {
          "description": "View individual staff performance stats"
        },
        "leaderboard": {
          "description": "View the staff leaderboard"
        },
        "ratings": {
          "description": "View ticket rating statistics"
        },
        "staff_rating": {
          "description": "View ratings for a specific staff member"
        }
      }
    }
  },
  "weekly_report": {
    "title": "Weekly Performance Report - {{guildName}}",
    "description": "Here is the summary of activity in the server over the last 7 days.",
    "tickets_opened": "Tickets Opened",
    "tickets_closed": "Tickets Closed",
    "currently_open": "Currently Open",
    "avg_rating": "Average Rating",
    "response_time": "Avg. Response Time",
    "top_staff": "Top Staff Monthly",
    "active_categories": "Most Active Categories",
    "footer": "Operational Excellence • TON618",
    "no_data": "No significant activity recorded."
  },
  "poll": {
    "embed": {
      "created_title": "Poll Created",
      "created_description": "The poll has been published in {{channel}}.",
      "field_question": "Question",
      "field_options": "Options",
      "field_ends": "Ends",
      "field_in": "In",
      "field_mode": "Voting Mode",
      "mode_multiple": "Multiple Choice",
      "mode_single": "Single Choice",
      "field_id": "Poll ID",
      "active_title": "Active Polls",
      "active_empty": "There are no active polls in this server.",
      "active_channel_deleted": "Deleted Channel",
      "active_item_votes": "Votes",
      "active_count_title": "Active Polls",
      "active_footer": "Use /poll end <id> to finish a poll manually",
      "vote_singular": "vote",
      "vote_plural": "votes",
      "title_ended_prefix": "Poll Ended:",
      "title_prefix": "Poll:",
      "field_total_votes": "Total Votes",
      "status_ended": "Ended",
      "field_created_by": "Created by",
      "footer_ended": "This poll is closed.",
      "footer_multiple": "You can select multiple options.",
      "footer_single": "You can select only one option."
    },
    "slash": {
      "description": "Interactive poll system",
      "subcommands": {
        "create": {
          "description": "Create a new poll with up to 10 options"
        },
        "end": {
          "description": "End a poll before it finishes"
        },
        "list": {
          "description": "View active polls in the server"
        }
      },
      "options": {
        "pregunta": "Poll question",
        "opciones": "Options separated by |, for example: Option A | Option B",
        "duracion": "Duration, for example: 1h, 30m, 2d, 1h30m",
        "multiple": "Allow multiple votes per user",
        "canal": "Channel where to publish the poll",
        "id": "Poll ID, last 6 characters"
      }
    }
  },
  "wizard": {
    "title": "Quick Setup Result",
    "description": "The system has been configured with the following settings.",
    "summary_label": "Configuration Summary",
    "next_step_label": "Recommended Next Steps",
    "pro_next_step": "Everything is ready! Your Pro plan is active and playbooks are enabled.",
    "free_next_step": "System ready. Consider upgrading to Pro to enable advanced automation playbooks.",
    "footer": "TON618 Bot • Setup Wizard",
    "panel_status": {
      "published": "✅ Published",
      "skipped": "⏩ Skipped",
      "missing_permissions": "❌ Permission Error",
      "error": "❌ Critical Error ({{error}})"
    }
  }
};
