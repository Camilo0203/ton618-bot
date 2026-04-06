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

function localeMapFromTexts(en, es) {
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

function withNameLocalizations(builder, key) {
  if (builder?.setNameLocalizations) {
    builder.setNameLocalizations(localeMapFromKey(key));
  }
  return builder;
}

function withInlineDescriptionLocalizations(builder, en, es) {
  if (builder?.setDescriptionLocalizations) {
    builder.setDescriptionLocalizations(localeMapFromTexts(en, es));
  }
  return builder;
}

function withInlineNameLocalizations(builder, en, es) {
  if (builder?.setNameLocalizations) {
    builder.setNameLocalizations(localeMapFromTexts(en, es));
  }
  return builder;
}

function withLocalizations(builder, descKey, nameKey = null) {
  withDescriptionLocalizations(builder, descKey);
  if (nameKey) {
    withNameLocalizations(builder, nameKey);
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

/**
 * Automatically localize option name if it exists in common.options
 * @param {Object} option - The option builder (e.g., SlashCommandStringOption)
 * @returns {Object} The option builder with name localizations applied
 */
function withOptionNameLocalizations(option) {
  if (!option || typeof option.data?.name !== 'string') {
    return option;
  }
  
  const optionName = option.data.name;
  const nameKey = `common.options.${optionName}`;
  
  // Check if the key exists in the locale
  const enName = t("en", nameKey);
  const esName = t("es", nameKey);
  
  // Only apply if the translation exists (not the key itself)
  if (enName !== nameKey && esName !== nameKey) {
    option.setNameLocalizations({
      "es-ES": esName,
      "es-419": esName,
    });
  }
  
  return option;
}

/**
 * Automatically localize option description based on command and option path
 * @param {Object} option - The option builder
 * @param {string} commandName - The command name (e.g., "setup", "config")
 * @param {string} optionPath - The full path to the option (e.g., "setup_tickets_panel_publish-panel")
 * @returns {Object} The option builder with description localizations applied
 */
function withOptionDescriptionLocalizations(option, commandName, optionPath) {
  if (!option || !commandName || !optionPath) {
    return option;
  }
  
  const optionName = option.data?.name;
  if (!optionName) {
    return option;
  }
  
  // Construct the i18n key: commandName.options.path_optionName
  const key = `${commandName}.options.${optionPath}_${optionName}`;
  
  // Check if the key exists
  const enDesc = t("en", key);
  const esDesc = t("es", key);
  
  // Only apply if the translation exists (not the key itself)
  if (enDesc !== key && esDesc !== key && option.setDescriptionLocalizations) {
    option.setDescriptionLocalizations({
      "es-ES": esDesc,
      "es-419": esDesc,
    });
  }
  
  return option;
}

module.exports = {
  localeMapFromKey,
  localeMapFromTexts,
  withDescriptionLocalizations,
  withNameLocalizations,
  withInlineDescriptionLocalizations,
  withInlineNameLocalizations,
  withLocalizations,
  localizedChoice,
  withOptionNameLocalizations,
  withOptionDescriptionLocalizations,
};
