const { PermissionFlagsBits } = require("discord.js");
const { settings, verifSettings, welcomeSettings } = require("../../utils/database");
const { resolveGuildLanguage } = require("../../utils/i18n");
const { buildCenterPayload } = require("../../commands/admin/config/configCenter");
const { configT } = require("../../commands/admin/config/i18n");

function parseCustomId(customId) {
  const [prefix, section, kind, ownerId] = customId.split("|");
  return { prefix, section, kind, ownerId };
}

module.exports = {
  customId: "cfg_center_role|*",

  async execute(interaction) {
    const { section, kind, ownerId } = parseCustomId(interaction.customId);
    const guildSettings = await settings.get(interaction.guild.id);
    const language = resolveGuildLanguage(guildSettings);

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: configT(language, "center.access.owner_only"), flags: 64 });
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: configT(language, "center.access.admin_only"), flags: 64 });
    }

    const selectedId = interaction.values?.[0] || null;

    if (section === "roles" && kind === "staff") {
      if (!selectedId) return interaction.reply({ content: configT(language, "center.actions.select_role_required"), flags: 64 });
      await settings.update(interaction.guild.id, { support_role: selectedId });
    } else if (section === "roles" && kind === "admin") {
      if (!selectedId) return interaction.reply({ content: configT(language, "center.actions.select_role_required"), flags: 64 });
      await settings.update(interaction.guild.id, { admin_role: selectedId });
    } else if (section === "roles" && kind === "verify") {
      await settings.update(interaction.guild.id, { verify_role: selectedId });
    } else if (section === "verify" && kind === "verified") {
      if (!selectedId) return interaction.reply({ content: configT(language, "center.actions.select_role_required"), flags: 64 });
      await verifSettings.update(interaction.guild.id, { verified_role: selectedId });
    } else if (section === "verify" && kind === "unverified") {
      await verifSettings.update(interaction.guild.id, { unverified_role: selectedId });
    } else if (section === "bienvenida" && kind === "autorole") {
      await welcomeSettings.update(interaction.guild.id, { welcome_autorole: selectedId });
    } else {
      return interaction.reply({ content: configT(language, "center.actions.invalid_role_action"), flags: 64 });
    }

    return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
  },
};
