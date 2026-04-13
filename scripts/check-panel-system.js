/**
 * Script para verificar el sistema de creación de paneles
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ton618_bot';

async function checkPanelSystem() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    const settingsCol = db.collection('settings');
    
    // Verificar estado actual
    const allSettings = await settingsCol.find({}).toArray();
    
    console.log('\n📊 Estado actual de los servidores:');
    allSettings.forEach(doc => {
      const guildId = doc.guild_id || doc._id;
      const language = doc.bot_language || 'undefined';
      const hasPanel = doc.panel_message_id ? 'SÍ' : 'NO';
      const panelChannel = doc.panel_channel_id || 'N/A';
      
      console.log(`  Guild ${guildId}:`);
      console.log(`    Idioma: ${language}`);
      console.log(`    Panel: ${hasPanel}`);
      if (hasPanel === 'SÍ') {
        console.log(`    Canal: ${panelChannel}`);
        console.log(`    Mensaje: ${doc.panel_message_id}`);
      }
      console.log('');
    });
    
    // Verificar traducciones en español
    console.log('🔍 Verificando traducciones españolas...');
    try {
      const { t } = require('../src/utils/i18n');
      
      const testTranslations = [
        'ticket.panel.title',
        'ticket.panel.description',
        'ticket.panel.footer',
        'ticket.panel.categories_heading',
        'ticket.picker.select_placeholder'
      ];
      
      testTranslations.forEach(key => {
        const es = t('es', key);
        const en = t('en', key);
        console.log(`  ${key}:`);
        console.log(`    ES: ${es}`);
        console.log(`    EN: ${en}`);
        console.log('');
      });
      
    } catch (error) {
      console.error('❌ Error al verificar traducciones:', error.message);
    }
    
    console.log('\n✅ Si todos los idiomas muestran "es", reinicia el bot.');
    console.log('💡 Si el panel no aparece, usa el comando !panel en tu servidor.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkPanelSystem();
