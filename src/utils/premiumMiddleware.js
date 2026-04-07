const { premiumService } = require('../services/premiumService');
const { EmbedBuilder } = require('discord.js');

async function requirePremium(interaction, options = {}) {
  const guildId = interaction.guildId;
  
  if (!guildId) {
    await interaction.reply({
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return false;
  }

  const premium = await premiumService.checkGuildPremium(guildId);

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
        value: '[Visit our website](https://ton618.app/pricing) to upgrade your server!',
      })
      .setFooter({ text: 'Support the development of TON618 Bot' });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    
    return false;
  }

  if (options.requiredTier) {
    const tierHierarchy = {
      'pro_monthly': 1,
      'pro_yearly': 1,
      'lifetime': 2,
    };

    const userTierLevel = tierHierarchy[premium.tier] || 0;
    const requiredTierLevel = tierHierarchy[options.requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      const embed = new EmbedBuilder()
        .setColor('#FF6B6B')
        .setTitle('🔒 Higher Tier Required')
        .setDescription(
          `This feature requires **${options.requiredTier}** or higher.\n\n` +
          `Your current tier: **${premium.tier}**`
        )
        .addFields({
          name: '💎 Upgrade',
          value: '[Visit our website](https://ton618.app/pricing) to upgrade!',
        });

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      
      return false;
    }
  }

  return true;
}

async function requireFeature(interaction, featureName) {
  const guildId = interaction.guildId;
  
  if (!guildId) {
    await interaction.reply({
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return false;
  }

  const hasAccess = await premiumService.checkFeatureAccess(guildId, featureName);

  if (!hasAccess) {
    const embed = new EmbedBuilder()
      .setColor('#FF6B6B')
      .setTitle('🔒 Premium Feature')
      .setDescription(
        `The **${featureName}** feature requires a premium subscription.`
      )
      .addFields({
        name: '💎 Get Premium',
        value: '[Visit our website](https://ton618.app/pricing) to unlock this feature!',
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    
    return false;
  }

  return true;
}

function createPremiumEmbed(guildId, premium) {
  const embed = new EmbedBuilder()
    .setColor(premium.has_premium ? '#4CAF50' : '#9E9E9E')
    .setTitle(premium.has_premium ? '✨ Premium Active' : '📦 Free Plan');

  if (premium.has_premium) {
    const tierFeatures = premiumService.getTierFeatures(premium.tier);
    
    embed.setDescription(
      `**Current Plan:** ${tierFeatures.name}\n` +
      (premium.expires_at 
        ? `**Expires:** <t:${Math.floor(new Date(premium.expires_at).getTime() / 1000)}:R>`
        : '**Status:** Lifetime Access')
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
        value: '[Visit our pricing page](https://ton618.app/pricing)',
        inline: false,
      }
    );
  }

  return embed;
}

async function checkLimit(guildId, limitType, currentCount) {
  const premium = await premiumService.checkGuildPremium(guildId);
  const tierFeatures = premiumService.getTierFeatures(premium.tier);
  
  const limits = {
    custom_commands: tierFeatures.max_custom_commands,
    auto_roles: tierFeatures.max_auto_roles,
    welcome_messages: tierFeatures.max_welcome_messages,
  };

  const limit = limits[limitType];
  
  if (limit === undefined) {
    return { allowed: true, limit: Infinity, current: currentCount };
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
};
