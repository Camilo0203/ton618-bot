"use strict";

const { t } = require("./i18n");

/**
 * Automatically apply description localizations to options only
 * Commands and subcommands already have localizations via withDescriptionLocalizations
 * @param {Object} commandData - The command data object (from .toJSON())
 * @param {string} commandName - The command name
 * @returns {Object} The command data with localized option descriptions
 */
function autoLocalizeCommandOptions(commandData, commandName) {
  if (!commandData || !commandName) {
    return commandData;
  }

  function processOptions(options, pathPrefix = commandName) {
    if (!options || !Array.isArray(options)) {
      return;
    }

    options.forEach(opt => {
      const currentPath = `${pathPrefix}_${opt.name}`;

      // Si es un subcomando o grupo, procesar sus opciones recursivamente
      if (opt.type === 1 || opt.type === 2) {
        // Los subcomandos ya tienen sus descripciones localizadas via withDescriptionLocalizations
        // Solo procesar sus opciones
        if (opt.options) {
          processOptions(opt.options, currentPath);
        }
      } else {
        // Es una opción real (string, user, channel, etc.)
        const i18nKey = `${commandName}.options.${currentPath}_${opt.name}`;
        
        // Intentar obtener la traducción
        const esDesc = t("es", i18nKey);
        
        // Solo aplicar si la traducción existe (no es la clave misma)
        if (esDesc && esDesc !== i18nKey) {
          if (!opt.description_localizations) {
            opt.description_localizations = {};
          }
          opt.description_localizations["es-ES"] = esDesc;
          opt.description_localizations["es-419"] = esDesc;
        }
      }
    });
  }

  // Procesar todas las opciones del comando
  if (commandData.options) {
    processOptions(commandData.options);
  }

  return commandData;
}

/**
 * Apply auto-localization to all commands
 * @param {Array} commands - Array of command objects with .data property
 * @returns {Array} Commands with localized options
 */
function autoLocalizeAllCommands(commands) {
  return commands.map(cmd => {
    if (cmd.data && typeof cmd.data.toJSON === 'function') {
      const json = cmd.data.toJSON();
      const localized = autoLocalizeCommandOptions(json, json.name);
      
      // Actualizar el objeto data con las localizaciones
      if (cmd.data.options) {
        applyLocalizationsToBuilder(cmd.data, localized);
      }
    }
    return cmd;
  });
}

/**
 * Apply localizations from JSON back to the builder
 * @param {Object} builder - The SlashCommandBuilder
 * @param {Object} jsonData - The localized JSON data
 */
function applyLocalizationsToBuilder(builder, jsonData) {
  if (!builder.options || !jsonData.options) {
    return;
  }

  function applyToOptions(builderOptions, jsonOptions) {
    if (!builderOptions || !jsonOptions) {
      return;
    }

    builderOptions.forEach((builderOpt, index) => {
      const jsonOpt = jsonOptions[index];
      if (!jsonOpt) {
        return;
      }

      // Aplicar localizaciones de descripción si existen
      if (jsonOpt.description_localizations && builderOpt.setDescriptionLocalizations) {
        builderOpt.setDescriptionLocalizations(jsonOpt.description_localizations);
      }

      // Si tiene sub-opciones, aplicar recursivamente
      if (builderOpt.options && jsonOpt.options) {
        applyToOptions(builderOpt.options, jsonOpt.options);
      }
    });
  }

  applyToOptions(builder.options, jsonData.options);
}

module.exports = {
  autoLocalizeCommandOptions,
  autoLocalizeAllCommands,
};
