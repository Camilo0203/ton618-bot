const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { ticketCategories } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { t } = require("../../../utils/i18n");
const {
  withDescriptionLocalizations,
  localizedChoice,
} = require("../../../utils/slashLocalizations");

function register(builder) {
  return builder
    .addSubcommandGroup((group) =>
      withDescriptionLocalizations(
        group
          .setName("category")
          .setDescription(t("en", "config.category.group_description")),
        "config.category.group_description"
      )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("add")
              .setDescription(t("en", "config.category.add_description")),
            "config.category.add_description"
          )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("id")
                  .setDescription(t("en", "config.category.option_id")),
                "config.category.option_id"
              )
                .setRequired(true)
                .setAutocomplete(true),
            )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("discord_category")
                  .setDescription(t("en", "config.category.option_discord_category")),
                "config.category.option_discord_category"
              )
                .setRequired(true),
            ),
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("remove")
              .setDescription(t("en", "config.category.remove_description")),
            "config.category.remove_description"
          )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("id")
                  .setDescription(t("en", "config.category.option_id_remove")),
                "config.category.option_id_remove"
              )
                .setRequired(true)
                .setAutocomplete(true),
            ),
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("list")
              .setDescription(t("en", "config.category.list_description")),
            "config.category.list_description"
          ),
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("edit")
              .setDescription(t("en", "config.category.edit_description")),
            "config.category.edit_description"
          )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("id")
                  .setDescription(t("en", "config.category.option_id_edit")),
                "config.category.option_id_edit"
              )
                .setRequired(true)
                .setAutocomplete(true),
            )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("label")
                  .setDescription(t("en", "config.category.option_label")),
                "config.category.option_label"
              )
                .setRequired(false)
                .setMaxLength(100),
            )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("description")
                  .setDescription(t("en", "config.category.option_description")),
                "config.category.option_description"
              )
                .setRequired(false)
                .setMaxLength(200),
            )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("emoji")
                  .setDescription(t("en", "config.category.option_emoji")),
                "config.category.option_emoji"
              )
                .setRequired(false),
            )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("priority")
                  .setDescription(t("en", "config.category.option_priority")),
                "config.category.option_priority"
              )
                .setRequired(false)
                .addChoices(
                  localizedChoice("low", "ticket.priority.low"),
                  localizedChoice("normal", "ticket.priority.normal"),
                  localizedChoice("high", "ticket.priority.high"),
                  localizedChoice("urgent", "ticket.priority.urgent"),
                ),
            )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("discord_category")
                  .setDescription(t("en", "config.category.option_discord_category_edit")),
                "config.category.option_discord_category_edit"
              )
                .setRequired(false),
            )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("ping_roles")
                  .setDescription(t("en", "config.category.option_ping_roles")),
                "config.category.option_ping_roles"
              )
                .setRequired(false),
            )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("welcome_message")
                  .setDescription(t("en", "config.category.option_welcome_message")),
                "config.category.option_welcome_message"
              )
                .setRequired(false),
            ),
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("toggle")
              .setDescription(t("en", "config.category.toggle_description")),
            "config.category.toggle_description"
          )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt
                  .setName("id")
                  .setDescription(t("en", "config.category.option_id_toggle")),
                "config.category.option_id_toggle"
              )
                .setRequired(true)
                .setAutocomplete(true),
            ),
        ),
    );
}

async function execute(ctx) {
  const { interaction, group, sub } = ctx;

  if (group !== "category") return false;

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({
      embeds: [E.errorEmbed("Only administrators can manage ticket categories.")],
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
      embeds: [E.errorEmbed(`An error occurred while processing the command: ${error.message}`)],
      flags: 64,
    });
  }

  return true;
}

async function handleAdd(interaction, guildId) {
  await interaction.deferReply({ flags: 64 });

  const categoryId = interaction.options.getString("id");
  const discordCategory = interaction.options.getString("discord_category");

  const config = require("../../../../config.js");
  const configCategory = config.categories?.find((category) => category.id === categoryId);

  if (!configCategory) {
    return interaction.editReply({
      embeds: [E.errorEmbed(`The category \`${categoryId}\` was not found in config.js.`)],
    });
  }

  try {
    const existing = await ticketCategories.getById(guildId, categoryId);

    if (existing) {
      await ticketCategories.update(guildId, categoryId, {
        discord_category_id: discordCategory,
      });
    } else {
      await ticketCategories.create(guildId, {
        category_id: categoryId,
        label: configCategory.label,
        description: configCategory.description,
        emoji: configCategory.emoji,
        color: configCategory.color,
        priority: configCategory.priority || "normal",
        discord_category_id: discordCategory,
        ping_roles: configCategory.pingRoles || [],
        welcome_message: configCategory.welcomeMessage,
        questions: configCategory.questions || [],
      });
    }

    const updated = await ticketCategories.getById(guildId, categoryId);
    console.log(`[CATEGORY CONFIG] Category ${categoryId} configured:`, {
      discord_category_id: updated?.discord_category_id,
      label: updated?.label,
    });

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("Category configured")
          .setDescription(
            `**${configCategory.label}** is now linked to a Discord category.\n\n` +
            `Category ID: \`${categoryId}\`\n` +
            `Discord category: \`${discordCategory}\`\n\n` +
            `New tickets created for this category will be placed inside that Discord category.\n\n` +
            `Verification: ${updated?.discord_category_id ? "Saved successfully" : "Save failed"}`,
          )
          .setFooter({ text: "TON618 Tickets - Category Management" })
          .setTimestamp(),
      ],
    });
  } catch (error) {
    console.error("[CATEGORY ADD ERROR]", error);
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
      embeds: [E.errorEmbed(`No category exists with ID \`${categoryId}\`.`)],
    });
  }

  const deleted = await ticketCategories.delete(guildId, categoryId);
  if (deleted) {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("Category removed")
          .setDescription(
            `**${category.label}** (\`${categoryId}\`) was removed.\n\n` +
            "Existing tickets will not be modified.",
          )
          .setFooter({ text: "TON618 Tickets - Category Management" })
          .setTimestamp(),
      ],
    });
  } else {
    await interaction.editReply({
      embeds: [E.errorEmbed("The category could not be removed.")],
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
          .setTitle("No ticket categories configured")
          .setDescription(
            "This server does not have any ticket categories configured yet.\n\n" +
            "Use `/config category add` to connect a category from config.js to a Discord category.",
          )
          .setFooter({ text: "TON618 Tickets - Category Management" }),
      ],
    });
  }

  const embed = new EmbedBuilder()
    .setColor(E.Colors.PRIMARY)
    .setTitle(`Ticket categories (${categories.length}/25)`)
    .setDescription(
      categories.map((category, index) => {
        const statusIcon = category.enabled ? "Enabled" : "Disabled";
        const emojiDisplay = category.emoji || "•";
        const extras = [];
        if (category.discord_category_id) extras.push("Discord category linked");
        if (category.ping_roles?.length) extras.push(`${category.ping_roles.length} ping role(s)`);
        if (category.welcome_message) extras.push("Custom welcome message");
        const extrasLabel = extras.length ? ` | ${extras.join(" | ")}` : "";
        return `${index + 1}. ${statusIcon} ${emojiDisplay} **${category.label}**\n` +
          `   ID: \`${category.category_id}\` | ${getPriorityLabel(category.priority)}${extrasLabel}\n` +
          `   ${category.description}`;
      }).join("\n\n"),
    )
    .setFooter({ text: "TON618 Tickets - Category Management" })
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
      embeds: [E.errorEmbed(`No category exists with ID \`${categoryId}\`.`)],
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
    updates.ping_roles = pingRolesStr ? pingRolesStr.split(",").map((id) => id.trim()).filter(Boolean) : [];
  }
  if (welcomeMessage !== null) {
    updates.welcome_message = welcomeMessage || null;
  }

  if (Object.keys(updates).length === 0) {
    return interaction.editReply({
      embeds: [E.errorEmbed("You must provide at least one field to edit.")],
    });
  }

  try {
    const updated = await ticketCategories.update(guildId, categoryId, updates);

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("Category updated")
          .setDescription(
            `**${updated.label}** was updated successfully.\n\n` +
            `Category ID: \`${categoryId}\`\n` +
            `Description: ${updated.description}\n` +
            `${updated.emoji ? `Emoji: ${updated.emoji}\n` : ""}` +
            `Priority: ${getPriorityLabel(updated.priority)}\n` +
            `${updated.discord_category_id ? `Discord category: \`${updated.discord_category_id}\`\n` : ""}` +
            `${updated.ping_roles?.length ? `Ping roles: ${updated.ping_roles.length}\n` : ""}` +
            `${updated.welcome_message ? "Custom welcome message: configured\n" : ""}` +
            `Status: ${updated.enabled ? "Enabled" : "Disabled"}`,
          )
          .setFooter({ text: "TON618 Tickets - Category Management" })
          .setTimestamp(),
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
      embeds: [E.errorEmbed(`No category exists with ID \`${categoryId}\`.`)],
    });
  }

  const newState = !category.enabled;
  await ticketCategories.update(guildId, categoryId, { enabled: newState });

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(newState ? E.Colors.SUCCESS : E.Colors.WARNING)
        .setTitle(`Category ${newState ? "enabled" : "disabled"}`)
        .setDescription(
          `**${category.label}** was ${newState ? "enabled" : "disabled"}.\n\n` +
          (newState
            ? "Users can select this category again when opening new tickets."
            : "Users can no longer select this category when opening new tickets."),
        )
        .setFooter({ text: "TON618 Tickets - Category Management" })
        .setTimestamp(),
    ],
  });
}

function getPriorityLabel(priority) {
  const labels = {
    low: "Low",
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
  };
  return labels[priority] || "Normal";
}

async function autocomplete(interaction) {
  const focusedOption = interaction.options.getFocused(true);
  const subcommand = interaction.options.getSubcommand();

  if (focusedOption.name === "id") {
    if (subcommand === "add") {
      const config = require("../../../../config.js");
      const configCategories = config.categories || [];

      const filtered = configCategories
        .filter((category) =>
          category.id.toLowerCase().includes(focusedOption.value.toLowerCase())
          || category.label.toLowerCase().includes(focusedOption.value.toLowerCase()),
        )
        .slice(0, 25)
        .map((category) => ({
          name: `${category.emoji || "•"} ${category.label} (${category.id})`,
          value: category.id,
        }));

      return interaction.respond(filtered);
    }

    const guildId = interaction.guild.id;
    const categories = await ticketCategories.getByGuild(guildId);

    const filtered = categories
      .filter((category) =>
        category.category_id.toLowerCase().includes(focusedOption.value.toLowerCase())
        || category.label.toLowerCase().includes(focusedOption.value.toLowerCase()),
      )
      .slice(0, 25)
      .map((category) => ({
        name: `${category.emoji || "•"} ${category.label} (${category.category_id})`,
        value: category.category_id,
      }));

    await interaction.respond(filtered);
  }
}

module.exports = { register, execute, autocomplete };
