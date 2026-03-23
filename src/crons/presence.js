"use strict";

const { ActivityType } = require("discord.js");
const { tickets } = require("../utils/database");

function register(client) {
  let activityIndex = 0;

  async function getOpenTicketsCount() {
    try {
      return await tickets.collection().countDocuments({ status: "open" });
    } catch (error) {
      console.error("[PRESENCE] open tickets:", error?.message || error);
      return null;
    }
  }

  async function buildActivities() {
    const openTickets = await getOpenTicketsCount();
    const ticketsLabel = Number.isFinite(openTickets) ? `${openTickets} Tickets` : "X Tickets";

    return [
      { name: "/help | /ticket", type: ActivityType.Watching },
      { name: ticketsLabel, type: ActivityType.Watching },
      { name: "active support", type: ActivityType.Playing },
    ];
  }

  const setActivity = async () => {
    const activities = await buildActivities();
    if (!activities.length) return;
    const activity = activities[activityIndex++ % activities.length];
    client.user.setActivity(activity.name, { type: activity.type });
  };

  setTimeout(() => {
    void setActivity();
    const interval = setInterval(() => void setActivity(), 60000);
    if (typeof interval.unref === "function") interval.unref();
  }, 5000);
}

module.exports = { register };
