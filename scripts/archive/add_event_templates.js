const fs = require('fs');
const en = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js');
const es = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js');

// Adding description templates for dashboard events
en.ticket.events = {
  ...en.ticket.events,
  claimed_dashboard_desc: "{{actor}} claimed ticket #{{id}} from the dashboard.",
  claimed_desc: "{{actor}} took this ticket from the dashboard.",
  released_dashboard_desc: "{{actor}} released ticket #{{id}} from the dashboard.",
  assigned_dashboard_desc: "{{actor}} assigned themselves ticket #{{id}}.",
  unassigned_desc: "{{actor}} removed the assignment for ticket #{{id}}.",
  status_updated_desc: "{{actor}} changed ticket #{{id}} status to {{status}}.",
  closed_dashboard_desc: "{{actor}} closed ticket #{{id}} from the dashboard.",
  closed_desc: "{{actor}} closed this ticket from the dashboard.\nReason: {{reason}}",
  reopened_dashboard_desc: "{{actor}} reopened ticket #{{id}} from the dashboard.",
  reopened_desc: "{{actor}} reopened this ticket from the dashboard.",
  internal_note_desc: "{{actor}} added an internal note from the dashboard.",
  tag_added_desc: "{{actor}} added tag {{tag}} from the dashboard.",
  tag_removed_desc: "{{actor}} removed tag {{tag}} from the dashboard.",
  reply_sent_desc: "{{actor}} replied to the customer from the dashboard.",
  reply_sent_title: "Reply from the dashboard",
  macro_sent_desc: "{{actor}} sent macro {{macro}} from the dashboard.",
  priority_updated_desc: "{{actor}} changed ticket #{{id}} priority to {{priority}}.",
  recommendation_confirmed_desc: "{{actor}} confirmed an operational recommendation from the dashboard.",
  recommendation_discarded_desc: "{{actor}} discarded an operational recommendation from the dashboard.",
  no_details: "No additional details."
};

es.ticket.events = {
  ...es.ticket.events,
  claimed_dashboard_desc: "{{actor}} reclamó el ticket #{{id}} desde la dashboard.",
  claimed_desc: "{{actor}} tomó este ticket desde la dashboard.",
  released_dashboard_desc: "{{actor}} liberó el ticket #{{id}} desde la dashboard.",
  assigned_dashboard_desc: "{{actor}} se asignó el ticket #{{id}}.",
  unassigned_desc: "{{actor}} removió la asignación del ticket #{{id}}.",
  status_updated_desc: "{{actor}} cambió el estado del ticket #{{id}} a {{status}}.",
  closed_dashboard_desc: "{{actor}} cerró el ticket #{{id}} desde la dashboard.",
  closed_desc: "{{actor}} cerró este ticket desde la dashboard.\nMotivo: {{reason}}",
  reopened_dashboard_desc: "{{actor}} reabrió el ticket #{{id}} desde la dashboard.",
  reopened_desc: "{{actor}} reabrió este ticket desde la dashboard.",
  internal_note_desc: "{{actor}} agregó una nota interna desde la dashboard.",
  tag_added_desc: "{{actor}} agregó el tag {{tag}} desde la dashboard.",
  tag_removed_desc: "{{actor}} removió el tag {{tag}} desde la dashboard.",
  reply_sent_desc: "{{actor}} respondió al cliente desde la dashboard.",
  reply_sent_title: "Respuesta desde la dashboard",
  macro_sent_desc: "{{actor}} envió la macro {{macro}} desde la dashboard.",
  priority_updated_desc: "{{actor}} cambió la prioridad del ticket #{{id}} a {{priority}}.",
  recommendation_confirmed_desc: "{{actor}} confirmó una recomendación operativa desde la dashboard.",
  recommendation_discarded_desc: "{{actor}} descartó una recomendación operativa desde la dashboard.",
  no_details: "Sin detalles adicionales."
};

fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js', 'module.exports = ' + JSON.stringify(en, null, 2) + ';');
fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js', 'module.exports = ' + JSON.stringify(es, null, 2) + ';');
console.log('Event description templates added.');
