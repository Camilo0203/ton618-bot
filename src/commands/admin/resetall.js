"use strict";

/**
 * Reset All Guild Configurations Command
 * Allows bot owner to completely reset all guild data
 * ⚠️ DESTRUCTIVE OPERATION - Use with extreme caution
 */

const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { getDB } = require("../../utils/database/core");
const { logAdminAction } = require("../../utils/auditLogger");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");
const logger = require("../../utils/structuredLogger");

const OWNER_ID = process.env.OWNER_ID;

function isOwner(userId) {
  return userId === OWNER_ID;
}

// Colecciones que contienen datos por guild (que se pueden borrar)
const GUILD_COLLECTIONS = [
  // Configuraciones principales
  "settings",
  "verifSettings",
  "configBackups",

  // Features de guild
  "autoResponses",
  "alerts",
  "counters",
  "giveaways",
  "polls",
  "suggestions",
  "reminders",

  // Tickets y moderación
  "tickets",
  "ticketEvents",
  "notes",
  "blacklist",
  "auditLogs",

  // Niveles y verificación
  "levels",
  "verifCodes",
  "verifLogs",
  "verifMemberStates",
  "verifMetrics",
  "verifCaptchas",

  // Staff y estadísticas
  "staffStats",
  "membershipReminders",
];

// Colecciones globales (NO se borran por guild)
const GLOBAL_COLLECTIONS = [
  "audit_trail",        // Nuestro audit log de seguridad
  "pro_redeem_codes",   // Códigos de canje
  "pro_redemptions",    // Historial de canjes
  "botHealth",          // Estado del bot
  "featureFlags",       // Feature flags globales
  "distributedLocks",   // Locks distribuidos
];

const data = new SlashCommandBuilder()
  .setName("resetall")
  .setDescription("⚠️ Reset ALL guild configurations (Owner Only - DESTRUCTIVE)")
  .setDescriptionLocalizations({
    "es-ES": "⚠️ Restablecer TODAS las configuraciones de guilds (Solo owner - DESTRUCTIVO)",
    "en-US": "⚠️ Reset ALL guild configurations (Owner Only - DESTRUCTIVE)",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((sub) =>
    sub
      .setName("preview")
      .setDescription("Preview what would be deleted (safe)")
      .setDescriptionLocalizations({
        "es-ES": "Vista previa de lo que se eliminará (seguro)",
        "en-US": "Preview what would be deleted (safe)",
      })
  )
  .addSubcommand((sub) =>
    sub
      .setName("execute")
      .setDescription("⚠️ ACTUALLY DELETE ALL GUILD DATA ⚠️")
      .setDescriptionLocalizations({
        "es-ES": "⚠️ ELIMINAR REALMENTE TODOS LOS DATOS ⚠️",
        "en-US": "⚠️ ACTUALLY DELETE ALL GUILD DATA ⚠️",
      })
      .addStringOption((opt) =>
        opt
          .setName("confirm_code")
          .setDescription("Confirmation code (will be provided)")
          .setDescriptionLocalizations({
            "es-ES": "Código de confirmación (se proporcionará)",
            "en-US": "Confirmation code (will be provided)",
          })
          .setRequired(true)
      )
  );

module.exports = {
  data,
  meta: {
    category: "admin",
    scope: "admin",
    ownerOnly: true,
    privateOnly: true,
  },

  async execute(interaction) {
    const language = resolveInteractionLanguage(interaction);

    // Owner only
    if (!isOwner(interaction.user.id)) {
      return interaction.reply({
        content: t(language, "resetall.owner_only"),
        flags: 64,
      });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "preview") {
      return this.handlePreview(interaction);
    }

    if (subcommand === "execute") {
      return this.handleExecute(interaction);
    }
  },

  async handlePreview(interaction) {
    await interaction.deferReply({ flags: 64 });
    const language = resolveInteractionLanguage(interaction);

    const db = getDB();
    const stats = {};

    // Obtener conteos de todas las colecciones
    for (const collectionName of GUILD_COLLECTIONS) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        const guildCount = await collection.distinct("guild_id");
        stats[collectionName] = {
          total: count,
          guilds: guildCount.length,
        };
      } catch {
        stats[collectionName] = { total: 0, guilds: 0, error: true };
      }
    }

    const totalDocuments = Object.values(stats).reduce((sum, s) => sum + (s.total || 0), 0);
    const totalGuilds = new Set(
      Object.values(stats).flatMap(s => s.guilds || [])
    ).size;

    const embed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setTitle(t(language, "resetall.preview_title"))
      .setDescription(
        t(language, "resetall.preview_description") + "\n\n" +
        `**${t(language, "common.total_documents")}:** ${totalDocuments.toLocaleString()}\n` +
        `**${t(language, "common.unique_guilds")}:** ${totalGuilds.toLocaleString()}\n\n` +
        `**⚠️ ${t(language, "resetall.warning_value")}**`
      )
      .setTimestamp();

    // Mostrar top 10 colecciones con más datos
    const sortedCollections = Object.entries(stats)
      .sort((a, b) => (b[1].total || 0) - (a[1].total || 0))
      .slice(0, 15);

    let fieldsText = "";
    for (const [name, data] of sortedCollections) {
      const emoji = data.total > 1000 ? "🚨" : data.total > 100 ? "⚠️" : "📁";
      fieldsText += `${emoji} **${name}**: ${data.total.toLocaleString()} docs (${data.guilds} guilds)\n`;
    }

    embed.addFields({
      name: t(language, "resetall.collections_cleared").replace("{{count}}", GUILD_COLLECTIONS.length),
      value: fieldsText || t(language, "common.no_data"),
      inline: false,
    });

    const confirmCode = "RESET_ALL_" + Math.random().toString(36).substring(2, 8).toUpperCase();

    embed.addFields({
      name: t(language, "resetall.confirmation_code"),
      value: t(language, "resetall.confirmation_value", { code: confirmCode }),
      inline: false,
    });

    await interaction.editReply({ embeds: [embed] });
  },

  async handleExecute(interaction) {
    const language = resolveInteractionLanguage(interaction);
    const confirmCode = interaction.options.getString("confirm_code");

    // Validar formato del código
    if (!confirmCode.startsWith("RESET_ALL_")) {
      return interaction.reply({
        content: t(language, "resetall.invalid_code"),
        flags: 64,
      });
    }

    await interaction.deferReply({ flags: 64 });

    const db = getDB();
    const results = {
      deleted: [],
      errors: [],
      preserved: [],
    };

    // 1. Backup de conteos antes de borrar (para el audit log)
    const beforeStats = {};
    for (const collectionName of GUILD_COLLECTIONS) {
      try {
        const collection = db.collection(collectionName);
        beforeStats[collectionName] = await collection.countDocuments();
      } catch {
        beforeStats[collectionName] = 0;
      }
    }

    // 2. Borrar datos de colecciones de guild
    for (const collectionName of GUILD_COLLECTIONS) {
      try {
        const collection = db.collection(collectionName);
        const deleteResult = await collection.deleteMany({});

        results.deleted.push({
          collection: collectionName,
          count: deleteResult.deletedCount,
        });
      } catch (error) {
        results.errors.push({
          collection: collectionName,
          error: error.message,
        });
      }
    }

    // 3. Verificar colecciones globales (no se deben haber tocado)
    for (const collectionName of GLOBAL_COLLECTIONS) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        results.preserved.push({
          collection: collectionName,
          count: count,
        });
      } catch (error) {
        results.preserved.push({
          collection: collectionName,
          count: "unknown",
          error: error.message,
        });
      }
    }

    const totalDeleted = results.deleted.reduce((sum, d) => sum + (d.count || 0), 0);

    // 4. Audit log
    await logAdminAction({
      action: "system.reset_all_guilds",
      actorId: interaction.user.id,
      actorTag: interaction.user.tag,
      targetId: "all_guilds",
      targetType: "system",
      guildId: interaction.guild?.id || "DM",
      guildName: interaction.guild?.name || "Direct Message",
      beforeState: { collections: beforeStats },
      afterState: {
        total_deleted: totalDeleted,
        collections_deleted: results.deleted.length,
        errors: results.errors.length,
      },
      reason: `Full reset executed by owner with code: ${confirmCode}`,
    });

    // 5. Resultados
    const embed = new EmbedBuilder()
      .setColor(results.errors.length === 0 ? 0x57F287 : 0xF1C40F)
      .setTitle(t(language, "resetall.success_title"))
      .setDescription(
        `**${t(language, "resetall.documents_deleted_count")}:** ${totalDeleted.toLocaleString()}\n` +
        `**${t(language, "resetall.collections_cleared_count")}:** ${results.deleted.length}\n` +
        `**${t(language, "common.errors")}:** ${results.errors.length}`
      )
      .setTimestamp();

    // Mostrar colecciones borradas (top 10)
    const topDeleted = results.deleted
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 10);

    if (topDeleted.length > 0) {
      embed.addFields({
        name: `✅ ${t(language, "common.deleted_collections")}`,
        value: topDeleted
          .map(d => `**${d.collection}**: ${d.count.toLocaleString()}`)
          .join("\n"),
        inline: false,
      });
    }

    // Mostrar errores si hubo
    if (results.errors.length > 0) {
      embed.addFields({
        name: `❌ ${t(language, "common.errors")}`,
        value: results.errors
          .map(e => `**${e.collection}**: ${e.error.substring(0, 50)}`)
          .join("\n"),
        inline: false,
      });
    }

    // Colecciones preservadas (globales)
    embed.addFields({
      name: `🔒 ${t(language, "common.preserved_global")}`,
      value:
        results.preserved
          .map(p => `**${p.collection}**: ${p.count.toLocaleString()}`)
          .join("\n") || t(language, "common.none"),
      inline: false,
    });

    embed.setFooter({
      text: `${t(language, "common.executed_by")}: ${interaction.user.tag} | Code: ${confirmCode}`,
    });

    await interaction.editReply({ embeds: [embed] });

    // Log importante del reset
    logger.warn('resetall', '⚠️ ALL GUILD DATA RESET COMPLETED ⚠️', {
      deleted: totalDeleted,
      by: interaction.user.tag,
      byId: interaction.user.id,
      at: new Date().toISOString()
    });
  },
};
