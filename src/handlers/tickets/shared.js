"use strict";

const { ticketEvents, E, EmbedBuilder } = require("./context");
const { DEFAULT_CONTROL_PANEL_TITLE } = require("../../utils/ticketCustomization");

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

const TICKET_FIELD_CATEGORY = "Category";
const TICKET_FIELD_PRIORITY = "Priority";
const TICKET_FIELD_ASSIGNED = "Assigned to";
const TICKET_FIELD_CLAIMED = "Claimed by";
const TICKET_FIELD_STATUS = "Status";

const TICKET_WORKFLOW_STATUS_LABELS = {
  waiting_staff: "Waiting for staff",
  waiting_user: "Waiting for user",
  triage: "Under review",
  assigned: "Assigned",
  open: "Open",
  closed: "Closed",
};

const TICKET_WORKFLOW_STATUS_EMOJIS = {
  waiting_staff: "<:orangedot:1486126959531528242>",
  waiting_user: "<:greendot:1486126957526782002>",
  triage: "<:bluedot:1486126956243193886>",
  assigned: "<:greendot:1486126957526782002>",
  open: "<:greendot:1486126957526782002>",
};

function normalizeTicketFieldName(name) {
  const rawName = String(name || "").trim();
  const lowerName = rawName.toLowerCase();
  if (lowerName.includes("claimed by") || lowerName.includes("reclamado por")) return TICKET_FIELD_CLAIMED;
  if (lowerName.includes("assigned to") || lowerName.includes("asignado a")) return TICKET_FIELD_ASSIGNED;
  if (lowerName.includes("priority") || lowerName.includes("prioridad")) return TICKET_FIELD_PRIORITY;
  if (lowerName.includes("category") || lowerName.includes("categor")) return TICKET_FIELD_CATEGORY;
  if (lowerName.includes("status") || lowerName.includes("estado")) return TICKET_FIELD_STATUS;

  const legacyMap = {
    Categoria: TICKET_FIELD_CATEGORY,
    Category: TICKET_FIELD_CATEGORY,
    Prioridad: TICKET_FIELD_PRIORITY,
    Priority: TICKET_FIELD_PRIORITY,
    "Asignado a": TICKET_FIELD_ASSIGNED,
    "Assigned to": TICKET_FIELD_ASSIGNED,
    "Reclamado por": TICKET_FIELD_CLAIMED,
    "Claimed by": TICKET_FIELD_CLAIMED,
    Estado: TICKET_FIELD_STATUS,
    Status: TICKET_FIELD_STATUS,
  };
  return legacyMap[rawName] || rawName;
}

function isTicketControlPanelTitle(title) {
  const value = String(title || "").trim().toLowerCase();
  return value.includes("ticket control panel") || value.includes("panel de control");
}

function formatTicketWorkflowStatus(workflowStatus) {
  const normalized = String(workflowStatus || "").trim().toLowerCase();
  const emoji = TICKET_WORKFLOW_STATUS_EMOJIS[normalized] || "";
  const label = TICKET_WORKFLOW_STATUS_LABELS[normalized] || TICKET_WORKFLOW_STATUS_LABELS.open;
  return emoji ? `${emoji} ${label}` : label;
}

function buildStaffQuickActionOptions() {
  return [
    { label: "Priority: Low", value: "priority_low", emoji: "1486126771605606450" },
    { label: "Priority: Normal", value: "priority_normal", emoji: "1486126775330275379" },
    { label: "Priority: High", value: "priority_high", emoji: "1486126769697329212" },
    { label: "Priority: Urgent", value: "priority_urgent", emoji: "1486126773212152034" },
    { label: "Status: Waiting for staff", value: "status_wait", emoji: "1486126959531528242" },
    { label: "Status: Waiting for user", value: "status_pending", emoji: "1486126957526782002" },
    { label: "Status: Under review", value: "status_review", emoji: "1486126956243193886" },
  ];
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
    return "I could not reserve an internal ticket number. Please try again in a few seconds.";
  }

  if (error?.code === 11000 || rawMessage.includes("duplicate key error")) {
    return "There was an internal conflict while numbering the ticket. Please try again.";
  }

  if (rawMessage.includes("Missing Access") || rawMessage.includes("Missing Permissions")) {
    return "I do not have enough permissions to create or prepare the ticket channel.";
  }

  return "There was an error while creating the ticket. Verify my permissions or contact an administrator.";
}

function priorityLabel(priority) {
  const emojiMap = {
    low: "<:signalbargreen:1486126771605606450>",
    normal: "<:signalbaryellow:1486126775330275379>",
    high: "<:signalbarorange:1486126769697329212>",
    urgent: "<:signalbarred:1486126773212152034>",
  };
  const labelMap = {
    low: "Low",
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
  };
  const emoji = emojiMap[priority] || "";
  const label = labelMap[priority] || priority;
  return emoji ? `${emoji} ${label}` : label;
}

module.exports = {
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_PRIORITY,
  TICKET_FIELD_ASSIGNED,
  TICKET_FIELD_CLAIMED,
  TICKET_FIELD_STATUS,
  DEFAULT_CONTROL_PANEL_TITLE,
  resolveQueueTypeFromCategory,
  recordTicketEventSafe,
  normalizeTicketFieldName,
  isTicketControlPanelTitle,
  formatTicketWorkflowStatus,
  buildStaffQuickActionOptions,
  sendLog,
  replyError,
  resolveTicketCreateErrorMessage,
  priorityLabel,
};
