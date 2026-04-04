const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
  MessageFlags,
} = require("discord.js");
const { polls } = require("../../../utils/database");
const { buildPollEmbed, buildPollButtons, LETTERS } = require("../../../handlers/pollHandler");
const E = require("../../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { localeMapFromKey } = require("../../../utils/slashLocalizations");

function getPollIdSuffix(poll) {
  const pollId = String(poll?.id || poll?._id || "");
  return pollId.slice(-6).toUpperCase();
}

function buildOptionsSummary(options) {
  return options
    .map((option, index) => `${LETTERS[index]} ${option}`)
    .join("\n");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Interactive poll system")
    .setDescriptionLocalizations(localeMapFromKey("poll.slash.description"))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new poll with up to 10 options")
        .setDescriptionLocalizations(localeMapFromKey("poll.slash.subcommands.create.description"))
        .addStringOption((option) =>
          option
            .setName("question")
            .setDescription("Poll question")
            .setDescriptionLocalizations(localeMapFromKey("poll.slash.options.pregunta"))
            .setRequired(true)
            .setMaxLength(200)
        )
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription("Options separated by |, for example: Option A | Option B")
            .setDescriptionLocalizations(localeMapFromKey("poll.slash.options.opciones"))
            .setRequired(true)
            .setMaxLength(500)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Duration, for example: 1h, 30m, 2d, 1h30m")
            .setDescriptionLocalizations(localeMapFromKey("poll.slash.options.duracion"))
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("multiple")
            .setDescription("Allow multiple votes per user")
            .setDescriptionLocalizations(localeMapFromKey("poll.slash.options.multiple"))
            .setRequired(false)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel where to publish the poll")
            .setDescriptionLocalizations(localeMapFromKey("poll.slash.options.canal"))
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("end")
        .setDescription("End a poll before it finishes")
        .setDescriptionLocalizations(localeMapFromKey("poll.slash.subcommands.end.description"))
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Poll ID, last 6 characters")
            .setDescriptionLocalizations(localeMapFromKey("poll.slash.options.id"))
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("View active polls in the server")
        .setDescriptionLocalizations(localeMapFromKey("poll.slash.subcommands.list.description"))
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const lang = resolveInteractionLanguage(interaction);
    const replyError = (message) =>
      interaction.reply({ embeds: [E.errorEmbed(message, null, lang)], flags: MessageFlags.Ephemeral });

    if (subcommand === "create") {
      const question = interaction.options.getString("question");
      const optionsRaw = interaction.options.getString("options");
      const durationInput = interaction.options.getString("duration");
      const allowMultiple = interaction.options.getBoolean("multiple") || false;
      const targetChannel = interaction.options.getChannel("channel") || interaction.channel;

      const options = optionsRaw.split("|").map((option) => option.trim()).filter(Boolean);
      if (options.length < 2) return replyError(t(lang, "poll.errors.min_options"));
      if (options.length > 10) return replyError(t(lang, "poll.errors.max_options"));
      if (options.some((option) => option.length > 80)) {
        return replyError(t(lang, "poll.errors.option_too_long"));
      }

      const durationMs = parseDuration(durationInput);
      if (!durationMs || durationMs < 60000) {
        return replyError(t(lang, "poll.errors.min_duration"));
      }
      if (durationMs > 30 * 24 * 3600000) {
        return replyError(t(lang, "poll.errors.max_duration"));
      }

      const endsAt = new Date(Date.now() + durationMs).toISOString();
      const placeholder = await targetChannel.send({ content: t(lang, "poll.placeholder") });
      const poll = await polls.create(
        guildId,
        targetChannel.id,
        placeholder.id,
        interaction.user.id,
        question,
        options,
        endsAt,
        allowMultiple
      );

      await placeholder.edit({
        content: null,
        embeds: [buildPollEmbed(poll, false, lang)],
        components: buildPollButtons(poll),
      });

      const endTimestamp = Math.floor(new Date(poll.ends_at).getTime() / 1000);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(t(lang, "poll.embed.created_title"))
            .setDescription(t(lang, "poll.embed.created_description", { channel: targetChannel }))
            .addFields(
              { name: t(lang, "poll.embed.field_question"), value: question, inline: false },
              { name: t(lang, "poll.embed.field_options"), value: buildOptionsSummary(options), inline: false },
              { name: t(lang, "poll.embed.field_ends"), value: `<t:${endTimestamp}:F>`, inline: true },
              { name: t(lang, "poll.embed.field_in"), value: `<t:${endTimestamp}:R>`, inline: true },
              { name: t(lang, "poll.embed.field_mode"), value: allowMultiple ? t(lang, "poll.embed.mode_multiple") : t(lang, "poll.embed.mode_single"), inline: true },
              { name: t(lang, "poll.embed.field_id"), value: `\`${getPollIdSuffix(poll)}\``, inline: true }
            )
            .setTimestamp(),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (subcommand === "finalizar") {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return replyError(t(lang, "poll.errors.manage_messages_required"));
      }

      const inputId = interaction.options.getString("id").toUpperCase().trim();
      const activePolls = await polls.getByGuild(guildId, false);
      const poll = activePolls.find((entry) => getPollIdSuffix(entry) === inputId);

      if (!poll) {
        return replyError(t(lang, "poll.errors.poll_not_found", { id: inputId }));
      }

      await polls.end(poll.id);

      const channel = interaction.guild.channels.cache.get(poll.channel_id);
      const message = channel ? await channel.messages.fetch(poll.message_id).catch(() => null) : null;
      if (message) {
        await message.edit({
          embeds: [buildPollEmbed({ ...poll, ended: true, ended_at: new Date().toISOString() }, true, lang)],
          components: [],
        }).catch(() => {});
      }

      return interaction.reply({
        embeds: [E.successEmbed(t(lang, "poll.success.ended", { question: poll.question }))],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (subcommand === "lista") {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const activePolls = await polls.getByGuild(guildId, false);

      if (!activePolls.length) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x5865F2)
              .setTitle(t(lang, "poll.embed.active_title"))
              .setDescription(t(lang, "poll.embed.active_empty"))
              .setTimestamp(),
          ],
        });
      }

      const description = activePolls
        .map((poll) => {
          const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
          const channel = interaction.guild.channels.cache.get(poll.channel_id);
          return (
            `**"${poll.question}"**\n` +
            `${t(lang, "common.labels.channel")}: ${channel ? `<#${poll.channel_id}>` : t(lang, "poll.embed.active_channel_deleted")} · ` +
            `${t(lang, "poll.embed.active_item_votes")}: ${totalVotes} · ` +
            `${t(lang, "poll.embed.field_ends")}: <t:${Math.floor(new Date(poll.ends_at).getTime() / 1000)}:R> · ` +
            `ID: \`${getPollIdSuffix(poll)}\``
          );
        })
        .join("\n\n");

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(t(lang, "poll.embed.active_count_title", { count: activePolls.length }))
            .setDescription(description)
            .setFooter({ text: t(lang, "poll.embed.active_footer") })
            .setTimestamp(),
        ],
      });
    }

    return replyError("Subcomando no soportado.");
  },
};

function parseDuration(input) {
  const normalized = String(input || "").toLowerCase().trim();
  const pattern = /(\d+)\s*(s|seg|m|min|minuto|minutos|h|hr|hora|horas|d|dia|dias)/g;
  let totalMs = 0;
  let match = null;

  while ((match = pattern.exec(normalized)) !== null) {
    const value = Number.parseInt(match[1], 10);
    const unit = match[2];

    if (["s", "seg"].includes(unit)) totalMs += value * 1000;
    else if (["m", "min", "minuto", "minutos"].includes(unit)) totalMs += value * 60000;
    else if (["h", "hr", "hora", "horas"].includes(unit)) totalMs += value * 3600000;
    else if (["d", "dia", "dias"].includes(unit)) totalMs += value * 86400000;
  }

  return totalMs;
}
