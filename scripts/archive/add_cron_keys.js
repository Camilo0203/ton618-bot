const fs = require('fs');
const en = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js');
const es = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js');

const cronKeysEn = {
  daily_sla_report: {
    title: "Daily SLA Report",
    window: "Monitoring Window: {{from}} to {{to}}",
    opened_24h: "Opened (24h)",
    closed_24h: "Closed (24h)",
    avg_first_response: "Avg. First Response",
    open_out_of_sla: "Outside SLA",
    open_escalated: "Escalated",
    sla_compliance: "SLA Compliance",
    top_staff: "Top Staff (Closures)",
    no_closures: "No closures recorded in the last 24h.",
    no_data: "No data",
    no_sla_threshold: "No SLA threshold"
  },
  sla_alerts: {
    title: "SLA Alert - No Staff Response",
    description: "Ticket <#{{channelId}}> **#{{ticketId}}** has been waiting for **{{time}}** without a staff response.",
    user: "User",
    category: "Category",
    sla_limit: "SLA Limit",
    minutes_plural: "{{count}} minutes",
    hours_minutes: "{{h}}h {{m}}m"
  },
  sla_escalation: {
    title: "SLA Escalation - Action Required",
    description: "Ticket <#{{channelId}}> **#{{ticketId}}** exceeded the escalation threshold (**{{limit}} min**) without a staff response.",
    user: "User",
    category: "Category"
  }
};

const cronKeysEs = {
  daily_sla_report: {
    title: "Reporte Diario de SLA",
    window: "Ventana de monitoreo: {{from}} a {{to}}",
    opened_24h: "Abiertos (24h)",
    closed_24h: "Cerrados (24h)",
    avg_first_response: "Prom. Primera Respuesta",
    open_out_of_sla: "Fuera de SLA",
    open_escalated: "Escalados",
    sla_compliance: "Cumplimiento SLA",
    top_staff: "Top Staff (Cierres)",
    no_closures: "No se registraron cierres en las últimas 24h.",
    no_data: "Sin datos",
    no_sla_threshold: "Sin umbral SLA"
  },
  sla_alerts: {
    title: "Alerta SLA - Sin respuesta del staff",
    description: "El ticket <#{{channelId}}> **#{{ticketId}}** lleva **{{time}}** sin respuesta del staff.",
    user: "Usuario",
    category: "Categoría",
    sla_limit: "Límite SLA",
    minutes_plural: "{{count}} minutos",
    hours_minutes: "{{h}}h {{m}}m"
  },
  sla_escalation: {
    title: "Escalado SLA - Atención requerida",
    description: "El ticket <#{{channelId}}> **#{{ticketId}}** superó el umbral de escalado (**{{limit}} min**) sin respuesta del staff.",
    user: "Usuario",
    category: "Categoría"
  }
};

Object.assign(en, cronKeysEn);
Object.assign(es, cronKeysEs);

fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js', 'module.exports = ' + JSON.stringify(en, null, 2) + ';');
fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js', 'module.exports = ' + JSON.stringify(es, null, 2) + ';');
console.log('Cron localization keys added.');
