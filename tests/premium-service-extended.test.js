const test = require("node:test");
const assert = require("node:assert/strict");

// Import PremiumService class directly
const { PremiumService } = require('../src/services/premiumService');

test("premiumService.getCachedPremium returns null for expired cache", async () => {
  const expiredCachedData = {
    guild_id: 'guild-expired',
    has_premium: true,
    tier: 'pro_monthly',
    expires_at: '2020-01-01T00:00:00Z', // Subscription expired
    lifetime: false,
    app_cache_expires_at: new Date(Date.now() + 300000), // Cache still fresh (app TTL)
    ttl_expires_at: new Date(Date.now() + 3600000),      // Stale window still open
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
    app_cache_expires_at: new Date(Date.now() + 300000),
    ttl_expires_at: new Date(Date.now() + 3600000),
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

  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.BOT_API_KEY = 'test-api-key';

  const mockAxios = {
    get: async () => ({
      data: { has_premium: true, tier: 'pro_monthly', expires_at: '2026-12-31T23:59:59Z', lifetime: false },
    }),
  };

  // Must clear premiumService from cache so the re-require picks up the axios mock
  const svcPath = require.resolve('../src/services/premiumService');
  delete require.cache[svcPath];

  const Module = require('module');
  const originalLoad = Module._load;
  Module._load = function (request, parent) {
    if (request === 'axios') return mockAxios;
    return originalLoad(request, parent);
  };

  const { PremiumService: FreshPS } = require('../src/services/premiumService');
  const service = new FreshPS();
  service.db = { collection: () => ({ findOne: async () => null, updateOne: async () => ({}) }) };
  service.initialized = true;

  const result = await service.fetchPremiumFromAPI('guild-123');

  // Restore
  Module._load = originalLoad;
  delete require.cache[svcPath];
  if (originalSupabaseUrl !== undefined) process.env.SUPABASE_URL = originalSupabaseUrl;
  else delete process.env.SUPABASE_URL;
  if (originalBotApiKey !== undefined) process.env.BOT_API_KEY = originalBotApiKey;
  else delete process.env.BOT_API_KEY;

  assert.equal(result.has_premium, true);
  assert.equal(result.tier, 'pro_monthly');
  assert.equal(result.expires_at, '2026-12-31T23:59:59Z');
  assert.equal(result.lifetime, false);
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
    app_cache_expires_at: new Date(Date.now() - 5 * 60 * 1000),
    ttl_expires_at: new Date(Date.now() + 50 * 60 * 1000),
  };

  const mockAxios = { get: async () => { throw new Error('Network error'); } };

  const testDb = {
    collection: () => ({
      findOne: async (query) => query.ttl_expires_at ? staleCachedData : null,
      updateOne: async () => ({}),
    }),
  };

  // Clear cache so re-require picks up the axios mock
  const svcPath = require.resolve('../src/services/premiumService');
  delete require.cache[svcPath];

  const Module = require('module');
  const originalLoad = Module._load;
  Module._load = function (request, parent) {
    if (request === 'axios') return mockAxios;
    return originalLoad(request, parent);
  };

  const { PremiumService: FreshPS } = require('../src/services/premiumService');
  const service = new FreshPS();
  service.db = testDb;
  service.initialized = true;

  const result = await service.fetchPremiumFromAPI('guild-stale');

  // Restore
  Module._load = originalLoad;
  delete require.cache[svcPath];
  if (originalSupabaseUrl !== undefined) process.env.SUPABASE_URL = originalSupabaseUrl;
  else delete process.env.SUPABASE_URL;
  if (originalBotApiKey !== undefined) process.env.BOT_API_KEY = originalBotApiKey;
  else delete process.env.BOT_API_KEY;

  assert.equal(result.has_premium, true);
  assert.equal(result.tier, 'pro_yearly');
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
