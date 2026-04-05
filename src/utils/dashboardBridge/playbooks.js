"use strict";

const {
  toIsoOrNull,
  toNullableString,
  buildTicketMacroRows,
} = require("./config");
const { resolveCommercialState, getPlanWeight } = require("../commercial");

const PLAYBOOK_DEFINITIONS = [
  {
    playbookId: "triage_support",
    key: "triage_support",
    tier: "pro",
    executionMode: "assistive",
    sortOrder: 1,
    label: {
      es: "Triage de soporte",
      en: "Support triage",
    },
    description: {
      es: "Ayuda al staff a reclamar, pedir contexto y filtrar tickets nuevos antes de que se acumulen.",
      en: "Helps staff claim, clarify and sort new tickets before the queue stacks up.",
    },
    summary: {
      es: "Detecta tickets nuevos sin responsable y propone el primer paso operativo.",
      en: "Detects unowned new tickets and suggests the first operational step.",
    },
    triggerSummary: {
      es: "Tickets abiertos sin claim o sin primera respuesta de staff.",
      en: "Open tickets without claim or first staff reply.",
    },
  },
  {
    playbookId: "sla_escalation",
    key: "sla_escalation",
    tier: "pro",
    executionMode: "assistive",
    sortOrder: 2,
    label: {
      es: "Escalado por SLA",
      en: "SLA escalation",
    },
    description: {
      es: "Prioriza tickets cercanos o fuera del SLA y recomienda escalado o cambio de prioridad.",
      en: "Prioritizes near-breach or breached tickets and recommends handoff, priority or escalation.",
    },
    summary: {
      es: "Lee estados de alerta y vencimiento para agilizar decisiones antes de perder el SLA.",
      en: "Reads warning and breached states to push decisions before the response window is lost.",
    },
    triggerSummary: {
      es: "Tickets en advertencia o vencidos según las reglas de SLA del servidor.",
      en: "Tickets in warning or breached state based on guild SLA rules.",
    },
  },
  {
    playbookId: "incident_mode",
    key: "incident_mode",
    tier: "pro",
    executionMode: "assistive",
    sortOrder: 3,
    label: {
      es: "Modo incidente",
      en: "Incident mode",
    },
    description: {
      es: "Cuando el servidor entra en incidente, refuerza prioridades y recuerda al staff las restricciones activas.",
      en: "When the server enters incident mode, it reinforces priorities and reminds staff about active restrictions.",
    },
    summary: {
      es: "Convierte incident mode en una guía visible dentro del inbox y la consola operativa.",
      en: "Turns incident mode into visible guidance inside the inbox and ops console.",
    },
    triggerSummary: {
      es: "Servidor con incident_mode_enabled y tickets abiertos impactados.",
      en: "Guild with incident_mode_enabled and impacted open tickets.",
    },
  },
  {
    playbookId: "customer_recovery",
    key: "customer_recovery",
    tier: "pro",
    executionMode: "assistive",
    sortOrder: 4,
    label: {
      es: "Recuperacion de usuario",
      en: "Customer recovery",
    },
    description: {
      es: "Muestra memoria operativa ligera para tickets repetidos y ayuda a responder con contexto.",
      en: "Shows lightweight operational memory for repeat tickets and helps answer with context.",
    },
    summary: {
      es: "Detecta usuarios recurrentes, tags recientes y posibles fricciones previas.",
      en: "Detects returning users, recent tags and previous friction signals.",
    },
    triggerSummary: {
      es: "Usuarios con historial reciente o multiples tickets abiertos/cerrados.",
      en: "Users with recent history or multiple open/closed tickets.",
    },
  },
  {
    playbookId: "auto_tagging",
    key: "auto_tagging",
    tier: "pro",
    executionMode: "assistive",
    sortOrder: 5,
    label: {
      es: "Auto-etiquetado inteligente",
      en: "Smart auto-tagging",
    },
    description: {
      es: "Analiza el mensaje inicial y sugiere las etiquetas (tags) más relevantes para cada caso.",
      en: "Analyzes the initial message and suggests the most relevant tags for the case.",
    },
    summary: {
      es: "Utiliza procesamiento predictivo para organizar la cola de tickets sin intervención manual.",
      en: "Uses predictive processing to organize the ticket queue without manual intervention.",
    },
    triggerSummary: {
      es: "Nuevos tickets con mensajes descriptivos.",
      en: "New tickets with descriptive messages.",
    },
  },
];

function getLanguage(records = {}) {
  return records?.settingsRecord?.bot_language === "en" ? "en" : "es";
}

function getOpsPlan(records = {}) {
  return resolveCommercialState(records?.settingsRecord).effectivePlan;
}

function getDisabledPlaybooks(records = {}) {
  const raw = records?.settingsRecord?.disabled_playbooks;
  if (!Array.isArray(raw)) return new Set();
  return new Set(
    raw
      .map((item) => String(item || "").trim().toLowerCase())
      .filter(Boolean),
  );
}

function isPlaybookAvailable(playbook, records = {}) {
  if (!playbook) return false;
  const disabled = getDisabledPlaybooks(records);
  if (disabled.has(playbook.playbookId) || disabled.has(playbook.key)) {
    return false;
  }
  return getPlanWeight(getOpsPlan(records)) >= getPlanWeight(playbook.tier);
}

function getMemoryRetentionDays() {
  const parsed = Number(process.env.CUSTOMER_MEMORY_RETENTION_DAYS || 90);
  if (!Number.isFinite(parsed)) return 90;
  return Math.max(14, Math.min(365, Math.floor(parsed)));
}

function resolveRetentionThreshold() {
  return Date.now() - getMemoryRetentionDays() * 24 * 60 * 60 * 1000;
}

function toLabel(localized, language) {
  if (!localized || typeof localized !== "object") {
    return "";
  }

  return localized[language] || localized.es || localized.en || "";
}

function sortTicketsDesc(left, right) {
  const leftDate = new Date(left.updated_at || left.last_activity || left.created_at || 0).getTime();
  const rightDate = new Date(right.updated_at || right.last_activity || right.created_at || 0).getTime();
  return rightDate - leftDate;
}

function isRecentEnough(ticket, threshold) {
  const candidate = new Date(ticket.updated_at || ticket.last_activity || ticket.created_at || 0).getTime();
  return Number.isFinite(candidate) && candidate >= threshold;
}

function normalizeRecentTags(tickets) {
  const tags = [];
  const seen = new Set();

  for (const ticket of tickets) {
    const rawTags = Array.isArray(ticket.tags) ? ticket.tags : [];
    for (const tag of rawTags) {
      const normalized = String(tag || "").trim().toLowerCase();
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      tags.push(normalized);
      if (tags.length >= 6) {
        return tags;
      }
    }
  }

  return tags;
}

function deriveRiskLevel(memory) {
  if (!memory) return "new";
  if (memory.breachedTickets > 0 || memory.openTickets > 1) return "watch";
  if (memory.totalTickets > 1) return "returning";
  return "new";
}

function buildCustomerSummary(memory, language) {
  if (!memory) {
    return language === "en"
      ? "New customer context will appear as soon as more ticket history is available."
      : "El contexto del usuario aparecera cuando exista mas historial de tickets.";
  }

  if (language === "en") {
    if (memory.riskLevel === "watch") {
      return `${memory.displayLabel} has ${memory.openTickets} open ticket(s), ${memory.breachedTickets} breached signal(s) and recent tags: ${memory.recentTags.join(", ") || "none"}.`;
    }
    if (memory.riskLevel === "returning") {
      return `${memory.displayLabel} is a returning customer with ${memory.totalTickets} total tickets and recent tags: ${memory.recentTags.join(", ") || "none"}.`;
    }
    return `${memory.displayLabel} is a new contact. Keep context clean and confirm the first response path.`;
  }

  if (memory.riskLevel === "watch") {
    return `${memory.displayLabel} tiene ${memory.openTickets} ticket(s) abierto(s), ${memory.breachedTickets} señal(es) de riesgo y tags recientes: ${memory.recentTags.join(", ") || "sin tags"}.`;
  }
  if (memory.riskLevel === "returning") {
    return `${memory.displayLabel} es un usuario recurrente con ${memory.totalTickets} tickets totales y tags recientes: ${memory.recentTags.join(", ") || "sin tags"}.`;
  }
  return `${memory.displayLabel} es un contacto nuevo. Conviene mantener claro el primer paso de respuesta.`;
}

function findMacroId(macroRows, macroId) {
  return macroRows.find((macro) => macro.macro_id === macroId)?.macro_id || null;
}

function buildRecommendationTitle(playbookId, language) {
  switch (playbookId) {
    case "triage_support":
      return language === "en" ? "Claim and qualify this ticket" : "Reclamar y calificar este ticket";
    case "sla_escalation":
      return language === "en" ? "SLA risk needs escalation" : "El riesgo SLA necesita escalado";
    case "incident_mode":
      return language === "en" ? "Incident mode is affecting this case" : "El modo incidente impacta este caso";
    case "customer_recovery":
      return language === "en" ? "Use prior customer context" : "Usar contexto previo del usuario";
    case "auto_tagging":
      return language === "en" ? "Apply smart ticket tags" : "Aplicar etiquetas inteligentes";
    default:
      return language === "en" ? "Operational recommendation" : "Recomendacion operativa";
  }
}

function buildRecommendationSummary(playbookId, ticket, memory, language) {
  switch (playbookId) {
    case "triage_support":
      return language === "en"
        ? `Ticket #${ticket.ticket_id} is still unowned. Start with a claim and a clarification macro.`
        : `El ticket #${ticket.ticket_id} sigue sin responsable. Empieza con claim y una macro de clarificacion.`;
    case "sla_escalation":
      return language === "en"
        ? `Ticket #${ticket.ticket_id} is ${ticket.sla_state === "breached" ? "already out of SLA" : "approaching SLA"}. Raise priority before it stalls.`
        : `El ticket #${ticket.ticket_id} ${ticket.sla_state === "breached" ? "ya salio del SLA" : "se acerca al SLA"}. Conviene subir prioridad antes de que se estanque.`;
    case "incident_mode":
      return language === "en"
        ? `Incident mode is active. Keep this ticket aligned with the reduced operating posture.`
        : `El modo incidente está activo. Mantén este ticket alineado con la postura operativa reducida.`;
    case "customer_recovery":
      return language === "en"
        ? buildCustomerSummary(memory, language)
        : buildCustomerSummary(memory, language);
    case "auto_tagging":
      return language === "en"
        ? `New ticket #${ticket.ticket_id} matches specific operational patterns. Apply suggested tags for better sorting.`
        : `El ticket nuevo #${ticket.ticket_id} coincide con patrones operativos especificos. Aplica tags sugeridos.`;
    default:
      return language === "en" ? "Review the current context before acting." : "Revisa el contexto actual antes de actuar.";
  }
}

function buildRecommendationReason(playbookId, ticket, memory, records, language) {
  switch (playbookId) {
    case "triage_support":
      return language === "en"
        ? `Open support ticket without ownership or first response (${ticket.workflow_status}).`
        : `Ticket de soporte abierto sin ownership o primera respuesta (${ticket.workflow_status}).`;
    case "sla_escalation":
      return language === "en"
        ? `SLA state is ${ticket.sla_state} with target ${ticket.sla_target_minutes || 0} minutes.`
        : `El estado SLA es ${ticket.sla_state} con objetivo de ${ticket.sla_target_minutes || 0} minutos.`;
    case "incident_mode":
      return language === "en"
        ? `Incident mode is enabled${records?.settingsRecord?.incident_message ? `: ${records.settingsRecord.incident_message}` : "."}`
        : `El modo incidente está activo${records?.settingsRecord?.incident_message ? `: ${records.settingsRecord.incident_message}` : "."}`;
    case "customer_recovery":
      return language === "en"
        ? `${memory?.totalTickets || 0} historical ticket(s) with risk level ${memory?.riskLevel || "new"}.`
        : `${memory?.totalTickets || 0} ticket(s) historicos con nivel de riesgo ${memory?.riskLevel || "new"}.`;
    case "auto_tagging":
      return language === "en"
        ? `Initial message pattern matching (${ticket.message_count || 0} messages).`
        : `Coincidencia de patrones en mensaje inicial (${ticket.message_count || 0} mensajes).`;
    default:
      return language === "en" ? "Operational context detected." : "Se detecto contexto operativo.";
  }
}

function buildAssistiveLayer(playbookId, ticket, memory, records, language) {
  const plan = getOpsPlan(records);
  const isPro = getPlanWeight(plan) >= getPlanWeight("pro");
  
  const replyDrafts = {
    triage_support: language === "en"
      ? "Thanks for reaching out. I am taking ownership of this case and need a bit more detail to move faster."
      : "Gracias por escribirnos. Ya tome este caso y necesito un poco mas de detalle para moverlo mas rapido.",
    sla_escalation: language === "en"
      ? "We are escalating this case internally so it does not miss the response window."
      : "Vamos a escalar este caso internamente para que no se nos pase la ventana de respuesta.",
    incident_mode: language === "en"
      ? "Incident mode is active right now, so we are prioritizing the most critical cases first."
      : "En este momento estamos en modo incidente, asi que estamos priorizando primero los casos mas criticos.",
    customer_recovery: language === "en"
      ? "I reviewed your previous context so we can continue without asking you to start from zero."
      : "Revise tu contexto anterior para continuar sin hacerte empezar desde cero.",
    auto_tagging: language === "en"
      ? "Based on your request, I've categorized this as a specialized case for our technical team."
      : "Basado en tu solicitud, he categorizado este caso como especializado para nuestro equipo tecnico.",
  };

  const nextActions = {
    triage_support: language === "en" ? "Claim, clarify and set triage status." : "Reclamar, pedir contexto y pasar a triage.",
    sla_escalation: language === "en" ? "Raise priority and escalate ownership." : "Subir prioridad y escalar ownership.",
    incident_mode: language === "en" ? "Keep scope tight and align with incident restrictions." : "Mantener el alcance corto y alineado con las restricciones del incidente.",
    customer_recovery: language === "en" ? "Respond with prior context and confirm what changed." : "Responder con contexto previo y confirmar que cambio.",
    auto_tagging: language === "en" ? "Confirm the suggested tags and process the case." : "Confirmar los tags sugeridos y procesar el caso.",
  };

  return {
    provider: isPro ? "ops_predictive_v2 (Pro)" : (process.env.OPS_ASSISTANT_PROVIDER || "deterministic"),
    mode: isPro ? "semi_autonomous" : "assistive",
    summary: buildRecommendationSummary(playbookId, ticket, memory, language),
    replyDraft: replyDrafts[playbookId] || replyDrafts.triage_support,
    nextAction: nextActions[playbookId] || nextActions.triage_support,
    riskLabel: memory?.riskLevel || "new",
  };
}

function buildRecommendationMetadata(playbookId, ticket, memory, macroId, records, language) {
  return {
    playbookId,
    ticketId: ticket.ticket_id,
    userId: ticket.user_id,
    workflowStatus: ticket.workflow_status || null,
    slaState: ticket.sla_state || null,
    queueType: ticket.queue_type || null,
    categoryId: ticket.category_id || null,
    categoryLabel: ticket.category || null,
    memoryRiskLevel: memory?.riskLevel || "new",
    memoryTickets: memory?.totalTickets || 0,
    suggestedMacroId: macroId || null,
    assistant: buildAssistiveLayer(playbookId, ticket, memory, records, language),
  };
}

function buildRecommendationRecord({ guildId, ticket, playbookId, tone, suggestedAction, suggestedMacroId, suggestedPriority, suggestedStatus, confidence, memory, records, language }) {
  const recommendationId = `${ticket.ticket_id}_${playbookId}`;
  return {
    recommendation_id: recommendationId,
    guild_id: guildId,
    ticket_id: ticket.ticket_id,
    user_id: ticket.user_id,
    playbook_id: playbookId,
    status: "pending",
    tone,
    title: buildRecommendationTitle(playbookId, language),
    summary: buildRecommendationSummary(playbookId, ticket, memory, language),
    reason: buildRecommendationReason(playbookId, ticket, memory, records, language),
    suggested_action: suggestedAction,
    suggested_priority: suggestedPriority || null,
    suggested_status: suggestedStatus || null,
    suggested_macro_id: suggestedMacroId || null,
    confidence,
    customer_risk_level: memory?.riskLevel || "new",
    customer_summary: buildCustomerSummary(memory, language),
    metadata: buildRecommendationMetadata(playbookId, ticket, memory, suggestedMacroId, records, language),
    created_at: toIsoOrNull(ticket.updated_at) || toIsoOrNull(ticket.created_at) || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function buildPlaybookRunRows(guildId, recommendationRows) {
  return recommendationRows.map((recommendation, index) => ({
    run_id: `run_${recommendation.recommendation_id}`,
    guild_id: guildId,
    playbook_id: recommendation.playbook_id,
    ticket_id: recommendation.ticket_id,
    user_id: recommendation.user_id,
    status: recommendation.status,
    tone: recommendation.tone,
    title: recommendation.title,
    summary: recommendation.summary,
    reason: recommendation.reason,
    suggested_action: recommendation.suggested_action,
    suggested_priority: recommendation.suggested_priority,
    suggested_status: recommendation.suggested_status,
    suggested_macro_id: recommendation.suggested_macro_id,
    confidence: recommendation.confidence,
    sort_order: index + 1,
    metadata: recommendation.metadata,
    created_at: recommendation.created_at,
    updated_at: recommendation.updated_at,
  }));
}

function buildPlaybookDefinitionRows(guildId, records = {}) {
  const language = getLanguage(records);
  const disabledPlaybooks = getDisabledPlaybooks(records);
  const currentPlan = getOpsPlan(records);

  return PLAYBOOK_DEFINITIONS.map((playbook) => ({
    guild_id: guildId,
    playbook_id: playbook.playbookId,
    key: playbook.key,
    label: toLabel(playbook.label, language),
    description: toLabel(playbook.description, language),
    tier: playbook.tier,
    execution_mode: playbook.executionMode,
    summary: toLabel(playbook.summary, language),
    trigger_summary: toLabel(playbook.triggerSummary, language),
    is_enabled: !disabledPlaybooks.has(playbook.playbookId)
      && !disabledPlaybooks.has(playbook.key)
      && getPlanWeight(currentPlan) >= getPlanWeight(playbook.tier),
    sort_order: playbook.sortOrder,
    updated_at: new Date().toISOString(),
  }));
}

function buildCustomerMemoryRows(guildId, workspaceTickets = []) {
  const threshold = resolveRetentionThreshold();
  const grouped = new Map();

  for (const ticket of workspaceTickets) {
    if (!isRecentEnough(ticket, threshold)) {
      continue;
    }
    const userId = String(ticket.user_id || "").trim();
    if (!userId) continue;

    if (!grouped.has(userId)) {
      grouped.set(userId, []);
    }
    grouped.get(userId).push(ticket);
  }

  return Array.from(grouped.entries())
    .map(([userId, tickets]) => {
      const orderedTickets = [...tickets].sort(sortTicketsDesc);
      const openTickets = orderedTickets.filter((ticket) => ticket.status === "open");
      const resolvedTickets = orderedTickets.filter((ticket) => ticket.workflow_status === "resolved" || ticket.status === "closed");
      const breachedTickets = orderedTickets.filter((ticket) => ticket.sla_state === "breached");
      const recentTags = normalizeRecentTags(orderedTickets.slice(0, 5));
      const base = {
        guild_id: guildId,
        user_id: userId,
        display_label: orderedTickets[0]?.user_tag || userId,
        total_tickets: orderedTickets.length,
        open_tickets: openTickets.length,
        resolved_tickets: resolvedTickets.length,
        breached_tickets: breachedTickets.length,
        recent_tags: recentTags,
        last_ticket_at: toIsoOrNull(orderedTickets[0]?.created_at) || null,
        last_resolved_at: toIsoOrNull(resolvedTickets[0]?.resolved_at || resolvedTickets[0]?.closed_at) || null,
        updated_at: new Date().toISOString(),
      };

      const riskLevel = deriveRiskLevel({
        totalTickets: base.total_tickets,
        openTickets: base.open_tickets,
        breachedTickets: base.breached_tickets,
      });

      return {
        ...base,
        risk_level: riskLevel,
        summary: buildCustomerSummary(
          {
            displayLabel: base.display_label,
            totalTickets: base.total_tickets,
            openTickets: base.open_tickets,
            breachedTickets: base.breached_tickets,
            recentTags: base.recent_tags,
            riskLevel,
          },
          "es",
        ),
      };
    })
    .sort((left, right) => {
      if (left.risk_level !== right.risk_level) {
        if (left.risk_level === "watch") return -1;
        if (right.risk_level === "watch") return 1;
        if (left.risk_level === "returning") return -1;
        if (right.risk_level === "returning") return 1;
      }
      return (right.last_ticket_at || "").localeCompare(left.last_ticket_at || "");
    });
}

function buildMemoryMap(rows = []) {
  return new Map(
    rows.map((row) => [row.user_id, {
      displayLabel: row.display_label,
      totalTickets: row.total_tickets,
      openTickets: row.open_tickets,
      resolvedTickets: row.resolved_tickets,
      breachedTickets: row.breached_tickets,
      recentTags: Array.isArray(row.recent_tags) ? row.recent_tags : [],
      lastTicketAt: row.last_ticket_at,
      lastResolvedAt: row.last_resolved_at,
      riskLevel: row.risk_level,
      summary: row.summary,
    }]),
  );
}

function buildTicketRecommendationRows(guildId, workspaceTickets = [], records = {}) {
  const language = getLanguage(records);
  const macroRows = buildTicketMacroRows(guildId, records);
  const customerMemoryRows = buildCustomerMemoryRows(guildId, workspaceTickets);
  const customerMemory = buildMemoryMap(customerMemoryRows);
  const recommendations = [];
  const availablePlaybooks = new Map(
    PLAYBOOK_DEFINITIONS.map((playbook) => [playbook.playbookId, isPlaybookAvailable(playbook, records)]),
  );

  for (const ticket of workspaceTickets) {
    if (ticket.status !== "open") {
      continue;
    }

    const memory = customerMemory.get(ticket.user_id) || null;
    const unowned = !ticket.claimed_by && !ticket.assigned_to;
    const missingFirstReply = !ticket.first_staff_response;
    const incidentEnabled = records?.settingsRecord?.incident_mode_enabled === true;

    if ((unowned || missingFirstReply) && availablePlaybooks.get("triage_support")) {
      recommendations.push(buildRecommendationRecord({
        guildId,
        ticket,
        playbookId: "triage_support",
        tone: "info",
        suggestedAction: "post_macro",
        suggestedMacroId: findMacroId(macroRows, ticket.message_count <= 1 ? "welcome" : "need_details"),
        suggestedPriority: ticket.priority === "low" ? "normal" : ticket.priority || "normal",
        suggestedStatus: "triage",
        confidence: 0.78,
        memory,
        records,
        language,
      }));
    }

    if ((ticket.sla_state === "warning" || ticket.sla_state === "breached") && availablePlaybooks.get("sla_escalation")) {
      recommendations.push(buildRecommendationRecord({
        guildId,
        ticket,
        playbookId: "sla_escalation",
        tone: ticket.sla_state === "breached" ? "danger" : "warning",
        suggestedAction: ticket.sla_state === "breached" ? "set_status" : "set_priority",
        suggestedMacroId: findMacroId(macroRows, ticket.sla_state === "breached" ? "handoff" : "need_details"),
        suggestedPriority: ticket.sla_state === "breached" ? "urgent" : (ticket.priority === "low" ? "normal" : "high"),
        suggestedStatus: ticket.sla_state === "breached" ? "escalated" : null,
        confidence: ticket.sla_state === "breached" ? 0.93 : 0.84,
        memory,
        records,
        language,
      }));
    }

    if (incidentEnabled && availablePlaybooks.get("incident_mode")) {
      recommendations.push(buildRecommendationRecord({
        guildId,
        ticket,
        playbookId: "incident_mode",
        tone: "warning",
        suggestedAction: "set_priority",
        suggestedMacroId: findMacroId(macroRows, "handoff"),
        suggestedPriority: ticket.priority === "urgent" ? "urgent" : "high",
        suggestedStatus: ticket.workflow_status === "escalated" ? null : "escalated",
        confidence: 0.8,
        memory,
        records,
        language,
      }));
    }

    if (((memory?.totalTickets || 0) > 1 || (memory?.riskLevel === "watch")) && availablePlaybooks.get("customer_recovery")) {
      recommendations.push(buildRecommendationRecord({
        guildId,
        ticket,
        playbookId: "customer_recovery",
        tone: memory?.riskLevel === "watch" ? "warning" : "info",
        suggestedAction: "review",
        suggestedMacroId: findMacroId(macroRows, "welcome"),
        suggestedPriority: null,
        suggestedStatus: null,
        confidence: memory?.riskLevel === "watch" ? 0.87 : 0.72,
        memory,
        records,
        language,
      }));
    }

    if (ticket.message_count <= 2 && availablePlaybooks.get("auto_tagging")) {
      recommendations.push(buildRecommendationRecord({
        guildId,
        ticket,
        playbookId: "auto_tagging",
        tone: "success",
        suggestedAction: "apply_tags",
        suggestedMacroId: findMacroId(macroRows, "welcome"),
        suggestedPriority: null,
        suggestedStatus: null,
        confidence: 0.91,
        memory,
        records,
        language,
      }));
    }
  }

  const uniqueRecommendations = Array.from(
    new Map(recommendations.map((recommendation) => [recommendation.recommendation_id, recommendation])).values(),
  );

  return {
    customerMemoryRows,
    recommendationRows: uniqueRecommendations.sort((left, right) => {
      const toneWeight = { danger: 4, warning: 3, info: 2, success: 1, neutral: 0 };
      const leftWeight = toneWeight[left.tone] ?? 0;
      const rightWeight = toneWeight[right.tone] ?? 0;
      if (leftWeight !== rightWeight) {
        return rightWeight - leftWeight;
      }
      return (right.updated_at || "").localeCompare(left.updated_at || "");
    }),
  };
}

module.exports = {
  PLAYBOOK_DEFINITIONS,
  buildPlaybookDefinitionRows,
  buildCustomerMemoryRows,
  buildTicketRecommendationRows,
  buildPlaybookRunRows,
};
