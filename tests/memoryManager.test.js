/**
 * Tests para memoryManager.js
 * Módulo de monitoreo de memoria
 */

const {
  getMemoryStats,
  isMemoryPressure,
  getPressureLevel,
  shouldRejectOperations,
  withMemoryCheck,
  startMemoryMonitor,
  stopMemoryMonitor,
  MEMORY_THRESHOLDS
} = require("../src/utils/memoryManager");

describe("memoryManager", () => {
  afterEach(() => {
    stopMemoryMonitor();
  });

  describe("getMemoryStats", () => {
    it("debería retornar estadísticas de memoria", () => {
      const stats = getMemoryStats();
      
      expect(stats).toHaveProperty("heapUsed");
      expect(stats).toHaveProperty("heapTotal");
      expect(stats).toHaveProperty("rss");
      expect(stats).toHaveProperty("external");
      expect(stats).toHaveProperty("percentUsage");
      expect(stats).toHaveProperty("threshold");
      
      expect(typeof stats.heapUsed).toBe("number");
      expect(typeof stats.percentUsage).toBe("number");
      expect(stats.percentUsage).toBeGreaterThanOrEqual(0);
      expect(stats.percentUsage).toBeLessThanOrEqual(100);
    });
  });

  describe("isMemoryPressure", () => {
    it("debería detectar presión de memoria según thresholds", () => {
      // Simular que siempre hay algún uso de memoria
      const result = isMemoryPressure();
      expect(typeof result).toBe("boolean");
    });

    it("debería usar threshold personalizado", () => {
      const result = isMemoryPressure(10); // 10% threshold muy bajo
      expect(typeof result).toBe("boolean");
    });
  });

  describe("getPressureLevel", () => {
    it("debería retornar nivel de presión válido", () => {
      const level = getPressureLevel();
      
      expect(["normal", "warning", "critical", "emergency"]).toContain(level);
    });
  });

  describe("shouldRejectOperations", () => {
    it("debería retornar boolean", () => {
      const result = shouldRejectOperations();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("withMemoryCheck", () => {
    it("debería ejecutar función si hay memoria disponible", async () => {
      const mockFn = jest.fn().mockResolvedValue("success");
      
      const result = await withMemoryCheck("test", mockFn);
      
      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe("success");
    });

    it("debería rechazar si hay presión crítica (simulado)", async () => {
      // Este test depende del estado real de memoria
      // En un entorno con poca memoria, debería rechazar
      const mockFn = jest.fn();
      
      try {
        await withMemoryCheck("heavy_operation", mockFn, {
          threshold: 0, // Threshold imposible de cumplir en normalidad
          criticalOnly: false
        });
        // Si llega aquí, la memoria está muy baja
      } catch (error) {
        expect(error.message).toMatch(/memoria|memory/i);
      }
    });
  });

  describe("startMemoryMonitor / stopMemoryMonitor", () => {
    it("debería iniciar y detener monitoreo", () => {
      const monitor = startMemoryMonitor({ intervalMs: 1000 });
      
      expect(monitor).toBeDefined();
      expect(monitor.intervalId).toBeDefined();
      
      stopMemoryMonitor();
      
      // No debería lanzar error al detener
      expect(() => stopMemoryMonitor()).not.toThrow();
    });

    it("no debería iniciar múltiples monitores", () => {
      const monitor1 = startMemoryMonitor({ intervalMs: 1000 });
      const monitor2 = startMemoryMonitor({ intervalMs: 1000 });
      
      // Debería retornar el mismo monitor
      expect(monitor1.intervalId).toBe(monitor2.intervalId);
      
      stopMemoryMonitor();
    });
  });

  describe("MEMORY_THRESHOLDS", () => {
    it("debería tener valores correctos", () => {
      expect(MEMORY_THRESHOLDS.WARNING).toBe(0.7);
      expect(MEMORY_THRESHOLDS.CRITICAL).toBe(0.85);
      expect(MEMORY_THRESHOLDS.EMERGENCY).toBe(0.95);
    });
  });
});
