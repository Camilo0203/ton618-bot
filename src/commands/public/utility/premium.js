"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getMembershipStatus } = require("../../../utils/membershipReminders");
const { t } = require("../../../utils/i18n");

const data = new SlashCommandBuilder()
  .setName("premium")
  .setDescription("Ver el estado de tu membresía premium")
  .addSubcommand(subcommand =>
    subcommand
      .setName("status")
      .setDescription("Ver cuánto tiempo te queda de membresía premium")
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
    
    // Solo funciona en guilds
    if (!guildId) {
      return interaction.reply({
        content: t(language, "premium.guild_only"),
        flags: 64
      });
    }

    // Verificar si es owner
    const isOwner = interaction.user.id === interaction.guild.ownerId;
    if (!isOwner) {
      return interaction.reply({
        content: t(language, "premium.owner_only"),
        flags: 64
      });
    }

    await interaction.deferReply({ flags: 64 });

    try {
      const status = await getMembershipStatus(guildId);

      if (status.error) {
        return interaction.editReply({
          content: t(language, "premium.error_fetching")
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(t(language, "premium.status_title"))
        .setTimestamp();

      if (status.isPro) {
        const daysUntil = status.daysUntil;
        let color = 0x57f287; // Verde
        let urgencyText = "";

        if (daysUntil !== null) {
          if (daysUntil <= 1) {
            color = 0xed4245; // Rojo
            urgencyText = t(language, "premium.expires_tomorrow");
          } else if (daysUntil <= 3) {
            color = 0xfee75c; // Amarillo
            urgencyText = t(language, "premium.expires_soon", { days: daysUntil });
          } else if (daysUntil <= 7) {
            color = 0xfee75c;
            urgencyText = t(language, "premium.expires_week", { days: daysUntil });
          } else {
            urgencyText = t(language, "premium.expires_in", { days: daysUntil });
          }
        }

        embed
          .setColor(color)
          .setDescription(t(language, "premium.pro_active"))
          .addFields(
            { 
              name: t(language, "premium.plan_label"), 
              value: "PRO", 
              inline: true 
            },
            { 
              name: t(language, "premium.status_label"), 
              value: t(language, "premium.active"), 
              inline: true 
            },
            { 
              name: t(language, "premium.time_remaining"), 
              value: urgencyText, 
              inline: true 
            }
          );

        if (status.planStartedAt) {
          embed.addFields({
            name: t(language, "premium.started_at"),
            value: `<t:${Math.floor(new Date(status.planStartedAt).getTime() / 1000)}:D>`,
            inline: true
          });
        }

        if (status.planExpiresAt) {
          embed.addFields({
            name: t(language, "premium.expires_at"),
            value: `<t:${Math.floor(new Date(status.planExpiresAt).getTime() / 1000)}:D>`,
            inline: true
          });
        }

        if (status.planSource) {
          embed.addFields({
            name: t(language, "premium.source_label"),
            value: status.planSource,
            inline: true
          });
        }

        // Si es supporter también
        if (status.supporterActive) {
          embed.addFields({
            name: t(language, "premium.supporter_status"),
            value: t(language, "premium.supporter_active"),
            inline: false
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
              inline: true 
            },
            { 
              name: t(language, "premium.status_label"), 
              value: t(language, "premium.active"), 
              inline: true 
            }
          );
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("[PREMIUM COMMAND] Error:", error);
      await interaction.editReply({
        content: t(language, "premium.error_generic")
      });
    }
  }
};
