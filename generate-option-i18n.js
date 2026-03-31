require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { loadAndValidateCommands } = require('./src/utils/commandLoader');

const commandsPath = path.join(__dirname, 'src/commands');
const { commands } = loadAndValidateCommands(commandsPath);

console.log('=== GENERANDO CLAVES I18N PARA DESCRIPCIONES DE OPCIONES ===\n');

const optionsByCommand = {};

commands.forEach(cmd => {
  const json = cmd.data.toJSON();
  
  const extractOptions = (options, parentPath = '') => {
    if (!options) return;
    
    options.forEach(opt => {
      const fullPath = parentPath ? `${parentPath}.${opt.name}` : opt.name;
      
      if (opt.type === 1 || opt.type === 2) { // Subcommand or SubcommandGroup
        if (opt.options) {
          extractOptions(opt.options, fullPath);
        }
      } else {
        // Es una opción real
        if (!optionsByCommand[json.name]) {
          optionsByCommand[json.name] = {};
        }
        
        const key = `${fullPath.replace(/\./g, '_')}_${opt.name}`;
        optionsByCommand[json.name][key] = {
          path: fullPath,
          name: opt.name,
          description: opt.description
        };
      }
    });
  };
  
  extractOptions(json.options, json.name);
});

// Generar estructura i18n para en.js
console.log('// Agregar esto a cada comando en en.js:\n');
Object.keys(optionsByCommand).sort().forEach(cmdName => {
  const options = optionsByCommand[cmdName];
  if (Object.keys(options).length === 0) return;
  
  console.log(`"${cmdName}": {`);
  console.log(`  "options": {`);
  
  Object.keys(options).sort().forEach(key => {
    const opt = options[key];
    console.log(`    "${opt.name}": "${opt.description}",`);
  });
  
  console.log(`  }`);
  console.log(`},\n`);
});

console.log('\n=== RESUMEN ===');
let totalOptions = 0;
Object.keys(optionsByCommand).forEach(cmd => {
  const count = Object.keys(optionsByCommand[cmd]).length;
  totalOptions += count;
  if (count > 0) {
    console.log(`/${cmd}: ${count} opciones`);
  }
});
console.log(`\nTotal: ${totalOptions} opciones para localizar`);
