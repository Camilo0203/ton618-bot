const fs = require("fs");
const path = require("path");

function escapeJsString(str) {
  return JSON.stringify(str);
}

function serializeValue(value, indent = 2) {
  if (value === null) return "null";
  if (typeof value === "string") return escapeJsString(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => " ".repeat(indent + 2) + serializeValue(v, indent + 2));
    return "[\n" + items.join(",\n") + "\n" + " ".repeat(indent) + "]";
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const items = entries.map(([k, v]) => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : escapeJsString(k);
      return " ".repeat(indent + 2) + `${key}: ${serializeValue(v, indent + 2)}`;
    });
    return "{\n" + items.join(",\n") + "\n" + " ".repeat(indent) + "}";
  }
  return "null";
}

function splitLocale(language) {
  const srcFile = path.join(__dirname, "..", "src", "locales", `${language}.js`);
  const obj = require(srcFile);

  const groups = {};
  for (const [key, value] of Object.entries(obj)) {
    const prefix = key.includes(".") ? key.split(".")[0] : key;
    if (!groups[prefix]) groups[prefix] = {};
    groups[prefix][key] = value;
  }

  const modulesDir = path.join(__dirname, "..", "src", "locales", "modules", language);
  fs.mkdirSync(modulesDir, { recursive: true });

  const imports = [];
  for (const [prefix, entries] of Object.entries(groups)) {
    const filePath = path.join(modulesDir, `${prefix}.js`);
    const content = `module.exports = ${serializeValue(entries, 0)};\n`;
    fs.writeFileSync(filePath, content, "utf-8");
    imports.push(prefix);
  }

  // Generate barrel file
  const barrelPath = path.join(__dirname, "..", "src", "locales", `${language}.js`);
  let barrelContent = `"use strict";\n\n`;
  imports.forEach((p) => {
    barrelContent += `const _${p} = require("./modules/${language}/${p}.js");\n`;
  });
  barrelContent += `\nmodule.exports = {\n`;
  imports.forEach((p) => {
    barrelContent += `  ..._${p},\n`;
  });
  barrelContent += `};\n`;
  fs.writeFileSync(barrelPath, barrelContent, "utf-8");

  console.log(`Split ${language} into ${imports.length} modules`);
}

["en", "es"].forEach(splitLocale);
console.log("Locale split complete");
