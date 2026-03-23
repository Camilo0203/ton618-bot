const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder,
  ButtonStyle, PermissionFlagsBits,
} = require("discord.js");
const { welcomeSettings, verifSettings, modlogSettings } = require("../utils/database");
const { queueBotStatsSync } = require("../utils/botStatsSync");
const { queueGuildLiveStatsSync } = require("../utils/liveStatsChannels");

// ── Caché anti-raid: guildId → [timestamps]
const joinCache = new Map();

module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    const guild = member.guild;
    queueGuildLiveStatsSync(guild, {
      hydrateMembers: true,
      delayMs: 1500,
    });
    queueBotStatsSync(client, {
      reason: "guildMemberAdd",
      delayMs: 1000,
    });
    try {
      const ws = await welcomeSettings.get(guild.id);
      const vs = await verifSettings.get(guild.id);

      // 1. ANTI-RAID
      if (vs && vs.enabled && vs.antiraid_enabled) {
        const now  = Date.now();
        const prev = (joinCache.get(guild.id) || []).filter(t => now - t < vs.antiraid_seconds * 1000);
        prev.push(now);
        joinCache.set(guild.id, prev);
        if (prev.length >= vs.antiraid_joins) {
          if (vs.log_channel) {
            const logCh = guild.channels.cache.get(vs.log_channel);
            await logCh?.send({
              embeds: [new EmbedBuilder().setColor(0xED4245).setTitle("🚨 ALERTA ANTI-RAID")
                .setDescription(`Se detectaron **${prev.length} joins** en **${vs.antiraid_seconds}s**.\nÚltimo: **${member.user.tag}**`)
                .setTimestamp()],
            }).catch(() => {});
          }
          if (vs.antiraid_action === "kick") {
            await member.kick("Anti-raid activado").catch(() => {});
            return;
          }
        }
      }

      // 2. ROL DE NO VERIFICADO
      if (vs && vs.enabled && vs.unverified_role) {
        const role = guild.roles.cache.get(vs.unverified_role);
        if (role && guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles))
          await member.roles.add(role).catch(() => {});
      }

      // 3. AUTO-ROL (solo si verificación desactivada)
      if (vs && !vs.enabled && ws?.welcome_autorole) {
        const role = guild.roles.cache.get(ws.welcome_autorole);
        if (role && guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles))
          await member.roles.add(role).catch(() => {});
      }

      // 4. BIENVENIDA EN CANAL CON IMAGEN CANVAS
      if (ws?.welcome_enabled && ws.welcome_channel) {
        const ch = guild.channels.cache.get(ws.welcome_channel);
        if (ch) {
          try {
            // Reemplazar variables en el mensaje
            const welcomeMessage = fill(ws.welcome_message, member, guild);
            
            // Crear embed de bienvenida con avatar
            const embed = new EmbedBuilder()
              .setColor(parseInt(ws.welcome_color || "5865F2", 16))
              .setTitle(fill(ws.welcome_title || "👋 ¡Bienvenido/a!", member, guild))
              .setDescription(welcomeMessage)
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
              .addFields(
                { name: "👤 Usuario", value: `${member.user.tag}`, inline: true },
                { name: "👥 Miembro #", value: `${guild.memberCount}`, inline: true },
              )
              .setTimestamp();
            
            if (ws.welcome_footer) {
              embed.setFooter({ 
                text: fill(ws.welcome_footer, member, guild), 
                iconURL: guild.iconURL({ dynamic: true }) 
              });
            }

            await ch.send({ 
              content: `<@${member.id}>`,
              embeds: [embed],
            }).catch(() => {});
          } catch (err) {
            console.error("[WELCOME ERROR]", err?.message || err);
          }
        }
      }

      // 5. DM DE BIENVENIDA
      if (ws?.welcome_enabled && ws.welcome_dm) {
        try {
          const dmEmbed = new EmbedBuilder()
            .setColor(parseInt(ws.welcome_color || "5865F2", 16))
            .setTitle(`👋 Bienvenido/a a ${guild.name}`)
            .setDescription(fill(ws.welcome_dm_message, member, guild))
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp();
          if (vs?.enabled && vs.channel)
            dmEmbed.addFields({ name: "✅ Verificación requerida", value: `Ve a <#${vs.channel}> para verificarte y acceder al servidor.` });
          await member.send({ embeds: [dmEmbed] });
        } catch { /* DMs cerrados */ }
      }

    // ── 6. MOD LOG de JOIN
    const ml = await modlogSettings.get(guild.id);
    if (ml && ml.enabled && ml.log_joins && ml.channel) {
      const logCh = guild.channels.cache.get(ml.channel);
      if (logCh) {
        await logCh.send({
          embeds: [new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("📥 Miembro Entró")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
              { name: "👤 Usuario",     value: `${member.user.tag} <@${member.id}>`, inline: true  },
              { name: "📅 Cuenta creada", value: `<t:${Math.floor(member.user.createdTimestamp/1000)}:R>`, inline: true },
              { name: "👥 Miembro #",   value: `\`${guild.memberCount}\``, inline: true },
            )
            .setFooter({ text: `ID: ${member.id}` })
            .setTimestamp()],
        }).catch(() => {});
      }
    }

    } catch (err) { 
      console.error("[MEMBER ADD]", err.message); 
    }
  },
};


/**
 * Reemplaza las variables en el mensaje de bienvenida
 * Variables: {mention}, {user}, {server}, {tag}, {count}, {id}
 */
function fill(text, member, guild) {
  if (!text) return "";
  return text
    .replace(/{mention}/g, `<@${member.id}>`)
    .replace(/{user}/g,    member.user.username)
    .replace(/{tag}/g,     member.user.tag)
    .replace(/{server}/g,  guild.name)
    .replace(/{count}/g,   String(guild.memberCount))
    .replace(/{id}/g,      member.id);
}
