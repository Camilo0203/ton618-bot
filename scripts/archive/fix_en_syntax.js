/**
 * Fix the syntax error in en.js at line 2447-2459.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'locales', 'en.js');
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split(/\r?\n/);

const toggleIdx = lines.findIndex(l => l.includes('"option_id_toggle"'));
if (toggleIdx === -1) {
  console.error('ERROR: Could not find "option_id_toggle" line');
  process.exit(1);
}
console.log(`Found "option_id_toggle" at line ${toggleIdx + 1}`);

const embedsIdx = lines.findIndex((l, i) => i > toggleIdx && l.trim().startsWith('"embeds"'));
if (embedsIdx === -1) {
  console.error('ERROR: Could not find "embeds" section');
  process.exit(1);
}
console.log(`Found "embeds" at line ${embedsIdx + 1}`);

const replacement = [
'      "option_id_toggle": "ID of the category to toggle status"',
'    }',
'  },',
'  "menuActions": {',
'    "profile": {',
'      "title": "Profile",',
'      "description": "Use `/perfil ver` to view your profile.\\nUse `/perfil top` to view the quick ranking."',
'    },',
'    "config": {',
'      "admin_only": "Only administrators can use quick configuration.",',
'      "title": "Quick configuration",',
'      "description": "Use `/config center` to open the interactive control panel.\\nIf you need a deeper setup, use `/setup`."',
'    },',
'    "help": {',
'      "title": "Quick help",',
'      "description": "Key commands:\\n- `/menu`\\n- `/fun`\\n- `/ticket open`\\n- `/perfil ver`\\n- `/staff my-tickets` (staff)\\n- `/config status` (admin)\\n- `/help`"',
'    }',
'  },',
'  "events": {',
'    "guildMemberAdd": {',
'      "anti_raid": {',
'        "title": "Anti-raid triggered",',
'        "description": "Detected **{{recentJoins}} joins** in **{{seconds}}s**.\\nLatest join: **{{memberTag}}**",',
'        "fields": {',
'          "threshold": "Threshold",',
'          "action": "Action"',
'        },',
'        "action_kick": "Kick automatically",',
'        "action_alert": "Alert only"',
'      },',
'      "welcome": {',
'        "default_title": "Welcome!",',
'        "fields": {',
'          "user": "User",',
'          "member_count": "Member #"',
'        }',
'      },',
'      "dm": {',
'        "title": "Welcome to {{guild}}",',
'        "fields": {',
'          "verification_required": "Verification required",',
'          "verification_value": "Go to {{channel}} to verify and access the server."',
'        }',
'      },',
'      "modlog": {',
'        "title": "Member joined",',
'        "fields": {',
'          "user": "User",',
'          "account_created": "Account created",',
'          "member_count": "Member #"',
'        },',
'        "footer": "ID: {{id}}"',
'      }',
'    },',
'    "guildMemberRemove": {',
'      "goodbye": {',
'        "default_title": "Goodbye!",',
'        "default_message": "We are sorry to see **{user}** leave. We hope to see you again soon.",',
'        "fields": {',
'          "user": "User",',
'          "remaining_members": "Members remaining"',
'        },',
'        "remaining_members_value": "{{count}} members"',
'      },',
'      "modlog": {',
'        "title": "Member left",',
'        "fields": {',
'          "user": "User",',
'          "joined_at": "Joined",',
'          "remaining_members": "Members remaining",',
'          "roles": "Roles"',
'        },',
'        "no_roles": "None",',
'        "unknown_join": "Unknown",',
'        "footer": "ID: {{id}}"',
'      }',
'    },',
'    "guildMemberUpdate": {',
'      "unknown_executor": "Unknown",',
'      "footer": "ID: {{id}}",',
'      "nickname": {',
'        "title": "Nickname changed",',
'        "fields": {',
'          "user": "User",',
'          "before": "Before",',
'          "after": "After",',
'          "executor": "Executed by"',
'        }',
'      },',
'      "roles": {',
'        "title": "Roles updated",',
'        "fields": {',
'          "user": "User",',
'          "added": "Roles added",',
'          "removed": "Roles removed",',
'          "executor": "Executed by"',
'        }',
'      }',
'    },',
'    "messageDelete": {',
'      "title": "Deleted message",',
'      "fields": {',
'        "author": "Author",',
'        "channel": "Channel",',
'        "content": "Content"',
'      },',
'      "unknown_author": "Unknown",',
'      "no_text": "*(no text)*",',
'      "footer": "Message ID: {{id}}"',
'    },',
'    "modlog": {',
'      "ban_title": "\ud83d\udd28 User Banned",',
'      "unban_title": "\u2705 User Unbanned",',
'      "edit_title": "\u270f\ufe0f Message Edited",',
'      "fields": {',
'        "user": "\ud83d\udc64 User",',
'        "author": "\ud83d\udc64 Author",',
'        "executor": "\ud83d\udee1\ufe0f Executed by",',
'        "channel": "\ud83d\udccd Channel",',
'        "reason": "Reason",',
'        "link": "Message Link",',
'        "before": "Before",',
'        "after": "After"',
'      },',
'      "no_reason": "No reason specified"',
'    }',
'  },',
'  "crons": {',
'    "auto_close": {',
'      "warning_desc": "\u26a0\ufe0f <@{{user}}> This ticket will be automatically closed soon due to inactivity.",',
'      "event_desc": "Ticket #{{ticketId}} was closed due to inactivity.",',
'      "embed_title_auto": "Ticket closed automatically",',
'      "embed_desc_auto": "This ticket was closed due to inactivity and will be deleted soon."',
'    },',
'    "polls": {',
'      "ended_title": "Poll Ended",',
'      "ended_desc": "The poll **\\"{{question}}\\"** has finished."',
'    }',
'  },'
];

const newLines = [
  ...lines.slice(0, toggleIdx),
  ...replacement,
  ...lines.slice(embedsIdx)
];

const newContent = newLines.join('\r\n');
fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`Fixed! Replaced lines ${toggleIdx + 1}-${embedsIdx} with proper structure.`);
console.log(`New file has ${newLines.length} lines.`);

try {
  delete require.cache[require.resolve(filePath)];
  const locale = require(filePath);
  console.log('\n\u2705 en.js loads successfully!');
  console.log('   Top-level keys:', Object.keys(locale).join(', '));
  console.log('   events:', locale.events ? '\u2705' : '\u274c');
  console.log('   menuActions:', locale.menuActions ? '\u2705' : '\u274c');
  console.log('   crons:', locale.crons ? '\u2705' : '\u274c');
  console.log('   embeds:', locale.embeds ? '\u2705' : '\u274c');
} catch (e) {
  console.error('\n\u274c File still has syntax error:', e.message);
  process.exit(1);
}
