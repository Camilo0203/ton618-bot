"use strict";

const { ActivityType } = require("discord.js");
const { tickets, giveaways } = require("../utils/database");
const { logStructured } = require("../utils/observability");

const PRESENCE_ROTATION_MS = 60_000; // 60 seconds between rotations (was 20s)
const STATS_CACHE_MS = 60_000; // Cache stats for 1 minute

// Universal presence messages - work for all languages
// Discord doesn't support per-server presence, so we use bilingual/neutral messages
const PRESENCE_MESSAGES = [
  { text: "TON618 | /help", type: ActivityType.Playing },
  { text: "In {guilds} servers", type: ActivityType.Custom },
  { text: "Helping {users} users", type: ActivityType.Custom },
  { text: "/help for commands", type: ActivityType.Custom },
  { text: "{tickets} tickets", type: ActivityType.Custom },
  { text: "Ticket System", type: ActivityType.Custom },
  { text: "Community Management", type: ActivityType.Custom },
  { text: "Automated Moderation", type: ActivityType.Custom },
];

// Cache for stats to avoid repeated calculations
const statsCache = {
  timestamp: 0,
  guilds: 0,
  users: 0,
  globalTickets: 0,
  globalGiveaways: 0,
};

const presenceIntervals = new WeakMap();
let activityIndex = 0;

// Note: Discord presence is GLOBAL, not per-server
// All users see the same presence regardless of their server's language

/**
 * Format numbers for display (e.g., 1240 -> 1.2k)
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return String(num);
}

/**
 * Update global stats cache
 * @param {Client} client - Discord client
 */
async function updateStatsCache(client) {
  const now = Date.now();
  if (now - statsCache.timestamp < STATS_CACHE_MS) {
    return; // Use cached stats
  }

  try {
    // Count guilds and users
    const guilds = client.guilds.cache.size;
    let users = 0;
    client.guilds.cache.forEach((g) => {
      users += g.memberCount || 0;
    });

    // Try to get global ticket count (best effort)
    let globalTickets = 0;
    try {
      // Get a sample of guilds to estimate
      const sampleGuilds = client.guilds.cache.first(10);
      for (const [, guild] of sampleGuilds) {
        const count = await tickets.countOpenByGuild(guild.id);
        globalTickets += count;
      }
      // Extrapolate for all guilds (rough estimate)
      if (client.guilds.cache.size > 10) {
        globalTickets = Math.round(globalTickets * (client.guilds.cache.size / 10));
      }
    } catch (e) {
      // Fallback: use cached or 0
    }

    // Try to get global giveaway count
    let globalGiveaways = 0;
    try {
      const activeGiveaways = await giveaways.getActive(100);
      globalGiveaways = activeGiveaways.length;
    } catch (e) {
      // Fallback
    }

    statsCache.timestamp = now;
    statsCache.guilds = guilds;
    statsCache.users = users;
    statsCache.globalTickets = globalTickets;
    statsCache.globalGiveaways = globalGiveaways;
  } catch (error) {
    // Keep old cache on error
  }
}

/**
 * Get per-guild stats
 * @param {string} guildId
 * @returns {Promise<{tickets: number, giveaways: number}>}
 */
async function getTotalStats() {
  try {
    // Get total open tickets across all guilds
    const allTickets = await tickets.getAllOpen ? await tickets.getAllOpen() : [];
    const totalTickets = allTickets.length;

    // Get total active giveaways
    const allGiveaways = await giveaways.getActive ? await giveaways.getActive() : [];
    const totalGiveaways = allGiveaways.length;

    return { tickets: totalTickets, giveaways: totalGiveaways };
  } catch (error) {
    return { tickets: 0, giveaways: 0 };
  }
}

/**
 * Format a presence message with placeholders
 * @param {Object} template - Message template with text and type
 * @param {Object} stats - Stats object
 * @returns {Object} Activity object for setActivity
 */
function formatActivity(template, stats) {
  let text = template.text
    .replace(/{guilds}/g, formatNumber(stats.guilds))
    .replace(/{users}/g, formatNumber(stats.users))
    .replace(/{tickets}/g, String(stats.tickets || 0))
    .replace(/{giveaways}/g, String(stats.giveaways || 0));

  return {
    name: text,
    type: template.type,
  };
}

/**
 * Register dynamic presence for a client
 * @param {Client} client - Discord.js client
 * @param {Object} options - Options
 */
function register(client, options = {}) {
  if (!client?.user) return;

  // Clear existing interval
  const existingInterval = presenceIntervals.get(client);
  if (existingInterval) clearInterval(existingInterval);

  const rotatePresence = async () => {
    try {
      // Update global stats cache
      await updateStatsCache(client);

      // Cycle through messages
      activityIndex = (activityIndex + 1) % PRESENCE_MESSAGES.length;
      const template = PRESENCE_MESSAGES[activityIndex];

      // Get global stats
      const totalStats = await getTotalStats();

      // Build activity with global stats
      const activity = formatActivity(template, {
        guilds: statsCache.guilds,
        users: statsCache.users,
        tickets: totalStats.tickets,
        giveaways: totalStats.giveaways,
      });

      // Log activity changes (throttled: only log every 10th rotation to reduce spam)
      const rotationCount = activityIndex + 1;
      if (rotationCount % 10 === 0 || process.env.LOG_LEVEL === "debug") {
        logStructured("debug", "presence.set", {
          activityText: activity.name,
          activityType: activity.type,
          rotationCount,
        });
      }

      client.user.setActivity(activity);
    } catch (error) {
      // Fallback on error
      client.user.setActivity({
        name: "TON618 Bot",
        type: ActivityType.Custom,
      });
    }
  };

  // Initial set
  rotatePresence();

  // Set up rotation
  const interval = setInterval(rotatePresence, PRESENCE_ROTATION_MS);
  if (typeof interval.unref === "function") interval.unref();
  presenceIntervals.set(client, interval);
}

/**
 * Stop presence rotation for a client
 * @param {Client} client - Discord.js client
 */
function unregister(client) {
  const interval = presenceIntervals.get(client);
  if (interval) {
    clearInterval(interval);
    presenceIntervals.delete(client);
  }
}

module.exports = { register, unregister };
