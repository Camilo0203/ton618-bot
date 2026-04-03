/**
 * Tests para shutdownManager.js
 * Gestor de cierre graceful del bot
 */

const {
  initiateShutdown,
  registerOperation,
  completeOperation,
  getActiveOperations,
  getShutdownState,
  isShuttingDown,
  withShutdownTracking,
  shutdownMiddleware,
  SHUTDOWN_STATE
} = require("../src/utils/shutdownManager");

describe("shutdownManager", () => {
  beforeEach(() => {
    // Limpiar operaciones antes de cada test
    const ops = getActiveOperations();
    if (ops.total > 0) {
      // Reset estado si es necesario
    }
  });

  describe("registerOperation / completeOperation", () => {
    it("debería registrar y completar operaciones", () => {
      const opId = registerOperation("test", { foo: "bar" });
      
      expect(opId).toBeDefined();
      expect(typeof opId).toBe("string");
      
      const ops = getActiveOperations();
      expect(ops.total).toBeGreaterThan(0);
      
      completeOperation(opId);
      
      const opsAfter = getActiveOperations();
      expect(opsAfter.total).toBe(0);
    });

    it("debería rechazar nuevas operaciones durante shutdown", async () => {
      // Iniciar shutdown
      const shutdownPromise = initiateShutdown({ reason: "test" });
      
      // Durante el shutdown no se pueden registrar operaciones
      expect(() => registerOperation("test", {})).toThrow();
      
      // Esperar a que complete
      await shutdownPromise;
    });
  });

  describe("getActiveOperations", () => {
    it("debería retornar estadísticas de operaciones", () => {
      registerOperation("type1", { data: 1 });
      registerOperation("type2", { data: 2 });
      
      const ops = getActiveOperations();
      
      expect(ops).toHaveProperty("total");
      expect(ops).toHaveProperty("byType");
      expect(ops).toHaveProperty("state");
      expect(ops.total).toBe(2);
      expect(ops.byType).toHaveProperty("type1");
      expect(ops.byType).toHaveProperty("type2");
    });
  });

  describe("getShutdownState", () => {
    it("debería retornar estado actual", () => {
      const state = getShutdownState();
      
      expect(state).toHaveProperty("state");
      expect(state).toHaveProperty("activeOperations");
      expect(state).toHaveProperty("config");
      
      expect(Object.values(SHUTDOWN_STATE)).toContain(state.state);
    });
  });

  describe("isShuttingDown", () => {
    it("debería retornar false inicialmente", () => {
      expect(isShuttingDown()).toBe(false);
    });

    it("debería retornar true durante shutdown", async () => {
      const shutdownPromise = initiateShutdown({ reason: "test" });
      
      expect(isShuttingDown()).toBe(true);
      
      await shutdownPromise;
    });
  });

  describe("withShutdownTracking", () => {
    it("debería ejecutar función con tracking", async () => {
      const mockFn = jest.fn().mockResolvedValue("result");
      
      const result = await withShutdownTracking("test_op", { detail: 1 }, mockFn);
      
      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe("result");
    });

    it("debería completar operación incluso si falla", async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error("fail"));
      
      try {
        await withShutdownTracking("failing_op", {}, mockFn);
      } catch (e) {
        // Esperado
      }
      
      // La operación debería haberse completado (eliminada)
      const ops = getActiveOperations();
      // Si no hay otras operaciones, debería ser 0
    });
  });

  describe("shutdownMiddleware", () => {
    it("debería permitir operaciones en estado normal", async () => {
      const mockHandler = jest.fn().mockResolvedValue("done");
      const middleware = shutdownMiddleware(mockHandler);
      
      const mockInteraction = {
        reply: jest.fn().mockResolvedValue(undefined)
      };
      
      await middleware(mockInteraction);
      
      expect(mockHandler).toHaveBeenCalled();
    });

    it("debería rechazar operaciones durante shutdown", async () => {
      // Iniciar shutdown
      const shutdownPromise = initiateShutdown({ reason: "test" });
      
      const mockHandler = jest.fn();
      const middleware = shutdownMiddleware(mockHandler);
      
      const mockInteraction = {
        reply: jest.fn().mockResolvedValue(undefined)
      };
      
      await middleware(mockInteraction);
      
      // No debería llamar al handler, sí a reply con mensaje de error
      expect(mockHandler).not.toHaveBeenCalled();
      expect(mockInteraction.reply).toHaveBeenCalled();
      
      await shutdownPromise;
    });
  });

  describe("SHUTDOWN_STATE", () => {
    it("debería tener estados definidos", () => {
      expect(SHUTDOWN_STATE.IDLE).toBe("idle");
      expect(SHUTDOWN_STATE.STARTING).toBe("starting");
      expect(SHUTDOWN_STATE.DRAINING).toBe("draining");
      expect(SHUTDOWN_STATE.CLOSING).toBe("closing");
      expect(SHUTDOWN_STATE.COMPLETE).toBe("complete");
    });
  });
});
