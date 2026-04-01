"use strict";

/**
 * Middleware para restringir comandos al servidor de soporte oficial
 */

const { resolveGuildLanguage, t } = require("./i18n");
const { settings } = require("./database");

const SUPPORT_SERVER_ID = process.env.SUPPORT_SERVER_ID || "1214106731022655488";

/**
 * Verifica si un guild es el servidor de soporte
 * @param {string} guildId - ID del servidor
 * @returns {boolean}
 */
function isSupportServer(guildId) {
  return guildId === SUPPORT_SERVER_ID;
}

/**
 * Middleware para requerir que el comando se ejecute en el servidor de soporte
 * @param {import('discord.js').CommandInteraction} interaction
 * @returns {Promise<boolean>} true si es servidor de soporte, false si no (y responde al usuario)
 */
async function requireSupportServer(interaction) {
  if (!isSupportServer(interaction.guildId)) {
    const guildSettings = await settings.get(interaction.guildId);
    const language = resolveGuildLanguage(guildSettings);
    
    await interaction.reply({
      content: t(language, "support_server.restricted"),
      ephemeral: true
    });
    return false;
  }
  return true;
}

/**
 * Decorator para comandos que solo funcionan en el servidor de soporte
 * @param {Function} executeFunction - Función execute del comando
 * @returns {Function}
 */
function supportServerOnly(executeFunction) {
  return async function(interaction) {
    const isAllowed = await requireSupportServer(interaction);
    if (!isAllowed) return;
    
    return executeFunction.call(this, interaction);
  };
}

module.exports = {
  SUPPORT_SERVER_ID,
  isSupportServer,
  requireSupportServer,
  supportServerOnly,
};
