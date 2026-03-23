"use strict";

const cron = require("node-cron");
const { updateAllDashboards } = require("../handlers/dashboardHandler");

function register(client) {
  void updateAllDashboards(client);
  cron.schedule("*/5 * * * *", () => void updateAllDashboards(client));
}

module.exports = { register };
