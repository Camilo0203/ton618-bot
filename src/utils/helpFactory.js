const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const { getGuildSettings, getOwnerId, hasAdminPrivileges, hasStaffPrivileges } = require("./accessControl");
const { settings } = require("./database");
const { normalizeLanguage, resolveInteractionLanguage } = require("./i18n");

const HOME_ID = "__home";
const SELECT_ID_PREFIX = "help_category_select";
const SUBCOMMAND = 1;
const SUBCOMMAND_GROUP = 2;

const CATEGORY_META = {
  utility: { label: { es: "Herramientas", en: "Utilities" }, color: 0x5865f2 },
  fun: { label: { es: "Diversi\u00f3n", en: "Fun" }, color: 0xfee75c },
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

const SCOPE_LABEL = {
  public: { es: "Publico", en: "Public" },
  staff: { es: "Staff", en: "Staff" },
  admin: { es: "Admin", en: "Admin" },
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
      note: {
        es: "Abrir soporte, compras o seguimiento",
        en: "Open support, purchases or follow-up",
      },
    },
    {
      usage: "/ping",
      note: {
        es: "Verificar estado del bot",
        en: "Check bot status",
      },
    },
  ],
  staff: [
    {
      usage: "/staff mytickets",
      note: {
        es: "Revisar carga activa del equipo",
        en: "Review active team workload",
      },
    },
    {
      usage: "/ticket claim",
      note: {
        es: "Tomar ownership de un ticket",
        en: "Take ownership of a ticket",
      },
    },
    {
      usage: "/warn add",
      note: {
        es: "Aplicar advertencias al momento",
        en: "Apply warnings quickly",
      },
    },
    {
      usage: "/modlogs info",
      note: {
        es: "Verificar logs y trazabilidad",
        en: "Check logs and traceability",
      },
    },
  ],
  owner: [
    {
      usage: "/setup wizard",
      note: {
        es: "Aplicar configuracion base guiada",
        en: "Apply guided baseline configuration",
      },
    },
    {
      usage: "/setup general info",
      note: {
        es: "Auditar la configuracion general",
        en: "Audit general configuration",
      },
    },
    {
      usage: "/config estado",
      note: {
        es: "Ver estado consolidado del sistema",
        en: "Check consolidated system status",
      },
    },
    {
      usage: "/verify panel",
      note: {
        es: "Gestionar acceso seguro al servidor",
        en: "Manage secure server access",
      },
    },
    {
      usage: "/stats",
      note: {
        es: "Revisar rendimiento y soporte",
        en: "Review performance and support",
      },
    },
    {
      usage: "/debug status",
      note: {
        es: "Diagnostico avanzado del bot",
        en: "Advanced bot diagnostics",
      },
    },
  ],
};

const HELP_TEXT = {
  es: {
    no_description: "Sin descripcion",
    coverage_item: "comando",
    coverage_item_plural: "comandos",
    no_commands_in_category: "No hay comandos en esta categoria.",
    command_not_found: "Comando no encontrado",
    command_not_found_desc: "No hay un comando visible que coincida con `/{{command}}`.",
    command_help: "Ayuda: /{{command}}",
    select_home: "Inicio",
    select_placeholder: "Selecciona una categoria",
    denied_owner: "Este panel esta reservado para el propietario del bot.",
    denied_staff: "Este panel esta reservado para el equipo interno.",
    denied_default: "No tienes acceso a este panel.",
    option_command_description: "Nombre del comando para ver ayuda directa",
    owner_only_menu: "Solo el usuario que abrio este menu puede usarlo.",
    expired_placeholder: "Menu expirado - vuelve a usar el comando",
    public_title: "Centro de Soporte y Operacion",
    public_desc:
      "TON618 funciona como una consola operativa para **tickets**, **SLA**, **playbooks vivos**, **verificacion** y coordinacion del staff.",
    public_footer: "{{guild}} - Panel de ayuda profesional",
    public_areas: "Areas Disponibles",
    public_flow: "Flujo Recomendado",
    public_usage: "Uso del Servidor",
    public_usage_value:
      "- **Clientes y usuarios**: usa `/ticket open` para soporte, compras o seguimiento.\n" +
      "- **Staff y administracion**: usan paneles internos separados.",
    staff_title: "Centro de Operacion Staff",
    staff_desc:
      "Vista interna para operar **tickets**, **bandeja web**, **SLA** e **incidentes** sin perder contexto del usuario.",
    staff_footer: "{{guild}} - Guia interna de staff",
    staff_workflow: "Flujo de Trabajo",
    staff_workflow_value:
      "- Usa `/staff mytickets` para revisar carga activa.\n" +
      "- Usa `/ticket claim`, `/ticket close`, `/ticket note` y `/ticket playbook` para atender soporte.\n" +
      "- Usa el inbox web para macros, recomendaciones y seguimiento diario.\n" +
      "- Escala al owner si se requieren cambios mayores de sistema o de SLA.",
    staff_categories: "Categorias Disponibles",
    owner_title: "Centro de Control Owner",
    owner_desc:
      "Vista completa para administrar la consola operativa, la seguridad, la configuracion y la salud del servidor.",
    owner_footer: "{{guild}} - Control total del sistema",
    owner_tasks: "Tareas Clave",
    owner_tasks_value:
      "- Usa `/setup` y `/config` para estructura base.\n" +
      "- Usa `/verify` para control de acceso y seguridad.\n" +
      "- Usa `/stats` y `/debug` para diagnostico.\n" +
      "- Supervisa `/ticket`, `/staff`, `/modlogs` y el dashboard para soporte.",
    owner_coverage: "Cobertura del Bot",
    category_title: "Comandos de {{category}}",
    category_footer: "{{guild}} - Centro operativo del bot",
    command_footer: "{{guild}} - Alcance: {{scope}}",
  },
  en: {
    no_description: "No description",
    coverage_item: "command",
    coverage_item_plural: "commands",
    no_commands_in_category: "There are no commands in this category.",
    command_not_found: "Command not found",
    command_not_found_desc: "There is no visible command matching `/{{command}}`.",
    command_help: "Help: /{{command}}",
    select_home: "Home",
    select_placeholder: "Select a category",
    denied_owner: "This panel is reserved for the bot owner.",
    denied_staff: "This panel is reserved for the internal team.",
    denied_default: "You do not have access to this panel.",
    option_command_description: "Command name for direct help",
    owner_only_menu: "Only the user who opened this menu can use it.",
    expired_placeholder: "Menu expired - run the command again",
    public_title: "Support and Operations Center",
    public_desc:
      "TON618 operates as an ops console for **tickets**, **SLA**, **live playbooks**, **verification**, and staff coordination.",
    public_footer: "{{guild}} - Professional help panel",
    public_areas: "Available Areas",
    public_flow: "Recommended Flow",
    public_usage: "Server Usage",
    public_usage_value:
      "- **Clients and users**: use `/ticket open` for support, purchases, or follow-up.\n" +
      "- **Staff and admins**: use separate internal panels.",
    staff_title: "Staff Operations Center",
    staff_desc:
      "Internal team view to operate **tickets**, **web inbox**, **SLA pressure**, and **incident follow-up**.",
    staff_footer: "{{guild}} - Staff internal guide",
    staff_workflow: "Workflow",
    staff_workflow_value:
      "- Use `/staff mytickets` to review active load.\n" +
      "- Use `/ticket claim`, `/ticket close`, `/ticket note`, and `/ticket playbook` for support handling.\n" +
      "- Use the web inbox for macros, recommendations, and daily follow-up.\n" +
      "- Escalate to owner if major system or SLA changes are needed.",
    staff_categories: "Available Categories",
    owner_title: "Owner Control Center",
    owner_desc:
      "Full view to manage the ops console, security, configuration, and server health.",
    owner_footer: "{{guild}} - Full system control",
    owner_tasks: "Key Tasks",
    owner_tasks_value:
      "- Use `/setup` and `/config` for baseline structure.\n" +
      "- Use `/verify` for access and security control.\n" +
      "- Use `/stats` and `/debug` for diagnostics.\n" +
      "- Monitor `/ticket`, `/staff`, `/modlogs`, and the dashboard for support operations.",
    owner_coverage: "Bot Coverage",
    category_title: "Commands in {{category}}",
    category_footer: "{{guild}} - Bot operations center",
    command_footer: "{{guild}} - Scope: {{scope}}",
  },
};

function titleCase(text) {
  return String(text || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function helpText(language, key, vars = {}) {
  const lang = normalizeLanguage(language, "es");
  const template = HELP_TEXT[lang]?.[key] || HELP_TEXT.es[key] || key;
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, token) =>
    Object.prototype.hasOwnProperty.call(vars, token) ? String(vars[token]) : ""
  );
}

function getCategoryLabel(categoryId, language) {
  const meta = CATEGORY_META[categoryId];
  if (!meta) return titleCase(categoryId);
  const lang = normalizeLanguage(language, "es");
  return meta.label?.[lang] || meta.label?.es || titleCase(categoryId);
}

function getScopeLabel(scope, language) {
  const lang = normalizeLanguage(language, "es");
  return SCOPE_LABEL[scope]?.[lang] || SCOPE_LABEL[scope]?.es || (lang === "en" ? "Public" : "Publico");
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

function extractUsages(command, language = "es") {
  const json = command.data.toJSON();
  const base = `/${json.name}`;
  const options = Array.isArray(json.options) ? json.options : [];
  const groups = options.filter((option) => option.type === SUBCOMMAND_GROUP);
  const subs = options.filter((option) => option.type === SUBCOMMAND);
  const noDescription = helpText(language, "no_description");

  if (!groups.length && !subs.length) {
    return [{ usage: base, description: json.description || noDescription }];
  }

  const rows = [];
  for (const sub of subs) {
    rows.push({
      usage: `${base} ${sub.name}`,
      description: sub.description || json.description || noDescription,
    });
  }

  for (const group of groups) {
    const groupSubs = Array.isArray(group.options)
      ? group.options.filter((option) => option.type === SUBCOMMAND)
      : [];

    for (const sub of groupSubs) {
      rows.push({
        usage: `${base} ${group.name} ${sub.name}`,
        description: sub.description || group.description || json.description || noDescription,
      });
    }
  }

  return rows.length ? rows : [{ usage: base, description: json.description || noDescription }];
}

async function getVisibilityContext(interaction) {
  const ownerId = getOwnerId(interaction.client);
  const isOwner = Boolean(ownerId && interaction.user.id === ownerId);
  const guildSettings = await getGuildSettings(interaction.guild.id);
  const isAdmin = isOwner || hasAdminPrivileges(interaction.member, guildSettings);
  const isStaff = isAdmin || hasStaffPrivileges(interaction.member, guildSettings);
  const language = resolveInteractionLanguage(interaction, guildSettings);

  let simpleHelpMode = guildSettings?.simple_help_mode !== false;
  if (!guildSettings) {
    try {
      const guildSettingsDoc = await settings.get(interaction.guild.id);
      simpleHelpMode = guildSettingsDoc?.simple_help_mode !== false;
    } catch {
      simpleHelpMode = true;
    }
  }

  return { isOwner, isAdmin, isStaff, simpleHelpMode, language };
}

function buildAudienceVisibility(baseVisibility, audience) {
  if (audience === "owner") {
    return { ...baseVisibility, isOwner: true, isAdmin: true, isStaff: true, simpleHelpMode: false };
  }

  if (audience === "staff") {
    return { ...baseVisibility, isOwner: false, isAdmin: false, isStaff: true, simpleHelpMode: false };
  }

  return { ...baseVisibility, isOwner: false, isAdmin: false, isStaff: false, simpleHelpMode: true };
}

function canSeeCommand(command, interaction, visibility) {
  const json = command.data.toJSON();
  const scope = getScope(command);

  if (command.meta?.hidden && !visibility.isOwner) return false;
  if (scope === "developer" && !visibility.isOwner) return false;
  if (scope === "admin" && !visibility.isAdmin) return false;
  if (scope === "staff" && !visibility.isStaff) return false;

  if (
    visibility.simpleHelpMode &&
    !visibility.isAdmin &&
    !visibility.isOwner &&
    ADVANCED_COMMAND_NAMES.has(json.name)
  ) {
    return false;
  }

  const requiredPerms = json.default_member_permissions ? BigInt(json.default_member_permissions) : null;
  if (
    requiredPerms &&
    scope === "public" &&
    !interaction.member.permissions.has(requiredPerms) &&
    !visibility.isAdmin
  ) {
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

function buildCommandCatalog(commands, language = "es") {
  const categories = new Map();
  for (const command of commands) {
    const categoryKey = getCategory(command);
    if (!categories.has(categoryKey)) categories.set(categoryKey, []);

    const items = extractUsages(command, language).map((row) => ({
      ...row,
      scope: getScope(command),
      commandName: command.data.name,
    }));

    categories.get(categoryKey).push(...items);
  }

  for (const [, list] of categories) {
    list.sort((a, b) => a.usage.localeCompare(b.usage));
  }

  return categories;
}

function buildCoverageLines(catalog, language = "es") {
  return Array.from(catalog.keys())
    .sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    })
    .map((id) => {
      const label = getCategoryLabel(id, language);
      const count = catalog.get(id).length;
      const noun = count === 1
        ? helpText(language, "coverage_item")
        : helpText(language, "coverage_item_plural");
      return `- **${label}**: ${count} ${noun}`;
    })
    .join("\n");
}

function buildQuickStartLines(audience, catalog, language = "es") {
  const allUsages = new Set(Array.from(catalog.values()).flat().map((item) => item.usage.toLowerCase()));
  return (QUICK_START[audience] || [])
    .filter((entry) => allUsages.has(entry.usage.toLowerCase()))
    .map((entry) => `- \`${entry.usage}\` - ${entry.note?.[normalizeLanguage(language, "es")] || entry.note?.es || ""}`);
}

function buildAudienceHomeEmbed(audience, catalog, guildName, language = "es") {
  if (audience === "staff") {
    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle(helpText(language, "staff_title"))
      .setDescription(helpText(language, "staff_desc"))
      .setFooter({ text: helpText(language, "staff_footer", { guild: guildName }) })
      .setTimestamp();

    embed.addFields(
      {
        name: helpText(language, "staff_workflow"),
        value: helpText(language, "staff_workflow_value"),
        inline: false,
      },
      {
        name: helpText(language, "staff_categories"),
        value: buildCoverageLines(catalog, language) || helpText(language, "no_commands_in_category"),
        inline: false,
      }
    );

    return embed;
  }

  if (audience === "owner") {
    const embed = new EmbedBuilder()
      .setColor(0x95a5a6)
      .setTitle(helpText(language, "owner_title"))
      .setDescription(helpText(language, "owner_desc"))
      .setFooter({ text: helpText(language, "owner_footer", { guild: guildName }) })
      .setTimestamp();

    embed.addFields(
      {
        name: helpText(language, "owner_tasks"),
        value: helpText(language, "owner_tasks_value"),
        inline: false,
      },
      {
        name: helpText(language, "owner_coverage"),
        value: buildCoverageLines(catalog, language) || helpText(language, "no_commands_in_category"),
        inline: false,
      }
    );

    return embed;
  }

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(helpText(language, "public_title"))
    .setDescription(helpText(language, "public_desc"))
    .setFooter({ text: helpText(language, "public_footer", { guild: guildName }) })
    .setTimestamp();

  embed.addFields({
    name: helpText(language, "public_areas"),
    value: buildCoverageLines(catalog, language) || helpText(language, "no_commands_in_category"),
    inline: false,
  });

  const quickLines = buildQuickStartLines(audience, catalog, language);
  if (quickLines.length) {
    embed.addFields({
      name: helpText(language, "public_flow"),
      value: quickLines.join("\n"),
      inline: false,
    });
  }

  embed.addFields({
    name: helpText(language, "public_usage"),
    value: helpText(language, "public_usage_value"),
    inline: false,
  });

  return embed;
}

function buildCategoryEmbed(categoryId, catalog, guildName, language = "es") {
  const meta = CATEGORY_META[categoryId] || { color: 0x99aab5 };
  const commands = catalog.get(categoryId) || [];
  const grouped = {
    public: [],
    staff: [],
    admin: [],
    developer: [],
  };

  for (const command of commands) {
    const scope = grouped[command.scope] ? command.scope : "public";
    grouped[scope].push(command);
  }

  const sections = [];
  for (const scope of ["public", "staff", "admin", "developer"]) {
    if (!grouped[scope].length) continue;
    const lines = grouped[scope].slice(0, 40).map((command) => `- \`${command.usage}\` - ${command.description}`);
    sections.push(`**${getScopeLabel(scope, language)}**\n${lines.join("\n")}`);
  }

  return new EmbedBuilder()
    .setColor(meta.color)
    .setTitle(helpText(language, "category_title", { category: getCategoryLabel(categoryId, language) }))
    .setDescription(sections.join("\n\n") || helpText(language, "no_commands_in_category"))
    .setFooter({ text: helpText(language, "category_footer", { guild: guildName }) })
    .setTimestamp();
}

function buildCommandEmbed(query, catalog, guildName, language = "es") {
  const normalized = normalizeCommandInput(query);
  const allItems = Array.from(catalog.values()).flat();
  const matches = allItems.filter((item) => item.usage.toLowerCase().startsWith(`/${normalized}`));

  if (!matches.length) {
    return new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle(helpText(language, "command_not_found"))
      .setDescription(helpText(language, "command_not_found_desc", { command: normalized }))
      .setFooter({ text: helpText(language, "category_footer", { guild: guildName }) })
      .setTimestamp();
  }

  const first = matches[0];
  const examples = matches.slice(0, 20).map((item) => `- \`${item.usage}\` - ${item.description}`).join("\n");

  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(helpText(language, "command_help", { command: first.commandName }))
    .setDescription(examples)
    .setFooter({
      text: helpText(language, "command_footer", {
        guild: guildName,
        scope: getScopeLabel(first.scope, language),
      }),
    })
    .setTimestamp();
}

function buildSelectMenu(catalog, selected, customId, language = "es") {
  const ordered = Array.from(catalog.keys()).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  const options = [
    { label: helpText(language, "select_home"), value: HOME_ID, default: selected === HOME_ID },
    ...ordered.slice(0, 24).map((id) => ({
      label: getCategoryLabel(id, language),
      value: id,
      default: selected === id,
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

function buildAudienceDeniedMessage(audience, language = "es") {
  if (audience === "owner") {
    return helpText(language, "denied_owner");
  }

  if (audience === "staff") {
    return helpText(language, "denied_staff");
  }

  return helpText(language, "denied_default");
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
          .setDescription("Nombre del comando para ver ayuda directa")
          .setDescriptionLocalizations({
            "en-US": "Command name for direct help",
            "en-GB": "Command name for direct help",
          })
          .setRequired(false)
          .setAutocomplete(true)
      ),
    meta: {
      hidden: config.hidden === true,
    },

    async autocomplete(interaction) {
      const visibility = await getVisibilityContext(interaction);
      const language = visibility.language;
      if (!canOpenAudiencePanel(visibility, audience)) {
        await interaction.respond([]);
        return;
      }

      const visible = getCommandsForAudience(interaction, visibility, audience);
      const focused = normalizeCommandInput(interaction.options.getFocused() || "");
      const values = new Set();

      for (const command of visible) {
        for (const usage of extractUsages(command, language)) {
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
      const language = visibility.language;
      if (!canOpenAudiencePanel(visibility, audience)) {
        await interaction.reply({
          content: buildAudienceDeniedMessage(audience, language),
          flags: 64,
        });
        return;
      }

      const audienceCommands = getCommandsForAudience(interaction, visibility, audience);
      const catalog = buildCommandCatalog(audienceCommands, language);
      const input = interaction.options.getString("comando");

      if (input) {
        const embed = buildCommandEmbed(input, catalog, interaction.guild.name, language);
        await interaction.reply({ embeds: [embed], flags: 64 });
        return;
      }

      const embed = buildAudienceHomeEmbed(audience, catalog, interaction.guild.name, language);
      const menu = buildSelectMenu(catalog, HOME_ID, selectId, language);

      await interaction.reply({
        embeds: [embed],
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
              content: helpText(language, "owner_only_menu"),
              flags: 64,
            });
            return false;
          }

          return selectInteraction.customId === selectId;
        },
      });

      collector.on("collect", async (selectInteraction) => {
        const selected = selectInteraction.values[0];
        const updatedEmbed =
          selected === HOME_ID
            ? buildAudienceHomeEmbed(audience, catalog, interaction.guild.name, language)
            : buildCategoryEmbed(selected, catalog, interaction.guild.name, language);
        const updatedMenu = buildSelectMenu(catalog, selected, selectId, language);

        await selectInteraction.update({
          embeds: [updatedEmbed],
          components: [updatedMenu],
        });
      });

      collector.on("end", async () => {
        try {
          const disabledMenu = buildSelectMenu(catalog, HOME_ID, selectId, language);
          disabledMenu.components[0]
            .setDisabled(true)
            .setPlaceholder(helpText(language, "expired_placeholder"));

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
};
