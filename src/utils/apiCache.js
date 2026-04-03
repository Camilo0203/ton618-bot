"use strict";

/**
 * API Cache - Caché LRU para respuestas de Discord API
 * Reduce llamadas redundantes a la API
 */

// Cachés específicos por tipo de dato
const caches = {
  members: new Map(),
  channels: new Map(),
  guilds: new Map(),
  roles: new Map(),
  messages: new Map()
};

// Configuración de TTL por tipo (en milisegundos)
const DEFAULT_TTL = {
  members: 5 * 60 * 1000,      // 5 minutos
  channels: 2 * 60 * 1000,      // 2 minutos
  guilds: 10 * 60 * 1000,       // 10 minutos
  roles: 5 * 60 * 1000,         // 5 minutos
  messages: 30 * 1000           // 30 segundos (mensajes cambian frecuentemente)
};

// Límites de tamaño por caché
const MAX_SIZE = {
  members: 1000,
  channels: 500,
  guilds: 100,
  roles: 200,
  messages: 200
};

// Estadísticas
const stats = {
  hits: 0,
  misses: 0,
  evictions: 0,
  clears: 0
};

/**
 * Genera clave de caché
 */
function buildKey(guildId, resourceId) {
  return `${guildId}:${resourceId}`;
}

/**
 * Obtiene dato de caché
 * @param {string} type - Tipo de caché
 * @param {string} guildId - ID del guild
 * @param {string} resourceId - ID del recurso
 */
function get(type, guildId, resourceId) {
  const cache = caches[type];
  if (!cache) return null;

  const key = buildKey(guildId, resourceId);
  const entry = cache.get(key);

  if (!entry) {
    stats.misses++;
    return null;
  }

  // Verificar si expiró
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    stats.evictions++;
    return null;
  }

  // Actualizar LRU (mover al final)
  cache.delete(key);
  cache.set(key, entry);

  stats.hits++;
  return entry.data;
}

/**
 * Guarda dato en caché
 * @param {string} type - Tipo de caché
 * @param {string} guildId - ID del guild
 * @param {string} resourceId - ID del recurso
 * @param {*} data - Dato a guardar
 * @param {number} customTtl - TTL personalizado (ms)
 */
function set(type, guildId, resourceId, data, customTtl = null) {
  const cache = caches[type];
  if (!cache) return false;

  const key = buildKey(guildId, resourceId);
  const ttl = customTtl || DEFAULT_TTL[type] || 60000;

  // Evicción LRU si se excede el límite
  if (cache.size >= MAX_SIZE[type]) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) {
      cache.delete(firstKey);
      stats.evictions++;
    }
  }

  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
    createdAt: Date.now()
  });

  return true;
}

/**
 * Invalida entrada de caché
 */
function invalidate(type, guildId, resourceId) {
  const cache = caches[type];
  if (!cache) return false;

  const key = buildKey(guildId, resourceId);
  return cache.delete(key);
}

/**
 * Invalida todo un guild
 */
function invalidateGuild(guildId) {
  let count = 0;
  for (const type of Object.keys(caches)) {
    const cache = caches[type];
    for (const key of cache.keys()) {
      if (key.startsWith(`${guildId}:`)) {
        cache.delete(key);
        count++;
      }
    }
  }
  return count;
}

/**
 * Limpia todo el caché
 */
function clearAll() {
  for (const cache of Object.values(caches)) {
    cache.clear();
  }
  stats.clears++;
}

/**
 * Limpia entradas expiradas
 */
function cleanup() {
  const now = Date.now();
  let cleaned = 0;

  for (const cache of Object.values(caches)) {
    for (const [key, entry] of cache.entries()) {
      if (now > entry.expiresAt) {
        cache.delete(key);
        cleaned++;
      }
    }
  }

  return cleaned;
}

/**
 * Obtiene estadísticas del caché
 */
function getStats() {
  const sizes = {};
  for (const [type, cache] of Object.entries(caches)) {
    sizes[type] = cache.size;
  }

  const totalRequests = stats.hits + stats.misses;
  const hitRate = totalRequests > 0 ? (stats.hits / totalRequests) * 100 : 0;

  return {
    sizes,
    totalSize: Object.values(sizes).reduce((a, b) => a + b, 0),
    limits: MAX_SIZE,
    hits: stats.hits,
    misses: stats.misses,
    evictions: stats.evictions,
    clears: stats.clears,
    hitRate: Math.round(hitRate * 100) / 100
  };
}

/**
 * Wrapper para obtener miembro con caché
 */
async function getMember(guild, userId, options = {}) {
  const cached = get("members", guild.id, userId);
  if (cached && !options.skipCache) return cached;

  try {
    const member = await guild.members.fetch(userId);
    if (member) {
      set("members", guild.id, userId, member, options.ttl);
    }
    return member;
  } catch {
    return null;
  }
}

/**
 * Wrapper para obtener canal con caché
 */
async function getChannel(guild, channelId, options = {}) {
  const cached = get("channels", guild.id, channelId);
  if (cached && !options.skipCache) return cached;

  try {
    const channel = await guild.channels.fetch(channelId);
    if (channel) {
      set("channels", guild.id, channelId, channel, options.ttl);
    }
    return channel;
  } catch {
    return null;
  }
}

/**
 * Wrapper para obtener rol con caché
 */
async function getRole(guild, roleId, options = {}) {
  const cached = get("roles", guild.id, roleId);
  if (cached && !options.skipCache) return cached;

  try {
    const role = await guild.roles.fetch(roleId);
    if (role) {
      set("roles", guild.id, roleId, role, options.ttl);
    }
    return role;
  } catch {
    return null;
  }
}

/**
 * Wrapper para obtener guild con caché
 */
async function getGuild(client, guildId, options = {}) {
  const cached = get("guilds", "global", guildId);
  if (cached && !options.skipCache) return cached;

  try {
    const guild = await client.guilds.fetch(guildId);
    if (guild) {
      set("guilds", "global", guildId, guild, options.ttl);
    }
    return guild;
  } catch {
    return null;
  }
}

/**
 * Wrapper genérico con caché
 */
async function withCache(type, guildId, key, fetchFn, options = {}) {
  const cached = get(type, guildId, key);
  if (cached && !options.skipCache) return cached;

  try {
    const data = await fetchFn();
    if (data) {
      set(type, guildId, key, data, options.ttl);
    }
    return data;
  } catch (error) {
    if (options.throwOnError) throw error;
    return null;
  }
}

module.exports = {
  // Core functions
  get,
  set,
  invalidate,
  invalidateGuild,
  clearAll,
  cleanup,
  getStats,

  // Discord API wrappers
  getMember,
  getChannel,
  getRole,
  getGuild,
  withCache,

  // Constants
  DEFAULT_TTL,
  MAX_SIZE
};
