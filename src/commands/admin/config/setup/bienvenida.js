const { ChannelType, EmbedBuilder } = require("discord.js");
const { settings, welcomeSettings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../../../utils/i18n");
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
  const guildSettings = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, guildSettings);

  const normalizedSub = resolveSub(sub);

  if (normalizedSub === "enabled") {
    const enabled = getBooleanOption(interaction, "enabled", "estado");
    await welcomeSettings.update(gid, { welcome_enabled: enabled });
    return ok(t(language, "setup.welcome.enabled_state", { state: t(language, enabled ? "common.state.enabled" : "common.state.disabled") }));
  }
  if (normalizedSub === "channel") {
    const channel = getChannelOption(interaction);
    await welcomeSettings.update(gid, { welcome_channel: channel.id });
    return ok(t(language, "setup.welcome.channel_set", { channel: String(channel) }));
  }
  if (normalizedSub === "message") {
    await welcomeSettings.update(gid, { welcome_message: getStringOption(interaction, "text", "texto") });
    return ok(t(language, "setup.welcome.message_updated", { vars: WELCOME_VARS }));
  }
  if (normalizedSub === "title") {
    const text = getStringOption(interaction, "text", "texto");
    await welcomeSettings.update(gid, { welcome_title: text });
    return ok(t(language, "setup.welcome.title_updated", { text }));
  }
  if (normalizedSub === "color") {
    const hex = interaction.options.getString("hex").replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return er(t(language, "setup.welcome.invalid_color", { example: "5865F2" }));
    await welcomeSettings.update(gid, { welcome_color: hex });
    return ok(t(language, "setup.welcome.color_updated", { hex }));
  }
  if (normalizedSub === "footer") {
    await welcomeSettings.update(gid, { welcome_footer: getStringOption(interaction, "text", "texto") });
    return ok(t(language, "setup.welcome.footer_updated"));
  }
  if (normalizedSub === "banner") {
    const url = interaction.options.getString("url");
    if (url && !url.startsWith("http")) return er(t(language, "setup.welcome.invalid_url"));
    await welcomeSettings.update(gid, { welcome_banner: url || null });
    return ok(t(language, url ? "setup.welcome.banner_configured" : "setup.welcome.banner_removed"));
  }
  if (normalizedSub === "avatar") {
    const show = getBooleanOption(interaction, "show", "mostrar");
    await welcomeSettings.update(gid, { welcome_thumbnail: show });
    return ok(t(language, "setup.welcome.avatar_state", { state: t(language, show ? "setup.welcome.visible" : "setup.welcome.hidden") }));
  }
  if (normalizedSub === "dm") {
    const enabled = getBooleanOption(interaction, "enabled", "estado");
    const message = getStringOption(interaction, "message", "mensaje");
    const update = { welcome_dm: enabled };
    if (message) update.welcome_dm_message = message;
    await welcomeSettings.update(gid, update);
    return ok(t(language, "setup.welcome.dm_state", {
      state: t(language, enabled ? "common.state.enabled" : "common.state.disabled"),
      messageNote: message ? t(language, "setup.welcome.dm_message_note") : "",
    }));
  }
  if (normalizedSub === "autorole") {
    const role = getRoleOption(interaction, "role", "rol");
    await welcomeSettings.update(gid, { welcome_autorole: role ? role.id : null });
    return ok(role ? t(language, "setup.welcome.autorole_set", { role: String(role) }) : t(language, "setup.welcome.autorole_disabled"));
  }
  if (normalizedSub === "test") {
    await interaction.deferReply({ flags: 64 });
    const current = await welcomeSettings.get(gid);
    if (!current?.welcome_channel) {
      return interaction.editReply({ embeds: [E.errorEmbed(t(language, "setup.welcome.test_requires_channel"))] });
    }

    const channel = interaction.guild.channels.cache.get(current.welcome_channel);
    if (!channel) return interaction.editReply({ embeds: [E.errorEmbed(t(language, "setup.welcome.test_channel_missing"))] });

    const fakeMember = interaction.member;
    const color = parseInt(current.welcome_color || "5865F2", 16);
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(fill(current.welcome_title || t(language, "setup.welcome.test_default_title"), fakeMember, interaction.guild))
      .setDescription(fill(current.welcome_message || t(language, "setup.welcome.test_default_message"), fakeMember, interaction.guild))
      .setTimestamp();
    if (current.welcome_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }));
    if (current.welcome_banner) embed.setImage(current.welcome_banner);
    if (current.welcome_footer) {
      embed.setFooter({ text: fill(current.welcome_footer, fakeMember, interaction.guild), iconURL: interaction.guild.iconURL({ dynamic: true }) });
    }
    embed.addFields(
      { name: t(language, "setup.welcome.test_field_user"), value: interaction.user.tag, inline: true },
      { name: t(language, "setup.welcome.test_field_account_created"), value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: t(language, "setup.welcome.test_field_member_count"), value: `\`${interaction.guild.memberCount}\``, inline: true },
    );
    await channel.send({ content: `<@${interaction.user.id}> ${t(language, "setup.welcome.test_message_suffix")}`, embeds: [embed] });
    await interaction.editReply({ embeds: [E.successEmbed(t(language, "setup.welcome.test_sent", { channel: String(channel) }))] });
    return true;
  }

  return false;
}

module.exports = { register, execute };
