require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { loadAndValidateCommands } = require('./src/utils/commandLoader');

const commandsPath = path.join(__dirname, 'src/commands');
const { commands } = loadAndValidateCommands(commandsPath);

console.log('=== EXTRAYENDO TODAS LAS OPCIONES PARA LOCALIZACIÓN ===\n');

const allOptionDescriptions = new Map();

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
        const key = `${json.name}.options.${fullPath.replace(/\./g, '_')}_${opt.name}`;
        allOptionDescriptions.set(key, {
          command: json.name,
          path: fullPath,
          optionName: opt.name,
          description: opt.description
        });
      }
    });
  };
  
  extractOptions(json.options, json.name);
});

console.log(`Total de descripciones de opciones: ${allOptionDescriptions.size}\n`);

// Agrupar por comando
const byCommand = {};
allOptionDescriptions.forEach((data, key) => {
  if (!byCommand[data.command]) {
    byCommand[data.command] = [];
  }
  byCommand[data.command].push({ key, ...data });
});

// Generar estructura para en.js
console.log('=== ESTRUCTURA PARA EN.JS ===\n');
Object.keys(byCommand).sort().forEach(cmdName => {
  const options = byCommand[cmdName];
  
  console.log(`  // Agregar dentro de "${cmdName}":`);
  console.log(`  "options": {`);
  
  options.forEach(opt => {
    const simpleKey = `${opt.path.replace(/\./g, '_')}_${opt.optionName}`;
    console.log(`    "${simpleKey}": "${opt.description}",`);
  });
  
  console.log(`  },\n`);
});

console.log('\n=== RESUMEN POR COMANDO ===');
Object.keys(byCommand).sort().forEach(cmd => {
  console.log(`/${cmd}: ${byCommand[cmd].length} opciones`);
});

// Guardar en archivo para traducción
const outputData = {
  byCommand,
  totalOptions: allOptionDescriptions.size,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, 'option-descriptions.json'),
  JSON.stringify(outputData, null, 2)
);

console.log(`\n✅ Datos guardados en option-descriptions.json`);
