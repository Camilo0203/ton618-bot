const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags,
} = require("discord.js");
const { suggestSettings, suggestions } = require("../../../utils/database");
const { ObjectId } = require("mongodb");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { localeMapFromKey } = require("../../../utils/slashLocalizations");

// ── Colores por estado
const STATUS_COLOR = {
  pending: 0x5865f2,
  approved: 0x57f287,
  rejected: 0xed4245,
};

// ── Construir el embed de una sugerencia
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

// ── Construir botones
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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("💡 Submit a suggestion for the server")
    .setDescriptionLocalizations(localeMapFromKey("suggest.slash.description")),

  buildSuggestEmbed,
  buildButtons,

  async execute(interaction) {
    const gid = interaction.guild.id;
    const lang = resolveInteractionLanguage(interaction);
    const ss = await suggestSettings.get(gid);
    const isAdmin = interaction.member.permissions.has(
      PermissionFlagsBits.ManageMessages
    );

    // Verificar que el sistema esté activado
    if (!ss?.enabled) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle(t(lang, "suggest.errors.system_disabled").split("\n")[0])
            .setDescription(t(lang, "suggest.errors.system_disabled")),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    // Verificar canal configurado
    const targetChannelId = ss?.channel || interaction.channel.id;
    const ch = interaction.guild.channels.cache.get(targetChannelId);
    if (!ch) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle(t(lang, "suggest.errors.channel_not_configured").split("\n")[0])
            .setDescription(t(lang, "suggest.errors.channel_not_configured")),
        ],
        flags: MessageFlags.Ephemeral,
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
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xfee75c)
              .setTitle(t(lang, "suggest.cooldown.title"))
              .setDescription(t(lang, "suggest.cooldown.description", { minutes: remaining })),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    // ── MOSTRAR MODAL CON TÍTULO Y DESCRIPCIÓN ──
    const modal = new ModalBuilder()
      .setCustomId("suggest_modal")
      .setTitle(t(lang, "suggest.modal.title"));

    // Campo 1: Título de la sugerencia
    const titleInput = new TextInputBuilder()
      .setCustomId("suggest_title")
      .setLabel(t(lang, "suggest.modal.field_title_label"))
      .setPlaceholder(t(lang, "suggest.modal.field_title_placeholder"))
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(200);

    // Campo 2: Descripción detallada
    const descriptionInput = new TextInputBuilder()
      .setCustomId("suggest_description")
      .setLabel(t(lang, "suggest.modal.field_description_label"))
      .setPlaceholder(t(lang, "suggest.modal.field_description_placeholder"))
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(2000);

    // Añadir filas al modal
    const titleRow = new ActionRowBuilder().addComponents(titleInput);
    const descRow = new ActionRowBuilder().addComponents(descriptionInput);
    modal.addComponents(titleRow, descRow);

    // Mostrar el modal al usuario
    return interaction.showModal(modal);
  },
};
