/**
 * Script para actualizar el idioma de un servidor
 * Uso: node scripts/update-language.js GUILD_ID IDIOMA
 * Ejemplo: node scripts/update-language.js 123456789 es
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ton618_bot';

const guildId = process.argv[2];
const language = process.argv[3];

if (!uri) {
  console.error('❌ ERROR: MONGO_URI no está definida en .env');
  process.exit(1);
}

if (!guildId || !language) {
  console.error('❌ Uso: node scripts/update-language.js GUILD_ID IDIOMA');
  console.error('   Ejemplo: node scripts/update-language.js 123456789 es');
  process.exit(1);
}

if (!['es', 'en'].includes(language)) {
  console.error('❌ Idioma debe ser "es" o "en"');
  process.exit(1);
}

async function updateLanguage() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    const settingsCol = db.collection('settings');
    
    // Actualizar el idioma
    const result = await settingsCol.updateOne(
      { guild_id: guildId },
      { 
        $set: { 
          bot_language: language,
          language_selected_at: new Date(),
          language_onboarding_completed: true
        }
      }
    );
    
    if (result.matchedCount === 0) {
      console.log(`❌ No se encontró el servidor con guild_id: ${guildId}`);
    } else if (result.modifiedCount === 0) {
      console.log(`⚠️ El servidor ya tenía idioma "${language}"`);
    } else {
      console.log(`✅ Servidor ${guildId} actualizado a idioma "${language}"`);
      console.log('🔄 Reinicia el bot para ver los cambios');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

updateLanguage();
