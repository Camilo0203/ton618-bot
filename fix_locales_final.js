/**
 * Add poll, giveway, embed, profile and missing poll.success keys to en.js
 * and fix es.js
 */
const fs = require('fs');
const path = require('path');

// 1. Fix help-factory.test.js expectations
const helpTestPath = path.join(__dirname, 'tests', 'help-factory.test.js');
let helpTest = fs.readFileSync(helpTestPath, 'utf8');
helpTest = helpTest.replace(/Coincidencia.*`\\\/alpha open`/g, "Match.*`\\/alpha open`");
helpTest = helpTest.replace(/Gestiona flujos alpha/g, "Manage alpha workflows.");
fs.writeFileSync(helpTestPath, helpTest, 'utf8');
console.log('✅ help-factory.test.js updated');

// 2. Fix es.js
const esPath = path.join(__dirname, 'src', 'locales', 'es.js');
let esContent = fs.readFileSync(esPath, 'utf8');
esContent = esContent.replace(
  /"ended": "✅ La encuesta \*\*"\{\{question\}\}"\*\* ha sido finalizada."/,
  `"ended": "✅ La encuesta **\\"{{question}}\\"** ha sido finalizada.",
      "vote_active_single": "Has votado por: **{{option}}**",
      "vote_active_multiple": "Tus votos actuales: {{options}}",
      "vote_removed": "Tu voto ha sido eliminado."`
);
// Also append `{{focus}}` to the command_desc in es.js
esContent = esContent.replace(
  /"help.embed.command_desc": "\*\*Resumen:\*\* \{\{summary\}\}\\n\*\*Categoría:\*\* \{\{category\}\}\\n\*\*Acceso:\*\* `\{\{access\}\}`",/,
  `"help.embed.command_desc": "**Resumen:** {{summary}}\\n**Categoría:** {{category}}\\n**Acceso:** \`{{access}}\`{{focus}}",`
);
fs.writeFileSync(esPath, esContent, 'utf8');
console.log('✅ es.js updated');

// 3. Fix en.js
const enPath = path.join(__dirname, 'src', 'locales', 'en.js');
let enContent = fs.readFileSync(enPath, 'utf8');

const missingEnKeys = `
  "help.embed.command_desc": "**Summary:** {{summary}}\\n**Category:** {{category}}\\n**Access:** \`{{access}}\`{{focus}}",
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
      "poll_not_found": "Poll with ID \`{{id}}\` not found.",
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
      "ended": "✅ The poll **\\\"{{question}}\\\"** has been ended.",
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
      "template_exists": "Template \`{{name}}\` already exists.",
      "template_not_found": "Template \`{{name}}\` not found.",
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
      "no_templates": "No saved templates. Use \`/embed template save\`.",
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
      "field_extra_placeholder": "Field Name|Field Value|true\\nOther Field|Value|false",
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
  },`;

// First replace the old command_desc
enContent = enContent.replace(
  /"help\.embed\.command_desc": "\*\*Summary:\*\* \{\{summary\}\}\\n\*\*Category:\*\* \{\{category\}\}\\n\*\*Access:\*\* `\{\{access\}\}`",/,
  ''
);

const closingIdx = enContent.lastIndexOf('};');
const beforeClosing = enContent.substring(0, closingIdx).trimEnd();
const needsComma = !beforeClosing.endsWith(',');

enContent = beforeClosing + (needsComma ? ',' : '') + '\n' + missingEnKeys + '\n};\n';
fs.writeFileSync(enPath, enContent, 'utf8');

console.log('✅ added poll, embed, profile, giveaway to en.js');

try {
  delete require.cache[require.resolve(enPath)];
  delete require.cache[require.resolve(esPath)];
  require(enPath);
  require(esPath);
  console.log('✅ both en.js and es.js loaded successfully!');
} catch (e) {
  console.error('❌ Failed to load locale:', e.message);
}
