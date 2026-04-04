const { EmbedBuilder } = require("discord.js");
const { forceUpdateDashboard } = require("../../handlers/dashboardHandler");
const { t, resolveInteractionLanguage } = require("../../utils/i18n");
const { getGuildSettings } = require("../../utils/accessControl");

module.exports = {
  customId: "refresh_dashboard",
  execute: async function (interaction) {
    const s = await getGuildSettings(interaction.guild.id);
    const lang = resolveInteractionLanguage(interaction, s);

    // deferReply para dar tiempo al proceso
    await interaction.deferReply({ flags: 64 });

    // Forzar actualización del dashboard
    await forceUpdateDashboard(interaction.guild.id);

    // Confirmar al usuario con Embed de éxito
    const successEmbed = new EmbedBuilder()
      .setColor(0x57F287)
      .setDescription(t(lang, "interaction.dashboard_refresh.success"));

    await interaction.editReply({ embeds: [successEmbed] });
  },
};
