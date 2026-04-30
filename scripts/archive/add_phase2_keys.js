const fs = require('fs');

const en = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js');
const es = require('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js');

// 1. Common Footers
en.common.footer = en.common.footer || {};
en.common.footer.tickets = "TON618 Tickets";
es.common.footer = es.common.footer || {};
es.common.footer.tickets = "Tickets de TON618";

// 2. Crons
en.crons = {
  auto_close: { title: "Ticket closed automatically" },
  reminders: { footer: "TON618 Reminder" }
};
es.crons = {
  auto_close: { title: "Ticket cerrado automáticamente" },
  reminders: { footer: "Recordatorio de TON618" }
};

// 3. Economy (Simplified keys for the array in economy.js)
en.economy = en.economy || {};
en.economy.items = {
  role_vip: { name: "🎖️ VIP Role", description: "VIP Role for 30 days" },
  role_premium: { name: "💎 Premium Role", description: "Premium Role for 30 days" },
  role_staff: { name: "👔 Staff Role", description: "Temporary Staff Role" },
  boost_xp: { name: "⚡ XP Boost", description: "2x XP for 1 day" },
  boost_daily: { name: "💰 Daily Boost", description: "2x daily rewards for 7 days" },
  ticket: { name: "🎫 Extra Ticket", description: "One additional ticket" },
  background: { name: "🖼️ Background", description: "Custom background for profile" },
  color: { name: "🎨 Name Color", description: "Custom color in embed" },
  badge: { name: "🏅 Badge", description: "Badge on your profile" },
  crate_common: { name: "📦 Common Crate", description: "Luck of 50-200 coins" },
  crate_rare: { name: "✨ Rare Crate", description: "Luck of 200-500 coins" },
  crate_epic: { name: "💜 Epic Crate", description: "Luck of 500-1500 coins" },
  crate_legendary: { name: "🔥 Legendary Crate", description: "Luck of 1500-5000 coins" }
};

es.economy = es.economy || {};
es.economy.items = {
  role_vip: { name: "🎖️ Rol VIP", description: "Rol VIP por 30 días" },
  role_premium: { name: "💎 Rol Premium", description: "Rol Premium por 30 días" },
  role_staff: { name: "👔 Rol Staff", description: "Rol Staff temporal" },
  boost_xp: { name: "⚡ XP Boost", description: "2x XP por 1 día" },
  boost_daily: { name: "💰 Daily Boost", description: "2x recompensas diarias por 7 días" },
  ticket: { name: "🎫 Ticket Extra", description: "Un ticket adicional" },
  background: { name: "🖼️ Background", description: "Fondo personalizado para profile" },
  color: { name: "🎨 Color de nombre", description: "Color personalizado en embed" },
  badge: { name: "🏅 Insignia", description: "Insignia en tu perfil" },
  crate_common: { name: "📦 Caja Común", description: "Suerte de 50-200 monedas" },
  crate_rare: { name: "✨ Caja Rara", description: "Suerte de 200-500 monedas" },
  crate_epic: { name: "💜 Caja Épica", description: "Suerte de 500-1500 monedas" },
  crate_legendary: { name: "🔥 Caja Legendaria", description: "Suerte de 1500-5000 monedas" }
};

// 4. Automod
en.automod = {
  labels: {
    spam: "Spam prevention",
    invites: "Invite link blocking",
    scam: "Scam phrase blocking",
    regex: "Regex pattern filtering"
  }
};
es.automod = {
  labels: {
    spam: "Prevención de Spam",
    invites: "Bloqueo de invitaciones",
    scam: "Bloqueo de frases de estafa",
    regex: "Filtrado por patrones Regex"
  }
};

// 5. Ticket Events (Dashboard Bridge)
en.ticket.events = {
  claimed_dashboard: "Ticket claimed from dashboard",
  claimed: "Ticket claimed",
  released_dashboard: "Ticket released from dashboard",
  assigned_dashboard: "Ticket assigned from dashboard",
  unassigned: "Assignment removed",
  status_updated: "Operational status updated",
  closed_dashboard: "Ticket closed from dashboard",
  closed: "Ticket closed",
  reopened_dashboard: "Ticket reopened from dashboard",
  reopened: "Ticket reopened",
  internal_note: "Internal note added",
  tag_added: "Tag added",
  tag_removed: "Tag removed",
  reply_sent: "Reply sent",
  macro_sent: "Macro sent",
  priority_updated: "Priority updated",
  recommendation_confirmed: "Recommendation confirmed",
  recommendation_discarded: "Recommendation discarded",
  footer_bridge: "TON618 · Operational Inbox",
  status_attending: "Attending",
  status_searching: "Searching Staff"
};
es.ticket.events = {
  claimed_dashboard: "Ticket reclamado desde dashboard",
  claimed: "Ticket reclamado",
  released_dashboard: "Ticket liberado desde dashboard",
  assigned_dashboard: "Ticket asignado desde dashboard",
  unassigned: "Asignación removida",
  status_updated: "Estado operativo actualizado",
  closed_dashboard: "Ticket cerrado desde dashboard",
  closed: "Ticket cerrado",
  reopened_dashboard: "Ticket reabierto desde dashboard",
  reopened: "Ticket reabierto",
  internal_note: "Nota interna agregada",
  tag_added: "Tag agregado",
  tag_removed: "Tag removido",
  reply_sent: "Respuesta enviada",
  macro_sent: "Macro enviada",
  priority_updated: "Prioridad actualizada",
  recommendation_confirmed: "Recomendación confirmada",
  recommendation_discarded: "Recomendación descartada",
  footer_bridge: "TON618 · Inbox operativa",
  status_attending: "En Atención",
  status_searching: "Buscando Staff"
};

// 6. Shutdown
en.interaction.shutdown = { rebooting: "⚠️ The bot is rebooting. Please try again in a few seconds." };
es.interaction.shutdown = { rebooting: "⚠️ El bot se está reiniciando. Por favor intenta en unos segundos." };

// 7. Panel Payload
en.ticket.panel = en.ticket.panel || {};
en.ticket.panel.default_category = "General Support";
en.ticket.panel.default_description = "Help with general issues";
es.ticket.panel = es.ticket.panel || {};
es.ticket.panel.default_category = "Soporte General";
es.ticket.panel.default_description = "Ayuda con temas generales";

// Save back
fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js', 'module.exports = ' + JSON.stringify(en, null, 2) + ';');
fs.writeFileSync('c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js', 'module.exports = ' + JSON.stringify(es, null, 2) + ';');
console.log('Phase 2 Interaction keys added.');
