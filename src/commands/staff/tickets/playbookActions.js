"use strict";

const {
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { tickets, ticketEvents, settings } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { t, resolveGuildLanguage } = require("../../../utils/i18n");
const { withDescriptionLocalizations } = require("../../../utils/slashLocalizations");
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
const {
  resolveCommercialState,
  hasRequiredPlan,
  buildProRequiredEmbed,
  buildProUpgradeButton,
} = require("../../../utils/commercial");

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
    name: playbook.label.en || playbook.label.es,
    value: playbook.playbookId,
  }));
}

function resolvePlan(settingsRecord = {}) {
  return resolveCommercialState(settingsRecord).effectivePlan;
}

function getRecommendationOption(interaction) {
  return interaction.options.getString("recommendation")
    || interaction.options.getString("recomendacion");
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
    const lang = resolveGuildLanguage(guildSettings);
    return interaction.reply({
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.staff_only"))],
      flags: 64,
    });
  }

  const context = await buildTicketPlaybookContext(interaction);
  const plan = resolvePlan(context.records?.settingsRecord);

  if (!context.ticket) {
    const definitions = await readGuildRecords(interaction.guild.id)
      .then((records) => buildPlaybookDefinitionRows(interaction.guild.id, records));
    const enabledCount = definitions.filter((definition) => definition.is_enabled).length;

    const lang = resolveGuildLanguage(guildSettings);
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t(lang, "ticket.playbook.list_title"))
      .setDescription(t(lang, "ticket.playbook.list_description_generic"))
      .addFields(
        {
          name: t(lang, "ticket.playbook.field_current_plan"),
          value: `\`${plan}\``,
          inline: true,
        },
        {
          name: t(lang, "ticket.playbook.field_enabled_count"),
          value: `\`${enabledCount}/${definitions.length}\``,
          inline: true,
        },
        {
          name: t(lang, "ticket.playbook.field_catalog"),
          value: definitions
            .map((definition) => `${definition.is_enabled ? "✅" : "❌"} \`${definition.playbook_id}\` - ${definition.label}`)
            .join("\n")
            .slice(0, 1024) || t(lang, "ticket.playbook.catalog_empty"),
          inline: false,
        },
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: 64 });
  }

  const lang = resolveGuildLanguage(guildSettings);
  const pendingRecommendations = context.recommendations.filter((row) => row.status === "pending");
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(t(lang, "ticket.playbook.live_title", { id: context.ticket.ticket_id }))
    .setDescription(t(lang, "ticket.playbook.live_description"))
    .addFields(
      {
        name: t(lang, "ticket.playbook.field_current_plan"),
        value: `\`${plan}\``,
        inline: true,
      },
      {
        name: t(lang, "ticket.playbook.field_enabled_playbooks"),
        value: context.definitions
          .filter((definition) => definition.is_enabled)
          .map((definition) => `- ${definition.label}`)
          .join("\n")
          .slice(0, 1024) || t(lang, "ticket.playbook.playbooks_empty"),
        inline: false,
      },
      {
        name: t(lang, "ticket.playbook.field_pending_recommendations"),
        value: pendingRecommendations.length
          ? pendingRecommendations
            .map((recommendation) => `- \`${recommendation.recommendation_id}\` - ${recommendation.title}`)
            .join("\n")
            .slice(0, 1024)
          : t(lang, "ticket.playbook.recommendations_empty"),
        inline: false,
      },
    )
    .setFooter({ text: t(lang, "ticket.playbook.live_footer") })
    .setTimestamp();

  return interaction.reply({ embeds: [embed], flags: 64 });
}

async function markRecommendation(interaction, guildSettings, status) {
  const lang = resolveGuildLanguage(guildSettings);
  if (!isStaff(interaction.member, guildSettings)) {
    return interaction.reply({
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.recommendation_staff_only"))],
      flags: 64,
    });
  }

  const recommendationQuery = getRecommendationOption(interaction);
  const context = await buildTicketPlaybookContext(interaction);

  if (!context.ticket) {
    return interaction.reply({
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.ticket_only"))],
      flags: 64,
    });
  }

  const recommendation = resolveRecommendation(
    context.recommendations.filter((row) => row.status === "pending"),
    recommendationQuery,
  );

  if (!recommendation) {
    return interaction.reply({
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.not_found"))],
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
    title: status === "dismissed" ? t(lang, "ticket.playbook.event_dismissed_title") : t(lang, "ticket.playbook.event_confirmed_title"),
    description: t(lang, "ticket.playbook.event_description", {
      user: interaction.user.tag || interaction.user.username,
      id: recommendation.recommendation_id,
      status: status,
    }),
    metadata: {
      source: "discord",
      recommendationId: recommendation.recommendation_id,
      runId: run?.run_id || null,
      status,
    },
  }).catch((err) => { console.error("[playbookActions] suppressed error:", err?.message || err); });

  return interaction.reply({
    embeds: [
      E.successEmbed(
        status === "dismissed"
          ? t(lang, "ticket.playbook.success_dismissed", { id: recommendation.recommendation_id })
          : t(lang, "ticket.playbook.success_confirmed", { id: recommendation.recommendation_id })
      ),
    ],
    flags: 64,
  });
}

async function applySuggestedMacro(interaction, guildSettings) {
  const lang = resolveGuildLanguage(guildSettings);
  if (!isStaff(interaction.member, guildSettings)) {
    return interaction.reply({
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.macro_staff_only"))],
      flags: 64,
    });
  }

  const recommendationQuery = getRecommendationOption(interaction);
  const context = await buildTicketPlaybookContext(interaction);

  if (!context.ticket) {
    return interaction.reply({
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.ticket_only"))],
      flags: 64,
    });
  }

  const recommendation = resolveRecommendation(
    context.recommendations.filter((row) => row.status === "pending"),
    recommendationQuery,
  );

  if (!recommendation?.suggested_macro_id) {
    return interaction.reply({
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.no_macro"))],
      flags: 64,
    });
  }

  const macro = context.macros.find((candidate) => candidate.macro_id === recommendation.suggested_macro_id);
  if (!macro) {
    return interaction.reply({
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.macro_missing"))],
      flags: 64,
    });
  }

  await interaction.channel.send({
    content: macro.visibility === "internal"
      ? t(lang, "ticket.playbook.macro_internal_note", { content: macro.content })
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
    title: t(lang, "ticket.playbook.event_applied_title"),
    description: t(lang, "ticket.playbook.event_macro_description", {
      user: interaction.user.tag || interaction.user.username,
      label: macro.label,
    }),
    metadata: {
      source: "discord",
      recommendationId: recommendation.recommendation_id,
      macroId: macro.macro_id,
    },
  }).catch((err) => { console.error("[playbookActions] suppressed error:", err?.message || err); });

  return interaction.reply({
    embeds: [E.successEmbed(t(lang, "ticket.playbook.success_macro_applied", { label: macro.label }))],
    flags: 64,
  });
}

async function togglePlaybook(interaction, guildSettings, enabled) {
  const lang = resolveGuildLanguage(guildSettings);
  if (!isGuildAdmin(interaction.member, guildSettings)) {
    return interaction.reply({
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.admin_only"))],
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
      embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.playbook_not_found"))],
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

  const lockedByPlan = playbook.tier === "pro" && plan === "free";
  const label = playbook.label.en || playbook.label.es;

  return interaction.reply({
    embeds: [
      E.successEmbed(
        enabled
          ? lockedByPlan
            ? t(lang, "ticket.playbook.success_enabled_locked", { label, plan })
            : t(lang, "ticket.playbook.success_enabled", { label })
          : t(lang, "ticket.playbook.success_disabled", { label })
      ),
    ],
    flags: 64,
  });
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    withDescriptionLocalizations(
      group
        .setName("playbook")
        .setDescription(t("en", "ticket.playbook.group_description")),
      "ticket.playbook.group_description"
    )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("list")
            .setDescription(t("en", "ticket.playbook.list_description")),
          "ticket.playbook.list_description"
        ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("confirm")
            .setDescription(t("en", "ticket.playbook.confirm_description")),
          "ticket.playbook.confirm_description"
        )
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("recommendation")
                .setDescription(t("en", "ticket.playbook.option_recommendation")),
              "ticket.playbook.option_recommendation"
            )
              .setRequired(false),
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("dismiss")
            .setDescription(t("en", "ticket.playbook.dismiss_description")),
          "ticket.playbook.dismiss_description"
        )
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("recommendation")
                .setDescription(t("en", "ticket.playbook.option_recommendation")),
              "ticket.playbook.option_recommendation"
            )
              .setRequired(false),
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("apply-macro")
            .setDescription(t("en", "ticket.playbook.apply_macro_description")),
          "ticket.playbook.apply_macro_description"
        )
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("recommendation")
                .setDescription(t("en", "ticket.playbook.option_recommendation")),
              "ticket.playbook.option_recommendation"
            )
              .setRequired(false),
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("enable")
            .setDescription(t("en", "ticket.playbook.enable_description")),
          "ticket.playbook.enable_description"
        )
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("playbook")
                .setDescription(t("en", "ticket.playbook.option_playbook")),
              "ticket.playbook.option_playbook"
            )
              .setRequired(true)
              .addChoices(...getPlaybookChoices()),
          ),
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("disable")
            .setDescription(t("en", "ticket.playbook.disable_description")),
          "ticket.playbook.disable_description"
        )
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("playbook")
                .setDescription(t("en", "ticket.playbook.option_playbook")),
              "ticket.playbook.option_playbook"
            )
              .setRequired(true)
              .addChoices(...getPlaybookChoices()),
          ),
      ),
  );
}

async function execute(interaction, subcommand) {
  const guildSettings = await settings.get(interaction.guild.id);
  if (!hasRequiredPlan(guildSettings, "pro")) {
    const language = resolveGuildLanguage(guildSettings);
    const upgradeRow = buildProUpgradeButton(language);
    return interaction.reply({
      embeds: [buildProRequiredEmbed(guildSettings, "/ticket playbook", language)],
      components: upgradeRow ? [upgradeRow] : [],
      flags: 64,
    });
  }

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
      const lang = resolveGuildLanguage(guildSettings);
      return interaction.reply({
        embeds: [E.errorEmbed(t(lang, "ticket.playbook.errors.unknown_subcommand"))],
        flags: 64,
      });
  }
}

module.exports = {
  register,
  execute,
};
