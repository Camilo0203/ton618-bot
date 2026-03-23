"use strict";

const {
  EmbedBuilder,
  ticketEvents,
  tickets,
} = require("./runtime");
const {
  isPlainObject,
  toNullableString,
  toNullableDiscordId,
  toIsoOrNull,
  resolveTicketActorLabel,
  resolveActorKind,
  resolveTicketPriority,
  resolveTicketQueueType,
  resolveTicketWorkflowStatus,
} = require("./config");
const { resolveTicketSlaSnapshot } = require("./metrics");
const { state } = require("./state");

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

async function sendTicketChannelEmbed(guildId, channelId, input = {}) {
  const channel = await resolveGuildChannelForAction(guildId, channelId);
  if (!channel || typeof channel.send !== "function") {
    return false;
  }

  const embed = new EmbedBuilder()
    .setColor(input.color || 0x5865F2)
    .setTitle(input.title || "Actualizacion del ticket")
    .setDescription(input.description || "Sin detalles adicionales.")
    .setTimestamp();

  if (input.footerText) {
    embed.setFooter({ text: input.footerText });
  }

  await channel.send({ embeds: [embed] }).catch(() => {});
  return true;
}

async function applyTicketActionMutation(guildId, mutation) {
  const payload = isPlainObject(mutation?.requested_payload) ? mutation.requested_payload : {};
  const action = String(mutation?.section || "").trim().toLowerCase();
  const actorDiscordId = toNullableString(payload.actorDiscordId ?? payload.actor_discord_id);
  const actorLabel = toNullableString(payload.actorLabel ?? payload.actor_label);
  const target = await resolveTicketActionTarget(guildId, payload);

  if (!target) {
    throw new Error("Ticket target not found for dashboard action.");
  }

  switch (action) {
    case "claim": {
      await tickets.update(target.channel_id, {
        claimed_by: actorDiscordId,
        claimed_by_tag: actorLabel,
        workflow_status: "triage",
      });
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_claimed",
        visibility: "internal",
        title: "Ticket reclamado desde dashboard",
        description: `${actorLabel || "Staff"} reclamo el ticket #${target.ticket_id} desde la dashboard.`,
        metadata: {
          source: "dashboard",
        },
      });
      await sendTicketChannelEmbed(guildId, target.channel_id, {
        color: 0x57F287,
        title: "Ticket reclamado",
        description: `${actorLabel || "Un miembro del staff"} tomo este ticket desde la dashboard.`,
        footerText: "TON618 · Inbox operativa",
      });
      return { action, ticketId: target.ticket_id, claimedBy: actorDiscordId };
    }
    case "unclaim": {
      await tickets.update(target.channel_id, {
        claimed_by: null,
        claimed_by_tag: null,
        workflow_status: "waiting_staff",
      });
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_unclaimed",
        visibility: "internal",
        title: "Ticket liberado desde dashboard",
        description: `${actorLabel || "Staff"} libero el ticket #${target.ticket_id} desde la dashboard.`,
        metadata: { source: "dashboard" },
      });
      return { action, ticketId: target.ticket_id };
    }
    case "assign_self": {
      await tickets.update(target.channel_id, {
        assigned_to: actorDiscordId,
        assigned_to_tag: actorLabel,
      });
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_assigned_self",
        visibility: "internal",
        title: "Ticket asignado desde dashboard",
        description: `${actorLabel || "Staff"} se asigno el ticket #${target.ticket_id}.`,
        metadata: { source: "dashboard" },
      });
      return { action, ticketId: target.ticket_id, assigneeId: actorDiscordId };
    }
    case "unassign": {
      await tickets.update(target.channel_id, {
        assigned_to: null,
        assigned_to_tag: null,
      });
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_unassigned",
        visibility: "internal",
        title: "Asignacion removida",
        description: `${actorLabel || "Staff"} removio la asignacion del ticket #${target.ticket_id}.`,
        metadata: { source: "dashboard" },
      });
      return { action, ticketId: target.ticket_id };
    }
    case "set_status": {
      const workflowStatus = String(payload.workflowStatus ?? payload.workflow_status ?? "").trim().toLowerCase();
      if (!["new", "triage", "waiting_user", "waiting_staff", "escalated", "resolved", "closed"].includes(workflowStatus)) {
        throw new Error("Unsupported workflow status.");
      }

      const patch = {
        workflow_status: workflowStatus,
        resolved_at: workflowStatus === "resolved" ? new Date() : null,
      };
      await tickets.update(target.channel_id, patch);
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_status_changed",
        visibility: "internal",
        title: "Estado operativo actualizado",
        description: `${actorLabel || "Staff"} cambio el estado del ticket #${target.ticket_id} a ${workflowStatus}.`,
        metadata: {
          source: "dashboard",
          workflowStatus,
        },
      });
      return { action, ticketId: target.ticket_id, workflowStatus };
    }
    case "close": {
      const reason = toNullableString(payload.reason) || "Cerrado desde la dashboard";
      await tickets.close(target.channel_id, actorDiscordId || mutation.actor_user_id || "dashboard", reason);
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_closed",
        visibility: "system",
        title: "Ticket cerrado desde dashboard",
        description: `${actorLabel || "Staff"} cerro el ticket #${target.ticket_id} desde la dashboard.`,
        metadata: {
          source: "dashboard",
          reason,
        },
      });
      await sendTicketChannelEmbed(guildId, target.channel_id, {
        color: 0xED4245,
        title: "Ticket cerrado",
        description: `${actorLabel || "Un miembro del staff"} cerro este ticket desde la dashboard.\nMotivo: ${reason}`,
        footerText: "TON618 · Inbox operativa",
      });
      return { action, ticketId: target.ticket_id, closed: true };
    }
    case "reopen": {
      await tickets.reopen(target.channel_id, actorDiscordId || mutation.actor_user_id || "dashboard");
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: resolveActorKind(actorDiscordId, target),
        actor_label: actorLabel,
        event_type: "dashboard_ticket_reopened",
        visibility: "system",
        title: "Ticket reabierto desde dashboard",
        description: `${actorLabel || "Staff"} reabrio el ticket #${target.ticket_id} desde la dashboard.`,
        metadata: { source: "dashboard" },
      });
      await sendTicketChannelEmbed(guildId, target.channel_id, {
        color: 0x57F287,
        title: "Ticket reabierto",
        description: `${actorLabel || "Un miembro del staff"} reabrio este ticket desde la dashboard.`,
        footerText: "TON618 · Inbox operativa",
      });
      return { action, ticketId: target.ticket_id, reopened: true };
    }
    case "add_note": {
      const note = toNullableString(payload.note);
      if (!note) throw new Error("Internal note is required.");
      await notes.add(target.ticket_id, actorDiscordId || mutation.actor_user_id || "dashboard", note);
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_ticket_note_added",
        visibility: "internal",
        title: "Nota interna agregada",
        description: `${actorLabel || "Staff"} agrego una nota interna desde la dashboard.`,
        metadata: {
          source: "dashboard",
          notePreview: note.slice(0, 160),
        },
      });
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
        title: "Tag agregado",
        description: `${actorLabel || "Staff"} agrego el tag ${tag} desde la dashboard.`,
        metadata: {
          source: "dashboard",
          tag,
        },
      });
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
        title: "Tag removido",
        description: `${actorLabel || "Staff"} removio el tag ${tag} desde la dashboard.`,
        metadata: {
          source: "dashboard",
          tag,
        },
      });
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
            .setTitle("Respuesta desde la dashboard")
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
        title: "Respuesta enviada",
        description: `${actorLabel || "Staff"} respondio al cliente desde la dashboard.`,
        metadata: {
          source: "dashboard",
          messagePreview: message.slice(0, 220),
        },
      });
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
      await channel.send({ content: macro.content }).catch(() => {});
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_ticket_macro_sent",
        visibility: macro.visibility === "internal" ? "internal" : "public",
        title: "Macro enviada",
        description: `${actorLabel || "Staff"} envio la macro ${macro.label} desde la dashboard.`,
        metadata: {
          source: "dashboard",
          macroId: macro.macro_id,
          macroLabel: macro.label,
        },
      });
      return { action, ticketId: target.ticket_id, macroId };
    }
    case "set_priority": {
      const rawPriority = toNullableString(payload.priority);
      if (!rawPriority) throw new Error("Priority is required.");
      const priority = resolveTicketPriority(rawPriority, "");
      if (!priority) throw new Error("Priority is required.");
      await tickets.update(target.channel_id, { priority });
      await ticketEvents.add({
        guild_id: guildId,
        ticket_id: target.ticket_id,
        channel_id: target.channel_id,
        actor_id: actorDiscordId,
        actor_kind: "staff",
        actor_label: actorLabel,
        event_type: "dashboard_ticket_priority_changed",
        visibility: "internal",
        title: "Prioridad actualizada",
        description: `${actorLabel || "Staff"} cambio la prioridad del ticket #${target.ticket_id} a ${priority}.`,
        metadata: {
          source: "dashboard",
          priority,
        },
      });
      return { action, ticketId: target.ticket_id, priority };
    }
    default:
      throw new Error(`Unsupported dashboard ticket action: ${action}`);
  }
}


module.exports = {
  buildTicketInboxRows,
  buildTicketEventRows,
  resolveTicketActionTarget,
  resolveGuildChannelForAction,
  sendTicketChannelEmbed,
  applyTicketActionMutation,
};
