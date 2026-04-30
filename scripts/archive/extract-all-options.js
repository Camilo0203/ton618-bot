require('dotenv').config();
const path = require('path');
const { loadAndValidateCommands } = require('./src/utils/commandLoader');

const commandsPath = path.join(__dirname, 'src/commands');
const { commands } = loadAndValidateCommands(commandsPath);

console.log('=== EXTRAYENDO TODAS LAS OPCIONES DE COMANDOS ===\n');

const allOptions = [];

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
        // Es una opción real (string, user, channel, etc.)
        allOptions.push({
          command: json.name,
          path: fullPath,
          optionName: opt.name,
          optionDescription: opt.description,
          type: opt.type
        });
      }
    });
  };
  
  extractOptions(json.options, json.name);
});

console.log(`Total de opciones encontradas: ${allOptions.length}\n`);

// Agrupar por comando
const byCommand = {};
allOptions.forEach(opt => {
  if (!byCommand[opt.command]) {
    byCommand[opt.command] = [];
  }
  byCommand[opt.command].push(opt);
});

Object.keys(byCommand).sort().forEach(cmdName => {
  console.log(`\n📌 /${cmdName} (${byCommand[cmdName].length} opciones):`);
  byCommand[cmdName].forEach(opt => {
    console.log(`   - ${opt.path} → "${opt.optionName}" (${opt.optionDescription})`);
  });
});

// Generar estructura de claves i18n sugerida
console.log('\n\n=== ESTRUCTURA I18N SUGERIDA ===\n');
Object.keys(byCommand).sort().forEach(cmdName => {
  console.log(`"${cmdName}": {`);
  console.log(`  "options": {`);
  
  const uniqueOptions = {};
  byCommand[cmdName].forEach(opt => {
    uniqueOptions[opt.optionName] = opt.optionDescription;
  });
  
  Object.keys(uniqueOptions).sort().forEach(optName => {
    console.log(`    "${optName}": {`);
    console.log(`      "name": "${optName}",`);
    console.log(`      "description": "${uniqueOptions[optName]}"`);
    console.log(`    },`);
  });
  
  console.log(`  }`);
  console.log(`},`);
});
