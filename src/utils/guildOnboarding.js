const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { settings } = require("./database");
const { logStructured } = require("./observability");
const { t } = require("./i18n");
const { COLORS, BRAND, ICONS } = require("./brand");

const ONBOARDING_CUSTOM_ID_PREFIX = "guild_language_select";
const ONBOARDING_PERMISSIONS = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.EmbedLinks,
];
const PRIORITY_CHANNEL_NAMES = [
  "setup",
  "bot",
  "welcome",
  "general",
  "staff",
  "admin",
];

function isWritableOnboardingChannel(channel, guild) {
  if (!channel || !guild?.members?.me) return false;
  if (![ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(channel.type)) {
    return false;
  }
  const permissions = channel.permissionsFor(guild.members.me);
  return ONBOARDING_PERMISSIONS.every((permission) => permissions?.has(permission));
}

function resolveOnboardingChannel(guild) {
  if (!guild) return null;

  if (isWritableOnboardingChannel(guild.systemChannel, guild)) {
    return guild.systemChannel;
  }

  const channels = Array.from(guild.channels.cache.values()).filter((channel) =>
    isWritableOnboardingChannel(channel, guild)
  );

  channels.sort((a, b) => {
    const aName = String(a.name || "").toLowerCase();
    const bName = String(b.name || "").toLowerCase();
    const aIndex = PRIORITY_CHANNEL_NAMES.findIndex((token) => aName.includes(token));
    const bIndex = PRIORITY_CHANNEL_NAMES.findIndex((token) => bName.includes(token));
    const aScore = aIndex === -1 ? 999 : aIndex;
    const bScore = bIndex === -1 ? 999 : bIndex;
    if (aScore !== bScore) return aScore - bScore;
    return a.position - b.position;
  });

  return channels[0] || null;
}

function buildOnboardingEmbed(locale = 'en') {
  return new EmbedBuilder()
    .setColor(COLORS.PRIMARY)
    .setTitle(`${ICONS.bot} ${t(locale, 'onboarding.embed.title', { brand: BRAND.NAME })}`)
    .setDescription(
      t(locale, 'onboarding.embed.description', {
        brand: BRAND.NAME,
        ticketIcon: ICONS.ticket,
        moderationIcon: ICONS.moderation,
        giveawayIcon: ICONS.giveaway,
        statsIcon: ICONS.stats,
        settingsIcon: ICONS.settings
      })
    )
    .setFooter({ text: `${BRAND.NAME} • ${BRAND.TAGLINE}` })
    .setTimestamp();
}

function buildOnboardingComponents(guildId, locale = 'en') {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`${ONBOARDING_CUSTOM_ID_PREFIX}:${guildId}:en`)
        .setLabel("English")
        .setEmoji("🇺🇸")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`${ONBOARDING_CUSTOM_ID_PREFIX}:${guildId}:es`)
        .setLabel("Español")
        .setEmoji("🇪🇸")
        .setStyle(ButtonStyle.Secondary)
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(t(locale, 'onboarding.buttons.documentation'))
        .setURL(BRAND.WEBSITE)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel(t(locale, 'onboarding.buttons.support_server'))
        .setURL(BRAND.SUPPORT_URL)
        .setStyle(ButtonStyle.Link)
    ),
  ];
}

async function resolveOnboardingDmTarget(guild) {
  const owner = await guild.fetchOwner().catch(() => null);
  if (owner?.user) {
    return owner.user;
  }

  return guild.members.cache.find(
    (member) =>
      !member.user?.bot &&
      member.permissions?.has?.(PermissionFlagsBits.Administrator)
  )?.user || null;
}

async function sendGuildLanguageOnboarding(guild, locale = 'en') {
  const currentSettings = await settings.get(guild.id);
  logStructured("info", "guild.joined", {
    guildId: guild.id,
    guildName: guild.name,
    memberCount: guild.memberCount || null,
  });

  if (currentSettings?.language_onboarding_completed === true) {
    return { delivered: false, skipped: true };
  }

  logStructured("info", "language.default_fallback", {
    guildId: guild.id,
    defaultLanguage: locale,
    reason: "guild_join_no_explicit_language",
  });

  const payload = {
    embeds: [buildOnboardingEmbed(locale)],
    components: buildOnboardingComponents(guild.id, locale),
  };

  const channel = resolveOnboardingChannel(guild);
  if (channel) {
    try {
      const message = await channel.send(payload);
      logStructured("info", "onboarding.language_prompt_sent", {
        guildId: guild.id,
        channelId: channel.id,
        delivery: "channel",
        messageId: message.id,
      });
      return { delivered: true, delivery: "channel", channelId: channel.id, messageId: message.id };
    } catch (error) {
      logStructured("warn", "onboarding.language_prompt_channel_failed", {
        guildId: guild.id,
        channelId: channel.id,
        error: error?.message || String(error),
      });
    }
  }

  const dmTarget = await resolveOnboardingDmTarget(guild);
  if (dmTarget) {
    try {
      const message = await dmTarget.send({
        content: t(locale, "onboarding.dm_fallback_intro"),
        ...payload,
      });
      logStructured("info", "onboarding.language_prompt_sent", {
        guildId: guild.id,
        userId: dmTarget.id,
        delivery: "dm",
        messageId: message.id,
      });
      return { delivered: true, delivery: "dm", userId: dmTarget.id, messageId: message.id };
    } catch (error) {
      logStructured("warn", "onboarding.language_prompt_dm_failed", {
        guildId: guild.id,
        userId: dmTarget.id,
        error: error?.message || String(error),
      });
    }
  }

  logStructured("error", "onboarding.language_delivery_failed", {
    guildId: guild.id,
  });
  return { delivered: false, delivery: "none" };
}

module.exports = {
  ONBOARDING_CUSTOM_ID_PREFIX,
  resolveOnboardingChannel,
  buildOnboardingEmbed,
  buildOnboardingComponents,
  sendGuildLanguageOnboarding,
};
