const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { modlogSettings, settings } = require("../utils/database");
const { queueGuildLiveStatsSync } = require("../utils/liveStatsChannels");
const { resolveGuildLanguage, t } = require("../utils/i18n");
const logger = require("../utils/structuredLogger");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {
    try {
      if (!oldMember.roles.cache.equals(newMember.roles.cache)) {
        queueGuildLiveStatsSync(newMember.guild, {
          delayMs: 1500,
        });
      }

      const guild = newMember.guild;
      const [guildSettings, ml] = await Promise.all([
        settings.get(guild.id),
        modlogSettings.get(guild.id),
      ]);
      if (!ml || !ml.enabled || !ml.channel) return;

      const language = resolveGuildLanguage(guildSettings);
      const ch = guild.channels.cache.get(ml.channel);
      if (!ch) return;

      const user = newMember.user;
      const embeds = [];

      if (ml.log_nickname && oldMember.nickname !== newMember.nickname) {
        let executor = null;
        await new Promise((resolve) => setTimeout(resolve, 500));
        const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate, limit: 5 }).catch(() => null);
        if (logs) {
          const entry = logs.entries.find(
            (auditEntry) => auditEntry.target?.id === user.id && Date.now() - auditEntry.createdTimestamp < 5000,
          );
          if (entry) executor = entry.executor;
        }

        embeds.push(
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(t(language, "events.guildMemberUpdate.nickname.title"))
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
              {
                name: t(language, "events.guildMemberUpdate.nickname.fields.user"),
                value: `${user.tag} <@${user.id}>`,
                inline: false,
              },
              {
                name: t(language, "events.guildMemberUpdate.nickname.fields.before"),
                value: oldMember.nickname || `*(${user.username})*`,
                inline: true,
              },
              {
                name: t(language, "events.guildMemberUpdate.nickname.fields.after"),
                value: newMember.nickname || `*(${user.username})*`,
                inline: true,
              },
              {
                name: t(language, "events.guildMemberUpdate.nickname.fields.executor"),
                value: executor
                  ? `<@${executor.id}>`
                  : t(language, "events.guildMemberUpdate.unknown_executor"),
                inline: true,
              },
            )
            .setFooter({
              text: t(language, "events.guildMemberUpdate.footer", { id: user.id }),
            })
            .setTimestamp(),
        );
      }

      const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
      const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));

      if ((ml.log_role_add && addedRoles.size > 0) || (ml.log_role_remove && removedRoles.size > 0)) {
        let executor = null;
        await new Promise((resolve) => setTimeout(resolve, 300));
        const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate, limit: 5 }).catch(() => null);
        if (logs) {
          const entry = logs.entries.find(
            (auditEntry) => auditEntry.target?.id === user.id && Date.now() - auditEntry.createdTimestamp < 5000,
          );
          if (entry) executor = entry.executor;
        }

        const fields = [
          {
            name: t(language, "events.guildMemberUpdate.roles.fields.user"),
            value: `${user.tag} <@${user.id}>`,
            inline: false,
          },
        ];

        if (addedRoles.size > 0 && ml.log_role_add) {
          fields.push({
            name: t(language, "events.guildMemberUpdate.roles.fields.added"),
            value: addedRoles.map((role) => `<@&${role.id}>`).join(", "),
            inline: false,
          });
        }

        if (removedRoles.size > 0 && ml.log_role_remove) {
          fields.push({
            name: t(language, "events.guildMemberUpdate.roles.fields.removed"),
            value: removedRoles.map((role) => `<@&${role.id}>`).join(", "),
            inline: false,
          });
        }

        fields.push({
          name: t(language, "events.guildMemberUpdate.roles.fields.executor"),
          value: executor
            ? `<@${executor.id}>`
            : t(language, "events.guildMemberUpdate.unknown_executor"),
          inline: true,
        });

        embeds.push(
          new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle(t(language, "events.guildMemberUpdate.roles.title"))
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(fields)
            .setFooter({
              text: t(language, "events.guildMemberUpdate.footer", { id: user.id }),
            })
            .setTimestamp(),
        );
      }

      for (const embed of embeds) {
        await ch.send({ embeds: [embed] }).catch(() => {});
      }
    } catch (error) {
      logger.error('guildMemberUpdate', 'Member update log error', { error: error?.message || String(error) });
    }
  },
};
