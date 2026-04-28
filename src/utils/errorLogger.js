const fsPromises = require("fs/promises");
const path = require("path");
const { parseBoolean } = require("./envHelpers");

function isFileErrorLoggingEnabled() {
  return parseBoolean(process.env.ERROR_LOG_TO_FILE, true);
}

function resolveErrorLogDir() {
  const customDir = String(process.env.ERROR_LOG_DIR || "").trim();
  if (customDir) return path.resolve(customDir);
  return path.join(__dirname, "../../data/logs");
}

function resolveErrorLogFile(timestamp = new Date()) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const day = Number.isFinite(date.getTime())
    ? date.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];
  return path.join(resolveErrorLogDir(), `errors_${day}.jsonl`);
}

async function writeErrorLogEntry(entry) {
  if (!isFileErrorLoggingEnabled()) return null;
  const file = resolveErrorLogFile(entry?.timestamp);
  await fsPromises.mkdir(path.dirname(file), { recursive: true }).catch((err) => {
    console.error("[errorLogger] Failed to create log directory:", err);
  });
  const line = `${JSON.stringify(entry)}\n`;
  await fsPromises.appendFile(file, line, "utf8");
  return file;
}

module.exports = {
  isFileErrorLoggingEnabled,
  resolveErrorLogDir,
  resolveErrorLogFile,
  writeErrorLogEntry,
};

