const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en.js');
const esPath = path.join(__dirname, 'src/locales/es.js');

const en = require(enPath);
const es = require(esPath);

console.log('=== TRADUCIENDO TODAS LAS OPCIONES AL ESPAÑOL ===\n');

// Diccionario completo de traducciones
const fullTranslations = {
  // audit
  "Filter by ticket status": "Filtrar por estado del ticket",
  "Filter by priority": "Filtrar por prioridad",
  "Filter by category": "Filtrar por categoría",
  "Start date in YYYY-MM-DD": "Fecha de inicio en formato YYYY-MM-DD",
  "End date in YYYY-MM-DD": "Fecha de fin en formato YYYY-MM-DD",
  "Maximum number of rows (1-500)": "Número máximo de filas (1-500)",
  
  // config
  "Category ID from config.js": "ID de categoría desde config.js",
  "Discord category ID where tickets will be created": "ID de categoría de Discord donde se crearán los tickets",
  "Category ID to remove": "ID de categoría a eliminar",
  "Category ID to edit": "ID de categoría a editar",
  "Display label for the category": "Etiqueta de visualización para la categoría",
  "Category description": "Descripción de la categoría",
  "Emoji for the category": "Emoji para la categoría",
  "Default priority for tickets in this category": "Prioridad predeterminada para tickets en esta categoría",
  "Discord category ID": "ID de categoría de Discord",
  "Roles to ping (comma-separated IDs)": "Roles a mencionar (IDs separados por comas)",
  "Custom welcome message for this category": "Mensaje de bienvenida personalizado para esta categoría",
  "Category ID to toggle": "ID de categoría a alternar",
  
  // debug
  "Target guild ID": "ID del servidor objetivo",
  "Plan tier": "Nivel de plan",
  "Optional duration in days for Pro": "Duración opcional en días para Pro",
  "Optional internal note": "Nota interna opcional",
  "Enable or disable supporter recognition": "Activar o desactivar reconocimiento de supporter",
  "Optional duration in days for supporter status": "Duración opcional en días para estado de supporter",
  
  // help
  "Command name or usage path for direct help": "Nombre del comando o ruta de uso para ayuda directa",
  
  // modlogs
  "Text channel for moderation logs": "Canal de texto para registros de moderación",
  "Whether the feature stays enabled": "Si la función permanece habilitada",
  
  // setup - language
  "Language to use for visible bot responses": "Idioma a usar para respuestas visibles del bot",
  
  // setup - wizard
  "Main dashboard and panel channel": "Panel principal y canal de panel",
  "Log channel (optional)": "Canal de registro (opcional)",
  "Transcript channel (optional)": "Canal de transcripciones (opcional)",
  "Staff role (optional)": "Rol de staff (opcional)",
  "Admin role (optional)": "Rol de administrador (opcional)",
  
  // setup - tickets
  "Enable auto-assignment": "Activar asignación automática",
  "Enable round-robin rotation": "Activar rotación round-robin",
  "Require staff to be online": "Requerir que el staff esté en línea",
  "Enable escalation": "Activar escalado",
  "Minutes before first escalation": "Minutos antes de la primera escalación",
  "Minutes before second escalation": "Minutos antes de la segunda escalación",
  "Minutes before third escalation": "Minutos antes de la tercera escalación",
  "Priority level": "Nivel de prioridad",
  "SLA minutes for this priority": "Minutos de SLA para esta prioridad",
  "Custom Pro welcome message": "Mensaje de bienvenida personalizado Pro",
  "Embed title": "Título del embed",
  "Embed description": "Descripción del embed",
  "Embed color (hex without #)": "Color del embed (hex sin #)",
  "Footer text": "Texto del pie",
  "Thumbnail URL": "URL de miniatura",
  "Image URL": "URL de imagen",
  "Panel style": "Estilo del panel",
  "Enable smart ping": "Activar ping inteligente",
  "Minutes before smart ping": "Minutos antes del ping inteligente",
  "Enable auto-close": "Activar cierre automático",
  "Hours before auto-close warning": "Horas antes de la advertencia de cierre automático",
  "Hours before auto-close": "Horas antes del cierre automático",
  
  // stats
  "Staff member to view": "Miembro del staff a ver",
  
  // ticket
  "Note content": "Contenido de la nota",
  "Note ID to remove": "ID de nota a eliminar",
  "Recommendation ID": "ID de recomendación",
  "Macro to apply": "Macro a aplicar",
  
  // verify
  "Verification role": "Rol de verificación",
  "Panel channel": "Canal del panel",
  "Logs channel": "Canal de registros",
  "Verification mode": "Modo de verificación",
  "Minimum account age in days": "Edad mínima de cuenta en días",
  "Enable risk-based escalation": "Activar escalación basada en riesgo",
  "CAPTCHA type": "Tipo de CAPTCHA",
  "Enable auto-kick": "Activar expulsión automática",
  "Minutes before auto-kick": "Minutos antes de la expulsión automática",
  "Enable anti-raid": "Activar anti-raid",
  "Max joins per minute": "Máximo de entradas por minuto",
  "Lockdown duration in minutes": "Duración del bloqueo en minutos",
  "Question text": "Texto de la pregunta",
  "Correct answer": "Respuesta correcta",
  "Question ID": "ID de pregunta",
  
  // warn
  "User to warn": "Usuario a advertir",
  "Reason for the warning": "Razón de la advertencia",
  "User to check": "Usuario a verificar",
  "Warning ID to remove": "ID de advertencia a eliminar",
};

let updatedCount = 0;

// Recorrer todos los comandos y actualizar traducciones
Object.keys(en).forEach(cmdName => {
  if (en[cmdName]?.options && es[cmdName]?.options) {
    Object.keys(en[cmdName].options).forEach(optKey => {
      const enText = en[cmdName].options[optKey];
      const esText = es[cmdName].options[optKey];
      
      // Si la traducción existe en el diccionario, usarla
      if (fullTranslations[enText]) {
        if (esText !== fullTranslations[enText]) {
          es[cmdName].options[optKey] = fullTranslations[enText];
          updatedCount++;
          console.log(`✅ ${cmdName}.${optKey}`);
          console.log(`   EN: "${enText}"`);
          console.log(`   ES: "${fullTranslations[enText]}"\n`);
        }
      } else if (esText === enText || /^[A-Z]/.test(esText)) {
        // Si la traducción es igual al inglés o empieza con mayúscula (probablemente inglés)
        console.log(`⚠️  Falta traducción para: ${cmdName}.${optKey}`);
        console.log(`   EN: "${enText}"`);
        console.log(`   ES actual: "${esText}"\n`);
      }
    });
  }
});

console.log(`\n=== RESUMEN ===`);
console.log(`Opciones actualizadas: ${updatedCount}`);

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
console.log(`Ejecuta npm run deploy:safe:compact para aplicar los cambios`);
