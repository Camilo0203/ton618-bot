const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  try {
    console.log("Eliminando comandos globales...");
    await client.application.commands.set([]);
    console.log("✅ Comandos globales eliminados");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
});

client.login(process.env.DISCORD_TOKEN);
