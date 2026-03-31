require('dotenv').config();
const path = require('path');
const { loadAndValidateCommands } = require('./src/utils/commandLoader');
const { autoLocalizeAllCommands } = require('./src/utils/autoLocalizeOptions');

const commandsPath = path.join(__dirname, 'src/commands');
const { commands } = loadAndValidateCommands(commandsPath);

// Aplicar auto-localización
autoLocalizeAllCommands(commands);

console.log('=== VERIFICACIÓN FINAL DE LOCALIZACIONES ===\n');

// Verificar comandos que el usuario reportó
const testCommands = ['audit', 'setup'];

testCommands.forEach(cmdName => {
  const cmd = commands.find(c => c.data.name === cmdName);
  if (!cmd) return;
  
  const json = cmd.data.toJSON();
  
  console.log(`\n📌 /${cmdName}`);
  console.log(`   Descripción (EN): "${json.description}"`);
  console.log(`   Descripción (ES): "${json.description_localizations?.['es-ES'] || json.description_localizations?.['es-419'] || 'NO LOCALIZADO'}"`);
  
  // Verificar primer subcomando
  if (json.options && json.options[0]) {
    const sub = json.options[0];
    console.log(`\n   Subcomando: ${sub.name}`);
    console.log(`      Descripción (EN): "${sub.description}"`);
    console.log(`      Descripción (ES): "${sub.description_localizations?.['es-ES'] || sub.description_localizations?.['es-419'] || 'NO LOCALIZADO'}"`);
    
    // Verificar primera opción del subcomando
    if (sub.options && sub.options[0]) {
      const opt = sub.options[0];
      console.log(`\n      Opción: ${opt.name}`);
      console.log(`         Descripción (EN): "${opt.description}"`);
      console.log(`         Descripción (ES): "${opt.description_localizations?.['es-ES'] || opt.description_localizations?.['es-419'] || 'NO LOCALIZADO'}"`);
    }
  }
});

console.log('\n\n=== RESUMEN ===');
console.log('Si las descripciones en español aparecen como "NO LOCALIZADO",');
console.log('significa que los comandos no tienen withDescriptionLocalizations configurado.');
console.log('\nSi las descripciones están en español, el problema está en Discord cache.');
console.log('El usuario debe cerrar Discord completamente y esperar 30 segundos.');
