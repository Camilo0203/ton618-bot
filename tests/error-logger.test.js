const test = require("node:test");
const assert = require("node:assert/strict");
const fsPromises = require("fs/promises");
const os = require("os");
const path = require("path");

const { logError } = require("../src/utils/database");
const { resolveErrorLogFile } = require("../src/utils/errorLogger");

async function withTempLogEnv(overrides, fn) {
  const prevDir = process.env.ERROR_LOG_DIR;
  const prevEnabled = process.env.ERROR_LOG_TO_FILE;
  const tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), "ton618-error-log-"));

  process.env.ERROR_LOG_DIR = tempDir;
  if (overrides.ERROR_LOG_TO_FILE !== undefined) {
    process.env.ERROR_LOG_TO_FILE = overrides.ERROR_LOG_TO_FILE;
  } else {
    delete process.env.ERROR_LOG_TO_FILE;
  }

  try {
    await fn(tempDir);
  } finally {
    if (prevDir === undefined) delete process.env.ERROR_LOG_DIR;
    else process.env.ERROR_LOG_DIR = prevDir;

    if (prevEnabled === undefined) delete process.env.ERROR_LOG_TO_FILE;
    else process.env.ERROR_LOG_TO_FILE = prevEnabled;

    await fsPromises.rm(tempDir, { recursive: true, force: true });
  }
}

test("logError escribe entrada JSONL cuando ERROR_LOG_TO_FILE esta habilitado", async () => {
  await withTempLogEnv({ ERROR_LOG_TO_FILE: "true" }, async () => {
    const marker = `test.error_logger.enabled.${Date.now()}`;
    await logError(marker, new Error("boom-enabled"), { probe: "ok" });

    const logFile = resolveErrorLogFile(new Date());
    const content = await fsPromises.readFile(logFile, "utf8");
    const entries = content
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line));

    const found = entries.find((entry) => entry.context === marker);
    assert.ok(found);
    assert.equal(found.message, "boom-enabled");
    assert.equal(found.probe, "ok");
  });
});

test("logError no escribe archivo cuando ERROR_LOG_TO_FILE esta deshabilitado", async () => {
  await withTempLogEnv({ ERROR_LOG_TO_FILE: "false" }, async () => {
    const marker = `test.error_logger.disabled.${Date.now()}`;
    await logError(marker, new Error("boom-disabled"), { probe: "off" });

    const logFile = resolveErrorLogFile(new Date());
    const exists = await fsPromises.access(logFile).then(() => true).catch(() => false);
    assert.equal(exists, false);
  });
});
