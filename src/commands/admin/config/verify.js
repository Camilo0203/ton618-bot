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
const E = require("../../../utils/embeds");
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
  { name: "Button", value: "button" },
  { name: "DM code", value: "code" },
  { name: "Question", value: "question" },
];

const ANTI_RAID_ACTIONS = [
  { name: "Alert only", value: "pause" },
  { name: "Kick automatically", value: "kick" },
];

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

function buildIssueText(errors = [], warnings = []) {
  const lines = [];
  if (errors.length > 0) {
    lines.push(...errors.map((issue) => `- ${issue}`));
  }
  if (warnings.length > 0) {
    lines.push(...warnings.map((issue) => `- ${issue}`));
  }
  return lines.length > 0 ? lines.join("\n").slice(0, 1024) : "No issues detected.";
}

function buildRecentActivityText(entries = []) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return "No recent activity.";
  }

  return entries
    .map((entry) => {
      const ts = entry.created_at
        ? `<t:${Math.floor(new Date(entry.created_at).getTime() / 1000)}:R>`
        : "unknown time";
      const label = String(entry.event || entry.status || "event")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const userText = entry.user_id ? `<@${entry.user_id}>` : "System";
      return `- **${label}** • ${userText} • ${ts}`;
    })
    .join("\n")
    .slice(0, 1024);
}

function buildVerificationInfoEmbed(interaction, settingsRecord, guildSettings) {
  const inspected = inspectVerificationConfiguration(
    interaction.guild,
    settingsRecord,
    guildSettings
  );
  const autoKickText = settingsRecord?.kick_unverified_hours > 0
    ? `${settingsRecord.kick_unverified_hours}h`
    : "Disabled";

  const embed = new EmbedBuilder()
    .setTitle("Verification Configuration")
    .setColor(inspected.errors.length > 0 ? E.Colors.ERROR : E.Colors.SUCCESS)
    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    .addFields(
      { name: "State", value: settingsRecord?.enabled ? "Enabled" : "Disabled", inline: true },
      { name: "Mode", value: buildModeLabel(settingsRecord?.mode), inline: true },
      { name: "Channel", value: settingsRecord?.channel ? `<#${settingsRecord.channel}>` : "Not configured", inline: true },
      {
        name: "Verified role",
        value: resolveVerifiedRoleId(settingsRecord, guildSettings)
          ? `<@&${resolveVerifiedRoleId(settingsRecord, guildSettings)}>`
          : "Not configured",
        inline: true,
      },
      { name: "Unverified role", value: settingsRecord?.unverified_role ? `<@&${settingsRecord.unverified_role}>` : "Not configured", inline: true },
      { name: "Panel message", value: settingsRecord?.panel_message_id ? `\`${settingsRecord.panel_message_id}\`` : "Not published", inline: true },
      { name: "Log channel", value: settingsRecord?.log_channel ? `<#${settingsRecord.log_channel}>` : "Not configured", inline: true },
      { name: "Confirmation DM", value: settingsRecord?.dm_on_verify ? "Enabled" : "Disabled", inline: true },
      { name: "Auto-kick", value: autoKickText, inline: true },
      { name: "Anti-raid", value: settingsRecord?.antiraid_enabled ? "Enabled" : "Disabled", inline: true },
      {
        name: "Operational health",
        value: inspected.errors.length > 0 ? "Needs attention" : inspected.warnings.length > 0 ? "Operational with warnings" : "Ready",
        inline: true,
      },
      {
        name: "Issues",
        value: buildIssueText(inspected.errors, inspected.warnings),
        inline: false,
      }
    )
    .setFooter({
      text:
        `Protection: ${VERIFICATION_LIMITS.maxFailuresBeforeCooldown} failed attempts -> ${VERIFICATION_LIMITS.failureCooldownMinutes}m cooldown`,
    })
    .setTimestamp();

  if (settingsRecord?.antiraid_enabled) {
    embed.addFields(
      {
        name: "Raid threshold",
        value: `${settingsRecord.antiraid_joins} joins / ${settingsRecord.antiraid_seconds}s`,
        inline: true,
      },
      {
        name: "Raid action",
        value: settingsRecord.antiraid_action === "kick" ? "Kick automatically" : "Alert only",
        inline: true,
      }
    );
  }

  if (settingsRecord?.mode === "question") {
    embed.addFields(
      {
        name: "Question",
        value: settingsRecord.question || "Not configured",
        inline: false,
      },
      {
        name: "Expected answer",
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

async function publishPanelOrReturnError(interaction, verificationSettings, guildSettings, source) {
  const result = await sendVerificationPanel(interaction.guild, verificationSettings, {
    guildSettings,
    actorId: interaction.user.id,
    source,
  });

  if (!result.ok) {
    return {
      ok: false,
      payload: {
        embeds: [
          E.errorEmbed(
            `The verification configuration was saved, but the panel could not be published.\n\n${buildIssueText(result.errors, result.warnings)}`
          ),
        ],
        flags: 64,
      },
    };
  }

  const warningText = result.warnings.length > 0
    ? `\n\nWarnings:\n${buildIssueText([], result.warnings)}`
    : "";

  return {
    ok: true,
    detail: `${result.refreshed ? "Verification panel refreshed." : "Verification panel published."}${warningText}`,
  };
}

module.exports = {
  meta: { scope: "admin" },
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Configure the verification system")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Run a guided verification setup")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Verification channel")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("verified_role")
            .setDescription("Role granted after verification")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("mode")
            .setDescription("Verification mode")
            .setRequired(true)
            .addChoices(...MODE_CHOICES)
        )
        .addRoleOption((option) =>
          option
            .setName("unverified_role")
            .setDescription("Optional temporary role for new members")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("panel")
        .setDescription("Send or refresh the verification panel")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enabled")
        .setDescription("Enable or disable verification")
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription("Turn verification on or off")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mode")
        .setDescription("Change the verification mode")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Verification mode")
            .setRequired(true)
            .addChoices(...MODE_CHOICES)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("question")
        .setDescription("Configure the question challenge")
        .addStringOption((option) =>
          option
            .setName("prompt")
            .setDescription("Question shown to the member")
            .setRequired(true)
            .setMaxLength(200)
        )
        .addStringOption((option) =>
          option
            .setName("answer")
            .setDescription("Correct answer")
            .setRequired(true)
            .setMaxLength(100)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("message")
        .setDescription("Customize the verification panel copy")
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("Panel title")
            .setRequired(false)
            .setMaxLength(100)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Panel description")
            .setRequired(false)
            .setMaxLength(1000)
        )
        .addStringOption((option) =>
          option
            .setName("color")
            .setDescription("Hex color without #, for example 57F287")
            .setRequired(false)
            .setMaxLength(6)
        )
        .addStringOption((option) =>
          option
            .setName("image")
            .setDescription("Image URL for the panel")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("dm")
        .setDescription("Enable or disable the confirmation DM")
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription("Send a DM after successful verification")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("auto-kick")
        .setDescription("Kick unverified members after X hours")
        .addIntegerOption((option) =>
          option
            .setName("hours")
            .setDescription("Hours before kick. Use 0 to disable.")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(168)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("anti-raid")
        .setDescription("Configure anti-raid protection")
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription("Enable or disable anti-raid")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("joins")
            .setDescription("Join threshold before alerting")
            .setRequired(false)
            .setMinValue(3)
            .setMaxValue(50)
        )
        .addIntegerOption((option) =>
          option
            .setName("seconds")
            .setDescription("Time window in seconds")
            .setRequired(false)
            .setMinValue(5)
            .setMaxValue(60)
        )
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("Action taken when a raid is detected")
            .setRequired(false)
            .addChoices(...ANTI_RAID_ACTIONS)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("logs")
        .setDescription("Set the verification log channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Verification log channel")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("force")
        .setDescription("Verify a member manually")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Member to verify")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unverify")
        .setDescription("Remove verification from a member")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Member to unverify")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stats")
        .setDescription("View verification stats")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("View the current verification configuration")
    ),

  async execute(interaction) {
    const rawSubcommand = interaction.options.getSubcommand();
    const subcommand = normalizeSubcommand(rawSubcommand);
    const guildId = interaction.guild.id;
    const [verificationSettings, guildSettings] = await Promise.all([
      verifSettings.get(guildId),
      settings.get(guildId),
    ]);

    const ok = (message) => interaction.reply({ embeds: [E.successEmbed(message)], flags: 64 });
    const er = (message) => interaction.reply({ embeds: [E.errorEmbed(message)], flags: 64 });

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
        guildSettings
      );
      if (inspection.errors.length > 0) {
        return er(`I cannot finish the setup yet.\n\n${buildIssueText(inspection.errors, inspection.warnings)}`);
      }

      await verifSettings.update(guildId, nextSettings);

      let alignedTicketRole = false;
      if (!guildSettings?.verify_role) {
        await settings.update(guildId, { verify_role: verifiedRole.id });
        alignedTicketRole = true;
      }

      const updatedSettings = await verifSettings.get(guildId);
      const panelResult = await publishPanelOrReturnError(
        interaction,
        updatedSettings,
        await settings.get(guildId),
        "command.verify.setup"
      );
      if (!panelResult.ok) {
        return interaction.reply(panelResult.payload);
      }

      const notes = [];
      if (alignedTicketRole) {
        notes.push("Ticket minimum verification role was aligned automatically because it was not set.");
      }
      if (mode === "question") {
        notes.push("Question mode is active. Use `/verify question` if you want to replace the default challenge.");
      }

      const embed = new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("Verification Ready")
        .setDescription("The verification system is configured and the live panel is available.")
        .addFields(
          { name: "Channel", value: `<#${channel.id}>`, inline: true },
          { name: "Verified role", value: `<@&${verifiedRole.id}>`, inline: true },
          { name: "Mode", value: buildModeLabel(mode), inline: true },
          { name: "Unverified role", value: unverifiedRole ? `<@&${unverifiedRole.id}>` : "None", inline: true },
          { name: "Panel", value: panelResult.detail, inline: false }
        )
        .setTimestamp();

      if (notes.length > 0) {
        embed.addFields({
          name: "Notes",
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
        guildSettings
      );
      if (inspection.errors.length > 0) {
        return er(`I cannot publish the verification panel.\n\n${buildIssueText(inspection.errors, inspection.warnings)}`);
      }

      await interaction.deferReply({ flags: 64 });
      const result = await sendVerificationPanel(interaction.guild, verificationSettings, {
        guildSettings,
        actorId: interaction.user.id,
        source: "command.verify.panel",
      });
      if (!result.ok) {
        return interaction.editReply({
          embeds: [
            E.errorEmbed(
              `The verification panel could not be published.\n\n${buildIssueText(result.errors, result.warnings)}`
            ),
          ],
        });
      }

      const warningText = result.warnings.length > 0
        ? `\n\nWarnings:\n${buildIssueText([], result.warnings)}`
        : "";

      return interaction.editReply({
        embeds: [
          E.successEmbed(
            `${result.refreshed ? "Verification panel refreshed." : "Verification panel published."}${warningText}`
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
          guildSettings
        );
        if (inspection.errors.length > 0) {
          return er(`I cannot enable verification yet.\n\n${buildIssueText(inspection.errors, inspection.warnings)}`);
        }
      }

      await verifSettings.update(guildId, { enabled });
      return ok(`Verification is now **${enabled ? "enabled" : "disabled"}**.`);
    }

    if (subcommand === "mode") {
      const type = getStringOption(interaction, "type", "tipo");
      const inspection = inspectVerificationConfiguration(
        interaction.guild,
        { ...verificationSettings, mode: type },
        guildSettings
      );
      if (inspection.errors.length > 0) {
        return er(`I cannot switch to **${buildModeLabel(type)}** yet.\n\n${buildIssueText(inspection.errors, inspection.warnings)}`);
      }

      await verifSettings.update(guildId, { mode: type });
      const updatedSettings = await verifSettings.get(guildId);
      const panelResult = await publishPanelOrReturnError(
        interaction,
        updatedSettings,
        guildSettings,
        "command.verify.mode"
      );
      if (!panelResult.ok) {
        return interaction.reply(panelResult.payload);
      }

      return ok(`Verification mode changed to **${buildModeLabel(type)}**. ${panelResult.detail}`);
    }

    if (subcommand === "question") {
      const prompt = getStringOption(interaction, "prompt", "pregunta");
      const answer = getStringOption(interaction, "answer", "respuesta");
      await verifSettings.update(guildId, {
        question: prompt,
        question_answer: normalizeVerificationAnswer(answer),
      });
      return ok("Verification question updated.");
    }

    if (subcommand === "message") {
      const title = getStringOption(interaction, "title", "titulo");
      const description = getStringOption(interaction, "description", "descripcion");
      const color = getStringOption(interaction, "color");
      const image = getStringOption(interaction, "image", "imagen");

      if (!title && !description && !color && !image) {
        return er("Provide at least one field to update: `title`, `description`, `color`, or `image`.");
      }

      if (color && !/^[0-9A-Fa-f]{6}$/.test(color)) {
        return er("Invalid color. Use a 6-character hex value like `57F287`.");
      }

      if (image && !/^https:\/\//i.test(image)) {
        return er("Image URL must start with `https://`.");
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
        "command.verify.message"
      );
      if (!panelResult.ok) {
        return interaction.reply(panelResult.payload);
      }

      return ok(`Verification panel updated. ${panelResult.detail}`);
    }

    if (subcommand === "dm") {
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      await verifSettings.update(guildId, { dm_on_verify: enabled });
      return ok(`Verification confirmation DM is now **${enabled ? "enabled" : "disabled"}**.`);
    }

    if (subcommand === "auto-kick") {
      const hours = getIntegerOption(interaction, "hours", "horas");
      await verifSettings.update(guildId, { kick_unverified_hours: hours });
      return ok(
        hours === 0
          ? "Auto-kick for unverified members is now **disabled**."
          : `Unverified members will be kicked after **${hours} hour(s)**.`,
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
          ? "Anti-raid is now **enabled**.\n" +
            `Threshold: **${updatedSettings.antiraid_joins} joins** in **${updatedSettings.antiraid_seconds}s**.\n` +
            `Action: **${updatedSettings.antiraid_action === "kick" ? "Kick automatically" : "Alert only"}**.`
          : "Anti-raid is now **disabled**.",
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
        return er(`I cannot use ${channel} for verification logs. Missing permissions: ${missingPermissions.map((permission) => `\`${permission}\``).join(", ")}.`);
      }

      await verifSettings.update(guildId, { log_channel: channel.id });
      return ok(`Verification logs will be sent to ${channel}.`);
    }

    if (subcommand === "force") {
      const user = getUserOption(interaction, "user", "usuario");
      if (user.bot) {
        return er("Bots cannot be verified through the member verification flow.");
      }

      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) {
        return er("That user is not in this server.");
      }

      const result = await applyVerification(member, interaction.guild, verificationSettings, {
        guildSettings,
        reason: `Forced by ${interaction.user.tag}`,
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
        return er(`I could not verify <@${user.id}>.\n\n${buildIssueText(result.errors, result.warnings)}`);
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
          .setTitle("Member force-verified")
          .addFields(
            { name: "Member", value: `${user.tag} (<@${user.id}>)`, inline: true },
            { name: "Actor", value: `${interaction.user.tag} (<@${interaction.user.id}>)`, inline: true },
            { name: "Mode", value: buildModeLabel(verificationSettings.mode), inline: true }
          )
          .setTimestamp()
      );

      const warningText = result.warnings.length > 0
        ? `\n\nWarnings:\n${buildIssueText([], result.warnings)}`
        : "";

      return ok(`<@${user.id}> was verified manually.${warningText}`);
    }

    if (subcommand === "unverify") {
      const user = getUserOption(interaction, "user", "usuario");
      if (user.bot) {
        return er("Bots do not use the member verification flow.");
      }

      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) {
        return er("That user is not in this server.");
      }

      const result = await revokeVerification(member, interaction.guild, verificationSettings, {
        guildSettings,
        reason: `Removed by ${interaction.user.tag}`,
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
        return er(`I could not remove verification from <@${user.id}>.\n\n${buildIssueText(result.errors, result.warnings)}`);
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
          .setTitle("Member unverified")
          .addFields(
            { name: "Member", value: `${user.tag} (<@${user.id}>)`, inline: true },
            { name: "Actor", value: `${interaction.user.tag} (<@${interaction.user.id}>)`, inline: true }
          )
          .setTimestamp()
      );

      const warningText = result.warnings.length > 0
        ? `\n\nWarnings:\n${buildIssueText([], result.warnings)}`
        : "";

      return ok(`Verification removed from <@${user.id}>.${warningText}`);
    }

    if (subcommand === "stats") {
      const [stats, recentEntries] = await Promise.all([
        verifLogs.getStats(guildId),
        verifLogs.getRecent(guildId, 6),
      ]);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Verification Stats")
            .setColor(E.Colors.SUCCESS)
            .addFields(
              { name: "Verified", value: `\`${stats.verified}\``, inline: true },
              { name: "Failed", value: `\`${stats.failed}\``, inline: true },
              { name: "Kicked", value: `\`${stats.kicked}\``, inline: true },
              { name: "Starts", value: `\`${stats.starts}\``, inline: true },
              { name: "Force verified", value: `\`${stats.force_verified}\``, inline: true },
              { name: "Force unverified", value: `\`${stats.force_unverified}\``, inline: true },
              { name: "Pending members", value: `\`${stats.pending_members}\``, inline: true },
              { name: "Verified members", value: `\`${stats.verified_members}\``, inline: true },
              { name: "Code sends", value: `\`${stats.code_sent}\``, inline: true },
              { name: "Question prompts", value: `\`${stats.question_prompt}\``, inline: true },
              { name: "Anti-raid triggers", value: `\`${stats.anti_raid_triggers}\``, inline: true },
              { name: "Permission errors", value: `\`${stats.permission_errors}\``, inline: true },
              { name: "Recent activity", value: buildRecentActivityText(recentEntries), inline: false },
            )
            .setFooter({ text: `Stored verification events: ${stats.total}` })
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (subcommand === "info") {
      return interaction.reply({
        embeds: [buildVerificationInfoEmbed(interaction, verificationSettings, guildSettings)],
        flags: 64,
      });
    }

    return interaction.reply({
      embeds: [E.errorEmbed("Unknown verification subcommand.")],
      flags: 64,
    });
  },
};
module.exports.sendVerifPanel = sendVerificationPanel;
module.exports.applyVerification = applyVerification;
