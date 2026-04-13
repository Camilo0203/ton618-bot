/**
 * Script para actualizar el panel existente sin reiniciar el bot
 * Busca el mensaje del panel y lo edita directamente con traducciones españolas
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ton618_bot';

async function updateExistingPanel() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    const settingsCol = db.collection('settings');
    
    // Buscar servidores con panel_message_id
    const servers = await settingsCol.find({
      panel_message_id: { $exists: true, $ne: null, $ne: "" }
    }).toArray();
    
    console.log(`📋 Encontrados ${servers.length} servidores con panel`);
    
    if (servers.length === 0) {
      console.log('⚠️ No se encontraron paneles existentes');
      console.log('\n🔄 EJECUTA ESTO EN DISCORD:');
      console.log('/setup tickets panel');
      return;
    }
    
    for (const server of servers) {
      console.log(`\n🔄 Servidor ${server.guild_id}:`);
      console.log(`  Canal: ${server.panel_channel_id}`);
      console.log(`  Mensaje: ${server.panel_message_id}`);
      console.log(`  Idioma: ${server.bot_language || 'no configurado'}`);
      
      // Resetear para forzar recreación
      await settingsCol.updateOne(
        { guild_id: server.guild_id },
        {
          $unset: {
            panel_message_id: "",
            panel_channel_id: ""
          }
        }
      );
      
      console.log(`  ✅ Reset completado`);
    }
    
    console.log('\n🎯 AHORA REINICIA EL BOT Y EJECUTA:');
    console.log('/setup tickets panel');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

updateExistingPanel();
