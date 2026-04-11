// Quick test to verify bot can load
console.log('Testing bot modules...\n');

try {
  const en = require('./src/locales/en.js');
  console.log('✅ EN locales loaded:', Object.keys(en).length, 'sections');
  console.log('  Security keys:', Object.keys(en.security || {}).slice(0, 5));
} catch (e) {
  console.log('❌ EN locales error:', e.message);
}

try {
  const es = require('./src/locales/es.js');
  console.log('✅ ES locales loaded:', Object.keys(es).length, 'sections');
  console.log('  Security keys:', Object.keys(es.security || {}).slice(0, 5));
} catch (e) {
  console.log('❌ ES locales error:', e.message);
}

try {
  const security = require('./src/commands/admin/security.js');
  console.log('✅ security.js loaded, name:', security.data?.name);
} catch (e) {
  console.log('❌ security.js error:', e.message);
}

try {
  const resetall = require('./src/commands/admin/resetall.js');
  console.log('✅ resetall.js loaded, name:', resetall.data?.name);
} catch (e) {
  console.log('❌ resetall.js error:', e.message);
}

try {
  const resetguild = require('./src/commands/admin/resetguild.js');
  console.log('✅ resetguild.js loaded, name:', resetguild.data?.name);
} catch (e) {
  console.log('❌ resetguild.js error:', e.message);
}

try {
  const discordAlerts = require('./src/utils/discordAlerts.js');
  console.log('✅ discordAlerts.js loaded');
} catch (e) {
  console.log('❌ discordAlerts.js error:', e.message);
}

console.log('\n✅ All modules loaded successfully!');
