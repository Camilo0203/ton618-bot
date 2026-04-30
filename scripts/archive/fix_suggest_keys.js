const fs = require('fs');

const enPath = 'c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js';
const esPath = 'c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js';

function flattenKeys(obj, prefix = '') {
    let result = {};
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(result, flattenKeys(obj[key], fullKey));
        } else {
            result[fullKey] = obj[key];
        }
    }
    return result;
}

function updateLocale(path, newKeys) {
    let content = fs.readFileSync(path, 'utf8');
    const lastBraceIndex = content.lastIndexOf('};');
    const flatKeys = flattenKeys(newKeys);
    let entries = '';
    for (const [fullKeyName, value] of Object.entries(flatKeys)) {
        const quotedKey = `"${fullKeyName}"`;
        if (!content.includes(quotedKey)) {
            entries += `  ${quotedKey}: "${String(value).replace(/"/g, '\\"')}",\n`;
        }
    }
    if (entries) {
        const newContent = content.slice(0, lastBraceIndex) + entries + content.slice(lastBraceIndex);
        fs.writeFileSync(path, newContent);
    }
}

const finalUpdateEn = {
    suggest: {
        audit: {
            status_updated: "Suggestion {{status}} by {{user}}"
        }
    }
};

const finalUpdateEs = {
    suggest: {
        audit: {
            status_updated: "Sugerencia {{status}} por {{user}}"
        }
    }
};

updateLocale(enPath, finalUpdateEn);
updateLocale(esPath, finalUpdateEs);
console.log("Updated suggestion status keys.");
