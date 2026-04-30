const fs = require('fs');
const en = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js');
const es = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js');

const finalCronKeysEn = {
  verification: {
    autokick: {
      reason_log: "Auto-kick after {{hours}}h without verification",
      title: "Auto-kick: unverified member",
      description: "{{member}} (`{{tag}}`) was kicked after remaining unverified for {{hours}}h.",
      kick_reason: "Unverified after {{hours}}h"
    }
  },
  smart_ping: {
    title: "Smart Ping - Attention Required",
    description: "This ticket has been waiting for more than **{{time}}** without a staff response.",
    user: "User",
    category: "Category",
    hours_plural: "{{count}} hour(s)"
  }
};

const finalCronKeysEs = {
  verification: {
    autokick: {
      reason_log: "Auto-kick tras {{hours}}h sin verificación",
      title: "Auto-kick: miembro no verificado",
      description: "{{member}} (`{{tag}}`) fue expulsado tras permanecer no verificado por {{hours}}h.",
      kick_reason: "No verificado tras {{hours}}h"
    }
  },
  smart_ping: {
    title: "Smart Ping - Atención necesaria",
    description: "Este ticket lleva más de **{{time}}** sin respuesta del staff.",
    user: "Usuario",
    category: "Categoría",
    hours_plural: "{{count}} hora(s)"
  }
};

// Deep merge or Object.assign if the top level doesn't exist
en.verification = { ...en.verification, ...finalCronKeysEn.verification };
en.smart_ping = finalCronKeysEn.smart_ping;

es.verification = { ...es.verification, ...finalCronKeysEs.verification };
es.smart_ping = finalCronKeysEs.smart_ping;

fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js', 'module.exports = ' + JSON.stringify(en, null, 2) + ';');
fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js', 'module.exports = ' + JSON.stringify(es, null, 2) + ';');
console.log('Final cron localization keys added.');
