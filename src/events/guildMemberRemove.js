const { EmbedBuilder } = require("discord.js");
const { welcomeSettings, modlogSettings, settings } = require("../utils/database");
const { queueBotStatsSync } = require("../utils/botStatsSync");
const { queueGuildLiveStatsSync } = require("../utils/liveStatsChannels");
const { resolveGuildLanguage, t } = require("../utils/i18n");
const logger = require("../utils/structuredLogger");

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
      const [guildSettings, ws] = await Promise.all([
        settings.get(guild.id),
        welcomeSettings.get(guild.id),
      ]);
      const language = resolveGuildLanguage(guildSettings);

      if (ws?.goodbye_enabled && ws?.goodbye_channel) {
        const ch = guild.channels.cache.get(ws.goodbye_channel);
        if (ch) {
          if (!ch.permissionsFor(guild.members.me).has(["SendMessages", "AttachFiles"])) {
            logger.warn('guildMemberRemove', `No permissions in goodbye channel ${ch.id}`);
            return;
          }

          try {
            const color = parseInt(ws.goodbye_color || "ED4245", 16);
            const embed = new EmbedBuilder()
              .setColor(color)
              .setTitle(fill(ws.goodbye_title || t(language, "events.guildMemberRemove.goodbye.default_title"), member, guild))
              .setDescription(fill(ws.goodbye_message || t(language, "events.guildMemberRemove.goodbye.default_message"), member, guild))
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
              .addFields(
                {
                  name: t(language, "events.guildMemberRemove.goodbye.fields.user"),
                  value: `${member.user.tag}`,
                  inline: true,
                },
                {
                  name: t(language, "events.guildMemberRemove.goodbye.fields.remaining_members"),
                  value: t(language, "events.guildMemberRemove.goodbye.remaining_members_value", {
                    count: guild.memberCount,
                  }),
                  inline: true,
                },
              )
              .setTimestamp();

            if (ws.goodbye_footer) {
              embed.setFooter({
                text: fill(ws.goodbye_footer, member, guild),
                iconURL: guild.iconURL({ dynamic: true }),
              });
            }

            await ch.send({ embeds: [embed] }).catch(() => {});
          } catch (err) {
            logger.error('guildMemberRemove', 'Goodbye error', { error: err?.message || String(err) });
          }
        }
      }

      const ml = await modlogSettings.get(guild.id);
      if (ml && ml.enabled && ml.log_leaves && ml.channel) {
        const logCh = guild.channels.cache.get(ml.channel);
        if (logCh) {
          const roles = member.roles.cache
            .filter((role) => role.id !== guild.id)
            .sort((a, b) => b.position - a.position)
            .map((role) => `<@&${role.id}>`)
            .slice(0, 5)
            .join(", ") || t(language, "events.guildMemberRemove.modlog.no_roles");

          await logCh.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle(t(language, "events.guildMemberRemove.modlog.title"))
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                  {
                    name: t(language, "events.guildMemberRemove.modlog.fields.user"),
                    value: `${member.user.tag} <@${member.id}>`,
                    inline: true,
                  },
                  {
                    name: t(language, "events.guildMemberRemove.modlog.fields.joined_at"),
                    value: member.joinedAt
                      ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
                      : t(language, "events.guildMemberRemove.modlog.unknown_join"),
                    inline: true,
                  },
                  {
                    name: t(language, "events.guildMemberRemove.modlog.fields.remaining_members"),
                    value: String(guild.memberCount),
                    inline: true,
                  },
                  {
                    name: t(language, "events.guildMemberRemove.modlog.fields.roles"),
                    value: roles,
                    inline: false,
                  },
                )
                .setFooter({
                  text: t(language, "events.guildMemberRemove.modlog.footer", { id: member.id }),
                })
                .setTimestamp(),
            ],
          }).catch(() => {});
        }
      }
    } catch (err) {
      logger.error('guildMemberRemove', 'Member remove error', { error: err?.message || String(err) });
    }
  },
};

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
