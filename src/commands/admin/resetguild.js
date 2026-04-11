"use strict";

/**
 * Reset Single Guild Configuration Command
 * Resets all configurations for a specific guild
 */

const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { getDB } = require("../../utils/database/core");
const { logAdminAction } = require("../../utils/auditLogger");

const OWNER_ID = process.env.OWNER_ID;

function isOwner(userId) {
  return userId === OWNER_ID;
}

// Colecciones que tienen datos por guild
const GUILD_COLLECTIONS = [
  "settings",
  "verifSettings",
  "configBackups",
  "autoResponses",
  "alerts",
  "counters",
  "giveaways",
  "polls",
  "suggestions",
  "reminders",
  "tickets",
  "ticketEvents",
  "notes",
  "blacklist",
  "auditLogs",
  "levels",
  "verifCodes",
  "verifLogs",
  "verifMemberStates",
  "verifMetrics",
  "verifCaptchas",
  "staffStats",
  "membershipReminders",
];

const data = new SlashCommandBuilder()
  .setName("resetguild")
  .setDescription("Reset all configurations for a specific guild (Owner Only)")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((opt) =>
    opt
      .setName("guild_id")
      .setDescription("Guild ID to reset (or 'this' for current guild)")
      .setRequired(true)
  )
  .addBooleanOption((opt) =>
    opt
      .setName("preserve_pro")
      .setDescription("Preserve Pro/premium status (default: true)")
      .setRequired(false)
  )
  .addBooleanOption((opt) =>
    opt
      .setName("preserve_tickets")
      .setDescription("Preserve active tickets (default: false)")
      .setRequired(false)
  )
  .addStringOption((opt) =>
    opt
      .setName("reason")
      .setDescription("Reason for the reset")
      .setRequired(false)
      .setMaxLength(500)
  );

module.exports = {
  data,
  meta: {
    category: "admin",
    scope: "admin",
    ownerOnly: true,
  },

  async execute(interaction) {
    // Owner only
    if (!isOwner(interaction.user.id)) {
      return interaction.reply({
        content: "🔒 This command is restricted to the bot owner.",
        flags: 64,
      });
    }

    let guildIdInput = interaction.options.getString("guild_id");
    const preservePro = interaction.options.getBoolean("preserve_pro") ?? true;
    const preserveTickets = interaction.options.getBoolean("preserve_tickets") ?? false;
    const reason = interaction.options.getString("reason") || "Manual reset by owner";

    // Handle 'this' as current guild
    if (guildIdInput.toLowerCase() === "this") {
      guildIdInput = interaction.guild?.id;
    }

    if (!guildIdInput || guildIdInput.length < 10) {
      return interaction.reply({
        content: "❌ Invalid guild ID. Use a valid guild ID or 'this' for current guild.",
        flags: 64,
      });
    }

    await interaction.deferReply({ flags: 64 });

    const db = getDB();
    const targetGuildId = guildIdInput;

    try {
      // Get guild info if available
      let guildInfo = { id: targetGuildId, name: "Unknown" };
      try {
        const guild = await interaction.client.guilds.fetch(targetGuildId);
        guildInfo = { id: guild.id, name: guild.name, memberCount: guild.memberCount };
      } catch {
        // Guild not found or bot not in it
      }

      // Build list of collections to clear
      const collectionsToClear = [...GUILD_COLLECTIONS];

      // Exclude tickets if requested
      if (preserveTickets) {
        const idx = collectionsToClear.indexOf("tickets");
        if (idx > -1) collectionsToClear.splice(idx, 1);
      }

      // Get before stats
      const beforeStats = {};
      for (const collectionName of collectionsToClear) {
        try {
          const collection = db.collection(collectionName);
          beforeStats[collectionName] = await collection.countDocuments({ guild_id: targetGuildId });
        } catch {
          beforeStats[collectionName] = 0;
        }
      }

      const totalBefore = Object.values(beforeStats).reduce((a, b) => a + b, 0);

      if (totalBefore === 0) {
        return interaction.editReply({
          content: `ℹ️ Guild **${guildInfo.name}** (${targetGuildId}) has no data to reset.`,
        });
      }

      // Execute deletions
      const results = [];
      let totalDeleted = 0;

      for (const collectionName of collectionsToClear) {
        try {
          const collection = db.collection(collectionName);
          const result = await collection.deleteMany({ guild_id: targetGuildId });

          if (result.deletedCount > 0) {
            results.push({
              collection: collectionName,
              deleted: result.deletedCount,
            });
            totalDeleted += result.deletedCount;
          }
        } catch (error) {
          results.push({
            collection: collectionName,
            error: error.message,
          });
        }
      }

      // Audit log
      await logAdminAction({
        action: "guild.reset_configuration",
        actorId: interaction.user.id,
        actorTag: interaction.user.tag,
        targetId: targetGuildId,
        targetType: "guild",
        guildId: targetGuildId,
        guildName: guildInfo.name,
        beforeState: { collections: beforeStats, total: totalBefore },
        afterState: {
          deleted: totalDeleted,
          collections_cleared: results.filter(r => r.deleted).length,
          preserve_pro: preservePro,
          preserve_tickets: preserveTickets,
        },
        reason: reason,
      });

      // Build response
      const embed = new EmbedBuilder()
        .setColor(totalDeleted > 0 ? 0x57F287 : 0xF1C40F)
        .setTitle("🗑️ Guild Configuration Reset")
        .setDescription(
          `**Guild:** ${guildInfo.name}\n` +
          `**ID:** \`${targetGuildId}\`\n\n` +
          `**Documents deleted:** ${totalDeleted.toLocaleString()}\n` +
          `**Collections affected:** ${results.filter(r => r.deleted).length}`
        )
        .setTimestamp();

      // Show details
      const deletedItems = results.filter(r => r.deleted > 0);
      if (deletedItems.length > 0) {
        embed.addFields({
          name: "Deleted Data",
          value: deletedItems
            .map(r => `**${r.collection}**: ${r.deleted.toLocaleString()}`)
            .join("\n")
            .substring(0, 1024),
          inline: false,
        });
      }

      // Show preserved settings
      const preserved = [];
      if (preservePro) preserved.push("Pro/premium status (global data)");
      if (preserveTickets) preserved.push("Active tickets");

      if (preserved.length > 0) {
        embed.addFields({
          name: "🔒 Preserved",
          value: preserved.join("\n"),
          inline: false,
        });
      }

      embed.setFooter({
        text: `Reset by ${interaction.user.tag} | Reason: ${reason.substring(0, 50)}${reason.length > 50 ? "..." : ""}`,
      });

      await interaction.editReply({ embeds: [embed] });

      // Console log
      console.log(`[RESET GUILD] ${guildInfo.name} (${targetGuildId}): ${totalDeleted} documents deleted by ${interaction.user.tag}`);

    } catch (error) {
      console.error("[RESET GUILD] Error:", error);

      await interaction.editReply({
        content: `❌ Error resetting guild: ${error.message}`,
      });

      await logAdminAction({
        action: "guild.reset_configuration_failed",
        actorId: interaction.user.id,
        actorTag: interaction.user.tag,
        targetId: targetGuildId,
        targetType: "guild",
        guildId: targetGuildId,
        guildName: "Unknown",
        beforeState: {},
        afterState: { error: error.message },
        reason: reason,
      });
    }
  },
};
