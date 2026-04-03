"use strict";

/**
 * Bot Permission Validator
 * Valida permisos del bot antes de operaciones críticas
 */

const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const E = require("./embeds");

// Mapeo de operaciones a permisos requeridos
const OPERATION_PERMISSIONS = {
  // Tickets
  CREATE_TICKET_CHANNEL: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel],
  MANAGE_TICKET_PERMISSIONS: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels],
  SEND_TICKET_MESSAGE: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],

  // Verificación
  ASSIGN_VERIFIED_ROLE: [PermissionFlagsBits.ManageRoles],
  CREATE_VERIF_PANEL: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],

  // Moderación
  KICK_MEMBER: [PermissionFlagsBits.KickMembers],
  BAN_MEMBER: [PermissionFlagsBits.BanMembers],
  TIMEOUT_MEMBER: [PermissionFlagsBits.ModerateMembers],
  DELETE_MESSAGES: [PermissionFlagsBits.ManageMessages],

  // Canales y mensajes
  CREATE_CHANNEL: [PermissionFlagsBits.ManageChannels],
  DELETE_CHANNEL: [PermissionFlagsBits.ManageChannels],
  SEND_MESSAGES: [PermissionFlagsBits.SendMessages],
  SEND_EMBEDS: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
  MANAGE_WEBHOOKS: [PermissionFlagsBits.ManageWebhooks],

  // Servidor
  MANAGE_GUILD: [PermissionFlagsBits.ManageGuild],
  VIEW_AUDIT_LOG: [PermissionFlagsBits.ViewAuditLog],
};

/**
 * Verifica si el bot tiene los permisos necesarios en un guild
 * @param {Guild} guild - Guild de Discord
 * @param {string[]|string} permissions - Permiso(s) requerido(s)
 * @returns {Object} Resultado de la validación
 */
async function validateBotPermissions(guild, permissions) {
  try {
    // Obtener miembro del bot
    const botMember = await guild.members.fetchMe().catch(() => null);

    if (!botMember) {
      return {
        hasPermissions: false,
        missing: permissions,
        error: "No se pudo obtener información del bot",
        canProceed: false
      };
    }

    // Normalizar a array
    const requiredPerms = Array.isArray(permissions) ? permissions : [permissions];

    // Verificar cada permiso
    const missing = [];
    for (const perm of requiredPerms) {
      if (!botMember.permissions.has(perm)) {
        missing.push(perm);
      }
    }

    return {
      hasPermissions: missing.length === 0,
      missing,
      error: missing.length > 0 ? `Faltan permisos: ${missing.map(p => getPermissionName(p)).join(", ")}` : null,
      canProceed: missing.length === 0
    };
  } catch (error) {
    return {
      hasPermissions: false,
      missing: permissions,
      error: error.message,
      canProceed: false
    };
  }
}

/**
 * Verifica permisos para una operación específica
 * @param {Guild} guild - Guild de Discord
 * @param {string} operation - Nombre de la operación
 * @returns {Object} Resultado de la validación
 */
async function validateOperation(guild, operation) {
  const permissions = OPERATION_PERMISSIONS[operation];

  if (!permissions) {
    return {
      hasPermissions: false,
      missing: [],
      error: `Operación desconocida: ${operation}`,
      canProceed: false,
      operation
    };
  }

  const result = await validateBotPermissions(guild, permissions);
  return { ...result, operation };
}

/**
 * Verifica permisos de canal específico
 * @param {TextChannel} channel - Canal de Discord
 * @param {string[]|string} permissions - Permiso(s) requerido(s)
 */
async function validateChannelPermissions(channel, permissions) {
  try {
    const requiredPerms = Array.isArray(permissions) ? permissions : [permissions];

    const missing = [];
    for (const perm of requiredPerms) {
      if (!channel.permissionsFor(channel.guild.members.me).has(perm)) {
        missing.push(perm);
      }
    }

    return {
      hasPermissions: missing.length === 0,
      missing,
      error: missing.length > 0 ? `Faltan permisos en canal: ${missing.map(p => getPermissionName(p)).join(", ")}` : null,
      canProceed: missing.length === 0
    };
  } catch (error) {
    return {
      hasPermissions: false,
      missing: permissions,
      error: error.message,
      canProceed: false
    };
  }
}

/**
 * Wrapper que verifica permisos antes de ejecutar
 * @param {Guild} guild - Guild de Discord
 * @param {string} operation - Operación a realizar
 * @param {Function} fn - Función a ejecutar
 * @param {Object} options - Opciones
 */
async function withPermissionCheck(guild, operation, fn, options = {}) {
  const validation = await validateOperation(guild, operation);

  if (!validation.canProceed) {
    // Si hay función de fallback, usarla
    if (options.fallback) {
      return options.fallback(validation);
    }

    // Si hay interacción, responder con error
    if (options.interaction) {
      const language = options.language || "es";
      const embed = new EmbedBuilder()
        .setColor(E.Colors.ERROR)
        .setTitle(language === "es" ? "❌ Permisos Insuficientes" : "❌ Insufficient Permissions")
        .setDescription(
          language === "es"
            ? `El bot no tiene los permisos necesarios para realizar esta acción.\n\n**Faltan:** ${validation.missing.map(p => getPermissionName(p)).join(", ")}`
            : `The bot lacks required permissions for this action.\n\n**Missing:** ${validation.missing.map(p => getPermissionName(p)).join(", ")}`
        )
        .setFooter({
          text: language === "es"
            ? "Asegúrate de que el bot tenga los permisos adecuados"
            : "Ensure the bot has appropriate permissions"
        });

      if (options.interaction.replied || options.interaction.deferred) {
        await options.interaction.editReply({ embeds: [embed] });
      } else {
        await options.interaction.reply({ embeds: [embed], flags: 64 });
      }

      return null;
    }

    throw new Error(`Permission check failed: ${validation.error}`);
  }

  return fn();
}

/**
 * Obtiene nombre legible de un permiso
 * @param {bigint} permission - Flag de permiso
 */
function getPermissionName(permission) {
  const names = {
    [PermissionFlagsBits.Administrator]: "Administrador",
    [PermissionFlagsBits.ManageGuild]: "Gestionar Servidor",
    [PermissionFlagsBits.ManageChannels]: "Gestionar Canales",
    [PermissionFlagsBits.ManageRoles]: "Gestionar Roles",
    [PermissionFlagsBits.ManageMessages]: "Gestionar Mensajes",
    [PermissionFlagsBits.ManageWebhooks]: "Gestionar Webhooks",
    [PermissionFlagsBits.ViewAuditLog]: "Ver Registro de Auditoría",
    [PermissionFlagsBits.ViewChannel]: "Ver Canales",
    [PermissionFlagsBits.SendMessages]: "Enviar Mensajes",
    [PermissionFlagsBits.SendMessagesInThreads]: "Enviar Mensajes en Hilos",
    [PermissionFlagsBits.EmbedLinks]: "Insertar Links",
    [PermissionFlagsBits.AttachFiles]: "Adjuntar Archivos",
    [PermissionFlagsBits.ReadMessageHistory]: "Leer Historial",
    [PermissionFlagsBits.MentionEveryone]: "Mencionar @everyone",
    [PermissionFlagsBits.UseExternalEmojis]: "Usar Emojis Externos",
    [PermissionFlagsBits.AddReactions]: "Añadir Reacciones",
    [PermissionFlagsBits.KickMembers]: "Expulsar Miembros",
    [PermissionFlagsBits.BanMembers]: "Banear Miembros",
    [PermissionFlagsBits.ModerateMembers]: "Moderar Miembros",
    [PermissionFlagsBits.DeafenMembers]: "Ensordecer Miembros",
    [PermissionFlagsBits.MuteMembers]: "Silenciar Miembros",
    [PermissionFlagsBits.MoveMembers]: "Mover Miembros",
  };

  return names[permission] || permission.toString();
}

/**
 * Verifica todos los permisos críticos para tickets
 * @param {Guild} guild - Guild de Discord
 * @param {TextChannel} channel - Canal donde se creará el ticket (opcional)
 */
async function validateTicketPermissions(guild, channel = null) {
  const results = {
    canCreate: false,
    canManage: false,
    canSend: false,
    allPassed: false,
    details: {}
  };

  // Verificar creación de canales
  results.details.create = await validateOperation(guild, "CREATE_TICKET_CHANNEL");
  results.canCreate = results.details.create.canProceed;

  // Verificar gestión de permisos
  results.details.manage = await validateOperation(guild, "MANAGE_TICKET_PERMISSIONS");
  results.canManage = results.details.manage.canProceed;

  // Verificar envío de mensajes
  results.details.send = await validateOperation(guild, "SEND_TICKET_MESSAGE");
  results.canSend = results.details.send.canProceed;

  // Verificar canal específico si se proporciona
  if (channel) {
    results.details.channel = await validateChannelPermissions(channel, [
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks
    ]);
    results.canSend = results.canSend && results.details.channel.canProceed;
  }

  results.allPassed = results.canCreate && results.canManage && results.canSend;

  return results;
}

/**
 * Genera embed de error de permisos
 * @param {Object} validation - Resultado de validación
 * @param {string} language - Idioma
 */
function buildPermissionErrorEmbed(validation, language = "es") {
  const isSpanish = language === "es";

  return new EmbedBuilder()
    .setColor(E.Colors.ERROR)
    .setTitle(isSpanish ? "❌ Permisos Insuficientes del Bot" : "❌ Bot Insufficient Permissions")
    .setDescription(
      isSpanish
        ? `No puedo realizar esta operación porque me faltan los siguientes permisos:\n\n${validation.missing.map(p => `• ${getPermissionName(p)}`).join("\n")}`
        : `I cannot perform this operation because I'm missing the following permissions:\n\n${validation.missing.map(p => `• ${getPermissionName(p)}`).join("\n")}`
    )
    .setFooter({
      text: isSpanish
        ? "Contacta a un administrador para que me otorgue los permisos necesarios"
        : "Contact an administrator to grant me the required permissions"
    });
}

module.exports = {
  validateBotPermissions,
  validateOperation,
  validateChannelPermissions,
  withPermissionCheck,
  validateTicketPermissions,
  buildPermissionErrorEmbed,
  getPermissionName,
  OPERATION_PERMISSIONS
};
