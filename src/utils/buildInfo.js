const fs = require("fs");
const path = require("path");

const DEFAULT_ROOT = path.resolve(__dirname, "..", "..");
let cachedBuildInfo = null;

function readTextSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch {
    return null;
  }
}

function getGitDir(repoRoot) {
  const dotGitPath = path.join(repoRoot, ".git");
  try {
    const stat = fs.statSync(dotGitPath);
    if (stat.isDirectory()) return dotGitPath;
    if (stat.isFile()) {
      const fileContents = readTextSafe(dotGitPath);
      const match = /^gitdir:\s*(.+)$/im.exec(fileContents || "");
      if (match?.[1]) {
        return path.resolve(repoRoot, match[1].trim());
      }
    }
  } catch {}

  return null;
}

function readPackedRef(gitDir, refName) {
  const packedRefs = readTextSafe(path.join(gitDir, "packed-refs"));
  if (!packedRefs) return null;

  for (const line of packedRefs.split(/\r?\n/)) {
    if (!line || line.startsWith("#") || line.startsWith("^")) continue;
    const [sha, ref] = line.split(" ");
    if (ref === refName && /^[0-9a-f]{40}$/i.test(sha || "")) {
      return sha;
    }
  }

  return null;
}

function resolveGitCommit(repoRoot) {
  const gitDir = getGitDir(repoRoot);
  if (!gitDir) return { commit: null, source: "none" };

  const headValue = readTextSafe(path.join(gitDir, "HEAD"));
  if (!headValue) return { commit: null, source: "git_head_missing" };

  if (/^[0-9a-f]{40}$/i.test(headValue)) {
    return { commit: headValue, source: "git_head_detached" };
  }

  const match = /^ref:\s*(.+)$/i.exec(headValue);
  if (!match?.[1]) {
    return { commit: null, source: "git_head_invalid" };
  }

  const refName = match[1].trim();
  const refPath = path.join(gitDir, refName.split("/").join(path.sep));
  const directCommit = readTextSafe(refPath);
  if (directCommit && /^[0-9a-f]{40}$/i.test(directCommit)) {
    return { commit: directCommit, source: "git_ref" };
  }

  const packedCommit = readPackedRef(gitDir, refName);
  if (packedCommit) {
    return { commit: packedCommit, source: "git_packed_refs" };
  }

  return { commit: null, source: "git_ref_missing" };
}

function readPackageVersion(repoRoot) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
    return String(packageJson.version || "0.0.0");
  } catch {
    return "0.0.0";
  }
}

function buildFingerprint(version, shortCommit, deployTag) {
  return [`v${version}`, shortCommit || "no-commit", deployTag || null]
    .filter(Boolean)
    .join(" | ");
}

function resolveBuildInfo(options = {}) {
  const repoRoot = options.repoRoot || DEFAULT_ROOT;
  const env = options.env || process.env;
  const version = readPackageVersion(repoRoot);

  const envCommit = String(
    env.DEPLOY_COMMIT || env.GIT_COMMIT || env.COMMIT_SHA || env.SOURCE_COMMIT || ""
  ).trim() || null;

  const gitCommit = envCommit ? null : resolveGitCommit(repoRoot);
  const commit = envCommit || gitCommit?.commit || null;
  const commitSource = envCommit ? "env" : gitCommit?.source || "none";
  const shortCommit = commit ? commit.slice(0, 7) : null;
  const deployTag = String(env.DEPLOY_TAG || env.BUILD_LABEL || "").trim() || null;

  return {
    version,
    commit,
    shortCommit,
    deployTag,
    commitSource,
    fingerprint: buildFingerprint(version, shortCommit, deployTag),
  };
}

function getBuildInfo(options = {}) {
  const useCache = !options.repoRoot && !options.env && options.useCache !== false;
  if (useCache && cachedBuildInfo) return cachedBuildInfo;

  const info = resolveBuildInfo(options);
  if (useCache) cachedBuildInfo = info;
  return info;
}

module.exports = {
  getBuildInfo,
  __test: {
    getGitDir,
    resolveGitCommit,
    resetCache() {
      cachedBuildInfo = null;
    },
  },
};
