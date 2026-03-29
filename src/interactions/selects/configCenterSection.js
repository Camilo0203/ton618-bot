const { PermissionFlagsBits } = require("discord.js");
const { settings } = require("../../utils/database");
const { resolveGuildLanguage } = require("../../utils/i18n");
const { buildCenterPayload } = require("../../commands/admin/config/configCenter");
const { configT } = require("../../commands/admin/config/i18n");

module.exports = {
  customId: "cfg_center_section|*",

  async execute(interaction) {
    const ownerId = interaction.customId.split("|")[1];
    const section = interaction.values?.[0] || "general";
    const guildSettings = await settings.get(interaction.guild.id);
    const language = resolveGuildLanguage(guildSettings);

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: configT(language, "center.access.owner_only"), flags: 64 });
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: configT(language, "center.access.admin_only"), flags: 64 });
    }

    return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
  },
};
