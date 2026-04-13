/**
 * Script para verificar qué claves del panel faltan en español
 */

function checkMissingKeys() {
  console.log('🔍 Verificando claves del panel en español...\n');
  
  try {
    const { t } = require('../src/utils/i18n');
    
    const panelKeys = [
      'ticket.panel.title',
      'ticket.panel.description',
      'ticket.panel.footer',
      'ticket.panel.categories_heading',
      'ticket.panel.categories_cta',
      'ticket.panel.default_category',
      'ticket.panel.default_description',
      'ticket.panel.queue_name',
      'ticket.panel.queue_value',
      'ticket.panel.faq_button'
    ];
    
    console.log('📋 Estado de las traducciones:');
    panelKeys.forEach(key => {
      const es = t('es', key);
      const en = t('en', key);
      const isMissingEs = es === key || es.includes('NOT FOUND') || !es;
      const isMissingEn = en === key || en.includes('NOT FOUND') || !en;
      
      console.log(`\n${key}:`);
      console.log(`  ES: ${isMissingEs ? '❌ FALTA' : '✅ ' + es.substring(0, 50) + (es.length > 50 ? '...' : '')}`);
      console.log(`  EN: ${isMissingEn ? '❌ FALTA' : '✅ ' + en.substring(0, 50) + (en.length > 50 ? '...' : '')}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkMissingKeys();
