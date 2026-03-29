const { PermissionFlagsBits } = require("discord.js");
const { settings } = require("../../utils/database");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");
const { normalizeCommandName } = require("../../utils/commandToggles");
const setupComandos = require("../../commands/admin/config/setup/comandos");

function normalizePanelAction(action) {
  const normalized = String(action || "").toLowerCase();
  const aliases = {
    deshabilitar: "disable",
    habilitar: "enable",
    estado: "status",
  };
  return aliases[normalized] || normalized;
}

function parseCustomId(customId) {
  const [prefix, ownerId, mode] = String(customId || "").split("|");
  return { prefix, ownerId, mode };
}

async function runSetupComandosSubcommand(interaction, guildId, sub, currentSettings, commandName) {
  let message = null;
  let isError = false;

  const proxyInteraction = Object.create(interaction);
  proxyInteraction.options = {
    getString: (name) => ((name === "command" || name === "comando") ? commandName : null),
  };

  await setupComandos.execute({
    interaction: proxyInteraction,
    group: "commands",
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
    const currentSettings = await settings.get(interaction.guild.id);
    const language = resolveInteractionLanguage(interaction, currentSettings);

    if (!ownerId || interaction.user.id !== ownerId) {
      return interaction.reply({ content: t(language, "setup.panel.owner_only"), flags: 64 });
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: t(language, "setup.panel.admin_only"), flags: 64 });
    }

    const commandName = normalizeCommandName(interaction.values?.[0] || "");
    if (!commandName || commandName === "__none__") {
      return interaction.reply({ content: t(language, "setup.panel.invalid_command"), flags: 64 });
    }

    const gid = interaction.guild.id;
    const result = await runSetupComandosSubcommand(interaction, gid, normalizePanelAction(mode), currentSettings, commandName);
    const updatedSettings = await settings.get(gid);

    const payload = setupComandos.buildPanelPayload({
      interaction,
      settingsObj: updatedSettings,
      ownerId,
      mode: normalizePanelAction(mode),
      notice: result.isError
        ? t(language, "setup.panel.error_prefix", {
            message: result.message || t(language, "setup.panel.default_action_failed"),
          })
        : (result.message || t(language, "setup.panel.action_applied")),
    });

    return interaction.update(payload);
  },
};
