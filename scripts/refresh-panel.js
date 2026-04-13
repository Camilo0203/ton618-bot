/**
 * Script para forzar la actualización del panel de tickets
 * Elimina los datos del panel de la DB para que se regenere
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ton618_bot';

async function refreshPanel() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    
    // Eliminar referencias al panel para forzar recreación
    const result = await db.collection('settings').updateMany(
      {},
      {
        $unset: {
          panel_message_id: "",
          panel_channel_id: ""
        }
      }
    );
    
    console.log(`✅ Panel reseteado en ${result.modifiedCount} servidores`);
    console.log('🔄 Reinicia el bot y el panel se creará automáticamente en español');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

refreshPanel();
