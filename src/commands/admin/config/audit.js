const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const { tickets } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { categories } = require("../../../../config");

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
  data: new SlashCommandBuilder()
    .setName("audit")
    .setDescription("Auditorias y exportaciones administrativas")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("tickets")
        .setDescription("Exportar tickets a CSV con filtros")
        .addStringOption((option) =>
          option
            .setName("estado")
            .setDescription("Filtrar por estado")
            .setRequired(false)
            .addChoices(
              { name: "Todos", value: "all" },
              { name: "Abiertos", value: "open" },
              { name: "Cerrados", value: "closed" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("prioridad")
            .setDescription("Filtrar por prioridad")
            .setRequired(false)
            .addChoices(
              { name: "Baja", value: "low" },
              { name: "Normal", value: "normal" },
              { name: "Alta", value: "high" },
              { name: "Urgente", value: "urgent" }
            )
        )
        .addStringOption((option) => {
          option
            .setName("categoria")
            .setDescription("Filtrar por categoria")
            .setRequired(false);
          for (const category of categories.slice(0, 25)) {
            option.addChoices({ name: category.label.slice(0, 100), value: category.id });
          }
          return option;
        })
        .addStringOption((option) =>
          option
            .setName("desde")
            .setDescription("Fecha inicial YYYY-MM-DD")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("hasta")
            .setDescription("Fecha final YYYY-MM-DD")
            .setRequired(false)
        )
        .addIntegerOption((option) =>
          option
            .setName("limite")
            .setDescription("Maximo de filas (1-500)")
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(500)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub !== "tickets") {
      return interaction.reply({
        embeds: [E.errorEmbed("Subcomando no soportado.")],
        flags: 64,
      });
    }

    const status = interaction.options.getString("estado") || "all";
    const priority = interaction.options.getString("prioridad") || null;
    const categoryId = interaction.options.getString("categoria") || null;
    const fromRaw = interaction.options.getString("desde");
    const toRaw = interaction.options.getString("hasta");
    const limit = interaction.options.getInteger("limite") || 200;

    const createdFrom = parseDateInput(fromRaw, false);
    const createdTo = parseDateInput(toRaw, true);

    if (fromRaw && !createdFrom) {
      return interaction.reply({
        embeds: [E.errorEmbed("`desde` debe usar formato YYYY-MM-DD.")],
        flags: 64,
      });
    }
    if (toRaw && !createdTo) {
      return interaction.reply({
        embeds: [E.errorEmbed("`hasta` debe usar formato YYYY-MM-DD.")],
        flags: 64,
      });
    }
    if (createdFrom && createdTo && createdFrom.getTime() > createdTo.getTime()) {
      return interaction.reply({
        embeds: [E.errorEmbed("`desde` no puede ser mayor que `hasta`.")],
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
        embeds: [E.infoEmbed("Audit tickets", "No hay tickets que coincidan con los filtros.")],
      });
    }

    const csv = buildCsv(rows);
    const filename = `audit-tickets-${interaction.guild.id}-${Date.now()}.csv`;
    const file = new AttachmentBuilder(Buffer.from(csv, "utf8"), { name: filename });

    const summary = [
      `Registros: **${rows.length}**`,
      `Estado: **${status}**`,
      `Prioridad: **${priority || "all"}**`,
      `Categoria: **${categoryId || "all"}**`,
    ];
    if (fromRaw) summary.push(`Desde: **${fromRaw}**`);
    if (toRaw) summary.push(`Hasta: **${toRaw}**`);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("Audit de tickets")
          .setDescription(summary.join("\n"))
          .setTimestamp(),
      ],
      files: [file],
    });
  },
};
