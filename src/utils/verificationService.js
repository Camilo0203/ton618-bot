"use strict";

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const { verifSettings, welcomeSettings, verifLogs } = require("./database");
const { t } = require("./i18n");

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
  codeLength: 8,
  minJoinAgeSeconds: 30,
  maxCodeResendsPerSession: 5,
};

function buildModeLabel(mode, language = "en") {
  const normalized = String(mode || "").trim().toLowerCase();
  return t(language, `verify.mode.${normalized}`);
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

function formatPermissionList(missingPermissions = [], language = "en") {
  if (!Array.isArray(missingPermissions) || missingPermissions.length === 0) {
    return t(language, "common.value.none").toLowerCase();
  }
  return missingPermissions.map((permission) => `\`${permission}\``).join(", ");
}

function getMissingChannelPermissions(channel) {
  const permissions = channel?.permissionsFor?.(channel.guild?.members?.me);
  if (!permissions) return PANEL_PERMISSION_KEYS;
  return PANEL_PERMISSION_KEYS.filter(
    (permission) => !permissions.has(PermissionFlagsBits[permission])
  );
}

function canManageRole(guild, role) {
  if (!guild?.members?.me || !role) return false;
  if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return false;
  return role.editable === true || role.position < guild.members.me.roles.highest.position;
}

function inspectVerificationConfiguration(
  guild,
  verificationSettings,
  guildSettings = null,
  options = {}
) {
  const language = options.language || "en";
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
      errors.push(t(language, "verify.inspection.channel_missing"));
    } else if (!channel) {
      errors.push(t(language, "verify.inspection.channel_deleted"));
    } else {
      const missingChannelPermissions = getMissingChannelPermissions(channel);
      if (missingChannelPermissions.length > 0) {
        errors.push(
          t(language, "verify.inspection.channel_permissions", {
            channel,
            permissions: formatPermissionList(missingChannelPermissions, language),
          })
        );
      }
    }
  } else if (verificationSettings?.channel && !channel) {
    warnings.push(t(language, "verify.inspection.channel_deleted"));
  }

  if (!verifiedRoleId) {
    errors.push(t(language, "verify.inspection.verified_role_missing"));
  } else if (!verifiedRole) {
    errors.push(t(language, "verify.inspection.verified_role_deleted"));
  } else if (verifiedRole.managed) {
    errors.push(t(language, "verify.inspection.verified_role_managed"));
  } else if (!canManageRole(guild, verifiedRole)) {
    errors.push(
      t(language, "verify.inspection.verified_role_unmanageable", {
        role: verifiedRole,
      })
    );
  }

  if (unverifiedRoleId) {
    if (!unverifiedRole) {
      warnings.push(t(language, "verify.inspection.unverified_role_deleted"));
    } else if (unverifiedRole.managed) {
      errors.push(t(language, "verify.inspection.unverified_role_managed"));
    } else if (!canManageRole(guild, unverifiedRole)) {
      errors.push(
        t(language, "verify.inspection.unverified_role_unmanageable", {
          role: unverifiedRole,
        })
      );
    }
  }

  if (verifiedRoleId && unverifiedRoleId && verifiedRoleId === unverifiedRoleId) {
    errors.push(t(language, "verify.inspection.roles_same"));
  }

  if (verificationSettings?.mode === "question") {
    if (!String(verificationSettings?.question || "").trim()) {
      errors.push(t(language, "verify.inspection.question_missing"));
    }
    if (!String(verificationSettings?.question_answer || "").trim()) {
      errors.push(t(language, "verify.inspection.answer_missing"));
    }
  }

  if (verificationSettings?.mode === "button" && verificationSettings?.antiraid_enabled) {
    warnings.push(t(language, "verify.inspection.button_mode_antiraid_warning"));
  }

  if (verificationSettings?.log_channel && !logChannel) {
    warnings.push(t(language, "verify.inspection.log_channel_deleted"));
  } else if (logChannel) {
    const missingLogPermissions = getMissingChannelPermissions(logChannel);
    if (missingLogPermissions.length > 0) {
      warnings.push(
        t(language, "verify.inspection.log_channel_permissions", {
          channel: logChannel,
          permissions: formatPermissionList(missingLogPermissions, language),
        })
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

function buildVerificationPanelEmbed(guild, verificationSettings, language = "en") {
  const color = parseInt(verificationSettings?.panel_color || "57F287", 16);
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(verificationSettings?.panel_title || t(language, "verify.panel.title"))
    .setDescription(
      `${verificationSettings?.panel_description || t(language, "verify.panel.description")}\n\n` +
      `**${t(language, "common.labels.mode")}:** ${buildModeLabel(
        verificationSettings?.mode,
        language
      )}`
    )
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({
      text: t(language, "verify.panel.footer", { guild: guild.name }),
      iconURL: guild.iconURL({ dynamic: true }) || undefined,
    })
    .setTimestamp();

  if (verificationSettings?.panel_image) {
    embed.setImage(verificationSettings.panel_image);
  }

  return embed;
}

function buildVerificationPanelComponents(language = "en") {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verify_start")
        .setLabel(t(language, "verify.panel.start_label"))
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("verify_help")
        .setLabel(t(language, "verify.panel.help_label"))
        .setStyle(ButtonStyle.Secondary)
    ),
  ];
}

async function sendVerificationPanel(guild, verificationSettings, options = {}) {
  const language = options.language || "en";
  const inspected = inspectVerificationConfiguration(
    guild,
    verificationSettings,
    options.guildSettings || null,
    { language }
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
    }).catch((err) => { console.error("[verificationService] suppressed error:", err?.message || err); });

    return {
      ok: false,
      errors: inspected.errors,
      warnings: inspected.warnings,
      channel: inspected.channel || null,
    };
  }

  const embed = buildVerificationPanelEmbed(guild, verificationSettings, language);
  const components = buildVerificationPanelComponents(language);
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
    }).catch((err) => { console.error("[verificationService] suppressed error:", err?.message || err); });

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
    }).catch((err) => { console.error("[verificationService] suppressed error:", err?.message || err); });

    return {
      ok: false,
      errors: [
        t(language, "verify.inspection.publish_failed", {
          channel,
        }),
      ],
      warnings: inspected.warnings,
      channel,
      error,
    };
  }
}

async function applyVerification(member, guild, verificationSettings, options = {}) {
  const language = options.language || "en";
  const verifiedRoleId = resolveVerifiedRoleId(verificationSettings, options.guildSettings || null);
  const unverifiedRoleId = resolveUnverifiedRoleId(verificationSettings);
  const verifiedRole = verifiedRoleId ? guild.roles.cache.get(verifiedRoleId) : null;
  const unverifiedRole = unverifiedRoleId ? guild.roles.cache.get(unverifiedRoleId) : null;
  const warnings = [];
  const errors = [];

  if (!verifiedRoleId || !verifiedRole) {
    errors.push(t(language, "verify.inspection.apply_verified_missing"));
    return { ok: false, errors, warnings };
  }

  if (!canManageRole(guild, verifiedRole)) {
    errors.push(
      t(language, "verify.inspection.apply_verified_unmanageable", {
        role: verifiedRole,
      })
    );
    return { ok: false, errors, warnings };
  }

  if (unverifiedRole && !canManageRole(guild, unverifiedRole)) {
    errors.push(
      t(language, "verify.inspection.apply_unverified_unmanageable", {
        role: unverifiedRole,
      })
    );
    return { ok: false, errors, warnings };
  }

  let addedVerified = false;
  try {
    const auditReason = options.reason || t(language, "verify.audit.completed");
    if (!member.roles.cache.has(verifiedRole.id)) {
      await member.roles.add(verifiedRole, auditReason);
      addedVerified = true;
    }

    if (unverifiedRole && member.roles.cache.has(unverifiedRole.id)) {
      await member.roles.remove(unverifiedRole, auditReason);
    }
  } catch (error) {
    if (addedVerified) {
      await member.roles.remove(verifiedRole).catch((err) => { console.error("[verificationService] suppressed error:", err?.message || err); });
    }
    errors.push(error?.message || t(language, "verify.inspection.apply_role_update_failed"));
    return { ok: false, errors, warnings };
  }

  try {
    const welcomeConfig = options.welcomeSettings || await welcomeSettings.get(guild.id);
    const autoRoleId = welcomeConfig?.welcome_autorole || null;
    if (autoRoleId) {
      const autoRole = guild.roles.cache.get(autoRoleId);
      if (!autoRole) {
        warnings.push(t(language, "verify.inspection.welcome_autorole_missing"));
      } else if (!canManageRole(guild, autoRole)) {
        warnings.push(
          t(language, "verify.inspection.welcome_autorole_failed", {
            role: autoRole,
          })
        );
      } else if (!member.roles.cache.has(autoRole.id)) {
        await member.roles.add(autoRole, options.reason || t(language, "verify.audit.completed")).catch(() => {
          warnings.push(
            t(language, "verify.inspection.welcome_autorole_failed", {
              role: autoRole,
            })
          );
        });
      }
    }
  } catch (error) {
    warnings.push(
      error?.message || t(language, "verify.inspection.welcome_autorole_process_failed")
    );
  }

  return {
    ok: true,
    warnings,
    verifiedRole,
    unverifiedRole,
  };
}

async function revokeVerification(member, guild, verificationSettings, options = {}) {
  const language = options.language || "en";
  const verifiedRoleId = resolveVerifiedRoleId(verificationSettings, options.guildSettings || null);
  const unverifiedRoleId = resolveUnverifiedRoleId(verificationSettings);
  const verifiedRole = verifiedRoleId ? guild.roles.cache.get(verifiedRoleId) : null;
  const unverifiedRole = unverifiedRoleId ? guild.roles.cache.get(unverifiedRoleId) : null;
  const warnings = [];
  const errors = [];

  if (verifiedRole && !canManageRole(guild, verifiedRole)) {
    errors.push(
      t(language, "verify.inspection.revoke_verified_unmanageable", {
        role: verifiedRole,
      })
    );
    return { ok: false, errors, warnings };
  }

  if (unverifiedRole && !canManageRole(guild, unverifiedRole)) {
    errors.push(
      t(language, "verify.inspection.revoke_unverified_unmanageable", {
        role: unverifiedRole,
      })
    );
    return { ok: false, errors, warnings };
  }

  let removedVerified = false;
  try {
    const auditReason = options.reason || t(language, "verify.audit.removed");
    if (verifiedRole && member.roles.cache.has(verifiedRole.id)) {
      await member.roles.remove(verifiedRole, auditReason);
      removedVerified = true;
    }

    if (unverifiedRole && !member.roles.cache.has(unverifiedRole.id)) {
      await member.roles.add(unverifiedRole, auditReason);
    }
  } catch (error) {
    if (removedVerified && verifiedRole) {
      await member.roles.add(verifiedRole).catch((err) => { console.error("[verificationService] suppressed error:", err?.message || err); });
    }
    errors.push(error?.message || t(language, "verify.inspection.revoke_role_update_failed"));
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
