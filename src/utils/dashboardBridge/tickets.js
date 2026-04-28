"use strict";

const {
  EmbedBuilder,
  notes,
  settings,
  ticketEvents,
  tickets,
} = require("./runtime");
const {
  buildTicketMacroRows,
  isPlainObject,
  toInt,
  toNullableString,
  toIsoOrNull,
  toStringList,
  resolveTicketActorLabel,
  resolveActorKind,
  resolveTicketPriority,
  resolveTicketQueueType,
  resolveTicketWorkflowStatus,
} = require("./config");
const { resolveTicketSlaSnapshot } = require("./metrics");
const { patchRows } = require("./guilds");
const { state } = require("./state");
const {
  updateTicketControlPanelEmbed,
  updateTicketControlPanelComponents,
} = require("../ticketEmbedUpdater");
const { resolveGuildLanguage, t } = require("../i18n");

async function updateRecommendationState(guildId, payload, status, metadata = {}) {
  const recommendationId = toNullableString(payload.recommendationId ?? payload.recommendation_id);
  const runId = toNullableString(payload.runId ?? payload.run_id);
  const nowIso = new Date().toISOString();

  if (recommendationId) {
    await patchRows("guild_ticket_recommendations", {
      guild_id: `eq.${guildId}`,
      recommendation_id: `eq.${recommendationId}`,
    }, {
      status,
      updated_at: nowIso,
      metadata,
    }).catch(() => null);
  }

  if (runId) {
    await patchRows("guild_playbook_runs", {
      guild_id: `eq.${guildId}`,
      run_id: `eq.${runId}`,
    }, {
      status,
      updated_at: nowIso,
      metadata,
    }).catch(() => null);
  }
}

async function buildTicketInboxRows(guild, records) {
  const workspaceTickets = await tickets.listWorkspaceByGuild(guild.id, 180);

  return workspaceTickets.map((ticket) => {
    const workflowStatus = resolveTicketWorkflowStatus(ticket);
    const sla = resolveTicketSlaSnapshot(ticket, records.settingsRecord || {});

    return {
      guild_id: guild.id,
      ticket_id: ticket.ticket_id,
      channel_id: ticket.channel_id,
      user_id: ticket.user_id,
      user_label: ticket.user_tag || null,
      workflow_status: workflowStatus,
      queue_type: resolveTicketQueueType(ticket.queue_type || ticket.category_id),
      category_id: ticket.category_id || null,
      category_label: ticket.category || "General",
      priority: resolveTicketPriority(ticket.priority, "normal"),
      subject: toNullableString(ticket.subject),
      claimed_by: ticket.claimed_by || null,
      claimed_by_label: ticket.claimed_by_tag || resolveTicketActorLabel(ticket, ticket.claimed_by) || null,
      assignee_id: ticket.assigned_to || null,
      assignee_label: ticket.assigned_to_tag || resolveTicketActorLabel(ticket, ticket.assigned_to) || null,
      claimed_at: toIsoOrNull(ticket.claimed_at),
      first_response_at: toIsoOrNull(ticket.first_staff_response),
      resolved_at: toIsoOrNull(ticket.resolved_at),
      closed_at: toIsoOrNull(ticket.closed_at),
      created_at: toIsoOrNull(ticket.created_at) || new Date().toISOString(),
      updated_at: toIsoOrNull(ticket.updated_at) || toIsoOrNull(ticket.last_activity) || new Date().toISOString(),
      last_customer_message_at: toIsoOrNull(ticket.last_customer_message_at),
      last_staff_message_at: toIsoOrNull(ticket.last_staff_message_at),
      last_activity_at: toIsoOrNull(ticket.last_activity),
      message_count: toInt(ticket.message_count, 0, 0, Number.MAX_SAFE_INTEGER),
      staff_message_count: toInt(ticket.staff_message_count, 0, 0, Number.MAX_SAFE_INTEGER),
      reopen_count: toInt(ticket.reopen_count, 0, 0, 1000),
      tags: toStringList(ticket.tags),
      sla_target_minutes: sla.slaTargetMinutes,
      sla_due_at: sla.slaDueAt,
      sla_state: sla.slaState,
      is_open: ticket.status === "open",
    };
  });
}

async function buildTicketEventRows(guildId) {
  const rows = await ticketEvents.listByGuild(guildId, 400);
  return rows.map((event) => ({
    id: event.event_id || event._id?.toString?.() || uid(),
    guild_id: guildId,
    ticket_id: event.ticket_id,
    channel_id: event.channel_id || null,
    actor_id: event.actor_id || null,
    actor_kind: event.actor_kind || "system",
    actor_label: event.actor_label || null,
    event_type: event.event_type || "system",
    visibility: event.visibility || "system",
    title: event.title || "Evento",
    description: event.description || "Sin descripcion",
    metadata: event.metadata && typeof event.metadata === "object" ? event.metadata : {},
    created_at: toIsoOrNull(event.created_at) || new Date().toISOString(),
  }));
}


async function resolveTicketActionTarget(guildId, payload) {
  const channelId = toNullableString(payload.channelId ?? payload.channel_id);
  const ticketId = toNullableString(payload.ticketId ?? payload.ticket_id);

  if (channelId) {
    const byChannel = await tickets.get(channelId);
    if (byChannel?.guild_id === guildId) {
      return byChannel;
    }
  }

  if (ticketId) {
    const byId = await tickets.getById(ticketId, guildId);
    if (byId) {
      return byId;
    }
  }

  return null;
}

async function resolveGuildChannelForAction(guildId, channelId) {
  if (!state.client || !guildId || !channelId) return null;
  const guild = state.client.guilds.cache.get(guildId)
    || await state.client.guilds.fetch(guildId).catch(() => null);
  if (!guild) return null;
  return guild.channels.cache.get(channelId)
    || await guild.channels.fetch(channelId).catch(() => null);
}

function injectStaffIntoTopic(topic, staffId) {
  const baseTopic = String(topic || "").replace(/\s*\|\s*Staff: <@\d+>/, "").trim();
  if (!staffId) return baseTopic;
  return baseTopic ? `${baseTopic} | Staff: <@${staffId}>` : `Staff: <@${staffId}>`;
}

async function syncTicketPresentation(guildId, ticket, options = {}) {
  const channel = await resolveGuildChannelForAction(guildId, ticket.channel_id);
  if (!channel) return false;

  const guildSettings = await settings.get(guildId).catch(() => null);
  const language = resolveGuildLanguage(guildSettings);

  await updateTicketControlPanelEmbed(channel, ticket, {
    language,
    color: options.color,
    updateClaimed: true,
    updateAssigned: true,
    updateStatus: true,
  }).catch(() => false);

  await updateTicketControlPanelComponents(channel, ticket, {
    language,
    disabled: options.disabled === true,
  }).catch(() => false);

  if (typeof channel.setTopic === "function" && options.updateTopic !== false) {
    const topicStaffId = ticket.assigned_to || ticket.claimed_by || null;
    const nextTopic = injectStaffIntoTopic(channel.topic, topicStaffId);
    if (String(channel.topic || "") !== nextTopic) {
      await channel.setTopic(nextTopic).catch((err) => { console.error("[dashboardBridge/tickets] suppressed error:", err?.message || err); });
    }
  }

  return true;
}

async function sendTicketChannelEmbed(guildId, channelId, input = {}) {
  const channel = await resolveGuildChannelForAction(guildId, channelId);
  if (!channel || typeof channel.send !== "function") {
    return false;
  }

  const embed = new EmbedBuilder()
    .setColor(input.color || 0x5865F2)
    .setTitle(input.title || t(resolveGuildLanguage(null, "en"), "ticket.events.status_updated"))
    .setDescription(input.description || t(resolveGuildLanguage(null, "en"), "ticket.events.no_details"))
    .setTimestamp();

  if (input.footerText) {
    embed.setFooter({ text: input.footerText });
  }

  await channel.send({ embeds: [embed] }).catch((err) => { console.error("[dashboardBridge/tickets] suppressed error:", err?.message || err); });
  return true;
}

async function applyTicketActionMutation(guildId, mutation) {
  const payload = isPlainObject(mutation?.requested_payload) ? mutation.requested_payload : {};
  const action = String(mutation?.section || "").trim().toLowerCase();
  const actorDiscordId = toNullableString(payload.actorDiscordId ?? payload.actor_discord_id);
  const actorLabel = toNullableString(payload.actorLabel ?? payload.actor_label);
  const target = await resolveTicketActionTarget(guildId, payload);
  const settingsRecord = await settings.get(guildId);
  const language = resolveGuildLanguage(settingsRecord, "en");

  if (!target) {
    throw new Error("Ticket target not found for dashboard action.");
  }

  switch (action) {
    case "claim": {
      if (target.status === "closed") {
        throw new Error("Cannot claim a closed ticket.");
      }

      const claimedTicket = await tickets.claim(
        target.channel_id,
        actorDiscordId || mutation.actor_user_id || "dashboard",
        actorLabel,
        {
          workflow_status: "triage",
          status_label: t(language, "ticket.events.status_attending"),
        }
      );

      if (!claimedTicket) {
        throw new Error("Ticket already claimed or unavailable.");
      }
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_claimed",
        visibility: "internal",
        title: t(language, "ticket.events.claimed_dashboard"),
        description: t(language, "ticket.events.claimed_dashboard_desc", {
          actor: actorLabel || "Staff",
          id: target.ticket_id,
        }),
        metadata: { source: "dashboard" },
      });
      await syncTicketPresentation(guildId, claimedTicket, { color: 0x57F287 }).catch(() => false);
      await sendTicketChannelEmbed(guildId, target.channel_id, {
        color: 0x57F287,
        title: t(language, "ticket.events.claimed"),
        description: t(language, "ticket.events.claimed_desc", {
          actor: actorLabel || t(language, "common.labels.staff_member"),
        }),
        footerText: t(language, "ticket.events.footer_bridge"),
      });
      return { action, ticketId: claimedTicket.ticket_id, claimedBy: actorDiscordId };
    }
    case "unclaim": {
      if (target.status === "closed") {
        throw new Error("Cannot unclaim a closed ticket.");
      }

      const unclaimedTicket = await tickets.update(target.channel_id, {
        claimed_by: null,
        claimed_by_tag: null,
        workflow_status: "waiting_staff",
        status_label: t(language, "ticket.events.status_searching"),
      });

      if (!unclaimedTicket) {
        throw new Error("Ticket could not be unclaimed.");
      }
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: unclaimedTicket.ticket_id,
        channel_id: unclaimedTicket.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_unclaimed",
        visibility: "internal",
        title: t(language, "ticket.events.released_dashboard"),
        description: t(language, "ticket.events.released_dashboard_desc", {
          actor: actorLabel || "Staff",
          id: target.ticket_id,
        }),
        metadata: { source: "dashboard" },
      });
      await syncTicketPresentation(guildId, unclaimedTicket, { color: 0x5865F2 }).catch(() => false);
      return { action, ticketId: unclaimedTicket.ticket_id };
    }
    case "assign_self": {
      if (target.status === "closed") {
        throw new Error("Cannot assign a closed ticket.");
      }

      const assignedTicket = await tickets.update(target.channel_id, {
        assigned_to: actorDiscordId,
        assigned_to_tag: actorLabel,
        workflow_status: "assigned",
      });

      if (!assignedTicket) {
        throw new Error("Ticket could not be assigned.");
      }
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: assignedTicket.ticket_id,
        channel_id: assignedTicket.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_assigned_self",
        visibility: "internal",
        title: t(language, "ticket.events.assigned_dashboard"),
        description: t(language, "ticket.events.assigned_dashboard_desc", {
          actor: actorLabel || "Staff",
          id: target.ticket_id,
        }),
        metadata: { source: "dashboard" },
      });
      await syncTicketPresentation(guildId, assignedTicket, { color: 0x5865F2 }).catch(() => false);
      return { action, ticketId: assignedTicket.ticket_id, assigneeId: actorDiscordId };
    }
    case "unassign": {
      if (target.status === "closed") {
        throw new Error("Cannot unassign a closed ticket.");
      }

      const unassignedTicket = await tickets.update(target.channel_id, {
        assigned_to: null,
        assigned_to_tag: null,
      });

      if (!unassignedTicket) {
        throw new Error("Ticket could not be unassigned.");
      }
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: unassignedTicket.ticket_id,
        channel_id: unassignedTicket.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_unassigned",
        visibility: "internal",
        title: t(language, "ticket.events.unassigned"),
        description: t(language, "ticket.events.unassigned_desc", {
          actor: actorLabel || "Staff",
          id: target.ticket_id,
        }),
        metadata: { source: "dashboard" },
      });
      await syncTicketPresentation(guildId, unassignedTicket, { color: 0x5865F2 }).catch(() => false);
      return { action, ticketId: unassignedTicket.ticket_id };
    }
    case "set_status": {
      const workflowStatus = String(payload.workflowStatus ?? payload.workflow_status ?? "").trim().toLowerCase();
      if (!["new", "triage", "waiting_user", "waiting_staff", "escalated", "resolved", "closed"].includes(workflowStatus)) {
        throw new Error("Unsupported workflow status.");
      }
      if (workflowStatus === "closed") {
        throw new Error("Use the close action to close tickets.");
      }
      if (target.status === "closed") {
        throw new Error("Cannot change the workflow of a closed ticket.");
      }

      const patch = {
        workflow_status: workflowStatus,
        resolved_at: workflowStatus === "resolved" ? new Date() : null,
      };
      const updatedTicket = await tickets.update(target.channel_id, patch);
      if (!updatedTicket) {
        throw new Error("Ticket status could not be updated.");
      }
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: updatedTicket.ticket_id,
        channel_id: updatedTicket.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_status_changed",
        visibility: "internal",
        title: t(language, "ticket.events.status_updated"),
        description: t(language, "ticket.events.status_updated_desc", {
          actor: actorLabel || "Staff",
          id: target.ticket_id,
          status: workflowStatus,
        }),
        metadata: {
          source: "dashboard",
          workflowStatus,
        },
      });
      await syncTicketPresentation(guildId, updatedTicket, { color: 0x5865F2 }).catch(() => false);
      if (toNullableString(payload.recommendationId ?? payload.recommendation_id)) {
        await updateRecommendationState(guildId, payload, "applied", {
          source: "dashboard",
          appliedAction: action,
          workflowStatus,
        });
      }
      return { action, ticketId: updatedTicket.ticket_id, workflowStatus };
    }
    case "close": {
      const reason = toNullableString(payload.reason) || t(language, "ticket.events.closed_dashboard");
      const closedTicket = await tickets.close(target.channel_id, actorDiscordId || mutation.actor_user_id || "dashboard", reason);
      if (!closedTicket) {
        throw new Error("Ticket could not be closed.");
      }
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: closedTicket.ticket_id,
        channel_id: closedTicket.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_closed",
        visibility: "system",
        title: t(language, "ticket.events.closed_dashboard"),
        description: t(language, "ticket.events.closed_dashboard_desc", {
          actor: actorLabel || "Staff",
          id: target.ticket_id,
        }),
        metadata: {
          source: "dashboard",
          reason,
        },
      });
      await syncTicketPresentation(guildId, closedTicket, {
        color: 0xED4245,
        disabled: true,
      }).catch(() => false);
      await sendTicketChannelEmbed(guildId, target.channel_id, {
        color: 0xED4245,
        title: t(language, "ticket.events.closed"),
        description: t(language, "ticket.events.closed_desc", {
          actor: actorLabel || t(language, "common.labels.staff_member"),
          reason,
        }),
        footerText: t(language, "ticket.events.footer_bridge"),
      });
      if (toNullableString(payload.recommendationId ?? payload.recommendation_id)) {
        await updateRecommendationState(guildId, payload, "applied", {
          source: "dashboard",
          appliedAction: action,
          reason,
        });
      }
      return { action, ticketId: closedTicket.ticket_id, closed: true };
    }
    case "reopen": {
      const reopenedTicket = await tickets.reopen(target.channel_id, actorDiscordId || mutation.actor_user_id || "dashboard");
      if (!reopenedTicket) {
        throw new Error("Ticket could not be reopened.");
      }
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: reopenedTicket.ticket_id,
        channel_id: reopenedTicket.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_reopened",
        visibility: "system",
        title: t(language, "ticket.events.reopened_dashboard"),
        description: t(language, "ticket.events.reopened_dashboard_desc", {
          actor: actorLabel || "Staff",
          id: target.ticket_id,
        }),
        metadata: { source: "dashboard" },
      });
      await sendTicketChannelEmbed(guildId, target.channel_id, {
        color: 0x57F287,
        title: t(language, "ticket.events.reopened"),
        description: t(language, "ticket.events.reopened_desc", {
          actor: actorLabel || t(language, "common.labels.staff_member"),
        }),
        footerText: t(language, "ticket.events.footer_bridge"),
      });
      await syncTicketPresentation(guildId, reopenedTicket, {
        color: 0x57F287,
        disabled: false,
      }).catch(() => false);
      if (toNullableString(payload.recommendationId ?? payload.recommendation_id)) {
        await updateRecommendationState(guildId, payload, "applied", {
          source: "dashboard",
          appliedAction: action,
        });
      }
      return { action, ticketId: reopenedTicket.ticket_id, reopened: true };
    }
    case "add_note": {
      const note = toNullableString(payload.note);
      if (!note) throw new Error("Internal note is required.");
      await notes.add(
        target.ticket_id,
        actorDiscordId || mutation.actor_user_id || "dashboard",
        note,
        guildId
      );
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_ticket_note_added",
        visibility: "internal",
        title: t(language, "ticket.events.internal_note"),
        description: t(language, "ticket.events.internal_note_desc", {
          actor: actorLabel || "Staff",
        }),
        metadata: {
          source: "dashboard",
          notePreview: note.slice(0, 160),
        },
      });
      if (toNullableString(payload.recommendationId ?? payload.recommendation_id)) {
        await updateRecommendationState(guildId, payload, "applied", {
          source: "dashboard",
          appliedAction: action,
          notePreview: note.slice(0, 160),
        });
      }
      return { action, ticketId: target.ticket_id, noteAdded: true };
    }
    case "add_tag": {
      const tag = toNullableString(payload.tag);
      if (!tag) throw new Error("Tag is required.");
      await tickets.addTag(target.channel_id, tag);
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_ticket_tag_added",
        visibility: "internal",
        title: t(language, "ticket.events.tag_added"),
        description: t(language, "ticket.events.tag_added_desc", {
          actor: actorLabel || "Staff",
          tag,
        }),
        metadata: {
          source: "dashboard",
          tag,
        },
      });
      if (toNullableString(payload.recommendationId ?? payload.recommendation_id)) {
        await updateRecommendationState(guildId, payload, "applied", {
          source: "dashboard",
          appliedAction: action,
          tag,
        });
      }
      return { action, ticketId: target.ticket_id, tag };
    }
    case "remove_tag": {
      const tag = toNullableString(payload.tag);
      if (!tag) throw new Error("Tag is required.");
      await tickets.removeTag(target.channel_id, tag);
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_ticket_tag_removed",
        visibility: "internal",
        title: t(language, "ticket.events.tag_removed"),
        description: t(language, "ticket.events.tag_removed_desc", {
          actor: actorLabel || "Staff",
          tag,
        }),
        metadata: {
          source: "dashboard",
          tag,
        },
      });
      if (toNullableString(payload.recommendationId ?? payload.recommendation_id)) {
        await updateRecommendationState(guildId, payload, "applied", {
          source: "dashboard",
          appliedAction: action,
          tagRemoved: tag,
        });
      }
      return { action, ticketId: target.ticket_id, tagRemoved: tag };
    }
    case "reply_customer": {
      const message = toNullableString(payload.message);
      if (!message) throw new Error("Message is required.");
      const channel = await resolveGuildChannelForAction(guildId, target.channel_id);
      if (!channel || typeof channel.send !== "function") {
        throw new Error("Ticket channel is not available.");
      }
      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(t(language, "ticket.events.reply_sent_title"))
            .setDescription(message)
            .setFooter({ text: actorLabel || "Staff" })
            .setTimestamp(),
        ],
      });
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_ticket_reply_sent",
        visibility: "public",
        title: t(language, "ticket.events.reply_sent"),
        description: t(language, "ticket.events.reply_sent_desc", {
          actor: actorLabel || "Staff",
        }),
        metadata: {
          source: "dashboard",
          messagePreview: message.slice(0, 220),
        },
      });
      if (toNullableString(payload.recommendationId ?? payload.recommendation_id)) {
        await updateRecommendationState(guildId, payload, "applied", {
          source: "dashboard",
          appliedAction: action,
          messagePreview: message.slice(0, 220),
        });
      }
      return { action, ticketId: target.ticket_id, messageSent: true };
    }
    case "post_macro": {
      const macroId = toNullableString(payload.macroId ?? payload.macro_id);
      if (!macroId) throw new Error("Macro ID is required.");
      const macroRows = buildTicketMacroRows(guildId, { settingsRecord: await settings.get(guildId) });
      const macro = macroRows.find((row) => row.macro_id === macroId);
      if (!macro) throw new Error(`Macro ${macroId} not found.`);
      const channel = await resolveGuildChannelForAction(guildId, target.channel_id);
      if (!channel || typeof channel.send !== "function") {
        throw new Error("Ticket channel is not available.");
      }
      await channel.send({ content: macro.content }).catch((err) => { console.error("[dashboardBridge/tickets] suppressed error:", err?.message || err); });
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_ticket_macro_sent",
        visibility: macro.visibility === "internal" ? "internal" : "public",
        title: t(language, "ticket.events.macro_sent"),
        description: t(language, "ticket.events.macro_sent_desc", {
          actor: actorLabel || "Staff",
          macro: macro.label,
        }),
        metadata: {
          source: "dashboard",
          macroId: macro.macro_id,
          macroLabel: macro.label,
        },
      });
      if (toNullableString(payload.recommendationId ?? payload.recommendation_id)) {
        await updateRecommendationState(guildId, payload, "applied", {
          source: "dashboard",
          appliedAction: action,
          macroId: macro.macro_id,
          macroLabel: macro.label,
        });
      }
      return { action, ticketId: target.ticket_id, macroId };
    }
    case "set_priority": {
      const rawPriority = toNullableString(payload.priority);
      if (!rawPriority) throw new Error("Priority is required.");
      const priority = resolveTicketPriority(rawPriority, "");
      if (!priority) throw new Error("Priority is required.");
      if (target.status === "closed") {
        throw new Error("Cannot change the priority of a closed ticket.");
      }
      const priorityTicket = await tickets.update(target.channel_id, { priority });
      if (!priorityTicket) {
        throw new Error("Ticket priority could not be updated.");
      }
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: priorityTicket.ticket_id,
        channel_id: priorityTicket.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_ticket_priority_changed",
        visibility: "internal",
        title: t(language, "ticket.events.priority_updated"),
        description: t(language, "ticket.events.priority_updated_desc", {
          actor: actorLabel || "Staff",
          id: target.ticket_id,
          priority,
        }),
        metadata: {
          source: "dashboard",
          priority,
        },
      });
      await syncTicketPresentation(guildId, priorityTicket, { color: 0x5865F2 }).catch(() => false);
      if (toNullableString(payload.recommendationId ?? payload.recommendation_id)) {
        await updateRecommendationState(guildId, payload, "applied", {
          source: "dashboard",
          appliedAction: action,
          priority,
        });
      }
      return { action, ticketId: priorityTicket.ticket_id, priority };
    }
    case "confirm_recommendation": {
      await updateRecommendationState(guildId, payload, "applied", {
        source: "dashboard",
        appliedAction: action,
      });
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_playbook_confirmed",
        visibility: "internal",
        title: t(language, "ticket.events.recommendation_confirmed"),
        description: t(language, "ticket.events.recommendation_confirmed_desc", {
          actor: actorLabel || "Staff",
        }),
        metadata: {
          source: "dashboard",
          recommendationId: toNullableString(payload.recommendationId ?? payload.recommendation_id),
          runId: toNullableString(payload.runId ?? payload.run_id),
        },
      });
      return { action, ticketId: target.ticket_id, confirmed: true };
    }
    case "dismiss_recommendation": {
      await updateRecommendationState(guildId, payload, "dismissed", {
        source: "dashboard",
        appliedAction: action,
      });
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_playbook_dismissed",
        visibility: "internal",
        title: t(language, "ticket.events.recommendation_discarded"),
        description: t(language, "ticket.events.recommendation_discarded_desc", {
          actor: actorLabel || "Staff",
        }),
        metadata: {
          source: "dashboard",
          recommendationId: toNullableString(payload.recommendationId ?? payload.recommendation_id),
          runId: toNullableString(payload.runId ?? payload.run_id),
        },
      });
      return { action, ticketId: target.ticket_id, dismissed: true };
    }
    default:
      throw new Error(`Unsupported dashboard ticket action: ${action}`);
  }
}


module.exports = {
  buildTicketInboxRows,
  buildTicketEventRows,
  updateRecommendationState,
  resolveTicketActionTarget,
  resolveGuildChannelForAction,
  sendTicketChannelEmbed,
  applyTicketActionMutation,
};
