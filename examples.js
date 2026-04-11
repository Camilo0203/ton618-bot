const en = require('./src/locales/en.js');
const es = require('./src/locales/es.js');

function getValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
}

console.log('=== EJEMPLOS DE TRADUCCIONES APLICADAS ===\n');

const examples = [
  'common.units.days_short',
  'economy.buy.success',
  'help.embed.title',
  'premium.redeem.success_title',
  'wizard.title',
  'setup.slash.groups.tickets.playbook.group_description',
  'staff_rating.leaderboard_title',
  'autorole.slash.description',
  'serverstats.slash.description',
  'crons.messageDelete.title',
  'proadmin.dm_title',
  'poll.errors.max_votes_reached'
];

examples.forEach(key => {
  const enVal = getValue(en, key);
  const esVal = getValue(es, key);
  console.log('Key: ' + key);
  console.log('  EN: ' + JSON.stringify(enVal || 'N/A'));
  console.log('  ES: ' + JSON.stringify(esVal || 'N/A'));
  console.log('');
});
