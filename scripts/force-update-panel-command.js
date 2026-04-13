/**
 * Script para simular el comando /setup tickets panel y forzar actualización
 * Esto creará un nuevo panel con las traducciones correctas
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ton618_bot';

async function forceUpdatePanelCommand() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    const settingsCol = db.collection('settings');
    
    // Resetear completamente las personalizaciones del panel
    const result = await settingsCol.updateMany(
      {},
      {
        $unset: {
          panel_message_id: "",
          panel_channel_id: "",
          ticket_panel_title: "",
          ticket_panel_description: "",
          ticket_panel_footer: "",
          ticket_panel_color: ""
        }
      }
    );
    
    console.log(`✅ Reset completado en ${result.modifiedCount} servidores`);
    console.log('\n🔄 AHORA EJECUTA ESTOS COMANDOS EN DISCORD:');
    console.log('1. Ve a tu servidor Discord');
    console.log('2. Ejecuta: /setup tickets panel');
    console.log('3. Selecciona el canal donde quieres el panel');
    console.log('4. El panel se creará automáticamente en español');
    
    console.log('\n💡 ALTERNATIVA:');
    console.log('Si no tienes permisos para /setup, pide a un admin que ejecute:');
    console.log('/setup tickets panel');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

forceUpdatePanelCommand();
