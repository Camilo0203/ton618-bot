const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { staffStats, staffRatings, tickets, settings } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { hasRequiredPlan, buildProRequiredEmbed } = require("../../../utils/commercial");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { withDescriptionLocalizations } = require("../../../utils/slashLocalizations");

function buildServerEmbed(stats, guild, language) {
  return new EmbedBuilder()
    .setTitle(t(language, "stats.server_title", { guild: guild.name }))
    .setColor(E.Colors.PRIMARY)
    .addFields(
      { name: t(language, "stats.total"), value: `\`${stats.total}\``, inline: true },
      { name: t(language, "stats.open"), value: `\`${stats.open}\``, inline: true },
      { name: t(language, "stats.closed"), value: `\`${stats.closed}\``, inline: true },
      {
        name: t(language, "stats.today"),
        value: `${t(language, "stats.opened")}: \`${stats.openedToday}\` | ${t(language, "stats.closed")}: \`${stats.closedToday}\``,
        inline: false,
      },
      {
        name: t(language, "stats.week"),
        value: `${t(language, "stats.opened")}: \`${stats.openedWeek}\` | ${t(language, "stats.closed")}: \`${stats.closedWeek}\``,
        inline: false,
      },
      {
        name: t(language, "stats.avg_rating"),
        value: stats.avg_rating ? `\`${stats.avg_rating.toFixed(1)}/5\`` : `\`${t(language, "stats.no_data")}\``,
        inline: true,
      },
      {
        name: t(language, "stats.avg_response"),
        value: stats.avg_response_minutes ? `\`${E.formatMinutes(stats.avg_response_minutes)}\`` : `\`${t(language, "stats.no_data")}\``,
        inline: true,
      },
      {
        name: t(language, "stats.avg_close"),
        value: stats.avg_close_minutes ? `\`${E.formatMinutes(stats.avg_close_minutes)}\`` : `\`${t(language, "stats.no_data")}\``,
        inline: true,
      }
    )
    .setTimestamp();
}

function buildStaffEmbed(user, s, rData, language) {
  const avgText = rData.avg
    ? `${rData.avg}/5 (${t(language, "stats.ratings_count", { count: rData.total })})`
    : t(language, "stats.no_ratings_yet");

  return new EmbedBuilder()
    .setTitle(t(language, "stats.staff_title", { user: user.username }))
    .setColor(E.Colors.PRIMARY)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: t(language, "stats.closed_tickets"), value: `\`${s?.tickets_closed || 0}\``, inline: true },
      { name: t(language, "stats.claimed_tickets"), value: `\`${s?.tickets_claimed || 0}\``, inline: true },
      { name: t(language, "stats.assigned_tickets"), value: `\`${s?.tickets_assigned || 0}\``, inline: true },
      { name: t(language, "stats.average_rating"), value: avgText, inline: false }
    )
    .setTimestamp();
}

function buildLeaderboardEmbed(lb, guild, language) {
  const medals = ["🥇", "🥈", "🥉"];
  const desc = lb.length
    ? lb.map((entry, index) =>
      `${medals[index] || `**${index + 1}.**`} <@${entry.staff_id}> - **${entry.tickets_closed}** ${t(language, "stats.leaderboard_closed")} - **${entry.tickets_claimed}** ${t(language, "stats.leaderboard_claimed")}`
    ).join("\n")
    : t(language, "stats.leaderboard_empty");

  return new EmbedBuilder()
    .setTitle(t(language, "stats.leaderboard_title"))
    .setColor(E.Colors.GOLD)
    .setDescription(desc)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setTimestamp();
}

function buildStaffRatingProfileEmbed(user, stats, guild, language) {
  if (!stats.avg) {
    return new EmbedBuilder()
      .setColor(E.Colors.INFO)
      .setTitle(t(language, "stats.staff_rating_title", { user: user.username }))
      .setDescription(t(language, "stats.staff_rating_empty"))
      .setThumbnail(user.displayAvatarURL({ dynamic: true }));
  }

  return new EmbedBuilder()
    .setColor(stats.avg >= 4 ? E.Colors.SUCCESS : stats.avg >= 3 ? E.Colors.WARNING : E.Colors.ERROR)
    .setTitle(t(language, "stats.staff_rating_title", { user: user.username }))
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: t(language, "stats.average_score"), value: `\`${stats.avg}/5\``, inline: true },
      { name: t(language, "stats.total_ratings"), value: `\`${stats.total}\``, inline: true },
      {
        name: t(language, "stats.average_rating"),
        value: [5, 4, 3, 2, 1]
          .map((rating) => `${rating}★: \`${stats.dist?.[rating] || 0}\``)
          .join("\n"),
        inline: false,
      }
    )
    .setFooter({ text: guild.name })
    .setTimestamp();
}

module.exports = {
  data: withDescriptionLocalizations(
    new SlashCommandBuilder()
      .setName("stats")
      .setDescription(t("en", "stats.slash.description"))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommand((s) => withDescriptionLocalizations(
        s.setName("server").setDescription(t("en", "stats.slash.subcommands.server.description")),
        "stats.slash.subcommands.server.description"
      ))
      .addSubcommand((s) => withDescriptionLocalizations(
        s.setName("sla").setDescription(t("en", "stats.slash.subcommands.sla.description")),
        "stats.slash.subcommands.sla.description"
      ))
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("staff")
            .setDescription(t("en", "stats.slash.subcommands.staff.description"))
            .addUserOption((o) => o.setName("user").setDescription("Staff member to inspect").setRequired(false)),
          "stats.slash.subcommands.staff.description"
        )
      )
      .addSubcommand((s) => withDescriptionLocalizations(
        s.setName("leaderboard").setDescription(t("en", "stats.slash.subcommands.leaderboard.description")),
        "stats.slash.subcommands.leaderboard.description"
      ))
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("ratings")
            .setDescription(t("en", "stats.slash.subcommands.ratings.description"))
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
            ),
          "stats.slash.subcommands.ratings.description"
        )
      )
      .addSubcommand((s) =>
        withDescriptionLocalizations(
          s
            .setName("staff-rating")
            .setDescription(t("en", "stats.slash.subcommands.staff_rating.description"))
            .addUserOption((o) => o.setName("user").setDescription("Staff member").setRequired(true)),
          "stats.slash.subcommands.staff_rating.description"
        )
      ),
    "stats.slash.description"
  ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const guildSettings = await settings.get(guild.id);
    const language = resolveInteractionLanguage(interaction, guildSettings);

    if (sub === "server") {
      const stats = await tickets.getStats(guild.id);
      return interaction.reply({ embeds: [buildServerEmbed(stats, guild, language)] });
    }

    if (sub === "sla") {
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
        ? t(language, "stats.no_data")
        : `${metrics.avgFirstResponseMinutes} min`;
      const withinSlaText = metrics.withinSlaPct === null
        ? t(language, "stats.no_sla_threshold")
        : `${metrics.withinSlaPct}% (${metrics.firstResponseWithinSla}/${metrics.firstResponseCount})`;
      const slaThresholdText = slaTotalMinutes > 0 ? `${slaTotalMinutes} min` : t(language, "common.state.disabled");
      const escalationThresholdText = guildSettings?.sla_escalation_minutes > 0
        ? `${guildSettings.sla_escalation_minutes} min`
        : t(language, "stats.not_configured");
      const slaRuleCount = Object.keys(guildSettings?.sla_overrides_priority || {}).length
        + Object.keys(guildSettings?.sla_overrides_category || {}).length;
      const escalationRuleCount = Object.keys(guildSettings?.sla_escalation_overrides_priority || {}).length
        + Object.keys(guildSettings?.sla_escalation_overrides_category || {}).length;

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.INFO)
            .setTitle(t(language, "stats.sla_title", { guild: guild.name }))
            .setDescription(t(language, "stats.sla_description"))
            .addFields(
              { name: t(language, "stats.sla_threshold"), value: `\`${slaThresholdText}\``, inline: true },
              { name: t(language, "stats.escalation"), value: `\`${guildSettings?.sla_escalation_enabled ? t(language, "common.state.enabled") : t(language, "common.state.disabled")}\``, inline: true },
              { name: t(language, "stats.escalation_threshold"), value: `\`${escalationThresholdText}\``, inline: true },
              { name: t(language, "stats.sla_overrides"), value: `\`${slaRuleCount}\``, inline: true },
              { name: t(language, "stats.escalation_overrides"), value: `\`${escalationRuleCount}\``, inline: true },
              { name: t(language, "stats.open_out_of_sla"), value: `\`${metrics.openBreached}\``, inline: true },
              { name: t(language, "stats.open_escalated"), value: `\`${metrics.escalatedOpen}\``, inline: true },
              { name: t(language, "stats.avg_first_response"), value: `\`${avgFirstResponseText}\``, inline: true },
              { name: t(language, "stats.sla_compliance"), value: withinSlaText, inline: false },
              { name: t(language, "stats.tickets_evaluated"), value: `\`${metrics.totalTickets}\``, inline: true }
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
        return interaction.reply({
          embeds: [
            E.infoEmbed(
              t(language, "stats.staff_no_data_title"),
              t(language, "stats.staff_no_data_description", { userId: user.id })
            ),
          ],
          flags: 64,
        });
      }

      return interaction.reply({
        embeds: [buildStaffEmbed(user, s, rData, language)],
      });
    }

    if (sub === "leaderboard") {
      const lb = await staffStats.getLeaderboard(guild.id);
      return interaction.reply({ embeds: [buildLeaderboardEmbed(lb, guild, language)] });
    }

    if (sub === "ratings") {
      await interaction.deferReply();
      const period = interaction.options.getString("period")
        || interaction.options.getString("periodo")
        || "all";
      const lb = await staffRatings.getLeaderboard(guild.id, 1);
      const periodLabel = {
        all: t(language, "stats.period_all"),
        month: t(language, "stats.period_month"),
        week: t(language, "stats.period_week"),
      };

      if (!lb.length) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(E.Colors.GOLD)
              .setTitle(t(language, "stats.ratings_title"))
              .setDescription(t(language, "stats.ratings_empty"))
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
              username: member?.user?.username || t(language, "stats.fallback_user", { suffix: entry.staff_id.slice(-4) }),
            };
          } catch {
            return {
              ...entry,
              username: t(language, "stats.fallback_staff", { suffix: entry.staff_id.slice(-4) }),
            };
          }
        })
      );

      const description = enriched.map((entry, index) =>
        `${index + 1}. **${entry.username}** - \`${entry.avg}/5\` - \`${entry.total}\``
      ).join("\n");

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.GOLD)
            .setTitle(`${t(language, "stats.ratings_title")} - ${periodLabel[period] || period}`)
            .setDescription(description)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp(),
        ],
      });
    }

    if (sub === "staff-rating" || sub === "staffrating") {
      const user = interaction.options.getUser("user") || interaction.options.getUser("usuario");
      const stats = await staffRatings.getStaffStats(guild.id, user.id);
      return interaction.reply({
        embeds: [buildStaffRatingProfileEmbed(user, stats, guild, language)],
      });
    }
  },
};
