const {
  EmbedBuilder,
} = require("discord.js");
const { welcomeSettings, modlogSettings } = require("../utils/database");
const { queueBotStatsSync } = require("../utils/botStatsSync");
const { queueGuildLiveStatsSync } = require("../utils/liveStatsChannels");

module.exports = {
  name: "guildMemberRemove",
  async execute(member, client) {
    const guild = member.guild;
    queueGuildLiveStatsSync(guild, {
      delayMs: 1500,
    });
    queueBotStatsSync(client, {
      reason: "guildMemberRemove",
      delayMs: 1000,
    });
    try {
      const ws = await welcomeSettings.get(guild.id);

      // ── DESPEDIDA CON IMAGEN CANVAS ──
      if (ws?.goodbye_enabled && ws?.goodbye_channel) {
        const ch = guild.channels.cache.get(ws.goodbye_channel);
        if (ch) {
          // Verificar permisos del bot
          if (!ch.permissionsFor(guild.members.me).has(["SendMessages", "AttachFiles"])) {
            return console.log(`[GOODBYE] No tengo permisos en el canal ${ch.id}`);
          }

          try {
            // Crear embed de despedida con avatar
            const color = parseInt(ws.goodbye_color || "ED4245", 16);
            const embed = new EmbedBuilder()
              .setColor(color)
              .setTitle(fill(ws.goodbye_title || "👋 ¡Adiós!", member, guild))
              .setDescription(fill(ws.goodbye_message || "¡Lamentamos verte partir **{user}**! Esperamos verte pronto.", member, guild))
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
              .addFields(
                { name: "👤 Usuario", value: `${member.user.tag}`, inline: true },
                { name: "👥 Quedamos", value: `${guild.memberCount} miembros`, inline: true },
              )
              .setTimestamp();

            if (ws.goodbye_footer) {
              embed.setFooter({
                text: fill(ws.goodbye_footer, member, guild),
                iconURL: guild.iconURL({ dynamic: true })
              });
            }

            await ch.send({ embeds: [embed] }).catch(() => {});
          } catch (err) {
            console.error("[GOODBYE ERROR]", err?.message || err);
          }
        }
      }

      // ── MODLOG DE SALIDA ──
      const ml = await modlogSettings.get(guild.id);
      if (ml && ml.enabled && ml.log_leaves && ml.channel) {
        const logCh = guild.channels.cache.get(ml.channel);
        if (logCh) {
          const roles = member.roles.cache
            .filter(r => r.id !== guild.id)
            .sort((a, b) => b.position - a.position)
            .map(r => `<@&${r.id}>`).slice(0, 5).join(", ") || "Ninguno";
          await logCh.send({
            embeds: [new EmbedBuilder()
              .setColor(0xED4245)
              .setTitle("📤 Miembro Salió")
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
              .addFields(
                { name: "👤 Usuario", value: `${member.user.tag} <@${member.id}>`, inline: true },
                { name: "📅 Se unió", value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "?", inline: true },
                { name: "👥 Quedamos", value: String(guild.memberCount), inline: true },
                { name: "🏷️ Tenía roles", value: roles, inline: false },
              )
              .setFooter({ text: `ID: ${member.id}` })
              .setTimestamp()],
          }).catch(() => {});
        }
      }

    } catch (err) {
      console.error("[MEMBER REMOVE]", err.message);
    }
  },
};



/**
 * Reemplaza las variables en el mensaje
 * Variables: {mention}, {user}, {server}, {tag}, {count}, {id}
 */
function fill(text, member, guild) {
  if (!text) return "";
  return text
    .replace(/{mention}/g, `<@${member.id}>`)
    .replace(/{user}/g, member.user.username)
    .replace(/{tag}/g, member.user.tag)
    .replace(/{server}/g, guild.name)
    .replace(/{count}/g, String(guild.memberCount))
    .replace(/{id}/g, member.id);
}
