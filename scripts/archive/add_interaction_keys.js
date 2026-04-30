const fs = require('fs');

const en = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js');
const es = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js');

// Add suggest.errors.pro_required
en.suggest = en.suggest || {};
en.suggest.errors = en.suggest.errors || {};
en.suggest.errors.pro_required = "This feature requires **TON618 Pro**.";

es.suggest = es.suggest || {};
es.suggest.errors = es.suggest.errors || {};
es.suggest.errors.pro_required = "Esta función requiere **TON618 Pro**.";

// Add poll.success keys for pollVote.js
en.poll = en.poll || {};
en.poll.success = en.poll.success || {};
en.poll.success.vote_removed = "Your vote has been removed.";
en.poll.success.vote_active_multiple = "Your active votes: {{options}}.";
en.poll.success.vote_active_single = "Your current vote is **{{option}}**.";

es.poll = es.poll || {};
es.poll.success = es.poll.success || {};
es.poll.success.vote_removed = "Tu voto fue retirado.";
es.poll.success.vote_active_multiple = "Tus votos activos: {{options}}.";
es.poll.success.vote_active_single = "Tu voto actual es **{{option}}**.";

// Save back
fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js', 'module.exports = ' + JSON.stringify(en, null, 2) + ';');
fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js', 'module.exports = ' + JSON.stringify(es, null, 2) + ';');
console.log('Interaction keys added.');
