const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { loadAndValidateCommands } = require("../src/utils/commandLoader");
const { t } = require("../src/utils/i18n");

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
const ALLOWED_HELP_PSEUDO_TARGETS = new Set(["alpha", "staffops"]);

function sortStrings(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function collectHelpLocaleTargets(language) {
  const names = new Set();
  const usages = new Set();

  for (const [key, value] of Object.entries(require(`../src/locales/${language}.js`))) {
    if (typeof value !== "string") continue;

    if (key.startsWith("help.embed.overviews.")) {
      names.add(key.slice("help.embed.overviews.".length));
    }

    if (key.startsWith("help.embed.usages.")) {
      usages.add(key.slice("help.embed.usages.".length));
    }
  }

  return { names, usages };
}

test("command inventory keeps expected public/private scope and executable handlers", () => {
  const commandsBaseDir = path.resolve(__dirname, "..", "src", "commands");
  const { commands, validationErrors } = loadAndValidateCommands(commandsBaseDir);

  assert.deepEqual(validationErrors, []);
  assert.ok(commands.length >= EXPECTED_PUBLIC_COMMANDS.length + EXPECTED_PRIVATE_COMMANDS.length);

  for (const command of commands) {
    assert.equal(typeof command.execute, "function", `/${command.data.name} is missing execute()`);
  }

  const publicCommands = sortStrings(
    commands.filter((command) => !command.meta?.privateOnly).map((command) => command.data.name)
  );
  const privateCommands = sortStrings(
    commands.filter((command) => command.meta?.privateOnly).map((command) => command.data.name)
  );

  assert.deepEqual(publicCommands, sortStrings(EXPECTED_PUBLIC_COMMANDS));
  assert.deepEqual(privateCommands, sortStrings(EXPECTED_PRIVATE_COMMANDS));
});

test("help locale catalog only references real commands or known subcommand entries", () => {
  const commandsBaseDir = path.resolve(__dirname, "..", "src", "commands");
  const { commands } = loadAndValidateCommands(commandsBaseDir);
  const commandNames = new Set(commands.map((command) => command.data.name));

  for (const language of ["en", "es"]) {
    const { names, usages } = collectHelpLocaleTargets(language);

    for (const name of names) {
      assert.ok(
        commandNames.has(name) || ALLOWED_HELP_PSEUDO_TARGETS.has(name),
        `Unknown help overview target '${name}' in ${language}.js`
      );
    }

    for (const usage of usages) {
      const baseName = usage.split("_")[0];
      assert.ok(
        commandNames.has(baseName) || ALLOWED_HELP_PSEUDO_TARGETS.has(baseName),
        `Unknown help usage target '${usage}' in ${language}.js`
      );
    }
  }
});

test("critical readiness locale keys resolve in both english and spanish", () => {
  const keys = [
    "interaction.unexpected",
    "premium.slash.description",
    "premium.slash.status",
    "setup.automod.status_title",
    "config.category.list_title",
    "center.actions.panel_published",
    "tickets.panel.published_title",
    "staff.only_staff",
    "leveling.rank.title",
    "events.messageDelete.title",
    "daily_sla_report.title",
    "transcript.title",
    "case_brief.title",
    "health_monitor.ping_high_title",
  ];

  for (const key of keys) {
    assert.notEqual(t("en", key), key, `Missing EN locale key: ${key}`);
    assert.notEqual(t("es", key), key, `Missing ES locale key: ${key}`);
  }
});
