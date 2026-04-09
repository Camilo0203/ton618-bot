"use strict";

const { ActivityType } = require("discord.js");
const { tickets, settings } = require("../utils/database");
const { giveaways } = require("../utils/database");

const PRESENCE_ROTATION_MS = 20_000; // 20 seconds between rotations
const STATS_CACHE_MS = 60_000; // Cache stats for 1 minute

// Messages by language - with dynamic placeholders
const PRESENCE_MESSAGES = {
  es: [
    { text: "En {guilds} servidores", type: ActivityType.Watching },
    { text: "Ayudando a {users} usuarios", type: ActivityType.Watching },
    { text: "{tickets} tickets activos", type: ActivityType.Watching },
    { text: "/help para comandos", type: ActivityType.Listening },
    { text: "{giveaways} sorteos activos", type: ActivityType.Watching },
    { text: "Soporte en español", type: ActivityType.Custom },
    { text: "Gestión de comunidades", type: ActivityType.Custom },
    { text: "Sistema de tickets activo", type: ActivityType.Custom },
    { text: "Moderación automatizada", type: ActivityType.Custom },
    { text: "TON618 Beta", type: ActivityType.Playing },
    { text: "Comienza con /help", type: ActivityType.Custom },
  ],
  en: [
    { text: "In {guilds} servers", type: ActivityType.Watching },
    { text: "Helping {users} users", type: ActivityType.Watching },
    { text: "{tickets} active tickets", type: ActivityType.Watching },
    { text: "/help for commands", type: ActivityType.Listening },
    { text: "{giveaways} active giveaways", type: ActivityType.Watching },
    { text: "English support ready", type: ActivityType.Custom },
    { text: "Community management", type: ActivityType.Custom },
    { text: "Ticket system active", type: ActivityType.Custom },
    { text: "Automated moderation", type: ActivityType.Custom },
    { text: "TON618 Beta", type: ActivityType.Playing },
    { text: "Start with /help", type: ActivityType.Custom },
  ],
};

// Cache for stats to avoid repeated calculations
const statsCache = {
  timestamp: 0,
  guilds: 0,
  users: 0,
  globalTickets: 0,
  globalGiveaways: 0,
};

const presenceIntervals = new WeakMap();

// Cache for guild language settings to avoid repeated DB calls
const guildLanguageCache = new Map();
const LANGUAGE_CACHE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Resolve guild language from multiple sources
 * Priority: 1) Database setting, 2) Discord preferredLocale, 3) Default (en)
 * @param {Guild} guild - Discord guild
 * @returns {Promise<string>} 'es' or 'en'
 */
async function resolveGuildLanguage(guild) {
  if (!guild) return "en";

  // Check cache first
  const cached = guildLanguageCache.get(guild.id);
  if (cached && (Date.now() - cached.timestamp < LANGUAGE_CACHE_MS)) {
    return cached.language;
  }

  let language = "en";

  try {
    // 1. Check database setting (user-configured language from onboarding)
    const guildSettings = await settings.get(guild.id);
    if (guildSettings?.bot_language) {
      language = guildSettings.bot_language === "es" ? "es" : "en";
    } else {
      // 2. Fallback to Discord's native locale (preferredLocale)
      const discordLocale = guild.preferredLocale || "";
      const spanishLocales = ["es-ES", "es-419", "es-MX", "es-AR", "es-CO", "es-CL", "es-PE", "es-VE", "es-UY"];

      if (spanishLocales.some((loc) => discordLocale.startsWith(loc))) {
        language = "es";
      }
    }
  } catch (error) {
    // On error, fallback to Discord locale
    const discordLocale = guild.preferredLocale || "";
    const spanishLocales = ["es-ES", "es-419", "es-MX", "es-AR", "es-CO", "es-CL", "es-PE", "es-VE", "es-UY"];
    if (spanishLocales.some((loc) => discordLocale.startsWith(loc))) {
      language = "es";
    }
  }

  // Cache the result
  guildLanguageCache.set(guild.id, { language, timestamp: Date.now() });

  return language;
}

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
async function getGuildStats(guildId) {
  try {
    const [ticketCount, activeGiveaways] = await Promise.all([
      tickets.countOpenByGuild(guildId).catch(() => 0),
      giveaways.getByGuild(guildId, false).catch(() => []),
    ]);

    return {
      tickets: ticketCount,
      giveaways: activeGiveaways.length,
    };
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

  // Track state per guild for language detection
  const guildActivityIndices = new Map();

  const rotatePresence = async () => {
    try {
      // Update global stats cache
      await updateStatsCache(client);

      // Get a random guild weighted by activity (prefer recently active)
      // For now, pick a guild and use its language
      const guilds = Array.from(client.guilds.cache.values());
      if (guilds.length === 0) {
        // No guilds, show default
        client.user.setActivity({
          name: "TON618 Bot",
          type: ActivityType.Custom,
        });
        return;
      }

      // Cycle through guilds to show variety
      const now = Date.now();
      const cycleIndex = Math.floor(now / PRESENCE_ROTATION_MS) % Math.max(guilds.length, 1);
      const targetGuild = guilds[cycleIndex % guilds.length];

      // Detect language for this guild (async with DB check)
      const lang = await resolveGuildLanguage(targetGuild);

      // Get messages for this language
      const messages = PRESENCE_MESSAGES[lang] || PRESENCE_MESSAGES.en;

      // Get current index for this guild (or randomize)
      let activityIndex = guildActivityIndices.get(targetGuild.id) || 0;
      activityIndex = (activityIndex + 1) % messages.length;
      guildActivityIndices.set(targetGuild.id, activityIndex);

      // Get guild-specific stats
      const guildStats = await getGuildStats(targetGuild.id);

      // Build activity with stats
      const template = messages[activityIndex];
      const activity = formatActivity(template, {
        guilds: statsCache.guilds,
        users: statsCache.users,
        tickets: guildStats.tickets,
        giveaways: guildStats.giveaways,
      });

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

module.exports = { register, unregister, resolveGuildLanguage };
