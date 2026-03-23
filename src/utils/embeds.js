const { EmbedBuilder } = require("discord.js");

const Colors = {
  PRIMARY: 0x5865F2, SUCCESS: 0x57F287, ERROR: 0xED4245,
  WARNING: 0xFEE75C, GOLD: 0xF1C40F,   INFO: 0x3498DB,
  DARK: 0x2B2D31,   ORANGE: 0xE67E22,
};

// ─────────────────────────────────────────────────────
//   TICKET EMBEDS
// ─────────────────────────────────────────────────────
function ticketOpen(ticketData, user, category, answers, client) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `Ticket #${ticketData.ticket_id} | ${category.label}`,
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setColor(category.color || Colors.PRIMARY)
    .setDescription(
      (category.welcomeMessage?.replace("{user}", `<@${user.id}>`) ||
      `¡Hola <@${user.id}>! Bienvenido a nuestro sistema de soporte. Un miembro del equipo te atenderá pronto.`) +
      "\n\n" +
      "**Resumen de la solicitud:**\n" +
      `▸ **Usuario:** <@${user.id}>\n` +
      `▸ **Categoría:** ${category.label}\n` +
      `▸ **Prioridad:** ${priorityLabel(ticketData.priority)}\n` +
      `▸ **Creado:** <t:${Math.floor(Date.now() / 1000)}:R>`
    )
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setFooter({ 
      text: "Utilice los botones de abajo para gestionar el ticket",
      iconURL: user.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();

  if (answers?.length) {
    const questions = category.questions || [];
    const qaText = answers.map((a, i) => `**${questions[i] || `Pregunta ${i + 1}`}**\n> ${a}`).join("\n\n");
    embed.addFields({ name: "📋 Información del Formulario", value: qaText.substring(0, 1024) });
  }

  return embed;
}

function ticketClosed(ticket, closedBy, reason, client) {
  return new EmbedBuilder()
    .setTitle("🔒 Ticket Cerrado")
    .setColor(Colors.ERROR)
    .addFields(
      { name: "🎫 ID",          value: `#${ticket.ticket_id}`,           inline: true },
      { name: "👤 Cerrado por", value: `<@${closedBy}>`,                 inline: true },
      { name: "📋 Razón",       value: reason || "Sin razón",            inline: false },
      { name: "⏱️ Duración",    value: duration(ticket.created_at),      inline: true },
      { name: "💬 Mensajes",    value: `${ticket.message_count}`,        inline: true },
    )
    .setFooter({
      text: "TON618 Tickets",
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();
}

function ticketReopened(ticket, reopenedBy, client) {
  return new EmbedBuilder()
    .setTitle("🔓 Ticket Reabierto")
    .setColor(Colors.SUCCESS)
    .setDescription(`<@${reopenedBy}> ha reabierto este ticket.\nUn miembro del staff retomará la atención pronto.`)
    .addFields({ name: "🔄 Reaperturas", value: `${ticket.reopen_count}`, inline: true })
    .setFooter({
      text: "TON618 Tickets",
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();
}

function ticketInfo(ticket, client) {
  const fields = [
    { name: "👤 Creador",       value: `<@${ticket.user_id}>`,           inline: true },
    { name: "📁 Categoría",     value: ticket.category,                  inline: true },
    { name: "⚡ Prioridad",     value: priorityLabel(ticket.priority),   inline: true },
    { name: "🟢 Estado",        value: ticket.status === "open" ? "✅ Abierto" : "🔒 Cerrado", inline: true },
    { name: "💬 Mensajes",      value: `${ticket.message_count}`,        inline: true },
    { name: "⏱️ Duración",      value: duration(ticket.created_at),      inline: true },
    { name: "📅 Creado",        value: `<t:${Math.floor(new Date(ticket.created_at).getTime()/1000)}:F>`, inline: false },
  ];
  if (ticket.claimed_by)  fields.push({ name: "👋 Reclamado por",  value: `<@${ticket.claimed_by}>`,  inline: true });
  if (ticket.assigned_to) fields.push({ name: "📌 Asignado a",     value: `<@${ticket.assigned_to}>`, inline: true });
  if (ticket.subject)     fields.push({ name: "📋 Asunto",         value: ticket.subject,             inline: false });
  if (ticket.first_staff_response) {
    const respTime = Math.round((new Date(ticket.first_staff_response) - new Date(ticket.created_at)) / 60000);
    fields.push({ name: "⚡ 1ª Respuesta", value: `${respTime} min`, inline: true });
  }
  if (ticket.reopen_count > 0) fields.push({ name: "🔄 Reaperturas", value: `${ticket.reopen_count}`, inline: true });
  return new EmbedBuilder()
    .setTitle(`ℹ️ Ticket #${ticket.ticket_id}`)
    .setColor(Colors.PRIMARY)
    .addFields(...fields)
    .setFooter({
      text: "TON618 Tickets",
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();
}

function ticketLog(ticket, user, action, details = {}, client) {
  const map = {
    open:       { title: "🎫 Ticket Abierto",          color: Colors.SUCCESS },
    close:      { title: "🔒 Ticket Cerrado",          color: Colors.ERROR   },
    reopen:     { title: "🔓 Ticket Reabierto",        color: Colors.SUCCESS },
    claim:      { title: "👋 Ticket Reclamado",        color: Colors.PRIMARY },
    unclaim:    { title: "↩️ Ticket Liberado",          color: Colors.WARNING },
    assign:     { title: "📌 Ticket Asignado",         color: Colors.INFO    },
    unassign:   { title: "📌 Asignación Removida",     color: Colors.WARNING },
    add:        { title: "➕ Usuario Añadido",          color: Colors.SUCCESS },
    remove:     { title: "➖ Usuario Quitado",          color: Colors.WARNING },
    transcript: { title: "📄 Transcripción Generada",  color: Colors.INFO    },
    rate:       { title: "⭐ Ticket Calificado",        color: Colors.GOLD    },
    move:       { title: "📂 Categoría Cambiada",      color: Colors.INFO    },
    priority:   { title: "⚡ Prioridad Cambiada",      color: Colors.WARNING },
    edit:       { title: "✏️ Mensaje Editado",          color: Colors.WARNING },
    delete:     { title: "🗑️ Mensaje Eliminado",        color: Colors.ERROR   },
    sla:        { title: "⚠️ Alerta SLA",               color: Colors.ORANGE  },
    smartping:  { title: "🔔 Sin Respuesta del Staff",  color: Colors.ORANGE  },
    autoclose:  { title: "⏰ Ticket Auto-cerrado",      color: Colors.ERROR   },
  };
  const info = map[action] || { title: "📋 Acción", color: Colors.PRIMARY };
  const embed = new EmbedBuilder()
    .setTitle(info.title)
    .setColor(info.color)
    .addFields(
      { name: "🎫 Ticket", value: `#${ticket.ticket_id} (<#${ticket.channel_id}>)`, inline: true },
      { name: "👤 Por",    value: `<@${user.id}>`,                                  inline: true },
      { name: "📁 Cat.",   value: ticket.category,                                  inline: true },
    )
    .setFooter({ 
      text: `UID: ${user.id}`,
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();
  Object.entries(details).forEach(([k, v]) => embed.addFields({ name: k, value: String(v).substring(0, 200), inline: true }));
  return embed;
}

// ─────────────────────────────────────────────────────
//   DASHBOARD
// ─────────────────────────────────────────────────────
function formatObservabilityField(summary) {
  if (!summary || !summary.interactionsTotal) {
    return "Sin actividad reciente registrada.";
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
    : "Ninguno";

  const windowMinutes = Math.max(1, Math.round((summary.windowSec || 0) / 60));

  return (
    `Ventana: ${windowMinutes}m\n` +
    `Interacciones: ${summary.interactionsTotal} (${summary.interactionsPerSec || 0}/s)\n` +
    `OK/Error/Denied/Rate: ${byStatus.ok || 0}/${byStatus.error || 0}/${byStatus.denied || 0}/${byStatus.rate_limited || 0}\n` +
    `Errores por scope: ${totalScopeErrors}\n` +
    `Top error: ${topErrorLabel}`
  );
}

function dashboardEmbed(stats, guild, awayStaff, leaderboard, client, observability = null) {
  // Backticks para bloques de código Discord
  const bt = String.fromCharCode(96, 96, 96);
  
  // Campo 1: Estadísticas Globales con formato de tabla YML
  const statsField = bt + "yml\n" +
    "  📊 Total de Tickets    :: " + (stats.total || 0) + "\n" +
    "  🟢 Tickets Abiertos   :: " + (stats.open || 0) + "\n" +
    "  🔴 Cerrados Hoy       :: " + (stats.closedToday || 0) + "\n" +
    "  📅 Abiertos Hoy       :: " + (stats.openedToday || 0) + "\n" + bt;

  // Campo 2: Top Staff con medallas
  const medals = ["🥇", "🥈", "🥉"];
  let topStaffField;
  if (leaderboard && leaderboard.length > 0) {
    topStaffField = bt + "yml\n" + leaderboard.slice(0, 3).map((s, i) => {
      const name = guild.members.cache.get(s.staff_id)?.user?.username || "Usuario";
      return medals[i] + " #" + (i + 1) + " " + name + " :: " + s.tickets_closed + " cerrados";
    }).join("\n") + "\n" + bt;
  } else {
    topStaffField = bt + "diff\n- Aún no hay datos\n" + bt;
  }

  // Campo 3: Staff Ausente
  let awayField;
  if (awayStaff && awayStaff.length > 0) {
    awayField = bt + "yml\n" + awayStaff.map(s => {
      const name = guild.members.cache.get(s.staff_id)?.user?.username || "Usuario";
      return "⏸️ " + name + " :: " + (s.away_reason || "Sin razón");
    }).join("\n") + "\n" + bt;
  } else {
    awayField = bt + "diff\n+ Todo el equipo está activo ✅\n" + bt;
  }

  return new EmbedBuilder()
    .setAuthor({
      name: "📊 Centro de Control y Estadísticas",
      iconURL: guild.iconURL({ dynamic: true })
    })
    .setTitle("📊 Centro de Control y Estadísticas")
    .setColor(Colors.DARK)
    .setDescription("📡 *Este panel se actualiza en tiempo real*")
    .addFields(
      { name: "📈 Estadísticas Globales", value: statsField, inline: false },
      { name: "🏆 Top Staff", value: topStaffField, inline: false },
      { name: "💤 Staff Ausente", value: awayField, inline: false }
    )
    .addFields({ name: "📡 Observabilidad", value: formatObservabilityField(observability), inline: false })
    .setFooter({ 
      text: "🔄 Actualización automática cada 30s",
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();
}

// ─────────────────────────────────────────────────────
//   STATS
// ─────────────────────────────────────────────────────
function statsEmbed(stats, guildName, client) {
  return new EmbedBuilder()
    .setTitle(`📊 Estadísticas — ${guildName}`)
    .setColor(Colors.PRIMARY)
    .addFields(
      { name: "🎫 Total",           value: `\`${stats.total}\``,                                              inline: true },
      { name: "🟢 Abiertos",        value: `\`${stats.open}\``,                                              inline: true },
      { name: "🔒 Cerrados",        value: `\`${stats.closed}\``,                                            inline: true },
      { name: "📅 Hoy",             value: `Abiertos: \`${stats.openedToday}\` | Cerrados: \`${stats.closedToday}\``, inline: false },
      { name: "📆 Esta semana",     value: `Abiertos: \`${stats.openedWeek}\` | Cerrados: \`${stats.closedWeek}\``,   inline: false },
      { name: "⭐ Cal. Promedio",   value: stats.avg_rating ? `\`${stats.avg_rating.toFixed(1)}/5\`` : "`Sin datos`", inline: true },
      { name: "⚡ T. Respuesta",    value: stats.avg_response_minutes ? `\`${formatMinutes(stats.avg_response_minutes)}\`` : "`Sin datos`", inline: true },
      { name: "⏱️ T. Cierre",      value: stats.avg_close_minutes ? `\`${formatMinutes(stats.avg_close_minutes)}\`` : "`Sin datos`", inline: true },
    )
    .setFooter({
      text: "TON618 Tickets",
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();
}

function weeklyReportEmbed(stats, guild, leaderboard, client) {
  const topStaff = leaderboard.slice(0, 5).map((s, i) =>
    `${["🥇","🥈","🥉","4️⃣","5️⃣"][i]} <@${s.staff_id}> — **${s.tickets_closed}** cerrados`
  ).join("\n") || "Sin actividad esta semana";

  const topCats = stats.topCategories?.map(([c, n]) => `▸ ${c}: **${n}**`).join("\n") || "Sin datos";

  return new EmbedBuilder()
    .setTitle(`📆 Reporte Semanal — ${guild.name}`)
    .setColor(Colors.GOLD)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setDescription(`Resumen de la actividad de tickets de los últimos 7 días.`)
    .addFields(
      { name: "🎫 Tickets abiertos",  value: `\`${stats.openedWeek}\``, inline: true },
      { name: "🔒 Tickets cerrados",  value: `\`${stats.closedWeek}\``, inline: true },
      { name: "🟢 Actualmente abiertos", value: `\`${stats.open}\``,   inline: true },
      { name: "⭐ Calificación promedio", value: stats.avg_rating ? `\`${stats.avg_rating.toFixed(1)}/5\`` : "`Sin datos`", inline: true },
      { name: "⚡ Tiempo de respuesta",  value: stats.avg_response_minutes ? `\`${formatMinutes(stats.avg_response_minutes)}\`` : "`Sin datos`", inline: true },
      { name: "🏆 Staff Destacado",    value: topStaff,  inline: false },
      { name: "📁 Categorías Activas", value: topCats,   inline: false },
    )
    .setFooter({ 
      text: "Reporte automático semanal",
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();
}

function leaderboardEmbed(lb, guild, client) {
  const medals  = ["🥇","🥈","🥉"];
  const desc = lb.length
    ? lb.map((s, i) =>
        `${medals[i] || `**${i+1}.**`} <@${s.staff_id}> — **${s.tickets_closed}** cerrados · **${s.tickets_claimed}** reclamados`
      ).join("\n")
    : "Aún no hay datos de staff.";
  return new EmbedBuilder()
    .setTitle("🏆 Leaderboard de Staff")
    .setColor(Colors.GOLD)
    .setDescription(desc)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({
      text: "TON618 Tickets",
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();
}

// ─────────────────────────────────────────────────────
//   MANTENIMIENTO
// ─────────────────────────────────────────────────────
function maintenanceEmbed(reason, client) {
  return new EmbedBuilder()
    .setTitle("🔧 Sistema en Mantenimiento")
    .setColor(Colors.WARNING)
    .setDescription(`El sistema de tickets está temporalmente desactivado.\n\n**Razón:** ${reason || "Mantenimiento programado"}\n\nPor favor vuelve más tarde.`)
    .setFooter({
      text: "TON618 Tickets",
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp();
}

// ─────────────────────────────────────────────────────
//   RATING
// ─────────────────────────────────────────────────────
function ratingEmbed(user, ticket, staffId, client) {
  const ticketId = typeof ticket === "object" ? ticket.ticket_id : ticket;
  const category = typeof ticket === "object" ? ticket.category : null;
  return new EmbedBuilder()
    .setTitle("⭐ ¿Cómo fue tu atención?")
    .setColor(Colors.GOLD)
    .setDescription(
      `Hola <@${user.id}>, tu ticket **#${ticketId}** ha sido cerrado.\n\n` +
      `**¿Cómo calificarías la atención que recibiste?**\n` +
      (staffId ? `👤 Staff que te atendió: <@${staffId}>\n` : "") +
      (category ? `📁 Categoría: ${category}\n` : "") +
      `\n⭐ Selecciona una calificación del 1 al 5:`
    )
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setFooter({ 
      text: "Tu opinión ayuda a mejorar la calidad del soporte • Expira en 10 minutos",
      iconURL: client?.user?.displayAvatarURL({ dynamic: true })
    });
}

// ─────────────────────────────────────────────────────
//   STAFF RATING LEADERBOARD
// ─────────────────────────────────────────────────────
function staffRatingLeaderboard(lb, guild, period) {
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
        const trend = s.avg >= 4.5 ? "🔥" : s.avg >= 4 ? "✅" : s.avg >= 3 ? "⚠️" : "❌";
        return medal + " <@" + s.staff_id + ">\n" +
               bar + " **" + s.avg + "/5** " + trend + " · `" + s.total + "` calificación" + (s.total !== 1 ? "es" : "");
      }).join("\n\n")
    : "Aún no hay calificaciones registradas.\n\nLas calificaciones aparecen cuando los usuarios califican tickets cerrados.";

  return new EmbedBuilder()
    .setTitle("🏆 Leaderboard de Staff — Calificaciones")
    .setColor(Colors.GOLD)
    .setDescription(desc)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({ text: guild.name + " · " + period + " · ⭐ estrella completa  ✨ media  ☆ vacía", iconURL: guild.iconURL({ dynamic: true }) })
    .setTimestamp();
}

// ─────────────────────────────────────────────────────
//   STAFF RATING PROFILE (stats individuales)
// ─────────────────────────────────────────────────────
function staffRatingProfile(staffUser, stats, guildName) {
  const avg = stats.avg;
  if (!avg) {
    return new EmbedBuilder()
      .setColor(Colors.INFO)
      .setTitle("📊 Calificaciones de " + staffUser.username)
      .setDescription("Este miembro del staff aún no tiene calificaciones registradas.")
      .setThumbnail(staffUser.displayAvatarURL({ dynamic: true }));
  }

  const starsFull  = "⭐".repeat(Math.floor(avg));
  const starsHalf  = avg - Math.floor(avg) >= 0.5 ? "✨" : "";
  const starsEmpty = "☆".repeat(5 - Math.floor(avg) - (starsHalf ? 1 : 0));
  const starBar    = starsFull + starsHalf + starsEmpty;
  const trend      = avg >= 4.5 ? "🔥 Excelente" : avg >= 4 ? "✅ Bueno" : avg >= 3 ? "⚠️ Regular" : "❌ Necesita mejorar";

  const maxDist = Math.max(...Object.values(stats.dist));
  const distBar = [5,4,3,2,1].map(n => {
    const count = stats.dist[n] || 0;
    const pct   = maxDist > 0 ? Math.round((count / maxDist) * 10) : 0;
    const bar   = "█".repeat(pct) + "░".repeat(10 - pct);
    return n + "⭐ `" + bar + "` " + count;
  }).join("\n");

  return new EmbedBuilder()
    .setColor(avg >= 4 ? Colors.SUCCESS : avg >= 3 ? Colors.WARNING : Colors.ERROR)
    .setTitle("📊 Calificaciones de " + staffUser.username)
    .setThumbnail(staffUser.displayAvatarURL({ dynamic: true, size: 256 }))
    .addFields(
      { name: "⭐ Promedio",              value: starBar + "\n**" + avg + "/5** — " + trend, inline: false },
      { name: "📊 Total calificaciones", value: "`" + stats.total + "`",                   inline: true },
      { name: "🎯 Máximo posible",        value: "`5.00`",                                  inline: true },
      { name: "📈 Distribución",          value: distBar,                                   inline: false },
    )
    .setFooter({ text: guildName })
    .setTimestamp();
}

// ─────────────────────────────────────────────────────
//   GENERALES
// ─────────────────────────────────────────────────────
function successEmbed(msg, client) { 
  const embed = new EmbedBuilder().setColor(Colors.SUCCESS).setDescription(`✅ ${msg}`);
  if (client) embed.setFooter({ iconURL: client.user.displayAvatarURL({ dynamic: true }) });
  return embed;
}
function errorEmbed(msg, client) { 
  const embed = new EmbedBuilder().setColor(Colors.ERROR).setDescription(`❌ **Error:** ${msg}`);
  if (client) embed.setFooter({ iconURL: client.user.displayAvatarURL({ dynamic: true }) });
  return embed;
}
function warningEmbed(msg, client) { 
  const embed = new EmbedBuilder().setColor(Colors.WARNING).setDescription(`⚠️ ${msg}`);
  if (client) embed.setFooter({ iconURL: client.user.displayAvatarURL({ dynamic: true }) });
  return embed;
}
function infoEmbed(title, desc, client) {
  const embed = new EmbedBuilder().setColor(Colors.INFO).setTitle(title).setDescription(desc).setTimestamp();
  if (client) embed.setFooter({ iconURL: client.user.displayAvatarURL({ dynamic: true }) });
  return embed;
}

// ─────────────────────────────────────────────────────
//   HELPERS
// ─────────────────────────────────────────────────────
function priorityLabel(p) {
  const map = { low: "🟢 Baja", normal: "🔵 Normal", high: "🟡 Alta", urgent: "🔴 Urgente" };
  return map[p] || p;
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
