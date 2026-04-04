const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const { tickets } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { categories } = require("../../../../config");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const {
  withDescriptionLocalizations,
  localizedChoice,
} = require("../../../utils/slashLocalizations");
const { settings } = require("../../../utils/database");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDateInput(value, endOfDay = false) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!DATE_RE.test(raw)) return null;
  const parsed = new Date(`${raw}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function toIso(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString();
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function buildCsv(ticketsList) {
  const headers = [
    "ticket_id",
    "channel_id",
    "user_id",
    "status",
    "category_id",
    "category",
    "priority",
    "created_at",
    "first_staff_response",
    "claimed_by",
    "assigned_to",
    "closed_at",
    "closed_by",
    "sla_alerted_at",
    "sla_escalated_at",
    "rating",
  ];

  const rows = ticketsList.map((ticket) => ([
    ticket.ticket_id,
    ticket.channel_id,
    ticket.user_id,
    ticket.status,
    ticket.category_id,
    ticket.category,
    ticket.priority,
    toIso(ticket.created_at),
    toIso(ticket.first_staff_response),
    ticket.claimed_by,
    ticket.assigned_to,
    toIso(ticket.closed_at),
    ticket.closed_by,
    toIso(ticket.sla_alerted_at),
    toIso(ticket.sla_escalated_at),
    ticket.rating,
  ].map(csvEscape).join(",")));

  return [headers.join(","), ...rows].join("\n");
}

module.exports = {
  data: withDescriptionLocalizations(
    new SlashCommandBuilder()
      .setName("audit")
      .setDescription(t("en", "audit.slash.description"))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("tickets")
            .setDescription(t("en", "audit.slash.subcommands.tickets.description")),
          "audit.slash.subcommands.tickets.description"
        )
        .addStringOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("status")
              .setDescription(t("en", "audit.options.status")),
            "audit.options.status"
          )
            .setRequired(false)
            .addChoices(
              localizedChoice("all", "audit.all"),
              localizedChoice("open", "common.open"),
              localizedChoice("closed", "common.closed")
            )
        )
        .addStringOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("priority")
              .setDescription(t("en", "audit.options.priority")),
            "audit.options.priority"
          )
            .setRequired(false)
            .addChoices(
              localizedChoice("low", "ticket.priority.low"),
              localizedChoice("normal", "ticket.priority.normal"),
              localizedChoice("high", "ticket.priority.high"),
              localizedChoice("urgent", "ticket.priority.urgent")
            )
        )
        .addStringOption((option) => {
          withDescriptionLocalizations(
            option
              .setName("category")
              .setDescription(t("en", "audit.options.category")),
            "audit.options.category"
          )
            .setRequired(false);
          for (const category of categories.slice(0, 25)) {
            option.addChoices({ name: category.label.slice(0, 100), value: category.id });
          }
          return option;
        })
        .addStringOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("from")
              .setDescription(t("en", "audit.options.from")),
            "audit.options.from"
          )
            .setRequired(false)
        )
        .addStringOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("to")
              .setDescription(t("en", "audit.options.to")),
            "audit.options.to"
          )
            .setRequired(false)
        )
        .addIntegerOption((option) =>
          withDescriptionLocalizations(
            option
              .setName("limit")
              .setDescription(t("en", "audit.options.limit")),
            "audit.options.limit"
          )
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(500)
        )
    ),
    "audit.slash.description"
  ),

  async execute(interaction) {
    const guildSettings = await settings.get(interaction.guild.id);
    const language = resolveInteractionLanguage(interaction, guildSettings);
    const sub = interaction.options.getSubcommand();
    if (sub !== "tickets") {
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "audit.unsupported_subcommand"))],
        flags: 64,
      });
    }

    const status = interaction.options.getString("status") || interaction.options.getString("estado") || "all";
    const priority = interaction.options.getString("priority") || interaction.options.getString("prioridad") || null;
    const categoryId = interaction.options.getString("category") || interaction.options.getString("categoria") || null;
    const fromRaw = interaction.options.getString("from") || interaction.options.getString("desde");
    const toRaw = interaction.options.getString("to") || interaction.options.getString("hasta");
    const limit = interaction.options.getInteger("limit") || interaction.options.getInteger("limite") || 200;

    const createdFrom = parseDateInput(fromRaw, false);
    const createdTo = parseDateInput(toRaw, true);

    if (fromRaw && !createdFrom) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "audit.invalid_from"))],
        flags: 64,
      });
    }
    if (toRaw && !createdTo) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "audit.invalid_to"))],
        flags: 64,
      });
    }
    if (createdFrom && createdTo && createdFrom.getTime() > createdTo.getTime()) {
      return interaction.reply({
        embeds: [E.errorEmbed(t(language, "audit.invalid_range"))],
        flags: 64,
      });
    }

    await interaction.deferReply({ flags: 64 });

    const rows = await tickets.listForAudit(interaction.guild.id, {
      status,
      priority,
      categoryId,
      createdFrom,
      createdTo,
      limit,
    });

    if (!rows.length) {
      return interaction.editReply({
        embeds: [E.infoEmbed(t(language, "audit.title"), t(language, "audit.empty"))],
      });
    }

    const csv = buildCsv(rows);
    const filename = `audit-tickets-${interaction.guild.id}-${Date.now()}.csv`;
    const file = new AttachmentBuilder(Buffer.from(csv, "utf8"), { name: filename });

    const summary = [
      `${t(language, "audit.rows")}: **${rows.length}**`,
      `${t(language, "audit.status_label")}: **${status}**`,
      `${t(language, "audit.priority_label")}: **${priority || t(language, "audit.all")}**`,
      `${t(language, "audit.category_label")}: **${categoryId || t(language, "audit.all")}**`,
    ];
    if (fromRaw) summary.push(`${t(language, "audit.from_label")}: **${fromRaw}**`);
    if (toRaw) summary.push(`${t(language, "audit.to_label")}: **${toRaw}**`);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle(t(language, "audit.export_title"))
          .setDescription(summary.join("\n"))
          .setTimestamp(),
      ],
      files: [file],
    });
  },
};
