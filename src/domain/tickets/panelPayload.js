const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  categories: configuredCategories = [],
  panel: configuredPanel = {},
} = require("../../../config");
const { buildPublicPanelPresentation } = require("../../utils/ticketCustomization");
const { resolveGuildLanguage, t } = require("../../utils/i18n");

function normalizeCategories(categories = configuredCategories, language = "en") {
  const input = Array.isArray(categories) && categories.length ? categories : [
    {
      id: "support",
      label: t(language, "ticket.panel.default_category"),
      description: t(language, "ticket.panel.default_description"),
    },
  ];
  const output = [];

  for (const category of input) {
    if (!category?.id) continue;
    // Resolve translation keys if present, otherwise use raw values
    const label = category.labelKey ? t(language, category.labelKey) : category.label;
    const description = category.descriptionKey ? t(language, category.descriptionKey) : (category.description || t(language, "ticket.panel.default_description"));
    if (!label) continue;
    const normalized = {
      id: String(category.id).slice(0, 100),
      label: String(label).slice(0, 100),
      description: String(description).slice(0, 100),
    };

    if (typeof category.emoji === "string" && category.emoji.trim()) {
      normalized.emoji = category.emoji.trim();
    }

    output.push(normalized);
  }

  return output.length ? output : [
    {
      id: "support",
      label: t(language, "ticket.panel.default_category"),
      description: t(language, "ticket.panel.default_description"),
    },
  ];
}

function buildTicketPanelEmbed(guild, openTicketCount = 0, settingsRecord = null) {
  const language = resolveGuildLanguage(settingsRecord, "en");
  const panelImage = process.env.TICKET_PANEL_IMAGE_URL || configuredPanel.image || null;
  const guildIcon = guild?.iconURL?.({ dynamic: true }) || null;
  const guildThumbnail = guild?.iconURL?.({ dynamic: true, size: 256 }) || null;

  // Resolve translation keys if present
  const fallbackTitle = configuredPanel.titleKey ? t(language, configuredPanel.titleKey) : configuredPanel.title;
  const fallbackDescription = configuredPanel.descriptionKey ? t(language, configuredPanel.descriptionKey) : configuredPanel.description;
  const fallbackFooter = configuredPanel.footerKey ? t(language, configuredPanel.footerKey) : configuredPanel.footer;

  const presentation = buildPublicPanelPresentation({
    guild,
    settingsRecord,
    isPro: false, // Solo servidores PRO pueden personalizar el panel
    fallback: {
      title: fallbackTitle,
      description: fallbackDescription,
      footer: fallbackFooter,
      color: configuredPanel.color || 0x5865F2,
      image: panelImage,
    },
  });

  const embed = new EmbedBuilder()
    .setAuthor({
      name: guild?.name || "Support Center",
      iconURL: guildIcon || undefined,
    })
    .setTitle(presentation.title)
    .setDescription(presentation.description)
    .setColor(presentation.color)
    .setFooter({
      text: presentation.footer,
    })
    .setTimestamp();

  if (guildThumbnail) {
    embed.setThumbnail(guildThumbnail);
  }

  if (presentation.image) {
    embed.setImage(presentation.image);
  }

  return embed;
}

function buildCategorySummary(normalizedCategories, language) {
  let categoriesText = `**${t(language, "ticket.panel.categories_heading")}**\n\n`;

  normalizedCategories.forEach((category) => {
    const emoji = category.emoji ? `${category.emoji} ` : "- ";
    categoriesText += `${emoji}**${category.label}** - ${category.description}\n`;
  });

  categoriesText += `\n**${t(language, "ticket.panel.categories_cta")}**`;
  return categoriesText;
}

function buildTicketPanelPayload({
  guild,
  categories = configuredCategories,
  openTicketCount = 0,
  settingsRecord = null,
} = {}) {
  const language = resolveGuildLanguage(settingsRecord, "en");
  const normalizedCategories = normalizeCategories(categories, language).slice(0, 25);

  if (normalizedCategories.length === 0) {
    throw new Error(
      "No ticket categories are configured. " +
      "Configure at least one category before publishing the panel."
    );
  }

  const embed = buildTicketPanelEmbed(guild, openTicketCount, settingsRecord);
  embed.setDescription(
    `${embed.data.description}\n\n${buildCategorySummary(normalizedCategories, language)}`
  );

  if (openTicketCount > 0) {
    embed.addFields({
      name: t(language, "ticket.panel.queue_name"),
      value: t(language, "ticket.panel.queue_value", { openTicketCount }),
      inline: false,
    });
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId("ticket_category_select")
    .setPlaceholder(t(language, "ticket.picker.select_placeholder"))
    .addOptions(
      normalizedCategories.map((category) => ({
        label: category.label,
        description: category.description,
        value: category.id,
        ...(category.emoji ? { emoji: category.emoji } : {}),
      }))
    );

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket_faq")
      .setLabel(t(language, "ticket.panel.faq_button"))
      .setEmoji("💡")
      .setStyle(ButtonStyle.Secondary)
  );

  return {
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(menu), buttons],
  };
}

module.exports = {
  buildTicketPanelPayload,
  buildTicketPanelEmbed,
  normalizeCategories,
};
