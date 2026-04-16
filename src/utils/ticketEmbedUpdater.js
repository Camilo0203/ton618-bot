const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const {
  buildStaffQuickActionOptions,
  priorityLabel,
  normalizeTicketFieldName,
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_PRIORITY,
  TICKET_FIELD_ASSIGNED,
  TICKET_FIELD_CLAIMED,
  TICKET_FIELD_STATUS,
  formatTicketWorkflowStatus,
  isTicketControlPanelTitle,
} = require("../handlers/tickets/shared");
const { t } = require("./i18n");
const logger = require("./structuredLogger");

function fieldName(key, language) {
  const i18nKey = `ticket.field_names.${key}`;
  const translated = t(language, i18nKey);
  return (translated && translated !== i18nKey) ? translated : key;
}

async function findTicketControlPanel(channel) {
  try {
    const messages = await channel.messages.fetch({ limit: 15 });
    return messages.find((msg) =>
      msg.author.bot
      && msg.embeds.length > 0
      && isTicketControlPanelTitle(msg.embeds[0].title)
      && msg.components.length > 0
    );
  } catch (error) {
    logger.error("ticket.embed_updater", "Failed to fetch control panel message", { channelId: channel.id, error: error.message });
    return null;
  }
}

async function updateTicketControlPanelEmbed(channel, ticket, options = {}) {
  try {
    const language = options.language || "en";
    const controlPanelMessage = await findTicketControlPanel(channel);
    if (!controlPanelMessage) {
      logger.warn("ticket.embed_updater", "Control panel message not found", { channelId: channel.id });
      return false;
    }

    const currentEmbed = controlPanelMessage.embeds[0];
    const updatedEmbed = EmbedBuilder.from(currentEmbed);
    let fields = [...(currentEmbed.fields || [])];

    const updateField = (fieldName, newValue) => {
      const normalizedName = normalizeTicketFieldName(fieldName);
      const index = fields.findIndex((field) => normalizeTicketFieldName(field.name) === normalizedName);
      if (index !== -1) {
        fields[index] = { ...fields[index], value: newValue };
        return true;
      }
      return false;
    };

    const addField = (fieldName, value, inline = true) => {
      const normalizedName = normalizeTicketFieldName(fieldName);
      const exists = fields.some((field) => normalizeTicketFieldName(field.name) === normalizedName);
      if (!exists) {
        fields.push({ name: fieldName, value, inline });
        return true;
      }
      return false;
    };

    const removeField = (fieldName) => {
      const normalizedName = normalizeTicketFieldName(fieldName);
      const initialLength = fields.length;
      fields = fields.filter((field) => normalizeTicketFieldName(field.name) !== normalizedName);
      return fields.length < initialLength;
    };

    if (ticket.priority && options.updatePriority !== false) {
      updateField(TICKET_FIELD_PRIORITY, priorityLabel(ticket.priority, language));
    }

    if (ticket.category && options.updateCategory !== false) {
      updateField(TICKET_FIELD_CATEGORY, ticket.category);
    }

    if (options.updateClaimed !== false) {
      if (ticket.claimed_by) {
        const claimedLabel = fieldName(TICKET_FIELD_CLAIMED, language);
        if (!updateField(TICKET_FIELD_CLAIMED, `<@${ticket.claimed_by}>`)) {
          addField(claimedLabel, `<@${ticket.claimed_by}>`, true);
        } else {
          const idx = fields.findIndex(f => normalizeTicketFieldName(f.name) === TICKET_FIELD_CLAIMED);
          if (idx !== -1) fields[idx] = { ...fields[idx], name: claimedLabel };
        }
      } else {
        removeField(TICKET_FIELD_CLAIMED);
      }
    }

    if (options.updateAssigned !== false) {
      if (ticket.assigned_to) {
        const assignedLabel = fieldName(TICKET_FIELD_ASSIGNED, language);
        if (!updateField(TICKET_FIELD_ASSIGNED, `<@${ticket.assigned_to}>`)) {
          addField(assignedLabel, `<@${ticket.assigned_to}>`, true);
        } else {
          const idx = fields.findIndex(f => normalizeTicketFieldName(f.name) === TICKET_FIELD_ASSIGNED);
          if (idx !== -1) fields[idx] = { ...fields[idx], name: assignedLabel };
        }
      } else {
        removeField(TICKET_FIELD_ASSIGNED);
      }
    }

    if (options.updateStatus !== false) {
      if (ticket.workflow_status || ticket.status_label) {
        const statusValue = ticket.workflow_status
          ? formatTicketWorkflowStatus(ticket.workflow_status, language)
          : ticket.status_label;
        if (!updateField(TICKET_FIELD_STATUS, statusValue)) {
          addField(TICKET_FIELD_STATUS, statusValue, true);
        }
      }
    }

    if (options.sentiment) {
      if (!updateField(TICKET_FIELD_SENTIMENT, options.sentiment)) {
        addField(TICKET_FIELD_SENTIMENT, options.sentiment, true);
      }
    }

    if (options.suggestion) {
      if (!updateField(TICKET_FIELD_SUGGESTION, options.suggestion)) {
        addField(TICKET_FIELD_SUGGESTION, options.suggestion, false);
      }
    }

    if (options.color) {
      updatedEmbed.setColor(options.color);
    }

    if (options.thumbnail) {
      updatedEmbed.setThumbnail(options.thumbnail);
    }

    updatedEmbed.setFields(fields);

    await controlPanelMessage.edit({
      embeds: [updatedEmbed],
      components: controlPanelMessage.components,
    });

    logger.debug("ticket.embed_updater", "Control panel embed updated", { channelId: channel.id });
    return true;
  } catch (error) {
    logger.error("ticket.embed_updater", "Failed to update control panel embed", { channelId: channel.id, error: error.message });
    return false;
  }
}

function buildTicketControlPanelComponents(ticket = {}, options = {}) {
  const language = options.language || "en";
  const disabled = options.disabled === true;
  const claimDisabled = disabled || ticket.status === "closed" || Boolean(ticket.claimed_by);

  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_close")
        .setLabel(t(language, "ticket.buttons.close"))
        .setStyle(ButtonStyle.Danger)
        .setDisabled(disabled),
      new ButtonBuilder()
        .setCustomId("ticket_claim")
        .setLabel(ticket.claimed_by ? t(language, "ticket.buttons.claimed") : t(language, "ticket.buttons.claim"))
        .setStyle(ticket.claimed_by ? ButtonStyle.Secondary : ButtonStyle.Success)
        .setDisabled(claimDisabled),
      new ButtonBuilder()
        .setCustomId("ticket_transcript")
        .setLabel(t(language, "ticket.buttons.transcript"))
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled)
    ),
    new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("staff_quick_actions")
        .setPlaceholder(t(language, "ticket.quick_actions.placeholder"))
        .setDisabled(disabled)
        .addOptions(buildStaffQuickActionOptions(language))
    ),
  ];
}

async function updateTicketControlPanelComponents(channel, ticket, options = {}) {
  try {
    const controlPanelMessage = await findTicketControlPanel(channel);
    if (!controlPanelMessage) {
      logger.warn("ticket.embed_updater", "Control panel message not found for components update", { channelId: channel.id });
      return false;
    }

    await controlPanelMessage.edit({
      embeds: controlPanelMessage.embeds,
      components: buildTicketControlPanelComponents(ticket, options),
    });

    return true;
  } catch (error) {
    logger.error("ticket.embed_updater", "Failed to update control panel components", { channelId: channel.id, error: error.message });
    return false;
  }
}

module.exports = {
  buildTicketControlPanelComponents,
  updateTicketControlPanelEmbed,
  updateTicketControlPanelComponents,
  findTicketControlPanel,
};
