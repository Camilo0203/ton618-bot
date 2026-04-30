const en = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js');
const es = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js');

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

const enKeys = getKeys(en);
const esKeys = getKeys(es);

const missingInEs = enKeys.filter(k => !esKeys.includes(k));
const missingInEn = esKeys.filter(k => !enKeys.includes(k));

console.log('--- Missing in Spanish ---');
console.log(missingInEs.length > 0 ? missingInEs.join('\n') : 'None');
console.log('\n--- Missing in English ---');
console.log(missingInEn.length > 0 ? missingInEn.join('\n') : 'None');
