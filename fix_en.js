const fs = require('fs');
const content = fs.readFileSync('src/locales/en.js', 'utf8');
const staffStatsKeys = `  },
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
    }
  }
};`;

const newContent = content.trim().replace(/\};?$/, staffStatsKeys);
fs.writeFileSync('src/locales/en.js', newContent);
console.log('en.js updated');
