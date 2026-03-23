const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const chalk = require("../chalk-compat");
const { connectDB, closeDB, getDB } = require("../src/utils/database");
const {
  SETTINGS_SCHEMA_VERSION,
  sanitizeSettingsRecord,
  hasSettingsDrift,
} = require("../src/utils/settingsSchema");

async function main() {
  await connectDB();

  const collection = getDB().collection("settings");
  const cursor = collection.find({});

  let scanned = 0;
  let migrated = 0;
  let unchanged = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    scanned += 1;
    const guildId = doc?.guild_id;
    if (!guildId) continue;

    const sanitized = sanitizeSettingsRecord(guildId, doc);
    const needsUpdate = hasSettingsDrift(doc, sanitized);
    if (!needsUpdate) {
      unchanged += 1;
      continue;
    }

    await collection.updateOne(
      { guild_id: guildId },
      { $set: sanitized }
    );
    migrated += 1;
  }

  console.log(chalk.green(`Settings schema target: v${SETTINGS_SCHEMA_VERSION}`));
  console.log(chalk.blue(`Scanned: ${scanned}`));
  console.log(chalk.yellow(`Migrated: ${migrated}`));
  console.log(chalk.gray(`Unchanged: ${unchanged}`));
}

main()
  .then(() => closeDB())
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error(chalk.red("Migration error:"), error?.message || error);
    await closeDB().catch(() => {});
    process.exit(1);
  });
