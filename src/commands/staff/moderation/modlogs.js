const {
  SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType,
} = require("discord.js");
const { modlogSettings } = require("../../../utils/database");
const E = require("../../../utils/embeds");

const SUB_ALIASES = {
  activar: "enabled",
  canal: "channel",
};

const EVENT_LABELS = {
  log_bans: "Bans",
  log_unbans: "Unbans",
  log_kicks: "Kicks",
  log_msg_delete: "Deleted messages",
  log_msg_edit: "Edited messages",
  log_role_add: "Role added",
  log_role_remove: "Role removed",
  log_nickname: "Nickname changes",
  log_joins: "Member joins",
  log_leaves: "Member leaves",
};

function resolveSubcommand(sub) {
  return SUB_ALIASES[sub] || sub;
}

function getChannelOption(interaction) {
  return interaction.options.getChannel("channel")
    || interaction.options.getChannel("canal");
}

function getBooleanOption(interaction, primary, legacy) {
  return interaction.options.getBoolean(primary)
    ?? interaction.options.getBoolean(legacy);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modlogs")
    .setDescription("Configure moderation logs")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) => sub
      .setName("setup")
      .setDescription("Quick setup for moderation logs")
      .addChannelOption((option) => option.setName("channel").setDescription("Log channel").addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((sub) => sub
      .setName("enabled")
      .setDescription("Enable or disable moderation logs")
      .addBooleanOption((option) => option.setName("enabled").setDescription("Whether moderation logs stay enabled").setRequired(true)))
    .addSubcommand((sub) => sub
      .setName("channel")
      .setDescription("Change the moderation log channel")
      .addChannelOption((option) => option.setName("channel").setDescription("Log channel").addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((sub) => sub
      .setName("config")
      .setDescription("Choose which moderation events are recorded")
      .addStringOption((option) => option.setName("event").setDescription("Event to configure").setRequired(true)
        .addChoices(
          { name: "Bans", value: "log_bans" },
          { name: "Unbans", value: "log_unbans" },
          { name: "Kicks", value: "log_kicks" },
          { name: "Deleted messages", value: "log_msg_delete" },
          { name: "Edited messages", value: "log_msg_edit" },
          { name: "Role added", value: "log_role_add" },
          { name: "Role removed", value: "log_role_remove" },
          { name: "Nickname changes", value: "log_nickname" },
          { name: "Member joins", value: "log_joins" },
          { name: "Member leaves", value: "log_leaves" },
        ))
      .addBooleanOption((option) => option.setName("enabled").setDescription("Enable or disable this event").setRequired(true)))
    .addSubcommand((sub) => sub
      .setName("info")
      .setDescription("View the current moderation log configuration")),

  async execute(interaction) {
    const sub = resolveSubcommand(interaction.options.getSubcommand());
    const gid = interaction.guild.id;
    const current = await modlogSettings.get(gid);
    const ok = (message) => interaction.reply({ embeds: [E.successEmbed(message)], flags: 64 });
    const er = (message) => interaction.reply({ embeds: [E.errorEmbed(message)], flags: 64 });

    if (sub === "setup") {
      const channel = getChannelOption(interaction);
      await modlogSettings.update(gid, { enabled: true, channel: channel.id });
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle("Moderation logs enabled")
            .setDescription(
              `Moderation logs will now be sent to ${channel}.\n\n` +
              "The default set covers bans, unbans, kicks, message edits and deletes, role changes, and nickname updates.\n\n" +
              "Use `/modlogs config` to fine-tune individual events.",
            )
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "enabled") {
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      if (enabled && !current?.channel) {
        return er("Set a log channel first with `/modlogs setup`.");
      }
      await modlogSettings.update(gid, { enabled });
      return ok(`Moderation logs are now **${enabled ? "enabled" : "disabled"}**.`);
    }

    if (sub === "channel") {
      const channel = getChannelOption(interaction);
      await modlogSettings.update(gid, { channel: channel.id });
      return ok(`Moderation log channel updated to ${channel}.`);
    }

    if (sub === "config") {
      const event = interaction.options.getString("event")
        || interaction.options.getString("evento");
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      await modlogSettings.update(gid, { [event]: enabled });
      return ok(`**${EVENT_LABELS[event] || event}** is now **${enabled ? "enabled" : "disabled"}**.`);
    }

    if (sub === "info") {
      const latest = await modlogSettings.get(gid);
      const yesNo = (value) => value ? "Enabled" : "Disabled";
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("Moderation logs configuration")
            .addFields(
              { name: "Status", value: latest?.enabled ? "Enabled" : "Disabled", inline: true },
              { name: "Channel", value: latest?.channel ? `<#${latest.channel}>` : "Not configured", inline: true },
              { name: "\u200b", value: "\u200b", inline: true },
              { name: "Bans", value: yesNo(latest?.log_bans), inline: true },
              { name: "Unbans", value: yesNo(latest?.log_unbans), inline: true },
              { name: "Kicks", value: yesNo(latest?.log_kicks), inline: true },
              { name: "Deleted messages", value: yesNo(latest?.log_msg_delete), inline: true },
              { name: "Edited messages", value: yesNo(latest?.log_msg_edit), inline: true },
              { name: "Role added", value: yesNo(latest?.log_role_add), inline: true },
              { name: "Role removed", value: yesNo(latest?.log_role_remove), inline: true },
              { name: "Nickname changes", value: yesNo(latest?.log_nickname), inline: true },
              { name: "Member joins", value: yesNo(latest?.log_joins), inline: true },
              { name: "Member leaves", value: yesNo(latest?.log_leaves), inline: true },
            )
            .setTimestamp(),
        ],
        flags: 64,
      });
    }
  },
};
