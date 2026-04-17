"use strict";

const { reactionRoles, autoRoleSettings } = require("../utils/database");
const logger = require("../utils/structuredLogger");

class AutoRoleHandler {
  constructor(client) {
    this.client = client;
  }

  async handleReactionAdd(reaction, user) {
    if (user.bot) return;

    try {
      // Buscar si este mensaje tiene reaction roles configurados
      const roleConfig = await reactionRoles.findByReaction(
        reaction.message.id,
        reaction.emoji.name || reaction.emoji.toString()
      );

      if (!roleConfig) return;

      // Obtener el miembro
      const guild = reaction.message.guild;
      const member = await guild.members.fetch(user.id).catch(() => null);
      if (!member) return;

      // Obtener el rol
      const role = guild.roles.cache.get(roleConfig.role_id);
      if (!role) {
        logger.error('autoRoleHandler', `Role ${roleConfig.role_id} not found`);
        return;
      }

      // Verificar jerarquía
      if (role.position >= guild.members.me.roles.highest.position) {
        logger.error('autoRoleHandler', `Cannot assign role ${role.name} - hierarchy issue`);
        return;
      }

      // Asignar el rol
      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role, "Reaction role");
        logger.info('autoRoleHandler', `Assigned ${role.name} to ${user.tag}`);
      }
    } catch (error) {
      logger.error('autoRoleHandler', 'Error handling reaction add', { error: error?.message || String(error) });
    }
  }

  async handleReactionRemove(reaction, user) {
    if (user.bot) return;

    try {
      // Buscar si este mensaje tiene reaction roles configurados
      const roleConfig = await reactionRoles.findByReaction(
        reaction.message.id,
        reaction.emoji.name || reaction.emoji.toString()
      );

      if (!roleConfig) return;

      // Obtener el miembro
      const guild = reaction.message.guild;
      const member = await guild.members.fetch(user.id).catch(() => null);
      if (!member) return;

      // Obtener el rol
      const role = guild.roles.cache.get(roleConfig.role_id);
      if (!role) return;

      // Remover el rol
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role, "Reaction role removed");
        logger.info('autoRoleHandler', `Removed ${role.name} from ${user.tag}`);
      }
    } catch (error) {
      logger.error('autoRoleHandler', 'Error handling reaction remove', { error: error?.message || String(error) });
    }
  }

  async handleMemberAdd(member) {
    if (!member.guild) return;

    try {
      // Obtener configuración de join role
      const settings = await autoRoleSettings.get(member.guild.id);
      
      if (!settings.join_role_id) return;

      // Verificar si excluir bots
      if (settings.join_role_exclude_bots && member.user.bot) return;

      // Obtener el rol
      const role = member.guild.roles.cache.get(settings.join_role_id);
      if (!role) {
        logger.error('autoRoleHandler', `Join role ${settings.join_role_id} not found`);
        return;
      }

      // Verificar jerarquía
      if (role.position >= member.guild.members.me.roles.highest.position) {
        logger.error('autoRoleHandler', `Cannot assign join role ${role.name} - hierarchy issue`);
        return;
      }

      // Aplicar delay si está configurado
      const delay = settings.join_role_delay || 0;
      
      if (delay > 0) {
        setTimeout(async () => {
          try {
            // Verificar que el miembro siga en el servidor
            const stillMember = await member.guild.members.fetch(member.id).catch(() => null);
            if (!stillMember) return;

            await stillMember.roles.add(role, "Join role");
            logger.info('autoRoleHandler', `Assigned join role ${role.name} to ${member.user.tag} after ${delay}s delay`);
          } catch (error) {
            logger.error('autoRoleHandler', 'Error assigning delayed join role', { error: error?.message || String(error) });
          }
        }, delay * 1000);
      } else {
        await member.roles.add(role, "Join role");
        logger.info('autoRoleHandler', `Assigned join role ${role.name} to ${member.user.tag}`);
      }
    } catch (error) {
      logger.error('autoRoleHandler', 'Error handling member add', { error: error?.message || String(error) });
    }
  }

  async handleLevelUp(member, oldLevel, newLevel) {
    try {
      // Obtener configuración de level roles
      const settings = await autoRoleSettings.get(member.guild.id);
      
      if (!settings.level_roles || settings.level_roles.length === 0) return;

      // Encontrar roles que el usuario debería tener
      const rolesToAssign = settings.level_roles.filter(lr => lr.level <= newLevel);
      
      if (rolesToAssign.length === 0) return;

      const mode = settings.level_roles_mode || "stack";

      if (mode === "replace") {
        // Modo replace: solo mantener el rol del nivel más alto
        const highestLevelRole = rolesToAssign.reduce((prev, current) => 
          (prev.level > current.level) ? prev : current
        );

        // Remover todos los otros level roles
        for (const lr of settings.level_roles) {
          if (lr.role_id !== highestLevelRole.role_id && member.roles.cache.has(lr.role_id)) {
            const role = member.guild.roles.cache.get(lr.role_id);
            if (role) {
              await member.roles.remove(role, "Level role replace mode");
            }
          }
        }

        // Asignar el rol del nivel más alto
        const role = member.guild.roles.cache.get(highestLevelRole.role_id);
        if (role && !member.roles.cache.has(role.id)) {
          if (role.position < member.guild.members.me.roles.highest.position) {
            await member.roles.add(role, `Reached level ${newLevel}`);
            logger.info('autoRoleHandler', `Assigned level role ${role.name} to ${member.user.tag} (replace mode)`);
          }
        }
      } else {
        // Modo stack: asignar todos los roles que correspondan
        for (const lr of rolesToAssign) {
          if (!member.roles.cache.has(lr.role_id)) {
            const role = member.guild.roles.cache.get(lr.role_id);
            if (role && role.position < member.guild.members.me.roles.highest.position) {
              await member.roles.add(role, `Reached level ${lr.level}`);
              logger.info('autoRoleHandler', `Assigned level role ${role.name} to ${member.user.tag} (stack mode)`);
            }
          }
        }
      }
    } catch (error) {
      logger.error('autoRoleHandler', 'Error handling level up', { error: error?.message || String(error) });
    }
  }
}

module.exports = AutoRoleHandler;
