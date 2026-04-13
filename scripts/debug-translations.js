/**
 * Script para depurar el sistema de traducciones
 */

const path = require('path');

// Simular el sistema de traducciones
function debugTranslations() {
  console.log('🔍 Depurando sistema de traducciones...\n');
  
  try {
    // Cargar archivos directamente
    const en = require('../src/locales/en.js');
    const es = require('../src/locales/es.js');
    
    console.log('📄 Archivos cargados correctamente');
    
    // Verificar estructura de traducciones
    const keys = [
      'ticket.panel.title',
      'ticket.panel.description', 
      'ticket.panel.footer',
      'ticket.panel.categories_heading',
      'ticket.picker.select_placeholder'
    ];
    
    keys.forEach(key => {
      const parts = key.split('.');
      let enValue = en;
      let esValue = es;
      
      for (const part of parts) {
        enValue = enValue?.[part];
        esValue = esValue?.[part];
      }
      
      console.log(`\n${key}:`);
      console.log(`  EN: ${enValue || 'NOT FOUND'}`);
      console.log(`  ES: ${esValue || 'NOT FOUND'}`);
    });
    
    // Probar la función t directamente
    console.log('\n🧪 Probando función t...');
    const { t } = require('../src/utils/i18n');
    
    keys.forEach(key => {
      const esResult = t('es', key);
      const enResult = t('en', key);
      console.log(`\n${key}:`);
      console.log(`  t('es'): ${esResult}`);
      console.log(`  t('en'): ${enResult}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugTranslations();
