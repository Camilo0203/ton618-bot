"use strict";

/**
 * Health Check Command
 * Comprehensive diagnostics for bot status
 */

const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { getBuildInfo } = require("../../utils/buildInfo");
const { createHealthState, isProcessHealthy, formatMemoryUsage } = require("../../utils/runtimeHealth");
const { settings } = require("../../utils/database");
const { GiveawayHandler } = require("../../handlers/giveawayHandler");
const { StatsHandler } = require("../../handlers/statsHandler");
const logger = require("../../utils/structuredLogger");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");
const { version: discordJsVersion } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("health")
    .setDescription("Verificar estado y diagnóstico del bot")
    .setDescriptionLocalizations({
      "es-ES": "Verificar estado y diagnóstico del bot",
      "en-US": "Check bot status and diagnostics",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  meta: {
    category: "admin",
    scope: "admin",
    ownerOnly: true,
  },

  async execute(interaction) {
    const language = resolveInteractionLanguage(interaction);
    await interaction.deferReply({ flags: 64 });

    const startTime = Date.now();
    const diagnostics = {
      checks: [],
      warnings: [],
      errors: [],
    };

    // Check 1: Database Connection
    try {
      const dbSettings = await settings.get(interaction.guildId);
      diagnostics.checks.push({
        name: t(language, "health.checks.database"),
        status: "✅",
        detail: dbSettings ? t(language, "health.connected") : t(language, "health.no_data"),
      });
    } catch (error) {
      diagnostics.errors.push(t(language, "health.errors.database", { error: error?.message }));
      diagnostics.checks.push({
        name: t(language, "health.checks.database"),
        status: "❌",
        detail: error?.message || t(language, "health.unknown_error"),
      });
    }

    // Check 2: Bot Permissions
    const botMember = interaction.guild?.members?.me;
    if (botMember) {
      const requiredPermissions = [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.ViewAuditLog,
      ];

      const missingPermissions = requiredPermissions.filter(
        (perm) => !botMember.permissions.has(perm)
      );

      if (missingPermissions.length === 0) {
        diagnostics.checks.push({
          name: t(language, "health.checks.permissions"),
          status: "✅",
          detail: t(language, "health.all_permissions"),
        });
      } else {
        diagnostics.warnings.push(
          t(language, "health.warnings.missing_permissions", {
            count: missingPermissions.length,
          })
        );
        diagnostics.checks.push({
          name: t(language, "health.checks.permissions"),
          status: "⚠️",
          detail: t(language, "health.missing_count", { count: missingPermissions.length }),
        });
      }
    }

    // Check 3: Handler Status
    const giveawayHandlerActive = GiveawayHandler.isRunning?.() ?? false;
    const statsHandlerActive = StatsHandler.isRunning?.() ?? false;

    diagnostics.checks.push({
      name: t(language, "health.checks.handlers"),
      status: giveawayHandlerActive && statsHandlerActive ? "✅" : "⚠️",
      detail: t(language, "health.handlers_status", {
        giveaway: giveawayHandlerActive ? t(language, "health.active") : t(language, "health.inactive"),
        stats: statsHandlerActive ? t(language, "health.active") : t(language, "health.inactive"),
      }),
    });

    if (!giveawayHandlerActive || !statsHandlerActive) {
      diagnostics.warnings.push(t(language, "health.warnings.handlers_inactive"));
    }

    // Check 4: Memory Usage
    const memory = formatMemoryUsage();
    const memoryMB = memory.heapUsedMB;
    const memoryStatus = memoryMB > 512 ? "⚠️" : "✅";

    if (memoryMB > 512) {
      diagnostics.warnings.push(t(language, "health.warnings.high_memory", { mb: memoryMB }));
    }

    diagnostics.checks.push({
      name: t(language, "health.checks.memory"),
      status: memoryStatus,
      detail: t(language, "health.memory_usage", {
        used: memoryMB,
        total: memory.heapTotalMB,
      }),
    });

    // Check 5: Build Info
    const buildInfo = getBuildInfo();
    diagnostics.checks.push({
      name: t(language, "health.checks.version"),
      status: "✅",
      detail: `v${buildInfo.version} (${buildInfo.shortCommit || t(language, "health.unknown")})`,
    });

    // Check 6: Uptime
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    diagnostics.checks.push({
      name: t(language, "health.checks.uptime"),
      status: "✅",
      detail: t(language, "health.uptime_format", { hours, minutes }),
    });

    // Build Embed
    const overallStatus =
      diagnostics.errors.length > 0
        ? "❌ " + t(language, "health.status.critical")
        : diagnostics.warnings.length > 0
        ? "⚠️ " + t(language, "health.status.warning")
        : "✅ " + t(language, "health.status.healthy");

    const embed = new EmbedBuilder()
      .setTitle(t(language, "health.embed.title"))
      .setDescription(
        t(language, "health.embed.description", {
          status: overallStatus,
          guild: interaction.guild?.name || "DM",
        })
      )
      .setColor(
        diagnostics.errors.length > 0
          ? 0xed4245
          : diagnostics.warnings.length > 0
          ? 0xfee75c
          : 0x57f287
      )
      .setTimestamp();

    // Add checks field
    const checksText = diagnostics.checks
      .map((check) => `${check.status} **${check.name}**: ${check.detail}`)
      .join("\n");
    embed.addFields({
      name: t(language, "health.embed.checks_title"),
      value: checksText || t(language, "health.no_checks"),
      inline: false,
    });

    // Add warnings if any
    if (diagnostics.warnings.length > 0) {
      embed.addFields({
        name: "⚠️ " + t(language, "health.embed.warnings_title"),
        value: diagnostics.warnings.join("\n"),
        inline: false,
      });
    }

    // Add errors if any
    if (diagnostics.errors.length > 0) {
      embed.addFields({
        name: "❌ " + t(language, "health.embed.errors_title"),
        value: diagnostics.errors.join("\n"),
        inline: false,
      });
    }

    // Footer with timing
    const elapsed = Date.now() - startTime;
    embed.setFooter({
      text: t(language, "health.embed.footer", {
        elapsed,
        discordjs: discordJsVersion,
        node: process.version,
      }),
    });

    logger.info("health", "Health check executed", {
      userId: interaction.user.id,
      guildId: interaction.guildId,
      status: overallStatus,
      checks: diagnostics.checks.length,
      warnings: diagnostics.warnings.length,
      errors: diagnostics.errors.length,
    });

    await interaction.editReply({ embeds: [embed] });
  },
};
