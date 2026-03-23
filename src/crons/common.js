"use strict";

function safeRun(label, fn) {
  return Promise.resolve()
    .then(fn)
    .catch((error) => {
      console.error("[" + label + "]", error?.message || error);
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
