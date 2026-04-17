"use strict";

const logger = require("../utils/structuredLogger");

function safeRun(label, fn) {
  return Promise.resolve()
    .then(fn)
    .catch((error) => {
      logger.error(label, error?.message || String(error));
    });
}

async function resolveGuildChannel(guild, channelId) {
  if (!channelId) return null;
  return guild.channels.cache.get(channelId)
    || await guild.channels.fetch(channelId).catch(() => null);
}

module.exports = {
  safeRun,
  resolveGuildChannel,
};
