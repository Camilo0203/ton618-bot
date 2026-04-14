"use strict";

const en = require("./src/locales/en.js");
const es = require("./src/locales/es.js");

console.log("=== Acceso directo a los archivos de locale ===\n");

console.log("en.ticket:", en.ticket ? "EXISTS" : "NO EXISTE");
console.log("es.ticket:", es.ticket ? "EXISTE" : "NO EXISTE");

if (es.ticket) {
  console.log("\nes.ticket.categories:", es.ticket.categories ? "EXISTE" : "NO EXISTE");
  console.log("es.ticket.categories.support:", es.ticket.categories?.support);
}

if (en.ticket) {
  console.log("\nen.ticket.categories:", en.ticket.categories ? "EXISTE" : "NO EXISTE");
  console.log("en.ticket.categories.support:", en.ticket.categories?.support);
}