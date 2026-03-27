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

const HOME_ID = "__home";
const SELECT_ID_PREFIX = "help_category_select";
const SUBCOMMAND = 1;
const SUBCOMMAND_GROUP = 2;
const HELP_LANGUAGE = "en";
const FIELD_VALUE_LIMIT = 1024;
const EMBED_TOTAL_LIMIT = 5600;
const CONTINUED_SUFFIX = " (continued)";

const CATEGORY_META = {
  utility: { label: { es: "Herramientas", en: "Utilities" }, color: 0x5865f2 },
  fun: { label: { es: "Diversion", en: "Fun" }, color: 0xfee75c },
  moderation: { label: { es: "Moderacion", en: "Moderation" }, color: 0xed4245 },
  tickets: { label: { es: "Tickets", en: "Tickets" }, color: 0xeb459e },
  config: { label: { es: "Configuracion", en: "Configuration" }, color: 0x3498db },
  system: { label: { es: "Sistema", en: "System" }, color: 0x95a5a6 },
  general: { label: { es: "General", en: "General" }, color: 0x5865f2 },
  other: { label: { es: "Otros", en: "Other" }, color: 0x99aab5 },
};

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

const ACCESS_LABEL = {
  public: { es: "Publico", en: "Public" },
  staff: { es: "Staff", en: "Staff" },
  admin: { es: "Admin", en: "Admin" },
  owner: { es: "Propietario", en: "Owner" },
  developer: { es: "Desarrollador", en: "Developer" },
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

const QUICK_START = {
  user: [
    {
      usage: "/ticket open",
      note: "Open a new support ticket and begin the support flow.",
    },
    {
      usage: "/help",
      note: "Browse the commands that are currently available to you in this server.",
    },
  ],
  staff: [
    {
      usage: "/staff my-tickets",
      note: "Review your active ticket load before picking up more work.",
    },
    {
      usage: "/ticket claim",
      note: "Take ownership of the current ticket so the team knows you are handling it.",
    },
    {
      usage: "/ticket note add",
      note: "Leave an internal handoff note for future follow-up.",
    },
    {
      usage: "/modlogs info",
      note: "Check whether moderation logging is configured and healthy.",
    },
  ],
  owner: [
    {
      usage: "/setup wizard",
      note: "Apply a guided baseline setup for a new support server.",
    },
    {
      usage: "/config status",
      note: "Review the current live configuration at a glance.",
    },
    {
      usage: "/verify panel",
      note: "Refresh the verification panel after security or onboarding changes.",
    },
    {
      usage: "/stats sla",
      note: "Review SLA performance and escalation pressure.",
    },
    {
      usage: "/debug status",
      note: "Inspect owner-only deployment and runtime diagnostics.",
    },
  ],
};

const COMMAND_OVERVIEWS = Object.freeze({
  audit: "Export ticket data and prepare administrative reviews without changing live records.",
  config: "Inspect live server settings, review ticket configuration, and open the interactive admin control center.",
  debug: "Run owner-only diagnostics for uptime, health, caches, guild connectivity, and commercial entitlements.",
  embed: "Create, edit, and publish custom Discord embeds for announcements or structured updates.",
  help: "Browse the interactive help center and see only the commands currently available to you in this server.",
  modlogs: "Control moderation log delivery, storage channel, and event coverage.",
  perfil: "Review member progression, economy balance, and quick leaderboard snapshots.",
  ping: "Check bot latency, uptime, and owner-only runtime counts.",
  poll: "Create interactive server polls, review active polls, and end them early when needed.",
  setup: "Configure tickets, automation, onboarding flows, and command availability for this server.",
  staff: "Manage staff availability, open workload, and quick warning shortcuts from one command.",
  stats: "Review server-wide ticket metrics, SLA performance, staff output, and satisfaction trends.",
  suggest: "Open the suggestion workflow so members can submit ideas for the server.",
  ticket: "Handle the full ticket lifecycle, internal notes, transcripts, and live playbook actions.",
  verify: "Manage verification, anti-raid protection, confirmation messages, and verification activity.",
  warn: "Apply, review, and remove warnings, including the automatic actions tied to warning counts.",
});

const USAGE_OVERRIDES = Object.freeze({
  "/audit tickets":
    "Export ticket data to a CSV file using optional status, priority, category, date, and row-limit filters.",
  "/config center":
    "Open the interactive configuration center so administrators can review and adjust live settings from Discord.",
  "/config status":
    "Review the current server setup at a glance, including key channels, roles, help mode, and commercial status.",
  "/config tickets":
    "Open a full ticket-operations snapshot with limits, SLA settings, automation, and category coverage.",
  "/embed anuncio":
    "Send a preformatted announcement embed for server news or high-visibility updates.",
  "/embed crear":
    "Open an interactive form to compose and send a fully customized embed.",
  "/embed editar":
    "Edit an existing embed message that was previously sent by the bot.",
  "/embed rapido":
    "Send a quick embed with a title and description without opening the full builder.",
  "/help":
    "Open the interactive help center and browse only the commands you can currently use in this server.",
  "/perfil top":
    "Show the quick level and economy leaderboards for this server.",
  "/perfil ver":
    "Open your profile, or another member's profile, with level and economy information.",
  "/poll crear":
    "Create an interactive poll with up to 10 options, a schedule, and optional multiple voting.",
  "/poll finalizar":
    "Close an active poll early by using its short poll ID.",
  "/poll lista":
    "List the polls that are still active in this server.",
  "/setup commands panel":
    "Open an interactive control panel for enabling, disabling, and checking commands without typing names manually.",
  "/setup wizard":
    "Apply a guided baseline setup for a support server, including dashboard, core channels, roles, plan, SLA defaults, and optional panel publishing.",
  "/stats ratings":
    "Rank staff by ticket ratings for the selected time period.",
  "/stats staff-rating":
    "Open the detailed rating profile for one staff member.",
  "/suggest":
    "Open the suggestion modal and submit a new idea for the server.",
  "/ticket brief":
    "Open the current ticket's operational brief so staff can review context, recommendations, and next steps quickly.",
  "/ticket history":
    "Show a member's ticket history, including open tickets and recently closed cases.",
  "/ticket info":
    "Review the current ticket's context, status, and detailed operational snapshot.",
  "/ticket note add":
    "Save an internal staff note on the current ticket for handoffs and future follow-up.",
  "/ticket note clear":
    "Remove every internal note from the current ticket. Administrators only.",
  "/ticket note list":
    "List the internal notes that staff have already saved on the current ticket.",
  "/ticket open":
    "Open a new private support ticket and enter the server's ticket workflow.",
  "/ticket playbook apply-macro":
    "Post the macro suggested by a playbook directly into the ticket conversation.",
  "/ticket playbook confirm":
    "Approve a recommended playbook action so the ticket workflow can advance with it.",
  "/ticket playbook disable":
    "Disable a live playbook for this server.",
  "/ticket playbook dismiss":
    "Dismiss a recommendation that is not appropriate for the current ticket.",
  "/ticket playbook enable":
    "Enable a live playbook for this server so its recommendations can be used in tickets.",
  "/ticket playbook list":
    "Show the live playbooks and recommendations currently available for the active ticket.",
  "/verify info":
    "Review the current verification configuration, roles, channels, anti-raid status, and confirmation settings.",
  "/verify panel":
    "Send the verification panel to the configured channel or refresh the existing panel after changing settings.",
  "/verify stats":
    "Show recent verification activity and totals for verified, failed, and kicked members.",
  "/debug entitlements set-plan":
    "Manually change a guild's commercial plan and optional expiry for testing or support work.",
  "/debug entitlements set-supporter":
    "Turn supporter status on or off for a guild and optionally set an expiry.",
  "/debug entitlements status":
    "Inspect the effective commercial plan and supporter state for a specific guild.",
});

const HELP_TEXT = {
  en: {
    no_description: "No description available.",
    no_commands_in_category: "There are no visible command entries in this category.",
    command_not_found: "Command not found",
    command_not_found_desc: "No visible command or subcommand matched `/{{command}}`.",
    command_help: "Help: /{{command}}",
    select_home: "Home",
    select_placeholder: "Browse a category",
    denied_owner: "This help panel is reserved for the bot owner.",
    denied_staff: "This help panel is reserved for staff members.",
    denied_default: "You do not have access to this help panel.",
    option_command_description: "Command name or usage path for direct help",
    owner_only_menu: "Only the person who opened this help menu can use it.",
    expired_placeholder: "Menu expired - run /help again",
    home_title: "TON618 Help Center",
    home_desc:
      "Browse the commands currently available to you in **{{guild}}**. Hidden, disabled, and inaccessible commands are excluded automatically.",
    home_overview: "What TON618 Offers",
    home_overview_value:
      "Ticket operations, verification, moderation workflows, SLA monitoring, diagnostics, and server configuration from one Discord bot.",
    home_visibility: "Your View",
    home_visibility_value:
      "Access level: **{{access}}**\nVisible commands: **{{commands}}**\nVisible usage entries: **{{entries}}**\nVisible categories: **{{categories}}**{{simple_help}}",
    home_categories: "Categories",
    home_quick_start: "Recommended Starting Points",
    home_footer: "{{guild}} - visible commands only",
    category_title: "{{category}} Commands",
    category_desc:
      "Showing the command entries you can currently use in this category. Entries are grouped by top-level command.",
    category_footer: "{{guild}} - category help",
    command_desc:
      "{{summary}}\n\nCategory: **{{category}}**\nAccess: **{{access}}**\nVisible entries: **{{entries}}**{{focus}}",
    command_footer: "{{guild}} - direct command help",
    field_entries: "Visible Entries",
    simple_help_note:
      "\nSimplified help is enabled in this server, so advanced commands stay hidden until the right access is available.",
  },
};

HELP_TEXT.es = HELP_TEXT.en;

function titleCase(text) {
  return String(text || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function helpText(_language, key, vars = {}) {
  const template = HELP_TEXT[HELP_LANGUAGE]?.[key] || key;
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, token) =>
    Object.prototype.hasOwnProperty.call(vars, token) ? String(vars[token]) : ""
  );
}

function getCategoryLabel(categoryId) {
  const meta = CATEGORY_META[categoryId];
  if (!meta) return titleCase(categoryId);
  return meta.label?.en || titleCase(categoryId);
}

function getAccessLabel(access) {
  return ACCESS_LABEL[access]?.en || titleCase(access || "public");
}

function normalizeCommandInput(input) {
  return String(input || "").trim().replace(/^\//, "").toLowerCase();
}

function getScope(command) {
  return command.meta?.scope || "public";
}

function getCategory(command) {
  const raw = String(command.meta?.category || "other").toLowerCase();
  return CATEGORY_META[raw] ? raw : "other";
}

function getCommandAccess(command) {
  return resolveRequiredAccess(command) || getScope(command);
}

function normalizeUsageKey(tokens) {
  return `/${tokens.filter(Boolean).join(" ").trim()}`;
}

function cleanHelpSentence(text, fallback = helpText(HELP_LANGUAGE, "no_description")) {
  const value = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!value) return fallback;
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function sameHelpText(a, b) {
  return normalizeCommandInput(String(a || "").replace(/\.$/, "")) === normalizeCommandInput(String(b || "").replace(/\.$/, ""));
}

function joinNaturalList(values) {
  const list = values.filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
}

function summarizeOptionLabel(option) {
  const raw = String(option?.description || option?.name || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.:]$/, "");

  if (!raw) return titleCase(option?.name || "value").toLowerCase();
  return raw.charAt(0).toLowerCase() + raw.slice(1);
}

function buildOptionSentence(options = []) {
  const flatOptions = Array.isArray(options)
    ? options.filter((option) => option && option.type !== SUBCOMMAND && option.type !== SUBCOMMAND_GROUP)
    : [];

  if (!flatOptions.length) return "";

  const required = flatOptions.filter((option) => option.required).map(summarizeOptionLabel);
  const optional = flatOptions.filter((option) => !option.required).map(summarizeOptionLabel);
  const parts = [];

  if (required.length) {
    parts.push(`Key input: ${joinNaturalList(required)}.`);
  }

  if (optional.length) {
    parts.push(`Optional: ${joinNaturalList(optional)}.`);
  }

  return parts.join(" ");
}

function getCommandOverview(command) {
  const json = command.data.toJSON();
  return cleanHelpSentence(COMMAND_OVERVIEWS[json.name] || json.description);
}

function getUsageDescription(command, context) {
  const usageKey = normalizeUsageKey(context.pathTokens);
  const override = USAGE_OVERRIDES[usageKey];
  if (override) return cleanHelpSentence(override);

  const json = command.data.toJSON();
  const sourceDescription =
    context.subcommand?.description ||
    context.group?.description ||
    json.description;
  const base = cleanHelpSentence(sourceDescription);
  const optionSentence = buildOptionSentence(context.options);

  return optionSentence ? `${base} ${optionSentence}` : base;
}

function buildUsageRow(command, context) {
  const json = command.data.toJSON();
  const usage = normalizeUsageKey(context.pathTokens);
  return {
    usage,
    normalizedUsage: usage.toLowerCase(),
    description: getUsageDescription(command, context),
    commandName: json.name,
    access: getCommandAccess(command),
    scope: getScope(command),
    categoryId: getCategory(command),
    pathTokens: context.pathTokens,
  };
}

function extractUsages(command) {
  const json = command.data.toJSON();
  const options = Array.isArray(json.options) ? json.options : [];
  const rows = [];

  if (!options.some((option) => option.type === SUBCOMMAND || option.type === SUBCOMMAND_GROUP)) {
    rows.push(
      buildUsageRow(command, {
        pathTokens: [json.name],
        options,
      })
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
        })
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
        })
      );
    }
  }

  return rows.length
    ? rows
    : [
        buildUsageRow(command, {
          pathTokens: [json.name],
          options,
        }),
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
    language: HELP_LANGUAGE,
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

function buildCommandCatalog(commands) {
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

    const rows = extractUsages(command);
    const commandEntry = {
      commandName: command.data.name,
      access: getCommandAccess(command),
      scope: getScope(command),
      categoryId,
      summary: getCommandOverview(command),
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

function buildCoverageLines(catalog) {
  return getOrderedCategories(catalog)
    .map((category) => {
      const commandsLabel = category.commandCount === 1 ? "command" : "commands";
      const entriesLabel = category.rowCount === 1 ? "entry" : "entries";
      return (
        `- **${getCategoryLabel(category.id)}**: ` +
        `${category.commandCount} ${commandsLabel}, ${category.rowCount} visible ${entriesLabel}`
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

function buildQuickStartLines(audience, visibility, catalog) {
  const quickStartAudience = resolveQuickStartAudience(audience, visibility);
  const allUsages = new Set();

  for (const category of catalog.values()) {
    for (const command of category.commands) {
      for (const row of command.rows) {
        allUsages.add(row.normalizedUsage);
      }
    }
  }

  return (QUICK_START[quickStartAudience] || [])
    .filter((entry) => allUsages.has(entry.usage.toLowerCase()))
    .map((entry) => `- \`${entry.usage}\` - ${entry.note}`);
}

function getAccessTierLabel(visibility) {
  if (visibility.isOwner) return "Owner";
  if (visibility.isAdmin) return "Admin";
  if (visibility.isStaff) return "Staff";
  return "Member";
}

function buildAudienceHomeEmbeds(audience, visibility, catalog, guildName) {
  const commandCount = countVisibleCommands(catalog);
  const entryCount = countVisibleRows(catalog);
  const categoryCount = catalog.size;
  const simpleHelpNote =
    visibility.simpleHelpMode && !visibility.isAdmin && !visibility.isOwner
      ? helpText(HELP_LANGUAGE, "simple_help_note")
      : "";

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(helpText(HELP_LANGUAGE, "home_title"))
    .setDescription(helpText(HELP_LANGUAGE, "home_desc", { guild: guildName }))
    .setFooter({ text: helpText(HELP_LANGUAGE, "home_footer", { guild: guildName }) })
    .setTimestamp();

  embed.addFields(
    {
      name: helpText(HELP_LANGUAGE, "home_overview"),
      value: helpText(HELP_LANGUAGE, "home_overview_value"),
      inline: false,
    },
    {
      name: helpText(HELP_LANGUAGE, "home_visibility"),
      value: helpText(HELP_LANGUAGE, "home_visibility_value", {
        access: getAccessTierLabel(visibility),
        commands: commandCount,
        entries: entryCount,
        categories: categoryCount,
        simple_help: simpleHelpNote,
      }),
      inline: false,
    },
    {
      name: helpText(HELP_LANGUAGE, "home_categories"),
      value: buildCoverageLines(catalog) || helpText(HELP_LANGUAGE, "no_commands_in_category"),
      inline: false,
    }
  );

  const quickStartLines = buildQuickStartLines(audience, visibility, catalog);
  if (quickStartLines.length) {
    embed.addFields({
      name: helpText(HELP_LANGUAGE, "home_quick_start"),
      value: quickStartLines.join("\n"),
      inline: false,
    });
  }

  return [embed];
}

function buildFieldChunks(label, lines, introLine = null) {
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
    name: index === 0 ? label : `${label}${CONTINUED_SUFFIX}`,
    value,
    inline: false,
  }));
}

function buildCommandFields(commandEntry) {
  const label = `/${commandEntry.commandName} [${getAccessLabel(commandEntry.access)}]`;
  const rowLines = commandEntry.rows.map((row) => `- \`${row.usage}\` - ${row.description}`);
  const introLine =
    commandEntry.rows.length === 1 && sameHelpText(commandEntry.rows[0].description, commandEntry.summary)
      ? null
      : `Overview: ${commandEntry.summary}`;

  return buildFieldChunks(label, rowLines, introLine);
}

function buildPagedEmbeds({ color, title, description, footerText, fields }) {
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
      text: embeds.length > 1 ? `${footerText} | Page ${index + 1}/${embeds.length}` : footerText,
    })
  );
}

function buildCategoryEmbeds(categoryId, catalog, guildName) {
  const category = catalog.get(categoryId);
  const meta = CATEGORY_META[categoryId] || { color: 0x99aab5 };
  const categoryLabel = getCategoryLabel(categoryId);
  const categoryDescription = category
    ? `${helpText(HELP_LANGUAGE, "category_desc")}\n\nVisible commands: **${category.commandCount}**\nVisible entries: **${category.rowCount}**`
    : helpText(HELP_LANGUAGE, "no_commands_in_category");

  if (!category || !category.commands.length) {
    return [
      new EmbedBuilder()
        .setColor(meta.color)
        .setTitle(helpText(HELP_LANGUAGE, "category_title", { category: categoryLabel }))
        .setDescription(categoryDescription)
        .setFooter({ text: helpText(HELP_LANGUAGE, "category_footer", { guild: guildName }) })
        .setTimestamp(),
    ];
  }

  const fields = category.commands.flatMap((commandEntry) => buildCommandFields(commandEntry));
  return buildPagedEmbeds({
    color: meta.color,
    title: helpText(HELP_LANGUAGE, "category_title", { category: categoryLabel }),
    description: categoryDescription,
    footerText: helpText(HELP_LANGUAGE, "category_footer", { guild: guildName }),
    fields,
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

function buildCommandEmbeds(query, catalog, guildName) {
  const normalized = normalizeCommandInput(query);
  const commandEntry = findCommandEntry(normalized, catalog);

  if (!commandEntry) {
    return [
      new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle(helpText(HELP_LANGUAGE, "command_not_found"))
        .setDescription(helpText(HELP_LANGUAGE, "command_not_found_desc", { command: normalized }))
        .setFooter({ text: helpText(HELP_LANGUAGE, "command_footer", { guild: guildName }) })
        .setTimestamp(),
    ];
  }

  const orderedRows = orderCommandRows(commandEntry, normalized);
  const focusText =
    normalized && normalized !== commandEntry.commandName && orderedRows[0]
      ? `\nFocused match: \`${orderedRows[0].usage}\``
      : "";
  const description = helpText(HELP_LANGUAGE, "command_desc", {
    summary: commandEntry.summary,
    category: getCategoryLabel(commandEntry.categoryId),
    access: getAccessLabel(commandEntry.access),
    entries: commandEntry.rows.length,
    focus: focusText,
  });
  const fields = buildFieldChunks(
    helpText(HELP_LANGUAGE, "field_entries"),
    orderedRows.map((row) => `- \`${row.usage}\` - ${row.description}`)
  );

  return buildPagedEmbeds({
    color: 0x57f287,
    title: helpText(HELP_LANGUAGE, "command_help", { command: commandEntry.commandName }),
    description,
    footerText: helpText(HELP_LANGUAGE, "command_footer", { guild: guildName }),
    fields,
  });
}

function buildSelectMenu(catalog, selected, customId) {
  const ordered = getOrderedCategories(catalog);
  const options = [
    {
      label: helpText(HELP_LANGUAGE, "select_home"),
      value: HOME_ID,
      default: selected === HOME_ID,
    },
    ...ordered.slice(0, 24).map((category) => ({
      label: getCategoryLabel(category.id),
      value: category.id,
      default: selected === category.id,
    })),
  ];

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(helpText(HELP_LANGUAGE, "select_placeholder"))
      .addOptions(options)
  );
}

function canOpenAudiencePanel(visibility, audience) {
  if (audience === "owner") return visibility.isOwner;
  if (audience === "staff") return visibility.isStaff || visibility.isAdmin || visibility.isOwner;
  return true;
}

function buildAudienceDeniedMessage(audience) {
  if (audience === "owner") return helpText(HELP_LANGUAGE, "denied_owner");
  if (audience === "staff") return helpText(HELP_LANGUAGE, "denied_staff");
  return helpText(HELP_LANGUAGE, "denied_default");
}

function createHelpCommand(config) {
  const audience = config.audience;
  const selectId = `${SELECT_ID_PREFIX}_${config.name}`;

  return {
    data: new SlashCommandBuilder()
      .setName(config.name)
      .setDescription(config.description)
      .addStringOption((option) =>
        option
          .setName("comando")
          .setDescription(helpText(HELP_LANGUAGE, "option_command_description"))
          .setDescriptionLocalizations({
            "en-US": helpText(HELP_LANGUAGE, "option_command_description"),
            "en-GB": helpText(HELP_LANGUAGE, "option_command_description"),
            "es-ES": helpText(HELP_LANGUAGE, "option_command_description"),
            "es-419": helpText(HELP_LANGUAGE, "option_command_description"),
          })
          .setRequired(false)
          .setAutocomplete(true)
      ),
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
        for (const usage of extractUsages(command)) {
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
          content: buildAudienceDeniedMessage(audience),
          flags: 64,
        });
        return;
      }

      const audienceCommands = getCommandsForAudience(interaction, visibility, audience);
      const catalog = buildCommandCatalog(audienceCommands);
      const input = interaction.options.getString("comando");

      if (input) {
        const embeds = buildCommandEmbeds(input, catalog, interaction.guild.name);
        await interaction.reply({ embeds, flags: 64 });
        return;
      }

      const embeds = buildAudienceHomeEmbeds(audience, visibility, catalog, interaction.guild.name);
      const menu = buildSelectMenu(catalog, HOME_ID, selectId);

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
              content: helpText(HELP_LANGUAGE, "owner_only_menu"),
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
            ? buildAudienceHomeEmbeds(audience, visibility, catalog, interaction.guild.name)
            : buildCategoryEmbeds(selected, catalog, interaction.guild.name);
        const updatedMenu = buildSelectMenu(catalog, selected, selectId);

        await selectInteraction.update({
          embeds: updatedEmbeds,
          components: [updatedMenu],
        });
      });

      collector.on("end", async () => {
        try {
          const disabledMenu = buildSelectMenu(catalog, HOME_ID, selectId);
          disabledMenu.components[0]
            .setDisabled(true)
            .setPlaceholder(helpText(HELP_LANGUAGE, "expired_placeholder"));

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
