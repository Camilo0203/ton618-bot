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

// More fixes for EN file
const moreFixes = {
  // Economy items
  'economy.items.background.name': 'Background',
  'economy.items.background.description': 'Custom profile background',
  'economy.items.badge.name': 'Badge',
  'economy.items.badge.description': 'Exclusive profile badge',
  'economy.items.boost_daily.name': 'Daily Boost',
  'economy.items.boost_daily.description': 'Double daily reward for 7 days',
  'economy.items.boost_xp.name': 'XP Boost',
  'economy.items.boost_xp.description': 'Double XP gain for 7 days',
  'economy.items.crate_common.name': 'Common Crate',
  'economy.items.crate_common.description': 'Contains basic rewards',
  'economy.items.crate_epic.name': 'Epic Crate',
  'economy.items.crate_epic.description': 'Contains rare rewards',
  'economy.items.crate_legendary.name': 'Legendary Crate',
  'economy.items.crate_legendary.description': 'Contains legendary rewards',
  'economy.items.crate_rare.name': 'Rare Crate',
  'economy.items.crate_rare.description': 'Contains uncommon rewards',
  'economy.items.role_premium.name': 'Premium Role',
  'economy.items.role_premium.description': 'Special premium role (30 days)',
  'economy.items.role_staff.name': 'Staff Role',
  'economy.items.role_staff.description': 'Temporary staff privileges (7 days)',
  'economy.items.role_vip.name': 'VIP Role',
  'economy.items.role_vip.description': 'VIP status role (14 days)',
  'economy.items.ticket.name': 'Priority Ticket',
  'economy.items.ticket.description': 'Skip the queue support ticket',
  
  // Economy transactions
  'economy.deposit.error': 'Error depositing coins.',
  'economy.deposit.insufficient': 'Insufficient wallet balance.',
  'economy.deposit.success': 'Deposited {{amount}} coins to your bank.',
  'economy.transfer.error': 'Error transferring coins.',
  'economy.transfer.insufficient': 'Insufficient balance.',
  'economy.transfer.self_transfer': 'You cannot transfer coins to yourself.',
  'economy.transfer.success': 'Transferred {{amount}} coins to {{user}}.',
  'economy.withdraw.error': 'Error withdrawing coins.',
  'economy.withdraw.insufficient': 'Insufficient bank balance.',
  'economy.withdraw.success': 'Withdrew {{amount}} coins from your bank.',
  'economy.work.cooldown': 'You are tired. Wait {{minutes}} minutes before working again.',
  'economy.work.error': 'Error processing work command.',
  'economy.work.no_job': 'You do not have a job. Use `/work list` to see available jobs.',
  'economy.work.success': 'You worked as {{job}} and earned {{amount}} coins!',
  
  // Help embed
  'help.embed.title': 'Help Center — {{category}}',
  'help.embed.description': 'Here are the available commands for this category.',
  'help.embed.footer': 'Use /help [command] for detailed command info',
  'help.embed.category_label': 'Category',
  'help.embed.access_label': 'Access Level',
  'help.embed.command_overviews': 'Command Overviews',
  'help.embed.quick_start': 'Quick Start',
  'help.embed.usage_overrides': 'Usage Notes',
  
  // Help categories
  'help.embed.categories.economy': 'Economy & Shop',
  'help.embed.categories.giveaway': 'Giveaways',
  'help.embed.categories.level': 'Leveling System',
  'help.embed.categories.mods': 'Moderation Tools',
  'help.embed.categories.ticket': 'Ticket System',
  
  // Staff rating
  'staff_rating.average': 'Average',
  'staff_rating.distribution': 'Rating Distribution',
  'staff_rating.leaderboard_title': 'Staff Leaderboard — Ratings',
  'staff_rating.max': 'Max',
  'staff_rating.no_ratings': 'No ratings yet',
  'staff_rating.no_ratings_profile': 'This staff member has not been rated yet.',
  'staff_rating.profile_title': 'Staff Profile — {{user}}',
  'staff_rating.star_empty': '☆',
  'staff_rating.star_full': '★',
  'staff_rating.star_half': '⯪',
  'staff_rating.total_ratings': 'Total Ratings',
  'staff_rating.trend_average': 'Average Trend',
  'staff_rating.trend_excellent': 'Excellent Trend',
  'staff_rating.trend_good': 'Good Trend',
  'staff_rating.trend_needs_improve': 'Needs Improvement',
  
  // Crons reminders
  'crons.reminders.field_ago': '{{time}} ago',
  'crons.reminders.footer': 'TON618 Reminder',
  'crons.reminders.title': '⏰ Reminder',
  
  // Events modlog
  'events.modlog.unknown_executor': 'Unknown Executor',
  
  // Giveaway errors
  'giveaway.errors.no_active': 'No active giveaways found.',
  
  // Center (config center)
  'center.autoresponses.behavior_button': 'Update Behavior',
  'center.autoresponses.behavior_modal_title': 'Update Auto-Response Behavior',
  'center.autoresponses.behavior_saved': 'Auto-response behavior updated successfully.',
  'center.autoresponses.button_create': 'Create Response',
  'center.autoresponses.create_modal_content': 'Response Content',
  'center.autoresponses.create_modal_title': 'Create Auto-Response',
  'center.autoresponses.create_modal_trigger': 'Trigger Word',
  'center.autoresponses.current_behavior_label': 'Current Behavior',
  'center.autoresponses.delete_button': 'Delete Response',
  
  // Modals
  'modals.suggest.success_msg': 'Suggestion submitted successfully!',
  'modals.tags.error_empty': 'Tag name cannot be empty.',
  'modals.tags.error_exists': 'A tag with this name already exists.',
  'modals.tags.error_failed': 'Failed to create tag.',
  'modals.tags.footer': 'TON618 Tags',
  'modals.tags.success_desc': 'Tag "{{name}}" has been created.',
  'modals.tags.success_title': '✅ Tag Created',
  
  // Observability
  'observability.interactions': 'Interactions',
  'observability.scope_errors': 'Errors',
  'observability.top_error': 'Top Error',
  'observability.window': '5min Window',
  
  // Ticket labels
  'ticket.labels.assigned': 'Assigned',
  'ticket.labels.category': 'Category',
  'ticket.labels.claimed': 'Claimed',
  'ticket.labels.priority': 'Priority',
  'ticket.labels.status': 'Status',
  
  // Premium
  'premium.active': 'Active',
  'premium.error_fetching': 'Error fetching premium status.',
  'premium.error_generic': 'An error occurred.',
  'premium.expires_at': 'Expires At',
  'premium.expires_in': 'Expires In',
  'premium.expires_soon': '⚠️ Expires in less than 24 hours',
  'premium.expires_tomorrow': '⚠️ Expires tomorrow',
  'premium.expires_week': '✅ Expires in less than a week',
  'premium.free_plan': 'Free Plan',
  'premium.guild_only': 'This command can only be used in servers.',
  'premium.owner_only': 'Only the server owner can use this command.',
  'premium.plan_label': 'Plan',
  'premium.pro_active': '✅ PRO Active',
  'premium.supporter_active': 'Supporter Active',
  'premium.supporter_status': 'Supporter Status',
  'premium.time_remaining': 'Time Remaining',
  'premium.upgrade_cta': 'Upgrade to PRO',
  'premium.upgrade_label': 'Upgrade',
};

console.log('=== CORRIGIENDO MÁS TRADUCCIONES ===\n');

let fixedCount = 0;
for (const [key, value] of Object.entries(moreFixes)) {
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
