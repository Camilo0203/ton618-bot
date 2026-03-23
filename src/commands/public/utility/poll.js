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
    .setDescription("Sistema de encuestas interactivas")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("crear")
        .setDescription("Crear una nueva encuesta con hasta 10 opciones")
        .addStringOption((option) =>
          option.setName("pregunta").setDescription("Pregunta de la encuesta").setRequired(true).setMaxLength(200)
        )
        .addStringOption((option) =>
          option
            .setName("opciones")
            .setDescription("Opciones separadas por |, por ejemplo: Opcion A | Opcion B")
            .setRequired(true)
            .setMaxLength(500)
        )
        .addStringOption((option) =>
          option.setName("duracion").setDescription("Duracion, por ejemplo: 1h, 30m, 2d, 1h30m").setRequired(true)
        )
        .addBooleanOption((option) =>
          option.setName("multiple").setDescription("Permitir varios votos por usuario").setRequired(false)
        )
        .addChannelOption((option) =>
          option
            .setName("canal")
            .setDescription("Canal donde publicar la encuesta")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("finalizar")
        .setDescription("Finalizar una encuesta antes de que termine")
        .addStringOption((option) =>
          option.setName("id").setDescription("ID de la encuesta, ultimos 6 caracteres").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lista")
        .setDescription("Ver encuestas activas en el servidor")
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const replyError = (message) =>
      interaction.reply({ embeds: [E.errorEmbed(message)], flags: MessageFlags.Ephemeral });

    if (subcommand === "crear") {
      const question = interaction.options.getString("pregunta");
      const optionsRaw = interaction.options.getString("opciones");
      const durationInput = interaction.options.getString("duracion");
      const allowMultiple = interaction.options.getBoolean("multiple") || false;
      const targetChannel = interaction.options.getChannel("canal") || interaction.channel;

      const options = optionsRaw.split("|").map((option) => option.trim()).filter(Boolean);
      if (options.length < 2) return replyError("Necesitas al menos 2 opciones separadas por `|`.");
      if (options.length > 10) return replyError("Maximo 10 opciones por encuesta.");
      if (options.some((option) => option.length > 80)) {
        return replyError("Cada opcion puede tener maximo 80 caracteres.");
      }

      const durationMs = parseDuration(durationInput);
      if (!durationMs || durationMs < 60000) {
        return replyError("Duracion minima: 1 minuto. Ejemplos: `30m`, `2h`, `1d`, `1h30m`.");
      }
      if (durationMs > 30 * 24 * 3600000) {
        return replyError("Duracion maxima: 30 dias.");
      }

      const endsAt = new Date(Date.now() + durationMs).toISOString();
      const placeholder = await targetChannel.send({ content: "Creando encuesta..." });
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
        embeds: [buildPollEmbed(poll)],
        components: buildPollButtons(poll),
      });

      const endTimestamp = Math.floor(new Date(poll.ends_at).getTime() / 1000);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("Encuesta creada")
            .setDescription(`Tu encuesta fue publicada en ${targetChannel}.`)
            .addFields(
              { name: "Pregunta", value: question, inline: false },
              { name: "Opciones", value: buildOptionsSummary(options), inline: false },
              { name: "Termina", value: `<t:${endTimestamp}:F>`, inline: true },
              { name: "En", value: `<t:${endTimestamp}:R>`, inline: true },
              { name: "Modo", value: allowMultiple ? "Voto multiple" : "Un voto", inline: true },
              { name: "ID", value: `\`${getPollIdSuffix(poll)}\``, inline: true }
            )
            .setTimestamp(),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (subcommand === "finalizar") {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return replyError("Necesitas permiso de Gestionar Mensajes para finalizar encuestas.");
      }

      const inputId = interaction.options.getString("id").toUpperCase().trim();
      const activePolls = await polls.getByGuild(guildId, false);
      const poll = activePolls.find((entry) => getPollIdSuffix(entry) === inputId);

      if (!poll) {
        return replyError(`No se encontro la encuesta \`${inputId}\`. Usa \`/poll lista\` para ver las activas.`);
      }

      await polls.end(poll.id);

      const channel = interaction.guild.channels.cache.get(poll.channel_id);
      const message = channel ? await channel.messages.fetch(poll.message_id).catch(() => null) : null;
      if (message) {
        await message.edit({
          embeds: [buildPollEmbed({ ...poll, ended: true, ended_at: new Date().toISOString() }, true)],
          components: [],
        }).catch(() => {});
      }

      return interaction.reply({
        embeds: [E.successEmbed(`Encuesta **"${poll.question}"** finalizada.`)],
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
              .setTitle("Encuestas activas")
              .setDescription("No hay encuestas activas en este momento.\nCrea una con `/poll crear`.")
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
            `Canal: ${channel ? `<#${poll.channel_id}>` : "Canal eliminado"} · ` +
            `Votos: ${totalVotes} · ` +
            `Termina: <t:${Math.floor(new Date(poll.ends_at).getTime() / 1000)}:R> · ` +
            `ID: \`${getPollIdSuffix(poll)}\``
          );
        })
        .join("\n\n");

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`Encuestas activas (${activePolls.length})`)
            .setDescription(description)
            .setFooter({ text: "Usa /poll finalizar [ID] para cerrar una manualmente" })
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
