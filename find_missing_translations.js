const en = require('./src/locales/en.js');
const es = require('./src/locales/es.js');

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? prefix + '.' + key : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
}

const keys = getAllKeys(en);
const missingInEs = [];
const identicalInEs = [];

keys.forEach(key => {
  const enVal = getValue(en, key);
  const esVal = getValue(es, key);
  
  if (!esVal) {
    missingInEs.push(key);
  } else if (typeof enVal === 'string' && typeof esVal === 'string') {
    // Check if ES value is identical to EN
    if (enVal === esVal && enVal.length > 2) {
      identicalInEs.push({key, value: esVal});
    }
  }
});

console.log('=== ANÁLISIS DE TRADUCCIONES ===');
console.log('Total claves EN:', keys.length);
console.log('Claves faltantes en ES:', missingInEs.length);
console.log('Claves idénticas EN=ES:', identicalInEs.length);

if (missingInEs.length > 0) {
  console.log('\n--- CLAVES FALTANTES EN ES (primeras 30) ---');
  missingInEs.slice(0, 30).forEach(k => console.log('  ' + k));
  if (missingInEs.length > 30) console.log('  ... y ' + (missingInEs.length - 30) + ' más');
}

if (identicalInEs.length > 0) {
  console.log('\n--- CLAVES IDÉNTICAS (probablemente sin traducir) ---');
  identicalInEs.slice(0, 50).forEach(item => {
    console.log('  ' + item.key);
    console.log('    Valor: "' + item.value.substring(0, 70) + (item.value.length > 70 ? '...' : '') + '"');
  });
  if (identicalInEs.length > 50) console.log('  ... y ' + (identicalInEs.length - 50) + ' más');
}

// Save to file for detailed review
const fs = require('fs');
fs.writeFileSync('identical_translations.json', JSON.stringify(identicalInEs, null, 2));
fs.writeFileSync('missing_in_es.json', JSON.stringify(missingInEs, null, 2));
console.log('\n✅ Archivos guardados: identical_translations.json, missing_in_es.json');
