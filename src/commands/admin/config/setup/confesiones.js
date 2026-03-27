const { ChannelType, EmbedBuilder } = require("discord.js");
const { getDB } = require("../../../../utils/database");

const GROUP_ALIASES = {
  confesiones: "confessions",
};

const SUB_ALIASES = {
  configurar: "configure",
};

function resolveGroup(group) {
  return GROUP_ALIASES[group] || group;
}

function resolveSub(sub) {
  return SUB_ALIASES[sub] || sub;
}

function getChannelOption(interaction) {
  return interaction.options.getChannel("channel")
    || interaction.options.getChannel("canal");
}

function getRoleOption(interaction) {
  return interaction.options.getRole("role")
    || interaction.options.getRole("rol");
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("confessions")
      .setDescription("Configure anonymous confessions")
      .addSubcommand((sub) =>
        sub
          .setName("configure")
          .setDescription("Set the channel and role used for confessions")
          .addChannelOption((option) => option.setName("channel").setDescription("Channel where confessions are posted").setRequired(true).addChannelTypes(ChannelType.GuildText))
          .addRoleOption((option) => option.setName("role").setDescription("Role required to use confessions").setRequired(true))
      )
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid } = ctx;
  if (!(resolveGroup(group) === "confessions" && resolveSub(sub) === "configure")) return false;

  try {
    const channel = getChannelOption(interaction);
    const role = getRoleOption(interaction);

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
      { upsert: true },
    );

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle("Confessions configured")
      .setDescription(
        `Anonymous confessions are now configured.\n\nChannel: ${channel}\nRequired role: ${role}`,
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });
  } catch (error) {
    console.error("[SETUP CONFESSIONS ERROR]", error);
    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle("Error")
      .setDescription("An error occurred while configuring anonymous confessions. Please try again.")
      .setTimestamp();
    await interaction.reply({ embeds: [embed], flags: 64 });
  }

  return true;
}

module.exports = { register, execute };
