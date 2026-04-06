"use strict";

const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { requireSupportServer } = require("../../utils/supportServerOnly");
const { resolveGuildLanguage, t } = require("../../utils/i18n");
const { withInlineDescriptionLocalizations } = require("../../utils/slashLocalizations");
const { createCode, listCodes, getStats } = require("../../utils/database/proRedeemCodes");
const { generateCodes, resolveDuration } = require("../../utils/proCodeService");

const DURATION_CHOICES = [
  { name: "30 días", value: "30d" },
  { name: "90 días", value: "90d" },
  { name: "180 días", value: "180d" },
  { name: "1 año", value: "1y" },
  { name: "Lifetime", value: "lifetime" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("proadmin")
    .setDescription(t("en", "proadmin.slash.description"))
    .setDescriptionLocalizations({
      "es-ES": t("es", "proadmin.slash.description"),
      "es-419": t("es", "proadmin.slash.description"),
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      withInlineDescriptionLocalizations(
        sub
          .setName("generate")
          .setDescription(t("en", "proadmin.slash.generate_description"))
          .addIntegerOption((opt) =>
            withInlineDescriptionLocalizations(
              opt
                .setName("count")
                .setDescription(t("en", "proadmin.slash.count_option"))
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(20),
              t("en", "proadmin.slash.count_option"),
              t("es", "proadmin.slash.count_option")
            )
          )
          .addStringOption((opt) =>
            withInlineDescriptionLocalizations(
              opt
                .setName("duration")
                .setDescription(t("en", "proadmin.slash.duration_option"))
                .setRequired(true)
                .addChoices(...DURATION_CHOICES),
              t("en", "proadmin.slash.duration_option"),
              t("es", "proadmin.slash.duration_option")
            )
          )
          .addUserOption((opt) =>
            withInlineDescriptionLocalizations(
              opt
                .setName("for_user")
                .setDescription(t("en", "proadmin.slash.for_user_option"))
                .setRequired(false),
              t("en", "proadmin.slash.for_user_option"),
              t("es", "proadmin.slash.for_user_option")
            )
          )
          .addStringOption((opt) =>
            withInlineDescriptionLocalizations(
              opt
                .setName("notes")
                .setDescription(t("en", "proadmin.slash.notes_option"))
                .setRequired(false)
                .setMaxLength(200),
              t("en", "proadmin.slash.notes_option"),
              t("es", "proadmin.slash.notes_option")
            )
          ),
        t("en", "proadmin.slash.generate_description"),
        t("es", "proadmin.slash.generate_description")
      )
    )
    .addSubcommand((sub) =>
      withInlineDescriptionLocalizations(
        sub.setName("list").setDescription(t("en", "proadmin.slash.list_description")),
        t("en", "proadmin.slash.list_description"),
        t("es", "proadmin.slash.list_description")
      )
    )
    .addSubcommand((sub) =>
      withInlineDescriptionLocalizations(
        sub.setName("stats").setDescription(t("en", "proadmin.slash.stats_description")),
        t("en", "proadmin.slash.stats_description"),
        t("es", "proadmin.slash.stats_description")
      )
    ),

  async execute(interaction) {
    // Restringir al servidor de soporte
    const isAllowed = await requireSupportServer(interaction);
    if (!isAllowed) return;

    const language = resolveGuildLanguage(interaction);
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "generate") {
      return this.handleGenerate(interaction, language);
    }

    if (subcommand === "list") {
      return this.handleList(interaction, language);
    }

    if (subcommand === "stats") {
      return this.handleStats(interaction, language);
    }
  },

  async handleGenerate(interaction, language) {
    const count = interaction.options.getInteger("count");
    const durationStr = interaction.options.getString("duration");
    const forUser = interaction.options.getUser("for_user");
    const notes = interaction.options.getString("notes");

    await interaction.deferReply({ flags: 64 });

    try {
      // Generar códigos
      const codes = generateCodes(count);
      const durationDays = resolveDuration(durationStr);

      // Calcular expiración del código (no del plan)
      // Los códigos expiran en 30 días si no se usan
      const codeExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Guardar códigos en DB
      const createdCodes = [];
      for (const code of codes) {
        const codeData = await createCode({
          code,
          plan: "pro",
          duration_days: durationDays,
          created_by: interaction.user.id,
          expires_at: codeExpiresAt,
          notes: notes || (forUser ? `Generado para ${forUser.tag}` : null),
          source: forUser ? "assigned" : "manual",
        });
        createdCodes.push(codeData);
      }

      // Construir mensaje de respuesta
      const isLifetime = durationDays === null;
      const durationText = isLifetime
        ? t(language, "proadmin.lifetime")
        : t(language, "proadmin.days", { days: durationDays });

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle(t(language, "proadmin.generate_success_title", { count }))
        .setDescription(
          t(language, "proadmin.generate_success_description", {
            duration: durationText,
          })
        )
        .addFields({
          name: t(language, "proadmin.codes_label"),
          value: codes.map((c) => `\`${c}\``).join("\n"),
          inline: false,
        });

      if (forUser) {
        embed.addFields({
          name: t(language, "proadmin.assigned_to"),
          value: `<@${forUser.id}> (${forUser.tag})`,
          inline: true,
        });
      }

      embed.addFields(
        {
          name: t(language, "proadmin.valid_until"),
          value: `<t:${Math.floor(codeExpiresAt.getTime() / 1000)}:D>`,
          inline: true,
        },
        {
          name: t(language, "proadmin.generated_by"),
          value: `<@${interaction.user.id}>`,
          inline: true,
        }
      );

      embed.setTimestamp();

      // Si hay un usuario específico, enviarle DM con el código
      if (forUser && count === 1) {
        try {
          const userEmbed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setTitle(t(language, "proadmin.dm_title"))
            .setDescription(
              t(language, "proadmin.dm_description", {
                code: codes[0],
                duration: durationText,
              })
            )
            .addFields({
              name: t(language, "proadmin.how_to_redeem"),
              value: t(language, "proadmin.redeem_instructions"),
            })
            .setFooter({ text: t(language, "proadmin.dm_footer") })
            .setTimestamp();

          await forUser.send({ embeds: [userEmbed] });

          embed.addFields({
            name: t(language, "proadmin.dm_sent"),
            value: t(language, "common.yes"),
            inline: true,
          });
        } catch (error) {
          embed.addFields({
            name: t(language, "proadmin.dm_sent"),
            value: t(language, "proadmin.dm_failed"),
            inline: true,
          });
        }
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("[PROADMIN GENERATE] Error:", error);

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle(t(language, "proadmin.error_title"))
        .setDescription(t(language, "proadmin.generate_error"))
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  },

  async handleList(interaction, language) {
    await interaction.deferReply({ flags: 64 });

    try {
      const availableCodes = await listCodes({ redeemed: false }, { limit: 25 });
      const redeemedCodes = await listCodes({ redeemed: true }, { limit: 10 });

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(t(language, "proadmin.list_title"))
        .setTimestamp();

      if (availableCodes.length > 0) {
        const availableText = availableCodes
          .slice(0, 10)
          .map((c) => {
            const duration = c.duration_days === null ? "Lifetime" : `${c.duration_days}d`;
            return `\`${c.code}\` - ${duration}`;
          })
          .join("\n");

        embed.addFields({
          name: t(language, "proadmin.available_codes", { count: availableCodes.length }),
          value: availableText || t(language, "proadmin.none"),
          inline: false,
        });
      } else {
        embed.addFields({
          name: t(language, "proadmin.available_codes", { count: 0 }),
          value: t(language, "proadmin.no_codes"),
          inline: false,
        });
      }

      if (redeemedCodes.length > 0) {
        const redeemedText = redeemedCodes
          .map((c) => {
            const duration = c.duration_days === null ? "Lifetime" : `${c.duration_days}d`;
            return `\`${c.code}\` - ${duration} - <@${c.redeemed_by}>`;
          })
          .join("\n");

        embed.addFields({
          name: t(language, "proadmin.redeemed_codes", { count: redeemedCodes.length }),
          value: redeemedText,
          inline: false,
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("[PROADMIN LIST] Error:", error);

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle(t(language, "proadmin.error_title"))
        .setDescription(t(language, "proadmin.list_error"))
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  },

  async handleStats(interaction, language) {
    await interaction.deferReply({ flags: 64 });

    try {
      const stats = await getStats();

      const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setTitle(t(language, "proadmin.stats_title"))
        .addFields(
          {
            name: t(language, "proadmin.total_codes"),
            value: String(stats.total),
            inline: true,
          },
          {
            name: t(language, "proadmin.available_codes_stat"),
            value: String(stats.available),
            inline: true,
          },
          {
            name: t(language, "proadmin.redeemed_codes_stat"),
            value: String(stats.redeemed),
            inline: true,
          },
          {
            name: t(language, "proadmin.expired_codes"),
            value: String(stats.expired),
            inline: true,
          }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("[PROADMIN STATS] Error:", error);

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle(t(language, "proadmin.error_title"))
        .setDescription(t(language, "proadmin.stats_error"))
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
