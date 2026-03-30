"use strict";

const { t } = require("./i18n");

function localeMapFromKey(key) {
  const en = t("en", key);
  const es = t("es", key);

  return {
    "en-US": en,
    "en-GB": en,
    "es-ES": es,
    "es-419": es,
  };
}

function withDescriptionLocalizations(builder, key) {
  if (builder?.setDescriptionLocalizations) {
    builder.setDescriptionLocalizations(localeMapFromKey(key));
  }
  return builder;
}

function localizedChoice(value, key) {
  return {
    name: t("en", key),
    value,
    name_localizations: localeMapFromKey(key),
  };
}

module.exports = {
  localeMapFromKey,
  withDescriptionLocalizations,
  localizedChoice,
};
