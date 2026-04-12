"use strict";

/**
 * Memory Pressure Manager
 * Monitorea uso de memoria y activa modo de emergencia ante presión
 */

const { logStructured } = require("./observability");
const { clearFlagCache } = require("./featureFlags");
const v8 = require("v8");

// Umbrales de memoria (porcentaje del heap total)
const THRESHOLDS = {
  WARNING: 0.7,   // 70% - Advertencia
  CRITICAL: 0.85, // 85% - Modo emergencia
  EMERGENCY: 0.95 // 95% - Solo operaciones críticas
};

// Estados del memory manager
const STATE = {
  NORMAL: "normal",
  WARNING: "warning",
  CRITICAL: "critical",
  EMERGENCY: "emergency"
};

let currentState = STATE.NORMAL;
let checkInterval = null;
let lastAlertTime = 0;
const ALERT_COOLDOWN_MS = 60000; // 1 minuto entre alertas

/**
 * Obtiene estadísticas de memoria actual
 */
function getMemoryStats() {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const rssMB = Math.round(usage.rss / 1024 / 1024);
  const externalMB = Math.round((usage.external || 0) / 1024 / 1024);

  const heapLimitMB = Math.round(v8.getHeapStatistics().heap_size_limit / 1024 / 1024);
  const heapUsedPercent = heapLimitMB > 0 ? heapUsedMB / heapLimitMB : 0;

  return {
    heapUsedMB,
    heapTotalMB,
    rssMB,
    externalMB,
    heapUsedPercent,
    state: currentState
  };
}

/**
 * Determina el estado basado en uso de memoria
 */
function determineState(heapUsedPercent) {
  if (heapUsedPercent >= THRESHOLDS.EMERGENCY) return STATE.EMERGENCY;
  if (heapUsedPercent >= THRESHOLDS.CRITICAL) return STATE.CRITICAL;
  if (heapUsedPercent >= THRESHOLDS.WARNING) return STATE.WARNING;
  return STATE.NORMAL;
}

/**
 * Acciones a tomar en modo warning
 */
function handleWarning(stats) {
  logStructured("warn", "memory.warning", {
    heapUsedMB: stats.heapUsedMB,
    heapTotalMB: stats.heapTotalMB,
    heapUsedPercent: Math.round(stats.heapUsedPercent * 100)
  });

  // Sugerir garbage collection (si está disponible)
  if (global.gc) {
    global.gc();
    logStructured("info", "memory.gc_suggested");
  }
}

/**
 * Acciones a tomar en modo crítico
 */
function handleCritical(stats) {
  const now = Date.now();

  // Solo alertar una vez por cooldown
  if (now - lastAlertTime > ALERT_COOLDOWN_MS) {
    logStructured("error", "memory.critical", {
      heapUsedMB: stats.heapUsedMB,
      heapTotalMB: stats.heapTotalMB,
      heapUsedPercent: Math.round(stats.heapUsedPercent * 100),
      message: "Memory usage critical - entering emergency mode"
    });
    lastAlertTime = now;
  }

  // Limpiar caches
  clearFlagCache();

  // Forzar garbage collection si disponible
  if (global.gc) {
    global.gc();
  }
}

/**
 * Acciones a tomar en modo emergencia
 */
function handleEmergency(stats) {
  logStructured("error", "memory.emergency", {
    heapUsedMB: stats.heapUsedMB,
    heapTotalMB: stats.heapTotalMB,
    heapUsedPercent: Math.round(stats.heapUsedPercent * 100),
    message: "Memory usage EMERGENCY - rejecting non-critical operations"
  });

  // Aquí podríamos notificar al owner via webhook
  // Esto se implementaría en una siguiente iteración
}

/**
 * Check de memoria periódico
 */
function checkMemory() {
  const stats = getMemoryStats();
  const newState = determineState(stats.heapUsedPercent);

  // Si el estado empeora, actuar inmediatamente
  if (newState !== currentState) {
    const oldState = currentState;
    currentState = newState;

    logStructured("info", "memory.state_change", {
      from: oldState,
      to: newState,
      heapUsedPercent: Math.round(stats.heapUsedPercent * 100)
    });

    switch (newState) {
      case STATE.WARNING:
        handleWarning(stats);
        break;
      case STATE.CRITICAL:
        handleCritical(stats);
        break;
      case STATE.EMERGENCY:
        handleEmergency(stats);
        break;
    }
  }

  return stats;
}

/**
 * Inicia monitoreo de memoria
 */
function startMemoryMonitor(options = {}) {
  const intervalMs = options.intervalMs || 30000; // 30 segundos por defecto

  if (checkInterval) {
    clearInterval(checkInterval);
  }

  checkInterval = setInterval(checkMemory, intervalMs);

  logStructured("debug", "memory.monitor_started", {
    intervalMs,
    thresholds: THRESHOLDS
  });

  // Check inicial
  checkMemory();
}

/**
 * Detiene monitoreo
 */
function stopMemoryMonitor() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

/**
 * Verifica si se permite una operación basado en estado de memoria
 */
function isOperationAllowed(operationType = "normal") {
  switch (currentState) {
    case STATE.EMERGENCY:
      // Solo operaciones críticas
      return operationType === "critical";
    case STATE.CRITICAL:
      // No permitir operaciones pesadas (transcripts, backups)
      return operationType !== "heavy";
    case STATE.WARNING:
    case STATE.NORMAL:
    default:
      return true;
  }
}

/**
 * Wrapper para ejecutar función solo si hay memoria disponible
 */
async function withMemoryCheck(operationType, fn, fallback = null) {
  if (!isOperationAllowed(operationType)) {
    logStructured("warn", "memory.operation_rejected", {
      operationType,
      currentState,
      reason: "Memory pressure too high"
    });

    if (fallback) {
      return fallback();
    }

    throw new Error(`Operation rejected due to memory pressure: ${operationType}`);
  }

  return fn();
}

/**
 * Obtiene estado actual
 */
function getMemoryState() {
  return {
    ...getMemoryStats(),
    thresholds: THRESHOLDS,
    isEmergency: currentState === STATE.EMERGENCY,
    isCritical: currentState === STATE.CRITICAL,
    isWarning: currentState === STATE.WARNING
  };
}

module.exports = {
  startMemoryMonitor,
  stopMemoryMonitor,
  getMemoryStats,
  getMemoryState,
  isOperationAllowed,
  withMemoryCheck,
  THRESHOLDS,
  STATE
};
