"use strict";

const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const {
  settings,
  verifSettings,
  verifCodes,
  verifLogs,
  verifMemberStates,
} = require("../../../utils/database");
const {
  resolveCommercialState,
  buildProRequiredEmbed,
} = require("../../../utils/commercial");
const E = require("../../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../../utils/i18n");
const { localeMapFromKey, localizedChoice } = require("../../../utils/slashLocalizations");
const {
  VERIFICATION_LIMITS,
  buildModeLabel,
  normalizeVerificationAnswer,
  inspectVerificationConfiguration,
  sendVerificationPanel,
  applyVerification,
  revokeVerification,
  resolveVerifiedRoleId,
} = require("../../../utils/verificationService");

const SUBCOMMAND_ALIASES = {
  activar: "enabled",
  modo: "mode",
  pregunta: "question",
  mensaje: "message",
  autokick: "auto-kick",
  antiraid: "anti-raid",
  forzar: "force",
  desverificar: "unverify",
};

const MODE_CHOICES = [
  localizedChoice("button", "verify.slash.choices.mode.button"),
  localizedChoice("code", "verify.slash.choices.mode.code"),
  localizedChoice("question", "verify.slash.choices.mode.question"),
];

const ANTI_RAID_ACTIONS = [
  localizedChoice("pause", "verify.slash.choices.anti_raid_action.pause"),
  localizedChoice("kick", "verify.slash.choices.anti_raid_action.kick"),
];

const VERIFICATION_PLAN_LIMITS = {
  free: {
    maxQuestionPool: 5,
    maxAccountAgeDays: 7,
    riskEscalation: false,
    captchaEmoji: false,
  },
  pro: {
    maxQuestionPool: 20,
    maxAccountAgeDays: 365,
    riskEscalation: true,
    captchaEmoji: true,
  },
};

function normalizeSubcommand(subcommand) {
  return SUBCOMMAND_ALIASES[subcommand] || subcommand;
}

function getBooleanOption(interaction, primary, legacy) {
  const value = interaction.options.getBoolean(primary);
  if (value !== null && value !== undefined) return value;
  if (legacy) return interaction.options.getBoolean(legacy);
  return null;
}

function getIntegerOption(interaction, primary, legacy) {
  const value = interaction.options.getInteger(primary);
  if (value !== null && value !== undefined) return value;
  if (legacy) return interaction.options.getInteger(legacy);
  return null;
}

function getStringOption(interaction, primary, legacy) {
  const value = interaction.options.getString(primary);
  if (value !== null && value !== undefined) return value;
  if (legacy) return interaction.options.getString(legacy);
  return null;
}

function getChannelOption(interaction, primary, legacy) {
  const value = interaction.options.getChannel(primary);
  if (value) return value;
  if (legacy) return interaction.options.getChannel(legacy);
  return null;
}

function getRoleOption(interaction, primary, legacy) {
  const value = interaction.options.getRole(primary);
  if (value) return value;
  if (legacy) return interaction.options.getRole(legacy);
  return null;
}

function getUserOption(interaction, primary, legacy) {
  const value = interaction.options.getUser(primary);
  if (value) return value;
  if (legacy) return interaction.options.getUser(legacy);
  return null;
}

function buildIssueText(errors = [], warnings = [], language = "en") {
  const lines = [];
  if (errors.length > 0) lines.push(...errors.map((issue) => `- ${issue}`));
  if (warnings.length > 0) lines.push(...warnings.map((issue) => `- ${issue}`));

  return lines.length > 0
    ? lines.join("\n").slice(0, 1024)
    : t(language, "verify.info.no_issues");
}

function buildRecentActivityLabel(entry = {}, language = "en") {
  const normalized = String(entry.event || entry.status || "event").trim().toLowerCase();
  const translated = t(language, `verify.activity.${normalized}`);

  if (translated !== `verify.activity.${normalized}`) {
    return translated;
  }

  return normalized
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildRecentActivityText(entries = [], language = "en") {
  if (!Array.isArray(entries) || entries.length === 0) {
    return t(language, "common.value.no_recent_activity");
  }

  return entries
    .map((entry) => {
      const ts = entry.created_at
        ? `<t:${Math.floor(new Date(entry.created_at).getTime() / 1000)}:R>`
        : t(language, "common.value.unknown_time");
      const label = buildRecentActivityLabel(entry, language);
      const userText = entry.user_id
        ? `<@${entry.user_id}>`
        : t(language, "common.value.system");
      return `- **${label}** | ${userText} | ${ts}`;
    })
    .join("\n")
    .slice(0, 1024);
}

function buildVerificationInfoEmbed(interaction, settingsRecord, guildSettings, language = "en") {
  const inspected = inspectVerificationConfiguration(
    interaction.guild,
    settingsRecord,
    guildSettings,
    { language }
  );
  const autoKickText = settingsRecord?.kick_unverified_hours > 0
    ? `${settingsRecord.kick_unverified_hours}h`
    : t(language, "common.state.disabled");

  const embed = new EmbedBuilder()
    .setTitle(t(language, "verify.info.title"))
    .setColor(inspected.errors.length > 0 ? E.Colors.ERROR : E.Colors.SUCCESS)
    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    .addFields(
      {
        name: t(language, "common.labels.state"),
        value: settingsRecord?.enabled
          ? t(language, "common.state.enabled")
          : t(language, "common.state.disabled"),
        inline: true,
      },
      {
        name: t(language, "common.labels.mode"),
        value: buildModeLabel(settingsRecord?.mode, language),
        inline: true,
      },
      {
        name: t(language, "common.labels.channel"),
        value: settingsRecord?.channel
          ? `<#${settingsRecord.channel}>`
          : t(language, "common.value.not_configured"),
        inline: true,
      },
      {
        name: t(language, "common.labels.verified_role"),
        value: resolveVerifiedRoleId(settingsRecord, guildSettings)
          ? `<@&${resolveVerifiedRoleId(settingsRecord, guildSettings)}>`
          : t(language, "common.value.not_configured"),
        inline: true,
      },
      {
        name: t(language, "common.labels.unverified_role"),
        value: settingsRecord?.unverified_role
          ? `<@&${settingsRecord.unverified_role}>`
          : t(language, "common.value.not_configured"),
        inline: true,
      },
      {
        name: t(language, "common.labels.panel_message"),
        value: settingsRecord?.panel_message_id
          ? `\`${settingsRecord.panel_message_id}\``
          : t(language, "common.value.not_published"),
        inline: true,
      },
      {
        name: t(language, "common.labels.log_channel"),
        value: settingsRecord?.log_channel
          ? `<#${settingsRecord.log_channel}>`
          : t(language, "common.value.not_configured"),
        inline: true,
      },
      {
        name: t(language, "verify.command.confirmation_dm"),
        value: settingsRecord?.dm_on_verify
          ? t(language, "common.state.enabled")
          : t(language, "common.state.disabled"),
        inline: true,
      },
      {
        name: t(language, "common.labels.auto_kick"),
        value: autoKickText,
        inline: true,
      },
      {
        name: t(language, "common.labels.anti_raid"),
        value: settingsRecord?.antiraid_enabled
          ? t(language, "common.state.enabled")
          : t(language, "common.state.disabled"),
        inline: true,
      },
      {
        name: t(language, "verify.command.operational_health"),
        value:
          inspected.errors.length > 0
            ? t(language, "common.state.needs_attention")
            : inspected.warnings.length > 0
              ? t(language, "common.state.operational_with_warnings")
              : t(language, "common.state.ready"),
        inline: true,
      },
      {
        name: t(language, "common.labels.issues"),
        value: buildIssueText(inspected.errors, inspected.warnings, language),
        inline: false,
      }
    )
    .setFooter({
      text: t(language, "verify.info.protection_footer", {
        failures: VERIFICATION_LIMITS.maxFailuresBeforeCooldown,
        minutes: VERIFICATION_LIMITS.failureCooldownMinutes,
      }),
    })
    .setTimestamp();

  if (settingsRecord?.antiraid_enabled) {
    embed.addFields(
      {
        name: t(language, "verify.command.raid_threshold"),
        value: `${settingsRecord.antiraid_joins} joins / ${settingsRecord.antiraid_seconds}s`,
        inline: true,
      },
      {
        name: t(language, "verify.command.raid_action"),
        value: settingsRecord.antiraid_action === "kick"
          ? t(language, "verify.info.raid_action_kick")
          : t(language, "verify.info.raid_action_pause"),
        inline: true,
      }
    );
  }

  if (settingsRecord?.mode === "question") {
    embed.addFields(
      {
        name: t(language, "common.labels.question"),
        value: settingsRecord.question || t(language, "common.value.not_configured"),
        inline: false,
      },
      {
        name: t(language, "common.labels.expected_answer"),
        value: `\`${settingsRecord.question_answer || "?"}\``,
        inline: true,
      }
    );
  }

  return embed;
}

async function sendVerificationLogMessage(guild, verificationSettings, embed) {
  if (!verificationSettings?.log_channel) return false;
  const channel = guild.channels.cache.get(verificationSettings.log_channel);
  if (!channel) return false;
  await channel.send({ embeds: [embed] }).catch(() => {});
  return true;
}

async function publishPanelOrReturnError(interaction, verificationSettings, guildSettings, source, language = "en") {
  const result = await sendVerificationPanel(interaction.guild, verificationSettings, {
    guildSettings,
    actorId: interaction.user.id,
    source,
    language,
  });

  if (!result.ok) {
    return {
      ok: false,
      payload: {
        embeds: [
          E.errorEmbed(
            t(language, "verify.command.panel_saved_but_not_published", {
              issues: buildIssueText(result.errors, result.warnings, language),
            })
          ),
        ],
        flags: 64,
      },
    };
  }

  const warningText = result.warnings.length > 0
    ? `\n\n${t(language, "common.labels.warnings")}:\n${buildIssueText([], result.warnings, language)}`
    : "";

  return {
    ok: true,
    detail: `${t(
      language,
      result.refreshed ? "verify.command.panel_refreshed" : "verify.command.panel_published"
    )}${warningText}`,
  };
}

module.exports = {
  meta: { scope: "admin" },
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription(t("en", "verify.slash.description"))
    .setDescriptionLocalizations(localeMapFromKey("verify.slash.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription(t("en", "verify.slash.subcommands.setup.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.setup.description"))
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(t("en", "verify.slash.options.channel"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.channel"))
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("verified_role")
            .setDescription(t("en", "verify.slash.options.verified_role"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.verified_role"))
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("mode")
            .setDescription(t("en", "verify.slash.options.mode"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.mode"))
            .setRequired(true)
            .addChoices(...MODE_CHOICES)
        )
        .addRoleOption((option) =>
          option
            .setName("unverified_role")
            .setDescription(t("en", "verify.slash.options.unverified_role"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.unverified_role"))
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("panel")
        .setDescription(t("en", "verify.slash.subcommands.panel.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.panel.description"))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enabled")
        .setDescription(t("en", "verify.slash.subcommands.enabled.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.enabled.description"))
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription(t("en", "verify.slash.options.enabled"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.enabled"))
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mode")
        .setDescription(t("en", "verify.slash.subcommands.mode.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.mode.description"))
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription(t("en", "verify.slash.options.type"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.type"))
            .setRequired(true)
            .addChoices(...MODE_CHOICES)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("question")
        .setDescription(t("en", "verify.slash.subcommands.question.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.question.description"))
        .addStringOption((option) =>
          option
            .setName("prompt")
            .setDescription(t("en", "verify.slash.options.prompt"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.prompt"))
            .setRequired(true)
            .setMaxLength(200)
        )
        .addStringOption((option) =>
          option
            .setName("answer")
            .setDescription(t("en", "verify.slash.options.answer"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.answer"))
            .setRequired(true)
            .setMaxLength(100)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("message")
        .setDescription(t("en", "verify.slash.subcommands.message.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.message.description"))
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription(t("en", "verify.slash.options.title"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.title"))
            .setRequired(false)
            .setMaxLength(100)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription(t("en", "verify.slash.options.description"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.description"))
            .setRequired(false)
            .setMaxLength(1000)
        )
        .addStringOption((option) =>
          option
            .setName("color")
            .setDescription(t("en", "verify.slash.options.color"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.color"))
            .setRequired(false)
            .setMaxLength(6)
        )
        .addStringOption((option) =>
          option
            .setName("image")
            .setDescription(t("en", "verify.slash.options.image"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.image"))
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("dm")
        .setDescription(t("en", "verify.slash.subcommands.dm.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.dm.description"))
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription(t("en", "verify.slash.options.dm_enabled"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.dm_enabled"))
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("auto-kick")
        .setDescription(t("en", "verify.slash.subcommands.auto_kick.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.auto_kick.description"))
        .addIntegerOption((option) =>
          option
            .setName("hours")
            .setDescription(t("en", "verify.slash.options.hours"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.hours"))
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(168)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("anti-raid")
        .setDescription(t("en", "verify.slash.subcommands.anti_raid.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.anti_raid.description"))
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription(t("en", "verify.slash.options.anti_raid_enabled"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.anti_raid_enabled"))
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("joins")
            .setDescription(t("en", "verify.slash.options.joins"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.joins"))
            .setRequired(false)
            .setMinValue(3)
            .setMaxValue(50)
        )
        .addIntegerOption((option) =>
          option
            .setName("seconds")
            .setDescription(t("en", "verify.slash.options.seconds"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.seconds"))
            .setRequired(false)
            .setMinValue(5)
            .setMaxValue(60)
        )
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription(t("en", "verify.slash.options.action"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.action"))
            .setRequired(false)
            .addChoices(...ANTI_RAID_ACTIONS)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("logs")
        .setDescription(t("en", "verify.slash.subcommands.logs.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.logs.description"))
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(t("en", "verify.slash.options.log_channel"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.log_channel"))
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("force")
        .setDescription(t("en", "verify.slash.subcommands.force.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.force.description"))
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription(t("en", "verify.slash.options.user_verify"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.user_verify"))
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unverify")
        .setDescription(t("en", "verify.slash.subcommands.unverify.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.unverify.description"))
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription(t("en", "verify.slash.options.user_unverify"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.user_unverify"))
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stats")
        .setDescription(t("en", "verify.slash.subcommands.stats.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.stats.description"))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription(t("en", "verify.slash.subcommands.info.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.info.description"))
    )
    .addSubcommandGroup((group) =>
      group
        .setName("question-pool")
        .setDescription(t("en", "verify.slash.groups.question_pool.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.groups.question_pool.description"))
        .addSubcommand((subcommand) =>
          subcommand
            .setName("add")
            .setDescription(t("en", "verify.slash.groups.question_pool.subcommands.add.description"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.groups.question_pool.subcommands.add.description"))
            .addStringOption((option) =>
              option
                .setName("question")
                .setDescription(t("en", "verify.slash.groups.question_pool.options.question"))
                .setDescriptionLocalizations(localeMapFromKey("verify.slash.groups.question_pool.options.question"))
                .setRequired(true)
                .setMaxLength(200)
            )
            .addStringOption((option) =>
              option
                .setName("answer")
                .setDescription(t("en", "verify.slash.groups.question_pool.options.answer"))
                .setDescriptionLocalizations(localeMapFromKey("verify.slash.groups.question_pool.options.answer"))
                .setRequired(true)
                .setMaxLength(100)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("list")
            .setDescription(t("en", "verify.slash.groups.question_pool.subcommands.list.description"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.groups.question_pool.subcommands.list.description"))
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("remove")
            .setDescription(t("en", "verify.slash.groups.question_pool.subcommands.remove.description"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.groups.question_pool.subcommands.remove.description"))
            .addIntegerOption((option) =>
              option
                .setName("index")
                .setDescription(t("en", "verify.slash.groups.question_pool.options.index"))
                .setDescriptionLocalizations(localeMapFromKey("verify.slash.groups.question_pool.options.index"))
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(20)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("clear")
            .setDescription(t("en", "verify.slash.groups.question_pool.subcommands.clear.description"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.groups.question_pool.subcommands.clear.description"))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("security")
        .setDescription(t("en", "verify.slash.subcommands.security.description"))
        .setDescriptionLocalizations(localeMapFromKey("verify.slash.subcommands.security.description"))
        .addIntegerOption((option) =>
          option
            .setName("min_account_age")
            .setDescription(t("en", "verify.slash.options.min_account_age"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.min_account_age"))
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(365)
        )
        .addBooleanOption((option) =>
          option
            .setName("risk_escalation")
            .setDescription(t("en", "verify.slash.options.risk_escalation"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.risk_escalation"))
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("captcha_type")
            .setDescription(t("en", "verify.slash.options.captcha_type"))
            .setDescriptionLocalizations(localeMapFromKey("verify.slash.options.captcha_type"))
            .setRequired(false)
            .addChoices(
              localizedChoice("math", "verify.slash.choices.captcha_type.math"),
              localizedChoice("emoji", "verify.slash.choices.captcha_type.emoji")
            )
        )
    ),

  async execute(interaction) {
    const rawSubcommand = interaction.options.getSubcommand();
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = normalizeSubcommand(rawSubcommand);
    const guildId = interaction.guild.id;
    const [verificationSettings, guildSettings] = await Promise.all([
      verifSettings.get(guildId),
      settings.get(guildId),
    ]);
    const language = resolveInteractionLanguage(interaction, guildSettings);

    const ok = (message) =>
      interaction.reply({ embeds: [E.successEmbed(message)], flags: 64 });
    const er = (message) =>
      interaction.reply({ embeds: [E.errorEmbed(message)], flags: 64 });

    if (subcommand === "setup") {
      const channel = getChannelOption(interaction, "channel", "canal");
      const verifiedRole = getRoleOption(interaction, "verified_role", "rol_verificado");
      const mode = getStringOption(interaction, "mode", "modo");
      const unverifiedRole = getRoleOption(interaction, "unverified_role", "rol_no_verificado");

      const nextSettings = {
        ...verificationSettings,
        enabled: true,
        channel: channel.id,
        verified_role: verifiedRole.id,
        mode,
        unverified_role: unverifiedRole?.id || null,
        ...(verificationSettings?.channel && verificationSettings.channel !== channel.id
          ? { panel_message_id: null }
          : {}),
      };

      const inspection = inspectVerificationConfiguration(
        interaction.guild,
        nextSettings,
        guildSettings,
        { language }
      );
      if (inspection.errors.length > 0) {
        return er(t(language, "verify.command.setup_failed", {
          issues: buildIssueText(inspection.errors, inspection.warnings, language),
        }));
      }

      await verifSettings.update(guildId, nextSettings);

      let alignedTicketRole = false;
      if (!guildSettings?.verify_role) {
        await settings.update(guildId, { verify_role: verifiedRole.id });
        alignedTicketRole = true;
      }

      const refreshedGuildSettings = await settings.get(guildId);
      const updatedSettings = await verifSettings.get(guildId);
      const panelResult = await publishPanelOrReturnError(
        interaction,
        updatedSettings,
        refreshedGuildSettings,
        "command.verify.setup",
        language
      );
      if (!panelResult.ok) {
        return interaction.reply(panelResult.payload);
      }

      const notes = [];
      if (alignedTicketRole) {
        notes.push(t(language, "verify.command.note_ticket_role_aligned"));
      }
      if (mode === "question") {
        notes.push(t(language, "verify.command.note_question_mode"));
      }

      const embed = new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle(t(language, "verify.command.setup_ready_title"))
        .setDescription(t(language, "verify.command.setup_ready_description"))
        .addFields(
          { name: t(language, "common.labels.channel"), value: `<#${channel.id}>`, inline: true },
          { name: t(language, "common.labels.verified_role"), value: `<@&${verifiedRole.id}>`, inline: true },
          { name: t(language, "common.labels.mode"), value: buildModeLabel(mode, language), inline: true },
          {
            name: t(language, "common.labels.unverified_role"),
            value: unverifiedRole ? `<@&${unverifiedRole.id}>` : t(language, "common.value.none"),
            inline: true,
          },
          { name: t(language, "common.labels.panel_message"), value: panelResult.detail, inline: false }
        )
        .setTimestamp();

      if (notes.length > 0) {
        embed.addFields({
          name: t(language, "common.labels.notes"),
          value: notes.map((note) => `- ${note}`).join("\n"),
          inline: false,
        });
      }

      return interaction.reply({ embeds: [embed], flags: 64 });
    }

    if (subcommand === "panel") {
      const inspection = inspectVerificationConfiguration(
        interaction.guild,
        verificationSettings,
        guildSettings,
        { language }
      );
      if (inspection.errors.length > 0) {
        return er(t(language, "verify.command.panel_publish_failed", {
          issues: buildIssueText(inspection.errors, inspection.warnings, language),
        }));
      }

      await interaction.deferReply({ flags: 64 });
      const result = await sendVerificationPanel(interaction.guild, verificationSettings, {
        guildSettings,
        actorId: interaction.user.id,
        source: "command.verify.panel",
        language,
      });
      if (!result.ok) {
        return interaction.editReply({
          embeds: [
            E.errorEmbed(
              t(language, "verify.command.panel_publish_failed", {
                issues: buildIssueText(result.errors, result.warnings, language),
              })
            ),
          ],
        });
      }

      const warningText = result.warnings.length > 0
        ? `\n\n${t(language, "common.labels.warnings")}:\n${buildIssueText([], result.warnings, language)}`
        : "";

      return interaction.editReply({
        embeds: [
          E.successEmbed(
            `${t(
              language,
              result.refreshed ? "verify.command.panel_refreshed" : "verify.command.panel_published"
            )}${warningText}`
          ),
        ],
      });
    }

    if (subcommand === "enabled") {
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      if (enabled) {
        const inspection = inspectVerificationConfiguration(
          interaction.guild,
          verificationSettings,
          guildSettings,
          { language }
        );
        if (inspection.errors.length > 0) {
          return er(t(language, "verify.command.enable_failed", {
            issues: buildIssueText(inspection.errors, inspection.warnings, language),
          }));
        }
      }

      await verifSettings.update(guildId, { enabled });
      return ok(t(language, "verify.command.enabled_state", {
        state: enabled ? t(language, "common.state.enabled") : t(language, "common.state.disabled"),
      }));
    }

    if (subcommand === "mode") {
      const type = getStringOption(interaction, "type", "tipo");
      const inspection = inspectVerificationConfiguration(
        interaction.guild,
        { ...verificationSettings, mode: type },
        guildSettings,
        { language }
      );
      if (inspection.errors.length > 0) {
        return er(t(language, "verify.command.mode_failed", {
          mode: buildModeLabel(type, language),
          issues: buildIssueText(inspection.errors, inspection.warnings, language),
        }));
      }

      await verifSettings.update(guildId, { mode: type });
      const updatedSettings = await verifSettings.get(guildId);
      const panelResult = await publishPanelOrReturnError(
        interaction,
        updatedSettings,
        guildSettings,
        "command.verify.mode",
        language
      );
      if (!panelResult.ok) {
        return interaction.reply(panelResult.payload);
      }

      return ok(t(language, "verify.command.mode_changed", {
        mode: buildModeLabel(type, language),
        detail: panelResult.detail,
      }));
    }

    if (subcommand === "question") {
      const prompt = getStringOption(interaction, "prompt", "pregunta");
      const answer = getStringOption(interaction, "answer", "respuesta");
      await verifSettings.update(guildId, {
        question: prompt,
        question_answer: normalizeVerificationAnswer(answer),
      });
      return ok(t(language, "verify.command.question_updated"));
    }

    if (subcommand === "message") {
      const title = getStringOption(interaction, "title", "titulo");
      const description = getStringOption(interaction, "description", "descripcion");
      const color = getStringOption(interaction, "color");
      const image = getStringOption(interaction, "image", "imagen");

      if (!title && !description && !color && !image) {
        return er(t(language, "verify.command.message_require_one"));
      }

      if (color && !/^[0-9A-Fa-f]{6}$/.test(color)) {
        return er(t(language, "verify.command.invalid_color"));
      }

      if (image && !/^https:\/\//i.test(image)) {
        return er(t(language, "verify.command.invalid_image"));
      }

      const patch = {};
      if (title) patch.panel_title = title;
      if (description) patch.panel_description = description;
      if (color) patch.panel_color = color;
      if (image) patch.panel_image = image;

      await verifSettings.update(guildId, patch);
      const updatedSettings = await verifSettings.get(guildId);
      const panelResult = await publishPanelOrReturnError(
        interaction,
        updatedSettings,
        guildSettings,
        "command.verify.message",
        language
      );
      if (!panelResult.ok) {
        return interaction.reply(panelResult.payload);
      }

      return ok(t(language, "verify.command.message_updated", {
        detail: panelResult.detail,
      }));
    }

    if (subcommand === "dm") {
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      await verifSettings.update(guildId, { dm_on_verify: enabled });
      return ok(t(language, "verify.command.dm_updated", {
        state: enabled ? t(language, "common.state.enabled") : t(language, "common.state.disabled"),
      }));
    }

    if (subcommand === "auto-kick") {
      const hours = getIntegerOption(interaction, "hours", "horas");
      await verifSettings.update(guildId, { kick_unverified_hours: hours });
      return ok(
        hours === 0
          ? t(language, "verify.command.auto_kick_disabled")
          : t(language, "verify.command.auto_kick_enabled", { hours })
      );
    }

    if (subcommand === "anti-raid") {
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      const joins = getIntegerOption(interaction, "joins");
      const seconds = getIntegerOption(interaction, "seconds", "segundos");
      const action = getStringOption(interaction, "action", "accion");

      const patch = { antiraid_enabled: enabled };
      if (joins !== null && joins !== undefined) patch.antiraid_joins = joins;
      if (seconds !== null && seconds !== undefined) patch.antiraid_seconds = seconds;
      if (action) patch.antiraid_action = action;

      await verifSettings.update(guildId, patch);
      const updatedSettings = await verifSettings.get(guildId);
      return ok(
        enabled
          ? t(language, "verify.command.anti_raid_enabled", {
            joins: updatedSettings.antiraid_joins,
            seconds: updatedSettings.antiraid_seconds,
            action:
                updatedSettings.antiraid_action === "kick"
                  ? t(language, "verify.info.raid_action_kick")
                  : t(language, "verify.info.raid_action_pause"),
          })
          : t(language, "verify.command.anti_raid_disabled")
      );
    }

    if (subcommand === "logs") {
      const channel = getChannelOption(interaction, "channel", "canal");
      const permissions = channel.permissionsFor(interaction.guild.members.me);
      const missingPermissions = permissions
        ? ["ViewChannel", "SendMessages", "EmbedLinks"].filter(
          (permission) => !permissions.has(PermissionFlagsBits[permission])
        )
        : ["ViewChannel", "SendMessages", "EmbedLinks"];

      if (missingPermissions.length > 0) {
        return er(t(language, "verify.command.logs_permissions", {
          channel,
          permissions: missingPermissions.map((permission) => `\`${permission}\``).join(", "),
        }));
      }

      await verifSettings.update(guildId, { log_channel: channel.id });
      return ok(t(language, "verify.command.logs_set", { channel }));
    }

    if (subcommand === "force") {
      const user = getUserOption(interaction, "user", "usuario");
      if (user.bot) {
        return er(t(language, "verify.command.force_bot"));
      }

      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) {
        return er(t(language, "verify.command.user_missing"));
      }

      const result = await applyVerification(member, interaction.guild, verificationSettings, {
        guildSettings,
        reason: `Forced by ${interaction.user.tag}`,
        language,
      });
      if (!result.ok) {
        await verifLogs.add({
          guild_id: guildId,
          user_id: user.id,
          actor_id: interaction.user.id,
          status: "permission_error",
          event: "permission_error",
          reason: result.errors.join(" | "),
          source: "command.verify.force",
        });
        return er(t(language, "verify.command.force_failed", {
          userId: user.id,
          issues: buildIssueText(result.errors, result.warnings, language),
        }));
      }

      await Promise.all([
        verifCodes.clearForUser(user.id, guildId),
        verifMemberStates.markVerified(guildId, user.id, {
          actorId: interaction.user.id,
          reason: "force_verified",
          mode: verificationSettings.mode || "button",
        }),
        verifLogs.add({
          guild_id: guildId,
          user_id: user.id,
          actor_id: interaction.user.id,
          status: "verified",
          event: "force_verified",
          mode: verificationSettings.mode || "button",
          reason: `Forced by ${interaction.user.tag}`,
          source: "command.verify.force",
          metadata: {
            warnings: result.warnings,
          },
        }),
      ]);

      await sendVerificationLogMessage(
        interaction.guild,
        verificationSettings,
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle(t(language, "verify.command.force_log_title"))
          .addFields(
            { name: t(language, "verify.command.member"), value: `${user.tag} (<@${user.id}>)`, inline: true },
            { name: t(language, "verify.command.actor"), value: `${interaction.user.tag} (<@${interaction.user.id}>)`, inline: true },
            { name: t(language, "common.labels.mode"), value: buildModeLabel(verificationSettings.mode, language), inline: true }
          )
          .setTimestamp()
      );

      const warningText = result.warnings.length > 0
        ? `\n\n${t(language, "common.labels.warnings")}:\n${buildIssueText([], result.warnings, language)}`
        : "";

      return ok(t(language, "verify.command.force_success", {
        userId: user.id,
        warningText,
      }));
    }

    if (subcommand === "unverify") {
      const user = getUserOption(interaction, "user", "usuario");
      if (user.bot) {
        return er(t(language, "verify.command.unverify_bot"));
      }

      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) {
        return er(t(language, "verify.command.user_missing"));
      }

      const result = await revokeVerification(member, interaction.guild, verificationSettings, {
        guildSettings,
        reason: `Removed by ${interaction.user.tag}`,
        language,
      });
      if (!result.ok) {
        await verifLogs.add({
          guild_id: guildId,
          user_id: user.id,
          actor_id: interaction.user.id,
          status: "permission_error",
          event: "permission_error",
          reason: result.errors.join(" | "),
          source: "command.verify.unverify",
        });
        return er(t(language, "verify.command.unverify_failed", {
          userId: user.id,
          issues: buildIssueText(result.errors, result.warnings, language),
        }));
      }

      await Promise.all([
        verifCodes.clearForUser(user.id, guildId),
        verifMemberStates.markUnverified(guildId, user.id, {
          actorId: interaction.user.id,
          reason: "force_unverified",
        }),
        verifLogs.add({
          guild_id: guildId,
          user_id: user.id,
          actor_id: interaction.user.id,
          status: "unverified",
          event: "force_unverified",
          reason: `Removed by ${interaction.user.tag}`,
          source: "command.verify.unverify",
          metadata: {
            warnings: result.warnings,
          },
        }),
      ]);

      await sendVerificationLogMessage(
        interaction.guild,
        verificationSettings,
        new EmbedBuilder()
          .setColor(E.Colors.WARNING)
          .setTitle(t(language, "verify.command.unverify_log_title"))
          .addFields(
            { name: t(language, "verify.command.member"), value: `${user.tag} (<@${user.id}>)`, inline: true },
            { name: t(language, "verify.command.actor"), value: `${interaction.user.tag} (<@${interaction.user.id}>)`, inline: true }
          )
          .setTimestamp()
      );

      const warningText = result.warnings.length > 0
        ? `\n\n${t(language, "common.labels.warnings")}:\n${buildIssueText([], result.warnings, language)}`
        : "";

      return ok(t(language, "verify.command.unverify_success", {
        userId: user.id,
        warningText,
      }));
    }

    if (subcommand === "stats") {
      const [stats, recentEntries] = await Promise.all([
        verifLogs.getStats(guildId),
        verifLogs.getRecent(guildId, 6),
      ]);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(t(language, "verify.command.stats_title"))
            .setColor(E.Colors.SUCCESS)
            .addFields(
              { name: t(language, "verify.command.verified"), value: `\`${stats.verified}\``, inline: true },
              { name: t(language, "verify.command.failed"), value: `\`${stats.failed}\``, inline: true },
              { name: t(language, "verify.command.kicked"), value: `\`${stats.kicked}\``, inline: true },
              { name: t(language, "verify.command.starts"), value: `\`${stats.starts}\``, inline: true },
              { name: t(language, "verify.command.force_verified"), value: `\`${stats.force_verified}\``, inline: true },
              { name: t(language, "verify.command.force_unverified"), value: `\`${stats.force_unverified}\``, inline: true },
              { name: t(language, "verify.command.pending_members"), value: `\`${stats.pending_members}\``, inline: true },
              { name: t(language, "verify.command.verified_members"), value: `\`${stats.verified_members}\``, inline: true },
              { name: t(language, "verify.command.code_sends"), value: `\`${stats.code_sent}\``, inline: true },
              { name: t(language, "verify.command.question_prompts"), value: `\`${stats.question_prompt}\``, inline: true },
              { name: t(language, "verify.command.anti_raid_triggers"), value: `\`${stats.anti_raid_triggers}\``, inline: true },
              { name: t(language, "verify.command.permission_errors"), value: `\`${stats.permission_errors}\``, inline: true },
              { name: t(language, "common.labels.recent_activity"), value: buildRecentActivityText(recentEntries, language), inline: false },
            )
            .setFooter({ text: t(language, "verify.command.stats_footer", { total: stats.total }) })
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (subcommand === "info") {
      return interaction.reply({
        embeds: [buildVerificationInfoEmbed(interaction, verificationSettings, guildSettings, language)],
        flags: 64,
      });
    }

    if (subcommandGroup === "question-pool") {
      const currentPool = verificationSettings?.question_pool || [];
      const commercialState = resolveCommercialState(guildSettings);
      const planLimits = VERIFICATION_PLAN_LIMITS[commercialState.effectivePlan] || VERIFICATION_PLAN_LIMITS.free;

      if (subcommand === "add") {
        if (currentPool.length >= planLimits.maxQuestionPool) {
          if (!commercialState.isPro) {
            return interaction.reply({
              embeds: [buildProRequiredEmbed(guildSettings, t(language, "verify.command.pool_pro_feature"), language)],
              flags: 64,
            });
          }
          return er(t(language, "verify.command.pool_max_reached"));
        }

        const question = getStringOption(interaction, "question");
        const answer = getStringOption(interaction, "answer");

        const newPool = [...currentPool, {
          question: question.trim(),
          answer: normalizeVerificationAnswer(answer),
        }];

        await verifSettings.update(guildId, { question_pool: newPool });

        return ok(t(language, "verify.command.pool_added", {
          question: question.substring(0, 50),
          total: newPool.length,
        }));
      }

      if (subcommand === "list") {
        if (currentPool.length === 0) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle(t(language, "verify.command.pool_title"))
                .setColor(E.Colors.INFO)
                .setDescription(t(language, "verify.command.pool_empty"))
                .setFooter({ text: t(language, "verify.command.pool_footer") })
                .setTimestamp(),
            ],
            flags: 64,
          });
        }

        const listText = currentPool
          .map((q, i) => `**${i + 1}.** ${q.question}\n   ↳ \`${q.answer}\``)
          .join("\n\n");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(t(language, "verify.command.pool_title"))
              .setColor(E.Colors.SUCCESS)
              .setDescription(listText.substring(0, 4000))
              .setFooter({ text: t(language, "verify.command.pool_count", { count: currentPool.length }) })
              .setTimestamp(),
          ],
          flags: 64,
        });
      }

      if (subcommand === "remove") {
        const index = getIntegerOption(interaction, "index");

        if (index < 1 || index > currentPool.length) {
          return er(t(language, "verify.command.pool_invalid_index", { max: currentPool.length }));
        }

        const removed = currentPool[index - 1];
        const newPool = currentPool.filter((_, i) => i !== index - 1);

        await verifSettings.update(guildId, { question_pool: newPool });

        return ok(t(language, "verify.command.pool_removed", {
          question: removed.question.substring(0, 50),
          remaining: newPool.length,
        }));
      }

      if (subcommand === "clear") {
        await verifSettings.update(guildId, { question_pool: [] });
        return ok(t(language, "verify.command.pool_cleared", { count: currentPool.length }));
      }
    }

    if (subcommand === "security") {
      const minAccountAge = getIntegerOption(interaction, "min_account_age");
      const riskEscalation = getBooleanOption(interaction, "risk_escalation");
      const captchaType = getStringOption(interaction, "captcha_type");
      const commercialState = resolveCommercialState(guildSettings);
      const planLimits = VERIFICATION_PLAN_LIMITS[commercialState.effectivePlan] || VERIFICATION_PLAN_LIMITS.free;

      if (riskEscalation === true && !planLimits.riskEscalation) {
        return interaction.reply({
          embeds: [buildProRequiredEmbed(guildSettings, t(language, "verify.command.risk_escalation_pro"), language)],
          flags: 64,
        });
      }

      if (captchaType === "emoji" && !planLimits.captchaEmoji) {
        return interaction.reply({
          embeds: [buildProRequiredEmbed(guildSettings, t(language, "verify.command.captcha_emoji_pro"), language)],
          flags: 64,
        });
      }

      if (minAccountAge !== null && minAccountAge > planLimits.maxAccountAgeDays) {
        return interaction.reply({
          embeds: [buildProRequiredEmbed(guildSettings, t(language, "verify.command.account_age_pro", { max: planLimits.maxAccountAgeDays }), language)],
          flags: 64,
        });
      }

      if (minAccountAge === null && riskEscalation === null && captchaType === null) {
        const currentSettings = verificationSettings || {};
        const embed = new EmbedBuilder()
          .setTitle(t(language, "verify.command.security_title"))
          .setColor(E.Colors.INFO)
          .addFields(
            {
              name: t(language, "verify.command.min_account_age"),
              value: currentSettings.min_account_age_days > 0
                ? `${currentSettings.min_account_age_days} ${t(language, "common.units.days")}`
                : t(language, "common.state.disabled"),
              inline: true,
            },
            {
              name: t(language, "verify.command.risk_escalation"),
              value: currentSettings.risk_based_escalation
                ? t(language, "common.state.enabled")
                : t(language, "common.state.disabled"),
              inline: true,
            },
            {
              name: t(language, "verify.command.captcha_type"),
              value: currentSettings.captcha_type === "emoji"
                ? t(language, "verify.command.captcha_emoji")
                : t(language, "verify.command.captcha_math"),
              inline: true,
            }
          )
          .setFooter({ text: t(language, "verify.command.security_footer") })
          .setTimestamp();

        return interaction.reply({ embeds: [embed], flags: 64 });
      }

      const patch = {};
      const changes = [];

      if (minAccountAge !== null) {
        patch.min_account_age_days = minAccountAge;
        changes.push(minAccountAge > 0
          ? t(language, "verify.command.security_age_set", { days: minAccountAge })
          : t(language, "verify.command.security_age_disabled"));
      }

      if (riskEscalation !== null) {
        patch.risk_based_escalation = riskEscalation;
        changes.push(riskEscalation
          ? t(language, "verify.command.security_risk_enabled")
          : t(language, "verify.command.security_risk_disabled"));
      }

      if (captchaType !== null) {
        patch.captcha_type = captchaType;
        changes.push(t(language, "verify.command.security_captcha_set", {
          type: captchaType === "emoji"
            ? t(language, "verify.command.captcha_emoji")
            : t(language, "verify.command.captcha_math"),
        }));
      }

      await verifSettings.update(guildId, patch);

      return ok(t(language, "verify.command.security_updated", {
        changes: changes.join("\n"),
      }));
    }

    return interaction.reply({
      embeds: [E.errorEmbed(t(language, "verify.command.unknown_subcommand"))],
      flags: 64,
    });
  },
};

module.exports.sendVerifPanel = sendVerificationPanel;
module.exports.applyVerification = applyVerification;
