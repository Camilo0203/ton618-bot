const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { Client, GatewayIntentBits } = require("discord.js");
const chalk = require("../chalk-compat");

const GUILD_ID = (process.env.CLEANUP_GUILD_ID || process.env.GUILD_ID || "").trim();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

async function limpiarComandos() {
  try {
    console.log(chalk.yellow("\nStarting slash command cleanup...\n"));

    console.log(chalk.cyan("Cleaning global commands..."));
    const globalCommands = await client.application.commands.fetch();

    if (globalCommands.size > 0) {
      console.log(chalk.gray(`Found ${globalCommands.size} global commands`));

      for (const [id, command] of globalCommands) {
        await client.application.commands.delete(id);
        console.log(chalk.gray(`Deleted /${command.name}`));
      }

      console.log(chalk.green(`${globalCommands.size} global commands removed`));
    } else {
      console.log(chalk.gray("No global commands found"));
    }

    if (GUILD_ID) {
      console.log(chalk.cyan("\nCleaning guild commands..."));

      try {
        let guild = client.guilds.cache.get(GUILD_ID);

        if (!guild) {
          console.log(chalk.gray("Guild not in cache, fetching..."));
          const fetched = await client.guilds.fetch().catch(() => null);
          if (fetched && fetched.has(GUILD_ID)) {
            guild = fetched.get(GUILD_ID);
          }
        }

        if (!guild) {
          console.log(chalk.yellow("Guild not found. Skipping guild cleanup."));
        } else {
          console.log(chalk.gray(`Guild: ${guild.name} (${guild.id})`));

          const guildCommands = await guild.commands.fetch();
          if (guildCommands.size > 0) {
            console.log(chalk.gray(`Found ${guildCommands.size} guild commands`));

            for (const [id, command] of guildCommands) {
              await guild.commands.delete(id);
              console.log(chalk.gray(`Deleted /${command.name}`));
            }

            console.log(chalk.green(`${guildCommands.size} guild commands removed`));
          } else {
            console.log(chalk.gray("No guild commands found"));
          }
        }
      } catch (error) {
        console.log(chalk.red(`Guild cleanup error: ${error.message}`));
      }
    }

    console.log(chalk.cyan("\nVerifying remaining global commands..."));
    const remainingGlobalCommands = await client.application.commands.fetch();
    console.log(chalk.gray(`Remaining global commands: ${remainingGlobalCommands.size}`));

    console.log(chalk.green("\nCleanup completed successfully.\n"));
    client.destroy();
    process.exit(0);
  } catch (error) {
    console.error(chalk.red("\nCleanup error:"), error.message);
    client.destroy();
    process.exit(1);
  }
}

client.once("clientReady", async () => {
  console.log(chalk.blue(`Connected as ${client.user.tag}`));
  await limpiarComandos();
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error(chalk.red("Login error:"), error.message);
  process.exit(1);
});
