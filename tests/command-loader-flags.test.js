const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { resolveCommandFileFlags } = require("../src/utils/commandFeatureFlags");
const { loadCommands, loadAndValidateCommands } = require("../src/utils/commandLoader");

function createCommandFile(baseDir, relativePath, commandName) {
  const fullPath = path.join(baseDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(
    fullPath,
    `module.exports = {
  data: { name: "${commandName}" },
  async execute() {}
};
`,
    "utf8"
  );
}

test("resolveCommandFileFlags respeta overrides por env", () => {
  const flags = resolveCommandFileFlags({
    COMMANDS_ENABLED_FILES: "public/utility/ping.js",
    COMMANDS_DISABLED_FILES: "admin/config/setup.js",
  });

  assert.equal(flags.disabledFiles.has("public/utility/ping.js"), false);
  assert.equal(flags.disabledFiles.has("admin/config/setup.js"), true);
});

test("resolveCommandFileFlags deja ping habilitado por defecto", () => {
  const flags = resolveCommandFileFlags({});
  assert.equal(flags.disabledFiles.has("public/utility/ping.js"), false);
  assert.equal(flags.disabledFiles.has("public/utility/suggest.js"), true);
});

test("loadCommands respeta disabledFiles inyectado", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ton618-cmd-loader-"));
  try {
    createCommandFile(tempRoot, "public/utility/ping.js", "ping");
    createCommandFile(tempRoot, "admin/config/setup.js", "setup");

    const commands = loadCommands(tempRoot, {
      disabledFiles: new Set(["public/utility/ping.js"]),
    });

    const names = commands.map((cmd) => cmd.data.name).sort();
    assert.deepEqual(names, ["setup"]);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("loadAndValidateCommands on real command tree has no duplicate names after English-first updates", () => {
  const commandsBaseDir = path.join(__dirname, "..", "src", "commands");
  const { commands, validationErrors } = loadAndValidateCommands(commandsBaseDir, { env: {} });

  const duplicateErrors = validationErrors.filter((error) => error.includes("Nombre duplicado"));
  assert.deepEqual(duplicateErrors, []);

  const commandNames = commands.map((command) => command.data.name);
  for (const requiredName of ["ticket", "staff", "stats", "setup", "config", "audit", "verify", "debug"]) {
    assert.equal(commandNames.includes(requiredName), true);
  }

  const configJson = commands.find((command) => command.data.name === "config").data.toJSON();
  const setupJson = commands.find((command) => command.data.name === "setup").data.toJSON();
  const verifyJson = commands.find((command) => command.data.name === "verify").data.toJSON();
  const debugJson = commands.find((command) => command.data.name === "debug").data.toJSON();

  assert.equal(configJson.options.some((option) => option.name === "status"), true);
  assert.equal(configJson.options.some((option) => option.name === "center"), true);
  assert.equal(configJson.options.some((option) => option.name === "tickets"), true);
  assert.equal(setupJson.options.some((option) => option.name === "automod"), true);

  assert.equal(verifyJson.options.some((option) => option.name === "enabled"), true);
  assert.equal(verifyJson.options.some((option) => option.name === "mode"), true);
  assert.equal(verifyJson.options.some((option) => option.name === "question"), true);
  assert.equal(verifyJson.options.some((option) => option.name === "force"), true);
  assert.equal(debugJson.options.some((option) => option.name === "automod-badge"), true);
});
