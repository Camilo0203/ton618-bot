"use strict";

const {
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

const { tickets, ticketEvents, settings, blacklist, staffStats, staffRatings, cooldowns, staffStatus } = require("../../utils/database");
const { generateTranscript } = require("../../utils/transcript");
const { updateDashboard } = require("../dashboardHandler");
const E = require("../../utils/embeds");
const { categories } = require("../../../config");
const categoryResolver = require("../../utils/categoryResolver");
const { buildTicketPanelPayload } = require("../../domain/tickets/panelPayload");
const { sanitizeTicketAnswers } = require("../../domain/tickets/formValidation");
const { isCategoryBlockedByIncident, resolveIncidentMessage } = require("../../domain/tickets/incidentMode");

module.exports = {
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  AttachmentBuilder,
  tickets,
  ticketEvents,
  settings,
  blacklist,
  staffStats,
  staffRatings,
  cooldowns,
  staffStatus,
  generateTranscript,
  updateDashboard,
  E,
  categories,
  categoryResolver,
  buildTicketPanelPayload,
  sanitizeTicketAnswers,
  isCategoryBlockedByIncident,
  resolveIncidentMessage,
};
