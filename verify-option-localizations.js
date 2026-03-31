require('dotenv').config();
const path = require('path');
const { loadAndValidateCommands } = require('./src/utils/commandLoader');
const { autoLocalizeAllCommands } = require('./src/utils/autoLocalizeOptions');

const commandsPath = path.join(__dirname, 'src/commands');
const { commands } = loadAndValidateCommands(commandsPath);

// Aplicar auto-localización
autoLocalizeAllCommands(commands);

console.log('=== VERIFICANDO LOCALIZACIONES DE OPCIONES ===\n');

let totalOptions = 0;
let localizedOptions = 0;

commands.forEach(cmd => {
  const json = cmd.data.toJSON();
  
  function checkOptions(options, path = '') {
    if (!options) return;
    
    options.forEach(opt => {
      const currentPath = path ? `${path}.${opt.name}` : opt.name;
      
      if (opt.type === 1 || opt.type === 2) {
        // Subcomando o grupo
        if (opt.options) {
          checkOptions(opt.options, currentPath);
        }
      } else {
        // Opción real
        totalOptions++;
        
        if (opt.description_localizations && 
            (opt.description_localizations['es-ES'] || opt.description_localizations['es-419'])) {
          localizedOptions++;
        } else {
          console.log(`❌ /${json.name} → ${currentPath}: Sin localización`);
        }
      }
    });
  }
  
  checkOptions(json.options);
});

console.log(`\n=== RESUMEN ===`);
console.log(`Total opciones: ${totalOptions}`);
console.log(`Opciones localizadas: ${localizedOptions}`);
console.log(`Porcentaje: ${((localizedOptions / totalOptions) * 100).toFixed(1)}%`);

if (localizedOptions === totalOptions) {
  console.log(`\n✅ TODAS las opciones están localizadas!`);
} else {
  console.log(`\n⚠️  Faltan ${totalOptions - localizedOptions} opciones por localizar`);
}
