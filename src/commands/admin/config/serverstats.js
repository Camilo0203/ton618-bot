"use strict";

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { serverStats, messageActivity, tickets, staffStats } = require("../../../utils/database");
const { requireSupportServer } = require("../../../utils/supportServerOnly");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");

// Helper functions
function getPeriodName(period) {
  switch (period) {
    case "day": return "Today";
    case "week": return "This Week";
    case "month": return "This Month";
    case "all": return "All Time";
    default: return "Unknown";
  }
}

function formatTime(ms) {
  if (!ms || ms <= 0) return "N/A";

  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstats")
    .setDescription("View server statistics")
    .setDescriptionLocalizations({
      "es-ES": "Ver estadísticas del servidor",
      "es-419": "Ver estadísticas del servidor"
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub
        .setName("overview")
        .setDescription("View general server overview")
        .setDescriptionLocalizations({
          "es-ES": "Ver vista general del servidor",
          "es-419": "Ver vista general del servidor"
        })
    )
    .addSubcommand(sub =>
      sub
        .setName("members")
        .setDescription("View member statistics")
        .setDescriptionLocalizations({
          "es-ES": "Ver estadísticas de miembros",
          "es-419": "Ver estadísticas de miembros"
        })
        .addStringOption(opt =>
          opt
            .setName("period")
            .setDescription("Time period to analyze")
            .addChoices(
              { name: "Today", value: "day" },
              { name: "This Week", value: "week" },
              { name: "This Month", value: "month" },
              { name: "All Time", value: "all" }
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("activity")
        .setDescription("View server activity statistics")
        .setDescriptionLocalizations({
          "es-ES": "Ver estadísticas de actividad del servidor",
          "es-419": "Ver estadísticas de actividad del servidor"
        })
        .addStringOption(opt =>
          opt
            .setName("period")
            .setDescription("Time period to analyze")
            .addChoices(
              { name: "Today", value: "day" },
              { name: "This Week", value: "week" },
              { name: "This Month", value: "month" }
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("growth")
        .setDescription("View server growth statistics")
        .setDescriptionLocalizations({
          "es-ES": "Ver estadísticas de crecimiento del servidor",
          "es-419": "Ver estadísticas de crecimiento del servidor"
        })
    )
    .addSubcommand(sub =>
      sub
        .setName("support")
        .setDescription("View support-specific statistics")
        .setDescriptionLocalizations({
          "es-ES": "Ver estadísticas específicas de soporte",
          "es-419": "Ver estadísticas específicas de soporte"
        })
        .addStringOption(opt =>
          opt
            .setName("period")
            .setDescription("Time period to analyze")
            .addChoices(
              { name: "Today", value: "day" },
              { name: "This Week", value: "week" },
              { name: "This Month", value: "month" }
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("channels")
        .setDescription("View channel activity statistics")
        .setDescriptionLocalizations({
          "es-ES": "Ver estadísticas de actividad de canales",
          "es-419": "Ver estadísticas de actividad de canales"
        })
        .addStringOption(opt =>
          opt
            .setName("period")
            .setDescription("Time period to analyze")
            .addChoices(
              { name: "Today", value: "day" },
              { name: "This Week", value: "week" },
              { name: "This Month", value: "month" }
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("roles")
        .setDescription("View role distribution statistics")
        .setDescriptionLocalizations({
          "es-ES": "Ver estadísticas de distribución de roles",
          "es-419": "Ver estadísticas de distribución de roles"
        })
    ),

  async execute(interaction) {
    const isAllowed = await requireSupportServer(interaction);
    if (!isAllowed) return;

    const guildSettings = await settings.get(interaction.guildId);
    const lang = resolveGuildLanguage(guildSettings);

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "overview":
        return this.handleOverview(interaction, lang);
      case "members":
        return this.handleMembers(interaction, lang);
      case "activity":
        return this.handleActivity(interaction, lang);
      case "growth":
        return this.handleGrowth(interaction, lang);
      case "support":
        return this.handleSupport(interaction, lang);
      case "channels":
        return this.handleChannels(interaction, lang);
      case "roles":
        return this.handleRoles(interaction, lang);
    }
  },

  async handleOverview(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;

    try {
      const members = await guild.members.fetch();
      const humans = members.filter(m => !m.user.bot);
      const bots = members.filter(m => m.user.bot);
      const online = members.filter(m => m.presence?.status === "online" || m.presence?.status === "idle" || m.presence?.status === "dnd");

      const embed = new EmbedBuilder()
        .setTitle(t(lang, "serverstats.overview.title", { server: guild.name }))
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setColor(0x5865F2)
        .addFields(
          {
            name: t(lang, "serverstats.overview.members"),
            value: t(lang, "serverstats.overview.members_value", { 
              total: guild.memberCount.toString(), 
              humans: humans.size.toString(), 
              bots: bots.size.toString(), 
              online: online.size.toString() 
            }),
            inline: true
          },
          {
            name: t(lang, "serverstats.overview.channels"),
            value: t(lang, "serverstats.overview.channels_value", { 
              total: guild.channels.cache.size.toString(), 
              text: guild.channels.cache.filter(c => c.isTextBased()).size.toString(), 
              voice: guild.channels.cache.filter(c => c.isVoiceBased()).size.toString() 
            }),
            inline: true
          },
          {
            name: t(lang, "serverstats.overview.roles"),
            value: t(lang, "serverstats.overview.roles_value", { 
              total: guild.roles.cache.size.toString(), 
              highest: guild.roles.highest.name 
            }),
            inline: true
          },
          {
            name: t(lang, "serverstats.overview.emojis"),
            value: t(lang, "serverstats.overview.emojis_value", { 
              total: guild.emojis.cache.size.toString(), 
              static: guild.emojis.cache.filter(e => !e.animated).size.toString(), 
              animated: guild.emojis.cache.filter(e => e.animated).size.toString() 
            }),
            inline: true
          },
          {
            name: t(lang, "serverstats.overview.info"),
            value: t(lang, "serverstats.overview.info_value", { 
              owner: `<@${guild.ownerId}>`, 
              created: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, 
              boostLevel: guild.premiumTier.toString() 
            }),
            inline: true
          },
          {
            name: t(lang, "serverstats.overview.boosts"),
            value: t(lang, "serverstats.overview.boosts_value", { 
              count: (guild.premiumSubscriptionCount || 0).toString(), 
              boosters: guild.members.cache.filter(m => m.premiumSince).size.toString() 
            }),
            inline: true
          }
        )
        .setFooter({ text: t(lang, "serverstats.overview.footer", { id: guild.id }) })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error fetching overview:", error);
      return interaction.editReply({
        content: t(lang, "serverstats.errors.overview_failed"),
        ephemeral: true
      });
    }
  },

  async handleMembers(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const period = interaction.options.getString("period") || "week";
    const guild = interaction.guild;

    try {
      let days = 7;
      if (period === "day") days = 1;
      else if (period === "month") days = 30;
      else if (period === "all") days = 365;

      const snapshots = await serverStats.getSnapshots(guild.id, days);

      const members = await guild.members.fetch();
      const humans = members.filter(m => !m.user.bot);

      // Calcular nuevos miembros
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const newMembers = humans.filter(m => m.joinedTimestamp > cutoff.getTime());

      const embed = new EmbedBuilder()
        .setTitle(`👥 Member Statistics - ${getPeriodName(period)}`)
        .setColor(0x5865F2)
        .addFields(
          {
            name: "📈 Current Stats",
            value: `**Total Members:** ${guild.memberCount}\n**Humans:** ${humans.size}\n**Bots:** ${members.size - humans.size}`,
            inline: true
          },
          {
            name: "🆕 New Members",
            value: `**Joined:** ${newMembers.size}\n**Average/Day:** ${(newMembers.size / days).toFixed(1)}`,
            inline: true
          }
        );

      if (snapshots.length > 1) {
        const oldest = snapshots[0];
        const newest = snapshots[snapshots.length - 1];
        const growth = newest.total_members - oldest.total_members;
        const growthPercent = ((growth / oldest.total_members) * 100).toFixed(1);

        embed.addFields({
          name: "📊 Growth",
          value: `**Change:** ${growth > 0 ? '+' : ''}${growth}\n**Percentage:** ${growthPercent}%`,
          inline: true
        });
      }

      embed.setFooter({ text: `Period: ${getPeriodName(period)}` })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error fetching member stats:", error);
      return interaction.editReply({
        content: t(lang, "serverstats.errors.members_failed"),
        ephemeral: true
      });
    }
  },

  async handleActivity(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const period = interaction.options.getString("period") || "week";
    const guild = interaction.guild;

    try {
      let days = 7;
      if (period === "day") days = 1;
      else if (period === "month") days = 30;

      const activity = await messageActivity.getActivity(guild.id, days);
      const topChannels = await messageActivity.getTopChannels(guild.id, days, 5);
      const topUsers = await messageActivity.getTopUsers(guild.id, days, 5);
      const peakHours = await messageActivity.getPeakHours(guild.id, days);

      const totalMessages = activity.reduce((sum, a) => sum + (a.total_messages || 0), 0);
      const avgPerDay = (totalMessages / days).toFixed(0);

      const embed = new EmbedBuilder()
        .setTitle(`📊 Activity Statistics - ${getPeriodName(period)}`)
        .setColor(0x5865F2)
        .addFields(
          {
            name: "💬 Messages",
            value: `**Total:** ${totalMessages.toLocaleString()}\n**Avg/Day:** ${avgPerDay}`,
            inline: true
          }
        );

      if (topChannels.length > 0) {
        embed.addFields({
          name: "🔥 Top Channels",
          value: topChannels.map((c, i) => 
            `${i + 1}. <#${c.channel_id}> - ${c.messages.toLocaleString()} msgs`
          ).join("\n"),
          inline: false
        });
      }

      if (topUsers.length > 0) {
        embed.addFields({
          name: "⭐ Most Active Users",
          value: topUsers.map((u, i) => 
            `${i + 1}. <@${u.user_id}> - ${u.messages.toLocaleString()} msgs`
          ).join("\n"),
          inline: false
        });
      }

      if (peakHours.length > 0) {
        const sorted = peakHours.sort((a, b) => b.messages - a.messages);
        const peak = sorted[0];
        embed.addFields({
          name: "⏰ Peak Hour",
          value: `**${peak.hour}:00 - ${peak.hour + 1}:00** with ${peak.messages.toLocaleString()} messages`,
          inline: false
        });
      }

      embed.setFooter({ text: `Period: ${getPeriodName(period)}` })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error fetching activity stats:", error);
      return interaction.editReply({
        content: t(lang, "serverstats.errors.activity_failed"),
        ephemeral: true
      });
    }
  },

  async handleGrowth(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;

    try {
      const snapshots = await serverStats.getSnapshots(guild.id, 30);

      if (snapshots.length < 2) {
        return interaction.editReply({
          content: t(lang, "serverstats.errors.no_data", { type: "Growth" }),
          ephemeral: true
        });
      }

      const oldest = snapshots[0];
      const newest = snapshots[snapshots.length - 1];
      const growth = newest.total_members - oldest.total_members;
      const growthPercent = ((growth / oldest.total_members) * 100).toFixed(1);

      // Calcular tendencia
      const recentGrowth = snapshots.slice(-7);
      const avgDailyGrowth = recentGrowth.length > 1
        ? (recentGrowth[recentGrowth.length - 1].total_members - recentGrowth[0].total_members) / recentGrowth.length
        : 0;

      const embed = new EmbedBuilder()
        .setTitle("📈 Server Growth Statistics")
        .setColor(0x5865F2)
        .addFields(
          {
            name: "📊 30-Day Growth",
            value: `**Total Change:** ${growth > 0 ? '+' : ''}${growth}\n**Percentage:** ${growthPercent}%\n**Start:** ${oldest.total_members}\n**Current:** ${newest.total_members}`,
            inline: true
          },
          {
            name: "📅 Recent Trend",
            value: `**Avg Daily Growth:** ${avgDailyGrowth > 0 ? '+' : ''}${avgDailyGrowth.toFixed(1)}\n**Projected (30d):** ${(avgDailyGrowth * 30).toFixed(0)}`,
            inline: true
          }
        )
        .setFooter({ text: "Based on last 30 days of data" })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error fetching growth stats:", error);
      return interaction.editReply({
        content: t(lang, "serverstats.errors.growth_failed"),
        ephemeral: true
      });
    }
  },

  async handleSupport(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const period = interaction.options.getString("period") || "week";
    const guild = interaction.guild;

    try {
      let days = 7;
      if (period === "day") days = 1;
      else if (period === "month") days = 30;

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      // Obtener tickets del período
      const allTickets = await tickets.getByGuild(guild.id);
      const periodTickets = allTickets.filter(t => new Date(t.created_at) > cutoff);

      const openTickets = periodTickets.filter(t => t.status === "open");
      const closedTickets = periodTickets.filter(t => t.status === "closed");

      // Calcular tiempos promedio
      let avgResponseTime = 0;
      let avgResolutionTime = 0;

      if (closedTickets.length > 0) {
        const responseTimes = closedTickets
          .filter(t => t.first_response_at)
          .map(t => new Date(t.first_response_at) - new Date(t.created_at));
        
        const resolutionTimes = closedTickets
          .filter(t => t.closed_at)
          .map(t => new Date(t.closed_at) - new Date(t.created_at));

        if (responseTimes.length > 0) {
          avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        }

        if (resolutionTimes.length > 0) {
          avgResolutionTime = resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length;
        }
      }

      // Top staff
      const staffStatsData = await staffStats.getTopByTicketsClosed(guild.id, 5);

      const embed = new EmbedBuilder()
        .setTitle(`🎫 Support Statistics - ${getPeriodName(period)}`)
        .setColor(0x5865F2)
        .addFields(
          {
            name: "📊 Tickets",
            value: `**Total:** ${periodTickets.length}\n**Open:** ${openTickets.length}\n**Closed:** ${closedTickets.length}`,
            inline: true
          },
          {
            name: "⏱️ Response Times",
            value: `**Avg Response:** ${formatTime(avgResponseTime)}\n**Avg Resolution:** ${formatTime(avgResolutionTime)}`,
            inline: true
          }
        );

      if (staffStatsData.length > 0) {
        embed.addFields({
          name: "⭐ Top Staff (All Time)",
          value: staffStatsData.map((s, i) => 
            `${i + 1}. <@${s.user_id}> - ${s.tickets_closed} tickets`
          ).join("\n"),
          inline: false
        });
      }

      embed.setFooter({ text: `Period: ${getPeriodName(period)}` })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error fetching support stats:", error);
      return interaction.editReply({
        content: t(lang, "serverstats.errors.support_failed"),
        ephemeral: true
      });
    }
  },

  async handleChannels(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const period = interaction.options.getString("period") || "week";
    const guild = interaction.guild;

    try {
      let days = 7;
      if (period === "day") days = 1;
      else if (period === "month") days = 30;

      const topChannels = await messageActivity.getTopChannels(guild.id, days, 10);

      if (topChannels.length === 0) {
        return interaction.editReply({
          content: t(lang, "serverstats.errors.no_activity"),
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(`📝 Channel Activity - ${getPeriodName(period)}`)
        .setColor(0x5865F2)
        .setDescription(
          topChannels.map((c, i) => {
            const channel = guild.channels.cache.get(c.channel_id);
            const channelName = channel ? `<#${c.channel_id}>` : `Unknown (${c.channel_id})`;
            return `**${i + 1}.** ${channelName}\n└ ${c.messages.toLocaleString()} messages`;
          }).join("\n\n")
        )
        .setFooter({ text: `Period: ${getPeriodName(period)} | Top 10 channels` })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error fetching channel stats:", error);
      return interaction.editReply({
        content: t(lang, "serverstats.errors.channels_failed"),
        ephemeral: true
      });
    }
  },

  async handleRoles(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;

    try {
      const members = await guild.members.fetch();
      const roleStats = new Map();

      // Contar miembros por rol
      guild.roles.cache.forEach(role => {
        if (role.name === "@everyone") return;
        const count = members.filter(m => m.roles.cache.has(role.id)).size;
        if (count > 0) {
          roleStats.set(role.id, { role, count });
        }
      });

      // Ordenar por cantidad
      const sorted = Array.from(roleStats.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

      const embed = new EmbedBuilder()
        .setTitle("🎭 Role Distribution")
        .setColor(0x5865F2)
        .setDescription(
          sorted.map((r, i) => {
            const percentage = ((r.count / members.size) * 100).toFixed(1);
            return `**${i + 1}.** ${r.role}\n└ ${r.count} members (${percentage}%)`;
          }).join("\n\n")
        )
        .setFooter({ text: `Total roles: ${guild.roles.cache.size} | Showing top 15` })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error fetching role stats:", error);
      return interaction.editReply({
        content: t(lang, "serverstats.errors.roles_failed"),
        ephemeral: true
      });
    }
  }
};
