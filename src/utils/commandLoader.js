const fs = require("fs");
const path = require("path");
const { resolveCommandFileFlags } = require("./commandFeatureFlags");

const VALID_SCOPES = new Set(["public", "staff", "admin", "developer"]);

function getDisabledCommandFiles(env = process.env) {
  return resolveCommandFileFlags(env).disabledFiles;
}

function buildCommandMeta(filePath, baseDir, exportKey = "default") {
  const relativePath = path.relative(baseDir, filePath).replace(/\\/g, "/");
  const parts = relativePath.split("/");
  const fileName = path.basename(filePath, ".js");
  return {
    scope: parts[0] || "public",
    category: parts[1] || "general",
    file: relativePath,
    exportKey,
    source: fileName,
  };
}

function collectCommandCandidates(filePath, loadedModule) {
  const candidates = [];
  if (loadedModule?.data) {
    candidates.push({ commandObj: loadedModule, exportKey: "default" });
  }
  for (const key in loadedModule || {}) {
    if (key !== "data" && loadedModule[key]?.data) {
      candidates.push({ commandObj: loadedModule[key], exportKey: key });
    }
  }
  return candidates;
}

function loadCommandFilesRecursively(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...loadCommandFilesRecursively(filePath));
      continue;
    }
    if (entry.name.endsWith(".js")) files.push(filePath);
  }
  return files;
}

function loadCommandModules(commandsBaseDir, options = {}) {
  const commands = [];
  const loadErrors = [];
  const files = loadCommandFilesRecursively(commandsBaseDir);
  const disabledFiles = options.disabledFiles || getDisabledCommandFiles(options.env);

  for (const filePath of files) {
    const relativePath = path.relative(commandsBaseDir, filePath).replace(/\\/g, "/");
    if (disabledFiles.has(relativePath)) {
      continue;
    }

    let loadedModule = null;
    try {
      delete require.cache[require.resolve(filePath)];
      loadedModule = require(filePath);
    } catch (error) {
      loadErrors.push(
        `No se pudo cargar '${relativePath}': ${error?.message || String(error)}`
      );
      continue;
    }

    const candidates = collectCommandCandidates(filePath, loadedModule);
    for (const { commandObj, exportKey } of candidates) {
      const derivedMeta = buildCommandMeta(filePath, commandsBaseDir, exportKey);
      commandObj.meta = { ...derivedMeta, ...(commandObj.meta || {}) };
      commands.push(commandObj);
    }
  }

  return { commands, loadErrors };
}

function loadCommands(commandsBaseDir, options = {}) {
  return loadCommandModules(commandsBaseDir, options).commands;
}

function validateCommands(commands) {
  const errors = [];
  const seenNames = new Map();

  for (const command of commands) {
    const name = command?.data?.name;
    if (!name) {
      errors.push("Comando sin data.name detectado.");
      continue;
    }

    if (typeof command.execute !== "function") {
      errors.push(`/${name}: falta execute(). Fuente: ${command.meta?.file || "desconocida"}`);
    }

    const scope = command.meta?.scope || "public";
    if (!VALID_SCOPES.has(scope)) {
      errors.push(`/${name}: scope invalido '${scope}'. Fuente: ${command.meta?.file || "desconocida"}`);
    }

    const category = command.meta?.category;
    if (!category || typeof category !== "string") {
      errors.push(`/${name}: category invalida. Fuente: ${command.meta?.file || "desconocida"}`);
    }

    const prior = seenNames.get(name);
    if (prior) {
      errors.push(`Nombre duplicado '/${name}' en ${prior} y ${command.meta?.file || "desconocida"}`);
    } else {
      seenNames.set(name, command.meta?.file || "desconocida");
    }
  }

  return errors;
}

function loadAndValidateCommands(commandsBaseDir, options = {}) {
  const { commands, loadErrors } = loadCommandModules(commandsBaseDir, options);
  const validationErrors = [...loadErrors, ...validateCommands(commands)];
  return { commands, validationErrors, loadErrors };
}

module.exports = {
  VALID_SCOPES,
  getDisabledCommandFiles,
  buildCommandMeta,
  loadCommands,
  validateCommands,
  loadAndValidateCommands,
};
