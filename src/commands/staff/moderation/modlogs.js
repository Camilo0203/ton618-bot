const {
  SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType,
} = require("discord.js");
const { modlogSettings, settings } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const {
  withDescriptionLocalizations,
  localizedChoice,
} = require("../../../utils/slashLocalizations");

const SUB_ALIASES = {
  activar: "enabled",
  canal: "channel",
};

const EVENT_KEYS = {
  log_bans: "bans",
  log_unbans: "unbans",
  log_kicks: "kicks",
  log_msg_delete: "message_delete",
  log_msg_edit: "message_edit",
  log_role_add: "role_add",
  log_role_remove: "role_remove",
  log_nickname: "nickname",
  log_joins: "joins",
  log_leaves: "leaves",
};

const EVENT_CHOICES = Object.entries(EVENT_KEYS).map(([value, key]) =>
  localizedChoice(value, `modlogs.slash.choices.${key}`)
);

function resolveSubcommand(sub) {
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

module.exports = {
  data: withDescriptionLocalizations(
    new SlashCommandBuilder()
      .setName("modlogs")
      .setDescription(t("en", "modlogs.slash.description"))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("setup")
            .setDescription(t("en", "modlogs.slash.subcommands.setup.description"))
            .addChannelOption((option) =>
              withDescriptionLocalizations(
                option.setName("channel").setDescription(t("en", "modlogs.slash.options.channel")).addChannelTypes(ChannelType.GuildText).setRequired(true),
                "modlogs.slash.options.channel"
              )
            ),
          "modlogs.slash.subcommands.setup.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("enabled")
            .setDescription(t("en", "modlogs.slash.subcommands.enabled.description"))
            .addBooleanOption((option) =>
              withDescriptionLocalizations(
                option.setName("enabled").setDescription(t("en", "modlogs.slash.options.enabled")).setRequired(true),
                "modlogs.slash.options.enabled"
              )
            ),
          "modlogs.slash.subcommands.enabled.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("channel")
            .setDescription(t("en", "modlogs.slash.subcommands.channel.description"))
            .addChannelOption((option) =>
              withDescriptionLocalizations(
                option.setName("channel").setDescription(t("en", "modlogs.slash.options.channel")).addChannelTypes(ChannelType.GuildText).setRequired(true),
                "modlogs.slash.options.channel"
              )
            ),
          "modlogs.slash.subcommands.channel.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("config")
            .setDescription(t("en", "modlogs.slash.subcommands.config.description"))
            .addStringOption((option) =>
              withDescriptionLocalizations(
                option.setName("event").setDescription(t("en", "modlogs.slash.options.event")).setRequired(true).addChoices(...EVENT_CHOICES),
                "modlogs.slash.options.event"
              )
            )
            .addBooleanOption((option) =>
              withDescriptionLocalizations(
                option.setName("enabled").setDescription(t("en", "modlogs.slash.options.event_enabled")).setRequired(true),
                "modlogs.slash.options.event_enabled"
              )
            ),
          "modlogs.slash.subcommands.config.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("info")
            .setDescription(t("en", "modlogs.slash.subcommands.info.description")),
          "modlogs.slash.subcommands.info.description"
        )
      ),
    "modlogs.slash.description"
  ),

  async execute(interaction) {
    const guildSettings = await settings.get(interaction.guild.id);
    const language = resolveInteractionLanguage(interaction, guildSettings);
    const sub = resolveSubcommand(interaction.options.getSubcommand());
    const gid = interaction.guild.id;
    const current = await modlogSettings.get(gid);
    const ok = (message) => interaction.reply({ embeds: [E.successEmbed(message)], flags: 64 });
    const er = (message) => interaction.reply({ embeds: [E.errorEmbed(message)], flags: 64 });
    const stateLabel = (value) => t(language, value ? "common.state.enabled" : "common.state.disabled");
    const eventLabel = (event) => t(language, `modlogs.events.${EVENT_KEYS[event] || event}`);

    if (sub === "setup") {
      const channel = getChannelOption(interaction);
      await modlogSettings.update(gid, { enabled: true, channel: channel.id });
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle(t(language, "modlogs.responses.setup_title"))
            .setDescription(t(language, "modlogs.responses.setup_description", { channel }))
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "enabled") {
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      if (enabled && !current?.channel) {
        return er(t(language, "modlogs.responses.channel_required"));
      }
      await modlogSettings.update(gid, { enabled });
      return ok(t(language, "modlogs.responses.enabled_state", { state: stateLabel(enabled) }));
    }

    if (sub === "channel") {
      const channel = getChannelOption(interaction);
      await modlogSettings.update(gid, { channel: channel.id });
      return ok(t(language, "modlogs.responses.channel_updated", { channel }));
    }

    if (sub === "config") {
      const event = interaction.options.getString("event")
        || interaction.options.getString("evento");
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      await modlogSettings.update(gid, { [event]: enabled });
      return ok(t(language, "modlogs.responses.event_state", {
        event: eventLabel(event),
        state: stateLabel(enabled),
      }));
    }

    if (sub === "info") {
      const latest = await modlogSettings.get(gid);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(t(language, "modlogs.responses.info_title"))
            .addFields(
              { name: t(language, "modlogs.fields.status"), value: stateLabel(Boolean(latest?.enabled)), inline: true },
              { name: t(language, "modlogs.fields.channel"), value: latest?.channel ? `<#${latest.channel}>` : t(language, "common.value.not_configured"), inline: true },
              { name: "\u200b", value: "\u200b", inline: true },
              { name: eventLabel("log_bans"), value: stateLabel(Boolean(latest?.log_bans)), inline: true },
              { name: eventLabel("log_unbans"), value: stateLabel(Boolean(latest?.log_unbans)), inline: true },
              { name: eventLabel("log_kicks"), value: stateLabel(Boolean(latest?.log_kicks)), inline: true },
              { name: eventLabel("log_msg_delete"), value: stateLabel(Boolean(latest?.log_msg_delete)), inline: true },
              { name: eventLabel("log_msg_edit"), value: stateLabel(Boolean(latest?.log_msg_edit)), inline: true },
              { name: eventLabel("log_role_add"), value: stateLabel(Boolean(latest?.log_role_add)), inline: true },
              { name: eventLabel("log_role_remove"), value: stateLabel(Boolean(latest?.log_role_remove)), inline: true },
              { name: eventLabel("log_nickname"), value: stateLabel(Boolean(latest?.log_nickname)), inline: true },
              { name: eventLabel("log_joins"), value: stateLabel(Boolean(latest?.log_joins)), inline: true },
              { name: eventLabel("log_leaves"), value: stateLabel(Boolean(latest?.log_leaves)), inline: true },
            )
            .setTimestamp(),
        ],
        flags: 64,
      });
    }
  },
};
