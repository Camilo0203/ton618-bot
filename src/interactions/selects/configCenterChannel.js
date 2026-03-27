const { PermissionFlagsBits } = require("discord.js");
const { settings, verifSettings, welcomeSettings, suggestSettings, modlogSettings } = require("../../utils/database");
const { buildCenterPayload } = require("../../commands/admin/config/configCenter");
const { sendVerifPanel } = require("../../commands/admin/config/verify");

function parseCustomId(customId) {
  const [prefix, section, kind, ownerId] = customId.split("|");
  return { prefix, section, kind, ownerId };
}

module.exports = {
  customId: "cfg_center_channel|*",

  async execute(interaction) {
    const { section, kind, ownerId } = parseCustomId(interaction.customId);

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: "Only the person who opened this center can use it.", flags: 64 });
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: "Only administrators can configure the bot.", flags: 64 });
    }

    const selectedId = interaction.values?.[0];
    if (!selectedId) {
      return interaction.reply({ content: "No channel was selected.", flags: 64 });
    }

    if (section === "general" && kind === "panel") {
      await settings.update(interaction.guild.id, { panel_channel_id: selectedId });
    } else if (section === "general" && kind === "logs") {
      await settings.update(interaction.guild.id, { log_channel: selectedId });
    } else if (section === "verify" && kind === "verify_channel") {
      await verifSettings.update(interaction.guild.id, { channel: selectedId });
      const v = await verifSettings.get(interaction.guild.id);
      await sendVerifPanel(interaction.guild, v, interaction.client);
    } else if (section === "verify-advanced" && kind === "verif_logs") {
      await verifSettings.update(interaction.guild.id, { log_channel: selectedId });
    } else if (section === "bienvenida" && kind === "welcome_channel") {
      await welcomeSettings.update(interaction.guild.id, { welcome_channel: selectedId });
    } else if (section === "despedida" && kind === "goodbye_channel") {
      await welcomeSettings.update(interaction.guild.id, { goodbye_channel: selectedId });
    } else if (section === "sugerencias" && kind === "suggest_channel") {
      await suggestSettings.update(interaction.guild.id, { channel: selectedId });
    } else if (section === "modlogs" && kind === "modlogs_channel") {
      await modlogSettings.update(interaction.guild.id, { channel: selectedId });
    } else {
      return interaction.reply({ content: "Invalid channel action.", flags: 64 });
    }

    return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
  },
};
