const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits,
} = require("discord.js");
const { verifSettings, verifCodes, verifLogs, welcomeSettings, settings } = require("../utils/database");
const { applyVerification } = require("../commands/admin/config/verify");
const E = require("../utils/embeds");

// ─────────────────────────────────────────────────────
//   ENTRY POINT — llamado desde interactionCreate.js
// ─────────────────────────────────────────────────────
async function handleVerif(interaction) {
  const { customId } = interaction;

  // ── Botón principal: VERIFICARME
  if (customId === "verify_start") return handleVerifyStart(interaction);

  // ── Botón: AYUDA
  if (customId === "verify_help")  return handleVerifyHelp(interaction);

  // ── Modal: respuesta de código
  if (customId === "verify_code_modal") return handleCodeModal(interaction);

  // ── Modal: respuesta de pregunta
  if (customId === "verify_question_modal") return handleQuestionModal(interaction);

  // ── Botón: abrir modal para ingresar código (sin regenerar)
  if (customId === "verify_enter_code")  return handleEnterCode(interaction);

  // ── Botón: reenviar código
  if (customId === "verify_resend_code") return handleResendCode(interaction);
}

// ─────────────────────────────────────────────────────
//   BOTÓN: VERIFICARME
// ─────────────────────────────────────────────────────
async function handleVerifyStart(interaction) {
  const guild = interaction.guild;
  const user  = interaction.user;
  
  // OBTENER SOLO DE SETTINGS (fuente centralizada)
  const s = await settings.get(guild.id);
  const vs = await verifSettings.get(guild.id); // Solo para configuración del sistema (mode, channel, etc)

  if (!vs || !vs.enabled) {
    return interaction.reply({ embeds: [E.errorEmbed("El sistema de verificación no está activo.")], flags: 64 });
  }

  // Verificar si ya tiene el rol de verificación DESDE SETTINGS
  const member = await guild.members.fetch(user.id).catch(() => null);
  
  // Verificar verify_role desde settings (ÚNICA FUENTE)
  if (s.verify_role && s.verify_role !== null && member?.roles.cache.has(s.verify_role)) {
    return interaction.reply({
      embeds: [new EmbedBuilder().setColor(E.Colors.SUCCESS).setDescription("✅ ¡Ya estás verificado/a en este servidor!")],
      flags: 64,
    });
  }

  // ── Modo BOTÓN: verificación directa
  if (vs.mode === "button") {
    return completeVerification(interaction, guild, s, user);
  }

  // ── Modo CÓDIGO: enviar código por DM y mostrar modal
  if (vs.mode === "code") {
    // Generar código SOLO si no tiene uno activo todavía
    const existing = await verifCodes.getActive(user.id, guild.id);
    const code     = existing || await verifCodes.generate(user.id, guild.id);

    // Intentar enviar DM
    let dmOk = false;
    try {
      await user.send({
        embeds: [new EmbedBuilder()
          .setColor(0x57F287)
          .setTitle("🔢 Código de Verificación")
          .setDescription(
            `Tu código de verificación para **${guild.name}** es:\n\n` +
            `# \`${code}\`\n\n` +
            `⏱️ Este código expira en **10 minutos**.\n` +
            `Vuelve al servidor y haz clic en **"Ingresar código"**.`
          )
          .setFooter({ text: guild.name })
          .setTimestamp()],
      });
      dmOk = true;
    } catch {
      return interaction.reply({
        embeds: [E.errorEmbed(
          "❌ No pude enviarte el código por DM.\n\n" +
          "**Solución:** Ve a Configuración de usuario → Privacidad → activa **Mensajes directos** para este servidor, y vuelve a intentarlo."
        )],
        flags: 64,
      });
    }

    // Mostrar mensaje ephemeral con botón para abrir el modal
    return interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("📩 Código enviado por DM")
        .setDescription(
          `Te enviamos un código de **6 caracteres** por mensaje directo.\n\n` +
          `**Pasos:**\n` +
          `1️⃣ Abre tus DMs y copia el código\n` +
          `2️⃣ Vuelve aquí y haz clic en **"Ingresar código"**\n\n` +
          `⏱️ El código expira en **10 minutos**.`
        )
        .setFooter({ text: "¿No te llegó el DM? Haz clic en Reenviar código" })
        .setTimestamp()],
      components: [new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("verify_enter_code")
          .setLabel("🔢 Ingresar código")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("verify_resend_code")
          .setLabel("📩 Reenviar código")
          .setStyle(ButtonStyle.Secondary),
      )],
      flags: 64,
    });
  }

  // ── Modo PREGUNTA: mostrar modal con la pregunta
  if (vs.mode === "question") {
    if (!vs.question) {
      return interaction.reply({ embeds: [E.errorEmbed("No hay pregunta configurada. Usa `/verify pregunta` para configurarla.")], flags: 64 });
    }
    const modal = new ModalBuilder()
      .setCustomId("verify_question_modal")
      .setTitle("❓ Pregunta de Verificación");
    modal.addComponents(new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("answer_input")
        .setLabel(vs.question.substring(0, 45))
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100)
        .setPlaceholder("Escribe tu respuesta aquí...")
    ));
    return interaction.showModal(modal);
  }
}

// ─────────────────────────────────────────────────────
//   BOTÓN: AYUDA
// ─────────────────────────────────────────────────────
async function handleVerifyHelp(interaction) {
  const vs    = await verifSettings.get(interaction.guild.id);
  const modes = {
    button:   "Haz clic en **✅ Verificarme** para verificarte automáticamente.",
    code:     "Haz clic en **✅ Verificarme**, recibirás un código por DM. Ingrésalo en el formulario que aparece.",
    question: "Haz clic en **✅ Verificarme** y responde la pregunta correctamente.",
  };

  return interaction.reply({
    embeds: [new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("❓ ¿Cómo verificarme?")
      .setDescription(modes[vs?.mode] || "Sigue las instrucciones del panel.")
      .addFields(
        { name: "¿Problemas con el DM?",  value: "Asegúrate de tener los mensajes directos activados:\nConfiguración → Privacidad → Mensajes Directos ✅", inline: false },
        { name: "¿Código expirado?",      value: "El código dura 10 minutos. Haz clic en Verificarme de nuevo para recibir uno nuevo.", inline: false },
        { name: "¿Sigues sin acceso?",    value: "Contacta con un administrador del servidor.", inline: false },
      )
      .setTimestamp()],
    flags: 64,
  });
}

// ─────────────────────────────────────────────────────
//   BOTÓN: INGRESAR CÓDIGO (abre el modal sin regenerar código)
// ─────────────────────────────────────────────────────
async function handleEnterCode(interaction) {
  const vs = await verifSettings.get(interaction.guild.id);
  if (!vs || !vs.enabled) return interaction.reply({ embeds: [E.errorEmbed("La verificación no está activa.")], flags: 64 });

  const modal = new ModalBuilder()
    .setCustomId("verify_code_modal")
    .setTitle("🔢 Ingresa tu código");
  modal.addComponents(new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("code_input")
      .setLabel("Código recibido por DM")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(6)
      .setMaxLength(6)
      .setPlaceholder("Ej: AB1C2D")
  ));
  return interaction.showModal(modal);
}

// ─────────────────────────────────────────────────────
//   MODAL: INGRESO DE CÓDIGO
// ─────────────────────────────────────────────────────
async function handleCodeModal(interaction) {
  const guild = interaction.guild;
  const user  = interaction.user;
  const s     = await settings.get(guild.id); // Settings para verify_role
  const vs    = await verifSettings.get(guild.id);
  const input = interaction.fields.getTextInputValue("code_input").toUpperCase().trim();

  const result = await verifCodes.verify(user.id, guild.id, input);

  if (!result.valid) {
    const msgs = {
      no_code:  "No se encontró ningún código pendiente. Haz clic en **Verificarme** para generar uno nuevo.",
      expired:  "Tu código ha **expirado**. Haz clic en **Verificarme** para generar uno nuevo.",
      wrong:    "Código **incorrecto**. Inténtalo de nuevo.",
    };
    await verifLogs.add(guild.id, user.id, "failed", `Código incorrecto: ${input}`);
    return interaction.reply({ embeds: [E.errorEmbed(msgs[result.reason] || "Código inválido.")], flags: 64 });
  }

  return completeVerification(interaction, guild, s, user);
}

// ─────────────────────────────────────────────────────
//   MODAL: RESPUESTA DE PREGUNTA
// ─────────────────────────────────────────────────────
async function handleQuestionModal(interaction) {
  const guild  = interaction.guild;
  const user   = interaction.user;
  const s      = await settings.get(guild.id); // Settings para verify_role
  const vs     = await verifSettings.get(guild.id);
  const answer = interaction.fields.getTextInputValue("answer_input").toLowerCase().trim();

  if (answer !== (vs.question_answer || "").toLowerCase().trim()) {
    await verifLogs.add(guild.id, user.id, "failed", `Respuesta incorrecta: ${answer}`);
    return interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor(E.Colors.ERROR)
        .setDescription("❌ Respuesta **incorrecta**. Inténtalo de nuevo.\n\n💡 Lee con atención la pregunta y las reglas del servidor.")],
      flags: 64,
    });
  }

  return completeVerification(interaction, guild, s, user);
}

// ─────────────────────────────────────────────────────
//   REENVIAR CÓDIGO
// ─────────────────────────────────────────────────────
async function handleResendCode(interaction) {
  const guild = interaction.guild;
  const user  = interaction.user;
  const vs    = await verifSettings.get(guild.id);

  if (!vs || vs.mode !== "code") {
    return interaction.reply({ embeds: [E.errorEmbed("Este modo no usa códigos.")], flags: 64 });
  }

  const code = await verifCodes.generate(user.id, guild.id);
  try {
    await user.send({
      embeds: [new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("🔢 Nuevo Código de Verificación")
        .setDescription(`Tu nuevo código es:\n\n# \`${code}\`\n\n⏱️ Expira en **10 minutos**.`)
        .setFooter({ text: guild.name }).setTimestamp()],
    });
    return interaction.reply({ embeds: [E.successEmbed("Nuevo código enviado por DM.")], flags: 64 });
  } catch {
    return interaction.reply({ embeds: [E.errorEmbed("No pude enviarte el DM. Activa los mensajes directos.")], flags: 64 });
  }
}

// ─────────────────────────────────────────────────────
//   COMPLETAR VERIFICACIÓN
// ─────────────────────────────────────────────────────
async function completeVerification(interaction, guild, s, user) {
  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member) return interaction.reply({ embeds: [E.errorEmbed("No se encontró tu perfil en el servidor.")], flags: 64 });

  // OBTENER verify_role DESDE SETTINGS (ÚNICA FUENTE)
  // Aplicar verify_role desde settings si existe
  if (s.verify_role && s.verify_role !== null) {
    const verifyRole = guild.roles.cache.get(s.verify_role);
    if (verifyRole) {
      await member.roles.add(verifyRole).catch(() => {});
    }
  }

  // Obtener configuración adicional de verifSettings (solo para DM y logs)
  const vs = await verifSettings.get(guild.id);
  
  // Aplicar roles adicionales desde verifSettings (para compatibilidad hacia atrás - verified_role)
  await applyVerification(member, guild, vs, "Verificación completada");
  await verifLogs.add(guild.id, user.id, "verified");

  // Respuesta en el canal de verificación (ephemeral)
  await interaction.reply({
    embeds: [new EmbedBuilder()
      .setColor(E.Colors.SUCCESS)
      .setTitle("✅ ¡Verificación completada!")
      .setDescription(`¡Bienvenido/a a **${guild.name}**, <@${user.id}>! 🎉\nYa tienes acceso completo al servidor.`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()],
    flags: 64,
  });

  // DM de confirmación
  if (vs.dm_on_verify) {
    await user.send({
      embeds: [new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("✅ ¡Verificación exitosa!")
        .setDescription(`Has sido verificado/a en **${guild.name}**.\n¡Ya puedes acceder a todos los canales!`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setFooter({ text: guild.name })
        .setTimestamp()],
    }).catch(() => {});
  }

  // Log en el canal de logs
  if (vs.log_channel) {
    const logCh = guild.channels.cache.get(vs.log_channel);
    await logCh?.send({
      embeds: [new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("✅ Usuario Verificado")
        .addFields(
          { name: "👤 Usuario",  value: `${user.tag} (<@${user.id}>)`, inline: true },
          { name: "🆔 ID",       value: `\`${user.id}\``,              inline: true },
          { name: "⚙️ Modo",    value: vs.mode,                        inline: true },
          { name: "📅 Cuando",  value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
        )
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()],
    }).catch(() => {});
  }
}

module.exports = { handleVerif };
