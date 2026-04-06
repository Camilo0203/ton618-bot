"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { t } = require("../../../utils/i18n");
const { withInlineDescriptionLocalizations } = require("../../../utils/slashLocalizations");
const { processRedemption, isGuildOwner } = require("../../../utils/proCodeService");
const { validateCode } = require("../../../utils/database/proRedeemCodes");

const data = withInlineDescriptionLocalizations(
  new SlashCommandBuilder()
    .setName("pro")
    .setDescription(t("en", "premium.slash.description"))
    .addSubcommand((subcommand) =>
      withInlineDescriptionLocalizations(
        subcommand
          .setName("redeem")
          .setDescription(t("en", "premium.slash.redeem_description"))
          .addStringOption((option) =>
            withInlineDescriptionLocalizations(
              option
                .setName("code")
                .setDescription(t("en", "premium.slash.code_option"))
                .setRequired(true)
                .setMinLength(8)
                .setMaxLength(20),
              t("en", "premium.slash.code_option"),
              t("es", "premium.slash.code_option")
            )
          ),
        t("en", "premium.slash.redeem_description"),
        t("es", "premium.slash.redeem_description")
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
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "redeem") {
      return this.handleRedeem(interaction, language);
    }
  },

  async handleRedeem(interaction, language) {
    const code = interaction.options.getString("code");
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    // Validar que esté en un servidor
    if (!guildId) {
      return interaction.reply({
        content: t(language, "pro.redeem.guild_only"),
        flags: 64,
      });
    }

    // Validar que sea owner del servidor
    if (!isGuildOwner(userId, interaction.guild)) {
      return interaction.reply({
        content: t(language, "pro.redeem.owner_only"),
        flags: 64,
      });
    }

    await interaction.deferReply({ flags: 64 });

    try {
      // Validar el código antes de procesar
      const validation = await validateCode(code);

      if (!validation.valid) {
        const errorKey = validation.reason === "not_found" 
          ? "pro.redeem.code_not_found"
          : validation.reason === "already_redeemed"
          ? "pro.redeem.code_used"
          : validation.reason === "expired"
          ? "pro.redeem.code_expired"
          : "pro.redeem.invalid_code";

        const embed = new EmbedBuilder()
          .setColor(0xED4245)
          .setTitle(t(language, "pro.redeem.error_title"))
          .setDescription(t(language, errorKey))
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }

      // Procesar el canje con asignación de rol automática
      const result = await processRedemption(code, userId, guildId, interaction.client);

      if (!result.success) {
        const embed = new EmbedBuilder()
          .setColor(0xED4245)
          .setTitle(t(language, "pro.redeem.error_title"))
          .setDescription(t(language, "pro.redeem.processing_error"))
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }

      // Éxito - construir mensaje
      const { redemption, activation } = result;
      const isLifetime = redemption.duration_days === null;
      const isExtension = activation.isExtension;

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle(t(language, "pro.redeem.success_title"));

      let description = t(language, "pro.redeem.success_description", {
        code: redemption.code,
        plan: redemption.plan.toUpperCase(),
      });

      if (isLifetime) {
        description += "\n\n" + t(language, "pro.redeem.lifetime_access");
      } else if (activation.planExpiresAt) {
        const expiresTimestamp = Math.floor(activation.planExpiresAt.getTime() / 1000);
        description += "\n\n" + t(language, "pro.redeem.expires_at", {
          date: `<t:${expiresTimestamp}:D>`,
        });

        if (isExtension) {
          description += "\n" + t(language, "pro.redeem.extended");
        }
      }

      embed.setDescription(description);

      // Agregar campo con duración
      embed.addFields({
        name: t(language, "pro.redeem.duration_label"),
        value: isLifetime 
          ? t(language, "pro.redeem.lifetime")
          : t(language, "pro.redeem.days", { days: redemption.duration_days }),
        inline: true,
      });

      // Agregar campo con servidor
      embed.addFields({
        name: t(language, "pro.redeem.server_label"),
        value: interaction.guild.name,
        inline: true,
      });

      embed.setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("[PRO REDEEM COMMAND] Error:", error);

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle(t(language, "pro.redeem.error_title"))
        .setDescription(t(language, "pro.redeem.generic_error"))
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
