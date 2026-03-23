const { MessageFlags } = require("discord.js");
const { polls } = require("../../utils/database");
const E = require("../../utils/embeds");
const { buildPollEmbed, buildPollButtons } = require("../../handlers/pollHandler");

function parseVoteCustomId(customId = "") {
  const match = /^poll_vote_([^_]+)_(\d+)$/.exec(String(customId));
  if (!match) return null;

  return {
    pollId: match[1],
    optionId: Number.parseInt(match[2], 10),
  };
}

function buildVoteFeedback(poll, userId) {
  const selected = poll.options.filter((option) => option.votes.includes(userId));
  if (!selected.length) return "Tu voto fue retirado.";
  if (poll.allow_multiple) {
    return `Tus votos activos: ${selected.map((option) => `**${option.text}**`).join(", ")}.`;
  }
  return `Tu voto actual es **${selected[0].text}**.`;
}

module.exports = {
  customId: "poll_vote_*",
  async execute(interaction) {
    const parsed = parseVoteCustomId(interaction.customId);
    if (!parsed) {
      return interaction.reply({
        embeds: [E.errorEmbed("No se pudo interpretar el voto de la encuesta.")],
        flags: MessageFlags.Ephemeral,
      }).catch(() => {});
    }

    const poll = await polls.vote(parsed.pollId, interaction.user.id, [parsed.optionId], { toggle: true });
    if (!poll) {
      return interaction.reply({
        embeds: [E.errorEmbed("La encuesta ya no esta disponible para votar.")],
        flags: MessageFlags.Ephemeral,
      }).catch(() => {});
    }

    await interaction.update({
      embeds: [buildPollEmbed(poll)],
      components: buildPollButtons(poll),
    }).catch(() => {});

    if (typeof interaction.followUp === "function") {
      await interaction.followUp({
        embeds: [E.successEmbed(buildVoteFeedback(poll, interaction.user.id))],
        flags: MessageFlags.Ephemeral,
      }).catch(() => {});
    }
  },
};
