const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getMemoryStats,
  getMemoryState,
  isOperationAllowed,
  withMemoryCheck,
  startMemoryMonitor,
  stopMemoryMonitor,
  THRESHOLDS,
  STATE,
} = require("../src/utils/memoryManager");

test.afterEach(() => {
  stopMemoryMonitor();
});

test("memoryManager retorna estadisticas de memoria coherentes", () => {
  const stats = getMemoryStats();

  assert.equal(typeof stats.heapUsedMB, "number");
  assert.equal(typeof stats.heapTotalMB, "number");
  assert.equal(typeof stats.rssMB, "number");
  assert.equal(typeof stats.externalMB, "number");
  assert.equal(Object.values(STATE).includes(stats.state), true);
});

test("memoryManager expone estado enriquecido y thresholds", () => {
  const state = getMemoryState();

  assert.equal(typeof state.isEmergency, "boolean");
  assert.equal(typeof state.isCritical, "boolean");
  assert.equal(typeof state.isWarning, "boolean");
  assert.deepEqual(state.thresholds, THRESHOLDS);
  assert.equal(THRESHOLDS.WARNING, 0.7);
  assert.equal(THRESHOLDS.CRITICAL, 0.85);
  assert.equal(THRESHOLDS.EMERGENCY, 0.95);
});

test("memoryManager permite operaciones normales cuando no hay presion", async () => {
  assert.equal(isOperationAllowed("normal"), true);

  const result = await withMemoryCheck("normal", async () => "ok");
  assert.equal(result, "ok");
});

test("memoryManager ejecuta fallback cuando una operacion se rechaza", async () => {
  const result = await withMemoryCheck("normal", async () => "ok", async () => "fallback");
  assert.equal(result, "ok");
});

test("memoryManager inicia y detiene el monitor sin lanzar errores", () => {
  startMemoryMonitor({ intervalMs: 1_000 });
  stopMemoryMonitor();
  stopMemoryMonitor();
});
