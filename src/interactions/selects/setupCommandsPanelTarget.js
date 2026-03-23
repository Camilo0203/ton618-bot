const { PermissionFlagsBits } = require("discord.js");
const { settings } = require("../../utils/database");
const { normalizeCommandName } = require("../../utils/commandToggles");
const setupComandos = require("../../commands/admin/config/setup/comandos");

function parseCustomId(customId) {
  const [prefix, ownerId, mode] = String(customId || "").split("|");
  return { prefix, ownerId, mode };
}

async function runSetupComandosSubcommand(interaction, guildId, sub, currentSettings, commandName) {
  let message = null;
  let isError = false;

  const proxyInteraction = Object.create(interaction);
  proxyInteraction.options = {
    getString: (name) => (name === "comando" ? commandName : null),
  };

  await setupComandos.execute({
    interaction: proxyInteraction,
    group: "comandos",
    sub,
    gid: guildId,
    s: currentSettings,
    ok: async (msg) => {
      message = msg;
      isError = false;
      return true;
    },
    er: async (msg) => {
      message = msg;
      isError = true;
      return true;
    },
  });

  return { message, isError };
}

module.exports = {
  customId: "setup_cmd_panel_target|*",

  async execute(interaction) {
    const { ownerId, mode } = parseCustomId(interaction.customId);

    if (!ownerId || interaction.user.id !== ownerId) {
      return interaction.reply({ content: "Solo quien abrio este panel puede usarlo.", flags: 64 });
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: "Solo administradores pueden usar este panel.", flags: 64 });
    }

    const commandName = normalizeCommandName(interaction.values?.[0] || "");
    if (!commandName || commandName === "__none__") {
      return interaction.reply({ content: "No hay un comando valido seleccionado.", flags: 64 });
    }

    const gid = interaction.guild.id;
    const currentSettings = await settings.get(gid);
    const result = await runSetupComandosSubcommand(interaction, gid, mode, currentSettings, commandName);
    const updatedSettings = await settings.get(gid);

    const payload = setupComandos.buildPanelPayload({
      interaction,
      settingsObj: updatedSettings,
      ownerId,
      mode,
      notice: result.isError
        ? `Error: ${result.message || "No se pudo aplicar la accion."}`
        : (result.message || "Accion aplicada."),
    });

    return interaction.update(payload);
  },
};
