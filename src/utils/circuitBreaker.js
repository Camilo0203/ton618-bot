"use strict";

/**
 * Circuit Breaker Pattern - Protección contra cascada de fallos
 * Evita que errores repetidos en servicios externos (Discord API, MongoDB)
 * causen sobrecarga y degradación del sistema.
 */

const { logStructured } = require("./observability");

// Estados del circuit breaker
const STATE = {
  CLOSED: "CLOSED",      // Funcionamiento normal
  OPEN: "OPEN",          // Circuito abierto, rechazando requests
  HALF_OPEN: "HALF_OPEN" // Probando si el servicio se recuperó
};

// Configuración por defecto
const DEFAULT_CONFIG = {
  failureThreshold: 5,        // Fallos antes de abrir
  successThreshold: 2,        // Éxitos para cerrar en half-open
  timeoutMs: 30000,           // Tiempo antes de intentar half-open
  halfOpenMaxCalls: 3,        // Máximo requests en half-open
};

// Store de circuit breakers por nombre
const breakers = new Map();

class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.config = { ...DEFAULT_CONFIG, ...options };
    this.state = STATE.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenCalls = 0;
    this.lastFailureTime = null;
    this.nextAttempt = Date.now();
    this.stats = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      rejectedCalls: 0,
      stateChanges: 0,
    };
  }

  async execute(fn, context = {}) {
    this.stats.totalCalls++;

    // Si el circuito está ABIERTO, rechazar inmediatamente
    if (this.state === STATE.OPEN) {
      if (Date.now() < this.nextAttempt) {
        this.stats.rejectedCalls++;
        throw new CircuitBreakerOpenError(
          `Circuit breaker "${this.name}" is OPEN. Try again after ${new Date(this.nextAttempt).toISOString()}`
        );
      }
      // Tiempo transcurrido, pasar a HALF_OPEN
      this.transitionTo(STATE.HALF_OPEN);
    }

    // En HALF_OPEN, limitar número de requests
    if (this.state === STATE.HALF_OPEN) {
      if (this.halfOpenCalls >= this.config.halfOpenMaxCalls) {
        this.stats.rejectedCalls++;
        throw new CircuitBreakerOpenError(
          `Circuit breaker "${this.name}" HALF_OPEN limit reached. Waiting for results...`
        );
      }
      this.halfOpenCalls++;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error, context);
      throw error;
    }
  }

  onSuccess() {
    this.stats.successfulCalls++;

    if (this.state === STATE.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.transitionTo(STATE.CLOSED);
      }
    } else if (this.state === STATE.CLOSED) {
      // Resetear contador de fallos en éxito
      this.failureCount = 0;
    }
  }

  onFailure(error, context = {}) {
    this.stats.failedCalls++;
    this.failureCount++;
    this.lastFailureTime = Date.now();

    // Logging estructurado del fallo
    logStructured("warning", "circuit_breaker.failure", {
      breaker: this.name,
      state: this.state,
      failureCount: this.failureCount,
      threshold: this.config.failureThreshold,
      error: error?.message || "Unknown error",
      context,
    });

    if (this.state === STATE.HALF_OPEN) {
      // Un fallo en half-open vuelve a abrir inmediatamente
      this.transitionTo(STATE.OPEN);
    } else if (this.state === STATE.CLOSED && this.failureCount >= this.config.failureThreshold) {
      this.transitionTo(STATE.OPEN);
    }
  }

  transitionTo(newState) {
    if (this.state === newState) return;

    const oldState = this.state;
    this.state = newState;
    this.stats.stateChanges++;

    if (newState === STATE.OPEN) {
      this.nextAttempt = Date.now() + this.config.timeoutMs;
      this.halfOpenCalls = 0;
      this.successCount = 0;
    } else if (newState === STATE.CLOSED) {
      this.failureCount = 0;
      this.halfOpenCalls = 0;
      this.successCount = 0;
    } else if (newState === STATE.HALF_OPEN) {
      this.halfOpenCalls = 0;
      this.successCount = 0;
    }

    logStructured("info", "circuit_breaker.state_change", {
      breaker: this.name,
      from: oldState,
      to: newState,
      nextAttempt: this.state === STATE.OPEN ? new Date(this.nextAttempt).toISOString() : null,
    });
  }

  getState() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      halfOpenCalls: this.halfOpenCalls,
      lastFailureTime: this.lastFailureTime,
      nextAttempt: this.nextAttempt,
      isOpen: this.state === STATE.OPEN,
      isHalfOpen: this.state === STATE.HALF_OPEN,
      isClosed: this.state === STATE.CLOSED,
      stats: { ...this.stats },
      config: { ...this.config },
    };
  }

  forceOpen() {
    this.transitionTo(STATE.OPEN);
  }

  forceClose() {
    this.transitionTo(STATE.CLOSED);
  }
}

class CircuitBreakerOpenError extends Error {
  constructor(message) {
    super(message);
    this.name = "CircuitBreakerOpenError";
    this.code = "CIRCUIT_OPEN";
  }
}

// Factory functions
function getOrCreateBreaker(name, options = {}) {
  if (!breakers.has(name)) {
    breakers.set(name, new CircuitBreaker(name, options));
  }
  return breakers.get(name);
}

async function circuitBreak(name, fn, options = {}, context = {}) {
  const breaker = getOrCreateBreaker(name, options);
  return breaker.execute(fn, context);
}

function getBreakerState(name) {
  const breaker = breakers.get(name);
  return breaker ? breaker.getState() : null;
}

function getAllBreakerStates() {
  const states = {};
  for (const [name, breaker] of breakers) {
    states[name] = breaker.getState();
  }
  return states;
}

function forceBreakerState(name, state) {
  const breaker = getOrCreateBreaker(name);
  if (state === STATE.OPEN) breaker.forceOpen();
  else if (state === STATE.CLOSED) breaker.forceClose();
}

function resetAllBreakers() {
  breakers.clear();
}

// Pre-configured breakers para servicios comunes
const DISCORD_API_BREAKER = "discord-api";
const MONGODB_BREAKER = "mongodb";
const WEBHOOK_BREAKER = "webhook";
const EXTERNAL_API_BREAKER = "external-api";

module.exports = {
  CircuitBreaker,
  CircuitBreakerOpenError,
  STATE,
  circuitBreak,
  getOrCreateBreaker,
  getBreakerState,
  getAllBreakerStates,
  forceBreakerState,
  resetAllBreakers,
  // Pre-configured names
  DISCORD_API_BREAKER,
  MONGODB_BREAKER,
  WEBHOOK_BREAKER,
  EXTERNAL_API_BREAKER,
};
