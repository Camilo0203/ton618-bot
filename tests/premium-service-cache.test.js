const test = require("node:test");
const assert = require("node:assert/strict");

const { PremiumService } = require('../src/services/premiumService');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeDb({ freshDoc = null, staleDoc = null } = {}) {
  return {
    collection: () => ({
      findOne: async (query) => {
        // Simulate MongoDB TTL filter behaviour:
        // getCachedPremium  → filters by app_cache_expires_at: { $gt: now }
        // getStaleCacheFallback → filters by ttl_expires_at:  { $gt: now }
        const now = new Date();

        if (query.app_cache_expires_at) {
          if (!freshDoc) return null;
          const passes = freshDoc.app_cache_expires_at instanceof Date
            && freshDoc.app_cache_expires_at > now;
          return (passes && freshDoc.guild_id === query.guild_id) ? freshDoc : null;
        }

        if (query.ttl_expires_at) {
          if (!staleDoc) return null;
          const passes = staleDoc.ttl_expires_at instanceof Date
            && staleDoc.ttl_expires_at > now;
          return (passes && staleDoc.guild_id === query.guild_id) ? staleDoc : null;
        }

        return null;
      },
      updateOne: async () => ({ modifiedCount: 1 }),
      deleteOne: async () => ({ deletedCount: 1 }),
      createIndex: async () => {},
    }),
    listCollections: () => ({ toArray: async () => [{ name: 'premium_cache' }] }),
    createCollection: async () => {},
  };
}

// ---------------------------------------------------------------------------
// getCachedPremium — respects app_cache_expires_at
// ---------------------------------------------------------------------------

test("getCachedPremium returns data when app_cache_expires_at is in the future", async () => {
  const freshDoc = {
    guild_id: 'guild-fresh',
    has_premium: true,
    tier: 'pro_monthly',
    expires_at: '2027-01-01T00:00:00Z',
    lifetime: false,
    app_cache_expires_at: new Date(Date.now() + 4 * 60 * 1000), // 4min from now
    ttl_expires_at: new Date(Date.now() + 55 * 60 * 1000),      // 55min from now
  };

  const service = new PremiumService();
  service.db = makeDb({ freshDoc });
  service.initialized = true;

  const result = await service.getCachedPremium('guild-fresh');

  assert.ok(result !== null, 'should return cached data when fresh');
  assert.equal(result.has_premium, true);
  assert.equal(result.tier, 'pro_monthly');
});

test("getCachedPremium returns null when app_cache_expires_at is in the past (stale)", async () => {
  // Document exists in MongoDB (ttl_expires_at is valid) but app TTL has expired
  const staleDoc = {
    guild_id: 'guild-stale-app',
    has_premium: true,
    tier: 'pro_monthly',
    expires_at: '2027-01-01T00:00:00Z',
    lifetime: false,
    app_cache_expires_at: new Date(Date.now() - 2 * 60 * 1000), // 2min ago — stale
    ttl_expires_at: new Date(Date.now() + 55 * 60 * 1000),
  };

  const service = new PremiumService();
  // The freshDoc slot is null; the staleDoc slot has data but app_cache_expires_at is past
  service.db = makeDb({ staleDoc });
  service.initialized = true;

  const result = await service.getCachedPremium('guild-stale-app');

  assert.equal(result, null, 'must return null so caller fetches fresh data from API');
});

// ---------------------------------------------------------------------------
// getStaleCacheFallback — respects ttl_expires_at
// ---------------------------------------------------------------------------

test("getStaleCacheFallback returns data when ttl_expires_at is still valid", async () => {
  const staleDoc = {
    guild_id: 'guild-stale-ttl',
    has_premium: true,
    tier: 'pro_yearly',
    expires_at: '2027-06-01T00:00:00Z',
    lifetime: false,
    app_cache_expires_at: new Date(Date.now() - 10 * 60 * 1000), // app TTL expired
    ttl_expires_at: new Date(Date.now() + 50 * 60 * 1000),       // stale TTL valid
  };

  const service = new PremiumService();
  service.db = makeDb({ staleDoc });
  service.initialized = true;

  const result = await service.getStaleCacheFallback('guild-stale-ttl');

  assert.ok(result !== null, 'stale cache should be returned when within 1hr window');
  assert.equal(result.has_premium, true);
  assert.equal(result.tier, 'pro_yearly');
});

test("getStaleCacheFallback returns null when ttl_expires_at is expired (doc deleted by MongoDB)", async () => {
  // Simulates the case where MongoDB TTL has already deleted the document
  const service = new PremiumService();
  service.db = makeDb(); // Both freshDoc and staleDoc are null
  service.initialized = true;

  const result = await service.getStaleCacheFallback('guild-fully-expired');

  assert.equal(result, null, 'no stale data when MongoDB has deleted the document');
});

test("getStaleCacheFallback returns null for lifetime plans with ttl_expires_at expired", async () => {
  const service = new PremiumService();
  service.db = makeDb();
  service.initialized = true;

  const result = await service.getStaleCacheFallback('guild-lifetime-gone');
  assert.equal(result, null);
});

// ---------------------------------------------------------------------------
// cachePremiumStatus — writes correct TTL split
// ---------------------------------------------------------------------------

test("cachePremiumStatus writes app_cache_expires_at (~5min) and ttl_expires_at (~1hr)", async () => {
  let savedDoc = null;

  const db = {
    collection: () => ({
      updateOne: async (_filter, update) => {
        savedDoc = update.$set;
        return { modifiedCount: 1 };
      },
    }),
  };

  const service = new PremiumService();
  service.db = db;
  service.initialized = true;

  const before = Date.now();
  await service.cachePremiumStatus('guild-ttl-test', {
    has_premium: true,
    tier: 'pro_monthly',
    expires_at: '2027-01-01T00:00:00Z',
    lifetime: false,
    owner_user_id: '123456789012345678',
  });

  assert.ok(savedDoc !== null);
  assert.ok(savedDoc.app_cache_expires_at instanceof Date, 'app_cache_expires_at must be a Date');
  assert.ok(savedDoc.ttl_expires_at instanceof Date, 'ttl_expires_at must be a Date');

  const fiveMin  = 5 * 60 * 1000;
  const oneHour  = 60 * 60 * 1000;
  const tolerance = 2000; // 2s tolerance

  // app_cache_expires_at ≈ now + 5min
  const appTtlMs = savedDoc.app_cache_expires_at.getTime() - before;
  assert.ok(appTtlMs >= fiveMin - tolerance, `app TTL too short: ${appTtlMs}ms`);
  assert.ok(appTtlMs <= fiveMin + tolerance, `app TTL too long: ${appTtlMs}ms`);

  // ttl_expires_at ≈ now + 1hr
  const staleTtlMs = savedDoc.ttl_expires_at.getTime() - before;
  assert.ok(staleTtlMs >= oneHour - tolerance, `stale TTL too short: ${staleTtlMs}ms`);
  assert.ok(staleTtlMs <= oneHour + tolerance, `stale TTL too long: ${staleTtlMs}ms`);

  // stale TTL must outlive fresh TTL
  assert.ok(savedDoc.ttl_expires_at > savedDoc.app_cache_expires_at,
    'MongoDB deletion TTL (1hr) must be later than app freshness TTL (5min)');
});

// ---------------------------------------------------------------------------
// _normalizePremiumData — warns on unknown tier
// ---------------------------------------------------------------------------

test("_normalizePremiumData warns when tier is unknown (e.g. 'donate')", () => {
  const service = new PremiumService();
  const warnings = [];

  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));

  service._normalizePremiumData({ has_premium: false, tier: 'donate', lifetime: false });

  console.warn = originalWarn;

  assert.ok(warnings.length > 0, 'should emit a warning for unknown tier');
  assert.ok(warnings[0].includes('donate'), 'warning should mention the unknown tier');
});

test("_normalizePremiumData does NOT warn for valid tiers", () => {
  const service = new PremiumService();
  const warnings = [];

  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));

  const validTiers = ['pro_monthly', 'pro_yearly', 'lifetime'];
  for (const tier of validTiers) {
    service._normalizePremiumData({ has_premium: true, tier, lifetime: tier === 'lifetime' });
  }

  console.warn = originalWarn;

  assert.equal(warnings.length, 0, `unexpected warning for valid tier: ${warnings[0]}`);
});

test("_normalizePremiumData does NOT warn when tier is null", () => {
  const service = new PremiumService();
  const warnings = [];

  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));

  service._normalizePremiumData({ has_premium: false, tier: null, lifetime: false });

  console.warn = originalWarn;

  assert.equal(warnings.length, 0, 'null tier is the default and must not warn');
});

// ---------------------------------------------------------------------------
// fetchPremiumFromAPI — retries on 5xx
// ---------------------------------------------------------------------------

test("fetchPremiumFromAPI retries on HTTP 500 and succeeds on second attempt", async () => {
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.BOT_API_KEY;

  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.BOT_API_KEY = 'test-key';

  let callCount = 0;
  const mockAxios = {
    get: async () => {
      callCount++;
      if (callCount === 1) {
        const err = new Error('Internal Server Error');
        err.response = { status: 500 };
        throw err;
      }
      return {
        data: { has_premium: true, tier: 'pro_monthly', expires_at: '2027-01-01T00:00:00Z', lifetime: false },
      };
    },
  };

  // Clear premiumService from cache so the fresh require picks up our axios mock
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
  service.db = makeDb();
  service.initialized = true;

  const result = await service.fetchPremiumFromAPI('guild-5xx-retry');

  Module._load = originalLoad;
  delete require.cache[svcPath];
  if (originalUrl !== undefined) process.env.SUPABASE_URL = originalUrl;
  else delete process.env.SUPABASE_URL;
  if (originalKey !== undefined) process.env.BOT_API_KEY = originalKey;
  else delete process.env.BOT_API_KEY;

  assert.equal(callCount, 2, 'should have retried once on 500');
  assert.equal(result.has_premium, true);
  assert.equal(result.tier, 'pro_monthly');
});

test("fetchPremiumFromAPI does NOT retry on HTTP 400 (client error)", async () => {
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.BOT_API_KEY;

  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.BOT_API_KEY = 'test-key';

  let callCount = 0;
  const mockAxios = {
    get: async () => {
      callCount++;
      const err = new Error('Bad Request');
      err.response = { status: 400 };
      throw err;
    },
  };

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
  service.db = makeDb();
  service.initialized = true;

  const result = await service.fetchPremiumFromAPI('guild-400-no-retry');

  Module._load = originalLoad;
  delete require.cache[svcPath];
  if (originalUrl !== undefined) process.env.SUPABASE_URL = originalUrl;
  else delete process.env.SUPABASE_URL;
  if (originalKey !== undefined) process.env.BOT_API_KEY = originalKey;
  else delete process.env.BOT_API_KEY;

  assert.equal(callCount, 1, '400 client errors must not be retried');
  assert.equal(result.has_premium, false, 'should fall back to default on unretriable error');
});
