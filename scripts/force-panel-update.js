/**
 * Script para forzar actualización del panel de tickets en tiempo real
 * Busca todos los paneles existentes y los actualiza con el nuevo idioma
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ton618_bot';

async function forcePanelUpdate() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    const settingsCol = db.collection('settings');
    
    // Buscar servidores con panel_message_id
    const panels = await settingsCol.find({
      panel_message_id: { $exists: true, $ne: null }
    }).toArray();
    
    console.log(`📋 Encontrados ${panels.length} paneles para actualizar`);
    
    if (panels.length === 0) {
      console.log('⚠️ No hay paneles existentes. Reinicia el bot para crear nuevos paneles en español.');
      return;
    }
    
    // Resetear todos los paneles para forzar recreación
    const result = await settingsCol.updateMany(
      { panel_message_id: { $exists: true } },
      {
        $unset: {
          panel_message_id: "",
          panel_channel_id: ""
        }
      }
    );
    
    console.log(`✅ ${result.modifiedCount} paneles reseteados`);
    console.log('\n🔄 PASOS SIGUIENTES:');
    console.log('1. Reinicia el bot AHORA');
    console.log('2. El bot creará nuevos paneles automáticamente en español');
    console.log('3. Si el panel sigue en inglés, elimina el mensaje manualmente y usa !panel');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

forcePanelUpdate();
