require('dotenv').config();
const { settings } = require('./src/utils/database/settings');
const { connectDB, disconnectDB } = require('./src/utils/database/core');

async function run() {
  await connectDB();
  console.log("Conectado a la base de datos...");
  console.log("Limpiando el idioma forzado de todos los servidores...");
  
  // Establecer bot_language en null para que vuelva a ser automático
  const res = await settings.collection().updateMany({}, { $set: { bot_language: null } });
  
  console.log(`¡Listo! Se ha restablecido el idioma automático en ${res.modifiedCount} servidores.`);
  await disconnectDB();
  process.exit(0);
}

run().catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
