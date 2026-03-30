const fs = require('fs');
const path = require('path');

// Load locale files
const enLocale = require('./src/locales/en.js');
const esLocale = require('./src/locales/es.js');

// Flatten nested objects to dot notation
function flattenKeys(obj, prefix = '') {
  const keys = new Set();
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenKeys(value, fullKey).forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  return keys;
}

const enKeys = flattenKeys(enLocale);
const esKeys = flattenKeys(esLocale);

console.log('=== LOCALE FILE STATS ===');
console.log(`EN keys: ${enKeys.size}`);
console.log(`ES keys: ${esKeys.size}`);
console.log('');

// Find all JS files in src
function getAllJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const jsFiles = getAllJsFiles('./src');

// Extract i18n key references
const keyReferences = new Map(); // key -> [files]
const patterns = [
  /t\([^,]+,\s*["']([^"']+)["']/g,
  /withDescriptionLocalizations\([^,]+,\s*["']([^"']+)["']/g,
  /withNameLocalizations\([^,]+,\s*["']([^"']+)["']/g,
  /withLocalizations\([^,]+,\s*["']([^"']+)["']/g,
  /localeMapFromKey\(["']([^"']+)["']/g,
  /localizedChoice\([^,]+,\s*["']([^"']+)["']/g,
  /configT\([^,]+,\s*["']([^"']+)["']/g,
];

jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relativePath = path.relative('.', file).replace(/\\/g, '/');
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      if (!keyReferences.has(key)) {
        keyReferences.set(key, []);
      }
      if (!keyReferences.get(key).includes(relativePath)) {
        keyReferences.get(key).push(relativePath);
      }
    }
  });
});

console.log(`=== REFERENCED KEYS: ${keyReferences.size} ===`);
console.log('');

// Find missing keys
const missingInEn = [];
const missingInEs = [];
const missingInBoth = [];

for (const [key, files] of keyReferences.entries()) {
  const inEn = enKeys.has(key);
  const inEs = esKeys.has(key);
  
  if (!inEn && !inEs) {
    missingInBoth.push({ key, files });
  } else if (!inEn) {
    missingInEn.push({ key, files });
  } else if (!inEs) {
    missingInEs.push({ key, files });
  }
}

// Categorize by priority
function getPriority(key, files) {
  // P0: Slash command UI (breaks Discord UI)
  if (key.includes('.slash.') || 
      key.includes('.subcommands.') || 
      key.includes('.options.') ||
      key.includes('.choices.') ||
      key.includes('.groups.')) {
    return 'P0';
  }
  
  // P1: Runtime visible to users
  if (key.includes('.command.') ||
      key.includes('.handler.') ||
      key.includes('.panel.') ||
      key.includes('.buttons.') ||
      key.includes('.embed.') ||
      key.includes('.modal.')) {
    return 'P1';
  }
  
  // P2: Minor cleanup
  return 'P2';
}

// Sort and display results
console.log('=== MISSING KEYS REPORT ===\n');

console.log('## MISSING IN BOTH en.js AND es.js (CRITICAL)');
console.log(`Total: ${missingInBoth.length}\n`);
const bothByPriority = { P0: [], P1: [], P2: [] };
missingInBoth.forEach(item => {
  const priority = getPriority(item.key, item.files);
  bothByPriority[priority].push(item);
});

['P0', 'P1', 'P2'].forEach(priority => {
  if (bothByPriority[priority].length > 0) {
    console.log(`\n### ${priority} - ${bothByPriority[priority].length} keys`);
    bothByPriority[priority].forEach(({ key, files }) => {
      console.log(`\nKey: ${key}`);
      console.log(`Files: ${files.join(', ')}`);
    });
  }
});

console.log('\n\n## MISSING IN en.js ONLY');
console.log(`Total: ${missingInEn.length}\n`);
const enByPriority = { P0: [], P1: [], P2: [] };
missingInEn.forEach(item => {
  const priority = getPriority(item.key, item.files);
  enByPriority[priority].push(item);
});

['P0', 'P1', 'P2'].forEach(priority => {
  if (enByPriority[priority].length > 0) {
    console.log(`\n### ${priority} - ${enByPriority[priority].length} keys`);
    enByPriority[priority].forEach(({ key, files }) => {
      console.log(`\nKey: ${key}`);
      console.log(`Files: ${files.join(', ')}`);
    });
  }
});

console.log('\n\n## MISSING IN es.js ONLY');
console.log(`Total: ${missingInEs.length}\n`);
const esByPriority = { P0: [], P1: [], P2: [] };
missingInEs.forEach(item => {
  const priority = getPriority(item.key, item.files);
  esByPriority[priority].push(item);
});

['P0', 'P1', 'P2'].forEach(priority => {
  if (esByPriority[priority].length > 0) {
    console.log(`\n### ${priority} - ${esByPriority[priority].length} keys`);
    esByPriority[priority].forEach(({ key, files }) => {
      console.log(`\nKey: ${key}`);
      console.log(`Files: ${files.join(', ')}`);
    });
  }
});

// Summary
console.log('\n\n=== SUMMARY ===');
console.log(`Total referenced keys: ${keyReferences.size}`);
console.log(`Missing in both: ${missingInBoth.length}`);
console.log(`  - P0 (Slash UI): ${bothByPriority.P0.length}`);
console.log(`  - P1 (Runtime): ${bothByPriority.P1.length}`);
console.log(`  - P2 (Minor): ${bothByPriority.P2.length}`);
console.log(`Missing in en.js only: ${missingInEn.length}`);
console.log(`  - P0: ${enByPriority.P0.length}`);
console.log(`  - P1: ${enByPriority.P1.length}`);
console.log(`  - P2: ${enByPriority.P2.length}`);
console.log(`Missing in es.js only: ${missingInEs.length}`);
console.log(`  - P0: ${esByPriority.P0.length}`);
console.log(`  - P1: ${esByPriority.P1.length}`);
console.log(`  - P2: ${esByPriority.P2.length}`);
