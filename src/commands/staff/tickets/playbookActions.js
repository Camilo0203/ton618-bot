"use strict";

const {
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { settings, tickets, ticketEvents } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { readGuildRecords } = require("../../../utils/dashboardBridge/guilds");
const {
  buildTicketInboxRows,
  updateRecommendationState,
} = require("../../../utils/dashboardBridge/tickets");
const {
  PLAYBOOK_DEFINITIONS,
  buildPlaybookDefinitionRows,
  buildTicketRecommendationRows,
  buildPlaybookRunRows,
} = require("../../../utils/dashboardBridge/playbooks");
const { buildTicketMacroRows } = require("../../../utils/dashboardBridge/config");

function isStaff(member, guildSettings) {
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  if (guildSettings?.support_role && member.roles.cache.has(guildSettings.support_role)) return true;
  if (guildSettings?.admin_role && member.roles.cache.has(guildSettings.admin_role)) return true;
  return false;
}

function isGuildAdmin(member, guildSettings) {
  return member.permissions.has(PermissionFlagsBits.Administrator)
    || Boolean(guildSettings?.admin_role && member.roles.cache.has(guildSettings.admin_role));
}

function getPlaybookChoices() {
  return PLAYBOOK_DEFINITIONS.map((playbook) => ({
    name: playbook.label.es,
    value: playbook.playbookId,
  }));
}

function resolvePlan(settingsRecord = {}) {
  const rawPlan = String(settingsRecord?.dashboard_general_settings?.opsPlan || "free")
    .trim()
    .toLowerCase();
  if (rawPlan === "enterprise") return "enterprise";
  if (rawPlan === "pro") return "pro";
  return "free";
}

async function buildTicketPlaybookContext(interaction) {
  const ticket = await tickets.get(interaction.channel.id);
  if (!ticket) {
    return { ticket: null, definitions: [], recommendations: [], runs: [], macros: [], records: null };
  }

  const records = await readGuildRecords(interaction.guild.id);
  const inboxRows = await buildTicketInboxRows(interaction.guild, records);
  const definitions = buildPlaybookDefinitionRows(interaction.guild.id, records);
  const { recommendationRows } = buildTicketRecommendationRows(interaction.guild.id, inboxRows, records);
  const runs = buildPlaybookRunRows(interaction.guild.id, recommendationRows);
  const macros = buildTicketMacroRows(interaction.guild.id, records);

  return {
    ticket,
    definitions,
    recommendations: recommendationRows.filter((row) => row.ticket_id === ticket.ticket_id),
    runs: runs.filter((row) => row.ticket_id === ticket.ticket_id),
    macros,
    records,
  };
}

function resolveRecommendation(recommendations, query) {
  if (!recommendations.length) return null;
  const rawQuery = String(query || "").trim().toLowerCase();
  if (!rawQuery) {
    return recommendations[0];
  }

  return recommendations.find((recommendation) => {
    const recommendationId = String(recommendation.recommendation_id || "").toLowerCase();
    const playbookId = String(recommendation.playbook_id || "").toLowerCase();
    return recommendationId === rawQuery || playbookId === rawQuery || recommendationId.endsWith(rawQuery);
  }) || null;
}

async function listPlaybooks(interaction, guildSettings) {
  if (!isStaff(interaction.member, guildSettings)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Solo el staff puede consultar playbooks operativos.")],
      flags: 64,
    });
  }

  const context = await buildTicketPlaybookContext(interaction);
  const plan = resolvePlan(context.records?.settingsRecord);

  if (!context.ticket) {
    const definitions = await readGuildRecords(interaction.guild.id)
      .then((records) => buildPlaybookDefinitionRows(interaction.guild.id, records));
    const enabledCount = definitions.filter((definition) => definition.is_enabled).length;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("Playbooks operativos del servidor")
      .setDescription("Puedes gestionarlos desde cualquier canal, pero para ver recomendaciones vivas debes ejecutar el comando dentro de un ticket.")
      .addFields(
        {
          name: "Plan actual",
          value: `\`${plan}\``,
          inline: true,
        },
        {
          name: "Activos",
          value: `\`${enabledCount}/${definitions.length}\``,
          inline: true,
        },
        {
          name: "Catalogo",
          value: definitions
            .map((definition) => `${definition.is_enabled ? "OK" : "LOCK"} \`${definition.playbook_id}\` - ${definition.label}`)
            .join("\n")
            .slice(0, 1024) || "Sin playbooks",
          inline: false,
        },
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: 64 });
  }

  const pendingRecommendations = context.recommendations.filter((row) => row.status === "pending");
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`Playbooks vivos · ticket #${context.ticket.ticket_id}`)
    .setDescription("Resumen operativo del ticket actual con recomendaciones listas para confirmar, descartar o aplicar.")
    .addFields(
      {
        name: "Plan actual",
        value: `\`${plan}\``,
        inline: true,
      },
      {
        name: "Playbooks activos",
        value: context.definitions
          .filter((definition) => definition.is_enabled)
          .map((definition) => `• ${definition.label}`)
          .join("\n")
          .slice(0, 1024) || "Sin playbooks activos",
        inline: false,
      },
      {
        name: "Recomendaciones pendientes",
        value: pendingRecommendations.length
          ? pendingRecommendations
            .map((recommendation) => `• \`${recommendation.recommendation_id}\` - ${recommendation.title}`)
            .join("\n")
            .slice(0, 1024)
          : "No hay recomendaciones pendientes para este ticket.",
        inline: false,
      },
    )
    .setFooter({ text: "Usa /ticket playbook confirm, dismiss o apply-macro para actuar." })
    .setTimestamp();

  return interaction.reply({ embeds: [embed], flags: 64 });
}

async function markRecommendation(interaction, guildSettings, status) {
  if (!isStaff(interaction.member, guildSettings)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Solo el staff puede operar recomendaciones.")],
      flags: 64,
    });
  }

  const recommendationQuery = interaction.options.getString("recomendacion");
  const context = await buildTicketPlaybookContext(interaction);

  if (!context.ticket) {
    return interaction.reply({
      embeds: [E.errorEmbed("Este comando debe ejecutarse dentro de un ticket.")],
      flags: 64,
    });
  }

  const recommendation = resolveRecommendation(
    context.recommendations.filter((row) => row.status === "pending"),
    recommendationQuery,
  );

  if (!recommendation) {
    return interaction.reply({
      embeds: [E.errorEmbed("No encontre una recomendacion pendiente con ese identificador.")],
      flags: 64,
    });
  }

  const run = context.runs.find((candidate) => candidate.playbook_id === recommendation.playbook_id) || null;
  await updateRecommendationState(
    interaction.guild.id,
    {
      recommendationId: recommendation.recommendation_id,
      runId: run?.run_id || null,
    },
    status,
    {
      source: "discord",
      actorId: interaction.user.id,
      actorLabel: interaction.user.tag || interaction.user.username,
      updatedByCommand: true,
    },
  );

  await ticketEvents.add({
    guild_id: interaction.guild.id,
    ticket_id: context.ticket.ticket_id,
    channel_id: context.ticket.channel_id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag || interaction.user.username,
    event_type: status === "dismissed" ? "discord_playbook_dismissed" : "discord_playbook_confirmed",
    visibility: "internal",
    title: status === "dismissed" ? "Recomendacion descartada desde Discord" : "Recomendacion aplicada desde Discord",
    description: `${interaction.user.tag || interaction.user.username} marco la recomendacion ${recommendation.recommendation_id} como ${status}.`,
    metadata: {
      source: "discord",
      recommendationId: recommendation.recommendation_id,
      runId: run?.run_id || null,
      status,
    },
  }).catch(() => {});

  return interaction.reply({
    embeds: [
      E.successEmbed(
        status === "dismissed"
          ? `Se descarto la recomendacion \`${recommendation.recommendation_id}\`.`
          : `Se confirmo la recomendacion \`${recommendation.recommendation_id}\`.`,
      ),
    ],
    flags: 64,
  });
}

async function applySuggestedMacro(interaction, guildSettings) {
  if (!isStaff(interaction.member, guildSettings)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Solo el staff puede aplicar macros sugeridas.")],
      flags: 64,
    });
  }

  const recommendationQuery = interaction.options.getString("recomendacion");
  const context = await buildTicketPlaybookContext(interaction);

  if (!context.ticket) {
    return interaction.reply({
      embeds: [E.errorEmbed("Este comando debe ejecutarse dentro de un ticket.")],
      flags: 64,
    });
  }

  const recommendation = resolveRecommendation(
    context.recommendations.filter((row) => row.status === "pending"),
    recommendationQuery,
  );

  if (!recommendation?.suggested_macro_id) {
    return interaction.reply({
      embeds: [E.errorEmbed("La recomendacion seleccionada no tiene una macro sugerida.")],
      flags: 64,
    });
  }

  const macro = context.macros.find((candidate) => candidate.macro_id === recommendation.suggested_macro_id);
  if (!macro) {
    return interaction.reply({
      embeds: [E.errorEmbed("No encontre la macro sugerida en el workspace actual.")],
      flags: 64,
    });
  }

  await interaction.channel.send({
    content: macro.visibility === "internal"
      ? `Nota operativa sugerida por playbook:\n${macro.content}`
      : macro.content,
  });

  const run = context.runs.find((candidate) => candidate.playbook_id === recommendation.playbook_id) || null;
  await updateRecommendationState(
    interaction.guild.id,
    {
      recommendationId: recommendation.recommendation_id,
      runId: run?.run_id || null,
    },
    "applied",
    {
      source: "discord",
      actorId: interaction.user.id,
      actorLabel: interaction.user.tag || interaction.user.username,
      appliedMacroId: macro.macro_id,
    },
  );

  await ticketEvents.add({
    guild_id: interaction.guild.id,
    ticket_id: context.ticket.ticket_id,
    channel_id: context.ticket.channel_id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag || interaction.user.username,
    event_type: "discord_playbook_macro_applied",
    visibility: "internal",
    title: "Macro sugerida aplicada",
    description: `${interaction.user.tag || interaction.user.username} publico la macro ${macro.label} desde una recomendacion operativa.`,
    metadata: {
      source: "discord",
      recommendationId: recommendation.recommendation_id,
      macroId: macro.macro_id,
    },
  }).catch(() => {});

  return interaction.reply({
    embeds: [E.successEmbed(`Macro \`${macro.label}\` publicada y recomendacion aplicada.`)],
    flags: 64,
  });
}

async function togglePlaybook(interaction, guildSettings, enabled) {
  if (!isGuildAdmin(interaction.member, guildSettings)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Solo admins del bot pueden activar o desactivar playbooks.")],
      flags: 64,
    });
  }

  const playbookId = interaction.options.getString("playbook", true);
  const current = await settings.get(interaction.guild.id);
  const disabled = new Set(Array.isArray(current?.disabled_playbooks) ? current.disabled_playbooks : []);
  const playbook = PLAYBOOK_DEFINITIONS.find((candidate) => candidate.playbookId === playbookId);
  const plan = resolvePlan(current);

  if (!playbook) {
    return interaction.reply({
      embeds: [E.errorEmbed("No encontre ese playbook en el catalogo operativo.")],
      flags: 64,
    });
  }

  if (enabled) {
    disabled.delete(playbookId);
  } else {
    disabled.add(playbookId);
  }

  await settings.update(interaction.guild.id, {
    disabled_playbooks: Array.from(disabled),
  });

  const lockedByPlan = (playbook.tier === "pro" && plan === "free")
    || (playbook.tier === "enterprise" && plan !== "enterprise");

  return interaction.reply({
    embeds: [
      E.successEmbed(
        enabled
          ? lockedByPlan
            ? `\`${playbook.label.es}\` quedo marcado como habilitado, pero seguira bloqueado hasta subir el plan actual (\`${plan}\`).`
            : `\`${playbook.label.es}\` quedo habilitado para este servidor.`
          : `\`${playbook.label.es}\` quedo deshabilitado para este servidor.`,
      ),
    ],
    flags: 64,
  });
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("playbook")
      .setDescription("Operar playbooks vivos desde Discord")
      .addSubcommand((sub) =>
        sub
          .setName("list")
          .setDescription("Ver playbooks activos y recomendaciones del ticket actual")
      )
      .addSubcommand((sub) =>
        sub
          .setName("confirm")
          .setDescription("Confirmar una recomendacion operativa")
          .addStringOption((option) =>
            option
              .setName("recomendacion")
              .setDescription("ID de recomendacion o playbook. Si lo omites usa la primera pendiente.")
              .setRequired(false),
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("dismiss")
          .setDescription("Descartar una recomendacion operativa")
          .addStringOption((option) =>
            option
              .setName("recomendacion")
              .setDescription("ID de recomendacion o playbook. Si lo omites usa la primera pendiente.")
              .setRequired(false),
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("apply-macro")
          .setDescription("Publicar la macro sugerida por un playbook")
          .addStringOption((option) =>
            option
              .setName("recomendacion")
              .setDescription("ID de recomendacion o playbook. Si lo omites usa la primera pendiente.")
              .setRequired(false),
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("enable")
          .setDescription("Habilitar un playbook para este servidor")
          .addStringOption((option) =>
            option
              .setName("playbook")
              .setDescription("Playbook a habilitar")
              .setRequired(true)
              .addChoices(...getPlaybookChoices()),
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("disable")
          .setDescription("Deshabilitar un playbook para este servidor")
          .addStringOption((option) =>
            option
              .setName("playbook")
              .setDescription("Playbook a deshabilitar")
              .setRequired(true)
              .addChoices(...getPlaybookChoices()),
          )
      )
  );
}

async function execute(interaction, subcommand) {
  const guildSettings = await settings.get(interaction.guild.id);

  switch (subcommand) {
    case "list":
      return listPlaybooks(interaction, guildSettings);
    case "confirm":
      return markRecommendation(interaction, guildSettings, "applied");
    case "dismiss":
      return markRecommendation(interaction, guildSettings, "dismissed");
    case "apply-macro":
      return applySuggestedMacro(interaction, guildSettings);
    case "enable":
      return togglePlaybook(interaction, guildSettings, true);
    case "disable":
      return togglePlaybook(interaction, guildSettings, false);
    default:
      return interaction.reply({
        embeds: [E.errorEmbed("Subcomando de playbook no reconocido.")],
        flags: 64,
      });
  }
}

module.exports = {
  register,
  execute,
};
