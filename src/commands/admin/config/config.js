const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { settings } = require("../../../utils/database");
const { buildCenterPayload } = require("./configCenter");

function fmtChannel(id) {
  return id ? `<#${id}>` : "No configurado";
}

function fmtRole(id) {
  return id ? `<@&${id}>` : "No configurado";
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configuracion ultra simple para admins")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((s) => s.setName("estado").setDescription("Ver estado actual"))
    .addSubcommand((s) => s.setName("centro").setDescription("Abrir centro interactivo con menus y botones")),

  async execute(interaction) {
    const gid = interaction.guild.id;
    const sub = interaction.options.getSubcommand();
    const s = await settings.get(gid);

    if (sub === "centro") {
      return interaction.reply({
        ...(await buildCenterPayload(interaction.guild, interaction.user.id, "general")),
        flags: 64,
      });
    }

    if (sub === "estado") {
      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("Estado de Configuracion")
        .addFields(
          { name: "Panel tickets", value: fmtChannel(s.panel_channel_id), inline: true },
          { name: "Logs", value: fmtChannel(s.log_channel), inline: true },
          { name: "Transcripts", value: fmtChannel(s.transcript_channel), inline: true },
          { name: "Live miembros", value: fmtChannel(s.live_members_channel), inline: true },
          { name: "Live rol", value: fmtChannel(s.live_role_channel), inline: true },
          { name: "Rol live", value: fmtRole(s.live_role_id), inline: true },
          { name: "Rol staff", value: fmtRole(s.support_role), inline: true },
          { name: "Rol admin", value: fmtRole(s.admin_role), inline: true },
          { name: "Max tickets", value: `\`${s.max_tickets || 3}\``, inline: true },
          { name: "Ayuda simple", value: s.simple_help_mode === false ? "Desactivada" : "Activada", inline: true }
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    return interaction.reply({ content: "Subcomando no disponible. Usa `/config centro`.", flags: 64 });
  },
};
