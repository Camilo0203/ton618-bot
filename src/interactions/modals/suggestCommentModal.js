const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { suggestions, suggestSettings } = require("../../utils/database");
const { resolveInteractionLanguage, t } = require("../../utils/i18n");
const { getMembershipStatus } = require("../../utils/membershipReminders");

// Re-using the buildSuggestEmbed and buildButtons from suggestButtons.js is hard without exporting them.
// I'll import them if possible or duplicate the logic (better to export them from a handler file).
// Since they are defined in suggestButtons.js, I'll move them to a shared utility or just use them from suggestButtons.
const { buildSuggestEmbed, buildButtons } = require("../buttons/suggestButtons");

module.exports = {
  customId: "suggest_comment_modal_*",

  async execute(interaction, client) {
    const sugId = interaction.customId.split("_").pop();
    const lang = resolveInteractionLanguage(interaction);
    const gid = interaction.guild.id;

    try {
      const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages);
      if (!isAdmin) {
        return interaction.reply({
          content: t(lang, "suggest.errors.manage_messages_required"),
          flags: 64,
        });
      }

      const status = await getMembershipStatus(gid);
      if (!status.isPro) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(lang, "suggest.errors.pro_required"))],
          flags: 64,
        });
      }

      const note = interaction.fields.getTextInputValue("staff_note_input")?.trim();
      
      // Actualizar en base de datos
      await suggestions.collection().updateOne(
        { _id: require("mongodb").ObjectId.createFromHexString(sugId) },
        { $set: { staff_note: note } }
      );

      const updated = await suggestions.collection().findOne({
        _id: require("mongodb").ObjectId.createFromHexString(sugId),
      });

      if (!updated) {
        return interaction.reply({
          content: t(lang, "suggest.errors.not_exists"),
          flags: 64,
        });
      }

      const ss = await suggestSettings.get(gid);

      // Actualizar el mensaje original
      // Necesitamos encontrar el mensaje. Discord nos da el mensaje en la interacción si es un modal de un botón.
      if (interaction.message) {
        const embed = buildSuggestEmbed(updated, interaction.guild, ss?.anonymous, lang);
        const components = buildButtons(sugId, updated.status, isAdmin, lang, status.isPro);
        
        await interaction.message.edit({ embeds: [embed], components });
      }

      return interaction.reply({
        content: t(lang, "suggest.success.staff_note_updated", { num: updated.num }),
        flags: 64,
      });

    } catch (error) {
      console.error("[SUGGEST COMMENT MODAL ERROR]", error);
      return interaction.reply({
        content: t(lang, "suggest.errors.processing_error"),
        flags: 64,
      });
    }
  },
};
