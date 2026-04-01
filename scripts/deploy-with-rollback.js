const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { Client, GatewayIntentBits, PermissionFlagsBits } = require("discord.js");
const chalk = require("../chalk-compat");

const projectRoot = path.resolve(__dirname, "..");
const { validateEnv } = require(path.join(projectRoot, "src/utils/env"));
const { loadAndValidateCommands } = require(path.join(projectRoot, "src/utils/commandLoader"));
const { autoLocalizeAllCommands } = require(path.join(projectRoot, "src/utils/autoLocalizeOptions"));

const argv = new Set(process.argv.slice(2));
const compactMode = argv.has("--compact");
const includeLegacy = argv.has("--include-legacy");

function readArgValue(flag, fallback = null) {
  const token = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (!token) return fallback;
  return token.slice(flag.length + 1);
}

function toPositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
}

const snapshotPath = readArgValue("--snapshot", path.join(projectRoot, "tmp", `deploy-backup-${Date.now()}.json`));
const minSmokeCommands = toPositiveInt(
  readArgValue("--min-smoke", process.env.DEPLOY_SMOKE_MIN_COMMANDS || 5),
  5
);
const guildId = readArgValue("--guild-id", process.env.GUILD_ID || null);
const privateCommandsGuildId = readArgValue(
  "--private-guild-id",
  process.env.PRIVATE_COMMANDS_GUILD_ID || process.env.OWNER_COMMANDS_GUILD_ID || null
);

const LEGACY_HIDDEN_COMMANDS = new Set();
const COMPACT_COMMANDS = new Set([
  "cumpleanos",
  "embed",
  "help",
  "ticket",
  "perfil",
  "ping",
  "poll",
  "suggest",
  "giveaway",
  "autorole",
  "mod",
  "serverstats",
  "level",
  "levels",
  "rank",
  "staff",
  "config",
  "audit",
  "setup",
  "verify",
  "stats",
  "modlogs",
  "music",
  "debug",
  "warn",
]);

function ensureScopeDefaultPermissions(commandObj) {
  const data = commandObj?.data;
  const scope = commandObj?.meta?.scope;
  if (!data?.setDefaultMemberPermissions || !scope) return;

  const json = data.toJSON?.() || {};
  if (json.default_member_permissions !== undefined && json.default_member_permissions !== null) return;

  if (scope === "admin" || scope === "developer") {
    data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    return;
  }
  if (scope === "staff") {
    data.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
  }
}

function buildCommandPayload(compact, legacy, options = {}) {
  const commandsPath = path.join(projectRoot, "src/commands");
  const { commands, validationErrors } = loadAndValidateCommands(commandsPath);

  if (validationErrors.length) {
    console.error(chalk.red("Errores de validacion de comandos:"));
    validationErrors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
    process.exit(1);
  }

  // Aplicar auto-localización a todas las opciones de todos los comandos
  autoLocalizeAllCommands(commands);

  const isPrivateOnly = (cmd) => {
    const name = cmd?.data?.name;
    return name === "ping";
  };

  return commands
    .filter((commandObj) => {
      const name = commandObj?.data?.name;
      if (!name) return false;
      if (compact && !COMPACT_COMMANDS.has(name)) return false;
      if (!legacy && LEGACY_HIDDEN_COMMANDS.has(name)) return false;
      const isPrivate = isPrivateOnly(commandObj);
      if (options.privateOnlyMode === "public") return !isPrivate;
      if (options.privateOnlyMode === "private") return isPrivate;
      return true;
    })
    .map((commandObj) => commandObj.data.toJSON())
    .filter(Boolean);
}

function normalizeRemoteCommandForSet(command) {
  return {
    name: command.name,
    name_localizations: command.nameLocalizations || null,
    description: command.description,
    description_localizations: command.descriptionLocalizations || null,
    type: command.type,
    options: command.options || [],
    dm_permission: command.dmPermission ?? true,
    default_member_permissions: command.defaultMemberPermissions ?? null,
    nsfw: Boolean(command.nsfw),
  };
}

function smokeCheck(commands, minRequired = 5) {
  const names = new Set(commands.map((command) => command.name));
  const required = ["setup", "config", "ticket", "stats", "audit", "help"];
  const missing = required.filter((name) => !names.has(name));
  if (missing.length) {
    throw new Error(`Smoke check failed: faltan comandos requeridos: ${missing.join(", ")}`);
  }
  if (commands.length < minRequired) {
    throw new Error(`Smoke check failed: comandos desplegados (${commands.length}) < minimo (${minRequired})`);
  }
}

function persistSnapshot(filePath, payload) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
}

async function main() {
  const envCheck = validateEnv();
  if (envCheck.warnings.length) {
    envCheck.warnings.forEach((warning) => console.warn(chalk.yellow(`ENV warning: ${warning}`)));
  }
  if (envCheck.errors.length) {
    envCheck.errors.forEach((error) => console.error(chalk.red(`ENV error: ${error}`)));
    process.exit(1);
  }

  const publicPayload = buildCommandPayload(compactMode, includeLegacy, { privateOnlyMode: "public" });
  const privatePayload = buildCommandPayload(compactMode, includeLegacy, { privateOnlyMode: "private" });
  const payload =
    guildId && privateCommandsGuildId && guildId === privateCommandsGuildId
      ? [...publicPayload, ...privatePayload]
      : publicPayload;

  console.log(chalk.blue(`Comandos preparados para deploy: ${payload.length}`));
  console.log(chalk.blue(`Destino: ${guildId ? `guild ${guildId}` : "global"}`));
  if (privatePayload.length) {
    if (privateCommandsGuildId) {
      console.log(chalk.blue(`Comandos privados: ${privatePayload.map((command) => command.name).join(", ")} -> guild ${privateCommandsGuildId}`));
    } else {
      console.log(chalk.yellow(`Comandos privados ocultos hasta definir PRIVATE_COMMANDS_GUILD_ID: ${privatePayload.map((command) => command.name).join(", ")}`));
    }
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once("clientReady", async () => {
    let target = null;
    try {
      if (guildId) {
        const guild = await client.guilds.fetch(guildId);
        target = guild.commands;
      } else {
        target = client.application.commands;
      }

      const existing = await target.fetch();
      const existingPayload = Array.from(existing.values()).map(normalizeRemoteCommandForSet);
      persistSnapshot(snapshotPath, {
        created_at: new Date().toISOString(),
        scope: guildId ? "guild" : "global",
        guild_id: guildId || null,
        commands: existingPayload,
      });
      console.log(chalk.gray(`Snapshot guardado en ${snapshotPath}`));

      await target.set(payload);
      const after = await target.fetch();
      smokeCheck(Array.from(after.values()), minSmokeCommands);

      if (privateCommandsGuildId && privatePayload.length && privateCommandsGuildId !== guildId) {
        const privateGuild = await client.guilds.fetch(privateCommandsGuildId);
        await privateGuild.commands.set(privatePayload);
        console.log(chalk.green(`Comandos privados sincronizados en guild ${privateGuild.name}`));
      }

      console.log(chalk.green(`Deploy OK (${after.size} comandos)`));
      client.destroy();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red("Deploy error:"), error?.message || error);

      try {
        const snapshotRaw = fs.readFileSync(snapshotPath, "utf8");
        const snapshot = JSON.parse(snapshotRaw);
        if (Array.isArray(snapshot?.commands) && target) {
          await target.set(snapshot.commands);
          console.error(chalk.yellow("Rollback automatico aplicado desde snapshot."));
        }
      } catch (rollbackError) {
        console.error(chalk.red("Rollback error:"), rollbackError?.message || rollbackError);
      }

      client.destroy();
      process.exit(1);
    }
  });

  client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error(chalk.red("Login error:"), error?.message || error);
    process.exit(1);
  });
}

void main();
