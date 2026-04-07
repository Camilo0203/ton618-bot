/**
 * Premium Service - Manages premium status for guilds
 * 
 * Strategy: Fetch from Supabase backend with MongoDB cache (TTL 5min)
 * Fallback: Use stale cache if backend fails
 * 
 * @module services/premiumService
 * 
 * @typedef {Object} PremiumStatus
 * @property {boolean} has_premium - Whether guild has active premium
 * @property {string|null} tier - Premium tier: 'pro_monthly' | 'pro_yearly' | 'lifetime' | null
 * @property {string|null} expires_at - ISO timestamp when premium expires (null for lifetime)
 * @property {boolean} lifetime - Whether this is a lifetime subscription
 * @property {string} [owner_user_id] - Discord user ID of subscription owner
 */

const axios = require('axios');
const { getDB } = require('../utils/database');

// Configuration from environment with safe defaults
const SUPABASE_URL = process.env.SUPABASE_URL;
const BOT_API_KEY = process.env.BOT_API_KEY;
const CACHE_TTL_MS = parseInt(process.env.PREMIUM_CACHE_TTL_MS, 10) || (5 * 60 * 1000); // 5 minutes
const STALE_CACHE_FALLBACK_MS = parseInt(process.env.PREMIUM_STALE_CACHE_MS, 10) || (60 * 60 * 1000); // 1 hour
const API_TIMEOUT_MS = parseInt(process.env.PREMIUM_API_TIMEOUT_MS, 10) || 8000; // 8 seconds
const API_MAX_RETRIES = parseInt(process.env.PREMIUM_API_MAX_RETRIES, 10) || 2;

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

  /**
   * Check guild premium status with cache-first strategy
   * @param {string} guildId - Discord guild ID
   * @returns {Promise<PremiumStatus>}
   */
  async checkGuildPremium(guildId) {
    if (!this.initialized) {
      console.warn('⚠️ Premium service not initialized, initializing now...');
      await this.initialize();
    }

    if (!guildId || typeof guildId !== 'string') {
      console.error('❌ Invalid guildId provided to checkGuildPremium:', guildId);
      return this.getDefaultPremiumStatus();
    }

    try {
      const cached = await this.getCachedPremium(guildId);
      if (cached) {
        return cached;
      }

      const fresh = await this.fetchPremiumFromAPI(guildId);
      await this.cachePremiumStatus(guildId, fresh);
      
      return fresh;
    } catch (error) {
      console.error(`❌ Critical error in checkGuildPremium for ${guildId}:`, error);
      return this.getDefaultPremiumStatus();
    }
  }

  async getCachedPremium(guildId) {
    try {
      if (!this.db) {
        console.warn('⚠️ Database not available for cache read');
        return null;
      }

      const cached = await this.db.collection('premium_cache').findOne({
        guild_id: guildId,
        ttl_expires_at: { $gt: new Date() }
      });

      if (cached) {
        return this._normalizePremiumData({
          has_premium: cached.has_premium,
          tier: cached.tier,
          expires_at: cached.expires_at,
          lifetime: cached.lifetime,
          owner_user_id: cached.owner_user_id,
        });
      }

      return null;
    } catch (error) {
      console.warn('⚠️ Error reading premium cache (non-critical):', error.message);
      return null;
    }
  }

  async fetchPremiumFromAPI(guildId) {
    if (!SUPABASE_URL || !BOT_API_KEY) {
      console.warn('⚠️ SUPABASE_URL or BOT_API_KEY not configured. Premium features disabled.');
      return this.getDefaultPremiumStatus();
    }

    let lastError = null;
    
    for (let attempt = 1; attempt <= API_MAX_RETRIES; attempt++) {
      try {
        const url = `${SUPABASE_URL}/functions/v1/billing-guild-status/${guildId}`;
        
        if (attempt === 1) {
          console.log(`🔍 Fetching premium status for guild ${guildId} from backend...`);
        } else {
          console.log(`🔄 Retry ${attempt}/${API_MAX_RETRIES} for guild ${guildId}...`);
        }
        
        const response = await axios.get(url, {
          headers: {
            'X-Bot-Api-Key': BOT_API_KEY,
          },
          timeout: API_TIMEOUT_MS,
          validateStatus: (status) => status === 200,
        });

        // Validate response structure
        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Invalid API response: missing data object');
        }

        const premiumData = this._normalizePremiumData({
          has_premium: response.data.has_premium,
          tier: response.data.plan_key,
          expires_at: response.data.ends_at,
          lifetime: response.data.lifetime,
        });

        console.log(`✅ Premium status fetched for guild ${guildId}:`, {
          has_premium: premiumData.has_premium,
          tier: premiumData.tier,
          lifetime: premiumData.lifetime,
        });

        return premiumData;
      } catch (error) {
        lastError = error;
        
        const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
        const isNetworkError = error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED';
        const shouldRetry = (isTimeout || isNetworkError) && attempt < API_MAX_RETRIES;
        
        if (shouldRetry) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.warn(`⚠️ API error (${error.message}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        break;
      }
    }

    console.error(`❌ All API attempts failed for guild ${guildId}:`, lastError?.message || 'Unknown error');
    
    // Try to use stale cache as fallback
    const staleCache = await this.getStaleCacheFallback(guildId);
    if (staleCache) {
      console.warn(`⚠️ Using stale cache for guild ${guildId} (API unavailable)`);
      return staleCache;
    }

    console.warn(`⚠️ No fallback available for guild ${guildId}, using default status`);
    return this.getDefaultPremiumStatus();
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
      if (!this.db) {
        return null;
      }

      const staleCache = await this.db.collection('premium_cache').findOne({
        guild_id: guildId,
        cached_at: { $gt: new Date(Date.now() - STALE_CACHE_FALLBACK_MS) }
      });

      if (staleCache) {
        return this._normalizePremiumData({
          has_premium: staleCache.has_premium,
          tier: staleCache.tier,
          expires_at: staleCache.expires_at,
          lifetime: staleCache.lifetime,
          owner_user_id: staleCache.owner_user_id,
        });
      }

      return null;
    } catch (error) {
      console.warn('⚠️ Error reading stale cache (non-critical):', error.message);
      return null;
    }
  }

  async cachePremiumStatus(guildId, premiumData) {
    try {
      if (!this.db) {
        console.warn('⚠️ Database not available, skipping cache write');
        return;
      }

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
            owner_user_id: premiumData.owner_user_id || null,
            cached_at: now,
            ttl_expires_at: ttlExpiresAt,
          }
        },
        { upsert: true }
      );

      console.log(`💾 Cached premium status for guild ${guildId} (TTL: ${CACHE_TTL_MS / 1000}s)`);
    } catch (error) {
      console.warn('⚠️ Error caching premium status (non-critical):', error.message);
    }
  }

  async invalidateCache(guildId) {
    try {
      if (!this.db) {
        console.warn('⚠️ Database not available, skipping cache invalidation');
        return;
      }

      if (!guildId || typeof guildId !== 'string') {
        console.error('❌ Invalid guildId provided to invalidateCache:', guildId);
        return;
      }

      await this.db.collection('premium_cache').deleteOne({ guild_id: guildId });
      console.log(`🗑️ Invalidated premium cache for guild ${guildId}`);
    } catch (error) {
      console.warn('⚠️ Error invalidating premium cache (non-critical):', error.message);
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
    if (!feature || typeof feature !== 'string') {
      console.error('❌ Invalid feature name provided to checkFeatureAccess:', feature);
      return false;
    }

    const premium = await this.checkGuildPremium(guildId);
    
    if (!premium.has_premium) {
      return false;
    }

    const tierFeatures = this.getTierFeatures(premium.tier);
    
    if (!(feature in tierFeatures)) {
      console.warn(`⚠️ Unknown feature requested: ${feature}`);
      return false;
    }
    
    return tierFeatures[feature] === true;
  }

  /**
   * Normalize and validate premium data shape
   * @private
   * @param {Object} data - Raw premium data
   * @returns {PremiumStatus}
   */
  _normalizePremiumData(data) {
    return {
      has_premium: Boolean(data?.has_premium),
      tier: data?.tier || null,
      expires_at: data?.expires_at || null,
      lifetime: Boolean(data?.lifetime),
      owner_user_id: data?.owner_user_id || null,
    };
  }
}

const premiumService = new PremiumService();

module.exports = {
  premiumService,
  PremiumService,
};
