"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { t } = require("../../../utils/i18n");
const { withInlineDescriptionLocalizations } = require("../../../utils/slashLocalizations");
const {
  isPremiumStatusUnavailable,
  resolveGuildPremiumStatus,
} = require("../../../utils/premiumStatus");
const logger = require("../../../utils/structuredLogger");

function toDiscordDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return `<t:${Math.floor(parsed.getTime() / 1000)}:D>`;
}

const data = withInlineDescriptionLocalizations(
  new SlashCommandBuilder()
    .setName("premium")
    .setDescription(t("en", "premium.slash.description"))
    .addSubcommand((subcommand) =>
      withInlineDescriptionLocalizations(
        subcommand
          .setName("status")
          .setDescription(t("en", "premium.slash.status")),
        t("en", "premium.slash.status"),
        t("es", "premium.slash.status")
      )
    ),
  t("en", "premium.slash.description"),
  t("es", "premium.slash.description")
);

module.exports = {
  data,
  meta: {
    category: "utility",
    scope: "public",
  },

  async execute(interaction) {
    const language = interaction.guild?.preferredLocale?.startsWith("es") ? "es" : "en";
    const guildId = interaction.guildId;

    if (!guildId) {
      return interaction.reply({
        content: t(language, "premium.guild_only"),
        flags: 64,
      });
    }

    const isOwner = interaction.user.id === interaction.guild.ownerId;
    if (!isOwner) {
      return interaction.reply({
        content: t(language, "premium.owner_only"),
        flags: 64,
      });
    }

    await interaction.deferReply({ flags: 64 });

    try {
      const status = await resolveGuildPremiumStatus(guildId);

      if (isPremiumStatusUnavailable(status)) {
        logger.error('premium', `Unable to resolve premium status for guild ${guildId}`, {
          error: status.error || status.meta?.errorCode || "unknown_error"
        });
        return interaction.editReply({
          content: t(language, "premium.error_fetching"),
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(t(language, "premium.status_title"))
        .setTimestamp();

      if (status.isPro) {
        const daysUntil = status.daysUntil;
        let color = 0x57f287;
        let urgencyText = "";

        if (daysUntil !== null) {
          if (daysUntil <= 1) {
            color = 0xed4245;
            urgencyText = t(language, "premium.expires_tomorrow");
          } else if (daysUntil <= 3) {
            color = 0xfee75c;
            urgencyText = t(language, "premium.expires_soon", { days: daysUntil });
          } else if (daysUntil <= 7) {
            color = 0xfee75c;
            urgencyText = t(language, "premium.expires_week", { days: daysUntil });
          } else {
            urgencyText = t(language, "premium.expires_in", { days: daysUntil });
          }
        }

        const premiumFields = [
          {
            name: t(language, "premium.plan_label"),
            value: status.tierLabel || "PRO",
            inline: true,
          },
          {
            name: t(language, "premium.status_label"),
            value: t(language, "premium.active"),
            inline: true,
          },
        ];

        if (urgencyText) {
          premiumFields.push({
            name: t(language, "premium.time_remaining"),
            value: urgencyText,
            inline: true,
          });
        }

        embed
          .setColor(color)
          .setDescription(t(language, "premium.pro_active"))
          .addFields(...premiumFields);

        const startedAt = toDiscordDate(status.planStartedAt);
        if (startedAt) {
          embed.addFields({
            name: t(language, "premium.started_at"),
            value: startedAt,
            inline: true,
          });
        }

        const expiresAt = toDiscordDate(status.planExpiresAt);
        if (expiresAt) {
          embed.addFields({
            name: t(language, "premium.expires_at"),
            value: expiresAt,
            inline: true,
          });
        }

        if (status.planSource) {
          embed.addFields({
            name: t(language, "premium.source_label"),
            value: status.planSource,
            inline: true,
          });
        }

        if (status.supporterActive) {
          embed.addFields({
            name: t(language, "premium.supporter_status"),
            value: t(language, "premium.supporter_active"),
            inline: false,
          });
        }
      } else {
        embed
          .setColor(0x99aab5)
          .setDescription(t(language, "premium.free_plan"))
          .addFields(
            {
              name: t(language, "premium.plan_label"),
              value: "FREE",
              inline: true,
            },
            {
              name: t(language, "premium.status_label"),
              value: t(language, "premium.active"),
              inline: true,
            }
          );

        const upgradeUrl = status.upgradeUrl;
        if (upgradeUrl) {
          embed.addFields({
            name: t(language, "premium.upgrade_label"),
            value: `[${t(language, "premium.upgrade_cta")}](${upgradeUrl})`,
            inline: false,
          });
        }
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error('premium', `Error executing /premium status for guild ${guildId}`, { error: error?.message || String(error) });
      await interaction.editReply({
        content: t(language, "premium.error_generic"),
      });
    }
  },
};
