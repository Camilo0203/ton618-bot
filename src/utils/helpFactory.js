const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  PermissionFlagsBits,
} = require("discord.js");
const {
  getGuildSettings,
  getOwnerId,
  hasAdminPrivileges,
  hasStaffPrivileges,
  resolveRequiredAccess,
} = require("./accessControl");
const { getDisabledCommandSet } = require("./commandToggles");
const { settings } = require("./database");
const {
  DEFAULT_LANGUAGE,
  normalizeLanguage,
  resolveInteractionLanguage,
  t,
} = require("./i18n");

const HOME_ID = "__home";
const SELECT_ID_PREFIX = "help_category_select";
const SUBCOMMAND = 1;
const SUBCOMMAND_GROUP = 2;
const FIELD_VALUE_LIMIT = 1024;
const EMBED_TOTAL_LIMIT = 5600;

const CATEGORY_ORDER = [
  "utility",
  "tickets",
  "fun",
  "moderation",
  "config",
  "system",
  "general",
  "other",
];

const CATEGORY_META = {
  utility: { color: 0x5865f2 },
  tickets: { color: 0x57f287 },
  fun: { color: 0xfee75c },
  moderation: { color: 0xed4245 },
  config: { color: 0xeb459e },
  system: { color: 0x95a5a6 },
  general: { color: 0x7289da },
  other: { color: 0x99aab5 },
};

const HELP_OPTION_DESCRIPTION_LOCALIZATIONS = {
  "en-US": "Optional command name to see its specific details",
  "en-GB": "Optional command name to see its specific details",
  "es-ES": "Opcional: nombre del comando para ver sus detalles específicos",
  "es-419": "Opcional: nombre del comando para ver sus detalles específicos",
};

const ADVANCED_COMMAND_NAMES = new Set([
  "embed",
  "verify",
  "setup",
  "stats",
  "debug",
  "warn",
  "modlogs",
]);

function getLocalizedValue(value, language, fallback = "") {
  return value || fallback;
}

function getLocalizationCandidates(language) {
  const raw = String(language || "").trim();
  const candidates = [];

  if (raw) {
    candidates.push(raw);
    const normalizedRaw = raw.replace(/_/g, "-");
    if (normalizedRaw !== raw) {
      candidates.push(normalizedRaw);
    }
  }

  return candidates;
}

function resolveLocalizedDescription(source, language) {
  const localizations = source?.description_localizations || source?.descriptionLocalizations;
  for (const key of getLocalizationCandidates(language)) {
    if (localizations?.[key]) return localizations[key];
  }
  return source?.description || "";
}

function titleCase(text) {
  return String(text || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function helpText(language, key, vars = {}) {
  return t(language, `help.embed.${key}`, vars);
}

function getCategoryLabel(categoryId, language) {
  const label = t(language, `help.embed.categories.${categoryId}`);
  return label !== `help.embed.categories.${categoryId}` ? label : titleCase(categoryId);
}

function getAccessLabel(access, language) {
  return t(language, `help.embed.categories.${access}`) || titleCase(access);
}

function normalizeCommandInput(input) {
  return String(input || "").trim().replace(/^\//, "").toLowerCase();
}

function getUsageKey(tokens) {
  return tokens.filter(Boolean).join("_").toLowerCase();
}

function getScope(command) {
  return command.meta?.scope || "public";
}

function getCategory(command) {
  const raw = String(command.meta?.category || "other").toLowerCase();
  return raw;
}

function getCommandAccess(command) {
  return resolveRequiredAccess(command) || getScope(command);
}

function normalizeUsageKey(tokens) {
  return `/${tokens.filter(Boolean).join(" ").trim()}`;
}

function cleanHelpSentence(
  text,
  language,
  fallback = helpText(language, "no_description")
) {
  const value = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!value) return fallback;
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function joinNaturalList(values, language) {
  const list = values.filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  const andWord = t(language, "help.embed.and_word") || (language === "es" ? "y" : "and");
  if (list.length === 2) return `${list[0]} ${andWord} ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, ${andWord} ${list[list.length - 1]}`;
}

function summarizeOptionLabel(option, language) {
  const raw = String(resolveLocalizedDescription(option, language) || option?.name || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.:]$/, "");

  if (!raw) return titleCase(option?.name || "value").toLowerCase();
  return raw.charAt(0).toLowerCase() + raw.slice(1);
}

function buildOptionSentence(options = [], language) {
  const flatOptions = Array.isArray(options)
    ? options.filter((option) => option && option.type !== SUBCOMMAND && option.type !== SUBCOMMAND_GROUP)
    : [];

  if (!flatOptions.length) return "";

  const required = flatOptions
    .filter((option) => option.required)
    .map((option) => summarizeOptionLabel(option, language));
  const optional = flatOptions
    .filter((option) => !option.required)
    .map((option) => summarizeOptionLabel(option, language));
  const parts = [];

  if (required.length) {
    parts.push(`${t(language, "help.embed.required_label")}: ${joinNaturalList(required, language)}.`);
  }

  if (optional.length) {
    parts.push(`${t(language, "help.embed.optional_label")}: ${joinNaturalList(optional, language)}.`);
  }

  return parts.join(" ");
}

function getCommandOverview(command, language) {
  const name = command.data.name;
  const overview = t(language, `help.embed.overviews.${name}`);
  if (overview !== `help.embed.overviews.${name}`) return cleanHelpSentence(overview, language);
  
  return cleanHelpSentence(resolveLocalizedDescription(command.data.toJSON(), language), language);
}

function getUsageDescription(command, context, language) {
  const usageKey = getUsageKey(context.pathTokens);
  const override = t(language, `help.embed.usages.${usageKey}`);
  
  if (override !== `help.embed.usages.${usageKey}`) return cleanHelpSentence(override, language);

  const json = command.data.toJSON();
  const sourceDescription =
    resolveLocalizedDescription(context.subcommand, language) ||
    resolveLocalizedDescription(context.group, language) ||
    resolveLocalizedDescription(json, language);
  const base = cleanHelpSentence(sourceDescription, language);
  const optionSentence = buildOptionSentence(context.options, language);

  return optionSentence ? `${base} ${optionSentence}` : base;
}

function buildUsageRow(command, context, language) {
  const json = command.data.toJSON();
  const usage = normalizeUsageKey(context.pathTokens);
  return {
    usage,
    normalizedUsage: usage.toLowerCase(),
    description: getUsageDescription(command, context, language),
    commandName: json.name,
    access: getCommandAccess(command),
    scope: getScope(command),
    categoryId: getCategory(command),
    pathTokens: context.pathTokens,
  };
}

function extractUsages(command, language = DEFAULT_HELP_LANGUAGE) {
  const json = command.data.toJSON();
  const options = Array.isArray(json.options) ? json.options : [];
  const rows = [];

  if (!options.some((option) => option.type === SUBCOMMAND || option.type === SUBCOMMAND_GROUP)) {
    rows.push(
      buildUsageRow(command, {
        pathTokens: [json.name],
        options,
      }, language)
    );
    return rows;
  }

  for (const option of options) {
    if (option.type === SUBCOMMAND) {
      rows.push(
        buildUsageRow(command, {
          subcommand: option,
          pathTokens: [json.name, option.name],
          options: Array.isArray(option.options) ? option.options : [],
        }, language)
      );
      continue;
    }

    if (option.type !== SUBCOMMAND_GROUP) continue;
    const groupOptions = Array.isArray(option.options) ? option.options : [];

    for (const groupSubcommand of groupOptions) {
      if (groupSubcommand.type !== SUBCOMMAND) continue;
      rows.push(
        buildUsageRow(command, {
          group: option,
          subcommand: groupSubcommand,
          pathTokens: [json.name, option.name, groupSubcommand.name],
          options: Array.isArray(groupSubcommand.options) ? groupSubcommand.options : [],
        }, language)
      );
    }
  }

  return rows.length
    ? rows
    : [
        buildUsageRow(command, {
          pathTokens: [json.name],
          options,
        }, language),
      ];
}

function memberHasPermissions(interaction, requiredPermissions) {
  if (!requiredPermissions) return true;

  const permissionBag = interaction.memberPermissions || interaction.member?.permissions;
  if (!permissionBag?.has) return false;

  try {
    return permissionBag.has(requiredPermissions);
  } catch {
    return false;
  }
}

function resolveEffectiveDefaultMemberPermissions(command) {
  const json = command.data.toJSON();
  if (json.default_member_permissions !== undefined && json.default_member_permissions !== null) {
    return BigInt(json.default_member_permissions);
  }

  const scope = getScope(command);
  if (scope === "admin" || scope === "developer") {
    return BigInt(PermissionFlagsBits.Administrator);
  }

  if (scope === "staff") {
    return BigInt(PermissionFlagsBits.ManageMessages);
  }

  return null;
}

async function getVisibilityContext(interaction) {
  const guildId = interaction.guild?.id || interaction.guildId || null;
  const ownerId = getOwnerId(interaction.client);
  const isOwner = Boolean(ownerId && interaction.user?.id === ownerId);

  let guildSettings = guildId ? await getGuildSettings(guildId) : null;
  if (!guildSettings && guildId) {
    try {
      guildSettings = await settings.get(guildId);
    } catch {
      guildSettings = null;
    }
  }

  const isAdmin = isOwner || hasAdminPrivileges(interaction.member, guildSettings);
  const isStaff = isAdmin || hasStaffPrivileges(interaction.member, guildSettings);
  const simpleHelpMode = guildSettings?.simple_help_mode !== false;
  const disabledCommands = getDisabledCommandSet(guildSettings);

  return {
    isOwner,
    isAdmin,
    isStaff,
    simpleHelpMode,
    disabledCommands,
    guildSettings,
    language: resolveInteractionLanguage(interaction, guildSettings),
  };
}

function buildAudienceVisibility(baseVisibility, audience) {
  if (audience === "owner") {
    return {
      ...baseVisibility,
      isOwner: true,
      isAdmin: true,
      isStaff: true,
      simpleHelpMode: false,
    };
  }

  if (audience === "staff") {
    return {
      ...baseVisibility,
      isOwner: false,
      isAdmin: false,
      isStaff: true,
      simpleHelpMode: false,
    };
  }

  return { ...baseVisibility };
}

function canSeeCommand(command, interaction, visibility) {
  const json = command.data.toJSON();
  const access = getCommandAccess(command);

  if (visibility.disabledCommands?.has(normalizeCommandInput(json.name))) return false;
  if (command.meta?.hidden && !visibility.isOwner) return false;
  if (access === "owner" && !visibility.isOwner) return false;
  if (access === "admin" && !visibility.isAdmin) return false;
  if (access === "staff" && !visibility.isStaff) return false;

  if (
    visibility.simpleHelpMode &&
    !visibility.isAdmin &&
    !visibility.isOwner &&
    ADVANCED_COMMAND_NAMES.has(json.name)
  ) {
    return false;
  }

  const requiredPerms = resolveEffectiveDefaultMemberPermissions(command);
  if (requiredPerms && !visibility.isOwner && !memberHasPermissions(interaction, requiredPerms)) {
    return false;
  }

  return true;
}

function getCommandsForAudience(interaction, visibility, audience) {
  const audienceVisibility = buildAudienceVisibility(visibility, audience);
  const commands = [];

  for (const [, command] of interaction.client.commands) {
    if (!command?.data?.name) continue;
    if (!canSeeCommand(command, interaction, audienceVisibility)) continue;
    commands.push(command);
  }

  commands.sort((a, b) => a.data.name.localeCompare(b.data.name));
  return commands;
}

function buildCommandCatalog(commands, language = DEFAULT_HELP_LANGUAGE) {
  const categories = new Map();

  for (const command of commands) {
    const categoryId = getCategory(command);
    if (!categories.has(categoryId)) {
      categories.set(categoryId, {
        id: categoryId,
        color: CATEGORY_META[categoryId]?.color || 0x99aab5,
        commands: [],
        rowCount: 0,
      });
    }

    const rows = extractUsages(command, language);
    const commandEntry = {
      commandName: command.data.name,
      access: getCommandAccess(command),
      scope: getScope(command),
      categoryId,
      summary: getCommandOverview(command, language),
      rows,
    };

    categories.get(categoryId).commands.push(commandEntry);
    categories.get(categoryId).rowCount += rows.length;
  }

  for (const category of categories.values()) {
    category.commands.sort((a, b) => a.commandName.localeCompare(b.commandName));
    category.commandCount = category.commands.length;
  }

  return categories;
}

function getOrderedCategories(catalog) {
  return Array.from(catalog.values()).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.id);
    const bi = CATEGORY_ORDER.indexOf(b.id);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

function countVisibleCommands(catalog) {
  return Array.from(catalog.values()).reduce((total, category) => total + category.commandCount, 0);
}

function countVisibleRows(catalog) {
  return Array.from(catalog.values()).reduce((total, category) => total + category.rowCount, 0);
}

function buildCoverageLines(catalog, language = DEFAULT_HELP_LANGUAGE) {
  return getOrderedCategories(catalog)
    .map((category) => {
      const commandsLabel =
        category.commandCount === 1
          ? helpText(language, "command_singular")
          : helpText(language, "command_plural");
      const entriesLabel =
        category.rowCount === 1
          ? helpText(language, "visible_entry_singular")
          : helpText(language, "visible_entry_plural");
      return (
        `- **${getCategoryLabel(category.id, language)}**: ` +
        `${category.commandCount} ${commandsLabel}, ${category.rowCount} ${entriesLabel}`
      );
    })
    .join("\n");
}

function resolveQuickStartAudience(audience, visibility) {
  if (audience === "owner") return "owner";
  if (audience === "staff") return "staff";
  if (visibility.isOwner || visibility.isAdmin) return "owner";
  if (visibility.isStaff) return "staff";
  return "user";
}

function buildQuickStartLines(audience, visibility, catalog, language) {
  const quickStartAudience = resolveQuickStartAudience(audience, visibility);
  const allUsages = new Set();

  for (const category of catalog.values()) {
    for (const command of category.commands) {
      for (const row of command.rows) {
        allUsages.add(row.normalizedUsage);
      }
    }
  }

  const quickStartConfigs = {
    user: [
      { usage: "/ticket open", key: "ticket_open" },
      { usage: "/help", key: "help_base" },
    ],
    staff: [
      { usage: "/staff my-tickets", key: "staff_my_tickets" },
      { usage: "/ticket claim", key: "ticket_claim" },
      { usage: "/ticket note add", key: "ticket_note_add" },
      { usage: "/modlogs info", key: "modlogs_info" },
    ],
    owner: [
      { usage: "/setup wizard", key: "setup_wizard" },
      { usage: "/config status", key: "config_status" },
      { usage: "/verify panel", key: "verify_panel" },
      { usage: "/stats sla", key: "stats_sla" },
      { usage: "/debug status", key: "debug_status" },
    ],
  };

  return (quickStartConfigs[quickStartAudience] || [])
    .filter((entry) => allUsages.has(entry.usage.toLowerCase()))
    .map((entry) => {
      const note = t(language, `help.embed.quick_start_notes.${entry.key}`);
      return `- \`${entry.usage}\` - ${note}`;
    });
}

function getAccessTierLabel(visibility, language = DEFAULT_HELP_LANGUAGE) {
  if (visibility.isOwner) return getAccessLabel("owner", language);
  if (visibility.isAdmin) return getAccessLabel("admin", language);
  if (visibility.isStaff) return getAccessLabel("staff", language);
  return getAccessLabel("member", language);
}

function buildAudienceHomeEmbeds(
  audience,
  visibility,
  catalog,
  guildName,
  language = visibility?.language || DEFAULT_HELP_LANGUAGE
) {
  const commandCount = countVisibleCommands(catalog);
  const entryCount = countVisibleRows(catalog);
  const categoryCount = catalog.size;
  const simpleHelpNote =
    visibility.simpleHelpMode && !visibility.isAdmin && !visibility.isOwner
      ? helpText(language, "simple_help_note")
      : "";

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(helpText(language, "home_title"))
    .setDescription(helpText(language, "home_desc", { guild: guildName }))
    .setFooter({ text: helpText(language, "home_footer", { guild: guildName }) })
    .setTimestamp();

  embed.addFields(
    {
      name: helpText(language, "home_overview"),
      value: helpText(language, "home_overview_value"),
      inline: false,
    },
    {
      name: helpText(language, "home_visibility"),
      value: helpText(language, "home_visibility_value", {
        access: getAccessTierLabel(visibility, language),
        commands: commandCount,
        entries: entryCount,
        categories: categoryCount,
        simple_help: simpleHelpNote,
      }),
      inline: false,
    },
    {
      name: helpText(language, "home_categories"),
      value: buildCoverageLines(catalog, language) || helpText(language, "no_commands_in_category"),
      inline: false,
    }
  );

  const quickStartLines = buildQuickStartLines(audience, visibility, catalog, language);
  if (quickStartLines.length) {
    embed.addFields({
      name: helpText(language, "home_quick_start"),
      value: quickStartLines.join("\n"),
      inline: false,
    });
  }

  return [embed];
}

function buildFieldChunks(label, lines, introLine = null, language = DEFAULT_HELP_LANGUAGE) {
  const chunks = [];
  let currentLines = [];
  let currentLength = 0;

  if (introLine) {
    const safeIntro = introLine.length > FIELD_VALUE_LIMIT
      ? `${introLine.slice(0, FIELD_VALUE_LIMIT - 3)}...`
      : introLine;
    currentLines.push(safeIntro);
    currentLength = safeIntro.length;
  }

  for (const rawLine of lines) {
    const line = rawLine.length > FIELD_VALUE_LIMIT
      ? `${rawLine.slice(0, FIELD_VALUE_LIMIT - 3)}...`
      : rawLine;
    const nextLength = currentLength === 0 ? line.length : currentLength + 1 + line.length;

    if (nextLength > FIELD_VALUE_LIMIT && currentLines.length) {
      chunks.push(currentLines.join("\n"));
      currentLines = [line];
      currentLength = line.length;
      continue;
    }

    currentLines.push(line);
    currentLength = nextLength;
  }

  if (currentLines.length) {
    chunks.push(currentLines.join("\n"));
  }

  return chunks.map((value, index) => ({
    name: index === 0 ? label : `${label}${helpText(language, "continued_suffix")}`,
    value,
    inline: false,
  }));
}

function buildCommandFields(commandEntry, language = DEFAULT_HELP_LANGUAGE) {
  const label = `/${commandEntry.commandName} [${getAccessLabel(commandEntry.access, language)}]`;
  const rowLines = commandEntry.rows.map((row) => `- \`${row.usage}\` - ${row.description}`);
  const introLine =
    commandEntry.rows.length === 1 && sameHelpText(commandEntry.rows[0].description, commandEntry.summary)
      ? null
      : `${helpText(language, "overview_prefix")}: ${commandEntry.summary}`;

  return buildFieldChunks(label, rowLines, introLine, language);
}

function buildPagedEmbeds({
  color,
  title,
  description,
  footerText,
  fields,
  language = DEFAULT_HELP_LANGUAGE,
}) {
  const embeds = [];
  let current = new EmbedBuilder().setColor(color).setTitle(title).setTimestamp();
  let currentLength = title.length;
  let currentFields = [];
  let descriptionApplied = false;

  if (description) {
    current.setDescription(description);
    currentLength += description.length;
    descriptionApplied = true;
  }

  for (const field of fields) {
    const fieldSize = (field.name?.length || 0) + (field.value?.length || 0);

    if (currentFields.length >= 25 || currentLength + fieldSize > EMBED_TOTAL_LIMIT) {
      if (currentFields.length) {
        current.addFields(currentFields);
      }
      embeds.push(current);
      current = new EmbedBuilder().setColor(color).setTitle(title).setTimestamp();
      currentLength = title.length;
      currentFields = [];

      if (!descriptionApplied && description) {
        current.setDescription(description);
        currentLength += description.length;
        descriptionApplied = true;
      }
    }

    currentFields.push(field);
    currentLength += fieldSize;
  }

  if (currentFields.length) {
    current.addFields(currentFields);
  }

  if (!embeds.length || currentFields.length || !fields.length) {
    embeds.push(current);
  }

  return embeds.map((embed, index) =>
    embed.setFooter({
      text:
        embeds.length > 1
          ? `${footerText} | ${helpText(language, "page_label")} ${index + 1}/${embeds.length}`
          : footerText,
    })
  );
}

function buildCategoryEmbeds(categoryId, catalog, guildName, language = DEFAULT_HELP_LANGUAGE) {
  const category = catalog.get(categoryId);
  const meta = CATEGORY_META[categoryId] || { color: 0x99aab5 };
  const categoryLabel = getCategoryLabel(categoryId, language);
  const categoryDescription = category
    ? `${helpText(language, "category_desc")}\n\n${helpText(language, "visible_commands_label")}: **${category.commandCount}**\n${helpText(language, "visible_entries_label")}: **${category.rowCount}**`
    : helpText(language, "no_commands_in_category");

  if (!category || !category.commands.length) {
    return [
      new EmbedBuilder()
        .setColor(meta.color)
        .setTitle(helpText(language, "category_title", { category: categoryLabel }))
        .setDescription(categoryDescription)
        .setFooter({ text: helpText(language, "category_footer", { guild: guildName }) })
        .setTimestamp(),
    ];
  }

  const fields = category.commands.flatMap((commandEntry) => buildCommandFields(commandEntry, language));
  return buildPagedEmbeds({
    color: meta.color,
    title: helpText(language, "category_title", { category: categoryLabel }),
    description: categoryDescription,
    footerText: helpText(language, "category_footer", { guild: guildName }),
    fields,
    language,
  });
}

function findCommandEntry(query, catalog) {
  const normalized = normalizeCommandInput(query);
  if (!normalized) return null;

  const commandMap = new Map();
  const allRows = [];

  for (const category of catalog.values()) {
    for (const commandEntry of category.commands) {
      commandMap.set(commandEntry.commandName, commandEntry);
      allRows.push(...commandEntry.rows);
    }
  }

  const firstToken = normalized.split(/\s+/)[0];
  if (commandMap.has(firstToken)) {
    return commandMap.get(firstToken);
  }

  const rowMatch = allRows.find((row) => row.normalizedUsage.startsWith(`/${normalized}`));
  if (rowMatch) {
    return commandMap.get(rowMatch.commandName) || null;
  }

  const partialMatch = allRows.find((row) => row.normalizedUsage.includes(normalized));
  if (partialMatch) {
    return commandMap.get(partialMatch.commandName) || null;
  }

  return null;
}

function orderCommandRows(commandEntry, query) {
  const normalized = normalizeCommandInput(query);
  if (!normalized || normalized === commandEntry.commandName) {
    return commandEntry.rows;
  }

  const focused = commandEntry.rows.filter((row) => row.normalizedUsage.startsWith(`/${normalized}`));
  if (!focused.length || focused.length === commandEntry.rows.length) {
    return commandEntry.rows;
  }

  const focusedSet = new Set(focused.map((row) => row.usage));
  const remaining = commandEntry.rows.filter((row) => !focusedSet.has(row.usage));
  return [...focused, ...remaining];
}

function buildCommandEmbeds(query, catalog, guildName, language = DEFAULT_HELP_LANGUAGE) {
  const normalized = normalizeCommandInput(query);
  const commandEntry = findCommandEntry(normalized, catalog);

  if (!commandEntry) {
    return [
      new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle(helpText(language, "command_not_found"))
        .setDescription(helpText(language, "command_not_found_desc", { command: normalized }))
        .setFooter({ text: helpText(language, "command_footer", { guild: guildName }) })
        .setTimestamp(),
    ];
  }

  const orderedRows = orderCommandRows(commandEntry, normalized);
  const focusText =
    normalized && normalized !== commandEntry.commandName && orderedRows[0]
      ? `\n${helpText(language, "focused_match", { usage: orderedRows[0].usage })}`
      : "";
  const description = helpText(language, "command_desc", {
    summary: commandEntry.summary,
    category: getCategoryLabel(commandEntry.categoryId, language),
    access: getAccessLabel(commandEntry.access, language),
    entries: commandEntry.rows.length,
    focus: focusText,
  });
  const fields = buildFieldChunks(
    helpText(language, "field_entries"),
    orderedRows.map((row) => `- \`${row.usage}\` - ${row.description}`),
    null,
    language
  );

  return buildPagedEmbeds({
    color: 0x57f287,
    title: helpText(language, "command_help", { command: commandEntry.commandName }),
    description,
    footerText: helpText(language, "command_footer", { guild: guildName }),
    fields,
    language,
  });
}

function buildSelectMenu(catalog, selected, customId, language = DEFAULT_HELP_LANGUAGE) {
  const ordered = getOrderedCategories(catalog);
  const options = [
    {
      label: helpText(language, "select_home"),
      value: HOME_ID,
      default: selected === HOME_ID,
    },
    ...ordered.slice(0, 24).map((category) => ({
      label: getCategoryLabel(category.id, language),
      value: category.id,
      default: selected === category.id,
    })),
  ];

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(helpText(language, "select_placeholder"))
      .addOptions(options)
  );
}

function canOpenAudiencePanel(visibility, audience) {
  if (audience === "owner") return visibility.isOwner;
  if (audience === "staff") return visibility.isStaff || visibility.isAdmin || visibility.isOwner;
  return true;
}

function buildAudienceDeniedMessage(audience, language = DEFAULT_HELP_LANGUAGE) {
  if (audience === "owner") return helpText(language, "denied_owner");
  if (audience === "staff") return helpText(language, "denied_staff");
  return helpText(language, "denied_default");
}

function createHelpCommand(config) {
  const audience = config.audience;
  const selectId = `${SELECT_ID_PREFIX}_${config.name}`;
  const data = new SlashCommandBuilder().setName(config.name).setDescription(config.description);

  if (config.descriptionLocalizations && data.setDescriptionLocalizations) {
    data.setDescriptionLocalizations(config.descriptionLocalizations);
  }

  data.addStringOption((option) =>
    option
      .setName("command")
      .setDescription(HELP_OPTION_DESCRIPTION_LOCALIZATIONS["en-US"])
      .setDescriptionLocalizations(HELP_OPTION_DESCRIPTION_LOCALIZATIONS)
      .setRequired(false)
      .setAutocomplete(true)
  );

  return {
    data,
    meta: {
      hidden: config.hidden === true,
    },

    async autocomplete(interaction) {
      const visibility = await getVisibilityContext(interaction);
      if (!canOpenAudiencePanel(visibility, audience)) {
        await interaction.respond([]);
        return;
      }

      const visible = getCommandsForAudience(interaction, visibility, audience);
      const focused = normalizeCommandInput(interaction.options.getFocused() || "");
      const values = new Set();

      for (const command of visible) {
        for (const usage of extractUsages(command, visibility.language)) {
          values.add(usage.usage.replace(/^\//, ""));
        }
      }

      const choices = Array.from(values)
        .filter((value) => value.toLowerCase().includes(focused))
        .slice(0, 25)
        .map((value) => ({ name: `/${value}`, value }));

      await interaction.respond(choices);
    },

    async execute(interaction) {
      const visibility = await getVisibilityContext(interaction);
      if (!canOpenAudiencePanel(visibility, audience)) {
        await interaction.reply({
          content: buildAudienceDeniedMessage(audience, visibility.language),
          flags: 64,
        });
        return;
      }

      const audienceCommands = getCommandsForAudience(interaction, visibility, audience);
      const catalog = buildCommandCatalog(audienceCommands, visibility.language);
      const input = interaction.options.getString("comando");

      if (input) {
        const embeds = buildCommandEmbeds(input, catalog, interaction.guild.name, visibility.language);
        await interaction.reply({ embeds, flags: 64 });
        return;
      }

      const embeds = buildAudienceHomeEmbeds(
        audience,
        visibility,
        catalog,
        interaction.guild.name,
        visibility.language
      );
      const menu = buildSelectMenu(catalog, HOME_ID, selectId, visibility.language);

      await interaction.reply({
        embeds,
        components: [menu],
      });

      const reply = await interaction.fetchReply();
      const ownerId = interaction.user.id;
      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 2 * 60 * 1000,
        filter: (selectInteraction) => {
          if (selectInteraction.user.id !== ownerId) {
            void selectInteraction.reply({
              content: helpText(visibility.language, "owner_only_menu"),
              flags: 64,
            });
            return false;
          }

          return selectInteraction.customId === selectId;
        },
      });

      collector.on("collect", async (selectInteraction) => {
        const selected = selectInteraction.values[0];
        const updatedEmbeds =
          selected === HOME_ID
            ? buildAudienceHomeEmbeds(
                audience,
                visibility,
                catalog,
                interaction.guild.name,
                visibility.language
              )
            : buildCategoryEmbeds(selected, catalog, interaction.guild.name, visibility.language);
        const updatedMenu = buildSelectMenu(catalog, selected, selectId, visibility.language);

        await selectInteraction.update({
          embeds: updatedEmbeds,
          components: [updatedMenu],
        });
      });

      collector.on("end", async () => {
        try {
          const disabledMenu = buildSelectMenu(catalog, HOME_ID, selectId, visibility.language);
          disabledMenu.components[0]
            .setDisabled(true)
            .setPlaceholder(helpText(visibility.language, "expired_placeholder"));

          await interaction.editReply({
            components: [disabledMenu],
          });
        } catch (error) {
          console.error(`[${config.name.toUpperCase()} MENU EXPIRE ERROR]`, error);
        }
      });
    },
  };
}

module.exports = {
  createHelpCommand,
  __test: {
    extractUsages,
    getVisibilityContext,
    getCommandsForAudience,
    canSeeCommand,
    buildCommandCatalog,
    buildAudienceHomeEmbeds,
    buildCategoryEmbeds,
    buildCommandEmbeds,
    resolveEffectiveDefaultMemberPermissions,
  },
};
