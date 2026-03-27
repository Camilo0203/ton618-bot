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

const FALLBACK_CATEGORIES = [
  {
    id: "support",
    label: "General Support",
    description: "Help with general issues",
  },
];

function normalizeCategories(categories = configuredCategories) {
  const input = Array.isArray(categories) && categories.length ? categories : FALLBACK_CATEGORIES;
  const output = [];

  for (const category of input) {
    if (!category?.id || !category?.label) continue;
    const normalized = {
      id: String(category.id).slice(0, 100),
      label: String(category.label).slice(0, 100),
      description: String(category.description || "Select this category to get help").slice(0, 100),
    };

    if (typeof category.emoji === "string" && category.emoji.trim()) {
      normalized.emoji = category.emoji.trim();
    }

    output.push(normalized);
  }

  return output.length ? output : FALLBACK_CATEGORIES;
}

function buildTicketPanelEmbed(guild, openTicketCount = 0) {
  const panelImage = process.env.TICKET_PANEL_IMAGE_URL || configuredPanel.image || null;
  const guildIcon = typeof guild?.iconURL === "function"
    ? guild.iconURL({ dynamic: true })
    : null;
  const guildThumbnail = typeof guild?.iconURL === "function"
    ? guild.iconURL({ dynamic: true, size: 256 })
    : null;
  const guildName = guild?.name || "Support Center";
  const title = configuredPanel.title || "🎫 Support Center";
  const description = configuredPanel.description
    || "Open a private ticket by selecting the category that best fits your request.";
  const footer = configuredPanel.footer || `${guildName} • Professional support`;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: title,
      iconURL: guildIcon || undefined,
    })
    .setTitle("Need help? We are here for you.")
    .setDescription(description)
    .setColor(configuredPanel.color || 0x5865F2)
    .setFooter({
      text: footer,
    })
    .setTimestamp();

  if (guildThumbnail) {
    embed.setThumbnail(guildThumbnail);
  }

  if (panelImage) {
    embed.setImage(panelImage);
  }

  return embed;
}

function buildTicketPanelPayload({ guild, categories = configuredCategories, openTicketCount = 0 } = {}) {
  const normalizedCategories = normalizeCategories(categories).slice(0, 25);
  if (normalizedCategories.length === 0) {
    throw new Error(
      "No ticket categories are configured. " +
      "Configure at least one category before publishing the panel.",
    );
  }

  let categoriesText = "**📋 Choose a category:**\n\n";
  normalizedCategories.forEach((category) => {
    const emoji = category.emoji ? `${category.emoji} ` : "💠 ";
    categoriesText += `${emoji}**${category.label}** • ${category.description}\n`;
  });
  categoriesText += "\n✨ **Choose an option from the menu below to get started.**";

  const embed = buildTicketPanelEmbed(guild, openTicketCount);
  embed.setDescription(`${embed.data.description}\n\n${categoriesText}`);

  if (openTicketCount > 0) {
    embed.addFields({
      name: "📊 Current queue",
      value: `We currently have \`${openTicketCount}\` active ticket(s). We will reply as soon as possible.`,
      inline: false,
    });
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId("ticket_category_select")
    .setPlaceholder("🎯 Select the category you need...")
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
      .setLabel("Frequently Asked Questions")
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
