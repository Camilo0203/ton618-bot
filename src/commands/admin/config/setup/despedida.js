const { ChannelType, EmbedBuilder } = require("discord.js");
const { settings, welcomeSettings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../../../utils/i18n");
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
  const guildSettings = await settings.get(gid);
  const language = resolveInteractionLanguage(interaction, guildSettings);

  const normalizedSub = resolveSub(sub);

  if (normalizedSub === "enabled") {
    const enabled = getBooleanOption(interaction, "enabled", "estado");
    await welcomeSettings.update(gid, { goodbye_enabled: enabled });
    return ok(t(language, "setup.goodbye.enabled_state", { state: t(language, enabled ? "common.state.enabled" : "common.state.disabled") }));
  }
  if (normalizedSub === "channel") {
    const channel = getChannelOption(interaction);
    await welcomeSettings.update(gid, { goodbye_channel: channel.id });
    return ok(t(language, "setup.goodbye.channel_set", { channel: String(channel) }));
  }
  if (normalizedSub === "message") {
    await welcomeSettings.update(gid, { goodbye_message: getStringOption(interaction, "text", "texto") });
    return ok(t(language, "setup.goodbye.message_updated", { vars: WELCOME_VARS }));
  }
  if (normalizedSub === "title") {
    const text = getStringOption(interaction, "text", "texto");
    await welcomeSettings.update(gid, { goodbye_title: text });
    return ok(t(language, "setup.goodbye.title_updated", { text }));
  }
  if (normalizedSub === "color") {
    const hex = interaction.options.getString("hex").replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return er(t(language, "setup.goodbye.invalid_color", { example: "ED4245" }));
    await welcomeSettings.update(gid, { goodbye_color: hex });
    return ok(t(language, "setup.goodbye.color_updated", { hex }));
  }
  if (normalizedSub === "footer") {
    await welcomeSettings.update(gid, { goodbye_footer: getStringOption(interaction, "text", "texto") });
    return ok(t(language, "setup.goodbye.footer_updated"));
  }
  if (normalizedSub === "avatar") {
    const show = getBooleanOption(interaction, "show", "mostrar");
    await welcomeSettings.update(gid, { goodbye_thumbnail: show });
    return ok(t(language, "setup.goodbye.avatar_state", { state: t(language, show ? "setup.goodbye.visible" : "setup.goodbye.hidden") }));
  }
  if (normalizedSub === "test") {
    await interaction.deferReply({ flags: 64 });
    const current = await welcomeSettings.get(gid);
    if (!current?.goodbye_channel) {
      return interaction.editReply({ embeds: [E.errorEmbed(t(language, "setup.goodbye.test_requires_channel"))] });
    }

    const channel = interaction.guild.channels.cache.get(current.goodbye_channel);
    if (!channel) return interaction.editReply({ embeds: [E.errorEmbed(t(language, "setup.goodbye.test_channel_missing"))] });

    const fakeMember = interaction.member;
    const color = parseInt(current.goodbye_color || "ED4245", 16);
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(fill(current.goodbye_title || t(language, "setup.goodbye.test_default_title"), fakeMember, interaction.guild))
      .setDescription(fill(current.goodbye_message || t(language, "setup.goodbye.test_default_message"), fakeMember, interaction.guild))
      .setTimestamp();
    if (current.goodbye_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }));
    if (current.goodbye_footer) {
      embed.setFooter({ text: fill(current.goodbye_footer, fakeMember, interaction.guild), iconURL: interaction.guild.iconURL({ dynamic: true }) });
    }
    embed.addFields(
      { name: t(language, "setup.goodbye.test_field_user"), value: interaction.user.tag, inline: true },
      { name: t(language, "setup.goodbye.test_field_user_id"), value: `\`${interaction.user.id}\``, inline: true },
      { name: t(language, "setup.goodbye.test_field_remaining_members"), value: `\`${interaction.guild.memberCount}\``, inline: true },
      { name: t(language, "setup.goodbye.test_field_roles"), value: t(language, "setup.goodbye.test_roles_value"), inline: false },
    );
    await channel.send({ embeds: [embed] });
    await interaction.editReply({ embeds: [E.successEmbed(t(language, "setup.goodbye.test_sent", { channel: String(channel) }))] });
    return true;
  }

  return false;
}

module.exports = { register, execute };
