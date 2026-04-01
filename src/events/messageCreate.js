const { tickets, autoResponses, levels, levelSettings } = require("../utils/database");
const { getGuildSettings, hasStaffPrivileges } = require("../utils/accessControl");

// Cooldown para XP (1 minuto por usuario)
const xpCooldowns = new Map();

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    // Handle stats tracking
    if (client.statsHandler) {
      try {
        await client.statsHandler.handleMessage(message);
      } catch (error) {
        // Silently fail to not disrupt message flow
      }
    }

    // Handle level system
    try {
      const levelConfig = await levelSettings.get(message.guild.id);
      
      if (levelConfig && levelConfig.enabled) {
        const cooldownKey = `${message.guild.id}:${message.author.id}`;
        const now = Date.now();
        const cooldownAmount = 60000; // 1 minuto
        
        if (!xpCooldowns.has(cooldownKey) || now - xpCooldowns.get(cooldownKey) >= cooldownAmount) {
          xpCooldowns.set(cooldownKey, now);
          
          // Agregar XP aleatorio entre 15-25
          const xpGain = Math.floor(Math.random() * 11) + 15;
          const result = await levels.addXp(message.guild.id, message.author.id, xpGain);
          
          // Si subió de nivel, notificar y asignar roles
          if (result.leveled && client.autoRoleHandler) {
            const member = message.member;
            if (member) {
              // Notificar level-up
              if (levelConfig.level_up_message) {
                const levelUpMsg = levelConfig.level_up_message
                  .replace('{user}', `<@${message.author.id}>`)
                  .replace('{level}', result.level);
                
                const channel = levelConfig.level_up_channel_id 
                  ? message.guild.channels.cache.get(levelConfig.level_up_channel_id)
                  : message.channel;
                
                if (channel) {
                  await channel.send(levelUpMsg).catch(() => {});
                }
              }
              
              // Asignar roles de nivel
              await client.autoRoleHandler.handleLevelUp(member, result.level - 1, result.level);
            }
          }
        }
      }
    } catch (error) {
      // Silently fail to not disrupt message flow
    }

    // 1. SISTEMA DE TICKETS
    const ticket = await tickets.get(message.channel.id);
    if (ticket && ticket.status === "open") {
      // Reuse the shared guild settings cache so this event stays aligned with access control.
      const s = await getGuildSettings(message.guild.id);
      const isStaff = hasStaffPrivileges(message.member, s);
      await tickets.incrementMessages(message.channel.id, isStaff);

      if (!isStaff && message.content) {
        const match = await autoResponses.match(message.guild.id, message.content);
        if (match) {
          await autoResponses.use(message.guild.id, match.trigger);
          await message.channel.send({
            content: `> 🤖 **Respuesta automática** - *"${match.trigger}"*\n\n${match.response}`,
          }).catch(() => {});
        }
      }
    }


  },
};
