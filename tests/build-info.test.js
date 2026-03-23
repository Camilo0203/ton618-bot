const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { getBuildInfo, __test } = require("../src/utils/buildInfo");

const tempDirs = [];

function createTempRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ton618-build-info-"));
  tempDirs.push(dir);
  return dir;
}

test.afterEach(() => {
  __test.resetCache();
});

test.after(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("getBuildInfo usa overrides de entorno para commit y tag", () => {
  const repoRoot = createTempRepo();
  fs.writeFileSync(path.join(repoRoot, "package.json"), JSON.stringify({ version: "9.9.9" }));

  const info = getBuildInfo({
    repoRoot,
    env: {
      DEPLOY_COMMIT: "abcdef1234567890abcdef1234567890abcdef12",
      DEPLOY_TAG: "holy-test-1",
    },
  });

  assert.equal(info.version, "9.9.9");
  assert.equal(info.shortCommit, "abcdef1");
  assert.equal(info.deployTag, "holy-test-1");
  assert.equal(info.commitSource, "env");
  assert.match(info.fingerprint, /holy-test-1/);
});

test("getBuildInfo resuelve commit desde .git/HEAD y refs", () => {
  const repoRoot = createTempRepo();
  const gitDir = path.join(repoRoot, ".git");

  fs.writeFileSync(path.join(repoRoot, "package.json"), JSON.stringify({ version: "1.2.3" }));
  fs.mkdirSync(path.join(gitDir, "refs", "heads"), { recursive: true });
  fs.writeFileSync(path.join(gitDir, "HEAD"), "ref: refs/heads/main\n");
  fs.writeFileSync(
    path.join(gitDir, "refs", "heads", "main"),
    "1234567890abcdef1234567890abcdef12345678\n"
  );

  const info = getBuildInfo({ repoRoot, env: {} });

  assert.equal(info.version, "1.2.3");
  assert.equal(info.shortCommit, "1234567");
  assert.equal(info.commitSource, "git_ref");
  assert.match(info.fingerprint, /^v1\.2\.3 \| 1234567$/);
});
