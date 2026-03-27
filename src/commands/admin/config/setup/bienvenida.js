const { ChannelType, EmbedBuilder } = require("discord.js");
const { welcomeSettings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { WELCOME_VARS, fill } = require("./constants");

const GROUP_ALIASES = {
  bienvenida: "welcome",
};

const SUB_ALIASES = {
  activar: "enabled",
  canal: "channel",
  mensaje: "message",
  titulo: "title",
  color: "color",
  footer: "footer",
  banner: "banner",
  avatar: "avatar",
  dm: "dm",
  autorole: "autorole",
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

function getRoleOption(interaction, primary, legacy) {
  return interaction.options.getRole(primary)
    || interaction.options.getRole(legacy);
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("welcome")
      .setDescription("Configure welcome messages")
      .addSubcommand((sub) => sub.setName("enabled").setDescription("Enable or disable welcome messages").addBooleanOption((option) => option.setName("enabled").setDescription("Whether welcome messages stay enabled").setRequired(true)))
      .addSubcommand((sub) => sub.setName("channel").setDescription("Set the welcome channel").addChannelOption((option) => option.setName("channel").setDescription("Welcome channel").addChannelTypes(ChannelType.GuildText).setRequired(true)))
      .addSubcommand((sub) => sub.setName("message").setDescription(`Set the welcome message. Variables: ${WELCOME_VARS}`).addStringOption((option) => option.setName("text").setDescription("Message content").setRequired(true).setMaxLength(1000)))
      .addSubcommand((sub) => sub.setName("title").setDescription("Set the welcome embed title").addStringOption((option) => option.setName("text").setDescription("Embed title").setRequired(true).setMaxLength(100)))
      .addSubcommand((sub) => sub.setName("color").setDescription("Set the welcome embed color (hex, e.g. 5865F2)").addStringOption((option) => option.setName("hex").setDescription("Hex color without #").setRequired(true).setMaxLength(6)))
      .addSubcommand((sub) => sub.setName("footer").setDescription("Set the welcome embed footer").addStringOption((option) => option.setName("text").setDescription("Footer text").setRequired(true).setMaxLength(200)))
      .addSubcommand((sub) => sub.setName("banner").setDescription("Set an image banner for the welcome embed").addStringOption((option) => option.setName("url").setDescription("Image URL (https://...)").setRequired(false)))
      .addSubcommand((sub) => sub.setName("avatar").setDescription("Show or hide the new member avatar").addBooleanOption((option) => option.setName("show").setDescription("Show the member avatar").setRequired(true)))
      .addSubcommand((sub) => sub.setName("dm").setDescription("Configure welcome DMs").addBooleanOption((option) => option.setName("enabled").setDescription("Whether welcome DMs stay enabled").setRequired(true)).addStringOption((option) => option.setName("message").setDescription(`DM body. Variables: ${WELCOME_VARS}`).setRequired(false).setMaxLength(1000)))
      .addSubcommand((sub) => sub.setName("autorole").setDescription("Set the role automatically assigned on join").addRoleOption((option) => option.setName("role").setDescription("Role to assign on join (leave empty to disable)").setRequired(false)))
      .addSubcommand((sub) => sub.setName("test").setDescription("Send a test welcome message"))
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid, ok, er } = ctx;
  if (resolveGroup(group) !== "welcome") return false;

  const normalizedSub = resolveSub(sub);

  if (normalizedSub === "enabled") {
    const enabled = getBooleanOption(interaction, "enabled", "estado");
    await welcomeSettings.update(gid, { welcome_enabled: enabled });
    return ok(`Welcome messages are now **${enabled ? "enabled" : "disabled"}**.`);
  }
  if (normalizedSub === "channel") {
    const channel = getChannelOption(interaction);
    await welcomeSettings.update(gid, { welcome_channel: channel.id });
    return ok(`Welcome channel set to ${channel}.`);
  }
  if (normalizedSub === "message") {
    await welcomeSettings.update(gid, { welcome_message: getStringOption(interaction, "text", "texto") });
    return ok(`Welcome message updated.\nAvailable variables: ${WELCOME_VARS}`);
  }
  if (normalizedSub === "title") {
    const text = getStringOption(interaction, "text", "texto");
    await welcomeSettings.update(gid, { welcome_title: text });
    return ok(`Welcome title updated to **${text}**.`);
  }
  if (normalizedSub === "color") {
    const hex = interaction.options.getString("hex").replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return er("Invalid color. Use a 6 character hex code like `5865F2`.");
    await welcomeSettings.update(gid, { welcome_color: hex });
    return ok(`Welcome color updated to **#${hex}**.`);
  }
  if (normalizedSub === "footer") {
    await welcomeSettings.update(gid, { welcome_footer: getStringOption(interaction, "text", "texto") });
    return ok("Welcome footer updated.");
  }
  if (normalizedSub === "banner") {
    const url = interaction.options.getString("url");
    if (url && !url.startsWith("http")) return er("The URL must start with `https://`.");
    await welcomeSettings.update(gid, { welcome_banner: url || null });
    return ok(url ? "Welcome banner configured." : "Welcome banner removed.");
  }
  if (normalizedSub === "avatar") {
    const show = getBooleanOption(interaction, "show", "mostrar");
    await welcomeSettings.update(gid, { welcome_thumbnail: show });
    return ok(`Member avatar in welcome messages: **${show ? "visible" : "hidden"}**.`);
  }
  if (normalizedSub === "dm") {
    const enabled = getBooleanOption(interaction, "enabled", "estado");
    const message = getStringOption(interaction, "message", "mensaje");
    const update = { welcome_dm: enabled };
    if (message) update.welcome_dm_message = message;
    await welcomeSettings.update(gid, update);
    return ok(`Welcome DM is now **${enabled ? "enabled" : "disabled"}**.${message ? "\nThe DM body was updated as well." : ""}`);
  }
  if (normalizedSub === "autorole") {
    const role = getRoleOption(interaction, "role", "rol");
    await welcomeSettings.update(gid, { welcome_autorole: role ? role.id : null });
    return ok(role ? `Auto role configured: ${role}` : "Auto role disabled.");
  }
  if (normalizedSub === "test") {
    await interaction.deferReply({ flags: 64 });
    const current = await welcomeSettings.get(gid);
    if (!current?.welcome_channel) {
      return interaction.editReply({ embeds: [E.errorEmbed("Configure a welcome channel first with `/setup welcome channel`.")] });
    }

    const channel = interaction.guild.channels.cache.get(current.welcome_channel);
    if (!channel) return interaction.editReply({ embeds: [E.errorEmbed("Configured welcome channel not found.")] });

    const fakeMember = interaction.member;
    const color = parseInt(current.welcome_color || "5865F2", 16);
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(fill(current.welcome_title || "Welcome!", fakeMember, interaction.guild))
      .setDescription(fill(current.welcome_message || "Welcome {mention}!", fakeMember, interaction.guild))
      .setTimestamp();
    if (current.welcome_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }));
    if (current.welcome_banner) embed.setImage(current.welcome_banner);
    if (current.welcome_footer) {
      embed.setFooter({ text: fill(current.welcome_footer, fakeMember, interaction.guild), iconURL: interaction.guild.iconURL({ dynamic: true }) });
    }
    embed.addFields(
      { name: "User", value: interaction.user.tag, inline: true },
      { name: "Account created", value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: "Member count", value: `\`${interaction.guild.memberCount}\``, inline: true },
    );
    await channel.send({ content: `<@${interaction.user.id}> *(test message)*`, embeds: [embed] });
    await interaction.editReply({ embeds: [E.successEmbed(`Test welcome message sent to ${channel}.`)] });
    return true;
  }

  return false;
}

module.exports = { register, execute };
