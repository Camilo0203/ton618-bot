const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const {
  categories: configuredCategories = [],
  panel: configuredPanel = {},
} = require("../../../config");

const FALLBACK_CATEGORIES = [
  {
    id: "support",
    label: "Soporte General",
    description: "Ayuda con problemas generales",
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
      description: String(category.description || "Selecciona esta categoria para recibir ayuda").slice(0, 100),
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
  const guildName = guild?.name || "Sistema de Soporte";

  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Centro de Soporte y Ayuda",
      iconURL: guildIcon || undefined,
    })
    .setTitle("👋 ¡Hola! ¿En qué podemos ayudarte?")
    .setDescription(
      "Bienvenido a nuestro sistema de soporte. Estamos aquí para resolver cualquier duda o problema que tengas."
    )
    .setColor(0x5865F2)
    .setFooter({
      text: `${guildName} | Tu satisfacción es nuestra prioridad`,
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
  
  // Create a dynamic list of categories for the embed description
  let categoriesText = "**Departamentos Disponibles:**\n\n";
  normalizedCategories.forEach(cat => {
    const emoji = cat.emoji ? `${cat.emoji} ` : "💠 ";
    categoriesText += `${emoji}**${cat.label}:** ${cat.description}\n`;
  });
  
  categoriesText += "\nPor favor, selecciona la opción que mejor describa tu necesidad en el menú de abajo. Esto nos ayudará a conectarte con el equipo adecuado más rápido.";

  const embed = buildTicketPanelEmbed(guild, openTicketCount);
  embed.setDescription(embed.data.description + "\n\n" + categoriesText);

  if (openTicketCount > 0) {
    embed.addFields({
      name: "📊 Estado Actual",
      value: `Tenemos \`${openTicketCount}\` tickets en atención. ¡Te responderemos lo antes posible!`,
      inline: false,
    });
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId("ticket_category_select")
    .setPlaceholder("Selecciona una opción de contacto...")
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
      .setLabel("Preguntas Frecuentes (FAQ)")
      .setEmoji("💡")
      .setStyle(2) // Secondary
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
