const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { staffStats, staffRatings, tickets, settings } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { hasRequiredPlan, buildProRequiredEmbed } = require("../../../utils/commercial");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View ticket operations statistics")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((s) => s.setName("server").setDescription("View server-wide ticket metrics"))
    .addSubcommand((s) => s.setName("sla").setDescription("View SLA compliance and escalation metrics"))
    .addSubcommand((s) =>
      s
        .setName("staff")
        .setDescription("View stats for a staff member")
        .addUserOption((o) => o.setName("user").setDescription("Staff member to inspect").setRequired(false))
    )
    .addSubcommand((s) => s.setName("leaderboard").setDescription("Rank staff by closed tickets"))
    .addSubcommand((s) =>
      s
        .setName("ratings")
        .setDescription("Rank staff by ticket ratings")
        .addStringOption((o) =>
          o
            .setName("period")
            .setDescription("Time period to display")
            .setRequired(false)
            .addChoices(
              { name: "All time", value: "all" },
              { name: "Last month", value: "month" },
              { name: "Last week", value: "week" }
            )
        )
    )
    .addSubcommand((s) =>
      s
        .setName("staff-rating")
        .setDescription("View detailed ratings for a staff member")
        .addUserOption((o) => o.setName("user").setDescription("Staff member").setRequired(true))
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
      if (!hasRequiredPlan(guildSettings, "pro")) {
        return interaction.reply({
          embeds: [buildProRequiredEmbed(guildSettings, "/stats sla")],
          flags: 64,
        });
      }

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
        ? "No data"
        : `${metrics.avgFirstResponseMinutes} min`;
      const withinSlaText = metrics.withinSlaPct === null
        ? "No SLA threshold or no responses yet"
        : `${metrics.withinSlaPct}% (${metrics.firstResponseWithinSla}/${metrics.firstResponseCount})`;
      const slaThresholdText = slaTotalMinutes > 0 ? `${slaTotalMinutes} min` : "Disabled";
      const escalationThresholdText = guildSettings?.sla_escalation_minutes > 0
        ? `${guildSettings.sla_escalation_minutes} min`
        : "Not configured";
      const slaRuleCount = Object.keys(guildSettings?.sla_overrides_priority || {}).length
        + Object.keys(guildSettings?.sla_overrides_category || {}).length;
      const escalationRuleCount = Object.keys(guildSettings?.sla_escalation_overrides_priority || {}).length
        + Object.keys(guildSettings?.sla_escalation_overrides_category || {}).length;

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.INFO)
            .setTitle(`SLA - ${guild.name}`)
            .setDescription("Operational SLA view for first response and escalation pressure.")
            .addFields(
              { name: "SLA threshold", value: `\`${slaThresholdText}\``, inline: true },
              { name: "Escalation", value: `\`${guildSettings?.sla_escalation_enabled ? "Enabled" : "Disabled"}\``, inline: true },
              { name: "Escalation threshold", value: `\`${escalationThresholdText}\``, inline: true },
              { name: "SLA overrides", value: `\`${slaRuleCount}\``, inline: true },
              { name: "Escalation overrides", value: `\`${escalationRuleCount}\``, inline: true },
              { name: "Open tickets out of SLA", value: `\`${metrics.openBreached}\``, inline: true },
              { name: "Open escalated tickets", value: `\`${metrics.escalatedOpen}\``, inline: true },
              { name: "Avg first response", value: `\`${avgFirstResponseText}\``, inline: true },
              { name: "SLA compliance", value: withinSlaText, inline: false },
              { name: "Tickets evaluated", value: `\`${metrics.totalTickets}\``, inline: true }
            )
            .setTimestamp(),
        ],
      });
    }

    if (sub === "staff") {
      const user = interaction.options.getUser("user")
        || interaction.options.getUser("usuario")
        || interaction.user;
      const s = await staffStats.get(guild.id, user.id);
      const rData = await staffRatings.getStaffStats(guild.id, user.id);
      if (!s && !rData.total) {
        return interaction.reply({ embeds: [E.infoEmbed("No data", `<@${user.id}> does not have stats yet.`)], flags: 64 });
      }

      const avgText = rData.avg
        ? "*".repeat(Math.floor(rData.avg)) + (rData.avg - Math.floor(rData.avg) >= 0.5 ? "*" : "") + " **" + rData.avg + "/5** (" + rData.total + " ratings)"
        : "No ratings yet";

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Staff Stats - " + user.username)
            .setColor(E.Colors.PRIMARY)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
              { name: "Closed tickets", value: "`" + (s?.tickets_closed || 0) + "`", inline: true },
              { name: "Claimed tickets", value: "`" + (s?.tickets_claimed || 0) + "`", inline: true },
              { name: "Assigned tickets", value: "`" + (s?.tickets_assigned || 0) + "`", inline: true },
              { name: "Average rating", value: avgText, inline: false }
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
      const period = interaction.options.getString("period")
        || interaction.options.getString("periodo")
        || "all";
      const lb = await staffRatings.getLeaderboard(guild.id, 1);
      const periodLabel = { all: "All time", month: "Last month", week: "Last week" };

      if (!lb.length) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.GOLD)
              .setTitle("Ratings Leaderboard")
              .setDescription("There are no ratings yet.")
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
              username: member?.user?.username || "User " + entry.staff_id.slice(-4),
              avatar: member?.user?.displayAvatarURL({ dynamic: true }),
            };
          } catch {
            return { ...entry, username: "Staff " + entry.staff_id.slice(-4) };
          }
        })
      );

      return interaction.editReply({ embeds: [E.staffRatingLeaderboard(enriched, guild, periodLabel[period])] });
    }

    if (sub === "staff-rating" || sub === "staffrating") {
      const user = interaction.options.getUser("user") || interaction.options.getUser("usuario");
      const stats = await staffRatings.getStaffStats(guild.id, user.id);
      return interaction.reply({ embeds: [E.staffRatingProfile(user, stats, guild.name)] });
    }
  },
};
