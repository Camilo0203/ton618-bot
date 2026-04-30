const fs = require('fs');
const path = require('path');

const enPath = './src/locales/en.js';
let content = fs.readFileSync(enPath, 'utf8');

// Fix encoding artifacts
content = content
  .replace(/âœ…/g, '✅')
  .replace(/â Œ/g, '❌')
  .replace(/âš ï¸ /g, '⚠️')
  .replace(/ðŸ“Š/g, '📊')
  .replace(/ðŸ‘¥/g, '👥')
  .replace(/ðŸ“ /g, '📍')
  .replace(/ðŸŽ­/g, '🎭')
  .replace(/ðŸ˜€/g, '😀')
  .replace(/â„¹ï¸ /g, 'ℹ️')
  .replace(/âœ¨/g, '✨')
  .replace(/ðŸ”¨/g, '🔨')
  .replace(/âœ ï¸ /g, '✏️')
  .replace(/ðŸ‘¤/g, '👤')
  .replace(/ðŸ›¡ï¸ /g, '🛡️')
  .replace(/ðŸ“©/g, '📩')
  .replace(/ðŸ“¢/g, '📢')
  .replace(/ðŸ’°/g, '💰')
  .replace(/ðŸŽ†/g, '🏆')
  .replace(/ðŸ“ /g, '📝');

// We search for a reasonable cut point
const cutPoints = ['"poll": {', '"giveaway": {', '"giveaway.embed.prize":'];
let bestCut = -1;
for(const cp of cutPoints) {
    const idx = content.indexOf(cp);
    if(idx !== -1 && (bestCut === -1 || idx < bestCut)) bestCut = idx;
}

if (bestCut !== -1) {
    const startIndex = content.lastIndexOf('\n', bestCut);
    if (startIndex !== -1) content = content.slice(0, startIndex);
}

// Ensure the block is well closed
content = content.trim();
if (!content.endsWith('}')) {
    content += '\n  }';
}

const finalBlock = `,
  "poll": {
    "slash": {
      "description": "Interactive poll system",
      "subcommands": {
        "create": { "description": "Create a new poll" },
        "end": { "description": "End a poll early" },
        "list": { "description": "View active polls" }
      }
    },
    "embed": {
      "title_prefix": "🗳️ Poll:",
      "title_ended_prefix": "🏁 Ended:",
      "field_total_votes": "Total Votes",
      "field_created_by": "Created by",
      "vote_plural": "votes",
      "vote_singular": "vote"
    }
  },
  "crons": {
    "polls": {
        "ended_title": "Poll Ended",
        "ended_desc": "The poll **\\"{{question}}\\"** has finished."
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
      }
    }
  }
};
`;

fs.writeFileSync(enPath, content + finalBlock);
console.log('REPAIRED!');
