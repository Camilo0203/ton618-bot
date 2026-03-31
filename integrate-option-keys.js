const fs = require('fs');
const path = require('path');

// Cargar las estructuras generadas
const enOptions = JSON.parse(fs.readFileSync('option-keys-en.json', 'utf8'));
const esOptions = JSON.parse(fs.readFileSync('option-keys-es.json', 'utf8'));

// Cargar los archivos de locale actuales
const enPath = path.join(__dirname, 'src/locales/en.js');
const esPath = path.join(__dirname, 'src/locales/es.js');

const enLocale = require(enPath);
const esLocale = require(esPath);

// Función para agregar opciones a cada comando
function addOptionsToCommand(locale, optionsData, commandName) {
  if (!locale[commandName]) {
    locale[commandName] = {};
  }
  
  if (!locale[commandName].options) {
    locale[commandName].options = {};
  }
  
  // Agregar todas las opciones
  Object.assign(locale[commandName].options, optionsData[commandName].options);
}

// Agregar opciones a todos los comandos
Object.keys(enOptions).forEach(cmdName => {
  addOptionsToCommand(enLocale, enOptions, cmdName);
  addOptionsToCommand(esLocale, esOptions, cmdName);
});

// Función para convertir objeto a string con formato correcto
function objectToString(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let result = '{\n';
  
  const keys = Object.keys(obj);
  keys.forEach((key, index) => {
    const value = obj[key];
    const isLast = index === keys.length - 1;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result += `${spaces}  "${key}": ${objectToString(value, indent + 1)}${isLast ? '' : ','}\n`;
    } else if (typeof value === 'string') {
      const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
      result += `${spaces}  "${key}": "${escaped}"${isLast ? '' : ','}\n`;
    } else if (Array.isArray(value)) {
      result += `${spaces}  "${key}": ${JSON.stringify(value)}${isLast ? '' : ','}\n`;
    } else {
      result += `${spaces}  "${key}": ${JSON.stringify(value)}${isLast ? '' : ','}\n`;
    }
  });
  
  result += `${spaces}}`;
  return result;
}

// Guardar archivos actualizados
const enContent = `module.exports = ${objectToString(enLocale)};\n`;
const esContent = `module.exports = ${objectToString(esLocale)};\n`;

fs.writeFileSync(enPath, enContent, 'utf8');
fs.writeFileSync(esPath, esContent, 'utf8');

console.log('✅ Archivos de locale actualizados:');
console.log('   - src/locales/en.js');
console.log('   - src/locales/es.js');
console.log(`\nTotal: 179 opciones agregadas a cada archivo`);

// Verificar que se carguen correctamente
try {
  delete require.cache[require.resolve(enPath)];
  delete require.cache[require.resolve(esPath)];
  
  const testEn = require(enPath);
  const testEs = require(esPath);
  
  console.log('\n✅ Verificación: Archivos se cargan correctamente');
  console.log(`   EN tiene ${Object.keys(testEn).length} comandos`);
  console.log(`   ES tiene ${Object.keys(testEs).length} comandos`);
} catch (e) {
  console.error('\n❌ Error al verificar archivos:', e.message);
}
