const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { resolveCommandFileFlags } = require("../src/utils/commandFeatureFlags");
const { loadCommands } = require("../src/utils/commandLoader");

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
