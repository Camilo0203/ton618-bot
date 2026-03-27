const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { warnings } = require("../../../utils/database");
const E = require("../../../utils/embeds");

function getUserOption(interaction) {
  return interaction.options.getUser("user")
    || interaction.options.getUser("usuario");
}

function getReasonOption(interaction) {
  return interaction.options.getString("reason")
    || interaction.options.getString("razon");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warnings and light automoderation")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a warning to a user")
        .addUserOption((opt) => opt.setName("user").setDescription("User to warn").setRequired(true))
        .addStringOption((opt) => opt.setName("reason").setDescription("Reason for the warning").setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName("check")
        .setDescription("View a user's warnings")
        .addUserOption((opt) => opt.setName("user").setDescription("User to inspect").setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a warning by ID")
        .addStringOption((opt) => opt.setName("id").setDescription("Warning ID").setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === "add") {
      const user = getUserOption(interaction);
      const reason = getReasonOption(interaction);
      const member = interaction.guild.members.cache.get(user.id);

      const warning = await warnings.add(
        interaction.guild.id,
        user.id,
        reason,
        interaction.user.id,
      );

      const totalWarnings = await warnings.getCount(interaction.guild.id, user.id);
      let autoActionText = "";

      if (totalWarnings >= 5 && member) {
        try {
          await member.kick("Automatic moderation: reached 5 warnings");
          autoActionText = "\n\nAutomatic action: the user was kicked after reaching 5 warnings.";
        } catch {
          autoActionText = "\n\nAutomatic action: a kick was attempted but could not be completed.";
        }
      } else if (totalWarnings >= 3 && member) {
        try {
          const timeoutDuration = 60 * 60 * 1000;
          await member.timeout(timeoutDuration, "Automatic moderation: reached 3 warnings");
          autoActionText = "\n\nAutomatic action: the user received a 1 hour timeout after reaching 3 warnings.";
        } catch {
          autoActionText = "\n\nAutomatic action: a timeout was attempted but could not be completed.";
        }
      }

      const embedColor = totalWarnings >= 5
        ? E.Colors.ERROR
        : totalWarnings >= 3
          ? E.Colors.ORANGE
          : E.Colors.WARNING;

      const embed = new EmbedBuilder()
        .setTitle("Warning added")
        .setColor(embedColor)
        .setDescription(`A warning was added for ${user}.${autoActionText}`)
        .addFields(
          { name: "User", value: `${user} (\`${user.id}\`)`, inline: true },
          { name: "Moderator", value: `${interaction.user}`, inline: true },
          { name: "Reason", value: reason, inline: false },
          { name: "Total warnings", value: `**${totalWarnings}**`, inline: true },
        )
        .setFooter({ text: `ID: ${warning._id}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (sub === "check") {
      const user = getUserOption(interaction);
      const userWarnings = await warnings.get(interaction.guild.id, user.id);

      if (userWarnings.length === 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("No warnings")
              .setColor(E.Colors.SUCCESS)
              .setDescription(`${user} has no warnings in this server.`),
          ],
          flags: 64,
        });
      }

      const warningsList = userWarnings.map((warning, index) => {
        const timestamp = Math.floor(new Date(warning.created_at).getTime() / 1000);
        return `**${index + 1}.** \`${warning._id}\`\nReason: ${warning.reason}\nModerator: <@${warning.moderator_id}>\nDate: <t:${timestamp}:f> (<t:${timestamp}:R>)`;
      }).join("\n\n");

      const embed = new EmbedBuilder()
        .setTitle(`Warnings for ${user.username}`)
        .setColor(E.Colors.WARNING)
        .setDescription(`Total warnings: **${userWarnings.length}**`)
        .addFields({ name: "Warning list", value: warningsList.substring(0, 1024) })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "Use the warning ID with /warn remove to delete an entry." })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (sub === "remove") {
      const warningId = interaction.options.getString("id");
      const deleted = await warnings.remove(warningId);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(deleted ? "Warning removed" : "Warning not found")
            .setColor(deleted ? E.Colors.SUCCESS : E.Colors.ERROR)
            .setDescription(
              deleted
                ? `The warning with ID \`${warningId}\` was removed successfully.`
                : `No warning exists with ID \`${warningId}\`.`,
            ),
        ],
        flags: 64,
      });
    }
  },
};
