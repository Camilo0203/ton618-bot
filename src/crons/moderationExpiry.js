"use strict";

const cron = require("node-cron");
const { runSingleFlight } = require("../utils/guildTaskRunner");
const { safeRun } = require("./common");

function register(client) {
  cron.schedule("* * * * *", () => {
    void safeRun("MODERATION EXPIRY", () =>
      runSingleFlight("moderation.expired_actions", async () => {
        if (client.moderationHandler) {
          await client.moderationHandler.checkExpiredActions();
        }
      })
    );
  });
}

module.exports = { register };
