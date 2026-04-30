module.exports = {
  serverstats: {
    activity: {
      footer: "Period: {{period}}",
      messages: "💬 Messages",
      messages_value: "**Total:** {{total}}\n**Avg/Day:** {{avg}}",
      peak_hour: "🕒 Peak Hour",
      peak_hour_value: "**{{hour}}:00 - {{next}}:00** with {{count}} messages",
      title: "📊 Activity Statistics - {{period}}",
      top_channels: "🔥 Top Channels",
      top_channels_value: "{{num}}. <#{{channelId}}> - {{count}} msgs",
      top_users: "⭐ Most Active Users",
      top_users_value: "{{num}}. <@{{userId}}> - {{count}} msgs"
    },
    channels: {
      channel_entry: "**{{num}}.** <#{{channelId}}>\n└ {{count}} messages",
      entry: "**{{index}}.** {{channel}}\n└ {{messages}} messages",
      footer: "Period: {{period}} | Top 10 channels",
      title: "📁 Channel Activity - {{period}}"
    },
    choices: {
      period_all: "All Time",
      period_day: "Today",
      period_month: "This Month",
      period_week: "This Week"
    },
    errors: {
      activity_failed: "Failed to fetch activity statistics.",
      channels_failed: "Failed to fetch channel statistics.",
      growth_failed: "Failed to fetch growth statistics.",
      members_failed: "Failed to fetch member statistics.",
      no_activity: "No message activity recorded during this period.",
      no_data: "No {{type}} data available for analysis.",
      overview_failed: "Failed to fetch server overview.",
      roles_failed: "Failed to fetch role statistics.",
      support_failed: "Failed to fetch support statistics."
    },
    growth: {
      "30day": "📊 30-Day Growth",
      "30day_value": "**Total Change:** {{change}}\n**Percentage:** {{percent}}%\n**Start:** {{start}}\n**Current:** {{current}}",
      footer: "Based on last 30 days of data",
      stats_30d: "📊 30-Day Growth",
      stats_30d_value: "**Total Change:** {{change}}\n**Percentage:** {{percent}}%\n**Start:** {{start}}\n**Current:** {{current}}",
      title: "📈 Server Growth Statistics",
      trend: "📅 Recent Trend",
      trend_value: "**Avg Daily Growth:** {{avg}}\n**Projected (30d):** {{projected}}"
    },
    members: {
      current: "📈 Current Statistics",
      current_stats: "📈 Current Stats",
      current_stats_value: "**Total Members:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}",
      current_value: "**Total Members:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}",
      footer: "Period: {{period}}",
      growth: "📊 Growth",
      growth_value: "**Change:** {{change}}\n**Percentage:** {{percent}}%",
      new_members: "🆕 New Members",
      new_members_value: "**Joined:** {{count}}\n**Average/Day:** {{avg}}",
      period_footer: "Period: {{period}}",
      title: "👥 Member Statistics - {{period}}"
    },
    options: {
      serverstats_activity_period_period: "Time period to view statistics",
      serverstats_channels_period_period: "Time period to view statistics",
      serverstats_growth_period_period: "Time period to view statistics",
      serverstats_members_period_period: "Time period to view statistics",
      serverstats_support_period_period: "Time period to view statistics"
    },
    overview: {
      boosts: "✨ Boosts",
      boosts_value: "**Total Boosts:** {{count}}\n**Boosters:** {{boosters}}",
      channels: "📁 Channels",
      channels_value: "**Total:** {{total}}\n**Text:** {{text}}\n**Voice:** {{voice}}",
      emojis: "😀 Emojis",
      emojis_value: "**Total:** {{total}}\n**Static:** {{static}}\n**Animated:** {{animated}}",
      footer: "Server ID: {{id}}",
      info: "ℹ️ Information",
      info_value: "**Owner:** {{owner}}\n**Created:** {{created}}\n**Boost Tier:** {{boostLevel}}",
      members: "👥 Members",
      members_value: "**Total:** {{total}}\n**Humans:** {{humans}}\n**Bots:** {{bots}}\n**Online:** {{online}}",
      roles: "🎭 Roles",
      roles_value: "**Total:** {{total}}\n**Highest:** {{highest}}",
      title: "📊 Server Overview: {{server}}"
    },
    periods: {
      all: "All Time",
      day: "Today",
      month: "This Month",
      week: "This Week"
    },
    roles: {
      entry: "**{{index}}.** {{role}}\n└ {{count}} members ({{percent}}%)",
      footer: "Total roles: {{total}} | Showing top 15",
      role_entry: "**{{num}}.** {{role}}\n└ {{count}} members ({{percent}}%)",
      title: "🎭 Role Distribution"
    },
    slash: {
      description: "View server statistics",
      subcommands: {
        activity: {
          description: "View activity statistics",
          options: {
            period: "Time period to view statistics"
          }
        },
        channels: {
          description: "View channel activity statistics",
          options: {
            period: "Time period to view statistics"
          }
        },
        growth: {
          description: "View server growth statistics"
        },
        members: {
          description: "View member statistics",
          options: {
            period: "Time period to view statistics"
          }
        },
        overview: {
          description: "View server overview"
        },
        roles: {
          description: "View role distribution statistics"
        },
        support: {
          description: "View support ticket statistics",
          options: {
            period: "Time period to view statistics"
          }
        }
      }
    },
    support: {
      footer: "Period: {{period}}",
      response_times: "⏱️ Response Times",
      response_times_value: "**Avg Response:** {{avgResponse}}\n**Avg Resolution:** {{avgResolution}}",
      tickets: "📊 Tickets",
      tickets_value: "**Total:** {{total}}\n**Open:** {{open}}\n**Closed:** {{closed}}",
      times: "⏱️ Response Times",
      times_value: "**Avg Response:** {{avgResponse}}\n**Avg Resolution:** {{avgResolution}}",
      title: "🎫 Support Statistics - {{period}}",
      top_staff: "⭐ Top Staff (All Time)",
      top_staff_value: "{{num}}. <@{{userId}}> - {{count}} tickets"
    }
  }
};
