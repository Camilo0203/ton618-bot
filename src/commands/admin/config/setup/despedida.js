const { ChannelType, EmbedBuilder } = require("discord.js");
const { welcomeSettings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { WELCOME_VARS, fill } = require("./constants");

const GROUP_ALIASES = {
  despedida: "goodbye",
};

const SUB_ALIASES = {
  activar: "enabled",
  canal: "channel",
  mensaje: "message",
  titulo: "title",
  color: "color",
  footer: "footer",
  avatar: "avatar",
  test: "test",
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

function getBooleanOption(interaction, primary, legacy) {
  return interaction.options.getBoolean(primary)
    ?? interaction.options.getBoolean(legacy);
}

function getStringOption(interaction, primary, legacy) {
  return interaction.options.getString(primary)
    ?? interaction.options.getString(legacy);
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("goodbye")
      .setDescription("Configure goodbye messages")
      .addSubcommand((sub) => sub.setName("enabled").setDescription("Enable or disable goodbye messages").addBooleanOption((option) => option.setName("enabled").setDescription("Whether goodbye messages stay enabled").setRequired(true)))
      .addSubcommand((sub) => sub.setName("channel").setDescription("Set the goodbye channel").addChannelOption((option) => option.setName("channel").setDescription("Goodbye channel").addChannelTypes(ChannelType.GuildText).setRequired(true)))
      .addSubcommand((sub) => sub.setName("message").setDescription(`Set the goodbye message. Variables: ${WELCOME_VARS}`).addStringOption((option) => option.setName("text").setDescription("Message content").setRequired(true).setMaxLength(1000)))
      .addSubcommand((sub) => sub.setName("title").setDescription("Set the goodbye embed title").addStringOption((option) => option.setName("text").setDescription("Embed title").setRequired(true).setMaxLength(100)))
      .addSubcommand((sub) => sub.setName("color").setDescription("Set the goodbye embed color (hex, e.g. ED4245)").addStringOption((option) => option.setName("hex").setDescription("Hex color without #").setRequired(true).setMaxLength(6)))
      .addSubcommand((sub) => sub.setName("footer").setDescription("Set the goodbye embed footer").addStringOption((option) => option.setName("text").setDescription("Footer text").setRequired(true).setMaxLength(200)))
      .addSubcommand((sub) => sub.setName("avatar").setDescription("Show or hide the departing member avatar").addBooleanOption((option) => option.setName("show").setDescription("Show the member avatar").setRequired(true)))
      .addSubcommand((sub) => sub.setName("test").setDescription("Send a test goodbye message"))
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid, ok, er } = ctx;
  if (resolveGroup(group) !== "goodbye") return false;

  const normalizedSub = resolveSub(sub);

  if (normalizedSub === "enabled") {
    const enabled = getBooleanOption(interaction, "enabled", "estado");
    await welcomeSettings.update(gid, { goodbye_enabled: enabled });
    return ok(`Goodbye messages are now **${enabled ? "enabled" : "disabled"}**.`);
  }
  if (normalizedSub === "channel") {
    const channel = getChannelOption(interaction);
    await welcomeSettings.update(gid, { goodbye_channel: channel.id });
    return ok(`Goodbye channel set to ${channel}.`);
  }
  if (normalizedSub === "message") {
    await welcomeSettings.update(gid, { goodbye_message: getStringOption(interaction, "text", "texto") });
    return ok(`Goodbye message updated.\nAvailable variables: ${WELCOME_VARS}`);
  }
  if (normalizedSub === "title") {
    const text = getStringOption(interaction, "text", "texto");
    await welcomeSettings.update(gid, { goodbye_title: text });
    return ok(`Goodbye title updated to **${text}**.`);
  }
  if (normalizedSub === "color") {
    const hex = interaction.options.getString("hex").replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return er("Invalid color. Use a 6 character hex code like `ED4245`.");
    await welcomeSettings.update(gid, { goodbye_color: hex });
    return ok(`Goodbye color updated to **#${hex}**.`);
  }
  if (normalizedSub === "footer") {
    await welcomeSettings.update(gid, { goodbye_footer: getStringOption(interaction, "text", "texto") });
    return ok("Goodbye footer updated.");
  }
  if (normalizedSub === "avatar") {
    const show = getBooleanOption(interaction, "show", "mostrar");
    await welcomeSettings.update(gid, { goodbye_thumbnail: show });
    return ok(`Member avatar in goodbye messages: **${show ? "visible" : "hidden"}**.`);
  }
  if (normalizedSub === "test") {
    await interaction.deferReply({ flags: 64 });
    const current = await welcomeSettings.get(gid);
    if (!current?.goodbye_channel) {
      return interaction.editReply({ embeds: [E.errorEmbed("Configure a goodbye channel first with `/setup goodbye channel`.")] });
    }

    const channel = interaction.guild.channels.cache.get(current.goodbye_channel);
    if (!channel) return interaction.editReply({ embeds: [E.errorEmbed("Configured goodbye channel not found.")] });

    const fakeMember = interaction.member;
    const color = parseInt(current.goodbye_color || "ED4245", 16);
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(fill(current.goodbye_title || "See you later", fakeMember, interaction.guild))
      .setDescription(fill(current.goodbye_message || "**{user}** left the server.", fakeMember, interaction.guild))
      .setTimestamp();
    if (current.goodbye_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }));
    if (current.goodbye_footer) {
      embed.setFooter({ text: fill(current.goodbye_footer, fakeMember, interaction.guild), iconURL: interaction.guild.iconURL({ dynamic: true }) });
    }
    embed.addFields(
      { name: "User", value: interaction.user.tag, inline: true },
      { name: "User ID", value: `\`${interaction.user.id}\``, inline: true },
      { name: "Remaining members", value: `\`${interaction.guild.memberCount}\``, inline: true },
      { name: "Roles", value: "Test payload only", inline: false },
    );
    await channel.send({ embeds: [embed] });
    await interaction.editReply({ embeds: [E.successEmbed(`Test goodbye message sent to ${channel}.`)] });
    return true;
  }

  return false;
}

module.exports = { register, execute };
