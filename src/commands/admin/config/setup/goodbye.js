"use strict";

const { ChannelType, EmbedBuilder } = require("discord.js");
const { settings, welcomeSettings } = require("../../../../utils/database");
const E = require("../../../../utils/embeds");
const { resolveInteractionLanguage } = require("../../../../utils/i18n");
const { withDescriptionLocalizations } = require("../../../../utils/slashLocalizations");
const { setupT } = require("./i18n");
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
  return interaction.options.getChannel("channel") || interaction.options.getChannel("canal");
}

function getBooleanOption(interaction, primary, legacy) {
  return interaction.options.getBoolean(primary) ?? interaction.options.getBoolean(legacy);
}

function getStringOption(interaction, primary, legacy) {
  return interaction.options.getString(primary) ?? interaction.options.getString(legacy);
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    withDescriptionLocalizations(
      group
        .setName("goodbye")
        .setDescription(setupT("en", "goodbye.group_description") || "Configure the goodbye system for leaving members")
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("enabled")
              .setDescription("Enable or disable goodbye messages")
              .addBooleanOption((option) =>
                option
                  .setName("enabled")
                  .setDescription("Whether goodbye messages are active")
                  .setRequired(true)
              ),
            "setup.goodbye.enabled_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("channel")
              .setDescription("Set the channel used for goodbye messages")
              .addChannelOption((option) =>
                option
                  .setName("channel")
                  .setDescription("Goodbye channel")
                  .addChannelTypes(ChannelType.GuildText)
                  .setRequired(true)
              ),
            "setup.goodbye.channel_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("message")
              .setDescription("Set the embed description for goodbye messages")
              .addStringOption((option) =>
                option
                  .setName("text")
                  .setDescription("Goodbye message text")
                  .setRequired(true)
                  .setMaxLength(1000)
              ),
            "setup.goodbye.message_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("title")
              .setDescription("Set the embed title for goodbye messages")
              .addStringOption((option) =>
                option
                  .setName("text")
                  .setDescription("Title text")
                  .setRequired(true)
                  .setMaxLength(100)
              ),
            "setup.goodbye.title_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("color")
              .setDescription("Set the hex color for the goodbye embed")
              .addStringOption((option) =>
                option.setName("hex").setDescription("Hex color code").setRequired(true).setMaxLength(6)
              ),
            "setup.goodbye.color_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("footer")
              .setDescription("Set the footer text for the goodbye embed")
              .addStringOption((option) =>
                option
                  .setName("text")
                  .setDescription("Footer text")
                  .setRequired(true)
                  .setMaxLength(200)
              ),
            "setup.goodbye.footer_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("avatar")
              .setDescription("Show or hide the member avatar in the goodbye embed")
              .addBooleanOption((option) =>
                option.setName("show").setDescription("Whether to show the avatar").setRequired(true)
              ),
            "setup.goodbye.avatar_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub.setName("test").setDescription("Send a test goodbye message to the configured channel"),
            "setup.goodbye.test_description"
          )
        ),
      "setup.goodbye.group_description"
    )
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
    return ok(
      setupT(language, "goodbye.enabled_state", {
        state: setupT(language, enabled ? "general.common.enabled" : "general.common.disabled"),
      })
    );
  }

  if (normalizedSub === "channel") {
    const channel = getChannelOption(interaction);
    await welcomeSettings.update(gid, { goodbye_channel: channel.id });
    return ok(setupT(language, "goodbye.channel_set", { channel: channel.toString() }));
  }

  if (normalizedSub === "message") {
    await welcomeSettings.update(gid, { goodbye_message: getStringOption(interaction, "text", "texto") });
    return ok(setupT(language, "goodbye.message_updated", { vars: WELCOME_VARS }));
  }

  if (normalizedSub === "title") {
    const text = getStringOption(interaction, "text", "texto");
    await welcomeSettings.update(gid, { goodbye_title: text });
    return ok(setupT(language, "goodbye.title_updated", { text }));
  }

  if (normalizedSub === "color") {
    const hex = interaction.options.getString("hex").replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex))
      return er(setupT(language, "goodbye.invalid_color", { example: "ED4245" }));
    await welcomeSettings.update(gid, { goodbye_color: hex });
    return ok(setupT(language, "goodbye.color_updated", { hex }));
  }

  if (normalizedSub === "footer") {
    await welcomeSettings.update(gid, { goodbye_footer: getStringOption(interaction, "text", "texto") });
    return ok(setupT(language, "goodbye.footer_updated"));
  }

  if (normalizedSub === "avatar") {
    const show = getBooleanOption(interaction, "show", "mostrar");
    await welcomeSettings.update(gid, { goodbye_thumbnail: show });
    return ok(
      setupT(language, "goodbye.avatar_state", {
        state: setupT(language, show ? "goodbye.visible" : "goodbye.hidden"),
      })
    );
  }

  if (normalizedSub === "test") {
    await interaction.deferReply({ flags: 64 });
    const current = await welcomeSettings.get(gid);
    if (!current?.goodbye_channel) {
      return interaction.editReply({
        embeds: [E.errorEmbed(setupT(language, "goodbye.test_requires_channel"))],
      });
    }

    const channel = interaction.guild.channels.cache.get(current.goodbye_channel);
    if (!channel)
      return interaction.editReply({
        embeds: [E.errorEmbed(setupT(language, "goodbye.test_channel_missing"))],
      });

    const fakeMember = interaction.member;
    const color = parseInt(current.goodbye_color || "ED4245", 16);
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(
        fill(
          current.goodbye_title || setupT(language, "goodbye.test_default_title"),
          fakeMember,
          interaction.guild
        )
      )
      .setDescription(
        fill(
          current.goodbye_message || setupT(language, "goodbye.test_default_message"),
          fakeMember,
          interaction.guild
        )
      )
      .setTimestamp();

    if (current.goodbye_thumbnail !== false)
      embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }));
    if (current.goodbye_footer) {
      embed.setFooter({
        text: fill(current.goodbye_footer, fakeMember, interaction.guild),
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      });
    }

    embed.addFields(
      { name: setupT(language, "goodbye.test_field_user"), value: interaction.user.tag, inline: true },
      { name: setupT(language, "goodbye.test_field_user_id"), value: `\`${interaction.user.id}\``, inline: true },
      {
        name: setupT(language, "goodbye.test_field_remaining_members"),
        value: `\`${interaction.guild.memberCount}\``,
        inline: true,
      },
      {
        name: setupT(language, "goodbye.test_field_roles"),
        value: setupT(language, "goodbye.test_roles_value"),
        inline: false,
      }
    );

    await channel.send({ embeds: [embed] });
    await interaction.editReply({
      embeds: [E.successEmbed(setupT(language, "goodbye.test_sent", { channel: channel.toString() }))],
    });
    return true;
  }

  return false;
}

module.exports = { register, execute };
