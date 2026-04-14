"use strict";

const en = require("./src/locales/en.js");
const es = require("./src/locales/es.js");

console.log("=== Comparando estructura de ticket.categories ===\n");

console.log("EN - ticket.categories:", typeof en.ticket.categories);
console.log("EN - ticket.categories.support:", en.ticket.categories?.support);

console.log("\nES - ticket.categories:", typeof es.ticket.categories);
console.log("ES - ticket.categories.support:", es.ticket.categories?.support);
console.log("ES - ticket.categories['support.label']:", es.ticket.categories?.["support.label"]);