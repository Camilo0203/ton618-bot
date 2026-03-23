const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { warnings } = require("../../../utils/database");
const E = require("../../../utils/embeds");

// ────── /warn add ─────────────────────────────────────────────────────
module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("⚠️ Sistema de advertencias y auto-moderación")
    .addSubcommand(sub =>
      sub.setName("add")
        .setDescription("Añadir una advertencia a un usuario")
        .addUserOption(opt => opt.setName("usuario").setDescription("Usuario a advertidir").setRequired(true))
        .addStringOption(opt => opt.setName("razon").setDescription("Razón de la advertencia").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("check")
        .setDescription("Ver las advertencias de un usuario")
        .addUserOption(opt => opt.setName("usuario").setDescription("Usuario a consultar").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("remove")
        .setDescription("Eliminar una advertencia por su ID")
        .addStringOption(opt => opt.setName("id").setDescription("ID de la advertencia a eliminar").setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    // ────── SUBCOMANDO: ADD ─────────────────────────────────────────
    if (sub === "add") {
      const user = interaction.options.getUser("usuario");
      const reason = interaction.options.getString("razon");
      const member = interaction.guild.members.cache.get(user.id);

      // Guardar la advertencia en la base de datos
      const warning = await warnings.add(
        interaction.guild.id,
        user.id,
        reason,
        interaction.user.id
      );

      // Contar total de advertencias
      const totalWarnings = await warnings.getCount(interaction.guild.id, user.id);

      // Auto-moderación
      let autoAction = null;
      let autoActionText = "";

      if (totalWarnings >= 5 && member) {
        // 5 warnings = kick
        try {
          await member.kick(`Auto-moderación: 5 advertencias acumuladas`);
          autoAction = "kick";
          autoActionText = "\n\n🟥 **AUTO-ACCIÓN:** El usuario ha sido **expulsado** del servidor por alcanzar 5 advertencias.";
        } catch (err) {
          autoActionText = "\n\n⚠️ **AUTO-ACCIÓN:** Se intentó expulsar al usuario pero ocurrió un error.";
        }
      } else if (totalWarnings >= 3 && member) {
        // 3 warnings = timeout 1 hora
        try {
          const timeoutDuration = 60 * 60 * 1000; // 1 hora en milisegundos
          await member.timeout(timeoutDuration, `Auto-moderación: 3 advertencias acumuladas`);
          autoAction = "timeout";
          autoActionText = "\n\n🟧 **AUTO-ACCIÓN:** El usuario ha recibido un **timeout de 1 hora** por alcanzar 3 advertencias.";
        } catch (err) {
          autoActionText = "\n\n⚠️ **AUTO-ACCIÓN:** Se intentó aplicar timeout pero ocurrió un error.";
        }
      }

      // Determinar color del embed
      const embedColor = (totalWarnings >= 5) ? E.Colors.ERROR : (totalWarnings >= 3) ? E.Colors.ORANGE : E.Colors.WARNING;

      const embed = new EmbedBuilder()
        .setTitle("⚠️ Advertencia Añadida")
        .setColor(embedColor)
        .setDescription(`Se ha añadido una advertencia a ${user}.`)
        .addFields(
          { name: "👤 Usuario", value: `${user} (\`${user.id}\`)`, inline: true },
          { name: "📋 Moderador", value: `${interaction.user}`, inline: true },
          { name: "📝 Razón", value: reason, inline: false },
          { name: "⚠️ Total de advertencias", value: `**${totalWarnings}** advertencias`, inline: true }
        )
        .setFooter({ text: `ID: ${warning._id}` })
        .setTimestamp();

      if (autoActionText) {
        embed.setDescription(embed.data.description + autoActionText);
      }

      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    // ────── SUBCOMANDO: CHECK ───────────────────────────────────────
    if (sub === "check") {
      const user = interaction.options.getUser("usuario");
      const userWarnings = await warnings.get(interaction.guild.id, user.id);

      if (userWarnings.length === 0) {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setTitle("✅ Sin Advertencias")
            .setColor(E.Colors.SUCCESS)
            .setDescription(`${user} no tiene advertencias en este servidor.`)],
          flags: 64
        });
      }

      const warningsList = userWarnings.map((w, i) => {
        const timestamp = Math.floor(new Date(w.created_at).getTime() / 1000);
        return `**${i + 1}.** \`${w._id}\`\n📝 ${w.reason}\n👮 Moderador: <@${w.moderator_id}>\n📅 Fecha: <t:${timestamp}:f> (<t:${timestamp}:R>)`;
      }).join("\n\n");

      const embed = new EmbedBuilder()
        .setTitle(`⚠️ Advertencias de ${user.username}`)
        .setColor(E.Colors.WARNING)
        .setDescription(`Total: **${userWarnings.length}** advertencias`)
        .addFields({ name: "📋 Lista de Advertencias", value: warningsList.substring(0, 1024) })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "Usa el ID de la advertencia para eliminarla con /warn remove" })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    // ────── SUBCOMANDO: REMOVE ─────────────────────────────────────
    if (sub === "remove") {
      const warningId = interaction.options.getString("id");

      // Intentar eliminar la advertencia
      const deleted = await warnings.remove(warningId);

      if (deleted) {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setTitle("✅ Advertencia Eliminada")
            .setColor(E.Colors.SUCCESS)
            .setDescription(`La advertencia con ID \`${warningId}\` ha sido eliminada correctamente.`)],
          flags: 64
        });
      } else {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setTitle("❌ Error")
            .setColor(E.Colors.ERROR)
            .setDescription(`No se encontró ninguna advertencia con el ID \`${warningId}\`.`)],
          flags: 64
        });
      }
    }
  },
};
