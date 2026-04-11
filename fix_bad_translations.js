const fs = require('fs');

// Load current locales
let en = require('./src/locales/en.js');
let es = require('./src/locales/es.js');

// Helper to set nested value
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// Critical fixes for EN file - these should be in English but are in Spanish
const criticalFixes = {
  // Weekly Report
  'weekly_report.active_categories': 'Most Active Categories',
  'weekly_report.avg_rating': 'Average Rating',
  'weekly_report.currently_open': 'Currently Open',
  'weekly_report.description': 'Here is the activity summary for the server over the last 7 days.',
  'weekly_report.footer': 'Weekly Report — TON618 Bot',
  'weekly_report.no_data': 'No data available for this period.',
  'weekly_report.response_time': 'Avg Response Time',
  'weekly_report.tickets_closed': 'Tickets Closed',
  'weekly_report.tickets_opened': 'Tickets Opened',
  'weekly_report.title': 'Weekly Activity Report',
  'weekly_report.top_staff': 'Top Staff This Week',
  
  // Wizard
  'wizard.description': 'The system has been configured with the following settings.',
  'wizard.footer': 'TON618 Bot — Setup Wizard',
  'wizard.free_next_step': 'System ready. Consider upgrading to Pro to enable automation playbooks.',
  'wizard.next_step_label': 'Next Steps',
  'wizard.panel_status.error': 'Error publishing panel',
  'wizard.panel_status.missing_permissions': 'Missing Permissions',
  'wizard.panel_status.published': 'Panel Published',
  'wizard.panel_status.skipped': 'Skipped',
  'wizard.pro_next_step': 'Your PRO setup is complete! Use `/config center` to fine-tune your configuration.',
  'wizard.summary_label': 'Configuration Summary',
  'wizard.title': 'Quick Setup Result',
  
  // Suggest
  'suggest.audit.approved': 'Suggestion approved by {{staff}}',
  'suggest.audit.rejected': 'Suggestion rejected by {{staff}}',
  'suggest.audit.status_updated': 'Status updated to {{status}}',
  'suggest.audit.thread_reason': 'via thread discussion',
  'suggest.cooldown.description': 'Please wait **{{minutes}} minutes** before sending another suggestion.',
  'suggest.cooldown.title': 'Cooldown Active',
  'suggest.dm.description': 'Your suggestion **#{{num}}** in **{{guildName}}** was reviewed.',
  'suggest.dm.field_suggestion': '📝 Your Suggestion',
  'suggest.dm.title_approved': '✅ Suggestion Approved',
  'suggest.dm.title_rejected': '❌ Suggestion Rejected',
  'suggest.embed.field_staff_comment': '💬 Staff Comment',
  'suggest.embed.footer_reviewed': 'Reviewed on {{date}}',
  'suggest.placeholder': 'Describe your suggestion here...',
  'suggest.success.auto_thread_created': 'Discussion thread created automatically.',
  'suggest.success.staff_note_updated': 'Staff note updated successfully.',
  
  // Verify
  'verify.audit.completed': 'User verified successfully',
  'verify.audit.removed': 'Verification removed by {{staff}}',
  
  // Economy
  'economy.buy.crate_win': '🎉 You won: {{items}}',
  'economy.buy.error': 'Error processing purchase.',
  'economy.buy.insufficient_funds': 'You do not have enough coins.',
  'economy.buy.not_found': 'Item not found.',
  'economy.buy.success': 'Purchase successful! You spent {{cost}} coins.',
  'economy.daily.already_claimed': 'You already claimed your daily reward. Come back tomorrow!',
  'economy.daily.error': 'Error claiming daily reward.',
  'economy.daily.success': 'You claimed {{amount}} coins! Streak: {{streak}} days',
  
  // Crons
  'crons.auto_close.archive_warning_error': 'Archive Warning: Error saving transcript',
  'crons.auto_close.archive_warning_inaccessible': 'Archive Warning: Transcript channel inaccessible',
  'crons.auto_close.archive_warning_transcript': 'Archive Warning: Could not save transcript',
  'crons.auto_close.embed_title_manual': 'Ticket Closed (Manual)',
  'crons.auto_close.title': 'Ticket Closed Automatically',
  
  // Common
  'common.units.days_short': 'd',
  'common.units.hours_short': 'h',
  'common.units.minutes_short': 'm',
  'common.units.weeks_short': 'w',
};

console.log('=== CORRIGIENDO TRADUCCIONES CRÍTICAS ===\n');

let fixedCount = 0;
for (const [key, value] of Object.entries(criticalFixes)) {
  setNestedValue(en, key, value);
  fixedCount++;
  console.log('Fixed: ' + key);
}

// Sort keys recursively
function sortKeys(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }
  const sorted = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeys(obj[key]);
  }
  return sorted;
}

const sortedEn = sortKeys(en);
const sortedEs = sortKeys(es);

// Write back to files
const enContent = 'module.exports = ' + JSON.stringify(sortedEn, null, 2) + ';\n';
const esContent = 'module.exports = ' + JSON.stringify(sortedEs, null, 2) + ';\n';

fs.writeFileSync('./src/locales/en.js', enContent);
fs.writeFileSync('./src/locales/es.js', esContent);

console.log('\n✅ Correcciones aplicadas: ' + fixedCount + ' traducciones');
console.log('✅ Archivos actualizados');
