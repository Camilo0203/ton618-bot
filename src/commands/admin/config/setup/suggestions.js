"use strict";

const { ChannelType, EmbedBuilder } = require("discord.js");
const { suggestSettings } = require("../../../../utils/database");
const { setupT } = require("./i18n");
const { withDescriptionLocalizations, withInlineDescriptionLocalizations } = require("../../../../utils/slashLocalizations");

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
  return interaction.options.getBoolean("enabled") ?? interaction.options.getBoolean("estado");
}

function getChannelOption(interaction) {
  return interaction.options.getChannel("channel") || interaction.options.getChannel("sugerencias");
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    withDescriptionLocalizations(
      group
        .setName("suggestions")
        .setDescription(setupT("en", "suggestions.group_description") || "Configure the suggestions system")
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("enabled")
              .setDescription("Enable or disable suggestions")
              .addBooleanOption((option) =>
                withInlineDescriptionLocalizations(
                  option
                    .setName("enabled")
                    .setDescription("Whether suggestions stay enabled")
                    .setRequired(true),
                  "Whether suggestions stay enabled",
                  "Si las sugerencias deben quedar activas"
                )
              ),
            "setup.suggestions.enabled_description"
          )
        )
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("channel")
              .setDescription("Set the channel used for suggestions")
              .addChannelOption((option) =>
                withInlineDescriptionLocalizations(
                  option
                    .setName("channel")
                    .setDescription("Suggestions channel")
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true),
                  "Suggestions channel",
                  "Canal de sugerencias"
                )
              ),
            "setup.suggestions.channel_description"
          )
        ),
      "setup.suggestions.group_description"
    )
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid, language } = ctx;
  if (resolveGroup(group) !== "suggestions") return false;

  const normalizedSub = resolveSub(sub);

  if (normalizedSub === "enabled") {
    const enabled = getEnabledOption(interaction);
    await suggestSettings.update(gid, { enabled });

    const embed = new EmbedBuilder()
      .setColor(enabled ? 0x57f287 : 0xed4245)
      .setTitle(
        setupT(language, enabled ? "suggestions.enabled_title" : "suggestions.disabled_title")
      )
      .setDescription(
        setupT(language, enabled ? "suggestions.enabled_description" : "suggestions.disabled_description")
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });
    return true;
  }

  if (normalizedSub === "channel") {
    const channel = getChannelOption(interaction);
    await suggestSettings.update(gid, { channel: channel.id });

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle(setupT(language, "suggestions.channel_updated_title"))
      .setDescription(
        setupT(language, "suggestions.channel_updated_description", { channel: channel.toString() })
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });
    return true;
  }

  return false;
}

module.exports = { register, execute };
