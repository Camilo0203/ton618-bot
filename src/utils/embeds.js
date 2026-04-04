const { EmbedBuilder } = require("discord.js");
const { t, DEFAULT_LANGUAGE } = require("./i18n");
const { resolveBranding, applyBranding } = require("./branding");

const Colors = {
  PRIMARY: 0x5865F2, SUCCESS: 0x57F287, ERROR: 0xED4245,
  WARNING: 0xFEE75C, GOLD: 0xF1C40F,   INFO: 0x3498DB,
  DARK: 0x2B2D31,   ORANGE: 0xE67E22,
};

// ─────────────────────────────────────────────────────
//   TICKET EMBEDS
// ─────────────────────────────────────────────────────

function ticketOpen(ticketData, user, category, answers, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: t(language, "embeds.ticket.open.author", {
        ticketId: ticketData.ticket_id,
        category: category.label,
      }),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setColor(category.color || Colors.PRIMARY)
    .setDescription(
      (category.welcomeMessage?.replace("{user}", `<@${user.id}>`) ||
      t(language, "embeds.ticket.open.default_welcome", { userId: user.id })) +
      "\n\n" +
      t(language, "embeds.ticket.open.summary", {
        userId: user.id,
        category: category.label,
        priority: priorityLabel(ticketData.priority, language),
        createdAt: Math.floor(Date.now() / 1000),
      })
    )
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setFooter({
      text: t(language, "embeds.ticket.open.footer"),
      iconURL: user.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (answers?.length) {
    const questions = category.questions || [];
    const qaText = answers
      .map((answer, index) =>
        `**${questions[index] || t(language, "embeds.ticket.open.question_fallback", { index: index + 1 })}**\n> ${answer}`)
      .join("\n\n");
    embed.addFields({ name: t(language, "embeds.ticket.open.form_field"), value: qaText.substring(0, 1024) });
  }

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding, { keepCustomColor: !!category.color });
  }

  return embed;
}

function ticketClosed(ticket, closedBy, reason, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const embed = new EmbedBuilder()
    .setTitle(t(language, "embeds.ticket.closed.title"))
    .setColor(Colors.ERROR)
    .addFields(
      { name: t(language, "embeds.ticket.closed.fields.ticket"), value: `#${ticket.ticket_id}`, inline: true },
      { name: t(language, "embeds.ticket.closed.fields.closed_by"), value: `<@${closedBy}>`, inline: true },
      { name: t(language, "embeds.ticket.closed.fields.reason"), value: reason || t(language, "embeds.ticket.closed.no_reason"), inline: false },
      { name: t(language, "embeds.ticket.closed.fields.duration"), value: duration(ticket.created_at), inline: true },
      { name: t(language, "embeds.ticket.closed.fields.messages"), value: `${ticket.message_count}`, inline: true },
    )
    .setFooter({
      text: t(language, "ticket.footer"),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

function ticketReopened(ticket, reopenedBy, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const embed = new EmbedBuilder()
    .setTitle(t(language, "embeds.ticket.reopened.title"))
    .setColor(Colors.SUCCESS)
    .setDescription(t(language, "embeds.ticket.reopened.description", { userId: reopenedBy }))
    .addFields({ name: t(language, "embeds.ticket.reopened.fields.reopens"), value: `${ticket.reopen_count}`, inline: true })
    .setFooter({
      text: t(language, "ticket.footer"),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

function ticketInfo(ticket, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const fields = [
    { name: t(language, "embeds.ticket.info.fields.creator"), value: `<@${ticket.user_id}>`, inline: true },
    { name: t(language, "embeds.ticket.info.fields.category"), value: ticket.category, inline: true },
    { name: t(language, "embeds.ticket.info.fields.priority"), value: priorityLabel(ticket.priority, language), inline: true },
    {
      name: t(language, "embeds.ticket.info.fields.status"),
      value: ticket.status === "open"
        ? t(language, "embeds.ticket.info.status_open")
        : t(language, "embeds.ticket.info.status_closed"),
      inline: true,
    },
    { name: t(language, "embeds.ticket.info.fields.messages"), value: `${ticket.message_count}`, inline: true },
    { name: t(language, "embeds.ticket.info.fields.duration"), value: duration(ticket.created_at), inline: true },
    { name: t(language, "embeds.ticket.info.fields.created"), value: `<t:${Math.floor(new Date(ticket.created_at).getTime() / 1000)}:F>`, inline: false },
  ];

  if (ticket.claimed_by) fields.push({ name: t(language, "embeds.ticket.info.fields.claimed_by"), value: `<@${ticket.claimed_by}>`, inline: true });
  if (ticket.assigned_to) fields.push({ name: t(language, "embeds.ticket.info.fields.assigned_to"), value: `<@${ticket.assigned_to}>`, inline: true });
  if (ticket.subject) fields.push({ name: t(language, "embeds.ticket.info.fields.subject"), value: ticket.subject, inline: false });
  if (ticket.first_staff_response) {
    const respTime = Math.round((new Date(ticket.first_staff_response) - new Date(ticket.created_at)) / 60000);
    fields.push({
      name: t(language, "embeds.ticket.info.fields.first_response"),
      value: t(language, "embeds.ticket.info.first_response_value", { minutes: respTime }),
      inline: true,
    });
  }
  if (ticket.reopen_count > 0) fields.push({ name: t(language, "embeds.ticket.info.fields.reopens"), value: `${ticket.reopen_count}`, inline: true });

  const embed = new EmbedBuilder()
    .setTitle(t(language, "embeds.ticket.info.title", { ticketId: ticket.ticket_id }))
    .setColor(Colors.PRIMARY)
    .addFields(...fields)
    .setFooter({
      text: t(language, "ticket.footer"),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

function ticketLog(ticket, user, action, details = {}, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const map = {
    open:       { title: t(language, "embeds.ticket.log.actions.open"), color: Colors.SUCCESS },
    close:      { title: t(language, "embeds.ticket.log.actions.close"), color: Colors.ERROR },
    reopen:     { title: t(language, "embeds.ticket.log.actions.reopen"), color: Colors.SUCCESS },
    claim:      { title: t(language, "embeds.ticket.log.actions.claim"), color: Colors.PRIMARY },
    unclaim:    { title: t(language, "embeds.ticket.log.actions.unclaim"), color: Colors.WARNING },
    assign:     { title: t(language, "embeds.ticket.log.actions.assign"), color: Colors.INFO },
    unassign:   { title: t(language, "embeds.ticket.log.actions.unassign"), color: Colors.WARNING },
    add:        { title: t(language, "embeds.ticket.log.actions.add"), color: Colors.SUCCESS },
    remove:     { title: t(language, "embeds.ticket.log.actions.remove"), color: Colors.WARNING },
    transcript: { title: t(language, "embeds.ticket.log.actions.transcript"), color: Colors.INFO },
    rate:       { title: t(language, "embeds.ticket.log.actions.rate"), color: Colors.GOLD },
    move:       { title: t(language, "embeds.ticket.log.actions.move"), color: Colors.INFO },
    priority:   { title: t(language, "embeds.ticket.log.actions.priority"), color: Colors.WARNING },
    edit:       { title: t(language, "embeds.ticket.log.actions.edit"), color: Colors.WARNING },
    delete:     { title: t(language, "embeds.ticket.log.actions.delete"), color: Colors.ERROR },
    sla:        { title: t(language, "embeds.ticket.log.actions.sla"), color: Colors.ORANGE },
    smartping:  { title: t(language, "embeds.ticket.log.actions.smartping"), color: Colors.ORANGE },
    autoclose:  { title: t(language, "embeds.ticket.log.actions.autoclose"), color: Colors.ERROR },
  };
  const info = map[action] || { title: t(language, "embeds.ticket.log.actions.default"), color: Colors.PRIMARY };
  const embed = new EmbedBuilder()
    .setTitle(info.title)
    .setColor(info.color)
    .addFields(
      { name: t(language, "embeds.ticket.log.fields.ticket"), value: `#${ticket.ticket_id} (<#${ticket.channel_id}>)`, inline: true },
      { name: t(language, "embeds.ticket.log.fields.by"), value: `<@${user.id}>`, inline: true },
      { name: t(language, "embeds.ticket.log.fields.category"), value: ticket.category, inline: true },
    )
    .setFooter({
      text: t(language, "embeds.ticket.log.footer", { userId: user.id }),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

// ─────────────────────────────────────────────────────
//   DASHBOARD
// ─────────────────────────────────────────────────────

function formatObservabilityField(summary, language = DEFAULT_LANGUAGE) {
  if (!summary || !summary.interactionsTotal) {
    return t(language, "dashboard.no_recent_activity");
  }

  const byStatus = summary.byStatus || {};
  const errorsByScope = summary.errorsByScope || {};
  const totalScopeErrors = Object.values(errorsByScope).reduce(
    (acc, value) => acc + Number(value || 0),
    0
  );

  const topError = Array.isArray(summary.topErrors) && summary.topErrors.length
    ? summary.topErrors[0]
    : null;

  const topErrorLabel = topError
    ? `${topError.kind}/${topError.name} (${topError.errors})`
    : t(language, "common.none");

  const windowMinutes = Math.max(1, Math.round((summary.windowSec || 0) / 60));

  return (
    `${t(language, "observability.window")}: ${windowMinutes}m\n` +
    `${t(language, "observability.interactions")}: ${summary.interactionsTotal} (${summary.interactionsPerSec || 0}/s)\n` +
    `OK/Error/Denied/Rate: ${byStatus.ok || 0}/${byStatus.error || 0}/${byStatus.denied || 0}/${byStatus.rate_limited || 0}\n` +
    `${t(language, "observability.scope_errors")}: ${totalScopeErrors}\n` +
    `${t(language, "observability.top_error")}: ${topErrorLabel}`
  );
}

function dashboardEmbed(stats, guild, awayStaff, leaderboard, client, observability = null, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const bt = String.fromCharCode(96, 96, 96);

  const statsField = bt + "yml\n" +
    "  " + t(language, "dashboard.total_tickets") + "    :: " + (stats.total || 0) + "\n" +
    "  " + t(language, "dashboard.open_tickets") + "   :: " + (stats.open || 0) + "\n" +
    "  " + t(language, "dashboard.closed_today") + "       :: " + (stats.closedToday || 0) + "\n" +
    "  " + t(language, "dashboard.opened_today") + "       :: " + (stats.openedToday || 0) + "\n" + bt;

  const medals = ["🥇", "🥈", "🥉"];
  let topStaffField;
  if (leaderboard && leaderboard.length > 0) {
    topStaffField = bt + "yml\n" + leaderboard.slice(0, 3).map((s, i) => {
      const name = guild.members.cache.get(s.staff_id)?.user?.username || t(language, "common.user");
      return medals[i] + " #" + (i + 1) + " " + name + " :: " + s.tickets_closed + " " + t(language, "leaderboard.closed");
    }).join("\n") + "\n" + bt;
  } else {
    topStaffField = bt + "diff\n- " + t(language, "dashboard.no_data") + "\n" + bt;
  }

  let awayField;
  if (awayStaff && awayStaff.length > 0) {
    awayField = bt + "yml\n" + awayStaff.map(s => {
      const name = guild.members.cache.get(s.staff_id)?.user?.username || t(language, "common.user");
      return "⏸️ " + name + " :: " + (s.away_reason || t(language, "common.no_reason"));
    }).join("\n") + "\n" + bt;
  } else {
    awayField = bt + "diff\n+ " + t(language, "dashboard.all_active") + "\n" + bt;
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t(language, "dashboard.title"),
      iconURL: guild.iconURL({ dynamic: true })
    })
    .setTitle(t(language, "dashboard.title"))
    .setColor(Colors.DARK)
    .setDescription(t(language, "dashboard.description"))
    .addFields(
      { name: t(language, "dashboard.global_stats"), value: statsField, inline: false },
      { name: t(language, "dashboard.top_staff"), value: topStaffField, inline: false },
      { name: t(language, "dashboard.away_staff"), value: awayField, inline: false }
    )
    .addFields({ name: t(language, "dashboard.observability"), value: formatObservabilityField(observability, language), inline: false })
    .setFooter({
      text: t(language, "dashboard.auto_update"),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

function statsEmbed(stats, guildName, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const embed = new EmbedBuilder()
    .setTitle(t(language, "stats.title", { guildName }))
    .setColor(Colors.PRIMARY)
    .addFields(
      { name: t(language, "stats.total"),           value: `\`${stats.total}\``,                                              inline: true },
      { name: t(language, "stats.open"),        value: `\`${stats.open}\``,                                              inline: true },
      { name: t(language, "stats.closed"),        value: `\`${stats.closed}\``,                                            inline: true },
      { name: t(language, "stats.today"),             value: `${t(language, "stats.opened")}: \`${stats.openedToday}\` | ${t(language, "stats.closed_cap")}: \`${stats.closedToday}\``, inline: false },
      { name: t(language, "stats.this_week"),     value: `${t(language, "stats.opened")}: \`${stats.openedWeek}\` | ${t(language, "stats.closed_cap")}: \`${stats.closedWeek}\``,   inline: false },
      { name: t(language, "stats.avg_rating"),   value: stats.avg_rating ? `\`${stats.avg_rating.toFixed(1)}/5\`` : "`" + t(language, "stats.no_data") + "`", inline: true },
      { name: t(language, "stats.response_time"),    value: stats.avg_response_minutes ? `\`${formatMinutes(stats.avg_response_minutes)}\`` : "`" + t(language, "stats.no_data") + "`", inline: true },
      { name: t(language, "stats.close_time"),      value: stats.avg_close_minutes ? `\`${formatMinutes(stats.avg_close_minutes)}\`` : "`" + t(language, "stats.no_data") + "`", inline: true },
    )
    .setFooter({
      text: t(language, "ticket.footer"),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

function weeklyReportEmbed(stats, guild, leaderboard, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const topStaff = leaderboard.slice(0, 5).map((s, i) =>
    `${["🥇","🥈","🥉","4️⃣","5️⃣"][i]} <@${s.staff_id}> — **${s.tickets_closed}** ${t(language, "leaderboard.closed")}`
  ).join("\n") || t(language, "weekly_report.no_data");

  const topCats = stats.topCategories?.map(([c, n]) => `▸ ${c}: **${n}**`).join("\n") || t(language, "weekly_report.no_data");

  const embed = new EmbedBuilder()
    .setTitle(t(language, "weekly_report.title", { guildName: guild.name }))
    .setColor(Colors.GOLD)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setDescription(t(language, "weekly_report.description"))
    .addFields(
      { name: t(language, "weekly_report.tickets_opened"),  value: `\`${stats.openedWeek}\``, inline: true },
      { name: t(language, "weekly_report.tickets_closed"),  value: `\`${stats.closedWeek}\``, inline: true },
      { name: t(language, "weekly_report.currently_open"), value: `\`${stats.open}\``,   inline: true },
      { name: t(language, "weekly_report.avg_rating"), value: stats.avg_rating ? `\`${stats.avg_rating.toFixed(1)}/5\`` : "`" + t(language, "weekly_report.no_data") + "`", inline: true },
      { name: t(language, "weekly_report.response_time"),  value: stats.avg_response_minutes ? `\`${formatMinutes(stats.avg_response_minutes)}\`` : "`" + t(language, "weekly_report.no_data") + "`", inline: true },
      { name: t(language, "weekly_report.top_staff"),    value: topStaff,  inline: false },
      { name: t(language, "weekly_report.active_categories"), value: topCats,   inline: false },
    )
    .setFooter({
      text: t(language, "weekly_report.footer"),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

function leaderboardEmbed(lb, guild, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const medals  = ["🥇","🥈","🥉"];
  const desc = lb.length
    ? lb.map((s, i) =>
        `${medals[i] || `**${i+1}.**`} <@${s.staff_id}> — **${s.tickets_closed}** ${t(language, "leaderboard.closed")} · **${s.tickets_claimed}** ${t(language, "leaderboard.claimed")}`
      ).join("\n")
    : t(language, "leaderboard.no_data");

  const embed = new EmbedBuilder()
    .setTitle(t(language, "leaderboard.title"))
    .setColor(Colors.GOLD)
    .setDescription(desc)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({
      text: t(language, "ticket.footer"),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

// ─────────────────────────────────────────────────────
//   MAINTENANCE & RATING
// ─────────────────────────────────────────────────────

function maintenanceEmbed(reason, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const embed = new EmbedBuilder()
    .setTitle(t(language, "ticket.maintenance.title"))
    .setColor(Colors.WARNING)
    .setDescription(t(language, "ticket.maintenance.description", {
      reason: reason || t(language, "ticket.maintenance.scheduled"),
    }))
    .setFooter({
      text: t(language, "ticket.footer"),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

function ratingEmbed(user, ticket, staffId, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const ticketId = typeof ticket === "object" ? ticket.ticket_id : ticket;
  const category = typeof ticket === "object" ? ticket.category : null;
  const descriptionLines = [
    t(language, "ticket.rating.prompt_description", { userId: user.id, ticketId }),
  ];

  if (staffId) {
    descriptionLines.push(`${t(language, "ticket.rating.prompt_staff_label")}: <@${staffId}>`);
  }
  if (category) {
    descriptionLines.push(`${t(language, "ticket.field_category")}: ${category}`);
  }

  const embed = new EmbedBuilder()
    .setTitle(t(language, "ticket.rating.prompt_title"))
    .setColor(Colors.GOLD)
    .setDescription(descriptionLines.join("\n"))
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setFooter({
      text: t(language, "ticket.rating.prompt_footer"),
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    });

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

// ─────────────────────────────────────────────────────
//   STAFF RATING
// ─────────────────────────────────────────────────────

function staffRatingLeaderboard(lb, guild, period, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const medals  = ["🥇","🥈","🥉"];
  const starBar = (avg) => {
    const full  = Math.floor(avg);
    const half  = avg - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "⭐".repeat(full) + (half ? "✨" : "") + "☆".repeat(empty);
  };

  const desc = lb.length
    ? lb.map((s, i) => {
        const bar   = starBar(s.avg);
        const medal = medals[i] || ("**`" + String(i+1).padStart(2) + "`**");
        const trend = s.avg >= 4.5 ? t(language, "staff_rating.trend_excellent") : s.avg >= 4 ? t(language, "staff_rating.trend_good") : s.avg >= 3 ? t(language, "staff_rating.trend_average") : t(language, "staff_rating.trend_needs_improve");
        return medal + " <@" + s.staff_id + ">\n" +
               bar + " **" + s.avg + "/5** " + trend + " · `" + s.total + "` " + t(language, "staff_rating.total_ratings");
      }).join("\n\n")
    : t(language, "staff_rating.no_ratings");

  const embed = new EmbedBuilder()
    .setTitle(t(language, "staff_rating.leaderboard_title"))
    .setColor(Colors.GOLD)
    .setDescription(desc)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({ text: guild.name + " · " + period + " · " + t(language, "staff_rating.star_full") + " " + t(language, "staff_rating.star_half") + " " + t(language, "staff_rating.star_empty"), iconURL: guild.iconURL({ dynamic: true }) })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

function staffRatingProfile(staffUser, stats, guildName, language = DEFAULT_LANGUAGE, brandingOrSettings = null) {
  const avg = stats.avg;
  if (!avg) {
    const embed = new EmbedBuilder()
      .setColor(Colors.INFO)
      .setTitle(t(language, "staff_rating.profile_title", { username: staffUser.username }))
      .setDescription(t(language, "staff_rating.no_ratings_profile"))
      .setThumbnail(staffUser.displayAvatarURL({ dynamic: true }));

    if (brandingOrSettings) {
      const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
      applyBranding(embed, branding);
    }
    return embed;
  }

  const starsFull  = "⭐".repeat(Math.floor(avg));
  const starsHalf  = avg - Math.floor(avg) >= 0.5 ? "✨" : "";
  const starsEmpty = "☆".repeat(5 - Math.floor(avg) - (starsHalf ? 1 : 0));
  const starBar    = starsFull + starsHalf + starsEmpty;
  const trend      = avg >= 4.5 ? t(language, "staff_rating.trend_excellent") : avg >= 4 ? t(language, "staff_rating.trend_good") : avg >= 3 ? t(language, "staff_rating.trend_average") : t(language, "staff_rating.trend_needs_improve");

  const maxDist = Math.max(...Object.values(stats.dist));
  const distBar = [5,4,3,2,1].map(n => {
    const count = stats.dist[n] || 0;
    const pct   = maxDist > 0 ? Math.round((count / maxDist) * 10) : 0;
    const bar   = "█".repeat(pct) + "░".repeat(10 - pct);
    return n + "⭐ `" + bar + "` " + count;
  }).join("\n");

  const embed = new EmbedBuilder()
    .setColor(avg >= 4 ? Colors.SUCCESS : avg >= 3 ? Colors.WARNING : Colors.ERROR)
    .setTitle(t(language, "staff_rating.profile_title", { username: staffUser.username }))
    .setThumbnail(staffUser.displayAvatarURL({ dynamic: true, size: 256 }))
    .addFields(
      { name: t(language, "staff_rating.average"),              value: starBar + "\n**" + avg + "/5** — " + trend, inline: false },
      { name: t(language, "staff_rating.total_ratings"), value: "`" + stats.total + "`",                   inline: true },
      { name: t(language, "staff_rating.max"),        value: "`5.00`",                                  inline: true },
      { name: t(language, "staff_rating.distribution"),          value: distBar,                                   inline: false },
    )
    .setFooter({ text: guildName })
    .setTimestamp();

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

// ─────────────────────────────────────────────────────
//   GENERAL EMBEDS
// ─────────────────────────────────────────────────────

function successEmbed(msg, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) { 
  const embed = new EmbedBuilder().setColor(Colors.SUCCESS).setDescription(`✅ ${msg}`);
  if (client) embed.setFooter({ iconURL: client.user.displayAvatarURL({ dynamic: true }) });
  
  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }
  return embed;
}

function errorEmbed(msg, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) { 
  const embed = new EmbedBuilder().setColor(Colors.ERROR).setDescription(`❌ **${t(language, "common.labels.error")}:** ${msg}`);
  if (client) embed.setFooter({ iconURL: client.user.displayAvatarURL({ dynamic: true }) });

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }
  return embed;
}

function warningEmbed(msg, client, language = DEFAULT_LANGUAGE, brandingOrSettings = null) { 
  const embed = new EmbedBuilder().setColor(Colors.WARNING).setDescription(`⚠️ ${msg}`);
  if (client) embed.setFooter({ iconURL: client.user.displayAvatarURL({ dynamic: true }) });

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }
  return embed;
}

function infoEmbed(title, desc, client, brandingOrSettings = null) {
  const embed = new EmbedBuilder().setColor(Colors.INFO).setTitle(title).setDescription(desc).setTimestamp();
  if (client) embed.setFooter({ iconURL: client.user.displayAvatarURL({ dynamic: true }) });

  if (brandingOrSettings) {
    const branding = brandingOrSettings.isPro !== undefined ? brandingOrSettings : resolveBranding(brandingOrSettings);
    applyBranding(embed, branding);
  }

  return embed;
}

// ─────────────────────────────────────────────────────
//   HELPERS
// ─────────────────────────────────────────────────────

function priorityLabel(priority, language = DEFAULT_LANGUAGE) {
  const map = {
    low: `🟢 ${t(language, "ticket.priority.low")}`,
    normal: `🔵 ${t(language, "ticket.priority.normal")}`,
    high: `🟡 ${t(language, "ticket.priority.high")}`,
    urgent: `🔴 ${t(language, "ticket.priority.urgent")}`,
  };
  return map[priority] || priority;
}

function duration(createdAt) {
  const mins = Math.floor((Date.now() - new Date(createdAt)) / 60000);
  if (mins < 60)   return `${mins}m`;
  if (mins < 1440) return `${Math.floor(mins/60)}h ${mins%60}m`;
  return `${Math.floor(mins/1440)}d ${Math.floor((mins%1440)/60)}h`;
}

function formatMinutes(mins) {
  if (!mins) return "—";
  if (mins < 60)   return `${Math.round(mins)}m`;
  if (mins < 1440) return `${Math.floor(mins/60)}h ${Math.round(mins%60)}m`;
  return `${Math.floor(mins/1440)}d ${Math.floor((mins%1440)/60)}h`;
}

module.exports = {
  Colors, ticketOpen, ticketClosed, ticketReopened, ticketInfo, ticketLog,
  dashboardEmbed, statsEmbed, weeklyReportEmbed, leaderboardEmbed,
  maintenanceEmbed, ratingEmbed, staffRatingLeaderboard, staffRatingProfile,
  successEmbed, errorEmbed, warningEmbed, infoEmbed,
  priorityLabel, duration, formatMinutes,
};
