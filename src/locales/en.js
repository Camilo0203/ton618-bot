module.exports = {
  common: {
    language: {
      en: "English",
      es: "Spanish",
    },
    value: {
      not_configured: "Not configured",
      not_published: "Not published",
      none: "None",
      no_data: "No data",
      no_recent_activity: "No recent activity.",
      system: "System",
      unknown_time: "unknown time",
    },
    buttons: {
      english: "English",
      spanish: "Español",
      confirm: "Confirm",
      cancel: "Cancel",
      help: "Help",
      enter_code: "Enter code",
      resend_code: "Resend code",
    },
    labels: {
      channel: "Channel",
      mode: "Mode",
      notes: "Notes",
      warnings: "Warnings",
      issues: "Issues",
      recent_activity: "Recent activity",
      verified_role: "Verified role",
      unverified_role: "Unverified role",
      log_channel: "Log channel",
      auto_kick: "Auto-kick",
      anti_raid: "Anti-raid",
      panel_message: "Panel message",
      question: "Question",
      expected_answer: "Expected answer",
      state: "State",
      status: "Status",
      reason: "Reason",
      current_language: "Current language",
      onboarding_status: "Onboarding status",
      last_updated: "Last updated",
      user: "User",
      category: "Category",
      priority: "Priority",
      assigned_to: "Assigned to",
      claimed_by: "Claimed by",
      ticket_id: "Ticket ID",
      created: "Created",
      uptime: "Uptime",
      servers: "Servers",
      users: "Users",
      channels: "Channels",
      build: "Build",
    },
    state: {
      enabled: "Enabled",
      disabled: "Disabled",
      ready: "Ready",
      operational_with_warnings: "Operational with warnings",
      needs_attention: "Needs attention",
      pending: "Pending",
      completed: "Completed",
    },
    setup_hint: {
      run_setup: "Next step: run `/setup` to continue the operational setup.",
    },
  },
  access: {
    owner_only: "This command is only for the bot owner.",
    admin_required: "You need administrator permissions to use this command.",
    staff_required: "You need staff permissions to use this command.",
    guild_only: "This command can only be used inside a server.",
    default: "You do not have permission to use this command.",
  },
  interaction: {
    rate_limit: {
      command:
        "Temporary limit for `/{{commandName}}`. Wait **{{retryAfterSec}}s** before trying again.",
      global:
        "You are going too fast. Wait **{{retryAfterSec}}s** before using another interaction.",
    },
    command_disabled: "The `/{{commandName}}` command is disabled in this server.",
    db_unavailable:
      "Database is temporarily unavailable. Please try again in a few seconds.",
    unexpected: "An unexpected error occurred.",
  },
  onboarding: {
    title: "Welcome to TON618 / Bienvenido a TON618",
    description:
      "Choose the primary language for this server / Elige el idioma principal de este servidor.",
    body:
      "TON618 can operate in English or Spanish. Pick the default language for this guild now. You can change it later with `/setup language`.",
    footer:
      "If nobody selects a language, TON618 will keep English as the default until it is configured manually.",
    posted_title: "Language onboarding sent",
    posted_description:
      "A language selection prompt was delivered for this server. TON618 will keep English until an administrator chooses a language.",
    confirm_title: "Server language updated",
    confirm_description:
      "TON618 will now operate in **{{label}}** for this server.",
    dm_fallback_subject: "TON618 language setup",
    dm_fallback_intro:
      "I could not post the onboarding prompt in a writable server channel, so I am sending it here.",
    delivery_failed:
      "TON618 joined the server, but I could not deliver the language onboarding prompt in a writable channel or DM.",
  },
  setup: {
    general: {
      language_set: "Bot language configured: **{{label}}**.",
      language_label_es: "Spanish",
      language_label_en: "English",
    },
    language: {
      title: "Server language",
      description:
        "Review or update the operational language TON618 uses in this server.",
      current_value: "TON618 is currently operating in **{{label}}**.",
      onboarding_completed: "Completed",
      onboarding_pending: "Pending",
      updated_value:
        "Language changed to **{{label}}**. TON618 will use this language for visible responses in this guild.",
      fallback_note:
        "Guilds without an explicit selection continue using English until an administrator sets a language.",
      audit_reason_manual: "manual_language_change",
      audit_reason_onboarding: "onboarding_language_selection",
    },
    panel: {
      owner_only: "Only the user who opened this panel can use it.",
      admin_only: "Only administrators can use this panel.",
      invalid_action: "Invalid action.",
      invalid_command: "No valid command was selected.",
      error_prefix: "Error: {{message}}",
      default_action_failed: "The action could not be applied.",
      default_reset_failed: "The reset could not be completed.",
      action_applied: "Action applied.",
      reset_applied: "Reset applied.",
    },
    commands: {
      mode_enable: "Enable",
      mode_status: "Status",
      mode_disable: "Disable",
      summary_available: "Available: **{{count}}**",
      summary_disabled: "Disabled: **{{count}}**",
      summary_current_mode: "Current mode: **{{mode}}**",
      summary_candidates: "Candidates in menu: **{{visible}}**{{hiddenText}}",
      hidden_suffix: " (+{{count}} hidden)",
      summary_result: "Result: {{notice}}",
      panel_title: "Server command controls",
      placeholder_action: "Select an action",
      option_disable_label: "Disable command",
      option_disable_description: "Block a command in this server",
      option_enable_label: "Enable command",
      option_enable_description: "Restore a previously disabled command",
      option_status_label: "Command status",
      option_status_description: "Check whether a command is enabled",
      option_list_label: "List disabled",
      option_list_description: "Show the disabled command summary",
      option_reset_label: "Reset all",
      option_reset_description: "Re-enable every disabled command",
      placeholder_target: "Command to {{action}}",
      no_candidates_label: "No commands available",
      no_candidates_description: "Switch actions to see more options",
      candidate_description_status: "Check current status",
      candidate_description_enable: "Enable command",
      candidate_description_disable: "Disable command",
      format_more: "- ... and {{count}} more",
      list_none:
        "No commands are disabled in this server.\nAvailable: **{{available}}** | Enabled: **{{enabled}}**.",
      list_heading: "Disabled commands ({{count}}):",
      list_footer: "Available: **{{available}}** | Enabled: **{{enabled}}**.",
      audit_disabled: "Command disabled",
      audit_enabled: "Command enabled",
      audit_reset: "Command reset",
      audit_updated: "Command update",
      audit_affected: "Affected command: `/{{command}}`",
      audit_global: "A global command change was applied.",
      audit_executed_by: "Executed by",
      audit_server: "Server",
      audit_before: "Before",
      audit_after: "After",
      list_embed_title: "Server commands",
      status_embed_title: "Command status",
      panel_notice:
        "Use the menus below to manage commands without typing names manually.",
      unknown_command: "The command `/{{command}}` does not exist in this bot.",
      status_result:
        "Status for `/{{command}}`: **{{state}}**.\nCurrently disabled commands: **{{count}}**.",
      reset_noop: "No commands were disabled. Nothing to reset.",
      reset_done: "Re-enabled **{{count}}** command(s).",
      missing_command_name: "You must provide a valid command name.",
      disable_setup_forbidden:
        "You cannot disable `/setup`, otherwise you could lock yourself out of configuration.",
      already_disabled: "The command `/{{command}}` was already disabled.",
      disabled_success: "Command `/{{command}}` disabled for this server.",
      already_enabled: "The command `/{{command}}` was already enabled.",
      enabled_success: "Command `/{{command}}` enabled again.",
    },
    welcome: {
      enabled_state: "Welcome messages are now **{{state}}**.",
      channel_set: "Welcome channel set to {{channel}}.",
      message_updated: "Welcome message updated.\nAvailable variables: {{vars}}",
      title_updated: "Welcome title updated to **{{text}}**.",
      invalid_color: "Invalid color. Use a 6 character hex code like `{{example}}`.",
      color_updated: "Welcome color updated to **#{{hex}}**.",
      footer_updated: "Welcome footer updated.",
      invalid_url: "The URL must start with `https://`.",
      banner_configured: "Welcome banner configured.",
      banner_removed: "Welcome banner removed.",
      visible: "Visible",
      hidden: "Hidden",
      avatar_state: "Member avatar in welcome messages: **{{state}}**.",
      dm_state: "Welcome DM is now **{{state}}**.{{messageNote}}",
      dm_message_note: "\nThe DM body was updated as well.",
      autorole_set: "Auto role configured: {{role}}",
      autorole_disabled: "Auto role disabled.",
      test_requires_channel:
        "Configure a welcome channel first with `/setup welcome channel`.",
      test_channel_missing: "Configured welcome channel not found.",
      test_default_title: "Welcome!",
      test_default_message: "Welcome {mention}!",
      test_field_user: "User",
      test_field_account_created: "Account created",
      test_field_member_count: "Member count",
      test_message_suffix: "*(test message)*",
      test_sent: "Test welcome message sent to {{channel}}.",
    },
    goodbye: {
      enabled_state: "Goodbye messages are now **{{state}}**.",
      channel_set: "Goodbye channel set to {{channel}}.",
      message_updated: "Goodbye message updated.\nAvailable variables: {{vars}}",
      title_updated: "Goodbye title updated to **{{text}}**.",
      invalid_color: "Invalid color. Use a 6 character hex code like `{{example}}`.",
      color_updated: "Goodbye color updated to **#{{hex}}**.",
      footer_updated: "Goodbye footer updated.",
      visible: "Visible",
      hidden: "Hidden",
      avatar_state: "Member avatar in goodbye messages: **{{state}}**.",
      test_requires_channel:
        "Configure a goodbye channel first with `/setup goodbye channel`.",
      test_channel_missing: "Configured goodbye channel not found.",
      test_default_title: "See you later",
      test_default_message: "**{user}** left the server.",
      test_field_user: "User",
      test_field_user_id: "User ID",
      test_field_remaining_members: "Remaining members",
      test_field_roles: "Roles",
      test_roles_value: "Test payload only",
      test_sent: "Test goodbye message sent to {{channel}}.",
    },
  },
  status: {
    commercial: "Commercial",
  },
  verify: {
    mode: {
      button: "Button",
      code: "DM code",
      question: "Question",
    },
    panel: {
      title: "Verification",
      description:
        "You need to verify before accessing the server. Click the button below to begin.",
      footer: "{{guild}} • Verification",
      start_label: "Verify me",
      help_label: "Help",
    },
    info: {
      title: "Verification Configuration",
      no_issues: "No issues detected.",
      protection_footer:
        "Protection: {{failures}} failed attempts -> {{minutes}}m cooldown",
      raid_action_pause: "Alert only",
      raid_action_kick: "Kick automatically",
    },
    inspection: {
      channel_missing: "Verification channel is not configured.",
      channel_deleted: "The configured verification channel no longer exists.",
      channel_permissions:
        "I cannot publish the panel in {{channel}}. Missing permissions: {{permissions}}.",
      verified_role_missing: "Verified role is not configured.",
      verified_role_deleted: "The configured verified role no longer exists.",
      verified_role_managed:
        "The verified role is managed by an integration and cannot be assigned by the bot.",
      verified_role_unmanageable:
        "I cannot manage the verified role {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      unverified_role_deleted:
        "The configured unverified role no longer exists.",
      unverified_role_managed:
        "The unverified role is managed by an integration and cannot be assigned by the bot.",
      unverified_role_unmanageable:
        "I cannot manage the unverified role {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      roles_same:
        "Verified role and unverified role cannot be the same role.",
      question_missing:
        "Question mode is enabled but the verification question is empty.",
      answer_missing:
        "Question mode is enabled but the expected answer is empty.",
      log_channel_deleted:
        "The configured verification log channel no longer exists.",
      log_channel_permissions:
        "I cannot write to {{channel}}. Missing permissions: {{permissions}}.",
      apply_verified_missing:
        "Verified role is not configured or no longer exists.",
      apply_verified_unmanageable:
        "I cannot assign {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      apply_unverified_unmanageable:
        "I cannot remove {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      apply_role_update_failed:
        "I could not update the verification roles.",
      welcome_autorole_missing:
        "The welcome auto-role is configured but no longer exists.",
      welcome_autorole_failed:
        "I could not assign the welcome auto-role {{role}}.",
      welcome_autorole_process_failed:
        "I could not process the welcome auto-role.",
      revoke_verified_unmanageable:
        "I cannot remove {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      revoke_unverified_unmanageable:
        "I cannot assign {{role}}. Move my role above it and keep `Manage Roles` enabled.",
      revoke_role_update_failed:
        "I could not update the verification roles.",
      publish_failed:
        "I could not send or edit the verification panel in {{channel}}. Verify that I can send messages and embeds there.",
    },
    command: {
      confirmation_dm: "Confirmation DM",
      operational_health: "Operational health",
      raid_threshold: "Raid threshold",
      raid_action: "Raid action",
      panel_saved_but_not_published:
        "The verification configuration was saved, but the panel could not be published.\n\n{{issues}}",
      panel_refreshed: "Verification panel refreshed.",
      panel_published: "Verification panel published.",
      setup_failed:
        "I cannot finish the setup yet.\n\n{{issues}}",
      setup_ready_title: "Verification Ready",
      setup_ready_description:
        "The verification system is configured and the live panel is available.",
      note_ticket_role_aligned:
        "Ticket minimum verification role was aligned automatically because it was not set.",
      note_question_mode:
        "Question mode is active. Use `/verify question` if you want to replace the default challenge.",
      panel_publish_failed:
        "The verification panel could not be published.\n\n{{issues}}",
      enable_failed:
        "I cannot enable verification yet.\n\n{{issues}}",
      enabled_state: "Verification is now **{{state}}**.",
      mode_failed:
        "I cannot switch to **{{mode}}** yet.\n\n{{issues}}",
      mode_changed:
        "Verification mode changed to **{{mode}}**. {{detail}}",
      question_updated: "Verification question updated.",
      message_require_one:
        "Provide at least one field to update: `title`, `description`, `color`, or `image`.",
      invalid_color:
        "Invalid color. Use a 6-character hex value like `57F287`.",
      invalid_image:
        "Image URL must start with `https://`.",
      message_updated: "Verification panel updated. {{detail}}",
      dm_updated:
        "Verification confirmation DM is now **{{state}}**.",
      auto_kick_disabled:
        "Auto-kick for unverified members is now **disabled**.",
      auto_kick_enabled:
        "Unverified members will be kicked after **{{hours}} hour(s)**.",
      anti_raid_enabled:
        "Anti-raid is now **enabled**.\nThreshold: **{{joins}} joins** in **{{seconds}}s**.\nAction: **{{action}}**.",
      anti_raid_disabled: "Anti-raid is now **disabled**.",
      logs_permissions:
        "I cannot use {{channel}} for verification logs. Missing permissions: {{permissions}}.",
      logs_set: "Verification logs will be sent to {{channel}}.",
      force_bot:
        "Bots cannot be verified through the member verification flow.",
      user_missing: "That user is not in this server.",
      force_failed:
        "I could not verify <@{{userId}}>.\n\n{{issues}}",
      force_success: "<@{{userId}}> was verified manually.{{warningText}}",
      unverify_bot: "Bots do not use the member verification flow.",
      unverify_failed:
        "I could not remove verification from <@{{userId}}>.\n\n{{issues}}",
      unverify_success:
        "Verification removed from <@{{userId}}>.{{warningText}}",
      stats_title: "Verification Stats",
      stats_footer: "Stored verification events: {{total}}",
      unknown_subcommand: "Unknown verification subcommand.",
      force_log_title: "Member force-verified",
      unverify_log_title: "Member unverified",
      actor: "Actor",
      member: "Member",
      verified: "Verified",
      failed: "Failed",
      kicked: "Kicked",
      starts: "Starts",
      force_verified: "Force verified",
      force_unverified: "Force unverified",
      pending_members: "Pending members",
      verified_members: "Verified members",
      code_sends: "Code sends",
      question_prompts: "Question prompts",
      anti_raid_triggers: "Anti-raid triggers",
      permission_errors: "Permission errors",
    },
    handler: {
      not_active: "Verification is not active in this server.",
      member_not_found:
        "Your member profile could not be found in this server.",
      already_verified: "You are already verified in this server.",
      misconfigured:
        "Verification is currently misconfigured.\n\n{{issues}}",
      too_many_attempts:
        "Too many failed attempts. Try again {{retryText}}.",
      code_dm_title: "Verification Code",
      code_dm_description:
        "Your verification code for **{{guild}}** is:\n\n# `{{code}}`\n\nThis code expires in **10 minutes**.\nReturn to the server and click **{{enterCodeLabel}}**.",
      dm_failed:
        "I could not send you a DM.\n\nEnable direct messages for this server and try again.",
      code_sent_title: "Code sent by DM",
      code_sent_description:
        "A 6-character code was sent to your direct messages.\n\n1. Open your DM inbox and copy the code.\n2. Return here and click **{{enterCodeLabel}}**.\n\nThe code expires in **10 minutes**.",
      code_sent_footer:
        "Resends are limited. Wait {{seconds}}s before requesting a new code.",
      question_missing:
        "No verification question is configured. Ask an admin to run `/verify question`.",
      question_modal_title: "Verification Question",
      question_placeholder: "Type your answer here",
      mode_invalid: "Verification mode is not configured correctly.",
      help_title: "How verification works",
      help_mode_button:
        "Click **Verify me** and the bot will verify you immediately.",
      help_mode_code:
        "Click **Verify me**, check your DM inbox for the code, then enter it in the modal.",
      help_mode_question:
        "Click **Verify me** and answer the verification question correctly.",
      help_dm_problems_label: "DM problems?",
      help_dm_problems:
        "Enable direct messages for this server and try again.",
      help_attempts_label: "Attempts protection",
      help_attempts:
        "After {{failures}} failed attempts, verification pauses for {{minutes}} minutes.",
      help_blocked_label: "Still blocked?",
      help_blocked: "Contact a server admin for manual help.",
      enter_code_title: "Enter your code",
      enter_code_label: "Code received by DM",
      enter_code_placeholder: "Example: AB1C2D",
      not_code_mode: "This verification mode does not use DM codes.",
      code_reason_no_code:
        "No pending code was found. Click **Verify me** to generate a new one.",
      code_reason_expired:
        "Your code expired. Click **Verify me** to generate a new one.",
      code_reason_wrong: "Incorrect code. Try again.",
      invalid_code: "Invalid verification code.",
      incorrect_answer:
        "Incorrect answer. Read the question carefully and try again.{{cooldownText}}",
      resend_wait:
        "Please wait before requesting another code. You can retry {{retryText}}.",
      new_code_title: "New verification code",
      new_code_description:
        "Your new verification code is:\n\n# `{{code}}`\n\nThis code expires in **10 minutes**.",
      resend_dm_failed:
        "I could not send you a DM. Enable direct messages and try again.",
      resend_success: "A new verification code was sent by DM.",
      completion_failed:
        "I could not finish your verification because the role setup is not operational.\n\n{{issues}}",
      completed_title: "Verification completed",
      completed_description:
        "Welcome to **{{guild}}**, <@{{userId}}>. You now have full access to the server.",
      verified_dm_title: "You are verified",
      verified_dm_description:
        "You were verified successfully in **{{guild}}**.",
      log_verified_title: "Member verified",
      log_warning_none: "None",
    },
  },
  staff: {
    moderation_required:
      "You need the `Moderate Members` permission for this subcommand.",
    only_staff: "Only staff can use this command.",
    away_on_title: "Away mode enabled",
    away_on_description:
      "Your status is now **away**.{{reasonText}}",
    away_on_footer: "Use /staff away-off when you are available again",
    away_off: "You are now **available** for ticket work again.",
    my_tickets_title: "My Tickets ({{count}})",
    my_tickets_empty: "You do not currently own or hold any open tickets.",
    ownership_claimed: "Claimed",
    ownership_assigned: "Assigned",
    ownership_watching: "Watching",
  },
  stats: {
    server_title: "Ticket Operations - {{guild}}",
    total: "Total",
    open: "Open",
    closed: "Closed",
    today: "Today",
    week: "This week",
    avg_rating: "Average rating",
    avg_response: "Avg response",
    avg_close: "Avg close",
    opened: "Opened",
    no_data: "No data",
    sla_title: "SLA - {{guild}}",
    sla_description:
      "Operational SLA view for first response and escalation pressure.",
    sla_threshold: "SLA threshold",
    escalation: "Escalation",
    escalation_threshold: "Escalation threshold",
    sla_overrides: "SLA overrides",
    escalation_overrides: "Escalation overrides",
    open_out_of_sla: "Open tickets out of SLA",
    open_escalated: "Open escalated tickets",
    avg_first_response: "Avg first response",
    sla_compliance: "SLA compliance",
    tickets_evaluated: "Tickets evaluated",
    no_sla_threshold: "No SLA threshold or no responses yet",
    not_configured: "Not configured",
    staff_no_data_title: "No data",
    staff_no_data_description: "<@{{userId}}> does not have stats yet.",
    no_ratings_yet: "No ratings yet",
    ratings_count: "{{count}} ratings",
    staff_title: "Staff Stats - {{user}}",
    closed_tickets: "Closed tickets",
    claimed_tickets: "Claimed tickets",
    assigned_tickets: "Assigned tickets",
    average_rating: "Average rating",
    leaderboard_title: "Staff Leaderboard",
    leaderboard_empty: "There is no staff data yet.",
    leaderboard_closed: "closed",
    leaderboard_claimed: "claimed",
    ratings_title: "Ratings Leaderboard",
    ratings_empty: "There are no ratings yet.",
    period_all: "All time",
    period_month: "Last month",
    period_week: "Last week",
    fallback_user: "User {{suffix}}",
    fallback_staff: "Staff {{suffix}}",
    staff_rating_title: "Ratings - {{user}}",
    staff_rating_empty:
      "This staff member does not have recorded ratings yet.",
    average_score: "Average score",
    total_ratings: "Total ratings",
  },
  commercial: {
    lines: {
      current_plan: "Current plan: `{{plan}}`",
      stored_plan: "Stored plan: `{{plan}}`",
      plan_source: "Plan source: `{{source}}`",
      plan_expires: "Plan expires: {{value}}",
      supporter: "Supporter: {{value}}",
      status_expired: "Plan status: `expired -> running as free`",
      plan_note: "Plan note: {{note}}",
      supporter_expires: "Supporter expires: `{{date}}`",
    },
    values: {
      unknown: "unknown",
      never: "Never",
      enabled: "Enabled",
      inactive: "Inactive",
    },
    pro_required: {
      title: "Pro required",
      description:
        "**{{feature}}** is part of the Pro plan.\nAsk the bot owner to activate Pro for this server manually.",
      current_plan: "Current plan",
      supporter: "Supporter",
      footer:
        "Donations never unlock premium features. Supporter status is recognition only.",
    },
  },
  audit: {
    unsupported_subcommand: "Unsupported subcommand.",
    invalid_from: "`from` must use the YYYY-MM-DD format.",
    invalid_to: "`to` must use the YYYY-MM-DD format.",
    invalid_range: "`from` cannot be greater than `to`.",
    title: "Ticket audit",
    empty: "No tickets matched those filters.",
    export_title: "Ticket audit export",
    rows: "Rows",
    status: "Status",
    priority: "Priority",
    category: "Category",
    from: "From",
    to: "To",
    all: "all",
  },
  debug: {
    access_denied: "You do not have permission to use debug commands.",
    unknown_subcommand: "Unknown subcommand.",
    no_connected_guilds: "There are no connected guilds.",
    title: {
      status: "Bot Status",
      automod: "AutoMod Badge Progress",
      health: "Bot Health",
      memory: "Memory Usage",
      cache: "Cache State",
      guilds: "Connected Guilds",
      voice: "Music Subsystem",
      entitlements: "Guild Entitlements",
      plan_updated: "Plan Updated",
      supporter_updated: "Supporter Updated",
    },
    description: {
      automod:
        "Owner-only live count of TON618-managed AutoMod rules across connected guilds.",
      health: "Active-window snapshot plus the latest persisted heartbeat.",
      cache: "Discord.js manages cache automatically.",
      voice: "Music queues are managed per guild.",
    },
    field: {
      api_ping: "API ping",
      uptime: "Uptime",
      guilds: "Guilds",
      cached_users: "Cached users",
      cached_channels: "Cached channels",
      deploy: "Deploy",
      progress: "Progress",
      guild_coverage: "Guild Coverage",
      quick_state: "Quick state",
      interaction_window: "Interaction window",
      heartbeat: "Heartbeat",
      top_errors: "Top errors",
      rss: "RSS",
      heap_total: "Heap total",
      heap_used: "Heap used",
      external: "External",
      users: "Users",
      channels: "Channels",
      guilds_live_rules: "Guilds With Live TON618 Rules",
      guilds_attention: "Guilds Needing Attention",
    },
    value: {
      app_flag_present: "App flag present: {{value}}",
      managed_rules: "Managed rules: `{{count}}`",
      remaining_to_goal: "Remaining to {{goal}}: `{{count}}`",
      automod_enabled: "AutoMod enabled: `{{count}}`",
      missing_permissions: "Missing permissions: `{{count}}`",
      failed_partial_sync: "Failed or partial sync: `{{count}}`",
      ping_state: "Ping: **{{state}}** ({{value}}ms, threshold {{threshold}}ms)",
      error_rate: "Error rate: **{{state}}** ({{value}}%, threshold {{threshold}}%)",
      interaction_totals:
        "Total: `{{total}}`\nOK/Error/Denied/Rate: `{{ok}}/{{errors}}/{{denied}}/{{rateLimited}}`",
      heartbeat:
        "Last seen: `{{lastSeen}}`\nGuilds: `{{guilds}}`",
      yes: "Yes",
      no: "No",
      high: "HIGH",
      ok: "OK",
    },
  },
  ticket: {
    footer: "TON618 Tickets",
    error_label: "Error",
    field_category: "Category",
    field_priority: "Priority",
    field_assigned_to: "Assigned to",
    priority: {
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
    },
    workflow: {
      waiting_staff: "Waiting for staff",
      waiting_user: "Waiting for user",
      triage: "Under review",
      assigned: "Assigned",
      open: "Open",
      closed: "Closed",
    },
    quick_actions: {
      priority_low: "Priority: Low",
      priority_normal: "Priority: Normal",
      priority_high: "Priority: High",
      priority_urgent: "Priority: Urgent",
      status_wait: "Status: Waiting for staff",
      status_pending: "Status: Waiting for user",
      status_review: "Status: Under review",
      placeholder: "Quick staff actions...",
    },
    quick_feedback: {
      only_staff: "Only staff can use these actions.",
      not_found: "Ticket information was not found.",
      closed: "Quick actions are not available on closed tickets.",
      priority_event_title: "Priority updated",
      priority_event_description:
        "{{userTag}} updated ticket #{{ticketId}} priority to {{priority}} from quick actions.",
      priority_updated:
        "Ticket priority updated to **{{label}}** by <@{{userId}}>.",
      workflow_event_title: "Workflow status updated",
      workflow_event_description:
        "{{userTag}} updated ticket #{{ticketId}} workflow status to {{status}} from quick actions.",
      workflow_updated:
        "Ticket status updated to **{{label}}** by <@{{userId}}>.",
      add_staff_prompt: "Mention the staff member you want to add to this ticket.",
      unknown_action: "Unknown action.",
      processing_error: "There was an error while processing this action.",
    },
    buttons: {
      close: "Close",
      claim: "Claim",
      claimed: "Claimed",
      transcript: "Transcript",
    },
    rating: {
      invalid_identifier_title: "Could not save your rating",
      invalid_identifier_description:
        "The identifier for this rating prompt is invalid.",
      invalid_value_title: "Invalid rating",
      invalid_value_description: "Select a score between 1 and 5 stars.",
      prompt_title: "Rate the support you received",
      prompt_description:
        "Hi <@{{userId}}>, your ticket **#{{ticketId}}** has been closed.\n\n**Rating required:** you must rate this ticket before opening new tickets in the future.\n\nYour feedback helps us improve the service and maintain a strong support experience.",
      prompt_staff_label: "Staff member",
      prompt_category_fallback: "General",
      prompt_footer: "Your opinion matters to us",
      prompt_placeholder: "Select a rating...",
      prompt_option_1_label: "1 star",
      prompt_option_1_description: "The support did not meet my expectations",
      prompt_option_2_label: "2 stars",
      prompt_option_2_description: "The support was acceptable but needs improvement",
      prompt_option_3_label: "3 stars",
      prompt_option_3_description: "The support was solid and acceptable",
      prompt_option_4_label: "4 stars",
      prompt_option_4_description: "The support was very professional",
      prompt_option_5_label: "5 stars",
      prompt_option_5_description: "The support exceeded my expectations",
      resend_wrong_user: "This button can only be used by the matching user.",
      resend_clear:
        "**All clear!**\n\nYou no longer have any pending ticket ratings.\nYou can open a new ticket whenever you need one.",
      resend_sent:
        "**Rating prompts resent**\n\nWe resent **{{successCount}}** rating prompt(s) to your DMs.\n\n**Check your DMs** to rate the pending tickets.{{warning}}",
      resend_partial_warning:
        "Warning: {{failCount}} prompt(s) could not be resent.",
      resend_failed:
        "**Could not resend the rating prompts**\n\nMake sure your DMs are open and try again.",
      resend_error:
        "There was an error while resending the rating prompts. Please try again later.",
      not_found_title: "Ticket not found",
      not_found_description:
        "I could not find the ticket linked to this rating prompt.",
      unavailable_title: "Rating unavailable",
      unavailable_description:
        "Only the creator of this ticket can submit this rating.",
      already_recorded_title: "Rating already recorded",
      already_recorded_description:
        "You already rated this ticket with **{{rating}} star(s)**.",
      already_recorded_processing:
        "This ticket was rated while your response was being processed.",
      event_title: "Rating received",
      event_description:
        "{{userTag}} rated ticket #{{ticketId}} with {{rating}}/5.",
      thanks_title: "Thanks for your rating",
      thanks_description:
        "You rated the support experience **{{rating}} star(s)**.\n\nYour feedback was recorded successfully and helps improve the service.",
      save_failed_title: "Could not save your rating",
      save_failed_description:
        "An unexpected error occurred. Please try again later.",
    },
    move_select: {
      move_failed:
        "I could not move the ticket right now. Please try again later.",
    },
    transcript_button: {
      not_ticket:
        "I could not generate the transcript because this channel is no longer registered as a ticket.",
      unavailable_now: "I could not generate the ticket transcript right now.",
      intro: "Here is the manual transcript for this ticket:",
      error: "There was an error while generating the transcript. Please try again later.",
    },
    close_button: {
      already_closed: "This ticket is already closed.",
      bot_member_missing: "I could not verify my permissions in this server.",
      missing_manage_channels:
        "I need the `Manage Channels` permission to close tickets.",
      permission_denied_title: "Permission denied",
      permission_denied_description: "Only staff can close tickets.",
      modal_title: "Close ticket #{{ticketId}}",
      reason_label: "Closing reason",
      reason_placeholder:
        "Example: resolved, duplicate, request completed...",
      notes_label: "Internal notes",
      notes_placeholder: "Extra staff-only notes...",
      close_note_event_title: "Close note added",
      close_note_event_description:
        "{{userTag}} added an internal close note before closing ticket #{{ticketId}}.",
      processing_title: "Processing closure",
      processing_description:
        "Starting the close workflow and transcript generation...",
      auto_close_failed:
        "I could not close the ticket automatically. Please try again or notify an administrator.",
      modal_error:
        "There was an error while processing the ticket closure. Please try again later.",
      open_form_error:
        "There was an error while opening the close form. Please try again.",
    },
    defaults: {
      public_panel_title: "Need help? We're here for you.",
      public_panel_description:
        "Open a private ticket by selecting the category that best fits your request.",
      public_panel_footer: "{guild} • Professional support",
      welcome_message:
        "Hi {user}, your ticket **{ticket}** has been created. Please share as much detail as possible.",
      control_panel_title: "Ticket Control Panel",
      control_panel_description:
        "This is the control panel for ticket **{ticket}**.\nUse the controls below to manage this ticket.",
      control_panel_footer: "{guild} • TON618 Tickets",
    },
    panel: {
      categories_heading: "Choose a category",
      categories_cta: "Choose an option from the menu below to get started.",
      queue_name: "Current queue",
      queue_value:
        "We currently have `{{openTicketCount}}` active ticket(s). We will reply as soon as possible.",
      faq_button: "Frequently Asked Questions",
    },
    create_flow: {
      system_not_configured_title: "Ticket system not configured",
      system_not_configured_description:
        "The ticket system is not configured correctly.\n\n**Problem:** there are no ticket categories configured.\n\n**Fix:** an administrator must create categories with:\n`/config category add`\n\nContact the server administration team to resolve this issue.",
      system_not_configured_footer: "TON618 Tickets - Configuration error",
      category_not_found: "Category not found.",
      invalid_form: "The form is not valid. Please expand the first answer.",
      min_days_required:
        "You must be in the server for at least **{{days}} day(s)** to open a ticket.",
      blacklisted:
        "You are blacklisted.\n**Reason:** {{reason}}",
      verify_role_required:
        "You need the role <@&{{roleId}}> to open tickets.",
      pending_ratings_title: "Pending ticket ratings",
      pending_ratings_description:
        "You have **{{count}}** closed ticket(s) waiting for a rating:\n\n{{tickets}}\n\n**Why does rating matter?**\nYour feedback helps us improve the service and is required before opening new tickets.\n\n**Check your DMs** to find the pending rating prompts.\nIf you cannot find them, use the button below to resend them.",
      pending_ratings_footer: "TON618 Tickets - Rating system",
      resend_ratings_button: "Resend rating prompts",
      duplicate_request:
        "A ticket creation request is already being processed for you. Please wait a few seconds.",
      global_limit:
        "This server reached the global limit of **{{limit}}** open tickets. Please wait until space is available.",
      user_limit:
        "You already have **{{openCount}}/{{maxPerUser}}** open tickets{{suffix}}",
      cooldown:
        "Please wait **{{minutes}} minute(s)** before opening another ticket.",
      missing_permissions:
        "I do not have the permissions required to create tickets.\n\nRequired permissions: Manage Channels, View Channel, Send Messages, Manage Roles.",
      self_permissions_error:
        "I could not verify my permissions in this server.",
      welcome_message_failed: "The welcome message could not be sent.",
      control_panel_failed: "The control panel could not be sent.",
      dm_created_title: "Ticket created",
      dm_created_description:
        "Your ticket **#{{ticketId}}** has been created in **{{guild}}**.\nChannel: <#{{channelId}}>\n\nWe will let you know when the staff replies.",
      created_success_title: "Ticket created successfully",
      created_success_description:
        "Your ticket has been created: <#{{channelId}}> | **#{{ticketId}}**\n\nPlease go to the channel to continue your request.{{warningText}}",
      submitted_form: "Submitted form",
      question_fallback: "Question {{index}}",
      general_category: "General",
    },
    create_errors: {
      reserve_number:
        "I could not reserve an internal ticket number. Please try again in a few seconds.",
      duplicate_number:
        "There was an internal conflict while numbering the ticket. Please try again.",
      missing_permissions:
        "I do not have enough permissions to create or prepare the ticket channel.",
      generic:
        "There was an error while creating the ticket. Verify my permissions or contact an administrator.",
    },
    faq: {
      title: "Frequently Asked Questions",
      description:
        "Here are the most common answers people need before opening a ticket. A quick check here can save you waiting time.",
      q1_question: "How do I buy a product or membership?",
      q1_answer:
        "Go to our official store, or open a ticket in the **Sales** category if you need step-by-step help.",
      q2_question: "How do I request a refund?",
      q2_answer:
        "Open a **Support / Billing** ticket and include your payment receipt plus transaction ID so the team can review it.",
      q3_question: "I want to report a user",
      q3_answer:
        "For a valid report, include clear screenshots or videos and explain the situation in a **Reports** ticket.",
      q4_question: "I want to apply for a partnership",
      q4_answer:
        "Partnership requests are handled through **Partnership** tickets. Make sure you meet the minimum requirements first.",
      footer:
        "Still need help? Pick a category from the dropdown menu to open a ticket.",
      load_failed:
        "We could not load the FAQ right now. Please try again later.",
    },
    picker: {
      access_denied_title: "Access denied",
      access_denied_description:
        "You cannot create tickets right now.\n**Reason:** {{reason}}",
      access_denied_footer:
        "If you think this is a mistake, contact an administrator.",
      limit_reached_title: "Ticket limit reached",
      limit_reached_description:
        "You already have **{{openCount}}/{{maxTickets}}** open tickets.\n\n**Your active tickets:**\n{{ticketList}}\n\nClose one of your current tickets before opening a new one.",
      no_categories:
        "There are no ticket categories configured for this server.",
      select_title: "Create a new ticket",
      select_description:
        "Select the category that best fits your request so the right team can help you faster.\n\nEach category routes your request to the appropriate staff.",
      select_placeholder: "Select the ticket type...",
      processing_error:
        "There was an error while preparing the ticket form. Please try again later.",
      category_missing:
        "That category was not found or is not available right now. Please choose a different option.",
      cooldown:
        "Please wait **{{minutes}} minute(s)** before opening another ticket.\n\nThis cooldown helps the team manage incoming requests more effectively.",
      min_days:
        "You must be in the server for at least **{{days}} day(s)** to open a ticket.\n\nCurrent time in server: **{{currentDays}} day(s)**",
      pending_ratings_title: "Pending ticket ratings",
      pending_ratings_description:
        "You have **{{count}}** closed ticket(s) waiting for a rating:\n\n{{tickets}}\n\n**Why does rating matter?**\nYour feedback helps us improve the service and is required before opening new tickets.\n\n**Check your DMs** to find the pending rating prompts.\nIf you cannot find them, use the button below to resend them.",
      pending_ratings_footer: "TON618 Tickets - Rating system",
      resend_ratings_button: "Resend rating prompts",
    },
    modal: {
      category_unavailable:
        "This ticket category is no longer available. Please start again.",
      first_answer_short:
        "Your first answer is too short. Add more context before creating the ticket.",
    },
    maintenance: {
      title: "System under maintenance",
      description:
        "The ticket system is temporarily disabled.\n\n**Reason:** {{reason}}\n\nPlease come back later.",
      scheduled: "Scheduled maintenance",
    },
    command: {
      unknown_subcommand: "Unknown ticket subcommand.",
      not_ticket_channel: "This is not a ticket channel.",
      only_staff_close: "Only staff can close tickets.",
      only_staff_reopen: "Only staff can reopen tickets.",
      only_staff_claim: "Only staff can claim tickets.",
      release_denied: "You do not have permission to release this ticket.",
      only_staff_assign: "Only staff can assign tickets.",
      only_staff_add: "Only staff can add users to the ticket.",
      only_staff_remove: "Only staff can remove users from the ticket.",
      only_staff_rename: "Only staff can rename tickets.",
      valid_channel_name: "Provide a valid channel name.",
      channel_renamed: "Channel renamed to **{{name}}**",
      closed_priority_denied: "You cannot change the priority of a closed ticket.",
      only_staff_priority: "Only staff can change ticket priority.",
      priority_updated: "Priority updated to **{{label}}**",
      only_staff_move: "Only staff can move tickets.",
      no_other_categories: "No other categories are available.",
      move_select_description: "Select the category you want to move this ticket to:",
      move_select_placeholder: "Select the new category...",
      only_staff_transcript: "Only staff can generate transcripts.",
      transcript_failed: "Failed to generate the transcript.",
      transcript_generated: "Transcript generated.",
      only_staff_brief: "Only staff can view the case brief.",
      only_staff_info: "Only staff can view ticket details.",
      only_staff_other_history: "Only staff can view another user's ticket history.",
      history_title: "Ticket history for {{user}}",
      history_empty: "<@{{userId}}> has no tickets in this server.",
      history_summary: "Summary",
      history_open_now: "Open now",
      history_recently_closed: "Recently closed",
      no_rating: "No rating",
      history_summary_value: "Total: **{{total}}** | Open: **{{open}}** | Closed: **{{closed}}**",
      only_staff_notes: "Only staff can view or add notes.",
      only_admin_clear_notes: "Only administrators can clear all ticket notes.",
      notes_cleared: "All ticket notes were cleared.",
      notes_cleared_event_description:
        "{{userTag}} cleared the internal notes for ticket #{{ticketId}}.",
      note_limit_reached:
        "Ticket note limit reached (**{{max}}** notes max per ticket). Use `/ticket note clear` if you need to clean them up.",
      note_added_title: "Internal note added",
      note_added_event_description:
        "{{userTag}} added an internal note to ticket #{{ticketId}}.",
      note_added_footer: "By {{userTag}} · {{count}}/{{max}}",
      notes_title: "Ticket notes",
      notes_empty: "There are no notes on this ticket yet.",
      notes_list_title: "Ticket notes — #{{ticketId}} ({{count}}/{{max}})",
      rename_event_title: "Channel renamed",
      rename_event_description:
        "{{userTag}} renamed ticket #{{ticketId}} to {{name}}.",
      priority_event_title: "Priority updated",
      priority_event_description:
        "{{userTag}} changed ticket #{{ticketId}} priority to {{label}}.",
    },
    lifecycle: {
      close: {
        already_closed: "This ticket is already closed.",
        verify_permissions: "I could not verify my permissions in this server.",
        manage_channels_required:
          "I need the `Manage Channels` permission to close this ticket.",
        already_closed_during_request:
          "This ticket was already closed while your request was being processed.",
        database_error:
          "There was an error while closing the ticket in the database. Please try again.",
        event_title: "Ticket closed",
        event_description:
          "{{userTag}} closed ticket #{{ticketId}}.",
        transcript_generate_failed:
          "The transcript could not be generated. The channel will remain closed to prevent history loss.",
        transcript_channel_missing:
          "No transcript channel is configured. The channel will remain closed and will not be deleted automatically.",
        transcript_channel_unavailable:
          "The configured transcript channel does not exist or is not accessible. The channel will not be deleted automatically.",
        transcript_send_failed:
          "The transcript could not be sent to the configured channel. The channel will not be deleted automatically.",
        transcript_generate_error:
          "There was an error generating the transcript. The channel will remain closed to prevent history loss.",
        dm_receipt_title: "Support receipt",
        dm_receipt_description:
          "Thanks for contacting our support team. Here is a summary of your ticket.",
        dm_field_ticket: "Ticket",
        dm_field_category: "Category",
        dm_field_opened: "Opened at",
        dm_field_closed: "Closed at",
        dm_field_duration: "Total duration",
        dm_field_reason: "Closing reason",
        dm_field_handled_by: "Handled by",
        dm_field_messages: "Messages",
        dm_field_transcript: "Online transcript",
        dm_transcript_link: "View full transcript",
        dm_no_reason: "No reason provided",
        dm_footer: "Thanks for trusting our support - TON618 Tickets",
        dm_warning_title: "Warning: DM not delivered",
        dm_warning_description:
          "The closing DM could not be sent to <@{{userId}}>.\n\n**Possible cause:** the user has DMs disabled or blocked the bot.\n\n**Ticket:** #{{ticketId}}",
        dm_warning_transcript: "Transcript available",
        dm_warning_unavailable: "Not available",
        warning_dm_failed: "The user could not be notified by DM.",
        warning_channel_not_deleted:
          "The channel will not be deleted automatically until the transcript is archived safely.",
        log_reason: "Reason",
        log_duration: "Duration",
        log_user: "User",
        log_transcript: "Transcript",
        log_unavailable: "Not available",
        result_closing_title: "Closing ticket",
        result_closed_title: "Ticket closed",
        result_closing_description:
          "This ticket will be deleted in **{{seconds}} seconds**.\n\n{{dmStatus}}",
        result_closed_description:
          "The ticket was closed, but the channel will remain available until the transcript can be archived safely.",
        result_dm_sent: "A summary was sent to the user by direct message.",
        result_dm_failed: "The user could not be notified by DM.",
        delete_reason: "Ticket closed",
        transcript_embed_title: "Ticket transcript",
        transcript_field_user: "User",
        transcript_field_duration: "Duration",
        transcript_field_staff: "Staff",
        transcript_field_closed: "Closed",
        transcript_field_messages: "Messages",
        transcript_field_rating: "Rating",
        transcript_rating_none: "No rating",
        transcript_closed_unknown: "Unknown",
        transcript_closed_unavailable: "Not available",
      },
      reopen: {
        already_open: "This ticket is already open.",
        verify_permissions: "I could not verify my permissions in this server.",
        manage_channels_required:
          "I need the `Manage Channels` permission to reopen this ticket.",
        user_missing: "I could not find the user who created this ticket.",
        reopened_during_request:
          "This ticket was already reopened while your request was being processed.",
        database_error:
          "There was an error while reopening the ticket in the database.",
        dm_title: "Ticket reopened",
        dm_description:
          "Your ticket **#{{ticketId}}** in **{{guild}}** was reopened by {{staff}}.\n\n**Channel:** [Go to ticket]({{channelLink}})\n\nYou can go back to the channel and continue the conversation.",
        result_title: "Ticket reopened",
        result_description:
          "Ticket **#{{ticketId}}** was reopened successfully.\n\n**Total reopens:** {{count}}{{dmLine}}{{warningLine}}",
        dm_line: "\nThe user was notified by DM.",
        warning_line: "\n\nWarning: {{warning}}",
        dm_warning:
          "The user could not be notified by DM (DMs may be disabled).",
      },
      claim: {
        closed_ticket: "You cannot claim a closed ticket.",
        staff_only: "Only staff can claim tickets.",
        verify_permissions: "I could not verify my permissions in this server.",
        manage_channels_required:
          "I need the `Manage Channels` permission to claim this ticket.",
        already_claimed_self: "You already claimed this ticket.",
        already_claimed_other:
          "Already claimed by <@{{userId}}>. Use `/ticket unclaim` first.",
        claimed_during_request:
          "This ticket was claimed by <@{{userId}}> while your request was being processed.",
        database_error:
          "There was an error while updating the ticket in the database. Please try again.",
        dm_title: "Your ticket is being handled",
        dm_description:
          "Your ticket **#{{ticketId}}** in **{{guild}}** now has an assigned staff member.\n\n**Assigned staff:** {{staff}}\n**{{categoryLabel}}:** {{category}}\n**Channel:** [Go to ticket]({{channelLink}})\n\nUse the link above to jump directly into your ticket and continue the conversation.",
        event_description:
          "{{userTag}} claimed ticket #{{ticketId}}.",
        result_title: "Ticket claimed",
        result_description:
          "You claimed ticket **#{{ticketId}}** successfully.{{dmLine}}{{warningBlock}}",
        dm_line: "\n\nThe user was notified by DM.",
        warning_permissions:
          "Your permissions could not be fully updated.",
        warning_dm:
          "The user could not be notified by DM (DMs disabled).",
        log_claimed_by: "Claimed by",
      },
      unclaim: {
        closed_ticket: "You cannot release a closed ticket.",
        not_claimed: "This ticket is not claimed.",
        denied:
          "Only the user who claimed the ticket or an administrator can release it.",
        database_error:
          "There was an error while updating the ticket in the database.",
        result_title: "Ticket released",
        event_description:
          "{{userTag}} released ticket #{{ticketId}}.",
        result_description:
          "The ticket has been released. Any staff member can claim it now.{{warningLine}}",
        warning_permissions:
          "Some permissions could not be restored completely.",
        log_released_by: "Released by",
        log_previous_claimer: "Previously claimed by",
      },
      assign: {
        closed_ticket: "You cannot assign a closed ticket.",
        staff_only: "Only staff can assign tickets.",
        bot_denied: "You cannot assign the ticket to a bot.",
        creator_denied:
          "You cannot assign the ticket to the user who created it.",
        staff_member_missing:
          "I could not find that staff member in this server.",
        invalid_assignee:
          "You can only assign the ticket to staff members (support role or administrator).",
        verify_permissions: "I could not verify my permissions in this server.",
        manage_channels_required:
          "I need the `Manage Channels` permission to assign tickets.",
        assign_permissions_error:
          "There was an error while granting permissions to the assigned staff member: {{error}}",
        database_error:
          "There was an error while updating the ticket in the database.",
        dm_title: "Ticket assigned",
        dm_description:
          "Ticket **#{{ticketId}}** in **{{guild}}** was assigned to you.\n\n**{{categoryLabel}}:** {{category}}\n**User:** <@{{userId}}>\n**Channel:** [Go to ticket]({{channelLink}})\n\nPlease review it as soon as possible.",
        event_description:
          "{{userTag}} assigned ticket #{{ticketId}} to {{staffTag}}.",
        result_title: "Ticket assigned",
        result_description:
          "Ticket **#{{ticketId}}** was assigned to <@{{staffId}}>.{{dmLine}}{{warningLine}}",
        dm_line: "\n\nThe staff member was notified by DM.",
        dm_warning:
          "The staff member could not be notified by DM (DMs disabled).",
        log_assigned_to: "Assigned to",
        log_assigned_by: "Assigned by",
      },
      members: {
        add: {
          closed_ticket: "You cannot add users to a closed ticket.",
          bot_denied: "You cannot add bots to the ticket.",
          creator_denied: "That user already owns this ticket.",
          verify_permissions: "I could not verify my permissions in this server.",
          manage_channels_required:
            "I need the `Manage Channels` permission to add users.",
          permissions_error:
            "There was an error while granting permissions to the user: {{error}}",
          event_title: "User added",
          event_description:
            "{{userTag}} added {{targetTag}} to ticket #{{ticketId}}.",
          result_title: "User added",
          result_description:
            "<@{{userId}}> was added to the ticket and can now see the channel.",
        },
        remove: {
          closed_ticket: "You cannot remove users from a closed ticket.",
          creator_denied: "You cannot remove the ticket creator.",
          bot_denied: "You cannot remove the bot from the ticket.",
          support_role_denied: "You cannot remove the support role from the ticket.",
          admin_role_denied: "You cannot remove the admin role from the ticket.",
          verify_permissions: "I could not verify my permissions in this server.",
          manage_channels_required:
            "I need the `Manage Channels` permission to remove users.",
          permissions_error:
            "There was an error while removing permissions from the user: {{error}}",
          event_title: "User removed",
          event_description:
            "{{userTag}} removed {{targetTag}} from ticket #{{ticketId}}.",
          result_title: "User removed",
          result_description:
            "<@{{userId}}> was removed from the ticket and can no longer view it.",
        },
        move: {
          closed_ticket: "You cannot move a closed ticket.",
          category_not_found: "Category not found.",
          already_in_category: "This ticket is already in that category.",
          verify_permissions: "I could not verify my permissions in this server.",
          manage_channels_required:
            "I need the `Manage Channels` permission to move tickets.",
          database_error:
            "There was an error while updating the ticket category in the database.",
          event_title: "Category updated",
          event_description:
            "{{userTag}} moved ticket #{{ticketId}} from {{from}} to {{to}}.",
          log_previous: "Previous",
          log_new: "New",
          log_priority: "Updated priority",
          result_title: "Category changed",
          result_description:
            "Ticket moved from **{{from}}** -> **{{to}}**\n\n**New priority:** {{priority}}",
        },
      },
    },
  },
  ping: {
    description: "View bot latency and stats",
    title: "PONG!",
    field: {
      latency: "Bot Latency",
      uptime: "Uptime",
      guilds: "Servers",
      users: "Users",
      channels: "Channels",
    },
  },
  errors: {
    language_permission:
      "Only a server administrator can choose the language for this guild.",
    language_save_failed:
      "I could not save the server language. TON618 will keep English until the configuration succeeds.",
    invalid_language_selection:
      "This language selection is no longer valid. Run `/setup language` to set it manually.",
  },
};
