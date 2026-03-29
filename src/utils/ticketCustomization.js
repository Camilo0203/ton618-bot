"use strict";

const { resolveGuildLanguage, t } = require("./i18n");

const DEFAULT_PUBLIC_PANEL_TITLE = "Need help? We're here for you.";
const DEFAULT_PUBLIC_PANEL_DESCRIPTION =
  "Open a private ticket by selecting the category that best fits your request.";
const DEFAULT_PUBLIC_PANEL_FOOTER = "{guild} • Professional support";

const DEFAULT_TICKET_WELCOME_MESSAGE =
  "Hi {user}, your ticket **{ticket}** has been created. Please share as much detail as possible.";
const DEFAULT_CONTROL_PANEL_TITLE = "Ticket Control Panel";
const DEFAULT_CONTROL_PANEL_DESCRIPTION =
  "This is the control panel for ticket **{ticket}**.\nUse the controls below to manage this ticket.";
const DEFAULT_CONTROL_PANEL_FOOTER = "{guild} • TON618 Tickets";

function normalizeHexColor(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).trim().replace(/^#/, "").toUpperCase();
  if (!/^[0-9A-F]{6}$/.test(cleaned)) return null;
  return `#${cleaned}`;
}

function parseHexColor(value, fallback = 0x5865F2) {
  const normalized = normalizeHexColor(value);
  if (!normalized) return fallback;
  return Number.parseInt(normalized.slice(1), 16);
}

function renderTicketTemplate(template, values = {}) {
  const source = String(template || "").trim();
  if (!source) return "";

  return source.replace(/\{([a-z0-9_]+)\}/gi, (match, rawKey) => {
    const key = String(rawKey || "").trim().toLowerCase();
    if (!(key in values)) return match;
    const value = values[key];
    return value === null || value === undefined ? "" : String(value);
  });
}

function buildTicketTemplateValues({
  guildName,
  userMention,
  ticketId,
  categoryLabel,
  staffMentions = "",
}) {
  return {
    guild: guildName || "Support Center",
    user: userMention || "@user",
    ticket: ticketId ? `#${ticketId}` : "#0000",
    ticket_number: ticketId || "0000",
    category: categoryLabel || "General Support",
    staff_mentions: staffMentions || "",
  };
}

function buildPublicPanelPresentation({ guild, settingsRecord = {}, fallback = {} } = {}) {
  const guildName = guild?.name || "Support Center";
  const values = buildTicketTemplateValues({ guildName });
  const language = resolveGuildLanguage(settingsRecord);

  return {
    title:
      String(settingsRecord?.ticket_panel_title || "").trim()
      || String(fallback.title || "").trim()
      || t(language, "ticket.defaults.public_panel_title")
      || DEFAULT_PUBLIC_PANEL_TITLE,
    description:
      String(settingsRecord?.ticket_panel_description || "").trim()
      || String(fallback.description || "").trim()
      || t(language, "ticket.defaults.public_panel_description")
      || DEFAULT_PUBLIC_PANEL_DESCRIPTION,
    footer: renderTicketTemplate(
      String(settingsRecord?.ticket_panel_footer || "").trim()
        || String(fallback.footer || "").trim()
        || t(language, "ticket.defaults.public_panel_footer")
        || DEFAULT_PUBLIC_PANEL_FOOTER,
      values,
    ),
    color: parseHexColor(settingsRecord?.ticket_panel_color, fallback.color || 0x5865F2),
    image: String(fallback.image || "").trim() || null,
  };
}

function buildTicketWelcomeMessage({
  settingsRecord = {},
  category = null,
  guildName,
  userMention,
  ticketId,
  categoryLabel,
  pings = [],
}) {
  const staffMentions = Array.isArray(pings) ? pings.filter(Boolean).join(" ") : "";
  const language = resolveGuildLanguage(settingsRecord);
  const template =
    String(settingsRecord?.ticket_welcome_message || "").trim()
    || String(category?.welcomeMessage || "").trim()
    || t(language, "ticket.defaults.welcome_message")
    || DEFAULT_TICKET_WELCOME_MESSAGE;
  const content = renderTicketTemplate(
    template,
    buildTicketTemplateValues({
      guildName,
      userMention,
      ticketId,
      categoryLabel,
      staffMentions,
    }),
  );

  if (!staffMentions) return content;
  if (/\{staff_mentions\}/i.test(template)) return content;
  if (content.includes(staffMentions)) return content;
  return `${content}\n\n${staffMentions}`;
}

function buildControlPanelPresentation({
  guild,
  settingsRecord = {},
  ticketId,
  categoryLabel,
  userMention,
  fallbackColor = 0x5865F2,
} = {}) {
  const guildName = guild?.name || "Support Center";
  const language = resolveGuildLanguage(settingsRecord);
  const values = buildTicketTemplateValues({
    guildName,
    userMention,
    ticketId,
    categoryLabel,
  });

  return {
    title:
      String(settingsRecord?.ticket_control_panel_title || "").trim()
      || t(language, "ticket.defaults.control_panel_title")
      || DEFAULT_CONTROL_PANEL_TITLE,
    description: renderTicketTemplate(
      String(settingsRecord?.ticket_control_panel_description || "").trim()
        || t(language, "ticket.defaults.control_panel_description")
        || DEFAULT_CONTROL_PANEL_DESCRIPTION,
      values,
    ),
    footer: renderTicketTemplate(
      String(settingsRecord?.ticket_control_panel_footer || "").trim()
        || t(language, "ticket.defaults.control_panel_footer")
        || DEFAULT_CONTROL_PANEL_FOOTER,
      values,
    ),
    color: parseHexColor(settingsRecord?.ticket_control_panel_color, fallbackColor),
  };
}

module.exports = {
  DEFAULT_PUBLIC_PANEL_TITLE,
  DEFAULT_PUBLIC_PANEL_DESCRIPTION,
  DEFAULT_PUBLIC_PANEL_FOOTER,
  DEFAULT_TICKET_WELCOME_MESSAGE,
  DEFAULT_CONTROL_PANEL_TITLE,
  DEFAULT_CONTROL_PANEL_DESCRIPTION,
  DEFAULT_CONTROL_PANEL_FOOTER,
  normalizeHexColor,
  parseHexColor,
  renderTicketTemplate,
  buildPublicPanelPresentation,
  buildTicketWelcomeMessage,
  buildControlPanelPresentation,
};
