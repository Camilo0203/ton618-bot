const fs = require('fs');
const path = require('path');

// Cargar datos de opciones
const data = JSON.parse(fs.readFileSync('option-descriptions.json', 'utf8'));

console.log('=== APLICANDO LOCALIZACIONES A OPCIONES DE COMANDOS ===\n');

// Mapeo de comandos a sus archivos
const commandFiles = {
  'audit': 'src/commands/admin/config/audit.js',
  'config': 'src/commands/admin/config/config.js',
  'debug': 'src/commands/developer/system/debug.js',
  'help': 'src/commands/public/help.js',
  'modlogs': 'src/commands/admin/moderation/modlogs.js',
  'setup': 'src/commands/admin/config/setup/index.js',
  'staff': 'src/commands/staff/staff.js',
  'stats': 'src/commands/admin/config/stats.js',
  'ticket': 'src/commands/staff/ticket.js',
  'verify': 'src/commands/admin/config/verify/index.js',
  'warn': 'src/commands/admin/moderation/warn.js'
};

let totalModified = 0;

Object.keys(commandFiles).forEach(cmdName => {
  const filePath = path.join(__dirname, commandFiles[cmdName]);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Verificar si ya importa withOptionDescriptionLocalizations
  if (!content.includes('withOptionDescriptionLocalizations')) {
    // Agregar import si existe withDescriptionLocalizations
    if (content.includes('withDescriptionLocalizations')) {
      content = content.replace(
        /const \{ ([^}]+withDescriptionLocalizations[^}]*) \} = require\(["']\.\.\/\.\.\/\.\.\/utils\/slashLocalizations["']\);/,
        'const { $1, withOptionDescriptionLocalizations } = require("../../../utils/slashLocalizations");'
      );
      content = content.replace(
        /const \{ ([^}]+withDescriptionLocalizations[^}]*) \} = require\(["']\.\.\/\.\.\/utils\/slashLocalizations["']\);/,
        'const { $1, withOptionDescriptionLocalizations } = require("../../utils/slashLocalizations");'
      );
      content = content.replace(
        /const \{ ([^}]+withDescriptionLocalizations[^}]*) \} = require\(["']\.\.\/utils\/slashLocalizations["']\);/,
        'const { $1, withOptionDescriptionLocalizations } = require("../utils/slashLocalizations");'
      );
    }
  }
  
  const options = data.byCommand[cmdName];
  if (!options || options.length === 0) {
    return;
  }
  
  console.log(`\n📝 Procesando /${cmdName} (${options.length} opciones)...`);
  
  // Para cada opción, intentar agregar la localización
  let modified = 0;
  options.forEach(opt => {
    const optionName = opt.optionName;
    const pathKey = opt.path.replace(/\./g, '_');
    
    // Buscar patrones como: .addUserOption((o) => o.setName("user").setDescription("..."))
    const patterns = [
      // Patrón 1: (o) => o.setName("name")
      new RegExp(`\\.add\\w+Option\\(\\(o\\)\\s*=>\\s*o\\.setName\\(["']${optionName}["']\\)`, 'g'),
      // Patrón 2: (option) => option.setName("name")
      new RegExp(`\\.add\\w+Option\\(\\(option\\)\\s*=>\\s*option\\.setName\\(["']${optionName}["']\\)`, 'g'),
      // Patrón 3: .addOption((o) => o.setName("name")
      new RegExp(`\\.addOption\\(\\(o\\)\\s*=>\\s*o\\.setName\\(["']${optionName}["']\\)`, 'g'),
    ];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        modified += matches.length;
      }
    });
  });
  
  if (modified > 0) {
    console.log(`   ✅ ${modified} opciones identificadas`);
    totalModified += modified;
  }
  
  // Guardar cambios si hubo modificaciones en imports
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   💾 Import actualizado`);
  }
});

console.log(`\n=== RESUMEN ===`);
console.log(`Total opciones identificadas: ${totalModified}`);
console.log(`\nNOTA: Las localizaciones se aplicarán automáticamente cuando se use`);
console.log(`withOptionDescriptionLocalizations() en cada opción.`);
console.log(`\nDebido al volumen (179 opciones), se recomienda un enfoque diferente:`);
console.log(`Usar un wrapper automático que intercepte las opciones al momento del deploy.`);
