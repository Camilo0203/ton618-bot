"use strict";

/**
 * Cron Circuit Breaker - Protección para jobs programadas
 * Evita que errores en crons causen procesamiento acumulado
 */

const { logStructured } = require("./observability");
const { CircuitBreaker, STATE } = require("./circuitBreaker");

const cronBreakers = new Map();

function getOrCreateBreaker(cronName, options = {}) {
  if (!cronBreakers.has(cronName)) {
    const breaker = new CircuitBreaker(`cron-${cronName}`, {
      failureThreshold: options.failureThreshold || 3,
      successThreshold: options.successThreshold || 1,
      timeoutMs: options.timeoutMs || 60000,
    });
    cronBreakers.set(cronName, breaker);
  }
  return cronBreakers.get(cronName);
}

async function runCronWithProtection(cronName, fn, options = {}) {
  const breaker = getOrCreateBreaker(cronName, options);
  
  try {
    const result = await breaker.execute(fn, { cronName });
    logStructured("info", `cron.${cronName}.success`, { success: true });
    return result;
  } catch (error) {
    logStructured("error", `cron.${cronName}.failed`, { error: error.message });
    throw error;
  }
}

function getCronBreakerStatus(cronName) {
  const breaker = cronBreakers.get(cronName);
  if (!breaker) return null;
  
  return {
    state: breaker.state,
    stats: breaker.stats,
  };
}

function getAllCronStatuses() {
  const statuses = {};
  for (const [name, breaker] of cronBreakers.entries()) {
    statuses[name] = {
      state: breaker.state,
      totalCalls: breaker.stats.totalCalls,
    };
  }
  return statuses;
}

function resetCronBreaker(cronName) {
  const breaker = cronBreakers.get(cronName);
  if (breaker) {
    breaker.failureCount = 0;
    breaker.successCount = 0;
    breaker.state = STATE.CLOSED;
    logStructured("info", `cron.${cronName}.reset`);
  }
}

module.exports = {
  getOrCreateBreaker,
  runCronWithProtection,
  getCronBreakerStatus,
  getAllCronStatuses,
  resetCronBreaker,
  STATE,
};