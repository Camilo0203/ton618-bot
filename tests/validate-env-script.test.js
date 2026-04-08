const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const scriptPath = path.join(projectRoot, "scripts", "validate-env.js");

test("validate-env --file no usa process.env para ocultar faltantes del archivo", (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ton618-env-check-"));
  const filePath = path.join(tempDir, ".env.production.example");

  t.after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  fs.writeFileSync(filePath, [
    `DISCORD_TOKEN=${"x".repeat(60)}`,
    "MONGO_URI=mongodb://localhost:27017/ton618_bot",
    "NODE_ENV=production",
  ].join("\n"));

  let thrown = null;
  try {
    execFileSync(
      process.execPath,
      [scriptPath, `--file=${filePath}`],
      {
        cwd: projectRoot,
        env: {
          ...process.env,
          OWNER_ID: "123456789012345678",
        },
        stdio: "pipe",
      }
    );
  } catch (error) {
    thrown = error;
  }

  assert.ok(thrown, "expected validate-env.js to fail");
  const output = `${String(thrown.stdout || "")}\n${String(thrown.stderr || "")}`;
  assert.match(output, /OWNER_ID/);
});

test("validate-env sin --file carga .env del directorio actual", (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ton618-env-default-check-"));
  const filePath = path.join(tempDir, ".env");

  t.after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  fs.writeFileSync(filePath, [
    `DISCORD_TOKEN=${"x".repeat(60)}`,
    "MONGO_URI=mongodb://localhost:27017/ton618_bot",
    "OWNER_ID=123456789012345678",
    "NODE_ENV=production",
  ].join("\n"));

  let thrown = null;
  try {
    execFileSync(
      process.execPath,
      [scriptPath],
      {
        cwd: tempDir,
        env: {
          ...process.env,
          BOT_API_KEY: "",
        },
        stdio: "pipe",
      }
    );
  } catch (error) {
    thrown = error;
  }

  assert.ok(thrown, "expected validate-env.js to fail");
  const output = `${String(thrown.stdout || "")}\n${String(thrown.stderr || "")}`;
  assert.match(output, /BOT_API_KEY/);
});
