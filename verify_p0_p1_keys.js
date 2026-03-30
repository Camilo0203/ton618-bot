const enLocale = require('./src/locales/en.js');
const esLocale = require('./src/locales/es.js');

// P0 keys - slash command UI
const p0Keys = [
  'config.slash.description',
  'config.slash.subcommands.status.description',
  'config.slash.subcommands.tickets.description',
  'config.slash.subcommands.center.description',
  'staff.slash.description',
  'staff.slash.subcommands.away_on.description',
  'staff.slash.options.reason',
  'staff.slash.subcommands.away_off.description',
  'staff.slash.subcommands.my_tickets.description',
  'staff.slash.subcommands.warn_add.description',
  'staff.slash.options.user',
  'staff.slash.options.warn_reason',
  'staff.slash.subcommands.warn_check.description',
  'staff.slash.subcommands.warn_remove.description',
  'staff.slash.options.warning_id'
];

// P1 keys - runtime visible buttons
const p1Keys = [
  'common.buttons.enter_code',
  'common.buttons.resend_code',
  'common.buttons.english',
  'common.buttons.spanish'
];

function checkKey(obj, key) {
  const parts = key.split('.');
  let value = obj;
  for (const part of parts) {
    value = value?.[part];
  }
  return value !== undefined;
}

console.log('=== P0 KEYS VERIFICATION (Slash Command UI) ===\n');
let p0Missing = 0;
p0Keys.forEach(key => {
  const enExists = checkKey(enLocale, key);
  const esExists = checkKey(esLocale, key);
  const status = (enExists && esExists) ? '✓' : '✗';
  if (!enExists || !esExists) p0Missing++;
  console.log(`${status} ${key}`);
  if (!enExists) console.log(`   ✗ Missing in en.js`);
  if (!esExists) console.log(`   ✗ Missing in es.js`);
});

console.log(`\nP0 Result: ${p0Keys.length - p0Missing}/${p0Keys.length} keys present`);
console.log(`P0 Missing: ${p0Missing}\n`);

console.log('=== P1 KEYS VERIFICATION (Runtime Buttons) ===\n');
let p1Missing = 0;
p1Keys.forEach(key => {
  const enExists = checkKey(enLocale, key);
  const esExists = checkKey(esLocale, key);
  const status = (enExists && esExists) ? '✓' : '✗';
  if (!enExists || !esExists) p1Missing++;
  console.log(`${status} ${key}`);
  if (!enExists) console.log(`   ✗ Missing in en.js`);
  if (!esExists) console.log(`   ✗ Missing in es.js`);
});

console.log(`\nP1 Result: ${p1Keys.length - p1Missing}/${p1Keys.length} keys present`);
console.log(`P1 Missing: ${p1Missing}\n`);

console.log('=== FINAL SUMMARY ===');
console.log(`Total P0+P1 keys: ${p0Keys.length + p1Keys.length}`);
console.log(`Total missing: ${p0Missing + p1Missing}`);
console.log(`Status: ${(p0Missing + p1Missing) === 0 ? '✓ ALL CRITICAL KEYS PRESENT' : '✗ MISSING CRITICAL KEYS'}`);
