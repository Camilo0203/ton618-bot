"use strict";

const es = require("./src/locales/es.js");

console.log("=== Verificando es.ticket directamente ===\n");

console.log("es.ticket keys:", Object.keys(es.ticket || {}).slice(0, 20));

console.log("\n es.ticket.categories =", es.ticket?.categories);

console.log("\n es.ticket.support =", es.ticket?.support);

// Buscar donde está el "General Support" que sale en las traducciones
const allKeys = Object.keys(es);
const generalSupportKey = allKeys.find(k => es[k] === "General Support");
console.log("\nKey con 'General Support':", generalSupportKey);