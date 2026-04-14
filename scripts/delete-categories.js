"use strict";

const { db } = require("./src/utils/database");

async function deleteAllCategories(guildId) {
  try {
    console.log(`\n🗑️  Borrando todas las categorías del servidor: ${guildId}\n`);
    
    const result = await db.ticketCategories.deleteAllByGuild(guildId);
    
    console.log(`✅ Categorías borradas exitosamente!`);
    console.log(`   Resultado:`, result);
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    process.exit(1);
  }
}

const guildId = process.argv[2];

if (!guildId) {
  console.log(`Usage: node delete-categories.js <guildId>`);
  console.log(`\nEjemplo:`);
  console.log(`  node delete-categories.js 123456789012345678`);
  process.exit(1);
}

deleteAllCategories(guildId);