const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const warnCommand = require("./warn");
const { staffStatus, settings, tickets } = require("../../../utils/database");
const { updateDashboard } = require("../../../handlers/dashboardHandler");
const { isStaff } = require("./_staffAccess");
const E = require("../../../utils/embeds");
const { createInteractionProxy } = require("../../../utils/interactionProxy");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { withDescriptionLocalizations, localeMapFromKey } = require("../../../utils/slashLocalizations");

function requireModerationPerm(interaction, language) {
  if (interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) return true;
  interaction.reply({
    embeds: [E.errorEmbed(t(language, "staff.moderation_required"))],
    flags: 64,
  }).catch((err) => { console.error("[staff] suppressed error:", err?.message || err); });
  return false;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription(t("en", "staff.slash.description"))
    .setDescriptionLocalizations(localeMapFromKey("staff.slash.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((s) =>
      withDescriptionLocalizations(
        s
          .setName("away-on")
          .setDescription(t("en", "staff.slash.subcommands.away_on.description")),
        "staff.slash.subcommands.away_on.description"
      )
        .addStringOption((o) =>
          withDescriptionLocalizations(
            o.setName("reason").setDescription(t("en", "staff.slash.options.reason")),
            "staff.slash.options.reason"
          ).setRequired(false)
        )
    )
    .addSubcommand((s) =>
      withDescriptionLocalizations(
        s.setName("away-off").setDescription(t("en", "staff.slash.subcommands.away_off.description")),
        "staff.slash.subcommands.away_off.description"
      )
    )
    .addSubcommand((s) =>
      withDescriptionLocalizations(
        s.setName("my-tickets").setDescription(t("en", "staff.slash.subcommands.my_tickets.description")),
        "staff.slash.subcommands.my_tickets.description"
      )
    )
    .addSubcommand((s) =>
      withDescriptionLocalizations(
        s
          .setName("warn-add")
          .setDescription(t("en", "staff.slash.subcommands.warn_add.description")),
        "staff.slash.subcommands.warn_add.description"
      )
        .addUserOption((o) =>
          withDescriptionLocalizations(
            o.setName("user").setDescription(t("en", "staff.slash.options.user")),
            "staff.slash.options.user"
          ).setRequired(true)
        )
        .addStringOption((o) =>
          withDescriptionLocalizations(
            o.setName("reason").setDescription(t("en", "staff.slash.options.warn_reason")),
            "staff.slash.options.warn_reason"
          ).setRequired(true)
        )
    )
    .addSubcommand((s) =>
      withDescriptionLocalizations(
        s
          .setName("warn-check")
          .setDescription(t("en", "staff.slash.subcommands.warn_check.description")),
        "staff.slash.subcommands.warn_check.description"
      )
        .addUserOption((o) =>
          withDescriptionLocalizations(
            o.setName("user").setDescription(t("en", "staff.slash.options.user")),
            "staff.slash.options.user"
          ).setRequired(true)
        )
    )
    .addSubcommand((s) =>
      withDescriptionLocalizations(
        s
          .setName("warn-remove")
          .setDescription(t("en", "staff.slash.subcommands.warn_remove.description")),
        "staff.slash.subcommands.warn_remove.description"
      )
        .addStringOption((o) =>
          withDescriptionLocalizations(
            o.setName("id").setDescription(t("en", "staff.slash.options.warning_id")),
            "staff.slash.options.warning_id"
          ).setRequired(true)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildSettings = await settings.get(interaction.guild.id);
    const language = resolveInteractionLanguage(interaction, guildSettings);

    if (sub === "away-on") {
      if (!isStaff(interaction.member, guildSettings)) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "staff.only_staff"))],
          flags: 64,
        });
      }

      const reason = interaction.options.getString("reason") || interaction.options.getString("razon") || null;
      await staffStatus.setAway(interaction.guild.id, interaction.user.id, reason);
      await updateDashboard(interaction.guild);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.WARNING)
            .setTitle(t(language, "staff.away_on_title"))
            .setDescription(t(language, "staff.away_on_description", {
              reasonText: reason ? `\n**${t(language, "common.labels.reason")}:** ${reason}` : "",
            }))
            .setFooter({ text: t(language, "staff.away_on_footer") })
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "away-off") {
      if (!isStaff(interaction.member, guildSettings)) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "staff.only_staff"))],
          flags: 64,
        });
      }

      await staffStatus.setOnline(interaction.guild.id, interaction.user.id);
      await updateDashboard(interaction.guild);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setDescription(t(language, "staff.away_off"))
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "my-tickets" || sub === "mytickets") {
      if (!isStaff(interaction.member, guildSettings)) {
        return interaction.reply({
          embeds: [E.errorEmbed(t(language, "staff.only_staff"))],
          flags: 64,
        });
      }

      const open = await tickets.getOpenByStaff(interaction.guild.id, interaction.user.id);
      if (!open.length) {
        return interaction.reply({
          embeds: [
            E.infoEmbed(
              t(language, "staff.my_tickets_title", { count: 0 }),
              t(language, "staff.my_tickets_empty")
            ),
          ],
          flags: 64,
        });
      }

      const list = open
        .map((ticket) => {
          const ownership = ticket.claimed_by === interaction.user.id
            ? t(language, "staff.ownership_claimed")
            : (ticket.assigned_to === interaction.user.id
              ? t(language, "staff.ownership_assigned")
              : t(language, "staff.ownership_watching"));
          return `- **#${ticket.ticket_id}** <#${ticket.channel_id}> - ${ticket.category} - ${E.priorityLabel(ticket.priority, language)} - ${ownership}`;
        })
        .join("\n");

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(t(language, "staff.my_tickets_title", { count: open.length }))
            .setColor(E.Colors.PRIMARY)
            .setDescription(list)
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (sub === "warn-add") {
      if (!requireModerationPerm(interaction, language)) return;
      const proxied = createInteractionProxy(interaction, {
        subcommand: "add",
        users: { usuario: interaction.options.getUser("user") || interaction.options.getUser("usuario") },
        strings: { razon: interaction.options.getString("reason") || interaction.options.getString("razon") },
      });
      return warnCommand.execute(proxied);
    }

    if (sub === "warn-check") {
      if (!requireModerationPerm(interaction, language)) return;
      const proxied = createInteractionProxy(interaction, {
        subcommand: "check",
        users: { usuario: interaction.options.getUser("user") || interaction.options.getUser("usuario") },
      });
      return warnCommand.execute(proxied);
    }

    if (sub === "warn-remove") {
      if (!requireModerationPerm(interaction, language)) return;
      const proxied = createInteractionProxy(interaction, {
        subcommand: "remove",
        strings: { id: interaction.options.getString("id") },
      });
      return warnCommand.execute(proxied);
    }
  },
};
