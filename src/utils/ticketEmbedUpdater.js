const { EmbedBuilder } = require("discord.js");
const { 
  priorityLabel, 
  normalizeTicketFieldName,
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_PRIORITY,
  TICKET_FIELD_ASSIGNED,
  TICKET_FIELD_CLAIMED,
} = require("../handlers/tickets/shared");

async function findTicketControlPanel(channel) {
  try {
    const messages = await channel.messages.fetch({ limit: 15 });
    return messages.find(msg => 
      msg.author.bot && 
      msg.embeds.length > 0 && 
      (msg.embeds[0].title?.includes("Panel de Control") || msg.embeds[0].title === "Panel de Control") &&
      msg.components.length > 0
    );
  } catch (error) {
    console.error("[FIND CONTROL PANEL ERROR]", error.message);
    return null;
  }
}

async function updateTicketControlPanelEmbed(channel, ticket, options = {}) {
  try {
    const controlPanelMessage = await findTicketControlPanel(channel);
    if (!controlPanelMessage) {
      console.warn('[UPDATE EMBED] Panel de control no encontrado');
      return false;
    }

    const currentEmbed = controlPanelMessage.embeds[0];
    const updatedEmbed = EmbedBuilder.from(currentEmbed);
    let fields = [...(currentEmbed.fields || [])];

    const updateField = (fieldName, newValue) => {
      const normalizedName = normalizeTicketFieldName(fieldName);
      const index = fields.findIndex(f => normalizeTicketFieldName(f.name) === normalizedName);
      if (index !== -1) {
        fields[index] = { ...fields[index], value: newValue };
        return true;
      }
      return false;
    };

    const addField = (fieldName, value, inline = true) => {
      const normalizedName = normalizeTicketFieldName(fieldName);
      const exists = fields.some(f => normalizeTicketFieldName(f.name) === normalizedName);
      if (!exists) {
        fields.push({ name: fieldName, value, inline });
        return true;
      }
      return false;
    };

    const removeField = (fieldName) => {
      const normalizedName = normalizeTicketFieldName(fieldName);
      const initialLength = fields.length;
      fields = fields.filter(f => normalizeTicketFieldName(f.name) !== normalizedName);
      return fields.length < initialLength;
    };

    if (ticket.priority && options.updatePriority !== false) {
      updateField(TICKET_FIELD_PRIORITY, priorityLabel(ticket.priority));
    }

    if (ticket.category && options.updateCategory !== false) {
      updateField(TICKET_FIELD_CATEGORY, ticket.category);
    }

    if (options.updateClaimed !== false) {
      if (ticket.claimed_by) {
        if (!updateField(TICKET_FIELD_CLAIMED, `<@${ticket.claimed_by}>`)) {
          addField(TICKET_FIELD_CLAIMED, `<@${ticket.claimed_by}>`, true);
        }
      } else {
        removeField(TICKET_FIELD_CLAIMED);
      }
    }

    if (options.updateAssigned !== false) {
      if (ticket.assigned_to) {
        if (!updateField(TICKET_FIELD_ASSIGNED, `<@${ticket.assigned_to}>`)) {
          addField(TICKET_FIELD_ASSIGNED, `<@${ticket.assigned_to}>`, true);
        }
      } else {
        removeField(TICKET_FIELD_ASSIGNED);
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
      components: controlPanelMessage.components
    });

    console.log('[UPDATE EMBED] Panel de control actualizado correctamente');
    return true;
  } catch (error) {
    console.error("[UPDATE TICKET EMBED ERROR]", error.message);
    return false;
  }
}

module.exports = {
  updateTicketControlPanelEmbed,
  findTicketControlPanel,
};
