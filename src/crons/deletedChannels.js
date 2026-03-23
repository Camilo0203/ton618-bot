"use strict";

const cron = require("node-cron");
const { tickets } = require("../utils/database");
const { runSingleFlight, runGuildTask } = require("../utils/guildTaskRunner");

function register(client) {
  cron.schedule("0 * * * *", async () => {
    await runSingleFlight("tickets.sync_deleted_channels", async () => {
      await runGuildTask(client, "tickets.sync_deleted_channels", async (guild) => {
        const openTickets = await tickets.getAllOpen(guild.id);
        for (const ticket of openTickets) {
          if (!guild.channels.cache.get(ticket.channel_id)) {
            await tickets.close(ticket.channel_id, client.user.id, "Canal no encontrado");
          }
        }
      });
    });
  });
}

module.exports = { register };
