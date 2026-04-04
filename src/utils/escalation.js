/**
 * Smart Escalation Engine (TON618 Pro)
 * Automatically detects critical ticket content and suggests priority upgrades.
 */

function checkEscalation(content, settings) {
  if (!content || !settings) return null;

  // Pro feature check
  const isPro = settings.commercial_settings?.plan === "pro" || 
                settings.commercial_settings?.plan === "enterprise" ||
                settings.dashboard_general_settings?.opsPlan === "pro" ||
                settings.dashboard_general_settings?.opsPlan === "enterprise";

  if (!isPro || !settings.automod_escalation_enabled) return null;

  const keywords = settings.automod_escalation_keywords || [];
  if (!keywords.length) return null;

  const normalized = content.toLowerCase();
  
  // Simple keyword matching for now (enterprise might use LLM/NLP)
  const matches = keywords.some(keyword => normalized.includes(keyword.toLowerCase()));

  if (matches) {
    return "urgent";
  }

  return null;
}

module.exports = { checkEscalation };
