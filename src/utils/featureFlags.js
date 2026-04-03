"use strict";

/**
 * Feature Flags System - Control de características por guild y rollout gradual
 * Permite activar/desactivar features sin redeploy y hacer rollout gradual.
 */

const { getDB } = require("./database/core");
const { logStructured } = require("./observability");

// Cache en memoria de flags (guildId -> flagName -> flagData)
const flagCache = new Map();
const CACHE_TTL_MS = 60000; // 1 minuto cache

// Flag global para desarrollo (desactivado en producción por defecto)
const GLOBAL_DEV_FLAGS = new Map();

/**
 * Obtiene la colección de featureFlags
 */
function getFeatureFlagsCollection() {
  return getDB().collection("featureFlags");
}

/**
 * Crea o actualiza un feature flag
 */
async function setFeatureFlag(flagName, config = {}) {
  const collection = getFeatureFlagsCollection();
  const now = new Date();

  const doc = {
    flag_name: flagName,
    enabled: config.enabled ?? false,
    rollout_percentage: Math.max(0, Math.min(100, config.rollout_percentage ?? 0)),
    allowed_guilds: Array.isArray(config.allowed_guilds) ? config.allowed_guilds : [],
    blocked_guilds: Array.isArray(config.blocked_guilds) ? config.blocked_guilds : [],
    metadata: config.metadata || {},
    updated_at: now,
    created_at: now,
  };

  await collection.updateOne(
    { flag_name: flagName },
    { $set: doc, $setOnInsert: { created_at: now } },
    { upsert: true }
  );

  // Invalidar cache
  invalidateFlagCache(flagName);

  logStructured("info", "feature_flag.set", {
    flag: flagName,
    enabled: doc.enabled,
    rollout: doc.rollout_percentage,
  });

  return doc;
}

/**
 * Obtiene un feature flag por nombre
 */
async function getFeatureFlag(flagName) {
  // Check cache primero
  const cached = getCachedFlag(flagName, "_global");
  if (cached) return cached;

  const collection = getFeatureFlagsCollection();
  const flag = await collection.findOne({ flag_name: flagName });

  if (flag) {
    cacheFlag(flagName, "_global", flag);
  }

  return flag;
}

/**
 * Verifica si un feature está habilitado para un guild específico
 */
async function isEnabled(flagName, guildId, context = {}) {
  // 1. Check desarrollo global (solo si está definido)
  if (GLOBAL_DEV_FLAGS.has(flagName)) {
    return GLOBAL_DEV_FLAGS.get(flagName);
  }

  // 2. Obtener flag de DB
  const flag = await getFeatureFlag(flagName);

  // Si no existe el flag, deshabilitado por defecto
  if (!flag) return false;

  // 3. Si está explícitamente bloqueado para este guild
  if (flag.blocked_guilds?.includes(guildId)) {
    logStructured("debug", "feature_flag.blocked", { flag: flagName, guild: guildId });
    return false;
  }

  // 4. Si está en lista de permitidos explícita
  if (flag.allowed_guilds?.includes(guildId)) {
    return true;
  }

  // 5. Si está completamente deshabilitado globalmente
  if (!flag.enabled) {
    return false;
  }

  // 6. Rollout percentage - determinístico basado en guildId
  if (flag.rollout_percentage > 0 && flag.rollout_percentage < 100) {
    const inRollout = isGuildInRollout(guildId, flagName, flag.rollout_percentage);
    logStructured("debug", "feature_flag.rollout_check", {
      flag: flagName,
      guild: guildId,
      percentage: flag.rollout_percentage,
      inRollout,
    });
    return inRollout;
  }

  // 7. 100% rollout o enabled global
  return true;
}

/**
 * Determina si un guild está dentro del rollout percentage
 * Usa hash determinístico del guildId + flagName para consistencia
 */
function isGuildInRollout(guildId, flagName, percentage) {
  // Simple hash function para consistencia
  const str = `${guildId}:${flagName}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit
  }
  const normalized = Math.abs(hash) % 100;
  return normalized < percentage;
}

/**
 * Lista todos los feature flags
 */
async function listFeatureFlags() {
  const collection = getFeatureFlagsCollection();
  return collection.find({}).sort({ updated_at: -1 }).toArray();
}

/**
 * Elimina un feature flag
 */
async function deleteFeatureFlag(flagName) {
  const collection = getFeatureFlagsCollection();
  await collection.deleteOne({ flag_name: flagName });
  invalidateFlagCache(flagName);

  logStructured("info", "feature_flag.deleted", { flag: flagName });
  return true;
}

/**
 * Obtiene estado de todos los flags para un guild específico
 */
async function getGuildFlagStatus(guildId) {
  const flags = await listFeatureFlags();
  const status = {};

  for (const flag of flags) {
    status[flag.flag_name] = await isEnabled(flag.flag_name, guildId);
  }

  return status;
}

/**
 * Toggle un flag para desarrollo local (sin persistir en DB)
 * Útil para testing
 */
function setDevFlag(flagName, enabled) {
  GLOBAL_DEV_FLAGS.set(flagName, enabled);
  logStructured("info", "feature_flag.dev_set", { flag: flagName, enabled });
}

function clearDevFlags() {
  GLOBAL_DEV_FLAGS.clear();
}

// Cache functions
function getCachedFlag(flagName, guildId) {
  const key = `${flagName}:${guildId}`;
  const cached = flagCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    flagCache.delete(key);
    return null;
  }

  return cached.data;
}

function cacheFlag(flagName, guildId, data) {
  const key = `${flagName}:${guildId}`;
  flagCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

function invalidateFlagCache(flagName) {
  for (const key of flagCache.keys()) {
    if (key.startsWith(`${flagName}:`)) {
      flagCache.delete(key);
    }
  }
}

function clearFlagCache() {
  flagCache.clear();
}

/**
 * Wrapper para ejecutar código condicional basado en feature flag
 */
async function withFeatureFlag(flagName, guildId, fnEnabled, fnDisabled = null) {
  const enabled = await isEnabled(flagName, guildId);

  if (enabled && fnEnabled) {
    return fnEnabled();
  } else if (!enabled && fnDisabled) {
    return fnDisabled();
  }

  return null;
}

module.exports = {
  // Core functions
  setFeatureFlag,
  getFeatureFlag,
  isEnabled,
  deleteFeatureFlag,
  listFeatureFlags,
  getGuildFlagStatus,

  // Dev helpers
  setDevFlag,
  clearDevFlags,

  // Cache management
  clearFlagCache,

  // Wrapper
  withFeatureFlag,
};
