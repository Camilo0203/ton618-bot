const { ChannelType, EmbedBuilder } = require("discord.js");
const { welcomeSettings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { WELCOME_VARS, fill } = require("./constants");

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("bienvenida")
      .setDescription("Configurar mensajes de bienvenida")
      .addSubcommand((s) => s.setName("activar").setDescription("Activar o desactivar bienvenidas").addBooleanOption((o) => o.setName("estado").setDescription("Activar / desactivar").setRequired(true)))
      .addSubcommand((s) => s.setName("canal").setDescription("Canal donde se envían las bienvenidas").addChannelOption((o) => o.setName("canal").setDescription("Canal").addChannelTypes(ChannelType.GuildText).setRequired(true)))
      .addSubcommand((s) => s.setName("mensaje").setDescription(`Mensaje de bienvenida. Variables: ${WELCOME_VARS}`).addStringOption((o) => o.setName("texto").setDescription("Mensaje").setRequired(true).setMaxLength(1000)))
      .addSubcommand((s) => s.setName("titulo").setDescription("Título del embed de bienvenida").addStringOption((o) => o.setName("texto").setDescription("Título").setRequired(true).setMaxLength(100)))
      .addSubcommand((s) => s.setName("color").setDescription("Color del embed en hexadecimal (ej: 5865F2)").addStringOption((o) => o.setName("hex").setDescription("Color HEX sin el #").setRequired(true).setMaxLength(6)))
      .addSubcommand((s) => s.setName("footer").setDescription("Texto del footer del embed").addStringOption((o) => o.setName("texto").setDescription("Footer").setRequired(true).setMaxLength(200)))
      .addSubcommand((s) => s.setName("banner").setDescription("URL de imagen de banner en el embed").addStringOption((o) => o.setName("url").setDescription("URL de imagen (https://...)").setRequired(false)))
      .addSubcommand((s) => s.setName("avatar").setDescription("Mostrar/ocultar avatar del nuevo miembro").addBooleanOption((o) => o.setName("mostrar").setDescription("Mostrar avatar").setRequired(true)))
      .addSubcommand((s) => s.setName("dm").setDescription("Enviar DM de bienvenida al nuevo miembro").addBooleanOption((o) => o.setName("estado").setDescription("Activar / desactivar").setRequired(true)).addStringOption((o) => o.setName("mensaje").setDescription(`Mensaje del DM. Variables: ${WELCOME_VARS}`).setRequired(false).setMaxLength(1000)))
      .addSubcommand((s) => s.setName("autorole").setDescription("Rol que se asigna automáticamente al entrar").addRoleOption((o) => o.setName("rol").setDescription("Rol (vacío = desactivar)").setRequired(false)))
      .addSubcommand((s) => s.setName("test").setDescription("Enviar un mensaje de bienvenida de prueba"))
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid, ok, er } = ctx;
  if (group !== "bienvenida") return false;

  if (sub === "activar") {
    const estado = interaction.options.getBoolean("estado");
    await welcomeSettings.update(gid, { welcome_enabled: estado });
    return ok(`Bienvenidas **${estado ? "✅ activadas" : "❌ desactivadas"}**.`);
  }
  if (sub === "canal") {
    await welcomeSettings.update(gid, { welcome_channel: interaction.options.getChannel("canal").id });
    return ok(`Canal de bienvenida: ${interaction.options.getChannel("canal")}`);
  }
  if (sub === "mensaje") {
    await welcomeSettings.update(gid, { welcome_message: interaction.options.getString("texto") });
    return ok(`Mensaje de bienvenida actualizado.\n**Variables disponibles:** ${WELCOME_VARS}`);
  }
  if (sub === "titulo") {
    await welcomeSettings.update(gid, { welcome_title: interaction.options.getString("texto") });
    return ok(`Título actualizado: **${interaction.options.getString("texto")}**`);
  }
  if (sub === "color") {
    const hex = interaction.options.getString("hex").replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return er("Color inválido. Usa formato HEX de 6 caracteres (ej: `5865F2`).");
    await welcomeSettings.update(gid, { welcome_color: hex });
    return ok(`Color actualizado: **#${hex}**`);
  }
  if (sub === "footer") {
    await welcomeSettings.update(gid, { welcome_footer: interaction.options.getString("texto") });
    return ok("Footer de bienvenida actualizado.");
  }
  if (sub === "banner") {
    const url = interaction.options.getString("url");
    if (url && !url.startsWith("http")) return er("La URL debe empezar con `https://`");
    await welcomeSettings.update(gid, { welcome_banner: url || null });
    return ok(url ? "Banner configurado." : "Banner eliminado.");
  }
  if (sub === "avatar") {
    await welcomeSettings.update(gid, { welcome_thumbnail: interaction.options.getBoolean("mostrar") });
    return ok(`Avatar del miembro en bienvenidas: **${interaction.options.getBoolean("mostrar") ? "✅ visible" : "❌ oculto"}**`);
  }
  if (sub === "dm") {
    const estado = interaction.options.getBoolean("estado");
    const msg = interaction.options.getString("mensaje");
    const update = { welcome_dm: estado };
    if (msg) update.welcome_dm_message = msg;
    await welcomeSettings.update(gid, update);
    return ok(`DM de bienvenida: **${estado ? "✅ activado" : "❌ desactivado"}**${msg ? "\nMensaje de DM actualizado." : ""}`);
  }
  if (sub === "autorole") {
    const rol = interaction.options.getRole("rol");
    await welcomeSettings.update(gid, { welcome_autorole: rol ? rol.id : null });
    return ok(rol ? `Auto-rol configurado: ${rol}` : "Auto-rol **desactivado**.");
  }
  if (sub === "test") {
    await interaction.deferReply({ flags: 64 });
    const wsCurrent = await welcomeSettings.get(gid);
    if (!wsCurrent?.welcome_channel) return interaction.editReply({ embeds: [E.errorEmbed("Configura primero el canal con `/setup general dashboard #canal` y luego `/setup bienvenida canal #canal`")] });
    const ch = interaction.guild.channels.cache.get(wsCurrent.welcome_channel);
    if (!ch) return interaction.editReply({ embeds: [E.errorEmbed("Canal no encontrado.")] });

    const fakeMember = interaction.member;
    const color = parseInt(wsCurrent.welcome_color || "5865F2", 16);
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(fill(wsCurrent.welcome_title || "👋 ¡Bienvenido/a!", fakeMember, interaction.guild))
      .setDescription(fill(wsCurrent.welcome_message || "Bienvenido {mention}!", fakeMember, interaction.guild))
      .setTimestamp();
    if (wsCurrent.welcome_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }));
    if (wsCurrent.welcome_banner) embed.setImage(wsCurrent.welcome_banner);
    if (wsCurrent.welcome_footer) embed.setFooter({ text: fill(wsCurrent.welcome_footer, fakeMember, interaction.guild), iconURL: interaction.guild.iconURL({ dynamic: true }) });
    embed.addFields(
      { name: "👤 Usuario", value: interaction.user.tag, inline: true },
      { name: "📆 Cuenta creada", value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: "👥 Miembro #", value: `\`${interaction.guild.memberCount}\``, inline: true }
    );
    await ch.send({ content: `<@${interaction.user.id}> *(esto es un test)*`, embeds: [embed] });
    await interaction.editReply({ embeds: [E.successEmbed(`Test enviado a ${ch}.`)] });
    return true;
  }

  return false;
}

module.exports = { register, execute };
