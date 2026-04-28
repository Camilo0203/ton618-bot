const { EmbedBuilder } = require("discord.js");
const { settings } = require("../utils/database");
const { resolveGuildLanguage, t } = require("../utils/i18n");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    // ── Filtrar bots y mensajes fuera de un servidor
    if (!newMessage.guild || newMessage.author?.bot) return;

    // ── Evitar registrar si el contenido es el mismo (ej. si solo se incrustó un enlace)
    if (oldMessage.content === newMessage.content) return;

    const guild = newMessage.guild;

    // ── Obtener configuración del servidor
    const s = await settings.get(guild.id);

    // ── Verificar que log_channel existe y log_edits está habilitado
    if (!s || !s.log_channel || !s.log_edits) return;

    const language = resolveGuildLanguage(s);

    // ── Obtener el canal de logs del servidor
    const logCh = guild.channels.cache.get(s.log_channel);
    if (!logCh) return;

    // ── Crear Embed de log
    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle(t(language, "events.modlog.edit_title"))
      .addFields(
        {
          name: t(language, "events.modlog.fields.author"),
          value: `${newMessage.author.tag} (<@${newMessage.author.id}>)`,
          inline: true,
        },
        {
          name: t(language, "events.modlog.fields.channel"),
          value: `<#${newMessage.channel.id}>`,
          inline: true,
        },
        {
          name: t(language, "events.modlog.fields.link"),
          value: `[${t(language, "events.modlog.goto_message")}](${newMessage.url})`,
          inline: true,
        },
        {
          name: t(language, "events.modlog.fields.before"),
          value: (oldMessage.content || t(language, "events.modlog.edit_empty")).substring(0, 1000),
          inline: false,
        },
        {
          name: t(language, "events.modlog.fields.after"),
          value: (newMessage.content || t(language, "events.modlog.edit_empty")).substring(0, 1000),
          inline: false,
        },
      )
      .setFooter({ text: `ID: ${newMessage.id}` })
      .setTimestamp();

    // ── Enviar embed al canal de logs
    await logCh.send({ embeds: [embed] }).catch((err) => { console.error("[messageUpdate] suppressed error:", err?.message || err); });
  },
};
