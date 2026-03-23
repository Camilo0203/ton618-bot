const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { staffStats, staffRatings, tickets, settings } = require("../../../utils/database");
const E = require("../../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Muestra estadisticas del sistema de tickets")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((s) => s.setName("server").setDescription("Estadisticas globales del servidor"))
    .addSubcommand((s) => s.setName("sla").setDescription("Metricas de cumplimiento de SLA y escalado"))
    .addSubcommand((s) =>
      s
        .setName("staff")
        .setDescription("Stats de un miembro del staff")
        .addUserOption((o) => o.setName("usuario").setDescription("Staff a consultar").setRequired(false))
    )
    .addSubcommand((s) => s.setName("leaderboard").setDescription("Ranking del staff por tickets cerrados"))
    .addSubcommand((s) =>
      s
        .setName("ratings")
        .setDescription("Leaderboard de staff ordenado por calificaciones")
        .addStringOption((o) =>
          o
            .setName("periodo")
            .setDescription("Periodo a mostrar")
            .setRequired(false)
            .addChoices(
              { name: "Todo el tiempo", value: "all" },
              { name: "Ultimo mes", value: "month" },
              { name: "Ultima semana", value: "week" }
            )
        )
    )
    .addSubcommand((s) =>
      s
        .setName("staffrating")
        .setDescription("Ver calificaciones detalladas de un miembro del staff")
        .addUserOption((o) => o.setName("usuario").setDescription("Miembro del staff").setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (sub === "server") {
      const stats = await tickets.getStats(guild.id);
      return interaction.reply({ embeds: [E.statsEmbed(stats, guild.name)] });
    }

    if (sub === "sla") {
      const guildSettings = await settings.get(guild.id);
      const slaTotalMinutes = Number(
        (guildSettings?.sla_hours || 0) > 0
          ? guildSettings.sla_hours * 60
          : (guildSettings?.sla_minutes || 0)
      );
      const metricsSettings = slaTotalMinutes !== Number(guildSettings?.sla_minutes || 0)
        ? { ...guildSettings, sla_minutes: slaTotalMinutes }
        : guildSettings;
      const metrics = await tickets.getSlaMetrics(guild.id, slaTotalMinutes, metricsSettings);

      const avgFirstResponseText = metrics.avgFirstResponseMinutes === null
        ? "Sin datos"
        : `${metrics.avgFirstResponseMinutes} min`;
      const withinSlaText = metrics.withinSlaPct === null
        ? "Sin umbral SLA o sin respuestas"
        : `${metrics.withinSlaPct}% (${metrics.firstResponseWithinSla}/${metrics.firstResponseCount})`;
      const slaThresholdText = slaTotalMinutes > 0 ? `${slaTotalMinutes} min` : "Desactivado";
      const escalationThresholdText = guildSettings?.sla_escalation_minutes > 0
        ? `${guildSettings.sla_escalation_minutes} min`
        : "No configurado";
      const slaRuleCount = Object.keys(guildSettings?.sla_overrides_priority || {}).length
        + Object.keys(guildSettings?.sla_overrides_category || {}).length;
      const escalationRuleCount = Object.keys(guildSettings?.sla_escalation_overrides_priority || {}).length
        + Object.keys(guildSettings?.sla_escalation_overrides_category || {}).length;

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.INFO)
            .setTitle(`SLA - ${guild.name}`)
            .setDescription("Metricas operativas del tiempo de primera respuesta y escalado.")
            .addFields(
              { name: "Umbral SLA", value: `\`${slaThresholdText}\``, inline: true },
              { name: "Escalado", value: `\`${guildSettings?.sla_escalation_enabled ? "Activo" : "Inactivo"}\``, inline: true },
              { name: "Umbral escalado", value: `\`${escalationThresholdText}\``, inline: true },
              { name: "Reglas SLA", value: `\`${slaRuleCount}\``, inline: true },
              { name: "Reglas escalado", value: `\`${escalationRuleCount}\``, inline: true },
              { name: "Tickets abiertos fuera de SLA", value: `\`${metrics.openBreached}\``, inline: true },
              { name: "Tickets abiertos escalados", value: `\`${metrics.escalatedOpen}\``, inline: true },
              { name: "Primera respuesta promedio", value: `\`${avgFirstResponseText}\``, inline: true },
              { name: "Cumplimiento de SLA", value: withinSlaText, inline: false },
              { name: "Tickets evaluados", value: `\`${metrics.totalTickets}\``, inline: true }
            )
            .setTimestamp(),
        ],
      });
    }

    if (sub === "staff") {
      const user = interaction.options.getUser("usuario") || interaction.user;
      const s = await staffStats.get(guild.id, user.id);
      const rData = await staffRatings.getStaffStats(guild.id, user.id);
      if (!s && !rData.total) {
        return interaction.reply({ embeds: [E.infoEmbed("Sin datos", "<@" + user.id + "> no tiene estadisticas aun.")], flags: 64 });
      }

      const avgText = rData.avg
        ? "*".repeat(Math.floor(rData.avg)) + (rData.avg - Math.floor(rData.avg) >= 0.5 ? "*" : "") + " **" + rData.avg + "/5** (" + rData.total + " calificaciones)"
        : "Sin calificaciones aun";

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Stats - " + user.username)
            .setColor(E.Colors.PRIMARY)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
              { name: "Tickets cerrados", value: "`" + (s?.tickets_closed || 0) + "`", inline: true },
              { name: "Tickets reclamados", value: "`" + (s?.tickets_claimed || 0) + "`", inline: true },
              { name: "Tickets asignados", value: "`" + (s?.tickets_assigned || 0) + "`", inline: true },
              { name: "Calificacion promedio", value: avgText, inline: false }
            )
            .setTimestamp(),
        ],
      });
    }

    if (sub === "leaderboard") {
      const lb = await staffStats.getLeaderboard(guild.id);
      return interaction.reply({ embeds: [E.leaderboardEmbed(lb, guild)] });
    }

    if (sub === "ratings") {
      await interaction.deferReply();
      const periodo = interaction.options.getString("periodo") || "all";
      const lb = await staffRatings.getLeaderboard(guild.id, 1);
      const periodoLabel = { all: "Todo el tiempo", month: "Ultimo mes", week: "Ultima semana" };

      if (!lb.length) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.GOLD)
              .setTitle("Leaderboard de Calificaciones")
              .setDescription("Aun no hay calificaciones registradas.")
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setTimestamp(),
          ],
        });
      }

      const enriched = await Promise.all(
        lb.map(async (entry) => {
          try {
            const member = await guild.members.fetch(entry.staff_id).catch(() => null);
            return {
              ...entry,
              username: member?.user?.username || "Usuario " + entry.staff_id.slice(-4),
              avatar: member?.user?.displayAvatarURL({ dynamic: true }),
            };
          } catch {
            return { ...entry, username: "Staff " + entry.staff_id.slice(-4) };
          }
        })
      );

      return interaction.editReply({ embeds: [E.staffRatingLeaderboard(enriched, guild, periodoLabel[periodo])] });
    }

    if (sub === "staffrating") {
      const user = interaction.options.getUser("usuario");
      const stats = await staffRatings.getStaffStats(guild.id, user.id);
      return interaction.reply({ embeds: [E.staffRatingProfile(user, stats, guild.name)] });
    }
  },
};
