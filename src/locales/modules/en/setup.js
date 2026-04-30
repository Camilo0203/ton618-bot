module.exports = {
  setup: {
    automod: {
      bootstrap_description: "Create initial AutoMod rules",
      channel_alert_description: "Set or clear the AutoMod alert channel",
      choice_add: "Add",
      choice_preset_all: "All presets",
      choice_preset_invites: "Invites",
      choice_preset_scam: "Scam links",
      choice_preset_spam: "Spam",
      choice_remove: "Remove",
      choice_reset: "Reset",
      disable_description: "Remove all managed AutoMod rules",
      exempt_channel_description: "Manage exempt channels",
      exempt_role_description: "Manage exempt roles",
      group_description: "Configure AutoMod rules and exemptions",
      option_action: "Action to perform",
      option_channel: "Channel to receive AutoMod alerts",
      option_clear: "Clear the alert channel",
      option_enabled: "Enable or disable this preset",
      option_preset_name: "Preset name",
      option_target_channel: "Channel to exempt",
      option_target_role: "Role to exempt",
      preset_all: "All presets",
      preset_description: "Enable or disable an AutoMod preset",
      preset_invites: "Invites",
      preset_scam: "Scam links",
      preset_spam: "Spam",
      status_description: "View AutoMod configuration status",
      sync_description: "Sync AutoMod rules with current settings"
    },
    commands: {
      already_disabled: "The command `/{{command}}` was already disabled.",
      already_enabled: "The command `/{{command}}` was already enabled.",
      audit_affected: "Affected command: `/{{command}}`",
      audit_after: "After",
      audit_before: "Before",
      audit_disabled: "Command disabled",
      audit_enabled: "Command enabled",
      audit_executed_by: "Executed by",
      audit_global: "A global command change was applied.",
      audit_reset: "Command reset",
      audit_server: "Server",
      audit_updated: "Command update",
      candidate_description_disable: "Disable command",
      candidate_description_enable: "Enable command",
      candidate_description_status: "Check current status",
      disable_description: "Disable a command in this server",
      disable_setup_forbidden: "You cannot disable `/setup`, otherwise you could lock yourself out of configuration.",
      disabled_success: "Command `/{{command}}` disabled for this server.",
      enable_description: "Re-enable a previously disabled command",
      enabled_success: "Command `/{{command}}` enabled again.",
      format_more: "- ... and {{count}} more",
      group_description: "Manage which commands are available in this server",
      hidden_suffix: " (+{{count}} hidden)",
      list_description: "List the commands currently disabled in this server",
      list_embed_title: "Server commands",
      list_footer: "Available: **{{available}}** | Enabled: **{{enabled}}**.",
      list_heading: "Disabled commands ({{count}}):",
      list_none: "No commands are disabled in this server.\nAvailable: **{{available}}** | Enabled: **{{enabled}}**.",
      missing_command_name: "You must provide a valid command name.",
      mode_disable: "Disable",
      mode_enable: "Enable",
      mode_status: "Status",
      no_candidates_description: "Switch actions to see more options",
      no_candidates_label: "No commands available",
      option_disable_description: "Block a command in this server",
      option_disable_label: "Disable command",
      option_enable_description: "Restore a previously disabled command",
      option_enable_label: "Enable command",
      option_list_description: "Show the disabled command summary",
      option_list_label: "List disabled",
      option_reset_description: "Re-enable every disabled command",
      option_reset_label: "Reset all",
      option_status_description: "Check whether a command is enabled",
      option_status_label: "Command status",
      panel_description: "Open the interactive command control panel",
      panel_notice: "Use the menus below to manage commands without typing names manually.",
      panel_title: "Server command controls",
      placeholder_action: "Select an action",
      placeholder_target: "Command to {{action}}",
      reset_description: "Re-enable every disabled command",
      reset_done: "Re-enabled **{{count}}** command(s).",
      reset_noop: "No commands were disabled. Nothing to reset.",
      status_description: "Check one command or view the current summary",
      status_embed_title: "Command status",
      status_result: "Status for `/{{command}}`: **{{state}}**.\nCurrently disabled commands: **{{count}}**.",
      summary_available: "Available: **{{count}}**",
      summary_candidates: "Candidates in menu: **{{visible}}**{{hiddenText}}",
      summary_current_mode: "Current mode: **{{mode}}**",
      summary_disabled: "Disabled: **{{count}}**",
      summary_result: "Result: {{notice}}",
      unknown_command: "The command `/{{command}}` does not exist in this bot."
    },
    confessions: {
      configure_description: "Set the channel and role used for confessions",
      group_description: "Configure anonymous confessions"
    },
    general: {
      admin_role_description: "Set the admin role",
      auto_close_description: "Configure automatic ticket closing",
      cooldown_description: "Set ticket creation cooldown",
      dashboard_description: "Set the channel for the dashboard",
      dm_close_description: "Configure DM on ticket close",
      dm_open_description: "Configure DM on ticket open",
      global_limit_description: "Set global ticket limit",
      group_description: "Configure the server operational settings",
      info_description: "View current server configuration",
      language_description: "Review or update the bot language for this server",
      language_label_en: "English",
      language_label_es: "Spanish",
      language_set: "Bot language configured: **{{label}}**.",
      live_members_description: "Set the voice channel for live member count",
      live_role_description: "Set the voice channel for live role count",
      log_deletes_description: "Configure message delete logging",
      log_edits_description: "Configure message edit logging",
      logs_description: "Set the channel for moderation logs",
      max_tickets_description: "Set maximum tickets per user",
      min_days_description: "Set minimum account age in days",
      option_channel: "Channel",
      option_count: "Count",
      option_days: "Days",
      option_enabled: "Enable or disable",
      option_language_value: "Language to use for visible bot responses",
      option_minutes: "Minutes",
      option_role: "Role",
      option_role_to_count: "Role to count",
      option_verify_role: "Verification role (leave empty to disable)",
      option_voice_channel: "Voice channel",
      sla_description: "Configure SLA settings",
      smart_ping_description: "Configure smart ping settings",
      staff_role_description: "Set the staff role",
      transcripts_description: "Set the channel for ticket transcripts",
      verify_role_description: "Set the verification role",
      weekly_report_description: "Set the channel for weekly reports"
    },
    goodbye: {
      avatar_description: "Show or hide the departing member avatar",
      avatar_state: "Member avatar in goodbye messages: **{{state}}**.",
      channel_description: "Set the channel used for goodbye messages",
      channel_set: "Goodbye channel set to {{channel}}.",
      color_description: "Set the goodbye embed color (hex)",
      color_updated: "Goodbye color updated to **#{{hex}}**.",
      enabled_description: "Enable or disable goodbye messages",
      enabled_state: "Goodbye messages are now **{{state}}**.",
      footer_description: "Update the goodbye embed footer",
      footer_updated: "Goodbye footer updated.",
      group_description: "Configure goodbye messages",
      hidden: "Hidden",
      invalid_color: "Invalid color. Use a 6 character hex code like `{{example}}`.",
      message_description: "Update the goodbye message",
      message_updated: "Goodbye message updated.\nAvailable variables: {{vars}}",
      test_channel_missing: "Configured goodbye channel not found.",
      test_default_message: "**{user}** left the server.",
      test_default_title: "See you later",
      test_description: "Send a test goodbye message",
      test_field_remaining_members: "Remaining members",
      test_field_roles: "Roles",
      test_field_user: "User",
      test_field_user_id: "User ID",
      test_requires_channel: "Configure a goodbye channel first with `/setup goodbye channel`.",
      test_roles_value: "Test payload only",
      test_sent: "Test goodbye message sent to {{channel}}.",
      title_description: "Update the goodbye embed title",
      title_updated: "Goodbye title updated to **{{text}}**.",
      visible: "Visible"
    },
    language: {
      audit_reason_manual: "manual_language_change",
      audit_reason_onboarding: "onboarding_language_selection",
      current_value: "TON618 is currently operating in **{{label}}**.",
      description: "Review or update the operational language TON618 uses in this server.",
      fallback_note: "Guilds without an explicit selection continue using English until an administrator sets a language.",
      onboarding_completed: "Completed",
      onboarding_pending: "Pending",
      title: "Server language",
      updated_value: "Language changed to **{{label}}**. TON618 will use this language for visible responses in this guild."
    },
    options: {
      "setup_automod_channel-alert_channel_channel": "Channel to receive AutoMod alerts",
      "setup_automod_channel-alert_clear_clear": "Clear the alert channel",
      "setup_automod_exempt-channel_action_action": "Action to perform",
      "setup_automod_exempt-channel_channel_channel": "Channel to exempt",
      "setup_automod_exempt-role_action_action": "Action to perform",
      "setup_automod_exempt-role_role_role": "Role to exempt",
      setup_automod_preset_enabled_enabled: "Enable or disable this preset",
      setup_automod_preset_name_name: "Preset name",
      setup_commands_disable_command_command: "Command name without `/`",
      setup_commands_enable_command_command: "Command name without `/`",
      setup_commands_status_command_command: "Command name without `/` (optional)",
      setup_confessions_configure_channel_channel: "Channel where confessions are posted",
      setup_confessions_configure_role_role: "Role required to use confessions",
      "setup_general_admin-role_role_role": "Role",
      "setup_general_auto-close_minutes_minutes": "Minutes",
      setup_general_cooldown_minutes_minutes: "Minutes",
      setup_general_dashboard_channel_channel: "Channel",
      "setup_general_dm-close_enabled_enabled": "Enable or disable",
      "setup_general_dm-open_enabled_enabled": "Enable or disable",
      "setup_general_global-limit_count_count": "Count",
      setup_general_language_value_value: "Language to use for visible bot responses",
      "setup_general_live-members_channel_channel": "Voice channel",
      "setup_general_live-role_channel_channel": "Voice channel",
      "setup_general_live-role_role_role": "Role to count",
      "setup_general_log-deletes_enabled_enabled": "Enable or disable",
      "setup_general_log-edits_enabled_enabled": "Enable or disable",
      setup_general_logs_channel_channel: "Channel",
      "setup_general_max-tickets_count_count": "Count",
      "setup_general_min-days_days_days": "Days",
      setup_general_sla_minutes_minutes: "Minutes",
      "setup_general_smart-ping_minutes_minutes": "Minutes",
      "setup_general_staff-role_role_role": "Role",
      setup_general_transcripts_channel_channel: "Channel",
      "setup_general_verify-role_role_role": "Verification role (leave empty to disable)",
      "setup_general_weekly-report_channel_channel": "Channel",
      setup_goodbye_avatar_show_show: "Show the member avatar",
      setup_goodbye_channel_channel_channel: "Goodbye channel",
      setup_goodbye_color_hex_hex: "Hex color without `#`",
      setup_goodbye_enabled_enabled_enabled: "Whether goodbye messages remain enabled",
      setup_goodbye_footer_text_text: "Footer text",
      setup_goodbye_message_text_text: "Message content",
      setup_goodbye_title_text_text: "Embed title",
      setup_language_value_value: "Language to use for visible bot responses",
      setup_suggestions_channel_channel_channel: "Suggestions channel",
      setup_suggestions_enabled_enabled_enabled: "Whether suggestions stay enabled",
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
      setup_tickets_incident_active_active: "Enable or disable",
      setup_tickets_incident_categories_categories: "Affected categories (comma-separated IDs)",
      setup_tickets_incident_message_message: "Custom incident message",
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
      setup_welcome_autorole_role_role: "Role to assign on join (leave empty to disable)",
      setup_welcome_avatar_show_show: "Show the member avatar",
      setup_welcome_banner_url_url: "Image URL starting with `https://`",
      setup_welcome_channel_channel_channel: "Welcome channel",
      setup_welcome_color_hex_hex: "Hex color without `#`",
      setup_welcome_dm_enabled_enabled: "Whether welcome DMs remain enabled",
      setup_welcome_dm_message_message: "DM content. Variables: `{mention}` `{user}` `{tag}` `{server}` `{count}` `{id}`",
      setup_welcome_enabled_enabled_enabled: "Whether welcome messages remain enabled",
      setup_welcome_footer_text_text: "Footer text",
      setup_welcome_message_text_text: "Message content",
      setup_welcome_title_text_text: "Embed title",
      setup_wizard_admin_admin: "Bot admin role (optional)",
      setup_wizard_dashboard_dashboard: "Main dashboard and panel channel",
      setup_wizard_logs_logs: "Log channel (optional)",
      setup_wizard_plan_plan: "Initial server plan",
      "setup_wizard_publish-panel_publish-panel": "Publish the ticket panel immediately",
      "setup_wizard_sla-escalation-minutes_sla-escalation-minutes": "Base SLA escalation threshold in minutes",
      "setup_wizard_sla-warning-minutes_sla-warning-minutes": "Base SLA warning threshold in minutes",
      setup_wizard_staff_staff: "Staff role (optional)",
      setup_wizard_transcripts_transcripts: "Transcript channel (optional)"
    },
    panel: {
      action_applied: "Action applied.",
      admin_only: "Only administrators can use this panel.",
      default_action_failed: "The action could not be applied.",
      default_reset_failed: "The reset could not be completed.",
      error_prefix: "Error: {{message}}",
      invalid_action: "Invalid action.",
      invalid_command: "No valid command was selected.",
      owner_only: "Only the user who opened this panel can use it.",
      reset_applied: "Reset applied."
    },
    slash: {
      choices: {
        english: "English",
        spanish: "Spanish"
      },
      description: "Configure the server operational settings",
      groups: {
        automod: {
          alert_channel: "Alert channel: {{channel}}",
          alert_not_configured: "Not configured",
          bootstrap_created: "Created {{count}} TON618 AutoMod rule{{plural}}.",
          bootstrap_no_new: "No new TON618 AutoMod rules were needed.",
          choices: {
            add: "Add",
            preset_all: "All presets",
            preset_invites: "Invites",
            preset_scam: "Scam links",
            preset_spam: "Spam",
            remove: "Remove",
            reset: "Reset"
          },
          description: "Configure AutoMod rules and exemptions",
          disable_no_rules: "No TON618-managed AutoMod rules were present.",
          disable_partial: "Removed {{removed}} rule{{removedPlural}}, preserved {{preserved}} due to errors.",
          disable_removed: "Removed {{count}} TON618-managed AutoMod rule{{plural}}.",
          error_max_exempt_channels: "AutoMod only supports up to 50 exempt channels per guild.",
          error_max_exempt_roles: "AutoMod only supports up to 20 exempt roles per guild.",
          error_no_active_presets: "No AutoMod presets are active. Re-enable a preset or use `/setup automod disable`.",
          error_no_presets: "No AutoMod presets are active. Enable at least one preset before bootstrapping.",
          error_not_enabled: "AutoMod is not enabled for this guild yet. Run `/setup automod bootstrap` first.",
          error_provide_channel_or_clear: "Provide `channel`, or set `clear: true`.",
          error_provide_channel_or_reset: "Provide `channel`, or use `action: reset`.",
          error_provide_role_or_reset: "Provide `role`, or use `action: reset`.",
          error_unknown_action: "Unknown action. Use add, remove, or reset.",
          error_unknown_preset: "Unknown preset selection.",
          exempt_channels: "Exempt channels: {{channels}}",
          exempt_roles: "Exempt roles: {{roles}}",
          fetch_error: "Skipped {{action}}: {{message}}",
          fetch_error_generic: "Could not inspect AutoMod rules.",
          field_alerts_exemptions: "Alerts and Exemptions",
          field_managed_rules: "Managed Rules",
          field_permissions: "Permissions",
          field_sync_state: "Sync State",
          hint_bootstrap: "Run `/setup automod bootstrap` when you're ready to create the managed rules.",
          hint_disable: "Use `/setup automod disable` to remove existing rules, or re-enable a preset before syncing.",
          hint_sync: "Run `/setup automod sync` to apply this change to Discord.",
          info_already_exempt_channel: "{{channel}} is already exempt.",
          info_already_exempt_role: "{{role}} is already exempt.",
          last_sync: "Last sync: {{timestamp}}",
          live_count: "Live count: `{{live}}/{{desired}}`",
          never: "Never",
          no_presets: "No AutoMod presets selected.",
          no_sync_recorded: "No sync recorded yet.",
          none: "None",
          options: {
            action: "Action to perform",
            channel: "Channel to receive AutoMod alerts",
            clear: "Clear the alert channel",
            enabled: "Enable or disable this preset",
            preset_name: "Preset name",
            target_channel: "Channel to exempt",
            target_role: "Role to exempt"
          },
          permission_failure: "Skipped {{action}}: missing {{permissions}}.",
          permission_failure_generic: "Skipped {{action}}: permission check failed.",
          permissions_ok: "All required permissions are present",
          presets_none: "No presets selected",
          rule_live: "live",
          rule_missing: "missing",
          status_disabled: "TON618 AutoMod management is disabled for this guild.",
          status_enabled: "TON618 AutoMod management is enabled for this guild.",
          status_title: "AutoMod Status - {{guildName}}",
          stored_rule_ids: "Stored rule IDs: `{{count}}`",
          subcommands: {
            bootstrap: {
              description: "Create initial AutoMod rules"
            },
            "channel-alert": {
              description: "Set or clear the AutoMod alert channel"
            },
            disable: {
              description: "Remove all managed AutoMod rules"
            },
            "exempt-channel": {
              description: "Manage exempt channels"
            },
            "exempt-role": {
              description: "Manage exempt roles"
            },
            preset: {
              description: "Enable or disable an AutoMod preset"
            },
            status: {
              description: "View AutoMod configuration status"
            },
            sync: {
              description: "Sync AutoMod rules with current settings"
            }
          },
          success_alert_cleared: "AutoMod alert channel cleared.\n{{hint}}",
          success_alert_set: "AutoMod alert channel set to {{channel}}.\n{{hint}}",
          success_exempt_channels_updated: "AutoMod exempt channels updated. Total: `{{count}}`.\n{{hint}}",
          success_exempt_roles_updated: "AutoMod exempt roles updated. Total: `{{count}}`.\n{{hint}}",
          success_presets_updated: "AutoMod presets updated: {{summary}}.\n{{followUp}}",
          sync_result: "Result: `{{status}}`",
          sync_summary: "Summary: {{summary}}",
          sync_summary_line: "Updated {{updated}} rule{{updatedPlural}}, recreated {{created}} missing rule{{createdPlural}}, removed {{removed}} stale rule{{removedPlural}}."
        },
        commands: {
          description: "Manage which commands are available in this server",
          options: {
            command_optional: "Command name without `/` (optional)",
            command_required: "Command name without `/`"
          },
          subcommands: {
            disable: {
              description: "Disable a command in this server"
            },
            enable: {
              description: "Re-enable a previously disabled command"
            },
            list: {
              description: "List the commands currently disabled in this server"
            },
            panel: {
              description: "Open the interactive command control panel"
            },
            reset: {
              description: "Re-enable every disabled command"
            },
            status: {
              description: "Check one command or view the current summary"
            }
          }
        },
        goodbye: {
          description: "Configure goodbye messages",
          options: {
            channel: "Goodbye channel",
            enabled: "Whether goodbye messages remain enabled",
            footer_text: "Footer text",
            hex: "Hex color without `#`",
            show: "Show the member avatar",
            text: "Message content",
            title_text: "Embed title"
          },
          subcommands: {
            avatar: {
              description: "Show or hide the departing member avatar"
            },
            channel: {
              description: "Set the channel used for goodbye messages"
            },
            color: {
              description: "Set the goodbye embed color (hex)"
            },
            enabled: {
              description: "Enable or disable goodbye messages"
            },
            footer: {
              description: "Update the goodbye embed footer"
            },
            message: {
              description: "Update the goodbye message. Variables: {{vars}}"
            },
            test: {
              description: "Send a test goodbye message"
            },
            title: {
              description: "Update the goodbye embed title"
            }
          }
        },
        tickets: {
          choices: {
            mode_least_active: "Least active",
            mode_random: "Random",
            mode_round_robin: "Round robin",
            sla_escalation: "Escalation",
            sla_warning: "Warning",
            style_buttons: "Buttons",
            style_select: "Select menu"
          },
          description: "Configure ticket system settings",
          options: {
            color: "Embed color (hex)",
            control_description: "Control embed description",
            control_footer: "Control embed footer",
            control_title: "Control embed title",
            enabled: "Enable or disable",
            escalation_channel: "Channel for escalation alerts",
            escalation_enabled: "Enable escalation",
            escalation_minutes: "Minutes before escalation",
            escalation_role: "Role to ping on escalation",
            mode: "Assignment mode",
            require_online: "Require online status",
            reset: "Reset to default",
            rule_minutes: "Minutes threshold",
            rule_type: "Rule type",
            style: "Panel style",
            target_category: "Target category",
            target_priority: "Target priority",
            warning_minutes: "Minutes before SLA warning",
            welcome_message: "Welcome message content"
          },
          playbook: {
            apply_macro_description: "Directly apply the suggested macro from a recommendation",
            catalog_empty: "No playbooks found",
            confirm_description: "Confirm and apply a suggested recommendation",
            disable_description: "Disable a specific playbook for this guild",
            dismiss_description: "Dismiss a suggested recommendation",
            enable_description: "Enable a specific playbook for this guild",
            errors: {
              admin_only: "Only bot admins can enable or disable playbooks.",
              macro_missing: "The suggested macro was not found in the current workspace.",
              macro_staff_only: "Only staff can apply suggested macros.",
              no_macro: "The selected recommendation has no suggested macro.",
              not_found: "No pending recommendation matches that identifier.",
              playbook_not_found: "That playbook was not found in the operational catalog.",
              recommendation_staff_only: "Only staff can manage playbook recommendations.",
              staff_only: "Only staff can review operational playbooks.",
              ticket_only: "This command must be used inside a ticket channel.",
              unknown_subcommand: "Unknown playbook subcommand."
            },
            event_applied_title: "Suggested macro applied",
            event_confirmed_title: "Recommendation confirmed from Discord",
            event_description: "{{user}} marked recommendation {{id}} as {{status}}.",
            event_dismissed_title: "Recommendation dismissed from Discord",
            event_macro_description: "{{user}} posted macro {{label}} from an operational recommendation.",
            field_catalog: "Catalog",
            field_current_plan: "Current Plan",
            field_enabled_count: "Enabled",
            field_enabled_playbooks: "Enabled Playbooks",
            field_pending_recommendations: "Pending Recommendations",
            group_description: "Review and manage operational playbooks",
            list_description: "List all playbooks and active recommendations",
            list_description_generic: "You can manage playbooks from any channel, but live recommendations only appear when the command is run inside a ticket.",
            list_title: "Server Operational Playbooks",
            live_description: "Operational snapshot for the current ticket with recommendations ready to confirm, dismiss, or apply.",
            live_footer: "Use /ticket playbook confirm, dismiss, or apply-macro to act on them.",
            live_title: "Live Playbooks - Ticket #{{id}}",
            macro_internal_note: "Playbook suggested internal note:\n{{content}}",
            option_playbook: "Playbook ID from the catalog",
            option_recommendation: "Recommendation ID or Playbook ID",
            playbooks_empty: "No enabled playbooks",
            recommendations_empty: "No pending recommendations for this ticket.",
            success_confirmed: "✅ Recommendation `{{id}}` was confirmed.",
            success_disabled: "✅ `{{label}}` is now disabled for this guild.",
            success_dismissed: "✅ Recommendation `{{id}}` was dismissed.",
            success_enabled: "✅ `{{label}}` is now enabled for this guild.",
            success_enabled_locked: "✅ `{{label}}` is marked as enabled, but it will stay locked until the guild upgrades from the current plan (`{{plan}}`).",
            success_macro_applied: "✅ Macro `{{label}}` posted and recommendation applied."
          },
          subcommands: {
            "auto-assignment": {
              description: "Configure auto-assignment behavior"
            },
            "control-embed": {
              description: "Customize the ticket control embed"
            },
            panel: {
              description: "Publish or update the ticket panel"
            },
            "panel-style": {
              description: "Set the ticket panel style"
            },
            sla: {
              description: "Configure SLA warning and escalation"
            },
            "sla-rule": {
              description: "Add or update an SLA rule by priority or category"
            },
            "welcome-message": {
              description: "Set a custom welcome message for new tickets"
            }
          }
        },
        welcome: {
          description: "Configure welcome messages and onboarding prompts",
          options: {
            channel: "Welcome channel",
            dm_enabled: "Whether welcome DMs remain enabled",
            dm_message: "DM content. Variables: {{vars}}",
            enabled: "Whether welcome messages remain enabled",
            footer_text: "Footer text",
            hex: "Hex color without `#`",
            role: "Role to assign on join (leave empty to disable)",
            show: "Show the member avatar",
            text: "Message content",
            title_text: "Embed title",
            url: "Image URL starting with `https://`"
          },
          subcommands: {
            autorole: {
              description: "Set the role assigned automatically on join"
            },
            avatar: {
              description: "Show or hide the new member avatar"
            },
            banner: {
              description: "Set or clear the welcome banner image"
            },
            channel: {
              description: "Set the channel used for welcome messages"
            },
            color: {
              description: "Set the welcome embed color (hex)"
            },
            dm: {
              description: "Configure the welcome direct message"
            },
            enabled: {
              description: "Enable or disable welcome messages"
            },
            footer: {
              description: "Update the welcome embed footer"
            },
            message: {
              description: "Update the welcome message. Variables: {{vars}}"
            },
            test: {
              description: "Send a test welcome message"
            },
            title: {
              description: "Update the welcome embed title"
            }
          }
        }
      },
      options: {
        language_value: "Language to use for visible bot responses"
      },
      subcommands: {
        language: {
          description: "Review or update the bot language for this server"
        }
      }
    },
    suggestions: {
      channel_description: "Set the channel used for suggestions",
      enabled_description: "Enable or disable suggestions",
      group_description: "Configure the suggestions system"
    },
    tickets: {
      auto_assignment_description: "Configure auto-assignment behavior",
      choice_mode_least_active: "Least active",
      choice_mode_random: "Random",
      choice_mode_round_robin: "Round robin",
      choice_sla_escalation: "Escalation",
      choice_sla_warning: "Warning",
      choice_style_buttons: "Buttons",
      choice_style_select: "Select menu",
      control_embed_description: "Customize the ticket control embed",
      daily_report_description: "Configure daily ticket reports",
      group_description: "Configure ticket system settings",
      incident_description: "Enable or disable incident mode",
      option_active: "Enable or disable",
      option_categories: "Affected categories (comma-separated IDs)",
      option_color: "Embed color (hex)",
      option_control_description: "Control embed description",
      option_control_footer: "Control embed footer",
      option_control_title: "Control embed title",
      option_enabled: "Enable or disable",
      option_escalation_channel: "Channel for escalation alerts",
      option_escalation_enabled: "Enable escalation",
      option_escalation_minutes: "Minutes before escalation",
      option_escalation_role: "Role to ping on escalation",
      option_incident_message: "Custom incident message",
      option_mode: "Assignment mode",
      option_panel_channel: "Channel to publish the ticket panel (optional, uses configured or current if not set)",
      option_panel_description: "Panel embed description",
      option_panel_footer: "Panel embed footer",
      option_panel_title: "Panel embed title",
      option_report_channel: "Channel for daily reports",
      option_require_online: "Require online status",
      option_reset: "Reset to default",
      option_respect_away: "Respect away status",
      option_rule_minutes: "Minutes threshold",
      option_rule_type: "Rule type",
      option_style: "Panel style",
      option_target_category: "Target category",
      option_target_priority: "Target priority",
      option_warning_minutes: "Minutes before SLA warning",
      option_welcome_message: "Welcome message content",
      panel_description: "Publish or update the ticket panel",
      panel_style_description: "Set the ticket panel style",
      sla_description: "Configure SLA warning and escalation",
      sla_rule_description: "Add or update an SLA rule by priority or category",
      welcome_message_description: "Set a custom welcome message for new tickets"
    },
    welcome: {
      autorole_description: "Set the role assigned automatically on join",
      autorole_disabled: "Auto role disabled.",
      autorole_set: "Auto role configured: {{role}}",
      avatar_description: "Show or hide the new member avatar",
      avatar_state: "Member avatar in welcome messages: **{{state}}**.",
      banner_configured: "Welcome banner configured.",
      banner_description: "Set or clear the welcome banner image",
      banner_removed: "Welcome banner removed.",
      channel_description: "Set the channel used for welcome messages",
      channel_set: "Welcome channel set to {{channel}}.",
      color_description: "Set the welcome embed color (hex)",
      color_updated: "Welcome color updated to **#{{hex}}**.",
      dm_description: "Configure the welcome direct message",
      dm_message_note: "\nThe DM body was updated as well.",
      dm_state: "Welcome DM is now **{{state}}**.{{messageNote}}",
      enabled_description: "Enable or disable welcome messages",
      enabled_state: "Welcome messages are now **{{state}}**.",
      footer_description: "Update the welcome embed footer",
      footer_updated: "Welcome footer updated.",
      group_description: "Configure welcome messages and onboarding prompts",
      hidden: "Hidden",
      invalid_color: "Invalid color. Use a 6 character hex code like `{{example}}`.",
      invalid_url: "The URL must start with `https://`.",
      message_description: "Update the welcome message",
      message_updated: "Welcome message updated.\nAvailable variables: {{vars}}",
      test_channel_missing: "Configured welcome channel not found.",
      test_default_message: "Welcome {mention}!",
      test_default_title: "Welcome!",
      test_description: "Send a test welcome message",
      test_field_account_created: "Account created",
      test_field_member_count: "Member count",
      test_field_user: "User",
      test_message_suffix: "*(test message)*",
      test_requires_channel: "Configure a welcome channel first with `/setup welcome channel`.",
      test_sent: "Test welcome message sent to {{channel}}.",
      title_description: "Update the welcome embed title",
      title_updated: "Welcome title updated to **{{text}}**.",
      visible: "Visible"
    },
    wizard: {
      description: "Start the quick setup wizard",
      option_admin: "Role for ticket administrators",
      option_dashboard: "Channel for the ticket dashboard",
      option_logs: "Channel for ticket logs",
      option_plan: "System operation plan",
      option_publish_panel: "Publish the ticket panel immediately",
      option_sla_escalation: "Minutes before SLA escalation",
      option_sla_warning: "Minutes before first SLA warning",
      option_staff: "Role for support staff",
      option_transcripts: "Channel for ticket transcripts"
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
  "setup.automod.sync_summary_line": "Created {{created}}, updated {{updated}}, removed {{removed}}, unchanged {{unchanged}}."
};
