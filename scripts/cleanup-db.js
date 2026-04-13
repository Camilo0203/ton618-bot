/**
 * Script para limpiar datos basura de la base de datos
 * Ejecutar: node scripts/cleanup-db.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ton618';
const dbName = process.env.MONGODB_DB_NAME || 'ton618_bot';

async function cleanupDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(dbName);
    
    // 1. Limpiar paneles personalizados de servidores sin PRO
    const settingsResult = await db.collection('settings').updateMany(
      {},
      {
        $unset: {
          ticket_panel_title: "",
          ticket_panel_description: "",
          ticket_panel_footer: "",
          ticket_panel_color: ""
        }
      }
    );
    console.log(`✅ Limpiados paneles personalizados: ${settingsResult.modifiedCount} documentos`);
    
    // 2. Limpiar logs antiguos (más de 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const auditResult = await db.collection('auditLogs').deleteMany({
      timestamp: { $lt: thirtyDaysAgo }
    });
    console.log(`✅ Eliminados logs antiguos: ${auditResult.deletedCount} documentos`);
    
    // 3. Limpiar verificaciones expiradas
    const verifResult = await db.collection('verifCaptchas').deleteMany({
      expires_at: { $lt: new Date() }
    });
    console.log(`✅ Eliminadas verificaciones expiradas: ${verifResult.deletedCount} documentos`);
    
    // 4. Limpiar códigos de verificación usados/expirados
    const codesResult = await db.collection('verifCodes').deleteMany({
      $or: [
        { expires_at: { $lt: new Date() } },
        { used: true }
      ]
    });
    console.log(`✅ Eliminados códigos usados/expirados: ${codesResult.deletedCount} documentos`);
    
    // 5. Limpiar locks de tickets antiguos
    const locksResult = await db.collection('ticketCreateLocks').deleteMany({
      createdAt: { $lt: thirtyDaysAgo }
    });
    console.log(`✅ Eliminados locks antiguos: ${locksResult.deletedCount} documentos`);
    
    console.log('\n✨ Limpieza completada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  cleanupDatabase();
}

module.exports = { cleanupDatabase };
