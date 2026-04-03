/**
 * Tests para apiCache.js
 * Sistema de caché para llamadas a Discord API
 */

const {
  get,
  set,
  invalidate,
  invalidateGuild,
  clearAll,
  cleanup,
  getStats,
  getMember,
  getChannel,
  getRole,
  DEFAULT_TTL,
  MAX_SIZE
} = require("../src/utils/apiCache");

describe("apiCache", () => {
  beforeEach(() => {
    clearAll();
  });

  afterEach(() => {
    clearAll();
  });

  describe("set y get", () => {
    it("debería guardar y recuperar datos", () => {
      const testData = { id: "123", name: "Test" };
      
      set("members", "guild1", "user1", testData);
      const result = get("members", "guild1", "user1");
      
      expect(result).toEqual(testData);
    });

    it("debería retornar null para claves inexistentes", () => {
      const result = get("members", "guild1", "nonexistent");
      
      expect(result).toBeNull();
    });

    it("debería respetar TTL personalizado", () => {
      const testData = { id: "123" };
      
      set("members", "guild1", "user1", testData, 1); // 1ms TTL
      
      // Esperar un poco para que expire
      setTimeout(() => {
        const result = get("members", "guild1", "user1");
        expect(result).toBeNull();
      }, 10);
    });
  });

  describe("invalidate", () => {
    it("debería invalidar entrada específica", () => {
      set("members", "guild1", "user1", { id: "1" });
      
      const deleted = invalidate("members", "guild1", "user1");
      const result = get("members", "guild1", "user1");
      
      expect(deleted).toBe(true);
      expect(result).toBeNull();
    });
  });

  describe("invalidateGuild", () => {
    it("debería invalidar todo un guild", () => {
      set("members", "guild1", "user1", { id: "1" });
      set("members", "guild1", "user2", { id: "2" });
      set("channels", "guild1", "chan1", { id: "c1" });
      set("members", "guild2", "user3", { id: "3" });
      
      const count = invalidateGuild("guild1");
      
      expect(count).toBeGreaterThanOrEqual(3);
      expect(get("members", "guild1", "user1")).toBeNull();
      expect(get("members", "guild2", "user3")).toEqual({ id: "3" });
    });
  });

  describe("cleanup", () => {
    it("debería limpiar entradas expiradas", () => {
      // Insertar datos expirados simulados
      set("members", "guild1", "user1", { id: "1" }, 1);
      set("members", "guild1", "user2", { id: "2" }, 100000);
      
      setTimeout(() => {
        const cleaned = cleanup();
        
        expect(cleaned).toBeGreaterThanOrEqual(1);
        expect(get("members", "guild1", "user1")).toBeNull();
        expect(get("members", "guild1", "user2")).toEqual({ id: "2" });
      }, 10);
    });
  });

  describe("getStats", () => {
    it("debería retornar estadísticas", () => {
      set("members", "guild1", "user1", { id: "1" });
      set("channels", "guild1", "chan1", { id: "c1" });
      
      const stats = getStats();
      
      expect(stats).toHaveProperty("sizes");
      expect(stats).toHaveProperty("totalSize");
      expect(stats).toHaveProperty("limits");
      expect(stats).toHaveProperty("hits");
      expect(stats).toHaveProperty("misses");
      expect(stats).toHaveProperty("hitRate");
      
      expect(stats.totalSize).toBeGreaterThan(0);
    });

    it("debería trackear hits y misses", () => {
      set("members", "guild1", "user1", { id: "1" });
      
      // Miss
      get("members", "guild1", "nonexistent");
      
      // Hit
      get("members", "guild1", "user1");
      
      const stats = getStats();
      
      expect(stats.hits).toBeGreaterThan(0);
      expect(stats.misses).toBeGreaterThan(0);
    });
  });

  describe("constantes", () => {
    it("debería tener TTLs definidos", () => {
      expect(DEFAULT_TTL.members).toBe(5 * 60 * 1000);
      expect(DEFAULT_TTL.channels).toBe(2 * 60 * 1000);
      expect(DEFAULT_TTL.guilds).toBe(10 * 60 * 1000);
    });

    it("debería tener límites de tamaño definidos", () => {
      expect(MAX_SIZE.members).toBe(1000);
      expect(MAX_SIZE.channels).toBe(500);
      expect(MAX_SIZE.guilds).toBe(100);
    });
  });
});
