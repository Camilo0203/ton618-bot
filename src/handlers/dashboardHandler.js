const { tickets, settings, staffStatus, staffStats } = require("../utils/database");
const { dashboardEmbed } = require("../utils/embeds");
const { buildWindowSummary } = require("../utils/observability");
const { buildTicketPanelPayload } = require("../domain/tickets/panelPayload");
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
    console.log(`[DASHBOARD] Intentando actualizar el panel para el servidor ${guild.name}...`);
  }
  try {
    const s = await settings.get(guild.id);
    if (!s || !s.dashboard_channel) {
      if (isManual) {
        console.log(`\x1b[33m[DASHBOARD] ⚠️ Cancelado: No hay 'Canal del Dashboard' configurado en la web para ${guild.name}\x1b[0m`);
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
    const embed = dashboardEmbed(stats, guild, awayStaff, lb, null, observability);

    // Componente: Boton de actualizar panel
    const refreshButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("refresh_dashboard")
          .setLabel("Actualizar Panel")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("🔄")
      );

    if (s.dashboard_message_id) {
      try {
        const msg = await channel.messages.fetch(s.dashboard_message_id);
        await msg.edit({ embeds: [embed], components: [refreshButton] });
        if (isManual) {
          console.log(`\x1b[32m[DASHBOARD] ✅ Panel actualizado correctamente en el canal ${channel.name}\x1b[0m`);
        }
        return;
      } catch {}
    }

    const msg = await channel.send({ embeds: [embed], components: [refreshButton] });
    if (isManual) {
      console.log(`\x1b[32m[DASHBOARD] ✅ Panel actualizado correctamente en el canal ${channel.name}\x1b[0m`);
    }
    await settings.update(guild.id, { dashboard_message_id: msg.id });
  } catch (e) {}
}

/**
 * Actualiza o crea el panel de tickets en el canal configurado desde el Dashboard web.
 */
async function updateTicketPanel(guild) {
  console.log(`[TICKET PANEL] Intentando actualizar el panel de tickets para el servidor ${guild.name}...`);

  try {
    const s = await settings.get(guild.id);

    if (!s || !s.panel_channel_id) {
      console.log(`\x1b[33m[TICKET PANEL] ⚠️ Cancelado: No hay 'Canal del Panel de Tickets' configurado en la web para ${guild.name}\x1b[0m`);
      return;
    }

    let channel = guild.channels.cache.get(s.panel_channel_id);
    if (!channel) {
      try {
        channel = await guild.channels.fetch(s.panel_channel_id);
      } catch {
        console.log(`\x1b[33m[TICKET PANEL] ⚠️ No se pudo obtener el canal ${s.panel_channel_id} para ${guild.name}\x1b[0m`);
        return;
      }
    }

    if (!channel) {
      console.log(`\x1b[33m[TICKET PANEL] ⚠️ Canal no encontrado: ${s.panel_channel_id} para ${guild.name}\x1b[0m`);
      return;
    }

    const botMember = guild.members.me;
    if (!channel.permissionsFor(botMember).has("SendMessages") || !channel.permissionsFor(botMember).has("EmbedLinks")) {
      console.log(`\x1b[33m[TICKET PANEL] ⚠️ El bot no tiene permisos para enviar mensajes/embeds en el canal ${channel.name}\x1b[0m`);
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
          console.log(`\x1b[32m[TICKET PANEL] ✅ Panel actualizado correctamente en el canal ${channel.name}\x1b[0m`);
          return;
        }
      } catch {
        console.log(`\x1b[33m[TICKET PANEL] ℹ️ El mensaje anterior fue eliminado, creando uno nuevo...\x1b[0m`);
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
    console.log(`\x1b[32m[TICKET PANEL] ✅ Panel de tickets creado correctamente en el canal ${channel.name}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[TICKET PANEL] ❌ Error al actualizar el panel de tickets para ${guild.name}:\x1b[0m`, error.message);
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
  console.log("[DASHBOARD] Auto-actualizacion iniciada (cada 30s)");
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
