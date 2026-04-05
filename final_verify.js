try {
  const en = require('./src/locales/en.js');
  console.log('✅ en.js is valid JSON/JS structure.');
  const es = require('./src/locales/es.js');
  console.log('✅ es.js is valid JSON/JS structure.');
  
  if (Object.keys(en).length === Object.keys(es).length) {
    console.log('✅ Both files have the same number of top-level keys.');
  } else {
    console.warn('⚠️ Key count mismatch:', Object.keys(en).length, 'vs', Object.keys(es).length);
    const enKeys = new Set(Object.keys(en));
    const esKeys = new Set(Object.keys(es));
    const missingInEs = [...enKeys].filter(k => !esKeys.has(k));
    const missingInEn = [...esKeys].filter(k => !enKeys.has(k));
    if (missingInEs.length) console.log('Missing in es.js:', missingInEs);
    if (missingInEn.length) console.log('Missing in en.js:', missingInEn);
  }
} catch (e) {
  console.error('❌ Syntax error detected:');
  console.error(e);
}
