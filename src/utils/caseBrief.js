"use strict";

const { EmbedBuilder } = require("discord.js");
const { tickets, ticketEvents, settings } = require("./database");
const config = require("../../config");

function assessTicketRisk(ticket, guildSettings) {
  const risks = [];
  let riskLevel = "low";

  const category = config.categories.find((c) => c.id === ticket.category);
  if (category?.priority === "urgent") {
    risks.push("Categoría de alta prioridad");
    riskLevel = "high";
  }

  if (ticket.priority === "urgent") {
    risks.push("Prioridad urgente");
    riskLevel = "high";
  } else if (ticket.priority === "high" && riskLevel !== "high") {
    riskLevel = "medium";
  }

  const ageMinutes = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
  const slaMinutes = Number(guildSettings?.sla_minutes || 0);
  
  if (slaMinutes > 0 && ageMinutes > slaMinutes && !ticket.first_staff_response) {
    risks.push("Fuera de SLA sin respuesta");
    riskLevel = "high";
  }

  if (ticket.reopen_count > 2) {
    risks.push(`Reabierto ${ticket.reopen_count} veces`);
    if (riskLevel === "low") riskLevel = "medium";
  }

  if (ticket.message_count > 50) {
    risks.push("Conversación extensa (>50 mensajes)");
    if (riskLevel === "low") riskLevel = "medium";
  }

  if (!ticket.claimed_by && !ticket.assigned_to && ageMinutes > 30) {
    risks.push("Sin asignar por más de 30 minutos");
    if (riskLevel === "low") riskLevel = "medium";
  }

  return { risks, riskLevel };
}

function determineNextAction(ticket, guildSettings) {
  if (ticket.status === "closed") {
    return "Ticket cerrado. No requiere acción.";
  }

  if (!ticket.first_staff_response) {
    return "🔴 **URGENTE**: Dar primera respuesta al usuario";
  }

  if (!ticket.claimed_by && !ticket.assigned_to) {
    return "Reclamar o asignar el ticket a un miembro del staff";
  }

  const ageMinutes = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
  const slaMinutes = Number(guildSettings?.sla_minutes || 0);
  
  if (slaMinutes > 0 && ageMinutes > slaMinutes * 0.8) {
    return "Resolver pronto - cerca del límite SLA";
  }

  if (ticket.priority === "urgent") {
    return "Resolver con prioridad urgente";
  }

  if (ticket.reopen_count > 0) {
    return "Revisar por qué fue reabierto y resolver definitivamente";
  }

  return "Continuar atención normal del ticket";
}

function buildOperationalContext(ticket, guildSettings) {
  const context = [];
  
  const category = config.categories.find((c) => c.id === ticket.category);
  if (category) {
    context.push(`**Tipo**: ${category.label}`);
  }

  const ageMinutes = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
  const ageHours = Math.floor(ageMinutes / 60);
  const ageDisplay = ageHours > 0 ? `${ageHours}h ${ageMinutes % 60}m` : `${ageMinutes}m`;
  context.push(`**Edad**: ${ageDisplay}`);

  if (ticket.first_staff_response) {
    const responseTime = Math.floor((new Date(ticket.first_staff_response).getTime() - new Date(ticket.created_at).getTime()) / 60000);
    context.push(`**1ª respuesta**: ${responseTime}m`);
  } else {
    context.push(`**1ª respuesta**: ⚠️ Pendiente`);
  }

  if (ticket.claimed_by) {
    context.push(`**Responsable**: <@${ticket.claimed_by}>`);
  } else if (ticket.assigned_to) {
    context.push(`**Asignado**: <@${ticket.assigned_to}>`);
  } else {
    context.push(`**Responsable**: ⚠️ Sin asignar`);
  }

  context.push(`**Mensajes**: ${ticket.message_count}`);

  if (ticket.reopen_count > 0) {
    context.push(`**Reaperturas**: ${ticket.reopen_count}`);
  }

  return context.join("\n");
}

function buildRecommendation(ticket, guildSettings, riskAssessment) {
  const recommendations = [];

  if (!ticket.first_staff_response) {
    recommendations.push("• Responder inmediatamente al usuario");
  }

  if (!ticket.claimed_by && !ticket.assigned_to) {
    recommendations.push("• Usar `/ticket claim` para tomar responsabilidad");
  }

  if (ticket.priority === "low" || ticket.priority === "normal") {
    const category = config.categories.find((c) => c.id === ticket.category);
    if (category?.priority === "urgent" || category?.priority === "high") {
      recommendations.push("• Considerar elevar la prioridad con `/ticket priority`");
    }
  }

  if (riskAssessment.riskLevel === "high") {
    recommendations.push("• Escalar a supervisor si no se puede resolver pronto");
  }

  if (ticket.reopen_count > 1) {
    recommendations.push("• Revisar historial con `/ticket history` antes de cerrar");
    recommendations.push("• Documentar resolución en notas internas");
  }

  const ageMinutes = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
  if (ageMinutes > 120 && ticket.message_count < 3) {
    recommendations.push("• Verificar si el usuario sigue necesitando ayuda");
  }

  if (recommendations.length === 0) {
    recommendations.push("• Continuar con el flujo normal de resolución");
  }

  return recommendations.join("\n");
}

function getRiskEmoji(riskLevel) {
  switch (riskLevel) {
    case "high": return "🔴";
    case "medium": return "🟡";
    case "low": return "🟢";
    default: return "⚪";
  }
}

function getRiskColor(riskLevel) {
  switch (riskLevel) {
    case "high": return 0xED4245;
    case "medium": return 0xFEE75C;
    case "low": return 0x57F287;
    default: return 0x5865F2;
  }
}

async function generateCaseBrief(ticket, guildSettings) {
  const riskAssessment = assessTicketRisk(ticket, guildSettings);
  const nextAction = determineNextAction(ticket, guildSettings);
  const context = buildOperationalContext(ticket, guildSettings);
  const recommendation = buildRecommendation(ticket, guildSettings, riskAssessment);

  const embed = new EmbedBuilder()
    .setTitle(`📋 Case Brief - Ticket #${ticket.ticket_id}`)
    .setColor(getRiskColor(riskAssessment.riskLevel))
    .setDescription(`**Estado**: ${ticket.status === "open" ? "🟢 Abierto" : "🔒 Cerrado"}`)
    .addFields(
      {
        name: `${getRiskEmoji(riskAssessment.riskLevel)} Nivel de Riesgo`,
        value: riskAssessment.risks.length > 0
          ? `**${riskAssessment.riskLevel.toUpperCase()}**\n${riskAssessment.risks.map(r => `• ${r}`).join("\n")}`
          : `**${riskAssessment.riskLevel.toUpperCase()}** - Sin factores de riesgo detectados`,
        inline: false,
      },
      {
        name: "🎯 Siguiente Acción",
        value: nextAction,
        inline: false,
      },
      {
        name: "📊 Contexto Operativo",
        value: context,
        inline: false,
      },
      {
        name: "💡 Recomendaciones",
        value: recommendation,
        inline: false,
      }
    )
    .setFooter({ text: "Case Brief generado automáticamente por TON618" })
    .setTimestamp();

  return embed;
}

async function generateCaseBriefForChannel(channelId, guildId) {
  const ticket = await tickets.get(channelId);
  if (!ticket) {
    return null;
  }

  const guildSettings = await settings.get(guildId);
  return generateCaseBrief(ticket, guildSettings);
}

module.exports = {
  generateCaseBrief,
  generateCaseBriefForChannel,
  assessTicketRisk,
  determineNextAction,
  buildOperationalContext,
  buildRecommendation,
};
