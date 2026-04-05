const {
  SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder,
  ModalBuilder, TextInputBuilder, TextInputStyle,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ChannelType, MessageFlags,
} = require("discord.js");
const E = require("../../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { localeMapFromKey } = require("../../../utils/slashLocalizations");
const { embedTemplates } = require("../../../utils/database");
const { getMembershipStatus } = require("../../../utils/membershipReminders");

// ── Validar color HEX
function parseColor(hex) {
  if (!hex) return null;
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) return null;
  return parseInt(clean, 16);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("✨ Constructor de embeds personalizados")
    .setDescriptionLocalizations(localeMapFromKey("embed.slash.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

    // ── Create complete embed
    .addSubcommand(sub => sub
      .setName("create")
      .setDescription("Create and send an embed with interactive form")
      .setDescriptionLocalizations(localeMapFromKey("embed.slash.subcommands.create.description"))
      .addChannelOption(o => o.setName("channel").setDescription("Channel where to send the embed").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.channel")).addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addStringOption(o => o.setName("color").setDescription("HEX color without # (e.g., 5865F2)").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.color")).setRequired(false).setMaxLength(6))
      .addStringOption(o => o.setName("image").setDescription("Large image URL").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.image")).setRequired(false))
      .addStringOption(o => o.setName("thumbnail").setDescription("Thumbnail URL (top right)").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.thumbnail")).setRequired(false))
      .addStringOption(o => o.setName("footer").setDescription("Footer text").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.footer")).setRequired(false).setMaxLength(200))
      .addStringOption(o => o.setName("author").setDescription("Author text (at the top)").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.author")).setRequired(false).setMaxLength(200))
      .addStringOption(o => o.setName("author_icon").setDescription("Author icon URL").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.author_icon")).setRequired(false))
      .addBooleanOption(o => o.setName("timestamp").setDescription("Show current date and time in footer").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.timestamp")).setRequired(false))
      .addStringOption(o => o.setName("mention").setDescription("Mention someone or a role with the embed (e.g., @Everyone)").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.mention")).setRequired(false)))

    // ── Edit an existing bot embed
    .addSubcommand(sub => sub
      .setName("edit")
      .setDescription("Edit an existing embed sent by the bot")
      .setDescriptionLocalizations(localeMapFromKey("embed.slash.subcommands.edit.description"))
      .addStringOption(o => o.setName("message_id").setDescription("Message ID to edit").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.message_id")).setRequired(true))
      .addChannelOption(o => o.setName("channel").setDescription("Channel where the message is").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.channel")).addChannelTypes(ChannelType.GuildText).setRequired(false)))

    // ── Send quick simple embed
    .addSubcommand(sub => sub
      .setName("quick")
      .setDescription("Send a quick embed with title and description")
      .setDescriptionLocalizations(localeMapFromKey("embed.slash.subcommands.quick.description"))
      .addChannelOption(o => o.setName("channel").setDescription("Target channel").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.channel")).addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addStringOption(o => o.setName("title").setDescription("Title").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.title")).setRequired(true).setMaxLength(200))
      .addStringOption(o => o.setName("description").setDescription("Description").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.description")).setRequired(true).setMaxLength(2000))
      .addStringOption(o => o.setName("color").setDescription("HEX color without #").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.color")).setRequired(false).setMaxLength(6))
      .addStringOption(o => o.setName("mention").setDescription("Mention on send").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.mention")).setRequired(false)))

    // ── Preformatted announcement embed
    .addSubcommand(sub => sub
      .setName("announcement")
      .setDescription("Professional announcement template")
      .setDescriptionLocalizations(localeMapFromKey("embed.slash.subcommands.announcement.description"))
      .addChannelOption(o => o.setName("channel").setDescription("Target channel").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.channel")).addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addStringOption(o => o.setName("title").setDescription("Announcement title").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.title")).setRequired(true).setMaxLength(200))
      .addStringOption(o => o.setName("text").setDescription("Announcement content").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.text")).setRequired(true).setMaxLength(2000))
      .addStringOption(o => o.setName("mention").setDescription("Mention — e.g., @everyone, @Members").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.mention")).setRequired(false))
      .addStringOption(o => o.setName("image").setDescription("Announcement image URL").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.image")).setRequired(false))
      .addStringOption(o => o.setName("color").setDescription("HEX color without # (default: yellow)").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.color")).setRequired(false)))

    // ── Templates (PRO)
    .addSubcommandGroup(group => group
      .setName("template")
      .setDescription("✨ Embed templates management (Pro)")
      .setDescriptionLocalizations(localeMapFromKey("embed.slash.subcommands.template.description"))
      .addSubcommand(sub => sub
        .setName("save")
        .setDescription("Save current configuration as a template")
        .setDescriptionLocalizations(localeMapFromKey("embed.slash.subcommands.template.save.description"))
        .addStringOption(o => o.setName("name").setDescription("Template name").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.template_name")).setRequired(true).setMaxLength(50))
        .addStringOption(o => o.setName("title").setDescription("Title").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.title")).setRequired(false).setMaxLength(200))
        .addStringOption(o => o.setName("description").setDescription("Description").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.description")).setRequired(false).setMaxLength(2000))
        .addStringOption(o => o.setName("color").setDescription("HEX color").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.color")).setRequired(false).setMaxLength(6))
        .addStringOption(o => o.setName("image").setDescription("Image URL").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.image")).setRequired(false))
        .addStringOption(o => o.setName("thumbnail").setDescription("Thumbnail URL").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.thumbnail")).setRequired(false))
        .addStringOption(o => o.setName("footer").setDescription("Footer text").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.footer")).setRequired(false))
        .addStringOption(o => o.setName("author").setDescription("Author text").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.author")).setRequired(false))
        .addBooleanOption(o => o.setName("timestamp").setDescription("Enable timestamp").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.timestamp")).setRequired(false)))
      .addSubcommand(sub => sub
        .setName("load")
        .setDescription("Load and send a template")
        .setDescriptionLocalizations(localeMapFromKey("embed.slash.subcommands.template.load.description"))
        .addStringOption(o => o.setName("name").setDescription("Template name").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.template_name")).setRequired(true).setAutocomplete(true))
        .addChannelOption(o => o.setName("channel").setDescription("Target channel").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.channel")).addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addStringOption(o => o.setName("mention").setDescription("Optional mention").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.mention")).setRequired(false)))
      .addSubcommand(sub => sub
        .setName("list")
        .setDescription("List server templates")
        .setDescriptionLocalizations(localeMapFromKey("embed.slash.subcommands.template.list.description")))
      .addSubcommand(sub => sub
        .setName("delete")
        .setDescription("Delete a template")
        .setDescriptionLocalizations(localeMapFromKey("embed.slash.subcommands.template.delete.description"))
        .addStringOption(o => o.setName("name").setDescription("Template name").setDescriptionLocalizations(localeMapFromKey("embed.slash.options.template_name")).setRequired(true).setAutocomplete(true)))),

  async execute(interaction) {
    const group = interaction.options.getSubcommandGroup();
    const sub   = interaction.options.getSubcommand();
    const lang  = resolveInteractionLanguage(interaction);
    const er    = (msg, args) => interaction.reply({ embeds: [E.errorEmbed(t(lang, msg, args), null, lang)], flags: MessageFlags.Ephemeral });

    // ── Check Pro for Template group
    if (group === "template") {
      const status = await getMembershipStatus(interaction.guildId);
      if (!status.isPro) {
        return er("embed.errors.pro_required");
      }

      if (sub === "save") {
        const name = interaction.options.getString("name");
        const title = interaction.options.getString("title");
        const desc = interaction.options.getString("description");
        const color = interaction.options.getString("color");
        const image = interaction.options.getString("image");
        const thumb = interaction.options.getString("thumbnail");
        const footer = interaction.options.getString("footer");
        const author = interaction.options.getString("author");
        const ts = interaction.options.getBoolean("timestamp");

        if (color && !parseColor(color)) return er("embed.errors.invalid_color");
        if (image && !image.startsWith("http")) return er("embed.errors.invalid_image_url");
        if (thumb && !thumb.startsWith("http")) return er("embed.errors.invalid_thumbnail_url");

        const existing = await embedTemplates.get(interaction.guildId, name);
        if (existing) return er("embed.errors.template_exists", { name });

        await embedTemplates.create({
          guild_id: interaction.guildId,
          name,
          created_by: interaction.user.id,
          embed_data: { title, description: desc, color, image, thumbnail: thumb, footer, author, timestamp: ts }
        });

        return interaction.reply({
          embeds: [E.successEmbed(t(lang, "embed.success.template_saved", { name }), null, lang)],
          flags: MessageFlags.Ephemeral
        });
      }

      if (sub === "load") {
        const name = interaction.options.getString("name");
        const channel = interaction.options.getChannel("channel");
        const mention = interaction.options.getString("mention");

        const template = await embedTemplates.get(interaction.guildId, name);
        if (!template) return er("embed.errors.template_not_found", { name });

        const data = template.embed_data;
        const color = data.color ? (parseColor(data.color) ?? 0x5865F2) : 0x5865F2;

        const embed = new EmbedBuilder().setColor(color);
        if (data.title) embed.setTitle(data.title);
        if (data.description) embed.setDescription(data.description);
        if (data.image) embed.setImage(data.image);
        if (data.thumbnail) embed.setThumbnail(data.thumbnail);
        if (data.footer) embed.setFooter({ text: data.footer, iconURL: interaction.guild.iconURL() });
        if (data.author) embed.setAuthor({ name: data.author });
        if (data.timestamp) embed.setTimestamp();

        await channel.send({ content: mention || null, embeds: [embed] });

        return interaction.reply({
          embeds: [E.successEmbed(t(lang, "embed.success.sent", { channel: `<#${channel.id}>` }), null, lang)],
          flags: MessageFlags.Ephemeral
        });
      }

      if (sub === "list") {
        const list = await embedTemplates.list(interaction.guildId);
        if (list.length === 0) {
          return interaction.reply({
            embeds: [E.infoEmbed(t(lang, "embed.templates.no_templates"), null, lang)],
            flags: MessageFlags.Ephemeral
          });
        }

        const embed = new EmbedBuilder()
          .setColor(E.Colors.PRIMARY)
          .setTitle(t(lang, "embed.templates.list_title", { guildName: interaction.guild.name }))
          .setDescription(list.map(t => `• **${t.name}**`).join("\n"))
          .setFooter({ text: t(lang, "embed.templates.footer", { count: list.length, max: 50 }) });

        return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      }

      if (sub === "delete") {
        const name = interaction.options.getString("name");
        const deleted = await embedTemplates.delete(interaction.guildId, name);
        
        if (!deleted) return er("embed.errors.template_not_found", { name });

        return interaction.reply({
          embeds: [E.successEmbed(t(lang, "embed.success.template_deleted", { name }), null, lang)],
          flags: MessageFlags.Ephemeral
        });
      }

      return;
    }

    // ─────────────────────────────────────────────
    //   /embed create
    // ─────────────────────────────────────────────
    if (sub === "create") {
      const colorRaw  = interaction.options.getString("color");
      const image    = interaction.options.getString("image");
      const thumb     = interaction.options.getString("thumbnail");
      const footer    = interaction.options.getString("footer");
      const author     = interaction.options.getString("author");
      const authorIcon = interaction.options.getString("author_icon");
      const ts        = interaction.options.getBoolean("timestamp");
      const mention = interaction.options.getString("mention");
      const channel     = interaction.options.getChannel("channel");

      if (colorRaw && !parseColor(colorRaw))
        return er("embed.errors.invalid_color");
      if (image && !image.startsWith("http"))
        return er("embed.errors.invalid_image_url");
      if (thumb && !thumb.startsWith("http"))
        return er("embed.errors.invalid_thumbnail_url");

      // Save options in modal customId
      const payload = JSON.stringify({
        canal:     channel.id,
        color:     colorRaw || null,
        imagen:    image   || null,
        thumb:     thumb    || null,
        footer:    footer   || null,
        autor:     author    || null,
        autorIcon: authorIcon || null,
        ts:        ts ?? false,
        mencionar: mention || null,
      });

      // User a short ID for modal
      const modalId = "embed_create_" + Date.now().toString(36);

      // Save payload in temp memory
      if (!interaction.client._embedPayloads) interaction.client._embedPayloads = new Map();
      interaction.client._embedPayloads.set(modalId, payload);

      const modal = new ModalBuilder()
        .setCustomId(modalId)
        .setTitle(t(lang, "embed.modal.create_title"));

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("embed_titulo")
            .setLabel(t(lang, "embed.modal.field_title_label"))
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(200)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("embed_descripcion")
            .setLabel(t(lang, "embed.modal.field_description_label"))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(2000)
            .setPlaceholder(t(lang, "embed.modal.field_description_placeholder"))
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("embed_campos")
            .setLabel(t(lang, "embed.modal.field_extra_label"))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(1000)
            .setPlaceholder(t(lang, "embed.modal.field_extra_placeholder"))
        ),
      );

      return interaction.showModal(modal);
    }

    // ─────────────────────────────────────────────
    //   /embed edit
    // ─────────────────────────────────────────────
    if (sub === "edit") {
      const msgId = interaction.options.getString("message_id");
      const channel = interaction.options.getChannel("channel") || interaction.channel;

      const msg = await channel.messages.fetch(msgId).catch(() => null);
      if (!msg) return er("embed.errors.message_not_found");
      if (msg.author.id !== interaction.client.user.id) return er("embed.errors.not_bot_message");
      if (!msg.embeds.length) return er("embed.errors.no_embeds");

      const old = msg.embeds[0];

      const modal = new ModalBuilder()
        .setCustomId("embed_edit_" + msgId + "_" + channel.id)
        .setTitle(t(lang, "embed.modal.edit_title"));

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("embed_titulo")
            .setLabel(t(lang, "embed.modal.field_title_label"))
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(200)
            .setValue(old.title || "")
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("embed_descripcion")
            .setLabel(t(lang, "embed.modal.field_description_label"))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(2000)
            .setValue(old.description || "")
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("embed_color")
            .setLabel(t(lang, "embed.modal.field_color_label"))
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(6)
            .setValue(old.hexColor ? old.hexColor.replace("#", "") : "")
        ),
      );

      return interaction.showModal(modal);
    }

    // ─────────────────────────────────────────────
    //   /embed quick
    // ─────────────────────────────────────────────
    if (sub === "quick") {
      const channel     = interaction.options.getChannel("channel");
      const title    = interaction.options.getString("title");
      const desc      = interaction.options.getString("description");
      const colorRaw  = interaction.options.getString("color");
      const mention = interaction.options.getString("mention");

      const color = colorRaw ? (parseColor(colorRaw) ?? E.Colors.PRIMARY) : E.Colors.PRIMARY;

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(desc)
        .setFooter({ text: t(lang, "embed.footer.sent_by", { username: interaction.user.username }), iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      await channel.send({ content: mention || null, embeds: [embed] });

      return interaction.reply({
        embeds: [E.successEmbed(t(lang, "embed.success.sent", { channel: `<#${channel.id}>` }), null, lang)],
        flags: MessageFlags.Ephemeral,
      });
    }

    // ─────────────────────────────────────────────
    //   /embed announcement
    // ─────────────────────────────────────────────
    if (sub === "announcement") {
      const channel     = interaction.options.getChannel("channel");
      const title    = interaction.options.getString("title");
      const text     = interaction.options.getString("text");
      const mention = interaction.options.getString("mention");
      const image    = interaction.options.getString("image");
      const colorRaw  = interaction.options.getString("color");

      if (image && !image.startsWith("http"))
        return er("embed.errors.invalid_image_url");

      const color = colorRaw ? (parseColor(colorRaw) ?? 0xFEE75C) : 0xFEE75C;

      const embed = new EmbedBuilder()
        .setColor(color);
      const prefix = t(lang, "embed.announcement_prefix");
      embed.setTitle(prefix + title)
        .setDescription(text)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setFooter({
          text: t(lang, "embed.footer.announcement", { guildName: interaction.guild.name }),
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();

      if (image) embed.setImage(image);

      await channel.send({ content: mention || null, embeds: [embed] });

      return interaction.reply({
        embeds: [E.successEmbed(t(lang, "embed.success.announcement_sent", { channel: `<#${channel.id}>` }), null, lang)],
        flags: MessageFlags.Ephemeral,
      });
    }
  },

  async autocomplete(interaction) {
    const sub = interaction.options.getSubcommand();
    const focusedValue = interaction.options.getFocused();
    
    if (sub === "load" || sub === "delete") {
      const list = await embedTemplates.list(interaction.guildId);
      const filtered = list.filter(t => t.name.toLowerCase().includes(focusedValue.toLowerCase()));
      await interaction.respond(
        filtered.slice(0, 25).map(t => ({ name: t.name, value: t.name }))
      );
    }
  }
};

// ── Embed modal handler (called from interactionCreate)
async function handleEmbedModal(interaction) {
  const { customId } = interaction;
  const lang = resolveInteractionLanguage(interaction);

  // ── CREATE modal
  if (customId.startsWith("embed_create_")) {
    const payloadStr = interaction.client._embedPayloads?.get(customId);
    if (!payloadStr) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(lang, "embed.errors.form_expired"), null, lang)],
        flags: MessageFlags.Ephemeral,
      });
    }
    interaction.client._embedPayloads.delete(customId);

    const opts       = JSON.parse(payloadStr);
    const titulo     = interaction.fields.getTextInputValue("embed_titulo").trim();
    const desc       = interaction.fields.getTextInputValue("embed_descripcion").trim();
    const camposRaw  = interaction.fields.getTextInputValue("embed_campos").trim();
    const canal      = interaction.guild.channels.cache.get(opts.canal);

    if (!canal) return interaction.reply({ embeds: [E.errorEmbed(t(lang, "embed.errors.channel_not_found"), null, lang)], flags: MessageFlags.Ephemeral });

    const color = opts.color ? (parseColor(opts.color) ?? 0x5865F2) : 0x5865F2;

    const embed = new EmbedBuilder().setColor(color);
    if (titulo) embed.setTitle(titulo);
    if (desc)   embed.setDescription(desc);
    if (opts.imagen) embed.setImage(opts.imagen);
    if (opts.thumb)  embed.setThumbnail(opts.thumb);
    if (opts.ts)     embed.setTimestamp();
    if (opts.footer) embed.setFooter({ text: opts.footer, iconURL: interaction.guild.iconURL({ dynamic: true }) });
    if (opts.autor)  embed.setAuthor({ name: opts.autor, iconURL: opts.autorIcon || undefined });

    // Parse extra fields: "Name|Value|inline\n..."
    if (camposRaw) {
      const campos = camposRaw.split("\n").map(l => l.trim()).filter(Boolean);
      for (const campo of campos.slice(0, 10)) {
        const parts = campo.split("|");
        if (parts.length >= 2) {
          embed.addFields({
            name:   parts[0].trim().substring(0, 100) || t(lang, "embed.modal.field_extra_fallback_name"),
            value:  parts[1].trim().substring(0, 500) || "\u200b",
            inline: parts[2]?.trim().toLowerCase() === "true",
          });
        }
      }
    }

    await canal.send({ content: opts.mencionar || null, embeds: [embed] });
    return interaction.reply({ embeds: [E.successEmbed(t(lang, "embed.success.sent", { channel: `<#${canal.id}>` }), null, lang)], flags: MessageFlags.Ephemeral });
  }

  // ── EDIT modal
  if (customId.startsWith("embed_edit_")) {
    const parts   = customId.split("_");
    const msgId   = parts[2];
    const chId    = parts[3];
    const canal   = interaction.guild.channels.cache.get(chId);
    const msg     = canal ? await canal.messages.fetch(msgId).catch(() => null) : null;

    if (!msg) return interaction.reply({ embeds: [E.errorEmbed(t(lang, "embed.errors.message_not_found"), null, lang)], flags: MessageFlags.Ephemeral });

    const titulo  = interaction.fields.getTextInputValue("embed_titulo").trim();
    const desc    = interaction.fields.getTextInputValue("embed_descripcion").trim();
    const colorRaw = interaction.fields.getTextInputValue("embed_color").trim();

    const old   = msg.embeds[0];
    const color = colorRaw ? (parseColor(colorRaw) ?? (old.color || 0x5865F2)) : (old.color || 0x5865F2);

    const newEmbed = EmbedBuilder.from(old)
      .setColor(color);

    if (titulo !== undefined) newEmbed.setTitle(titulo || null);
    if (desc)                 newEmbed.setDescription(desc);

    await msg.edit({ embeds: [newEmbed] });
    return interaction.reply({ embeds: [E.successEmbed(t(lang, "embed.success.edited"), null, lang)], flags: MessageFlags.Ephemeral });
  }
}

module.exports = {
  data: module.exports.data,
  execute: module.exports.execute,
  autocomplete: module.exports.autocomplete,
  handleEmbedModal,
};

