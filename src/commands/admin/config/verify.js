"use strict";

const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const {
  verifSettings,
  verifLogs,
  welcomeSettings,
} = require("../../../utils/database");
const E = require("../../../utils/embeds");

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

function buildModeLabel(mode) {
  return {
    button: "Button",
    code: "DM code",
    question: "Question",
  }[mode] || mode || "Not configured";
}

function buildVerificationInfoEmbed(interaction, settingsRecord) {
  const enabledText = settingsRecord?.enabled ? "Enabled" : "Disabled";
  const autoKickText = settingsRecord?.kick_unverified_hours > 0
    ? `${settingsRecord.kick_unverified_hours}h`
    : "Disabled";

  const embed = new EmbedBuilder()
    .setTitle("Verification Configuration")
    .setColor(settingsRecord?.enabled ? 0x57F287 : 0xED4245)
    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    .addFields(
      { name: "State", value: enabledText, inline: true },
      { name: "Mode", value: buildModeLabel(settingsRecord?.mode), inline: true },
      { name: "Channel", value: settingsRecord?.channel ? `<#${settingsRecord.channel}>` : "Not configured", inline: true },
      { name: "Verified role", value: settingsRecord?.verified_role ? `<@&${settingsRecord.verified_role}>` : "Not configured", inline: true },
      { name: "Unverified role", value: settingsRecord?.unverified_role ? `<@&${settingsRecord.unverified_role}>` : "Not configured", inline: true },
      { name: "Log channel", value: settingsRecord?.log_channel ? `<#${settingsRecord.log_channel}>` : "Not configured", inline: true },
      { name: "Confirmation DM", value: settingsRecord?.dm_on_verify ? "Enabled" : "Disabled", inline: true },
      { name: "Auto-kick", value: autoKickText, inline: true },
      { name: "Anti-raid", value: settingsRecord?.antiraid_enabled ? "Enabled" : "Disabled", inline: true },
    )
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
      },
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
      },
    );
  }

  return embed;
}

module.exports = {
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
    const verificationSettings = await verifSettings.get(guildId);

    const ok = (message) => interaction.reply({ embeds: [E.successEmbed(message)], flags: 64 });
    const er = (message) => interaction.reply({ embeds: [E.errorEmbed(message)], flags: 64 });

    if (subcommand === "setup") {
      const channel = getChannelOption(interaction, "channel", "canal");
      const verifiedRole = getRoleOption(interaction, "verified_role", "rol_verificado");
      const mode = getStringOption(interaction, "mode", "modo");
      const unverifiedRole = getRoleOption(interaction, "unverified_role", "rol_no_verificado");

      await verifSettings.update(guildId, {
        enabled: true,
        channel: channel.id,
        verified_role: verifiedRole.id,
        mode,
        unverified_role: unverifiedRole?.id || null,
      });

      const updatedSettings = await verifSettings.get(guildId);
      await sendVerifPanel(interaction.guild, updatedSettings);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(E.Colors.SUCCESS)
            .setTitle("Verification Ready")
            .setDescription("The verification system is now configured.")
            .addFields(
              { name: "Channel", value: `<#${channel.id}>`, inline: true },
              { name: "Verified role", value: `<@&${verifiedRole.id}>`, inline: true },
              { name: "Mode", value: buildModeLabel(mode), inline: true },
              { name: "Unverified role", value: unverifiedRole ? `<@&${unverifiedRole.id}>` : "None", inline: true },
            )
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (subcommand === "panel") {
      if (!verificationSettings?.channel) {
        return er("Set a verification channel first with `/verify setup`.");
      }

      await interaction.deferReply({ flags: 64 });
      await sendVerifPanel(interaction.guild, verificationSettings);
      return interaction.editReply({
        embeds: [E.successEmbed("Verification panel sent or refreshed.")],
      });
    }

    if (subcommand === "enabled") {
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      if (enabled && !verificationSettings?.channel) {
        return er("Set a verification channel first with `/verify setup`.");
      }

      await verifSettings.update(guildId, { enabled });
      return ok(`Verification is now **${enabled ? "enabled" : "disabled"}**.`);
    }

    if (subcommand === "mode") {
      const type = getStringOption(interaction, "type", "tipo");
      await verifSettings.update(guildId, { mode: type });
      const updatedSettings = await verifSettings.get(guildId);
      await sendVerifPanel(interaction.guild, updatedSettings);
      return ok(`Verification mode changed to **${buildModeLabel(type)}**. The panel was refreshed automatically.`);
    }

    if (subcommand === "question") {
      const prompt = getStringOption(interaction, "prompt", "pregunta");
      const answer = getStringOption(interaction, "answer", "respuesta");
      await verifSettings.update(guildId, {
        question: prompt,
        question_answer: answer.toLowerCase().trim(),
      });
      return ok(`Verification question updated.\n**Prompt:** ${prompt}\n**Answer:** ${answer}`);
    }

    if (subcommand === "message") {
      const title = getStringOption(interaction, "title", "titulo");
      const description = getStringOption(interaction, "description", "descripcion");
      const color = getStringOption(interaction, "color");
      const image = getStringOption(interaction, "image", "imagen");

      if (color && !/^[0-9A-Fa-f]{6}$/.test(color)) {
        return er("Invalid color. Use a 6-character hex value like `57F287`.");
      }

      if (image && !image.startsWith("http")) {
        return er("Image URL must start with `https://`.");
      }

      const patch = {};
      if (title) patch.panel_title = title;
      if (description) patch.panel_description = description;
      if (color) patch.panel_color = color;
      if (image) patch.panel_image = image;

      await verifSettings.update(guildId, patch);
      const updatedSettings = await verifSettings.get(guildId);
      await sendVerifPanel(interaction.guild, updatedSettings);
      return ok("Verification panel updated.");
    }

    if (subcommand === "dm") {
      const enabled = getBooleanOption(interaction, "enabled", "estado");
      await verifSettings.update(guildId, { dm_on_verify: enabled });
      return ok(`Verification confirmation DM: **${enabled ? "enabled" : "disabled"}**.`);
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
      if (joins) patch.antiraid_joins = joins;
      if (seconds) patch.antiraid_seconds = seconds;
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
      await verifSettings.update(guildId, { log_channel: channel.id });
      return ok(`Verification logs will be sent to ${channel}.`);
    }

    if (subcommand === "force") {
      const user = getUserOption(interaction, "user", "usuario");
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) {
        return er("That user is not in this server.");
      }

      await applyVerification(member, interaction.guild, verificationSettings, "Manual verification");
      await verifLogs.add(guildId, user.id, "verified", `Forced by ${interaction.user.tag}`);
      return ok(`<@${user.id}> was verified manually.`);
    }

    if (subcommand === "unverify") {
      const user = getUserOption(interaction, "user", "usuario");
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) {
        return er("That user is not in this server.");
      }

      if (verificationSettings?.verified_role) {
        const verifiedRole = interaction.guild.roles.cache.get(verificationSettings.verified_role);
        if (verifiedRole) await member.roles.remove(verifiedRole).catch(() => {});
      }
      if (verificationSettings?.unverified_role) {
        const unverifiedRole = interaction.guild.roles.cache.get(verificationSettings.unverified_role);
        if (unverifiedRole) await member.roles.add(unverifiedRole).catch(() => {});
      }

      await verifLogs.add(guildId, user.id, "unverified", `By ${interaction.user.tag}`);
      return ok(`Verification removed from <@${user.id}>.`);
    }

    if (subcommand === "stats") {
      const stats = await verifLogs.getStats(guildId);
      const recentEntries = await verifLogs.getRecent(guildId, 5);
      const recentText = recentEntries.length
        ? recentEntries.map((entry) => {
          const icon = entry.status === "verified" ? "OK" : entry.status === "failed" ? "ERR" : "KICK";
          return `${icon} <@${entry.user_id}> - <t:${Math.floor(new Date(entry.created_at).getTime() / 1000)}:R>`;
        }).join("\n")
        : "No recent activity";

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Verification Stats")
            .setColor(0x57F287)
            .addFields(
              { name: "Verified", value: `\`${stats.verified}\``, inline: true },
              { name: "Failed", value: `\`${stats.failed}\``, inline: true },
              { name: "Kicked", value: `\`${stats.kicked}\``, inline: true },
              { name: "Total records", value: `\`${stats.total}\``, inline: true },
              { name: "Recent activity", value: recentText, inline: false },
            )
            .setTimestamp(),
        ],
        flags: 64,
      });
    }

    if (subcommand === "info") {
      return interaction.reply({
        embeds: [buildVerificationInfoEmbed(interaction, verificationSettings)],
        flags: 64,
      });
    }

    return interaction.reply({
      embeds: [E.errorEmbed("Unknown verification subcommand.")],
      flags: 64,
    });
  },
};

async function sendVerifPanel(guild, verificationSettings) {
  if (!verificationSettings?.channel) return;

  const channel = guild.channels.cache.get(verificationSettings.channel);
  if (!channel) return;

  const color = parseInt(verificationSettings.panel_color || "57F287", 16);
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(verificationSettings.panel_title || "Verification")
    .setDescription(
      (verificationSettings.panel_description
        || "You need to verify before accessing the server. Click the button below to begin.")
      + `\n\n**Mode:** ${buildModeLabel(verificationSettings.mode)}`,
    )
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({
      text: `${guild.name} - Verification System`,
      iconURL: guild.iconURL({ dynamic: true }),
    })
    .setTimestamp();

  if (verificationSettings.panel_image) {
    embed.setImage(verificationSettings.panel_image);
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("verify_start")
      .setLabel("Verify me")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("verify_help")
      .setLabel("Help")
      .setStyle(ButtonStyle.Secondary),
  );

  if (verificationSettings.panel_message_id) {
    try {
      const existingMessage = await channel.messages.fetch(verificationSettings.panel_message_id);
      await existingMessage.edit({ embeds: [embed], components: [row] });
      return;
    } catch (_) {}
  }

  const createdMessage = await channel.send({ embeds: [embed], components: [row] });
  await verifSettings.update(guild.id, { panel_message_id: createdMessage.id });
}

async function applyVerification(member, guild, verificationSettings) {
  if (verificationSettings?.verified_role) {
    const verifiedRole = guild.roles.cache.get(verificationSettings.verified_role);
    if (verifiedRole) await member.roles.add(verifiedRole).catch(() => {});
  }

  if (verificationSettings?.unverified_role) {
    const unverifiedRole = guild.roles.cache.get(verificationSettings.unverified_role);
    if (unverifiedRole) await member.roles.remove(unverifiedRole).catch(() => {});
  }

  const welcomeSettingsRecord = await welcomeSettings.get(guild.id);
  if (welcomeSettingsRecord?.welcome_autorole) {
    const autoRole = guild.roles.cache.get(welcomeSettingsRecord.welcome_autorole);
    if (autoRole) await member.roles.add(autoRole).catch(() => {});
  }
}

module.exports.sendVerifPanel = sendVerifPanel;
module.exports.applyVerification = applyVerification;
