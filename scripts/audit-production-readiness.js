"use strict";

const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { t } = require("../src/utils/i18n");
const { loadAndValidateCommands } = require("../src/utils/commandLoader");

const EXPECTED_PUBLIC_COMMANDS = [
  "audit",
  "autorole",
  "config",
  "embed",
  "giveaway",
  "help",
  "level",
  "mod",
  "modlogs",
  "poll",
  "premium",
  "profile",
  "serverstats",
  "setup",
  "staff",
  "stats",
  "suggest",
  "ticket",
  "verify",
  "warn",
];

const EXPECTED_PRIVATE_COMMANDS = ["debug", "ping"];

const CRITICAL_RUNTIME_KEYS = [
  "common.labels.onboarding_status",
  "common.labels.last_updated",
  "interaction.unexpected",
  "premium.guild_only",
  "premium.owner_only",
  "premium.error_fetching",
  "premium.error_generic",
  "premium.status_title",
  "premium.pro_active",
  "premium.free_plan",
  "premium.plan_label",
  "premium.status_label",
  "premium.time_remaining",
  "premium.started_at",
  "premium.expires_at",
  "premium.source_label",
  "premium.supporter_status",
  "premium.supporter_active",
  "premium.active",
  "premium.upgrade_label",
  "premium.upgrade_cta",
  "premium.slash.description",
  "premium.slash.status",
  "stats.no_sla_threshold",
  "stats.not_configured",
  "stats.period_all",
  "stats.period_month",
  "stats.period_week",
  "stats.ratings_title",
  "stats.ratings_empty",
  "stats.fallback_user",
  "stats.fallback_staff",
  "stats.staff_no_data_title",
  "stats.staff_no_data_description",
  "support_server.restricted",
];

function sortStrings(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function diffList(actual, expected) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  return {
    missing: expected.filter((item) => !actualSet.has(item)),
    unexpected: actual.filter((item) => !expectedSet.has(item)),
  };
}

function validateCriticalRuntimeKeys() {
  const issues = [];

  for (const key of CRITICAL_RUNTIME_KEYS) {
    const en = t("en", key);
    const es = t("es", key);
    if (en === key) issues.push(`missing en locale key: ${key}`);
    if (es === key) issues.push(`missing es locale key: ${key}`);
  }

  return issues;
}

function walkSlashOptions(option, pathTokens, issues) {
  const currentPath = [...pathTokens, option.name].join(" > ");

  if (option.type !== 1 && option.type !== 2) {
    if (!option.description_localizations?.["es-ES"]) {
      issues.push(`missing es slash localization: ${currentPath}`);
    }
  }

  for (const child of option.options || []) {
    walkSlashOptions(child, [...pathTokens, option.name], issues);
  }
}

function validateSlashLocalizations(commands) {
  const issues = [];

  for (const command of commands) {
    const json = command.data.toJSON();
    if (!json.description_localizations?.["es-ES"]) {
      issues.push(`missing es command description: /${json.name}`);
    }

    for (const option of json.options || []) {
      walkSlashOptions(option, [json.name], issues);
    }
  }

  return issues;
}

function validateHelpKeys(srcDir, allCommandNames) {
  const issues = [];
  const localeFiles = [
    path.join(srcDir, "locales", "en.js"),
    path.join(srcDir, "locales", "es.js"),
  ];

  const overviewPattern = /"help\.embed\.overviews\.([^"]+)"/g;
  const usagePattern = /"help\.embed\.usages\.([^"]+)"/g;

  for (const file of localeFiles) {
    const source = fs.readFileSync(file, "utf8");

    for (const match of source.matchAll(overviewPattern)) {
      const commandName = match[1];
      if (!allCommandNames.has(commandName)) {
        issues.push(`help overview points to missing command '${commandName}' in ${path.basename(file)}`);
      }
    }

    for (const match of source.matchAll(usagePattern)) {
      const usageKey = match[1];
      const commandName = usageKey.split("_")[0];
      if (!allCommandNames.has(commandName)) {
        issues.push(`help usage points to missing command '${usageKey}' in ${path.basename(file)}`);
      }
    }
  }

  return issues;
}

function main() {
  const commandsBaseDir = path.resolve(__dirname, "..", "src", "commands");
  const { commands, validationErrors } = loadAndValidateCommands(commandsBaseDir);
  const issues = [...validationErrors];

  for (const command of commands) {
    if (typeof command.execute !== "function") {
      issues.push(`missing execute() for /${command?.data?.name || "unknown"}`);
    }
  }

  const publicCommands = sortStrings(
    commands.filter((command) => !command.meta?.privateOnly).map((command) => command.data.name)
  );
  const privateCommands = sortStrings(
    commands.filter((command) => command.meta?.privateOnly).map((command) => command.data.name)
  );

  const publicDiff = diffList(publicCommands, sortStrings(EXPECTED_PUBLIC_COMMANDS));
  const privateDiff = diffList(privateCommands, sortStrings(EXPECTED_PRIVATE_COMMANDS));

  issues.push(...publicDiff.missing.map((name) => `expected public command missing: ${name}`));
  issues.push(...publicDiff.unexpected.map((name) => `unexpected public command detected: ${name}`));
  issues.push(...privateDiff.missing.map((name) => `expected private command missing: ${name}`));
  issues.push(...privateDiff.unexpected.map((name) => `unexpected private command detected: ${name}`));

  issues.push(...validateSlashLocalizations(commands));
  issues.push(...validateCriticalRuntimeKeys());
  issues.push(...validateHelpKeys(path.resolve(__dirname, "..", "src"), new Set(commands.map((command) => command.data.name))));

  const summary = {
    publicCommands,
    privateCommands,
    issues,
  };

  if (issues.length) {
    console.error(JSON.stringify(summary, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
