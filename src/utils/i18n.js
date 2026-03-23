const SUPPORTED_LANGUAGES = new Set(["es", "en"]);

const MESSAGES = {
  es: {
    "access.owner_only": "Este comando es solo para el owner del bot.",
    "access.admin_required": "Necesitas permisos de administrador para usar este comando.",
    "access.staff_required": "Necesitas permisos de staff para usar este comando.",
    "access.guild_only": "Este comando solo se puede usar dentro de un servidor.",
    "access.default": "No tienes permisos para usar este comando.",

    "interaction.rate_limit.command":
      "Limite temporal para `/{{commandName}}`. Espera **{{retryAfterSec}}s** para reintentar.",
    "interaction.rate_limit.global":
      "Vas muy rapido. Espera **{{retryAfterSec}}s** antes de usar otra interaccion.",
    "interaction.command_disabled":
      "El comando `/{{commandName}}` esta deshabilitado en este servidor.",
    "interaction.db_unavailable":
      "Base de datos temporalmente no disponible. Intenta de nuevo en unos segundos.",
    "interaction.unexpected": "Ocurrio un error inesperado.",

    "setup.general.language_set": "Idioma del bot configurado: **{{label}}**.",
    "setup.general.language_label_es": "Español",
    "setup.general.language_label_en": "English",

    "ping.description": "Ver latencia y estadisticas del bot",
    "ping.title": "PONG!",
    "ping.field.latency": "Latencia del Bot",
    "ping.field.uptime": "Uptime",
    "ping.field.guilds": "Servidores",
    "ping.field.users": "Usuarios",
    "ping.field.channels": "Canales",
  },
  en: {
    "access.owner_only": "This command is only for the bot owner.",
    "access.admin_required": "You need administrator permissions to use this command.",
    "access.staff_required": "You need staff permissions to use this command.",
    "access.guild_only": "This command can only be used inside a server.",
    "access.default": "You do not have permission to use this command.",

    "interaction.rate_limit.command":
      "Temporary limit for `/{{commandName}}`. Wait **{{retryAfterSec}}s** before trying again.",
    "interaction.rate_limit.global":
      "You are going too fast. Wait **{{retryAfterSec}}s** before using another interaction.",
    "interaction.command_disabled":
      "The `/{{commandName}}` command is disabled in this server.",
    "interaction.db_unavailable":
      "Database is temporarily unavailable. Please try again in a few seconds.",
    "interaction.unexpected": "An unexpected error occurred.",

    "setup.general.language_set": "Bot language configured: **{{label}}**.",
    "setup.general.language_label_es": "Spanish",
    "setup.general.language_label_en": "English",

    "ping.description": "View bot latency and stats",
    "ping.title": "PONG!",
    "ping.field.latency": "Bot Latency",
    "ping.field.uptime": "Uptime",
    "ping.field.guilds": "Servers",
    "ping.field.users": "Users",
    "ping.field.channels": "Channels",
  },
};

function normalizeLanguage(value, fallback = "es") {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (SUPPORTED_LANGUAGES.has(normalized)) return normalized;
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("en")) return "en";
  return fallback;
}

function resolveInteractionLanguage(interaction, guildSettings = null, fallback = "es") {
  const configured = normalizeLanguage(guildSettings?.bot_language, "");
  if (configured) return configured;

  const candidates = [
    interaction?.locale,
    interaction?.guildLocale,
    interaction?.guild?.preferredLocale,
  ];

  for (const locale of candidates) {
    const resolved = normalizeLanguage(locale, "");
    if (resolved) return resolved;
  }

  return normalizeLanguage(fallback, "es");
}

function interpolate(template, vars = {}) {
  if (!template) return "";
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : ""
  );
}

function t(language, key, vars = {}) {
  const lang = normalizeLanguage(language, "es");
  const template =
    MESSAGES[lang]?.[key] ??
    MESSAGES.es[key] ??
    key;
  return interpolate(template, vars);
}

module.exports = {
  SUPPORTED_LANGUAGES,
  MESSAGES,
  normalizeLanguage,
  resolveInteractionLanguage,
  t,
};

