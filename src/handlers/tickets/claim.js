"use strict";

const {
  tickets,
  settings,
  staffStats,
  E,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("./context");
const {
  TICKET_FIELD_CATEGORY,
  TICKET_FIELD_ASSIGNED,
  replyError,
  recordTicketEventSafe,
  sendLog,
} = require("./shared");
const {
  updateTicketControlPanelEmbed,
  updateTicketControlPanelComponents,
} = require("../../utils/ticketEmbedUpdater");
const { resolveGuildLanguage, t } = require("../../utils/i18n");

async function claimTicket(interaction) {
  await interaction.deferReply({ flags: 64 });
  console.log("[CLAIM] Starting ticket claim flow");

  const guild = interaction.guild;
  const s = await settings.get(guild.id);
  const language = resolveGuildLanguage(s);
  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, t(language, "ticket.command.not_ticket_channel"), language);
  if (ticket.status === "closed") return replyError(interaction, t(language, "ticket.lifecycle.claim.closed_ticket"), language);

  // Validar que el usuario sea staff
  const isStaff = interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
    (s.support_role && interaction.member.roles.cache.has(s.support_role)) ||
    (s.admin_role && interaction.member.roles.cache.has(s.admin_role));

  if (!isStaff) {
    return replyError(interaction, t(language, "ticket.lifecycle.claim.staff_only"), language);
  }

  if (ticket.claimed_by) {
    if (ticket.claimed_by === interaction.user.id) {
      return replyError(interaction, t(language, "ticket.lifecycle.claim.already_claimed_self"), language);
    }
    return replyError(
      interaction,
      t(language, "ticket.lifecycle.claim.already_claimed_other", { userId: ticket.claimed_by }),
      language
    );
  }
  
  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, t(language, "ticket.lifecycle.claim.verify_permissions"), language);
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, t(language, "ticket.lifecycle.claim.manage_channels_required"), language);
  }

  const updateResult = await tickets.claim(interaction.channel.id, interaction.user.id, interaction.user.tag, {
    workflow_status: "triage",
    status_label: t(language, "ticket.workflow.triage"),
  });

  if (!updateResult) {
    const latestTicket = await tickets.get(interaction.channel.id).catch(() => null);
    if (latestTicket?.claimed_by && latestTicket.claimed_by !== interaction.user.id) {
      return replyError(
        interaction,
        t(language, "ticket.lifecycle.claim.claimed_during_request", { userId: latestTicket.claimed_by }),
        language
      );
    }
    return replyError(interaction, t(language, "ticket.lifecycle.claim.database_error"), language);
  }

  await staffStats.incrementClaimed(guild.id, interaction.user.id).catch(err => {
    console.error('[CLAIM STATS ERROR]', err.message);
  });
  console.log('[CLAIM] BD actualizada correctamente');
  
  // Actualizar topic del canal
  try {
    const currentTopic = interaction.channel.topic || "";
    const newTopic = currentTopic.includes("Staff:") 
      ? currentTopic.replace(/Staff: <@\d+>/, `Staff: <@${interaction.user.id}>`)
      : `${currentTopic} | Staff: <@${interaction.user.id}>`;
    await interaction.channel.setTopic(newTopic);
    console.log('[CLAIM] Topic del canal actualizado');
  } catch (error) {
    console.error("[CLAIM TOPIC ERROR]", error.message);
    // Continuar con el proceso aunque falle el cambio de topic
  }

  const permissionUpdates = [
    interaction.channel.permissionOverwrites.edit(interaction.user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      ManageMessages: true,
      EmbedLinks: true,
      AddReactions: true,
    }).then(() => {
      console.log('[CLAIM] Permisos del usuario reclamante actualizados');
      return { role: 'claimer', success: true };
    }).catch(error => {
      console.error(`[CLAIM PERMISSIONS ERROR] Usuario reclamante: ${error.message}`);
      return { role: 'claimer', success: false, error: error.message };
    }),
  ];

  const permResults = await Promise.all(permissionUpdates);
  const claimerPermSuccess = permResults.find(r => r.role === 'claimer')?.success;
  
  if (!claimerPermSuccess) {
    console.error('[CLAIM] CRITICAL: No se pudieron dar permisos al reclamante');
  }

  try {
    await updateTicketControlPanelEmbed(interaction.channel, updateResult, {
      color: 0x57F287,
      thumbnail: interaction.user.displayAvatarURL({ dynamic: true }),
      updateClaimed: true,
      updateAssigned: true,
      updateStatus: true,
    });
    await updateTicketControlPanelComponents(interaction.channel, updateResult);
    console.log('[CLAIM] Panel de control actualizado');
  } catch (e) {
    console.error("[CLAIM UPDATE EMBED]", e.message);
  }

  let dmEnviado = false;
  if (s.dm_alerts !== false) {
    try {
      const user = await interaction.client.users.fetch(ticket.user_id).catch(() => null);
      if (user) {
        const channelLink = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`;

        const dmEmbed = new EmbedBuilder()
          .setColor(0x57F287)
          .setTitle(t(language, "ticket.lifecycle.claim.dm_title"))
            .setDescription(t(language, "ticket.lifecycle.claim.dm_description", {
              ticketId: ticket.ticket_id,
              guild: interaction.guild.name,
              staff: interaction.user.tag,
              categoryLabel: t(language, "ticket.field_category"),
              category: ticket.category,
              channelLink,
            }))
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `${interaction.guild.name} - TON618 Tickets` })
          .setTimestamp();

        await user.send({ embeds: [dmEmbed] });
        dmEnviado = true;
        console.log("[CLAIM] DM sent to the ticket owner");
      }
    } catch (dmError) {
      console.error(`[DM ERROR] Could not send a DM to user ${ticket.user_id}: ${dmError.message}`);
    }
  }

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_claimed",
    visibility: "internal",
    title: t(language, "ticket.lifecycle.claim.result_title"),
    description: t(language, "ticket.lifecycle.claim.event_description", {
      userTag: interaction.user.tag,
      ticketId: ticket.ticket_id,
    }),
    metadata: {
      notifiedUserByDm: dmEnviado,
      permissionResults: permResults,
    },
  });

  await sendLog(guild, s, "claim", interaction.user, updateResult, {
    [t(language, "ticket.lifecycle.claim.log_claimed_by")]: `<@${interaction.user.id}>`,
  }).catch(err => console.error('[CLAIM LOG ERROR]', err.message));

  console.log("[CLAIM] Flow completed successfully");
  
  const warningMessages = [];
  if (!claimerPermSuccess) {
    warningMessages.push(t(language, "ticket.lifecycle.claim.warning_permissions"));
  }
  if (!dmEnviado && s.dm_alerts !== false) {
    warningMessages.push(t(language, "ticket.lifecycle.claim.warning_dm"));
  }

  return interaction.editReply({
    embeds: [new EmbedBuilder()
      .setColor(E.Colors.SUCCESS)
      .setTitle(t(language, "ticket.lifecycle.claim.result_title"))
      .setDescription(t(language, "ticket.lifecycle.claim.result_description", {
        ticketId: ticket.ticket_id,
        dmLine: dmEnviado ? t(language, "ticket.lifecycle.claim.dm_line") : "",
        warningBlock: warningMessages.length ? `\n\n${warningMessages.join('\n')}` : "",
      }))
      .setFooter({ 
        text: "TON618 Tickets",
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp()],
  });
}

async function unclaimTicket(interaction) {
  await interaction.deferReply({ flags: 64 });

  const s = await settings.get(interaction.guild.id);
  const language = resolveGuildLanguage(s);
  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, t(language, "ticket.command.not_ticket_channel"), language);
  if (ticket.status === "closed") return replyError(interaction, t(language, "ticket.lifecycle.unclaim.closed_ticket"), language);
  if (!ticket.claimed_by) return replyError(interaction, t(language, "ticket.lifecycle.unclaim.not_claimed"), language);

  const hasAdminPermission = interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
    || interaction.member?.permissions?.has(PermissionFlagsBits.Administrator);
  const hasConfiguredAdminRole = Boolean(s.admin_role && interaction.member.roles.cache.has(s.admin_role));
  const isAdmin = hasAdminPermission || hasConfiguredAdminRole;
  const isClaimer = ticket.claimed_by === interaction.user.id;
  
  if (!isAdmin && !isClaimer) {
    return replyError(interaction, t(language, "ticket.lifecycle.unclaim.denied"), language);
  }

  const updateResult = await tickets.update(interaction.channel.id, {
    claimed_by: null,
    claimed_by_tag: null,
    workflow_status: "waiting_staff",
    status_label: t(language, "ticket.workflow.waiting_staff"),
  });

  if (!updateResult) {
    return replyError(interaction, t(language, "ticket.lifecycle.unclaim.database_error"), language);
  }

  // Actualizar topic del canal para remover staff
  try {
    const currentTopic = interaction.channel.topic || "";
    const newTopic = currentTopic.replace(/\s*\|\s*Staff: <@\d+>/, "");
    await interaction.channel.setTopic(newTopic);
    console.log('[UNCLAIM] Topic del canal actualizado');
  } catch (error) {
    console.error("[UNCLAIM TOPIC ERROR]", error.message);
  }
  
  const permissionRestores = [];

  if (ticket.claimed_by && ticket.claimed_by !== ticket.assigned_to) {
    permissionRestores.push(
      interaction.channel.permissionOverwrites.delete(ticket.claimed_by)
        .then(() => ({ role: 'previous_claimer', success: true }))
        .catch(error => ({ role: 'previous_claimer', success: false, error: error.message }))
    );
  }

  const permResults = await Promise.all(permissionRestores);
  
  try {
    await updateTicketControlPanelEmbed(interaction.channel, updateResult, {
      color: 0x5865F2,
      updateClaimed: true,
      updateAssigned: true,
      updateStatus: true,
    });
    await updateTicketControlPanelComponents(interaction.channel, updateResult);
  } catch (e) {
    console.error("[UNCLAIM UPDATE EMBED]", e.message);
  }

  await recordTicketEventSafe({
    guild_id: interaction.guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_unclaimed",
    visibility: "internal",
    title: t(language, "ticket.lifecycle.unclaim.result_title"),
    description: t(language, "ticket.lifecycle.unclaim.event_description", {
      userTag: interaction.user.tag,
      ticketId: ticket.ticket_id,
    }),
    metadata: {
      previousClaimer: ticket.claimed_by,
      permissionResults: permResults,
    },
  });

  await sendLog(interaction.guild, s, "unclaim", interaction.user, updateResult, {
    [t(language, "ticket.lifecycle.unclaim.log_released_by")]: `<@${interaction.user.id}>`,
    [t(language, "ticket.lifecycle.unclaim.log_previous_claimer")]: `<@${ticket.claimed_by}>`,
  }).catch(err => console.error('[UNCLAIM LOG ERROR]', err.message));

  const permWarnings = permResults.filter(r => !r.success);
  
  return interaction.editReply({ 
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.WARNING)
        .setTitle(t(language, "ticket.lifecycle.unclaim.result_title"))
        .setDescription(t(language, "ticket.lifecycle.unclaim.result_description", {
          warningLine: permWarnings.length ? `\n\n${t(language, "ticket.lifecycle.unclaim.warning_permissions")}` : "",
        }))
        .setFooter({ 
          text: "TON618 Tickets",
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()
    ] 
  });
}

// -----------------------------------------------------
//   ASIGNAR STAFF
// -----------------------------------------------------
async function assignTicket(interaction, staffUser) {
  await interaction.deferReply({ flags: 64 });

  const guild = interaction.guild;
  const s = await settings.get(guild.id);
  const language = resolveGuildLanguage(s);
  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) return replyError(interaction, t(language, "ticket.command.not_ticket_channel"), language);
  if (ticket.status === "closed") return replyError(interaction, t(language, "ticket.lifecycle.assign.closed_ticket"), language);

  // Validar que quien ejecuta la asignaciÃ³n sea staff
  const isExecutorStaff = interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
    (s.support_role && interaction.member.roles.cache.has(s.support_role)) ||
    (s.admin_role && interaction.member.roles.cache.has(s.admin_role));

  if (!isExecutorStaff) {
    return replyError(interaction, t(language, "ticket.lifecycle.assign.staff_only"), language);
  }

  if (staffUser.bot) {
    return replyError(interaction, t(language, "ticket.lifecycle.assign.bot_denied"), language);
  }

  if (staffUser.id === ticket.user_id) {
    return replyError(interaction, t(language, "ticket.lifecycle.assign.creator_denied"), language);
  }

  const staffMember = await guild.members.fetch(staffUser.id).catch(() => null);
  if (!staffMember) {
    return replyError(interaction, t(language, "ticket.lifecycle.assign.staff_member_missing"), language);
  }

  const isStaffMember = staffMember.permissions.has(PermissionFlagsBits.Administrator) ||
    (s.support_role && staffMember.roles.cache.has(s.support_role)) ||
    (s.admin_role && staffMember.roles.cache.has(s.admin_role));

  if (!isStaffMember) {
    return replyError(interaction, t(language, "ticket.lifecycle.assign.invalid_assignee"), language);
  }

  const botMember = guild.members.me || await guild.members.fetch(interaction.client.user.id).catch(() => null);
  if (!botMember) {
    return replyError(interaction, t(language, "ticket.lifecycle.assign.verify_permissions"), language);
  }

  const channelPerms = interaction.channel.permissionsFor(botMember);
  if (!channelPerms || !channelPerms.has(PermissionFlagsBits.ManageChannels)) {
    return replyError(interaction, t(language, "ticket.lifecycle.assign.manage_channels_required"), language);
  }

  try {
    await interaction.channel.permissionOverwrites.edit(staffUser, {
      ViewChannel: true, 
      SendMessages: true, 
      ReadMessageHistory: true, 
      AttachFiles: true,
      ManageMessages: true,
      EmbedLinks: true,
      AddReactions: true,
    });
  } catch (error) {
    console.error('[ASSIGN PERMISSIONS ERROR]', error.message);
    return replyError(interaction, t(language, "ticket.lifecycle.assign.assign_permissions_error", { error: error.message }), language);
  }

  const updateResult = await tickets.update(interaction.channel.id, {
    assigned_to: staffUser.id,
    assigned_to_tag: staffUser.tag,
    workflow_status: "assigned",
  });

  if (!updateResult) {
    return replyError(interaction, t(language, "ticket.lifecycle.assign.database_error"), language);
  }

  await staffStats.incrementAssigned(guild.id, staffUser.id).catch(err => {
    console.error('[ASSIGN STATS ERROR]', err.message);
  });

  // Actualizar topic del canal para incluir staff asignado
  try {
    const currentTopic = interaction.channel.topic || "";
    const newTopic = currentTopic.includes("Staff:") 
      ? currentTopic.replace(/Staff: <@\d+>/, `Staff: <@${staffUser.id}>`)
      : `${currentTopic} | Staff: <@${staffUser.id}>`;
    await interaction.channel.setTopic(newTopic);
    console.log('[ASSIGN] Topic del canal actualizado');
  } catch (error) {
    console.error("[ASSIGN TOPIC ERROR]", error.message);
  }

  try {
    const msgs = await interaction.channel.messages.fetch({ limit: 10 });
    const ticketMsg = msgs.find(m => 
      m.author.id === interaction.client.user.id && 
      m.embeds.length > 0 &&
      isTicketControlPanelTitle(m.embeds[0].title)
    );
    
    if (ticketMsg) {
      const oldEmbed = ticketMsg.embeds[0];
      const hasAssignedField = oldEmbed.fields?.some((field) => normalizeTicketFieldName(field.name) === TICKET_FIELD_ASSIGNED);
      
      if (hasAssignedField) {
        const newFields = oldEmbed.fields.map(f => {
          if (normalizeTicketFieldName(f.name) === TICKET_FIELD_ASSIGNED) {
            return { name: t(language, "ticket.field_assigned_to"), value: `<@${staffUser.id}>`, inline: f.inline };
          }
          return f;
        });
        const newEmbed = EmbedBuilder.from(oldEmbed).setFields(newFields);
        await ticketMsg.edit({ embeds: [newEmbed] });
      } else {
        const newEmbed = EmbedBuilder.from(oldEmbed)
          .addFields({ name: t(language, "ticket.field_assigned_to"), value: `<@${staffUser.id}>`, inline: true });
        await ticketMsg.edit({ embeds: [newEmbed] });
      }
      console.log('[ASSIGN] Embed actualizado correctamente');
    }
  } catch (e) {
    console.error("[ASSIGN UPDATE EMBED]", e.message);
  }

  await sendLog(guild, s, "assign", interaction.user, updateResult, { 
    [t(language, "ticket.lifecycle.assign.log_assigned_to")]: `<@${staffUser.id}>`,
    [t(language, "ticket.lifecycle.assign.log_assigned_by")]: `<@${interaction.user.id}>`,
  }).catch(err => console.error('[ASSIGN LOG ERROR]', err.message));

  let dmSent = false;
  if (s.dm_alerts !== false) {
    try {
      const channelLink = `https://discord.com/channels/${guild.id}/${ticket.channel_id}`;
      await staffUser.send({ 
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.INFO)
            .setTitle(t(language, "ticket.lifecycle.assign.dm_title"))
            .setDescription(t(language, "ticket.lifecycle.assign.dm_description", {
              ticketId: ticket.ticket_id,
              guild: guild.name,
              categoryLabel: t(language, "ticket.field_category"),
              category: ticket.category,
              userId: ticket.user_id,
              channelLink,
            }))
            .setFooter({ text: `${guild.name} - TON618 Tickets` })
            .setTimestamp()
        ] 
      });
      dmSent = true;
    } catch (dmError) {
      console.error(`[DM ERROR] No se pudo enviar DM al staff ${staffUser.id}: ${dmError.message}`);
    }
  }

  await recordTicketEventSafe({
    guild_id: guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_assigned",
    visibility: "internal",
    title: t(language, "ticket.lifecycle.assign.result_title"),
    description: t(language, "ticket.lifecycle.assign.event_description", {
      userTag: interaction.user.tag,
      ticketId: ticket.ticket_id,
      staffTag: staffUser.tag,
    }),
    metadata: {
      assigneeId: staffUser.id,
      assigneeLabel: staffUser.tag,
      notifiedByDm: dmSent,
    },
  });

  const warnings = [];
  if (!dmSent && s.dm_alerts !== false) {
    warnings.push(t(language, "ticket.lifecycle.assign.dm_warning"));
  }

  return interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.INFO)
        .setTitle(t(language, "ticket.lifecycle.assign.result_title"))
        .setDescription(t(language, "ticket.lifecycle.assign.result_description", {
          ticketId: ticket.ticket_id,
          staffId: staffUser.id,
          dmLine: dmSent ? t(language, "ticket.lifecycle.assign.dm_line") : "",
          warningLine: warnings.length ? `\n\n${warnings.join(" ")}` : "",
        }))
        .setFooter({ 
          text: "TON618 Tickets",
          iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp()
    ],
  });
}

// -----------------------------------------------------
//   ANADIR / QUITAR USUARIO
// -----------------------------------------------------

module.exports = {
  claimTicket,
  unclaimTicket,
  assignTicket,
};



