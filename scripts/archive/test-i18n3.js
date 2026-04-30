"use strict";

const { MESSAGES } = require("./src/utils/i18n");

console.log("=== Estructura de MESSAGES ===\n");

console.log("Keys en MESSAGES.es:", Object.keys(MESSAGES.es).slice(0, 20));
console.log("\nKeys en MESSAGES.en:", Object.keys(MESSAGES.en).slice(0, 20));

// Buscar donde está ticket
console.log("\nBuscando 'ticket' en MESSAGES.es:");
const esKeys = Object.keys(MESSAGES.es);
const ticketKey = esKeys.find(k => k.toLowerCase().includes('ticket'));
console.log("  Found:", ticketKey);

// Probar acceso
console.log("\nMESSAGES.es[?]", ticketKey ? MESSAGES.es[ticketKey]?.categories?.support?.label : "NOT FOUND");