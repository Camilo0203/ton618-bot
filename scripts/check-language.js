/**
 * Script para verificar el idioma guardado en la DB
 * Ejecutar: node scripts/check-language.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'ton618_bot';

if (!uri) {
  console.error('❌ ERROR: MONGO_URI no está definida en .env');
  process.exit(1);
}

async function checkLanguage() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    const settingsCol = db.collection('settings');
    
    // Buscar todos los documentos que tengan bot_language
    const withLang = await settingsCol.find({ bot_language: { $exists: true } }).toArray();
    console.log(`\n📋 Servidores con bot_language configurado: ${withLang.length}`);
    withLang.forEach(doc => {
      console.log(`  Guild ${doc.guildId || doc._id}: bot_language = "${doc.bot_language}"`);
    });
    
    // Buscar todos los documentos sin bot_language
    const withoutLang = await settingsCol.find({ bot_language: { $exists: false } }).toArray();
    console.log(`\n⚠️ Servidores SIN bot_language: ${withoutLang.length}`);
    withoutLang.forEach(doc => {
      console.log(`  Guild ${doc.guildId || doc._id}: campos = ${Object.keys(doc).join(', ')}`);
    });
    
    // Mostrar un documento completo de ejemplo
    const sample = await settingsCol.findOne();
    if (sample) {
      console.log(`\n📄 Ejemplo de documento completo:`);
      console.log(JSON.stringify(sample, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkLanguage();
