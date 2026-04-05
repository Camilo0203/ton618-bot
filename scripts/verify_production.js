/**
 * TON618 Production Cleanup Script
 * 
 * This script will:
 * 1. Load en.js and verify it parses correctly
 * 2. Report any issues found
 * 3. The i18n system's deepMerge already handles duplicate keys correctly,
 *    so duplicates at the JS object level are resolved by Node's parser
 *    (last-write-wins for same-level keys, which matches deepMerge behavior)
 * 
 * Run: node scripts/verify_production.js
 */

const fs = require("fs");
const path = require("path");

const PASS = "\u2705";
const FAIL = "\u274c";
const WARN = "\u26a0\ufe0f";

let passes = 0, fails = 0, warnings = 0;
function pass(msg) { passes++; console.log(`  ${PASS} ${msg}`); }
function fail(msg) { fails++; console.log(`  ${FAIL} ${msg}`); }
function warn(msg) { warnings++; console.log(`  ${WARN} ${msg}`); }

console.log("\n=== TON618 PRODUCTION VERIFICATION ===\n");

// Phase 1: Locale Loading
console.log("--- Phase 1: Locale Files ---");
let en, es;
try { en = require("../src/locales/en.js"); pass(`en.js loads (${Object.keys(en).length} top-level keys)`); }
catch(e) { fail(`en.js FAIL: ${e.message}`); process.exit(1); }
try { es = require("../src/locales/es.js"); pass(`es.js loads (${Object.keys(es).length} top-level keys)`); }
catch(e) { fail(`es.js FAIL: ${e.message}`); process.exit(1); }

// Phase 2: Key parity
console.log("\n--- Phase 2: Key Parity ---");
function flatKeys(obj, prefix = "") {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? prefix + "." + k : k;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      keys.push(...flatKeys(v, p));
    } else {
      keys.push(p);
    }
  }
  return keys;
}
const enKeys = new Set(flatKeys(en));
const esKeys = new Set(flatKeys(es));
const missingInEs = [...enKeys].filter(k => !esKeys.has(k));
const missingInEn = [...esKeys].filter(k => !enKeys.has(k));
console.log(`  EN keys: ${enKeys.size} | ES keys: ${esKeys.size}`);
if (missingInEs.length === 0) pass("All EN keys present in ES");
else { warn(`${missingInEs.length} keys missing in ES`); missingInEs.slice(0, 15).forEach(k => console.log(`    → ${k}`)); }
if (missingInEn.length === 0) pass("All ES keys present in EN");
else { warn(`${missingInEn.length} keys missing in EN`); missingInEn.slice(0, 15).forEach(k => console.log(`    → ${k}`)); }

// Phase 3: Critical keys
console.log("\n--- Phase 3: Critical i18n Keys ---");
const { t } = require("../src/utils/i18n");
const criticalKeys = [
  "common.labels.error", "interaction.rate_limit.command", "interaction.rate_limit.global",
  "interaction.command_disabled", "interaction.db_unavailable", "interaction.unexpected",
  "access.owner_only", "access.admin_required", "access.staff_required", "access.guild_only",
  "common.yes", "common.no", "common.enabled", "common.disabled",
  "ticket.footer", "ticket.priority.low", "ticket.priority.normal", "ticket.priority.high",
  "dashboard.title", "dashboard.description", "stats.title",
];
let keyFails = 0;
for (const lang of ["en", "es"]) {
  for (const key of criticalKeys) {
    const result = t(lang, key);
    if (result === key) { keyFails++; fail(`t("${lang}", "${key}") → LOOKUP FAILURE`); }
  }
}
if (keyFails === 0) pass(`All ${criticalKeys.length * 2} critical lookups resolved`);

// Phase 4: Command loader
console.log("\n--- Phase 4: Command Loader ---");
try {
  const { loadAndValidateCommands } = require("../src/utils/commandLoader");
  const { commands, validationErrors } = loadAndValidateCommands(
    path.join(__dirname, "..", "src", "commands"), { disabledFiles: new Set() }
  );
  if (validationErrors.length === 0) pass(`${commands.length} commands loaded, 0 errors`);
  else fail(`${validationErrors.length} command validation errors`);
  validationErrors.forEach(e => console.log(`    ${e}`));
} catch(e) { fail(`Command loader: ${e.message}`); }

// Phase 5: Event handlers
console.log("\n--- Phase 5: Events ---");
const eventsDir = path.join(__dirname, "..", "src", "events");
const eventFiles = fs.readdirSync(eventsDir).filter(f => f.endsWith(".js"));
let eventErrors = 0;
for (const file of eventFiles) {
  try {
    const ev = require(path.join(eventsDir, file));
    if (!ev.name || typeof ev.execute !== "function") { eventErrors++; fail(`${file}: missing name/execute`); }
  } catch(e) { eventErrors++; fail(`${file}: ${e.message.split("\n")[0]}`); }
}
if (eventErrors === 0) pass(`${eventFiles.length} event handlers valid`);

// Phase 6: Interaction handlers
console.log("\n--- Phase 6: Interactions ---");
let interactionErrors = 0;
for (const kind of ["buttons", "selects", "modals"]) {
  const dir = path.join(__dirname, "..", "src", "interactions", kind);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
  for (const file of files) {
    try {
      const h = require(path.join(dir, file));
      if (!h.customId || typeof h.execute !== "function") {
        interactionErrors++; fail(`${kind}/${file}: missing customId/execute`);
      }
    } catch(e) { interactionErrors++; fail(`${kind}/${file}: ${e.message.split("\n")[0]}`); }
  }
}
if (interactionErrors === 0) pass("All interaction handlers valid");

// Phase 7: Handlers
console.log("\n--- Phase 7: Handlers ---");
const handlerPaths = [
  "giveawayHandler", "autoRoleHandler", "moderationHandler",
  "statsHandler", "pollHandler", "verifHandler", "dashboardHandler"
];
let handlerErrors = 0;
for (const h of handlerPaths) {
  try { require(`../src/handlers/${h}`); } catch(e) { handlerErrors++; fail(`${h}: ${e.message.split("\n")[0]}`); }
}
if (handlerErrors === 0) pass(`${handlerPaths.length} handlers loaded`);

// Phase 8: Database
console.log("\n--- Phase 8: Database ---");
try {
  const db = require("../src/utils/database");
  const exportCount = Object.keys(db).length;
  pass(`Database module: ${exportCount} exports`);
} catch(e) { fail(`Database: ${e.message}`); }

// Phase 9: Security
console.log("\n--- Phase 9: Security ---");
try {
  const gitignore = fs.readFileSync(path.join(__dirname, "..", ".gitignore"), "utf8");
  if (gitignore.includes(".env") && gitignore.includes("node_modules")) pass(".gitignore protects .env and node_modules");
  else fail(".gitignore missing critical entries");
} catch(e) { fail(`.gitignore: ${e.message}`); }

// Summary
console.log("\n" + "=".repeat(50));
console.log(`  ${PASS} Passed:   ${passes}`);
console.log(`  ${FAIL} Failed:   ${fails}`);
console.log(`  ${WARN} Warnings: ${warnings}`);
console.log(`  Total: ${passes + fails + warnings}`);
console.log(fails === 0 ? "\n  \ud83c\udf89 PRODUCTION READY!" : `\n  \ud83d\udea8 ${fails} FAILURES!`);
console.log("=".repeat(50));
process.exit(fails > 0 ? 1 : 0);
