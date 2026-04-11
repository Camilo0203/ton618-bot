/**
 * Script de emergencia para enviar el tutorial al servidor de support
 * Ejecutar: node scripts/send-tutorial-to-support.js <GUILD_ID>
 */

const { Client, GatewayIntentBits } = require("discord.js");
const { sendGuildLanguageOnboarding } = require("../src/utils/guildOnboarding");
const { settings } = require("../src/utils/database");

const SUPPORT_SERVER_ID = process.argv[2] || process.env.SUPPORT_SERVER_ID || "1214106731022655488";

async function main() {
  console.log(`[SEND-TUTORIAL] Starting...`);
  console.log(`[SEND-TUTORIAL] Target Guild: ${SUPPORT_SERVER_ID}`);

  // Create temporary client
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error("[ERROR] DISCORD_TOKEN not found in environment");
    process.exit(1);
  }

  await client.login(token);
  console.log(`[SEND-TUTORIAL] Bot logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.get(SUPPORT_SERVER_ID);
  if (!guild) {
    console.error(`[ERROR] Guild ${SUPPORT_SERVER_ID} not found. Is the bot in this server?`);
    await client.destroy();
    process.exit(1);
  }

  console.log(`[SEND-TUTORIAL] Found guild: ${guild.name}`);

  // Reset onboarding flag
  const currentSettings = await settings.get(SUPPORT_SERVER_ID);
  if (currentSettings?.language_onboarding_completed) {
    console.log(`[SEND-TUTORIAL] Resetting onboarding flag...`);
    await settings.set(SUPPORT_SERVER_ID, {
      ...currentSettings,
      language_onboarding_completed: false,
    });
  }

  // Send tutorial
  console.log(`[SEND-TUTORIAL] Sending tutorial...`);
  const result = await sendGuildLanguageOnboarding(guild);

  if (result.delivered) {
    console.log(`[SEND-TUTORIAL] ✅ SUCCESS!`);
    console.log(`[SEND-TUTORIAL] Delivery: ${result.delivery}`);
    if (result.channelId) console.log(`[SEND-TUTORIAL] Channel: ${result.channelId}`);
    if (result.userId) console.log(`[SEND-TUTORIAL] User DM: ${result.userId}`);
    if (result.messageId) console.log(`[SEND-TUTORIAL] Message: ${result.messageId}`);
  } else if (result.skipped) {
    console.log(`[SEND-TUTORIAL] ⚠️ SKIPPED: Tutorial already completed`);
  } else {
    console.log(`[SEND-TUTORIAL] ❌ FAILED: Could not deliver tutorial`);
    console.log(`[SEND-TUTORIAL] Possible reasons: No writable channels, missing permissions`);
  }

  await client.destroy();
  process.exit(result.delivered ? 0 : 1);
}

main().catch((error) => {
  console.error("[FATAL ERROR]", error);
  process.exit(1);
});
