"use strict";

const { ticketEvents, E, EmbedBuilder } = require("./context");

function resolveQueueTypeFromCategory(categoryId) {
  const normalized = String(categoryId || "").trim().toLowerCase();
  if (["report", "partnership", "staff", "association", "staff_app"].includes(normalized)) {
    return "community";
  }
  return "support";
}

async function recordTicketEventSafe(data) {
  try {
    await ticketEvents.add(data);
  } catch {}
}

const TICKET_FIELD_CATEGORY = "Categoría";
const TICKET_FIELD_PRIORITY = "Prioridad";
const TICKET_FIELD_ASSIGNED = "Asignado a";
const TICKET_FIELD_CLAIMED = "Reclamado por";

function normalizeTicketFieldName(name) {
  const rawName = String(name || "").trim();
  const lowerName = rawName.toLowerCase();
  if (lowerName.includes("reclamado por")) return TICKET_FIELD_CLAIMED;
  if (lowerName.includes("asignado a")) return TICKET_FIELD_ASSIGNED;
  if (lowerName.includes("prioridad")) return TICKET_FIELD_PRIORITY;
  if (lowerName.includes("categor")) return TICKET_FIELD_CATEGORY;

  const legacyMap = {
    Categoria: TICKET_FIELD_CATEGORY,
    Prioridad: TICKET_FIELD_PRIORITY,
    "Asignado a": TICKET_FIELD_ASSIGNED,
    "Reclamado por": TICKET_FIELD_CLAIMED,
  };
  return legacyMap[rawName] || rawName;
}

async function sendLog(guild, s, action, user, ticket, details = {}) {
  if (!s.log_channel) return;
  const ch = guild.channels.cache.get(s.log_channel);
  if (!ch) return;

  try {
    await ch.send({ embeds: [E.ticketLog(ticket, user, action, details)] });
  } catch (error) {
    console.error("[LOG ERROR]", error.message);
  }
}

function replyError(interaction, msg) {
  const payload = {
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.ERROR)
        .setDescription(`**Error:** ${msg}`)
        .setFooter({
          text: "TON618 Tickets",
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
        }),
    ],
    flags: 64,
  };

  return interaction.replied || interaction.deferred
    ? interaction.followUp(payload)
    : interaction.reply(payload);
}

function resolveTicketCreateErrorMessage(error) {
  const rawMessage = String(error?.message || "");
  if (
    rawMessage.includes("write conflict")
    || rawMessage.includes("ticket_counter")
    || rawMessage.includes("settings_schema_version")
  ) {
    return "No pude reservar un numero interno para el ticket. Intentalo de nuevo en unos segundos.";
  }

  if (error?.code === 11000 || rawMessage.includes("duplicate key error")) {
    return "Hubo un conflicto interno al numerar el ticket. Ya quedo registrado y puedes intentarlo de nuevo.";
  }

  if (rawMessage.includes("Missing Access") || rawMessage.includes("Missing Permissions")) {
    return "No tengo permisos suficientes para crear o preparar el canal del ticket.";
  }

  return "Error al crear el ticket. Verifica mis permisos o contacta a un administrador.";
}

function priorityLabel(p) {
  const map = {
    low: "Baja",
    normal: "Normal",
    high: "Alta",
    urgent: "Urgente",
  };
  return map[p] || p;
}

module.exports = {
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_PRIORITY,
  TICKET_FIELD_ASSIGNED,
  TICKET_FIELD_CLAIMED,
  resolveQueueTypeFromCategory,
  recordTicketEventSafe,
  normalizeTicketFieldName,
  sendLog,
  replyError,
  resolveTicketCreateErrorMessage,
  priorityLabel,
};
