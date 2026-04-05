const fs = require('fs');

const en = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js');
const es = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js');

// 1. Sync suggest.embed.field_staff_note to Spanish
if (en.suggest && en.suggest.embed && !es.suggest.embed.field_staff_note) {
  es.suggest.embed.field_staff_note = "💬 Nota del Staff";
}

// 2. Sync embed.errors to English
if (es.embed && es.embed.errors) {
  en.embed = en.embed || {};
  en.embed.errors = en.embed.errors || {};
  const missingErrors = ["template_not_found", "template_exists", "pro_required", "invalid_image_url"];
  missingErrors.forEach(key => {
    if (es.embed.errors[key] && !en.embed.errors[key]) {
      // Basic translations for missing English keys
      if (key === "template_not_found") en.embed.errors[key] = "Template `{{name}}` not found.";
      if (key === "template_exists") en.embed.errors[key] = "A template with the name `{{name}}` already exists.";
      if (key === "pro_required") en.embed.errors[key] = "This feature requires **TON618 Pro**. Upgrade your server to unlock embed templates and more!";
      if (key === "invalid_image_url") en.embed.errors[key] = "Invalid image URL. It must start with `http` or `https`.";
    }
  });
}

// 3. Sync embed.templates to English
if (es.embed && es.embed.templates) {
  en.embed.templates = en.embed.templates || {};
  if (!en.embed.templates.list_title) en.embed.templates.list_title = "Embed Templates";
  if (!en.embed.templates.no_templates) en.embed.templates.no_templates = "No saved templates found.";
  if (!en.embed.templates.footer) en.embed.templates.footer = "Use `/embed template load [name]` to send one.";
}

// 4. Sync leveling.leaderboard.page to English
if (es.leveling && es.leveling.leaderboard && !en.leveling.leaderboard.page) {
  en.leveling.leaderboard.page = "Page {{page}} of {{total}}";
}

// Save back
fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js', 'module.exports = ' + JSON.stringify(en, null, 2) + ';');
fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js', 'module.exports = ' + JSON.stringify(es, null, 2) + ';');
console.log('Parity sync completed.');
