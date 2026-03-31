const fs = require('fs');
const path = require('path');

const en = require('./src/locales/en.js');
const es = require('./src/locales/es.js');

console.log('=== IDENTIFICANDO CLAVES SLASH FALTANTES EN ES.JS ===\n');

const missing = [];

// Verificar cada comando que tiene sección slash en EN
Object.keys(en).forEach(cmdName => {
  if (en[cmdName]?.slash) {
    // Verificar si existe en ES
    if (!es[cmdName]) {
      missing.push(`${cmdName} (comando completo falta)`);
      return;
    }
    
    if (!es[cmdName].slash) {
      missing.push(`${cmdName}.slash (sección completa falta)`);
      return;
    }
    
    // Verificar descripción del comando
    if (en[cmdName].slash.description && !es[cmdName].slash.description) {
      missing.push(`${cmdName}.slash.description`);
    }
    
    // Verificar subcomandos
    if (en[cmdName].slash.subcommands) {
      Object.keys(en[cmdName].slash.subcommands).forEach(subName => {
        if (!es[cmdName].slash.subcommands) {
          missing.push(`${cmdName}.slash.subcommands (sección completa falta)`);
          return;
        }
        
        if (!es[cmdName].slash.subcommands[subName]) {
          missing.push(`${cmdName}.slash.subcommands.${subName}`);
        } else if (!es[cmdName].slash.subcommands[subName].description) {
          missing.push(`${cmdName}.slash.subcommands.${subName}.description`);
        }
      });
    }
  }
});

console.log(`Total de claves faltantes: ${missing.length}\n`);

if (missing.length > 0) {
  console.log('Claves faltantes:');
  missing.forEach(key => console.log(`  - ${key}`));
} else {
  console.log('✅ No hay claves faltantes!');
}

// Traducciones automáticas básicas
const autoTranslations = {
  'Administrative audits and exports': 'Auditorías administrativas y exportaciones',
  'Export tickets to CSV with filters': 'Exportar tickets a CSV con filtros',
  'Configure the server operational settings': 'Configurar los ajustes operacionales del servidor',
  'Guided setup for a new support server': 'Configuración guiada para un nuevo servidor de soporte',
  'View ticket operations statistics': 'Ver estadísticas de operaciones de tickets',
  'View server-wide ticket metrics': 'Ver métricas de tickets del servidor',
  'View SLA compliance and escalation metrics': 'Ver métricas de cumplimiento y escalado de SLA',
  'View stats for a staff member': 'Ver estadísticas de un miembro del staff',
  'Rank staff by closed tickets': 'Clasificar staff por tickets cerrados',
  'Rank staff by ticket ratings': 'Clasificar staff por calificaciones de tickets',
  'View detailed ratings for a staff member': 'Ver calificaciones detalladas de un miembro del staff',
  'Owner-only diagnostics and entitlement tools': 'Herramientas de diagnóstico y derechos solo para el propietario',
  'View bot status and deploy info': 'Ver estado del bot e información de despliegue',
  'View live AutoMod badge progress across guilds': 'Ver progreso de insignia de AutoMod en vivo en todos los servidores',
  'View live health and heartbeat state': 'Ver estado de salud y latido en vivo',
  'View process memory usage': 'Ver uso de memoria del proceso',
  'View bot cache sizes': 'Ver tamaños de caché del bot',
  'List connected guilds': 'Listar servidores conectados',
  'View music subsystem status': 'Ver estado del subsistema de música',
  'Set a guild plan manually': 'Establecer un plan de servidor manualmente',
  'Enable or disable supporter recognition': 'Activar o desactivar reconocimiento de supporter',
  'Inspect the effective plan and supporter state for a guild': 'Inspeccionar el plan efectivo y estado de supporter para un servidor'
};

console.log('\n\n=== GENERANDO CORRECCIONES ===\n');
console.log('Ejecuta este código para agregar las traducciones faltantes:\n');
