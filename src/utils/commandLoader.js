const fs = require("fs");
const path = require("path");
const { resolveCommandFileFlags } = require("./commandFeatureFlags");

const VALID_SCOPES = new Set(["public", "staff", "admin", "developer"]);

/**
 * @typedef {Object} CommandMeta
 * @property {string} scope - One of: public, staff, admin, developer
 * @property {string} category - Command grouping (folder or scope name)
 * @property {string} file - Relative file path from commands base dir
 * @property {string} exportKey - Named export or "default"
 * @property {string} source - Base filename without extension
 */

/**
 * @typedef {Object} CommandObj
 * @property {Object} data - Discord.js slash command data (name, description, etc.)
 * @property {Function} execute - Interaction handler function
 * @property {CommandMeta} [meta] - Derived or custom metadata
 */

/**
 * @typedef {Object} LoadResult
 * @property {CommandObj[]} commands - Successfully loaded commands
 * @property {string[]} loadErrors - Load-time error messages
 * @property {string[]} [validationErrors] - Validation error messages
 */


/**
 * Retrieve the set of disabled command file paths from environment flags
 * @param {Object} [env=process.env] - Environment variables
 * @returns {Set<string>}
 */
function getDisabledCommandFiles(env = process.env) {
  return resolveCommandFileFlags(env).disabledFiles;
}

/**
 * Derive command metadata from its file path
 * @param {string} filePath - Absolute path to the command file
 * @param {string} baseDir - Commands base directory
 * @param {string} [exportKey="default"] - Export name inside the module
 * @returns {CommandMeta}
 */
function buildCommandMeta(filePath, baseDir, exportKey = "default") {
  const relativePath = path.relative(baseDir, filePath).replace(/\\/g, "/");
  const parts = relativePath.split("/");
  const fileName = path.basename(filePath, ".js");
  const scope = parts[0] || "public";
  // Fix: parts[1] might be a filename like "premium-test.js" for files directly in scope folder
  // In that case, use the scope as the category (e.g., "admin" for files in admin/ folder)
  const rawCategory = parts[1] || scope;
  const category = rawCategory.endsWith(".js") ? scope : rawCategory;
  return {
    scope,
    category,
    file: relativePath,
    exportKey,
    source: fileName,
  };
}

/**
 * Collect all command candidates exported by a module
 * @param {string} filePath - Absolute path to the file
 * @param {Object} loadedModule - Exported module contents
 * @returns {{commandObj: Object, exportKey: string}[]}
 */
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

/**
 * Recursively list all .js files under a directory
 * @param {string} dir - Directory to scan
 * @returns {string[]}
 */
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

/**
 * Load all command modules from a directory tree
 * @param {string} commandsBaseDir - Root commands directory
 * @param {{disabledFiles?: Set<string>, env?: Object}} [options={}] - Load options
 * @returns {{commands: CommandObj[], loadErrors: string[]}}
 */
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

/**
 * Validate a list of loaded commands for structural integrity
 * @param {CommandObj[]} commands - Commands to validate
 * @returns {string[]} - Human-readable validation errors (empty if all valid)
 */
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

/**
 * Load and validate commands in one step
 * @param {string} commandsBaseDir - Root commands directory
 * @param {{disabledFiles?: Set<string>, env?: Object}} [options={}] - Load options
 * @returns {LoadResult}
 */
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
