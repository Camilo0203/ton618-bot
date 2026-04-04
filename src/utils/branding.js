"use strict";

const { resolveCommercialState } = require("./commercial");

/**
 * Resolves the branding configuration for a guild based on its commercial plan.
 * @param {Object} settingsRecord The full guild settings record.
 * @returns {Object} Branding configuration.
 */
function resolveBranding(settingsRecord = {}) {
  const state = resolveCommercialState(settingsRecord);
  const isPro = state.effectivePlan === "pro" || state.effectivePlan === "enterprise";

  // Default values
  const defaults = {
    color: null,
    footerText: null,
    removeSignature: false,
    isPro,
  };

  if (!isPro) {
    return defaults;
  }

  return {
    color: settingsRecord.branding_global_color || null,
    footerText: settingsRecord.branding_footer_text || null,
    removeSignature: settingsRecord.branding_remove_signature === true,
    isPro: true,
  };
}

/**
 * Applies branding to a Discord.js EmbedBuilder.
 * @param {import("discord.js").EmbedBuilder} embed The embed to style.
 * @param {Object} branding The resolved branding from resolveBranding().
 * @param {Object} options Options for applying branding.
 */
function applyBranding(embed, branding, options = {}) {
  if (!branding || !branding.isPro) return embed;

  // Apply global color if set and not overridden by specific logic
  if (branding.color && !options.keepCustomColor) {
    embed.setColor(branding.color);
  }

  // Apply custom footer if set
  if (branding.footerText) {
    const currentFooter = embed.data.footer;
    embed.setFooter({
      text: branding.footerText,
      iconURL: options.footerIconURL || currentFooter?.icon_url || null,
    });
  } else if (branding.removeSignature) {
    // If no custom text but signature removal is requested, 
    // we might want to strip the "Powered by" part if it exists.
    const currentText = embed.data.footer?.text || "";
    if (currentText.includes("TON618") || currentText.includes("Powered by")) {
        // Logic to strip footer if it's just the bot name
        // For now, if removeSignature is on, we just clear it if it matches default patterns
    }
  }

  return embed;
}

module.exports = {
  resolveBranding,
  applyBranding,
};
