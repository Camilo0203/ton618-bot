"use strict";

const path = require("node:path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { loadAndValidateCommands } = require("../src/utils/commandLoader");
const { autoLocalizeCommandData } = require("../src/utils/autoLocalizeOptions");

const REQUIRED_DESCRIPTION_LOCALES = ["en-US", "en-GB", "es-ES", "es-419"];
const REQUIRED_CHOICE_NAME_LOCALES = ["en-US", "en-GB", "es-ES", "es-419"];

function hasLocales(target, requiredLocales, key) {
  if (!target || typeof target !== "object") return false;
  const localizations = target[key];
  if (!localizations || typeof localizations !== "object") return false;
  return requiredLocales.every((locale) => typeof localizations[locale] === "string");
}

function auditOptionTree(options, commandName, findings, counters) {
  if (!Array.isArray(options)) return;

  for (const option of options) {
    const label = `/${commandName} > ${option.name}`;
    counters.options += 1;

    if (!hasLocales(option, REQUIRED_DESCRIPTION_LOCALES, "description_localizations")) {
      findings.push(`[MISSING_OPTION_LOCALES] ${label}`);
    } else {
      counters.localizedOptions += 1;
    }

    if (Array.isArray(option.choices)) {
      for (const choice of option.choices) {
        counters.choices += 1;
        const choiceLabel = `${label} > choice:${choice.name}`;
        if (!hasLocales(choice, REQUIRED_CHOICE_NAME_LOCALES, "name_localizations")) {
          findings.push(`[MISSING_CHOICE_LOCALES] ${choiceLabel}`);
        } else {
          counters.localizedChoices += 1;
        }
      }
    }

    if (Array.isArray(option.options)) {
      auditOptionTree(option.options, commandName, findings, counters);
    }
  }
}

function main() {
  const commandsBaseDir = path.resolve(__dirname, "..", "src", "commands");
  const { commands, validationErrors } = loadAndValidateCommands(commandsBaseDir);

  if (validationErrors.length) {
    console.error("Command validation errors:");
    for (const error of validationErrors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  const findings = [];
  const counters = {
    commands: 0,
    localizedCommands: 0,
    options: 0,
    localizedOptions: 0,
    choices: 0,
    localizedChoices: 0,
  };

  for (const command of commands) {
    const json = autoLocalizeCommandData(command.data);
    if (!json) {
      findings.push(`[INVALID_COMMAND_DATA] ${(command?.data?.name || "unknown")}`);
      continue;
    }

    counters.commands += 1;
    if (!hasLocales(json, REQUIRED_DESCRIPTION_LOCALES, "description_localizations")) {
      findings.push(`[MISSING_COMMAND_LOCALES] /${json.name}`);
    } else {
      counters.localizedCommands += 1;
    }

    auditOptionTree(json.options, json.name, findings, counters);
  }

  const report = {
    totals: counters,
    coverage: {
      commands: `${counters.localizedCommands}/${counters.commands}`,
      options: `${counters.localizedOptions}/${counters.options}`,
      choices: `${counters.localizedChoices}/${counters.choices}`,
    },
    findings,
  };

  console.log(JSON.stringify(report, null, 2));

  if (findings.length > 0) {
    process.exit(1);
  }
}

main();
