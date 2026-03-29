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
const { resolveGuildLanguage } = require("../../../../utils/i18n");
const { configT } = require("../i18n");

const SECTIONS = [
  { id: "general" },
  { id: "roles" },
  { id: "verify" },
  { id: "verify-advanced" },
  { id: "modlogs" },
  { id: "sistema" },
  { id: "autorespuestas" },
  { id: "blacklist" },
  { id: "bienvenida" },
  { id: "despedida" },
  { id: "sugerencias" },
];

function sectionLabel(language, section) {
  const keyMap = {
    "verify-advanced": "verify_advanced",
    sistema: "system",
    autorespuestas: "autoresponses",
    bienvenida: "welcome",
    despedida: "goodbye",
    sugerencias: "suggestions",
  };
  return configT(language, `center.sections.${keyMap[section] || section}`);
}

function fmtChannel(id, language) {
  return id ? `<#${id}>` : configT(language, "common.not_set");
}

function fmtRole(id, language) {
  return id ? `<@&${id}>` : configT(language, "common.not_set");
}

function onOff(language, value) {
  return value ? configT(language, "common.on") : configT(language, "common.off");
}

function enabledDisabled(language, value) {
  return value ? configT(language, "common.enabled") : configT(language, "common.disabled");
}

function visibleHidden(language, value) {
  return value
    ? configT(language, "center.welcome.visible")
    : configT(language, "center.welcome.hidden");
}

function enabledDisabledStatus(language, value) {
  return `${value ? "✅" : "❌"} ${enabledDisabled(language, value)}`;
}

function visibleHiddenStatus(language, value, domain = "center.welcome") {
  return `${value ? "✅" : "❌"} ${
    value ? configT(language, `${domain}.visible`) : configT(language, `${domain}.hidden`)
  }`;
}

function modeLabel(mode, language) {
  const labels = {
    button: configT(language, "center.verify.mode_button"),
    code: configT(language, "center.verify.mode_code"),
    question: configT(language, "center.verify.mode_question"),
  };
  return labels[mode] || configT(language, "common.not_set");
}

function healthForGeneral(s, language) {
  const checks = [
    { ok: Boolean(s.panel_channel_id), label: configT(language, "center.general.checklist_ticket_panel"), critical: true },
    { ok: Boolean(s.support_role), label: configT(language, "center.general.checklist_staff"), critical: true },
    { ok: Boolean(s.admin_role), label: configT(language, "center.general.checklist_admin"), critical: true },
    { ok: Boolean(s.log_channel), label: configT(language, "center.general.checklist_logs"), critical: false },
  ];
  const criticalMissing = checks.filter((c) => c.critical && !c.ok).length;
  const pending = checks.filter((c) => !c.ok).length + (s.panel_channel_id && !s.panel_message_id ? 1 : 0);
  const ready = checks.length - checks.filter((c) => !c.ok).length;
  if (criticalMissing > 0) {
    return { color: 0xed4245, status: configT(language, "center.general.status_incomplete"), pending, ready, total: checks.length };
  }
  if (pending > 0) {
    return { color: 0xfee75c, status: configT(language, "center.general.status_followups"), pending, ready, total: checks.length };
  }
  return { color: 0x57f287, status: configT(language, "center.general.status_ready"), pending, ready, total: checks.length };
}

function buildSectionRow(ownerId, section, language) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`cfg_center_section|${ownerId}`)
      .setPlaceholder(configT(language, "center.select_section"))
      .addOptions(
        SECTIONS.map((item) => ({
          label: sectionLabel(language, item.id),
          value: item.id,
          default: item.id === section,
        }))
      )
  );
}

function buildGeneralEmbed(guild, s, language) {
  const health = healthForGeneral(s, language);
  const checklist = [
    `${s.panel_channel_id ? "✅" : "❌"} ${configT(language, "center.general.checklist_ticket_panel")}`,
    `${s.support_role ? "✅" : "❌"} ${configT(language, "center.general.checklist_staff")}`,
    `${s.admin_role ? "✅" : "❌"} ${configT(language, "center.general.checklist_admin")}`,
    `${s.log_channel ? "✅" : "⚠️"} ${configT(language, "center.general.checklist_logs")}`,
    `${s.transcript_channel ? "✅" : "⚠️"} ${configT(language, "center.general.checklist_transcripts")}`,
    `${s.panel_channel_id && s.panel_message_id ? "✅" : "⚠️"} ${configT(language, "center.general.checklist_panel_published")}`,
  ];

  return new EmbedBuilder()
    .setColor(health.color)
    .setTitle(configT(language, "center.general.title"))
    .addFields(
      {
        name: configT(language, "center.general.status"),
        value:
          `**${health.status}**\n` +
          `${configT(language, "center.general.base_checklist")}: \`${health.ready}/${health.total}\`\n` +
          `${configT(language, "center.general.open_items")}: \`${health.pending}\``,
        inline: false,
      },
      {
        name: configT(language, "center.general.channels"),
        value:
          `${configT(language, "center.general.channel_ticket_panel")}: ${fmtChannel(s.panel_channel_id, language)}\n` +
          `${configT(language, "center.general.channel_logs")}: ${fmtChannel(s.log_channel, language)}\n` +
          `${configT(language, "center.general.channel_transcripts")}: ${fmtChannel(s.transcript_channel, language)}`,
        inline: false,
      },
      {
        name: configT(language, "center.general.quick_settings"),
        value:
          `${configT(language, "center.general.quick_max_tickets")}: \`${s.max_tickets || 3}\`\n` +
          `${configT(language, "center.general.quick_simple_help")}: ${s.simple_help_mode === false ? configT(language, "common.disabled") : configT(language, "common.enabled")}\n` +
          `${configT(language, "center.general.quick_global_limit")}: \`${s.global_ticket_limit || 0}\` | ${configT(language, "center.general.quick_cooldown")}: \`${s.cooldown_minutes || 0}m\` | ${configT(language, "center.general.quick_min_days")}: \`${s.min_days || 0}\``,
        inline: false,
      },
      {
        name: configT(language, "center.general.automation"),
        value:
          `${configT(language, "center.general.automation_auto_close")}: \`${s.auto_close_minutes || 0}m\`\n` +
          `${configT(language, "center.general.automation_sla")}: \`${s.sla_minutes || 0}m\` | ${configT(language, "center.general.automation_smart_ping")}: \`${s.smart_ping_minutes || 0}m\`\n` +
          `${configT(language, "center.general.automation_dm_open_close")}: ${s.dm_on_open ? "✅" : "❌"} / ${s.dm_on_close ? "✅" : "❌"}\n` +
          `${configT(language, "center.general.automation_log_edits_deletes")}: ${s.log_edits ? "✅" : "❌"} / ${s.log_deletes ? "✅" : "❌"}`,
        inline: false,
      },
      { name: configT(language, "center.general.checklist"), value: checklist.join("\n"), inline: false }
    )
    .setFooter({ text: configT(language, "center.general.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildRolesEmbed(guild, s, language) {
  return new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle(configT(language, "center.roles.title"))
    .setDescription(configT(language, "center.roles.description"))
    .addFields(
      { name: configT(language, "center.roles.staff_role"), value: fmtRole(s.support_role, language), inline: true },
      { name: configT(language, "center.roles.admin_role"), value: fmtRole(s.admin_role, language), inline: true },
      { name: configT(language, "center.roles.minimum_verify_role"), value: fmtRole(s.verify_role, language), inline: true }
    )
    .setFooter({ text: configT(language, "center.roles.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildVerifyEmbed(guild, v, language) {
  return new EmbedBuilder()
    .setColor(v.enabled ? 0x57f287 : 0xed4245)
    .setTitle(configT(language, "center.verify.title"))
    .addFields(
      { name: configT(language, "center.verify.status"), value: enabledDisabledStatus(language, v.enabled), inline: true },
      { name: configT(language, "center.verify.mode"), value: modeLabel(v.mode, language), inline: true },
      { name: configT(language, "center.verify.channel"), value: fmtChannel(v.channel, language), inline: true },
      { name: configT(language, "center.verify.verified_role"), value: fmtRole(v.verified_role, language), inline: true },
      { name: configT(language, "center.verify.unverified_role"), value: fmtRole(v.unverified_role, language), inline: true },
      { name: configT(language, "center.verify.dm_on_verify"), value: enabledDisabledStatus(language, v.dm_on_verify), inline: true }
    )
    .setFooter({ text: configT(language, "center.verify.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildVerifyAdvancedEmbed(guild, v, language) {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(configT(language, "center.verify_advanced.title"))
    .addFields(
      { name: configT(language, "center.verify_advanced.logs"), value: fmtChannel(v.log_channel, language), inline: true },
      { name: configT(language, "center.verify_advanced.anti_raid"), value: enabledDisabledStatus(language, v.antiraid_enabled), inline: true },
      { name: configT(language, "center.verify_advanced.auto_kick"), value: v.kick_unverified_hours > 0 ? `${v.kick_unverified_hours}h` : enabledDisabledStatus(language, false), inline: true },
      {
        name: configT(language, "center.verify_advanced.threshold"),
        value: configT(language, "center.verify_advanced.threshold_value", { joins: v.antiraid_joins || 10, seconds: v.antiraid_seconds || 10, action: v.antiraid_action === "kick" ? configT(language, "center.verify_advanced.action_kick") : configT(language, "center.verify_advanced.action_alert") }),
        inline: false,
      }
    )
    .setFooter({ text: configT(language, "center.verify_advanced.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildModlogsEmbed(guild, m, language) {
  const yn = (v) => (v ? "✅" : "❌");
  return new EmbedBuilder()
    .setColor(m.enabled ? 0x57f287 : 0xed4245)
    .setTitle(configT(language, "center.modlogs.title"))
    .addFields(
      { name: configT(language, "center.modlogs.status"), value: enabledDisabledStatus(language, m.enabled), inline: true },
      { name: configT(language, "center.modlogs.channel"), value: fmtChannel(m.channel, language), inline: true },
      { name: configT(language, "center.modlogs.bans_unbans"), value: `${yn(m.log_bans)} / ${yn(m.log_unbans)}`, inline: true },
      { name: configT(language, "center.modlogs.kicks"), value: yn(m.log_kicks), inline: true },
      { name: configT(language, "center.modlogs.msg_delete_edit"), value: `${yn(m.log_msg_delete)} / ${yn(m.log_msg_edit)}`, inline: true },
      { name: configT(language, "center.modlogs.role_add_remove"), value: `${yn(m.log_role_add)} / ${yn(m.log_role_remove)}`, inline: true },
      { name: configT(language, "center.modlogs.nickname"), value: yn(m.log_nickname), inline: true },
      { name: configT(language, "center.modlogs.joins_leaves"), value: `${yn(m.log_joins)} / ${yn(m.log_leaves)}`, inline: true }
    )
    .setFooter({ text: configT(language, "center.modlogs.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildSystemEmbed(guild, s, backups = [], language) {
  const commandOverridesCount = s.command_rate_limit_overrides && typeof s.command_rate_limit_overrides === "object"
    ? Object.keys(s.command_rate_limit_overrides).length
    : 0;
  const latestBackup = Array.isArray(backups) && backups.length ? backups[0] : null;
  const latestBackupTime = latestBackup?.created_at
    ? `<t:${Math.floor(new Date(latestBackup.created_at).getTime() / 1000)}:R>`
    : configT(language, "common.no_backups");
  const backupSummary = latestBackup
    ? configT(language, "center.system.latest_backup", {
        backupId: latestBackup.backup_id,
        source: latestBackup.source || "manual",
        time: latestBackupTime,
      })
    : configT(language, "common.no_backups");

  return new EmbedBuilder()
    .setColor(s.maintenance_mode ? 0xed4245 : 0x3498db)
    .setTitle(configT(language, "center.system.title"))
    .addFields(
      { name: configT(language, "center.system.maintenance"), value: s.maintenance_mode ? configT(language, "common.on") : configT(language, "common.off"), inline: true },
      { name: configT(language, "center.system.reason"), value: s.maintenance_reason || configT(language, "common.no_reason"), inline: true },
      { name: configT(language, "center.system.rate_limit"), value: s.rate_limit_enabled ? configT(language, "common.on") : configT(language, "common.off"), inline: true },
      {
        name: configT(language, "center.system.rate_limit_details"),
        value:
          `${configT(language, "center.system.window")}: \`${s.rate_limit_window_seconds || 10}s\`\n` +
          `${configT(language, "center.system.max_actions")}: \`${s.rate_limit_max_actions || 8}\`\n` +
          `${configT(language, "center.system.bypass_admin")}: ${s.rate_limit_bypass_admin ? configT(language, "common.on") : configT(language, "common.off")}`,
        inline: false,
      },
      {
        name: configT(language, "center.system.command_rate_limit"),
        value:
          `${configT(language, "center.system.status")}: ${s.command_rate_limit_enabled ? configT(language, "common.on") : configT(language, "common.off")}\n` +
          `${configT(language, "center.system.window")}: \`${s.command_rate_limit_window_seconds || 20}s\`\n` +
          `${configT(language, "center.system.max_per_command")}: \`${s.command_rate_limit_max_actions || 4}\`\n` +
          `${configT(language, "center.system.overrides")}: \`${commandOverridesCount}\``,
        inline: false,
      },
      {
        name: configT(language, "center.system.system_dms"),
        value: configT(language, "center.system.transcripts_alerts", { transcripts: s.dm_transcripts ? configT(language, "common.on") : configT(language, "common.off"), alerts: s.dm_alerts ? configT(language, "common.on") : configT(language, "common.off") }),
        inline: false,
      },
      {
        name: configT(language, "center.system.versioned_backups"),
        value: configT(language, "center.system.backups_shown", {
          count: Array.isArray(backups) ? backups.length : 0,
          summary: backupSummary,
        }),
        inline: false,
      },
    )
    .setFooter({ text: configT(language, "center.system.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildAutoResponsesEmbed(guild, list, language) {
  const enabled = list.filter((x) => x.enabled).length;
  const disabled = list.length - enabled;
  const preview = list.length
    ? list
        .slice(0, 8)
        .map((x, i) => `${i + 1}. ${x.enabled ? "[ON]" : "[OFF]"} \`${x.trigger}\` (${x.uses || 0})`)
        .join("\n")
    : configT(language, "center.autoresponses.none");
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(configT(language, "center.autoresponses.title"))
    .addFields(
      { name: configT(language, "center.autoresponses.total"), value: `\`${list.length}\``, inline: true },
      { name: configT(language, "center.autoresponses.enabled"), value: `\`${enabled}\``, inline: true },
      { name: configT(language, "center.autoresponses.disabled"), value: `\`${disabled}\``, inline: true },
      { name: configT(language, "center.autoresponses.top_triggers"), value: preview, inline: false }
    )
    .setFooter({ text: configT(language, "center.autoresponses.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildBlacklistEmbed(guild, list, language) {
  const preview = list.length
    ? list
        .slice(0, 8)
        .map((x, i) => `${i + 1}. <@${x.user_id}> - ${(x.reason || configT(language, "center.blacklist.no_reason")).slice(0, 60)}`)
        .join("\n")
    : configT(language, "center.blacklist.none");
  return new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle(configT(language, "center.blacklist.title"))
    .addFields(
      { name: configT(language, "center.blacklist.blocked_users"), value: `\`${list.length}\``, inline: true },
      { name: configT(language, "center.blacklist.quick_view"), value: preview, inline: false }
    )
    .setFooter({ text: configT(language, "center.blacklist.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildWelcomeEmbed(guild, w, language) {
  return new EmbedBuilder()
    .setColor(w.welcome_enabled ? 0x57f287 : 0xed4245)
    .setTitle(configT(language, "center.welcome.title"))
    .addFields(
      { name: configT(language, "center.welcome.status"), value: enabledDisabledStatus(language, w.welcome_enabled), inline: true },
      { name: configT(language, "center.welcome.channel"), value: fmtChannel(w.welcome_channel, language), inline: true },
      { name: configT(language, "center.welcome.autorole"), value: fmtRole(w.welcome_autorole, language), inline: true },
      { name: configT(language, "center.welcome.avatar"), value: visibleHiddenStatus(language, w.welcome_thumbnail !== false, "center.welcome"), inline: true },
      { name: configT(language, "center.welcome.dm"), value: enabledDisabledStatus(language, w.welcome_dm), inline: true },
      { name: configT(language, "center.welcome.color"), value: `#${w.welcome_color || "5865F2"}`, inline: true }
    )
    .setFooter({ text: configT(language, "center.welcome.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildGoodbyeEmbed(guild, w, language) {
  return new EmbedBuilder()
    .setColor(w.goodbye_enabled ? 0x57f287 : 0xed4245)
    .setTitle(configT(language, "center.goodbye.title"))
    .addFields(
      { name: configT(language, "center.goodbye.status"), value: enabledDisabledStatus(language, w.goodbye_enabled), inline: true },
      { name: configT(language, "center.goodbye.channel"), value: fmtChannel(w.goodbye_channel, language), inline: true },
      { name: configT(language, "center.goodbye.avatar"), value: visibleHiddenStatus(language, w.goodbye_thumbnail !== false, "center.goodbye"), inline: true },
      { name: configT(language, "center.goodbye.color"), value: `#${w.goodbye_color || "ED4245"}`, inline: true },
      { name: configT(language, "center.goodbye.title_label"), value: w.goodbye_title || configT(language, "common.not_set"), inline: false },
      { name: configT(language, "center.goodbye.message"), value: (w.goodbye_message || configT(language, "common.not_set")).slice(0, 300), inline: false }
    )
    .setFooter({ text: configT(language, "center.goodbye.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildSuggestEmbed(guild, sg, language) {
  return new EmbedBuilder()
    .setColor(sg.enabled ? 0x57f287 : 0xed4245)
    .setTitle(configT(language, "center.suggestions.title"))
    .addFields(
      { name: configT(language, "center.suggestions.status"), value: enabledDisabledStatus(language, sg.enabled), inline: true },
      { name: configT(language, "center.suggestions.channel"), value: fmtChannel(sg.channel, language), inline: true },
      { name: configT(language, "center.suggestions.cooldown"), value: `${sg.cooldown_minutes || 0} min`, inline: true },
      { name: configT(language, "center.suggestions.anonymous"), value: sg.anonymous ? "✅" : "❌", inline: true },
      { name: configT(language, "center.suggestions.require_reason"), value: sg.require_reason ? "✅" : "❌", inline: true },
      { name: configT(language, "center.suggestions.dm_on_result"), value: sg.dm_on_result ? "✅" : "❌", inline: true }
    )
    .setFooter({ text: configT(language, "center.suggestions.footer", { guild: guild.name }) })
    .setTimestamp();
}

function buildSectionComponents(ownerId, section, state, language) {
  const rows = [buildSectionRow(ownerId, section, language)];
  const s = state.settings;
  const v = state.verify;

  if (section === "general") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|general|panel|${ownerId}`)
          .setPlaceholder(configT(language, "center.general.placeholder_panel_channel"))
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|general|logs|${ownerId}`)
          .setPlaceholder(configT(language, "center.general.placeholder_logs_channel"))
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|max_dec|${ownerId}`).setLabel(configT(language, "center.general.button_max_down")).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|max_inc|${ownerId}`).setLabel(configT(language, "center.general.button_max_up")).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|general|toggle_help|${ownerId}`)
          .setLabel(s.simple_help_mode === false ? configT(language, "center.general.button_simple_help_off") : configT(language, "center.general.button_simple_help_on"))
          .setStyle(s.simple_help_mode === false ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|publish|${ownerId}`).setLabel(configT(language, "center.general.button_publish_panel")).setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|limits|${ownerId}`).setLabel(configT(language, "center.general.button_limits")).setStyle(ButtonStyle.Secondary)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|dm_open|${ownerId}`).setLabel(configT(language, "center.general.button_dm_open", { state: s.dm_on_open ? configT(language, "common.on") : configT(language, "common.off") })).setStyle(s.dm_on_open ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|dm_close|${ownerId}`).setLabel(configT(language, "center.general.button_dm_close", { state: s.dm_on_close ? configT(language, "common.on") : configT(language, "common.off") })).setStyle(s.dm_on_close ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|log_edits|${ownerId}`).setLabel(configT(language, "center.general.button_edits", { state: s.log_edits ? configT(language, "common.on") : configT(language, "common.off") })).setStyle(s.log_edits ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|log_deletes|${ownerId}`).setLabel(configT(language, "center.general.button_deletes", { state: s.log_deletes ? configT(language, "common.on") : configT(language, "common.off") })).setStyle(s.log_deletes ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|general|automation|${ownerId}`).setLabel(configT(language, "center.general.button_automation")).setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "roles") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|roles|staff|${ownerId}`)
          .setPlaceholder(configT(language, "center.roles.placeholder_staff_role"))
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|roles|admin|${ownerId}`)
          .setPlaceholder(configT(language, "center.roles.placeholder_admin_role"))
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|roles|verify|${ownerId}`)
          .setPlaceholder(configT(language, "center.roles.placeholder_verify_role"))
          .setMinValues(0)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|roles|clear_staff|${ownerId}`).setLabel(configT(language, "center.roles.button_clear_staff")).setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|roles|clear_admin|${ownerId}`).setLabel(configT(language, "center.roles.button_clear_admin")).setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|roles|clear_verify|${ownerId}`).setLabel(configT(language, "center.roles.button_clear_verify")).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|roles|refresh|${ownerId}`).setLabel(configT(language, "center.roles.button_refresh")).setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "verify") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|verify|verify_channel|${ownerId}`)
          .setPlaceholder(configT(language, "center.verify.placeholder_channel"))
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|verify|verified|${ownerId}`)
          .setPlaceholder(configT(language, "center.verify.placeholder_verified_role"))
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|verify|unverified|${ownerId}`)
          .setPlaceholder(configT(language, "center.verify.placeholder_unverified_role"))
          .setMinValues(0)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|toggle|${ownerId}`).setLabel(v.enabled ? configT(language, "center.verify.button_disable") : configT(language, "center.verify.button_enable")).setStyle(v.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|mode|${ownerId}`).setLabel(configT(language, "center.verify.button_mode", { mode: modeLabel(v.mode, language) })).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|panel|${ownerId}`).setLabel(configT(language, "center.general.button_publish_panel")).setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|question|${ownerId}`).setLabel(configT(language, "center.verify.button_question")).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify|clear_verified|${ownerId}`).setLabel(configT(language, "center.verify.button_clear_verified")).setStyle(ButtonStyle.Danger)
      )
    );
    return rows;
  }

  if (section === "verify-advanced") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|verify-advanced|verif_logs|${ownerId}`)
          .setPlaceholder(configT(language, "center.verify_advanced.placeholder_logs_channel"))
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|antiraid|${ownerId}`).setLabel(configT(language, "center.verify_advanced.button_anti_raid", { state: v.antiraid_enabled ? configT(language, "common.on") : configT(language, "common.off") })).setStyle(v.antiraid_enabled ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|autokick|${ownerId}`).setLabel(configT(language, "center.verify_advanced.button_auto_kick", { hours: v.kick_unverified_hours || 0 })).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|antiraid_cfg|${ownerId}`).setLabel(configT(language, "center.verify_advanced.button_threshold")).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|panel_text|${ownerId}`).setLabel(configT(language, "center.verify_advanced.button_edit_panel")).setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|dm|${ownerId}`).setLabel(configT(language, "center.verify_advanced.button_dm", { state: v.dm_on_verify ? configT(language, "common.on") : configT(language, "common.off") })).setStyle(v.dm_on_verify ? ButtonStyle.Success : ButtonStyle.Danger)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|stats|${ownerId}`).setLabel(configT(language, "center.verify_advanced.button_stats")).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|verify-advanced|clear_unverified|${ownerId}`).setLabel(configT(language, "center.verify_advanced.button_clear_unverified")).setStyle(ButtonStyle.Secondary)
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
          .setPlaceholder(configT(language, "center.modlogs.placeholder_channel"))
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|toggle|${ownerId}`).setLabel(m.enabled ? configT(language, "center.verify.button_disable") : configT(language, "center.verify.button_enable")).setStyle(m.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|bans|${ownerId}`).setLabel(configT(language, "center.modlogs.button_bans", { state: onOff(language, m.log_bans) })).setStyle(m.log_bans ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|unbans|${ownerId}`).setLabel(configT(language, "center.modlogs.button_unbans", { state: onOff(language, m.log_unbans) })).setStyle(m.log_unbans ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|kicks|${ownerId}`).setLabel(configT(language, "center.modlogs.button_kicks", { state: onOff(language, m.log_kicks) })).setStyle(m.log_kicks ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|nick|${ownerId}`).setLabel(configT(language, "center.modlogs.button_nicknames", { state: onOff(language, m.log_nickname) })).setStyle(m.log_nickname ? ButtonStyle.Success : ButtonStyle.Danger)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|msg_delete|${ownerId}`).setLabel(configT(language, "center.modlogs.button_delete", { state: onOff(language, m.log_msg_delete) })).setStyle(m.log_msg_delete ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|msg_edit|${ownerId}`).setLabel(configT(language, "center.modlogs.button_edit", { state: onOff(language, m.log_msg_edit) })).setStyle(m.log_msg_edit ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|role_add|${ownerId}`).setLabel(configT(language, "center.modlogs.button_role_add", { state: onOff(language, m.log_role_add) })).setStyle(m.log_role_add ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|role_remove|${ownerId}`).setLabel(configT(language, "center.modlogs.button_role_remove", { state: onOff(language, m.log_role_remove) })).setStyle(m.log_role_remove ? ButtonStyle.Success : ButtonStyle.Danger)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|joins|${ownerId}`).setLabel(configT(language, "center.modlogs.button_joins", { state: onOff(language, m.log_joins) })).setStyle(m.log_joins ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|modlogs|leaves|${ownerId}`).setLabel(configT(language, "center.modlogs.button_leaves", { state: onOff(language, m.log_leaves) })).setStyle(m.log_leaves ? ButtonStyle.Success : ButtonStyle.Danger)
      )
    );
    return rows;
  }

  if (section === "sistema") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|maintenance|${ownerId}`)
          .setLabel(configT(language, "center.system.button_maintenance", { state: s.maintenance_mode ? configT(language, "common.on") : configT(language, "common.off") }))
          .setStyle(s.maintenance_mode ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|maintenance_reason|${ownerId}`)
          .setLabel(configT(language, "center.system.button_edit_reason"))
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|rate_toggle|${ownerId}`)
          .setLabel(configT(language, "center.system.button_rate", { state: s.rate_limit_enabled ? configT(language, "common.on") : configT(language, "common.off") }))
          .setStyle(s.rate_limit_enabled ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|rate_cfg|${ownerId}`)
          .setLabel(configT(language, "center.system.button_rate_config"))
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|cmd_rate_toggle|${ownerId}`)
          .setLabel(configT(language, "center.system.button_cmd_rate", { state: s.command_rate_limit_enabled ? configT(language, "common.on") : configT(language, "common.off") }))
          .setStyle(s.command_rate_limit_enabled ? ButtonStyle.Success : ButtonStyle.Danger)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|dm_transcripts|${ownerId}`)
          .setLabel(configT(language, "center.system.button_dm_transcript", { state: s.dm_transcripts ? configT(language, "common.on") : configT(language, "common.off") }))
          .setStyle(s.dm_transcripts ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|dm_alerts|${ownerId}`)
          .setLabel(configT(language, "center.system.button_dm_alerts", { state: s.dm_alerts ? configT(language, "common.on") : configT(language, "common.off") }))
          .setStyle(s.dm_alerts ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|cmd_rate_cfg|${ownerId}`)
          .setLabel(configT(language, "center.system.button_cmd_rate_config"))
          .setStyle(ButtonStyle.Secondary)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|export_json|${ownerId}`)
          .setLabel(configT(language, "center.system.button_export_json"))
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|import_json|${ownerId}`)
          .setLabel(configT(language, "center.system.button_import_json"))
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|backup_list|${ownerId}`)
          .setLabel(configT(language, "center.system.button_view_backups"))
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|rollback_last|${ownerId}`)
          .setLabel(configT(language, "center.system.button_rollback_latest"))
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cfg_center_btn|sistema|rollback_id|${ownerId}`)
          .setLabel(configT(language, "center.system.button_rollback_id"))
          .setStyle(ButtonStyle.Danger)
      )
    );
    return rows;
  }

  if (section === "autorespuestas") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|autorespuestas|add|${ownerId}`).setLabel(configT(language, "center.autoresponses.button_add")).setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|autorespuestas|toggle|${ownerId}`).setLabel(configT(language, "center.autoresponses.button_toggle")).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|autorespuestas|delete|${ownerId}`).setLabel(configT(language, "center.autoresponses.button_delete")).setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|autorespuestas|refresh|${ownerId}`).setLabel(configT(language, "center.autoresponses.button_refresh")).setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "blacklist") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|blacklist|add|${ownerId}`).setLabel(configT(language, "center.blacklist.button_block")).setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|blacklist|remove|${ownerId}`).setLabel(configT(language, "center.blacklist.button_unblock")).setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|blacklist|check|${ownerId}`).setLabel(configT(language, "center.blacklist.button_check")).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|blacklist|refresh|${ownerId}`).setLabel(configT(language, "center.blacklist.button_refresh")).setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "bienvenida") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|bienvenida|welcome_channel|${ownerId}`)
          .setPlaceholder(configT(language, "center.welcome.placeholder_channel"))
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId(`cfg_center_role|bienvenida|autorole|${ownerId}`)
          .setPlaceholder(configT(language, "center.welcome.placeholder_autorole"))
          .setMinValues(0)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|toggle|${ownerId}`).setLabel(state.welcome.welcome_enabled ? configT(language, "center.verify.button_disable") : configT(language, "center.verify.button_enable")).setStyle(state.welcome.welcome_enabled ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|avatar|${ownerId}`).setLabel(configT(language, "center.welcome.button_avatar", { state: onOff(language, state.welcome.welcome_thumbnail !== false) })).setStyle(state.welcome.welcome_thumbnail !== false ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|dm|${ownerId}`).setLabel(configT(language, "center.welcome.button_dm", { state: onOff(language, state.welcome.welcome_dm) })).setStyle(state.welcome.welcome_dm ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|test|${ownerId}`).setLabel(configT(language, "center.welcome.button_test")).setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|texts|${ownerId}`).setLabel(configT(language, "center.welcome.button_edit_text")).setStyle(ButtonStyle.Secondary)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|bienvenida|clear_autorole|${ownerId}`).setLabel(configT(language, "center.welcome.button_clear_autorole")).setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  if (section === "despedida") {
    rows.push(
      new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId(`cfg_center_channel|despedida|goodbye_channel|${ownerId}`)
          .setPlaceholder(configT(language, "center.goodbye.placeholder_channel"))
          .addChannelTypes(ChannelType.GuildText)
          .setMinValues(1)
          .setMaxValues(1)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|toggle|${ownerId}`).setLabel(state.welcome.goodbye_enabled ? configT(language, "center.verify.button_disable") : configT(language, "center.verify.button_enable")).setStyle(state.welcome.goodbye_enabled ? ButtonStyle.Danger : ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|avatar|${ownerId}`).setLabel(configT(language, "center.goodbye.button_avatar", { state: onOff(language, state.welcome.goodbye_thumbnail !== false) })).setStyle(state.welcome.goodbye_thumbnail !== false ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|test|${ownerId}`).setLabel(configT(language, "center.goodbye.button_test")).setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|texts|${ownerId}`).setLabel(configT(language, "center.goodbye.button_edit_text")).setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`cfg_center_btn|despedida|refresh|${ownerId}`).setLabel(configT(language, "center.goodbye.button_refresh")).setStyle(ButtonStyle.Secondary)
      )
    );
    return rows;
  }

  rows.push(
    new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(`cfg_center_channel|sugerencias|suggest_channel|${ownerId}`)
        .setPlaceholder(configT(language, "center.suggestions.placeholder_channel"))
        .addChannelTypes(ChannelType.GuildText)
        .setMinValues(1)
        .setMaxValues(1)
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|toggle|${ownerId}`).setLabel(state.suggest.enabled ? configT(language, "center.verify.button_disable") : configT(language, "center.verify.button_enable")).setStyle(state.suggest.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|anon|${ownerId}`).setLabel(configT(language, "center.suggestions.button_anonymous", { state: onOff(language, state.suggest.anonymous) })).setStyle(state.suggest.anonymous ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|reason|${ownerId}`).setLabel(configT(language, "center.suggestions.button_reason", { state: onOff(language, state.suggest.require_reason) })).setStyle(state.suggest.require_reason ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|dm|${ownerId}`).setLabel(configT(language, "center.suggestions.button_dm", { state: onOff(language, state.suggest.dm_on_result) })).setStyle(state.suggest.dm_on_result ? ButtonStyle.Success : ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`cfg_center_btn|sugerencias|cooldown|${ownerId}`).setLabel(configT(language, "center.suggestions.button_cooldown", { minutes: state.suggest.cooldown_minutes || 0 })).setStyle(ButtonStyle.Secondary)
    )
  );
  return rows;
}

function buildSectionEmbed(guild, section, state, language) {
  if (section === "general") return buildGeneralEmbed(guild, state.settings, language);
  if (section === "roles") return buildRolesEmbed(guild, state.settings, language);
  if (section === "verify") return buildVerifyEmbed(guild, state.verify, language);
  if (section === "verify-advanced") return buildVerifyAdvancedEmbed(guild, state.verify, language);
  if (section === "modlogs") return buildModlogsEmbed(guild, state.modlogs, language);
  if (section === "sistema") return buildSystemEmbed(guild, state.settings, state.backups, language);
  if (section === "autorespuestas") return buildAutoResponsesEmbed(guild, state.autoResponses, language);
  if (section === "blacklist") return buildBlacklistEmbed(guild, state.blacklist, language);
  if (section === "bienvenida") return buildWelcomeEmbed(guild, state.welcome, language);
  if (section === "despedida") return buildGoodbyeEmbed(guild, state.welcome, language);
  return buildSuggestEmbed(guild, state.suggest, language);
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
  const language = resolveGuildLanguage(state.settings);
  return {
    embeds: [buildSectionEmbed(guild, safeSection, state, language)],
    components: buildSectionComponents(ownerId, safeSection, state, language),
  };
}

module.exports = {
  buildCenterPayload,
};
