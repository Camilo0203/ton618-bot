module.exports = {
  "common": {
    "yes": "Yes",
    "no": "No",
    "enabled": "Enabled",
    "disabled": "Disabled",
    "on": "On",
    "off": "Off",
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
    "closed": "Closed",
    "footer": {
      "tickets": "TON618 Tickets"
    },
    "setup_hint": {
      "run_setup": "Use `/setup wizard` to start configuring the bot's features."
    }
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
    "unexpected": "An unexpected error occurred while executing this command. Please contact the administrator.",
    "tag_delete": {
      "success": "✅ Tag **{{name}}** has been deleted.",
      "error": "An error occurred while deleting the tag.",
      "cancelled": "❌ Deletion cancelled."
    },
    "dashboard_refresh": {
      "success": "✅ Dashboard updated! Statistics have been successfully refreshed."
    },
    "shutdown": {
      "rebooting": "⚠️ The bot is rebooting. Please try again in a few seconds."
    }
  },
  "serverstats": {
    "overview": {
      "title": "📊 Server Overview: {{server}}",
      "members": "👥 Members",
      "members_value": "**Total:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}\n**Online:** {{online}}",
      "channels": "📁 Channels",
      "channels_value": "**Total:** {{total}}\n**Text:** {{text}}\n**Voice:** {{voice}}",
      "roles": "🎭 Roles",
      "roles_value": "**Total:** {{total}}\n**Highest:** {{highest}}",
      "emojis": "😀 Emojis",
      "emojis_value": "**Total:** {{total}}\n**Static:** {{static}}\n**Animated:** {{animated}}",
      "info": "ℹ️ Information",
      "info_value": "**Owner:** {{owner}}\n**Created:** {{created}}\n**Boost Tier:** {{boostLevel}}",
      "boosts": "✨ Boosts",
      "boosts_value": "**Total Boosts:** {{count}}\n**Boosters:** {{boosters}}",
      "footer": "Server ID: {{id}}"
    },
    "members": {
      "title": "👥 Member Statistics - {{period}}",
      "current_stats": "📈 Current Stats",
      "current_stats_value": "**Total Members:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}",
      "new_members": "🆕 New Members",
      "new_members_value": "**Joined:** {{count}}\n**Average/Day:** {{avg}}",
      "growth": "📊 Growth",
      "growth_value": "**Change:** {{change}}\n**Percentage:** {{percent}}%",
      "period_footer": "Period: {{period}}"
    },
    "activity": {
      "title": "📊 Activity Statistics - {{period}}",
      "messages": "💬 Messages",
      "messages_value": "**Total:** {{total}}\n**Avg/Day:** {{avg}}",
      "top_channels": "🔥 Top Channels",
      "top_channels_value": "{{num}}. <#{{channelId}}> - {{count}} msgs",
      "top_users": "⭐ Most Active Users",
      "top_users_value": "{{num}}. <@{{userId}}> - {{count}} msgs",
      "peak_hour": "🕒 Peak Hour",
      "peak_hour_value": "**{{hour}}:00 - {{next}}:00** with {{count}} messages"
    },
    "growth": {
      "title": "📈 Server Growth Statistics",
      "stats_30d": "📊 30-Day Growth",
      "stats_30d_value": "**Total Change:** {{change}}\n**Percentage:** {{percent}}%\n**Start:** {{start}}\n**Current:** {{current}}",
      "trend": "📅 Recent Trend",
      "trend_value": "**Avg Daily Growth:** {{avg}}\n**Projected (30d):** {{projected}}",
      "footer": "Based on last 30 days of data"
    },
    "support": {
      "title": "🎫 Support Statistics - {{period}}",
      "tickets": "📊 Tickets",
      "tickets_value": "**Total:** {{total}}\n**Open:** {{open}}\n**Closed:** {{closed}}",
      "times": "⏱️ Response Times",
      "times_value": "**Avg Response:** {{avgResponse}}\n**Avg Resolution:** {{avgResolution}}",
      "top_staff": "⭐ Top Staff (All Time)",
      "top_staff_value": "{{num}}. <@{{userId}}> - {{count}} tickets"
    },
    "channels": {
      "title": "📁 Channel Activity - {{period}}",
      "channel_entry": "**{{num}}.** <#{{channelId}}>\n└ {{count}} messages",
      "footer": "Period: {{period}} | Top 10 channels"
    },
    "roles": {
      "title": "🎭 Role Distribution",
      "role_entry": "**{{num}}.** {{role}}\n└ {{count}} members ({{percent}}%)",
      "footer": "Total roles: {{total}} | Showing top 15"
    },
    "periods": {
      "day": "Today",
      "week": "This Week",
      "month": "This Month",
      "all": "All Time"
    },
    "errors": {
      "overview_failed": "Failed to fetch server overview.",
      "members_failed": "Failed to fetch member statistics.",
      "activity_failed": "Failed to fetch activity statistics.",
      "growth_failed": "Failed to fetch growth statistics.",
      "support_failed": "Failed to fetch support statistics.",
      "channels_failed": "Failed to fetch channel statistics.",
      "roles_failed": "Failed to fetch role statistics.",
      "no_data": "No {{type}} data available for analysis.",
      "no_activity": "No message activity recorded during this period."
    }
  },
  "autorole": {
    "list": {
      "title": "✨ Auto-Role Configurations",
      "join_role": "📥 Join Role",
      "join_role_value": "**Role:** {{role}}\n**Delay:** {{delay}}s\n**Exclude Bots:** {{excludeBots}}",
      "reaction_roles": "🔘 Reaction Roles",
      "message": "Message",
      "level_roles": "📈 Level Rewards (Mode: {{mode}})",
      "level_entry": "**Level {{level}}:** <@&{{roleId}}>"
    },
    "panel": {
      "title": "Role Selection",
      "description": "Select the roles you want by reacting below.",
      "footer": "TON618 Reaction Roles"
    },
    "success": {
      "reaction_added": "✅ Reaction role added: {{emoji}} → {{role}}",
      "reaction_removed": "✅ Reaction role removed for emoji {{emoji}}",
      "panel_created": "✅ Reaction role panel created in {{channel}} (ID: {{messageId}})",
      "join_set": "✅ Join role set to {{role}} with {{delay}}s delay (Exclude Bots: {{excludeBots}})",
      "join_removed": "✅ Join role has been disabled.",
      "level_added": "✅ Level {{level}} reward set to {{role}}.",
      "level_removed": "✅ Level {{level}} reward removed.",
      "mode_set": "✅ Level role mode set to **{{mode}}**."
    },
    "errors": {
      "message_not_found": "The specified message could not be found in this channel.",
      "role_hierarchy": "I cannot assign this role because it is higher than my highest role.",
      "add_failed": "Failed to add reaction role reward.",
      "remove_failed": "Failed to remove reaction role reward.",
      "not_found": "No reaction role reward found for this configuration.",
      "panel_failed": "Failed to create reaction role panel.",
      "join_set_failed": "Failed to configure join role.",
      "join_remove_failed": "Failed to disable join role.",
      "level_add_failed": "Failed to add level reward.",
      "level_remove_failed": "Failed to remove level reward.",
      "list_failed": "Failed to fetch auto-role list.",
      "no_level_roles": "No level role rewards are configured.",
      "no_autoroles": "No auto-role configurations found for this server."
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
        },
        "template": {
          "description": "✨ Manage embed templates (Pro)",
          "save": {
            "description": "Save an embed configuration as a template"
          },
          "load": {
            "description": "Load and send a saved embed template"
          },
          "list": {
            "description": "List all saved embed templates"
          },
          "delete": {
            "description": "Delete a saved embed template"
          }
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
        "message_id": "Message ID to edit",
        "title": "Title",
        "description": "Description",
        "text": "Announcement content",
        "template_name": "Name of the template"
      }
    },
    "modal": {
      "create_title": "Embed Constructor",
      "edit_title": "Edit Embed",
      "field_title_label": "Embed Title",
      "field_description_label": "Main Description",
      "field_description_placeholder": "Content of your embed...",
      "field_extra_label": "Extra Fields (Name|Value|inline)",
      "field_extra_placeholder": "Field 1|Value 1|true\nField 2|Value 2|false",
      "field_color_label": "HEX Color (e.g. 5865F2)",
      "field_extra_fallback_name": "Field"
    },
    "footer": {
      "sent_by": "Sent by {{username}}",
      "announcement": "Official Announcement | {{guildName}}"
    },
    "announcement_prefix": "📢 ",
    "success": {
      "sent": "✅ Embed successfully sent to {{channel}}.",
      "edited": "✅ Embed successfully updated.",
      "template_saved": "✅ Template **{{name}}** saved successfully.",
      "template_deleted": "✅ Template **{{name}}** deleted.",
      "announcement_sent": "📢 Announcement sent to {{channel}}."
    },
    "errors": {
      "invalid_color": "Invalid HEX color format.",
      "invalid_image_url": "Image URL must start with http or https.",
      "invalid_thumbnail_url": "Thumbnail URL must start with http or https.",
      "template_exists": "A template with the name **{{name}}** already exists.",
      "template_not_found": "Template **{{name}}** was not found.",
      "message_not_found": "Could not find the message to edit.",
      "not_bot_message": "I can only edit embeds originally sent by me.",
      "no_embeds": "The specified message does not contain any embeds.",
      "form_expired": "The interactive form has expired. Please run the command again.",
      "channel_not_found": "The target channel could not be found.",
      "pro_required": "✨ **Pro Feature**: Template management requires a Pro subscription."
    },
    "templates": {
      "no_templates": "No embed templates have been saved yet.",
      "list_title": "✨ {{guildName}} Templates",
      "footer": "{{count}}/{{max}} templates used"
    }
  },
  "onboarding": {
    "title": "Welcome to TON618 / Bienvenido a TON618",
    "description": "Please choose the primary language for this server / Por favor elige el idioma principal de este servidor.",
    "body": "🇺🇸 **English:**\nTON618 operates natively in English. Please click the button below to set English as the default language for this server. You can change it later using the `/setup language` command.\n\n🇪🇸 **Español:**\nTON618 opera de manera nativa en Español. Por favor haz clic en el botón inferior para establecer el español como el idioma principal de este servidor. Puedes cambiarlo más adelante usando el comando `/setup language`.",
    "footer": "If no language is selected, TON618 will default to English.",
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
          },
          "playbook": {
            "group_description": "Review and manage operational playbooks",
            "list_description": "List all playbooks and active recommendations",
            "confirm_description": "Confirm and apply a suggested recommendation",
            "dismiss_description": "Dismiss a suggested recommendation",
            "apply_macro_description": "Directly apply the suggested macro from a recommendation",
            "enable_description": "Enable a specific playbook for this guild",
            "disable_description": "Disable a specific playbook for this guild",
            "option_recommendation": "Recommendation ID or Playbook ID",
            "option_playbook": "Playbook ID from the catalog",
            "list_title": "Server Operational Playbooks",
            "list_description_generic": "You can manage playbooks from any channel, but live recommendations only appear when the command is run inside a ticket.",
            "field_current_plan": "Current Plan",
            "field_enabled_count": "Enabled",
            "field_catalog": "Catalog",
            "catalog_empty": "No playbooks found",
            "live_title": "Live Playbooks - Ticket #{{id}}",
            "live_description": "Operational snapshot for the current ticket with recommendations ready to confirm, dismiss, or apply.",
            "field_enabled_playbooks": "Enabled Playbooks",
            "field_pending_recommendations": "Pending Recommendations",
            "recommendations_empty": "No pending recommendations for this ticket.",
            "live_footer": "Use /ticket playbook confirm, dismiss, or apply-macro to act on them.",
            "playbooks_empty": "No enabled playbooks",
            "event_confirmed_title": "Recommendation confirmed from Discord",
            "event_dismissed_title": "Recommendation dismissed from Discord",
            "event_applied_title": "Suggested macro applied",
            "event_description": "{{user}} marked recommendation {{id}} as {{status}}.",
            "event_macro_description": "{{user}} posted macro {{label}} from an operational recommendation.",
            "macro_internal_note": "Playbook suggested internal note:\n{{content}}",
            "success_confirmed": "✅ Recommendation `{{id}}` was confirmed.",
            "success_dismissed": "✅ Recommendation `{{id}}` was dismissed.",
            "success_macro_applied": "✅ Macro `{{label}}` posted and recommendation applied.",
            "success_enabled": "✅ `{{label}}` is now enabled for this guild.",
            "success_enabled_locked": "✅ `{{label}}` is marked as enabled, but it will stay locked until the guild upgrades from the current plan (`{{plan}}`).",
            "success_disabled": "✅ `{{label}}` is now disabled for this guild.",
            "errors": {
              "staff_only": "Only staff can review operational playbooks.",
              "recommendation_staff_only": "Only staff can manage playbook recommendations.",
              "macro_staff_only": "Only staff can apply suggested macros.",
              "admin_only": "Only bot admins can enable or disable playbooks.",
              "ticket_only": "This command must be used inside a ticket channel.",
              "not_found": "No pending recommendation matches that identifier.",
              "playbook_not_found": "That playbook was not found in the operational catalog.",
              "no_macro": "The selected recommendation has no suggested macro.",
              "macro_missing": "The suggested macro was not found in the current workspace.",
              "unknown_subcommand": "Unknown playbook subcommand."
            }
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
      "footer": "{{guild}} â€¢ Verification",
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
    "pro_metrics_title": "ðŸ’Ž Pro Performance Metrics",
    "pro_efficiency": "Workload Efficiency",
    "pro_rating_quality": "Service Quality",
    "pro_top_performer": "Elite",
    "pro_consistent": "Consistent",
    "pro_needs_focus": "Needs focus",
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
      "description": "**{{feature}}** is an exclusive feature of the Pro plan.\nIf you want to use this PRO feature, please go to our Support Discord and create a purchase ticket. You can also donate to support the project if you want!",
      "current_plan": "Current plan",
      "supporter": "Supporter",
      "upgrade_label": "🚀 Upgrade to Pro",
      "upgrade_cta": "Join our Support Server to purchase a plan",
      "button_label": "Buy Pro | Support",
      "footer": "TON618 Commercial Services"
    }
  },
  "premium": {
    "guild_only": "This command only works in servers.",
    "owner_only": "Only the server owner can use this command.",
    "error_fetching": "I couldn't fetch your membership information. Please try again later.",
    "error_generic": "An error occurred while processing your request.",
    "status_title": "Your Membership Status",
    "pro_active": "✅ You have an active PRO membership with access to all premium features.",
    "free_plan": "â„¹ï¸ You're using the FREE plan. Upgrade to PRO to unlock advanced features.",
    "plan_label": "Plan",
    "status_label": "Status",
    "time_remaining": "Time remaining",
    "expires_tomorrow": "ðŸš¨ **Expires tomorrow!** Renew urgently.",
    "expires_soon": "âš ï¸ **Expires in {{days}} days!** Don't forget to renew.",
    "expires_week": "â° Expires in **{{days}} days**. Prepare to renew.",
    "expires_in": "ðŸ“… Expires in **{{days}} days**.",
    "started_at": "Started",
    "expires_at": "Expires on",
    "source_label": "Source",
    "supporter_status": "Supporter Status",
    "supporter_active": "✅ Active",
    "active": "Active",
    "reminder": {
      "title_7": "â° Your PRO membership expires in 7 days",
      "title_3": "âš ï¸ Your PRO membership expires in 3 days",
      "title_1": "ðŸš¨ Your PRO membership expires tomorrow",
      "description_7": "Your PRO membership for **{{guildName}}** will expire in **7 days**.\n\nRenew now to keep all premium features active.",
      "description_3": "Your PRO membership for **{{guildName}}** will expire in **3 days**.\n\nDon't lose access to premium features! Renew before it's too late.",
      "description_1": "â° **URGENT**: Your PRO membership for **{{guildName}}** expires **tomorrow**.\n\nRenew immediately or you will lose access to all premium features.",
      "field_server": "Server",
      "field_days_remaining": "Days remaining",
      "field_plan": "Plan",
      "footer": "TON618 - Membership System"
    },
    "upgrade_label": "ðŸš€ Upgrade to Pro",
    "upgrade_cta": "Get Pro â€” open a ticket in our support server",
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
      "public_panel_footer": "{guild} â€¢ Professional support",
      "welcome_message": "Hi {user}, your ticket **{ticket}** has been created. Please share as much detail as possible.",
      "control_panel_title": "Ticket Control Panel",
      "control_panel_description": "This is the control panel for ticket **{ticket}**.\nUse the controls below to manage this ticket.",
      "control_panel_footer": "{guild} â€¢ TON618 Tickets"
    },
    "panel": {
      "categories_heading": "Choose a category",
      "categories_cta": "Choose an option from the menu below to get started.",
      "queue_name": "Current queue",
      "queue_value": "We currently have `{{openTicketCount}}` active ticket(s). We will reply as soon as possible.",
      "faq_button": "Frequently Asked Questions",
      "default_category": "General Support",
      "default_description": "Help with general issues"
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
      "auto_escalation_applied": "Pro: Smart Escalation applied (Priority: Urgent)",
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
      "note_added_footer": "By {{userTag}} Â· {{count}}/{{max}}",
      "notes_title": "Ticket notes",
      "notes_empty": "There are no notes on this ticket yet.",
      "notes_list_title": "Ticket notes â€” #{{ticketId}} ({{count}}/{{max}})",
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
    },
    "auto_reply": {
      "prefix": "ðŸ›¡ï¸ **TON618 PRO** | `Verified Support` â€” *\"{{trigger}}\"*",
      "footer": "â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nâš¡ **Ultra-Fast Priority** (0.4s) | ðŸ’ª [Be a hero, support the project](https://ton618.com/pro)",
      "pro_badge": "ðŸ›¡ï¸ PRO VERIFIED SUPPORT",
      "pro_footer_small": "Powered by TON618 Pro â€” Support excellence.",
      "urgency_keywords": [
        "urgent",
        "emergency",
        "help",
        "error",
        "fail",
        "not working",
        "payment",
        "problem",
        "hack",
        "stolen",
        "asap",
        "assistance"
      ],
      "priority_badge": "ðŸš¨ **[URGENT PRIORITY DETECTED]**",
      "priority_note": "âš ï¸ **Intelligence Note:** Manual review is being fast-tracked due to the critical nature of this ticket.",
      "sentiment_label": "🎭 User Sentiment",
      "sentiment_calm": "ðŸ˜Š Calm (Standard)",
      "sentiment_angry": "ðŸ˜¡ Angry / Critical Urgency",
      "suggestion_label": "ðŸ’¡ Pro Suggestion"
    },
    "events": {
      "claimed_dashboard": "Ticket claimed from dashboard",
      "claimed": "Ticket claimed",
      "released_dashboard": "Ticket released from dashboard",
      "assigned_dashboard": "Ticket assigned from dashboard",
      "unassigned": "Assignment removed",
      "status_updated": "Operational status updated",
      "closed_dashboard": "Ticket closed from dashboard",
      "closed": "Ticket closed",
      "reopened_dashboard": "Ticket reopened from dashboard",
      "reopened": "Ticket reopened",
      "internal_note": "Internal note added",
      "tag_added": "Tag added",
      "tag_removed": "Tag removed",
      "reply_sent": "Reply sent",
      "macro_sent": "Macro sent",
      "priority_updated": "Priority updated",
      "recommendation_confirmed": "Recommendation confirmed",
      "recommendation_discarded": "Recommendation discarded",
      "footer_bridge": "TON618 Â· Operational Inbox",
      "status_attending": "Attending",
      "status_searching": "Searching Staff",
      "claimed_dashboard_desc": "{{actor}} claimed ticket #{{id}} from the dashboard.",
      "claimed_desc": "{{actor}} took this ticket from the dashboard.",
      "released_dashboard_desc": "{{actor}} released ticket #{{id}} from the dashboard.",
      "assigned_dashboard_desc": "{{actor}} assigned themselves ticket #{{id}}.",
      "unassigned_desc": "{{actor}} removed the assignment for ticket #{{id}}.",
      "status_updated_desc": "{{actor}} changed ticket #{{id}} status to {{status}}.",
      "closed_dashboard_desc": "{{actor}} closed ticket #{{id}} from the dashboard.",
      "closed_desc": "{{actor}} closed this ticket from the dashboard.\nReason: {{reason}}",
      "reopened_dashboard_desc": "{{actor}} reopened ticket #{{id}} from the dashboard.",
      "reopened_desc": "{{actor}} reopened this ticket from the dashboard.",
      "internal_note_desc": "{{actor}} added an internal note from the dashboard.",
      "tag_added_desc": "{{actor}} added tag {{tag}} from the dashboard.",
      "tag_removed_desc": "{{actor}} removed tag {{tag}} from the dashboard.",
      "reply_sent_desc": "{{actor}} replied to the customer from the dashboard.",
      "reply_sent_title": "Reply from the dashboard",
      "macro_sent_desc": "{{actor}} sent macro {{macro}} from the dashboard.",
      "priority_updated_desc": "{{actor}} changed ticket #{{id}} priority to {{priority}}.",
      "recommendation_confirmed_desc": "{{actor}} confirmed an operational recommendation from the dashboard.",
      "recommendation_discarded_desc": "{{actor}} discarded an operational recommendation from the dashboard.",
      "no_details": "No additional details."
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
      "description": "Premium administration and server configuration console",
      "subcommands": {
        "status": { "description": "View general system and commercial status" },
        "tickets": { "description": "Review operational health of the ticket system" },
        "center": { "description": "Open the interactive configuration center" }
      }
    },
    "category": {
      "group_description": "Manage ticket categories and triage rules",
      "add_description": "Initialize a new ticket category",
      "remove_description": "Permanently delete a category from the server",
      "list_description": "List all active ticket categories",
      "edit_description": "Update settings for an existing category",
      "toggle_description": "Enable or disable a category",
      "option_id": "Category identifier",
      "option_discord_category": "Target Discord category ID",
      "option_id_remove": "ID of the category to remove",
      "option_id_edit": "ID of the category to modify",
      "option_label": "User-visible label",
      "option_description": "Detailed category description",
      "option_emoji": "Category emoji",
      "option_priority": "Default ticket priority",
      "option_discord_category_edit": "New Discord category ID",
      "option_ping_roles": "Roles to notify (IDs separated by commas)",
      "option_welcome_message": "Custom welcome message",
      "option_id_toggle": "ID of the category to toggle status"
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
    },
    "modlog": {
      "ban_title": "🔨 User Banned",
      "unban_title": "✅ User Unbanned",
      "edit_title": "✏️ Message Edited",
      "fields": {
        "user": "👤 User",
        "author": "👤 Author",
        "executor": "🛡️ Executed by",
        "channel": "📍 Channel",
        "reason": "Reason",
        "link": "Message Link",
        "before": "Before",
        "after": "After"
      },
      "no_reason": "No reason specified"
    }
  },
  "crons": {
    "auto_close": {
      "warning_desc": "⚠️ <@{{user}}> This ticket will be automatically closed soon due to inactivity.",
      "event_desc": "Ticket #{{ticketId}} was closed due to inactivity.",
      "embed_title_auto": "Ticket closed automatically",
      "embed_desc_auto": "This ticket was closed due to inactivity and will be deleted soon."
    },
    "polls": {
      "ended_title": "Poll Ended",
      "ended_desc": "The poll **\"{{question}}\"** has finished."
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
        },
        "template": {
          "description": "✨ Manage embed templates (Pro)",
          "save": {
            "description": "Save an embed configuration as a template"
          },
          "load": {
            "description": "Load and send a saved embed template"
          },
          "list": {
            "description": "List all saved embed templates"
          },
          "delete": {
            "description": "Delete a saved embed template"
          }
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
        "message_id": "Message ID to edit",
        "title": "Title",
        "description": "Description",
        "text": "Announcement content",
        "template_name": "Name of the template"
      }
    },
    "errors": {
      "invalid_color": "Invalid color. Use HEX format with 6 characters without `#` (e.g., `5865F2`).",
      "invalid_thumbnail_url": "Thumbnail URL must start with `https://`.",
      "channel_not_found": "Channel no longer exists.",
      "message_not_found": "Message not found. Verify the ID and channel.",
      "not_bot_message": "I can only edit messages sent by me.",
      "no_embeds": "That message has no embeds.",
      "form_expired": "âŒ The form has expired. Run `/embed create` again.",
      "template_not_found": "Template `{{name}}` not found.",
      "template_exists": "A template with the name `{{name}}` already exists.",
      "pro_required": "This feature requires **TON618 Pro**. Upgrade your server to unlock embed templates and more!",
      "invalid_image_url": "Invalid image URL. It must start with `http` or `https`."
    },
    "modal": {
      "create_title": "✨ Create Embed",
      "edit_title": "âœï¸ Edit Embed",
      "field_title_label": "Title (empty = no title)",
      "field_description_label": "Description",
      "field_description_placeholder": "Write the embed content here...",
      "field_extra_label": "Extra fields (optional) â€” format: Name|Value|inline",
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
      "announcement": "{{guildName}} Â· Announcement"
    },
    "templates": {
      "list_title": "Embed Templates",
      "no_templates": "No saved templates found.",
      "footer": "Use `/embed template load [name]` to send one."
    }
  },
  "poll": {
    "slash": {
      "description": "Interactive poll system",
      "subcommands": {
        "create": { "description": "Create a new poll" },
        "end": { "description": "End a poll early" },
        "list": { "description": "View active polls" }
      },
      "options": {
        "question": "Poll question",
        "options": "Options separated by |",
        "duration": "Duration (e.g., 1h, 30m, 1d)",
        "multiple": "Allow multiple votes",
        "channel": "Target channel",
        "anonymous": "Hide results until end (Pro)",
        "required_role": "Requirement to vote (Pro)",
        "max_votes": "Max choices allowed (Pro)",
        "id": "Poll ID (last 6 chars)"
      }
    },
    "errors": {
      "pro_required": "✨ This option requires **TON618 Pro**. Upgrade to unlock advanced features!",
      "min_options": "You need at least 2 options.",
      "max_options": "You can only have up to 10 options.",
      "option_too_long": "One of the options is too long (max 80 characters).",
      "min_duration": "The poll must last at least 1 minute.",
      "max_duration": "The poll cannot last more than 30 days.",
      "manage_messages_required": "You need 'Manage Messages' permission to end polls.",
      "poll_not_found": "Poll with ID `{{id}}` not found.",
      "unknown_subcommand": "Unknown poll subcommand."
    },
    "placeholder": "📊 Loading poll...",
    "embed": {
      "created_title": "✅ Poll Created",
      "created_description": "The poll has been sent to {{channel}}.",
      "title_prefix": "🗳️ Poll:",
      "title_ended_prefix": "🏁 Ended:",
      "field_question": "Question",
      "field_options": "Options",
      "field_total_votes": "Total Votes",
      "field_ends": "Ends",
      "field_created_by": "Created by",
      "field_required_role": "Required Role",
      "field_in": "Time remaining",
      "field_mode": "Voting Mode",
      "field_id": "PollID",
      "status_ended": "Poll Ended",
      "status_anonymous": "Results Hidden",
      "mode_multiple": "Multiple Choice",
      "mode_single": "Single Choice",
      "active_title": "📊 Active Polls",
      "active_empty": "No active polls in this server.",
      "active_channel_deleted": "Channel Deleted",
      "active_item_votes": "Votes",
      "active_count_title": "📊 Active Polls ({{count}})",
      "active_footer": "Use /poll end <id> to finish one early",
      "vote_plural": "votes",
      "vote_singular": "vote",
      "footer_ended": "Voting closed",
      "footer_multiple": "You can vote for multiple options",
      "footer_single": "Only one option allowed"
    },
    "success": {
      "ended": "✅ Poll **\"{{question}}\"** has been finished."
    }
  },
  "suggest": {
    "slash": { "description": "💡 Send a suggestion for the server" },
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
      "system_disabled": "The suggestion system is not enabled on this server.",
      "channel_not_configured": "The suggestions channel was not found.",
      "invalid_data": "Provide at least a title or description.",
      "already_reviewed": "This suggestion has already been reviewed.",
      "vote_error": "❌ Error registering your vote.",
      "not_exists": "❌ This suggestion no longer exists.",
      "manage_messages_required": "❌ You need 'Manage Messages' permission to review suggestions.",
      "already_status": "❌ This suggestion was already {{status}}.",
      "interaction_error": "❌ Invalid interaction.",
      "processing_error": "❌ Error processing suggestion.",
      "pro_required": "Suggest notes require **TON618 Pro**."
    },
    "modal": {
      "title": "💡 New Suggestion",
      "field_title_label": "Title",
      "field_title_placeholder": "e.g., Add a music channel",
      "field_description_label": "Description",
      "field_description_placeholder": "Explain your idea..."
    },
    "embed": {
      "title": "{{emoji}} Suggestion #{{num}}",
      "no_description": "> (No description)",
      "field_author": "👤 Author",
      "field_status": "📝 Status",
      "field_submitted": "📅 Submitted",
      "field_votes": "👍 {{up}}  •  👎 {{down}}  •  {{pct}}% approval",
      "footer_status": "Status: {{status}}",
      "field_staff_note": "💬 Staff Note",
      "debate_title": "Discussion: Suggestion #{{num}}",
      "debate_footer": "Keep it respectful",
      "author_anonymous": "Anonymous"
    },
    "buttons": {
      "vote_up": "👍 Support",
      "vote_down": "👎 Against",
      "approve": "✅ Approve",
      "reject": "Reject",
      "staff_note": "Add Note (Pro)"
    },
    "success": {
      "submitted_title": "✅ Suggestion Submitted",
      "submitted_description": "Your suggestion **#{{num}}** has been published in {{channel}}.",
      "submitted_footer": "Thank you for your feedback!",
      "vote_registered": "✅ Vote registered. ({{emoji}})",
      "status_updated": "✅ Suggestion **#{{num}}** marked as **{{status}}**."
    }
  },
  "profile": {
    "slash": {
      "description": "View server profile and stats",
      "subcommands": {
        "view": { "description": "View a specific user's profile" },
        "top": { "description": "View the server leaderboard" }
      },
      "options": { "user": "Target user to inspect" }
    },
    "embed": {
      "title": "{{username}}'s Profile",
      "user_fallback": "User {{id}}",
      "field_level": "Level",
      "field_total_xp": "Total XP",
      "field_rank": "Rank",
      "field_wallet": "Wallet",
      "field_bank": "Bank",
      "field_total": "Total Money",
      "top_title": "🏆 Server Top",
      "top_levels": "📊 Top Levels",
      "top_economy": "💰 Richest Members",
      "level_format": "Level {{level}}",
      "coins_format": "{{amount}} coins",
      "no_data": "No database records yet.",
      "page_format": "Page {{current}} of {{total}}"
    }
  },
  "mod": {
    "slash": {
      "description": "Advanced moderation commands",
      "subcommands": {
        "ban": {
          "description": "Ban a user from the server"
        },
        "unban": {
          "description": "Unban a user"
        },
        "kick": {
          "description": "Kick a user from the server"
        },
        "timeout": {
          "description": "Timeout a user (Discord native)"
        },
        "mute": {
          "description": "Mute a user with a role"
        },
        "unmute": {
          "description": "Unmute a user"
        },
        "history": {
          "description": "View a user's moderation history"
        },
        "purge": {
          "description": "Delete multiple messages"
        },
        "slowmode": {
          "description": "Set slowmode for a channel"
        }
      },
      "options": {
        "user": "The target user",
        "reason": "Reason for the action",
        "duration": "Duration (e.g., 1h, 7d, 30d)",
        "delete_messages": "Delete messages from the last...",
        "user_id": "Discord ID of the user to unban",
        "limit": "Number of actions to show",
        "amount": "Number of messages to delete (1-100)",
        "contains": "Only delete messages containing this text",
        "seconds": "Slowmode duration in seconds (0 to disable)",
        "channel": "Channel to set slowmode for"
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
      "ban_failed": "❌ Error banning user.",
      "unban_failed": "❌ Error unbanning user.",
      "not_banned": "❌ This user is not banned in this server.",
      "kick_failed": "❌ Error kicking user.",
      "timeout_failed": "❌ Error timing out user.",
      "mute_failed": "❌ Error muting user.",
      "unmute_failed": "❌ Error unmuting user.",
      "not_muted": "❌ This user is not muted.",
      "history_failed": "❌ Error fetching moderation history.",
      "no_history": "ℹ️ No moderation history found for {{user}}.",
      "no_messages": "❌ No messages matching the criteria found in the last 100 messages.",
      "purge_failed": "❌ Error deleting messages.",
      "slowmode_failed": "❌ Error setting slowmode."
    },
    "success": {
      "banned": "✅ **{{user}}** was banned.\n**Reason:** {{reason}}\n{{extra}}",
      "unbanned": "✅ **{{user}}** was unbanned.\n**Reason:** {{reason}}",
      "kicked": "✅ **{{user}}** was kicked.\n**Reason:** {{reason}}",
      "timeout": "✅ **{{user}}** was timed out for **{{duration}}**.\n**Reason:** {{reason}}",
      "muted": "✅ **{{user}}** was muted for **{{duration}}**.\n**Reason:** {{reason}}",
      "unmuted": "✅ **{{user}}** is no longer muted.\n**Reason:** {{reason}}",
      "purged": "✅ Deleted **{{count}}** messages successfully.",
      "slowmode_set": "✅ Slowmode set to **{{seconds}}s** in {{channel}}.",
      "slowmode_disabled": "✅ Slowmode disabled in {{channel}}."
    },
    "ban_extra": {
      "duration": "*Temp ban: {{duration}}*",
      "permanent": "*Permanent ban*",
      "messages_deleted": "*Messages deleted from last {{hours}}h*"
    },
    "history": {
      "title": "🛡️ Moderation History - {{user}}",
      "entry": "【{{index}}】 **{{action}}** — {{timestamp}}\n**Moderator:** {{moderator}}\n**Reason:** {{reason}}{{duration}}",
      "footer": "Showing the {{count}} most recent actions"
    }
  },
  "crons": {
    "auto_close": {
      "warning_desc": "⚠️ <@{{user}}> This ticket will be automatically closed soon due to inactivity.",
      "event_desc": "Ticket #{{ticketId}} was closed due to inactivity.",
      "embed_title_auto": "Ticket closed automatically",
      "embed_desc_auto": "This ticket was closed due to inactivity and will be deleted soon."
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
    },
    "modlog": {
      "ban_title": "🔨 User Banned",
      "unban_title": "✅ User Unbanned",
      "edit_title": "✏️ Message Edited",
      "fields": {
        "user": "👤 User",
        "author": "👤 Author",
        "executor": "🛡️ Executed by",
        "channel": "📍 Channel",
        "reason": "Reason",
        "link": "Message Link",
        "before": "Before",
        "after": "After"
      },
      "no_reason": "No reason specified"
    },
    "polls": {
      "ended_title": "Poll Ended",
      "ended_desc": "The poll **\"{{question}}\"** has finished."
    }
  },
  "interaction": {
    "shutdown": {
      "rebooting": "The bot is currently restarting to apply updates. Please try again in 15 seconds."
    }
  },
  "premium": {
    "reminder": {
      "field_plan": "Plan"
    }
  },
  "events": {
    "modlog": {
      "ban_title": "🔨 User Banned",
      "unban_title": "✅ User Unbanned",
      "edit_title": "✏️ Message Edited",
      "fields": {
        "user": "👤 User",
        "author": "👤 Author",
        "executor": "🛡️ Executed by",
        "channel": "📍 Channel",
        "reason": "Reason",
        "link": "Message Link",
        "before": "Before",
        "after": "After"
      },
      "no_reason": "No reason specified"
    }
  },
  "mod": {
    "slash": {
      "description": "Advanced moderation commands",
      "subcommands": {
        "ban": {
          "description": "Ban a user from the server"
        },
        "unban": {
          "description": "Unban a user"
        },
        "kick": {
          "description": "Kick a user from the server"
        },
        "timeout": {
          "description": "Timeout a user (Discord native)"
        },
        "mute": {
          "description": "Mute a user with a role"
        },
        "unmute": {
          "description": "Unmute a user"
        },
        "history": {
          "description": "View a user's moderation history"
        },
        "purge": {
          "description": "Delete multiple messages"
        },
        "slowmode": {
          "description": "Set slowmode for a channel"
        }
      },
      "options": {
        "user": "The target user",
        "reason": "Reason for the action",
        "duration": "Duration (e.g., 1h, 7d, 30d)",
        "delete_messages": "Delete messages from the last...",
        "user_id": "Discord ID of the user to unban",
        "limit": "Number of actions to show",
        "amount": "Number of messages to delete (1-100)",
        "contains": "Only delete messages containing this text",
        "seconds": "Slowmode duration in seconds (0 to disable)",
        "channel": "Channel to set slowmode for"
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
      "ban_failed": "❌ Error banning user.",
      "unban_failed": "❌ Error unbanning user.",
      "not_banned": "❌ This user is not banned in this server.",
      "kick_failed": "❌ Error kicking user.",
      "timeout_failed": "❌ Error timing out user.",
      "mute_failed": "❌ Error muting user.",
      "unmute_failed": "❌ Error unmuting user.",
      "not_muted": "❌ This user is not muted.",
      "history_failed": "❌ Error fetching moderation history.",
      "no_history": "ℹ️ No moderation history found for {{user}}.",
      "no_messages": "❌ No messages matching the criteria found in the last 100 messages.",
      "purge_failed": "❌ Error deleting messages.",
      "slowmode_failed": "❌ Error setting slowmode."
    },
    "success": {
      "banned": "✅ **{{user}}** was banned.\n**Reason:** {{reason}}\n{{extra}}",
      "unbanned": "✅ **{{user}}** was unbanned.\n**Reason:** {{reason}}",
      "kicked": "✅ **{{user}}** was kicked.\n**Reason:** {{reason}}",
      "timeout": "✅ **{{user}}** was timed out for **{{duration}}**.\n**Reason:** {{reason}}",
      "muted": "✅ **{{user}}** was muted for **{{duration}}**.\n**Reason:** {{reason}}",
      "unmuted": "✅ **{{user}}** is no longer muted.\n**Reason:** {{reason}}",
      "purged": "✅ Deleted **{{count}}** messages successfully.",
      "slowmode_set": "✅ Slowmode set to **{{seconds}}s** in {{channel}}.",
      "slowmode_disabled": "✅ Slowmode disabled in {{channel}}."
    },
    "ban_extra": {
      "duration": "*Temp ban: {{duration}}*",
      "permanent": "*Permanent ban*",
      "messages_deleted": "*Messages deleted from last {{hours}}h*"
    },
    "history": {
      "title": "🛡️ Moderation History - {{user}}",
      "entry": "【{{index}}】 **{{action}}** — {{timestamp}}\n**Moderator:** {{moderator}}\n**Reason:** {{reason}}{{duration}}",
      "footer": "Showing the {{count}} most recent actions"
    }
  },
  "leveling": {
    "slash": {
      "description": "Interactive leveling system",
      "subcommands": {
        "view": {
          "description": "View your level or another user's level"
        },
        "rank": {
          "description": "View your rank on the leaderboard"
        },
        "leaderboard": {
          "description": "View the server leaderboard"
        }
      },
      "options": {
        "user": "The target user",
        "page": "Page number to view"
      }
    },
    "embed": {
      "level": "Level",
      "total_xp": "Total XP",
      "messages": "Messages",
      "progress": "Progress",
      "footer": "Stay active to level up!",
      "title": "{{user}}'s Profile",
      "field_level_name": "Level",
      "field_total_xp_name": "Total XP",
      "field_progress_name": "Progress"
    },
    "rank": {
      "title": "{{user}}'s Rank",
      "description": "Your current position is #{{rank}} out of {{total}} with level {{level}}.",
      "no_xp": "You don't have any XP yet. Send some messages!",
      "footer": "XP: {{xp}} / {{next}} ({{remaining}} remaining)"
    },
    "leaderboard": {
      "title": "Server Leaderboard - {{guild}}",
      "empty": "No data found for this server yet.",
      "stats": "Level: {{level}} | XP: {{xp}}",
      "footer": "Page {{page}}/{{total}} • {{users}} total users"
    },
    "errors": {
      "disabled": "❌ Leveling system is disabled in this server.",
      "user_not_found": "❌ User not found.",
      "invalid_page": "❌ Invalid page. Max page is {{max}}.",
      "no_data": "❌ No leaderboard data found."
    },
    "status_disabled": "❌ Leveling system is currently disabled."
  },
  "giveaway": {
    "slash": {
      "description": "Manage giveaways in the server",
      "subcommands": {
        "create": { "description": "Create a new giveaway" },
        "end": { "description": "End an active giveaway early" },
        "reroll": { "description": "Choose new winners for an ended giveaway" },
        "list": { "description": "List all active giveaways" },
        "cancel": { "description": "Cancel an active giveaway without winners" }
      },
      "options": {
        "prize": "The prize to give away",
        "duration": "Duration (e.g., 30s, 5m, 2h, 1d, 1w)",
        "winners": "Number of winners (1-20)",
        "channel": "Channel to post the giveaway in",
        "requirement_type": "Requirement type to enter",
        "requirement_value": "Value for the requirement",
        "emoji": "Custom emoji to react with",
        "description": "Additional giveaway details",
        "required_role_2": "Additional role requirement (Pro)",
        "bonus_role": "Role for extra entries (Pro)",
        "bonus_weight": "Weight for the bonus role (Pro)",
        "min_account_age": "Minimum account age in days (Pro)",
        "message_id": "Giveaway message ID"
      }
    },
    "choices": {
      "requirement_none": "None",
      "requirement_role": "Role",
      "requirement_level": "Level",
      "requirement_account_age": "Account Age"
    }
  },
  "config": {
    "slash": {
      "description": "Premium administration and server configuration console",
      "subcommands": {
        "status": { "description": "View general system and commercial status" },
        "tickets": { "description": "Review operational health of the ticket system" },
        "center": { "description": "Open the interactive configuration center" }
      }
    },
    "category": {
      "group_description": "Manage ticket categories and triage rules",
      "add_description": "Initialize a new ticket category",
      "remove_description": "Permanently delete a category from the server",
      "list_description": "List all active ticket categories",
      "edit_description": "Update settings for an existing category",
      "toggle_description": "Enable or disable a category",
      "option_id": "Category identifier",
      "option_discord_category": "Target Discord category ID",
      "option_id_remove": "ID of the category to remove",
      "option_id_edit": "ID of the category to modify",
      "option_label": "User-visible label",
      "option_description": "Detailed category description",
      "option_emoji": "Category emoji",
      "option_priority": "Default ticket priority",
      "option_discord_category_edit": "New Discord category ID",
      "option_ping_roles": "Roles to notify (IDs separated by commas)",
      "option_welcome_message": "Custom welcome message",
      "option_id_toggle": "ID of the category to toggle status"
    }
  },
  "dashboard": {
    "title": "📊 Control Center & Stats",
    "description": "📡 *This panel updates in real-time*",
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
    "auto_update": "🔄 Auto-updates every 30s"
  },
  "leaderboard": {
    "title": "🏆 Staff Leaderboard",
    "no_data": "No staff data yet.",
    "closed": "closed",
    "claimed": "claimed"
  },
  "center": {
    "general": {
      "title": "TON618 Configuration Center",
      "description": "Interactive console to manage all your modules and automation rules."
    },
    "sections": {
      "general": "General System",
      "tickets": "Ticket Engine",
      "automod": "AutoMod Rules",
      "verification": "Identity & Security",
      "welcome": "Welcome",
      "goodbye": "Goodbye",
      "staff": "Team Operations",
      "commercial": "Pro Plan & Status"
    }
  },
  "tickets": {
    "labels": {
      "panel": "Ticket Panel",
      "panel_status": "Panel Status",
      "logs": "Moderation Logs",
      "transcripts": "Ticket Transcripts",
      "staff": "Support Staff Role",
      "admin": "Bot Admin Role",
      "public_panel_title": "Public Panel Title",
      "public_panel_description": "Public Panel Description",
      "welcome_message": "Ticket Welcome Message",
      "control_embed_title": "Staff Control Title",
      "control_embed_description": "Staff Control Description",
      "public_panel_color": "Panel Color (HEX)",
      "control_embed_color": "Control Color (HEX)",
      "max_per_user": "Concurrent Tickets",
      "global_limit": "Server Global Limit",
      "cooldown": "Creation Cooldown",
      "minimum_days": "Min Account Age (Days)",
      "simple_help": "Simple Triage Mode",
      "base_sla": "Base SLA Threshold",
      "smart_ping": "Smart Ping Warning",
      "auto_close": "Inactivity Auto-Close",
      "auto_assignment": "Auto-Assignment Engine",
      "online_only": "Assign Online Staff Only",
      "more": "...and {{count}} more"
    },
    "fields": {
      "channels_roles": "Infrastructure & Permissions",
      "commercial_status": "Commercial & Subscription",
      "panel_messaging": "UX & Personalization",
      "limits_access": "Access Control & Fair Use",
      "sla_automation": "Operational Intel & Automation",
      "escalation_reporting": "Incident & Escalation Reporting",
      "incident_mode": "Outage & Incident Mode"
    },
    "panel_status": {
      "not_configured": "🔴 NOT CONFIGURED",
      "published": "🟢 PUBLISHED",
      "pending": "🟡 PENDING"
    },
    "incident": {
      "inactive": "Bot is operating normally",
      "message": "Incident Broadcast",
      "default_message": "We are currently experiencing a high volume of tickets. Response times may be longer than usual.",
      "configured_categories": "Active Categories"
    },
    "categories": {
      "none": "No categories configured",
      "on": "ON",
      "off": "OFF",
      "pings": "{{count}} pings",
      "more": "...and {{count}} more"
    },
    "footers": {
      "pro": "TON618 Pro | Operational Intelligence Active",
      "free": "TON618 Console | Community Edition"
    }
  },
  "help.embed.home_title": "TON618 Help Center",
  "help.embed.home_desc": "Welcome to the help center for **{{guild}}**. Select a category below to explore commands.",
  "help.embed.home_footer": "TON618 Security & Support • {{guild}}",
  "help.embed.home_overview": "System Overview",
  "help.embed.home_overview_value": "Advanced ticket management, multi-language support, and utility tools for Pro servers.",
  "help.embed.home_visibility": "Your Access",
  "help.embed.home_visibility_value": "Level: **{{access}}**\nAvailable: **{{commands}}** commands across **{{categories}}** categories.\n{{simple_help}}",
  "help.embed.home_categories": "Available Categories",
  "help.embed.home_quick_start": "Quick Start Suggestions",
  "help.embed.category_title": "{{category}} Commands",
  "help.embed.category_desc": "Detailed documentation for this command group.",
  "help.embed.category_footer": "TON618 System • {{guild}}",
  "help.embed.command_footer": "TON618 Manual • {{guild}}",
  
  "help.embed.command_help": "Command: /{{command}}",
  "help.embed.focused_match": "Match: `{{usage}}`",
  "help.embed.and_word": "and",
  "help.embed.required_label": "Required",
  "help.embed.optional_label": "Optional",
  "help.embed.no_description": "No description provided.",
  "help.embed.command_not_found": "Command Not Found",
  "help.embed.command_not_found_desc": "Could not find any command matching `{{command}}`.",
  "help.embed.page_label": "Page",
  "help.embed.continued_suffix": " (cont.)",
  "help.embed.overview_prefix": "Overview",
  "help.embed.field_entries": "Usages",
  "help.embed.visible_commands_label": "Interactive Commands",
  "help.embed.visible_entries_label": "Unique Usages",
  "help.embed.command_singular": "command",
  "help.embed.command_plural": "commands",
  "help.embed.visible_entry_singular": "usage",
  "help.embed.visible_entry_plural": "usages",
  "help.embed.simple_help_note": "*(Note: Some advanced commands are hidden due to Simple Help mode)*",
  "help.embed.no_commands_in_category": "No commands available in this category.",
  "help.embed.select_home": "Home",
  "help.embed.select_placeholder": "Select a category",
  "help.embed.owner_only_menu": "Only the user who opened this panel can navigate it.",
  "help.embed.expired_placeholder": "Session expired — use /help again",
  "help.embed.denied_owner": "This help panel is restricted to the bot owner.",
  "help.embed.denied_staff": "This help panel is restricted to staff members.",
  "help.embed.denied_default": "You do not have permission to view this help panel.",
  "help.embed.categories.utility": "Utility",
  "help.embed.categories.tickets": "Tickets",
  "help.embed.categories.fun": "Community & Fun",
  "help.embed.categories.moderation": "Moderation",
  "help.embed.categories.config": "Config",
  "help.embed.categories.system": "System & Internal",
  "help.embed.categories.general": "General",
  "help.embed.categories.other": "Other",
  "help.embed.categories.owner": "Owner",
  "help.embed.categories.admin": "Admin",
  "help.embed.categories.staff": "Staff Member",
  "help.embed.categories.member": "Regular Member",
  "help.embed.quick_start_notes.ticket_open": "Open a support ticket",
  "help.embed.quick_start_notes.help_base": "Return to this menu",
  "help.embed.quick_start_notes.staff_my_tickets": "View your assigned tickets",
  "help.embed.quick_start_notes.ticket_claim": "Claim a ticket",
  "help.embed.quick_start_notes.ticket_note_add": "Add an internal staff note",
  "help.embed.quick_start_notes.modlogs_info": "Check moderation history",
  "help.embed.quick_start_notes.setup_wizard": "Launch the setup wizard",
  "help.embed.quick_start_notes.config_status": "Check server configuration",
  "help.embed.quick_start_notes.verify_panel": "Deploy the verification system",
  "help.embed.quick_start_notes.stats_sla": "View ticket SLA reports",
  "help.embed.quick_start_notes.debug_status": "Check bot status",
  "staff": {
    "slash": {
      "description": "Staff-exclusive management and moderation utilities",
      "subcommands": {
        "away_on": { "description": "Mark yourself as away with an optional reason" },
        "away_off": { "description": "Clear your away status and become active again" },
        "my_tickets": { "description": "Review your currently claimed and assigned tickets" },
        "warn_add": { "description": "Apply a formal warning to a member" },
        "warn_check": { "description": "Review a member's warning history" },
        "warn_remove": { "description": "Remove a specific warning by its unique ID" }
      },
      "options": {
        "reason": "Note explaining your away status",
        "user": "The member to inspect or warn",
        "warn_reason": "Description of the infraction",
        "warning_id": "The 6-character warning ID"
      }
    },
    "moderation_required": "You do not have sufficient permissions to manage member warnings.",
    "only_staff": "This command is restricted to staff members.",
    "away_on_title": "Away Status Set",
    "away_on_description": "You are now marked as away.{{reasonText}}",
    "away_on_footer": "You will not receive new ticket assignments while away.",
    "away_off": "You are now marked as active and available for ticket assignments.",
    "my_tickets_title": "My Tickets ({{count}})",
    "my_tickets_empty": "You have no open tickets assigned or claimed.",
    "ownership_claimed": "Claimed",
    "ownership_assigned": "Assigned",
    "ownership_watching": "Watching",
    "staff_no_data_title": "No Staff Data",
    "staff_no_data_description": "No statistics found for <@{{userId}}>."
  },
  "stats": {
    "slash": {
      "description": "High-fidelity ticket metrics and performance analysis",
      "subcommands": {
        "server": { "description": "Operational overview of ticket totals and response trends" },
        "sla": { "description": "Compliance report: first-response time and escalation density" },
        "staff": { "description": "Deep analysis of individual output and resolution efficiency" },
        "leaderboard": { "description": "Rank active staff by productivity and claim speed" },
        "ratings": { "description": "Staff satisfaction trends based on user feedback" },
        "staff_rating": { "description": "Visual rating profile for a specific staff member" }
      }
    },
    "server_title": "Server Statistics: {{guild}}",
    "total": "Total Tickets",
    "open": "Open",
    "closed": "Closed",
    "today": "Activity Today",
    "week": "Activity This Week",
    "opened": "Opened",
    "avg_rating": "Average Rating",
    "avg_response": "Avg First Response",
    "avg_close": "Avg Resolution Time",
    "no_data": "N/A",
    "staff_title": "Staff Profile: {{user}}",
    "closed_tickets": "Closed Tickets",
    "claimed_tickets": "Claimed Tickets",
    "assigned_tickets": "Assigned Tickets",
    "average_rating": "Average Rating",
    "ratings_count": "{{count}} ratings",
    "no_ratings_yet": "No ratings yet",
    "pro_consistent": "Consistent",
    "pro_top_performer": "Top Performer",
    "pro_needs_focus": "Needs Focus",
    "pro_metrics_title": "Pro Performance Intelligence",
    "pro_efficiency": "Resolution Efficiency",
    "pro_rating_quality": "Service Quality",
    "leaderboard_title": "Staff Performance Board",
    "leaderboard_closed": "closed",
    "leaderboard_claimed": "claimed",
    "leaderboard_empty": "No staff activity recorded yet.",
    "staff_rating_title": "Rating Density: {{user}}",
    "staff_rating_empty": "This staff member has not received any ratings yet.",
    "average_score": "Average Score",
    "total_ratings": "Total Ratings",
    "sla_title": "SLA Compliance Panel: {{guild}}",
    "sla_description": "Advanced metrics for response times and escalation management.",
    "sla_threshold": "SLA Threshold",
    "escalation": "Escalation Status",
    "escalation_threshold": "Escalation Threshold",
    "sla_overrides": "SLA Priority Rules",
    "escalation_overrides": "Escalation Rules",
    "open_out_of_sla": "Open (Breached)",
    "open_escalated": "Currently Escalated",
    "avg_first_response": "Avg First Response",
    "sla_compliance": "SLA Compliance Rate",
    "tickets_evaluated": "Tickets Evaluated",
    "no_sla_threshold": "No threshold set",
    "not_configured": "Not configured",
    "period_all": "All time",
    "period_month": "Last month",
    "period_week": "Last week",
    "ratings_title": "Staff Satisfaction Ratings",
    "ratings_empty": "No ratings available.",
    "fallback_user": "User #{{suffix}}",
    "fallback_staff": "Staff #{{suffix}}"
  },

  "staff": {
    "slash": {
      "description": "Staff-exclusive management and moderation utilities",
      "subcommands": {
        "away_on": { "description": "Mark yourself as away with an optional reason" },
        "away_off": { "description": "Clear your away status and become active again" },
        "my_tickets": { "description": "Review your currently claimed and assigned tickets" },
        "warn_add": { "description": "Apply a formal warning to a member" },
        "warn_check": { "description": "Review a member's warning history" },
        "warn_remove": { "description": "Remove a specific warning by its unique ID" }
      },
      "options": {
        "reason": "Note explaining your away status",
        "user": "The member to inspect or warn",
        "warn_reason": "Description of the infraction",
        "warning_id": "The 6-character warning ID"
      }
    },
    "moderation_required": "You do not have sufficient permissions to manage member warnings.",
    "only_staff": "This command is restricted to staff members.",
    "away_on_title": "Away Status Set",
    "away_on_description": "You are now marked as away.{{reasonText}}",
    "away_on_footer": "You will not receive new ticket assignments while away.",
    "away_off": "You are now marked as active and available for ticket assignments.",
    "my_tickets_title": "My Tickets ({{count}})",
    "my_tickets_empty": "You have no open tickets assigned or claimed.",
    "ownership_claimed": "Claimed",
    "ownership_assigned": "Assigned",
    "ownership_watching": "Watching",
    "staff_no_data_title": "No Staff Data",
    "staff_no_data_description": "No statistics found for <@{{userId}}>."
  },
  "stats": {
    "slash": {
      "description": "High-fidelity ticket metrics and performance analysis",
      "subcommands": {
        "server": { "description": "Operational overview of ticket totals and response trends" },
        "sla": { "description": "Compliance report: first-response time and escalation density" },
        "staff": { "description": "Deep analysis of individual output and resolution efficiency" },
        "leaderboard": { "description": "Rank active staff by productivity and claim speed" },
        "ratings": { "description": "Staff satisfaction trends based on user feedback" },
        "staff_rating": { "description": "Visual rating profile for a specific staff member" }
      }
    },
    "server_title": "Server Statistics: {{guild}}",
    "total": "Total Tickets",
    "open": "Open",
    "closed": "Closed",
    "today": "Activity Today",
    "week": "Activity This Week",
    "opened": "Opened",
    "avg_rating": "Average Rating",
    "avg_response": "Avg First Response",
    "avg_close": "Avg Resolution Time",
    "no_data": "N/A",
    "staff_title": "Staff Profile: {{user}}",
    "closed_tickets": "Closed Tickets",
    "claimed_tickets": "Claimed Tickets",
    "assigned_tickets": "Assigned Tickets",
    "average_rating": "Average Rating",
    "ratings_count": "{{count}} ratings",
    "no_ratings_yet": "No ratings yet",
    "pro_consistent": "Consistent",
    "pro_top_performer": "Top Performer",
    "pro_needs_focus": "Needs Focus",
    "pro_metrics_title": "Pro Performance Intelligence",
    "pro_efficiency": "Resolution Efficiency",
    "pro_rating_quality": "Service Quality",
    "leaderboard_title": "Staff Performance Board",
    "leaderboard_closed": "closed",
    "leaderboard_claimed": "claimed",
    "leaderboard_empty": "No staff activity recorded yet.",
    "staff_rating_title": "Rating Density: {{user}}",
    "staff_rating_empty": "This staff member has not received any ratings yet.",
    "average_score": "Average Score",
    "total_ratings": "Total Ratings",
    "sla_title": "SLA Compliance Panel: {{guild}}",
    "sla_description": "Advanced metrics for response times and escalation management.",
    "sla_threshold": "SLA Threshold",
    "escalation": "Escalation Status",
    "escalation_threshold": "Escalation Threshold",
    "sla_overrides": "SLA Priority Rules",
    "escalation_overrides": "Escalation Rules",
    "open_out_of_sla": "Open (Breached)",
    "open_escalated": "Currently Escalated",
    "avg_first_response": "Avg First Response",
    "sla_compliance": "SLA Compliance Rate",
    "tickets_evaluated": "Tickets Evaluated",
    "no_sla_threshold": "No threshold set",
    "not_configured": "Not configured",
    "period_all": "All time",
    "period_month": "Last month",
    "period_week": "Last week",
    "ratings_title": "Staff Satisfaction Ratings",
    "ratings_empty": "No ratings available.",
    "fallback_user": "User #{{suffix}}",
    "fallback_staff": "Staff #{{suffix}}"
  },

  "help.embed.command_desc": "**Summary:** {{summary}}\n**Category:** {{category}}\n**Access:** `{{access}}`{{focus}}",
  "giveaway": {
    "slash": {
      "description": "Manage giveaways in the server",
      "subcommands": {
        "create": { "description": "Create a new giveaway" },
        "end": { "description": "End an active giveaway early" },
        "reroll": { "description": "Pick new winners for an ended giveaway" },
        "list": { "description": "List all active giveaways" },
        "cancel": { "description": "Cancel an active giveaway without winners" }
      },
      "options": {
        "prize": "The prize to give away",
        "duration": "Duration (e.g., 30s, 5m, 2h, 1d, 1w)",
        "winners": "Number of winners (1-20)",
        "channel": "Target channel",
        "requirement_type": "Requirement type to enter",
        "requirement_value": "Requirement value",
        "emoji": "Custom emoji to react",
        "description": "Additional giveaway details",
        "required_role_2": "Additional role requirement (Pro)",
        "bonus_role": "Role for extra entries (Pro)",
        "bonus_weight": "Weight for bonus role (Pro)",
        "min_account_age": "Minimum account age in days (Pro)",
        "message_id": "Giveaway message ID"
      }
    },
    "choices": {
      "requirement_none": "None",
      "requirement_role": "Role",
      "requirement_level": "Level",
      "requirement_account_age": "Account Age"
    },
    "embed": {
      "title": "🎉 Giveaway",
      "prize": "Prize",
      "winners": "Winners",
      "ends": "Ends",
      "hosted_by": "Hosted by",
      "click_participant": "Click the button below to join!",
      "participate_label": "Join",
      "status_ended": "Ended",
      "status_no_participants": "Ended (No participants)",
      "status_cancelled": "Cancelled",
      "winners_announcement": "Congratulations {{winners}}! You won **{{prize}}**!",
      "reroll_announcement": "New winner(s): {{winners}}! You won **{{prize}}**!",
      "requirements": "Requirements"
    },
    "requirements": {
      "role": "Must have role: {{role}}",
      "level": "Must be at least level: {{level}}",
      "account_age": "Account must be at least {{days}} days old"
    },
    "success": {
      "created": "✅ Giveaway created in {{channel}}! [[Jump to Message]]({{url}})",
      "ended": "✅ Giveaway ended. Winners: {{winners}}",
      "rerolled": "✅ Rerolled! New winners: {{winners}}",
      "cancelled": "✅ Giveaway has been cancelled.",
      "requirement_role_2": "Must also have: <@&{{roleId}}>",
      "requirement_bonus": "[PRO] Extra entries for <@&{{roleId}}> (x{{weight}})"
    },
    "errors": {
      "create_failed": "Failed to create giveaway.",
      "not_found": "Giveaway not found.",
      "already_ended": "This giveaway has already ended.",
      "no_participants": "No valid participants found.",
      "end_failed": "Failed to end giveaway.",
      "reroll_failed": "Failed to reroll giveaway.",
      "cancel_failed": "Failed to cancel giveaway."
    }
  },
  "poll": {
    "slash": {
      "description": "Interactive polling system",
      "subcommands": {
        "create": { "description": "Create a new poll" },
        "end": { "description": "End a poll early" },
        "list": { "description": "View active polls" }
      },
      "options": {
        "question": "Poll question",
        "options": "Options separated by |",
        "duration": "Duration (e.g., 1h, 30m, 1d)",
        "multiple": "Allow multiple votes",
        "channel": "Target channel",
        "anonymous": "Hide results until end (Pro)",
        "required_role": "Requirement to vote (Pro)",
        "max_votes": "Max options allowed (Pro)",
        "id": "Poll ID (last 6 characters)"
      }
    },
    "errors": {
      "pro_required": "✨ This requires **TON618 Pro**.",
      "min_options": "You need at least 2 options.",
      "max_options": "You can only have up to 10 options.",
      "option_too_long": "An option is too long (max 80 chars).",
      "min_duration": "Poll must last at least 1 minute.",
      "max_duration": "Poll cannot last more than 30 days.",
      "manage_messages_required": "You need 'Manage Messages' permission.",
      "poll_not_found": "Poll with ID `{{id}}` not found.",
      "unknown_subcommand": "Unknown poll subcommand.",
      "role_required": "You must have the <@&{{roleId}}> role to vote.",
      "max_votes_reached": "You can only vote for up to {{max}} options."
    },
    "placeholder": "📊 Loading poll...",
    "embed": {
      "created_title": "✅ Poll Created",
      "created_description": "Poll sent to {{channel}}.",
      "title_prefix": "🗳️ Poll:",
      "title_ended_prefix": "🏁 Ended:",
      "field_question": "Question",
      "field_options": "Options",
      "field_total_votes": "Total Votes",
      "field_ends": "Ends",
      "field_created_by": "Created by",
      "field_required_role": "Required Role",
      "field_in": "Time remaining",
      "field_mode": "Voting Mode",
      "field_id": "Poll ID",
      "status_ended": "Poll Ended",
      "status_anonymous": "Hidden Results",
      "mode_multiple": "Multiple Choice",
      "mode_single": "Single Choice",
      "active_title": "📊 Active Polls",
      "active_empty": "No active polls in this server.",
      "active_channel_deleted": "Channel Deleted",
      "active_item_votes": "Votes",
      "active_count_title": "📊 Active Polls ({{count}})",
      "active_footer": "Use /poll end <id> to end early",
      "vote_plural": "votes",
      "vote_singular": "vote",
      "footer_ended": "Voting closed",
      "footer_multiple": "You can vote for multiple options",
      "footer_single": "Only one option allowed"
    },
    "success": {
      "ended": "✅ The poll **\"{{question}}\"** has been ended.",
      "vote_active_single": "You voted for: **{{option}}**",
      "vote_active_multiple": "Your current votes: {{options}}",
      "vote_removed": "Your vote has been removed."
    }
  },
  "embed": {
    "slash": {
      "description": "✨ Custom embed builder",
      "subcommands": {
        "create": { "description": "Create and send an embed" },
        "edit": { "description": "Edit an existing embed" },
        "quick": { "description": "Send a simple quick embed" },
        "announcement": { "description": "Professional announcement template" },
        "template": { 
          "description": "✨ Manage embed templates (Pro)",
          "save": { "description": "Save current config as template" },
          "load": { "description": "Load and send a template" },
          "list": { "description": "List all server templates" },
          "delete": { "description": "Delete a template" }
        }
      },
      "options": {
        "channel": "Target channel",
        "color": "HEX Color",
        "image": "Image URL",
        "thumbnail": "Thumbnail URL",
        "footer": "Footer text",
        "author": "Author name",
        "author_icon": "Author icon URL",
        "timestamp": "Show timestamp",
        "mention": "Mention when sending",
        "message_id": "Message ID",
        "title": "Title",
        "description": "Description",
        "text": "Announcement content",
        "template_name": "Template name"
      }
    },
    "errors": {
      "pro_required": "✨ Embed templates require **TON618 Pro**.",
      "invalid_color": "Invalid HEX color format.",
      "invalid_image_url": "Image URL must start with http/https.",
      "invalid_thumbnail_url": "Thumbnail URL must start with http/https.",
      "template_exists": "Template `{{name}}` already exists.",
      "template_not_found": "Template `{{name}}` not found.",
      "form_expired": "Form session expired.",
      "channel_not_found": "Target channel not found.",
      "message_not_found": "Message not found.",
      "not_bot_message": "That message was not sent by the bot.",
      "no_embeds": "That message has no embeds."
    },
    "success": {
      "template_saved": "✅ Template **{{name}}** saved successfully.",
      "template_deleted": "✅ Template **{{name}}** deleted.",
      "sent": "✅ Embed sent to {{channel}}.",
      "edited": "✅ Embed edited successfully.",
      "announcement_sent": "📢 Announcement broadcast in {{channel}}."
    },
    "templates": {
      "no_templates": "No saved templates. Use `/embed template save`.",
      "list_title": "Embed Templates - {{guildName}}",
      "footer": "Total: {{count}}/50 templates"
    },
    "modal": {
      "create_title": "✨ Create Embed",
      "edit_title": "✏️ Edit Embed",
      "field_title_label": "Title (leave blank for none)",
      "field_description_label": "Description",
      "field_description_placeholder": "Write embed content here...",
      "field_extra_label": "Extra fields (name|value|inline)",
      "field_extra_placeholder": "Field Name|Field Value|true\nOther Field|Value|false",
      "field_color_label": "HEX Color without #",
      "field_extra_fallback_name": "Field"
    },
    "footer": {
      "sent_by": "Sent by {{username}}",
      "announcement": "Official Announcement from {{guildName}}"
    },
    "announcement_prefix": "📢 "
  },
  "profile": {
    "slash": {
      "description": "Simple profile: level + economy",
      "subcommands": {
        "view": { "description": "View a profile" },
        "top": { "description": "View leaderboard" }
      },
      "options": {
        "user": "User to inspect"
      }
    },
    "embed": {
      "title": "{{username}}'s Profile",
      "field_level": "Level",
      "field_total_xp": "Total XP",
      "field_rank": "Rank",
      "field_wallet": "Wallet",
      "field_bank": "Bank",
      "field_total": "Net Worth",
      "user_fallback": "User #{{id}}",
      "top_title": "🏆 Leaderboard",
      "top_levels": "📊 Top Levels",
      "top_economy": "💰 Richest Members",
      "no_data": "No participants yet.",
      "level_format": "Level {{level}}",
      "coins_format": "{{amount}} coins",
      "page_format": "Page {{current}} of {{total}}"
    }
  },
  "automod": {
    "labels": {
      "spam": "Spam Prevention",
      "invites": "Invite Blocking",
      "scam": "Scam Phrase Filter",
      "regex": "Regex Pattern Matching"
    }
  },
  "common.labels.onboarding_status": "Onboarding status",
  "common.labels.last_updated": "Last updated",
  "stats.staff_no_data_title": "No staff data yet",
  "stats.staff_no_data_description": "This staff member does not have enough activity to build a profile yet.",
  "support_server.restricted": "This command is only available in the official support server."
};
