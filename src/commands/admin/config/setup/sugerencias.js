const { ChannelType, EmbedBuilder } = require("discord.js");
const { suggestSettings } = require("../../../../utils/database");

const GROUP_ALIASES = {
  sugerencias: "suggestions",
};

const SUB_ALIASES = {
  activar: "enabled",
  canal: "channel",
};

function resolveGroup(group) {
  return GROUP_ALIASES[group] || group;
}

function resolveSub(sub) {
  return SUB_ALIASES[sub] || sub;
}

function getEnabledOption(interaction) {
  return interaction.options.getBoolean("enabled")
    ?? interaction.options.getBoolean("estado");
}

function getChannelOption(interaction) {
  return interaction.options.getChannel("channel")
    || interaction.options.getChannel("sugerencias");
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("suggestions")
      .setDescription("Configure the suggestions system")
      .addSubcommand((sub) =>
        sub
          .setName("enabled")
          .setDescription("Enable or disable suggestions")
          .addBooleanOption((option) => option.setName("enabled").setDescription("Whether suggestions stay enabled").setRequired(true))
      )
      .addSubcommand((sub) =>
        sub
          .setName("channel")
          .setDescription("Set the channel used for suggestions")
          .addChannelOption((option) => option.setName("channel").setDescription("Suggestions channel").addChannelTypes(ChannelType.GuildText).setRequired(true))
      )
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid } = ctx;
  if (resolveGroup(group) !== "suggestions") return false;

  const normalizedSub = resolveSub(sub);

  if (normalizedSub === "enabled") {
    const enabled = getEnabledOption(interaction);
    await suggestSettings.update(gid, { enabled });
    const embed = new EmbedBuilder()
      .setColor(enabled ? 0x57F287 : 0xED4245)
      .setTitle(`Suggestions ${enabled ? "enabled" : "disabled"}`)
      .setDescription(
        enabled
          ? "Users can now submit suggestions normally."
          : "The suggestions system is now disabled for this server.",
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed], flags: 64 });
    return true;
  }

  if (normalizedSub === "channel") {
    const channel = getChannelOption(interaction);
    await suggestSettings.update(gid, { channel: channel.id });
    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("Suggestions channel updated")
      .setDescription(`Suggestions will now be sent to ${channel}.`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed], flags: 64 });
    return true;
  }

  return false;
}

module.exports = { register, execute };
