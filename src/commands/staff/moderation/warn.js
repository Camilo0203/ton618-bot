const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { warnings, settings } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const {
  withDescriptionLocalizations,
} = require("../../../utils/slashLocalizations");

function getUserOption(interaction) {
  return interaction.options.getUser("user")
    || interaction.options.getUser("usuario");
}

function getReasonOption(interaction) {
  return interaction.options.getString("reason")
    || interaction.options.getString("razon");
}

module.exports = {
  data: withDescriptionLocalizations(
    new SlashCommandBuilder()
      .setName("warn")
      .setDescription(t("en", "warn.slash.description"))
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("add")
            .setDescription(t("en", "warn.slash.subcommands.add.description"))
            .addUserOption((opt) =>
              withDescriptionLocalizations(
                opt.setName("user").setDescription(t("en", "warn.slash.options.user_warn")).setRequired(true),
                "warn.slash.options.user_warn"
              )
            )
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt.setName("reason").setDescription(t("en", "warn.slash.options.reason")).setRequired(true),
                "warn.slash.options.reason"
              )
            ),
          "warn.slash.subcommands.add.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("check")
            .setDescription(t("en", "warn.slash.subcommands.check.description"))
            .addUserOption((opt) =>
              withDescriptionLocalizations(
                opt.setName("user").setDescription(t("en", "warn.slash.options.user_inspect")).setRequired(true),
                "warn.slash.options.user_inspect"
              )
            ),
          "warn.slash.subcommands.check.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("remove")
            .setDescription(t("en", "warn.slash.subcommands.remove.description"))
            .addStringOption((opt) =>
              withDescriptionLocalizations(
                opt.setName("id").setDescription(t("en", "warn.slash.options.id")).setRequired(true),
                "warn.slash.options.id"
              )
            ),
          "warn.slash.subcommands.remove.description"
        )
      )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    "warn.slash.description"
  ),

  async execute(interaction) {
    const guildSettings = await settings.get(interaction.guild.id);
    const language = resolveInteractionLanguage(interaction, guildSettings);
    const sub = interaction.options.getSubcommand();

    if (sub === "add") {
      const user = getUserOption(interaction);
      const reason = getReasonOption(interaction);
      const member = interaction.guild.members.cache.get(user.id);

      const warning = await warnings.add(
        interaction.guild.id,
        user.id,
        reason,
        interaction.user.id,
      );

      const totalWarnings = await warnings.getCount(interaction.guild.id, user.id);
      let autoActionText = "";

      if (totalWarnings >= 5 && member) {
        try {
          await member.kick("Automatic moderation: reached 5 warnings");
          autoActionText = `\n\n${t(language, "warn.responses.auto_kick_success")}`;
        } catch {
          autoActionText = `\n\n${t(language, "warn.responses.auto_kick_failed")}`;
        }
      } else if (totalWarnings >= 3 && member) {
        try {
          const timeoutDuration = 60 * 60 * 1000;
          await member.timeout(timeoutDuration, "Automatic moderation: reached 3 warnings");
          autoActionText = `\n\n${t(language, "warn.responses.auto_timeout_success")}`;
        } catch {
          autoActionText = `\n\n${t(language, "warn.responses.auto_timeout_failed")}`;
        }
      }

      const embedColor = totalWarnings >= 5
        ? E.Colors.ERROR
        : totalWarnings >= 3
          ? E.Colors.ORANGE
          : E.Colors.WARNING;

      const embed = new EmbedBuilder()
        .setTitle(t(language, "warn.responses.add_title"))
        .setColor(embedColor)
        .setDescription(t(language, "warn.responses.add_description", { user }) + autoActionText)
        .addFields(
          { name: t(language, "warn.fields.user"), value: `${user} (\`${user.id}\`)`, inline: true },
          { name: t(language, "warn.fields.moderator"), value: `${interaction.user}`, inline: true },
          { name: t(language, "warn.fields.reason"), value: reason, inline: false },
          { name: t(language, "warn.fields.total"), value: `**${totalWarnings}**`, inline: true },
        )
        .setFooter({ text: t(language, "warn.responses.footer_id", { id: warning._id }) })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (sub === "check") {
      const user = getUserOption(interaction);
      const userWarnings = await warnings.get(interaction.guild.id, user.id);

      if (userWarnings.length === 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(t(language, "warn.responses.none_title"))
              .setColor(E.Colors.SUCCESS)
              .setDescription(t(language, "warn.responses.none_description", { user })),
          ],
          flags: 64,
        });
      }

      const warningsList = userWarnings.map((warning, index) => {
        const timestamp = Math.floor(new Date(warning.created_at).getTime() / 1000);
        return t(language, "warn.responses.list_entry", {
          index: index + 1,
          id: warning._id,
          reason: warning.reason,
          moderatorId: warning.moderator_id,
          timestamp,
        });
      }).join("\n\n");

      const embed = new EmbedBuilder()
        .setTitle(t(language, "warn.responses.list_title", { user: user.username }))
        .setColor(E.Colors.WARNING)
        .setDescription(t(language, "warn.responses.list_description", { count: userWarnings.length }))
        .addFields({ name: t(language, "warn.fields.list"), value: warningsList.substring(0, 1024) })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: t(language, "warn.responses.list_footer") })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (sub === "remove") {
      const warningId = interaction.options.getString("id");
      const deleted = await warnings.remove(warningId);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(deleted ? t(language, "warn.responses.remove_title") : t(language, "warn.responses.not_found_title"))
            .setColor(deleted ? E.Colors.SUCCESS : E.Colors.ERROR)
            .setDescription(
              deleted
                ? t(language, "warn.responses.remove_description", { id: warningId })
                : t(language, "warn.responses.not_found_description", { id: warningId }),
            ),
        ],
        flags: 64,
      });
    }
  },
};
