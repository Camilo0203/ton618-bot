"use strict";

const { ChannelType, EmbedBuilder } = require("discord.js");
const { getDB } = require("../../../../utils/database");
const { setupT } = require("./i18n");
const { withDescriptionLocalizations, withInlineDescriptionLocalizations } = require("../../../../utils/slashLocalizations");
const logger = require("../../../../utils/structuredLogger");

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
  return interaction.options.getChannel("channel") || interaction.options.getChannel("canal");
}

function getRoleOption(interaction) {
  return interaction.options.getRole("role") || interaction.options.getRole("rol");
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    withDescriptionLocalizations(
      group
        .setName("confessions")
        .setDescription(setupT("en", "confessions.group_description") || "Configure anonymous confessions")
        .addSubcommand((sub) =>
          withDescriptionLocalizations(
            sub
              .setName("configure")
              .setDescription("Set the channel and role used for confessions")
              .addChannelOption((option) =>
                withInlineDescriptionLocalizations(
                  option
                    .setName("channel")
                    .setDescription("Channel where confessions are posted")
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText),
                  "Channel where confessions are posted",
                  "Canal donde se publican las confesiones"
                )
              )
              .addRoleOption((option) =>
                withInlineDescriptionLocalizations(
                  option
                    .setName("role")
                    .setDescription("Role required to use confessions")
                    .setRequired(true),
                  "Role required to use confessions",
                  "Rol requerido para usar confesiones"
                )
              ),
            "setup.confessions.configure_description"
          )
        ),
      "setup.confessions.group_description"
    )
  );
}

async function execute(ctx) {
  const { interaction, group, sub, gid, language } = ctx;
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
      { upsert: true }
    );

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle(setupT(language, "confessions.configured_title"))
      .setDescription(
        setupT(language, "confessions.configured_description", {
          channel: channel.toString(),
          role: role.toString(),
        })
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });
  } catch (error) {
    logger.error('setup.confessions', 'Setup error', { error: error?.message || String(error) });
    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle(setupT(language, "confessions.error_title"))
      .setDescription(setupT(language, "confessions.error_description"))
      .setTimestamp();
    await interaction.reply({ embeds: [embed], flags: 64 });
  }

  return true;
}

module.exports = { register, execute };
