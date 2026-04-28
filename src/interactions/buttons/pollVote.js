const { MessageFlags } = require("discord.js");
const { polls } = require("../../utils/database");
const E = require("../../utils/embeds");
const { buildPollEmbed, buildPollButtons } = require("../../handlers/pollHandler");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

function parseVoteCustomId(customId = "") {
  const match = /^poll_vote_([^_]+)_(\d+)$/.exec(String(customId));
  if (!match) return null;

  return {
    pollId: match[1],
    optionId: Number.parseInt(match[2], 10),
  };
}

function buildVoteFeedback(poll, userId, lang) {
  const selected = poll.options.filter((option) => option.votes.includes(userId));
  if (!selected.length) return t(lang, "poll.success.vote_removed");
  
  if (poll.allow_multiple) {
    const optionsText = selected.map((option) => `**${option.text}**`).join(", ");
    return t(lang, "poll.success.vote_active_multiple", { options: optionsText });
  }
  return t(lang, "poll.success.vote_active_single", { option: selected[0].text });
}

module.exports = {
  customId: "poll_vote_*",
  async execute(interaction) {
    const lang = resolveInteractionLanguage(interaction);
    const parsed = parseVoteCustomId(interaction.customId);
    if (!parsed) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(lang, "poll.errors.interaction_error"))],
        flags: MessageFlags.Ephemeral,
      }).catch((err) => { console.error("[pollVote] suppressed error:", err?.message || err); });
    }

    // Get poll first to check requirements
    const pollBase = await polls.getByMessage(interaction.message.id);
    if (!pollBase || pollBase.ended) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(lang, "poll.errors.poll_not_found"))],
        flags: MessageFlags.Ephemeral,
      }).catch((err) => { console.error("[pollVote] suppressed error:", err?.message || err); });
    }

    // ── Check required role (Pro)
    if (pollBase.required_role && !interaction.member.roles.cache.has(pollBase.required_role)) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(lang, "poll.errors.role_required", { roleId: pollBase.required_role }))],
        flags: MessageFlags.Ephemeral,
      }).catch((err) => { console.error("[pollVote] suppressed error:", err?.message || err); });
    }

    // ── Check max votes (Pro)
    if (pollBase.allow_multiple && pollBase.max_votes) {
      const currentVotes = pollBase.options.filter(o => o.votes.includes(interaction.user.id)).length;
      const isVotingForNew = !pollBase.options.find(o => o.id === parsed.optionId).votes.includes(interaction.user.id);
      
      if (isVotingForNew && currentVotes >= pollBase.max_votes) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(lang, "poll.errors.max_votes_reached", { max: pollBase.max_votes }))],
          flags: MessageFlags.Ephemeral,
        }).catch((err) => { console.error("[pollVote] suppressed error:", err?.message || err); });
      }
    }

    const poll = await polls.vote(parsed.pollId, interaction.user.id, [parsed.optionId], { toggle: true });
    if (!poll) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(lang, "poll.errors.poll_not_found"))],
        flags: MessageFlags.Ephemeral,
      }).catch((err) => { console.error("[pollVote] suppressed error:", err?.message || err); });
    }

    await interaction.update({
      embeds: [buildPollEmbed(poll, false, lang)],
      components: buildPollButtons(poll),
    }).catch((err) => { console.error("[pollVote] suppressed error:", err?.message || err); });

    if (typeof interaction.followUp === "function") {
      await interaction.followUp({
        embeds: [E.successEmbed(buildVoteFeedback(poll, interaction.user.id, lang))],
        flags: MessageFlags.Ephemeral,
      }).catch((err) => { console.error("[pollVote] suppressed error:", err?.message || err); });
    }
  },
};
