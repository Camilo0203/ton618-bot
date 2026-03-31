require('dotenv').config();
const path = require('path');
const { loadAndValidateCommands } = require('./src/utils/commandLoader');
const { autoLocalizeAllCommands } = require('./src/utils/autoLocalizeOptions');

const commandsPath = path.join(__dirname, 'src/commands');
const { commands } = loadAndValidateCommands(commandsPath);

// Aplicar auto-localización
autoLocalizeAllCommands(commands);

console.log('=== VERIFICANDO NOMBRES Y DESCRIPCIONES DE OPCIONES ===\n');

// Tomar un comando de ejemplo
const setupCmd = commands.find(c => c.data.name === 'setup');
if (setupCmd) {
  const json = setupCmd.data.toJSON();
  
  console.log('Comando: /setup');
  console.log('\nPrimeras 5 opciones:\n');
  
  let count = 0;
  function showOptions(options, indent = '') {
    if (!options || count >= 5) return;
    
    options.forEach(opt => {
      if (count >= 5) return;
      
      if (opt.type === 1 || opt.type === 2) {
        console.log(`${indent}${opt.name} (${opt.type === 1 ? 'subcomando' : 'grupo'})`);
        if (opt.options) {
          showOptions(opt.options, indent + '  ');
        }
      } else {
        count++;
        console.log(`${indent}📌 Opción #${count}:`);
        console.log(`${indent}   Nombre: "${opt.name}"`);
        console.log(`${indent}   Nombre localizado (ES): ${opt.name_localizations?.['es-ES'] || 'NO'}`);
        console.log(`${indent}   Descripción (EN): "${opt.description}"`);
        console.log(`${indent}   Descripción (ES): "${opt.description_localizations?.['es-ES'] || 'NO'}"`);
        console.log();
      }
    });
  }
  
  showOptions(json.options);
}

console.log('\n=== IMPORTANTE ===');
console.log('Discord NO permite traducir los NOMBRES de las opciones (user, channel, etc.)');
console.log('Solo se pueden traducir las DESCRIPCIONES de las opciones.');
console.log('\nLo que el usuario ve:');
console.log('  - Nombre de opción: "user" (siempre en inglés)');
console.log('  - Descripción: "Usuario para advertir" (en español) ✅');
