const { MessageFlags, EmbedBuilder } = require("discord.js");
const { giveaways, levels } = require("../../utils/database");
const E = require("../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

function parseGiveawayCustomId(customId = "") {
  const match = /^giveaway_enter_(.+)$/.exec(String(customId));
  if (!match) return null;
  return { messageId: match[1] };
}

async function checkRequirements(giveaway, member, user, lang) {
  const requirements = giveaway.requirements || { type: "none" };

  if (requirements.type === "none") {
    return { valid: true };
  }

  if (requirements.type === "role" && requirements.role_id) {
    if (!member.roles.cache.has(requirements.role_id)) {
      return {
        valid: false,
        message: t(lang, "giveaway.errors.requirement_role", { role: `<@&${requirements.role_id}>` })
      };
    }
  }

  if (requirements.type === "level" && requirements.min_level) {
    const userLevel = await levels.get(member.guild.id, user.id);
    if (!userLevel || userLevel.level < requirements.min_level) {
      return {
        valid: false,
        message: t(lang, "giveaway.errors.requirement_level", { level: requirements.min_level })
      };
    }
  }

  if (requirements.type === "account_age" && requirements.min_account_age_days) {
    const accountAge = Date.now() - user.createdTimestamp;
    const requiredAge = requirements.min_account_age_days * 24 * 60 * 60 * 1000;
    if (accountAge < requiredAge) {
      return {
        valid: false,
        message: t(lang, "giveaway.errors.requirement_age", { days: requirements.min_account_age_days })
      };
    }
  }

  return { valid: true };
}

module.exports = {
  customId: "giveaway_enter_*",
  async execute(interaction) {
    const parsed = parseGiveawayCustomId(interaction.customId);
    if (!parsed) {
      return interaction.reply({
        embeds: [E.errorEmbed("No se pudo interpretar la acción del sorteo.")],
        flags: MessageFlags.Ephemeral,
      }).catch(() => {});
    }

    const guildSettings = await require("../../utils/accessControl").getGuildSettings(interaction.guildId);
    const lang = resolveInteractionLanguage(interaction, guildSettings);

    const giveaway = await giveaways.getByMessage(parsed.messageId);
    if (!giveaway) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(lang, "giveaway.errors.not_found"))],
        flags: MessageFlags.Ephemeral,
      }).catch(() => {});
    }

    if (giveaway.ended) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(lang, "giveaway.errors.already_ended"))],
        flags: MessageFlags.Ephemeral,
      }).catch(() => {});
    }

    const channel = await interaction.client.channels.fetch(giveaway.channel_id);
    const message = await channel.messages.fetch(parsed.messageId);
    const reaction = message.reactions.cache.find(r => r.emoji.name === giveaway.emoji || r.emoji.toString() === giveaway.emoji);

    if (reaction) {
      const users = await reaction.users.fetch();
      if (users.has(interaction.user.id)) {
        return interaction.reply({
          embeds: [E.warningEmbed("Ya estás participando en este sorteo.")],
          flags: MessageFlags.Ephemeral,
        }).catch(() => {});
      }
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const reqCheck = await checkRequirements(giveaway, member, interaction.user, lang);

    if (!reqCheck.valid) {
      return interaction.reply({
        embeds: [E.errorEmbed(reqCheck.message)],
        flags: MessageFlags.Ephemeral,
      }).catch(() => {});
    }

    await message.react(giveaway.emoji);

    return interaction.reply({
      embeds: [E.successEmbed(t(lang, "giveaway.success.entered"))],
      flags: MessageFlags.Ephemeral,
    }).catch(() => {});
  },
};
