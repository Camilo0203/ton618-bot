"use strict";

const { t, MESSAGES } = require("./src/utils/i18n");

console.log("=== Test de traducciones de categorías ===\n");

console.log("ES - support:", t("es", "ticket.categories.support.label"));
console.log("ES - billing:", t("es", "ticket.categories.billing.label"));
console.log("ES - other:", t("es", "ticket.categories.other.label"));
console.log("ES - support desc:", t("es", "ticket.categories.support.description"));

console.log("\nEN - support:", t("en", "ticket.categories.support.label"));
console.log("EN - billing:", t("en", "ticket.categories.billing.label"));
console.log("EN - other:", t("en", "ticket.categories.other.label"));

console.log("\n=== Verificando estructura ===");
console.log("ES ticket.categories existe:", MESSAGES.es?.ticket?.categories ? "SI" : "NO");
console.log("EN ticket.categories existe:", MESSAGES.en?.ticket?.categories ? "SI" : "NO");