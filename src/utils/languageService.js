const { PermissionFlagsBits } = require("discord.js");
const { settings, auditLogs } = require("./database");
const { clearGuildSettingsCache } = require("./accessControl");
const { normalizeLanguage, t } = require("./i18n");
const { logStructured } = require("./observability");

function getLanguageLabel(language, targetLanguage = language) {
  const normalized = normalizeLanguage(language, "en");
  return t(targetLanguage, `common.language.${normalized}`);
}

function buildLanguageUpdatePatch(language, actorId, options = {}) {
  const now = options.selectedAt instanceof Date ? options.selectedAt : new Date();
  return {
    bot_language: normalizeLanguage(language, "en"),
    language_selected_at: now,
    language_selected_by: actorId ? String(actorId) : null,
    language_onboarding_completed: options.onboardingCompleted === true,
  };
}

async function setGuildLanguage(guildId, language, actorId, options = {}) {
  const normalized = normalizeLanguage(language, "en");
  const patch = buildLanguageUpdatePatch(normalized, actorId, {
    selectedAt: options.selectedAt,
    onboardingCompleted: options.onboardingCompleted === true,
  });

  const updated = await settings.update(guildId, patch, options.updateOptions || {});
  clearGuildSettingsCache(guildId);

  if (updated) {
    logStructured("info", "language.changed", {
      guildId,
      language: normalized,
      actorId: actorId || null,
      onboardingCompleted: patch.language_onboarding_completed,
      source: options.source || "manual",
    });

    if (options.skipAudit !== true) {
      await auditLogs.add({
        guild_id: guildId,
        actor_id: actorId || null,
        kind: "configuration",
        action: "guild_language_updated",
        status: "ok",
        source: options.source || "language.service",
        metadata: {
          language: normalized,
          onboarding_completed: patch.language_onboarding_completed,
          reason: options.reason || null,
        },
      }).catch(() => {});
    }
  }

  return updated;
}

function canManageGuildLanguage(member, guild) {
  if (!member) return false;
  if (member.permissions?.has?.(PermissionFlagsBits.Administrator)) return true;
  if (guild?.ownerId && member.id === guild.ownerId) return true;
  return false;
}

module.exports = {
  getLanguageLabel,
  buildLanguageUpdatePatch,
  setGuildLanguage,
  canManageGuildLanguage,
};
