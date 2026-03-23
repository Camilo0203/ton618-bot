const { PermissionFlagsBits } = require("discord.js");
const { settings } = require("../../utils/database");
const setupComandos = require("../../commands/admin/config/setup/comandos");

function parseCustomId(customId) {
  const [prefix, ownerId] = String(customId || "").split("|");
  return { prefix, ownerId };
}

async function runSetupComandosSubcommand(interaction, guildId, sub, currentSettings, commandName = null) {
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
  customId: "setup_cmd_panel_action|*",

  async execute(interaction) {
    const { ownerId } = parseCustomId(interaction.customId);
    if (!ownerId || interaction.user.id !== ownerId) {
      return interaction.reply({ content: "Solo quien abrio este panel puede usarlo.", flags: 64 });
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: "Solo administradores pueden usar este panel.", flags: 64 });
    }

    const action = String(interaction.values?.[0] || "").toLowerCase();
    const gid = interaction.guild.id;
    const currentSettings = await settings.get(gid);

    if (["deshabilitar", "habilitar", "estado"].includes(action)) {
      const payload = setupComandos.buildPanelPayload({
        interaction,
        settingsObj: currentSettings,
        ownerId,
        mode: action,
      });
      return interaction.update(payload);
    }

    if (action === "listar") {
      const available = setupComandos.__internal.getAvailableCommandNames(interaction);
      const disabled = setupComandos.__internal.getDisabledCommandNames(currentSettings);
      const payload = setupComandos.buildPanelPayload({
        interaction,
        settingsObj: currentSettings,
        ownerId,
        mode: "deshabilitar",
        notice: setupComandos.__internal.buildListMessage(available, disabled),
      });
      return interaction.update(payload);
    }

    if (action === "reset") {
      const result = await runSetupComandosSubcommand(interaction, gid, "reset", currentSettings, null);
      const updatedSettings = await settings.get(gid);
      const payload = setupComandos.buildPanelPayload({
        interaction,
        settingsObj: updatedSettings,
        ownerId,
        mode: "deshabilitar",
        notice: result.isError
          ? `Error: ${result.message || "No se pudo aplicar reset."}`
          : (result.message || "Reset aplicado."),
      });
      return interaction.update(payload);
    }

    return interaction.reply({ content: "Accion invalida.", flags: 64 });
  },
};
