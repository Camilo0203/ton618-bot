const enLocale = require('./src/locales/en.js');
const esLocale = require('./src/locales/es.js');

const p1Keys = [
  'common.buttons.enter_code',
  'common.buttons.resend_code',
  'common.buttons.english',
  'common.buttons.spanish'
];

console.log('=== P1 KEYS CHECK ===\n');

p1Keys.forEach(key => {
  const parts = key.split('.');
  let enValue = enLocale;
  let esValue = esLocale;
  
  for (const part of parts) {
    enValue = enValue?.[part];
    esValue = esValue?.[part];
  }
  
  console.log(`Key: ${key}`);
  console.log(`  EN: ${enValue !== undefined ? '✓ EXISTS' : '✗ MISSING'} - "${enValue}"`);
  console.log(`  ES: ${esValue !== undefined ? '✓ EXISTS' : '✗ MISSING'} - "${esValue}"`);
  console.log('');
});
