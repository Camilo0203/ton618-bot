const { logStructured } = require("./observability");
const en = require("../locales/en");
const es = require("../locales/es");

const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = new Set(["es", "en"]);
const MESSAGES = { en, es };

function normalizeLanguage(value, fallback = DEFAULT_LANGUAGE) {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (SUPPORTED_LANGUAGES.has(normalized)) return normalized;
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("en")) return "en";
  return fallback;
}

function getByPath(source, path) {
  if (!source || !path) return undefined;

  return String(path)
    .split(".")
    .reduce((current, segment) => {
      if (current === undefined || current === null) return undefined;
      return current[segment];
    }, source);
}

function resolveInteractionLanguage(
  interaction,
  guildSettings = null,
  fallback = DEFAULT_LANGUAGE
) {
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

  return normalizeLanguage(fallback, DEFAULT_LANGUAGE);
}

function resolveGuildLanguage(guildSettings = null, fallback = DEFAULT_LANGUAGE) {
  return normalizeLanguage(guildSettings?.bot_language, fallback);
}

function interpolate(template, vars = {}) {
  if (!template) return "";

  return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : ""
  );
}

function t(language, key, vars = {}) {
  const lang = normalizeLanguage(language, DEFAULT_LANGUAGE);
  const template =
    getByPath(MESSAGES[lang], key) ??
    getByPath(MESSAGES[DEFAULT_LANGUAGE], key);

  if (template === undefined) {
    logStructured("warn", "i18n.lookup_failure", {
      language: lang,
      key,
    });
    return interpolate(key, vars);
  }

  return interpolate(template, vars);
}

function createTranslator(language) {
  const lang = normalizeLanguage(language, DEFAULT_LANGUAGE);
  return {
    language: lang,
    t: (key, vars = {}) => t(lang, key, vars),
  };
}

module.exports = {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  MESSAGES,
  normalizeLanguage,
  resolveInteractionLanguage,
  resolveGuildLanguage,
  createTranslator,
  t,
};
