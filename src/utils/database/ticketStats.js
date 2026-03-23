function buildTicketStatsPipeline(guildId, now = new Date()) {
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return [
    { $match: { guild_id: guildId } },
    {
      $addFields: {
        _createdAtDate: {
          $convert: { input: "$created_at", to: "date", onError: null, onNull: null },
        },
        _closedAtDate: {
          $convert: { input: "$closed_at", to: "date", onError: null, onNull: null },
        },
        _ratingNum: {
          $convert: { input: "$rating", to: "double", onError: null, onNull: null },
        },
      },
    },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              open: { $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] } },
              closed: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
              openedToday: { $sum: { $cond: [{ $gte: ["$_createdAtDate", todayStart] }, 1, 0] } },
              closedToday: { $sum: { $cond: [{ $gte: ["$_closedAtDate", todayStart] }, 1, 0] } },
              openedWeek: { $sum: { $cond: [{ $gte: ["$_createdAtDate", weekStart] }, 1, 0] } },
              closedWeek: { $sum: { $cond: [{ $gte: ["$_closedAtDate", weekStart] }, 1, 0] } },
              ratingSum: { $sum: { $ifNull: ["$_ratingNum", 0] } },
              ratingCount: { $sum: { $cond: [{ $ne: ["$_ratingNum", null] }, 1, 0] } },
            },
          },
        ],
        topCategories: [
          {
            $group: {
              _id: { $ifNull: ["$category", "general"] },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 3 },
          { $project: { _id: 0, category: "$_id", count: 1 } },
        ],
      },
    },
  ];
}

function mapTicketStatsResult(aggregationResult) {
  const root = Array.isArray(aggregationResult) ? aggregationResult[0] : null;
  const summary = root?.summary?.[0] || {};
  const topCategoriesRaw = Array.isArray(root?.topCategories) ? root.topCategories : [];

  const ratingCount = Number(summary.ratingCount || 0);
  const ratingSum = Number(summary.ratingSum || 0);

  return {
    total: Number(summary.total || 0),
    open: Number(summary.open || 0),
    closed: Number(summary.closed || 0),
    openedToday: Number(summary.openedToday || 0),
    closedToday: Number(summary.closedToday || 0),
    openedWeek: Number(summary.openedWeek || 0),
    closedWeek: Number(summary.closedWeek || 0),
    avg_rating: ratingCount > 0 ? ratingSum / ratingCount : null,
    topCategories: topCategoriesRaw.map((item) => [item.category, Number(item.count || 0)]),
  };
}

module.exports = {
  buildTicketStatsPipeline,
  mapTicketStatsResult,
};
