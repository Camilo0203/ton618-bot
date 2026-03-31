require('dotenv').config();
const path = require('path');
const { loadAndValidateCommands } = require('./src/utils/commandLoader');
const { autoLocalizeAllCommands } = require('./src/utils/autoLocalizeOptions');

const commandsPath = path.join(__dirname, 'src/commands');
const { commands } = loadAndValidateCommands(commandsPath);

// Aplicar auto-localización
autoLocalizeAllCommands(commands);

console.log('=== VERIFICANDO LOCALIZACIONES ===\n');

// Verificar comandos específicos que el usuario reportó
const testCommands = ['audit', 'setup'];

testCommands.forEach(cmdName => {
  const cmd = commands.find(c => c.data.name === cmdName);
  if (!cmd) {
    console.log(`❌ Comando ${cmdName} no encontrado`);
    return;
  }
  
  const json = cmd.data.toJSON();
  
  console.log(`\n📌 /${cmdName}`);
  console.log(`   Descripción (EN): "${json.description}"`);
  console.log(`   Descripción (ES): "${json.description_localizations?.['es-ES'] || 'NO EXISTE'}"`);
  
  // Verificar subcomandos
  if (json.options) {
    json.options.slice(0, 3).forEach(opt => {
      if (opt.type === 1) { // Subcomando
        console.log(`\n   Subcomando: ${opt.name}`);
        console.log(`      Descripción (EN): "${opt.description}"`);
        console.log(`      Descripción (ES): "${opt.description_localizations?.['es-ES'] || 'NO EXISTE'}"`);
        
        // Verificar opciones del subcomando
        if (opt.options) {
          opt.options.slice(0, 2).forEach(subOpt => {
            console.log(`\n      Opción: ${subOpt.name}`);
            console.log(`         Descripción (EN): "${subOpt.description}"`);
            console.log(`         Descripción (ES): "${subOpt.description_localizations?.['es-ES'] || 'NO EXISTE'}"`);
          });
        }
      }
    });
  }
});

console.log('\n\n=== DIAGNÓSTICO ===');
console.log('Si las descripciones en español aparecen como "NO EXISTE",');
console.log('entonces el problema está en el sistema de auto-localización.');
