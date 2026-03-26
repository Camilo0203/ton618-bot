const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { ticketCategories } = require("../../../utils/database");
const E = require("../../../utils/embeds");

function register(builder) {
  return builder
    .addSubcommandGroup((group) =>
      group
        .setName("category")
        .setDescription("Gestionar categorías de tickets")
        .addSubcommand((sub) =>
          sub
            .setName("add")
            .setDescription("Añadir una nueva categoría de tickets")
            .addStringOption((opt) =>
              opt
                .setName("id")
                .setDescription("ID único de la categoría (sin espacios, ej: soporte_general)")
                .setRequired(true)
                .setMaxLength(50)
            )
            .addStringOption((opt) =>
              opt
                .setName("label")
                .setDescription("Nombre visible de la categoría")
                .setRequired(true)
                .setMaxLength(100)
            )
            .addStringOption((opt) =>
              opt
                .setName("description")
                .setDescription("Descripción breve de la categoría")
                .setRequired(true)
                .setMaxLength(200)
            )
            .addStringOption((opt) =>
              opt
                .setName("emoji")
                .setDescription("Emoji para la categoría (ej: 🛠️)")
                .setRequired(false)
            )
            .addStringOption((opt) =>
              opt
                .setName("priority")
                .setDescription("Prioridad de los tickets de esta categoría")
                .setRequired(false)
                .addChoices(
                  { name: "🟢 Baja", value: "low" },
                  { name: "🟡 Normal", value: "normal" },
                  { name: "🟠 Alta", value: "high" },
                  { name: "🔴 Urgente", value: "urgent" }
                )
            )
            .addStringOption((opt) =>
              opt
                .setName("discord_category")
                .setDescription("ID de la categoría de Discord donde crear los canales (opcional)")
                .setRequired(false)
            )
            .addStringOption((opt) =>
              opt
                .setName("ping_roles")
                .setDescription("IDs de roles a mencionar separados por comas (ej: 123,456,789)")
                .setRequired(false)
            )
            .addStringOption((opt) =>
              opt
                .setName("welcome_message")
                .setDescription("Mensaje de bienvenida personalizado (usa {user} para mencionar)")
                .setRequired(false)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("remove")
            .setDescription("Eliminar una categoría de tickets")
            .addStringOption((opt) =>
              opt
                .setName("id")
                .setDescription("ID de la categoría a eliminar")
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("list")
            .setDescription("Ver todas las categorías configuradas")
        )
        .addSubcommand((sub) =>
          sub
            .setName("edit")
            .setDescription("Editar una categoría existente")
            .addStringOption((opt) =>
              opt
                .setName("id")
                .setDescription("ID de la categoría a editar")
                .setRequired(true)
                .setAutocomplete(true)
            )
            .addStringOption((opt) =>
              opt
                .setName("label")
                .setDescription("Nuevo nombre (dejar vacío para no cambiar)")
                .setRequired(false)
                .setMaxLength(100)
            )
            .addStringOption((opt) =>
              opt
                .setName("description")
                .setDescription("Nueva descripción (dejar vacío para no cambiar)")
                .setRequired(false)
                .setMaxLength(200)
            )
            .addStringOption((opt) =>
              opt
                .setName("emoji")
                .setDescription("Nuevo emoji (dejar vacío para no cambiar)")
                .setRequired(false)
            )
            .addStringOption((opt) =>
              opt
                .setName("priority")
                .setDescription("Nueva prioridad (dejar vacío para no cambiar)")
                .setRequired(false)
                .addChoices(
                  { name: "🟢 Baja", value: "low" },
                  { name: "🟡 Normal", value: "normal" },
                  { name: "🟠 Alta", value: "high" },
                  { name: "🔴 Urgente", value: "urgent" }
                )
            )
            .addStringOption((opt) =>
              opt
                .setName("discord_category")
                .setDescription("ID de categoría Discord (vacío para quitar)")
                .setRequired(false)
            )
            .addStringOption((opt) =>
              opt
                .setName("ping_roles")
                .setDescription("IDs de roles separados por comas (vacío para quitar)")
                .setRequired(false)
            )
            .addStringOption((opt) =>
              opt
                .setName("welcome_message")
                .setDescription("Mensaje de bienvenida (vacío para quitar)")
                .setRequired(false)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("toggle")
            .setDescription("Activar/desactivar una categoría")
            .addStringOption((opt) =>
              opt
                .setName("id")
                .setDescription("ID de la categoría")
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
    );
}

async function execute(ctx) {
  const { interaction, group, sub } = ctx;
  
  if (group !== "category") return false;

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({
      embeds: [E.errorEmbed("Solo los administradores pueden gestionar categorías de tickets.")],
      flags: 64,
    });
    return true;
  }

  const guildId = interaction.guild.id;

  try {
    switch (sub) {
      case "add":
        await handleAdd(interaction, guildId);
        break;
      case "remove":
        await handleRemove(interaction, guildId);
        break;
      case "list":
        await handleList(interaction, guildId);
        break;
      case "edit":
        await handleEdit(interaction, guildId);
        break;
      case "toggle":
        await handleToggle(interaction, guildId);
        break;
      default:
        return false;
    }
  } catch (error) {
    console.error("[CATEGORY COMMAND ERROR]", error);
    await interaction.reply({
      embeds: [E.errorEmbed("Ocurrió un error al procesar el comando: " + error.message)],
      flags: 64,
    });
  }

  return true;
}

async function handleAdd(interaction, guildId) {
  await interaction.deferReply({ flags: 64 });

  const categoryId = interaction.options.getString("id").toLowerCase().replace(/\s+/g, "_");
  const label = interaction.options.getString("label");
  const description = interaction.options.getString("description");
  const emoji = interaction.options.getString("emoji");
  const priority = interaction.options.getString("priority") || "normal";
  const discordCategory = interaction.options.getString("discord_category");
  const pingRolesStr = interaction.options.getString("ping_roles");
  const welcomeMessage = interaction.options.getString("welcome_message");

  const pingRoles = pingRolesStr ? pingRolesStr.split(",").map(id => id.trim()).filter(id => id) : [];

  try {
    const category = await ticketCategories.create(guildId, {
      category_id: categoryId,
      label,
      description,
      emoji,
      priority,
      discord_category_id: discordCategory,
      ping_roles: pingRoles,
      welcome_message: welcomeMessage,
    });

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("✅ Categoría Creada")
          .setDescription(
            `La categoría **${label}** ha sido creada exitosamente.\n\n` +
            `**ID:** \`${categoryId}\`\n` +
            `**Descripción:** ${description}\n` +
            `${emoji ? `**Emoji:** ${emoji}\n` : ""}` +
            `**Prioridad:** ${getPriorityLabel(priority)}\n` +
            `${discordCategory ? `**Categoría Discord:** \`${discordCategory}\`\n` : ""}` +
            `${pingRoles.length ? `**Roles a mencionar:** ${pingRoles.length} rol(es)\n` : ""}` +
            `${welcomeMessage ? `**Mensaje personalizado:** Configurado\n` : ""}\n` +
            `Usa \`/config category list\` para ver todas las categorías.`
          )
          .setFooter({ text: "TON618 Tickets - Gestión de Categorías" })
          .setTimestamp()
      ],
    });
  } catch (error) {
    await interaction.editReply({
      embeds: [E.errorEmbed(error.message)],
    });
  }
}

async function handleRemove(interaction, guildId) {
  await interaction.deferReply({ flags: 64 });

  const categoryId = interaction.options.getString("id");

  const category = await ticketCategories.getById(guildId, categoryId);
  if (!category) {
    return interaction.editReply({
      embeds: [E.errorEmbed(`No se encontró la categoría con ID \`${categoryId}\``)],
    });
  }

  const deleted = await ticketCategories.delete(guildId, categoryId);
  if (deleted) {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("🗑️ Categoría Eliminada")
          .setDescription(
            `La categoría **${category.label}** (\`${categoryId}\`) ha sido eliminada.\n\n` +
            `⚠️ Los tickets existentes de esta categoría no se verán afectados.`
          )
          .setFooter({ text: "TON618 Tickets - Gestión de Categorías" })
          .setTimestamp()
      ],
    });
  } else {
    await interaction.editReply({
      embeds: [E.errorEmbed("No se pudo eliminar la categoría.")],
    });
  }
}

async function handleList(interaction, guildId) {
  await interaction.deferReply({ flags: 64 });

  const categories = await ticketCategories.getByGuild(guildId);

  if (categories.length === 0) {
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.WARNING)
          .setTitle("📋 No hay categorías configuradas")
          .setDescription(
            "No tienes categorías de tickets configuradas en este servidor.\n\n" +
            "**Crea tu primera categoría:**\n" +
            "`/config category add id:soporte label:\"Soporte General\" description:\"Ayuda general\"`\n\n" +
            "**Ejemplo completo:**\n" +
            "`/config category add id:reportes label:\"Reportar Usuario\" description:\"Reporta comportamientos\" emoji:🚨 priority:urgent`"
          )
          .setFooter({ text: "TON618 Tickets - Gestión de Categorías" })
      ],
    });
  }

  const embed = new EmbedBuilder()
    .setColor(E.Colors.PRIMARY)
    .setTitle(`📋 Categorías de Tickets (${categories.length}/25)`)
    .setDescription(
      "Lista de todas las categorías configuradas en este servidor.\n\n" +
      categories.map((cat, index) => {
        const statusIcon = cat.enabled ? "✅" : "❌";
        const emojiDisplay = cat.emoji || "💠";
        const extras = [];
        if (cat.discord_category_id) extras.push(`📂 Cat. Discord`);
        if (cat.ping_roles?.length) extras.push(`🔔 ${cat.ping_roles.length} rol(es)`);
        if (cat.welcome_message) extras.push(`💬 Mensaje custom`);
        const extrasStr = extras.length ? ` | ${extras.join(" | ")}` : "";
        return `${index + 1}. ${statusIcon} ${emojiDisplay} **${cat.label}**\n` +
               `   └ ID: \`${cat.category_id}\` | ${getPriorityLabel(cat.priority)}${extrasStr}\n` +
               `   └ ${cat.description}`;
      }).join("\n\n")
    )
    .setFooter({ text: "TON618 Tickets - Gestión de Categorías" })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

async function handleEdit(interaction, guildId) {
  await interaction.deferReply({ flags: 64 });

  const categoryId = interaction.options.getString("id");
  const label = interaction.options.getString("label");
  const description = interaction.options.getString("description");
  const emoji = interaction.options.getString("emoji");
  const priority = interaction.options.getString("priority");
  const discordCategory = interaction.options.getString("discord_category");
  const pingRolesStr = interaction.options.getString("ping_roles");
  const welcomeMessage = interaction.options.getString("welcome_message");

  const category = await ticketCategories.getById(guildId, categoryId);
  if (!category) {
    return interaction.editReply({
      embeds: [E.errorEmbed(`No se encontró la categoría con ID \`${categoryId}\``)],
    });
  }

  const updates = {};
  if (label) updates.label = label;
  if (description) updates.description = description;
  if (emoji !== null) updates.emoji = emoji;
  if (priority) updates.priority = priority;
  if (discordCategory !== null) {
    updates.discord_category_id = discordCategory || null;
  }
  if (pingRolesStr !== null) {
    updates.ping_roles = pingRolesStr ? pingRolesStr.split(",").map(id => id.trim()).filter(id => id) : [];
  }
  if (welcomeMessage !== null) {
    updates.welcome_message = welcomeMessage || null;
  }

  if (Object.keys(updates).length === 0) {
    return interaction.editReply({
      embeds: [E.errorEmbed("Debes especificar al menos un campo para editar.")],
    });
  }

  try {
    const updated = await ticketCategories.update(guildId, categoryId, updates);

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("✏️ Categoría Actualizada")
          .setDescription(
            `La categoría **${updated.label}** ha sido actualizada.\n\n` +
            `**ID:** \`${categoryId}\`\n` +
            `**Descripción:** ${updated.description}\n` +
            `${updated.emoji ? `**Emoji:** ${updated.emoji}\n` : ""}` +
            `**Prioridad:** ${getPriorityLabel(updated.priority)}\n` +
            `${updated.discord_category_id ? `**Categoría Discord:** \`${updated.discord_category_id}\`\n` : ""}` +
            `${updated.ping_roles?.length ? `**Roles a mencionar:** ${updated.ping_roles.length} rol(es)\n` : ""}` +
            `${updated.welcome_message ? `**Mensaje personalizado:** Configurado\n` : ""}` +
            `**Estado:** ${updated.enabled ? "✅ Activa" : "❌ Desactivada"}`
          )
          .setFooter({ text: "TON618 Tickets - Gestión de Categorías" })
          .setTimestamp()
      ],
    });
  } catch (error) {
    await interaction.editReply({
      embeds: [E.errorEmbed(error.message)],
    });
  }
}

async function handleToggle(interaction, guildId) {
  await interaction.deferReply({ flags: 64 });

  const categoryId = interaction.options.getString("id");

  const category = await ticketCategories.getById(guildId, categoryId);
  if (!category) {
    return interaction.editReply({
      embeds: [E.errorEmbed(`No se encontró la categoría con ID \`${categoryId}\``)],
    });
  }

  const newState = !category.enabled;
  await ticketCategories.update(guildId, categoryId, { enabled: newState });

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(newState ? E.Colors.SUCCESS : E.Colors.WARNING)
        .setTitle(`${newState ? "✅" : "❌"} Categoría ${newState ? "Activada" : "Desactivada"}`)
        .setDescription(
          `La categoría **${category.label}** ha sido ${newState ? "activada" : "desactivada"}.\n\n` +
          (newState
            ? "Los usuarios podrán seleccionar esta categoría al abrir tickets."
            : "⚠️ Los usuarios ya no podrán seleccionar esta categoría al abrir nuevos tickets.")
        )
        .setFooter({ text: "TON618 Tickets - Gestión de Categorías" })
        .setTimestamp()
    ],
  });
}

function getPriorityLabel(priority) {
  const labels = {
    low: "🟢 Baja",
    normal: "🟡 Normal",
    high: "🟠 Alta",
    urgent: "🔴 Urgente",
  };
  return labels[priority] || "🟡 Normal";
}

async function autocomplete(interaction) {
  const focusedOption = interaction.options.getFocused(true);
  
  if (focusedOption.name === "id") {
    const guildId = interaction.guild.id;
    const categories = await ticketCategories.getByGuild(guildId);
    
    const filtered = categories
      .filter(cat => 
        cat.category_id.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
        cat.label.toLowerCase().includes(focusedOption.value.toLowerCase())
      )
      .slice(0, 25)
      .map(cat => ({
        name: `${cat.emoji || "💠"} ${cat.label} (${cat.category_id})`,
        value: cat.category_id,
      }));

    await interaction.respond(filtered);
  }
}

module.exports = { register, execute, autocomplete };
