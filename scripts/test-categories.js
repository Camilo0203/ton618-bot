/**
 * Script para probar las traducciones de categorías
 */

function testCategories() {
  console.log('🧪 Probando traducciones de categorías...\n');
  
  try {
    const { t } = require('../src/utils/i18n');
    
    const categoryKeys = [
      'ticket.categories.support.label',
      'ticket.categories.support.description',
      'ticket.categories.billing.label',
      'ticket.categories.billing.description',
      'ticket.categories.report.label',
      'ticket.categories.report.description',
      'ticket.categories.partnership.label',
      'ticket.categories.partnership.description',
      'ticket.categories.staff.label',
      'ticket.categories.staff.description',
      'ticket.categories.bug.label',
      'ticket.categories.bug.description'
    ];
    
    console.log('📋 Traducciones en español:');
    categoryKeys.forEach(key => {
      const es = t('es', key);
      const en = t('en', key);
      console.log(`\n${key}:`);
      console.log(`  ES: ${es}`);
      console.log(`  EN: ${en}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCategories();
