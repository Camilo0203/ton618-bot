try {
  const en = require('./src/locales/en.js');
  const es = require('./src/locales/es.js');
  console.log('EN top-level keys:', Object.keys(en).length);
  console.log('ES top-level keys:', Object.keys(es).length);
  console.log('EN help.embed.home_title:', en['help.embed.home_title']);
  console.log('ES help.embed.home_title:', es['help.embed.home_title']);
  console.log('EN help.embed.select_home:', en['help.embed.select_home']);
  console.log('ES help.embed.select_home:', es['help.embed.select_home']);
  console.log('ALL OK');
} catch (e) {
  console.error('ERROR:', e.message);
}
