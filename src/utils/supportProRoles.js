"use strict";

/**
 * Servicio de roles de PRO en servidor de soporte
 * Asigna roles automáticamente cuando un usuario canjea PRO
 */

const { SUPPORT_SERVER_ID } = require("./supportServerOnly");
const logger = require("./structuredLogger");
const { t } = require("./i18n");

// IDs de roles en el servidor de soporte (configurables via env)
const SUPPORT_SERVER_ROLES = {
  pro: process.env.SUPPORT_ROLE_PRO || null,
  supporter: process.env.SUPPORT_ROLE_SUPPORTER || null,
  lifetime: process.env.SUPPORT_ROLE_LIFETIME || null,
};

/**
 * Asigna rol de PRO al usuario en el servidor de soporte
 * @param {import('discord.js').Client} client - Cliente de Discord
 * @param {string} userId - ID del usuario
 * @param {Object} redemptionData - Datos de la redención
 * @returns {Promise<{success: boolean, roleGiven?: string, error?: string}>}
 */
async function assignSupportRole(client, userId, redemptionData) {
  try {
    // Verificar que estén configurados los roles
    const roleId = redemptionData.duration_days === null
      ? SUPPORT_SERVER_ROLES.lifetime || SUPPORT_SERVER_ROLES.pro
      : SUPPORT_SERVER_ROLES.pro;

    if (!roleId) {
      return { success: false, error: "role_not_configured" };
    }

    // Obtener servidor de soporte
    const supportGuild = client.guilds.cache.get(SUPPORT_SERVER_ID);
    if (!supportGuild) {
      return { success: false, error: "guild_not_found" };
    }

    // Obtener miembro
    const member = await supportGuild.members.fetch(userId).catch(() => null);
    if (!member) {
      return { success: false, error: "member_not_found" };
    }

    // Verificar si ya tiene el rol
    if (member.roles.cache.has(roleId)) {
      return { success: true, roleGiven: roleId, alreadyHad: true };
    }

    // Asignar rol
    await member.roles.add(roleId, `PRO redeemed: ${redemptionData.code}`);

    return { success: true, roleGiven: roleId };
  } catch (error) {
    logger.error("supportProRoles", "Error assigning role", { userId, error: error?.message || String(error) });
    return { success: false, error: error.message };
  }
}

/**
 * Remueve rol de PRO del usuario en el servidor de soporte
 * @param {import('discord.js').Client} client - Cliente de Discord
 * @param {string} userId - ID del usuario
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function removeSupportRole(client, userId) {
  try {
    const roleId = SUPPORT_SERVER_ROLES.pro;
    if (!roleId) {
      return { success: false, error: "role_not_configured" };
    }

    const supportGuild = client.guilds.cache.get(SUPPORT_SERVER_ID);
    if (!supportGuild) {
      return { success: false, error: "guild_not_found" };
    }

    const member = await supportGuild.members.fetch(userId).catch(() => null);
    if (!member) {
      return { success: false, error: "member_not_found" };
    }

    if (!member.roles.cache.has(roleId)) {
      return { success: true, alreadyRemoved: true };
    }

    await member.roles.remove(roleId, "PRO expired");
    return { success: true };
  } catch (error) {
    logger.error("supportProRoles", "Error removing role", { userId, error: error?.message || String(error) });
    return { success: false, error: error.message };
  }
}

/**
 * Envía notificación de redención al canal de logs del servidor de soporte
 * @param {import('discord.js').Client} client - Cliente de Discord
 * @param {Object} redemptionData - Datos de la redención
 * @param {Object} activationData - Datos de la activación
 * @returns {Promise<{success: boolean}>}
 */
async function notifyRedemption(client, redemptionData, activationData, language = "en") {
  try {
    const logChannelId = process.env.SUPPORT_PRO_LOG_CHANNEL;
    if (!logChannelId) return { success: false };

    const supportGuild = client.guilds.cache.get(SUPPORT_SERVER_ID);
    if (!supportGuild) return { success: false };

    const logChannel = supportGuild.channels.cache.get(logChannelId);
    if (!logChannel) return { success: false };

    const { EmbedBuilder } = require("discord.js");
    const isLifetime = redemptionData.duration_days === null;

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle(t(language, "supportProRoles.redeemed_title"))
      .setDescription(t(language, "supportProRoles.redeemed_description", { user: redemptionData.redeemed_by }))
      .addFields(
        {
          name: t(language, "supportProRoles.code"),
          value: `\`${redemptionData.code}\``,
          inline: true,
        },
        {
          name: t(language, "supportProRoles.duration"),
          value: isLifetime ? t(language, "supportProRoles.lifetime") : t(language, "supportProRoles.duration_days", { days: redemptionData.duration_days }),
          inline: true,
        },
        {
          name: t(language, "supportProRoles.guild"),
          value: redemptionData.redeemed_guild_id,
          inline: true,
        }
      )
      .setTimestamp();

    if (activationData.planExpiresAt) {
      embed.addFields({
        name: t(language, "supportProRoles.expires_at"),
        value: `<t:${Math.floor(activationData.planExpiresAt.getTime() / 1000)}:F>`,
        inline: false,
      });
    }

    await logChannel.send({ embeds: [embed] });
    return { success: true };
  } catch (error) {
    logger.error("supportProRoles", "Error sending notification", { userId, error: error?.message || String(error) });
    return { success: false };
  }
}

module.exports = {
  assignSupportRole,
  removeSupportRole,
  notifyRedemption,
  SUPPORT_SERVER_ROLES,
};
