const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const warnCommand = require("./warn");
const { staffStatus, settings, tickets } = require("../../../utils/database");
const { updateDashboard } = require("../../../handlers/dashboardHandler");
const { isStaff } = require("./_staffAccess");
const E = require("../../../utils/embeds");
const { createInteractionProxy } = require("../../../utils/interactionProxy");

function requireModerationPerm(interaction) {
  if (interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) return true;
  interaction.reply({
    embeds: [E.errorEmbed("Necesitas el permiso `Moderate Members` para este subcomando.")],
    flags: 64,
  }).catch(() => {});
  return false;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Centro compacto para operaciones de staff")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((s) =>
      s
        .setName("away-on")
        .setDescription("Marcarme como ausente")
        .addStringOption((o) => o.setName("razon").setDescription("Razon de ausencia").setRequired(false))
    )
    .addSubcommand((s) => s.setName("away-off").setDescription("Volver a estar disponible"))
    .addSubcommand((s) => s.setName("mytickets").setDescription("Ver mis tickets abiertos"))
    .addSubcommand((s) =>
      s
        .setName("warn-add")
        .setDescription("Anadir una advertencia a un usuario")
        .addUserOption((o) => o.setName("usuario").setDescription("Usuario").setRequired(true))
        .addStringOption((o) => o.setName("razon").setDescription("Razon").setRequired(true))
    )
    .addSubcommand((s) =>
      s
        .setName("warn-check")
        .setDescription("Ver advertencias de un usuario")
        .addUserOption((o) => o.setName("usuario").setDescription("Usuario").setRequired(true))
    )
    .addSubcommand((s) =>
      s
        .setName("warn-remove")
        .setDescription("Eliminar una advertencia por ID")
        .addStringOption((o) => o.setName("id").setDescription("ID de advertencia").setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === "away-on") {
      const s = await settings.get(interaction.guild.id);
      if (!isStaff(interaction.member, s)) {
        return interaction.reply({ embeds: [E.errorEmbed("Solo el staff puede usar este comando.")], flags: 64 });
      }

      const razon = interaction.options.getString("razon") || null;
      await staffStatus.setAway(interaction.guild.id, interaction.user.id, razon);
      await updateDashboard(interaction.guild);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.WARNING)
            .setTitle("Modo Ausente Activado")
            .setDescription(`Has marcado tu estado como **ausente**.\n${razon ? `**Razon:** ${razon}` : ""}`)
            .setFooter({ text: "Usa /staff away-off para volver a estar disponible" })
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "away-off") {
      const s = await settings.get(interaction.guild.id);
      if (!isStaff(interaction.member, s)) {
        return interaction.reply({ embeds: [E.errorEmbed("Solo el staff puede usar este comando.")], flags: 64 });
      }

      await staffStatus.setOnline(interaction.guild.id, interaction.user.id);
      await updateDashboard(interaction.guild);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setDescription("Has vuelto a estar **disponible** para atender tickets.")
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "mytickets") {
      const open = await tickets.getByUser(interaction.user.id, interaction.guild.id, "open");
      if (!open.length) {
        return interaction.reply({
          embeds: [E.infoEmbed("Mis Tickets", "No tienes tickets abiertos.")],
          flags: 64,
        });
      }

      const list = open
        .map((t) => `▸ **#${t.ticket_id}** <#${t.channel_id}> - ${t.category} - ${E.priorityLabel(t.priority)}`)
        .join("\n");

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Mis Tickets (${open.length})`)
            .setColor(E.Colors.PRIMARY)
            .setDescription(list)
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "warn-add") {
      if (!requireModerationPerm(interaction)) return;
      const proxied = createInteractionProxy(interaction, {
        subcommand: "add",
        users: { usuario: interaction.options.getUser("usuario") },
        strings: { razon: interaction.options.getString("razon") },
      });
      return warnCommand.execute(proxied);
    }

    if (sub === "warn-check") {
      if (!requireModerationPerm(interaction)) return;
      const proxied = createInteractionProxy(interaction, {
        subcommand: "check",
        users: { usuario: interaction.options.getUser("usuario") },
      });
      return warnCommand.execute(proxied);
    }

    if (sub === "warn-remove") {
      if (!requireModerationPerm(interaction)) return;
      const proxied = createInteractionProxy(interaction, {
        subcommand: "remove",
        strings: { id: interaction.options.getString("id") },
      });
      return warnCommand.execute(proxied);
    }
  },
};
