const {
  SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType,
} = require("discord.js");
const { modlogSettings } = require("../../../utils/database");
const E = require("../../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modlogs")
    .setDescription("📋 Configurar el sistema de logs de moderación")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(s => s
      .setName("setup")
      .setDescription("Configuración inicial rápida")
      .addChannelOption(o => o.setName("canal").setDescription("Canal de logs").addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(s => s
      .setName("activar")
      .setDescription("Activar o desactivar el sistema de logs")
      .addBooleanOption(o => o.setName("estado").setDescription("Activar / desactivar").setRequired(true)))
    .addSubcommand(s => s
      .setName("canal")
      .setDescription("Cambiar el canal de logs")
      .addChannelOption(o => o.setName("canal").setDescription("Canal").addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(s => s
      .setName("config")
      .setDescription("Configurar qué eventos registrar")
      .addStringOption(o => o.setName("evento").setDescription("Tipo de evento").setRequired(true)
        .addChoices(
          { name: "🔨 Baneos",            value: "log_bans"       },
          { name: "✅ Desbaneos",          value: "log_unbans"     },
          { name: "🚫 Kicks",              value: "log_kicks"      },
          { name: "🗑️ Mensajes eliminados", value: "log_msg_delete" },
          { name: "✏️ Mensajes editados",   value: "log_msg_edit"   },
          { name: "✅ Roles añadidos",      value: "log_role_add"   },
          { name: "❌ Roles quitados",      value: "log_role_remove"},
          { name: "✏️ Cambios de nickname", value: "log_nickname"   },
          { name: "📥 Miembros que entran", value: "log_joins"      },
          { name: "📤 Miembros que salen",  value: "log_leaves"     },
        ))
      .addBooleanOption(o => o.setName("estado").setDescription("Activar / desactivar este evento").setRequired(true)))
    .addSubcommand(s => s
      .setName("info")
      .setDescription("Ver la configuración actual de logs")),

  async execute(interaction) {
    const sub  = interaction.options.getSubcommand();
    const gid  = interaction.guild.id;
    const ml   = await modlogSettings.get(gid);
    const ok   = msg => interaction.reply({ embeds: [E.successEmbed(msg)], flags: 64 });
    const er   = msg => interaction.reply({ embeds: [E.errorEmbed(msg)],   flags: 64 });

    if (sub === "setup") {
      const canal = interaction.options.getChannel("canal");
      await modlogSettings.update(gid, { enabled: true, channel: canal.id });
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("✅ Logs de Moderación Activados")
          .setDescription(`Los logs se enviarán a ${canal}.\n\nPor defecto están activados: baneos, desbaneos, edición/eliminación de mensajes, cambios de roles y nicknames.\n\nUsa \`/modlogs config\` para personalizar qué eventos registrar.`)
          .setTimestamp()],
        flags: 64,
      });
    }

    if (sub === "activar") {
      const estado = interaction.options.getBoolean("estado");
      if (estado && !ml?.channel) return er("Configura primero el canal con `/modlogs setup`.");
      await modlogSettings.update(gid, { enabled: estado });
      return ok(`Logs de moderación **${estado ? "✅ activados" : "❌ desactivados"}**.`);
    }

    if (sub === "canal") {
      const canal = interaction.options.getChannel("canal");
      await modlogSettings.update(gid, { channel: canal.id });
      return ok(`Canal de logs actualizado: ${canal}`);
    }

    if (sub === "config") {
      const evento = interaction.options.getString("evento");
      const estado = interaction.options.getBoolean("estado");
      await modlogSettings.update(gid, { [evento]: estado });
      const labels = {
        log_bans: "🔨 Baneos", log_unbans: "✅ Desbaneos", log_kicks: "🚫 Kicks",
        log_msg_delete: "🗑️ Mensajes eliminados", log_msg_edit: "✏️ Mensajes editados",
        log_role_add: "✅ Roles añadidos", log_role_remove: "❌ Roles quitados",
        log_nickname: "✏️ Nicknames", log_joins: "📥 Entradas", log_leaves: "📤 Salidas",
      };
      return ok(`**${labels[evento]}**: ${estado ? "✅ Activado" : "❌ Desactivado"}`);
    }

    if (sub === "info") {
      const mlNow = await modlogSettings.get(gid);
      const yn    = v => v ? "✅" : "❌";
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle("📋 Configuración de Logs de Moderación")
          .addFields(
            { name: "⚙️ Estado",            value: mlNow?.enabled ? "✅ Activo" : "❌ Inactivo", inline: true },
            { name: "📢 Canal",             value: mlNow?.channel ? `<#${mlNow.channel}>` : "No configurado", inline: true },
            { name: "\u200b",               value: "\u200b", inline: true },
            { name: "🔨 Baneos",            value: yn(mlNow?.log_bans),       inline: true },
            { name: "✅ Desbaneos",          value: yn(mlNow?.log_unbans),     inline: true },
            { name: "🚫 Kicks",             value: yn(mlNow?.log_kicks),      inline: true },
            { name: "🗑️ Msgs eliminados",   value: yn(mlNow?.log_msg_delete), inline: true },
            { name: "✏️ Msgs editados",      value: yn(mlNow?.log_msg_edit),   inline: true },
            { name: "🏷️ Roles añadidos",    value: yn(mlNow?.log_role_add),   inline: true },
            { name: "🏷️ Roles quitados",    value: yn(mlNow?.log_role_remove),inline: true },
            { name: "✏️ Nicknames",          value: yn(mlNow?.log_nickname),   inline: true },
            { name: "📥 Entradas",           value: yn(mlNow?.log_joins),      inline: true },
            { name: "📤 Salidas",            value: yn(mlNow?.log_leaves),     inline: true },
          ).setTimestamp()],
        flags: 64,
      });
    }
  },
};
