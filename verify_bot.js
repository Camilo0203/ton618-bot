// Quick verification - Phase 1
const fs = require("fs");
const path = require("path");
console.log("=== TON618 VERIFICATION ===");
console.log("CWD:", process.cwd());
console.log("Node:", process.version);

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith(".js")) files.push(full);
  }
  return files;
}
const srcFiles = walk(path.join(__dirname, "src"));
console.log("Source files found:", srcFiles.length);
let errors = 0;
for (const f of srcFiles) {
  try { require(f); } catch(e) { errors++; console.error("FAIL:", path.relative(__dirname, f), "->", e.message.split("\n")[0]); }
}
console.log("Module loading errors:", errors);
