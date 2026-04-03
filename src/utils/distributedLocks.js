"use strict";

/**
 * Distributed Lock Manager
 * Sistema de locks distribuidos usando MongoDB como coordinador
 * Útil para sharding o múltiples instancias del bot
 */

const databaseCore = require("./database/core");
const { logStructured } = require("./observability");

// Configuración
const CONFIG = {
  defaultLockTimeoutMs: parseInt(process.env.LOCK_TIMEOUT_MS) || 30000,
  heartbeatIntervalMs: parseInt(process.env.LOCK_HEARTBEAT_MS) || 10000,
  maxLockDurationMs: parseInt(process.env.MAX_LOCK_DURATION_MS) || 60000,
  instanceId: process.env.INSTANCE_ID || `instance_${process.pid}_${Date.now()}`,
};

// Locks locales activos (para heartbeats)
const localLocks = new Map();
let heartbeatInterval = null;

function getDb() {
  try {
    if (typeof databaseCore.getDb === "function") return databaseCore.getDb();
    if (typeof databaseCore.getDB === "function") return databaseCore.getDB();
  } catch {
    return null;
  }
  return null;
}

/**
 * Adquiere un lock distribuido
 * @param {string} lockName - Nombre del lock
 * @param {Object} options - Opciones
 * @returns {Promise<Object>} Lock info o null si no se pudo adquirir
 */
async function acquireLock(lockName, options = {}) {
  const db = getDb();
  if (!db) {
    throw new Error("Database not connected - cannot acquire distributed lock");
  }

  const collection = db.collection("distributedLocks");
  const timeoutMs = options.timeoutMs || CONFIG.defaultLockTimeoutMs;
  const expiresAt = new Date(Date.now() + timeoutMs);

  const lockDoc = {
    lock_name: lockName,
    instance_id: CONFIG.instanceId,
    acquired_at: new Date(),
    expires_at: expiresAt,
    metadata: options.metadata || {},
    version: 1,
  };

  try {
    // Intentar insertar - si ya existe, falla
    await collection.insertOne(lockDoc);

    // Guardar en locks locales para heartbeat
    localLocks.set(lockName, {
      acquiredAt: Date.now(),
      timeoutMs,
      metadata: options.metadata,
    });

    logStructured("info", "lock.acquired", {
      lockName,
      instanceId: CONFIG.instanceId,
      timeoutMs,
    });

    return {
      name: lockName,
      acquired: true,
      instanceId: CONFIG.instanceId,
      expiresAt,
    };
  } catch (error) {
    if (error.code === 11000) { // Duplicate key
      // Lock ya existe, verificar si expiró
      const existing = await collection.findOne({ lock_name: lockName });

      if (existing && existing.expires_at < new Date()) {
        // Lock expirado, tomarlo
        const result = await collection.findOneAndUpdate(
          { lock_name: lockName, expires_at: existing.expires_at },
          {
            $set: {
              instance_id: CONFIG.instanceId,
              acquired_at: new Date(),
              expires_at: expiresAt,
              metadata: options.metadata || {},
              version: (existing.version || 0) + 1,
            },
          },
          { returnDocument: "after" }
        );

        if (result) {
          localLocks.set(lockName, {
            acquiredAt: Date.now(),
            timeoutMs,
            metadata: options.metadata,
          });

          logStructured("info", "lock.acquired_expired", {
            lockName,
            instanceId: CONFIG.instanceId,
            previousInstance: existing.instance_id,
          });

          return {
            name: lockName,
            acquired: true,
            instanceId: CONFIG.instanceId,
            expiresAt: expiresAt,
            wasExpired: true,
          };
        }
      }

      logStructured("debug", "lock.busy", {
        lockName,
        heldBy: existing?.instance_id,
        expiresAt: existing?.expires_at,
      });

      return {
        name: lockName,
        acquired: false,
        heldBy: existing?.instance_id,
        expiresAt: existing?.expires_at,
      };
    }

    throw error;
  }
}

/**
 * Libera un lock
 * @param {string} lockName - Nombre del lock
 */
async function releaseLock(lockName) {
  const db = getDb();
  if (!db) return false;

  const collection = db.collection("distributedLocks");

  const result = await collection.deleteOne({
    lock_name: lockName,
    instance_id: CONFIG.instanceId,
  });

  localLocks.delete(lockName);

  if (result.deletedCount > 0) {
    logStructured("info", "lock.released", {
      lockName,
      instanceId: CONFIG.instanceId,
    });
    return true;
  }

  return false;
}

/**
 * Renueva un lock (heartbeat)
 * @param {string} lockName - Nombre del lock
 * @param {number} extensionMs - Tiempo adicional
 */
async function extendLock(lockName, extensionMs = null) {
  const db = getDb();
  if (!db) return false;

  const collection = db.collection("distributedLocks");
  const localLock = localLocks.get(lockName);

  if (!localLock) return false;

  const timeoutMs = extensionMs || localLock.timeoutMs;
  const newExpiresAt = new Date(Date.now() + timeoutMs);

  const result = await collection.findOneAndUpdate(
    {
      lock_name: lockName,
      instance_id: CONFIG.instanceId,
    },
    {
      $set: {
        expires_at: newExpiresAt,
        last_extended_at: new Date(),
      },
      $inc: { version: 1 },
    },
    { returnDocument: "after" }
  );

  if (result) {
    localLocks.set(lockName, {
      ...localLock,
      acquiredAt: Date.now(),
      timeoutMs,
    });
    return true;
  }

  return false;
}

/**
 * Ejecuta función con lock automático
 * @param {string} lockName - Nombre del lock
 * @param {Function} fn - Función a ejecutar
 * @param {Object} options - Opciones
 */
async function withLock(lockName, fn, options = {}) {
  const lock = await acquireLock(lockName, options);

  if (!lock.acquired) {
    if (options.waitForLock) {
      // Esperar y reintentar
      const waitMs = options.waitMs || 1000;
      const maxRetries = options.maxRetries || 5;

      for (let i = 0; i < maxRetries; i++) {
        await sleep(waitMs);
        const retry = await acquireLock(lockName, options);
        if (retry.acquired) {
          return executeWithLock(lockName, fn, options);
        }
      }
    }

    throw new Error(`Could not acquire lock: ${lockName} (held by ${lock.heldBy})`);
  }

  return executeWithLock(lockName, fn, options);
}

/**
 * Ejecuta función y libera lock al final
 */
async function executeWithLock(lockName, fn, options) {
  try {
    const result = await fn();
    return result;
  } finally {
    if (!options.keepLock) {
      await releaseLock(lockName).catch(err => {
        logStructured("error", "lock.release_failed", {
          lockName,
          error: err.message,
        });
      });
    }
  }
}

/**
 * Inicia heartbeats para locks locales
 */
function startHeartbeat() {
  if (heartbeatInterval) return;

  heartbeatInterval = setInterval(async () => {
    for (const [lockName, localLock] of localLocks.entries()) {
      try {
        // Verificar si el lock lleva mucho tiempo (posible dead lock)
        const heldDuration = Date.now() - localLock.acquiredAt;
        if (heldDuration > CONFIG.maxLockDurationMs) {
          logStructured("warn", "lock.max_duration_exceeded", {
            lockName,
            heldDurationMs: heldDuration,
            maxDurationMs: CONFIG.maxLockDurationMs,
          });

          // Liberar el lock
          await releaseLock(lockName);
          continue;
        }

        // Extender el lock
        const extended = await extendLock(lockName);
        if (!extended) {
          logStructured("warn", "lock.heartbeat_failed", { lockName });
          localLocks.delete(lockName);
        }
      } catch (error) {
        logStructured("error", "lock.heartbeat_error", {
          lockName,
          error: error.message,
        });
      }
    }
  }, CONFIG.heartbeatIntervalMs);
}

/**
 * Detiene heartbeats
 */
function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

/**
 * Libera todos los locks de esta instancia
 */
async function releaseAllLocks() {
  const db = getDb();
  if (!db) return 0;

  const collection = db.collection("distributedLocks");

  const result = await collection.deleteMany({
    instance_id: CONFIG.instanceId,
  });

  localLocks.clear();

  logStructured("info", "lock.release_all", {
    instanceId: CONFIG.instanceId,
    count: result.deletedCount,
  });

  return result.deletedCount;
}

/**
 * Obtiene información de un lock
 */
async function getLockInfo(lockName) {
  const db = getDb();
  if (!db) return null;

  const collection = db.collection("distributedLocks");
  return await collection.findOne({ lock_name: lockName });
}

/**
 * Lista todos los locks activos
 */
async function listActiveLocks() {
  const db = getDb();
  if (!db) return [];

  const collection = db.collection("distributedLocks");
  return await collection
    .find({ expires_at: { $gt: new Date() } })
    .toArray();
}

/**
 * Limpia locks expirados
 */
async function cleanupExpiredLocks() {
  const db = getDb();
  if (!db) return 0;

  const collection = db.collection("distributedLocks");

  const result = await collection.deleteMany({
    expires_at: { $lt: new Date() },
  });

  if (result.deletedCount > 0) {
    logStructured("info", "lock.cleanup_expired", {
      count: result.deletedCount,
    });
  }

  return result.deletedCount;
}

/**
 * Helper sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene estadísticas
 */
function getStats() {
  return {
    localLocks: localLocks.size,
    instanceId: CONFIG.instanceId,
    config: CONFIG,
  };
}

module.exports = {
  // Core functions
  acquireLock,
  releaseLock,
  extendLock,
  withLock,
  getLockInfo,
  listActiveLocks,
  cleanupExpiredLocks,
  releaseAllLocks,

  // Lifecycle
  startHeartbeat,
  stopHeartbeat,

  // Stats
  getStats,

  // Config
  CONFIG,
};
