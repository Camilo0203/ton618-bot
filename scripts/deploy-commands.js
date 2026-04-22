const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { Client, GatewayIntentBits, PermissionFlagsBits } = require("discord.js");
const chalk = require("../chalk-compat");

const projectRoot = path.resolve(__dirname, "..");
const { validateEnv } = require(path.join(projectRoot, "src/utils/env"));
const { loadAndValidateCommands } = require(path.join(projectRoot, "src/utils/commandLoader"));
const { autoLocalizeCommandData } = require(path.join(projectRoot, "src/utils/autoLocalizeOptions"));

const argv = new Set(process.argv.slice(2));
const compactMode = argv.has("--compact");
const includeLegacy = argv.has("--include-legacy");

function readArgValue(flag, fallback = null) {
  const token = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (!token) return fallback;
  return token.slice(flag.length + 1);
}

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

const envCheck = validateEnv();
if (envCheck.warnings.length) {
  envCheck.warnings.forEach((warning) => console.warn(chalk.yellow(`ENV warning: ${warning}`)));
}
if (envCheck.errors.length) {
  envCheck.errors.forEach((error) => console.error(chalk.red(`ENV error: ${error}`)));
  process.exit(1);
}

const commandsPath = path.join(projectRoot, "src/commands");
console.log(chalk.blue("Loading commands from:"), commandsPath);

const { commands: loadedCommands, validationErrors } = loadAndValidateCommands(commandsPath);
if (validationErrors.length) {
  validationErrors.forEach((error) => console.error(chalk.red(`Validation error: ${error}`)));
  process.exit(1);
}

function ensureScopeDefaultPermissions(commandObj) {
  const data = commandObj?.data;
  const scope = commandObj?.meta?.scope;
  if (!data?.setDefaultMemberPermissions || !scope) return;

  const json = data.toJSON?.() || {};
  if (json.default_member_permissions !== undefined && json.default_member_permissions !== null) {
    return;
  }

  if (scope === "admin" || scope === "developer") {
    data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    return;
  }

  if (scope === "staff") {
    data.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
  }
}

loadedCommands.forEach(ensureScopeDefaultPermissions);

function isSelectedForDeploy(commandObj, { privateOnlyMode = "public" } = {}) {
  const name = commandObj?.data?.name;
  if (!name) return false;
  if (!includeLegacy && LEGACY_HIDDEN_COMMANDS.has(name)) return false;
  if (compactMode && !COMPACT_COMMANDS.has(name)) return false;

  const isPrivateOnly = Boolean(commandObj?.meta?.privateOnly);
  if (privateOnlyMode === "public") return !isPrivateOnly;
  if (privateOnlyMode === "private") return isPrivateOnly;
  return true;
}

const commands = loadedCommands
  .filter((commandObj) => {
    return isSelectedForDeploy(commandObj, { privateOnlyMode: "public" });
  })
  .map((commandObj) => autoLocalizeCommandData(commandObj.data))
  .filter(Boolean);

const privateCommands = loadedCommands
  .filter((commandObj) => isSelectedForDeploy(commandObj, { privateOnlyMode: "private" }))
  .map((commandObj) => autoLocalizeCommandData(commandObj.data))
  .filter(Boolean);

if (compactMode) {
  const omitted = loadedCommands
    .map((commandObj) => commandObj?.data?.name)
    .filter(Boolean)
    .filter((name) => !COMPACT_COMMANDS.has(name))
    .sort();
  console.log(chalk.yellow(`Compact mode active: ${commands.length} commands visible`));
  console.log(chalk.gray(`Hidden (${omitted.length}): ${omitted.join(", ")}`));
}

if (!includeLegacy && LEGACY_HIDDEN_COMMANDS.size) {
  console.log(chalk.yellow(`Legacy hidden: ${Array.from(LEGACY_HIDDEN_COMMANDS).join(", ")}`));
}

console.log(chalk.green(`Commands loaded: ${commands.length}`));
console.log(chalk.blue('Commands to register:'), commands.map(c => c.name).join(', '));
if (privateCommands.length) {
  const privateNames = privateCommands.map((command) => command.name).join(", ");
  if (privateCommandsGuildId) {
    console.log(chalk.blue("Private-only commands:"), `${privateNames} -> guild ${privateCommandsGuildId}`);
  } else {
    console.log(chalk.yellow(`Private-only commands hidden until PRIVATE_COMMANDS_GUILD_ID is set: ${privateNames}`));
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", async () => {
  try {
    console.log(chalk.yellow(`Registering ${commands.length} slash commands...`));

    if (process.env.GUILD_ID) {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const guildScopedCommands =
        privateCommandsGuildId && privateCommandsGuildId === process.env.GUILD_ID
          ? [...commands, ...privateCommands]
          : commands;
      await guild.commands.set(guildScopedCommands);
      console.log(chalk.green(`Commands synced in guild ${guild.name}`));
    } else {
      await client.application.commands.set(commands);
      console.log(chalk.green("Commands synced globally"));
    }

    if (privateCommandsGuildId && privateCommands.length && privateCommandsGuildId !== process.env.GUILD_ID) {
      const privateGuild = await client.guilds.fetch(privateCommandsGuildId);
      await privateGuild.commands.set(privateCommands);
      console.log(chalk.green(`Private-only commands synced in guild ${privateGuild.name}`));
    }

    console.log(chalk.green("Deployment completed"));
    client.destroy();
    process.exit(0);
  } catch (error) {
    console.error(chalk.red("Deployment error:"), error.message);
    client.destroy();
    process.exit(1);
  }
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error(chalk.red("Login error:"), error.message);
  process.exit(1);
});
