const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { modlogSettings, settings } = require("../utils/database");
const { resolveGuildLanguage, t } = require("../utils/i18n");
const logger = require("../utils/structuredLogger");

module.exports = {
  name: "guildBanRemove",
  async execute(ban, client) {
    try {
      const { guild, user } = ban;
      const ml = await modlogSettings.get(guild.id);
      if (!ml || !ml.enabled || !ml.log_unbans || !ml.channel) return;

      const ch = guild.channels.cache.get(ml.channel);
      if (!ch) return;

      const s = await settings.get(guild.id);
      const language = resolveGuildLanguage(s);

      let executor = null;
      await new Promise(r => setTimeout(r, 500));
      const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 5 }).catch(() => null);
      if (logs) {
        const entry = logs.entries.find(e => e.target?.id === user.id && Date.now() - e.createdTimestamp < 5000);
        if (entry) executor = entry.executor;
      }

      await ch.send({
        embeds: [new EmbedBuilder()
          .setColor(0x57F287)
          .setTitle(t(language, "events.modlog.unban_title"))
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields(
            { name: t(language, "events.modlog.fields.user"),       value: `${user.tag}\n<@${user.id}> \`(${user.id})\``, inline: false },
            { name: t(language, "events.modlog.fields.executor"), value: executor ? `<@${executor.id}> ${executor.tag}` : t(language, "events.modlog.unknown_executor"), inline: true },
          )
          .setFooter({ text: `ID: ${user.id}` })
          .setTimestamp()],
      }).catch(() => {});
    } catch (e) { logger.error('guildBanRemove', 'Unban log error', { error: e?.message || String(e) }); }
  },
};
