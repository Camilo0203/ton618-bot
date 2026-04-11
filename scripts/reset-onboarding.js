#!/usr/bin/env node
"use strict";

/**
 * Reset Onboarding Flag Script
 * Reinicia el flag language_onboarding_completed en todas las guilds
 * para poder probar el selector de idioma nuevamente
 * 
 * Usage: node scripts/reset-onboarding.js [--confirm]
 */

require("dotenv").config();

const { connectDB, getDB, closeDB } = require("../src/utils/database/core");

// Parse command line arguments
const args = process.argv.slice(2);
const isConfirm = args.includes("--confirm");

async function resetOnboarding() {
  console.log("🔧 Script de reinicio de onboarding");
  console.log("=====================================");
  
  if (!isConfirm) {
    console.log("\n⚠️  MODO PREVIEW (dry-run)");
    console.log("   Usa --confirm para ejecutar realmente\n");
  }

  try {
    await connectDB();
    const db = getDB();
    const settingsCollection = db.collection("settings");

    // Buscar todas las guilds con onboarding completado
    const guildsWithOnboarding = await settingsCollection.find({
      language_onboarding_completed: true
    }).toArray();

    console.log(`📊 Guilds con onboarding completado: ${guildsWithOnboarding.length}`);

    if (guildsWithOnboarding.length === 0) {
      console.log("✅ No hay guilds con onboarding completado. Nada que reiniciar.");
      await closeDB();
      return;
    }

    console.log("\n📋 Guilds afectadas:");
    guildsWithOnboarding.forEach(g => {
      console.log(`   - ${g.guildId} (lang: ${g.language || 'en'})`);
    });

    if (isConfirm) {
      // Actualizar todas las guilds
      const result = await settingsCollection.updateMany(
        { language_onboarding_completed: true },
        { 
          $set: { 
            language_onboarding_completed: false,
            onboarding_reset_at: new Date()
          }
        }
      );

      console.log(`\n✅ Reinicio completado:`);
      console.log(`   - ${result.modifiedCount} guilds actualizadas`);
      console.log(`   - El selector de idioma volverá a aparecer en estas guilds`);
    } else {
      console.log(`\n⚠️  Modo preview: No se realizaron cambios`);
      console.log(`   Usa --confirm para reiniciar ${guildsWithOnboarding.length} guilds`);
    }

    await closeDB();
    console.log("\n🏁 Listo!");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

resetOnboarding();
