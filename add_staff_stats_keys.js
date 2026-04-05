/**
 * Add missing staff and stats i18n keys to en.js
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'locales', 'en.js');
let content = fs.readFileSync(filePath, 'utf8');

// Keys to add before the closing `};` 
const newKeys = `
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
  },`;

// Insert before the closing `};`
const closingIdx = content.lastIndexOf('};');
if (closingIdx === -1) {
  console.error('❌ Could not find closing }; in en.js');
  process.exit(1);
}

// Find the last comma/quote before };
const beforeClosing = content.substring(0, closingIdx).trimEnd();
const needsComma = !beforeClosing.endsWith(',');

content = beforeClosing + (needsComma ? ',' : '') + '\n' + newKeys + '\n};\n';

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Added staff and stats sections to en.js');

// Verify it loads
try {
  delete require.cache[require.resolve(filePath)];
  require(filePath);
  console.log('✅ en.js loads successfully!');
} catch (e) {
  console.error('❌ en.js failed to load:', e.message);
  process.exit(1);
}
