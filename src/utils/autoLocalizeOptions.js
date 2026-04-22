"use strict";

function withBilingualDescriptionLocalizations(node) {
  if (!node || typeof node !== "object") return;
  if (typeof node.description !== "string" || !node.description.trim()) return;

  const description = node.description.trim();
  const existing = node.description_localizations || {};

  node.description_localizations = {
    "en-US": existing["en-US"] || description,
    "en-GB": existing["en-GB"] || description,
    "es-ES": existing["es-ES"] || description,
    "es-419": existing["es-419"] || description,
    ...existing,
  };
}

function withBilingualChoiceLocalizations(choice) {
  if (!choice || typeof choice !== "object") return;
  if (typeof choice.name !== "string" || !choice.name.trim()) return;

  const name = choice.name.trim();
  const existing = choice.name_localizations || {};

  choice.name_localizations = {
    "en-US": existing["en-US"] || name,
    "en-GB": existing["en-GB"] || name,
    "es-ES": existing["es-ES"] || name,
    "es-419": existing["es-419"] || name,
    ...existing,
  };
}

function localizeOptionTree(options) {
  if (!Array.isArray(options)) return;

  for (const option of options) {
    withBilingualDescriptionLocalizations(option);

    if (Array.isArray(option.choices)) {
      for (const choice of option.choices) {
        withBilingualChoiceLocalizations(choice);
      }
    }

    if (Array.isArray(option.options)) {
      localizeOptionTree(option.options);
    }
  }
}

function autoLocalizeCommandOptions(commandData) {
  if (!commandData || typeof commandData !== "object") {
    return commandData;
  }

  withBilingualDescriptionLocalizations(commandData);
  localizeOptionTree(commandData.options);
  return commandData;
}

function autoLocalizeCommandData(data) {
  if (!data || typeof data.toJSON !== "function") return null;
  const json = data.toJSON();
  return autoLocalizeCommandOptions(json);
}

function autoLocalizeAllCommands(commands) {
  if (!Array.isArray(commands)) return [];
  return commands
    .map((cmd) => autoLocalizeCommandData(cmd?.data))
    .filter(Boolean);
}

module.exports = {
  autoLocalizeCommandData,
  autoLocalizeCommandOptions,
  autoLocalizeAllCommands,
};
