"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { logStructured } = require("./observability");

const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = new Set(["es", "en"]);
const LOCALE_PATHS = {
  en: path.join(__dirname, "../locales/en.js"),
  es: path.join(__dirname, "../locales/es.js"),
};

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function deepMerge(target, source) {
  const output = { ...(isPlainObject(target) ? target : {}) };

  for (const [key, value] of Object.entries(source || {})) {
    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = deepMerge(output[key], value);
      continue;
    }

    output[key] = value;
  }

  return output;
}

function evaluateLocaleValue(rawValue, filename) {
  return vm.runInNewContext(`(${rawValue})`, {}, {
    filename,
    timeout: 1000,
  });
}

function loadLocale(language) {
  const filename = LOCALE_PATHS[language];
  const fallback = require(`../locales/${language}`);

  try {
    const source = fs.readFileSync(filename, "utf8");
    const exportIndex = source.indexOf("module.exports");
    const objectStart = source.indexOf("{", exportIndex);
    const objectEnd = source.lastIndexOf("};");

    if (exportIndex === -1 || objectStart === -1 || objectEnd === -1) {
      return fallback;
    }

    const body = source.slice(objectStart + 1, objectEnd);
    const entryPattern = /^  "([^"]+)": /gm;
    const matches = Array.from(body.matchAll(entryPattern));

    if (matches.length === 0) {
      return fallback;
    }

    const merged = {};

    for (let index = 0; index < matches.length; index += 1) {
      const match = matches[index];
      const key = match[1];
      const valueStart = match.index + match[0].length;
      const valueEnd = index + 1 < matches.length ? matches[index + 1].index : body.length;
      let rawValue = body.slice(valueStart, valueEnd).trim();

      if (rawValue.endsWith(",")) {
        rawValue = rawValue.slice(0, -1).trimEnd();
      }

      const value = evaluateLocaleValue(rawValue, filename);
      if (isPlainObject(merged[key]) && isPlainObject(value)) {
        merged[key] = deepMerge(merged[key], value);
        continue;
      }

      merged[key] = value;
    }

    return merged;
  } catch (error) {
    logStructured("error", "i18n.locale_load_failed", {
      language,
      error: error?.message || String(error),
    });
    return fallback;
  }
}

const MESSAGES = {
  en: loadLocale("en"),
  es: loadLocale("es"),
};

function normalizeLanguage(value, fallback = DEFAULT_LANGUAGE) {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (SUPPORTED_LANGUAGES.has(normalized)) return normalized;
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("en")) return "en";
  return fallback;
}

function getByPath(source, pathValue) {
  if (!source || !pathValue) return undefined;

  return String(pathValue)
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
