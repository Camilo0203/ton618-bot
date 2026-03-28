"use strict";

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const { verifSettings, welcomeSettings, verifLogs } = require("./database");

const PANEL_PERMISSION_KEYS = [
  "ViewChannel",
  "SendMessages",
  "EmbedLinks",
];

const VERIFICATION_LIMITS = {
  maxFailuresBeforeCooldown: 5,
  failureCooldownMinutes: 15,
  codeResendCooldownSeconds: 30,
  maxCodeResendsPerWindow: 3,
  codeResendWindowMinutes: 10,
  maxStartsPerWindow: 5,
  startWindowMinutes: 10,
};

function buildModeLabel(mode) {
  return {
    button: "Button",
    code: "DM code",
    question: "Question",
  }[mode] || mode || "Not configured";
}

function normalizeVerificationAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function resolveVerifiedRoleId(verificationSettings, guildSettings = null) {
  return verificationSettings?.verified_role || guildSettings?.verify_role || null;
}

function resolveUnverifiedRoleId(verificationSettings) {
  return verificationSettings?.unverified_role || null;
}

function formatPermissionList(missingPermissions = []) {
  if (!Array.isArray(missingPermissions) || missingPermissions.length === 0) return "none";
  return missingPermissions.map((permission) => `\`${permission}\``).join(", ");
}

function getMissingChannelPermissions(channel) {
  const permissions = channel?.permissionsFor?.(channel.guild?.members?.me);
  if (!permissions) return PANEL_PERMISSION_KEYS;
  return PANEL_PERMISSION_KEYS.filter((permission) => !permissions.has(PermissionFlagsBits[permission]));
}

function canManageRole(guild, role) {
  if (!guild?.members?.me || !role) return false;
  if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return false;
  return role.editable === true || role.position < guild.members.me.roles.highest.position;
}

function inspectVerificationConfiguration(guild, verificationSettings, guildSettings = null, options = {}) {
  const errors = [];
  const warnings = [];

  const channel = verificationSettings?.channel
    ? guild.channels.cache.get(verificationSettings.channel)
    : null;
  const verifiedRoleId = resolveVerifiedRoleId(verificationSettings, guildSettings);
  const unverifiedRoleId = resolveUnverifiedRoleId(verificationSettings);
  const verifiedRole = verifiedRoleId ? guild.roles.cache.get(verifiedRoleId) : null;
  const unverifiedRole = unverifiedRoleId ? guild.roles.cache.get(unverifiedRoleId) : null;
  const logChannel = verificationSettings?.log_channel
    ? guild.channels.cache.get(verificationSettings.log_channel)
    : null;

  if (!options.skipChannelChecks) {
    if (!verificationSettings?.channel) {
      errors.push("Verification channel is not configured.");
    } else if (!channel) {
      errors.push("The configured verification channel no longer exists.");
    } else {
      const missingChannelPermissions = getMissingChannelPermissions(channel);
      if (missingChannelPermissions.length > 0) {
        errors.push(
          `I cannot publish the panel in ${channel}. Missing permissions: ${formatPermissionList(missingChannelPermissions)}.`
        );
      }
    }
  } else if (verificationSettings?.channel && !channel) {
    warnings.push("The configured verification channel no longer exists.");
  }

  if (!verifiedRoleId) {
    errors.push("Verified role is not configured.");
  } else if (!verifiedRole) {
    errors.push("The configured verified role no longer exists.");
  } else if (verifiedRole.managed) {
    errors.push("The verified role is managed by an integration and cannot be assigned by the bot.");
  } else if (!canManageRole(guild, verifiedRole)) {
    errors.push(`I cannot manage the verified role ${verifiedRole}. Move my role above it and keep \`Manage Roles\` enabled.`);
  }

  if (unverifiedRoleId) {
    if (!unverifiedRole) {
      warnings.push("The configured unverified role no longer exists.");
    } else if (unverifiedRole.managed) {
      errors.push("The unverified role is managed by an integration and cannot be assigned by the bot.");
    } else if (!canManageRole(guild, unverifiedRole)) {
      errors.push(`I cannot manage the unverified role ${unverifiedRole}. Move my role above it and keep \`Manage Roles\` enabled.`);
    }
  }

  if (verifiedRoleId && unverifiedRoleId && verifiedRoleId === unverifiedRoleId) {
    errors.push("Verified role and unverified role cannot be the same role.");
  }

  if (verificationSettings?.mode === "question") {
    if (!String(verificationSettings?.question || "").trim()) {
      errors.push("Question mode is enabled but the verification question is empty.");
    }
    if (!String(verificationSettings?.question_answer || "").trim()) {
      errors.push("Question mode is enabled but the expected answer is empty.");
    }
  }

  if (verificationSettings?.log_channel && !logChannel) {
    warnings.push("The configured verification log channel no longer exists.");
  } else if (logChannel) {
    const missingLogPermissions = getMissingChannelPermissions(logChannel);
    if (missingLogPermissions.length > 0) {
      warnings.push(
        `I cannot write to ${logChannel}. Missing permissions: ${formatPermissionList(missingLogPermissions)}.`
      );
    }
  }

  return {
    channel,
    verifiedRole,
    unverifiedRole,
    logChannel,
    errors,
    warnings,
  };
}

function buildVerificationPanelEmbed(guild, verificationSettings) {
  const color = parseInt(verificationSettings?.panel_color || "57F287", 16);
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(verificationSettings?.panel_title || "Verification")
    .setDescription(
      `${verificationSettings?.panel_description || "You need to verify before accessing the server. Click the button below to begin."}\n\n` +
      `**Mode:** ${buildModeLabel(verificationSettings?.mode)}`
    )
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({
      text: `${guild.name} • Verification`,
      iconURL: guild.iconURL({ dynamic: true }) || undefined,
    })
    .setTimestamp();

  if (verificationSettings?.panel_image) {
    embed.setImage(verificationSettings.panel_image);
  }

  return embed;
}

function buildVerificationPanelComponents() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verify_start")
        .setLabel("Verify me")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("verify_help")
        .setLabel("Help")
        .setStyle(ButtonStyle.Secondary)
    ),
  ];
}

async function sendVerificationPanel(guild, verificationSettings, options = {}) {
  const inspected = inspectVerificationConfiguration(
    guild,
    verificationSettings,
    options.guildSettings || null
  );

  if (inspected.errors.length > 0) {
    await verifLogs.add({
      guild_id: guild.id,
      actor_id: options.actorId || null,
      status: "permission_error",
      event: "panel_publish_failed",
      reason: inspected.errors.join(" | "),
      source: options.source || "verification.panel",
      metadata: {
        warnings: inspected.warnings,
      },
    }).catch(() => {});

    return {
      ok: false,
      errors: inspected.errors,
      warnings: inspected.warnings,
      channel: inspected.channel || null,
    };
  }

  const embed = buildVerificationPanelEmbed(guild, verificationSettings);
  const components = buildVerificationPanelComponents();
  const channel = inspected.channel;

  try {
    let message = null;
    let refreshed = false;

    if (verificationSettings?.panel_message_id) {
      message = await channel.messages.fetch(verificationSettings.panel_message_id).catch(() => null);
      if (message) {
        await message.edit({ embeds: [embed], components });
        refreshed = true;
      }
    }

    if (!message) {
      message = await channel.send({ embeds: [embed], components });
    }

    if (message?.id && verificationSettings?.panel_message_id !== message.id) {
      await verifSettings.update(guild.id, { panel_message_id: message.id });
    }

    await verifLogs.add({
      guild_id: guild.id,
      actor_id: options.actorId || null,
      status: "info",
      event: "panel_published",
      source: options.source || "verification.panel",
      metadata: {
        channel_id: channel.id,
        message_id: message?.id || null,
        refreshed,
        warnings: inspected.warnings,
      },
    }).catch(() => {});

    return {
      ok: true,
      refreshed,
      channel,
      messageId: message?.id || null,
      warnings: inspected.warnings,
    };
  } catch (error) {
    await verifLogs.add({
      guild_id: guild.id,
      actor_id: options.actorId || null,
      status: "permission_error",
      event: "panel_publish_failed",
      reason: error?.message || String(error),
      source: options.source || "verification.panel",
      metadata: {
        channel_id: channel.id,
      },
    }).catch(() => {});

    return {
      ok: false,
      errors: [
        `I could not send or edit the verification panel in ${channel}. Verify that I can send messages and embeds there.`,
      ],
      warnings: inspected.warnings,
      channel,
      error,
    };
  }
}

async function applyVerification(member, guild, verificationSettings, options = {}) {
  const verifiedRoleId = resolveVerifiedRoleId(verificationSettings, options.guildSettings || null);
  const unverifiedRoleId = resolveUnverifiedRoleId(verificationSettings);
  const verifiedRole = verifiedRoleId ? guild.roles.cache.get(verifiedRoleId) : null;
  const unverifiedRole = unverifiedRoleId ? guild.roles.cache.get(unverifiedRoleId) : null;
  const warnings = [];
  const errors = [];

  if (!verifiedRoleId || !verifiedRole) {
    errors.push("Verified role is not configured or no longer exists.");
    return { ok: false, errors, warnings };
  }

  if (!canManageRole(guild, verifiedRole)) {
    errors.push(`I cannot assign ${verifiedRole}. Move my role above it and keep \`Manage Roles\` enabled.`);
    return { ok: false, errors, warnings };
  }

  if (unverifiedRole && !canManageRole(guild, unverifiedRole)) {
    errors.push(`I cannot remove ${unverifiedRole}. Move my role above it and keep \`Manage Roles\` enabled.`);
    return { ok: false, errors, warnings };
  }

  let addedVerified = false;
  try {
    if (!member.roles.cache.has(verifiedRole.id)) {
      await member.roles.add(verifiedRole, options.reason || "Verification completed");
      addedVerified = true;
    }

    if (unverifiedRole && member.roles.cache.has(unverifiedRole.id)) {
      await member.roles.remove(unverifiedRole, options.reason || "Verification completed");
    }
  } catch (error) {
    if (addedVerified) {
      await member.roles.remove(verifiedRole).catch(() => {});
    }
    errors.push(error?.message || "I could not update the verification roles.");
    return { ok: false, errors, warnings };
  }

  try {
    const welcomeConfig = options.welcomeSettings || await welcomeSettings.get(guild.id);
    const autoRoleId = welcomeConfig?.welcome_autorole || null;
    if (autoRoleId) {
      const autoRole = guild.roles.cache.get(autoRoleId);
      if (!autoRole) {
        warnings.push("The welcome auto-role is configured but no longer exists.");
      } else if (!canManageRole(guild, autoRole)) {
        warnings.push(`I could not assign the welcome auto-role ${autoRole}.`);
      } else if (!member.roles.cache.has(autoRole.id)) {
        await member.roles.add(autoRole, options.reason || "Verification completed").catch(() => {
          warnings.push(`I could not assign the welcome auto-role ${autoRole}.`);
        });
      }
    }
  } catch (error) {
    warnings.push(error?.message || "I could not process the welcome auto-role.");
  }

  return {
    ok: true,
    warnings,
    verifiedRole,
    unverifiedRole,
  };
}

async function revokeVerification(member, guild, verificationSettings, options = {}) {
  const verifiedRoleId = resolveVerifiedRoleId(verificationSettings, options.guildSettings || null);
  const unverifiedRoleId = resolveUnverifiedRoleId(verificationSettings);
  const verifiedRole = verifiedRoleId ? guild.roles.cache.get(verifiedRoleId) : null;
  const unverifiedRole = unverifiedRoleId ? guild.roles.cache.get(unverifiedRoleId) : null;
  const warnings = [];
  const errors = [];

  if (verifiedRole && !canManageRole(guild, verifiedRole)) {
    errors.push(`I cannot remove ${verifiedRole}. Move my role above it and keep \`Manage Roles\` enabled.`);
    return { ok: false, errors, warnings };
  }

  if (unverifiedRole && !canManageRole(guild, unverifiedRole)) {
    errors.push(`I cannot assign ${unverifiedRole}. Move my role above it and keep \`Manage Roles\` enabled.`);
    return { ok: false, errors, warnings };
  }

  let removedVerified = false;
  try {
    if (verifiedRole && member.roles.cache.has(verifiedRole.id)) {
      await member.roles.remove(verifiedRole, options.reason || "Verification removed");
      removedVerified = true;
    }

    if (unverifiedRole && !member.roles.cache.has(unverifiedRole.id)) {
      await member.roles.add(unverifiedRole, options.reason || "Verification removed");
    }
  } catch (error) {
    if (removedVerified && verifiedRole) {
      await member.roles.add(verifiedRole).catch(() => {});
    }
    errors.push(error?.message || "I could not update the verification roles.");
    return { ok: false, errors, warnings };
  }

  return {
    ok: true,
    warnings,
    verifiedRole,
    unverifiedRole,
  };
}

module.exports = {
  VERIFICATION_LIMITS,
  buildModeLabel,
  normalizeVerificationAnswer,
  resolveVerifiedRoleId,
  resolveUnverifiedRoleId,
  inspectVerificationConfiguration,
  sendVerificationPanel,
  applyVerification,
  revokeVerification,
};
