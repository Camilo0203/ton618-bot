const fs = require('fs');
const path = 'c:\\Users\\Camilo\\Desktop\\ton618-bot\\src\\locales\\en.js';

let content = fs.readFileSync(path, 'utf8');

// Find a stable point before the mess. 
// "announcement_prefix": "📢 " is unique and towards the end.
const marker = '"announcement_prefix": "📢 "';
const index = content.indexOf(marker);

if (index === -1) {
    console.error("Marker not found!");
    process.exit(1);
}

// Keep everything up to the end of the announcement_prefix block
const closingBraceIndex = content.indexOf('}', index);
const endOfAnnouncementBlock = closingBraceIndex + 1; // Includes the closing brace for embed

const cleanPrefix = content.substring(0, endOfAnnouncementBlock);

const newTail = `
  },
  "profile": {
    "slash": {
      "description": "Simple profile: level + economy",
      "subcommands": {
        "view": { "description": "View a profile" },
        "top": { "description": "View leaderboard" }
      },
      "options": {
        "user": "User to query"
      }
    },
    "embed": {
      "title": "{{username}}'s Profile",
      "field_level": "Level",
      "field_total_xp": "Total XP",
      "field_rank": "Rank",
      "field_wallet": "Wallet",
      "field_bank": "Bank",
      "field_total": "Total Net",
      "user_fallback": "User #{{id}}",
      "top_title": "🏆 Server Leaderboard",
      "top_levels": "📊 Top Levels",
      "top_economy": "💰 Richest Members",
      "no_data": "No participants yet.",
      "level_format": "Level {{level}}",
      "coins_format": "{{amount}} coins",
      "page_format": "Page {{current}} of {{total}}"
    }
  },
  "staff": {
    "slash": {
      "description": "Staff-only management and moderation utilities",
      "subcommands": {
        "away_on": { "description": "Mark yourself as away with an optional reason" },
        "away_off": { "description": "Clear your away status and return to active" },
        "my_tickets": { "description": "Review your currently claimed and assigned tickets" },
        "warn_add": { "description": "Apply a formal warning to a member" },
        "warn_check": { "description": "Review a member's warning history" },
        "warn_remove": { "description": "Delete a specific warning by its unique ID" }
      },
      "options": {
        "reason": "Note explaining your away status",
        "user": "The member to inspect or warn",
        "warn_reason": "Description of the infraction",
        "warning_id": "The 6-character ID of the warning"
      }
    },
    "moderation_required": "You do not have sufficient permissions to manage member warnings."
  },
  "stats": {
    "slash": {
      "description": "High-fidelity ticket metrics and performance analytics",
      "subcommands": {
        "server": { "description": "Operational overview of ticket volume and response trends" },
        "sla": { "description": "Compliance report: time-to-first-response and escalation density" },
        "staff": { "description": "Deep dive into individual output and resolution efficiency" },
        "leaderboard": { "description": "Rank active staff by productivity and claiming speed" },
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
    "avg_rating": "Avg. Rating",
    "avg_response": "Avg. First Response",
    "avg_close": "Avg. Resolution Time",
    "no_data": "N/A",
    "staff_title": "Staff Profile: {{user}}",
    "closed_tickets": "Tickets Closed",
    "claimed_tickets": "Tickets Claimed",
    "assigned_tickets": "Tickets Assigned",
    "average_rating": "Average Rating",
    "ratings_count": "{{count}} ratings",
    "no_ratings_yet": "No ratings yet",
    "pro_consistent": "Consistent",
    "pro_top_performer": "Top Performer",
    "pro_needs_focus": "Needs Focus",
    "pro_metrics_title": "Pro Performance Intelligence",
    "pro_efficiency": "Resolution Efficiency",
    "pro_rating_quality": "Service Quality",
    "leaderboard_title": "Staff Performance Leaderboard",
    "leaderboard_closed": "closed",
    "leaderboard_claimed": "claimed",
    "leaderboard_empty": "No staff activity recorded yet.",
    "staff_rating_title": "Rating Density: {{user}}",
    "staff_rating_empty": "This staff member has not received any ratings yet.",
    "average_score": "Average Score",
    "total_ratings": "Total Ratings",
    "sla_title": "SLA Compliance Dashboard: {{guild}}",
    "sla_description": "Advanced metrics for response times and escalation management.",
    "sla_threshold": "SLA Threshold",
    "escalation": "Escalation Status",
    "escalation_threshold": "Escalation Threshold",
    "sla_overrides": "SLA Priority Rules",
    "escalation_overrides": "Escalation Rules",
    "open_out_of_sla": "Open Breached",
    "open_escalated": "Currently Escalated",
    "avg_first_response": "Avg. First Response",
    "sla_compliance": "SLA Compliance Rate",
    "tickets_evaluated": "Evaluated Tickets"
  },
  "poll": {
    "slash": {
      "description": "Interactive poll and voting system",
      "subcommands": {
        "create": { "description": "Initialize a new interactive poll" },
        "end": { "description": "Prematurely conclude an active poll" },
        "list": { "description": "Review all currently active polls in the server" }
      },
      "options": {
        "question": "Poll question",
        "options": "Choices separated by | (e.g. Yes | No | Maybe)",
        "duration": "Duration (e.g. 1h, 30m, 2d)",
        "multiple": "Allow multiple choices per member",
        "channel": "Destination channel for the poll",
        "anonymous": "Hide live results until the poll ends (Pro)",
        "required_role": "Limit voting to a specific role (Pro)",
        "max_votes": "Maximum choices per user (Pro)",
        "id": "6-character poll identifier"
      }
    },
    "embed": {
      "created_title": "Poll Created",
      "created_description": "Your poll has been successfully published to {{channel}}.",
      "field_question": "Question",
      "field_options": "Options",
      "field_ends": "Ends At",
      "field_in": "Finishes",
      "field_mode": "Voting Mode",
      "field_id": "Poll ID",
      "mode_multiple": "Multiple Choice",
      "mode_single": "Single Choice",
      "active_title": "Server Active Polls",
      "active_empty": "There are no active polls in this server right now.",
      "active_count_title": "Active Polls ({{count}})",
      "active_footer": "Use /poll end <id> to conclude a poll manually.",
      "active_item_votes": "votes"
    },
    "errors": {
      "pro_required": "✨ **Pro Feature**: Advanced poll options (anonymous, role-restricted, etc.) require a Pro subscription.",
      "min_options": "You must provide at least 2 distinct choices.",
      "max_options": "A maximum of 10 choices is supported per poll.",
      "option_too_long": "Individual choices cannot exceed 80 characters.",
      "min_duration": "The minimum duration is 1 minute.",
      "max_duration": "The maximum duration is 30 days.",
      "poll_not_found": "Could not find an active poll with ID `{{id}}`.",
      "manage_messages_required": "You require 'Manage Messages' permission to end polls manually."
    },
    "success": {
      "ended": "✅ Poll **\"{{question}}\"** has been concluded."
    },
    "placeholder": "Preparing poll content..."
  },
  "config": {
    "slash": {
      "description": "Premium administration and server configuration console",
      "subcommands": {
        "status": { "description": "Display general system and commercial status" },
        "tickets": { "description": "Review ticket system operational health" },
        "center": { "description": "Open the interactive configuration center" }
      }
    },
    "category": {
      "group_description": "Manage ticket categories and triage rules",
      "add_description": "Initialize a new ticket category",
      "remove_description": "Permanently delete a category from the server",
      "list_description": "List all active ticket categories",
      "edit_description": "Update settings for an existing category",
      "toggle_description": "Activate or deactivate a category",
      "option_id": "Category identifier",
      "option_discord_category": "Target Discord category ID",
      "option_id_remove": "Category ID to delete",
      "option_id_edit": "Category ID to modify",
      "option_label": "Display label for users",
      "option_description": "Detailed category description",
      "option_emoji": "Category emoji",
      "option_priority": "Default ticket priority",
      "option_discord_category_edit": "New Discord category ID",
      "option_ping_roles": "Roles to notify on creation (IDs separated by commas)",
      "option_welcome_message": "Custom welcome message for this category",
      "option_id_toggle": "Category ID to switch state"
    }
  },
  "center": {
    "general": {
      "title": "TON618 Configuration Center",
      "description": "Interactive console to manage all your server modules and automation rules."
    },
    "sections": {
      "general": "General System",
      "tickets": "Ticket Engine",
      "automod": "AutoMod Rules",
      "verification": "Identity & Security",
      "welcome": "Onboarding",
      "goodbye": "Departure",
      "staff": "Team Ops",
      "commercial": "Plan & Pro Status"
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
      "global_limit": "Global Server Limit",
      "cooldown": "Creation Cooldown",
      "minimum_days": "Min. Account Age (Days)",
      "simple_help": "Simple Triage Mode",
      "base_sla": "Base SLA Threshold",
      "smart_ping": "Smart Ping Warning",
      "auto_close": "Inactivity Auto-Close",
      "auto_assignment": "Auto-Assignment Engine",
      "online_only": "Only Assign Online Staff",
      "respect_away": "Respect Staff Away Status",
      "sla_escalation": "SLA Escalation Engine",
      "threshold": "Escalation Threshold",
      "channel": "Alert Channel",
      "role": "Escalation Role",
      "sla_overrides": "SLA Priority Rules",
      "escalation_overrides": "Escalation Rules",
      "daily_report": "Daily Performance Report",
      "weekly_report": "Weekly Ops Summary",
      "status": "Operational Status",
      "scope": "Category Scope",
      "message": "Incident Broadcast",
      "configured_categories": "Active Categories"
    },
    "fields": {
      "channels_roles": "Infrastructure & Permissions",
      "commercial_status": "Commercial & Subscription",
      "panel_messaging": "User Experience & Customization",
      "limits_access": "Access Control & Fair Use",
      "sla_automation": "Operational Intelligence & Automation",
      "escalation_reporting": "Incident Reporting & Escalation",
      "incident_mode": "Outage & Incident Mode"
    },
    "panel_status": {
      "not_configured": "🔴 NOT CONFIGURED",
      "published": "🟢 PUBLISHED",
      "pending": "🟡 PENDING"
    },
    "incident": {
      "inactive": "Bot is operating normally",
      "default_message": "We are currently experiencing a high volume of tickets. Response times may be longer than usual."
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
      "free": "TON618 Ops Console | Community Edition"
    }
  }
};
`;

fs.writeFileSync(path, cleanPrefix + newTail);
console.log("Successfully restored en.js!");
