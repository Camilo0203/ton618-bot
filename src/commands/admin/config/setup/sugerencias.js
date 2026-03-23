const { ChannelType, EmbedBuilder } = require("discord.js");
const { suggestSettings } = require("../../../../utils/database");

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("sugerencias")
      .setDescription("Configuración del sistema de sugerencias")
      .addSubcommand((s) =>
        s
          .setName("activar")
          .setDescription("Activar o desactivar el sistema de sugerencias")
          .addBooleanOption((o) => o.setName("estado").setDescription("True = activar, False = desactivar").setRequired(true))
      )
      .addSubcommand((s) =>
        s
          .setName("canal")
          .setDescription("Definir el canal donde se enviarán las sugerencias")
          .addChannelOption((o) => o.setName("sugerencias").setDescription("Canal de texto para las sugerencias").addChannelTypes(ChannelType.GuildText).setRequired(true))
      )
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid } = ctx;
  if (group !== "sugerencias") return false;

  if (sub === "activar") {
    const enabled = interaction.options.getBoolean("estado");
    await suggestSettings.update(gid, { enabled });
    const embed = new EmbedBuilder()
      .setColor(enabled ? 0x57f287 : 0xed4245)
      .setTitle(`✅ Sistema de Sugerencias ${enabled ? "Activado" : "Desactivado"}`)
      .setDescription(enabled ? "El sistema de sugerencias ahora está activo. Los usuarios pueden usar `/suggest` para enviar sugerencias." : "El sistema de sugerencias ha sido desactivado. Los usuarios no pueden enviar sugerencias.")
      .setTimestamp();
    await interaction.reply({ embeds: [embed], flags: 64 });
    return true;
  }

  if (sub === "canal") {
    const channel = interaction.options.getChannel("sugerencias");
    await suggestSettings.update(gid, { channel: channel.id });
    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle("✅ Canal de Sugerencias Configurado")
      .setDescription(`Las sugerencias ahora se enviarán a ${channel}.`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed], flags: 64 });
    return true;
  }

  return false;
}

module.exports = { register, execute };
