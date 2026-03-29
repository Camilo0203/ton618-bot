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
const { normalizeLanguage, resolveInteractionLanguage } = require("./i18n");

const HOME_ID = "__home";
const SELECT_ID_PREFIX = "help_category_select";
const SUBCOMMAND = 1;
const SUBCOMMAND_GROUP = 2;
const DEFAULT_HELP_LANGUAGE = "en";
const FIELD_VALUE_LIMIT = 1024;
const EMBED_TOTAL_LIMIT = 5600;

const CATEGORY_META = {
  utility: { label: { es: "Utilidades", en: "Utilities" }, color: 0x5865f2 },
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
  member: { es: "Miembro", en: "Member" },
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
        en: "Open a new support ticket and begin the support flow.",
        es: "Abre un nuevo ticket de soporte y comienza el flujo de atencion.",
      },
    },
    {
      usage: "/help",
      note: {
        en: "Browse the commands that are currently available to you in this server.",
        es: "Explora los comandos que tienes disponibles ahora mismo en este servidor.",
      },
    },
  ],
  staff: [
    {
      usage: "/staff my-tickets",
      note: {
        en: "Review your active ticket load before picking up more work.",
        es: "Revisa tu carga activa de tickets antes de tomar mas trabajo.",
      },
    },
    {
      usage: "/ticket claim",
      note: {
        en: "Take ownership of the current ticket so the team knows you are handling it.",
        es: "Asume el ticket actual para que el equipo sepa que tu lo estas atendiendo.",
      },
    },
    {
      usage: "/ticket note add",
      note: {
        en: "Leave an internal handoff note for future follow-up.",
        es: "Deja una nota interna de relevo para el seguimiento posterior.",
      },
    },
    {
      usage: "/modlogs info",
      note: {
        en: "Check whether moderation logging is configured and healthy.",
        es: "Comprueba si el registro de moderacion esta configurado y funcionando correctamente.",
      },
    },
  ],
  owner: [
    {
      usage: "/setup wizard",
      note: {
        en: "Apply a guided baseline setup for a new support server.",
        es: "Aplica una configuracion guiada inicial para un nuevo servidor de soporte.",
      },
    },
    {
      usage: "/config status",
      note: {
        en: "Review the current live configuration at a glance.",
        es: "Revisa de un vistazo la configuracion activa actual.",
      },
    },
    {
      usage: "/verify panel",
      note: {
        en: "Refresh the verification panel after security or onboarding changes.",
        es: "Actualiza el panel de verificacion despues de cambios de seguridad u onboarding.",
      },
    },
    {
      usage: "/stats sla",
      note: {
        en: "Review SLA performance and escalation pressure.",
        es: "Revisa el rendimiento del SLA y la presion de escalado.",
      },
    },
    {
      usage: "/debug status",
      note: {
        en: "Inspect owner-only deployment and runtime diagnostics.",
        es: "Inspecciona diagnosticos de despliegue y ejecucion solo para el owner.",
      },
    },
  ],
};

const COMMAND_OVERVIEWS = Object.freeze({
  audit: {
    en: "Export ticket data and prepare administrative reviews without changing live records.",
    es: "Exporta datos de tickets y prepara revisiones administrativas sin modificar los registros activos.",
  },
  config: {
    en: "Inspect live server settings, review ticket configuration, and open the interactive admin control center.",
    es: "Inspecciona la configuracion activa del servidor, revisa los ajustes de tickets y abre el centro de control administrativo interactivo.",
  },
  debug: {
    en: "Run owner-only diagnostics for uptime, health, caches, guild connectivity, and commercial entitlements.",
    es: "Ejecuta diagnosticos solo para el owner sobre uptime, estado, caches, conectividad de guilds y permisos comerciales.",
  },
  embed: {
    en: "Create, edit, and publish custom Discord embeds for announcements or structured updates.",
    es: "Crea, edita y publica embeds personalizados de Discord para anuncios o actualizaciones estructuradas.",
  },
  help: {
    en: "Browse the interactive help center and see only the commands currently available to you in this server.",
    es: "Explora el centro de ayuda interactivo y ve solo los comandos que tienes disponibles ahora mismo en este servidor.",
  },
  modlogs: {
    en: "Control moderation log delivery, storage channel, and event coverage.",
    es: "Controla la entrega de logs de moderacion, el canal de almacenamiento y la cobertura de eventos.",
  },
  perfil: {
    en: "Review member progression, economy balance, and quick leaderboard snapshots.",
    es: "Revisa la progresion de miembros, el balance de economia y los snapshots rapidos del leaderboard.",
  },
  ping: {
    en: "Check bot latency, uptime, and owner-only runtime counts.",
    es: "Comprueba la latencia del bot, el uptime y los contadores de ejecucion solo para el owner.",
  },
  poll: {
    en: "Create interactive server polls, review active polls, and end them early when needed.",
    es: "Crea encuestas interactivas del servidor, revisa las activas y finalizalas antes de tiempo cuando haga falta.",
  },
  setup: {
    en: "Configure tickets, automation, onboarding flows, and command availability for this server.",
    es: "Configura tickets, automatizaciones, flujos de onboarding y disponibilidad de comandos para este servidor.",
  },
  staff: {
    en: "Manage staff availability, open workload, and quick warning shortcuts from one command.",
    es: "Gestiona la disponibilidad del staff, la carga abierta de trabajo y accesos rapidos de avisos desde un solo comando.",
  },
  stats: {
    en: "Review server-wide ticket metrics, SLA performance, staff output, and satisfaction trends.",
    es: "Revisa metricas globales de tickets, rendimiento del SLA, produccion del staff y tendencias de satisfaccion.",
  },
  suggest: {
    en: "Open the suggestion workflow so members can submit ideas for the server.",
    es: "Abre el flujo de sugerencias para que los miembros puedan enviar ideas para el servidor.",
  },
  ticket: {
    en: "Handle the full ticket lifecycle, internal notes, transcripts, and live playbook actions.",
    es: "Gestiona todo el ciclo de vida de los tickets, las notas internas, los transcripts y las acciones activas de playbooks.",
  },
  verify: {
    en: "Manage verification, anti-raid protection, confirmation messages, and verification activity.",
    es: "Gestiona la verificacion, la proteccion anti-raid, los mensajes de confirmacion y la actividad de verificacion.",
  },
  warn: {
    en: "Apply, review, and remove warnings, including the automatic actions tied to warning counts.",
    es: "Aplica, revisa y elimina avisos, incluidas las acciones automaticas asociadas al numero de warnings.",
  },
});

const USAGE_OVERRIDES = Object.freeze({
  "/audit tickets": {
    en: "Export ticket data to a CSV file using optional status, priority, category, date, and row-limit filters.",
    es: "Exporta datos de tickets a un archivo CSV usando filtros opcionales de estado, prioridad, categoria, fecha y limite de filas.",
  },
  "/config center": {
    en: "Open the interactive configuration center so administrators can review and adjust live settings from Discord.",
    es: "Abre el centro de configuracion interactivo para que los administradores revisen y ajusten la configuracion activa desde Discord.",
  },
  "/config status": {
    en: "Review the current server setup at a glance, including key channels, roles, help mode, and commercial status.",
    es: "Revisa de un vistazo la configuracion actual del servidor, incluidos canales clave, roles, modo de ayuda y estado comercial.",
  },
  "/config tickets": {
    en: "Open a full ticket-operations snapshot with limits, SLA settings, automation, and category coverage.",
    es: "Abre un resumen completo de operaciones de tickets con limites, ajustes de SLA, automatizacion y cobertura por categorias.",
  },
  "/embed anuncio": {
    en: "Send a preformatted announcement embed for server news or high-visibility updates.",
    es: "Envia un embed de anuncio preformateado para noticias del servidor o actualizaciones de alta visibilidad.",
  },
  "/embed crear": {
    en: "Open an interactive form to compose and send a fully customized embed.",
    es: "Abre un formulario interactivo para componer y enviar un embed totalmente personalizado.",
  },
  "/embed editar": {
    en: "Edit an existing embed message that was previously sent by the bot.",
    es: "Edita un mensaje embed existente que el bot haya enviado anteriormente.",
  },
  "/embed rapido": {
    en: "Send a quick embed with a title and description without opening the full builder.",
    es: "Envia un embed rapido con titulo y descripcion sin abrir el constructor completo.",
  },
  "/help": {
    en: "Open the interactive help center and browse only the commands you can currently use in this server.",
    es: "Abre el centro de ayuda interactivo y explora solo los comandos que puedes usar ahora mismo en este servidor.",
  },
  "/perfil top": {
    en: "Show the quick level and economy leaderboards for this server.",
    es: "Muestra los leaderboards rapidos de nivel y economia de este servidor.",
  },
  "/perfil ver": {
    en: "Open your profile, or another member's profile, with level and economy information.",
    es: "Abre tu perfil, o el de otro miembro, con informacion de nivel y economia.",
  },
  "/poll crear": {
    en: "Create an interactive poll with up to 10 options, a schedule, and optional multiple voting.",
    es: "Crea una encuesta interactiva con hasta 10 opciones, programacion y voto multiple opcional.",
  },
  "/poll finalizar": {
    en: "Close an active poll early by using its short poll ID.",
    es: "Cierra una encuesta activa antes de tiempo usando su ID corto.",
  },
  "/poll lista": {
    en: "List the polls that are still active in this server.",
    es: "Lista las encuestas que todavia siguen activas en este servidor.",
  },
  "/setup commands panel": {
    en: "Open an interactive control panel for enabling, disabling, and checking commands without typing names manually.",
    es: "Abre un panel de control interactivo para habilitar, deshabilitar y revisar comandos sin escribir nombres manualmente.",
  },
  "/setup wizard": {
    en: "Apply a guided baseline setup for a support server, including dashboard, core channels, roles, plan, SLA defaults, and optional panel publishing.",
    es: "Aplica una configuracion base guiada para un servidor de soporte, incluido dashboard, canales clave, roles, plan, SLA por defecto y publicacion opcional del panel.",
  },
  "/stats ratings": {
    en: "Rank staff by ticket ratings for the selected time period.",
    es: "Ordena al staff por valoraciones de tickets en el periodo seleccionado.",
  },
  "/stats staff-rating": {
    en: "Open the detailed rating profile for one staff member.",
    es: "Abre el perfil detallado de valoraciones de un miembro del staff.",
  },
  "/suggest": {
    en: "Open the suggestion modal and submit a new idea for the server.",
    es: "Abre el modal de sugerencias y envia una nueva idea para el servidor.",
  },
  "/ticket brief": {
    en: "Open the current ticket's operational brief so staff can review context, recommendations, and next steps quickly.",
    es: "Abre el resumen operativo del ticket actual para que el staff revise rapidamente el contexto, las recomendaciones y los siguientes pasos.",
  },
  "/ticket history": {
    en: "Show a member's ticket history, including open tickets and recently closed cases.",
    es: "Muestra el historial de tickets de un miembro, incluidos tickets abiertos y casos cerrados recientemente.",
  },
  "/ticket info": {
    en: "Review the current ticket's context, status, and detailed operational snapshot.",
    es: "Revisa el contexto del ticket actual, su estado y un resumen operativo detallado.",
  },
  "/ticket note add": {
    en: "Save an internal staff note on the current ticket for handoffs and future follow-up.",
    es: "Guarda una nota interna del staff en el ticket actual para relevos y seguimiento posterior.",
  },
  "/ticket note clear": {
    en: "Remove every internal note from the current ticket. Administrators only.",
    es: "Elimina todas las notas internas del ticket actual. Solo administradores.",
  },
  "/ticket note list": {
    en: "List the internal notes that staff have already saved on the current ticket.",
    es: "Lista las notas internas que el staff ya guardo en el ticket actual.",
  },
  "/ticket open": {
    en: "Open a new private support ticket and enter the server's ticket workflow.",
    es: "Abre un nuevo ticket privado de soporte y entra en el flujo de tickets del servidor.",
  },
  "/ticket playbook apply-macro": {
    en: "Post the macro suggested by a playbook directly into the ticket conversation.",
    es: "Publica directamente en la conversacion del ticket la macro sugerida por un playbook.",
  },
  "/ticket playbook confirm": {
    en: "Approve a recommended playbook action so the ticket workflow can advance with it.",
    es: "Aprueba una accion recomendada por el playbook para que el flujo del ticket pueda avanzar con ella.",
  },
  "/ticket playbook disable": {
    en: "Disable a live playbook for this server.",
    es: "Desactiva un playbook activo para este servidor.",
  },
  "/ticket playbook dismiss": {
    en: "Dismiss a recommendation that is not appropriate for the current ticket.",
    es: "Descarta una recomendacion que no sea adecuada para el ticket actual.",
  },
  "/ticket playbook enable": {
    en: "Enable a live playbook for this server so its recommendations can be used in tickets.",
    es: "Activa un playbook en vivo para este servidor para que sus recomendaciones puedan usarse en tickets.",
  },
  "/ticket playbook list": {
    en: "Show the live playbooks and recommendations currently available for the active ticket.",
    es: "Muestra los playbooks en vivo y las recomendaciones disponibles actualmente para el ticket activo.",
  },
  "/verify info": {
    en: "Review the current verification configuration, roles, channels, anti-raid status, and confirmation settings.",
    es: "Revisa la configuracion actual de verificacion, roles, canales, estado anti-raid y ajustes de confirmacion.",
  },
  "/verify panel": {
    en: "Send the verification panel to the configured channel or refresh the existing panel after changing settings.",
    es: "Envia el panel de verificacion al canal configurado o actualiza el panel existente despues de cambiar ajustes.",
  },
  "/verify stats": {
    en: "Show recent verification activity and totals for verified, failed, and kicked members.",
    es: "Muestra la actividad reciente de verificacion y los totales de miembros verificados, fallidos y expulsados.",
  },
  "/debug entitlements set-plan": {
    en: "Manually change a guild's commercial plan and optional expiry for testing or support work.",
    es: "Cambia manualmente el plan comercial de una guild y su expiracion opcional para pruebas o soporte.",
  },
  "/debug entitlements set-supporter": {
    en: "Turn supporter status on or off for a guild and optionally set an expiry.",
    es: "Activa o desactiva el estado de supporter para una guild y, si hace falta, define una expiracion.",
  },
  "/debug entitlements status": {
    en: "Inspect the effective commercial plan and supporter state for a specific guild.",
    es: "Inspecciona el plan comercial efectivo y el estado de supporter de una guild concreta.",
  },
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
    and_word: "and",
    required_label: "Key input",
    optional_label: "Optional",
    overview_prefix: "Overview",
    focused_match: "Focused match: `{{usage}}`",
    command_singular: "command",
    command_plural: "commands",
    visible_entry_singular: "visible entry",
    visible_entry_plural: "visible entries",
    visible_commands_label: "Visible commands",
    visible_entries_label: "Visible entries",
    page_label: "Page",
    continued_suffix: " (continued)",
  },
  es: {
    no_description: "No hay una descripcion disponible.",
    no_commands_in_category: "No hay entradas de comandos visibles en esta categoria.",
    command_not_found: "Comando no encontrado",
    command_not_found_desc: "No se encontro ningun comando o subcomando visible que coincida con `/{{command}}`.",
    command_help: "Ayuda: /{{command}}",
    select_home: "Inicio",
    select_placeholder: "Explora una categoria",
    denied_owner: "Este panel de ayuda esta reservado para el owner del bot.",
    denied_staff: "Este panel de ayuda esta reservado para miembros del staff.",
    denied_default: "No tienes acceso a este panel de ayuda.",
    option_command_description: "Nombre del comando o ruta de uso para ayuda directa",
    owner_only_menu: "Solo la persona que abrio este menu de ayuda puede usarlo.",
    expired_placeholder: "Menu caducado - ejecuta /help de nuevo",
    home_title: "Centro de ayuda de TON618",
    home_desc:
      "Explora los comandos que tienes disponibles actualmente en **{{guild}}**. Los comandos ocultos, deshabilitados o inaccesibles se excluyen automaticamente.",
    home_overview: "Lo que ofrece TON618",
    home_overview_value:
      "Operaciones de tickets, verificacion, flujos de moderacion, seguimiento de SLA, diagnostico y configuracion del servidor desde un solo bot de Discord.",
    home_visibility: "Tu vista",
    home_visibility_value:
      "Nivel de acceso: **{{access}}**\nComandos visibles: **{{commands}}**\nEntradas visibles: **{{entries}}**\nCategorias visibles: **{{categories}}**{{simple_help}}",
    home_categories: "Categorias",
    home_quick_start: "Puntos de inicio recomendados",
    home_footer: "{{guild}} - solo comandos visibles",
    category_title: "Comandos de {{category}}",
    category_desc:
      "Mostrando las entradas de comandos que puedes usar ahora mismo en esta categoria. Las entradas se agrupan por comando principal.",
    category_footer: "{{guild}} - ayuda por categoria",
    command_desc:
      "{{summary}}\n\nCategoria: **{{category}}**\nAcceso: **{{access}}**\nEntradas visibles: **{{entries}}**{{focus}}",
    command_footer: "{{guild}} - ayuda directa del comando",
    field_entries: "Entradas visibles",
    simple_help_note:
      "\nLa ayuda simplificada esta activada en este servidor, por lo que los comandos avanzados permanecen ocultos hasta que tengas el acceso adecuado.",
    and_word: "y",
    required_label: "Dato clave",
    optional_label: "Opcional",
    overview_prefix: "Resumen",
    focused_match: "Coincidencia destacada: `{{usage}}`",
    command_singular: "comando",
    command_plural: "comandos",
    visible_entry_singular: "entrada visible",
    visible_entry_plural: "entradas visibles",
    visible_commands_label: "Comandos visibles",
    visible_entries_label: "Entradas visibles",
    page_label: "Pagina",
    continued_suffix: " (continuacion)",
  },
};

function getLocalizedValue(value, language, fallback = "") {
  const lang = normalizeLanguage(language, DEFAULT_HELP_LANGUAGE);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] || value.en || value.es || fallback;
  }
  return value || fallback;
}

function getLocalizationCandidates(language) {
  return normalizeLanguage(language, DEFAULT_HELP_LANGUAGE) === "es"
    ? ["es", "es-ES", "es-419"]
    : ["en", "en-US", "en-GB"];
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
  const lang = normalizeLanguage(language, DEFAULT_HELP_LANGUAGE);
  const template = HELP_TEXT[lang]?.[key] || HELP_TEXT[DEFAULT_HELP_LANGUAGE]?.[key] || key;
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, token) =>
    Object.prototype.hasOwnProperty.call(vars, token) ? String(vars[token]) : ""
  );
}

function getCategoryLabel(categoryId, language = DEFAULT_HELP_LANGUAGE) {
  const meta = CATEGORY_META[categoryId];
  if (!meta) return titleCase(categoryId);
  return getLocalizedValue(meta.label, language, titleCase(categoryId));
}

function getAccessLabel(access, language = DEFAULT_HELP_LANGUAGE) {
  return getLocalizedValue(ACCESS_LABEL[access], language, titleCase(access || "public"));
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

function cleanHelpSentence(
  text,
  language = DEFAULT_HELP_LANGUAGE,
  fallback = helpText(language, "no_description")
) {
  const value = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!value) return fallback;
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function sameHelpText(a, b) {
  return normalizeCommandInput(String(a || "").replace(/\.$/, "")) === normalizeCommandInput(String(b || "").replace(/\.$/, ""));
}

function joinNaturalList(values, language = DEFAULT_HELP_LANGUAGE) {
  const list = values.filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  const andWord = helpText(language, "and_word");
  if (list.length === 2) return `${list[0]} ${andWord} ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, ${andWord} ${list[list.length - 1]}`;
}

function summarizeOptionLabel(option, language = DEFAULT_HELP_LANGUAGE) {
  const raw = String(resolveLocalizedDescription(option, language) || option?.name || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.:]$/, "");

  if (!raw) return titleCase(option?.name || "value").toLowerCase();
  return raw.charAt(0).toLowerCase() + raw.slice(1);
}

function buildOptionSentence(options = [], language = DEFAULT_HELP_LANGUAGE) {
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
    parts.push(`${helpText(language, "required_label")}: ${joinNaturalList(required, language)}.`);
  }

  if (optional.length) {
    parts.push(`${helpText(language, "optional_label")}: ${joinNaturalList(optional, language)}.`);
  }

  return parts.join(" ");
}

function getCommandOverview(command, language = DEFAULT_HELP_LANGUAGE) {
  const json = command.data.toJSON();
  return cleanHelpSentence(
    getLocalizedValue(COMMAND_OVERVIEWS[json.name], language, resolveLocalizedDescription(json, language)),
    language
  );
}

function getUsageDescription(command, context, language = DEFAULT_HELP_LANGUAGE) {
  const usageKey = normalizeUsageKey(context.pathTokens);
  const override = USAGE_OVERRIDES[usageKey];
  if (override) return cleanHelpSentence(getLocalizedValue(override, language), language);

  const json = command.data.toJSON();
  const sourceDescription =
    resolveLocalizedDescription(context.subcommand, language) ||
    resolveLocalizedDescription(context.group, language) ||
    resolveLocalizedDescription(json, language);
  const base = cleanHelpSentence(sourceDescription, language);
  const optionSentence = buildOptionSentence(context.options, language);

  return optionSentence ? `${base} ${optionSentence}` : base;
}

function buildUsageRow(command, context, language = DEFAULT_HELP_LANGUAGE) {
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

function buildQuickStartLines(audience, visibility, catalog, language = DEFAULT_HELP_LANGUAGE) {
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
    .map((entry) => `- \`${entry.usage}\` - ${getLocalizedValue(entry.note, language)}`);
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
      .setName("comando")
      .setDescription(helpText("en", "option_command_description"))
      .setDescriptionLocalizations({
        "en-US": helpText("en", "option_command_description"),
        "en-GB": helpText("en", "option_command_description"),
        "es-ES": helpText("es", "option_command_description"),
        "es-419": helpText("es", "option_command_description"),
      })
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
