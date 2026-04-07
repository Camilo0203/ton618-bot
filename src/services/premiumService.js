/**
 * Premium Service - Manages premium status for guilds
 * 
 * Strategy: Fetch from Supabase backend with MongoDB cache (TTL 5min)
 * Fallback: Use stale cache if backend fails
 * 
 * @module services/premiumService
 */

const axios = require('axios');
const { getDB } = require('../utils/database');

const SUPABASE_URL = process.env.SUPABASE_URL;
const BOT_API_KEY = process.env.BOT_API_KEY;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const STALE_CACHE_FALLBACK_MS = 60 * 60 * 1000; // 1 hour (for fallback when API fails)

class PremiumService {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      this.db = getDB();
      await this.ensurePremiumCacheCollection();
      this.initialized = true;
      console.log('✅ Premium service initialized');
    } catch (error) {
      console.error('❌ Error initializing premium service:', error);
      throw error;
    }
  }

  async ensurePremiumCacheCollection() {
    const collections = await this.db.listCollections().toArray();
    const exists = collections.some(col => col.name === 'premium_cache');
    
    if (!exists) {
      await this.db.createCollection('premium_cache');
      await this.db.collection('premium_cache').createIndex(
        { ttl_expires_at: 1 },
        { expireAfterSeconds: 0 }
      );
      await this.db.collection('premium_cache').createIndex({ guild_id: 1 });
    }
  }

  async checkGuildPremium(guildId) {
    const cached = await this.getCachedPremium(guildId);
    if (cached) {
      return cached;
    }

    const fresh = await this.fetchPremiumFromAPI(guildId);
    await this.cachePremiumStatus(guildId, fresh);
    
    return fresh;
  }

  async getCachedPremium(guildId) {
    try {
      const cached = await this.db.collection('premium_cache').findOne({
        guild_id: guildId,
        ttl_expires_at: { $gt: new Date() }
      });

      if (cached) {
        return {
          has_premium: cached.has_premium,
          tier: cached.tier,
          expires_at: cached.expires_at,
          owner_user_id: cached.owner_user_id,
        };
      }

      return null;
    } catch (error) {
      console.error('Error reading premium cache:', error);
      return null;
    }
  }

  async fetchPremiumFromAPI(guildId) {
    try {
      if (!SUPABASE_URL || !BOT_API_KEY) {
        console.warn('⚠️ SUPABASE_URL or BOT_API_KEY not configured. Premium features disabled.');
        return this.getDefaultPremiumStatus();
      }

      const url = `${SUPABASE_URL}/functions/v1/billing-guild-status/${guildId}`;
      
      console.log(`🔍 Fetching premium status for guild ${guildId} from backend...`);
      
      const response = await axios.get(url, {
        headers: {
          'X-Bot-Api-Key': BOT_API_KEY,
        },
        timeout: 5000,
      });

      const premiumData = {
        has_premium: response.data.has_premium || false,
        tier: response.data.plan_key || null,
        expires_at: response.data.ends_at || null,
        lifetime: response.data.lifetime || false,
      };

      console.log(`✅ Premium status fetched for guild ${guildId}:`, {
        has_premium: premiumData.has_premium,
        tier: premiumData.tier,
        lifetime: premiumData.lifetime,
      });

      return premiumData;
    } catch (error) {
      console.error(`❌ Error fetching premium status for guild ${guildId}:`, error.message);
      
      // Try to use stale cache as fallback
      const staleCache = await this.getStaleCacheFallback(guildId);
      if (staleCache) {
        console.warn(`⚠️ Using stale cache for guild ${guildId} (API unavailable)`);
        return staleCache;
      }

      return this.getDefaultPremiumStatus();
    }
  }

  getDefaultPremiumStatus() {
    return {
      has_premium: false,
      tier: null,
      expires_at: null,
      lifetime: false,
    };
  }

  async getStaleCacheFallback(guildId) {
    try {
      const staleCache = await this.db.collection('premium_cache').findOne({
        guild_id: guildId,
        cached_at: { $gt: new Date(Date.now() - STALE_CACHE_FALLBACK_MS) }
      });

      if (staleCache) {
        return {
          has_premium: staleCache.has_premium,
          tier: staleCache.tier,
          expires_at: staleCache.expires_at,
          lifetime: staleCache.lifetime,
        };
      }

      return null;
    } catch (error) {
      console.error('Error reading stale cache:', error);
      return null;
    }
  }

  async cachePremiumStatus(guildId, premiumData) {
    try {
      const now = new Date();
      const ttlExpiresAt = new Date(now.getTime() + CACHE_TTL_MS);

      await this.db.collection('premium_cache').updateOne(
        { guild_id: guildId },
        {
          $set: {
            guild_id: guildId,
            has_premium: premiumData.has_premium,
            tier: premiumData.tier,
            expires_at: premiumData.expires_at,
            lifetime: premiumData.lifetime || false,
            cached_at: now,
            ttl_expires_at: ttlExpiresAt,
          }
        },
        { upsert: true }
      );

      console.log(`💾 Cached premium status for guild ${guildId} (TTL: 5min)`);
    } catch (error) {
      console.error('❌ Error caching premium status:', error);
    }
  }

  async invalidateCache(guildId) {
    try {
      await this.db.collection('premium_cache').deleteOne({ guild_id: guildId });
      this.cache.delete(guildId);
    } catch (error) {
      console.error('Error invalidating premium cache:', error);
    }
  }

  async getPremiumTier(guildId) {
    const premium = await this.checkGuildPremium(guildId);
    return premium.tier;
  }

  async hasPremium(guildId) {
    const premium = await this.checkGuildPremium(guildId);
    return premium.has_premium;
  }

  async getPremiumGuilds() {
    try {
      const premiumGuilds = await this.db.collection('premium_cache')
        .find({
          has_premium: true,
          ttl_expires_at: { $gt: new Date() }
        })
        .toArray();

      return premiumGuilds.map(g => g.guild_id);
    } catch (error) {
      console.error('Error fetching premium guilds:', error);
      return [];
    }
  }

  getTierFeatures(tier) {
    const features = {
      pro_monthly: {
        name: 'Pro Monthly',
        max_custom_commands: 50,
        max_auto_roles: 20,
        max_welcome_messages: 10,
        advanced_moderation: true,
        custom_embeds: true,
        priority_support: true,
        analytics: true,
      },
      pro_yearly: {
        name: 'Pro Yearly',
        max_custom_commands: 50,
        max_auto_roles: 20,
        max_welcome_messages: 10,
        advanced_moderation: true,
        custom_embeds: true,
        priority_support: true,
        analytics: true,
      },
      lifetime: {
        name: 'Lifetime',
        max_custom_commands: 100,
        max_auto_roles: 50,
        max_welcome_messages: 20,
        advanced_moderation: true,
        custom_embeds: true,
        priority_support: true,
        analytics: true,
        exclusive_features: true,
      },
    };

    return features[tier] || {
      name: 'Free',
      max_custom_commands: 5,
      max_auto_roles: 3,
      max_welcome_messages: 1,
      advanced_moderation: false,
      custom_embeds: false,
      priority_support: false,
      analytics: false,
    };
  }

  async checkFeatureAccess(guildId, feature) {
    const premium = await this.checkGuildPremium(guildId);
    
    if (!premium.has_premium) {
      return false;
    }

    const tierFeatures = this.getTierFeatures(premium.tier);
    return tierFeatures[feature] === true;
  }
}

const premiumService = new PremiumService();

module.exports = {
  premiumService,
  PremiumService,
};
