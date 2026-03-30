const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const { suggestions, suggestSettings } = require("../../utils/database");
const { ObjectId } = require("mongodb");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

// ── Colores por estado
const STATUS_COLOR = {
  pending: 0x5865f2,
  approved: 0x57f287,
  rejected: 0xed4245,
};

// ── Construir el embed de una sugerencia con título y descripción
function buildSuggestEmbed(sug, guild, anonymous = false, lang = "en") {
  const up = sug.upvotes?.length || 0;
  const down = sug.downvotes?.length || 0;
  const total = up + down;
  const pct = total > 0 ? Math.round((up / total) * 100) : 0;
  const barLen = 12;
  const filled = Math.round((pct / 100) * barLen);
  const bar = "🟢".repeat(filled) + "⚫".repeat(barLen - filled);

  // Construir descripción con título y detalles
  let description = "";
  if (sug.title) {
    description += `**${sug.title}**\n\n`;
  }
  if (sug.description) {
    description += `> ${sug.description}`;
  }

  const statusEmoji = t(lang, `suggest.emoji.${sug.status}`);
  const statusLabel = t(lang, `suggest.status.${sug.status}`);
  
  const embed = new EmbedBuilder()
    .setColor(STATUS_COLOR[sug.status] || 0x5865f2)
    .setTitle(t(lang, "suggest.embed.title", { emoji: statusEmoji, num: sug.num }))
    .setDescription(description || t(lang, "suggest.embed.no_description"))
    .addFields(
      {
        name: t(lang, "suggest.embed.field_author"),
        value: anonymous || !sug.user_id ? t(lang, "suggest.embed.author_anonymous") : `<@${sug.user_id}>`,
        inline: true,
      },
      {
        name: t(lang, "suggest.embed.field_status"),
        value: statusLabel,
        inline: true,
      },
      {
        name: t(lang, "suggest.embed.field_submitted"),
        value: `<t:${Math.floor(new Date(sug.created_at).getTime() / 1000)}:R>`,
        inline: true,
      },
      {
        name: t(lang, "suggest.embed.field_votes", { up, down, pct }),
        value: bar,
        inline: false,
      }
    )
    .setFooter({ text: t(lang, "suggest.embed.footer_status", { status: statusLabel }) })
    .setTimestamp();

  // Avatar del autor si no es anónimo
  if (!anonymous && sug.user_id) {
    const member = guild.members.cache.get(sug.user_id);
    if (member) {
      embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
    }
  }

  return embed;
}

// ── Construir botones (habilitados o deshabilitados)
function buildButtons(sugId, status, isAdmin = false, lang = "en") {
  const disabled = status !== "pending";

  // Fila 1: Votos (para todos)
  const voteRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`sug_up_${sugId}`)
      .setLabel(t(lang, "suggest.buttons.vote_up"))
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`sug_down_${sugId}`)
      .setLabel(t(lang, "suggest.buttons.vote_down"))
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled)
  );

  // Fila 2: Admin (solo si es admin y está pendiente)
  if (isAdmin && status === "pending") {
    const adminRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`sug_approve_${sugId}`)
        .setLabel(t(lang, "suggest.buttons.approve"))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`sug_reject_${sugId}`)
        .setLabel(t(lang, "suggest.buttons.reject"))
        .setStyle(ButtonStyle.Secondary)
    );
    return [voteRow, adminRow];
  }

  return [voteRow];
}

// ── Handler del Modal de Sugerencias
module.exports = {
  customId: "suggest_modal",

  async execute(interaction, client) {
    // Deferir la respuesta para ganar tiempo antes de operaciones pesadas
    await interaction.deferReply({ flags: 64 });

    try {
      const gid = interaction.guild.id;
      const lang = resolveInteractionLanguage(interaction);
      const ss = await suggestSettings.get(gid);
      
      // Obtener los datos del modal
      const title = interaction.fields.getTextInputValue("suggest_title")?.trim() || "";
      const description = interaction.fields.getTextInputValue("suggest_description")?.trim() || "";

      // Validar que al menos tenga algo
      if (!title && !description) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xed4245)
              .setTitle(t(lang, "suggest.errors.invalid_data").split(".")[0])
              .setDescription(t(lang, "suggest.errors.invalid_data"))
          ],
          flags: 64 // Ephemeral
        });
      }

      // Verificar que el sistema esté activado
      if (!ss?.enabled) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xed4245)
              .setTitle(t(lang, "suggest.errors.system_disabled").split("\n")[0])
              .setDescription(t(lang, "suggest.errors.system_disabled")),
          ],
          flags: 64
        });
      }

      // Verificar canal configurado
      const targetChannelId = ss?.channel || interaction.channel.id;
      const ch = interaction.guild.channels.cache.get(targetChannelId);
      if (!ch) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xed4245)
              .setTitle(t(lang, "suggest.errors.channel_not_configured").split("\n")[0])
              .setDescription(t(lang, "suggest.errors.channel_not_configured")),
          ],
          flags: 64
        });
      }

      // Verificar cooldown
      if (ss?.cooldown_minutes > 0) {
        const recentSug = await suggestions.collection().findOne(
          {
            guild_id: gid,
            user_id: interaction.user.id,
            created_at: {
              $gte: new Date(Date.now() - ss.cooldown_minutes * 60000).toISOString(),
            },
          },
          { sort: { created_at: -1 } }
        );

        if (recentSug) {
          const minutesAgo = Math.floor(
            (Date.now() - new Date(recentSug.created_at).getTime()) / 60000
          );
          const remaining = ss.cooldown_minutes - minutesAgo;
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(0xfee75c)
                .setTitle(t(lang, "suggest.cooldown.title"))
                .setDescription(t(lang, "suggest.cooldown.description", { minutes: remaining })),
            ],
            flags: 64
          });
        }
      }

      // Enviar mensaje placeholder para obtener ID
      const placeholder = await ch.send({
        content: t(lang, "suggest.placeholder")
      });

      // Crear en base de datos con título y descripción
      const sug = await suggestions.createWithDetails(
        gid,
        interaction.user.id,
        title,
        description,
        placeholder.id,
        ch.id
      );

      // Construir embed y botones
      const embed = buildSuggestEmbed(sug, interaction.guild, ss?.anonymous, lang);
      const components = buildButtons(sug._id.toString(), sug.status, false, lang);

      // Editar mensaje con el embed completo
      await placeholder.edit({
        content: null,
        embeds: [embed],
        components: components,
      });

      // ── CREAR HILO DE DEBATE AUTOMÁTICO ──
      let threadId = null;
      try {
        const threadName = `Debate: ${title ? title.substring(0, 40) : `Sugerencia #${sug.num}`}`;
        
        // Usar startThread que crea un hilo público
        const thread = await placeholder.startThread({
          name: threadName,
          autoArchiveDuration: 1440, // 24 horas
          type: ChannelType.PublicThread,
          reason: `Hilo de debate para sugerencia #${sug.num}`
        });
        
        threadId = thread.id;
        
        // Guardar el thread_id en la base de datos
        await suggestions.collection().updateOne(
          { _id: sug._id },
          { $set: { thread_id: threadId } }
        );
        
        // Enviar mensaje inicial en el hilo
        await thread.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0x5865f2)
              .setTitle(t(lang, "suggest.embed.debate_title", { num: sug.num }))
              .setDescription(title ? `**${title}**\n\n${description || t(lang, "suggest.embed.no_description")}` : `> ${description}`)
              .setFooter({ text: t(lang, "suggest.embed.debate_footer") })
              .setTimestamp()
          ]
        });
      } catch (threadError) {
        console.error("[SUGGEST THREAD ERROR]", threadError.message);
        // No fallar si el hilo no se puede crear (puede ser por permisos)
      }

      // Responder al usuario
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57f287)
            .setTitle(t(lang, "suggest.success.submitted_title"))
            .setDescription(
              t(lang, "suggest.success.submitted_description", { num: sug.num, channel: ch }) + `\n\n${title ? `**${title}**\n` : ""}${description ? `> ${description.substring(0, 200)}${description.length > 200 ? "..." : ""}` : ""}`
            )
            .setFooter({ text: t(lang, "suggest.success.submitted_footer") })
            .setTimestamp(),
        ],
        flags: 64
      });

    } catch (error) {
      console.error("[SUGGEST MODAL ERROR]", error);
      const lang = resolveInteractionLanguage(interaction);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle(t(lang, "suggest.errors.processing_error").split(" ")[0])
            .setDescription(t(lang, "suggest.errors.processing_error"))
        ],
        flags: 64
      });
    }
  }
};
