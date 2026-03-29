"use strict";

const { ActivityType } = require("discord.js");

const PRESENCE_ROTATION_MS = 15_000;
const PRESENCE_STATES = Object.freeze([
  "Ayudando a tu comunidad",
  "Soporte claro y rápido",
  "Gestión y asistencia activa",
  "Moderación y soporte",
  "Siempre listo para ayudar",
  "Smart server assistance",
  "Clear support for your community",
  "Professional help active",
  "Support in English and Spanish",
  "Reliable server assistance",
]);

const presenceIntervals = new WeakMap();

function register(client) {
  if (!client?.user || PRESENCE_STATES.length === 0) return;

  const existingInterval = presenceIntervals.get(client);
  if (existingInterval) clearInterval(existingInterval);

  let activityIndex = 0;

  const setActivity = () => {
    const activity = PRESENCE_STATES[activityIndex++ % PRESENCE_STATES.length];
    client.user.setActivity({ name: activity, type: ActivityType.Custom });
  };

  setActivity();

  const interval = setInterval(setActivity, PRESENCE_ROTATION_MS);
  if (typeof interval.unref === "function") interval.unref();
  presenceIntervals.set(client, interval);
}

module.exports = { register };
