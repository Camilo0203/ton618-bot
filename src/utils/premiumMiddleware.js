const { premiumService } = require('../services/premiumService');
const { EmbedBuilder } = require('discord.js');

// Configuration from environment with safe fallback
const PRICING_URL = process.env.PRO_UPGRADE_URL || 'https://ton618.app/pricing';
const INTERACTION_TIMEOUT_MS = 2900; // Discord's 3s limit with safety margin

/**
 * Safely respond to interaction regardless of its state
 * Handles replied, deferred, and timed-out interactions gracefully
 * @param {import('discord.js').CommandInteraction} interaction - Discord interaction
 * @param {Object} payload - Response payload
 * @returns {Promise<Message|void>}
 */
async function safeReply(interaction, payload) {
  // Validate interaction object
  if (!interaction || typeof interaction !== 'object') {
    console.error('❌ Invalid interaction object provided to safeReply');
    return;
  }

  try {
    // Check if interaction is still valid (not timed out)
    const createdTimestamp = interaction.createdTimestamp || Date.now();
    const age = Date.now() - createdTimestamp;
    
    if (age > INTERACTION_TIMEOUT_MS && !interaction.deferred && !interaction.replied) {
      console.warn(`⚠️ Interaction likely expired (${age}ms, not deferred/replied) — response will probably fail. Consider deferring before async calls.`);
    }

    // Determine the appropriate response method
    if (interaction.replied || interaction.deferred) {
      return await interaction.editReply(payload);
    }
    
    return await interaction.reply(payload);
  } catch (error) {
    // Log detailed error for debugging
    console.error('❌ Error sending interaction response:', {
      error: error.message,
      code: error.code,
      replied: interaction.replied,
      deferred: interaction.deferred,
    });
    
    // Try followUp as last resort (only if interaction had a prior response)
    try {
      if (interaction.replied || interaction.deferred) {
        return await interaction.followUp({ ...payload, ephemeral: true });
      }
      // reply() failed AND no initial response exists — interaction likely expired (>3s).
      // Commands that call requirePremium should defer the interaction first if they
      // have other async operations that might delay the response.
      console.error('❌ Cannot recover: interaction expired with no initial response. Was the interaction deferred before calling premium checks?');
    } catch (followUpError) {
      console.error('❌ All response methods failed:', followUpError.message);
      // Don't throw - let the command fail gracefully
    }
  }
}

/**
 * Require premium subscription for command execution
 * @param {import('discord.js').CommandInteraction} interaction - Discord interaction
 * @param {Object} options - Options for premium check
 * @param {string} [options.requiredTier] - Minimum tier required
 * @returns {Promise<boolean>} - True if premium check passed
 */
async function requirePremium(interaction, options = {}) {
  // Validate interaction
  if (!interaction || !interaction.guildId) {
    console.warn('⚠️ requirePremium called without valid guild context');
    await safeReply(interaction, {
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return false;
  }

  const guildId = interaction.guildId;

  // Warn if interaction is not deferred and may be approaching Discord's 3s limit.
  // On cache miss, checkGuildPremium can take up to API_TIMEOUT_MS before responding.
  // Best practice: defer the interaction before calling requirePremium when other async
  // work precedes or follows this call.
  if (!interaction.deferred && !interaction.replied) {
    const age = Date.now() - (interaction.createdTimestamp || Date.now());
    if (age > 1000) {
      console.warn(`⚠️ requirePremium: interaction is ${age}ms old and not deferred (guild ${guildId}). Risk of timeout on cache miss.`);
    }
  }

  let premium;
  try {
    premium = await premiumService.checkGuildPremium(guildId);
  } catch (error) {
    console.error(`❌ Error checking premium for guild ${guildId}:`, error);
    await safeReply(interaction, {
      content: '❌ Unable to verify premium status. Please try again later.',
      ephemeral: true,
    });
    return false;
  }

  if (!premium.has_premium) {
    const embed = new EmbedBuilder()
      .setColor('#FF6B6B')
      .setTitle('🔒 Premium Feature')
      .setDescription(
        'This feature requires a **TON618 Pro** subscription.\n\n' +
        '**Upgrade to unlock:**\n' +
        '• Advanced moderation tools\n' +
        '• Custom embeds & commands\n' +
        '• Priority support\n' +
        '• Analytics & insights\n' +
        '• And much more!'
      )
      .addFields({
        name: '💎 Get Premium',
        value: `[Visit our website](${PRICING_URL}) to upgrade your server!`,
      })
      .setFooter({ text: 'Support the development of TON618 Bot' });

    await safeReply(interaction, {
      embeds: [embed],
      ephemeral: true,
    });
    
    return false;
  }

  // Validate tier requirement if specified
  if (options.requiredTier) {
    const tierHierarchy = {
      'pro_monthly': 1,
      'pro_yearly': 1,
      'lifetime': 2,
    };

    if (!(options.requiredTier in tierHierarchy)) {
      console.error(`❌ Invalid requiredTier specified: ${options.requiredTier}`);
      return false;
    }

    const userTierLevel = tierHierarchy[premium.tier] || 0;
    const requiredTierLevel = tierHierarchy[options.requiredTier];

    if (userTierLevel < requiredTierLevel) {
      const currentTierName = premiumService.getTierFeatures(premium.tier).name;
      const requiredTierName = premiumService.getTierFeatures(options.requiredTier).name;
      const embed = new EmbedBuilder()
        .setColor('#FF6B6B')
        .setTitle('🔒 Higher Tier Required')
        .setDescription(
          `This feature requires **${requiredTierName}** or higher.\n\n` +
          `Your current tier: **${currentTierName}**`
        )
        .addFields({
          name: '💎 Upgrade',
          value: `[Visit our website](${PRICING_URL}) to upgrade!`,
        });

      await safeReply(interaction, {
        embeds: [embed],
        ephemeral: true,
      });
      
      return false;
    }
  }

  return true;
}

/**
 * Require specific premium feature access
 * @param {import('discord.js').CommandInteraction} interaction - Discord interaction
 * @param {string} featureName - Feature name to check
 * @returns {Promise<boolean>} - True if feature access granted
 */
async function requireFeature(interaction, featureName) {
  // Validate inputs
  if (!interaction || !interaction.guildId) {
    console.warn('⚠️ requireFeature called without valid guild context');
    await safeReply(interaction, {
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return false;
  }

  if (!featureName || typeof featureName !== 'string') {
    console.error('❌ Invalid featureName provided to requireFeature:', featureName);
    return false;
  }

  const guildId = interaction.guildId;

  let hasAccess;
  try {
    hasAccess = await premiumService.checkFeatureAccess(guildId, featureName);
  } catch (error) {
    console.error(`❌ Error checking feature access for guild ${guildId}:`, error);
    await safeReply(interaction, {
      content: '❌ Unable to verify feature access. Please try again later.',
      ephemeral: true,
    });
    return false;
  }

  if (!hasAccess) {
    const embed = new EmbedBuilder()
      .setColor('#FF6B6B')
      .setTitle('🔒 Premium Feature')
      .setDescription(
        `The **${featureName}** feature requires a premium subscription.`
      )
      .addFields({
        name: '💎 Get Premium',
        value: `[Visit our website](${PRICING_URL}) to unlock this feature!`,
      });

    await safeReply(interaction, {
      embeds: [embed],
      ephemeral: true,
    });
    
    return false;
  }

  return true;
}

/**
 * Create embed displaying premium status
 * @param {string} guildId - Guild ID
 * @param {import('../services/premiumService').PremiumStatus} premium - Premium status object
 * @returns {EmbedBuilder} - Discord embed
 */
function createPremiumEmbed(guildId, premium) {
  // Validate inputs
  if (!premium || typeof premium !== 'object') {
    console.error('❌ Invalid premium object provided to createPremiumEmbed');
    premium = { has_premium: false, tier: null, expires_at: null, lifetime: false };
  }

  const embed = new EmbedBuilder()
    .setColor(premium.has_premium ? '#4CAF50' : '#9E9E9E')
    .setTitle(premium.has_premium ? '✨ Premium Active' : '📦 Free Plan');

  if (premium.has_premium) {
    const tierFeatures = premiumService.getTierFeatures(premium.tier);
    
    // Safe date handling for expires_at with expiration check
    let expirationText = '**Status:** Lifetime Access';
    if (premium.expires_at && !premium.lifetime) {
      try {
        const expiresDate = new Date(premium.expires_at);
        if (!isNaN(expiresDate.getTime())) {
          const now = new Date();
          if (expiresDate <= now) {
            // Premium expired (cache may be stale)
            expirationText = '**Status:** Expired (updating...)';
          } else {
            const timestamp = Math.floor(expiresDate.getTime() / 1000);
            expirationText = `**Expires:** <t:${timestamp}:R>`;
          }
        } else {
          console.warn(`⚠️ Invalid expires_at date for guild ${guildId}:`, premium.expires_at);
          expirationText = '**Status:** Active';
        }
      } catch (error) {
        console.error('❌ Error parsing expires_at:', error);
        expirationText = '**Status:** Active';
      }
    }
    
    embed.setDescription(
      `**Current Plan:** ${tierFeatures.name}\n` + expirationText
    );

    embed.addFields(
      {
        name: '📊 Features',
        value: [
          `• Custom Commands: **${tierFeatures.max_custom_commands}**`,
          `• Auto Roles: **${tierFeatures.max_auto_roles}**`,
          `• Welcome Messages: **${tierFeatures.max_welcome_messages}**`,
          tierFeatures.advanced_moderation ? '✅ Advanced Moderation' : '',
          tierFeatures.custom_embeds ? '✅ Custom Embeds' : '',
          tierFeatures.priority_support ? '✅ Priority Support' : '',
          tierFeatures.analytics ? '✅ Analytics' : '',
          tierFeatures.exclusive_features ? '✅ Exclusive Features' : '',
        ].filter(Boolean).join('\n'),
        inline: false,
      }
    );
  } else {
    embed.setDescription(
      'Your server is currently on the **Free Plan**.\n\n' +
      'Upgrade to unlock premium features!'
    );

    embed.addFields(
      {
        name: '🆓 Free Plan Limits',
        value: [
          '• Custom Commands: **5**',
          '• Auto Roles: **3**',
          '• Welcome Messages: **1**',
          '❌ Advanced Moderation',
          '❌ Custom Embeds',
          '❌ Priority Support',
          '❌ Analytics',
        ].join('\n'),
        inline: false,
      },
      {
        name: '💎 Upgrade Now',
        value: `[Visit our pricing page](${PRICING_URL})`,
        inline: false,
      }
    );
  }

  return embed;
}

/**
 * Check if guild is within limits for a specific feature
 * @param {string} guildId - Guild ID
 * @param {string} limitType - Type of limit to check
 * @param {number} currentCount - Current usage count
 * @returns {Promise<Object>} - Limit check result
 */
async function checkLimit(guildId, limitType, currentCount) {
  // Validate inputs
  if (!guildId || typeof guildId !== 'string') {
    console.error('❌ Invalid guildId provided to checkLimit:', guildId);
    return { allowed: false, limit: 0, current: currentCount, remaining: 0 };
  }

  if (typeof currentCount !== 'number' || currentCount < 0) {
    console.error('❌ Invalid currentCount provided to checkLimit:', currentCount);
    currentCount = 0;
  }

  let premium;
  try {
    premium = await premiumService.checkGuildPremium(guildId);
  } catch (error) {
    console.error(`❌ Error checking premium for limit check (guild ${guildId}):`, error);
    // Fail safe: fall back to free tier limits (graceful degradation)
    // Note: checkGuildPremium handles its own errors internally, so this catch is
    // a last-resort safety net that should rarely trigger in practice.
    premium = premiumService.getDefaultPremiumStatus();
  }

  const tierFeatures = premiumService.getTierFeatures(premium.tier);
  
  const limits = {
    custom_commands: tierFeatures.max_custom_commands,
    auto_roles: tierFeatures.max_auto_roles,
    welcome_messages: tierFeatures.max_welcome_messages,
  };

  const limit = limits[limitType];
  
  if (limit === undefined) {
    console.error(`❌ Unknown limit type requested: ${limitType}`);
    // Fail safe: deny access for unknown limit types
    return { allowed: false, limit: 0, current: currentCount, remaining: 0 };
  }

  return {
    allowed: currentCount < limit,
    limit,
    current: currentCount,
    remaining: Math.max(0, limit - currentCount),
  };
}

module.exports = {
  requirePremium,
  requireFeature,
  createPremiumEmbed,
  checkLimit,
  safeReply,
};
