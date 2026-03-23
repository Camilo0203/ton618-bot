const { ChannelType, EmbedBuilder } = require("discord.js");
const { welcomeSettings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { WELCOME_VARS, fill } = require("./constants");

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("despedida")
      .setDescription("Configurar mensajes de despedida")
      .addSubcommand((s) => s.setName("activar").setDescription("Activar o desactivar despedidas").addBooleanOption((o) => o.setName("estado").setDescription("Activar / desactivar").setRequired(true)))
      .addSubcommand((s) => s.setName("canal").setDescription("Canal donde se envían las despedidas").addChannelOption((o) => o.setName("canal").setDescription("Canal").addChannelTypes(ChannelType.GuildText).setRequired(true)))
      .addSubcommand((s) => s.setName("mensaje").setDescription(`Mensaje de despedida. Variables: ${WELCOME_VARS}`).addStringOption((o) => o.setName("texto").setDescription("Mensaje").setRequired(true).setMaxLength(1000)))
      .addSubcommand((s) => s.setName("titulo").setDescription("Título del embed de despedida").addStringOption((o) => o.setName("texto").setDescription("Título").setRequired(true).setMaxLength(100)))
      .addSubcommand((s) => s.setName("color").setDescription("Color del embed en hexadecimal (ej: ED4245)").addStringOption((o) => o.setName("hex").setDescription("Color HEX sin el #").setRequired(true).setMaxLength(6)))
      .addSubcommand((s) => s.setName("footer").setDescription("Texto del footer del embed de despedida").addStringOption((o) => o.setName("texto").setDescription("Footer").setRequired(true).setMaxLength(200)))
      .addSubcommand((s) => s.setName("avatar").setDescription("Mostrar/ocultar avatar del miembro que salió").addBooleanOption((o) => o.setName("mostrar").setDescription("Mostrar avatar").setRequired(true)))
      .addSubcommand((s) => s.setName("test").setDescription("Enviar un mensaje de despedida de prueba"))
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid, ok, er } = ctx;
  if (group !== "despedida") return false;

  if (sub === "activar") {
    const estado = interaction.options.getBoolean("estado");
    await welcomeSettings.update(gid, { goodbye_enabled: estado });
    return ok(`Despedidas **${estado ? "✅ activadas" : "❌ desactivadas"}**.`);
  }
  if (sub === "canal") {
    await welcomeSettings.update(gid, { goodbye_channel: interaction.options.getChannel("canal").id });
    return ok(`Canal de despedida: ${interaction.options.getChannel("canal")}`);
  }
  if (sub === "mensaje") {
    await welcomeSettings.update(gid, { goodbye_message: interaction.options.getString("texto") });
    return ok(`Mensaje de despedida actualizado.\n**Variables disponibles:** ${WELCOME_VARS}`);
  }
  if (sub === "titulo") {
    await welcomeSettings.update(gid, { goodbye_title: interaction.options.getString("texto") });
    return ok(`Título actualizado: **${interaction.options.getString("texto")}**`);
  }
  if (sub === "color") {
    const hex = interaction.options.getString("hex").replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return er("Color inválido. Usa formato HEX de 6 caracteres (ej: `ED4245`).");
    await welcomeSettings.update(gid, { goodbye_color: hex });
    return ok(`Color actualizado: **#${hex}**`);
  }
  if (sub === "footer") {
    await welcomeSettings.update(gid, { goodbye_footer: interaction.options.getString("texto") });
    return ok("Footer de despedida actualizado.");
  }
  if (sub === "avatar") {
    await welcomeSettings.update(gid, { goodbye_thumbnail: interaction.options.getBoolean("mostrar") });
    return ok(`Avatar en despedidas: **${interaction.options.getBoolean("mostrar") ? "✅ visible" : "❌ oculto"}**`);
  }
  if (sub === "test") {
    await interaction.deferReply({ flags: 64 });
    const wsCurrent = await welcomeSettings.get(gid);
    if (!wsCurrent?.goodbye_channel) return interaction.editReply({ embeds: [E.errorEmbed("Configura primero el canal con `/setup despedida canal #canal`")] });
    const ch = interaction.guild.channels.cache.get(wsCurrent.goodbye_channel);
    if (!ch) return interaction.editReply({ embeds: [E.errorEmbed("Canal no encontrado.")] });

    const fakeMember = interaction.member;
    const color = parseInt(wsCurrent.goodbye_color || "ED4245", 16);
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(fill(wsCurrent.goodbye_title || "👋 Hasta luego", fakeMember, interaction.guild))
      .setDescription(fill(wsCurrent.goodbye_message || "**{user}** ha salido del servidor.", fakeMember, interaction.guild))
      .setTimestamp();
    if (wsCurrent.goodbye_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }));
    if (wsCurrent.goodbye_footer) embed.setFooter({ text: fill(wsCurrent.goodbye_footer, fakeMember, interaction.guild), iconURL: interaction.guild.iconURL({ dynamic: true }) });
    embed.addFields(
      { name: "👤 Usuario", value: interaction.user.tag, inline: true },
      { name: "🆔 ID", value: `\`${interaction.user.id}\``, inline: true },
      { name: "👥 Quedamos", value: `\`${interaction.guild.memberCount}\` miembros`, inline: true },
      { name: "🏷️ Tenía roles", value: "*(test)*", inline: false }
    );
    await ch.send({ embeds: [embed] });
    await interaction.editReply({ embeds: [E.successEmbed(`Test de despedida enviado a ${ch}.`)] });
    return true;
  }

  return false;
}

module.exports = { register, execute };
