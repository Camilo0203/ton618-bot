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
    embeds: [E.errorEmbed("You need the `Moderate Members` permission for this subcommand.")],
    flags: 64,
  }).catch(() => {});
  return false;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Compact staff operations center")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((s) =>
      s
        .setName("away-on")
        .setDescription("Mark yourself as away")
        .addStringOption((o) => o.setName("reason").setDescription("Reason for going away").setRequired(false))
    )
    .addSubcommand((s) => s.setName("away-off").setDescription("Mark yourself as available again"))
    .addSubcommand((s) => s.setName("my-tickets").setDescription("View your open tickets"))
    .addSubcommand((s) =>
      s
        .setName("warn-add")
        .setDescription("Add a warning to a user")
        .addUserOption((o) => o.setName("user").setDescription("Target user").setRequired(true))
        .addStringOption((o) => o.setName("reason").setDescription("Warning reason").setRequired(true))
    )
    .addSubcommand((s) =>
      s
        .setName("warn-check")
        .setDescription("View warnings for a user")
        .addUserOption((o) => o.setName("user").setDescription("Target user").setRequired(true))
    )
    .addSubcommand((s) =>
      s
        .setName("warn-remove")
        .setDescription("Remove a warning by ID")
        .addStringOption((o) => o.setName("id").setDescription("Warning ID").setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === "away-on") {
      const s = await settings.get(interaction.guild.id);
      if (!isStaff(interaction.member, s)) {
        return interaction.reply({ embeds: [E.errorEmbed("Only staff can use this command.")], flags: 64 });
      }

      const reason = interaction.options.getString("reason") || interaction.options.getString("razon") || null;
      await staffStatus.setAway(interaction.guild.id, interaction.user.id, reason);
      await updateDashboard(interaction.guild);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.WARNING)
            .setTitle("Away mode enabled")
            .setDescription(`Your status is now **away**.${reason ? `\n**Reason:** ${reason}` : ""}`)
            .setFooter({ text: "Use /staff away-off when you are available again" })
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "away-off") {
      const s = await settings.get(interaction.guild.id);
      if (!isStaff(interaction.member, s)) {
        return interaction.reply({ embeds: [E.errorEmbed("Only staff can use this command.")], flags: 64 });
      }

      await staffStatus.setOnline(interaction.guild.id, interaction.user.id);
      await updateDashboard(interaction.guild);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setDescription("You are now **available** for ticket work again.")
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "my-tickets" || sub === "mytickets") {
      const open = await tickets.getByUser(interaction.user.id, interaction.guild.id, "open");
      if (!open.length) {
        return interaction.reply({
          embeds: [E.infoEmbed("My Tickets", "You do not have any open tickets.")],
          flags: 64,
        });
      }

      const list = open
        .map((t) => `• **#${t.ticket_id}** <#${t.channel_id}> - ${t.category} - ${E.priorityLabel(t.priority)}`)
        .join("\n");

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`My Tickets (${open.length})`)
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
        users: { usuario: interaction.options.getUser("user") || interaction.options.getUser("usuario") },
        strings: { razon: interaction.options.getString("reason") || interaction.options.getString("razon") },
      });
      return warnCommand.execute(proxied);
    }

    if (sub === "warn-check") {
      if (!requireModerationPerm(interaction)) return;
      const proxied = createInteractionProxy(interaction, {
        subcommand: "check",
        users: { usuario: interaction.options.getUser("user") || interaction.options.getUser("usuario") },
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
