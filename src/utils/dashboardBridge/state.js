"use strict";

const state = {
  client: null,
  syncTimer: null,
  syncInFlight: null,
  intervalId: null,
  queuedGuildIds: new Set(),
  fullSyncQueued: false,
  queuedReason: "queued",
};

module.exports = { state };
