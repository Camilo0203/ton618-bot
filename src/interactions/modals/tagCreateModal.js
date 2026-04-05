const { tags, settings } = require("../../utils/database");
const E = require("../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");

// Configuración de colores
const Colors = {
  SUCCESS: 0x57F287,
  ERROR: 0xED4245,
};

// ── Handler del Modal de Crear Tag
module.exports = {
  customId: "tag_create_*",

  async execute(interaction, client) {
    // Deferir la respuesta para ganar tiempo antes de operaciones con la base de datos
    await interaction.deferReply({ flags: 64 });

    const s = await settings.get(interaction.guild.id);
    const language = resolveInteractionLanguage(interaction, s);

    try {
      const { customId } = interaction;
      const name = customId.replace("tag_create_", "");
      const content = interaction.fields.getTextInputValue("tag_content").trim();

      if (!content) {
        return interaction.editReply({
          embeds: [E.errorEmbed(t(language, "modals.tags.error_empty"), client, language, s)],
        });
      }

      // Verificar si ya existe
      const existing = await tags.get(interaction.guild.id, name);
      if (existing) {
        return interaction.editReply({
          embeds: [E.errorEmbed(t(language, "modals.tags.error_exists"), client, language, s)],
        });
      }

      // Crear el tag
      await tags.create(interaction.guild.id, name, content, interaction.user.id);

      const embed = new EmbedBuilder()
        .setColor(Colors.SUCCESS)
        .setTitle(`✅ ${t(language, "modals.tags.success_title")}`)
        .setDescription(
          t(language, "modals.tags.success_desc", { name }) +
            `\n\n📄 **${t(language, "events.modlog.fields.before")}:**\n${content.substring(0, 1000)}${content.length > 1000 ? "..." : ""}`
        )
        .setFooter({
          text: t(language, "modals.tags.footer", { user: interaction.user.username }),
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("[TAG CREATE MODAL ERROR]", error);
      return interaction.editReply({
        embeds: [E.errorEmbed(t(language, "modals.tags.error_failed"), client, language, s)],
      });
    }
  },
};
