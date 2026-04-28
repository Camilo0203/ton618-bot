require("dotenv").config();

const { connectDB, closeDB, ensureIndexes } = require("../src/utils/database");

async function main() {
  await connectDB();
  await ensureIndexes(true);
  console.log("MongoDB indexes ensured.");
}

main()
  .catch((error) => {
    console.error("[ensure-indexes]", error?.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDB().catch((err) => { console.error("[ensure-indexes] suppressed error:", err?.message || err); });
  });
