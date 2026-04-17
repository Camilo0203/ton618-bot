const { tickets, settings, staffStatus, staffStats } = require("../utils/database");
const { dashboardEmbed } = require("../utils/embeds");
const { buildWindowSummary } = require("../utils/observability");
const { buildTicketPanelPayload } = require("../domain/tickets/panelPayload");
const { resolveGuildLanguage, t } = require("../utils/i18n");
const logger = require("../utils/structuredLogger");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { categories: ticketCategories = [] } = require("../../config");

// Intervalo de actualizacion del dashboard (30 segundos)
const DASHBOARD_UPDATE_INTERVAL = 30 * 1000;

// Variable para almacenar el cliente
let dashboardClient = null;

/**
 * Actualiza o crea el mensaje del dashboard en el canal configurado
 */
async function updateDashboard(guild, isManual = false) {
  if (isManual) {
    logger.info('dashboardHandler', `Updating dashboard for guild ${guild.name}`);
  }
  try {
    const s = await settings.get(guild.id);
    if (!s || !s.dashboard_channel) {
      if (isManual) {
        logger.warn('dashboardHandler', `No dashboard channel configured for ${guild.name}`);
      }
      return;
    }

    let channel = guild.channels.cache.get(s.dashboard_channel);
    if (!channel) {
      channel = await guild.channels.fetch(s.dashboard_channel);
      if (!channel) return;
    }

    const stats = await tickets.getStats(guild.id);
    const awayStaff = await staffStatus.getAway(guild.id);
    const lb = await staffStats.getLeaderboard(guild.id);
    const observability = buildWindowSummary();
    const language = resolveGuildLanguage(s);
    const embed = dashboardEmbed(stats, guild, awayStaff, lb, null, observability, language);

    // Componente: Boton de actualizar panel
    const refreshButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("refresh_dashboard")
          .setLabel(t(language, "dashboard.update_button"))
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("🔄")
      );

    if (s.dashboard_message_id) {
      try {
        const msg = await channel.messages.fetch(s.dashboard_message_id);
        await msg.edit({ embeds: [embed], components: [refreshButton] });
        if (isManual) {
          logger.info('dashboardHandler', `Dashboard updated in channel ${channel.name}`);
        }
        return;
      } catch {}
    }

    const msg = await channel.send({ embeds: [embed], components: [refreshButton] });
    if (isManual) {
      logger.info('dashboardHandler', `Dashboard created in channel ${channel.name}`);
    }
    await settings.update(guild.id, { dashboard_message_id: msg.id });
  } catch (e) {}
}

/**
 * Actualiza o crea el panel de tickets en el canal configurado desde el Dashboard web.
 */
async function updateTicketPanel(guild) {
  logger.info('dashboardHandler', `Updating ticket panel for guild ${guild.name}`);

  try {
    const s = await settings.get(guild.id);

    if (!s || !s.panel_channel_id) {
      logger.warn('dashboardHandler', `No ticket panel channel configured for ${guild.name}`);
      return;
    }

    let channel = guild.channels.cache.get(s.panel_channel_id);
    if (!channel) {
      try {
        channel = await guild.channels.fetch(s.panel_channel_id);
      } catch {
        logger.warn('dashboardHandler', `Could not fetch channel ${s.panel_channel_id} for ${guild.name}`);
        return;
      }
    }

    if (!channel) {
      logger.warn('dashboardHandler', `Channel not found: ${s.panel_channel_id} for ${guild.name}`);
      return;
    }

    const botMember = guild.members.me;
    if (!channel.permissionsFor(botMember).has("SendMessages") || !channel.permissionsFor(botMember).has("EmbedLinks")) {
      logger.warn('dashboardHandler', `Bot lacks permissions in channel ${channel.name}`);
      return;
    }

    if (s.panel_message_id) {
      try {
        const existingMsg = await channel.messages.fetch(s.panel_message_id);
        if (existingMsg) {
          const currentOpenCount = await tickets.countOpenByGuild(guild.id);
          const payload = buildTicketPanelPayload({
            guild,
            categories: ticketCategories,
            openTicketCount: currentOpenCount,
            settingsRecord: s,
          });
          await existingMsg.edit(payload);
          logger.info('dashboardHandler', `Ticket panel updated in channel ${channel.name}`);
          return;
        }
      } catch {
        logger.info('dashboardHandler', 'Previous message deleted, creating new one');
      }
    }

    const freshOpenCount = await tickets.countOpenByGuild(guild.id);
    const newPayload = buildTicketPanelPayload({
      guild,
      categories: ticketCategories,
      openTicketCount: freshOpenCount,
      settingsRecord: s,
    });
    const newPanelMessage = await channel.send(newPayload);
    await settings.update(guild.id, { panel_message_id: newPanelMessage.id });
    logger.info('dashboardHandler', `Ticket panel created in channel ${channel.name}`);
  } catch (error) {
    logger.error('dashboardHandler', `Error updating ticket panel for ${guild.name}`, { error: error?.message || String(error) });
  }
}

/**
 * Actualizar el dashboard en todos los servidores
 */
async function updateAllDashboards(client) {
  for (const [, guild] of client.guilds.cache) {
    await updateDashboard(guild);
  }
}

/**
 * Iniciar actualizacion automatica del dashboard
 */
function startDashboardAutoUpdate(client) {
  dashboardClient = client;
  setTimeout(() => updateAllDashboards(client), 5000);
  setInterval(() => {
    if (client && client.isReady()) {
      updateAllDashboards(client);
    }
  }, DASHBOARD_UPDATE_INTERVAL);
  logger.info('dashboardHandler', 'Auto-update started (every 30s)');
}

/**
 * Forzar actualizacion inmediata del dashboard
 */
async function forceUpdateDashboard(guildId) {
  if (!dashboardClient) return;
  const guild = dashboardClient.guilds.cache.get(guildId);
  if (guild) await updateDashboard(guild, true);
}

module.exports = {
  updateDashboard,
  updateTicketPanel,
  updateAllDashboards,
  startDashboardAutoUpdate,
  forceUpdateDashboard,
};
