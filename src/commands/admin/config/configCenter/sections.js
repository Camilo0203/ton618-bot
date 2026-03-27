const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  ChannelType,
} = require("discord.js");
const {
  settings,
  verifSettings,
  welcomeSettings,
  suggestSettings,
  modlogSettings,
  autoResponses,
  blacklist,
  configBackups,
} = require("../../../../utils/database");

const SECTIONS = [
  { id: "general", label: "General" },
  { id: "roles", label: "Roles" },
  { id: "verify", label: "Verification" },
  { id: "verify-advanced", label: "Advanced Verification" },
  { id: "modlogs", label: "ModLogs" },
  { id: "sistema", label: "System" },
  { id: "autorespuestas", label: "Auto Responses" },
  { id: "blacklist", label: "Blacklist" },
  { id: "bienvenida", label: "Welcome" },
  { id: "despedida", label: "Goodbye" },
  { id: "sugerencias", label: "Suggestions" },
];

function fmtChannel(id) {
  return id ? `<#${id}>` : "Not set";
}

function fmtRole(id) {
  return id ? `<@&${id}>` : "Not set";
}

function healthForGeneral(s) {
  const checks = [
    { ok: Boolean(s.panel_channel_id), label: "Ticket panel channel", critical: true },
    { ok: Boolean(s.support_role), label: "Staff role", critical: true },
    { ok: Boolean(s.admin_role), label: "Admin role", critical: true },
    { ok: Boolean(s.log_channel), label: "Log channel", critical: false },
  ];
  const criticalMissing = checks.filter((c) => c.critical && !c.ok).length;
  const pending = checks.filter((c) => !c.ok).length + (s.panel_channel_id && !s.panel_message_id ? 1 : 0);
  const ready = checks.length - checks.filter((c) => !c.ok).length;
  if (criticalMissing > 0) return { color: 0xed4245, status: "Incomplete", pending, ready, total: checks.length };
  if (pending > 0) return { color: 0xfee75c, status: "Operational with follow-ups", pending, ready, total: checks.length };
  return { color: 0x57f287, status: "Ready", pending, ready, total: checks.length };
}

function buildSectionRow(ownerId, section) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`cfg_center_section|${ownerId}`)
      .setPlaceholder("Select a section")
      .addOptions(
        SECTIONS.map((item) => ({
          label: item.label,
          value: item.id,
          default: item.id === section,
        }))
      )
  );
}

function buildGeneralEmbed(guild, s) {
  const health = healthForGeneral(s);
  const checklist = [
    `${s.panel_channel_id ? "✅" : "❌"} Ticket panel channel`,
    `${s.support_role ? "✅" : "❌"} Staff role`,
    `${s.admin_role ? "✅" : "❌"} Admin role`,
    `${s.log_channel ? "✅" : "⚠️"} Log channel`,
    `${s.transcript_channel ? "✅" : "⚠️"} Transcript channel`,
    `${s.panel_channel_id && s.panel_message_id ? "✅" : "⚠️"} Panel published`,
  ];

  return new EmbedBuilder()
    .setColor(health.color)
    .setTitle("Settings Center - General")
    .addFields(
      {
        name: "Status",
        value:
          `**${health.status}**\n` +
          `Base checklist: \`${health.ready}/${health.total}\`\n` +
          `Open items: \`${health.pending}\``,
        inline: false,
      },
      {
        name: "Channels",
        value:
          `Ticket panel: ${fmtChannel(s.panel_channel_id)}\n` +
          `Logs: ${fmtChannel(s.log_channel)}\n` +
          `Transcripts: ${fmtChannel(s.transcript_channel)}`,
        inline: false,
      },
      {
        name: "Quick settings",
        value:
          `Max tickets: \`${s.max_tickets || 3}\`\n` +
          `Simple help: ${s.simple_help_mode === false ? "Disabled" : "Enabled"}\n` +
          `Global limit: \`${s.global_ticket_limit || 0}\` | Cooldown: \`${s.cooldown_minutes || 0}m\` | Min days: \`${s.min_days || 0}\``,
        inline: false,
      },
      {
        name: "Automation",
        value:
          `Auto-close: \`${s.auto_close_minutes || 0}m\`\n` +
          `SLA: \`${s.sla_minutes || 0}m\` | Smart ping: \`${s.smart_ping_minutes || 0}m\`\n` +
          `DM open/close: ${s.dm_on_open ? "✅" : "❌"} / ${s.dm_on_close ? "✅" : "❌"}\n` +
          `Log edits/deletes: ${s.log_edits ? "✅" : "❌"} / ${s.log_deletes ? "✅" : "❌"}`,
        inline: false,
      },
      { name: "Checklist", value: checklist.join("\n"), inline: false }
    )
    .setFooter({ text: `${guild.name} | /setup is still available for advanced options` })
    .setTimestamp();
}

function buildRolesEmbed(guild, s) {
  return new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle("Settings Center - Roles")
    .setDescription("Manage the bot's core roles.")
    .addFields(
      { name: "Staff role", value: fmtRole(s.support_role), inline: true },
      { name: "Admin role", value: fmtRole(s.admin_role), inline: true },
      { name: "Minimum verification role", value: fmtRole(s.verify_role), inline: true }
    )
    .setFooter({ text: `${guild.name} | The minimum verification role is optional` })
    .setTimestamp();
}

function buildVerifyEmbed(guild, v) {
  const modeLabel = { button: "Button", code: "DM code", question: "Question" };
  return new EmbedBuilder()
    .setColor(v.enabled ? 0x57f287 : 0xed4245)
    .setTitle("Settings Center - Verification")
    .addFields(
      { name: "Status", value: v.enabled ? "✅ Enabled" : "❌ Disabled", inline: true },
      { name: "Mode", value: modeLabel[v.mode] || v.mode || "Not set", inline: true },
      { name: "Channel", value: fmtChannel(v.channel), inline: true },
      { name: "Verified role", value: fmtRole(v.verified_role), inline: true },
      { name: "Unverified role", value: fmtRole(v.unverified_role), inline: true },
      { name: "DM on verify", value: v.dm_on_verify ? "✅ Enabled" : "❌ Disabled", inline: true }
    )
    .setFooter({ text: `${guild.name} | Actions: toggle, mode, publish panel, question and stats` })
    .setTimestamp();
}

function buildVerifyAdvancedEmbed(guild, v) {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("Settings Center - Advanced Verification")
    .addFields(
      { name: "Logs", value: fmtChannel(v.log_channel), inline: true },
      { name: "Anti-raid", value: v.antiraid_enabled ? "✅ Enabled" : "❌ Disabled", inline: true },
      { name: "Auto-kick", value: v.kick_unverified_hours > 0 ? `${v.kick_unverified_hours}h` : "❌ Disabled", inline: true },
      {
        name: "Anti-raid threshold",
        value: `${v.antiraid_joins || 10} joins / ${v.antiraid_seconds || 10}s (${v.antiraid_action === "kick" ? "kick" : "alert"})`,
        inline: false,
      }
    )
    .setFooter({ text: `${guild.name} | Actions: anti-raid, auto-kick, threshold, edit panel and DM` })
    .setTimestamp();
}

function buildModlogsEmbed(guild, m) {
  const yn = (v) => (v ? "✅" : "❌");
  return new EmbedBuilder()
    .setColor(m.enabled ? 0x57f287 : 0xed4245)
    .setTitle("Settings Center - Mod Logs")
    .addFields(
      { name: "Status", value: m.enabled ? "✅ Enabled" : "❌ Disabled", inline: true },
      { name: "Channel", value: fmtChannel(m.channel), inline: true },
      { name: "Bans / unbans", value: `${yn(m.log_bans)} / ${yn(m.log_unbans)}`, inline: true },
      { name: "Kicks", value: yn(m.log_kicks), inline: true },
      { name: "Message delete / edit", value: `${yn(m.log_msg_delete)} / ${yn(m.log_msg_edit)}`, inline: true },
      { name: "Role add / remove", value: `${yn(m.log_role_add)} / ${yn(m.log_role_remove)}`, inline: true },
      { name: "Nickname", value: yn(m.log_nickname), inline: true },
      { name: "Joins / leaves", value: `${yn(m.log_joins)} / ${yn(m.log_leaves)}`, inline: true }
    )
    .setFooter({ text: `${guild.name} | Quick moderation log controls` })
    .setTimestamp();
}

function buildSystemEmbed(guild, s, backups = []) {
  const commandOverridesCount = s.command_rate_limit_overrides && typeof s.command_rate_limit_overrides === "object"
    ? Object.keys(s.command_rate_limit_overrides).length
    : 0;
  const latestBackup = Array.isArray(backups) && backups.length ? backups[0] : null;
  const latestBackupTime = latestBackup?.created_at
    ? `<t:${Math.floor(new Date(latestBackup.created_at).getTime() / 1000)}:R>`
    : "No backups";
  const backupSummary = latestBackup
    ? `Latest: \`${latestBackup.backup_id}\` (${latestBackup.source || "manual"})\nTime: ${latestBackupTime}`
    : "No saved backups yet.";

  return new EmbedBuilder()
    .setColor(s.maintenance_mode ? 0xed4245 : 0x3498db)
    .setTitle("Settings Center - System")
    .addFields(
      { name: "Maintenance", value: s.maintenance_mode ? "ON" : "OFF", inline: true },
      { name: "Reason", value: s.maintenance_reason || "No reason", inline: true },
      { name: "Rate limit", value: s.rate_limit_enabled ? "ON" : "OFF", inline: true },
      {
        name: "Rate limit details",
        value:
          `Window: \`${s.rate_limit_window_seconds || 10}s\`\n` +
          `Max actions: \`${s.rate_limit_max_actions || 8}\`\n` +
          `Bypass admin: ${s.rate_limit_bypass_admin ? "ON" : "OFF"}`,
        inline: false,
      },
      {
        name: "Command rate limit",
        value:
          `Status: ${s.command_rate_limit_enabled ? "ON" : "OFF"}\n` +
          `Window: \`${s.command_rate_limit_window_seconds || 20}s\`\n` +
          `Max per command: \`${s.command_rate_limit_max_actions || 4}\`\n` +
          `Overrides: \`${commandOverridesCount}\``,
        inline: false,
      },
      {
        name: "System DMs",
        value: `Transcripts: ${s.dm_transcripts ? "ON" : "OFF"} | Alerts: ${s.dm_alerts ? "ON" : "OFF"}`,
        inline: false,
      },
      {
        name: "Versioned backups",
        value: `Shown: \`${Array.isArray(backups) ? backups.length : 0}\`\n${backupSummary}`,
        inline: false,
      },
    )
    .setFooter({ text: `${guild.name} | Global runtime settings` })
    .setTimestamp();
}

function buildAutoResponsesEmbed(guild, list) {
  const enabled = list.filter((x) => x.enabled).length;
  const disabled = list.length - enabled;
  const preview = list.length
    ? list
        .slice(0, 8)
        .map((x, i) => `${i + 1}. ${x.enabled ? "[ON]" : "[OFF]"} \`${x.trigger}\` (${x.uses || 0})`)
        .join("\n")
    : "No auto responses configured.";
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("Settings Center - Auto Responses")
    .addFields(
      { name: "Total", value: `\`${list.length}\``, inline: true },
      { name: "Enabled", value: `\`${enabled}\``, inline: true },
      { name: "Disabled", value: `\`${disabled}\``, inline: true },
      { name: "Top triggers", value: preview, inline: false }
    )
    .setFooter({ text: `${guild.name} | Create, toggle or delete from the modals` })
    .setTimestamp();
}

function buildBlacklistEmbed(guild, list) {
  const preview = list.length
    ? list
        .slice(0, 8)
        .map((x, i) => `${i + 1}. <@${x.user_id}> — ${(x.reason || "No reason").slice(0, 60)}`)
        .join("\n")
    : "No blacklisted users.";
  return new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle("Settings Center - Blacklist")
    .addFields(
      { name: "Blocked users", value: `\`${list.length}\``, inline: true },
      { name: "Quick view", value: preview, inline: false }
    )
    .setFooter({ text: `${guild.name} | Basic management without leaving /config center` })
    .setTimestamp();
}

function buildWelcomeEmbed(guild, w) {
  return new EmbedBuilder()
    .setColor(w.welcome_enabled ? 0x57f287 : 0xed4245)
    .setTitle("Settings Center - Welcome")
    .addFields(
      { name: "Status", value: w.welcome_enabled ? "✅ Enabled" : "❌ Disabled", inline: true },
      { name: "Channel", value: fmtChannel(w.welcome_channel), inline: true },
      { name: "Auto-role", value: fmtRole(w.welcome_autorole), inline: true },
      { name: "Avatar", value: w.welcome_thumbnail !== false ? "✅ Visible" : "❌ Hidden", inline: true },
      { name: "DM", value: w.welcome_dm ? "✅ Enabled" : "❌ Disabled", inline: true },
      { name: "Color", value: `#${w.welcome_color || "5865F2"}`, inline: true }
    )
    .setFooter({ text: `${guild.name} | Use 'Edit text' for message, title, footer and banner` })
    .setTimestamp();
}

function buildGoodbyeEmbed(guild, w) {
  return new EmbedBuilder()
    .setColor(w.goodbye_enabled ? 0x57f287 : 0xed4245)
    .setTitle("Settings Center - Goodbye")
    .addFields(
      { name: "Status", value: w.goodbye_enabled ? "✅ Enabled" : "❌ Disabled", inline: true },
      { name: "Channel", value: fmtChannel(w.goodbye_channel), inline: true },
      { name: "Avatar", value: w.goodbye_thumbnail !== false ? "✅ Visible" : "❌ Hidden", inline: true },
      { name: "Color", value: `#${w.goodbye_color || "ED4245"}`, inline: true },
      { name: "Title", value: w.goodbye_title || "Not set", inline: false },
      { name: "Message", value: (w.goodbye_message || "Not set").slice(0, 300), inline: false }
    )
    .setFooter({ text: `${guild.name} | Use 'Edit text' for message, title and footer` })
    .setTimestamp();
}

function buildSuggestEmbed(guild, sg) {
  return new EmbedBuilder()
    .setColor(sg.enabled ? 0x57f287 : 0xed4245)
    .setTitle("Settings Center - Suggestions")
    .addFields(
      { name: "Status", value: sg.enabled ? "✅ Enabled" : "❌ Disabled", inline: true },
      { name: "Channel", value: fmtChannel(sg.channel), inline: true },
      { name: "Cooldown", value: `${sg.cooldown_minutes || 0} min`, inline: true },
      { name: "Anonymous", value: sg.anonymous ? "✅" : "❌", inline: true },
      { name: "Require reason", value: sg.require_reason ? "✅" : "❌", inline: true },
      { name: "DM on result", value: sg.dm_on_result ? "✅" : "❌", inline: true }
    )
    .setFooter({ text: `${guild.name} | Integrated with /suggest` })
    .setTimestamp();
}

function buildSectionComponents(ownerId, section, state) {
  const rows = [buildSectionRow(ownerId, section)];
  const s = state.settings;
  const v = state.verify;

  if (section === "general") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|general|panel|${ownerId}`)
          .setPlaceholder("Channel for the ticket panel")
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|general|logs|${ownerId}`)
          .setPlaceholder("Channel for logs")
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|max_dec|${ownerId}`).setLabel("- Max").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|max_inc|${ownerId}`).setLabel("+ Max").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|general|toggle_help|${ownerId}`)
          .setLabel(s.simple_help_mode === false ? "Simple help OFF" : "Simple help ON")
          .setStyle(s.simple_help_mode === false ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|publish|${ownerId}`).setLabel("Publish panel").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|limits|${ownerId}`).setLabel("Limits").setStyle(ButtonStyle.Secondary)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|dm_open|${ownerId}`).setLabel(`DM Open ${s.dm_on_open ? "ON" : "OFF"}`).setStyle(s.dm_on_open ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|dm_close|${ownerId}`).setLabel(`DM Close ${s.dm_on_close ? "ON" : "OFF"}`).setStyle(s.dm_on_close ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|log_edits|${ownerId}`).setLabel(`Edits ${s.log_edits ? "ON" : "OFF"}`).setStyle(s.log_edits ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|log_deletes|${ownerId}`).setLabel(`Deletes ${s.log_deletes ? "ON" : "OFF"}`).setStyle(s.log_deletes ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|automation|${ownerId}`).setLabel("Auto/SLA").setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "roles") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|roles|staff|${ownerId}`)
          .setPlaceholder("Select the staff role")
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|roles|admin|${ownerId}`)
          .setPlaceholder("Select the admin role")
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|roles|verify|${ownerId}`)
          .setPlaceholder("Minimum role required to open tickets (optional)")
          .setMinValues(0)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|roles|clear_staff|${ownerId}`).setLabel("Clear staff").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|roles|clear_admin|${ownerId}`).setLabel("Clear admin").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|roles|clear_verify|${ownerId}`).setLabel("Clear verify role").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|roles|refresh|${ownerId}`).setLabel("Refresh").setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "verify") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|verify|verify_channel|${ownerId}`)
          .setPlaceholder("Verification channel")
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|verify|verified|${ownerId}`)
          .setPlaceholder("Verified role")
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|verify|unverified|${ownerId}`)
          .setPlaceholder("Unverified role (optional)")
          .setMinValues(0)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|toggle|${ownerId}`).setLabel(v.enabled ? "Disable" : "Enable").setStyle(v.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|mode|${ownerId}`).setLabel(`Mode: ${v.mode || "button"}`).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|panel|${ownerId}`).setLabel("Publish panel").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|question|${ownerId}`).setLabel("Question").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|clear_verified|${ownerId}`).setLabel("Clear verified").setStyle(ButtonStyle.Danger)
      )
    );
    return rows;
  }

  if (section === "verify-advanced") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|verify-advanced|verif_logs|${ownerId}`)
          .setPlaceholder("Verification log channel")
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|antiraid|${ownerId}`).setLabel(v.antiraid_enabled ? "Anti-raid ON" : "Anti-raid OFF").setStyle(v.antiraid_enabled ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|autokick|${ownerId}`).setLabel(`Auto-kick: ${v.kick_unverified_hours || 0}h`).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|antiraid_cfg|${ownerId}`).setLabel("Raid threshold").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|panel_text|${ownerId}`).setLabel("Edit panel").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|dm|${ownerId}`).setLabel(v.dm_on_verify ? "DM ON" : "DM OFF").setStyle(v.dm_on_verify ? ButtonStyle.Success : ButtonStyle.Danger)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|stats|${ownerId}`).setLabel("Verification stats").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|clear_unverified|${ownerId}`).setLabel("Clear unverified").setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "modlogs") {
    const m = state.modlogs;
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|modlogs|modlogs_channel|${ownerId}`)
          .setPlaceholder("Moderation log channel")
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|toggle|${ownerId}`).setLabel(m.enabled ? "Disable" : "Enable").setStyle(m.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|bans|${ownerId}`).setLabel(`Bans ${m.log_bans ? "ON" : "OFF"}`).setStyle(m.log_bans ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|unbans|${ownerId}`).setLabel(`Unbans ${m.log_unbans ? "ON" : "OFF"}`).setStyle(m.log_unbans ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|kicks|${ownerId}`).setLabel(`Kicks ${m.log_kicks ? "ON" : "OFF"}`).setStyle(m.log_kicks ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|nick|${ownerId}`).setLabel(`Nicknames ${m.log_nickname ? "ON" : "OFF"}`).setStyle(m.log_nickname ? ButtonStyle.Success : ButtonStyle.Danger)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|msg_delete|${ownerId}`).setLabel(`Delete ${m.log_msg_delete ? "ON" : "OFF"}`).setStyle(m.log_msg_delete ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|msg_edit|${ownerId}`).setLabel(`Edit ${m.log_msg_edit ? "ON" : "OFF"}`).setStyle(m.log_msg_edit ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|role_add|${ownerId}`).setLabel(`Role add ${m.log_role_add ? "ON" : "OFF"}`).setStyle(m.log_role_add ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|role_remove|${ownerId}`).setLabel(`Role remove ${m.log_role_remove ? "ON" : "OFF"}`).setStyle(m.log_role_remove ? ButtonStyle.Success : ButtonStyle.Danger)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|joins|${ownerId}`).setLabel(`Joins ${m.log_joins ? "ON" : "OFF"}`).setStyle(m.log_joins ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|leaves|${ownerId}`).setLabel(`Leaves ${m.log_leaves ? "ON" : "OFF"}`).setStyle(m.log_leaves ? ButtonStyle.Success : ButtonStyle.Danger)
      )
    );
    return rows;
  }

  if (section === "sistema") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|maintenance|${ownerId}`)
          .setLabel(s.maintenance_mode ? "Maintenance ON" : "Maintenance OFF")
          .setStyle(s.maintenance_mode ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|maintenance_reason|${ownerId}`)
          .setLabel("Edit reason")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|rate_toggle|${ownerId}`)
          .setLabel(s.rate_limit_enabled ? "Rate ON" : "Rate OFF")
          .setStyle(s.rate_limit_enabled ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|rate_cfg|${ownerId}`)
          .setLabel("Rate config")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|cmd_rate_toggle|${ownerId}`)
          .setLabel(s.command_rate_limit_enabled ? "CmdRate ON" : "CmdRate OFF")
          .setStyle(s.command_rate_limit_enabled ? ButtonStyle.Success : ButtonStyle.Danger)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|dm_transcripts|${ownerId}`)
          .setLabel(`DM transcript ${s.dm_transcripts ? "ON" : "OFF"}`)
          .setStyle(s.dm_transcripts ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|dm_alerts|${ownerId}`)
          .setLabel(`DM alerts ${s.dm_alerts ? "ON" : "OFF"}`)
          .setStyle(s.dm_alerts ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|cmd_rate_cfg|${ownerId}`)
          .setLabel("CmdRate config")
          .setStyle(ButtonStyle.Secondary)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|export_json|${ownerId}`)
          .setLabel("Export JSON")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|import_json|${ownerId}`)
          .setLabel("Import JSON")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|backup_list|${ownerId}`)
          .setLabel("View backups")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|rollback_last|${ownerId}`)
          .setLabel("Rollback latest")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|rollback_id|${ownerId}`)
          .setLabel("Rollback by ID")
          .setStyle(ButtonStyle.Danger)
      )
    );
    return rows;
  }

  if (section === "autorespuestas") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|autorespuestas|add|${ownerId}`).setLabel("Add").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|autorespuestas|toggle|${ownerId}`).setLabel("Toggle").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|autorespuestas|delete|${ownerId}`).setLabel("Delete").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|autorespuestas|refresh|${ownerId}`).setLabel("Refresh").setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "blacklist") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|blacklist|add|${ownerId}`).setLabel("Block").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|blacklist|remove|${ownerId}`).setLabel("Unblock").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|blacklist|check|${ownerId}`).setLabel("Check").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|blacklist|refresh|${ownerId}`).setLabel("Refresh").setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "bienvenida") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|bienvenida|welcome_channel|${ownerId}`)
          .setPlaceholder("Welcome channel")
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|bienvenida|autorole|${ownerId}`)
          .setPlaceholder("Welcome auto-role (optional)")
          .setMinValues(0)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|toggle|${ownerId}`).setLabel(state.welcome.welcome_enabled ? "Disable" : "Enable").setStyle(state.welcome.welcome_enabled ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|avatar|${ownerId}`).setLabel(state.welcome.welcome_thumbnail !== false ? "Avatar ON" : "Avatar OFF").setStyle(state.welcome.welcome_thumbnail !== false ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|dm|${ownerId}`).setLabel(state.welcome.welcome_dm ? "DM ON" : "DM OFF").setStyle(state.welcome.welcome_dm ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|test|${ownerId}`).setLabel("Test").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|texts|${ownerId}`).setLabel("Edit text").setStyle(ButtonStyle.Secondary)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|clear_autorole|${ownerId}`).setLabel("Clear auto-role").setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "despedida") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|despedida|goodbye_channel|${ownerId}`)
          .setPlaceholder("Goodbye channel")
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|toggle|${ownerId}`).setLabel(state.welcome.goodbye_enabled ? "Disable" : "Enable").setStyle(state.welcome.goodbye_enabled ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|avatar|${ownerId}`).setLabel(state.welcome.goodbye_thumbnail !== false ? "Avatar ON" : "Avatar OFF").setStyle(state.welcome.goodbye_thumbnail !== false ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|test|${ownerId}`).setLabel("Test").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|texts|${ownerId}`).setLabel("Edit text").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|refresh|${ownerId}`).setLabel("Refresh").setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  rows.push(
    new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(`cfg_center_channel|sugerencias|suggest_channel|${ownerId}`)
        .setPlaceholder("Suggestions channel")
        .addChannelTypes(ChannelType.GuildText)
        .setMinValues(1)
        .setMaxValues(1)
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|toggle|${ownerId}`).setLabel(state.suggest.enabled ? "Disable" : "Enable").setStyle(state.suggest.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|anon|${ownerId}`).setLabel(`Anonymous ${state.suggest.anonymous ? "ON" : "OFF"}`).setStyle(state.suggest.anonymous ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|reason|${ownerId}`).setLabel(`Reason ${state.suggest.require_reason ? "ON" : "OFF"}`).setStyle(state.suggest.require_reason ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|dm|${ownerId}`).setLabel(`DM ${state.suggest.dm_on_result ? "ON" : "OFF"}`).setStyle(state.suggest.dm_on_result ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|cooldown|${ownerId}`).setLabel(`CD ${state.suggest.cooldown_minutes || 0}m`).setStyle(ButtonStyle.Secondary)
    )
  );
  return rows;
}

function buildSectionEmbed(guild, section, state) {
  if (section === "general") return buildGeneralEmbed(guild, state.settings);
  if (section === "roles") return buildRolesEmbed(guild, state.settings);
  if (section === "verify") return buildVerifyEmbed(guild, state.verify);
  if (section === "verify-advanced") return buildVerifyAdvancedEmbed(guild, state.verify);
  if (section === "modlogs") return buildModlogsEmbed(guild, state.modlogs);
  if (section === "sistema") return buildSystemEmbed(guild, state.settings, state.backups);
  if (section === "autorespuestas") return buildAutoResponsesEmbed(guild, state.autoResponses);
  if (section === "blacklist") return buildBlacklistEmbed(guild, state.blacklist);
  if (section === "bienvenida") return buildWelcomeEmbed(guild, state.welcome);
  if (section === "despedida") return buildGoodbyeEmbed(guild, state.welcome);
  return buildSuggestEmbed(guild, state.suggest);
}

async function loadCenterState(guildId) {
  const [s, v, w, sg, m, ar, bl, backups] = await Promise.all([
    settings.get(guildId),
    verifSettings.get(guildId),
    welcomeSettings.get(guildId),
    suggestSettings.get(guildId),
    modlogSettings.get(guildId),
    autoResponses.getAll(guildId),
    blacklist.getAll(guildId),
    configBackups.listRecent(guildId, 5),
  ]);
  return {
    settings: s,
    verify: v,
    welcome: w,
    suggest: sg,
    modlogs: m,
    autoResponses: ar,
    blacklist: bl,
    backups,
  };
}

async function buildCenterPayload(guild, ownerId, section = "general") {
  const safeSection = SECTIONS.some((item) => item.id === section) ? section : "general";
  const state = await loadCenterState(guild.id);
  return {
    embeds: [buildSectionEmbed(guild, safeSection, state)],
    components: buildSectionComponents(ownerId, safeSection, state),
  };
}

module.exports = {
  buildCenterPayload,
};
