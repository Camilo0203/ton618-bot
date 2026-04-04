"use strict";

const { EmbedBuilder } = require("discord.js");
const { tickets, ticketEvents, settings } = require("./database");
const { t } = require("./i18n");
const config = require("../../config");

function assessTicketRisk(ticket, guildSettings, language = "es") {
  const risks = [];
  let riskLevel = "low";

  const category = config.categories.find((c) => c.id === ticket.category);
  if (category?.priority === "urgent") {
    risks.push(t(language, "case_brief.risks.high_priority_category"));
    riskLevel = "high";
  }

  if (ticket.priority === "urgent") {
    risks.push(t(language, "case_brief.risks.urgent_priority"));
    riskLevel = "high";
  } else if (ticket.priority === "high" && riskLevel !== "high") {
    riskLevel = "medium";
  }

  const ageMinutes = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
  const slaMinutes = Number(guildSettings?.sla_minutes || 0);

  if (slaMinutes > 0 && ageMinutes > slaMinutes && !ticket.first_staff_response) {
    risks.push(t(language, "case_brief.risks.outside_sla"));
    riskLevel = "high";
  }

  if (ticket.reopen_count > 2) {
    risks.push(t(language, "case_brief.risks.reopened_times", { count: ticket.reopen_count }));
    if (riskLevel === "low") riskLevel = "medium";
  }

  if (ticket.message_count > 50) {
    risks.push(t(language, "case_brief.risks.extensive_conversation"));
    if (riskLevel === "low") riskLevel = "medium";
  }

  if (!ticket.claimed_by && !ticket.assigned_to && ageMinutes > 30) {
    risks.push(t(language, "case_brief.risks.unassigned_30min"));
    if (riskLevel === "low") riskLevel = "medium";
  }

  return { risks, riskLevel };
}

function determineNextAction(ticket, guildSettings, language = "es") {
  if (ticket.status === "closed") {
    return t(language, "case_brief.actions.closed_no_action");
  }

  if (!ticket.first_staff_response) {
    return t(language, "case_brief.actions.urgent_first_response");
  }

  if (!ticket.claimed_by && !ticket.assigned_to) {
    return t(language, "case_brief.actions.claim_or_assign");
  }

  const ageMinutes = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
  const slaMinutes = Number(guildSettings?.sla_minutes || 0);

  if (slaMinutes > 0 && ageMinutes > slaMinutes * 0.8) {
    return t(language, "case_brief.actions.near_sla_limit");
  }

  if (ticket.priority === "urgent") {
    return t(language, "case_brief.actions.urgent_priority_resolve");
  }

  if (ticket.reopen_count > 0) {
    return t(language, "case_brief.actions.review_reopen");
  }

  return t(language, "case_brief.actions.continue_normal");
}

function buildOperationalContext(ticket, guildSettings, language = "es") {
  const context = [];

  const category = config.categories.find((c) => c.id === ticket.category);
  if (category) {
    context.push(`**${t(language, "case_brief.context_labels.type")}**: ${category.label}`);
  }

  const ageMinutes = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
  const ageHours = Math.floor(ageMinutes / 60);
  const ageDisplay = ageHours > 0 ? `${ageHours}h ${ageMinutes % 60}m` : `${ageMinutes}m`;
  context.push(`**${t(language, "case_brief.context_labels.age")}**: ${ageDisplay}`);

  if (ticket.first_staff_response) {
    const responseTime = Math.floor((new Date(ticket.first_staff_response).getTime() - new Date(ticket.created_at).getTime()) / 60000);
    context.push(`**${t(language, "case_brief.context_labels.first_response")}**: ${responseTime}m`);
  } else {
    context.push(`**${t(language, "case_brief.context_labels.first_response")}**: ${t(language, "case_brief.context_labels.pending")}`);
  }

  if (ticket.claimed_by) {
    context.push(`**${t(language, "case_brief.context_labels.responsible")}**: <@${ticket.claimed_by}>`);
  } else if (ticket.assigned_to) {
    context.push(`**${t(language, "case_brief.context_labels.assigned")}**: <@${ticket.assigned_to}>`);
  } else {
    context.push(`**${t(language, "case_brief.context_labels.responsible")}**: ${t(language, "case_brief.context_labels.unassigned")}`);
  }

  context.push(`**${t(language, "case_brief.context_labels.messages")}**: ${ticket.message_count}`);

  if (ticket.reopen_count > 0) {
    context.push(`**${t(language, "case_brief.context_labels.reopenings")}**: ${ticket.reopen_count}`);
  }

  return context.join("\n");
}

function buildRecommendation(ticket, guildSettings, riskAssessment, language = "es") {
  const recommendations = [];

  if (!ticket.first_staff_response) {
    recommendations.push(t(language, "case_brief.recommendations_list.respond_immediately"));
  }

  if (!ticket.claimed_by && !ticket.assigned_to) {
    recommendations.push(t(language, "case_brief.recommendations_list.use_claim"));
  }

  if (ticket.priority === "low" || ticket.priority === "normal") {
    const category = config.categories.find((c) => c.id === ticket.category);
    if (category?.priority === "urgent" || category?.priority === "high") {
      recommendations.push(t(language, "case_brief.recommendations_list.consider_priority"));
    }
  }

  if (riskAssessment.riskLevel === "high") {
    recommendations.push(t(language, "case_brief.recommendations_list.escalate"));
  }

  if (ticket.reopen_count > 1) {
    recommendations.push(t(language, "case_brief.recommendations_list.review_history"));
    recommendations.push(t(language, "case_brief.recommendations_list.document_resolution"));
  }

  const ageMinutes = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
  if (ageMinutes > 120 && ticket.message_count < 3) {
    recommendations.push(t(language, "case_brief.recommendations_list.verify_user"));
  }

  if (recommendations.length === 0) {
    recommendations.push(t(language, "case_brief.recommendations_list.continue_normal"));
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

async function generateCaseBrief(ticket, guildSettings, language = "es", isPro = true) {
  const riskAssessment = assessTicketRisk(ticket, guildSettings, language);
  const context = buildOperationalContext(ticket, guildSettings, language);

  if (!isPro) {
    const embed = new EmbedBuilder()
      .setTitle(t(language, "case_brief.title", { ticketId: ticket.ticket_id }))
      .setColor(0x5865F2)
      .setDescription(`**${t(language, "case_brief.status")}**: ${ticket.status === "open" ? t(language, "case_brief.open") : t(language, "case_brief.closed")}`)
      .addFields(
        {
          name: `📊 ${t(language, "case_brief.operational_context")}`,
          value: context,
          inline: false,
        },
        {
          name: `🔒 ${t(language, "case_brief.pro_unlock_title")}`,
          value: t(language, "case_brief.pro_unlock_description"),
          inline: false,
        }
      )
      .setFooter({ text: t(language, "case_brief.footer") })
      .setTimestamp();

    return embed;
  }

  const nextAction = determineNextAction(ticket, guildSettings, language);
  const recommendation = buildRecommendation(ticket, guildSettings, riskAssessment, language);

  const embed = new EmbedBuilder()
    .setTitle(t(language, "case_brief.title", { ticketId: ticket.ticket_id }))
    .setColor(getRiskColor(riskAssessment.riskLevel))
    .setDescription(`**${t(language, "case_brief.status")}**: ${ticket.status === "open" ? t(language, "case_brief.open") : t(language, "case_brief.closed")}`)
    .addFields(
      {
        name: `${getRiskEmoji(riskAssessment.riskLevel)} ${t(language, "case_brief.risk_level")}`,
        value: riskAssessment.risks.length > 0
          ? `**${riskAssessment.riskLevel.toUpperCase()}**\n${riskAssessment.risks.map(r => `• ${r}`).join("\n")}`
          : `**${riskAssessment.riskLevel.toUpperCase()}** - ${t(language, "case_brief.no_risk_factors")}`,
        inline: false,
      },
      {
        name: `🎯 ${t(language, "case_brief.next_action")}`,
        value: nextAction,
        inline: false,
      },
      {
        name: `📊 ${t(language, "case_brief.operational_context")}`,
        value: context,
        inline: false,
      },
      {
        name: `💡 ${t(language, "case_brief.recommendations")}`,
        value: recommendation,
        inline: false,
      }
    )
    .setFooter({ text: t(language, "case_brief.footer") })
    .setTimestamp();

  return embed;
}

async function generateCaseBriefForChannel(channelId, guildId, isPro = true) {
  const ticket = await tickets.get(channelId);
  if (!ticket) {
    return null;
  }

  const guildSettings = await settings.get(guildId);
  return generateCaseBrief(ticket, guildSettings, "es", isPro);
}

module.exports = {
  generateCaseBrief,
  generateCaseBriefForChannel,
  assessTicketRisk,
  determineNextAction,
  buildOperationalContext,
  buildRecommendation,
};
