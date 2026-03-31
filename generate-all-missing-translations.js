const fs = require('fs');
const path = require('path');

const en = require('./src/locales/en.js');
const es = require('./src/locales/es.js');

console.log('=== GENERANDO TODAS LAS TRADUCCIONES FALTANTES ===\n');

// Diccionario de traducciones automáticas
const translations = {
  // Comandos
  'Interactive help center for the commands available in this server': 'Centro de ayuda interactivo para los comandos disponibles en este servidor',
  'Ping the bot': 'Hacer ping al bot',
  
  // Setup subcomandos
  'Guided setup for a new support server': 'Configuración guiada para un nuevo servidor de soporte',
  'Update the welcome channel': 'Actualizar el canal de bienvenida',
  'Update the welcome message': 'Actualizar el mensaje de bienvenida',
  'Update the welcome embed title': 'Actualizar el título del embed de bienvenida',
  'Update the welcome embed color': 'Actualizar el color del embed de bienvenida',
  'Update the welcome embed footer': 'Actualizar el pie del embed de bienvenida',
  'Update the welcome banner image': 'Actualizar la imagen del banner de bienvenida',
  'Toggle member avatar in welcome embed': 'Alternar avatar del miembro en embed de bienvenida',
  'Update the goodbye channel': 'Actualizar el canal de despedida',
  'Update the goodbye message': 'Actualizar el mensaje de despedida',
  'Update the goodbye embed title': 'Actualizar el título del embed de despedida',
  'Update the goodbye embed color': 'Actualizar el color del embed de despedida',
  'Update the goodbye embed footer': 'Actualizar el pie del embed de despedida',
  'Toggle member avatar in goodbye embed': 'Alternar avatar del miembro en embed de despedida',
  'Test the welcome or goodbye message': 'Probar el mensaje de bienvenida o despedida',
  'Disable a command in this server': 'Deshabilitar un comando en este servidor',
  'Enable a previously disabled command': 'Habilitar un comando previamente deshabilitado',
  'Check if a command is enabled or disabled': 'Verificar si un comando está habilitado o deshabilitado',
  'Reset all disabled commands': 'Restablecer todos los comandos deshabilitados',
  'List all disabled commands': 'Listar todos los comandos deshabilitados',
  'Open the command management panel': 'Abrir el panel de gestión de comandos',
  
  // Stats subcomandos
  'View detailed ratings for a staff member': 'Ver calificaciones detalladas de un miembro del staff',
  
  // Verify subcomandos
  'Configure auto-kick for unverified members': 'Configurar expulsión automática para miembros no verificados',
  'Configure anti-raid protection': 'Configurar protección anti-raid',
  'Manage the question pool for rotating questions': 'Gestionar el pool de preguntas para preguntas rotativas',
  'Add a question to the pool': 'Agregar una pregunta al pool',
  'List all questions in the pool': 'Listar todas las preguntas en el pool',
  'Remove a question from the pool': 'Eliminar una pregunta del pool',
  'Clear all questions from the pool': 'Limpiar todas las preguntas del pool',
  
  // Debug subcomandos
  'View live AutoMod badge progress across guilds': 'Ver progreso de insignia de AutoMod en vivo en todos los servidores',
  'Manage guild entitlements': 'Gestionar derechos de servidor',
  'Set a guild plan manually': 'Establecer un plan de servidor manualmente',
  'Enable or disable supporter recognition': 'Activar o desactivar reconocimiento de supporter',
  
  // Staff subcomandos
  'Mark yourself as away': 'Marcarte como ausente',
  'Mark yourself as available': 'Marcarte como disponible',
  'View your assigned tickets': 'Ver tus tickets asignados',
  'Add a warning to a user': 'Agregar una advertencia a un usuario',
  'Check warnings for a user': 'Verificar advertencias de un usuario',
  'Remove a warning': 'Eliminar una advertencia',
  
  // Ticket subcomandos
  'Add an internal note to the ticket': 'Agregar una nota interna al ticket',
  'List all notes in the ticket': 'Listar todas las notas en el ticket',
  'Clear all notes from the ticket': 'Limpiar todas las notas del ticket',
  'Manage playbook recommendations': 'Gestionar recomendaciones de manual',
  'List active recommendations': 'Listar recomendaciones activas',
  'Confirm a recommendation': 'Confirmar una recomendación',
  'Dismiss a recommendation': 'Descartar una recomendación',
  'Apply a macro from a recommendation': 'Aplicar una macro de una recomendación',
  'Enable playbook for this ticket': 'Habilitar manual para este ticket',
  'Disable playbook for this ticket': 'Deshabilitar manual para este ticket'
};

// Función para copiar estructura recursivamente
function copyStructureWithTranslations(enObj, esObj, path = '') {
  if (!enObj || typeof enObj !== 'object') {
    return enObj;
  }
  
  const result = esObj || {};
  
  Object.keys(enObj).forEach(key => {
    const currentPath = path ? `${path}.${key}` : key;
    const value = enObj[key];
    
    if (key === 'description' && typeof value === 'string') {
      // Es una descripción que necesita traducción
      if (!result[key]) {
        const translation = translations[value] || value;
        result[key] = translation;
        console.log(`✅ Traducido: ${currentPath}`);
        console.log(`   EN: "${value}"`);
        console.log(`   ES: "${translation}"\n`);
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Es un objeto anidado, copiar recursivamente
      result[key] = copyStructureWithTranslations(value, result[key], currentPath);
    }
  });
  
  return result;
}

// Copiar todas las secciones slash de EN a ES
const updatedEs = { ...es };

Object.keys(en).forEach(cmdName => {
  if (en[cmdName]?.slash) {
    if (!updatedEs[cmdName]) {
      updatedEs[cmdName] = {};
    }
    
    console.log(`\n📌 Procesando comando: ${cmdName}`);
    updatedEs[cmdName].slash = copyStructureWithTranslations(
      en[cmdName].slash,
      updatedEs[cmdName].slash,
      `${cmdName}.slash`
    );
  }
});

// Guardar el archivo actualizado
const esPath = path.join(__dirname, 'src/locales/es.js');
const esContent = `module.exports = ${JSON.stringify(updatedEs, null, 2)};\n`;
fs.writeFileSync(esPath, esContent, 'utf8');

console.log('\n✅ Archivo es.js actualizado con todas las traducciones faltantes');
console.log('Ejecuta el deploy nuevamente para aplicar los cambios');
