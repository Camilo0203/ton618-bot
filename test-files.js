const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith(".js") && !file.startsWith("_")) {
      results.push(filePath);
    }
  });
  return results;
}

const all = walk("./src/commands");
console.log("Total files found:", all.length);
all.forEach(f => console.log("  Found:", f));
