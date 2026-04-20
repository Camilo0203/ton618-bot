module.exports = {
  "access": {
    "admin_required": "You need administrator permissions to use this command.",
    "default": "You do not have permission to use this command.",
    "guild_only": "This command can only be used inside a server.",
    "owner_only": "This command is only for the bot owner.",
    "staff_required": "You need staff permissions to use this command."
  },
  "alerts": {
    "action_check_business": "Check business justification",
    "action_check_health": "Check bot health",
    "action_investigate": "Investigate user activity",
    "action_review_deployments": "Review recent deployments",
    "action_review_permissions": "Review admin permissions",
    "action_temporary_ban": "Consider temporary ban if pattern continues",
    "action_verify_generator": "Verify with code generator",
    "action_verify_identity": "Verify admin identity",
    "security_alert": "Security Alert",
    "security_system": "Security System",
    "test_message": "This is a test alert to verify the security notification system is working.",
    "test_recommendation": "If you see this, the alert system is configured correctly!"
  },
  "audit": {
    "all": "All",
    "category_label": "Category",
    "empty": "No tickets found matching those filters.",
    "export_title": "📊 Audit Export Generated",
    "from_label": "From",
    "invalid_from": "Invalid 'from' date. Use YYYY-MM-DD.",
    "invalid_range": "'from' date must be before 'to' date.",
    "invalid_to": "Invalid 'to' date. Use YYYY-MM-DD.",
    "none": "None",
    "options": {
      "category": "Filter by category",
      "from": "Start date in YYYY-MM-DD",
      "limit": "Maximum rows (1-500)",
      "priority": "Filter by priority",
      "status": "Filter by ticket status",
      "to": "End date in YYYY-MM-DD"
    },
    "priority_label": "Priority",
    "rows": "Total rows",
    "slash": {
      "description": "Administrative audits and exports",
      "subcommands": {
        "tickets": {
          "description": "Export tickets to CSV with filters"
        }
      }
    },
    "status_label": "Status",
    "title": "Audit Export",
    "to_label": "To",
    "unsupported_subcommand": "Unsupported subcommand."
  },
  "automod": {
    "labels": {
      "invites": "Invite Blocking",
      "regex": "Regex Pattern Matching",
      "scam": "Scam Phrase Filter",
      "spam": "Spam Prevention"
    }
  },
  "autorole": {
    "choices": {
      "mode_replace": "Replace - Remove previous level roles",
      "mode_stack": "Stack - Keep all previous level roles"
    },
    "errors": {
      "add_failed": "Failed to add reaction role reward.",
      "join_remove_failed": "Failed to disable join role.",
      "join_set_failed": "Failed to configure join role.",
      "level_add_failed": "Failed to add level reward.",
      "level_remove_failed": "Failed to remove level reward.",
      "list_failed": "Failed to fetch auto-role list.",
      "message_not_found": "The specified message could not be found in this channel.",
      "no_autoroles": "No auto-role configurations found for this server.",
      "no_level_roles": "No level role rewards are configured.",
      "not_found": "No reaction role reward found for this configuration.",
      "panel_failed": "Failed to create reaction role panel.",
      "remove_failed": "Failed to remove reaction role reward.",
      "role_hierarchy": "I cannot assign this role because it is higher than my highest role."
    },
    "list": {
      "join_role": "📥 Join Role",
      "join_role_value": "**Role:** {{role}}\n**Delay:** {{delay}}s\n**Exclude Bots:** {{excludeBots}}",
      "level_entry": "**Level {{level}}:** <@&{{roleId}}>",
      "level_roles": "📈 Level Rewards (Mode: {{mode}})",
      "message": "Message",
      "reaction_roles": "🔘 Reaction Roles",
      "title": "✨ Auto-Role Configurations"
    },
    "options": {
      "autorole_join_set_delay_delay": "Delay in seconds antes de assign el rol",
      "autorole_join_set_exclude_bots_exclude_bots": "Exclude bots from receiving role",
      "autorole_join_set_role_role": "Rol a assign cuando los users se unan",
      "autorole_level_add_level_level": "Level required to receive el rol",
      "autorole_level_add_role_role": "Rol a assign at this level",
      "autorole_level_mode_mode_mode": "Mode for level roles (stack or replace)",
      "autorole_level_remove_level_level": "Nivel del cual quitar el rol",
      "autorole_reaction_add_emoji_emoji": "Emoji to reaccionar",
      "autorole_reaction_add_message_id_message_id": "Message ID to add reaction role",
      "autorole_reaction_add_role_role": "Rol a assign when reacting",
      "autorole_reaction_panel_channel_channel": "Channel to create the panel (default: current)",
      "autorole_reaction_panel_description_description": "Description for the panel",
      "autorole_reaction_panel_title_title": "Title for the panel",
      "autorole_reaction_remove_emoji_emoji": "Emoji to remove",
      "autorole_reaction_remove_message_id_message_id": "Message ID to remove reaction role"
    },
    "panel": {
      "description": "Select the roles you want by reacting below.",
      "footer": "TON618 Reaction Roles",
      "title": "Role Selection"
    },
    "slash": {
      "description": "Configure assignment automatic de roles",
      "groups": {
        "join": "Manage join roles",
        "level": "Manage level roles",
        "reaction": "Manage reaction roles"
      },
      "subcommands": {
        "join_remove": {
          "description": "Remove the join role"
        },
        "join_set": {
          "description": "Set a role to give when users join",
          "options": {
            "delay": "Delay in seconds before assigning (default: 0)",
            "exclude_bots": "Exclude bots from receiving role",
            "role": "Role to assign on join"
          }
        },
        "level_add": {
          "description": "Add a level role reward",
          "options": {
            "level": "Level required",
            "role": "Role to assign"
          }
        },
        "level_list": {
          "description": "List all level role rewards"
        },
        "level_mode": {
          "description": "Set level role mode",
          "options": {
            "mode": "Mode (stack or replace)"
          }
        },
        "level_remove": {
          "description": "Remove a level role reward",
          "options": {
            "level": "Level to remove"
          }
        },
        "list": {
          "description": "List all auto-role configurations"
        },
        "reaction_add": {
          "description": "Add a reaction role to a message",
          "options": {
            "emoji": "Emoji to react with",
            "message_id": "Message ID",
            "role": "Role to assign"
          }
        },
        "reaction_panel": {
          "description": "Create a reaction roles panel",
          "options": {
            "channel": "Channel to post the panel"
          }
        },
        "reaction_remove": {
          "description": "Remove a reaction role from a message",
          "options": {
            "emoji": "Emoji to remove",
            "message_id": "Message ID"
          }
        }
      }
    },
    "success": {
      "join_removed": "✅ Join role has been disabled.",
      "join_set": "✅ Join role set to {{role}} with {{delay}}s delay (Exclude Bots: {{excludeBots}})",
      "level_added": "✅ Level {{level}} reward set to {{role}}.",
      "level_removed": "✅ Level {{level}} reward removed.",
      "mode_set": "✅ Level role mode set to **{{mode}}**.",
      "panel_created": "✅ Reaction role panel created in {{channel}} (ID: {{messageId}})",
      "reaction_added": "✅ Reaction role added: {{emoji}} → {{role}}",
      "reaction_removed": "✅ Reaction role removed for emoji {{emoji}}"
    }
  },
  "case_brief.actions.claim_or_assign": "Claim or assign this ticket.",
  "case_brief.actions.closed_no_action": "Ticket is closed. No action required.",
  "case_brief.actions.continue_normal": "Continue with normal handling.",
  "case_brief.actions.near_sla_limit": "Respond before the SLA threshold is breached.",
  "case_brief.actions.review_reopen": "Review the reopen history before replying.",
  "case_brief.actions.urgent_first_response": "Send a first response immediately.",
  "case_brief.actions.urgent_priority_resolve": "Prioritize resolution urgently.",
  "case_brief.closed": "Closed",
  "case_brief.context_labels.age": "Age",
  "case_brief.context_labels.assigned": "Assigned",
  "case_brief.context_labels.first_response": "First response",
  "case_brief.context_labels.messages": "Messages",
  "case_brief.context_labels.pending": "Pending",
  "case_brief.context_labels.reopenings": "Reopenings",
  "case_brief.context_labels.responsible": "Responsible",
  "case_brief.context_labels.type": "Type",
  "case_brief.context_labels.unassigned": "Unassigned",
  "case_brief.footer": "Operational case brief",
  "case_brief.next_action": "Next action",
  "case_brief.no_risk_factors": "No major risk factors detected.",
  "case_brief.open": "Open",
  "case_brief.operational_context": "Operational context",
  "case_brief.pro_unlock_description": "Upgrade to Pro to unlock advanced case briefing.",
  "case_brief.pro_unlock_title": "Pro feature",
  "case_brief.recommendations": "Recommendations",
  "case_brief.recommendations_list.consider_priority": "Consider raising priority.",
  "case_brief.recommendations_list.continue_normal": "Continue with the standard workflow.",
  "case_brief.recommendations_list.document_resolution": "Document the final resolution clearly.",
  "case_brief.recommendations_list.escalate": "Escalate to the next support level.",
  "case_brief.recommendations_list.respond_immediately": "Respond immediately.",
  "case_brief.recommendations_list.review_history": "Review previous conversation history.",
  "case_brief.recommendations_list.use_claim": "Use claim or assign ownership.",
  "case_brief.recommendations_list.verify_user": "Verify the user's latest request and expectations.",
  "case_brief.risk_level": "Risk level",
  "case_brief.risks.extensive_conversation": "Long conversation history",
  "case_brief.risks.high_priority_category": "High-priority category",
  "case_brief.risks.outside_sla": "Outside SLA threshold",
  "case_brief.risks.reopened_times": "Reopened multiple times",
  "case_brief.risks.unassigned_30min": "Unassigned for more than 30 minutes",
  "case_brief.risks.urgent_priority": "Urgent priority selected",
  "case_brief.status": "Status",
  "case_brief.title": "Case Brief",
  "center": {
    "autoresponses": {
      "behavior_button": "Update Behavior",
      "behavior_modal_title": "Update Auto-Response Behavior",
      "behavior_saved": "Auto-response behavior updated successfully.",
      "button_create": "Create Response",
      "create_modal_content": "Response Content",
      "create_modal_title": "Create Auto-Response",
      "create_modal_trigger": "Trigger Word",
      "current_behavior_label": "Current Behavior",
      "delete_button": "Delete Response"
    },
    "general": {
      "description": "Interactive console to manage all your modules and automation rules.",
      "title": "TON618 Configuration Center"
    },
    "sections": {
      "automod": "AutoMod Rules",
      "commercial": "Pro Plan & Status",
      "general": "General System",
      "goodbye": "Goodbye",
      "staff": "Team Operations",
      "tickets": "Ticket Engine",
      "verification": "Identity & Security",
      "welcome": "Welcome"
    }
  },
  "center.access.admin_only": "Only administrators can use this action.",
  "center.access.owner_only": "Only the owner of this panel can use this action.",
  "center.actions.action_canceled": "Action canceled.",
  "center.actions.action_confirmed": "Action confirmed.",
  "center.actions.cancel": "Cancel",
  "center.actions.clear_admin": "Clear admin role",
  "center.actions.clear_autorole": "Clear autorole",
  "center.actions.clear_staff": "Clear staff role",
  "center.actions.clear_unverified": "Clear unverified role",
  "center.actions.clear_verified": "Clear verified role",
  "center.actions.clear_verify": "Clear verify role",
  "center.actions.confirm": "Confirm",
  "center.actions.confirm_fallback": "Critical action",
  "center.actions.confirm_prompt": "Are you sure you want to run: {{action}}?",
  "center.actions.export_with_id": "Configuration exported. Backup ID: `{{id}}`.",
  "center.actions.export_without_id": "Configuration exported successfully.",
  "center.actions.invalid_action_autoresponses": "Unsupported autoresponse action.",
  "center.actions.invalid_action_blacklist": "Unsupported blacklist action.",
  "center.actions.invalid_critical_action": "That critical action is no longer valid.",
  "center.actions.maintenance_off": "Maintenance mode disabled.",
  "center.actions.maintenance_on": "Maintenance mode enabled.",
  "center.actions.no_backups_for_rollback": "There are no backups available to roll back.",
  "center.actions.panel_published": "Verification panel published successfully.",
  "center.actions.recent_backups": "Recent backups: {{list}}",
  "center.actions.rollback_latest": "Rollback latest backup",
  "center.actions.set_panel_channel_first": "Set the verification panel channel first.",
  "center.actions.verification_panel_refreshed": "Verification panel refreshed.",
  "center.blacklist.no_reason": "No reason provided.",
  "center.modals.antiraid_title": "Anti-raid",
  "center.modals.automation_title": "Automation",
  "center.modals.autoresponse_add_title": "Add Auto Response",
  "center.modals.autoresponse_delete_title": "Delete Auto Response",
  "center.modals.autoresponse_title": "Auto Response",
  "center.modals.autoresponse_toggle_title": "Toggle Auto Response",
  "center.modals.blacklist_add_title": "Blacklist User",
  "center.modals.blacklist_check_title": "Check Blacklist Entry",
  "center.modals.blacklist_remove_title": "Remove Blacklist Entry",
  "center.modals.blacklist_title": "Blacklist",
  "center.modals.command_rate_limit_title": "Command Rate Limits",
  "center.modals.field_action": "Action",
  "center.modals.field_answer": "Answer",
  "center.modals.field_auto_close": "Auto-close minutes",
  "center.modals.field_backup_id": "Backup ID",
  "center.modals.field_banner": "Banner URL",
  "center.modals.field_bypass_admin": "Bypass admins (true/false)",
  "center.modals.field_cmd_max": "Command max actions",
  "center.modals.field_cmd_window": "Command window seconds",
  "center.modals.field_color": "Color",
  "center.modals.field_cooldown": "Cooldown (minutes)",
  "center.modals.field_description": "Description",
  "center.modals.field_exact_trigger": "Exact trigger",
  "center.modals.field_footer": "Footer",
  "center.modals.field_global_limit": "Global ticket limit",
  "center.modals.field_image": "Image URL",
  "center.modals.field_joins": "Join threshold",
  "center.modals.field_json": "JSON payload",
  "center.modals.field_max_actions": "Max actions",
  "center.modals.field_message": "Message",
  "center.modals.field_min_days": "Minimum account days",
  "center.modals.field_question": "Question",
  "center.modals.field_reason": "Reason",
  "center.modals.field_reason_clear": "Reason or CLEAR",
  "center.modals.field_response": "Response",
  "center.modals.field_seconds": "Window seconds",
  "center.modals.field_sla": "SLA warning minutes",
  "center.modals.field_smart_ping": "Smart ping minutes",
  "center.modals.field_title": "Title",
  "center.modals.field_transcript_channel": "Transcript channel ID",
  "center.modals.field_trigger": "Trigger",
  "center.modals.field_user_id": "User ID",
  "center.modals.field_weekly_report_channel": "Weekly report channel ID",
  "center.modals.field_window": "Window seconds",
  "center.modals.goodbye_text_title": "Goodbye Text",
  "center.modals.import_title": "Import Configuration",
  "center.modals.limits_title": "Limits",
  "center.modals.maintenance_reason_title": "Maintenance Reason",
  "center.modals.rate_limit_title": "Interaction Rate Limits",
  "center.modals.rollback_title": "Rollback Configuration",
  "center.modals.verify_panel_title": "Verification Panel",
  "center.modals.verify_question_title": "Verification Question",
  "center.modals.welcome_text_title": "Welcome Text",
  "center.responses.antiraid_updated": "Anti-raid settings updated.",
  "center.responses.auto_response_saved": "Auto response saved.",
  "center.responses.automation_updated": "Automation settings updated successfully.",
  "center.responses.backup_id_required": "Provide a backup ID.",
  "center.responses.backup_not_found": "Backup not found.",
  "center.responses.blacklist_entry": "Blacklist entry for `{{userId}}`: {{reason}}",
  "center.responses.blacklist_not_found": "No blacklist entry found for that user.",
  "center.responses.cannot_block_self": "You cannot blacklist yourself.",
  "center.responses.command_rate_limit_updated": "Command rate limits updated.",
  "center.responses.goodbye_channel_missing": "The configured goodbye channel is missing or inaccessible.",
  "center.responses.goodbye_default_message": "{{user}} has left the server.",
  "center.responses.goodbye_default_title": "Goodbye from {{guild}}",
  "center.responses.goodbye_test_suffix": "This is a test goodbye message.",
  "center.responses.goodbye_text_updated": "Goodbye text updated successfully.",
  "center.responses.import_payload_required": "Paste a JSON payload to import.",
  "center.responses.import_success": "Configuration imported successfully.",
  "center.responses.invalid_antiraid_action": "Invalid anti-raid action.",
  "center.responses.invalid_banner": "Banner URL must start with `http://` or `https://`.",
  "center.responses.invalid_color": "Color must be a valid 6-digit hex code.",
  "center.responses.invalid_image": "Image URL must start with `http://` or `https://`.",
  "center.responses.invalid_json": "The provided JSON is invalid.",
  "center.responses.invalid_transcript_channel_id": "Transcript channel ID is invalid.",
  "center.responses.invalid_user_id": "User ID is invalid.",
  "center.responses.invalid_weekly_report_channel_id": "Weekly report channel ID is invalid.",
  "center.responses.limits_updated": "Limits updated successfully.",
  "center.responses.maintenance_reason_updated": "Maintenance reason updated.",
  "center.responses.question_answer_required": "Both question and answer are required.",
  "center.responses.rate_limit_updated": "Interaction rate limits updated.",
  "center.responses.rollback_applied": "Rollback applied successfully.",
  "center.responses.set_goodbye_channel_first": "Set a goodbye channel first.",
  "center.responses.set_welcome_channel_first": "Set a welcome channel first.",
  "center.responses.test_sent": "Test message sent to {{channel}}.",
  "center.responses.trigger_and_response_required": "Both trigger and response are required.",
  "center.responses.trigger_deleted": "Trigger deleted.",
  "center.responses.trigger_missing": "That trigger was not found.",
  "center.responses.trigger_required": "Trigger is required.",
  "center.responses.trigger_state": "Trigger `{{trigger}}` is now **{{state}}**.",
  "center.responses.unsupported_modal": "Unsupported modal submission.",
  "center.responses.user_blocked": "User blocked successfully.",
  "center.responses.user_not_blacklisted": "That user is not blacklisted.",
  "center.responses.user_removed": "User removed from the blacklist.",
  "center.responses.verification_panel_updated": "Verification panel updated successfully.",
  "center.responses.verification_question_updated": "Verification question updated.",
  "center.responses.welcome_channel_missing": "The configured welcome channel is missing or inaccessible.",
  "center.responses.welcome_default_message": "We're glad to have you here, {{user}}.",
  "center.responses.welcome_default_title": "Welcome to {{guild}}!",
  "center.responses.welcome_test_suffix": "This is a test welcome message.",
  "center.responses.welcome_text_updated": "Welcome text updated successfully.",
  "center.verify.stats_failed": "Failed",
  "center.verify.stats_kicked": "Kicked",
  "center.verify.stats_recent": "Recent activity",
  "center.verify.stats_title": "Verification Stats",
  "center.verify.stats_total": "Total",
  "center.verify.stats_verified": "Verified",
  "commands.audit_disabled": "Command disabled",
  "commercial": {
    "lines": {
      "current_plan": "Current plan: `{{plan}}`",
      "plan_expires": "Plan expires: {{value}}",
      "plan_note": "Plan note: {{note}}",
      "plan_source": "Plan source: `{{source}}`",
      "status_expired": "Plan status: `expired -> running as free`",
      "stored_plan": "Stored plan: `{{plan}}`",
      "supporter": "Supporter: {{value}}",
      "supporter_expires": "Supporter expires: `{{date}}`"
    },
    "pro_required": {
      "button_label": "Buy Pro | Support",
      "current_plan": "Current plan",
      "description": "**{{feature}}** is an exclusive feature of the Pro plan.\nIf you want to use this PRO feature, please go to our Support Discord and create a purchase ticket. You can also donate to support the project if you want!",
      "footer": "TON618 Commercial Services",
      "supporter": "Supporter",
      "title": "Pro required",
      "upgrade_cta": "Join our Support Server to purchase a plan",
      "upgrade_label": "🚀 Upgrade to Pro"
    },
    "values": {
      "enabled": "Enabled",
      "inactive": "Inactive",
      "never": "Never",
      "unknown": "unknown"
    }
  },
  "common": {
    "all": "All",
    "buttons": {
      "english": "English",
      "enter_code": "Enter Code",
      "resend_code": "Resend Code",
      "spanish": "Spanish"
    },
    "closed": "Closed",
    "currency": {
      "coins": "coins"
    },
    "details": "Details",
    "disabled": "Disabled",
    "enabled": "Enabled",
    "errors": {
      "bot_missing_permissions": "The bot is missing the following permissions to perform this action: {{permissions}}."
    },
    "footer": {
      "tickets": "TON618 Tickets"
    },
    "labels": {
      "assigned_to": "Assigned to",
      "category": "Category",
      "channel": "Channel",
      "created": "Created",
      "error": "Error",
      "mode": "Mode",
      "notes": "Notes",
      "panel_message": "Panel Message",
      "priority": "Priority",
      "status": "Status",
      "ticket_id": "Ticket ID",
      "unverified_role": "Unverified Role",
      "user": "User",
      "verified_role": "Verified Role",
      "warnings": "Warnings"
    },
    "language": {
      "en": "English",
      "es": "Spanish"
    },
    "no": "No",
    "no_reason": "No reason",
    "none": "None",
    "off": "Off",
    "on": "On",
    "open": "Open",
    "quick_actions": "Quick Actions",
    "recommendations": "Recommendations",
    "setup_hint": {
      "run_setup": "Use `/setup wizard` to start configuring the bot's features."
    },
    "state": {
      "disabled": "Disabled",
      "enabled": "Enabled"
    },
    "units": {
      "days_short": "Days short",
      "hours_short": "Hours short",
      "minutes_short": "Minutes short",
      "weeks_short": "Weeks short"
    },
    "unknown": "unknown",
    "value": {
      "no_data": "No data"
    },
    "yes": "Yes",
    "error_with_message": "❌ Error: {message}",
    "not_set": "Not set",
    "configured": "✅ Configured",
    "created": "✅ Created",
    "failed": "❌ Failed",
    "started": "✅ Started",
    "status": "Status",
    "total": "Total"
  },
  "common.invalid_date": "Invalid date.",
  "common.labels.last_updated": "Last updated",
  "common.labels.onboarding_status": "Onboarding status",
  "common.labels.reason": "Reason",
  "common.no_backups": "No backups available.",
  "common.no_recent_activity": "No recent activity.",
  "common.time.minutes_plural": "{{count}} minutes",
  "config": {
    "category": {
      "add_description": "Initialize a new ticket category",
      "edit_description": "Update settings for an existing category",
      "group_description": "Manage ticket categories and triage rules",
      "list_description": "List all active ticket categories",
      "option_description": "Detailed category description",
      "option_discord_category": "Target Discord category ID",
      "option_discord_category_edit": "New Discord category ID",
      "option_emoji": "Category emoji",
      "option_id": "Category identifier",
      "option_id_edit": "ID of the category to modify",
      "option_id_remove": "ID of the category to remove",
      "option_id_toggle": "ID of the category to toggle status",
      "option_label": "User-visible label",
      "option_ping_roles": "Roles to notify (IDs separated by commas)",
      "option_priority": "Default ticket priority",
      "option_welcome_message": "Custom welcome message",
      "remove_description": "Permanently delete a category from the server",
      "toggle_description": "Enable or disable a category"
    },
    "slash": {
      "description": "Premium administration and server configuration console",
      "subcommands": {
        "center": {
          "description": "Open the interactive configuration center"
        },
        "status": {
          "description": "View general system and commercial status"
        },
        "tickets": {
          "description": "Review operational health of the ticket system"
        }
      }
    }
  },
  "config.category.add_success_description": "Created category `{{categoryId}}` as **{{label}}**. {{verification}}",
  "config.category.add_title": "Category Created",
  "config.category.add_verification_failed": "Verification checks need attention.",
  "config.category.add_verification_success": "Verification checks passed.",
  "config.category.admin_only": "Only administrators can manage ticket categories.",
  "config.category.edit_discord_line": "Discord category: {{discordCategory}}",
  "config.category.edit_emoji_line": "Emoji: {{emoji}}",
  "config.category.edit_ping_line": "Ping roles: {{count}}",
  "config.category.edit_success_message": "Updated **{{label}}**.\nStatus: {{status}}\n{{emojiLine}}{{discordCategoryLine}}{{pingRolesLine}}{{welcomeLine}}",
  "config.category.edit_title": "Category Updated",
  "config.category.edit_welcome_line": "Custom welcome message enabled",
  "config.category.error_generic": "Something went wrong while updating categories. {{message}}",
  "config.category.error_no_category": "Category `{{categoryId}}` does not exist.",
  "config.category.error_no_fields": "Provide at least one field to update.",
  "config.category.error_not_found": "Category `{{categoryId}}` was not found.",
  "config.category.error_remove_failed": "Failed to remove the selected category.",
  "config.category.footer": "TON618 Category Controls",
  "config.category.footer_free": "TON618 Community Edition",
  "config.category.list_description_empty": "No ticket categories are configured yet.",
  "config.category.list_description_empty_free": "No ticket categories are configured yet. Pro unlocks advanced category routing.",
  "config.category.list_extras_discord": "Linked Discord category",
  "config.category.list_extras_ping_roles": "{{count}} ping role(s)",
  "config.category.list_extras_welcome": "Custom welcome message",
  "config.category.list_pro_note": "Upgrade to Pro for advanced routing, priorities and category rules.",
  "config.category.list_status_disabled": "Disabled",
  "config.category.list_status_enabled": "Enabled",
  "config.category.list_title": "Configured Categories: {{count}}",
  "config.category.list_title_empty": "No Categories Configured",
  "config.category.remove_success_message": "Removed category `{{categoryId}}` (**{{label}}**).",
  "config.category.remove_title": "Category Removed",
  "config.category.toggle_description_disabled": "**{{label}}** is now disabled.",
  "config.category.toggle_description_enabled": "**{{label}}** is now enabled.",
  "config.category.toggle_title_disabled": "Category Disabled",
  "config.category.toggle_title_enabled": "Category Enabled",
  "crons": {
    "auto_close": {
      "archive_warning_error": "Archive warning error",
      "archive_warning_inaccessible": "Archive warning inaccessible",
      "archive_warning_transcript": "Archive warning transcript",
      "embed_desc_auto": "This ticket was closed due to inactivity and will be deleted soon.",
      "embed_title_auto": "Ticket closed automatically",
      "embed_title_manual": "Embed title manual",
      "event_desc": "Ticket #{{ticketId}} was closed due to inactivity.",
      "title": "Ticket closed automatically",
      "warning_desc": "⚠️ <@{{user}}> This ticket will be automatically closed soon due to inactivity."
    },
    "messageDelete": {
      "fields": {
        "author": "Author",
        "channel": "Channel",
        "content": "Content"
      },
      "footer": "Message ID: {{id}}",
      "no_text": "*(no text)*",
      "title": "Deleted message",
      "unknown_author": "Unknown"
    },
    "modlog": {
      "ban_title": "🔨 User Banned",
      "edit_title": "✏️ Message Edited",
      "fields": {
        "after": "After",
        "author": "👤 Author",
        "before": "Before",
        "channel": "📍 Channel",
        "executor": "🛡️ Executed by",
        "link": "Message Link",
        "reason": "Reason",
        "user": "👤 User"
      },
      "no_reason": "No reason specified",
      "unban_title": "✅ User Unbanned"
    },
    "polls": {
      "ended_desc": "The poll **\"{{question}}\"** has finished.",
      "ended_title": "Poll Ended"
    },
    "reminders": {
      "field_ago": "Field ago",
      "footer": "Recordatorio de TON618",
      "title": "Title"
    }
  },
  "daily_sla_report.avg_first_response": "Average first response",
  "daily_sla_report.closed_24h": "Closed (24h)",
  "daily_sla_report.no_closures": "No closed tickets in this window.",
  "daily_sla_report.no_data": "Not enough data to build the SLA report yet.",
  "daily_sla_report.no_sla_threshold": "No SLA threshold configured.",
  "daily_sla_report.open_escalated": "Open escalated",
  "daily_sla_report.open_out_of_sla": "Open out of SLA",
  "daily_sla_report.opened_24h": "Opened (24h)",
  "daily_sla_report.sla_compliance": "SLA compliance",
  "daily_sla_report.title": "Daily SLA Report",
  "daily_sla_report.top_staff": "Top staff",
  "daily_sla_report.window": "Window",
  "dashboard": {
    "all_active": "All team members are active ✅",
    "auto_update": "🔄 Auto-updates every 30s",
    "away_staff": "💤 Away Staff",
    "closed_today": "🔴 Closed Today",
    "description": "📡 *This panel updates in real-time*",
    "global_stats": "📈 Global Statistics",
    "no_data": "No data yet",
    "no_recent_activity": "No recent activity recorded.",
    "observability": "📡 Observability",
    "open_tickets": "🟢 Open Tickets",
    "opened_today": "📅 Opened Today",
    "title": "📊 Control Center & Stats",
    "top_staff": "🏆 Top Staff",
    "total_tickets": "📊 Total Tickets",
    "update_button": "Update Panel"
  },
  "debug": {
    "access_denied": "You do not have permission to use debug commands.",
    "description": {
      "automod": "Owner-only live count of TON618-managed AutoMod rules across connected guilds.",
      "cache": "Discord.js manages cache automatically.",
      "health": "Active-window snapshot plus the latest persisted heartbeat.",
      "voice": "Music queues are managed per guild."
    },
    "field": {
      "api_ping": "API ping",
      "cached_channels": "Cached channels",
      "cached_users": "Cached users",
      "channels": "Channels",
      "deploy": "Deploy",
      "external": "External",
      "guild_coverage": "Guild Coverage",
      "guilds": "Guilds",
      "guilds_attention": "Guilds Needing Attention",
      "guilds_live_rules": "Guilds With Live TON618 Rules",
      "heap_total": "Heap total",
      "heap_used": "Heap used",
      "heartbeat": "Heartbeat",
      "interaction_window": "Interaction window",
      "progress": "Progress",
      "quick_state": "Quick state",
      "rss": "RSS",
      "top_errors": "Top errors",
      "uptime": "Uptime",
      "users": "Users"
    },
    "no_connected_guilds": "There are no connected guilds.",
    "options": {
      "debug_entitlements_set-plan_expires_in_days_expires_in_days": "Optional duration in days for Pro",
      "debug_entitlements_set-plan_guild_id_guild_id": "Target guild ID",
      "debug_entitlements_set-plan_note_note": "Optional internal note",
      "debug_entitlements_set-plan_tier_tier": "Plan tier",
      "debug_entitlements_set-supporter_active_active": "Enable or disable supporter recognition",
      "debug_entitlements_set-supporter_expires_in_days_expires_in_days": "Optional duration in days for supporter status",
      "debug_entitlements_set-supporter_guild_id_guild_id": "Target guild ID",
      "debug_entitlements_set-supporter_note_note": "Optional internal note",
      "debug_entitlements_status_guild_id_guild_id": "Target guild ID"
    },
    "slash": {
      "description": "Owner-only diagnostics and entitlement tools",
      "subcommands": {
        "automod_badge": {
          "description": "View live AutoMod badge progress across guilds"
        },
        "cache": {
          "description": "View bot cache sizes"
        },
        "entitlements_set_plan": {
          "description": "Set a guild plan manually"
        },
        "entitlements_set_supporter": {
          "description": "Enable or disable supporter recognition"
        },
        "entitlements_status": {
          "description": "Inspect the effective plan and supporter state for a guild"
        },
        "guilds": {
          "description": "List connected guilds"
        },
        "health": {
          "description": "View live health and heartbeat state"
        },
        "memory": {
          "description": "View process memory usage"
        },
        "status": {
          "description": "View bot status and deploy info"
        },
        "voice": {
          "description": "View music subsystem status"
        }
      }
    },
    "title": {
      "automod": "AutoMod Badge Progress",
      "cache": "Cache State",
      "entitlements": "Guild Entitlements",
      "guilds": "Connected Guilds",
      "health": "Bot Health",
      "memory": "Memory Usage",
      "plan_updated": "Plan Updated",
      "status": "Bot Status",
      "supporter_updated": "Supporter Updated",
      "voice": "Music Subsystem"
    },
    "unknown_subcommand": "Unknown subcommand.",
    "value": {
      "app_flag_present": "App flag present: {{value}}",
      "automod_enabled": "AutoMod enabled: `{{count}}`",
      "error_rate": "Error rate: **{{state}}** ({{value}}%, threshold {{threshold}}%)",
      "failed_partial_sync": "Failed or partial sync: `{{count}}`",
      "heartbeat": "Last seen: `{{lastSeen}}`\nGuilds: `{{guilds}}`",
      "high": "HIGH",
      "interaction_totals": "Total: `{{total}}`\nOK/Error/Denied/Rate: `{{ok}}/{{errors}}/{{denied}}/{{rateLimited}}`",
      "managed_rules": "Managed rules: `{{count}}`",
      "missing_permissions": "Missing permissions: `{{count}}`",
      "no": "No",
      "ok": "OK",
      "ping_state": "Ping: **{{state}}** ({{value}}ms, threshold {{threshold}}ms)",
      "remaining_to_goal": "Remaining to {{goal}}: `{{count}}`",
      "yes": "Yes"
    }
  },
  "economy": {
    "buy": {
      "crate_win": "Crate win",
      "error": "Error",
      "insufficient_funds": "Insufficient funds",
      "not_found": "Not found",
      "success": "Success"
    },
    "daily": {
      "already_claimed": "Already claimed",
      "error": "Error",
      "success": "Success"
    },
    "deposit": {
      "error": "Error",
      "insufficient": "Insufficient",
      "success": "Success"
    },
    "items": {
      "background": {
        "description": "Custom background for your profile",
        "name": "🖼️ Background"
      },
      "badge": {
        "description": "Badge for your profile",
        "name": "🏅 Badge"
      },
      "boost_daily": {
        "description": "2x daily rewards for 7 days",
        "name": "💰 Daily Boost"
      },
      "boost_xp": {
        "description": "2x XP for 1 day",
        "name": "⚡ XP Boost"
      },
      "color": {
        "description": "Custom name color in embeds",
        "name": "🎨 Name Color"
      },
      "crate_common": {
        "description": "Luck of 50-200 coins",
        "name": "📦 Common Crate"
      },
      "crate_epic": {
        "description": "Luck of 500-1500 coins",
        "name": "💜 Epic Crate"
      },
      "crate_legendary": {
        "description": "Luck of 1500-5000 coins",
        "name": "🔥 Legendary Crate"
      },
      "crate_rare": {
        "description": "Luck of 200-500 coins",
        "name": "✨ Rare Crate"
      },
      "role_premium": {
        "description": "Premium role for 30 days",
        "name": "💎 Premium Role"
      },
      "role_staff": {
        "description": "Temporary staff role",
        "name": "👔 Staff Role"
      },
      "role_vip": {
        "description": "VIP role for 30 days",
        "name": "🎖️ VIP Role"
      },
      "ticket": {
        "description": "One additional ticket",
        "name": "🎫 Extra Ticket"
      }
    },
    "transfer": {
      "error": "Error",
      "insufficient": "Insufficient",
      "self_transfer": "Self transfer",
      "success": "Success"
    },
    "withdraw": {
      "error": "Error",
      "insufficient": "Insufficient",
      "success": "Success"
    },
    "work": {
      "cooldown": "Cooldown",
      "error": "Error",
      "no_job": "No job",
      "success": "Success"
    }
  },
  "embed": {
    "announcement_prefix": "📢 ",
    "errors": {
      "channel_not_found": "Target channel not found.",
      "form_expired": "Form session expired.",
      "invalid_color": "Invalid HEX color format.",
      "invalid_image_url": "Image URL must start with http/https.",
      "invalid_thumbnail_url": "Thumbnail URL must start with http/https.",
      "message_not_found": "Message not found.",
      "no_embeds": "That message has no embeds.",
      "not_bot_message": "That message was not sent by the bot.",
      "pro_required": "✨ Embed templates require **TON618 Pro**.",
      "template_exists": "Template `{{name}}` already exists.",
      "template_not_found": "Template `{{name}}` not found."
    },
    "footer": {
      "announcement": "Official Announcement from {{guildName}}",
      "sent_by": "Sent by {{username}}"
    },
    "modal": {
      "create_title": "✨ Create Embed",
      "edit_title": "✏️ Edit Embed",
      "field_color_label": "HEX Color without #",
      "field_description_label": "Description",
      "field_description_placeholder": "Write embed content here...",
      "field_extra_fallback_name": "Field",
      "field_extra_label": "Extra fields (name|value|inline)",
      "field_extra_placeholder": "Field Name|Field Value|true\nOther Field|Value|false",
      "field_title_label": "Title (leave blank for none)"
    },
    "slash": {
      "description": "✨ Custom embed builder",
      "options": {
        "author": "Author name",
        "author_icon": "Author icon URL",
        "channel": "Target channel",
        "color": "HEX Color",
        "description": "Description",
        "footer": "Footer text",
        "image": "Image URL",
        "mention": "Mention when sending",
        "message_id": "Message ID",
        "template_name": "Template name",
        "text": "Announcement content",
        "thumbnail": "Thumbnail URL",
        "timestamp": "Show timestamp",
        "title": "Title"
      },
      "subcommands": {
        "announcement": {
          "description": "Professional announcement template"
        },
        "create": {
          "description": "Create and send an embed"
        },
        "edit": {
          "description": "Edit an existing embed"
        },
        "quick": {
          "description": "Send a simple quick embed"
        },
        "template": {
          "delete": {
            "description": "Delete a template"
          },
          "description": "✨ Manage embed templates (Pro)",
          "list": {
            "description": "List all server templates"
          },
          "load": {
            "description": "Load and send a template"
          },
          "save": {
            "description": "Save current config as template"
          }
        }
      }
    },
    "success": {
      "announcement_sent": "📢 Announcement broadcast in {{channel}}.",
      "edited": "✅ Embed edited successfully.",
      "sent": "✅ Embed sent to {{channel}}.",
      "template_deleted": "✅ Template **{{name}}** deleted.",
      "template_saved": "✅ Template **{{name}}** saved successfully."
    },
    "templates": {
      "footer": "Total: {{count}}/50 templates",
      "list_title": "Embed Templates - {{guildName}}",
      "no_templates": "No saved templates. Use `/embed template save`."
    }
  },
  "embeds": {
    "ticket": {
      "closed": {
        "fields": {
          "closed_by": "Closed by",
          "duration": "Duration",
          "messages": "Messages",
          "reason": "Reason",
          "ticket": "Ticket"
        },
        "no_reason": "No reason provided",
        "title": "Ticket closed"
      },
      "info": {
        "fields": {
          "assigned_to": "Assigned to",
          "category": "Category",
          "claimed_by": "Claimed by",
          "created": "Created",
          "creator": "Creator",
          "duration": "Duration",
          "first_response": "First response",
          "messages": "Messages",
          "priority": "Priority",
          "reopens": "Reopens",
          "status": "Status",
          "subject": "Subject"
        },
        "first_response_value": "{{minutes}} min",
        "status_closed": "Closed",
        "status_open": "Open",
        "title": "Ticket #{{ticketId}}"
      },
      "log": {
        "actions": {
          "add": "User added",
          "assign": "Ticket assigned",
          "autoclose": "Ticket auto-closed",
          "claim": "Ticket claimed",
          "close": "Ticket closed",
          "default": "Action",
          "delete": "Message deleted",
          "edit": "Message edited",
          "move": "Category changed",
          "open": "Ticket opened",
          "priority": "Priority changed",
          "rate": "Ticket rated",
          "remove": "User removed",
          "reopen": "Ticket reopened",
          "sla": "SLA alert",
          "smartping": "No staff response",
          "transcript": "Transcript generated",
          "unassign": "Assignment removed",
          "unclaim": "Ticket released"
        },
        "fields": {
          "by": "By",
          "category": "Category",
          "ticket": "Ticket"
        },
        "footer": "UID: {{userId}}"
      },
      "open": {
        "author": "Ticket #{{ticketId}} | {{category}}",
        "default_welcome": "Hello <@{{userId}}>! Welcome to our support system. A staff member will assist you soon.",
        "footer": "Use the buttons below to manage this ticket",
        "form_field": "Form information",
        "question_fallback": "Question {{index}}",
        "summary": "**Request summary:**\n- **User:** <@{{userId}}>\n- **Category:** {{category}}\n- **Priority:** {{priority}}\n- **Created:** <t:{{createdAt}}:R>"
      },
      "reopened": {
        "description": "<@{{userId}}> reopened this ticket.\nA staff member will resume the conversation soon.",
        "fields": {
          "reopens": "Reopens"
        },
        "title": "Ticket reopened"
      }
    }
  },
  "errors": {
    "invalid_language_selection": "This language selection is no longer valid. Run `/setup language` to set it manually.",
    "language_permission": "Only a server administrator can choose the language for this guild.",
    "language_save_failed": "I could not save the server language. TON618 will keep English until the configuration succeeds."
  },
  "events": {
    "modlog": {
      "ban_title": "🔨 User Banned",
      "edit_title": "✏️ Message Edited",
      "fields": {
        "after": "After",
        "author": "👤 Author",
        "before": "Before",
        "channel": "📍 Channel",
        "executor": "🛡️ Executed by",
        "link": "Message Link",
        "reason": "Reason",
        "user": "👤 User"
      },
      "no_reason": "No reason specified",
      "unban_title": "✅ User Unbanned",
      "unknown_executor": "Unknown executor"
    }
  },
  "events.guildMemberAdd.anti_raid.action_alert": "Alert only",
  "events.guildMemberAdd.anti_raid.action_kick": "Kick automatically",
  "events.guildMemberAdd.anti_raid.description": "{{user}} joined while anti-raid protections were active.",
  "events.guildMemberAdd.anti_raid.fields.action": "Action",
  "events.guildMemberAdd.anti_raid.fields.threshold": "Threshold",
  "events.guildMemberAdd.anti_raid.title": "Anti-raid triggered",
  "events.guildMemberAdd.dm.fields.verification_required": "Verification required",
  "events.guildMemberAdd.dm.fields.verification_value": "Please complete verification to unlock the server.",
  "events.guildMemberAdd.dm.title": "Welcome to {{guild}}",
  "events.guildMemberAdd.modlog.fields.account_created": "Account created",
  "events.guildMemberAdd.modlog.fields.member_count": "Member count",
  "events.guildMemberAdd.modlog.fields.user": "User",
  "events.guildMemberAdd.modlog.footer": "Join event recorded",
  "events.guildMemberAdd.modlog.title": "Member Joined",
  "events.guildMemberAdd.welcome.default_title": "Welcome, {{user}}!",
  "events.guildMemberAdd.welcome.fields.member_count": "Member count",
  "events.guildMemberAdd.welcome.fields.user": "User",
  "events.guildMemberRemove.goodbye.default_message": "We hope to see you again soon.",
  "events.guildMemberRemove.goodbye.default_title": "Goodbye, {{user}}",
  "events.guildMemberRemove.goodbye.fields.remaining_members": "Remaining members",
  "events.guildMemberRemove.goodbye.fields.user": "User",
  "events.guildMemberRemove.goodbye.remaining_members_value": "{{count}} members remaining",
  "events.guildMemberRemove.modlog.fields.joined_at": "Joined at",
  "events.guildMemberRemove.modlog.fields.remaining_members": "Remaining members",
  "events.guildMemberRemove.modlog.fields.roles": "Roles",
  "events.guildMemberRemove.modlog.fields.user": "User",
  "events.guildMemberRemove.modlog.footer": "Leave event recorded",
  "events.guildMemberRemove.modlog.no_roles": "No roles",
  "events.guildMemberRemove.modlog.title": "Member Left",
  "events.guildMemberRemove.modlog.unknown_join": "Unknown join date",
  "events.guildMemberUpdate.footer": "Member update recorded",
  "events.guildMemberUpdate.nickname.fields.after": "After",
  "events.guildMemberUpdate.nickname.fields.before": "Before",
  "events.guildMemberUpdate.nickname.fields.executor": "Updated by",
  "events.guildMemberUpdate.nickname.fields.user": "User",
  "events.guildMemberUpdate.nickname.title": "Nickname Updated",
  "events.guildMemberUpdate.roles.fields.added": "Added roles",
  "events.guildMemberUpdate.roles.fields.executor": "Updated by",
  "events.guildMemberUpdate.roles.fields.removed": "Removed roles",
  "events.guildMemberUpdate.roles.fields.user": "User",
  "events.guildMemberUpdate.roles.title": "Roles Updated",
  "events.guildMemberUpdate.unknown_executor": "Unknown executor",
  "events.messageDelete.fields.author": "Author",
  "events.messageDelete.fields.channel": "Channel",
  "events.messageDelete.fields.content": "Content",
  "events.messageDelete.footer": "Message ID: {{id}}",
  "events.messageDelete.no_text": "No text content.",
  "events.messageDelete.title": "Deleted Message",
  "events.messageDelete.unknown_author": "Unknown author",
  "events.modlog.edit_empty": "(empty)",
  "events.modlog.goto_message": "Go to message",
  "general.dashboard.author": "General Setup | {{guild}}",
  "giveaway": {
    "choices": {
      "requirement_account_age": "Account Age",
      "requirement_level": "Level",
      "requirement_none": "None",
      "requirement_role": "Role"
    },
    "embed": {
      "click_participant": "Click the button below to join!",
      "ends": "Ends",
      "hosted_by": "Hosted by",
      "participate_label": "Join",
      "prize": "Prize",
      "requirements": "Requirements",
      "reroll_announcement": "New winner(s): {{winners}}! You won **{{prize}}**!",
      "status_cancelled": "Cancelled",
      "status_ended": "Ended",
      "status_no_participants": "Ended (No participants)",
      "title": "🎉 Giveaway",
      "winners": "Winners",
      "winners_announcement": "Congratulations {{winners}}! You won **{{prize}}**!"
    },
    "errors": {
      "already_ended": "This giveaway has already ended.",
      "cancel_failed": "Failed to cancel giveaway.",
      "create_failed": "Failed to create giveaway.",
      "end_failed": "Failed to end giveaway.",
      "no_active": "No active",
      "no_participants": "No valid participants found.",
      "not_found": "Giveaway not found.",
      "reroll_failed": "Failed to reroll giveaway."
    },
    "requirements": {
      "account_age": "Account must be at least {{days}} days old",
      "level": "Must be at least level: {{level}}",
      "role": "Must have role: {{role}}"
    },
    "slash": {
      "description": "Manage giveaways in the server",
      "options": {
        "bonus_role": "Role for extra entries (Pro)",
        "bonus_weight": "Weight for bonus role (Pro)",
        "channel": "Target channel",
        "description": "Additional giveaway details",
        "duration": "Duration (e.g., 30s, 5m, 2h, 1d, 1w)",
        "emoji": "Custom emoji to react",
        "message_id": "Giveaway message ID",
        "min_account_age": "Minimum account age in days (Pro)",
        "prize": "The prize to give away",
        "required_role_2": "Additional role requirement (Pro)",
        "requirement_type": "Requirement type to enter",
        "requirement_value": "Requirement value",
        "winners": "Number of winners (1-20)"
      },
      "subcommands": {
        "cancel": {
          "description": "Cancel an active giveaway without winners"
        },
        "create": {
          "description": "Create a new giveaway"
        },
        "end": {
          "description": "End an active giveaway early"
        },
        "list": {
          "description": "List all active giveaways"
        },
        "reroll": {
          "description": "Pick new winners for an ended giveaway"
        }
      }
    },
    "success": {
      "cancelled": "✅ Giveaway has been cancelled.",
      "created": "✅ Giveaway created in {{channel}}! [[Jump to Message]]({{url}})",
      "ended": "✅ Giveaway ended. Winners: {{winners}}",
      "requirement_bonus": "[PRO] Extra entries for <@&{{roleId}}> (x{{weight}})",
      "requirement_role_2": "Must also have: <@&{{roleId}}>",
      "rerolled": "✅ Rerolled! New winners: {{winners}}"
    }
  },
  "goodbye.invalid_color": "Invalid color. Use a 6-digit hex code like `ED4245`.",
  "goodbye.test_channel_missing": "The configured goodbye channel no longer exists or is inaccessible.",
  "goodbye.test_requires_channel": "Set a goodbye channel before sending a test message.",
  "health_monitor.downtime_recovery_description": "The bot recovered after a downtime window.",
  "health_monitor.downtime_recovery_title": "Recovery detected",
  "health_monitor.error_rate_high_description": "The recent interaction error rate is above the configured threshold.",
  "health_monitor.error_rate_high_title": "High error rate detected",
  "health_monitor.field_error_rate": "Error rate",
  "health_monitor.field_errors": "Errors",
  "health_monitor.field_interactions": "Interactions",
  "health_monitor.field_ping": "Ping",
  "health_monitor.ping_high_description": "Gateway latency is above the configured threshold.",
  "health_monitor.ping_high_title": "High latency detected",
  "help": {
    "embed": {
      "access_label": "Access",
      "categories": {
        "economy": "Economy",
        "giveaway": "Giveaways",
        "level": "Levels",
        "mods": "Moderation",
        "ticket": "Tickets"
      },
      "category_label": "Category",
      "command_overviews": "Command Overview",
      "description": "Here is the list of available commands for this category.",
      "footer": "Requested by {{user}}",
      "overviews": {
        "audit": "Export ticket data and prepare admin reviews without modifying active records.",
        "config": "Review server configuration, ticket settings and open the interactive admin control center.",
        "debug": "Run owner-exclusive diagnostics on uptime, status, caches, server connectivity and commercial permissions.",
        "embed": "Create, edit and publish custom Discord embeds for announcements or structured updates.",
        "help": "Explore the interactive help center and see only commands available to you on this server.",
        "modlogs": "Control moderation log delivery, storage channel and event coverage.",
        "poll": "Create interactive polls for the server, view active ones and close them early when needed.",
        "profile": "Review member progression, economy balance and quick rankings.",
        "setup": "Configure tickets, automations, onboarding flows and command availability for this server.",
        "staff": "Manage staff availability, active workload and quick access notices from a single command.",
        "stats": "Review global ticket metrics, SLA performance, staff activity and satisfaction trends.",
        "suggest": "Open the suggestions flow for members to submit ideas for the server.",
        "ticket": "Manage the entire ticket lifecycle, internal notes, transcripts and active playbook actions.",
        "verify": "Manage verification, anti-raid protection, confirmation messages and verification activity.",
        "warn": "Apply, review and remove warnings, including automatic actions associated with warning count."
      },
      "quick_start": "Quick Start Guide",
      "title": "Help Center - {{category}}",
      "usage_overrides": "Usage Examples",
      "usages": {
        "audit_tickets": "Export ticket data to a CSV file with optional filters for status, priority, category, date and row limit.",
        "config_center": "Open the interactive configuration center for admins to review and adjust active settings from Discord.",
        "config_status": "Review server configuration at a glance, including key channels, roles, help mode and commercial status.",
        "config_tickets": "Open a complete summary of ticket operations with limits, SLA settings, automation and category coverage.",
        "debug_entitlements_set_plan": "Manually change a server's commercial plan and optional expiration for testing or support.",
        "debug_entitlements_set_supporter": "Enable or disable supporter status for a server and optionally set an expiration.",
        "debug_entitlements_status": "Inspect the effective commercial plan and supporter status of a specific server.",
        "embed_anuncio": "Send a pre-formatted announcement embed for server news or high-visibility updates.",
        "embed_crear": "Open an interactive form to compose and send a fully custom embed.",
        "embed_editar": "Edit an existing embed message that the bot sent previously.",
        "embed_rapido": "Send a quick embed with title and description without opening the full builder.",
        "help_base": "Open the interactive help center and explore only commands available to you on this server.",
        "poll_crear": "Create an interactive poll with up to 10 options, scheduling and optional multiple voting.",
        "poll_finalizar": "Close an active poll early using its short ID.",
        "poll_lista": "List polls that are still active on this server.",
        "profile_top": "Show quick level and economy rankings for this server.",
        "profile_ver": "Open your profile or another member's with level and economy information.",
        "setup_commands_panel": "Open an interactive control panel to enable, disable and review commands without manually typing names.",
        "setup_wizard": "Apply a guided base configuration for a support server, including dashboard, key channels, roles, plan, default SLA values and optional panel publishing.",
        "stats_ratings": "Sort staff by ticket ratings in the selected period.",
        "stats_staff_rating": "Open detailed rating profile for a staff member.",
        "suggest_base": "Open the suggestions modal and submit a new idea for the server.",
        "ticket_brief": "Open the operational summary of the current ticket for staff to quickly review context, recommendations and next steps.",
        "ticket_history": "Show a member's ticket history, including open tickets and recently closed cases.",
        "ticket_info": "Review the current ticket's context, status and detailed operational summary.",
        "ticket_note_add": "Save an internal staff note on the current ticket for handovers and follow-up tracking.",
        "ticket_note_clear": "Remove all internal notes from the current ticket. Admins only.",
        "ticket_note_list": "List internal notes that staff have saved on the current ticket.",
        "ticket_open": "Open a new support ticket and enter the server's ticket flow.",
        "ticket_playbook_apply_macro": "Publish the playbook-suggested macro directly into the ticket conversation.",
        "ticket_playbook_confirm": "Approve a playbook-recommended action so the ticket flow can proceed with it.",
        "ticket_playbook_disable": "Disable an active playbook for this server.",
        "ticket_playbook_dismiss": "Dismiss a recommendation that is not suitable for the current ticket.",
        "ticket_playbook_enable": "Enable a playbook for this server so its recommendations can be used in tickets.",
        "ticket_playbook_list": "Show active playbooks and currently available recommendations for the ongoing ticket.",
        "verify_info": "Review current verification configuration, roles, channels, anti-raid status and confirmation settings.",
        "verify_panel": "Send the verification panel to the configured channel or update the existing panel after changing settings.",
        "verify_stats": "Show recent verification activity and totals for verified, failed and kicked members."
      }
    }
  },
  "help.embed.and_word": "and",
  "help.embed.categories.admin": "Admin",
  "help.embed.categories.config": "Config",
  "help.embed.categories.fun": "Community & Fun",
  "help.embed.categories.general": "General",
  "help.embed.categories.member": "Regular Member",
  "help.embed.categories.moderation": "Moderation",
  "help.embed.categories.other": "Other",
  "help.embed.categories.owner": "Owner",
  "help.embed.categories.public": "Public",
  "help.embed.categories.staff": "Staff Member",
  "help.embed.categories.system": "System & Internal",
  "help.embed.categories.tickets": "Tickets",
  "help.embed.categories.utility": "Utility",
  "help.embed.category_desc": "Detailed documentation for this command group.",
  "help.embed.category_footer": "TON618 System • {{guild}}",
  "help.embed.category_title": "{{category}} Commands",
  "help.embed.command_desc": "**Summary:** {{summary}}\n**Category:** {{category}}\n**Access:** `{{access}}`{{focus}}",
  "help.embed.command_footer": "TON618 Manual • {{guild}}",
  "help.embed.command_help": "Command: /{{command}}",
  "help.embed.command_not_found": "Command Not Found",
  "help.embed.command_not_found_desc": "Could not find any command matching `{{command}}`.",
  "help.embed.command_plural": "commands",
  "help.embed.command_singular": "command",
  "help.embed.continued_suffix": " (cont.)",
  "help.embed.denied_default": "You do not have permission to view this help panel.",
  "help.embed.denied_owner": "This help panel is restricted to the bot owner.",
  "help.embed.denied_staff": "This help panel is restricted to staff members.",
  "help.embed.expired_placeholder": "Session expired — use /help again",
  "help.embed.field_entries": "Usages",
  "help.embed.focused_match": "Match: `{{usage}}`",
  "help.embed.home_categories": "Available Categories",
  "help.embed.home_desc": "Welcome to the help center for **{{guild}}**. Select a category below to explore commands.",
  "help.embed.home_footer": "TON618 Security & Support • {{guild}}",
  "help.embed.home_overview": "System Overview",
  "help.embed.home_overview_value": "Advanced ticket management, multi-language support, and utility tools for Pro servers.",
  "help.embed.home_quick_start": "Quick Start Suggestions",
  "help.embed.home_title": "TON618 Help Center",
  "help.embed.home_visibility": "Your Access",
  "help.embed.home_visibility_value": "Level: **{{access}}**\nAvailable: **{{commands}}** commands across **{{categories}}** categories.\n{{simple_help}}",
  "help.embed.no_commands_in_category": "No commands available in this category.",
  "help.embed.no_description": "No description provided.",
  "help.embed.optional_label": "Optional",
  "help.embed.overview_prefix": "Overview",
  "help.embed.overviews.ping": "Check bot latency, uptime, and cache status.",
  "help.embed.owner_only_menu": "Only the user who opened this panel can navigate it.",
  "help.embed.page_label": "Page",
  "help.embed.quick_start_notes.config_status": "Check server configuration",
  "help.embed.quick_start_notes.debug_status": "Check bot status",
  "help.embed.quick_start_notes.help_base": "Return to this menu",
  "help.embed.quick_start_notes.modlogs_info": "Check moderation history",
  "help.embed.quick_start_notes.setup_wizard": "Launch the setup wizard",
  "help.embed.quick_start_notes.staff_my_tickets": "View your assigned tickets",
  "help.embed.quick_start_notes.stats_sla": "View ticket SLA reports",
  "help.embed.quick_start_notes.ticket_claim": "Claim a ticket",
  "help.embed.quick_start_notes.ticket_note_add": "Add an internal staff note",
  "help.embed.quick_start_notes.ticket_open": "Open a support ticket",
  "help.embed.quick_start_notes.verify_panel": "Deploy the verification system",
  "help.embed.required_label": "Required",
  "help.embed.select_home": "Home",
  "help.embed.select_placeholder": "Select a category",
  "help.embed.simple_help_note": "*(Note: Some advanced commands are hidden due to Simple Help mode)*",
  "help.embed.usages.ping": "/ping",
  "help.embed.usages.staffops": "/staff my-tickets",
  "help.embed.visible_commands_label": "Interactive Commands",
  "help.embed.visible_entries_label": "Unique Usages",
  "help.embed.visible_entry_plural": "usages",
  "help.embed.visible_entry_singular": "usage",
  "interaction": {
    "command_disabled": "The command `/{{commandName}}` is disabled on this server.",
    "dashboard_refresh": {
      "success": "✅ Dashboard updated! Statistics refreshed successfully."
    },
    "db_unavailable": "Database temporarily unavailable. Please try again in a few seconds.",
    "error_generic": "Generic error",
    "rate_limit": {
      "command": "Temporary limit for `/{{commandName}}`. Wait **{{retryAfterSec}}s** before retrying.",
      "global": "You're going too fast. Wait **{{retryAfterSec}}s** before using another interaction."
    },
    "shutdown": {
      "rebooting": "The bot is currently restarting to apply updates. Please try again in 15 seconds."
    },
    "tag_delete": {
      "cancelled": "❌ Deletion cancelled.",
      "error": "An error occurred while deleting the tag.",
      "success": "✅ Tag **{{name}}** has been deleted."
    },
    "unexpected": "An unexpected error occurred while executing this command. Please contact an administrator."
  },
  "leaderboard": {
    "claimed": "claimed",
    "closed": "closed",
    "no_data": "No staff data yet.",
    "title": "🏆 Staff Leaderboard"
  },
  "leveling": {
    "embed": {
      "field_level_name": "Level",
      "field_progress_name": "Progress",
      "field_total_xp_name": "Total XP",
      "footer": "Stay active to level up!",
      "level": "Level",
      "messages": "Messages",
      "progress": "Progress",
      "title": "{{user}}'s Profile",
      "total_xp": "Total XP"
    },
    "errors": {
      "disabled": "❌ Leveling system is disabled in this server.",
      "invalid_page": "❌ Invalid page. Max page is {{max}}.",
      "no_data": "❌ No leaderboard data found.",
      "no_rank": "❌ You don't have a position yet. Send some messages!",
      "user_not_found": "❌ User not found."
    },
    "leaderboard": {
      "empty": "No data found for this server yet.",
      "footer": "Page {{page}}/{{total}} • {{users}} total users",
      "stats": "Level: {{level}} | XP: {{xp}}",
      "title": "Server Leaderboard - {{guild}}",
      "unknown_user": "User Unknown"
    },
    "rank": {
      "description": "Your current position is #{{rank}} out of {{total}} with level {{level}}.",
      "footer": "XP: {{xp}} / {{next}} ({{remaining}} remaining)",
      "no_xp": "You don't have any XP yet. Send some messages!",
      "title": "{{user}}'s Rank"
    },
    "slash": {
      "description": "Interactive leveling system",
      "options": {
        "page": "Page number to view",
        "user": "The target user"
      },
      "subcommands": {
        "leaderboard": {
          "description": "View the server leaderboard"
        },
        "rank": {
          "description": "View your rank on the leaderboard"
        },
        "view": {
          "description": "View your level or another user's level"
        }
      }
    },
    "status_disabled": "❌ Leveling system is currently disabled."
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
  "leveling.user_not_found": "Could not find that user.",
  "menuActions": {
    "config": {
      "admin_only": "Only administrators can use quick configuration.",
      "description": "Use `/config center` to open the interactive control panel.\nIf you need a deeper setup, use `/setup`.",
      "title": "Quick configuration"
    },
    "help": {
      "description": "Key commands:\n- `/menu`\n- `/fun`\n- `/ticket open`\n- `/perfil ver`\n- `/staff my-tickets` (staff)\n- `/config status` (admin)\n- `/help`",
      "title": "Quick help"
    },
    "profile": {
      "description": "Use `/perfil ver` to view your profile.\nUse `/perfil top` to view the quick ranking.",
      "title": "Profile"
    }
  },
  "mod": {
    "ban_extra": {
      "duration": "*Temp ban: {{duration}}*",
      "messages_deleted": "*Messages deleted from last {{hours}}h*",
      "permanent": "*Permanent ban*"
    },
    "errors": {
      "ban_failed": "❌ Error banning user.",
      "bot_hierarchy": "❌ I cannot {{action}} this user because they have a higher or equal role than me.",
      "history_failed": "❌ Error fetching moderation history.",
      "kick_failed": "❌ Error kicking user.",
      "mute_failed": "❌ Error muting user.",
      "no_history": "ℹ️ No moderation history found for {{user}}.",
      "no_messages": "❌ No messages matching the criteria found in the last 100 messages.",
      "not_banned": "❌ This user is not banned in this server.",
      "not_muted": "❌ This user is not muted.",
      "purge_failed": "❌ Error deleting messages.",
      "slowmode_failed": "❌ Error setting slowmode.",
      "timeout_failed": "❌ Error timing out user.",
      "unban_failed": "❌ Error unbanning user.",
      "unmute_failed": "❌ Error unmuting user.",
      "user_hierarchy": "❌ You cannot {{action}} this user because they have a higher or equal role than you."
    },
    "history": {
      "entry": "【{{index}}】 **{{action}}** — {{timestamp}}\n**Moderator:** {{moderator}}\n**Reason:** {{reason}}{{duration}}",
      "footer": "Showing the {{count}} most recent actions",
      "title": "🛡️ Moderation History - {{user}}"
    },
    "slash": {
      "choices": {
        "delete_messages": {
          "0": "Don't delete",
          "3600": "Last hour",
          "86400": "Last 24 hours",
          "604800": "Last 7 days"
        },
        "duration": {
          "1d": "1 day",
          "1h": "1 hour",
          "1m": "1 minute",
          "28d": "28 days",
          "30d": "30 days",
          "6h": "6 hours",
          "7d": "7 days",
          "permanent": "Permanent"
        }
      },
      "description": "Advanced moderation commands",
      "options": {
        "amount": "Number of messages to delete (1-100)",
        "channel": "Channel to set slowmode for",
        "contains": "Only delete messages containing this text",
        "delete_messages": "Delete messages from the last...",
        "duration": "Duration (e.g., 1h, 7d, 30d)",
        "limit": "Number of actions to show",
        "reason": "Reason for the action",
        "seconds": "Slowmode duration in seconds (0 to disable)",
        "user": "The target user",
        "user_id": "Discord ID of the user to unban"
      },
      "subcommands": {
        "ban": {
          "description": "Ban a user from the server"
        },
        "history": {
          "description": "View a user's moderation history"
        },
        "kick": {
          "description": "Kick a user from the server"
        },
        "mute": {
          "description": "Mute a user with a role"
        },
        "purge": {
          "description": "Delete multiple messages"
        },
        "slowmode": {
          "description": "Set slowmode for a channel"
        },
        "timeout": {
          "description": "Timeout a user (Discord native)"
        },
        "unban": {
          "description": "Unban a user"
        },
        "unmute": {
          "description": "Unmute a user"
        }
      }
    },
    "success": {
      "banned": "✅ **{{user}}** was banned.\n**Reason:** {{reason}}\n{{extra}}",
      "kicked": "✅ **{{user}}** was kicked.\n**Reason:** {{reason}}",
      "muted": "✅ **{{user}}** was muted for **{{duration}}**.\n**Reason:** {{reason}}",
      "purged": "✅ Deleted **{{count}}** messages successfully.",
      "slowmode_disabled": "✅ Slowmode disabled in {{channel}}.",
      "slowmode_set": "✅ Slowmode set to **{{seconds}}s** in {{channel}}.",
      "timeout": "✅ **{{user}}** was timed out for **{{duration}}**.\n**Reason:** {{reason}}",
      "unbanned": "✅ **{{user}}** was unbanned.\n**Reason:** {{reason}}",
      "unmuted": "✅ **{{user}}** is no longer muted.\n**Reason:** {{reason}}"
    }
  },
  "modals": {
    "suggest": {
      "success_msg": "Success msg"
    },
    "tags": {
      "error_empty": "Error empty",
      "error_exists": "Error exists",
      "error_failed": "Error failed",
      "footer": "Footer",
      "success_desc": "Success desc",
      "success_title": "Success title"
    }
  },
  "modlogs": {
    "events": {
      "bans": "Bans",
      "joins": "Member joins",
      "kicks": "Kicks",
      "leaves": "Member leaves",
      "message_delete": "Deleted messages",
      "message_edit": "Edited messages",
      "nickname": "Nickname changes",
      "role_add": "Added roles",
      "role_remove": "Removed roles",
      "unbans": "Unbans"
    },
    "fields": {
      "channel": "Channel",
      "status": "Status"
    },
    "options": {
      "modlogs_channel_channel_channel": "Text channel for moderation logs",
      "modlogs_config_enabled_enabled": "Whether that event type should be logged",
      "modlogs_config_event_event": "Event type to configure",
      "modlogs_enabled_enabled_enabled": "Whether the feature stays enabled",
      "modlogs_setup_channel_channel": "Text channel for moderation logs"
    },
    "responses": {
      "channel_required": "Set a modlog channel before enabling the system.",
      "channel_updated": "Modlog channel updated to {{channel}}.",
      "enabled_state": "Modlogs are now **{{state}}**.",
      "event_state": "{{event}} logging is now **{{state}}**.",
      "info_title": "Modlog configuration",
      "setup_description": "Moderation logs are now active in {{channel}}.",
      "setup_title": "Modlogs configured"
    },
    "slash": {
      "choices": {
        "bans": "Bans",
        "joins": "Member joins",
        "kicks": "Kicks",
        "leaves": "Member leaves",
        "message_delete": "Deleted messages",
        "message_edit": "Edited messages",
        "nickname": "Nickname changes",
        "role_add": "Added roles",
        "role_remove": "Removed roles",
        "unbans": "Unbans"
      },
      "description": "Configure moderation logs",
      "options": {
        "channel": "Text channel for moderation logs",
        "enabled": "Whether the feature stays enabled",
        "event": "Event type to configure",
        "event_enabled": "Whether that event type should be logged"
      },
      "subcommands": {
        "channel": {
          "description": "Change the modlog channel"
        },
        "config": {
          "description": "Enable or disable one logged event type"
        },
        "enabled": {
          "description": "Enable or disable the modlog system"
        },
        "info": {
          "description": "View the current modlog configuration"
        },
        "setup": {
          "description": "Enable modlogs and set the main log channel"
        }
      }
    }
  },
  "observability": {
    "interactions": "Interactions",
    "scope_errors": "Errors by scope",
    "top_error": "Top error",
    "window": "Window"
  },
  "onboarding": {
    "body": "🇺🇸 **English:**\nTON618 operates natively in English. Please click the button below to set English as the default language for this server. You can change it later using the `/setup language` command.\n\n🇪🇸 **Español:**\nTON618 opera de manera nativa en Español. Por favor haz clic en el botón inferior para establecer el español como el idioma principal de este servidor. Puedes cambiarlo más adelante usando el comando `/setup language`.",
    "buttons": {
      "documentation": "Documentation",
      "support_server": "Support Server"
    },
    "confirm_description": "TON618 will now operate in **{{label}}** for this server.",
    "confirm_title": "Server language updated",
    "delivery_failed": "TON618 joined the server, but I could not deliver the language onboarding prompt in a writable channel or DM.",
    "description": "Please choose the primary language for this server / Por favor elige el idioma principal de este servidor.",
    "dm_fallback_intro": "I could not post the onboarding prompt in a writable server channel, so I am sending it here.",
    "dm_fallback_subject": "TON618 language setup",
    "embed": {
      "description": "Thank you for adding **{{brand}}** to your server!\n\nI'm your all-in-one Discord management solution, designed to help you with:\n\n{{ticketIcon}} **Support Tickets** — Streamlined ticket system with SLA tracking\n{{moderationIcon}} **Moderation** — AutoMod, case management, and warnings\n{{giveawayIcon}} **Giveaways** — Fair and transparent giveaway management\n{{statsIcon}} **Analytics** — Server statistics and insights\n{{settingsIcon}} **Configuration** — Easy setup with /setup commands\n\n**Quick Start:** Use `/quickstart` to see your setup progress\n**Full Setup:** Use `/setup wizard` for ticket configuration\n\n**First, please select your preferred language:**",
      "features": {
        "analytics": "Analytics",
        "analytics_description": "Server statistics and insights",
        "configuration": "Configuration",
        "configuration_description": "Easy setup with /setup commands",
        "giveaways": "Giveaways",
        "giveaways_description": "Fair and transparent giveaway management",
        "moderation": "Moderation",
        "moderation_description": "AutoMod, case management, and warnings",
        "quick_start": "Quick Start",
        "quickstart_command": "Use `/quickstart` to see your setup progress",
        "setup_wizard_command": "Use `/setup wizard` for ticket configuration",
        "support_tickets": "Support Tickets",
        "tickets_description": "Streamlined ticket system with SLA tracking"
      },
      "full_setup": "Full Setup",
      "quick_start": "Quick Start",
      "select_language": "**First, please select your preferred language:**",
      "subtitle": "Your all-in-one Discord management solution",
      "thanks": "Thank you for adding {{brand}} to your server",
      "title": "Welcome to {{brand}}"
    },
    "footer": "If no language is selected, TON618 will default to English.",
    "posted_description": "A language selection prompt was delivered for this server. TON618 will keep English until an administrator chooses a language.",
    "posted_title": "Language onboarding sent",
    "title": "Welcome to TON618 / Bienvenido a TON618"
  },
  "ping": {
    "description": "View bot latency and stats",
    "field": {
      "channels": "Channels",
      "guilds": "Servers",
      "latency": "Bot Latency",
      "uptime": "Uptime",
      "users": "Users"
    },
    "title": "PONG!"
  },
  "poll": {
    "embed": {
      "active_channel_deleted": "Channel Deleted",
      "active_count_title": "📊 Active Polls ({{count}})",
      "active_empty": "No active polls in this server.",
      "active_footer": "Use /poll end <id> to end early",
      "active_item_votes": "Votes",
      "active_title": "📊 Active Polls",
      "created_description": "Poll sent to {{channel}}.",
      "created_title": "✅ Poll Created",
      "field_created_by": "Created by",
      "field_ends": "Ends",
      "field_id": "Poll ID",
      "field_in": "Time remaining",
      "field_mode": "Voting Mode",
      "field_options": "Options",
      "field_question": "Question",
      "field_required_role": "Required Role",
      "field_total_votes": "Total Votes",
      "footer_ended": "Voting closed",
      "footer_multiple": "You can vote for multiple options",
      "footer_single": "Only one option allowed",
      "mode_multiple": "Multiple Choice",
      "mode_single": "Single Choice",
      "status_anonymous": "Hidden Results",
      "status_ended": "Poll Ended",
      "title_ended_prefix": "🏁 Ended:",
      "title_prefix": "🗳️ Poll:",
      "vote_plural": "votes",
      "vote_singular": "vote"
    },
    "errors": {
      "manage_messages_required": "You need 'Manage Messages' permission.",
      "max_duration": "Poll cannot last more than 30 days.",
      "max_options": "You can only have up to 10 options.",
      "max_votes_reached": "You can only vote for up to {{max}} options.",
      "min_duration": "Poll must last at least 1 minute.",
      "min_options": "You need at least 2 options.",
      "option_too_long": "An option is too long (max 80 chars).",
      "poll_not_found": "Poll with ID `{{id}}` not found.",
      "pro_required": "✨ This requires **TON618 Pro**.",
      "role_required": "You must have the <@&{{roleId}}> role to vote.",
      "unknown_subcommand": "Unknown poll subcommand."
    },
    "placeholder": "📊 Loading poll...",
    "slash": {
      "description": "Interactive polling system",
      "options": {
        "anonymous": "Hide results until end (Pro)",
        "channel": "Target channel",
        "duration": "Duration (e.g., 1h, 30m, 1d)",
        "id": "Poll ID (last 6 characters)",
        "max_votes": "Max options allowed (Pro)",
        "multiple": "Allow multiple votes",
        "options": "Options separated by |",
        "question": "Poll question",
        "required_role": "Requirement to vote (Pro)"
      },
      "subcommands": {
        "create": {
          "description": "Create a new poll"
        },
        "end": {
          "description": "End a poll early"
        },
        "list": {
          "description": "View active polls"
        }
      }
    },
    "success": {
      "ended": "✅ The poll **\"{{question}}\"** has been ended.",
      "vote_active_multiple": "Your current votes: {{options}}",
      "vote_active_single": "You voted for: **{{option}}**",
      "vote_removed": "Your vote has been removed."
    }
  },
  "poll.errors.owner_only": "Only the server owner can use this poll option.",
  "premium": {
    "active": "Active",
    "error_fetching": "I couldn't get your membership information. Please try again later.",
    "error_generic": "An error occurred while processing your request.",
    "expires_at": "Expires on",
    "expires_in": "📅 Expires in **{{days}} days**.",
    "expires_soon": "⚠️ **Expires in {{days}} days!** Don't forget to renew.",
    "expires_tomorrow": "🚨 **Expires tomorrow!** Renew urgently.",
    "expires_week": "⏰ Expires in **{{days}} days**. Prepare to renew.",
    "free_plan": "ℹ️ You're using the FREE plan. Upgrade to PRO to unlock advanced features.",
    "guild_only": "This command only works on servers.",
    "owner_only": "Only the server owner can use this command.",
    "plan_label": "Plan",
    "pro_active": "✅ You have an active PRO membership with access to all premium features.",
    "slash": {
      "description": "View your premium membership status",
      "status": "See how much time is left on your premium membership"
    },
    "redeem": {
      "code_expired": "This code has expired. Please contact support for a new code.",
      "code_not_found": "The code you entered was not found. Please verify and try again.",
      "code_used": "This code has already been redeemed. Each code can only be used once.",
      "days": "{{days}} days",
      "duration_label": "Duration",
      "error_title": "❌ Redemption Failed",
      "expires_at": "📅 Your PRO access expires on {{date}}.",
      "extended": "🔄 Your existing PRO membership has been extended!",
      "generic_error": "An unexpected error occurred. Please try again later.",
      "guild_only": "This command only works on servers.",
      "invalid_code": "The code you entered is invalid.",
      "lifetime": "Lifetime",
      "lifetime_access": "🌟 You have **lifetime** PRO access!",
      "owner_only": "Only the server owner can redeem PRO codes.",
      "processing_error": "There was an error processing your redemption. Please try again or contact support.",
      "server_label": "Server",
      "success_description": "Your code `{{code}}` has been redeemed successfully.\n\nYou now have **{{plan}}** access to all premium features!",
      "success_title": "✅ PRO Activated Successfully!"
    },
    "reminder": {
      "description_1": "⏰ **URGENT**: Your PRO membership for **{{guildName}}** expires **tomorrow**.\n\nRenew immediately or you will lose access to all premium features.",
      "description_3": "Your PRO membership for **{{guildName}}** expires in **3 days**.\n\nDon't lose access to premium features! Renew before it's too late.",
      "description_7": "Your PRO membership for **{{guildName}}** expires in **7 days**.\n\nRenew now to keep all premium features active.",
      "field_days_remaining": "Days remaining",
      "field_plan": "Plan",
      "field_server": "Server",
      "footer": "TON618 - Membership System",
      "title_1": "🚨 Your PRO membership expires tomorrow",
      "title_3": "⚠️ Your PRO membership expires in 3 days",
      "title_7": "⏰ Your PRO membership expires in 7 days"
    },
    "slash": {
      "code_option": "Your PRO redemption code (format: XXXX-XXXX-XXXX)",
      "description": "View your premium membership status",
      "redeem_description": "Redeem a PRO code to activate premium features",
      "status": "See how much time is left on your premium membership"
    },
    "source_label": "Source",
    "started_at": "Started",
    "status_label": "Status",
    "status_title": "Your Membership Status",
    "supporter_active": "✅ Active",
    "supporter_status": "Supporter Status",
    "time_remaining": "Time remaining",
    "upgrade_cta": "Get Pro — open a ticket on our support server",
    "upgrade_label": "🚀 Get Pro"
  },
  "proadmin": {
    "assigned_to": "👤 Assigned To",
    "available_codes": "✅ Available ({{count}})",
    "available_codes_stat": "✅ Available",
    "codes_label": "🎫 Codes",
    "days": "{{days}} days",
    "dm_description": "Here is your exclusive PRO redemption code:\n\n**Code:** `{{code}}`\n**Duration:** {{duration}}\n\nUse this code in your server with `/pro redeem` to activate PRO features!",
    "dm_failed": "❌ Failed",
    "dm_footer": "TON618 - Premium Membership",
    "dm_sent": "📨 DM Sent",
    "dm_title": "🎉 Your PRO Code is Ready!",
    "error_title": "❌ Error",
    "expired_codes": "⏰ Expired",
    "generate_error": "There was an error generating the codes. Please try again.",
    "generate_success_description": "Here are your new PRO codes with **{{duration}}** duration:",
    "generate_success_title": "✅ Generated {{count}} Code(s)",
    "generated_by": "🤖 Generated By",
    "how_to_redeem": "How to Redeem",
    "lifetime": "Lifetime",
    "list_error": "There was an error listing the codes. Please try again.",
    "list_title": "📋 PRO Code Inventory",
    "no_codes": "No available codes",
    "none": "None",
    "redeem_instructions": "1. Go to your Discord server\n2. Run `/pro redeem`\n3. Enter your code: `{{code}}`",
    "redeemed_codes": "🎟️ Recently Redeemed ({{count}})",
    "redeemed_codes_stat": "🎟️ Redeemed",
    "slash": {
      "description": "Generate and manage PRO redemption codes (Support Server only)",
      "generate_description": "Generate new PRO redemption codes",
      "list_description": "List available and redeemed codes",
      "stats_description": "View code statistics"
    },
    "slash_options": {
      "count": "Number of codes to generate (1-20)",
      "duration": "Duration of the PRO membership",
      "for_user": "Optional: User to assign the code to (sends DM)",
      "notes": "Optional notes about these codes"
    },
    "stats_error": "There was an error fetching statistics. Please try again.",
    "stats_title": "📊 PRO Code Statistics",
    "total_codes": "🎫 Total Codes",
    "valid_until": "⏰ Valid Until"
  },
  "profile": {
    "embed": {
      "coins_format": "{{amount}} coins",
      "field_bank": "Bank",
      "field_level": "Level",
      "field_rank": "Rank",
      "field_total": "Net Worth",
      "field_total_xp": "Total XP",
      "field_wallet": "Wallet",
      "level_format": "Level {{level}}",
      "no_data": "No participants yet.",
      "page_format": "Page {{current}} of {{total}}",
      "title": "{{username}}'s Profile",
      "top_economy": "💰 Richest Members",
      "top_levels": "📊 Top Levels",
      "top_title": "🏆 Leaderboard",
      "user_fallback": "User #{{id}}"
    },
    "slash": {
      "description": "Simple profile: level + economy",
      "options": {
        "user": "User to inspect"
      },
      "subcommands": {
        "top": {
          "description": "View leaderboard"
        },
        "view": {
          "description": "View a profile"
        }
      }
    }
  },
  "resetall": {
    "collections_cleared": "📁 Collections to clear: {{count}}",
    "collections_cleared_count": "📁 Collections cleared: {{count}}",
    "confirmation_code": "🔑 Confirmation Code",
    "confirmation_value": "To execute, run `/resetall execute` with code: `{{code}}`",
    "documents_deleted": "📄 Estimated documents: {{count}}",
    "documents_deleted_count": "🗑️ Total documents deleted: {{count}}",
    "errors": "❌ Errors: {{count}}",
    "executing_desc": "Deleting all guild configurations...",
    "executing_title": "🗑️ Executing Mass Reset...",
    "guilds_affected": "🏠 Guilds affected: {{count}}",
    "invalid_code": "❌ Invalid confirmation code. Get the correct code from `/resetall preview`.",
    "no_code": "❌ This command requires a confirmation code from `/resetall preview`.",
    "owner_only": "🔒 This command is restricted to the bot owner.",
    "preview_description": "This will delete the following data from ALL guilds:",
    "preview_title": "🗑️ Mass Reset Preview",
    "slash": {
      "description": "Reset ALL guild configurations (Owner only)",
      "options": {
        "confirm_code": "Confirmation code (will be provided)"
      },
      "subcommands": {
        "execute": {
          "description": "Execute the full reset with confirmation code"
        },
        "preview": {
          "description": "Preview what will be deleted without executing"
        }
      }
    },
    "success_description": "All guild configurations have been reset.",
    "success_title": "✅ Mass Reset Complete",
    "warning": "⚠️ WARNING",
    "warning_value": "This action is DESTRUCTIVE and CANNOT be undone. All guild-specific configurations will be permanently deleted."
  },
  "resetguild": {
    "error": "❌ An error occurred during the reset.",
    "guild_not_found": "❌ Guild not found with ID: `{{guildId}}`",
    "owner_only": "🔒 This command is restricted to the bot owner.",
    "reset_description": "Configuration has been reset for guild: `{{guildId}}`",
    "reset_title": "🗑️ Guild Reset Complete",
    "slash": {
      "description": "Reset configuration for a specific guild (Owner only)",
      "options": {
        "guild_id": "Guild ID to reset (leave empty for this guild)",
        "preserve_pro": "Preserve PRO/premium status",
        "preserve_tickets": "Preserve active tickets",
        "reason": "Reason for the reset"
      }
    }
  },
  "security": {
    "alert_acknowledged": "✅ Alert Acknowledged",
    "alert_not_found": "❌ Alert not found or already acknowledged.",
    "alerts_count": "📊 {{count}} alerts in memory",
    "alerts_title": "🔒 Security Alerts",
    "channel_configured": "✅ Configured",
    "channel_not_set": "❌ Not set",
    "check_clean": "✅ No security issues detected.",
    "check_title": "🔒 Manual Security Check Complete",
    "check_triggered": "⚠️ **{{count}} security alert(s) triggered!**\nUse `/security alerts` to view details.",
    "db_connected": "✅ MongoDB connected",
    "db_disconnected": "❌ MongoDB disconnected",
    "encryption_active": "Your sensitive data is being automatically encrypted with AES-256-GCM.",
    "encryption_disabled": "❌ Disabled",
    "encryption_enabled": "✅ Enabled",
    "encryption_inactive": "⚠️ Encryption is NOT enabled. Sensitive data is stored in plain text.\n\nRun `/security encryption generate_key:true` to generate a key.",
    "encryption_title": "🔐 Encryption Status",
    "high_severity": "🔴 {{count}} high severity",
    "indexes_created": "Indexes: ✅ Created",
    "indexes_failed": "Indexes: ❌ Failed",
    "key_configured": "✅ Yes",
    "key_generated_desc": "A new 256-bit encryption key has been generated.\n\n**Add this to your .env file:**\n```\nENCRYPTION_KEY={{key}}\n```",
    "key_generated_title": "🔐 New Encryption Key Generated",
    "key_invalid": "(❌ Too short)",
    "key_not_configured": "❌ No",
    "key_valid": "(✅ Valid)",
    "key_warning": "⚠️ Important",
    "key_warning_value": "• Keep this key SECRET and in a password manager\n• If you lose it, encrypted data CANNOT be recovered\n• Changing the key will make existing encrypted data unreadable",
    "no_alerts": "No security alerts found.",
    "owner_only": "🔒 This command is restricted to the bot owner.",
    "scheduler_failed": "Scheduler: ❌ Failed",
    "scheduler_running": "✅ Scheduler running",
    "scheduler_started": "Scheduler: ✅ Started",
    "scheduler_stopped": "❌ Scheduler stopped",
    "setup_complete": "🔒 Security Setup Complete",
    "slash": {
      "description": "Security monitoring and alerts (Owner only)",
      "options": {
        "alert_id": "Alert ID to acknowledge",
        "generate_key": "Generate a new encryption key",
        "indexes": "Create MongoDB indexes",
        "limit": "Number of alerts to show (max 25)",
        "scheduler": "Start security scheduler",
        "severity": "Filter by severity"
      },
      "subcommands": {
        "acknowledge": {
          "description": "Acknowledge an alert"
        },
        "alerts": {
          "description": "View recent security alerts"
        },
        "check": {
          "description": "Run manual security check"
        },
        "encryption": {
          "description": "View encryption status and generate keys"
        },
        "setup": {
          "description": "Setup security system (indexes, scheduler)"
        },
        "status": {
          "description": "View security system status"
        },
        "test": {
          "description": "Test Discord alert notifications"
        }
      }
    },
    "status_running": "✅ Running",
    "status_stopped": "❌ Stopped",
    "status_title": "🔒 Security System Status",
    "test_description": "A test security alert has been sent to your configured Discord channel/webhook.",
    "test_failed": "❌ Failed to send test alert. Check that SECURITY_ALERTS_WEBHOOK_URL or SECURITY_ALERTS_CHANNEL_ID is configured in your .env file.",
    "test_sent": "✅ Test Alert Sent",
    "webhook_configured": "✅ Configured",
    "webhook_not_set": "❌ Not set"
  },
  "serverstats": {
    "activity": {
      "footer": "Period: {{period}}",
      "messages": "💬 Messages",
      "messages_value": "**Total:** {{total}}\n**Avg/Day:** {{avg}}",
      "peak_hour": "🕒 Peak Hour",
      "peak_hour_value": "**{{hour}}:00 - {{next}}:00** with {{count}} messages",
      "title": "📊 Activity Statistics - {{period}}",
      "top_channels": "🔥 Top Channels",
      "top_channels_value": "{{num}}. <#{{channelId}}> - {{count}} msgs",
      "top_users": "⭐ Most Active Users",
      "top_users_value": "{{num}}. <@{{userId}}> - {{count}} msgs"
    },
    "channels": {
      "channel_entry": "**{{num}}.** <#{{channelId}}>\n└ {{count}} messages",
      "entry": "**{{index}}.** {{channel}}\n└ {{messages}} messages",
      "footer": "Period: {{period}} | Top 10 channels",
      "title": "📁 Channel Activity - {{period}}"
    },
    "choices": {
      "period_all": "All Time",
      "period_day": "Today",
      "period_month": "This Month",
      "period_week": "This Week"
    },
    "errors": {
      "activity_failed": "Failed to fetch activity statistics.",
      "channels_failed": "Failed to fetch channel statistics.",
      "growth_failed": "Failed to fetch growth statistics.",
      "members_failed": "Failed to fetch member statistics.",
      "no_activity": "No message activity recorded during this period.",
      "no_data": "No {{type}} data available for analysis.",
      "overview_failed": "Failed to fetch server overview.",
      "roles_failed": "Failed to fetch role statistics.",
      "support_failed": "Failed to fetch support statistics."
    },
    "growth": {
      "30day": "📊 30-Day Growth",
      "30day_value": "**Total Change:** {{change}}\n**Percentage:** {{percent}}%\n**Start:** {{start}}\n**Current:** {{current}}",
      "footer": "Based on last 30 days of data",
      "stats_30d": "📊 30-Day Growth",
      "stats_30d_value": "**Total Change:** {{change}}\n**Percentage:** {{percent}}%\n**Start:** {{start}}\n**Current:** {{current}}",
      "title": "📈 Server Growth Statistics",
      "trend": "📅 Recent Trend",
      "trend_value": "**Avg Daily Growth:** {{avg}}\n**Projected (30d):** {{projected}}"
    },
    "members": {
      "current": "📈 Current Statistics",
      "current_stats": "📈 Current Stats",
      "current_stats_value": "**Total Members:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}",
      "current_value": "**Total Members:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}",
      "footer": "Period: {{period}}",
      "growth": "📊 Growth",
      "growth_value": "**Change:** {{change}}\n**Percentage:** {{percent}}%",
      "new_members": "🆕 New Members",
      "new_members_value": "**Joined:** {{count}}\n**Average/Day:** {{avg}}",
      "period_footer": "Period: {{period}}",
      "title": "👥 Member Statistics - {{period}}"
    },
    "options": {
      "serverstats_activity_period_period": "Time period to view statistics",
      "serverstats_channels_period_period": "Time period to view statistics",
      "serverstats_growth_period_period": "Time period to view statistics",
      "serverstats_members_period_period": "Time period to view statistics",
      "serverstats_support_period_period": "Time period to view statistics"
    },
    "overview": {
      "boosts": "✨ Boosts",
      "boosts_value": "**Total Boosts:** {{count}}\n**Boosters:** {{boosters}}",
      "channels": "📁 Channels",
      "channels_value": "**Total:** {{total}}\n**Text:** {{text}}\n**Voice:** {{voice}}",
      "emojis": "😀 Emojis",
      "emojis_value": "**Total:** {{total}}\n**Static:** {{static}}\n**Animated:** {{animated}}",
      "footer": "Server ID: {{id}}",
      "info": "ℹ️ Information",
      "info_value": "**Owner:** {{owner}}\n**Created:** {{created}}\n**Boost Tier:** {{boostLevel}}",
      "members": "👥 Members",
      "members_value": "**Total:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}\n**Online:** {{online}}",
      "roles": "🎭 Roles",
      "roles_value": "**Total:** {{total}}\n**Highest:** {{highest}}",
      "title": "📊 Server Overview: {{server}}"
    },
    "periods": {
      "all": "All Time",
      "day": "Today",
      "month": "This Month",
      "week": "This Week"
    },
    "roles": {
      "entry": "**{{index}}.** {{role}}\n└ {{count}} members ({{percent}}%)",
      "footer": "Total roles: {{total}} | Showing top 15",
      "role_entry": "**{{num}}.** {{role}}\n└ {{count}} members ({{percent}}%)",
      "title": "🎭 Role Distribution"
    },
    "slash": {
      "description": "View server statistics",
      "subcommands": {
        "activity": {
          "description": "View activity statistics",
          "options": {
            "period": "Time period to view statistics"
          }
        },
        "channels": {
          "description": "View channel activity statistics",
          "options": {
            "period": "Time period to view statistics"
          }
        },
        "growth": {
          "description": "View server growth statistics"
        },
        "members": {
          "description": "View member statistics",
          "options": {
            "period": "Time period to view statistics"
          }
        },
        "overview": {
          "description": "View server overview"
        },
        "roles": {
          "description": "View role distribution statistics"
        },
        "support": {
          "description": "View support ticket statistics",
          "options": {
            "period": "Time period to view statistics"
          }
        }
      }
    },
    "support": {
      "footer": "Period: {{period}}",
      "response_times": "⏱️ Response Times",
      "response_times_value": "**Avg Response:** {{avgResponse}}\n**Avg Resolution:** {{avgResolution}}",
      "tickets": "📊 Tickets",
      "tickets_value": "**Total:** {{total}}\n**Open:** {{open}}\n**Closed:** {{closed}}",
      "times": "⏱️ Response Times",
      "times_value": "**Avg Response:** {{avgResponse}}\n**Avg Resolution:** {{avgResolution}}",
      "title": "🎫 Support Statistics - {{period}}",
      "top_staff": "⭐ Top Staff (All Time)",
      "top_staff_value": "{{num}}. <@{{userId}}> - {{count}} tickets"
    }
  },
  "setup": {
    "automod": {
      "bootstrap_description": "Create initial AutoMod rules",
      "channel_alert_description": "Set or clear the AutoMod alert channel",
      "choice_add": "Add",
      "choice_preset_all": "All presets",
      "choice_preset_invites": "Invites",
      "choice_preset_scam": "Scam links",
      "choice_preset_spam": "Spam",
      "choice_remove": "Remove",
      "choice_reset": "Reset",
      "disable_description": "Remove all managed AutoMod rules",
      "exempt_channel_description": "Manage exempt channels",
      "exempt_role_description": "Manage exempt roles",
      "group_description": "Configure AutoMod rules and exemptions",
      "option_action": "Action to perform",
      "option_channel": "Channel to receive AutoMod alerts",
      "option_clear": "Clear the alert channel",
      "option_enabled": "Enable or disable this preset",
      "option_preset_name": "Preset name",
      "option_target_channel": "Channel to exempt",
      "option_target_role": "Role to exempt",
      "preset_all": "All presets",
      "preset_description": "Enable or disable an AutoMod preset",
      "preset_invites": "Invites",
      "preset_scam": "Scam links",
      "preset_spam": "Spam",
      "status_description": "View AutoMod configuration status",
      "sync_description": "Sync AutoMod rules with current settings"
    },
    "commands": {
      "already_disabled": "The command `/{{command}}` was already disabled.",
      "already_enabled": "The command `/{{command}}` was already enabled.",
      "audit_affected": "Affected command: `/{{command}}`",
      "audit_after": "After",
      "audit_before": "Before",
      "audit_disabled": "Command disabled",
      "audit_enabled": "Command enabled",
      "audit_executed_by": "Executed by",
      "audit_global": "A global command change was applied.",
      "audit_reset": "Command reset",
      "audit_server": "Server",
      "audit_updated": "Command update",
      "candidate_description_disable": "Disable command",
      "candidate_description_enable": "Enable command",
      "candidate_description_status": "Check current status",
      "disable_description": "Disable a command in this server",
      "disable_setup_forbidden": "You cannot disable `/setup`, otherwise you could lock yourself out of configuration.",
      "disabled_success": "Command `/{{command}}` disabled for this server.",
      "enable_description": "Re-enable a previously disabled command",
      "enabled_success": "Command `/{{command}}` enabled again.",
      "format_more": "- ... and {{count}} more",
      "group_description": "Manage which commands are available in this server",
      "hidden_suffix": " (+{{count}} hidden)",
      "list_description": "List the commands currently disabled in this server",
      "list_embed_title": "Server commands",
      "list_footer": "Available: **{{available}}** | Enabled: **{{enabled}}**.",
      "list_heading": "Disabled commands ({{count}}):",
      "list_none": "No commands are disabled in this server.\nAvailable: **{{available}}** | Enabled: **{{enabled}}**.",
      "missing_command_name": "You must provide a valid command name.",
      "mode_disable": "Disable",
      "mode_enable": "Enable",
      "mode_status": "Status",
      "no_candidates_description": "Switch actions to see more options",
      "no_candidates_label": "No commands available",
      "option_disable_description": "Block a command in this server",
      "option_disable_label": "Disable command",
      "option_enable_description": "Restore a previously disabled command",
      "option_enable_label": "Enable command",
      "option_list_description": "Show the disabled command summary",
      "option_list_label": "List disabled",
      "option_reset_description": "Re-enable every disabled command",
      "option_reset_label": "Reset all",
      "option_status_description": "Check whether a command is enabled",
      "option_status_label": "Command status",
      "panel_description": "Open the interactive command control panel",
      "panel_notice": "Use the menus below to manage commands without typing names manually.",
      "panel_title": "Server command controls",
      "placeholder_action": "Select an action",
      "placeholder_target": "Command to {{action}}",
      "reset_description": "Re-enable every disabled command",
      "reset_done": "Re-enabled **{{count}}** command(s).",
      "reset_noop": "No commands were disabled. Nothing to reset.",
      "status_description": "Check one command or view the current summary",
      "status_embed_title": "Command status",
      "status_result": "Status for `/{{command}}`: **{{state}}**.\nCurrently disabled commands: **{{count}}**.",
      "summary_available": "Available: **{{count}}**",
      "summary_candidates": "Candidates in menu: **{{visible}}**{{hiddenText}}",
      "summary_current_mode": "Current mode: **{{mode}}**",
      "summary_disabled": "Disabled: **{{count}}**",
      "summary_result": "Result: {{notice}}",
      "unknown_command": "The command `/{{command}}` does not exist in this bot."
    },
    "confessions": {
      "configure_description": "Set the channel and role used for confessions",
      "group_description": "Configure anonymous confessions"
    },
    "general": {
      "admin_role_description": "Set the admin role",
      "auto_close_description": "Configure automatic ticket closing",
      "cooldown_description": "Set ticket creation cooldown",
      "dashboard_description": "Set the channel for the dashboard",
      "dm_close_description": "Configure DM on ticket close",
      "dm_open_description": "Configure DM on ticket open",
      "global_limit_description": "Set global ticket limit",
      "group_description": "Configure the server operational settings",
      "info_description": "View current server configuration",
      "language_description": "Review or update the bot language for this server",
      "language_label_en": "English",
      "language_label_es": "Spanish",
      "language_set": "Bot language configured: **{{label}}**.",
      "live_members_description": "Set the voice channel for live member count",
      "live_role_description": "Set the voice channel for live role count",
      "log_deletes_description": "Configure message delete logging",
      "log_edits_description": "Configure message edit logging",
      "logs_description": "Set the channel for moderation logs",
      "max_tickets_description": "Set maximum tickets per user",
      "min_days_description": "Set minimum account age in days",
      "option_channel": "Channel",
      "option_count": "Count",
      "option_days": "Days",
      "option_enabled": "Enable or disable",
      "option_language_value": "Language to use for visible bot responses",
      "option_minutes": "Minutes",
      "option_role": "Role",
      "option_role_to_count": "Role to count",
      "option_verify_role": "Verification role (leave empty to disable)",
      "option_voice_channel": "Voice channel",
      "sla_description": "Configure SLA settings",
      "smart_ping_description": "Configure smart ping settings",
      "staff_role_description": "Set the staff role",
      "transcripts_description": "Set the channel for ticket transcripts",
      "verify_role_description": "Set the verification role",
      "weekly_report_description": "Set the channel for weekly reports"
    },
    "goodbye": {
      "avatar_description": "Show or hide the departing member avatar",
      "avatar_state": "Member avatar in goodbye messages: **{{state}}**.",
      "channel_description": "Set the channel used for goodbye messages",
      "channel_set": "Goodbye channel set to {{channel}}.",
      "color_description": "Set the goodbye embed color (hex)",
      "color_updated": "Goodbye color updated to **#{{hex}}**.",
      "enabled_description": "Enable or disable goodbye messages",
      "enabled_state": "Goodbye messages are now **{{state}}**.",
      "footer_description": "Update the goodbye embed footer",
      "footer_updated": "Goodbye footer updated.",
      "group_description": "Configure goodbye messages",
      "hidden": "Hidden",
      "invalid_color": "Invalid color. Use a 6 character hex code like `{{example}}`.",
      "message_description": "Update the goodbye message",
      "message_updated": "Goodbye message updated.\nAvailable variables: {{vars}}",
      "test_channel_missing": "Configured goodbye channel not found.",
      "test_default_message": "**{user}** left the server.",
      "test_default_title": "See you later",
      "test_description": "Send a test goodbye message",
      "test_field_remaining_members": "Remaining members",
      "test_field_roles": "Roles",
      "test_field_user": "User",
      "test_field_user_id": "User ID",
      "test_requires_channel": "Configure a goodbye channel first with `/setup goodbye channel`.",
      "test_roles_value": "Test payload only",
      "test_sent": "Test goodbye message sent to {{channel}}.",
      "title_description": "Update the goodbye embed title",
      "title_updated": "Goodbye title updated to **{{text}}**.",
      "visible": "Visible"
    },
    "language": {
      "audit_reason_manual": "manual_language_change",
      "audit_reason_onboarding": "onboarding_language_selection",
      "current_value": "TON618 is currently operating in **{{label}}**.",
      "description": "Review or update the operational language TON618 uses in this server.",
      "fallback_note": "Guilds without an explicit selection continue using English until an administrator sets a language.",
      "onboarding_completed": "Completed",
      "onboarding_pending": "Pending",
      "title": "Server language",
      "updated_value": "Language changed to **{{label}}**. TON618 will use this language for visible responses in this guild."
    },
    "options": {
      "setup_automod_channel-alert_channel_channel": "Channel to receive AutoMod alerts",
      "setup_automod_channel-alert_clear_clear": "Clear the alert channel",
      "setup_automod_exempt-channel_action_action": "Action to perform",
      "setup_automod_exempt-channel_channel_channel": "Channel to exempt",
      "setup_automod_exempt-role_action_action": "Action to perform",
      "setup_automod_exempt-role_role_role": "Role to exempt",
      "setup_automod_preset_enabled_enabled": "Enable or disable this preset",
      "setup_automod_preset_name_name": "Preset name",
      "setup_commands_disable_command_command": "Command name without `/`",
      "setup_commands_enable_command_command": "Command name without `/`",
      "setup_commands_status_command_command": "Command name without `/` (optional)",
      "setup_confessions_configure_channel_channel": "Channel where confessions are posted",
      "setup_confessions_configure_role_role": "Role required to use confessions",
      "setup_general_admin-role_role_role": "Role",
      "setup_general_auto-close_minutes_minutes": "Minutes",
      "setup_general_cooldown_minutes_minutes": "Minutes",
      "setup_general_dashboard_channel_channel": "Channel",
      "setup_general_dm-close_enabled_enabled": "Enable or disable",
      "setup_general_dm-open_enabled_enabled": "Enable or disable",
      "setup_general_global-limit_count_count": "Count",
      "setup_general_language_value_value": "Language to use for visible bot responses",
      "setup_general_live-members_channel_channel": "Voice channel",
      "setup_general_live-role_channel_channel": "Voice channel",
      "setup_general_live-role_role_role": "Role to count",
      "setup_general_log-deletes_enabled_enabled": "Enable or disable",
      "setup_general_log-edits_enabled_enabled": "Enable or disable",
      "setup_general_logs_channel_channel": "Channel",
      "setup_general_max-tickets_count_count": "Count",
      "setup_general_min-days_days_days": "Days",
      "setup_general_sla_minutes_minutes": "Minutes",
      "setup_general_smart-ping_minutes_minutes": "Minutes",
      "setup_general_staff-role_role_role": "Role",
      "setup_general_transcripts_channel_channel": "Channel",
      "setup_general_verify-role_role_role": "Verification role (leave empty to disable)",
      "setup_general_weekly-report_channel_channel": "Channel",
      "setup_goodbye_avatar_show_show": "Show the member avatar",
      "setup_goodbye_channel_channel_channel": "Goodbye channel",
      "setup_goodbye_color_hex_hex": "Hex color without `#`",
      "setup_goodbye_enabled_enabled_enabled": "Whether goodbye messages remain enabled",
      "setup_goodbye_footer_text_text": "Footer text",
      "setup_goodbye_message_text_text": "Message content",
      "setup_goodbye_title_text_text": "Embed title",
      "setup_language_value_value": "Language to use for visible bot responses",
      "setup_suggestions_channel_channel_channel": "Suggestions channel",
      "setup_suggestions_enabled_enabled_enabled": "Whether suggestions stay enabled",
      "setup_tickets_auto-assignment_active_active": "Enable or disable",
      "setup_tickets_auto-assignment_require-online_require-online": "Require online status",
      "setup_tickets_auto-assignment_respect-away_respect-away": "Respect away status",
      "setup_tickets_control-embed_color_color": "Embed color (hex)",
      "setup_tickets_control-embed_description_description": "Control embed description",
      "setup_tickets_control-embed_footer_footer": "Control embed footer",
      "setup_tickets_control-embed_reset_reset": "Reset to default",
      "setup_tickets_control-embed_title_title": "Control embed title",
      "setup_tickets_daily-report_active_active": "Enable or disable",
      "setup_tickets_daily-report_channel_channel": "Channel for daily reports",
      "setup_tickets_incident_active_active": "Enable or disable",
      "setup_tickets_incident_categories_categories": "Affected categories (comma-separated IDs)",
      "setup_tickets_incident_message_message": "Custom incident message",
      "setup_tickets_panel-style_color_color": "Embed color (hex)",
      "setup_tickets_panel-style_description_description": "Panel embed description",
      "setup_tickets_panel-style_footer_footer": "Panel embed footer",
      "setup_tickets_panel-style_reset_reset": "Reset to default",
      "setup_tickets_panel-style_title_title": "Panel embed title",
      "setup_tickets_sla-rule_category_category": "Target category",
      "setup_tickets_sla-rule_minutes_minutes": "Minutes threshold",
      "setup_tickets_sla-rule_priority_priority": "Target priority",
      "setup_tickets_sla-rule_type_type": "Rule type",
      "setup_tickets_sla_escalation-channel_escalation-channel": "Channel for escalation alerts",
      "setup_tickets_sla_escalation-enabled_escalation-enabled": "Enable escalation",
      "setup_tickets_sla_escalation-minutes_escalation-minutes": "Minutes before escalation",
      "setup_tickets_sla_escalation-role_escalation-role": "Role to ping on escalation",
      "setup_tickets_sla_warning-minutes_warning-minutes": "Minutes before SLA warning",
      "setup_tickets_welcome-message_message_message": "Welcome message content",
      "setup_tickets_welcome-message_reset_reset": "Reset to default",
      "setup_welcome_autorole_role_role": "Role to assign on join (leave empty to disable)",
      "setup_welcome_avatar_show_show": "Show the member avatar",
      "setup_welcome_banner_url_url": "Image URL starting with `https://`",
      "setup_welcome_channel_channel_channel": "Welcome channel",
      "setup_welcome_color_hex_hex": "Hex color without `#`",
      "setup_welcome_dm_enabled_enabled": "Whether welcome DMs remain enabled",
      "setup_welcome_dm_message_message": "DM content. Variables: `{mention}` `{user}` `{tag}` `{server}` `{count}` `{id}`",
      "setup_welcome_enabled_enabled_enabled": "Whether welcome messages remain enabled",
      "setup_welcome_footer_text_text": "Footer text",
      "setup_welcome_message_text_text": "Message content",
      "setup_welcome_title_text_text": "Embed title",
      "setup_wizard_admin_admin": "Bot admin role (optional)",
      "setup_wizard_dashboard_dashboard": "Main dashboard and panel channel",
      "setup_wizard_logs_logs": "Log channel (optional)",
      "setup_wizard_plan_plan": "Initial server plan",
      "setup_wizard_publish-panel_publish-panel": "Publish the ticket panel immediately",
      "setup_wizard_sla-escalation-minutes_sla-escalation-minutes": "Base SLA escalation threshold in minutes",
      "setup_wizard_sla-warning-minutes_sla-warning-minutes": "Base SLA warning threshold in minutes",
      "setup_wizard_staff_staff": "Staff role (optional)",
      "setup_wizard_transcripts_transcripts": "Transcript channel (optional)"
    },
    "panel": {
      "action_applied": "Action applied.",
      "admin_only": "Only administrators can use this panel.",
      "default_action_failed": "The action could not be applied.",
      "default_reset_failed": "The reset could not be completed.",
      "error_prefix": "Error: {{message}}",
      "invalid_action": "Invalid action.",
      "invalid_command": "No valid command was selected.",
      "owner_only": "Only the user who opened this panel can use it.",
      "reset_applied": "Reset applied."
    },
    "slash": {
      "choices": {
        "english": "English",
        "spanish": "Spanish"
      },
      "description": "Configure the server operational settings",
      "groups": {
        "automod": {
          "alert_channel": "Alert channel: {{channel}}",
          "alert_not_configured": "Not configured",
          "bootstrap_created": "Created {{count}} TON618 AutoMod rule{{plural}}.",
          "bootstrap_no_new": "No new TON618 AutoMod rules were needed.",
          "choices": {
            "add": "Add",
            "preset_all": "All presets",
            "preset_invites": "Invites",
            "preset_scam": "Scam links",
            "preset_spam": "Spam",
            "remove": "Remove",
            "reset": "Reset"
          },
          "description": "Configure AutoMod rules and exemptions",
          "disable_no_rules": "No TON618-managed AutoMod rules were present.",
          "disable_partial": "Removed {{removed}} rule{{removedPlural}}, preserved {{preserved}} due to errors.",
          "disable_removed": "Removed {{count}} TON618-managed AutoMod rule{{plural}}.",
          "error_max_exempt_channels": "AutoMod only supports up to 50 exempt channels per guild.",
          "error_max_exempt_roles": "AutoMod only supports up to 20 exempt roles per guild.",
          "error_no_active_presets": "No AutoMod presets are active. Re-enable a preset or use `/setup automod disable`.",
          "error_no_presets": "No AutoMod presets are active. Enable at least one preset before bootstrapping.",
          "error_not_enabled": "AutoMod is not enabled for this guild yet. Run `/setup automod bootstrap` first.",
          "error_provide_channel_or_clear": "Provide `channel`, or set `clear: true`.",
          "error_provide_channel_or_reset": "Provide `channel`, or use `action: reset`.",
          "error_provide_role_or_reset": "Provide `role`, or use `action: reset`.",
          "error_unknown_action": "Unknown action. Use add, remove, or reset.",
          "error_unknown_preset": "Unknown preset selection.",
          "exempt_channels": "Exempt channels: {{channels}}",
          "exempt_roles": "Exempt roles: {{roles}}",
          "fetch_error": "Skipped {{action}}: {{message}}",
          "fetch_error_generic": "Could not inspect AutoMod rules.",
          "field_alerts_exemptions": "Alerts and Exemptions",
          "field_managed_rules": "Managed Rules",
          "field_permissions": "Permissions",
          "field_sync_state": "Sync State",
          "hint_bootstrap": "Run `/setup automod bootstrap` when you're ready to create the managed rules.",
          "hint_disable": "Use `/setup automod disable` to remove existing rules, or re-enable a preset before syncing.",
          "hint_sync": "Run `/setup automod sync` to apply this change to Discord.",
          "info_already_exempt_channel": "{{channel}} is already exempt.",
          "info_already_exempt_role": "{{role}} is already exempt.",
          "last_sync": "Last sync: {{timestamp}}",
          "live_count": "Live count: `{{live}}/{{desired}}`",
          "never": "Never",
          "no_presets": "No AutoMod presets selected.",
          "no_sync_recorded": "No sync recorded yet.",
          "none": "None",
          "options": {
            "action": "Action to perform",
            "channel": "Channel to receive AutoMod alerts",
            "clear": "Clear the alert channel",
            "enabled": "Enable or disable this preset",
            "preset_name": "Preset name",
            "target_channel": "Channel to exempt",
            "target_role": "Role to exempt"
          },
          "permission_failure": "Skipped {{action}}: missing {{permissions}}.",
          "permission_failure_generic": "Skipped {{action}}: permission check failed.",
          "permissions_ok": "All required permissions are present",
          "presets_none": "No presets selected",
          "rule_live": "live",
          "rule_missing": "missing",
          "status_disabled": "TON618 AutoMod management is disabled for this guild.",
          "status_enabled": "TON618 AutoMod management is enabled for this guild.",
          "status_title": "AutoMod Status - {{guildName}}",
          "stored_rule_ids": "Stored rule IDs: `{{count}}`",
          "subcommands": {
            "bootstrap": {
              "description": "Create initial AutoMod rules"
            },
            "channel-alert": {
              "description": "Set or clear the AutoMod alert channel"
            },
            "disable": {
              "description": "Remove all managed AutoMod rules"
            },
            "exempt-channel": {
              "description": "Manage exempt channels"
            },
            "exempt-role": {
              "description": "Manage exempt roles"
            },
            "preset": {
              "description": "Enable or disable an AutoMod preset"
            },
            "status": {
              "description": "View AutoMod configuration status"
            },
            "sync": {
              "description": "Sync AutoMod rules with current settings"
            }
          },
          "success_alert_cleared": "AutoMod alert channel cleared.\n{{hint}}",
          "success_alert_set": "AutoMod alert channel set to {{channel}}.\n{{hint}}",
          "success_exempt_channels_updated": "AutoMod exempt channels updated. Total: `{{count}}`.\n{{hint}}",
          "success_exempt_roles_updated": "AutoMod exempt roles updated. Total: `{{count}}`.\n{{hint}}",
          "success_presets_updated": "AutoMod presets updated: {{summary}}.\n{{followUp}}",
          "sync_result": "Result: `{{status}}`",
          "sync_summary": "Summary: {{summary}}",
          "sync_summary_line": "Updated {{updated}} rule{{updatedPlural}}, recreated {{created}} missing rule{{createdPlural}}, removed {{removed}} stale rule{{removedPlural}}."
        },
        "commands": {
          "description": "Manage which commands are available in this server",
          "options": {
            "command_optional": "Command name without `/` (optional)",
            "command_required": "Command name without `/`"
          },
          "subcommands": {
            "disable": {
              "description": "Disable a command in this server"
            },
            "enable": {
              "description": "Re-enable a previously disabled command"
            },
            "list": {
              "description": "List the commands currently disabled in this server"
            },
            "panel": {
              "description": "Open the interactive command control panel"
            },
            "reset": {
              "description": "Re-enable every disabled command"
            },
            "status": {
              "description": "Check one command or view the current summary"
            }
          }
        },
        "goodbye": {
          "description": "Configure goodbye messages",
          "options": {
            "channel": "Goodbye channel",
            "enabled": "Whether goodbye messages remain enabled",
            "footer_text": "Footer text",
            "hex": "Hex color without `#`",
            "show": "Show the member avatar",
            "text": "Message content",
            "title_text": "Embed title"
          },
          "subcommands": {
            "avatar": {
              "description": "Show or hide the departing member avatar"
            },
            "channel": {
              "description": "Set the channel used for goodbye messages"
            },
            "color": {
              "description": "Set the goodbye embed color (hex)"
            },
            "enabled": {
              "description": "Enable or disable goodbye messages"
            },
            "footer": {
              "description": "Update the goodbye embed footer"
            },
            "message": {
              "description": "Update the goodbye message. Variables: {{vars}}"
            },
            "test": {
              "description": "Send a test goodbye message"
            },
            "title": {
              "description": "Update the goodbye embed title"
            }
          }
        },
        "tickets": {
          "choices": {
            "mode_least_active": "Least active",
            "mode_random": "Random",
            "mode_round_robin": "Round robin",
            "sla_escalation": "Escalation",
            "sla_warning": "Warning",
            "style_buttons": "Buttons",
            "style_select": "Select menu"
          },
          "description": "Configure ticket system settings",
          "options": {
            "color": "Embed color (hex)",
            "control_description": "Control embed description",
            "control_footer": "Control embed footer",
            "control_title": "Control embed title",
            "enabled": "Enable or disable",
            "escalation_channel": "Channel for escalation alerts",
            "escalation_enabled": "Enable escalation",
            "escalation_minutes": "Minutes before escalation",
            "escalation_role": "Role to ping on escalation",
            "mode": "Assignment mode",
            "require_online": "Require online status",
            "reset": "Reset to default",
            "rule_minutes": "Minutes threshold",
            "rule_type": "Rule type",
            "style": "Panel style",
            "target_category": "Target category",
            "target_priority": "Target priority",
            "warning_minutes": "Minutes before SLA warning",
            "welcome_message": "Welcome message content"
          },
          "playbook": {
            "apply_macro_description": "Directly apply the suggested macro from a recommendation",
            "catalog_empty": "No playbooks found",
            "confirm_description": "Confirm and apply a suggested recommendation",
            "disable_description": "Disable a specific playbook for this guild",
            "dismiss_description": "Dismiss a suggested recommendation",
            "enable_description": "Enable a specific playbook for this guild",
            "errors": {
              "admin_only": "Only bot admins can enable or disable playbooks.",
              "macro_missing": "The suggested macro was not found in the current workspace.",
              "macro_staff_only": "Only staff can apply suggested macros.",
              "no_macro": "The selected recommendation has no suggested macro.",
              "not_found": "No pending recommendation matches that identifier.",
              "playbook_not_found": "That playbook was not found in the operational catalog.",
              "recommendation_staff_only": "Only staff can manage playbook recommendations.",
              "staff_only": "Only staff can review operational playbooks.",
              "ticket_only": "This command must be used inside a ticket channel.",
              "unknown_subcommand": "Unknown playbook subcommand."
            },
            "event_applied_title": "Suggested macro applied",
            "event_confirmed_title": "Recommendation confirmed from Discord",
            "event_description": "{{user}} marked recommendation {{id}} as {{status}}.",
            "event_dismissed_title": "Recommendation dismissed from Discord",
            "event_macro_description": "{{user}} posted macro {{label}} from an operational recommendation.",
            "field_catalog": "Catalog",
            "field_current_plan": "Current Plan",
            "field_enabled_count": "Enabled",
            "field_enabled_playbooks": "Enabled Playbooks",
            "field_pending_recommendations": "Pending Recommendations",
            "group_description": "Review and manage operational playbooks",
            "list_description": "List all playbooks and active recommendations",
            "list_description_generic": "You can manage playbooks from any channel, but live recommendations only appear when the command is run inside a ticket.",
            "list_title": "Server Operational Playbooks",
            "live_description": "Operational snapshot for the current ticket with recommendations ready to confirm, dismiss, or apply.",
            "live_footer": "Use /ticket playbook confirm, dismiss, or apply-macro to act on them.",
            "live_title": "Live Playbooks - Ticket #{{id}}",
            "macro_internal_note": "Playbook suggested internal note:\n{{content}}",
            "option_playbook": "Playbook ID from the catalog",
            "option_recommendation": "Recommendation ID or Playbook ID",
            "playbooks_empty": "No enabled playbooks",
            "recommendations_empty": "No pending recommendations for this ticket.",
            "success_confirmed": "✅ Recommendation `{{id}}` was confirmed.",
            "success_disabled": "✅ `{{label}}` is now disabled for this guild.",
            "success_dismissed": "✅ Recommendation `{{id}}` was dismissed.",
            "success_enabled": "✅ `{{label}}` is now enabled for this guild.",
            "success_enabled_locked": "✅ `{{label}}` is marked as enabled, but it will stay locked until the guild upgrades from the current plan (`{{plan}}`).",
            "success_macro_applied": "✅ Macro `{{label}}` posted and recommendation applied."
          },
          "subcommands": {
            "auto-assignment": {
              "description": "Configure auto-assignment behavior"
            },
            "control-embed": {
              "description": "Customize the ticket control embed"
            },
            "panel": {
              "description": "Publish or update the ticket panel"
            },
            "panel-style": {
              "description": "Set the ticket panel style"
            },
            "sla": {
              "description": "Configure SLA warning and escalation"
            },
            "sla-rule": {
              "description": "Add or update an SLA rule by priority or category"
            },
            "welcome-message": {
              "description": "Set a custom welcome message for new tickets"
            }
          }
        },
        "welcome": {
          "description": "Configure welcome messages and onboarding prompts",
          "options": {
            "channel": "Welcome channel",
            "dm_enabled": "Whether welcome DMs remain enabled",
            "dm_message": "DM content. Variables: {{vars}}",
            "enabled": "Whether welcome messages remain enabled",
            "footer_text": "Footer text",
            "hex": "Hex color without `#`",
            "role": "Role to assign on join (leave empty to disable)",
            "show": "Show the member avatar",
            "text": "Message content",
            "title_text": "Embed title",
            "url": "Image URL starting with `https://`"
          },
          "subcommands": {
            "autorole": {
              "description": "Set the role assigned automatically on join"
            },
            "avatar": {
              "description": "Show or hide the new member avatar"
            },
            "banner": {
              "description": "Set or clear the welcome banner image"
            },
            "channel": {
              "description": "Set the channel used for welcome messages"
            },
            "color": {
              "description": "Set the welcome embed color (hex)"
            },
            "dm": {
              "description": "Configure the welcome direct message"
            },
            "enabled": {
              "description": "Enable or disable welcome messages"
            },
            "footer": {
              "description": "Update the welcome embed footer"
            },
            "message": {
              "description": "Update the welcome message. Variables: {{vars}}"
            },
            "test": {
              "description": "Send a test welcome message"
            },
            "title": {
              "description": "Update the welcome embed title"
            }
          }
        }
      },
      "options": {
        "language_value": "Language to use for visible bot responses"
      },
      "subcommands": {
        "language": {
          "description": "Review or update the bot language for this server"
        }
      }
    },
    "suggestions": {
      "channel_description": "Set the channel used for suggestions",
      "enabled_description": "Enable or disable suggestions",
      "group_description": "Configure the suggestions system"
    },
    "tickets": {
      "auto_assignment_description": "Configure auto-assignment behavior",
      "choice_mode_least_active": "Least active",
      "choice_mode_random": "Random",
      "choice_mode_round_robin": "Round robin",
      "choice_sla_escalation": "Escalation",
      "choice_sla_warning": "Warning",
      "choice_style_buttons": "Buttons",
      "choice_style_select": "Select menu",
      "control_embed_description": "Customize the ticket control embed",
      "daily_report_description": "Configure daily ticket reports",
      "group_description": "Configure ticket system settings",
      "incident_description": "Enable or disable incident mode",
      "option_active": "Enable or disable",
      "option_categories": "Affected categories (comma-separated IDs)",
      "option_color": "Embed color (hex)",
      "option_control_description": "Control embed description",
      "option_control_footer": "Control embed footer",
      "option_control_title": "Control embed title",
      "option_enabled": "Enable or disable",
      "option_escalation_channel": "Channel for escalation alerts",
      "option_escalation_enabled": "Enable escalation",
      "option_escalation_minutes": "Minutes before escalation",
      "option_escalation_role": "Role to ping on escalation",
      "option_incident_message": "Custom incident message",
      "option_mode": "Assignment mode",
      "option_panel_channel": "Channel to publish the ticket panel (optional, uses configured or current if not set)",
      "option_panel_description": "Panel embed description",
      "option_panel_footer": "Panel embed footer",
      "option_panel_title": "Panel embed title",
      "option_report_channel": "Channel for daily reports",
      "option_require_online": "Require online status",
      "option_reset": "Reset to default",
      "option_respect_away": "Respect away status",
      "option_rule_minutes": "Minutes threshold",
      "option_rule_type": "Rule type",
      "option_style": "Panel style",
      "option_target_category": "Target category",
      "option_target_priority": "Target priority",
      "option_warning_minutes": "Minutes before SLA warning",
      "option_welcome_message": "Welcome message content",
      "panel_description": "Publish or update the ticket panel",
      "panel_style_description": "Set the ticket panel style",
      "sla_description": "Configure SLA warning and escalation",
      "sla_rule_description": "Add or update an SLA rule by priority or category",
      "welcome_message_description": "Set a custom welcome message for new tickets"
    },
    "welcome": {
      "autorole_description": "Set the role assigned automatically on join",
      "autorole_disabled": "Auto role disabled.",
      "autorole_set": "Auto role configured: {{role}}",
      "avatar_description": "Show or hide the new member avatar",
      "avatar_state": "Member avatar in welcome messages: **{{state}}**.",
      "banner_configured": "Welcome banner configured.",
      "banner_description": "Set or clear the welcome banner image",
      "banner_removed": "Welcome banner removed.",
      "channel_description": "Set the channel used for welcome messages",
      "channel_set": "Welcome channel set to {{channel}}.",
      "color_description": "Set the welcome embed color (hex)",
      "color_updated": "Welcome color updated to **#{{hex}}**.",
      "dm_description": "Configure the welcome direct message",
      "dm_message_note": "\nThe DM body was updated as well.",
      "dm_state": "Welcome DM is now **{{state}}**.{{messageNote}}",
      "enabled_description": "Enable or disable welcome messages",
      "enabled_state": "Welcome messages are now **{{state}}**.",
      "footer_description": "Update the welcome embed footer",
      "footer_updated": "Welcome footer updated.",
      "group_description": "Configure welcome messages and onboarding prompts",
      "hidden": "Hidden",
      "invalid_color": "Invalid color. Use a 6 character hex code like `{{example}}`.",
      "invalid_url": "The URL must start with `https://`.",
      "message_description": "Update the welcome message",
      "message_updated": "Welcome message updated.\nAvailable variables: {{vars}}",
      "test_channel_missing": "Configured welcome channel not found.",
      "test_default_message": "Welcome {mention}!",
      "test_default_title": "Welcome!",
      "test_description": "Send a test welcome message",
      "test_field_account_created": "Account created",
      "test_field_member_count": "Member count",
      "test_field_user": "User",
      "test_message_suffix": "*(test message)*",
      "test_requires_channel": "Configure a welcome channel first with `/setup welcome channel`.",
      "test_sent": "Test welcome message sent to {{channel}}.",
      "title_description": "Update the welcome embed title",
      "title_updated": "Welcome title updated to **{{text}}**.",
      "visible": "Visible"
    },
    "wizard": {
      "description": "Start the quick setup wizard",
      "option_admin": "Role for ticket administrators",
      "option_dashboard": "Channel for the ticket dashboard",
      "option_logs": "Channel for ticket logs",
      "option_plan": "System operation plan",
      "option_publish_panel": "Publish the ticket panel immediately",
      "option_sla_escalation": "Minutes before SLA escalation",
      "option_sla_warning": "Minutes before first SLA warning",
      "option_staff": "Role for support staff",
      "option_transcripts": "Channel for ticket transcripts"
    }
  },
  "setup.automod.alert_channel": "Alert channel: {{channel}}",
  "setup.automod.alert_not_configured": "No alert channel configured.",
  "setup.automod.bootstrap_created": "Created {{count}} managed AutoMod rule{{plural}}.",
  "setup.automod.bootstrap_no_new": "No new managed AutoMod rules were created.",
  "setup.automod.disable_no_rules": "There were no managed AutoMod rules to remove.",
  "setup.automod.disable_partial": "Removed {{removed}} rule{{removedPlural}} but preserved {{preserved}} linked rule IDs.",
  "setup.automod.disable_removed": "Removed {{count}} managed AutoMod rule{{plural}}.",
  "setup.automod.error_max_exempt_channels": "You reached the maximum number of exempt channels.",
  "setup.automod.error_max_exempt_roles": "You reached the maximum number of exempt roles.",
  "setup.automod.error_no_active_presets": "There are no active presets to sync.",
  "setup.automod.error_no_presets": "Select at least one preset before running this action.",
  "setup.automod.error_not_enabled": "Enable AutoMod first before syncing managed rules.",
  "setup.automod.error_provide_channel_or_clear": "Provide an alert channel or use `clear` to remove it.",
  "setup.automod.error_provide_channel_or_reset": "Provide a channel or choose reset/clear.",
  "setup.automod.error_provide_role_or_reset": "Provide a role or choose reset/clear.",
  "setup.automod.error_unknown_action": "Unknown AutoMod action.",
  "setup.automod.error_unknown_preset": "Unknown AutoMod preset.",
  "setup.automod.exempt_channels": "Exempt channels: {{channels}}",
  "setup.automod.exempt_roles": "Exempt roles: {{roles}}",
  "setup.automod.fetch_error": "Failed to {{action}} AutoMod state: {{message}}",
  "setup.automod.fetch_error_generic": "Failed to fetch AutoMod state from Discord.",
  "setup.automod.field_alerts_exemptions": "Alerts and Exemptions",
  "setup.automod.field_managed_rules": "Managed Rules",
  "setup.automod.field_permissions": "Permissions",
  "setup.automod.field_sync_state": "Sync State",
  "setup.automod.hint_bootstrap": "Run `/setup automod bootstrap` to create the managed AutoMod rules for the first time.",
  "setup.automod.hint_disable": "Run `/setup automod disable` if you want to remove managed rules from Discord.",
  "setup.automod.hint_sync": "Run `/setup automod sync` to apply the latest preset changes.",
  "setup.automod.info_already_exempt_channel": "{{channel}} is already exempt from AutoMod.",
  "setup.automod.info_already_exempt_role": "{{role}} is already exempt from AutoMod.",
  "setup.automod.last_sync": "Last sync: {{timestamp}}",
  "setup.automod.live_count": "Live managed rules: {{live}} / {{desired}}",
  "setup.automod.never": "Never",
  "setup.automod.no_presets": "No presets selected.",
  "setup.automod.no_sync_recorded": "No sync has been recorded yet.",
  "setup.automod.none": "None",
  "setup.automod.permission_failure": "I cannot {{action}} because I am missing these permissions: {{permissions}}.",
  "setup.automod.permission_failure_generic": "I cannot complete `{{action}}` because required AutoMod permissions are missing.",
  "setup.automod.permissions_ok": "All required permissions are available.",
  "setup.automod.presets_none": "No presets enabled.",
  "setup.automod.rule_live": "Live",
  "setup.automod.rule_missing": "Missing",
  "setup.automod.status_disabled": "Disabled",
  "setup.automod.status_enabled": "Enabled",
  "setup.automod.status_title": "AutoMod Status for {{guildName}}",
  "setup.automod.stored_rule_ids": "Stored rule IDs: {{count}}",
  "setup.automod.success_alert_cleared": "AutoMod alert channel cleared. {{hint}}",
  "setup.automod.success_alert_set": "AutoMod alerts will now be sent to {{channel}}. {{hint}}",
  "setup.automod.success_exempt_channels_updated": "Updated exempt channels. Current total: {{count}}. {{hint}}",
  "setup.automod.success_exempt_roles_updated": "Updated exempt roles. Current total: {{count}}. {{hint}}",
  "setup.automod.success_presets_updated": "AutoMod presets updated: {{summary}} {{followUp}}",
  "setup.automod.sync_result": "Last result: {{status}}",
  "setup.automod.sync_summary": "Summary: {{summary}}",
  "setup.automod.sync_summary_line": "Created {{created}}, updated {{updated}}, removed {{removed}}, unchanged {{unchanged}}.",
  "sla_alerts.category": "Category",
  "sla_alerts.description": "Ticket <#{{channelId}}> **#{{ticketId}}** has been waiting **{{time}}** for a staff reply.",
  "sla_alerts.hours_minutes": "{{hours}}h {{minutes}}m",
  "sla_alerts.minutes_plural": "{{count}} minutes",
  "sla_alerts.sla_limit": "SLA limit",
  "sla_alerts.title": "SLA Warning",
  "sla_alerts.user": "User",
  "sla_escalation.category": "Category",
  "sla_escalation.description": "Ticket <#{{channelId}}> **#{{ticketId}}** exceeded the escalation threshold (**{{limit}} min**) without a staff reply.",
  "sla_escalation.title": "SLA Escalated",
  "sla_escalation.user": "User",
  "smart_ping.category": "Category",
  "smart_ping.description": "This ticket has been waiting more than **{{time}}** for a staff reply.",
  "smart_ping.hours_plural": "{{count}} hours",
  "smart_ping.title": "Smart Ping",
  "smart_ping.user": "User",
  "staff": {
    "away_off": "You are now marked as active and available for ticket assignments.",
    "away_on_description": "You are now marked as away.{{reasonText}}",
    "away_on_footer": "You will not receive new ticket assignments while away.",
    "away_on_title": "Away Status Set",
    "moderation_required": "You do not have sufficient permissions to manage member warnings.",
    "my_tickets_empty": "You have no open tickets assigned or claimed.",
    "my_tickets_title": "My Tickets ({{count}})",
    "only_staff": "This command is restricted to staff members.",
    "ownership_assigned": "Assigned",
    "ownership_claimed": "Claimed",
    "ownership_watching": "Watching",
    "slash": {
      "description": "Staff-exclusive management and moderation utilities",
      "options": {
        "reason": "Note explaining your away status",
        "user": "The member to inspect or warn",
        "warn_reason": "Description of the infraction",
        "warning_id": "The 6-character warning ID"
      },
      "subcommands": {
        "away_off": {
          "description": "Clear your away status and become active again"
        },
        "away_on": {
          "description": "Mark yourself as away with an optional reason"
        },
        "my_tickets": {
          "description": "Review your currently claimed and assigned tickets"
        },
        "warn_add": {
          "description": "Apply a formal warning to a member"
        },
        "warn_check": {
          "description": "Review a member's warning history"
        },
        "warn_remove": {
          "description": "Remove a specific warning by its unique ID"
        }
      }
    },
    "staff_no_data_description": "No statistics found for <@{{userId}}>.",
    "staff_no_data_title": "No Staff Data"
  },
  "staff.away_off": "Away status cleared. You are active again.",
  "staff.away_on_description": "You are now marked as away.{{reasonText}}",
  "staff.away_on_footer": "Remember to disable away mode when you return.",
  "staff.away_on_title": "Away status enabled",
  "staff.my_tickets_empty": "You do not have any claimed or assigned tickets right now.",
  "staff.my_tickets_title": "Your Tickets ({{count}})",
  "staff.only_staff": "Only staff members can use this command.",
  "staff.ownership_assigned": "Assigned to you",
  "staff.ownership_claimed": "Claimed by you",
  "staff.ownership_watching": "Watching",
  "staff_rating": {
    "average": "⭐ Average",
    "distribution": "📈 Distribution",
    "leaderboard_title": "🏆 Staff Leaderboard — Ratings",
    "max": "🎯 Maximum possible",
    "no_ratings": "No ratings registered yet.\n\nRatings appear when users rate closed tickets.",
    "no_ratings_profile": "This staff member doesn't have any registered ratings yet.",
    "profile_title": "📊 {{username}}'s Ratings",
    "star_empty": "☆ empty",
    "star_full": "⭐ full star",
    "star_half": "✨ half",
    "total_ratings": "📊 Total ratings",
    "trend_average": "⚠️ Regular",
    "trend_excellent": "🔥 Excellent",
    "trend_good": "✅ Good",
    "trend_needs_improve": "❌ Needs improvement"
  },
  "stats": {
    "assigned_tickets": "Assigned Tickets",
    "average_rating": "Average Rating",
    "average_score": "Average Score",
    "avg_close": "Avg Resolution Time",
    "avg_first_response": "Avg First Response",
    "avg_rating": "Average Rating",
    "avg_response": "Avg First Response",
    "claimed_tickets": "Claimed Tickets",
    "closed": "Closed",
    "closed_tickets": "Closed Tickets",
    "escalation": "Escalation Status",
    "escalation_overrides": "Escalation Rules",
    "escalation_threshold": "Escalation Threshold",
    "fallback_staff": "Staff #{{suffix}}",
    "fallback_user": "User #{{suffix}}",
    "leaderboard_claimed": "claimed",
    "leaderboard_closed": "closed",
    "leaderboard_empty": "No staff activity recorded yet.",
    "leaderboard_title": "Staff Performance Board",
    "no_data": "N/A",
    "no_ratings_yet": "No ratings yet",
    "no_sla_threshold": "No threshold set",
    "not_configured": "Not configured",
    "open": "Open",
    "open_escalated": "Currently Escalated",
    "open_out_of_sla": "Open (Breached)",
    "opened": "Opened",
    "period_all": "All time",
    "period_month": "Last month",
    "period_week": "Last week",
    "pro_consistent": "Consistent",
    "pro_efficiency": "Resolution Efficiency",
    "pro_metrics_title": "Pro Performance Intelligence",
    "pro_needs_focus": "Needs Focus",
    "pro_rating_quality": "Service Quality",
    "pro_top_performer": "Top Performer",
    "ratings_count": "{{count}} ratings",
    "ratings_empty": "No ratings available.",
    "ratings_title": "Staff Satisfaction Ratings",
    "server_title": "Server Statistics: {{guild}}",
    "sla_compliance": "SLA Compliance Rate",
    "sla_description": "Advanced metrics for response times and escalation management.",
    "sla_overrides": "SLA Priority Rules",
    "sla_threshold": "SLA Threshold",
    "sla_title": "SLA Compliance Panel: {{guild}}",
    "slash": {
      "description": "High-fidelity ticket metrics and performance analysis",
      "subcommands": {
        "leaderboard": {
          "description": "Rank active staff by productivity and claim speed"
        },
        "ratings": {
          "description": "Staff satisfaction trends based on user feedback"
        },
        "server": {
          "description": "Operational overview of ticket totals and response trends"
        },
        "sla": {
          "description": "Compliance report: first-response time and escalation density"
        },
        "staff": {
          "description": "Deep analysis of individual output and resolution efficiency"
        },
        "staff_rating": {
          "description": "Visual rating profile for a specific staff member"
        }
      }
    },
    "staff_rating_empty": "This staff member has not received any ratings yet.",
    "staff_rating_title": "Rating Density: {{user}}",
    "staff_title": "Staff Profile: {{user}}",
    "tickets_evaluated": "Tickets Evaluated",
    "today": "Activity Today",
    "total": "Total Tickets",
    "total_ratings": "Total Ratings",
    "week": "Activity This Week"
  },
  "stats.staff_no_data_description": "This staff member does not have enough activity to build a profile yet.",
  "stats.staff_no_data_title": "No staff data yet",
  "status": {
    "commercial": "Commercial"
  },
  "suggest": {
    "audit": {
      "approved": "Approved",
      "rejected": "Rejected",
      "status_updated": "Status updated",
      "thread_reason": "Thread reason"
    },
    "buttons": {
      "approve": "✅ Approve",
      "reject": "Reject",
      "staff_note": "Add Note (Pro)",
      "vote_down": "👎 Against",
      "vote_up": "👍 Support"
    },
    "cooldown": {
      "description": "You must wait **{{minutes}} minutes** before sending another suggestion.",
      "title": "⏱️ Cooldown Active"
    },
    "dm": {
      "description": "Your suggestion **#{{num}}** in **{{guildName}}** was reviewed.",
      "field_suggestion": "📝 Your suggestion",
      "title_approved": "✅ Your suggestion was Approved",
      "title_rejected": "❌ Your suggestion was Rejected"
    },
    "embed": {
      "author_anonymous": "Anonymous",
      "debate_footer": "Keep it respectful",
      "debate_title": "Discussion: Suggestion #{{num}}",
      "field_author": "👤 Author",
      "field_staff_comment": "💬 Staff comment",
      "field_staff_note": "💬 Staff Note",
      "field_status": "📝 Status",
      "field_submitted": "📅 Submitted",
      "field_votes": "👍 {{up}}  •  👎 {{down}}  •  {{pct}}% approval",
      "footer_reviewed": "Reviewed by {{reviewer}} • {{status}}",
      "footer_status": "Status: {{status}}",
      "no_description": "> (No description)",
      "title": "{{emoji}} Suggestion #{{num}}"
    },
    "emoji": {
      "approved": "✅",
      "pending": "⏳",
      "rejected": "❌"
    },
    "errors": {
      "already_reviewed": "This suggestion has already been reviewed.",
      "already_status": "❌ This suggestion was already {{status}}.",
      "channel_not_configured": "The suggestions channel was not found.",
      "interaction_error": "❌ Invalid interaction.",
      "invalid_data": "Provide at least a title or description.",
      "manage_messages_required": "❌ You need 'Manage Messages' permission to review suggestions.",
      "not_exists": "❌ This suggestion no longer exists.",
      "pro_required": "Suggest notes require **TON618 Pro**.",
      "processing_error": "❌ Error processing suggestion.",
      "system_disabled": "The suggestion system is not enabled on this server.",
      "vote_error": "❌ Error registering your vote."
    },
    "modal": {
      "field_description_label": "Description",
      "field_description_placeholder": "Explain your idea...",
      "field_title_label": "Title",
      "field_title_placeholder": "e.g., Add a music channel",
      "title": "💡 New Suggestion"
    },
    "placeholder": "⏳ Creating suggestion...",
    "slash": {
      "description": "💡 Send a suggestion for the server"
    },
    "status": {
      "approved": "✅ Approved",
      "pending": "⏳ Pending",
      "rejected": "❌ Rejected"
    },
    "success": {
      "auto_thread_created": "Discussion thread created automatically.",
      "staff_note_updated": "Staff note updated for suggestion #{{num}}.",
      "status_updated": "✅ Suggestion **#{{num}}** marked as **{{status}}**.",
      "submitted_description": "Your suggestion **#{{num}}** has been published in {{channel}}.",
      "submitted_footer": "Thank you for your feedback!",
      "submitted_title": "✅ Suggestion Submitted",
      "vote_registered": "✅ Vote registered. ({{emoji}})"
    }
  },
  "support_server.restricted": "This command is only available in the official support server.",
  "ticket": {
    "categories": {
      "support": {
        "label": "Support",
        "description": "Technical issues and general questions"
      },
      "billing": {
        "label": "Billing",
        "description": "Payments, subscriptions and account issues"
      },
      "report": {
        "label": "Report",
        "description": "Report users, content or behavior"
      },
      "partnership": {
        "label": "Partnership",
        "description": "Collaboration and partnership proposals"
      },
      "staff": {
        "label": "Staff",
        "description": "Apply to the server team"
      },
      "bug": {
        "label": "Bug Report",
        "description": "Report bugs or technical issues"
      },
      "other": {
        "label": "Other",
        "description": "Any other inquiry"
      }
    },
    "auto_reply": {
      "footer": "â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nâš¡ **Ultra-Fast Priority** (0.4s) | ðŸ’ª [Be a hero, support the project](https://ton618.com/pro)",
      "footer_free": "â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nðŸŽ« Ticket system powered by TON618",
      "prefix": "ðŸ›¡ï¸ **TON618 PRO** | `Verified Support` â€” *\"{{trigger}}\"*",
      "priority_badge": "ðŸš¨ **[URGENT PRIORITY DETECTED]**",
      "priority_note": "âš ï¸ **Intelligence Note:** Manual review is being fast-tracked due to the critical nature of this ticket.",
      "pro_badge": "ðŸ›¡ï¸ PRO VERIFIED SUPPORT",
      "pro_footer_small": "Powered by TON618 Pro â€” Support excellence.",
      "sentiment_angry": "ðŸ˜¡ Angry / Critical Urgency",
      "sentiment_calm": "ðŸ˜Š Calm (Standard)",
      "sentiment_label": "🎭 User Sentiment",
      "suggestion_label": "ðŸ’¡ Pro Suggestion",
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
      ]
    },
    "buttons": {
      "claim": "Claim",
      "claimed": "Claimed",
      "close": "Close",
      "reopen": "Reopen",
      "transcript": "Transcript"
    },
    "close_button": {
      "already_closed": "This ticket is already closed.",
      "auto_close_failed": "I could not close the ticket automatically. Please try again or notify an administrator.",
      "bot_member_missing": "I could not verify my permissions in this server.",
      "close_note_event_description": "{{userTag}} added an internal close note before closing ticket #{{ticketId}}.",
      "close_note_event_title": "Close note added",
      "missing_manage_channels": "I need the `Manage Channels` permission to close tickets.",
      "modal_error": "There was an error while processing the ticket closure. Please try again later.",
      "modal_title": "Close ticket #{{ticketId}}",
      "notes_label": "Internal notes",
      "notes_placeholder": "Extra staff-only notes...",
      "open_form_error": "There was an error while opening the close form. Please try again.",
      "permission_denied_description": "Only staff can close tickets.",
      "permission_denied_title": "Permission denied",
      "processing_description": "Starting the close workflow and transcript generation...",
      "processing_title": "Processing closure",
      "reason_label": "Closing reason",
      "reason_placeholder": "Example: resolved, duplicate, request completed..."
    },
    "command": {
      "channel_renamed": "Channel renamed to **{{name}}**",
      "closed_priority_denied": "You cannot change the priority of a closed ticket.",
      "history_empty": "<@{{userId}}> has no tickets in this server.",
      "history_open_now": "Open now",
      "history_recently_closed": "Recently closed",
      "history_summary": "Summary",
      "history_summary_value": "Total: **{{total}}** | Open: **{{open}}** | Closed: **{{closed}}**",
      "history_title": "Ticket history for {{user}}",
      "move_select_description": "Select the category you want to move this ticket to:",
      "move_select_placeholder": "Select the new category...",
      "no_other_categories": "No other categories are available.",
      "no_rating": "No rating",
      "not_ticket_channel": "This is not a ticket channel.",
      "note_added_event_description": "{{userTag}} added an internal note to ticket #{{ticketId}}.",
      "note_added_footer": "By {{userTag}} Â· {{count}}/{{max}}",
      "note_added_title": "Internal note added",
      "note_limit_reached": "Ticket note limit reached (**{{max}}** notes max per ticket). Use `/ticket note clear` if you need to clean them up.",
      "notes_cleared": "All ticket notes were cleared.",
      "notes_cleared_event_description": "{{userTag}} cleared the internal notes for ticket #{{ticketId}}.",
      "notes_empty": "There are no notes on this ticket yet.",
      "notes_list_title": "Ticket notes â€” #{{ticketId}} ({{count}}/{{max}})",
      "notes_title": "Ticket notes",
      "only_admin_clear_notes": "Only administrators can clear all ticket notes.",
      "only_staff_add": "Only staff can add users to the ticket.",
      "only_staff_assign": "Only staff can assign tickets.",
      "only_staff_brief": "Only staff can view the case brief.",
      "only_staff_claim": "Only staff can claim tickets.",
      "only_staff_close": "Only staff can close tickets.",
      "only_staff_info": "Only staff can view ticket details.",
      "only_staff_move": "Only staff can move tickets.",
      "only_staff_notes": "Only staff can view or add notes.",
      "only_staff_other_history": "Only staff can view another user's ticket history.",
      "only_staff_priority": "Only staff can change ticket priority.",
      "only_staff_remove": "Only staff can remove users from the ticket.",
      "only_staff_rename": "Only staff can rename tickets.",
      "only_staff_reopen": "Only staff can reopen tickets.",
      "only_staff_transcript": "Only staff can generate transcripts.",
      "priority_event_description": "{{userTag}} changed ticket #{{ticketId}} priority to {{label}}.",
      "priority_event_title": "Priority updated",
      "priority_updated": "Priority updated to **{{label}}**",
      "release_denied": "You do not have permission to release this ticket.",
      "rename_event_description": "{{userTag}} renamed ticket #{{ticketId}} to {{name}}.",
      "rename_event_title": "Channel renamed",
      "transcript_failed": "Failed to generate the transcript.",
      "transcript_generated": "Transcript generated.",
      "unknown_subcommand": "Unknown ticket subcommand.",
      "valid_channel_name": "Provide a valid channel name."
    },
    "create_errors": {
      "duplicate_number": "There was an internal conflict while numbering the ticket. Please try again.",
      "generic": "There was an error while creating the ticket. Verify my permissions or contact an administrator.",
      "missing_permissions": "I do not have enough permissions to create or prepare the ticket channel.",
      "reserve_number": "I could not reserve an internal ticket number. Please try again in a few seconds."
    },
    "create_flow": {
      "auto_escalation_applied": "Pro: Smart Escalation applied (Priority: Urgent)",
      "blacklisted": "You are blacklisted.\n**Reason:** {{reason}}",
      "category_not_found": "Category not found.",
      "control_panel_failed": "The control panel could not be sent.",
      "cooldown": "Please wait **{{minutes}} minute(s)** before opening another ticket.",
      "created_success_description": "Your ticket has been created: <#{{channelId}}> | **#{{ticketId}}**\n\nPlease go to the channel to continue your request.{{warningText}}",
      "created_success_title": "Ticket created successfully",
      "dm_created_description": "Your ticket **#{{ticketId}}** has been created in **{{guild}}**.\nChannel: <#{{channelId}}>\n\nWe will let you know when the staff replies.",
      "dm_created_title": "Ticket created",
      "duplicate_request": "A ticket creation request is already being processed for you. Please wait a few seconds.",
      "general_category": "General",
      "global_limit": "This server reached the global limit of **{{limit}}** open tickets. Please wait until space is available.",
      "invalid_form": "The form is not valid. Please expand the first answer.",
      "min_days_required": "You must be in the server for at least **{{days}} day(s)** to open a ticket.",
      "missing_permissions": "I do not have the permissions required to create tickets.\n\nRequired permissions: Manage Channels, View Channel, Send Messages, Manage Roles.",
      "pending_ratings_description": "You have **{{count}}** closed ticket(s) waiting for a rating:\n\n{{tickets}}\n\n**Why does rating matter?**\nYour feedback helps us improve the service and is required before opening new tickets.\n\n**Check your DMs** to find the pending rating prompts.\nIf you cannot find them, use the button below to resend them.",
      "pending_ratings_footer": "TON618 Tickets - Rating system",
      "pending_ratings_title": "Pending ticket ratings",
      "question_fallback": "Question {{index}}",
      "resend_ratings_button": "Resend rating prompts",
      "self_permissions_error": "I could not verify my permissions in this server.",
      "submitted_form": "Submitted form",
      "system_not_configured_description": "The ticket system is not configured correctly.\n\n**Problem:** there are no ticket categories configured.\n\n**Fix:** an administrator must create categories with:\n`/config category add`\n\nContact the server administration team to resolve this issue.",
      "system_not_configured_footer": "TON618 Tickets - Configuration error",
      "system_not_configured_title": "Ticket system not configured",
      "user_limit": "You already have **{{openCount}}/{{maxPerUser}}** open tickets{{suffix}}",
      "verify_role_required": "You need the role <@&{{roleId}}> to open tickets.",
      "welcome_message_failed": "The welcome message could not be sent."
    },
    "defaults": {
      "control_panel_description": "This is the control panel for ticket **{ticket}**.\nUse the controls below to manage this ticket.",
      "control_panel_footer": "{guild} â€¢ TON618 Tickets",
      "control_panel_title": "Ticket Control Panel",
      "public_panel_description": "Open a private ticket by selecting the category that best fits your request.",
      "public_panel_footer": "{guild} â€¢ Professional support",
      "public_panel_title": "Need help? We're here for you.",
      "welcome_message": "Hi {user}, your ticket **{ticket}** has been created. Please share as much detail as possible."
    },
    "error_label": "Error",
    "events": {
      "assigned_dashboard": "Ticket assigned from dashboard",
      "assigned_dashboard_desc": "{{actor}} assigned themselves ticket #{{id}}.",
      "claimed": "Ticket claimed",
      "claimed_dashboard": "Ticket claimed from dashboard",
      "claimed_dashboard_desc": "{{actor}} claimed ticket #{{id}} from the dashboard.",
      "claimed_desc": "{{actor}} took this ticket from the dashboard.",
      "closed": "Ticket closed",
      "closed_dashboard": "Ticket closed from dashboard",
      "closed_dashboard_desc": "{{actor}} closed ticket #{{id}} from the dashboard.",
      "closed_desc": "{{actor}} closed this ticket from the dashboard.\nReason: {{reason}}",
      "footer_bridge": "TON618 Â· Operational Inbox",
      "internal_note": "Internal note added",
      "internal_note_desc": "{{actor}} added an internal note from the dashboard.",
      "macro_sent": "Macro sent",
      "macro_sent_desc": "{{actor}} sent macro {{macro}} from the dashboard.",
      "no_details": "No additional details.",
      "priority_updated": "Priority updated",
      "priority_updated_desc": "{{actor}} changed ticket #{{id}} priority to {{priority}}.",
      "recommendation_confirmed": "Recommendation confirmed",
      "recommendation_confirmed_desc": "{{actor}} confirmed an operational recommendation from the dashboard.",
      "recommendation_discarded": "Recommendation discarded",
      "recommendation_discarded_desc": "{{actor}} discarded an operational recommendation from the dashboard.",
      "released_dashboard": "Ticket released from dashboard",
      "released_dashboard_desc": "{{actor}} released ticket #{{id}} from the dashboard.",
      "reopened": "Ticket reopened",
      "reopened_dashboard": "Ticket reopened from dashboard",
      "reopened_dashboard_desc": "{{actor}} reopened ticket #{{id}} from the dashboard.",
      "reopened_desc": "{{actor}} reopened this ticket from the dashboard.",
      "reply_sent": "Reply sent",
      "reply_sent_desc": "{{actor}} replied to the customer from the dashboard.",
      "reply_sent_title": "Reply from the dashboard",
      "status_attending": "Attending",
      "status_searching": "Searching Staff",
      "status_updated": "Operational status updated",
      "status_updated_desc": "{{actor}} changed ticket #{{id}} status to {{status}}.",
      "tag_added": "Tag added",
      "tag_added_desc": "{{actor}} added tag {{tag}} from the dashboard.",
      "tag_removed": "Tag removed",
      "tag_removed_desc": "{{actor}} removed tag {{tag}} from the dashboard.",
      "unassigned": "Assignment removed",
      "unassigned_desc": "{{actor}} removed the assignment for ticket #{{id}}."
    },
    "faq": {
      "description": "Here are the most common answers people need before opening a ticket. A quick check here can save you waiting time.",
      "footer": "Still need help? Pick a category from the dropdown menu to open a ticket.",
      "load_failed": "We could not load the FAQ right now. Please try again later.",
      "q1_answer": "Go to our official store, or open a ticket in the **Sales** category if you need step-by-step help.",
      "q1_question": "How do I buy a product or membership?",
      "q2_answer": "Open a **Support / Billing** ticket and include your payment receipt plus transaction ID so the team can review it.",
      "q2_question": "How do I request a refund?",
      "q3_answer": "For a valid report, include clear screenshots or videos and explain the situation in a **Reports** ticket.",
      "q3_question": "I want to report a user",
      "q4_answer": "Partnership requests are handled through **Partnership** tickets. Make sure you meet the minimum requirements first.",
      "q4_question": "I want to apply for a partnership",
      "title": "Frequently Asked Questions"
    },
    "field_assigned_to": "Assigned to",
    "field_category": "Category",
    "field_priority": "Priority",
    "footer": "TON618 Tickets",
    "labels": {
      "assigned": "Assigned",
      "category": "Category",
      "claimed": "Claimed",
      "priority": "Priority",
      "status": "Status"
    },
    "lifecycle": {
      "assign": {
        "assign_permissions_error": "There was an error while granting permissions to the assigned staff member: {{error}}",
        "bot_denied": "You cannot assign the ticket to a bot.",
        "closed_ticket": "You cannot assign a closed ticket.",
        "creator_denied": "You cannot assign the ticket to the user who created it.",
        "database_error": "There was an error while updating the ticket in the database.",
        "dm_description": "Ticket **#{{ticketId}}** in **{{guild}}** was assigned to you.\n\n**{{categoryLabel}}:** {{category}}\n**User:** <@{{userId}}>\n**Channel:** [Go to ticket]({{channelLink}})\n\nPlease review it as soon as possible.",
        "dm_line": "\n\nThe staff member was notified by DM.",
        "dm_title": "Ticket assigned",
        "dm_warning": "The staff member could not be notified by DM (DMs disabled).",
        "event_description": "{{userTag}} assigned ticket #{{ticketId}} to {{staffTag}}.",
        "invalid_assignee": "You can only assign the ticket to staff members (support role or administrator).",
        "log_assigned_by": "Assigned by",
        "log_assigned_to": "Assigned to",
        "manage_channels_required": "I need the `Manage Channels` permission to assign tickets.",
        "result_description": "Ticket **#{{ticketId}}** was assigned to <@{{staffId}}>.{{dmLine}}{{warningLine}}",
        "result_title": "Ticket assigned",
        "staff_member_missing": "I could not find that staff member in this server.",
        "staff_only": "Only staff can assign tickets.",
        "verify_permissions": "I could not verify my permissions in this server."
      },
      "claim": {
        "already_claimed_other": "Already claimed by <@{{userId}}>. Use `/ticket unclaim` first.",
        "already_claimed_self": "You already claimed this ticket.",
        "claimed_during_request": "This ticket was claimed by <@{{userId}}> while your request was being processed.",
        "closed_ticket": "You cannot claim a closed ticket.",
        "database_error": "There was an error while updating the ticket in the database. Please try again.",
        "dm_description": "Your ticket **#{{ticketId}}** in **{{guild}}** now has an assigned staff member.\n\n**Assigned staff:** {{staff}}\n**{{categoryLabel}}:** {{category}}\n**Channel:** [Go to ticket]({{channelLink}})\n\nUse the link above to jump directly into your ticket and continue the conversation.",
        "dm_line": "\n\nThe user was notified by DM.",
        "dm_title": "Your ticket is being handled",
        "event_description": "{{userTag}} claimed ticket #{{ticketId}}.",
        "log_claimed_by": "Claimed by",
        "manage_channels_required": "I need the `Manage Channels` permission to claim this ticket.",
        "result_description": "You claimed ticket **#{{ticketId}}** successfully.{{dmLine}}{{warningBlock}}",
        "result_title": "Ticket claimed",
        "staff_only": "Only staff can claim tickets.",
        "verify_permissions": "I could not verify my permissions in this server.",
        "warning_dm": "The user could not be notified by DM (DMs disabled).",
        "warning_permissions": "Your permissions could not be fully updated."
      },
      "close": {
        "already_closed": "This ticket is already closed.",
        "already_closed_during_request": "This ticket was already closed while your request was being processed.",
        "database_error": "There was an error while closing the ticket in the database. Please try again.",
        "delete_reason": "Ticket closed",
        "dm_field_category": "Category",
        "dm_field_closed": "Closed at",
        "dm_field_duration": "Total duration",
        "dm_field_handled_by": "Handled by",
        "dm_field_messages": "Messages",
        "dm_field_opened": "Opened at",
        "dm_field_reason": "Closing reason",
        "dm_field_ticket": "Ticket",
        "dm_field_transcript": "Online transcript",
        "dm_footer": "Thanks for trusting our support - TON618 Tickets",
        "dm_no_reason": "No reason provided",
        "dm_receipt_description": "Thanks for contacting our support team. Here is a summary of your ticket.",
        "dm_receipt_title": "Support receipt",
        "dm_transcript_link": "View full transcript",
        "dm_warning_description": "The closing DM could not be sent to <@{{userId}}>.\n\n**Possible cause:** the user has DMs disabled or blocked the bot.\n\n**Ticket:** #{{ticketId}}",
        "dm_warning_title": "Warning: DM not delivered",
        "dm_warning_transcript": "Transcript available",
        "dm_warning_unavailable": "Not available",
        "event_description": "{{userTag}} closed ticket #{{ticketId}}.",
        "event_title": "Ticket closed",
        "log_duration": "Duration",
        "log_reason": "Reason",
        "log_transcript": "Transcript",
        "log_unavailable": "Not available",
        "log_user": "User",
        "manage_channels_required": "I need the `Manage Channels` permission to close this ticket.",
        "result_closed_description": "The ticket was closed, but the channel will remain available until the transcript can be archived safely.",
        "result_closed_title": "Ticket closed",
        "result_closing_description": "This ticket will be deleted in **{{seconds}} seconds**.\n\n{{dmStatus}}",
        "result_closing_title": "Closing ticket",
        "result_dm_failed": "The user could not be notified by DM.",
        "result_dm_sent": "A summary was sent to the user by direct message.",
        "transcript_channel_missing": "No transcript channel is configured. The channel will remain closed and will not be deleted automatically.",
        "transcript_channel_unavailable": "The configured transcript channel does not exist or is not accessible. The channel will not be deleted automatically.",
        "transcript_closed_unavailable": "Not available",
        "transcript_closed_unknown": "Unknown",
        "transcript_embed_title": "Ticket transcript",
        "transcript_field_closed": "Closed",
        "transcript_field_duration": "Duration",
        "transcript_field_messages": "Messages",
        "transcript_field_rating": "Rating",
        "transcript_field_staff": "Staff",
        "transcript_field_user": "User",
        "transcript_generate_error": "There was an error generating the transcript. The channel will remain closed to prevent history loss.",
        "transcript_generate_failed": "The transcript could not be generated. The channel will remain closed to prevent history loss.",
        "transcript_rating_none": "No rating",
        "transcript_send_failed": "The transcript could not be sent to the configured channel. The channel will not be deleted automatically.",
        "verify_permissions": "I could not verify my permissions in this server.",
        "warning_channel_not_deleted": "The channel will not be deleted automatically until the transcript is archived safely.",
        "warning_dm_failed": "The user could not be notified by DM."
      },
      "members": {
        "add": {
          "bot_denied": "You cannot add bots to the ticket.",
          "closed_ticket": "You cannot add users to a closed ticket.",
          "creator_denied": "That user already owns this ticket.",
          "event_description": "{{userTag}} added {{targetTag}} to ticket #{{ticketId}}.",
          "event_title": "User added",
          "manage_channels_required": "I need the `Manage Channels` permission to add users.",
          "permissions_error": "There was an error while granting permissions to the user: {{error}}",
          "result_description": "<@{{userId}}> was added to the ticket and can now see the channel.",
          "result_title": "User added",
          "verify_permissions": "I could not verify my permissions in this server."
        },
        "move": {
          "already_in_category": "This ticket is already in that category.",
          "category_not_found": "Category not found.",
          "closed_ticket": "You cannot move a closed ticket.",
          "database_error": "There was an error while updating the ticket category in the database.",
          "event_description": "{{userTag}} moved ticket #{{ticketId}} from {{from}} to {{to}}.",
          "event_title": "Category updated",
          "log_new": "New",
          "log_previous": "Previous",
          "log_priority": "Updated priority",
          "manage_channels_required": "I need the `Manage Channels` permission to move tickets.",
          "result_description": "Ticket moved from **{{from}}** -> **{{to}}**\n\n**New priority:** {{priority}}",
          "result_title": "Category changed",
          "verify_permissions": "I could not verify my permissions in this server."
        },
        "remove": {
          "admin_role_denied": "You cannot remove the admin role from the ticket.",
          "bot_denied": "You cannot remove the bot from the ticket.",
          "closed_ticket": "You cannot remove users from a closed ticket.",
          "creator_denied": "You cannot remove the ticket creator.",
          "event_description": "{{userTag}} removed {{targetTag}} from ticket #{{ticketId}}.",
          "event_title": "User removed",
          "manage_channels_required": "I need the `Manage Channels` permission to remove users.",
          "permissions_error": "There was an error while removing permissions from the user: {{error}}",
          "result_description": "<@{{userId}}> was removed from the ticket and can no longer view it.",
          "result_title": "User removed",
          "support_role_denied": "You cannot remove the support role from the ticket.",
          "verify_permissions": "I could not verify my permissions in this server."
        }
      },
      "reopen": {
        "already_open": "This ticket is already open.",
        "database_error": "There was an error while reopening the ticket in the database.",
        "dm_description": "Your ticket **#{{ticketId}}** in **{{guild}}** was reopened by {{staff}}.\n\n**Channel:** [Go to ticket]({{channelLink}})\n\nYou can go back to the channel and continue the conversation.",
        "dm_line": "\nThe user was notified by DM.",
        "dm_title": "Ticket reopened",
        "dm_warning": "The user could not be notified by DM (DMs may be disabled).",
        "manage_channels_required": "I need the `Manage Channels` permission to reopen this ticket.",
        "reopened_during_request": "This ticket was already reopened while your request was being processed.",
        "result_description": "Ticket **#{{ticketId}}** was reopened successfully.\n\n**Total reopens:** {{count}}{{dmLine}}{{warningLine}}",
        "log_reopened_by": "Reopened by",
        "log_reopens": "Total reopens",
        "result_title": "Ticket reopened",
        "user_missing": "I could not find the user who created this ticket.",
        "verify_permissions": "I could not verify my permissions in this server.",
        "warning_line": "\n\nWarning: {{warning}}"
      },
      "unclaim": {
        "closed_ticket": "You cannot release a closed ticket.",
        "database_error": "There was an error while updating the ticket in the database.",
        "denied": "Only the user who claimed the ticket or an administrator can release it.",
        "event_description": "{{userTag}} released ticket #{{ticketId}}.",
        "log_previous_claimer": "Previously claimed by",
        "log_released_by": "Released by",
        "not_claimed": "This ticket is not claimed.",
        "result_description": "The ticket has been released. Any staff member can claim it now.{{warningLine}}",
        "result_title": "Ticket released",
        "warning_permissions": "Some permissions could not be restored completely."
      }
    },
    "maintenance": {
      "description": "The ticket system is temporarily disabled.\n\n**Reason:** {{reason}}\n\nPlease come back later.",
      "scheduled": "Scheduled maintenance",
      "title": "System under maintenance"
    },
    "modal": {
      "category_unavailable": "This ticket category is no longer available. Please start again.",
      "default_question": "How can we help you?",
      "first_answer_short": "Your first answer is too short. Add more context before creating the ticket.",
      "placeholder_answer": "Type your answer here...",
      "placeholder_detailed": "Describe your issue with as much detail as possible..."
    },
    "questions": {
      "billing": {
        "0": "What is the billing issue?",
        "1": "What is your transaction or invoice ID?",
        "2": "Which payment method did you use?"
      },
      "bug": {
        "0": "What went wrong?",
        "1": "How can we reproduce it?",
        "2": "Which device, browser, or platform are you using?"
      },
      "other": {
        "0": "How can we help you today?"
      },
      "partnership": {
        "0": "What is your server or project about?",
        "1": "How large is your community?",
        "2": "What kind of partnership are you proposing?"
      },
      "report": {
        "0": "Who are you reporting?",
        "1": "What happened?",
        "2": "Do you have evidence to share?"
      },
      "staff": {
        "0": "What is your age and moderation/support experience?",
        "1": "Why do you want to join the team?",
        "2": "How many hours per week are you available?",
        "3": "What is your timezone?"
      },
      "support": {
        "0": "What problem are you facing?",
        "1": "When did it start happening?",
        "2": "What have you tried so far?"
      }
    },
    "move_select": {
      "move_failed": "I could not move the ticket right now. Please try again later."
    },
    "options": {
      "ticket_add_user_user": "User to add to the ticket",
      "ticket_assign_staff_staff": "Staff member who will own the ticket",
      "ticket_close_reason_reason": "Reason for closing the ticket",
      "ticket_history_user_user": "Member whose history you want to inspect",
      "ticket_note_add_note_note": "Internal note content",
      "ticket_playbook_apply-macro_recommendation_recommendation": "Recommendation ID",
      "ticket_playbook_confirm_recommendation_recommendation": "Recommendation ID",
      "ticket_playbook_disable_playbook_playbook": "Playbook name",
      "ticket_playbook_dismiss_recommendation_recommendation": "Recommendation ID",
      "ticket_playbook_enable_playbook_playbook": "Playbook name",
      "ticket_priority_level_level": "New priority level",
      "ticket_remove_user_user": "User to remove from the ticket",
      "ticket_rename_name_name": "New channel name"
    },
    "categories": {
      "support.label": "Support",
      "billing.label": "Billing",
      "report.label": "Report",
      "partnership.label": "Partnership",
      "staff.label": "Staff",
      "bug.label": "Bug Report",
      "other.label": "Other",
      "support.description": "Technical issues and general questions",
      "billing.description": "Payments, subscriptions and account issues",
      "report.description": "Report users, content or behavior",
      "partnership.description": "Collaboration and partnership proposals",
      "staff.description": "Apply to the server team",
      "bug.description": "Report bugs or technical issues",
      "other.description": "Any other inquiry",
      "support.welcome": "Thanks for opening a support ticket. A team member will assist you shortly. Please describe your issue in detail.",
      "billing.welcome": "Thanks for contacting billing support. A team member will assist you as soon as possible.",
      "report.welcome": "Thanks for reporting. Our moderation team will review your report.",
      "partnership.welcome": "Thanks for your interest in partnering. A team member will contact you.",
      "staff.welcome": "Thanks for your interest in our team. A leader will contact you.",
      "bug.welcome": "Thanks for reporting the bug. We will review it as soon as possible.",
      "other.welcome": "Thanks for contacting us. A team member will assist you."
    },
    "panel": {
      "categories_cta": "Choose an option from the menu below to get started.",
      "categories_heading": "Choose a category",
      "default_category": "General Support",
      "default_description": "Help with general issues",
      "faq_button": "Frequently Asked Questions",
      "queue_name": "Current queue",
      "queue_value": "We currently have `{{openTicketCount}}` active ticket(s). We will reply as soon as possible."
    },
    "picker": {
      "access_denied_description": "You cannot create tickets right now.\n**Reason:** {{reason}}",
      "access_denied_footer": "If you think this is a mistake, contact an administrator.",
      "access_denied_title": "Access denied",
      "category_missing": "That category was not found or is not available right now. Please choose a different option.",
      "cooldown": "Please wait **{{minutes}} minute(s)** before opening another ticket.\n\nThis cooldown helps the team manage incoming requests more effectively.",
      "limit_reached_description": "You already have **{{openCount}}/{{maxTickets}}** open tickets.\n\n**Your active tickets:**\n{{ticketList}}\n\nClose one of your current tickets before opening a new one.",
      "limit_reached_title": "Ticket limit reached",
      "min_days": "You must be in the server for at least **{{days}} day(s)** to open a ticket.\n\nCurrent time in server: **{{currentDays}} day(s)**",
      "no_categories": "There are no ticket categories configured for this server.",
      "pending_ratings_description": "You have **{{count}}** closed ticket(s) waiting for a rating:\n\n{{tickets}}\n\n**Why does rating matter?**\nYour feedback helps us improve the service and is required before opening new tickets.\n\n**Check your DMs** to find the pending rating prompts.\nIf you cannot find them, use the button below to resend them.",
      "pending_ratings_footer": "TON618 Tickets - Rating system",
      "pending_ratings_title": "Pending ticket ratings",
      "processing_error": "There was an error while preparing the ticket form. Please try again later.",
      "resend_ratings_button": "Resend rating prompts",
      "select_description": "👇 **Select the category** that best describes your issue\n\nEach category routes your request to the right team to help you faster.",
      "select_placeholder": "🎫 Choose a category...",
      "select_title": "🎫 Create new ticket"
    },
    "playbook": {
      "apply_macro_description": "Apply a playbook macro manually",
      "confirm_description": "Confirm and apply a playbook recommendation",
      "disable_description": "Disable a playbook for this server",
      "dismiss_description": "Dismiss a playbook recommendation",
      "enable_description": "Enable a playbook for this server",
      "group_description": "Manage playbook recommendations",
      "list_description": "List active playbook recommendations",
      "option_playbook": "Playbook name",
      "option_recommendation": "Recommendation ID"
    },
    "priority": {
      "high": "High",
      "low": "Low",
      "normal": "Normal",
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
    "field_names": {
      "Claimed by": "Claimed by",
      "Assigned to": "Assigned to",
      "Priority": "Priority",
      "Status": "Status",
      "Category": "Category"
    },
    "categories": {
      "support": {
        "label": "General Support",
        "description": "Help with general issues",
        "welcome": "Hi {user}! 🛠️\n\nThanks for contacting **General Support**.\nA team member will help you shortly.\n\n> Please describe your issue with as much detail as possible."
      },
      "billing": {
        "label": "Billing",
        "description": "Payments, invoices, or refunds",
        "welcome": "Hi {user}! 💳\n\nYou opened a **Billing** ticket.\n\n> Never share full banking or card details."
      },
      "report": {
        "label": "User Report",
        "description": "Report inappropriate behavior",
        "welcome": "Hi {user}! 🚨\n\nYou opened a **User Report**.\nThe moderation team will review it as soon as possible.\n\n> Please include any useful evidence such as screenshots or message links."
      },
      "partnership": {
        "label": "Partnerships",
        "description": "Collaboration or partnership requests",
        "welcome": "Hi {user}! 🤝\n\nYou opened a **Partnerships** ticket.\nPlease share details about your server, brand, or project."
      },
      "staff": {
        "label": "Staff Application",
        "description": "Apply to join the team",
        "welcome": "Hi {user}! ⭐\n\nYou opened a **Staff Application**.\nPlease answer honestly and with enough detail for review."
      },
      "bug": {
        "label": "Bug Report",
        "description": "Report a bug or broken flow",
        "welcome": "Hi {user}! 🐛\n\nYou opened a **Bug Report**.\nPlease describe the issue clearly so we can reproduce it."
      },
      "other": {
        "label": "Other",
        "description": "Anything else",
        "welcome": "Hi {user}! 📩\n\nYou opened a ticket.\nThe team will help you soon."
      }
    },
    "panel": {
      "title": "🎫 Support Center",
      "description": "👋 **Welcome to the ticket system!**\n\nSelect the category that best describes your issue:\n\n📋 **Before opening a ticket:**\n• Read the server rules\n• Check the FAQ or announcement channels\n• Be specific and include useful details\n\n⏰ **Response time:** Usually under 24h\n💬 **Need help?** Use the panel below 👇",
      "footer": "🎫 TON618 Tickets v3.0 • Fast support",
      "author_name": "🎫 Support Center",
      "categories_cta": "👇 **Select a category** to create your ticket",
      "no_categories_title": "⚠️ No categories configured",
      "no_categories_description": "No ticket categories are available. An administrator must configure at least one category."
    },
    "priorities": {
      "low": "🟢 Low",
      "normal": "🔵 Normal",
      "high": "🟡 High",
      "urgent": "🔴 Urgent"
    },
    "maintenance": {
      "default": "The ticket system is currently under maintenance. Please try again later."
    },
    "quick_actions": {
      "placeholder": "Quick staff actions...",
      "priority_high": "Priority: High",
      "priority_low": "Priority: Low",
      "priority_normal": "Priority: Normal",
      "priority_urgent": "Priority: Urgent",
      "status_pending": "Status: Waiting for user",
      "status_review": "Status: Under review",
      "status_wait": "Status: Waiting for staff"
    },
    "quick_feedback": {
      "add_staff_prompt": "Mention the staff member you want to add to this ticket.",
      "closed": "Quick actions are not available on closed tickets.",
      "not_found": "Ticket information was not found.",
      "only_staff": "Only staff can use these actions.",
      "priority_event_description": "{{userTag}} updated ticket #{{ticketId}} priority to {{priority}} from quick actions.",
      "priority_event_title": "Priority updated",
      "priority_updated": "Ticket priority updated to **{{label}}** by <@{{userId}}>.",
      "processing_error": "There was an error while processing this action.",
      "unknown_action": "Unknown action.",
      "workflow_event_description": "{{userTag}} updated ticket #{{ticketId}} workflow status to {{status}} from quick actions.",
      "workflow_event_title": "Workflow status updated",
      "workflow_updated": "Ticket status updated to **{{label}}** by <@{{userId}}>."
    },
    "rating": {
      "already_recorded_description": "You already rated this ticket with **{{rating}} star(s)**.",
      "already_recorded_processing": "This ticket was rated while your response was being processed.",
      "already_recorded_title": "Rating already recorded",
      "event_description": "{{userTag}} rated ticket #{{ticketId}} with {{rating}}/5.",
      "event_title": "Rating received",
      "invalid_identifier_description": "The identifier for this rating prompt is invalid.",
      "invalid_identifier_title": "Could not save your rating",
      "invalid_value_description": "Select a score between 1 and 5 stars.",
      "invalid_value_title": "Invalid rating",
      "not_found_description": "I could not find the ticket linked to this rating prompt.",
      "not_found_title": "Ticket not found",
      "prompt_category_fallback": "General",
      "prompt_description": "Hi <@{{userId}}>, your ticket **#{{ticketId}}** has been closed.\n\n**Rating required:** you must rate this ticket before opening new tickets in the future.\n\nYour feedback helps us improve the service and maintain a strong support experience.",
      "prompt_footer": "Your opinion matters to us",
      "prompt_option_1_description": "The support did not meet my expectations",
      "prompt_option_1_label": "1 star",
      "prompt_option_2_description": "The support was acceptable but needs improvement",
      "prompt_option_2_label": "2 stars",
      "prompt_option_3_description": "The support was solid and acceptable",
      "prompt_option_3_label": "3 stars",
      "prompt_option_4_description": "The support was very professional",
      "prompt_option_4_label": "4 stars",
      "prompt_option_5_description": "The support exceeded my expectations",
      "prompt_option_5_label": "5 stars",
      "prompt_placeholder": "Select a rating...",
      "prompt_staff_label": "Staff member",
      "prompt_title": "Rate the support you received",
      "resend_clear": "**All clear!**\n\nYou no longer have any pending ticket ratings.\nYou can open a new ticket whenever you need one.",
      "resend_error": "There was an error while resending the rating prompts. Please try again later.",
      "resend_failed": "**Could not resend the rating prompts**\n\nMake sure your DMs are open and try again.",
      "resend_partial_warning": "Warning: {{failCount}} prompt(s) could not be resent.",
      "resend_sent": "**Rating prompts resent**\n\nWe resent **{{successCount}}** rating prompt(s) to your DMs.\n\n**Check your DMs** to rate the pending tickets.{{warning}}",
      "resend_wrong_user": "This button can only be used by the matching user.",
      "save_failed_description": "An unexpected error occurred. Please try again later.",
      "save_failed_title": "Could not save your rating",
      "thanks_description": "You rated the support experience **{{rating}} star(s)**.\n\nYour feedback was recorded successfully and helps improve the service.",
      "thanks_title": "Thanks for your rating",
      "unavailable_description": "Only the creator of this ticket can submit this rating.",
      "unavailable_title": "Rating unavailable"
    },
    "slash": {
      "choices": {
        "priority": {
          "high": "High",
          "low": "Low",
          "normal": "Normal",
          "urgent": "Urgent"
        }
      },
      "description": "Manage support tickets",
      "groups": {
        "note": {
          "description": "Manage internal ticket notes",
          "options": {
            "note": "Internal note content"
          },
          "subcommands": {
            "add": {
              "description": "Add an internal note to this ticket"
            },
            "clear": {
              "description": "Clear all internal notes from this ticket"
            },
            "list": {
              "description": "List internal notes for this ticket"
            }
          }
        }
      },
      "options": {
        "add_user": "User to add to the ticket",
        "assign_staff": "Staff member who will own the ticket",
        "close_reason": "Reason for closing the ticket",
        "history_user": "Member whose history you want to inspect",
        "priority_level": "New priority level",
        "remove_user": "User to remove from the ticket",
        "rename_name": "New channel name"
      },
      "subcommands": {
        "add": {
          "description": "Add a user to the current ticket"
        },
        "assign": {
          "description": "Assign the current ticket to a staff member"
        },
        "brief": {
          "description": "Generate the case brief for this ticket"
        },
        "claim": {
          "description": "Claim the current ticket"
        },
        "close": {
          "description": "Close the current ticket"
        },
        "history": {
          "description": "View a member's ticket history"
        },
        "info": {
          "description": "View ticket details"
        },
        "move": {
          "description": "Move the ticket to another category"
        },
        "open": {
          "description": "Open a new ticket"
        },
        "priority": {
          "description": "Change the ticket priority"
        },
        "remove": {
          "description": "Remove a user from the current ticket"
        },
        "rename": {
          "description": "Rename the current ticket channel"
        },
        "reopen": {
          "description": "Reopen the current ticket"
        },
        "transcript": {
          "description": "Generate a ticket transcript"
        },
        "unclaim": {
          "description": "Release the current ticket"
        }
      }
    },
    "transcript_button": {
      "error": "There was an error while generating the transcript. Please try again later.",
      "intro": "Here is the manual transcript for this ticket:",
      "not_ticket": "I could not generate the transcript because this channel is no longer registered as a ticket.",
      "unavailable_now": "I could not generate the ticket transcript right now."
    },
    "workflow": {
      "assigned": "Assigned",
      "closed": "Closed",
      "open": "Open",
      "triage": "Under review",
      "waiting_staff": "Waiting for staff",
      "waiting_user": "Waiting for user"
    }
  },
  "tickets": {
    "categories": {
      "more": "...and {{count}} more",
      "none": "No categories configured",
      "off": "OFF",
      "on": "ON",
      "pings": "{{count}} pings"
    },
    "fields": {
      "channels_roles": "Infrastructure & Permissions",
      "commercial_status": "Commercial & Subscription",
      "escalation_reporting": "Incident & Escalation Reporting",
      "incident_mode": "Outage & Incident Mode",
      "limits_access": "Access Control & Fair Use",
      "panel_messaging": "UX & Personalization",
      "sla_automation": "Operational Intel & Automation"
    },
    "footers": {
      "free": "TON618 Console | Community Edition",
      "pro": "TON618 Pro | Operational Intelligence Active"
    },
    "incident": {
      "configured_categories": "Active Categories",
      "default_message": "We are currently experiencing a high volume of tickets. Response times may be longer than usual.",
      "inactive": "Bot is operating normally",
      "message": "Incident Broadcast"
    },
    "labels": {
      "admin": "Bot Admin Role",
      "auto_assignment": "Auto-Assignment Engine",
      "auto_close": "Inactivity Auto-Close",
      "base_sla": "Base SLA Threshold",
      "control_embed_color": "Control Color (HEX)",
      "control_embed_description": "Staff Control Description",
      "control_embed_title": "Staff Control Title",
      "cooldown": "Creation Cooldown",
      "global_limit": "Server Global Limit",
      "logs": "Moderation Logs",
      "max_per_user": "Concurrent Tickets",
      "minimum_days": "Min Account Age (Days)",
      "more": "...and {{count}} more",
      "online_only": "Assign Online Staff Only",
      "panel": "Ticket Panel",
      "panel_status": "Panel Status",
      "public_panel_color": "Panel Color (HEX)",
      "public_panel_description": "Public Panel Description",
      "public_panel_title": "Public Panel Title",
      "simple_help": "Simple Triage Mode",
      "smart_ping": "Smart Ping Warning",
      "staff": "Support Staff Role",
      "transcripts": "Ticket Transcripts",
      "welcome_message": "Ticket Welcome Message"
    },
    "panel_status": {
      "not_configured": "🔴 NOT CONFIGURED",
      "pending": "🟡 PENDING",
      "published": "🟢 PUBLISHED"
    }
  },
  "tickets.auto_assignment.require_online": "Require staff to be online",
  "tickets.auto_assignment.respect_away": "Respect away status",
  "tickets.auto_assignment.status": "Status",
  "tickets.auto_assignment.title": "Auto-assignment",
  "tickets.common.all_categories": "All categories",
  "tickets.common.default": "Default",
  "tickets.common.disabled": "Disabled",
  "tickets.common.enabled": "Enabled",
  "tickets.common.minutes": "{{value}} min",
  "tickets.common.no": "No",
  "tickets.common.not_configured": "Not configured",
  "tickets.common.removed": "Removed",
  "tickets.common.yes": "Yes",
  "tickets.customization.color_label": "Color",
  "tickets.customization.control_reset_description": "The internal ticket control panel was restored to defaults.",
  "tickets.customization.control_reset_title": "Control panel reset",
  "tickets.customization.control_updated_description": "Saved the new internal ticket control panel copy.",
  "tickets.customization.control_updated_title": "Control panel updated",
  "tickets.customization.current_message_label": "Current message",
  "tickets.customization.description_label": "Description",
  "tickets.customization.footer_label": "Footer",
  "tickets.customization.panel_reset_description": "The public ticket panel was restored to defaults.",
  "tickets.customization.panel_reset_title": "Ticket panel reset",
  "tickets.customization.panel_updated_description": "Saved the new public panel copy.",
  "tickets.customization.panel_updated_title": "Ticket panel updated",
  "tickets.customization.placeholders_label": "Available placeholders",
  "tickets.customization.title_label": "Title",
  "tickets.customization.welcome_reset_description": "The in-ticket welcome message was restored to defaults.",
  "tickets.customization.welcome_reset_title": "Ticket welcome message reset",
  "tickets.customization.welcome_updated_description": "Saved the new in-ticket welcome message.",
  "tickets.customization.welcome_updated_title": "Ticket welcome message updated",
  "tickets.daily_report.channel": "Report channel",
  "tickets.daily_report.status": "Status",
  "tickets.daily_report.title": "Daily Ticket Report",
  "tickets.errors.build_panel": "Failed to build the ticket panel: {{error}}",
  "tickets.errors.category_not_configured": "That ticket category is not configured.",
  "tickets.errors.daily_report_channel_required": "Set a channel before enabling the daily report.",
  "tickets.errors.escalation_channel_required": "Set an escalation channel before enabling escalation.",
  "tickets.errors.escalation_minutes_required": "Provide escalation minutes greater than zero.",
  "tickets.errors.exact_target": "Choose exactly one target: a priority or a category.",
  "tickets.errors.invalid_categories": "One or more category IDs are invalid.",
  "tickets.errors.invalid_color": "Invalid color. Use a 6-digit hex code.",
  "tickets.errors.message_empty": "The message cannot be empty.",
  "tickets.errors.message_or_reset": "Provide a message or use reset.",
  "tickets.errors.no_categories": "Configure at least one ticket category before publishing the panel.",
  "tickets.errors.publish_failed": "Failed to publish the ticket panel.",
  "tickets.errors.publish_permissions": "I am missing permissions to publish the panel in {{channel}}.",
  "tickets.errors.update_or_reset": "Provide at least one field to update or use reset.",
  "tickets.incident.disabled_title": "Incident mode disabled",
  "tickets.incident.enabled_title": "Incident mode enabled",
  "tickets.incident.paused_categories": "Paused categories",
  "tickets.incident.resumed": "Normal ticket intake resumed.",
  "tickets.incident.user_message": "User-facing incident message",
  "tickets.override.category_target": "Category: {{target}}",
  "tickets.override.escalation": "Escalation",
  "tickets.override.priority_target": "Priority: {{target}}",
  "tickets.override.target": "Target",
  "tickets.override.title": "SLA Override Updated",
  "tickets.override.type": "Type",
  "tickets.override.value": "Value",
  "tickets.override.warning": "Warning",
  "tickets.panel.published_description": "Published the ticket panel in {{channel}}.",
  "tickets.panel.published_title": "Ticket panel published",
  "tickets.panel.staff_role_active": "Staff role active: {{role}}",
  "tickets.panel.staff_role_missing": "No staff role configured yet.",
  "tickets.sla.base": "Base SLA",
  "tickets.sla.channel": "Escalation channel",
  "tickets.sla.escalation": "Escalation",
  "tickets.sla.role": "Escalation role",
  "tickets.sla.threshold": "Threshold",
  "tickets.sla.title": "Ticket SLA Configuration",
  "transcript.error_generating": "There was an error while generating the transcript.",
  "transcript.labels.active": "Active",
  "transcript.labels.attended_by": "Attended by",
  "transcript.labels.category": "Category",
  "transcript.labels.closed": "Closed",
  "transcript.labels.created": "Created",
  "transcript.labels.duration": "Duration",
  "transcript.labels.generated_on": "Generated on",
  "transcript.labels.messages": "Messages",
  "transcript.labels.no_messages": "No messages recorded",
  "transcript.labels.open": "Open",
  "transcript.labels.rating": "Rating",
  "transcript.labels.status": "Status",
  "transcript.labels.ticket": "Ticket",
  "transcript.title": "Ticket Transcript",
  "verification.autokick.description": "{{user}} was removed for not completing verification in time.",
  "verification.autokick.kick_reason": "Failed to complete verification in time.",
  "verification.autokick.reason_log": "Automatic verification timeout kick",
  "verification.autokick.title": "Unverified Member Kicked",
  "verify": {
    "activity": {
      "anti_raid": "Anti-raid",
      "anti_raid_triggered": "Anti-raid triggered",
      "force_unverified": "Verification removed manually",
      "force_verified": "Manually verified",
      "info": "Info",
      "kicked": "Kicked",
      "panel_publish_failed": "Panel publish failed",
      "panel_published": "Panel published",
      "permission_error": "Permission error",
      "unverified": "Unverified",
      "unverified_kicked": "Unverified member kicked",
      "verified": "Verified"
    },
    "audit": {
      "completed": "Completed",
      "removed": "Removed"
    },
    "command": {
      "account_age_pro": "Account age requirement above {{max}} days",
      "actor": "Actor",
      "anti_raid_disabled": "Anti-raid is now **disabled**.",
      "anti_raid_enabled": "Anti-raid is now **enabled**.\nThreshold: **{{joins}} joins** in **{{seconds}}s**.\nAction: **{{action}}**.",
      "anti_raid_triggers": "Anti-raid triggers",
      "auto_kick_disabled": "Auto-kick for unverified members is now **disabled**.",
      "auto_kick_enabled": "Unverified members will be kicked after **{{hours}} hour(s)**.",
      "captcha_emoji": "Emoji count",
      "captcha_emoji_pro": "Emoji CAPTCHA type",
      "captcha_math": "Math",
      "captcha_type": "CAPTCHA type",
      "code_sends": "Code sends",
      "confirmation_dm": "Confirmation DM",
      "dm_updated": "Verification confirmation DM is now **{{state}}**.",
      "enable_failed": "I cannot enable verification yet.\n\n{{issues}}",
      "enabled_state": "Verification is now **{{state}}**.",
      "failed": "Failed",
      "force_bot": "Bots cannot be verified through the member verification flow.",
      "force_failed": "I could not verify <@{{userId}}>.\n\n{{issues}}",
      "force_log_title": "Member force-verified",
      "force_success": "<@{{userId}}> was verified manually.{{warningText}}",
      "force_unverified": "Force unverified",
      "force_verified": "Force verified",
      "invalid_color": "Invalid color. Use a 6-character hex value like `57F287`.",
      "invalid_image": "Image URL must start with `https://`.",
      "kicked": "Kicked",
      "logs_permissions": "I cannot use {{channel}} for verification logs. Missing permissions: {{permissions}}.",
      "logs_set": "Verification logs will be sent to {{channel}}.",
      "member": "Member",
      "message_require_one": "Provide at least one field to update: `title`, `description`, `color`, or `image`.",
      "message_updated": "Verification panel updated. {{detail}}",
      "min_account_age": "Min account age",
      "mode_changed": "Verification mode changed to **{{mode}}**. {{detail}}",
      "mode_failed": "I cannot switch to **{{mode}}** yet.\n\n{{issues}}",
      "note_question_mode": "Question mode is active. Use `/verify question` if you want to replace the default challenge.",
      "note_ticket_role_aligned": "Ticket minimum verification role was aligned automatically because it was not set.",
      "operational_health": "Operational health",
      "panel_publish_failed": "The verification panel could not be published.\n\n{{issues}}",
      "panel_published": "Verification panel published.",
      "panel_refreshed": "Verification panel refreshed.",
      "panel_saved_but_not_published": "The verification configuration was saved, but the panel could not be published.\n\n{{issues}}",
      "pending_members": "Pending members",
      "permission_errors": "Permission errors",
      "pool_added": "Question added: **{{question}}...**\nTotal questions: {{total}}",
      "pool_cleared": "Cleared {{count}} question(s) from the pool.",
      "pool_count": "{{count}} question(s) in pool",
      "pool_empty": "No questions in the pool yet.\n\nUse `/verify question-pool add` to add questions.",
      "pool_footer": "Use /verify question-pool add to add questions",
      "pool_invalid_index": "Invalid index. Use a number between 1 and {{max}}.",
      "pool_max_reached": "Maximum of 20 questions reached. Remove some before adding more.",
      "pool_pro_feature": "More than 5 questions in the pool",
      "pool_removed": "Question removed: **{{question}}...**\nRemaining: {{remaining}}",
      "pool_title": "Question Pool",
      "question_prompts": "Question prompts",
      "question_updated": "Verification question updated.",
      "raid_action": "Raid action",
      "raid_threshold": "Raid threshold",
      "risk_escalation": "Risk escalation",
      "risk_escalation_pro": "Risk-based verification escalation",
      "security_age_disabled": "Minimum account age check **disabled**",
      "security_age_set": "Minimum account age set to **{{days}} days**",
      "security_captcha_set": "CAPTCHA type set to **{{type}}**",
      "security_footer": "Use /verify security with options to change settings",
      "security_risk_disabled": "Risk-based escalation **disabled**",
      "security_risk_enabled": "Risk-based escalation **enabled**",
      "security_title": "Security Settings",
      "security_updated": "Security settings updated:\n{{changes}}",
      "setup_failed": "I cannot finish the setup yet.\n\n{{issues}}",
      "setup_ready_description": "The verification system is configured and the live panel is available.",
      "setup_ready_title": "Verification Ready",
      "starts": "Starts",
      "stats_footer": "Stored verification events: {{total}}",
      "stats_title": "Verification Stats",
      "unknown_subcommand": "Unknown verification subcommand.",
      "unverify_bot": "Bots do not use the member verification flow.",
      "unverify_failed": "I could not remove verification from <@{{userId}}>.\n\n{{issues}}",
      "unverify_log_title": "Member unverified",
      "unverify_success": "Verification removed from <@{{userId}}>.{{warningText}}",
      "user_missing": "That user is not in this server.",
      "verified": "Verified",
      "verified_members": "Verified members"
    },
    "handler": {
      "account_too_new": "Your Discord account is too new. Accounts must be at least {{days}} days old to verify. Your account is {{currentDays}} days old.",
      "already_verified": "You are already verified in this server.",
      "bot_missing_permissions": "The bot is missing permissions to verify you (Manage Roles).",
      "captcha_invalid": "Invalid captcha response.",
      "captcha_modal_title": "Security Check",
      "captcha_placeholder": "Type your answer",
      "captcha_reason_expired": "Your captcha expired. Click **Verify me** to get a new one.",
      "captcha_reason_no_captcha": "No pending captcha found. Click **Verify me** to start again.",
      "captcha_reason_wrong": "Incorrect answer. Try again.",
      "code_dm_description": "Your verification code for **{{guild}}** is:\n\n# `{{code}}`\n\nThis code expires in **10 minutes**.\nReturn to the server and click **{{enterCodeLabel}}**.",
      "code_dm_title": "Verification Code",
      "code_reason_expired": "Your code expired. Click **Verify me** to generate a new one.",
      "code_reason_no_code": "No pending code was found. Click **Verify me** to generate a new one.",
      "code_reason_wrong": "Incorrect code. Try again.",
      "code_sent_description": "An 8-character code was sent to your direct messages.\n\n1. Open your DM inbox and copy the code.\n2. Return here and click **{{enterCodeLabel}}**.\n\nThe code expires in **10 minutes**.",
      "code_sent_footer": "Resends are limited. Wait {{seconds}}s before requesting a new code.",
      "code_sent_title": "Code sent by DM",
      "completed_description": "Welcome to **{{guild}}**, <@{{userId}}>. You now have full access to the server.",
      "completed_title": "Verification completed",
      "completion_failed": "I could not finish your verification because the role setup is not operational.\n\n{{issues}}",
      "dm_failed": "I could not send you a DM.\n\nEnable direct messages for this server and try again.",
      "enter_code_label": "Code received by DM",
      "enter_code_placeholder": "Example: AB1C2D3E",
      "enter_code_title": "Enter your code",
      "help_attempts": "After {{failures}} failed attempts, verification pauses for {{minutes}} minutes.",
      "help_attempts_label": "Attempts protection",
      "help_blocked": "Contact a server admin for manual help.",
      "help_blocked_label": "Still blocked?",
      "help_dm_problems": "Enable direct messages for this server and try again.",
      "help_dm_problems_label": "DM problems?",
      "help_mode_button": "Click **Verify me** and the bot will verify you immediately.",
      "help_mode_code": "Click **Verify me**, check your DM inbox for the code, then enter it in the modal.",
      "help_mode_question": "Click **Verify me** and answer the verification question correctly.",
      "help_title": "How verification works",
      "incorrect_answer": "Incorrect answer. Read the question carefully and try again.{{cooldownText}}",
      "invalid_code": "Invalid verification code.",
      "join_too_recent": "You joined too recently. Please wait {{retryText}} before verifying.",
      "log_verified_title": "Member verified",
      "log_warning_none": "None",
      "max_resends_reached": "You have reached the maximum number of code resends ({{max}}). Please wait or contact an admin.",
      "member_not_found": "Your member profile could not be found in this server.",
      "misconfigured": "Verification is currently misconfigured.\n\n{{issues}}",
      "mode_invalid": "Verification mode is not configured correctly.",
      "new_code_description": "Your new verification code is:\n\n# `{{code}}`\n\nThis code expires in **10 minutes**.",
      "new_code_title": "New verification code",
      "not_active": "Verification is not active in this server.",
      "not_code_mode": "This verification mode does not use DM codes.",
      "question_missing": "No verification question is configured. Ask an admin to run `/verify question`.",
      "question_modal_title": "Verification Question",
      "question_placeholder": "Type your answer here",
      "resend_dm_failed": "I could not send you a DM. Enable direct messages and try again.",
      "resend_success": "A new verification code was sent by DM.",
      "resend_wait": "Please wait before requesting another code. You can retry {{retryText}}.",
      "too_many_attempts": "Too many failed attempts. Try again {{retryText}}.",
      "verified_dm_description": "You were verified successfully in **{{guild}}**.",
      "verified_dm_title": "You are verified"
    },
    "info": {
      "no_issues": "No issues detected.",
      "protection_footer": "Protection: {{failures}} failed attempts -> {{minutes}}m cooldown",
      "raid_action_kick": "Kick automatically",
      "raid_action_pause": "Alert only",
      "title": "Verification Configuration"
    },
    "inspection": {
      "answer_missing": "Question mode is enabled but the expected answer is empty.",
      "apply_role_update_failed": "I could not update the verification roles.",
      "apply_unverified_unmanageable": "I cannot remove {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "apply_verified_missing": "Verified role is not configured or no longer exists.",
      "apply_verified_unmanageable": "I cannot assign {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "button_mode_antiraid_warning": "Button mode offers minimal protection against bots. Consider using 'code' or 'question' mode with anti-raid enabled.",
      "channel_deleted": "The configured verification channel no longer exists.",
      "channel_missing": "Verification channel is not configured.",
      "channel_permissions": "I cannot publish the panel in {{channel}}. Missing permissions: {{permissions}}.",
      "log_channel_deleted": "The configured verification log channel no longer exists.",
      "log_channel_permissions": "I cannot write to {{channel}}. Missing permissions: {{permissions}}.",
      "publish_failed": "I could not send or edit the verification panel in {{channel}}. Verify that I can send messages and embeds there.",
      "question_missing": "Question mode is enabled but the verification question is empty.",
      "revoke_role_update_failed": "I could not update the verification roles.",
      "revoke_unverified_unmanageable": "I cannot assign {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "revoke_verified_unmanageable": "I cannot remove {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "roles_same": "Verified role and unverified role cannot be the same role.",
      "unverified_role_deleted": "The configured unverified role no longer exists.",
      "unverified_role_managed": "The unverified role is managed by an integration and cannot be assigned by the bot.",
      "unverified_role_unmanageable": "I cannot manage the unverified role {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "verified_role_deleted": "The configured verified role no longer exists.",
      "verified_role_managed": "The verified role is managed by an integration and cannot be assigned by the bot.",
      "verified_role_missing": "Verified role is not configured.",
      "verified_role_unmanageable": "I cannot manage the verified role {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      "welcome_autorole_failed": "I could not assign the welcome auto-role {{role}}.",
      "welcome_autorole_missing": "The welcome auto-role is configured but no longer exists.",
      "welcome_autorole_process_failed": "I could not process the welcome auto-role."
    },
    "mode": {
      "button": "Button",
      "code": "DM code",
      "question": "Question"
    },
    "options": {
      "verify_anti-raid_action_action": "Action to take when anti-raid triggers",
      "verify_anti-raid_enabled_enabled": "Whether anti-raid protection stays enabled",
      "verify_anti-raid_joins_joins": "Join threshold before anti-raid triggers",
      "verify_anti-raid_seconds_seconds": "Detection window in seconds",
      "verify_auto-kick_hours_hours": "Hours to wait before auto-kicking unverified members",
      "verify_dm_enabled_enabled": "Whether confirmation DMs stay enabled",
      "verify_enabled_enabled_enabled": "Whether the feature stays enabled",
      "verify_force_user_user": "Member to verify manually",
      "verify_logs_channel_channel": "Channel used for verification logs",
      "verify_message_color_color": "Embed color in hex without `#`",
      "verify_message_description_description": "Panel description",
      "verify_message_image_image": "Image URL for the panel",
      "verify_message_title_title": "Panel title",
      "verify_mode_type_type": "Verification mode to switch to",
      "verify_question-pool_add_answer_answer": "Expected answer",
      "verify_question-pool_add_question_question": "Question text",
      "verify_question-pool_remove_index_index": "Pool item number to remove",
      "verify_question_answer_answer": "Expected answer",
      "verify_question_prompt_prompt": "Verification prompt or question",
      "verify_security_captcha_type_captcha_type": "CAPTCHA type to require",
      "verify_security_min_account_age_min_account_age": "Minimum account age in days",
      "verify_security_risk_escalation_risk_escalation": "Whether risky accounts should face stronger checks",
      "verify_setup_channel_channel": "Verification channel",
      "verify_setup_mode_mode": "Verification mode to use",
      "verify_setup_unverified_role_unverified_role": "Role assigned before verification",
      "verify_setup_verified_role_verified_role": "Role granted after verification",
      "verify_unverify_user_user": "Member to unverify manually"
    },
    "panel": {
      "description": "You need to verify before accessing the server. Click the button below to begin.",
      "footer": "{{guild}} â€¢ Verification",
      "help_label": "Help",
      "start_label": "Verify me",
      "title": "Verification"
    },
    "slash": {
      "choices": {
        "anti_raid_action": {
          "kick": "Kick automatically",
          "pause": "Alert only"
        },
        "captcha_type": {
          "emoji": "Emoji count",
          "math": "Math"
        },
        "mode": {
          "button": "Button",
          "code": "DM code",
          "question": "Question"
        }
      },
      "description": "Configure the member verification system",
      "groups": {
        "question_pool": {
          "description": "Manage the random verification question pool",
          "options": {
            "answer": "Expected answer",
            "index": "Pool item number to remove",
            "question": "Question text"
          },
          "subcommands": {
            "add": {
              "description": "Add a question to the pool"
            },
            "clear": {
              "description": "Clear the entire question pool"
            },
            "list": {
              "description": "List the current question pool"
            },
            "remove": {
              "description": "Remove one question from the pool"
            }
          }
        }
      },
      "options": {
        "action": "Action to take when anti-raid triggers",
        "answer": "Expected answer",
        "anti_raid_enabled": "Whether anti-raid protection stays enabled",
        "captcha_type": "CAPTCHA type to require",
        "channel": "Verification channel",
        "color": "Embed color in hex without `#`",
        "description": "Panel description",
        "dm_enabled": "Whether confirmation DMs stay enabled",
        "enabled": "Whether the feature stays enabled",
        "hours": "Hours to wait before auto-kicking unverified members",
        "image": "Image URL for the panel",
        "joins": "Join threshold before anti-raid triggers",
        "log_channel": "Channel used for verification logs",
        "min_account_age": "Minimum account age in days",
        "mode": "Verification mode to use",
        "prompt": "Verification prompt or question",
        "risk_escalation": "Whether risky accounts should face stronger checks",
        "seconds": "Detection window in seconds",
        "title": "Panel title",
        "type": "Verification mode to switch to",
        "unverified_role": "Role assigned before verification",
        "user_unverify": "Member to unverify manually",
        "user_verify": "Member to verify manually",
        "verified_role": "Role granted after verification"
      },
      "subcommands": {
        "anti_raid": {
          "description": "Configure anti-raid protection for joins"
        },
        "auto_kick": {
          "description": "Configure the auto-kick delay for unverified members"
        },
        "dm": {
          "description": "Enable or disable the verification confirmation DM"
        },
        "enabled": {
          "description": "Enable or disable verification"
        },
        "force": {
          "description": "Verify a member manually"
        },
        "info": {
          "description": "View the current verification configuration"
        },
        "logs": {
          "description": "Set the verification log channel"
        },
        "message": {
          "description": "Customize the verification panel message"
        },
        "mode": {
          "description": "Change the verification mode"
        },
        "panel": {
          "description": "Publish or refresh the verification panel"
        },
        "question": {
          "description": "Update the verification question and expected answer"
        },
        "security": {
          "description": "Adjust account-age, CAPTCHA and risk settings"
        },
        "setup": {
          "description": "Set up verification with the main channel and roles"
        },
        "stats": {
          "description": "View verification statistics"
        },
        "unverify": {
          "description": "Remove verification from a member manually"
        }
      }
    }
  },
  "warn": {
    "fields": {
      "list": "Warnings",
      "moderator": "Moderator",
      "reason": "Reason",
      "total": "Total warnings",
      "user": "User"
    },
    "options": {
      "warn_add_reason_reason": "Reason for the warning",
      "warn_add_user_user": "Member to warn",
      "warn_check_user_user": "Member whose warnings you want to inspect",
      "warn_remove_id_id": "Warning ID"
    },
    "responses": {
      "add_description": "{{user}} has been warned successfully.",
      "add_title": "Warning added",
      "auto_kick_failed": "Automatic action failed: I could not kick the member after reaching 5 warnings.",
      "auto_kick_success": "Automatic action: the member was kicked after reaching 5 warnings.",
      "auto_timeout_failed": "Automatic action failed: I could not timeout the member after reaching 3 warnings.",
      "auto_timeout_success": "Automatic action: the member was timed out for 1 hour after reaching 3 warnings.",
      "footer_id": "Warning ID: {{id}}",
      "list_description": "Total stored warnings: **{{count}}**.",
      "list_entry": "**{{index}}.** `{{id}}`\nReason: {{reason}}\nModerator: <@{{moderatorId}}>\nDate: <t:{{timestamp}}:R>",
      "list_footer": "Use `/warn remove` with the warning ID to delete one entry.",
      "list_title": "Warnings for {{user}}",
      "none_description": "{{user}} has no warnings in this server.",
      "none_title": "No warnings found",
      "not_found_description": "I could not find a warning with ID `{{id}}`.",
      "not_found_title": "Warning not found",
      "remove_description": "Warning `{{id}}` was removed successfully.",
      "remove_title": "Warning removed"
    },
    "slash": {
      "description": "Manage member warnings",
      "options": {
        "id": "Warning ID",
        "reason": "Reason for the warning",
        "user_inspect": "Member whose warnings you want to inspect",
        "user_warn": "Member to warn"
      },
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
      }
    }
  },
  "weekly_report": {
    "active_categories": "Most Active Categories",
    "avg_rating": "Average Rating",
    "currently_open": "Currently Open",
    "description": "Here is the activity summary for the server over the last 7 days.",
    "footer": "Operational Excellence • TON618",
    "no_data": "No significant activity recorded.",
    "response_time": "Average Response Time",
    "tickets_closed": "Tickets Closed",
    "tickets_opened": "Tickets Opened",
    "title": "Weekly Performance Report - {{guildName}}",
    "top_staff": "Top Staff This Month"
  },
  "welcome.invalid_color": "Invalid color. Use a 6-digit hex code like `5865F2`.",
  "welcome.test_channel_missing": "The configured welcome channel no longer exists or is inaccessible.",
  "welcome.test_requires_channel": "Set a welcome channel before sending a test message.",
  "wizard": {
    "description": "The system has been configured with the following settings.",
    "footer": "TON618 Bot • Setup Wizard",
    "free_next_step": "System ready. Consider upgrading to Pro to enable advanced automation playbooks.",
    "next_step_label": "Recommended Next Steps",
    "panel_status": {
      "error": "❌ Critical Error ({{error}})",
      "missing_permissions": "❌ Permissions Error",
      "published": "✅ Published",
      "skipped": "⏩ Skipped"
    },
    "pro_next_step": "Everything is ready! Your Pro plan is active and playbooks are enabled.",
    "summary_label": "Configuration Summary",
    "title": "Quick Setup Results"
  },
  "health": {
    "active": "Active",
    "all_permissions": "All permissions present",
    "checks": {
      "database": "Database",
      "handlers": "Handlers",
      "memory": "Memory",
      "permissions": "Bot Permissions",
      "uptime": "Uptime",
      "version": "Version"
    },
    "connected": "Connected",
    "embed": {
      "checks_title": "Diagnostics",
      "description": "System status: {{status}}\nServer: {{guild}}",
      "errors_title": "Critical Errors",
      "footer": "Completed in {{elapsed}}ms • Discord.js {{discordjs}} • Node {{node}}",
      "title": "🔍 System Diagnostics",
      "warnings_title": "Warnings"
    },
    "errors": {
      "database": "Database connection error: {{error}}"
    },
    "handlers_status": "Giveaways: {{giveaway}}, Stats: {{stats}}",
    "inactive": "Inactive",
    "memory_usage": "{{used}} MB / {{total}} MB",
    "missing_count": "Missing {{count}} permissions",
    "no_checks": "Could not perform checks",
    "no_data": "No data (first time)",
    "slash": {
      "description": "Check bot status and diagnostics"
    },
    "status": {
      "critical": "Critical",
      "healthy": "Healthy",
      "warning": "Warnings"
    },
    "unknown": "unknown",
    "unknown_error": "Unknown error",
    "uptime_format": "{{hours}}h {{minutes}}m",
    "warnings": {
      "handlers_inactive": "Some handlers are inactive",
      "high_memory": "High memory usage: {{mb}} MB",
      "missing_permissions": "Missing {{count}} bot permissions"
    }
  },
  "quickstart": {
    "guild_only": "This command only works in servers.",
    "setup_progress": "**Setup Progress**",
    "steps_completed": "{{completed}} of {{total}} steps completed",
    "recommended_next": "**Recommended next steps:**",
    "status_done": "Done",
    "status_pending": "Pending",
    "tip": "💡 **Tip:** Use `{{command}}` to continue",
    "title": "Quick Start",
    "footer": "Use /help for more commands",
    "button_wizard": "🚀 Start Wizard",
    "button_docs": "📖 Documentation",
    "button_support": "💬 Support Server",
    "steps": {
      "language": {
        "name": "Language",
        "description": "Set your server language (English/Español)"
      },
      "tickets": {
        "name": "Ticket System",
        "description": "Configure support tickets with the setup wizard"
      },
      "welcome": {
        "name": "Welcome Messages",
        "description": "Set up automatic welcome messages"
      },
      "automod": {
        "name": "AutoMod Protection",
        "description": "Enable automatic moderation and anti-spam"
      },
      "verification": {
        "name": "Verification System",
        "description": "Add verification requirements for new members"
      },
      "logs": {
        "name": "Logs & Monitoring",
        "description": "Configure log channels for moderation events"
      }
    }
  },

  // Security
  security: {
    alert_singular: "alert",
    alert_plural: "alerts",
    status_title: "🔒 Security System Status",
    field_monitoring: "📊 Monitoring",
    field_alerts: "🚨 Alerts",
    field_config: "⚙️ Configuration",
    status_active: "🟢 Active",
    status_stopped: "🔴 Stopped",
    check_interval: "Check interval",
    cleanup_interval: "Cleanup interval",
    unacknowledged: "Unacknowledged",
    critical_unack: "Critical (unack)",
    max_alert_age: "Max alert age",
    critical_alerts_list: "🚨 Critical Alerts",
    setting_up_indexes: "🔧 Setting up MongoDB indexes...",
    indexes_label: "Indexes",
    scheduler_label: "Scheduler",
    setup_complete: "🔒 Security Setup Complete",
    alert_acknowledged_title: "✅ Alert Acknowledged",
    alert_acknowledged_desc: "Alert `{alertId}` has been acknowledged.",
    alert_not_found: "❌ Alert `{alertId}` not found or already acknowledged.",
    test_alert_sent_title: "✅ Test Alert Sent",
    test_alert_sent_desc: "A test security alert has been sent to your configured Discord channel/webhook.",
    webhook_url: "Webhook URL",
    alert_channel: "Alert Channel",
    test_alert_failed: "❌ Failed to send test alert. Check that SECURITY_ALERTS_WEBHOOK_URL or SECURITY_ALERTS_CHANNEL_ID is configured in your .env file.",
    encryption_key_title: "🔐 New Encryption Key Generated",
    encryption_key_generated: "A new 256-bit encryption key has been generated.",
    add_to_env: "**Add this to your .env file:**",
    important_warning: "⚠️ Important",
    encryption_warnings: "• Keep this key SECRET and in a password manager\n• If you lose it, encrypted data CANNOT be recovered\n• Changing the key will make existing encrypted data unreadable",
    encryption_status_title: "🔐 Encryption Status",
    key_configured: "Key Configured",
    key_length: "Key Length",
    enabled: "✅ Enabled",
    disabled: "❌ Disabled",
    chars: "chars",
    valid: "(✅ Valid)",
    too_short: "(❌ Too short)",
    encryption_enabled_desc: "Your sensitive data is being automatically encrypted with AES-256-GCM.",
    encryption_disabled_desc: "⚠️ Encryption is NOT enabled. Sensitive data is stored in plain text.\n\nRun `/security encryption generate_key:true` to generate a key.",
  },

  // Premium Test
  premium_test: {
    title: "📊 Advanced Server Analytics",
    description: "This is a premium-only feature!",
    fields: {
      active_members: "👥 Active Members",
      messages_today: "💬 Messages Today",
      growth_rate: "📈 Growth Rate",
    },
    footer: "TON618 Pro Analytics",
    error: "❌ An error occurred while fetching analytics.",
  },

  // Ping
  ping: {
    title: "Bot Latency",
    field: {
      latency: "Latency",
      uptime: "Uptime",
      guilds: "Servers",
      users: "Users",
      channels: "Channels",
      status: "Status",
    },
    operational: "Operational",
  },

};
