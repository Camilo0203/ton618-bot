const {
  SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType,
} = require("discord.js");
const { verifSettings, verifLogs, verifCodes, welcomeSettings } = require("../../../utils/database");
const E = require("../../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("✅ Configurar el sistema de verificación")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    // ── SETUP
    .addSubcommand(s => s.setName("setup").setDescription("Configuración rápida guiada del sistema de verificación")
      .addChannelOption(o => o.setName("canal").setDescription("Canal de verificación").addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addRoleOption(o => o.setName("rol_verificado").setDescription("Rol que se da al verificarse").setRequired(true))
      .addStringOption(o => o.setName("modo").setDescription("Modo de verificación").setRequired(true)
        .addChoices(
          { name: "🖱️ Botón (un clic)", value: "button" },
          { name: "🔢 Código por DM",    value: "code"   },
          { name: "❓ Pregunta",          value: "question" },
        ))
      .addRoleOption(o => o.setName("rol_no_verificado").setDescription("Rol temporal para nuevos (sin acceso) — opcional").setRequired(false))
    )

    // ── PANEL
    .addSubcommand(s => s.setName("panel").setDescription("Enviar/actualizar el panel de verificación en el canal configurado"))

    // ── ACTIVAR/DESACTIVAR
    .addSubcommand(s => s.setName("activar").setDescription("Activar o desactivar el sistema de verificación")
      .addBooleanOption(o => o.setName("estado").setDescription("Activar / desactivar").setRequired(true)))

    // ── MODO
    .addSubcommand(s => s.setName("modo").setDescription("Cambiar el modo de verificación")
      .addStringOption(o => o.setName("tipo").setDescription("Modo").setRequired(true)
        .addChoices(
          { name: "🖱️ Botón (un clic)", value: "button"   },
          { name: "🔢 Código por DM",    value: "code"     },
          { name: "❓ Pregunta",          value: "question" },
        )))

    // ── PREGUNTA (para modo question)
    .addSubcommand(s => s.setName("pregunta").setDescription("Configurar la pregunta y respuesta del modo pregunta")
      .addStringOption(o => o.setName("pregunta").setDescription("Pregunta a responder").setRequired(true).setMaxLength(200))
      .addStringOption(o => o.setName("respuesta").setDescription("Respuesta correcta (no distingue mayúsculas)").setRequired(true).setMaxLength(100)))

    // ── PANEL MENSAJE
    .addSubcommand(s => s.setName("mensaje").setDescription("Personalizar el título y descripción del panel de verificación")
      .addStringOption(o => o.setName("titulo").setDescription("Título del panel").setRequired(false).setMaxLength(100))
      .addStringOption(o => o.setName("descripcion").setDescription("Descripción del panel").setRequired(false).setMaxLength(1000))
      .addStringOption(o => o.setName("color").setDescription("Color HEX sin # (ej: 57F287)").setRequired(false).setMaxLength(6))
      .addStringOption(o => o.setName("imagen").setDescription("URL de imagen para el panel").setRequired(false)))

    // ── DM AL VERIFICAR
    .addSubcommand(s => s.setName("dm").setDescription("Activar/desactivar DM de confirmación al verificarse")
      .addBooleanOption(o => o.setName("estado").setDescription("Activar / desactivar").setRequired(true)))

    // ── AUTO-KICK NO VERIFICADOS
    .addSubcommand(s => s.setName("autokick").setDescription("Kickear automáticamente a no verificados tras X horas (0 = desactivado)")
      .addIntegerOption(o => o.setName("horas").setDescription("Horas (0 = desactivado)").setRequired(true).setMinValue(0).setMaxValue(168)))

    // ── ANTI-RAID
    .addSubcommand(s => s.setName("antiraid").setDescription("Configurar protección anti-raid")
      .addBooleanOption(o => o.setName("estado").setDescription("Activar / desactivar").setRequired(true))
      .addIntegerOption(o => o.setName("joins").setDescription("Joins para activar alerta").setRequired(false).setMinValue(3).setMaxValue(50))
      .addIntegerOption(o => o.setName("segundos").setDescription("Ventana de tiempo en segundos").setRequired(false).setMinValue(5).setMaxValue(60))
      .addStringOption(o => o.setName("accion").setDescription("Acción al detectar raid").setRequired(false)
        .addChoices({ name: "⚠️ Solo alertar", value: "pause" }, { name: "🚫 Kickear automáticamente", value: "kick" })))

    // ── LOG CHANNEL
    .addSubcommand(s => s.setName("logs").setDescription("Canal de logs de verificación")
      .addChannelOption(o => o.setName("canal").setDescription("Canal de logs").addChannelTypes(ChannelType.GuildText).setRequired(true)))

    // ── VERIFICAR USUARIO MANUALMENTE
    .addSubcommand(s => s.setName("forzar").setDescription("Verificar manualmente a un usuario")
      .addUserOption(o => o.setName("usuario").setDescription("Usuario a verificar").setRequired(true)))

    // ── DESVERIFICAR USUARIO
    .addSubcommand(s => s.setName("desverificar").setDescription("Quitar la verificación a un usuario")
      .addUserOption(o => o.setName("usuario").setDescription("Usuario").setRequired(true)))

    // ── STATS
    .addSubcommand(s => s.setName("stats").setDescription("Ver estadísticas del sistema de verificación"))

    // ── INFO
    .addSubcommand(s => s.setName("info").setDescription("Ver la configuración actual de verificación")),

  async execute(interaction) {
    const sub  = interaction.options.getSubcommand();
    const gid  = interaction.guild.id;
    const vs   = await verifSettings.get(gid);

    const ok = msg => interaction.reply({ embeds: [E.successEmbed(msg)],  flags: 64 });
    const er = msg => interaction.reply({ embeds: [E.errorEmbed(msg)],    flags: 64 });

    // ──────────────────────────────────────────────
    //   /verify setup
    // ──────────────────────────────────────────────
    if (sub === "setup") {
      const canal      = interaction.options.getChannel("canal");
      const rolVerif   = interaction.options.getRole("rol_verificado");
      const modo       = interaction.options.getString("modo");
      const rolNoVerif = interaction.options.getRole("rol_no_verificado");

      await verifSettings.update(gid, {
        enabled:         true,
        channel:         canal.id,
        verified_role:   rolVerif.id,
        mode:            modo,
        unverified_role: rolNoVerif?.id || null,
      });

      // Enviar panel automáticamente
      await sendVerifPanel(interaction.guild, vs, interaction.client);

      const modeLabels = { button: "🖱️ Botón", code: "🔢 Código por DM", question: "❓ Pregunta" };
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("✅ Verificación configurada")
          .setDescription("El sistema de verificación está listo.")
          .addFields(
            { name: "📋 Canal",           value: `<#${canal.id}>`,            inline: true },
            { name: "🏷️ Rol verificado",  value: `<@&${rolVerif.id}>`,        inline: true },
            { name: "⚙️ Modo",            value: modeLabels[modo],            inline: true },
            { name: "🔴 Rol no verificado",value: rolNoVerif ? `<@&${rolNoVerif.id}>` : "Ninguno", inline: true },
          ).setTimestamp()],
        flags: 64,
      });
    }

    // ──────────────────────────────────────────────
    //   /verify panel
    // ──────────────────────────────────────────────
    if (sub === "panel") {
      if (!vs?.channel) return er("Configura primero el canal con `/verify setup`.");
      await interaction.deferReply({ flags: 64 });
      await sendVerifPanel(interaction.guild, vs, interaction.client);
      return interaction.editReply({ embeds: [E.successEmbed("Panel de verificación enviado/actualizado.")] });
    }

    // ──────────────────────────────────────────────
    //   /verify activar
    // ──────────────────────────────────────────────
    if (sub === "activar") {
      const estado = interaction.options.getBoolean("estado");
      if (estado && !vs?.channel) return er("Configura el canal primero con `/verify setup`.");
      await verifSettings.update(gid, { enabled: estado });
      return ok(`Sistema de verificación **${estado ? "✅ activado" : "❌ desactivado"}**.`);
    }

    // ──────────────────────────────────────────────
    //   /verify modo
    // ──────────────────────────────────────────────
    if (sub === "modo") {
      const tipo = interaction.options.getString("tipo");
      await verifSettings.update(gid, { mode: tipo });
      const labels = { button: "🖱️ Botón", code: "🔢 Código por DM", question: "❓ Pregunta" };
      const vsNew = await verifSettings.get(gid);
      await sendVerifPanel(interaction.guild, vsNew, interaction.client);
      return ok(`Modo cambiado a **${labels[tipo]}**. Panel actualizado automáticamente.`);
    }

    // ──────────────────────────────────────────────
    //   /verify pregunta
    // ──────────────────────────────────────────────
    if (sub === "pregunta") {
      const q = interaction.options.getString("pregunta");
      const a = interaction.options.getString("respuesta");
      await verifSettings.update(gid, { question: q, question_answer: a.toLowerCase().trim() });
      return ok(`Pregunta actualizada:\n**Pregunta:** ${q}\n**Respuesta correcta:** ${a}`);
    }

    // ──────────────────────────────────────────────
    //   /verify mensaje
    // ──────────────────────────────────────────────
    if (sub === "mensaje") {
      const titulo = interaction.options.getString("titulo");
      const desc   = interaction.options.getString("descripcion");
      const color  = interaction.options.getString("color");
      const img    = interaction.options.getString("imagen");

      if (color && !/^[0-9A-Fa-f]{6}$/.test(color)) return er("Color inválido. Usa HEX de 6 caracteres (ej: `57F287`).");
      if (img && !img.startsWith("http")) return er("La URL de imagen debe empezar con `https://`.");

      const update = {};
      if (titulo) update.panel_title       = titulo;
      if (desc)   update.panel_description = desc;
      if (color)  update.panel_color       = color;
      if (img)    update.panel_image       = img;

      await verifSettings.update(gid, update);
      const vsNew = await verifSettings.get(gid);
      await sendVerifPanel(interaction.guild, vsNew, interaction.client);
      return ok("Panel de verificación actualizado.");
    }

    // ──────────────────────────────────────────────
    //   /verify dm
    // ──────────────────────────────────────────────
    if (sub === "dm") {
      const estado = interaction.options.getBoolean("estado");
      await verifSettings.update(gid, { dm_on_verify: estado });
      return ok(`DM al verificarse: **${estado ? "✅ activado" : "❌ desactivado"}**`);
    }

    // ──────────────────────────────────────────────
    //   /verify autokick
    // ──────────────────────────────────────────────
    if (sub === "autokick") {
      const horas = interaction.options.getInteger("horas");
      await verifSettings.update(gid, { kick_unverified_hours: horas });
      return ok(horas === 0
        ? "Auto-kick de no verificados **desactivado**."
        : `Los usuarios no verificados serán expulsados tras **${horas} hora(s)**.`);
    }

    // ──────────────────────────────────────────────
    //   /verify antiraid
    // ──────────────────────────────────────────────
    if (sub === "antiraid") {
      const estado   = interaction.options.getBoolean("estado");
      const joins    = interaction.options.getInteger("joins");
      const segundos = interaction.options.getInteger("segundos");
      const accion   = interaction.options.getString("accion");

      const update = { antiraid_enabled: estado };
      if (joins)    update.antiraid_joins   = joins;
      if (segundos) update.antiraid_seconds = segundos;
      if (accion)   update.antiraid_action  = accion;

      await verifSettings.update(gid, update);
      const vsNew = await verifSettings.get(gid);
      return ok(estado
        ? `Anti-raid **activado**.\nAlerta tras **${vsNew.antiraid_joins} joins** en **${vsNew.antiraid_seconds}s**.\nAcción: **${vsNew.antiraid_action === "kick" ? "🚫 Kickear" : "⚠️ Solo alertar"}**`
        : "Anti-raid **desactivado**.");
    }

    // ──────────────────────────────────────────────
    //   /verify logs
    // ──────────────────────────────────────────────
    if (sub === "logs") {
      const canal = interaction.options.getChannel("canal");
      await verifSettings.update(gid, { log_channel: canal.id });
      return ok(`Logs de verificación → ${canal}`);
    }

    // ──────────────────────────────────────────────
    //   /verify forzar
    // ──────────────────────────────────────────────
    if (sub === "forzar") {
      const user   = interaction.options.getUser("usuario");
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) return er("No se encontró al usuario en el servidor.");

      await applyVerification(member, interaction.guild, vs, "Manual por staff");
      await verifLogs.add(gid, user.id, "verified", `Forzado por ${interaction.user.tag}`);

      return ok(`<@${user.id}> verificado manualmente.`);
    }

    // ──────────────────────────────────────────────
    //   /verify desverificar
    // ──────────────────────────────────────────────
    if (sub === "desverificar") {
      const user   = interaction.options.getUser("usuario");
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) return er("No se encontró al usuario en el servidor.");

      if (vs?.verified_role) {
        const vr = interaction.guild.roles.cache.get(vs.verified_role);
        if (vr) await member.roles.remove(vr).catch(() => {});
      }
      if (vs?.unverified_role) {
        const ur = interaction.guild.roles.cache.get(vs.unverified_role);
        if (ur) await member.roles.add(ur).catch(() => {});
      }

      await verifLogs.add(gid, user.id, "unverified", `Por ${interaction.user.tag}`);
      return ok(`Verificación de <@${user.id}> removida.`);
    }

    // ──────────────────────────────────────────────
    //   /verify stats
    // ──────────────────────────────────────────────
    if (sub === "stats") {
      const stats   = await verifLogs.getStats(gid);
      const recents = await verifLogs.getRecent(gid, 5);
      const recentText = recents.length
        ? recents.map(l => {
            const icon = l.status === "verified" ? "✅" : l.status === "failed" ? "❌" : "🚫";
            return `${icon} <@${l.user_id}> — <t:${Math.floor(new Date(l.created_at).getTime() / 1000)}:R>`;
          }).join("\n")
        : "Sin actividad reciente";

      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle("📊 Estadísticas de Verificación")
          .setColor(0x57F287)
          .addFields(
            { name: "✅ Verificados",    value: `\`${stats.verified}\``, inline: true },
            { name: "❌ Fallidos",       value: `\`${stats.failed}\``,   inline: true },
            { name: "🚫 Kickeados",      value: `\`${stats.kicked}\``,   inline: true },
            { name: "📋 Total registros",value: `\`${stats.total}\``,    inline: true },
            { name: "🕐 Actividad reciente", value: recentText, inline: false },
          ).setTimestamp()],
        flags: 64,
      });
    }

    // ──────────────────────────────────────────────
    //   /verify info
    // ──────────────────────────────────────────────
    if (sub === "info") {
      const yn     = v => v ? "✅ Sí" : "❌ No";
      const ch     = id => id ? `<#${id}>` : "❌ No configurado";
      const rl     = id => id ? `<@&${id}>` : "❌ Ninguno";
      const modes  = { button: "🖱️ Botón", code: "🔢 Código DM", question: "❓ Pregunta" };

      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle("✅ Configuración de Verificación")
          .setColor(0x57F287)
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .addFields(
            { name: "⚙️ Estado",              value: yn(vs?.enabled),                              inline: true },
            { name: "📋 Modo",                value: modes[vs?.mode] || vs?.mode || "No configurado",                   inline: true },
            { name: "📢 Canal",               value: ch(vs?.channel),                              inline: true },
            { name: "✅ Rol verificado",      value: rl(vs?.verified_role),                        inline: true },
            { name: "🔴 Rol no verificado",   value: rl(vs?.unverified_role),                      inline: true },
            { name: "📝 Logs",                value: ch(vs?.log_channel),                          inline: true },
            { name: "📩 DM al verificar",     value: yn(vs?.dm_on_verify),                         inline: true },
            { name: "⏰ Auto-kick",           value: vs?.kick_unverified_hours > 0 ? `${vs.kick_unverified_hours}h` : "❌ Desactivado", inline: true },
            { name: "🛡️ Anti-raid",           value: yn(vs?.antiraid_enabled),                     inline: true },
            ...(vs?.antiraid_enabled ? [
              { name: "🚨 Umbral",            value: `${vs.antiraid_joins} joins / ${vs.antiraid_seconds}s`, inline: true },
              { name: "⚡ Acción",            value: vs.antiraid_action === "kick" ? "🚫 Kickear" : "⚠️ Alertar", inline: true },
            ] : []),
            ...(vs?.mode === "question" ? [
              { name: "❓ Pregunta",          value: vs.question || "No configurada",              inline: false },
              { name: "✔️ Respuesta",         value: `\`${vs.question_answer || "?"}\``,           inline: true },
            ] : []),
          ).setTimestamp()],
        flags: 64,
      });
    }
  },
};

// ─────────────────────────────────────────────────────
//   ENVIAR / ACTUALIZAR PANEL DE VERIFICACIÓN
// ─────────────────────────────────────────────────────
async function sendVerifPanel(guild, vs, client) {
  if (!vs?.channel) return;
  const ch = guild.channels.cache.get(vs.channel);
  if (!ch) return;

  const color = parseInt(vs.panel_color || "57F287", 16);
  const modes = { button: "🖱️ Botón", code: "🔢 Código por DM", question: "❓ Pregunta" };

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(vs.panel_title || "✅ Verificación")
    .setDescription(
      (vs.panel_description || "Para acceder al servidor, debes verificarte.\nHaz clic en el botón de abajo para comenzar.") +
      `\n\n**⚙️ Modo:** ${modes[vs.mode] || vs.mode}`
    )
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({ text: `${guild.name} • Sistema de Verificación`, iconURL: guild.iconURL({ dynamic: true }) })
    .setTimestamp();

  if (vs.panel_image) embed.setImage(vs.panel_image);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("verify_start")
      .setLabel("✅ Verificarme")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("verify_help")
      .setLabel("❓ Ayuda")
      .setStyle(ButtonStyle.Secondary),
  );

  // Intentar editar el mensaje existente
  if (vs.panel_message_id) {
    try {
      const msg = await ch.messages.fetch(vs.panel_message_id);
      await msg.edit({ embeds: [embed], components: [row] });
      return;
    } catch { /* mensaje borrado, crear nuevo */ }
  }

  const msg = await ch.send({ embeds: [embed], components: [row] });
  await verifSettings.update(guild.id, { panel_message_id: msg.id });
}

// ─────────────────────────────────────────────────────
//   APLICAR VERIFICACIÓN A UN MIEMBRO
// ─────────────────────────────────────────────────────
async function applyVerification(member, guild, vs, reason = "") {
  if (vs?.verified_role) {
    const vr = guild.roles.cache.get(vs.verified_role);
    if (vr) await member.roles.add(vr).catch(() => {});
  }
  if (vs?.unverified_role) {
    const ur = guild.roles.cache.get(vs.unverified_role);
    if (ur) await member.roles.remove(ur).catch(() => {});
  }
  // Auto-rol de bienvenida al verificarse
  const ws = await welcomeSettings.get(guild.id);
  if (ws?.welcome_autorole) {
    const ar = guild.roles.cache.get(ws.welcome_autorole);
    if (ar) await member.roles.add(ar).catch(() => {});
  }
}

module.exports.sendVerifPanel  = sendVerifPanel;
module.exports.applyVerification = applyVerification;
