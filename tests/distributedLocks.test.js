/**
 * Tests para distributedLocks.js
 * Sistema de locks distribuidos usando MongoDB
 */

const {
  acquireLock,
  releaseLock,
  extendLock,
  withLock,
  getLockInfo,
  listActiveLocks,
  cleanupExpiredLocks,
  getStats,
  CONFIG
} = require("../src/utils/distributedLocks");

// Nota: Estos tests requieren una conexión a MongoDB
// Usar jest.mock para tests unitarios sin DB

jest.mock("../src/utils/database/core", () => ({
  getDb: jest.fn()
}));

const { getDb } = require("../src/utils/database/core");

describe("distributedLocks", () => {
  let mockCollection;
  let mockDb;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([])
      })
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    getDb.mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("acquireLock", () => {
    it("debería adquirir lock exitosamente", async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: "123" });

      const result = await acquireLock("test_lock");

      expect(result).not.toBeNull();
      expect(result.acquired).toBe(true);
      expect(result.name).toBe("test_lock");
      expect(mockCollection.insertOne).toHaveBeenCalled();
    });

    it("debería fallar si lock ya existe", async () => {
      mockCollection.insertOne.mockRejectedValue({ code: 11000 }); // Duplicate key
      mockCollection.findOne.mockResolvedValue({
        lock_name: "test_lock",
        expires_at: new Date(Date.now() + 10000)
      });

      const result = await acquireLock("test_lock");

      expect(result).toBeNull();
    });

    it("debería tomar lock expirado", async () => {
      mockCollection.insertOne.mockRejectedValue({ code: 11000 });
      mockCollection.findOne.mockResolvedValue({
        lock_name: "test_lock",
        expires_at: new Date(Date.now() - 1000), // Expirado
        version: 1
      });
      mockCollection.findOneAndUpdate.mockResolvedValue({
        value: { lock_name: "test_lock" }
      });

      const result = await acquireLock("test_lock");

      expect(result).not.toBeNull();
      expect(result.acquired).toBe(true);
    });

    it("debería lanzar error si no hay DB", async () => {
      getDb.mockReturnValue(null);

      await expect(acquireLock("test")).rejects.toThrow("Database not connected");
    });
  });

  describe("releaseLock", () => {
    it("debería liberar lock exitosamente", async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await releaseLock("test_lock");

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        lock_name: "test_lock",
        instance_id: expect.any(String)
      });
    });

    it("debería retornar false si no se eliminó", async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const result = await releaseLock("test_lock");

      expect(result).toBe(false);
    });
  });

  describe("extendLock", () => {
    it("debería extender lock exitosamente", async () => {
      mockCollection.findOneAndUpdate.mockResolvedValue({
        value: { lock_name: "test_lock" }
      });

      const result = await extendLock("test_lock", 30000);

      expect(result).not.toBeNull();
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalled();
    });

    it("debería retornar null si no es dueño del lock", async () => {
      mockCollection.findOneAndUpdate.mockResolvedValue({ value: null });

      const result = await extendLock("test_lock", 30000);

      expect(result).toBeNull();
    });
  });

  describe("withLock", () => {
    it("debería ejecutar función con lock", async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: "123" });
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const mockFn = jest.fn().mockResolvedValue("result");
      const result = await withLock("test_lock", mockFn, { timeoutMs: 5000 });

      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe("result");
    });

    it("debería liberar lock incluso si falla", async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: "123" });
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const mockFn = jest.fn().mockRejectedValue(new Error("fail"));

      await expect(withLock("test_lock", mockFn)).rejects.toThrow("fail");
      
      // El lock debería haberse liberado
      expect(mockCollection.deleteOne).toHaveBeenCalled();
    });

    it("debería reintentar si no puede adquirir lock", async () => {
      mockCollection.insertOne
        .mockRejectedValueOnce({ code: 11000 })
        .mockResolvedValue({ insertedId: "123" });
      
      mockCollection.findOne.mockResolvedValue({
        lock_name: "test_lock",
        expires_at: new Date(Date.now() + 1000),
        version: 1
      });

      const mockFn = jest.fn().mockResolvedValue("result");
      const result = await withLock("test_lock", mockFn, { retries: 1 });

      expect(result).toBe("result");
    });
  });

  describe("getLockInfo", () => {
    it("debería retornar información del lock", async () => {
      const mockLock = {
        lock_name: "test_lock",
        instance_id: "instance_1",
        acquired_at: new Date(),
        expires_at: new Date()
      };
      mockCollection.findOne.mockResolvedValue(mockLock);

      const result = await getLockInfo("test_lock");

      expect(result).toEqual(mockLock);
    });

    it("debería retornar null si no existe", async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const result = await getLockInfo("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("listActiveLocks", () => {
    it("debería listar locks activos", async () => {
      const mockLocks = [
        { lock_name: "lock1", expires_at: new Date(Date.now() + 10000) },
        { lock_name: "lock2", expires_at: new Date(Date.now() + 10000) }
      ];
      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockLocks)
      });

      const result = await listActiveLocks();

      expect(result).toEqual(mockLocks);
      expect(mockCollection.find).toHaveBeenCalledWith({
        expires_at: { $gt: expect.any(Date) }
      });
    });
  });

  describe("cleanupExpiredLocks", () => {
    it("debería limpiar locks expirados", async () => {
      mockCollection.deleteMany.mockResolvedValue({ deletedCount: 5 });

      const result = await cleanupExpiredLocks();

      expect(result).toBe(5);
      expect(mockCollection.deleteMany).toHaveBeenCalledWith({
        expires_at: { $lt: expect.any(Date) }
      });
    });
  });

  describe("getStats", () => {
    it("debería retornar estadísticas", () => {
      const stats = getStats();

      expect(stats).toHaveProperty("localLocks");
      expect(stats).toHaveProperty("instanceId");
      expect(stats).toHaveProperty("config");
      expect(typeof stats.localLocks).toBe("number");
    });
  });

  describe("CONFIG", () => {
    it("debería tener configuración válida", () => {
      expect(CONFIG.defaultLockTimeoutMs).toBeGreaterThan(0);
      expect(CONFIG.heartbeatIntervalMs).toBeGreaterThan(0);
      expect(CONFIG.maxLockDurationMs).toBeGreaterThan(0);
      expect(CONFIG.instanceId).toBeDefined();
    });
  });
});
