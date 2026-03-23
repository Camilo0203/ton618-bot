const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const LETTERS = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯"];
const BAR_FULL = "█";
const BAR_EMPTY = "░";

function getPollId(poll) {
  return String(poll?.id || poll?._id || "");
}

function buildPollEmbed(poll, ended = false) {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
  const highestVoteCount = Math.max(0, ...poll.options.map((option) => option.votes.length));

  const optionsText = poll.options
    .map((option, index) => {
      const count = option.votes.length;
      const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
      const barLength = Math.round(percentage / 10);
      const bar = BAR_FULL.repeat(barLength) + BAR_EMPTY.repeat(10 - barLength);
      const winnerPrefix = ended && count === highestVoteCount && count > 0 ? "🏆 " : "";
      return `${LETTERS[index]} **${option.text}**\n${winnerPrefix}\`${bar}\` **${percentage}%** (${count} voto${count !== 1 ? "s" : ""})`;
    })
    .join("\n\n");

  const endsAt = new Date(poll.ends_at);
  const pollId = getPollId(poll);
  const embed = new EmbedBuilder()
    .setColor(ended ? 0x57F287 : 0x5865F2)
    .setTitle(`${ended ? "📊 [FINALIZADA]" : "📊"} ${poll.question}`)
    .setDescription(optionsText || "Sin opciones")
    .addFields(
      { name: "Total votos", value: `\`${totalVotes}\``, inline: true },
      {
        name: ended ? "Estado" : "Termina",
        value: ended ? "Finalizada" : `<t:${Math.floor(endsAt.getTime() / 1000)}:R>`,
        inline: true,
      },
      { name: "Creada por", value: `<@${poll.creator_id}>`, inline: true }
    )
    .setTimestamp();

  if (ended) {
    embed.setFooter({ text: `Encuesta finalizada • ID: ${pollId.slice(-6)}` });
  } else {
    embed.setFooter({
      text: `${poll.allow_multiple ? "Puedes votar por varias opciones" : "Solo un voto por persona"} • ID: ${pollId.slice(-6)}`,
    });
  }

  return embed;
}

function buildPollButtons(poll) {
  const pollId = getPollId(poll);
  const rows = [];
  const chunkSize = 5;

  for (let index = 0; index < poll.options.length; index += chunkSize) {
    const row = new ActionRowBuilder();
    const chunk = poll.options.slice(index, index + chunkSize);

    for (const option of chunk) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`poll_vote_${pollId}_${option.id}`)
          .setLabel(option.text.substring(0, 20))
          .setEmoji(LETTERS[option.id])
          .setStyle(ButtonStyle.Primary)
      );
    }

    rows.push(row);
  }

  return rows;
}

module.exports = {
  buildPollEmbed,
  buildPollButtons,
  LETTERS,
};
