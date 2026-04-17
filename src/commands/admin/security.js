"use strict";

/**
 * Security Admin Command
 * Allows bot owner to view and manage security alerts
 */

const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getAlerts, acknowledgeAlert, manualSecurityCheck, clearOldAlerts } = require("../../utils/securityAlerts");
const { sendSecurityAlert, testAlert } = require("../../utils/discordAlerts");
const { getSchedulerStatus, startSecurityScheduler, stopSecurityScheduler } = require("../../utils/securityScheduler");
const { setupAuditIndexes } = require("../../utils/database/setupAuditIndexes");
const { logAdminAction, logCommandExecution } = require("../../utils/auditLogger");
const logger = require("../../utils/structuredLogger");
const { isEncryptionEnabled, encrypt, decrypt, generateEncryptionKey, mask } = require("../../utils/cryptoService");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

const OWNER_ID = process.env.OWNER_ID;

function isOwner(userId) {
  return userId === OWNER_ID;
}

const data = new SlashCommandBuilder()
  .setName("security")
  .setDescription("Security monitoring and alerts (Owner only)")
  .setDescriptionLocalizations({
    "es-ES": "Monitoreo de seguridad y alertas (Solo owner)",
    "en-US": "Security monitoring and alerts (Owner only)",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((sub) =>
    sub
      .setName("alerts")
      .setDescription("View recent security alerts")
      .setDescriptionLocalizations({
        "es-ES": "Ver alertas de seguridad recientes",
        "en-US": "View recent security alerts",
      })
      .addStringOption((opt) =>
        opt
          .setName("severity")
          .setDescription("Filter by severity")
          .setRequired(false)
          .addChoices(
            { name: "Critical", value: "critical" },
            { name: "Warning", value: "warning" },
            { name: "Info", value: "info" }
          )
      )
      .addIntegerOption((opt) =>
        opt
          .setName("limit")
          .setDescription("Number of alerts to show (max 25)")
          .setMinValue(1)
          .setMaxValue(25)
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("check")
      .setDescription("Run manual security check")
      .setDescriptionLocalizations({
        "es-ES": "Ejecutar verificación manual de seguridad",
        "en-US": "Run manual security check",
      })
  )
  .addSubcommand((sub) =>
    sub
      .setName("status")
      .setDescription("View security system status")
      .setDescriptionLocalizations({
        "es-ES": "Ver estado del sistema de seguridad",
        "en-US": "View security system status",
      })
  )
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup security system (indexes, scheduler)")
      .setDescriptionLocalizations({
        "es-ES": "Configurar sistema de seguridad (índices, scheduler)",
        "en-US": "Setup security system (indexes, scheduler)",
      })
      .addBooleanOption((opt) =>
        opt
          .setName("indexes")
          .setDescription("Create MongoDB indexes")
          .setRequired(false)
      )
      .addBooleanOption((opt) =>
        opt
          .setName("scheduler")
          .setDescription("Start security scheduler")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("acknowledge")
      .setDescription("Acknowledge an alert")
      .setDescriptionLocalizations({
        "es-ES": "Reconocer una alerta",
        "en-US": "Acknowledge an alert",
      })
      .addStringOption((opt) =>
        opt
          .setName("alert_id")
          .setDescription("Alert ID to acknowledge")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("test")
      .setDescription("Test Discord alert notifications")
      .setDescriptionLocalizations({
        "es-ES": "Probar notificaciones de alertas Discord",
        "en-US": "Test Discord alert notifications",
      })
  )
  .addSubcommand((sub) =>
    sub
      .setName("encryption")
      .setDescription("View encryption status and generate keys")
      .setDescriptionLocalizations({
        "es-ES": "Ver estado de encriptación y generar claves",
        "en-US": "View encryption status and generate keys",
      })
      .addBooleanOption((opt) =>
        opt
          .setName("generate_key")
          .setDescription("Generate a new encryption key")
          .setRequired(false)
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
    const startTime = Date.now();
    const language = resolveInteractionLanguage(interaction);

    // Owner only
    if (!isOwner(interaction.user.id)) {
      return interaction.reply({
        content: t(language, "security.owner_only"),
        flags: 64,
      });
    }

    const subcommand = interaction.options.getSubcommand();

    try {
      if (subcommand === "alerts") {
        await this.handleAlerts(interaction);
      } else if (subcommand === "check") {
        await this.handleCheck(interaction);
      } else if (subcommand === "status") {
        await this.handleStatus(interaction);
      } else if (subcommand === "setup") {
        await this.handleSetup(interaction);
      } else if (subcommand === "acknowledge") {
        await this.handleAcknowledge(interaction);
      } else if (subcommand === "test") {
        await this.handleTest(interaction);
      } else if (subcommand === "encryption") {
        await this.handleEncryption(interaction);
      }

      // Log command execution
      await logCommandExecution({
        commandName: 'security',
        subcommand,
        userId: interaction.user.id,
        userTag: interaction.user.tag,
        guildId: interaction.guild?.id || null,
        guildName: interaction.guild?.name || 'DM',
        channelId: interaction.channel?.id || null,
        options: {},
        success: true,
        executionTimeMs: Date.now() - startTime,
      });
    } catch (error) {
      logger.error('security', 'Command error', { error: error?.message || String(error) });

      await logCommandExecution({
        commandName: 'security',
        subcommand,
        userId: interaction.user.id,
        userTag: interaction.user.tag,
        guildId: interaction.guild?.id || null,
        guildName: interaction.guild?.name || 'DM',
        channelId: interaction.channel?.id || null,
        options: {},
        success: false,
        errorMessage: error.message,
        executionTimeMs: Date.now() - startTime,
      });

      await interaction.reply({
        content: `❌ Error: ${error.message}`,
        flags: 64,
      });
    }
  },

  async handleAlerts(interaction) {
    await interaction.deferReply({ flags: 64 });
    const language = resolveInteractionLanguage(interaction);

    const severity = interaction.options.getString("severity");
    const limit = interaction.options.getInteger("limit") || 10;

    const alerts = getAlerts({ limit, severity, unacknowledged: false });

    if (alerts.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle(t(language, "security.alerts_title"))
        .setDescription(t(language, "security.no_alerts"))
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor(severity === 'critical' ? 0xED4245 : severity === 'warning' ? 0xF1C40F : 0x57F287)
      .setTitle(`${t(language, "security.alerts_title")} (${alerts.length})`)
      .setDescription(`${t(language, "common.showing")} ${alerts.length} ${alerts.length === 1 ? 'alert' : 'alerts'}${severity ? ` (${severity})` : ''}`)
      .setTimestamp();

    for (const alert of alerts.slice(0, 10)) {
      const emoji = alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️';
      const status = alert.acknowledged ? '✅ ' + t(language, "common.acknowledged") : '⏳ ' + t(language, "common.pending");

      embed.addFields({
        name: `${emoji} ${alert.type} (${status})`,
        value: `**${alert.message.substring(0, 100)}${alert.message.length > 100 ? '...' : ''}**\n` +
               `${t(language, "common.severity")}: \`${alert.severity}\` | ${t(language, "common.time")}: <t:${Math.floor(alert.created_at.getTime() / 1000)}:R>\n` +
               `ID: \`${alert.id}\``,
        inline: false,
      });
    }

    if (alerts.length > 10) {
      embed.setFooter({ text: `${t(language, "common.and_more")} ${alerts.length - 10} ${t(language, "common.more")}...` });
    }

    // Add acknowledge button for first unacknowledged alert
    const firstUnacknowledged = alerts.find(a => !a.acknowledged);
    const components = [];

    if (firstUnacknowledged) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`security_ack_${firstUnacknowledged.id}`)
          .setLabel(`${t(language, "common.acknowledge")} ${firstUnacknowledged.type}`)
          .setStyle(ButtonStyle.Primary)
      );
      components.push(row);
    }

    await interaction.editReply({
      embeds: [embed],
      components: components.length > 0 ? components : undefined,
    });
  },

  async handleCheck(interaction) {
    await interaction.deferReply({ flags: 64 });
    const language = resolveInteractionLanguage(interaction);

    await interaction.editReply({
      content: "🔍 " + t(language, "security.check_title"),
    });

    const triggered = await manualSecurityCheck();

    const embed = new EmbedBuilder()
      .setColor(triggered > 0 ? 0xF1C40F : 0x57F287)
      .setTitle(t(language, "security.check_title"))
      .setDescription(triggered > 0
        ? t(language, "security.check_triggered", { count: triggered })
        : t(language, "security.check_clean"))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    // Audit log
    await logAdminAction({
      action: 'security.manual_check',
      actorId: interaction.user.id,
      actorTag: interaction.user.tag,
      targetId: 'system',
      targetType: 'security_system',
      guildId: interaction.guild?.id || 'DM',
      guildName: interaction.guild?.name || 'Direct Message',
      beforeState: {},
      afterState: { alerts_triggered: triggered },
      reason: `Manual security check by owner`,
    });
  },

  async handleStatus(interaction) {
    await interaction.deferReply({ flags: 64 });

    const status = getSchedulerStatus();
    const allAlerts = getAlerts({ limit: 1000 });
    const unacknowledged = allAlerts.filter(a => !a.acknowledged);
    const criticalAlerts = allAlerts.filter(a => a.severity === 'critical' && !a.acknowledged);

    const embed = new EmbedBuilder()
      .setColor(criticalAlerts.length > 0 ? 0xED4245 : unacknowledged.length > 0 ? 0xF1C40F : 0x57F287)
      .setTitle("🔒 Security System Status")
      .addFields(
        {
          name: "📊 Monitoring",
          value: `Status: ${status.isRunning ? '🟢 Active' : '🔴 Stopped'}\n` +
                 `Check Interval: ${status.checkIntervalMs / 1000}s\n` +
                 `Cleanup Interval: ${status.cleanupIntervalMs / 1000}s`,
          inline: true,
        },
        {
          name: "🚨 Alerts",
          value: `Total: ${allAlerts.length}\n` +
                 `Unacknowledged: ${unacknowledged.length}\n` +
                 `Critical (unack): ${criticalAlerts.length}`,
          inline: true,
        },
        {
          name: "⚙️ Configuration",
          value: `Max Alert Age: ${status.maxAlertAgeHours}h\n` +
                 `Owner ID: ${OWNER_ID ? OWNER_ID.substring(0, 8) + '...' : 'Not set'}`,
          inline: true,
        }
      )
      .setTimestamp();

    if (criticalAlerts.length > 0) {
      embed.addFields({
        name: "🚨 Critical Alerts",
        value: criticalAlerts.map(a => `• ${a.type}: ${a.message.substring(0, 50)}...`).join('\n'),
        inline: false,
      });
    }

    await interaction.editReply({ embeds: [embed] });
  },

  async handleSetup(interaction) {
    await interaction.deferReply({ flags: 64 });

    const setupIndexes = interaction.options.getBoolean("indexes") ?? true;
    const setupScheduler = interaction.options.getBoolean("scheduler") ?? true;

    const results = [];

    if (setupIndexes) {
      await interaction.editReply({
        content: "🔧 Setting up MongoDB indexes...",
      });

      const indexResult = await setupAuditIndexes();
      results.push(`Indexes: ${indexResult ? '✅ Created' : '❌ Failed'}`);
    }

    if (setupScheduler) {
      const schedulerResult = startSecurityScheduler();
      results.push(`Scheduler: ${schedulerResult ? '✅ Started' : '❌ Failed'}`);
    }

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("🔒 Security Setup Complete")
      .setDescription(results.join('\n'))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    // Audit log
    await logAdminAction({
      action: 'security.setup',
      actorId: interaction.user.id,
      actorTag: interaction.user.tag,
      targetId: 'system',
      targetType: 'security_system',
      guildId: interaction.guild?.id || 'DM',
      guildName: interaction.guild?.name || 'Direct Message',
      beforeState: { indexes_setup: false, scheduler_running: false },
      afterState: { indexes_setup: setupIndexes, scheduler_running: setupScheduler },
      reason: `Security system setup by owner`,
    });
  },

  async handleAcknowledge(interaction) {
    await interaction.deferReply({ flags: 64 });

    const alertId = interaction.options.getString("alert_id");
    const result = acknowledgeAlert(alertId);

    if (result) {
      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("✅ Alert Acknowledged")
        .setDescription(`Alert \`${alertId}\` has been acknowledged.`)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Audit log
      await logAdminAction({
        action: 'security.acknowledge_alert',
        actorId: interaction.user.id,
        actorTag: interaction.user.tag,
        targetId: alertId,
        targetType: 'security_alert',
        guildId: interaction.guild?.id || 'DM',
        guildName: interaction.guild?.name || 'Direct Message',
        beforeState: { acknowledged: false },
        afterState: { acknowledged: true },
        reason: `Alert acknowledged by owner`,
      });
    } else {
      await interaction.editReply({
        content: `❌ Alert \`${alertId}\` not found or already acknowledged.`,
      });
    }
  },

  async handleTest(interaction) {
    await interaction.deferReply({ flags: 64 });

    const { testAlert } = require("../../utils/discordAlerts");
    const sent = await testAlert(interaction.client, interaction.guildId);

    if (sent) {
      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("✅ Test Alert Sent")
        .setDescription("A test security alert has been sent to your configured Discord channel/webhook.")
        .addFields(
          {
            name: "Webhook URL",
            value: process.env.SECURITY_ALERTS_WEBHOOK_URL ? "✅ Configured" : "❌ Not set",
            inline: true,
          },
          {
            name: "Alert Channel",
            value: process.env.SECURITY_ALERTS_CHANNEL_ID ? "✅ Configured" : "❌ Not set",
            inline: true,
          }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      await logAdminAction({
        action: 'security.test_alert',
        actorId: interaction.user.id,
        actorTag: interaction.user.tag,
        targetId: 'system',
        targetType: 'security_system',
        guildId: interaction.guild?.id || 'DM',
        guildName: interaction.guild?.name || 'Direct Message',
        beforeState: {},
        afterState: { test_sent: true },
        reason: `Security alert test by owner`,
      });
    } else {
      await interaction.editReply({
        content: "❌ Failed to send test alert. Check that SECURITY_ALERTS_WEBHOOK_URL or SECURITY_ALERTS_CHANNEL_ID is configured in your .env file.",
      });
    }
  },

  async handleEncryption(interaction) {
    await interaction.deferReply({ flags: 64 });

    const generateKey = interaction.options.getBoolean("generate_key");

    if (generateKey) {
      const key = generateEncryptionKey();

      const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setTitle("🔐 New Encryption Key Generated")
        .setDescription(
          "A new 256-bit encryption key has been generated.\n\n" +
          "**Add this to your .env file:**\n" +
          "```\nENCRYPTION_KEY=" + key + "\n```"
        )
        .addFields(
          {
            name: "⚠️ Important",
            value:
              "• Keep this key SECRET and in a password manager\n" +
              "• If you lose it, encrypted data CANNOT be recovered\n" +
              "• Changing the key will make existing encrypted data unreadable",
            inline: false,
          }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      await logAdminAction({
        action: 'security.generate_encryption_key',
        actorId: interaction.user.id,
        actorTag: interaction.user.tag,
        targetId: 'system',
        targetType: 'security_system',
        guildId: interaction.guild?.id || 'DM',
        guildName: interaction.guild?.name || 'Direct Message',
        beforeState: {},
        afterState: { key_generated: true },
        reason: `New encryption key generated by owner`,
      });
      return;
    }

    // Show current encryption status
    const encryptionEnabled = isEncryptionEnabled();
    const keyConfigured = !!process.env.ENCRYPTION_KEY;
    const keyLength = process.env.ENCRYPTION_KEY?.length || 0;

    const embed = new EmbedBuilder()
      .setColor(encryptionEnabled ? 0x57F287 : 0xED4245)
      .setTitle("🔐 Encryption Status")
      .addFields(
        {
          name: "Status",
          value: encryptionEnabled ? "✅ Enabled" : "❌ Disabled",
          inline: true,
        },
        {
          name: "Key Configured",
          value: keyConfigured ? "✅ Yes" : "❌ No",
          inline: true,
        },
        {
          name: "Key Length",
          value: `${keyLength} chars ${keyLength >= 32 ? "(✅ Valid)" : "(❌ Too short)"}`,
          inline: true,
        }
      )
      .setDescription(
        encryptionEnabled
          ? "Your sensitive data is being automatically encrypted with AES-256-GCM."
          : "⚠️ Encryption is NOT enabled. Sensitive data is stored in plain text.\n\n" +
            "Run `/security encryption generate_key:true` to generate a key."
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
