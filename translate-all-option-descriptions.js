const fs = require('fs');
const path = require('path');

const esPath = path.join(__dirname, 'src/locales/es.js');
const es = require(esPath);

console.log('=== TRADUCIENDO TODAS LAS DESCRIPCIONES DE OPCIONES ===\n');

// Diccionario de traducciones
const translations = {
  // Palabras comunes
  'Filter by': 'Filtrar por',
  'filter by': 'filtrar por',
  'Start date': 'Fecha de inicio',
  'End date': 'Fecha de fin',
  'Maximum number of rows': 'Número máximo de filas',
  'Category ID': 'ID de categoría',
  'Discord category ID': 'ID de categoría de Discord',
  'Display label': 'Etiqueta de visualización',
  'Category description': 'Descripción de categoría',
  'Emoji for': 'Emoji para',
  'Default priority': 'Prioridad predeterminada',
  'Roles to ping': 'Roles a mencionar',
  'Custom welcome message': 'Mensaje de bienvenida personalizado',
  'Target guild ID': 'ID del servidor objetivo',
  'Plan tier': 'Nivel de plan',
  'Optional duration in days': 'Duración opcional en días',
  'Optional internal note': 'Nota interna opcional',
  'Enable or disable': 'Activar o desactivar',
  'Command name or usage path': 'Nombre del comando o ruta de uso',
  'Text channel for': 'Canal de texto para',
  'Whether the feature stays enabled': 'Si la función permanece habilitada',
  'Language to use': 'Idioma a usar',
  'Main dashboard and panel channel': 'Panel principal y canal de panel',
  'Log channel': 'Canal de registro',
  'Transcript channel': 'Canal de transcripciones',
  'Staff role': 'Rol de staff',
  'Admin role': 'Rol de administrador',
  'Channel where': 'Canal donde',
  'Role that': 'Rol que',
  'User to': 'Usuario a',
  'Reason for': 'Razón para',
  'Message to': 'Mensaje a',
  'Enable': 'Activar',
  'Disable': 'Desactivar',
  'Toggle': 'Alternar',
  
  // Frases completas específicas
  'ticket status': 'estado del ticket',
  'priority': 'prioridad',
  'category': 'categoría',
  'in YYYY-MM-DD': 'en formato YYYY-MM-DD',
  'comma-separated IDs': 'IDs separados por comas',
  'for this category': 'para esta categoría',
  'for direct help': 'para ayuda directa',
  'moderation logs': 'registros de moderación',
  'supporter recognition': 'reconocimiento de supporter',
  'supporter status': 'estado de supporter',
  'visible bot responses': 'respuestas visibles del bot',
  'optional': 'opcional',
};

function translateText(text) {
  if (!text || typeof text !== 'string') return text;
  
  let translated = text;
  
  // Aplicar traducciones
  Object.keys(translations).forEach(en => {
    const es = translations[en];
    translated = translated.replace(new RegExp(en, 'gi'), es);
  });
  
  return translated;
}

let translatedCount = 0;
let totalCount = 0;

// Recorrer todos los comandos y traducir opciones
Object.keys(es).forEach(cmdName => {
  if (es[cmdName]?.options) {
    Object.keys(es[cmdName].options).forEach(optKey => {
      totalCount++;
      const original = es[cmdName].options[optKey];
      
      // Verificar si contiene texto en inglés
      if (/[A-Z]|filter|Filter|Start|End|Maximum|Category|Discord|Display|Default|Roles|Custom|Target|Plan|Optional|Enable|Command|Text|Whether|Language|Main|Log|Transcript|Staff|Admin|Channel|Role|User|Reason|Message|Toggle/i.test(original)) {
        const translated = translateText(original);
        
        if (translated !== original) {
          es[cmdName].options[optKey] = translated;
          translatedCount++;
          console.log(`✅ ${cmdName}.options.${optKey}`);
          console.log(`   EN: "${original}"`);
          console.log(`   ES: "${translated}"\n`);
        }
      }
    });
  }
});

console.log(`\n=== RESUMEN ===`);
console.log(`Total opciones: ${totalCount}`);
console.log(`Traducidas: ${translatedCount}`);
console.log(`Sin cambios: ${totalCount - translatedCount}`);

// Guardar archivo actualizado
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

const esContent = `module.exports = ${objectToString(es)};\n`;
fs.writeFileSync(esPath, esContent, 'utf8');

console.log(`\n✅ Archivo es.js actualizado`);
console.log(`Ejecuta el deploy para aplicar los cambios`);
