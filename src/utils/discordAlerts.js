"use strict";

/**
 * Discord Security Alerts
 * Sends real-time security alerts to a Discord channel via webhook
 */

const { EmbedBuilder } = require("discord.js");

const WEBHOOK_URL = process.env.SECURITY_ALERTS_WEBHOOK_URL;
const ALERTS_CHANNEL_ID = process.env.SECURITY_ALERTS_CHANNEL_ID;
const ALERTS_GUILD_ID = process.env.SECURITY_ALERTS_GUILD_ID;

// Alert cooldown to prevent spam (5 minutes per alert type)
const ALERT_COOLDOWN_MS = 5 * 60 * 1000;
const lastAlertSent = new Map();

/**
 * Check if we should send alert (cooldown)
 */
function shouldSendAlert(alertType, severity) {
  const key = `${alertType}_${severity}`;
  const lastSent = lastAlertSent.get(key);
  const now = Date.now();

  if (lastSent && (now - lastSent) < ALERT_COOLDOWN_MS) {
    return false; // Still in cooldown
  }

  lastAlertSent.set(key, now);
  return true;
}

/**
 * Send alert via Discord webhook
 */
async function sendWebhookAlert(embed) {
  if (!WEBHOOK_URL) {
    console.log("[DISCORD ALERTS] No webhook configured, skipping Discord alert");
    return false;
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [embed.toJSON()],
        username: "TON618 Security",
        avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("[DISCORD ALERTS] Failed to send webhook:", error.message);
    return false;
  }
}

/**
 * Send alert to a specific Discord channel via bot
 */
async function sendBotAlert(client, embed) {
  if (!ALERTS_CHANNEL_ID || !client) {
    return false;
  }

  try {
    const channel = await client.channels.fetch(ALERTS_CHANNEL_ID);
    if (!channel) {
      console.log("[DISCORD ALERTS] Alert channel not found");
      return false;
    }

    await channel.send({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error("[DISCORD ALERTS] Failed to send bot alert:", error.message);
    return false;
  }
}

/**
 * Build security alert embed
 */
function buildSecurityEmbed(alert) {
  const { type, severity, message, details, recommendations, created_at } = alert;

  // Color based on severity
  const colors = {
    critical: 0xED4245,  // Red
    warning: 0xF1C40F,   // Yellow
    info: 0x57F287,      // Green
  };

  const emojis = {
    critical: "🚨",
    warning: "⚠️",
    info: "ℹ️",
  };

  const embed = new EmbedBuilder()
    .setColor(colors[severity] || colors.info)
    .setTitle(`${emojis[severity]} Security Alert: ${type}`)
    .setDescription(message)
    .setTimestamp(created_at || new Date())
    .setFooter({ text: `TON618 Security System | ID: ${alert.id || "N/A"}` });

  // Add details field if available
  if (details && Object.keys(details).length > 0) {
    const detailsText = Object.entries(details)
      .map(([key, value]) => {
        // Mask sensitive data
        if (key.toLowerCase().includes("token") || key.toLowerCase().includes("password")) {
          return `**${key}**: [REDACTED]`;
        }
        // Format arrays/objects
        if (typeof value === "object") {
          return `**${key}**: ${JSON.stringify(value).substring(0, 100)}`;
        }
        return `**${key}**: ${value}`;
      })
      .join("\n")
      .substring(0, 1024);

    if (detailsText) {
      embed.addFields({
        name: "📋 Details",
        value: detailsText,
        inline: false,
      });
    }
  }

  // Add recommendations
  if (recommendations && recommendations.length > 0) {
    embed.addFields({
      name: "💡 Recommendations",
      value: recommendations.map((r) => `• ${r}`).join("\n").substring(0, 1024),
      inline: false,
    });
  }

  // Add quick actions based on alert type
  const quickActions = getQuickActions(type);
  if (quickActions) {
    embed.addFields({
      name: "🔧 Quick Actions",
      value: quickActions,
      inline: false,
    });
  }

  return embed;
}

/**
 * Get quick action suggestions based on alert type
 */
function getQuickActions(type) {
  const actions = {
    PRO_BRUTE_FORCE:
      "• Investigate user activity\n• Consider temporary ban if pattern continues",
    CODE_GENERATION_ABUSE:
      "• Verify with code generator\n• Check business justification",
    ADMIN_ACTION_ABUSE:
      "• Review admin permissions\n• Verify admin identity",
    HIGH_ERROR_RATE:
      "• Check bot health\n• Review recent deployments",
  };

  return actions[type] || null;
}

/**
 * Send security alert through all configured channels
 */
async function sendSecurityAlert(alert, client = null) {
  // Check cooldown for non-critical alerts
  if (alert.severity !== "critical" && !shouldSendAlert(alert.type, alert.severity)) {
    console.log(`[DISCORD ALERTS] Skipping ${alert.type} (cooldown active)`);
    return false;
  }

  const embed = buildSecurityEmbed(alert);
  let sent = false;

  // Try webhook first
  if (WEBHOOK_URL) {
    sent = await sendWebhookAlert(embed) || sent;
  }

  // Try bot channel as fallback/secondary
  if (client && ALERTS_CHANNEL_ID) {
    sent = await sendBotAlert(client, embed) || sent;
  }

  if (sent) {
    console.log(`[DISCORD ALERTS] Sent ${alert.type} (${alert.severity})`);
  } else {
    console.log(`[DISCORD ALERTS] Could not send ${alert.type} - no channels configured`);
  }

  return sent;
}

/**
 * Test alert system
 */
async function testAlert(client = null) {
  const testAlert = {
    id: "test_" + Date.now(),
    type: "SYSTEM_TEST",
    severity: "info",
    message: "This is a test alert to verify the security notification system is working.",
    details: {
      test: true,
      timestamp: new Date().toISOString(),
    },
    recommendations: ["If you see this, the alert system is configured correctly!"],
    created_at: new Date(),
  };

  return await sendSecurityAlert(testAlert, client);
}

module.exports = {
  sendSecurityAlert,
  sendWebhookAlert,
  sendBotAlert,
  buildSecurityEmbed,
  testAlert,
  shouldSendAlert,
};
