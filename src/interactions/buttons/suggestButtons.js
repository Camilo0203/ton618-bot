const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const { suggestions, suggestSettings } = require("../../utils/database");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");
const logger = require("../../utils/structuredLogger");

// ── Colores por estado
const STATUS_COLOR = {
  pending: 0x5865f2,
  approved: 0x57f287,
  rejected: 0xed4245,
};

// ── Construir el embed actualizado con título y descripción
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
  // Fallback para sugerencias antiguas que solo tienen "text"
  if (!sug.title && !sug.description && sug.text) {
    description = `> ${sug.text}`;
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
    .setTimestamp();

  // Agregar nota del staff (Pro)
  if (sug.staff_note) {
    embed.addFields({
      name: t(lang, "suggest.embed.field_staff_note"),
      value: sug.staff_note,
      inline: false,
    });
  }

  // Agregar comentario del staff (tradicional, al aprobar/rechazar)
  if (sug.staff_comment && sug.status !== "pending") {
    embed.addFields({
      name: t(lang, "suggest.embed.field_staff_comment"),
      value: sug.staff_comment,
      inline: false,
    });
  }

  // Footer con revisor si existe
  if (sug.reviewed_by && sug.status !== "pending") {
    embed.setFooter({
      text: t(lang, "suggest.embed.footer_reviewed", { reviewer: sug.reviewed_by, status: statusLabel }),
    });
  } else {
    embed.setFooter({ text: t(lang, "suggest.embed.footer_status", { status: statusLabel }) });
  }

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
function buildButtons(sugId, status, isAdmin = false, lang = "en", isPro = false) {
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

  // Fila 2: Admin
  if (isAdmin) {
    const adminRow = new ActionRowBuilder();
    
    if (status === "pending") {
      adminRow.addComponents(
        new ButtonBuilder()
          .setCustomId(`sug_approve_${sugId}`)
          .setLabel(t(lang, "suggest.buttons.approve"))
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`sug_reject_${sugId}`)
          .setLabel(t(lang, "suggest.buttons.reject"))
          .setStyle(ButtonStyle.Secondary)
      );
    }

    // Botón de nota de staff (Pro) - Siempre visible para staff si es Pro
    if (isPro) {
      adminRow.addComponents(
        new ButtonBuilder()
          .setCustomId(`sug_comment_${sugId}`)
          .setLabel(t(lang, "suggest.buttons.staff_note"))
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("💬")
      );
    }

    if (adminRow.components.length > 0) {
      return [voteRow, adminRow];
    }
  }

  return [voteRow];
}

// ── Handler principal con wildcard para capturar sug_*_{id}
module.exports = {
  customId: "sug_*",
  buildSuggestEmbed,
  buildButtons,
  async execute(interaction, client) {
    const customId = interaction.customId;
    const [action, sugId] = customId.split("_").slice(1);
    const lang = resolveInteractionLanguage(interaction);
    const gid = interaction.guild.id;

    if (!sugId || !["up", "down", "approve", "reject", "comment"].includes(action)) {
      return interaction.reply({
        content: t(lang, "suggest.errors.interaction_error"),
        flags: 64,
      });
    }

    try {
      const { getMembershipStatus } = require("../../utils/membershipReminders");
      const status = await getMembershipStatus(gid);
      const ss = await suggestSettings.get(gid);
      const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages);

      // ─────────────────── VOTOS ───────────────────
      if (action === "up" || action === "down") {
        const suggestion = await suggestions.collection().findOne({
          _id: require("mongodb").ObjectId.createFromHexString(sugId),
        });

        if (!suggestion) {
          return interaction.reply({
            content: t(lang, "suggest.errors.not_exists"),
            flags: 64,
          });
        }

        if (suggestion.status !== "pending") {
          return interaction.reply({
            content: t(lang, "suggest.errors.already_reviewed"),
            flags: 64,
          });
        }

        const updated = await suggestions.vote(sugId, interaction.user.id, action);
        if (!updated) {
          return interaction.reply({
            content: t(lang, "suggest.errors.vote_error"),
            flags: 64,
          });
        }

        const embed = buildSuggestEmbed(updated, interaction.guild, ss?.anonymous, lang);
        const components = buildButtons(sugId, updated.status, isAdmin, lang, status.isPro);

        await interaction.message.edit({ embeds: [embed], components });
        const emoji = action === "up" ? "👍" : "👎";
        return interaction.reply({
          content: t(lang, "suggest.success.vote_registered", { emoji }),
          flags: 64,
        });
      }

      // ─────────────────── ADMIN ACTIONS ───────────────────
      if (!isAdmin) {
        return interaction.reply({
          content: t(lang, "suggest.errors.manage_messages_required"),
          flags: 64,
        });
      }

      // Pro check for special features
      if (action === "comment" && !status.isPro) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(lang, "suggest.errors.pro_required"))],
          flags: MessageFlags.Ephemeral,
        });
      }

      // CASE: STAFF NOTE (Pro)
      if (action === "comment") {
        const { ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
        const modal = new ModalBuilder()
          .setCustomId(`suggest_comment_modal_${sugId}`)
          .setTitle(t(lang, "suggest.buttons.staff_note"));

        const noteInput = new TextInputBuilder()
          .setCustomId("staff_note_input")
          .setLabel(t(lang, "suggest.buttons.staff_note"))
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(500);

        // Pre-fill if exists?
        const currentSuggestion = await suggestions.collection().findOne({
          _id: require("mongodb").ObjectId.createFromHexString(sugId),
        });
        if (currentSuggestion?.staff_note) {
          noteInput.setValue(currentSuggestion.staff_note);
        }

        modal.addComponents(new ActionRowBuilder().addComponents(noteInput));
        return interaction.showModal(modal);
      }

      // CASE: APPROVE/REJECT
      if (action === "approve" || action === "reject") {
        const suggestion = await suggestions.collection().findOne({
          _id: require("mongodb").ObjectId.createFromHexString(sugId),
        });

        if (!suggestion || suggestion.status !== "pending") {
          return interaction.reply({
            content: t(lang, "suggest.errors.already_reviewed"),
            flags: 64,
          });
        }

        const newStatus = action === "approve" ? "approved" : "rejected";

        // Actualizar estado en BD
        await suggestions.setStatus(
          sugId,
          newStatus,
          interaction.user.tag,
          null
        );

        // Obtener datos actualizados
        const updated = await suggestions.collection().findOne({
          _id: require("mongodb").ObjectId.createFromHexString(sugId),
        });

        // Actualizar embed y desactivar botones
        const embed = buildSuggestEmbed(updated, interaction.guild, ss?.anonymous, lang);
        const components = buildButtons(sugId, updated.status, false, lang); // false = sin botones de admin

        await interaction.message.edit({ embeds: [embed], components });

        // Cerrar el hilo de debate si existe
        if (suggestion.thread_id) {
          try {
            const thread = interaction.guild.channels.cache.get(suggestion.thread_id);
            if (thread && thread.isThread()) {
              const auditReason = t(lang, "suggest.audit.status_updated", { status: newStatus, user: interaction.user.tag });
              await thread.setLocked(true, auditReason);
              await thread.setArchived(true, auditReason);
            }
          } catch (threadError) {
            logger.error('suggestButtons', 'Thread close error', { error: threadError?.message || String(threadError) });
          }
        }

        // ── Mover al canal correspondiente si está configurado ──
        const targetChId =
          newStatus === "approved"
            ? ss?.approved_channel
            : newStatus === "rejected"
            ? ss?.rejected_channel
            : null;

        if (targetChId) {
          const targetCh = interaction.guild.channels.cache.get(targetChId);
          if (targetCh) {
            await targetCh
              .send({ embeds: [buildSuggestEmbed(updated, interaction.guild, ss?.anonymous, lang)] })
              .catch(() => {});
          }
        }

        // ── DM al autor ──
        if (ss?.dm_on_result && updated.user_id) {
          const author = await interaction.client.users
            .fetch(updated.user_id)
            .catch(() => null);
          if (author) {
            const dmColor = newStatus === "approved" ? 0x57f287 : 0xed4245;
            const dmTitle = newStatus === "approved" ? t(lang, "suggest.dm.title_approved") : t(lang, "suggest.dm.title_rejected");
            const dmEmbed = new EmbedBuilder()
              .setColor(dmColor)
              .setTitle(dmTitle)
              .setDescription(t(lang, "suggest.dm.description", { num: updated.num, guildName: interaction.guild.name }))
              .addFields({
                name: t(lang, "suggest.dm.field_suggestion"),
                value: updated.title ? `**${updated.title}**\n${updated.description || ""}`.substring(0, 500) : updated.text.substring(0, 500),
                inline: false,
              })
              .setTimestamp();

            await author.send({ embeds: [dmEmbed] }).catch(() => {});
          }
        }

        const statusLabel = t(lang, `suggest.status.${newStatus}`);
        return interaction.reply({
          content: t(lang, "suggest.success.status_updated", { num: updated.num, status: statusLabel }),
          flags: 64,
        });
      }
    } catch (error) {
      logger.error('suggestButtons', 'Button error', { error: error?.message || String(error) });
      const lang = resolveInteractionLanguage(interaction);
      return interaction.reply({
        content: t(lang, "suggest.errors.processing_error"),
        flags: 64,
      });
    }
  },
};
