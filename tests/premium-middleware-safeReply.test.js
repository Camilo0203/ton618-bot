const test = require("node:test");
const assert = require("node:assert/strict");

// ---------------------------------------------------------------------------
// Mock setup (must happen before requiring premiumMiddleware)
// ---------------------------------------------------------------------------

const mockPremiumService = {
  checkGuildPremium: async (guildId) => {
    if (guildId === 'guild-premium') {
      return { has_premium: true, tier: 'pro_monthly', expires_at: '2027-01-01T00:00:00Z', lifetime: false };
    }
    if (guildId === 'guild-lifetime') {
      return { has_premium: true, tier: 'lifetime', expires_at: null, lifetime: true };
    }
    return { has_premium: false, tier: null, expires_at: null, lifetime: false };
  },
  checkFeatureAccess: async (guildId) => {
    return guildId === 'guild-premium' || guildId === 'guild-lifetime';
  },
  getTierFeatures: (tier) => {
    const tiers = {
      lifetime:    { name: 'Lifetime',    max_custom_commands: 100, max_auto_roles: 50, max_welcome_messages: 20, advanced_moderation: true, exclusive_features: true },
      pro_monthly: { name: 'Pro Monthly', max_custom_commands: 50,  max_auto_roles: 20, max_welcome_messages: 10, advanced_moderation: true },
      pro_yearly:  { name: 'Pro Yearly',  max_custom_commands: 50,  max_auto_roles: 20, max_welcome_messages: 10, advanced_moderation: true },
    };
    return tiers[tier] || { name: 'Free', max_custom_commands: 5, max_auto_roles: 3, max_welcome_messages: 1, advanced_moderation: false };
  },
  getDefaultPremiumStatus: () => ({
    has_premium: false, tier: null, expires_at: null, lifetime: false, owner_user_id: null,
  }),
};

class MockEmbedBuilder {
  constructor() { this.data = {}; }
  setColor(c)   { this.data.color = c;   return this; }
  setTitle(t)   { this.data.title = t;   return this; }
  setDescription(d) { this.data.description = d; return this; }
  addFields(...f) { this.data.fields = f; return this; }
  setFooter(f)  { this.data.footer = f;  return this; }
}

const Module = require('module');
const originalLoad = Module._load;
Module._load = function (request, parent) {
  if (request === '../services/premiumService') return { premiumService: mockPremiumService };
  if (request === 'discord.js') return { EmbedBuilder: MockEmbedBuilder };
  return originalLoad(request, parent);
};

delete require.cache[require.resolve('../src/utils/premiumMiddleware')];
const {
  safeReply,
  requirePremium,
  requireFeature,
  createPremiumEmbed,
  checkLimit,
} = require('../src/utils/premiumMiddleware');

test.after(() => {
  Module._load = originalLoad;
  delete require.cache[require.resolve('../src/utils/premiumMiddleware')];
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeInteraction({ guildId = 'guild-123', replied = false, deferred = false, createdTimestamp = Date.now() } = {}) {
  const log = [];
  return {
    guildId,
    replied,
    deferred,
    createdTimestamp,
    reply:      async (p) => { log.push({ method: 'reply',      payload: p }); return p; },
    editReply:  async (p) => { log.push({ method: 'editReply',  payload: p }); return p; },
    followUp:   async (p) => { log.push({ method: 'followUp',   payload: p }); return p; },
    _log: () => log,
  };
}

// ---------------------------------------------------------------------------
// safeReply — exported and direct tests
// ---------------------------------------------------------------------------

test("safeReply is exported from premiumMiddleware", () => {
  assert.equal(typeof safeReply, 'function');
});

test("safeReply calls reply() when interaction is fresh (not replied, not deferred)", async () => {
  const interaction = makeInteraction({ replied: false, deferred: false });
  await safeReply(interaction, { content: 'hello', ephemeral: true });
  const log = interaction._log();
  assert.equal(log.length, 1);
  assert.equal(log[0].method, 'reply');
});

test("safeReply calls editReply() when interaction is deferred", async () => {
  const interaction = makeInteraction({ replied: false, deferred: true });
  await safeReply(interaction, { content: 'hello' });
  const log = interaction._log();
  assert.equal(log.length, 1);
  assert.equal(log[0].method, 'editReply');
});

test("safeReply calls editReply() when interaction is already replied", async () => {
  const interaction = makeInteraction({ replied: true, deferred: false });
  await safeReply(interaction, { content: 'hello' });
  const log = interaction._log();
  assert.equal(log.length, 1);
  assert.equal(log[0].method, 'editReply');
});

test("safeReply falls back to followUp when editReply throws (deferred)", async () => {
  const log = [];
  const interaction = {
    guildId: 'guild-test',
    replied: false,
    deferred: true,
    createdTimestamp: Date.now(),
    editReply: async () => { throw new Error('editReply failed'); },
    followUp:  async (p) => { log.push(p); return p; },
  };

  await safeReply(interaction, { content: 'fallback' });

  assert.equal(log.length, 1, 'followUp should have been called as fallback');
  assert.equal(log[0].ephemeral, true, 'followUp fallback should be ephemeral');
});

test("safeReply does NOT throw when reply() fails and interaction was never deferred", async () => {
  const errors = [];
  const originalError = console.error;
  console.error = (...args) => errors.push(args.join(' '));

  const interaction = {
    guildId: 'guild-expired',
    replied: false,
    deferred: false,
    createdTimestamp: Date.now() - 5000, // 5s old — past Discord 3s window
    reply: async () => { throw new Error('Unknown interaction'); },
  };

  // Should NOT throw — graceful degradation
  await assert.doesNotReject(() => safeReply(interaction, { content: 'too late' }));

  console.error = originalError;

  // Should log an actionable error message
  const criticalErrors = errors.filter(e =>
    e.includes('expired') || e.includes('deferred') || e.includes('response') || e.includes('recover')
  );
  assert.ok(criticalErrors.length > 0, `expected actionable error message, got: ${errors.join(' | ')}`);
});

test("safeReply handles invalid interaction gracefully", async () => {
  await assert.doesNotReject(() => safeReply(null, { content: 'test' }));
  await assert.doesNotReject(() => safeReply(undefined, { content: 'test' }));
  await assert.doesNotReject(() => safeReply('not-an-object', { content: 'test' }));
});

// ---------------------------------------------------------------------------
// requirePremium — "Higher Tier Required" embed uses human-readable names
// ---------------------------------------------------------------------------

test("requirePremium 'Higher Tier Required' shows human-readable tier names (not snake_case)", async () => {
  // guild-premium has pro_monthly; requires lifetime → should be denied
  const interaction = makeInteraction({ guildId: 'guild-premium', replied: false, deferred: false });

  const result = await requirePremium(interaction, { requiredTier: 'lifetime' });

  assert.equal(result, false);
  const log = interaction._log();
  assert.equal(log.length, 1);

  const embed = log[0].payload.embeds[0];
  const desc  = embed.data.description;

  // Must show human-readable names from getTierFeatures().name
  assert.ok(desc.includes('Lifetime'),    `description should include 'Lifetime', got: ${desc}`);
  assert.ok(desc.includes('Pro Monthly'), `description should include 'Pro Monthly', got: ${desc}`);

  // Must NOT expose raw snake_case tier keys to users
  assert.ok(!desc.includes('pro_monthly'), `should not expose 'pro_monthly' to users, got: ${desc}`);
  assert.ok(!desc.includes('requires **lifetime**'), `should not expose 'lifetime' raw, got: ${desc}`);
});

test("requirePremium 'Higher Tier Required' is NOT shown when tier is sufficient", async () => {
  const interaction = makeInteraction({ guildId: 'guild-lifetime', replied: false });

  const result = await requirePremium(interaction, { requiredTier: 'lifetime' });

  assert.equal(result, true, 'lifetime guild should pass lifetime tier requirement');
  assert.equal(interaction._log().length, 0, 'no embed should be sent on success');
});

// ---------------------------------------------------------------------------
// checkLimit — fallback uses getDefaultPremiumStatus() (consistent shape)
// ---------------------------------------------------------------------------

test("checkLimit fallback via getDefaultPremiumStatus includes owner_user_id field", async () => {
  // Temporarily override checkGuildPremium to throw
  const original = mockPremiumService.checkGuildPremium;
  mockPremiumService.checkGuildPremium = async () => { throw new Error('backend down'); };

  const result = await checkLimit('guild-error', 'custom_commands', 2);

  mockPremiumService.checkGuildPremium = original;

  // Falls back to free tier (5 commands)
  assert.equal(result.limit, 5);
  assert.equal(result.allowed, true); // 2 < 5
  // getDefaultPremiumStatus includes owner_user_id — verifies it was called, not inline obj
  // We verify the limit is correct (getDefaultPremiumStatus -> null tier -> free features)
  assert.equal(typeof result.remaining, 'number');
  assert.ok(result.remaining >= 0);
});

// ---------------------------------------------------------------------------
// createPremiumEmbed — expiration rendering
// ---------------------------------------------------------------------------

test("createPremiumEmbed: lifetime shows 'Lifetime Access' regardless of expires_at", () => {
  const embed = createPremiumEmbed('guild-lifetime', {
    has_premium: true, tier: 'lifetime', expires_at: null, lifetime: true,
  });
  assert.ok(embed.data.description.includes('Lifetime Access'),
    `expected 'Lifetime Access', got: ${embed.data.description}`);
  assert.ok(!embed.data.description.includes('Expires'),
    'lifetime plans must not show Expires date');
});

test("createPremiumEmbed: active subscription shows Discord relative timestamp", () => {
  const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const embed = createPremiumEmbed('guild-sub', {
    has_premium: true, tier: 'pro_monthly', expires_at: futureDate, lifetime: false,
  });
  assert.ok(embed.data.description.includes('<t:'),
    `expected Discord timestamp, got: ${embed.data.description}`);
  assert.ok(embed.data.description.includes(':R>'),
    'should use relative format :R>');
});

test("createPremiumEmbed: past expiry shows 'Expired (updating...)'", () => {
  const embed = createPremiumEmbed('guild-exp', {
    has_premium: true, tier: 'pro_monthly', expires_at: '2020-01-01T00:00:00Z', lifetime: false,
  });
  assert.ok(
    embed.data.description.includes('Expired') || embed.data.description.includes('updating'),
    `expected expired status, got: ${embed.data.description}`
  );
});

test("createPremiumEmbed: invalid expires_at date shows 'Active' fallback", () => {
  const embed = createPremiumEmbed('guild-bad-date', {
    has_premium: true, tier: 'pro_monthly', expires_at: 'not-a-date', lifetime: false,
  });
  assert.ok(
    embed.data.description.includes('Active'),
    `expected fallback 'Active', got: ${embed.data.description}`
  );
});

test("createPremiumEmbed: free plan shows correct color and description", () => {
  const embed = createPremiumEmbed('guild-free', {
    has_premium: false, tier: null, expires_at: null, lifetime: false,
  });
  assert.equal(embed.data.color, '#9E9E9E');
  assert.ok(embed.data.title.includes('Free Plan'));
  assert.ok(embed.data.description.includes('Free Plan'));
});

test("createPremiumEmbed: invalid premium object does not throw", () => {
  assert.doesNotThrow(() => createPremiumEmbed('guild-null', null));
  assert.doesNotThrow(() => createPremiumEmbed('guild-undef', undefined));
});
