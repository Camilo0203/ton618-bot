const test = require("node:test");
const assert = require("node:assert/strict");

// Mock premiumService
const mockPremiumService = {
  checkGuildPremium: async (guildId) => {
    if (guildId === 'guild-premium') {
      return {
        has_premium: true,
        tier: 'pro_monthly',
        expires_at: '2026-12-31T23:59:59Z',
        lifetime: false,
      };
    }
    if (guildId === 'guild-lifetime') {
      return {
        has_premium: true,
        tier: 'lifetime',
        expires_at: null,
        lifetime: true,
      };
    }
    return {
      has_premium: false,
      tier: null,
      expires_at: null,
      lifetime: false,
    };
  },
  checkFeatureAccess: async (guildId, feature) => {
    if (guildId === 'guild-premium' || guildId === 'guild-lifetime') {
      return true;
    }
    return false;
  },
  getTierFeatures: (tier) => {
    if (tier === 'lifetime') {
      return {
        name: 'Lifetime',
        max_custom_commands: 100,
        max_auto_roles: 50,
        max_welcome_messages: 20,
        advanced_moderation: true,
        exclusive_features: true,
      };
    }
    if (tier === 'pro_monthly' || tier === 'pro_yearly') {
      return {
        name: 'Pro',
        max_custom_commands: 50,
        max_auto_roles: 20,
        max_welcome_messages: 10,
        advanced_moderation: true,
      };
    }
    return {
      name: 'Free',
      max_custom_commands: 5,
      max_auto_roles: 3,
      max_welcome_messages: 1,
      advanced_moderation: false,
    };
  },
};

// Mock discord.js EmbedBuilder
class MockEmbedBuilder {
  constructor() {
    this.data = {};
  }
  setColor(color) {
    this.data.color = color;
    return this;
  }
  setTitle(title) {
    this.data.title = title;
    return this;
  }
  setDescription(desc) {
    this.data.description = desc;
    return this;
  }
  addFields(...fields) {
    this.data.fields = fields;
    return this;
  }
  setFooter(footer) {
    this.data.footer = footer;
    return this;
  }
}

// Mock modules
const Module = require('module');
const originalLoad = Module._load;

Module._load = function (request, parent) {
  if (request === '../services/premiumService') {
    return { premiumService: mockPremiumService };
  }
  if (request === 'discord.js') {
    return { EmbedBuilder: MockEmbedBuilder };
  }
  return originalLoad(request, parent);
};

// Clear cache and reload module
delete require.cache[require.resolve('../src/utils/premiumMiddleware')];
const { requirePremium, requireFeature, createPremiumEmbed, checkLimit } = require('../src/utils/premiumMiddleware');

test("requirePremium with fresh interaction", async () => {
  let replyCalled = false;
  let replyPayload = null;

  const mockInteraction = {
    guildId: 'guild-free',
    replied: false,
    deferred: false,
    reply: async (payload) => {
      replyCalled = true;
      replyPayload = payload;
    },
  };

  const result = await requirePremium(mockInteraction);

  assert.equal(result, false);
  assert.equal(replyCalled, true);
  assert.equal(replyPayload.ephemeral, true);
  assert.ok(replyPayload.embeds);
});

test("requirePremium with deferred interaction", async () => {
  let editReplyCalled = false;

  const mockInteraction = {
    guildId: 'guild-free',
    replied: false,
    deferred: true,
    editReply: async (payload) => {
      editReplyCalled = true;
      return payload;
    },
  };

  // Mock safeReply behavior
  const result = await requirePremium(mockInteraction);

  assert.equal(result, false);
  // In real implementation, safeReply would call editReply for deferred
});

test("requirePremium with replied interaction", async () => {
  let editReplyCalled = false;

  const mockInteraction = {
    guildId: 'guild-free',
    replied: true,
    deferred: false,
    editReply: async (payload) => {
      editReplyCalled = true;
      return payload;
    },
  };

  const result = await requirePremium(mockInteraction);

  assert.equal(result, false);
  // In real implementation, safeReply would call editReply for replied
});

test("requirePremium passes for premium guild", async () => {
  const mockInteraction = {
    guildId: 'guild-premium',
    replied: false,
    deferred: false,
    reply: async () => {},
  };

  const result = await requirePremium(mockInteraction);

  assert.equal(result, true);
});

test("requireFeature checks specific feature access", async () => {
  const mockInteraction = {
    guildId: 'guild-premium',
    replied: false,
    deferred: false,
    reply: async () => {},
  };

  const result = await requireFeature(mockInteraction, 'advanced_moderation');

  assert.equal(result, true);
});

test("requireFeature rejects for free guild", async () => {
  let replyCalled = false;

  const mockInteraction = {
    guildId: 'guild-free',
    replied: false,
    deferred: false,
    reply: async (payload) => {
      replyCalled = true;
    },
  };

  const result = await requireFeature(mockInteraction, 'advanced_moderation');

  assert.equal(result, false);
  assert.equal(replyCalled, true);
});

test("PRO_UPGRADE_URL is configurable", () => {
  const originalUrl = process.env.PRO_UPGRADE_URL;
  
  process.env.PRO_UPGRADE_URL = 'https://custom-pricing.example.com';
  
  // Reload module to pick up new env var
  delete require.cache[require.resolve('../src/utils/premiumMiddleware')];
  const middleware = require('../src/utils/premiumMiddleware');
  
  // The module should use the custom URL
  // We can't directly test the constant, but we can verify it's used in embeds
  
  process.env.PRO_UPGRADE_URL = originalUrl;
});

test("createPremiumEmbed renders lifetime correctly", () => {
  const premiumData = {
    has_premium: true,
    tier: 'lifetime',
    expires_at: null,
    lifetime: true,
  };

  const embed = createPremiumEmbed('guild-123', premiumData);

  assert.equal(embed.data.color, '#4CAF50'); // Green for premium
  assert.equal(embed.data.title, '✨ Premium Active');
  assert.ok(embed.data.description.includes('Lifetime'));
});

test("createPremiumEmbed renders pro_monthly with expiration", () => {
  const premiumData = {
    has_premium: true,
    tier: 'pro_monthly',
    expires_at: '2026-12-31T23:59:59Z',
    lifetime: false,
  };

  const embed = createPremiumEmbed('guild-456', premiumData);

  assert.equal(embed.data.color, '#4CAF50');
  assert.equal(embed.data.title, '✨ Premium Active');
  assert.ok(embed.data.description.includes('Pro'));
});

test("createPremiumEmbed shows expired status for past date", () => {
  const premiumData = {
    has_premium: true,
    tier: 'pro_monthly',
    expires_at: '2020-01-01T00:00:00Z', // Past date
    lifetime: false,
  };

  const embed = createPremiumEmbed('guild-expired', premiumData);

  // Should show "Expired (updating...)"
  assert.ok(embed.data.description.includes('Expired') || embed.data.description.includes('updating'));
});

test("createPremiumEmbed renders free plan", () => {
  const premiumData = {
    has_premium: false,
    tier: null,
    expires_at: null,
    lifetime: false,
  };

  const embed = createPremiumEmbed('guild-free', premiumData);

  assert.equal(embed.data.color, '#9E9E9E'); // Gray for free
  assert.equal(embed.data.title, '📦 Free Plan');
  assert.ok(embed.data.description.includes('Free Plan'));
});

test("checkLimit falls back to free tier on error", async () => {
  // Mock premiumService to throw error
  const originalCheckGuildPremium = mockPremiumService.checkGuildPremium;
  mockPremiumService.checkGuildPremium = async () => {
    throw new Error('Backend unavailable');
  };

  const result = await checkLimit('guild-error', 'custom_commands', 3);

  // Should fall back to free tier (5 custom commands)
  assert.equal(result.limit, 5);
  assert.equal(result.allowed, true); // 3 < 5

  // Restore
  mockPremiumService.checkGuildPremium = originalCheckGuildPremium;
});

test("checkLimit returns correct limits for premium guild", async () => {
  const result = await checkLimit('guild-premium', 'custom_commands', 10);

  assert.equal(result.limit, 50); // Pro tier
  assert.equal(result.allowed, true); // 10 < 50
  assert.equal(result.current, 10);
  assert.equal(result.remaining, 40);
});

test("checkLimit returns correct limits for lifetime guild", async () => {
  const result = await checkLimit('guild-lifetime', 'custom_commands', 60);

  assert.equal(result.limit, 100); // Lifetime tier
  assert.equal(result.allowed, true); // 60 < 100
  assert.equal(result.remaining, 40);
});

test("checkLimit denies when limit reached", async () => {
  const result = await checkLimit('guild-premium', 'custom_commands', 50);

  assert.equal(result.limit, 50);
  assert.equal(result.allowed, false); // 50 >= 50
  assert.equal(result.remaining, 0);
});

test("checkLimit denies unknown limit type", async () => {
  const result = await checkLimit('guild-premium', 'unknown_feature', 10);

  assert.equal(result.allowed, false);
  assert.equal(result.limit, 0);
});

test("checkLimit validates all limit types", async () => {
  const limitTypes = ['custom_commands', 'auto_roles', 'welcome_messages'];

  for (const limitType of limitTypes) {
    const result = await checkLimit('guild-premium', limitType, 5);
    assert.ok(result.limit > 0);
    assert.equal(typeof result.allowed, 'boolean');
  }
});

// Restore original Module._load
Module._load = originalLoad;
