const fs = require('fs');

function getDeepKeys(obj) {
    let keys = [];
    for (let key in obj) {
        keys.push(key);
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            let subKeys = getDeepKeys(obj[key]);
            keys.push(...subKeys.map(sk => `${key}.${sk}`));
        }
    }
    return keys;
}

try {
    const en = require('./src/locales/en.js');
    const es = require('./src/locales/es.js');

    const enKeys = new Set(getDeepKeys(en));
    const esKeys = new Set(getDeepKeys(es));

    const onlyInEn = [...enKeys].filter(k => !esKeys.has(k)).sort();
    const onlyInEs = [...esKeys].filter(k => !enKeys.has(k)).sort();

    if (onlyInEn.length === 0 && onlyInEs.length === 0) {
        console.log('✅ Synchronized! Both files have identical key structures.');
    } else {
        console.warn('⚠️ Discrepancies found:');
        if (onlyInEn.length) {
            console.log('\nKeys only in en.js (Missing in es.js):');
            onlyInEn.slice(0, 20).forEach(k => console.log(`  - ${k}`));
            if (onlyInEn.length > 20) console.log(`  ... and ${onlyInEn.length - 20} more`);
        }
        if (onlyInEs.length) {
            console.log('\nKeys only in es.js (Missing in en.js):');
            onlyInEs.slice(0, 20).forEach(k => console.log(`  - ${k}`));
            if (onlyInEs.length > 20) console.log(`  ... and ${onlyInEs.length - 20} more`);
        }
    }
} catch (e) {
    console.error('❌ Error comparing files:', e.message);
}
