"use strict";

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const {
  verifSettings,
  verifCodes,
  verifLogs,
  settings,
  verifMemberStates,
} = require("../utils/database");
const {
  VERIFICATION_LIMITS,
  normalizeVerificationAnswer,
  inspectVerificationConfiguration,
  applyVerification,
  resolveVerifiedRoleId,
  buildModeLabel,
} = require("../utils/verificationService");
const E = require("../utils/embeds");
const { resolveInteractionLanguage, t } = require("../utils/i18n");

async function handleVerif(interaction) {
  const { customId } = interaction;

  if (customId === "verify_start") return handleVerifyStart(interaction);
  if (customId === "verify_help") return handleVerifyHelp(interaction);
  if (customId === "verify_code_modal") return handleCodeModal(interaction);
  if (customId === "verify_question_modal") return handleQuestionModal(interaction);
  if (customId === "verify_enter_code") return handleEnterCode(interaction);
  if (customId === "verify_resend_code") return handleResendCode(interaction);

  return null;
}

function buildCooldownDate(state) {
  const cooldown = state?.cooldown_until ? new Date(state.cooldown_until) : null;
  if (!cooldown || Number.isNaN(cooldown.getTime())) return null;
  return cooldown.getTime() > Date.now() ? cooldown : null;
}

function buildRetryText(date) {
  return `<t:${Math.floor(date.getTime() / 1000)}:R>`;
}

function buildIssueText(issues = []) {
  return issues.map((issue) => `- ${issue}`).join("\n");
}

function buildWarningText(warnings = [], language = "en") {
  if (!Array.isArray(warnings) || warnings.length === 0) {
    return t(language, "verify.handler.log_warning_none");
  }

  return warnings.map((warning) => `- ${warning}`).join("\n").slice(0, 1024);
}

async function replyEphemeral(interaction, payload) {
  if (interaction.replied || interaction.deferred) {
    return interaction.followUp({ ...payload, flags: 64 }).catch(() => {});
  }
  return interaction.reply({ ...payload, flags: 64 }).catch(() => {});
}

async function markFailure(guildId, userId, mode, reason, source, metadata = {}) {
  const currentState = await verifMemberStates.get(guildId, userId);
  const nextFailures = Number(currentState?.active_failures || 0) + 1;
  const cooldownUntil = nextFailures >= VERIFICATION_LIMITS.maxFailuresBeforeCooldown
    ? new Date(Date.now() + VERIFICATION_LIMITS.failureCooldownMinutes * 60 * 1000)
    : null;

  await Promise.all([
    verifMemberStates.markFailed(guildId, userId, mode, reason, { cooldownUntil }),
    verifLogs.add({
      guild_id: guildId,
      user_id: userId,
      status: "failed",
      event: "verification_failed",
      mode,
      reason,
      source,
      metadata,
    }),
  ]);

  return cooldownUntil;
}

async function handleVerifyStart(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const [guildSettings, verificationSettings, state] = await Promise.all([
    settings.get(guild.id),
    verifSettings.get(guild.id),
    verifMemberStates.get(guild.id, user.id),
  ]);
  const language = resolveInteractionLanguage(interaction, guildSettings);

  if (!verificationSettings || !verificationSettings.enabled) {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed(t(language, "verify.handler.not_active"))],
    });
  }

  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member) {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed(t(language, "verify.handler.member_not_found"))],
    });
  }

  const verifiedRoleId = resolveVerifiedRoleId(verificationSettings, guildSettings);
  if (verifiedRoleId && member.roles.cache.has(verifiedRoleId)) {
    return replyEphemeral(interaction, {
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setDescription(t(language, "verify.handler.already_verified")),
      ],
    });
  }

  const inspection = inspectVerificationConfiguration(
    guild,
    verificationSettings,
    guildSettings,
    { skipChannelChecks: true, language }
  );
  if (inspection.errors.length > 0) {
    await verifLogs.add({
      guild_id: guild.id,
      user_id: user.id,
      status: "permission_error",
      event: "permission_error",
      mode: verificationSettings.mode || "button",
      reason: inspection.errors.join(" | "),
      source: "interaction.verify.start",
      metadata: {
        warnings: inspection.warnings,
      },
    });
    return replyEphemeral(interaction, {
      embeds: [
        E.errorEmbed(
          t(language, "verify.handler.misconfigured", {
            issues: buildIssueText(inspection.errors),
          })
        ),
      ],
    });
  }

  const cooldownUntil = buildCooldownDate(state);
  if (cooldownUntil) {
    return replyEphemeral(interaction, {
      embeds: [
        E.warningEmbed(
          t(language, "verify.handler.too_many_attempts", {
            retryText: buildRetryText(cooldownUntil),
          })
        ),
      ],
    });
  }

  await Promise.all([
    verifMemberStates.markStarted(guild.id, user.id, verificationSettings.mode || "button", {
      reason: "verification_started",
    }),
    verifLogs.add({
      guild_id: guild.id,
      user_id: user.id,
      status: "started",
      event: "verification_started",
      mode: verificationSettings.mode || "button",
      source: "interaction.verify.start",
    }),
  ]);

  if (verificationSettings.mode === "button") {
    return completeVerification({
      interaction,
      guild,
      guildSettings,
      verificationSettings,
      user,
      member,
      mode: "button",
      source: "interaction.verify.button",
    });
  }

  if (verificationSettings.mode === "code") {
    const existingCode = await verifCodes.getActive(user.id, guild.id);
    const code = existingCode || await verifCodes.generate(user.id, guild.id);

    try {
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle(t(language, "verify.handler.code_dm_title"))
            .setDescription(t(language, "verify.handler.code_dm_description", {
              guild: guild.name,
              code,
              enterCodeLabel: t(language, "common.buttons.enter_code"),
            }))
            .setFooter({ text: guild.name })
            .setTimestamp(),
        ],
      });
    } catch (_) {
      await verifLogs.add({
        guild_id: guild.id,
        user_id: user.id,
        status: "permission_error",
        event: "permission_error",
        mode: "code",
        reason: "dm_delivery_failed",
        source: "interaction.verify.start",
      });
      return replyEphemeral(interaction, {
        embeds: [
          E.errorEmbed(t(language, "verify.handler.dm_failed")),
        ],
      });
    }

    await Promise.all([
      verifMemberStates.markCodeSent(guild.id, user.id, { reason: "code_sent" }),
      verifLogs.add({
        guild_id: guild.id,
        user_id: user.id,
        status: "code_sent",
        event: "code_sent",
        mode: "code",
        source: "interaction.verify.start",
      }),
    ]);

    return replyEphemeral(interaction, {
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle(t(language, "verify.handler.code_sent_title"))
          .setDescription(t(language, "verify.handler.code_sent_description", {
            enterCodeLabel: t(language, "common.buttons.enter_code"),
          }))
          .setFooter({
            text: t(language, "verify.handler.code_sent_footer", {
              seconds: VERIFICATION_LIMITS.codeResendCooldownSeconds,
            }),
          })
          .setTimestamp(),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("verify_enter_code")
            .setLabel(t(language, "common.buttons.enter_code"))
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("verify_resend_code")
            .setLabel(t(language, "common.buttons.resend_code"))
            .setStyle(ButtonStyle.Secondary)
        ),
      ],
    });
  }

  if (verificationSettings.mode === "question") {
    if (!verificationSettings.question || !verificationSettings.question_answer) {
      return replyEphemeral(interaction, {
        embeds: [
          E.errorEmbed(t(language, "verify.handler.question_missing")),
        ],
      });
    }

    await verifLogs.add({
      guild_id: guild.id,
      user_id: user.id,
      status: "question_prompt",
      event: "question_prompt_opened",
      mode: "question",
      source: "interaction.verify.start",
    });

    const modal = new ModalBuilder()
      .setCustomId("verify_question_modal")
      .setTitle(t(language, "verify.handler.question_modal_title"));

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("answer_input")
          .setLabel(verificationSettings.question.substring(0, 45))
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100)
          .setPlaceholder(t(language, "verify.handler.question_placeholder"))
      )
    );

    return interaction.showModal(modal);
  }

  return replyEphemeral(interaction, {
    embeds: [E.errorEmbed(t(language, "verify.handler.mode_invalid"))],
  });
}

async function handleVerifyHelp(interaction) {
  const [guildSettings, verificationSettings] = await Promise.all([
    settings.get(interaction.guild.id),
    verifSettings.get(interaction.guild.id),
  ]);
  const language = resolveInteractionLanguage(interaction, guildSettings);
  const modeHelp = {
    button: t(language, "verify.handler.help_mode_button"),
    code: t(language, "verify.handler.help_mode_code"),
    question: t(language, "verify.handler.help_mode_question"),
  };

  return replyEphemeral(interaction, {
    embeds: [
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(t(language, "verify.handler.help_title"))
        .setDescription(
          modeHelp[verificationSettings?.mode] ||
          t(language, "verify.panel.description")
        )
        .addFields(
          {
            name: t(language, "verify.handler.help_dm_problems_label"),
            value: t(language, "verify.handler.help_dm_problems"),
            inline: false,
          },
          {
            name: t(language, "verify.handler.help_attempts_label"),
            value: t(language, "verify.handler.help_attempts", {
              failures: VERIFICATION_LIMITS.maxFailuresBeforeCooldown,
              minutes: VERIFICATION_LIMITS.failureCooldownMinutes,
            }),
            inline: false,
          },
          {
            name: t(language, "verify.handler.help_blocked_label"),
            value: t(language, "verify.handler.help_blocked"),
            inline: false,
          }
        )
        .setTimestamp(),
    ],
  });
}

async function handleEnterCode(interaction) {
  const [guildSettings, verificationSettings] = await Promise.all([
    settings.get(interaction.guild.id),
    verifSettings.get(interaction.guild.id),
  ]);
  const language = resolveInteractionLanguage(interaction, guildSettings);
  if (!verificationSettings || !verificationSettings.enabled) {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed(t(language, "verify.handler.not_active"))],
    });
  }

  if (verificationSettings.mode !== "code") {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed(t(language, "verify.handler.not_code_mode"))],
    });
  }

  const modal = new ModalBuilder()
    .setCustomId("verify_code_modal")
    .setTitle(t(language, "verify.handler.enter_code_title"));

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("code_input")
        .setLabel(t(language, "verify.handler.enter_code_label"))
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(6)
        .setMaxLength(6)
        .setPlaceholder(t(language, "verify.handler.enter_code_placeholder"))
    )
  );

  return interaction.showModal(modal);
}

async function handleCodeModal(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const [guildSettings, verificationSettings, state] = await Promise.all([
    settings.get(guild.id),
    verifSettings.get(guild.id),
    verifMemberStates.get(guild.id, user.id),
  ]);
  const language = resolveInteractionLanguage(interaction, guildSettings);

  const cooldownUntil = buildCooldownDate(state);
  if (cooldownUntil) {
    return replyEphemeral(interaction, {
      embeds: [
        E.warningEmbed(
          t(language, "verify.handler.too_many_attempts", {
            retryText: buildRetryText(cooldownUntil),
          })
        ),
      ],
    });
  }

  const codeInput = interaction.fields.getTextInputValue("code_input").toUpperCase().trim();
  const result = await verifCodes.verify(user.id, guild.id, codeInput);

  if (!result.valid) {
    const messages = {
      no_code: t(language, "verify.handler.code_reason_no_code"),
      expired: t(language, "verify.handler.code_reason_expired"),
      wrong: t(language, "verify.handler.code_reason_wrong"),
    };
    const retryDate = await markFailure(
      guild.id,
      user.id,
      "code",
      `code_${result.reason || "error"}`,
      "interaction.verify.code_modal",
      { input: codeInput }
    );

    const cooldownText = retryDate
      ? `\n\n${t(language, "verify.handler.too_many_attempts", {
        retryText: buildRetryText(retryDate),
      })}`
      : "";

    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed(`${messages[result.reason] || t(language, "verify.handler.invalid_code")}${cooldownText}`)],
    });
  }

  return completeVerification({
    interaction,
    guild,
    guildSettings,
    verificationSettings,
    user,
    mode: "code",
    source: "interaction.verify.code_modal",
  });
}

async function handleQuestionModal(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const [guildSettings, verificationSettings, state] = await Promise.all([
    settings.get(guild.id),
    verifSettings.get(guild.id),
    verifMemberStates.get(guild.id, user.id),
  ]);
  const language = resolveInteractionLanguage(interaction, guildSettings);

  const cooldownUntil = buildCooldownDate(state);
  if (cooldownUntil) {
    return replyEphemeral(interaction, {
      embeds: [
        E.warningEmbed(
          t(language, "verify.handler.too_many_attempts", {
            retryText: buildRetryText(cooldownUntil),
          })
        ),
      ],
    });
  }

  const answer = normalizeVerificationAnswer(
    interaction.fields.getTextInputValue("answer_input")
  );

  if (answer !== normalizeVerificationAnswer(verificationSettings.question_answer || "")) {
    const retryDate = await markFailure(
      guild.id,
      user.id,
      "question",
      "question_wrong_answer",
      "interaction.verify.question_modal"
    );
    const cooldownText = retryDate
      ? `\n\n${t(language, "verify.handler.too_many_attempts", {
        retryText: buildRetryText(retryDate),
      })}`
      : "";

    return replyEphemeral(interaction, {
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.ERROR)
          .setDescription(t(language, "verify.handler.incorrect_answer", { cooldownText })),
      ],
    });
  }

  return completeVerification({
    interaction,
    guild,
    guildSettings,
    verificationSettings,
    user,
    mode: "question",
    source: "interaction.verify.question_modal",
  });
}

async function handleResendCode(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const [guildSettings, verificationSettings, state] = await Promise.all([
    settings.get(guild.id),
    verifSettings.get(guild.id),
    verifMemberStates.get(guild.id, user.id),
  ]);
  const language = resolveInteractionLanguage(interaction, guildSettings);

  if (!verificationSettings || verificationSettings.mode !== "code") {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed(t(language, "verify.handler.not_code_mode"))],
    });
  }

  const cooldownUntil = buildCooldownDate(state);
  if (cooldownUntil) {
    return replyEphemeral(interaction, {
      embeds: [
        E.warningEmbed(
          t(language, "verify.handler.too_many_attempts", {
            retryText: buildRetryText(cooldownUntil),
          })
        ),
      ],
    });
  }

  if (state?.last_code_sent_at) {
    const lastSentAt = new Date(state.last_code_sent_at);
    const minNext = lastSentAt.getTime() + VERIFICATION_LIMITS.codeResendCooldownSeconds * 1000;
    if (Number.isFinite(lastSentAt.getTime()) && minNext > Date.now()) {
      return replyEphemeral(interaction, {
        embeds: [
          E.warningEmbed(
            t(language, "verify.handler.resend_wait", {
              retryText: `<t:${Math.floor(minNext / 1000)}:R>`,
            })
          ),
        ],
      });
    }
  }

  const code = await verifCodes.generate(user.id, guild.id);
  try {
    await user.send({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle(t(language, "verify.handler.new_code_title"))
          .setDescription(t(language, "verify.handler.new_code_description", { code }))
          .setFooter({ text: guild.name })
          .setTimestamp(),
      ],
    });
  } catch (_) {
    await verifLogs.add({
      guild_id: guild.id,
      user_id: user.id,
      status: "permission_error",
      event: "permission_error",
      mode: "code",
      reason: "dm_delivery_failed",
      source: "interaction.verify.resend_code",
    });
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed(t(language, "verify.handler.resend_dm_failed"))],
    });
  }

  await Promise.all([
    verifMemberStates.markCodeSent(guild.id, user.id, {
      reason: "code_resent",
      isResend: true,
    }),
    verifLogs.add({
      guild_id: guild.id,
      user_id: user.id,
      status: "code_sent",
      event: "code_sent",
      mode: "code",
      reason: "code_resent",
      source: "interaction.verify.resend_code",
      metadata: { resend: true },
    }),
  ]);

  return replyEphemeral(interaction, {
    embeds: [E.successEmbed(t(language, "verify.handler.resend_success"))],
  });
}

async function completeVerification({
  interaction,
  guild,
  guildSettings,
  verificationSettings,
  user,
  member: providedMember = null,
  mode,
  source,
}) {
  const language = resolveInteractionLanguage(interaction, guildSettings);
  const member = providedMember || await guild.members.fetch(user.id).catch(() => null);
  if (!member) {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed(t(language, "verify.handler.member_not_found"))],
    });
  }

  const result = await applyVerification(member, guild, verificationSettings, {
    guildSettings,
    reason: "Verification completed",
    language,
  });

  if (!result.ok) {
    await verifLogs.add({
      guild_id: guild.id,
      user_id: user.id,
      status: "permission_error",
      event: "permission_error",
      mode,
      reason: result.errors.join(" | "),
      source,
      metadata: {
        warnings: result.warnings,
      },
    });
    return replyEphemeral(interaction, {
      embeds: [
        E.errorEmbed(
          t(language, "verify.handler.completion_failed", {
            issues: buildIssueText(result.errors),
          })
        ),
      ],
    });
  }

  await Promise.all([
    verifCodes.clearForUser(user.id, guild.id),
    verifMemberStates.markVerified(guild.id, user.id, {
      mode,
      reason: "verified_success",
    }),
    verifLogs.add({
      guild_id: guild.id,
      user_id: user.id,
      status: "verified",
      event: "verified_success",
      mode,
      source,
      metadata: {
        warnings: result.warnings,
      },
    }),
  ]);

  await replyEphemeral(interaction, {
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle(t(language, "verify.handler.completed_title"))
        .setDescription(t(language, "verify.handler.completed_description", {
          guild: guild.name,
          userId: user.id,
        }))
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp(),
    ],
  });

  if (verificationSettings.dm_on_verify) {
    await user.send({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle(t(language, "verify.handler.verified_dm_title"))
          .setDescription(t(language, "verify.handler.verified_dm_description", {
            guild: guild.name,
          }))
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setFooter({ text: guild.name })
          .setTimestamp(),
      ],
    }).catch(() => {});
  }

  if (verificationSettings.log_channel) {
    const logChannel = guild.channels.cache.get(verificationSettings.log_channel);
    await logChannel?.send({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle(t(language, "verify.handler.log_verified_title"))
          .addFields(
            { name: t(language, "common.labels.user"), value: `${user.tag} (<@${user.id}>)`, inline: true },
            { name: t(language, "common.labels.mode"), value: buildModeLabel(mode, language), inline: true },
            {
              name: t(language, "common.labels.warnings"),
              value: buildWarningText(result.warnings, language),
              inline: false,
            }
          )
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setTimestamp(),
      ],
    }).catch(() => {});
  }
}

module.exports = { handleVerif };
