/**
 * Script para encontrar tu servidor ID
 * Reemplaza "NOMBRE_DE_TU_SERVIDOR" con el nombre real
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ton618_bot';

async function findGuild() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    const settingsCol = db.collection('settings');
    
    // Buscar todos los servidores
    const allGuilds = await settingsCol.find({}).toArray();
    
    console.log('\n📋 Lista de servidores:');
    allGuilds.forEach(doc => {
      const guildId = doc.guild_id || doc._id;
      const language = doc.bot_language || 'undefined';
      console.log(`  Guild ID: ${guildId} | Idioma: ${language}`);
    });
    
    console.log('\n💡 Busca tu Guild ID en la lista arriba y ejecuta:');
    console.log('node scripts/update-language.js TU_GUILD_ID es');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

findGuild();
