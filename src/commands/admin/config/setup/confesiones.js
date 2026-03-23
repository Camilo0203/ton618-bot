const { ChannelType, EmbedBuilder } = require("discord.js");
const { getDB } = require("../../../../utils/database");

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("confesiones")
      .setDescription("Configuración del sistema de confesiones anónimas")
      .addSubcommand((s) =>
        s
          .setName("configurar")
          .setDescription("Configurar el canal y rol para confesiones")
          .addChannelOption((o) => o.setName("canal").setDescription("Canal donde se enviarán las confesiones").setRequired(true).addChannelTypes(ChannelType.GuildText))
          .addRoleOption((o) => o.setName("rol").setDescription("Rol requerido para usar el comando").setRequired(true))
      )
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid } = ctx;
  if (!(group === "confesiones" && sub === "configurar")) return false;

  try {
    const channel = interaction.options.getChannel("canal");
    const role = interaction.options.getRole("rol");

    const db = getDB();
    const collection = db.collection("confessionConfig");

    await collection.updateOne(
      { guild_id: gid },
      {
        $set: {
          guild_id: gid,
          channel_id: channel.id,
          role_id: role.id,
          updated_at: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle("✅ Sistema de Confesiones Configurado")
      .setDescription(`El sistema de confesiones ha sido configurado correctamente.\n\n📜 **Canal:** ${channel}\n👤 **Rol requerido:** ${role}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });
  } catch (error) {
    console.error("[SETUP CONFESIONES ERROR]", error);
    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle("❌ Error")
      .setDescription("Ocurrió un error al configurar el sistema de confesiones. Por favor, intenta de nuevo.")
      .setTimestamp();
    await interaction.reply({ embeds: [embed], flags: 64 });
  }

  return true;
}

module.exports = { register, execute };
