"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const {
  verifCodes,
  verifSettings,
  verifLogs,
  verifMemberStates,
} = require("../utils/database");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { safeRun } = require("./common");

function register(client) {
  cron.schedule("*/30 * * * *", async () => {
    await runSingleFlight("verification.auto_kick", async () => {
      await verifCodes.cleanup();
      await runGuildTask(client, "verification.auto_kick", async (guild) => {
        const vs = await verifSettings.get(guild.id);
        if (!vs || !vs.enabled || !vs.kick_unverified_hours) return;

        const cutoff = new Date(Date.now() - vs.kick_unverified_hours * 3600000);
        await safeRun("AUTO-KICK VERIF", async () => {
          const candidates = await verifMemberStates.listAutoKickCandidates(guild.id, cutoff, 500);
          for (const candidate of candidates) {
            const member = await guild.members.fetch(candidate.user_id).catch(() => null);
            if (!member) continue;

            const kicked = await member.kick(`Unverified after ${vs.kick_unverified_hours}h`).then(() => true).catch(() => false);
            if (!kicked) {
              await verifLogs.add({
                guild_id: guild.id,
                user_id: candidate.user_id,
                status: "permission_error",
                event: "permission_error",
                reason: "auto_kick_failed",
                source: "cron.verification.auto_kick",
              });
              continue;
            }

            await Promise.all([
              verifMemberStates.markKicked(guild.id, candidate.user_id, {
                reason: `auto_kick_${vs.kick_unverified_hours}h`,
              }),
              verifLogs.add({
                guild_id: guild.id,
                user_id: candidate.user_id,
                status: "kicked",
                event: "unverified_kicked",
                reason: `Auto-kick after ${vs.kick_unverified_hours}h without verification`,
                source: "cron.verification.auto_kick",
              }),
            ]);

            if (!vs.log_channel) continue;
            const logChannel = guild.channels.cache.get(vs.log_channel);
            if (!logChannel) continue;

            await logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(0xED4245)
                  .setTitle("Auto-kick: unverified member")
                  .setDescription(
                    `<@${member.id}> (\`${member.user.tag}\`) was kicked after remaining unverified for ${vs.kick_unverified_hours}h.`
                  )
                  .setTimestamp(),
              ],
            }).catch(() => {});
          }
        });
      });
    });
  });
}

module.exports = { register };
