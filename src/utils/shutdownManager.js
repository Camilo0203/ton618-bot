"use strict";

/**
 * Graceful Shutdown Manager
 * Maneja cierre ordenado del bot con tracker de operaciones activas
 */

const { logStructured } = require("./observability");

// Estado del shutdown
const SHUTDOWN_STATE = {
  IDLE: "idle",
  STARTING: "starting",
  DRAINING: "draining",
  CLOSING: "closing",
  COMPLETE: "complete"
};

let currentState = SHUTDOWN_STATE.IDLE;
let shutdownStartTime = 0;
let shutdownResolve = null;

// Tracker de operaciones activas
const activeOperations = new Map();
let operationCounter = 0;

// Configuración
const CONFIG = {
  drainTimeoutMs: parseInt(process.env.SHUTDOWN_DRAIN_TIMEOUT_MS) || 10000,
  forceTimeoutMs: parseInt(process.env.SHUTDOWN_FORCE_TIMEOUT_MS) || 30000,
  maxActiveOperations: 100
};

/**
 * Registra una operación activa
 * @param {string} type - Tipo de operación
 * @param {string} details - Detalles de la operación
 * @returns {string} ID de la operación
 */
function registerOperation(type, details = {}) {
  if (currentState !== SHUTDOWN_STATE.IDLE) {
    throw new Error(`Cannot register new operations during ${currentState}`);
  }

  const id = `${type}_${++operationCounter}_${Date.now()}`;
  activeOperations.set(id, {
    type,
    details,
    startedAt: Date.now()
  });

  // Cleanup si hay demasiadas operaciones
  if (activeOperations.size > CONFIG.maxActiveOperations) {
    cleanupOldOperations();
  }

  return id;
}

/**
 * Marca una operación como completada
 * @param {string} operationId - ID de la operación
 */
function completeOperation(operationId) {
  activeOperations.delete(operationId);
}

/**
 * Limpia operaciones antiguas (más de 5 minutos)
 */
function cleanupOldOperations() {
  const cutoff = Date.now() - 300000;
  let cleaned = 0;

  for (const [id, op] of activeOperations.entries()) {
    if (op.startedAt < cutoff) {
      activeOperations.delete(id);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    logStructured("warn", "shutdown.cleanup_operations", { cleaned });
  }
}

/**
 * Obtiene estadísticas de operaciones activas
 */
function getActiveOperations() {
  const byType = {};
  const now = Date.now();

  for (const [id, op] of activeOperations.entries()) {
    byType[op.type] = byType[op.type] || [];
    byType[op.type].push({
      id,
      durationMs: now - op.startedAt,
      details: op.details
    });
  }

  return {
    total: activeOperations.size,
    byType,
    state: currentState
  };
}

/**
 * Inicia proceso de shutdown graceful
 * @param {Object} options - Opciones de shutdown
 * @returns {Promise} Promesa que se resuelve cuando el shutdown completa
 */
async function initiateShutdown(options = {}) {
  if (currentState !== SHUTDOWN_STATE.IDLE) {
    logStructured("warn", "shutdown.already_in_progress", { state: currentState });
    return Promise.resolve({ state: currentState, alreadyRunning: true });
  }

  currentState = SHUTDOWN_STATE.STARTING;
  shutdownStartTime = Date.now();

  const reason = options.reason || "unknown";
  const signal = options.signal || "none";

  logStructured("info", "shutdown.initiated", {
    reason,
    signal,
    activeOperations: activeOperations.size,
    config: CONFIG
  });

  return new Promise((resolve) => {
    shutdownResolve = resolve;
    runShutdownSequence();
  });
}

/**
 * Ejecuta secuencia de shutdown
 */
async function runShutdownSequence() {
  try {
    // Fase 1: Drain (esperar operaciones activas)
    currentState = SHUTDOWN_STATE.DRAINING;
    await drainPhase();

    // Fase 2: Cerrar conexiones
    currentState = SHUTDOWN_STATE.CLOSING;
    await closingPhase();

    // Fase 3: Completo
    currentState = SHUTDOWN_STATE.COMPLETE;
    completeShutdown();
  } catch (error) {
    logStructured("error", "shutdown.error", {
      error: error.message,
      state: currentState
    });
    forceShutdown();
  }
}

/**
 * Fase de drain: esperar operaciones activas
 */
async function drainPhase() {
  const startTime = Date.now();
  const timeout = CONFIG.drainTimeoutMs;

  logStructured("info", "shutdown.drain_start", {
    activeOperations: activeOperations.size,
    timeoutMs: timeout
  });

  while (activeOperations.size > 0 && (Date.now() - startTime) < timeout) {
    const ops = getActiveOperations();
    logStructured("info", "shutdown.drain_wait", {
      remaining: ops.total,
      byType: Object.keys(ops.byType)
    });

    // Esperar un poco antes de chequear de nuevo
    await sleep(1000);
  }

  const remaining = activeOperations.size;
  const elapsed = Date.now() - startTime;

  if (remaining > 0) {
    logStructured("warn", "shutdown.drain_timeout", {
      remaining,
      elapsedMs: elapsed,
      forced: true
    });
  } else {
    logStructured("info", "shutdown.drain_complete", {
      elapsedMs: elapsed
    });
  }
}

/**
 * Fase de cierre: cerrar conexiones
 */
async function closingPhase() {
  logStructured("info", "shutdown.closing_start");

  // Aquí se pueden agregar limpiezas específicas
  // Por ejemplo: cerrar conexiones a DB, detener cron jobs, etc.

  logStructured("info", "shutdown.closing_complete");
}

/**
 * Completa el shutdown
 */
function completeShutdown() {
  const totalElapsed = Date.now() - shutdownStartTime;

  logStructured("info", "shutdown.complete", {
    totalElapsedMs: totalElapsed,
    finalState: currentState
  });

  if (shutdownResolve) {
    shutdownResolve({
      state: currentState,
      elapsedMs: totalElapsed,
      success: true
    });
  }
}

/**
 * Forzar shutdown inmediato
 */
function forceShutdown() {
  logStructured("error", "shutdown.forced", {
    activeOperations: activeOperations.size
  });

  activeOperations.clear();

  if (shutdownResolve) {
    shutdownResolve({
      state: SHUTDOWN_STATE.COMPLETE,
      forced: true,
      success: false
    });
  }
}

/**
 * Wrapper para ejecutar función con tracking
 */
async function withShutdownTracking(type, details, fn) {
  const opId = registerOperation(type, details);

  try {
    const result = await fn();
    return result;
  } finally {
    completeOperation(opId);
  }
}

/**
 * Middleware para interacciones que rechaza durante shutdown
 */
function shutdownMiddleware(interactionHandler) {
  return async function(interaction) {
    if (currentState !== SHUTDOWN_STATE.IDLE) {
      // Bot está cerrando, rechazar operación
      try {
        await interaction.reply({
          content: "⚠️ El bot se está reiniciando. Por favor intenta en unos segundos.",
          flags: 64
        });
      } catch {
        // Ignorar errores al responder
      }
      return;
    }

    return interactionHandler(interaction);
  };
}

/**
 * Helper sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene estado actual del shutdown
 */
function getShutdownState() {
  return {
    state: currentState,
    activeOperations: activeOperations.size,
    uptime: Date.now() - shutdownStartTime,
    config: CONFIG
  };
}

/**
 * Verifica si el bot está en proceso de cierre
 */
function isShuttingDown() {
  return currentState !== SHUTDOWN_STATE.IDLE;
}

module.exports = {
  // Core functions
  initiateShutdown,
  registerOperation,
  completeOperation,
  getActiveOperations,
  getShutdownState,
  isShuttingDown,
  withShutdownTracking,
  shutdownMiddleware,

  // Constants
  SHUTDOWN_STATE,
  CONFIG
};
