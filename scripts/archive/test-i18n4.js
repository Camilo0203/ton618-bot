"use strict";

const { MESSAGES, getByPath } = require("./src/utils/i18n");

console.log("=== Buscando keys de ticket.categories ===\n");

const testKeys = [
  "ticket.categories.support.label",
  "ticket.categories.other.label",
  "categories.support.label",
  "ticket.categories.billing.label"
];

for (const key of testKeys) {
  const result = getByPath(MESSAGES.es, key);
  console.log(`getByPath(MESSAGES.es, "${key}"):`, result);
}

// Verificar si ticket existe en MESSAGES.es
console.log("\n=== Verificando estructura ===");
console.log("MESSAGES.es tiene 'ticket':", "ticket" in MESSAGES.es);

// Buscar si hay alguna key que contenga "support" 
console.log("\nBuscando en MESSAGES.es:");
const allKeys = Object.keys(MESSAGES.es);
const supportKeys = allKeys.filter(k => k.includes("support"));
console.log("Keys con 'support':", supportKeys.slice(0, 10));