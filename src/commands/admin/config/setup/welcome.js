"use strict";

const { ChannelType, EmbedBuilder } = require("discord.js");
const { settings, welcomeSettings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { resolveInteractionLanguage } = require("../../../../utils/i18n");
const { withDescriptionLocalizations } = require("../../../../utils/slashLocalizations");
const { setupT } = require("./i18n");
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
  return interaction.options.getChannel("channel") || interaction.options.getChannel("canal");
}

function getBooleanOption(interaction, primary, legacy) {
  return interaction.options.getBoolean(primary) ?? interaction.options.getBoolean(legacy);
}

function getStringOption(interaction, primary, legacy) {
  return interaction.options.getString(primary) ?? interaction.options.getString(legacy);
}

function getRoleOption(interaction, primary, legacy) {
  return interaction.options.getRole(primary) || interaction.options.getRole(legacy);
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    withDescriptionLocalizations(
      group
        .setName("welcome")
        .setDescription(setupT("en", "welcome.group_description") || "Configure the welcome message system")
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("enabled")
              .setDescription("Enable or disable welcome messages")
              .addBooleanOption((option) =>
                option
                  .setName("enabled")
                  .setDescription("Whether welcome messages are active")
                  .setRequired(true)
              ),
            "setup.welcome.enabled_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("channel")
              .setDescription("Set the channel used for welcome messages")
              .addChannelOption((option) =>
                option
                  .setName("channel")
                  .setDescription("Welcome channel")
                  .addChannelTypes(ChannelType.GuildText)
                  .setRequired(true)
              ),
            "setup.welcome.channel_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("message")
              .setDescription("Set the embed description for welcome messages")
              .addStringOption((option) =>
                option
                  .setName("text")
                  .setDescription("Welcome message text")
                  .setRequired(true)
                  .setMaxLength(1000)
              ),
            "setup.welcome.message_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("title")
              .setDescription("Set the embed title for welcome messages")
              .addStringOption((option) =>
                option
                  .setName("text")
                  .setDescription("Title text")
                  .setRequired(true)
                  .setMaxLength(100)
              ),
            "setup.welcome.title_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("color")
              .setDescription("Set the hex color for the welcome embed")
              .addStringOption((option) =>
                option.setName("hex").setDescription("Hex color code").setRequired(true).setMaxLength(6)
              ),
            "setup.welcome.color_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("footer")
              .setDescription("Set the footer text for the welcome embed")
              .addStringOption((option) =>
                option
                  .setName("text")
                  .setDescription("Footer text")
                  .setRequired(true)
                  .setMaxLength(200)
              ),
            "setup.welcome.footer_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("avatar")
              .setDescription("Show or hide the member avatar in the welcome embed")
              .addBooleanOption((option) =>
                option.setName("show").setDescription("Whether to show the avatar").setRequired(true)
              ),
            "setup.welcome.avatar_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub.setName("test").setDescription("Send a test welcome message to the configured channel"),
            "setup.welcome.test_description"
          )
        ),
      "setup.welcome.group_description"
    )
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
    return ok(
      setupT(language, "welcome.enabled_state", {
        state: setupT(language, enabled ? "general.common.enabled" : "general.common.disabled"),
      })
    );
  }

  if (normalizedSub === "channel") {
    const channel = getChannelOption(interaction);
    await welcomeSettings.update(gid, { welcome_channel: channel.id });
    return ok(setupT(language, "welcome.channel_set", { channel: channel.toString() }));
  }

  if (normalizedSub === "message") {
    await welcomeSettings.update(gid, { welcome_message: getStringOption(interaction, "text", "texto") });
    return ok(setupT(language, "welcome.message_updated", { vars: WELCOME_VARS }));
  }

  if (normalizedSub === "title") {
    const text = getStringOption(interaction, "text", "texto");
    await welcomeSettings.update(gid, { welcome_title: text });
    return ok(setupT(language, "welcome.title_updated", { text }));
  }

  if (normalizedSub === "color") {
    const hex = interaction.options.getString("hex").replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex))
      return er(setupT(language, "welcome.invalid_color", { example: "5865F2" }));
    await welcomeSettings.update(gid, { welcome_color: hex });
    return ok(setupT(language, "welcome.color_updated", { hex }));
  }

  if (normalizedSub === "footer") {
    await welcomeSettings.update(gid, { welcome_footer: getStringOption(interaction, "text", "texto") });
    return ok(setupT(language, "welcome.footer_updated"));
  }

  if (normalizedSub === "avatar") {
    const show = getBooleanOption(interaction, "show", "mostrar");
    await welcomeSettings.update(gid, { welcome_thumbnail: show });
    return ok(
      setupT(language, "welcome.avatar_state", {
        state: setupT(language, show ? "welcome.visible" : "welcome.hidden"),
      })
    );
  }

  if (normalizedSub === "test") {
    await interaction.deferReply({ flags: 64 });
    const current = await welcomeSettings.get(gid);
    if (!current?.welcome_channel) {
      return interaction.editReply({
        embeds: [E.errorEmbed(setupT(language, "welcome.test_requires_channel"))],
      });
    }

    const channel = interaction.guild.channels.cache.get(current.welcome_channel);
    if (!channel)
      return interaction.editReply({
        embeds: [E.errorEmbed(setupT(language, "welcome.test_channel_missing"))],
      });

    const fakeMember = interaction.member;
    const color = parseInt(current.welcome_color || "5865F2", 16);
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(
        fill(
          current.welcome_title || setupT(language, "welcome.test_default_title"),
          fakeMember,
          interaction.guild
        )
      )
      .setDescription(
        fill(
          current.welcome_message || setupT(language, "welcome.test_default_message"),
          fakeMember,
          interaction.guild
        )
      )
      .setTimestamp();

    if (current.welcome_thumbnail !== false)
      embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }));
    if (current.welcome_banner) embed.setImage(current.welcome_banner);
    if (current.welcome_footer) {
      embed.setFooter({
        text: fill(current.welcome_footer, fakeMember, interaction.guild),
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });
    }

    embed.addFields(
      { name: setupT(language, "welcome.test_field_user"), value: interaction.user.tag, inline: true },
      {
        name: setupT(language, "welcome.test_field_account_created"),
        value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
      {
        name: setupT(language, "welcome.test_field_member_count"),
        value: `\`${interaction.guild.memberCount}\``,
        inline: true,
      }
    );

    await channel.send({
      content: `<@${interaction.user.id}> ${setupT(language, "welcome.test_message_suffix")}`,
      embeds: [embed],
    });
    await interaction.editReply({
      embeds: [E.successEmbed(setupT(language, "welcome.test_sent", { channel: channel.toString() }))],
    });
    return true;
  }

  return false;
}

module.exports = { register, execute };
