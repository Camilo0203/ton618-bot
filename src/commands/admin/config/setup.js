const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { settings } = require("../../../utils/database");
const E = require("../../../utils/embeds");

const general = require("./setup/general");
const automod = require("./setup/automod");
const tickets = require("./setup/tickets");
const sugerencias = require("./setup/sugerencias");
const confesiones = require("./setup/confesiones");
const bienvenida = require("./setup/bienvenida");
const despedida = require("./setup/despedida");
const comandos = require("./setup/comandos");
const wizard = require("./setup/wizard");

const setupModules = [wizard, general, automod, tickets, sugerencias, confesiones, bienvenida, despedida, comandos];

let data = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Unified bot setup")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

for (const mod of setupModules) {
  data = mod.register(data);
}

module.exports = {
  data,

  async execute(interaction) {
    let group = null;
    try {
      group = interaction.options.getSubcommandGroup(false);
    } catch (_) {}
    const sub = interaction.options.getSubcommand();
    const gid = interaction.guild.id;
    const s = await settings.get(gid);

    const ok = (msg) => interaction.reply({ embeds: [E.successEmbed(msg)], flags: 64 });
    const er = (msg) => interaction.reply({ embeds: [E.errorEmbed(msg)], flags: 64 });

    const ctx = { interaction, group, sub, gid, s, ok, er };

    for (const mod of setupModules) {
      const handled = await mod.execute(ctx);
      if (handled) return;
    }

    return interaction.reply({
      embeds: [E.errorEmbed("Unknown setup subcommand.")],
      flags: 64,
    });
  },

  async autocomplete(interaction) {
    let group = null;
    let sub = null;
    try {
      group = interaction.options.getSubcommandGroup(false);
    } catch (_) {}
    try {
      sub = interaction.options.getSubcommand(false);
    } catch (_) {}

    const gid = interaction.guild?.id || null;
    const s = gid ? await settings.get(gid) : null;
    const ctx = { interaction, group, sub, gid, s };

    for (const mod of setupModules) {
      if (typeof mod.autocomplete !== "function") continue;
      const handled = await mod.autocomplete(ctx);
      if (handled) return;
    }

    await interaction.respond([]).catch(() => {});
  },
};
