"use strict";

const { t, MESSAGES } = require("./src/utils/i18n");

console.log("=== Test de traducciones de categorías ===\n");

// Test directo
console.log("Test 1 - ES getByPath directo:");
console.log("  MESSAGES.es.ticket.categories.support.label =", MESSAGES.es.ticket.categories.support.label);
console.log("  MESSAGES.es['ticket.categories.support.label'] =", MESSAGES.es["ticket.categories.support.label"]);

console.log("\nTest 2 - t() function:");
console.log("  t('es', 'ticket.categories.support.label') =", t("es", "ticket.categories.support.label"));
console.log("  t('es', 'ticket.categories.other.label') =", t("es", "ticket.categories.other.label"));

console.log("\nTest 3 - keys con formato correcto:");
const key1 = "ticket.categories.support.label";
const key2 = "ticket.categories.other.label";
console.log(`  t('es', '${key1}') =`, t("es", key1));
console.log(`  t('es', '${key2}') =`, t("es", key2));