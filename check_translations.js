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
const issues = [];

// Common Spanish words that shouldn't appear in EN
const spanishWords = [
  '\\bel\\b', '\\bla\\b', '\\blos\\b', '\\blas\\b', '\\by\\b', '\\bo\\b', 
  '\\bpara\\b', '\\bpor\\b', '\\bcon\\b', '\\bde\\b', '\\bdel\\b', 
  '\\bque\\b', '\\ben\\b', '\\bun\\b', '\\buna\\b', '\\bsu\\b', '\\bsus\\b', 
  '\\bse\\b', '\\bes\\b', '\\bson\\b', '\\btu\\b', '\\btus\\b', '\\bcomo\\b', 
  '\\bmás\\b', '\\beste\\b', '\\besta\\b', '\\bsi\\b', '\\bno\\b', '\\bsí\\b', 
  '\\btodos\\b', '\\btodas\\b', '\\bnivel\\b', '\\bcanal\\b', '\\bcódigo\\b', 
  '\\bmensaje\\b', '\\busuario\\b', '\\brazón\\b', '\\bdías\\b', '\\bvitalicio\\b', 
  '\\bdesconocido\\b', '\\bbaneado\\b', '\\bcerrado\\b', '\\babierto\\b', 
  '\\btickets\\b', '\\breporte\\b', '\\bcalificación\\b', '\\bpromedio\\b', 
  '\\bdistribución\\b', '\\bhabilitado\\b', '\\bdeshabilitado\\b', '\\breclamado\\b',
  '\\brecompensa\\b', '\\bcuando\\b', '\\breaccionar\\b', '\\bdonde\\b',
  '\\bcómo\\b', '\\baquí\\b', '\\btu\\b', '\\bcode\\b', '\\bredeem\\b',
  '\\bcanjear\\b', '\\bgenerado\\b', '\\bfallido\\b', '\\benviado\\b',
  '\\bexpirado\\b', '\\bduración\\b', '\\bpágina\\b', '\\bnúmero\\b',
  '\\bobjetivo\\b', '\\bactualmente\\b', '\\barchivado\\b', '\\badvertencia\\b',
  '\\berror\\b', '\\binaccesible\\b', '\\btranscripción\\b'
];

console.log('=== BUSCANDO TRADUCCIONES SOSPECHOSAS EN ARCHIVO EN ===\n');

keys.forEach(key => {
  const enVal = getValue(en, key);
  if (!enVal || typeof enVal !== 'string') return;
  
  // Skip template variables
  const enText = enVal.replace(/\{\{[^}]+\}\}/g, '');
  
  // Check for Spanish words in EN
  spanishWords.forEach(word => {
    const regex = new RegExp(word, 'i');
    if (regex.test(enText)) {
      issues.push({key, value: enVal, match: word.replace(/\\b/g, '')});
    }
  });
});

// Group by key prefix
const grouped = {};
issues.forEach(issue => {
  const prefix = issue.key.split('.')[0];
  if (!grouped[prefix]) grouped[prefix] = [];
  grouped[prefix].push(issue);
});

console.log('Total issues encontrados: ' + issues.length);
console.log('\n--- DESGLOSE POR CATEGORÍA ---');

for (const [prefix, items] of Object.entries(grouped).sort()) {
  console.log('\n' + prefix + ': ' + items.length + ' problemas');
  items.slice(0, 5).forEach(issue => {
    console.log('  Key: ' + issue.key);
    console.log('    EN: "' + issue.value.substring(0, 80) + (issue.value.length > 80 ? '...' : '') + '"');
    console.log('    Match: "' + issue.match + '"');
  });
  if (items.length > 5) console.log('  ... y ' + (items.length - 5) + ' más');
}

console.log('\n=== FIN DE BÚSQUEDA ===');
