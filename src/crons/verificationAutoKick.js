"use strict";

const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { verifCodes, verifSettings, verifLogs } = require("../utils/database");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");
const { safeRun } = require("./common");

function register(client) {
  cron.schedule("*/30 * * * *", async () => {
    await runSingleFlight("verification.auto_kick", async () => {
      await verifCodes.cleanup();
      await runGuildTask(client, "verification.auto_kick", async (guild) => {
        const vs = await verifSettings.get(guild.id);
        if (!vs || !vs.enabled || !vs.kick_unverified_hours || !vs.unverified_role) return;

        const cutoff = Date.now() - vs.kick_unverified_hours * 3600000;
        await safeRun("AUTO-KICK VERIF", async () => {
          const members = await guild.members.fetch();
          for (const [, member] of members) {
            if (!member.roles.cache.has(vs.unverified_role)) continue;
            if (!member.joinedTimestamp || member.joinedTimestamp >= cutoff) continue;

            await member.kick(`No verificado tras ${vs.kick_unverified_hours}h`).catch(() => {});
            await verifLogs.add(guild.id, member.id, "kicked", `Auto-kick tras ${vs.kick_unverified_hours}h sin verificar`);

            if (!vs.log_channel) continue;
            const logChannel = guild.channels.cache.get(vs.log_channel);
            if (!logChannel) continue;

            await logChannel.send({
              embeds: [new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("Auto-kick: no verificado")
                .setDescription(`<@${member.id}> (\`${member.user.tag}\`) fue expulsado por no verificarse en ${vs.kick_unverified_hours}h.`)
                .setTimestamp()],
            }).catch(() => {});
          }
        });
      });
    });
  });
}

module.exports = { register };
