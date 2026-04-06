/**
 * Script para deployar comandos slash a Discord
 * Uso: node deploy-commands.js [guildId]
 * 
 * Sin guildId: deploy global (tarda hasta 1 hora en propagarse)
 * Con guildId: deploy instantáneo a un servidor específico (útil para testing)
 */

require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { loadAndValidateCommands } = require("./src/utils/commandLoader");
const path = require("path");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID;

if (!TOKEN) {
  console.error("❌ Error: DISCORD_TOKEN no está definido en .env");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("❌ Error: CLIENT_ID no está definido en .env");
  console.error("💡 Agrega CLIENT_ID=tu_client_id_aqui al archivo .env");
  process.exit(1);
}

const guildId = process.argv[2];

async function deployCommands() {
  console.log("🔄 Cargando comandos...\n");

  const commandsPath = path.join(__dirname, "src/commands");
  const { commands, validationErrors } = loadAndValidateCommands(commandsPath);

  if (validationErrors.length > 0) {
    console.error("❌ Errores de validación:");
    validationErrors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  // Convertir comandos a JSON para Discord
  const commandsData = commands.map((cmd) => {
    console.log(`📦 ${cmd.data.name} (${cmd.meta?.scope || "public"})`);
    return cmd.data.toJSON();
  });

  console.log(`\n✅ ${commandsData.length} comandos cargados\n`);

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    if (guildId) {
      // Deploy a servidor específico (instantáneo)
      console.log(`🚀 Deployando a servidor: ${guildId}...`);
      const data = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, guildId),
        { body: commandsData }
      );
      console.log(`✅ ${data.length} comandos deployados exitosamente al servidor ${guildId}`);
      console.log("⏱️ Los comandos deberían aparecer inmediatamente (refresca Discord con Ctrl+R)");
    } else {
      // Deploy global (tarda hasta 1 hora)
      console.log("🚀 Deployando globalmente...");
      const data = await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commandsData }
      );
      console.log(`✅ ${data.length} comandos deployados globalmente`);
      console.log("⏱️ Los comandos pueden tardar hasta 1 hora en aparecer en todos los servidores");
    }

    console.log("\n💡 Comandos nuevos incluidos:");
    console.log("   /pro redeem - Para usuarios canjear códigos PRO");
    console.log("   /proadmin generate - Para staff generar códigos (solo servidor de soporte)");

  } catch (error) {
    console.error("\n❌ Error en el deploy:", error.message);
    if (error.code === 50001) {
      console.error("💡 El bot no tiene permisos. Verifica que:");
      console.error("   1. El token es correcto");
      console.error("   2. El CLIENT_ID es correcto");
      console.error("   3. El bot está invitado al servidor con 'applications.commands'");
    }
    if (error.code === 20012) {
      console.error("💡 El bot está rate limited. Espera unos minutos e intenta de nuevo.");
    }
    process.exit(1);
  }
}

deployCommands();
