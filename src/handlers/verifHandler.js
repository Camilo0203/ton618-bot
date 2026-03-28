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

  if (!verificationSettings || !verificationSettings.enabled) {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed("Verification is not active in this server.")],
    });
  }

  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member) {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed("Your member profile could not be found in this server.")],
    });
  }

  const verifiedRoleId = resolveVerifiedRoleId(verificationSettings, guildSettings);
  if (verifiedRoleId && member.roles.cache.has(verifiedRoleId)) {
    return replyEphemeral(interaction, {
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setDescription("You are already verified in this server."),
      ],
    });
  }

  const inspection = inspectVerificationConfiguration(
    guild,
    verificationSettings,
    guildSettings,
    { skipChannelChecks: true }
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
          "Verification is currently misconfigured.\n\n" +
          inspection.errors.map((issue) => `- ${issue}`).join("\n")
        ),
      ],
    });
  }

  const cooldownUntil = buildCooldownDate(state);
  if (cooldownUntil) {
    return replyEphemeral(interaction, {
      embeds: [
        E.warningEmbed(
          `Too many failed attempts. Try again ${buildRetryText(cooldownUntil)}.`
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
            .setTitle("Verification Code")
            .setDescription(
              `Your verification code for **${guild.name}** is:\n\n` +
              `# \`${code}\`\n\n` +
              "This code expires in **10 minutes**.\n" +
              "Return to the server and click **Enter code**."
            )
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
          E.errorEmbed(
            "I could not send you a DM.\n\nEnable direct messages for this server and try again."
          ),
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
          .setTitle("Code sent by DM")
          .setDescription(
            "A 6-character code was sent to your direct messages.\n\n" +
            "1. Open your DM inbox and copy the code.\n" +
            "2. Return here and click **Enter code**.\n\n" +
            "The code expires in **10 minutes**."
          )
          .setFooter({
            text: `Resends are limited. Wait ${VERIFICATION_LIMITS.codeResendCooldownSeconds}s before requesting a new code.`,
          })
          .setTimestamp(),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("verify_enter_code")
            .setLabel("Enter code")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("verify_resend_code")
            .setLabel("Resend code")
            .setStyle(ButtonStyle.Secondary)
        ),
      ],
    });
  }

  if (verificationSettings.mode === "question") {
    if (!verificationSettings.question || !verificationSettings.question_answer) {
      return replyEphemeral(interaction, {
        embeds: [
          E.errorEmbed(
            "No verification question is configured. Ask an admin to run `/verify question`."
          ),
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
      .setTitle("Verification Question");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("answer_input")
          .setLabel(verificationSettings.question.substring(0, 45))
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100)
          .setPlaceholder("Type your answer here")
      )
    );

    return interaction.showModal(modal);
  }

  return replyEphemeral(interaction, {
    embeds: [E.errorEmbed("Verification mode is not configured correctly.")],
  });
}

async function handleVerifyHelp(interaction) {
  const verificationSettings = await verifSettings.get(interaction.guild.id);
  const modeHelp = {
    button: "Click **Verify me** and the bot will verify you immediately.",
    code: "Click **Verify me**, check your DM inbox for the code, then enter it in the modal.",
    question: "Click **Verify me** and answer the verification question correctly.",
  };

  return replyEphemeral(interaction, {
    embeds: [
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("How verification works")
        .setDescription(
          modeHelp[verificationSettings?.mode] ||
          "Follow the instructions shown in the verification panel."
        )
        .addFields(
          {
            name: "DM problems?",
            value: "Enable direct messages for this server and try again.",
            inline: false,
          },
          {
            name: "Attempts protection",
            value:
              `After ${VERIFICATION_LIMITS.maxFailuresBeforeCooldown} failed attempts, ` +
              `verification pauses for ${VERIFICATION_LIMITS.failureCooldownMinutes} minutes.`,
            inline: false,
          },
          {
            name: "Still blocked?",
            value: "Contact a server admin for manual help.",
            inline: false,
          }
        )
        .setTimestamp(),
    ],
  });
}

async function handleEnterCode(interaction) {
  const verificationSettings = await verifSettings.get(interaction.guild.id);
  if (!verificationSettings || !verificationSettings.enabled) {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed("Verification is not active right now.")],
    });
  }

  if (verificationSettings.mode !== "code") {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed("This verification mode does not use DM codes.")],
    });
  }

  const modal = new ModalBuilder()
    .setCustomId("verify_code_modal")
    .setTitle("Enter your code");

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("code_input")
        .setLabel("Code received by DM")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(6)
        .setMaxLength(6)
        .setPlaceholder("Example: AB1C2D")
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

  const cooldownUntil = buildCooldownDate(state);
  if (cooldownUntil) {
    return replyEphemeral(interaction, {
      embeds: [
        E.warningEmbed(
          `Too many failed attempts. Try again ${buildRetryText(cooldownUntil)}.`
        ),
      ],
    });
  }

  const codeInput = interaction.fields.getTextInputValue("code_input").toUpperCase().trim();
  const result = await verifCodes.verify(user.id, guild.id, codeInput);

  if (!result.valid) {
    const messages = {
      no_code: "No pending code was found. Click **Verify me** to generate a new one.",
      expired: "Your code expired. Click **Verify me** to generate a new one.",
      wrong: "Incorrect code. Try again.",
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
      ? `\n\nToo many failed attempts. Try again ${buildRetryText(retryDate)}.`
      : "";

    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed(`${messages[result.reason] || "Invalid verification code."}${cooldownText}`)],
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

  const cooldownUntil = buildCooldownDate(state);
  if (cooldownUntil) {
    return replyEphemeral(interaction, {
      embeds: [
        E.warningEmbed(
          `Too many failed attempts. Try again ${buildRetryText(cooldownUntil)}.`
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
      ? `\n\nToo many failed attempts. Try again ${buildRetryText(retryDate)}.`
      : "";

    return replyEphemeral(interaction, {
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.ERROR)
          .setDescription(
            `Incorrect answer. Read the question carefully and try again.${cooldownText}`
          ),
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
  const [verificationSettings, state] = await Promise.all([
    verifSettings.get(guild.id),
    verifMemberStates.get(guild.id, user.id),
  ]);

  if (!verificationSettings || verificationSettings.mode !== "code") {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed("This verification mode does not use DM codes.")],
    });
  }

  const cooldownUntil = buildCooldownDate(state);
  if (cooldownUntil) {
    return replyEphemeral(interaction, {
      embeds: [
        E.warningEmbed(
          `Too many failed attempts. Try again ${buildRetryText(cooldownUntil)}.`
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
            `Please wait before requesting another code. You can retry <t:${Math.floor(minNext / 1000)}:R>.`
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
          .setTitle("New verification code")
          .setDescription(
            `Your new verification code is:\n\n# \`${code}\`\n\n` +
            "This code expires in **10 minutes**."
          )
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
      embeds: [E.errorEmbed("I could not send you a DM. Enable direct messages and try again.")],
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
    embeds: [E.successEmbed("A new verification code was sent by DM.")],
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
  const member = providedMember || await guild.members.fetch(user.id).catch(() => null);
  if (!member) {
    return replyEphemeral(interaction, {
      embeds: [E.errorEmbed("Your member profile could not be found in this server.")],
    });
  }

  const result = await applyVerification(member, guild, verificationSettings, {
    guildSettings,
    reason: "Verification completed",
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
          "I could not finish your verification because the role setup is not operational.\n\n" +
          result.errors.map((issue) => `- ${issue}`).join("\n")
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
        .setTitle("Verification completed")
        .setDescription(
          `Welcome to **${guild.name}**, <@${user.id}>. You now have full access to the server.`
        )
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp(),
    ],
  });

  if (verificationSettings.dm_on_verify) {
    await user.send({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("You are verified")
          .setDescription(`You were verified successfully in **${guild.name}**.`)
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
          .setTitle("Member verified")
          .addFields(
            { name: "User", value: `${user.tag} (<@${user.id}>)`, inline: true },
            { name: "Mode", value: buildModeLabel(mode), inline: true },
            {
              name: "Warnings",
              value: result.warnings.length > 0
                ? result.warnings.map((warning) => `- ${warning}`).join("\n").slice(0, 1024)
                : "None",
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
