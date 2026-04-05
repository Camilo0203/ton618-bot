const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { modlogSettings, settings } = require("../utils/database");
const { resolveGuildLanguage, t } = require("../utils/i18n");

module.exports = {
  name: "guildBanAdd",
  async execute(ban, client) {
    try {
      const { guild, user } = ban;
      const ml = await modlogSettings.get(guild.id);
      if (!ml || !ml.enabled || !ml.log_bans || !ml.channel) return;

      const ch = guild.channels.cache.get(ml.channel);
      if (!ch) return;

      const s = await settings.get(guild.id);
      const language = resolveGuildLanguage(s);

      // Buscar en audit log quién baneó y la razón
      let executor = null;
      let reason   = t(language, "events.modlog.no_reason");
      await new Promise(r => setTimeout(r, 500)); // pequeño delay para que el audit log se actualice
      const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 5 }).catch(() => null);
      if (logs) {
        const entry = logs.entries.find(e => e.target?.id === user.id && Date.now() - e.createdTimestamp < 5000);
        if (entry) { executor = entry.executor; reason = entry.reason || reason; }
      }

      await ch.send({
        embeds: [new EmbedBuilder()
          .setColor(0xED4245)
          .setTitle(t(language, "events.modlog.ban_title"))
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields(
            { name: t(language, "events.modlog.fields.user"),   value: `${user.tag}\n<@${user.id}> \`(${user.id})\``, inline: false },
            { name: t(language, "events.modlog.fields.executor"), value: executor ? `<@${executor.id}> ${executor.tag}` : t(language, "events.modlog.unknown_executor"), inline: true },
            { name: t(language, "events.modlog.fields.reason"),     value: reason, inline: true },
          )
          .setFooter({ text: `ID: ${user.id}` })
          .setTimestamp()],
      }).catch(() => {});
    } catch (e) { console.error("[BAN LOG]", e.message); }
  },
};
