const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { modlogSettings } = require("../utils/database");
const { queueGuildLiveStatsSync } = require("../utils/liveStatsChannels");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {
    try {
      if (!oldMember.roles.cache.equals(newMember.roles.cache)) {
        queueGuildLiveStatsSync(newMember.guild, {
          delayMs: 1500,
        });
      }

      const guild = newMember.guild;
      const ml    = await modlogSettings.get(guild.id);
      if (!ml || !ml.enabled || !ml.channel) return;

      const ch = guild.channels.cache.get(ml.channel);
      if (!ch) return;

      const user    = newMember.user;
      const embeds  = [];

      // ── Cambio de nickname
      if (ml.log_nickname && oldMember.nickname !== newMember.nickname) {
        let executor = null;
        await new Promise(r => setTimeout(r, 500));
        const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate, limit: 5 }).catch(() => null);
        if (logs) {
          const entry = logs.entries.find(e => e.target?.id === user.id && Date.now() - e.createdTimestamp < 5000);
          if (entry) executor = entry.executor;
        }

        embeds.push(new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle("✏️ Nickname Cambiado")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields(
            { name: "👤 Usuario",       value: `${user.tag} <@${user.id}>`,                       inline: false },
            { name: "📝 Antes",         value: oldMember.nickname || `*(${user.username})*`,       inline: true  },
            { name: "📝 Después",       value: newMember.nickname || `*(${user.username})*`,       inline: true  },
            { name: "🛡️ Ejecutado por", value: executor ? `<@${executor.id}>` : "Desconocido",    inline: true  },
          )
          .setFooter({ text: `ID: ${user.id}` })
          .setTimestamp()
        );
      }

      // ── Cambios de roles
      const addedRoles   = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
      const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

      if ((ml.log_role_add && addedRoles.size > 0) || (ml.log_role_remove && removedRoles.size > 0)) {
        let executor = null;
        await new Promise(r => setTimeout(r, 300));
        const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate, limit: 5 }).catch(() => null);
        if (logs) {
          const entry = logs.entries.find(e => e.target?.id === user.id && Date.now() - e.createdTimestamp < 5000);
          if (entry) executor = entry.executor;
        }

        const fields = [
          { name: "👤 Usuario", value: `${user.tag} <@${user.id}>`, inline: false },
        ];
        if (addedRoles.size > 0 && ml.log_role_add)
          fields.push({ name: "✅ Roles añadidos",   value: addedRoles.map(r => `<@&${r.id}>`).join(", "),   inline: false });
        if (removedRoles.size > 0 && ml.log_role_remove)
          fields.push({ name: "❌ Roles quitados",   value: removedRoles.map(r => `<@&${r.id}>`).join(", "), inline: false });
        fields.push({ name: "🛡️ Ejecutado por", value: executor ? `<@${executor.id}>` : "Desconocido", inline: true });

        embeds.push(new EmbedBuilder()
          .setColor(0xFEE75C)
          .setTitle("🏷️ Roles Actualizados")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields(fields)
          .setFooter({ text: `ID: ${user.id}` })
          .setTimestamp()
        );
      }

      for (const embed of embeds) {
        await ch.send({ embeds: [embed] }).catch(() => {});
      }
    } catch (e) { console.error("[MEMBER UPDATE LOG]", e.message); }
  },
};
