const { EmbedBuilder } = require("discord.js");
const { settings } = require("../utils/database");
const { resolveGuildLanguage, t } = require("../utils/i18n");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    if (!message.guild || message.author?.bot) return;

    const guild = message.guild;
    const guildSettings = await settings.get(guild.id);

    if (!guildSettings || !guildSettings.log_channel || !guildSettings.log_deletes) return;

    const language = resolveGuildLanguage(guildSettings);
    const logCh = guild.channels.cache.get(guildSettings.log_channel);
    if (!logCh) return;

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle(t(language, "events.messageDelete.title"))
      .addFields(
        {
          name: t(language, "events.messageDelete.fields.author"),
          value: message.author
            ? `${message.author.tag} (<@${message.author.id}>)`
            : t(language, "events.messageDelete.unknown_author"),
          inline: true,
        },
        {
          name: t(language, "events.messageDelete.fields.channel"),
          value: `<#${message.channel.id}>`,
          inline: true,
        },
        {
          name: t(language, "events.messageDelete.fields.content"),
          value: (message.content || t(language, "events.messageDelete.no_text")).substring(0, 1000),
          inline: false,
        },
      )
      .setFooter({ text: t(language, "events.messageDelete.footer", { id: message.id }) })
      .setTimestamp();

    await logCh.send({ embeds: [embed] }).catch((err) => { console.error("[messageDelete] suppressed error:", err?.message || err); });
  },
};
