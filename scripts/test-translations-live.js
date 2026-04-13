/**
 * Script para probar las traducciones en tiempo real
 * Simula exactamente cómo el bot genera el panel
 */

function testLiveTranslations() {
  console.log('🧪 Probando traducciones en tiempo real...\n');
  
  try {
    // Simular el proceso exacto del bot
    const { t } = require('../src/utils/i18n');
    const { buildTicketPanelPayload } = require('../src/domain/tickets/panelPayload');
    
    // Probar traducciones individuales
    const language = 'es';
    const keys = [
      'ticket.panel.author_name',
      'ticket.panel.title',
      'ticket.panel.description',
      'ticket.panel.footer',
      'ticket.panel.categories_heading',
      'ticket.panel.categories_cta'
    ];
    
    console.log('📋 Traducciones individuales:');
    keys.forEach(key => {
      const translation = t(language, key);
      console.log(`  ${key}: ${translation}`);
    });
    
    console.log('\n🔍 Probando si hay caché...');
    // Forzar recarga del módulo de traducciones
    delete require.cache[require.resolve('../src/utils/i18n')];
    const { t: t2 } = require('../src/utils/i18n');
    
    console.log('📋 Traducciones después de recargar:');
    keys.forEach(key => {
      const translation = t2(language, key);
      console.log(`  ${key}: ${translation}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLiveTranslations();
