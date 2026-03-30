const {
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const {
  welcomeSettings,
  verifSettings,
  verifMemberStates,
  verifLogs,
  modlogSettings,
  settings,
} = require("../utils/database");
const { queueBotStatsSync } = require("../utils/botStatsSync");
const { queueGuildLiveStatsSync } = require("../utils/liveStatsChannels");
const { resolveGuildLanguage, t } = require("../utils/i18n");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    const guild = member.guild;
    queueGuildLiveStatsSync(guild, {
      hydrateMembers: true,
      delayMs: 1500,
    });
    queueBotStatsSync(client, {
      reason: "guildMemberAdd",
      delayMs: 1000,
    });

    try {
      const [guildSettings, ws, vs] = await Promise.all([
        settings.get(guild.id),
        welcomeSettings.get(guild.id),
        verifSettings.get(guild.id),
      ]);
      const language = resolveGuildLanguage(guildSettings);

      await verifMemberStates.markJoined(guild.id, member.id, member.joinedAt || new Date());

      if (vs && vs.enabled && vs.antiraid_enabled) {
        const recentJoins = await verifMemberStates.countRecentJoins(
          guild.id,
          new Date(Date.now() - vs.antiraid_seconds * 1000)
        );

        if (recentJoins >= vs.antiraid_joins) {
          await verifLogs.add({
            guild_id: guild.id,
            user_id: member.id,
            status: "anti_raid",
            event: "anti_raid_triggered",
            reason: `joins=${recentJoins} window=${vs.antiraid_seconds}s action=${vs.antiraid_action}`,
            source: "event.guildMemberAdd",
            metadata: {
              recent_joins: recentJoins,
              threshold: vs.antiraid_joins,
              window_seconds: vs.antiraid_seconds,
              action: vs.antiraid_action,
            },
          });

          if (vs.log_channel) {
            const logCh = guild.channels.cache.get(vs.log_channel);
            await logCh?.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(0xED4245)
                  .setTitle(t(language, "events.guildMemberAdd.anti_raid.title"))
                  .setDescription(
                    t(language, "events.guildMemberAdd.anti_raid.description", {
                      recentJoins,
                      seconds: vs.antiraid_seconds,
                      memberTag: member.user.tag,
                    })
                  )
                  .addFields(
                    {
                      name: t(language, "events.guildMemberAdd.anti_raid.fields.threshold"),
                      value: `\`${vs.antiraid_joins}\``,
                      inline: true,
                    },
                    {
                      name: t(language, "events.guildMemberAdd.anti_raid.fields.action"),
                      value: vs.antiraid_action === "kick"
                        ? t(language, "events.guildMemberAdd.anti_raid.action_kick")
                        : t(language, "events.guildMemberAdd.anti_raid.action_alert"),
                      inline: true,
                    }
                  )
                  .setTimestamp(),
              ],
            }).catch(() => {});
          }

          if (vs.antiraid_action === "kick") {
            const kicked = await member.kick("Anti-raid triggered").then(() => true).catch(() => false);
            if (kicked) {
              await Promise.all([
                verifMemberStates.markKicked(guild.id, member.id, { reason: "anti_raid_kick" }),
                verifLogs.add({
                  guild_id: guild.id,
                  user_id: member.id,
                  status: "kicked",
                  event: "unverified_kicked",
                  reason: "anti_raid_kick",
                  source: "event.guildMemberAdd",
                }),
              ]);
              return;
            }

            await verifLogs.add({
              guild_id: guild.id,
              user_id: member.id,
              status: "permission_error",
              event: "permission_error",
              reason: "anti_raid_kick_failed",
              source: "event.guildMemberAdd",
            });
          }
        }
      }

      if (vs && vs.enabled && vs.unverified_role) {
        const role = guild.roles.cache.get(vs.unverified_role);
        if (role && guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles) && role.editable) {
          await member.roles.add(role).catch(async () => {
            await verifLogs.add({
              guild_id: guild.id,
              user_id: member.id,
              status: "permission_error",
              event: "permission_error",
              reason: "failed_to_assign_unverified_role",
              source: "event.guildMemberAdd",
            });
          });
        } else {
          await verifLogs.add({
            guild_id: guild.id,
            user_id: member.id,
            status: "permission_error",
            event: "permission_error",
            reason: "unverified_role_not_manageable",
            source: "event.guildMemberAdd",
          });
        }
      }

      if (vs && !vs.enabled && ws?.welcome_autorole) {
        const role = guild.roles.cache.get(ws.welcome_autorole);
        if (role && guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles) && role.editable) {
          await member.roles.add(role).catch(() => {});
        }
      }

      if (ws?.welcome_enabled && ws.welcome_channel) {
        const ch = guild.channels.cache.get(ws.welcome_channel);
        if (ch) {
          try {
            const welcomeMessage = fill(ws.welcome_message, member, guild);
            const embed = new EmbedBuilder()
              .setColor(parseInt(ws.welcome_color || "5865F2", 16))
              .setTitle(fill(ws.welcome_title || t(language, "events.guildMemberAdd.welcome.default_title"), member, guild))
              .setDescription(welcomeMessage)
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
              .addFields(
                { name: t(language, "events.guildMemberAdd.welcome.fields.user"), value: `${member.user.tag}`, inline: true },
                { name: t(language, "events.guildMemberAdd.welcome.fields.member_count"), value: `${guild.memberCount}`, inline: true }
              )
              .setTimestamp();

            if (ws.welcome_footer) {
              embed.setFooter({
                text: fill(ws.welcome_footer, member, guild),
                iconURL: guild.iconURL({ dynamic: true }) || undefined,
              });
            }

            await ch.send({
              content: `<@${member.id}>`,
              embeds: [embed],
            }).catch(() => {});
          } catch (err) {
            console.error("[WELCOME ERROR]", err?.message || err);
          }
        }
      }

      if (ws?.welcome_enabled && ws.welcome_dm) {
        try {
          const dmEmbed = new EmbedBuilder()
            .setColor(parseInt(ws.welcome_color || "5865F2", 16))
            .setTitle(t(language, "events.guildMemberAdd.dm.title", { guild: guild.name }))
            .setDescription(fill(ws.welcome_dm_message, member, guild))
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp();
          if (vs?.enabled && vs.channel) {
            dmEmbed.addFields({
              name: t(language, "events.guildMemberAdd.dm.fields.verification_required"),
              value: t(language, "events.guildMemberAdd.dm.fields.verification_value", {
                channel: `<#${vs.channel}>`,
              }),
            });
          }
          await member.send({ embeds: [dmEmbed] });
        } catch {}
      }

      const ml = await modlogSettings.get(guild.id);
      if (ml && ml.enabled && ml.log_joins && ml.channel) {
        const logCh = guild.channels.cache.get(ml.channel);
        if (logCh) {
          await logCh.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle(t(language, "events.guildMemberAdd.modlog.title"))
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                  {
                    name: t(language, "events.guildMemberAdd.modlog.fields.user"),
                    value: `${member.user.tag} <@${member.id}>`,
                    inline: true,
                  },
                  {
                    name: t(language, "events.guildMemberAdd.modlog.fields.account_created"),
                    value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
                    inline: true,
                  },
                  {
                    name: t(language, "events.guildMemberAdd.modlog.fields.member_count"),
                    value: `\`${guild.memberCount}\``,
                    inline: true,
                  }
                )
                .setFooter({ text: t(language, "events.guildMemberAdd.modlog.footer", { id: member.id }) })
                .setTimestamp(),
            ],
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error("[MEMBER ADD]", err.message);
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
