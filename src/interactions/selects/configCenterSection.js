const { PermissionFlagsBits } = require("discord.js");
const { buildCenterPayload } = require("../../commands/admin/config/configCenter");

module.exports = {
  customId: "cfg_center_section|*",

  async execute(interaction) {
    const ownerId = interaction.customId.split("|")[1];
    const section = interaction.values?.[0] || "general";

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: "Only the person who opened this center can use it.", flags: 64 });
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: "Only administrators can configure the bot.", flags: 64 });
    }

    return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
  },
};
