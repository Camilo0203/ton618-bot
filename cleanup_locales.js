const fs = require('fs');
const path = require('path');

const locales = ['en.js', 'es.js'];
const basePath = 'c:/Users/Camilo/Desktop/ton618-bot/src/locales/';

locales.forEach(file => {
  const filePath = path.join(basePath, file);
  const localeObj = require(filePath);
  
  const content = 'module.exports = ' + JSON.stringify(localeObj, null, 2) + ';';
  fs.writeFileSync(filePath, content);
  console.log(`Cleaned up ${file}`);
});
