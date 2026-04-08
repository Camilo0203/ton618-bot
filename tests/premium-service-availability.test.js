const test = require("node:test");
const assert = require("node:assert/strict");

const { PremiumService } = require("../src/services/premiumService");

test("checkGuildPremium no cachea respuestas unavailable", async () => {
  let cacheWrites = 0;

  const service = new PremiumService();
  service.initialized = true;
  service.getCachedPremium = async () => null;
  service.fetchPremiumFromAPI = async () =>
    service.getDefaultPremiumStatus({
      source: "api_error",
      unavailable: true,
      errorCode: "premium_status_unavailable",
    });
  service.cachePremiumStatus = async () => {
    cacheWrites += 1;
  };

  const result = await service.checkGuildPremium("guild-unavailable");

  assert.equal(cacheWrites, 0);
  assert.equal(result.has_premium, false);
  assert.equal(result._meta.unavailable, true);
  assert.equal(result._meta.errorCode, "premium_status_unavailable");
});

test("getStaleCacheFallback ignora cache vencido aunque el documento siga vivo en Mongo", async () => {
  const service = new PremiumService();
  service.initialized = true;
  service.db = {
    collection: () => ({
      findOne: async () => ({
        guild_id: "guild-expired-stale",
        has_premium: true,
        tier: "pro_monthly",
        expires_at: "2020-01-01T00:00:00Z",
        lifetime: false,
        ttl_expires_at: new Date(Date.now() + 30 * 60 * 1000),
      }),
    }),
  };

  const result = await service.getStaleCacheFallback("guild-expired-stale");

  assert.equal(result, null);
});
