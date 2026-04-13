/**
 * Script para verificar la estructura exacta del archivo español
 */

function checkStructure() {
  console.log('🔍 Verificando estructura del archivo español...\n');
  
  try {
    const es = require('../src/locales/es.js');
    
    console.log('📋 Estructura de ticket:');
    console.log('ticket existe:', !!es.ticket);
    if (es.ticket) {
      console.log('ticket.panel existe:', !!es.ticket.panel);
      if (es.ticket.panel) {
        console.log('ticket.panel.title:', es.ticket.panel.title);
        console.log('ticket.panel.description:', es.ticket.panel.description ? 'EXISTS' : 'MISSING');
        console.log('ticket.panel.footer:', es.ticket.panel.footer);
      }
    }
    
    console.log('\n📋 Todas las claves de primer nivel:');
    console.log(Object.keys(es).sort());
    
    console.log('\n📋 Claves dentro de ticket:');
    if (es.ticket) {
      console.log(Object.keys(es.ticket).sort());
    }
    
    console.log('\n📋 Claves dentro de ticket.panel:');
    if (es.ticket && es.ticket.panel) {
      console.log(Object.keys(es.ticket.panel).sort());
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkStructure();
