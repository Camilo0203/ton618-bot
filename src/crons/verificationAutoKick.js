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
const { resolveGuildLanguage, t } = require("../utils/i18n");

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

            const lang = resolveGuildLanguage(vs);
            const hours = vs.kick_unverified_hours;
            const kicked = await member.kick(t(lang, "verification.autokick.kick_reason", { hours })).then(() => true).catch(() => false);
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
                reason: `auto_kick_${hours}h`,
              }),
              verifLogs.add({
                guild_id: guild.id,
                user_id: candidate.user_id,
                status: "kicked",
                event: "unverified_kicked",
                reason: t(lang, "verification.autokick.reason_log", { hours }),
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
                  .setTitle(t(lang, "verification.autokick.title"))
                  .setDescription(
                    t(lang, "verification.autokick.description", { member: `<@${member.id}>`, tag: member.user.tag, hours })
                  )
                  .setTimestamp(),
              ],
            }).catch((err) => { console.error("[verificationAutoKick] suppressed error:", err?.message || err); });
          }
        });
      });
    });
  });
}

module.exports = { register };
