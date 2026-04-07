const test = require("node:test");
const assert = require("node:assert/strict");

// Import PremiumService class directly
const { PremiumService } = require('../src/services/premiumService');

test("premiumService.getCachedPremium returns null for expired cache", async () => {
  const expiredCachedData = {
    guild_id: 'guild-expired',
    has_premium: true,
    tier: 'pro_monthly',
    expires_at: '2020-01-01T00:00:00Z', // Expired
    lifetime: false,
    ttl_expires_at: new Date(Date.now() + 300000), // TTL still valid
  };

  const testDb = {
    collection: () => ({
      findOne: async (query) => {
        if (query.guild_id === 'guild-expired') return expiredCachedData;
        return null;
      },
    }),
  };

  const service = new PremiumService();
  service.db = testDb;
  service.initialized = true;

  const result = await service.getCachedPremium('guild-expired');

  // Should return null to force fresh fetch
  assert.equal(result, null);
});

test("premiumService.getCachedPremium does not validate expiration for lifetime", async () => {
  const lifetimeCachedData = {
    guild_id: 'guild-lifetime',
    has_premium: true,
    tier: 'lifetime',
    expires_at: null,
    lifetime: true,
    ttl_expires_at: new Date(Date.now() + 300000),
  };

  const testDb = {
    collection: () => ({
      findOne: async (query) => {
        if (query.guild_id === 'guild-lifetime') return lifetimeCachedData;
        return null;
      },
    }),
  };

  const service = new PremiumService();
  service.db = testDb;
  service.initialized = true;

  const result = await service.getCachedPremium('guild-lifetime');

  // Should return cached lifetime even without expiration check
  assert.equal(result.has_premium, true);
  assert.equal(result.tier, 'lifetime');
  assert.equal(result.lifetime, true);
});

test("premiumService.fetchPremiumFromAPI maps tier and expires_at correctly", async () => {
  const originalSupabaseUrl = process.env.SUPABASE_URL;
  const originalBotApiKey = process.env.BOT_API_KEY;

  // Set env vars
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.BOT_API_KEY = 'test-api-key';

  const mockAxios = {
    get: async (url, config) => {
      return {
        data: {
          has_premium: true,
          tier: 'pro_monthly', // Backend sends tier
          expires_at: '2026-12-31T23:59:59Z', // Backend sends expires_at
          lifetime: false,
        },
      };
    },
  };

  // Mock axios
  const Module = require('module');
  const originalLoad = Module._load;
  Module._load = function (request, parent) {
    if (request === 'axios') {
      return mockAxios;
    }
    return originalLoad(request, parent);
  };

  const service = new PremiumService();
  service.db = {
    collection: () => ({
      findOne: async () => null,
    }),
  };
  service.initialized = true;

  const result = await service.fetchPremiumFromAPI('guild-123');

  // Verify mapping
  assert.equal(result.has_premium, true);
  assert.equal(result.tier, 'pro_monthly');
  assert.equal(result.expires_at, '2026-12-31T23:59:59Z');
  assert.equal(result.lifetime, false);

  // Restore
  Module._load = originalLoad;
  process.env.SUPABASE_URL = originalSupabaseUrl;
  process.env.BOT_API_KEY = originalBotApiKey;
});

test("premiumService.fetchPremiumFromAPI falls back to stale cache on error", async () => {
  const originalSupabaseUrl = process.env.SUPABASE_URL;
  const originalBotApiKey = process.env.BOT_API_KEY;

  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.BOT_API_KEY = 'test-api-key';

  const staleCachedData = {
    guild_id: 'guild-stale',
    has_premium: true,
    tier: 'pro_yearly',
    expires_at: '2026-12-31T23:59:59Z',
    lifetime: false,
    cached_at: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago (stale)
  };

  const mockAxios = {
    get: async () => {
      throw new Error('Network error');
    },
  };

  const testDb = {
    collection: () => ({
      findOne: async (query) => {
        // Return stale cache for getStaleCacheFallback
        if (query.cached_at) {
          return staleCachedData;
        }
        return null;
      },
    }),
  };

  const Module = require('module');
  const originalLoad = Module._load;
  Module._load = function (request, parent) {
    if (request === 'axios') {
      return mockAxios;
    }
    return originalLoad(request, parent);
  };

  const service = new PremiumService();
  service.db = testDb;
  service.initialized = true;

  const result = await service.fetchPremiumFromAPI('guild-stale');

  // Should return stale cache as fallback
  assert.equal(result.has_premium, true);
  assert.equal(result.tier, 'pro_yearly');

  Module._load = originalLoad;
  process.env.SUPABASE_URL = originalSupabaseUrl;
  process.env.BOT_API_KEY = originalBotApiKey;
});

test("premiumService.invalidateCache deletes cache entry", async () => {
  let deletedGuildId = null;

  const testDb = {
    collection: () => ({
      deleteOne: async (query) => {
        deletedGuildId = query.guild_id;
        return { deletedCount: 1 };
      },
    }),
  };

  const service = new PremiumService();
  service.db = testDb;
  service.initialized = true;

  await service.invalidateCache('guild-to-delete');

  assert.equal(deletedGuildId, 'guild-to-delete');
});

test("premiumService.getTierFeatures returns correct limits for each tier", () => {
  const service = new PremiumService();

  const proMonthly = service.getTierFeatures('pro_monthly');
  const proYearly = service.getTierFeatures('pro_yearly');
  const lifetime = service.getTierFeatures('lifetime');
  const free = service.getTierFeatures(null);

  // Pro tiers
  assert.equal(proMonthly.max_custom_commands, 50);
  assert.equal(proYearly.max_custom_commands, 50);

  // Lifetime has more
  assert.equal(lifetime.max_custom_commands, 100);
  assert.equal(lifetime.exclusive_features, true);

  // Free tier
  assert.equal(free.max_custom_commands, 5);
  assert.equal(free.advanced_moderation, false);
});

test("premiumService.checkGuildPremium returns default on invalid guildId", async () => {
  const service = new PremiumService();
  service.db = {};
  service.initialized = true;

  const result1 = await service.checkGuildPremium(null);
  const result2 = await service.checkGuildPremium('');
  const result3 = await service.checkGuildPremium(123); // Wrong type

  assert.equal(result1.has_premium, false);
  assert.equal(result2.has_premium, false);
  assert.equal(result3.has_premium, false);
});
