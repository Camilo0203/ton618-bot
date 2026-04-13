/**
 * Script para forzar la actualización del panel de tickets
 * Elimina referencias viejas para que el panel se regenere con nuevas traducciones
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ton618_bot';

async function forcePanelRefresh() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    const settingsCol = db.collection('settings');
    
    // Resetear todas las referencias del panel
    const result = await settingsCol.updateMany(
      {},
      {
        $unset: {
          panel_message_id: "",
          panel_channel_id: "",
          ticket_panel_title: "",
          ticket_panel_description: "",
          ticket_panel_footer: ""
        }
      }
    );
    
    console.log(`✅ Panel reseteado en ${result.modifiedCount} servidores`);
    console.log('\n🔄 PASOS SIGUIENTES:');
    console.log('1. REINICIA EL BOT AHORA (Ctrl+C y vuelve a ejecutar)');
    console.log('2. El bot creará nuevos paneles con traducciones en español');
    console.log('3. Si el panel sigue en inglés, elimina el mensaje manualmente');
    console.log('4. Usa el comando !panel en tu servidor Discord');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

forcePanelRefresh();
