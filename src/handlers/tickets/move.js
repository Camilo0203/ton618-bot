"use strict";

const {
  tickets,
  settings,
  E,
  categoryResolver,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("./context");
const {
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_PRIORITY,
  replyError,
  recordTicketEventSafe,
  normalizeTicketFieldName,
  resolveQueueTypeFromCategory,
  sendLog,
  priorityLabel,
  isTicketControlPanelTitle,
} = require("./shared");
const { resolveGuildLanguage, t } = require("../../utils/i18n");
const logger = require("../../utils/structuredLogger");

async function addUser(interaction, user) {
  const guild = interaction.guild;
  const settingsRecord = await settings.get(guild.id);
  const language = resolveGuildLanguage(settingsRecord);
  const ticket = await tickets.get(interaction.channel.id);

  if (!ticket) {
    return replyError(interaction, t(language, "ticket.command.not_ticket_channel"), language);
  }
  if (ticket.status === "closed") {
    return replyError(interaction, t(language, "ticket.lifecycle.members.add.closed_ticket"), language);
  }
  if (user.bot) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.add.bot_denied"), language);
  }
  if (user.id === ticket.user_id) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.add.creator_denied"), language);
  }

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.add.verify_permissions"), language);
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.add.manage_channels_required"), language);
  }

  try {
    await interaction.channel.permissionOverwrites.edit(user, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      EmbedLinks: true,
      AddReactions: true,
    });
  } catch (error) {
    logger.warn("ticket.move", "Failed to add user to channel", { channelId: interaction.channel?.id, error: error.message });
    return replyError(
      interaction,
      t(language, "ticket.lifecycle.members.add.permissions_error", { error: error.message }),
      language
    );
  }

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "user_added",
    visibility: "internal",
    title: t(language, "ticket.lifecycle.members.add.event_title"),
    description: t(language, "ticket.lifecycle.members.add.event_description", {
      userTag: interaction.user.tag,
      targetTag: user.tag,
      ticketId: ticket.ticket_id,
    }),
    metadata: {
      addedUserId: user.id,
      addedUserTag: user.tag,
    },
  });

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle(t(language, "ticket.lifecycle.members.add.result_title"))
        .setDescription(t(language, "ticket.lifecycle.members.add.result_description", { userId: user.id }))
        .setFooter({
          text: t(language, "common.footer.tickets"),
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp(),
    ],
  });
}

async function removeUser(interaction, user) {
  const guild = interaction.guild;
  const settingsRecord = await settings.get(guild.id);
  const language = resolveGuildLanguage(settingsRecord);
  const ticket = await tickets.get(interaction.channel.id);

  if (!ticket) {
    return replyError(interaction, t(language, "ticket.command.not_ticket_channel"), language);
  }
  if (ticket.status === "closed") {
    return replyError(interaction, t(language, "ticket.lifecycle.members.remove.closed_ticket"), language);
  }
  if (user.id === ticket.user_id) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.remove.creator_denied"), language);
  }
  if (user.id === interaction.client.user.id) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.remove.bot_denied"), language);
  }
  if (settingsRecord.support_role && user.id === settingsRecord.support_role) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.remove.support_role_denied"), language);
  }
  if (settingsRecord.admin_role && user.id === settingsRecord.admin_role) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.remove.admin_role_denied"), language);
  }

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.remove.verify_permissions"), language);
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.remove.manage_channels_required"), language);
  }

  try {
    await interaction.channel.permissionOverwrites.delete(user);
  } catch (error) {
    logger.warn("ticket.move", "Failed to remove user from channel", { channelId: interaction.channel?.id, error: error.message });
    return replyError(
      interaction,
      t(language, "ticket.lifecycle.members.remove.permissions_error", { error: error.message }),
      language
    );
  }

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "user_removed",
    visibility: "internal",
    title: t(language, "ticket.lifecycle.members.remove.event_title"),
    description: t(language, "ticket.lifecycle.members.remove.event_description", {
      userTag: interaction.user.tag,
      targetTag: user.tag,
      ticketId: ticket.ticket_id,
    }),
    metadata: {
      removedUserId: user.id,
      removedUserTag: user.tag,
    },
  });

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle(t(language, "ticket.lifecycle.members.remove.result_title"))
        .setDescription(t(language, "ticket.lifecycle.members.remove.result_description", { userId: user.id }))
        .setFooter({
          text: t(language, "common.footer.tickets"),
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp(),
    ],
  });
}

async function moveTicket(interaction, newCategoryId) {
  await interaction.deferReply({ flags: 64 });

  const guild = interaction.guild;
  const settingsRecord = await settings.get(guild.id);
  const language = resolveGuildLanguage(settingsRecord);
  const ticket = await tickets.get(interaction.channel.id);

  if (!ticket) {
    return replyError(interaction, t(language, "ticket.command.not_ticket_channel"), language);
  }
  if (ticket.status === "closed") {
    return replyError(interaction, t(language, "ticket.lifecycle.members.move.closed_ticket"), language);
  }

  const availableCategories = await categoryResolver.getCategoriesForGuild(guild.id);
  const newCategory = availableCategories.find((category) => category.id === newCategoryId);
  if (!newCategory) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.move.category_not_found"), language);
  }
  if (ticket.category_id === newCategoryId) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.move.already_in_category"), language);
  }

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.move.verify_permissions"), language);
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.move.manage_channels_required"), language);
  }

  const oldCategory = ticket.category;
  const oldCategoryId = ticket.category_id;

  const updateResult = await tickets.update(interaction.channel.id, {
    category: newCategory.label,
    category_id: newCategory.id,
    queue_type: resolveQueueTypeFromCategory(newCategory.id),
    priority: newCategory.priority || "normal",
  });

  if (!updateResult) {
    return replyError(interaction, t(language, "ticket.lifecycle.members.move.database_error"), language);
  }

  if (newCategory.categoryId) {
    try {
      await interaction.channel.setParent(newCategory.categoryId, { lockPermissions: false });
      logger.info("ticket.move", "Channel moved to Discord category", { categoryId: newCategory.categoryId, channelId: interaction.channel.id });
    } catch (error) {
      logger.warn("ticket.move", "Failed to move channel to Discord category", { categoryId: newCategory.categoryId, error: error.message });
    }
  }

  try {
    const messages = await interaction.channel.messages.fetch({ limit: 10 });
    const ticketMessage = messages.find((message) =>
      message.author.id === interaction.client.user.id
      && message.embeds.length > 0
      && isTicketControlPanelTitle(message.embeds[0].title)
    );

    if (ticketMessage) {
      const oldEmbed = ticketMessage.embeds[0];
      const newFields = oldEmbed.fields.map((field) => {
        const normalizedFieldName = normalizeTicketFieldName(field.name);
        if (normalizedFieldName === TICKET_FIELD_CATEGORY) {
          return { name: t(language, "ticket.field_category"), value: newCategory.label, inline: field.inline };
        }
        if (normalizedFieldName === TICKET_FIELD_PRIORITY) {
          return {
            name: t(language, "ticket.field_priority"),
            value: priorityLabel(newCategory.priority || "normal", language),
            inline: field.inline,
          };
        }
        return { ...field };
      });

      const newEmbed = EmbedBuilder.from(oldEmbed)
        .setColor(newCategory.color || 0x5865F2)
        .setFields(newFields);

      await ticketMessage.edit({ embeds: [newEmbed] });
    }
  } catch (error) {
    logger.warn("ticket.move", "Failed to update embed after move", { channelId: interaction.channel?.id, error: error.message });
  }

  const updatedTicket = await tickets.get(interaction.channel.id);
  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_moved",
    visibility: "internal",
    title: t(language, "ticket.lifecycle.members.move.event_title"),
    description: t(language, "ticket.lifecycle.members.move.event_description", {
      userTag: interaction.user.tag,
      ticketId: ticket.ticket_id,
      from: oldCategory,
      to: newCategory.label,
    }),
    metadata: {
      previousCategory: oldCategory,
      previousCategoryId: oldCategoryId,
      nextCategory: newCategory.label,
      nextCategoryId: newCategory.id,
      newPriority: newCategory.priority || "normal",
    },
  });

  await sendLog(guild, settingsRecord, "move", interaction.user, updatedTicket, {
    [t(language, "ticket.lifecycle.members.move.log_previous")]: oldCategory,
    [t(language, "ticket.lifecycle.members.move.log_new")]: newCategory.label,
    [t(language, "ticket.lifecycle.members.move.log_priority")]: priorityLabel(newCategory.priority || "normal", language),
  }).catch((error) => logger.warn("ticket.move", "Failed to send move log", { guildId: interaction.guild?.id, error: error.message }));

  return interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(newCategory.color || E.Colors.INFO)
        .setTitle(t(language, "ticket.lifecycle.members.move.result_title"))
        .setDescription(t(language, "ticket.lifecycle.members.move.result_description", {
          from: oldCategory,
          to: newCategory.label,
          priority: priorityLabel(newCategory.priority || "normal", language),
        }))
        .setFooter({
          text: t(language, "common.footer.tickets"),
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp(),
    ],
  });
}

module.exports = {
  addUser,
  removeUser,
  moveTicket,
};
