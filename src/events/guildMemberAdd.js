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
} = require("../utils/database");
const { queueBotStatsSync } = require("../utils/botStatsSync");
const { queueGuildLiveStatsSync } = require("../utils/liveStatsChannels");

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
      const [ws, vs] = await Promise.all([
        welcomeSettings.get(guild.id),
        verifSettings.get(guild.id),
      ]);

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
                  .setTitle("Anti-raid triggered")
                  .setDescription(
                    `Detected **${recentJoins} joins** in **${vs.antiraid_seconds}s**.\nLatest join: **${member.user.tag}**`
                  )
                  .addFields(
                    { name: "Threshold", value: `\`${vs.antiraid_joins}\``, inline: true },
                    {
                      name: "Action",
                      value: vs.antiraid_action === "kick" ? "Kick automatically" : "Alert only",
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
              .setTitle(fill(ws.welcome_title || "Welcome!", member, guild))
              .setDescription(welcomeMessage)
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
              .addFields(
                { name: "User", value: `${member.user.tag}`, inline: true },
                { name: "Member #", value: `${guild.memberCount}`, inline: true }
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
            .setTitle(`Welcome to ${guild.name}`)
            .setDescription(fill(ws.welcome_dm_message, member, guild))
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp();
          if (vs?.enabled && vs.channel) {
            dmEmbed.addFields({
              name: "Verification required",
              value: `Go to <#${vs.channel}> to verify and access the server.`,
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
                .setTitle("Member joined")
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                  { name: "User", value: `${member.user.tag} <@${member.id}>`, inline: true },
                  {
                    name: "Account created",
                    value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
                    inline: true,
                  },
                  { name: "Member #", value: `\`${guild.memberCount}\``, inline: true }
                )
                .setFooter({ text: `ID: ${member.id}` })
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
