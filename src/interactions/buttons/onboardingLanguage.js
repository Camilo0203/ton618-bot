const { EmbedBuilder } = require("discord.js");
const { settings } = require("../../utils/database");
const E = require("../../utils/embeds");
const {
  ONBOARDING_CUSTOM_ID_PREFIX,
} = require("../../utils/guildOnboarding");
const {
  setGuildLanguage,
  getLanguageLabel,
  canManageGuildLanguage,
} = require("../../utils/languageService");
const { t } = require("../../utils/i18n");

function parseCustomId(customId) {
  const [, guildId, language] = String(customId || "").split(":");
  return { guildId, language };
}

module.exports = {
  customId: `${ONBOARDING_CUSTOM_ID_PREFIX}:*`,

  async execute(interaction) {
    const { guildId, language } = parseCustomId(interaction.customId);
    const selectedLanguage = language === "es" ? "es" : language === "en" ? "en" : null;

    if (!guildId || !selectedLanguage) {
      return interaction.reply({
        embeds: [E.errorEmbed(t("en", "errors.invalid_language_selection"))],
        flags: 64,
      }).catch((err) => { console.error("[onboardingLanguage] suppressed error:", err?.message || err); });
    }

    const guild = interaction.guild || interaction.client.guilds.cache.get(guildId) || null;
    const currentSettings = await settings.get(guildId);

    if (guild && interaction.guild && !canManageGuildLanguage(interaction.member, guild)) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(selectedLanguage, "errors.language_permission"))],
        flags: 64,
      }).catch((err) => { console.error("[onboardingLanguage] suppressed error:", err?.message || err); });
    }

    const updated = await setGuildLanguage(guildId, selectedLanguage, interaction.user.id, {
      onboardingCompleted: true,
      source: "onboarding.button",
      reason: t(selectedLanguage, "setup.language.audit_reason_onboarding"),
    });

    if (!updated) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(selectedLanguage, "errors.language_save_failed"))],
        flags: 64,
      }).catch((err) => { console.error("[onboardingLanguage] suppressed error:", err?.message || err); });
    }

    const label = getLanguageLabel(selectedLanguage, selectedLanguage);
    const embed = new EmbedBuilder()
      .setColor(E.Colors.SUCCESS)
      .setTitle(t(selectedLanguage, "onboarding.confirm_title"))
      .setDescription(
        `${t(selectedLanguage, "onboarding.confirm_description", { label })}\n\n` +
        t(selectedLanguage, "common.setup_hint.run_setup")
      )
      .setTimestamp();

    if (interaction.deferred || interaction.replied) {
      return interaction.followUp({
        embeds: [embed],
        flags: 64,
      }).catch((err) => { console.error("[onboardingLanguage] suppressed error:", err?.message || err); });
    }

    return interaction.update({
      embeds: [embed],
      components: [],
    }).catch((err) => {
      console.error("[onboardingLanguage] suppressed error:", err?.message || err);
      return interaction.reply({
        embeds: [embed],
        flags: 64,
      }).catch((err) => { console.error("[onboardingLanguage] suppressed error:", err?.message || err); });
    });
  },
};
