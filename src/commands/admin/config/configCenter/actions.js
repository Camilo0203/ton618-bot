const { PermissionFlagsBits, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require("discord.js");
const { settings, verifSettings, welcomeSettings, suggestSettings, verifLogs, modlogSettings, configBackups } = require("../../../../utils/database");
const TH = require("../../../../handlers/ticketHandler");
const { resolveGuildLanguage } = require("../../../../utils/i18n");
const { buildCenterPayload } = require("./index");
const { sendVerifPanel } = require("../verify");
const { configT } = require("../i18n");
const {
  buildCurrentConfigSnapshot,
  saveCurrentConfigBackup,
  applyBackupSnapshot,
} = require("./backup");

function parseCustomId(customId) {
  const [prefix, section, action, ownerId] = customId.split("|");
  return { prefix, section, action, ownerId };
}

function isCriticalAction(section, action) {
  if (section === "roles" && ["clear_staff", "clear_admin", "clear_verify"].includes(action)) return true;
  if (section === "verify" && ["clear_verified", "clear_unverified"].includes(action)) return true;
  if (section === "verify-advanced" && action === "clear_unverified") return true;
  if (section === "bienvenida" && action === "clear_autorole") return true;
  if (section === "sistema" && ["maintenance", "rollback_last"].includes(action)) return true;
  return false;
}

function modeCycle(current) {
  const modes = ["button", "code", "question"];
  const idx = modes.indexOf(current);
  return modes[(idx + 1) % modes.length];
}

async function sendWelcomeTest(interaction, w, language) {
  if (!w.welcome_channel) {
    return interaction.reply({ content: configT(language, "center.responses.set_welcome_channel_first"), flags: 64 });
  }
  const channel = interaction.guild.channels.cache.get(w.welcome_channel);
  if (!channel) return interaction.reply({ content: configT(language, "center.responses.welcome_channel_missing"), flags: 64 });

  const embed = new EmbedBuilder()
    .setColor(parseInt(w.welcome_color || "5865F2", 16))
    .setTitle(w.welcome_title || configT(language, "center.responses.welcome_default_title"))
    .setDescription((w.welcome_message || configT(language, "center.responses.welcome_default_message")).replace("{mention}", interaction.user.toString()).replace("{user}", interaction.user.username).replace("{server}", interaction.guild.name))
    .setTimestamp();
  if (w.welcome_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));
  if (w.welcome_banner) embed.setImage(w.welcome_banner);
  if (w.welcome_footer) embed.setFooter({ text: w.welcome_footer.replace("{server}", interaction.guild.name) });

  await channel.send({ embeds: [embed], content: `${interaction.user} ${configT(language, "center.responses.welcome_test_suffix")}` });
  return interaction.reply({ content: configT(language, "center.responses.test_sent", { channel: String(channel) }), flags: 64 });
}

async function sendGoodbyeTest(interaction, w, language) {
  if (!w.goodbye_channel) {
    return interaction.reply({ content: configT(language, "center.responses.set_goodbye_channel_first"), flags: 64 });
  }
  const channel = interaction.guild.channels.cache.get(w.goodbye_channel);
  if (!channel) return interaction.reply({ content: configT(language, "center.responses.goodbye_channel_missing"), flags: 64 });

  const embed = new EmbedBuilder()
    .setColor(parseInt(w.goodbye_color || "ED4245", 16))
    .setTitle(w.goodbye_title || configT(language, "center.responses.goodbye_default_title"))
    .setDescription((w.goodbye_message || configT(language, "center.responses.goodbye_default_message")).replace("{user}", interaction.user.username).replace("{server}", interaction.guild.name))
    .setTimestamp();
  if (w.goodbye_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));
  if (w.goodbye_footer) embed.setFooter({ text: w.goodbye_footer.replace("{server}", interaction.guild.name) });

  await channel.send({ embeds: [embed], content: configT(language, "center.responses.goodbye_test_suffix") });
  return interaction.reply({ content: configT(language, "center.responses.test_sent", { channel: String(channel) }), flags: 64 });
}

function verifyQuestionModal(ownerId, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|verify|question|${ownerId}`)
    .setTitle(configT(language, "center.modals.verify_question_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("question").setLabel(configT(language, "center.modals.field_question")).setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(200)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("answer").setLabel(configT(language, "center.modals.field_answer")).setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100)
      )
    );
}

function verifyPanelModal(ownerId, v, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|verify-advanced|panel_text|${ownerId}`)
    .setTitle(configT(language, "center.modals.verify_panel_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("title").setLabel(configT(language, "center.modals.field_title")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(100).setValue(v.panel_title || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("description").setLabel(configT(language, "center.modals.field_description")).setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(1000).setValue(v.panel_description || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("color").setLabel(configT(language, "center.modals.field_color")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(6).setValue(v.panel_color || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("image").setLabel(configT(language, "center.modals.field_image")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(500).setValue(v.panel_image || "")
      )
    );
}

function welcomeTextsModal(ownerId, w, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|bienvenida|texts|${ownerId}`)
    .setTitle(configT(language, "center.modals.welcome_text_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("title").setLabel(configT(language, "center.modals.field_title")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(100).setValue(w.welcome_title || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("message").setLabel(configT(language, "center.modals.field_message")).setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(1000).setValue(w.welcome_message || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("footer").setLabel(configT(language, "center.modals.field_footer")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(200).setValue(w.welcome_footer || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("color").setLabel(configT(language, "center.modals.field_color")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(6).setValue(w.welcome_color || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("banner").setLabel(configT(language, "center.modals.field_banner")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(500).setValue(w.welcome_banner || "")
      )
    );
}

function goodbyeTextsModal(ownerId, w, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|despedida|texts|${ownerId}`)
    .setTitle(configT(language, "center.modals.goodbye_text_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("title").setLabel(configT(language, "center.modals.field_title")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(100).setValue(w.goodbye_title || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("message").setLabel(configT(language, "center.modals.field_message")).setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(1000).setValue(w.goodbye_message || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("footer").setLabel(configT(language, "center.modals.field_footer")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(200).setValue(w.goodbye_footer || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("color").setLabel(configT(language, "center.modals.field_color")).setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(6).setValue(w.goodbye_color || "")
      )
    );
}

function generalLimitsModal(ownerId, s, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|general|limits|${ownerId}`)
    .setTitle(configT(language, "center.modals.limits_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("global_limit").setLabel(configT(language, "center.modals.field_global_limit")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.global_ticket_limit || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("cooldown").setLabel(configT(language, "center.modals.field_cooldown")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.cooldown_minutes || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("min_days").setLabel(configT(language, "center.modals.field_min_days")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.min_days || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("transcript_channel").setLabel(configT(language, "center.modals.field_transcript_channel")).setStyle(TextInputStyle.Short).setRequired(false).setValue(s.transcript_channel || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("weekly_report_channel").setLabel(configT(language, "center.modals.field_weekly_report_channel")).setStyle(TextInputStyle.Short).setRequired(false).setValue(s.weekly_report_channel || "")
      )
    );
}

function generalAutomationModal(ownerId, s, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|general|automation|${ownerId}`)
    .setTitle(configT(language, "center.modals.automation_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("auto_close").setLabel(configT(language, "center.modals.field_auto_close")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.auto_close_minutes || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("sla").setLabel(configT(language, "center.modals.field_sla")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.sla_minutes || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("smart_ping").setLabel(configT(language, "center.modals.field_smart_ping")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.smart_ping_minutes || 0))
      )
    );
}

function antiRaidModal(ownerId, v, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|verify-advanced|antiraid_cfg|${ownerId}`)
    .setTitle(configT(language, "center.modals.antiraid_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("joins").setLabel(configT(language, "center.modals.field_joins")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(v.antiraid_joins || 10))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("seconds").setLabel(configT(language, "center.modals.field_seconds")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(v.antiraid_seconds || 10))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("action").setLabel(configT(language, "center.modals.field_action")).setStyle(TextInputStyle.Short).setRequired(false).setValue(v.antiraid_action || "pause")
      )
    );
}

function maintenanceReasonModal(ownerId, s, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|maintenance_reason|${ownerId}`)
    .setTitle(configT(language, "center.modals.maintenance_reason_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("reason")
          .setLabel(configT(language, "center.modals.field_reason_clear"))
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
          .setMaxLength(500)
          .setValue(s.maintenance_reason || "")
      )
    );
}

function rateLimitModal(ownerId, s, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|rate_cfg|${ownerId}`)
    .setTitle(configT(language, "center.modals.rate_limit_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("window").setLabel(configT(language, "center.modals.field_window")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.rate_limit_window_seconds || 10))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("max_actions").setLabel(configT(language, "center.modals.field_max_actions")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.rate_limit_max_actions || 8))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("bypass_admin").setLabel(configT(language, "center.modals.field_bypass_admin")).setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.rate_limit_bypass_admin !== false))
      )
    );
}

function commandRateLimitModal(ownerId, s, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|cmd_rate_cfg|${ownerId}`)
    .setTitle(configT(language, "center.modals.command_rate_limit_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("window")
          .setLabel(configT(language, "center.modals.field_cmd_window"))
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setValue(String(s.command_rate_limit_window_seconds || 20))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("max_actions")
          .setLabel(configT(language, "center.modals.field_cmd_max"))
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setValue(String(s.command_rate_limit_max_actions || 4))
      )
    );
}

function autoresponseAddModal(ownerId, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|autorespuestas|add|${ownerId}`)
    .setTitle(configT(language, "center.modals.autoresponse_add_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("trigger").setLabel(configT(language, "center.modals.field_trigger")).setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("response").setLabel(configT(language, "center.modals.field_response")).setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(1000)
      )
    );
}

function autoresponseTriggerModal(ownerId, action, language) {
  const titleMap = {
    toggle: configT(language, "center.modals.autoresponse_toggle_title"),
    delete: configT(language, "center.modals.autoresponse_delete_title"),
  };
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|autorespuestas|${action}|${ownerId}`)
    .setTitle(titleMap[action] || configT(language, "center.modals.autoresponse_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("trigger").setLabel(configT(language, "center.modals.field_exact_trigger")).setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100)
      )
    );
}

function blacklistAddModal(ownerId, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|blacklist|add|${ownerId}`)
    .setTitle(configT(language, "center.modals.blacklist_add_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("user_id").setLabel(configT(language, "center.modals.field_user_id")).setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(40)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("reason").setLabel(configT(language, "center.modals.field_reason")).setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(500)
      )
    );
}

function blacklistUserModal(ownerId, action, language) {
  const titleMap = {
    remove: configT(language, "center.modals.blacklist_remove_title"),
    check: configT(language, "center.modals.blacklist_check_title"),
  };
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|blacklist|${action}|${ownerId}`)
    .setTitle(titleMap[action] || configT(language, "center.modals.blacklist_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("user_id").setLabel(configT(language, "center.modals.field_user_id")).setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(40)
      )
    );
}

function importConfigModal(ownerId, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|import_json|${ownerId}`)
    .setTitle(configT(language, "center.modals.import_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("json")
          .setLabel(configT(language, "center.modals.field_json"))
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000)
      )
    );
}

function rollbackByIdModal(ownerId, language) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|rollback_id|${ownerId}`)
    .setTitle(configT(language, "center.modals.rollback_title"))
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("backup_id")
          .setLabel(configT(language, "center.modals.field_backup_id"))
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(80)
      )
    );
}

function toRelativeDiscordTime(value, language) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return configT(language, "common.invalid_date");
  return `<t:${Math.floor(date.getTime() / 1000)}:R>`;
}

function buildBackupListMessage(backups, language) {
  if (!Array.isArray(backups) || backups.length === 0) {
    return configT(language, "common.no_backups");
  }

  return backups
    .map((item, index) => {
      const id = item.backup_id || "sin-id";
      const source = item.source || "manual";
      return `${index + 1}. \`${id}\` - ${source} - ${toRelativeDiscordTime(item.created_at, language)}`;
    })
    .join("\n");
}

function buildVerificationStatsEmbed(language, stats, recents) {
  const recentText = recents.length
    ? recents
        .map((entry) => {
          const icon = entry.status === "verified" ? "✅" : entry.status === "failed" ? "❌" : "🚫";
          return `${icon} <@${entry.user_id}> - <t:${Math.floor(new Date(entry.created_at).getTime() / 1000)}:R>`;
        })
        .join("\n")
    : configT(language, "common.no_recent_activity");

  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(configT(language, "center.verify.stats_title"))
    .addFields(
      { name: configT(language, "center.verify.stats_verified"), value: `\`${stats.verified}\``, inline: true },
      { name: configT(language, "center.verify.stats_failed"), value: `\`${stats.failed}\``, inline: true },
      { name: configT(language, "center.verify.stats_kicked"), value: `\`${stats.kicked}\``, inline: true },
      { name: configT(language, "center.verify.stats_total"), value: `\`${stats.total}\``, inline: true },
      { name: configT(language, "center.verify.stats_recent"), value: recentText, inline: false }
    )
    .setTimestamp();
}

module.exports = {
  customId: "cfg_center_btn|*",

  async execute(interaction) {
    const { section, action, ownerId } = parseCustomId(interaction.customId);
    const gid = interaction.guild.id;
    const s = await settings.get(gid);
    const language = resolveGuildLanguage(s);

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: configT(language, "center.access.owner_only"), flags: 64 });
    }
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: configT(language, "center.access.admin_only"), flags: 64 });
    }
    const v = await verifSettings.get(gid);
    const w = await welcomeSettings.get(gid);
    const sg = await suggestSettings.get(gid);

    if (section === "confirm") {
      const [targetSection, targetAction, messageId] = String(action || "").split(":");
      if (targetSection === "roles" && targetAction === "clear_staff") {
        await settings.update(gid, { support_role: null });
      } else if (targetSection === "roles" && targetAction === "clear_admin") {
        await settings.update(gid, { admin_role: null });
      } else if (targetSection === "roles" && targetAction === "clear_verify") {
        await settings.update(gid, { verify_role: null });
      } else if (targetSection === "verify" && targetAction === "clear_verified") {
        await verifSettings.update(gid, { verified_role: null });
      } else if (targetSection === "verify" && targetAction === "clear_unverified") {
        await verifSettings.update(gid, { unverified_role: null });
      } else if (targetSection === "verify-advanced" && targetAction === "clear_unverified") {
        await verifSettings.update(gid, { unverified_role: null });
      } else if (targetSection === "bienvenida" && targetAction === "clear_autorole") {
        await welcomeSettings.update(gid, { welcome_autorole: null });
      } else if (targetSection === "sistema" && targetAction === "maintenance") {
        await settings.update(gid, { maintenance_mode: !s.maintenance_mode });
      } else if (targetSection === "sistema" && targetAction === "rollback_last") {
        const recent = await configBackups.listRecent(gid, 1);
        const latest = recent[0];
        if (!latest?.payload) {
          return interaction.update({ content: configT(language, "center.actions.no_backups_for_rollback"), components: [] });
        }
        await saveCurrentConfigBackup({
          guildId: gid,
          actorId: interaction.user.id,
          source: "pre_rollback",
        });
        await applyBackupSnapshot(gid, latest.payload);
        await saveCurrentConfigBackup({
          guildId: gid,
          actorId: interaction.user.id,
          source: `rollback_applied:${latest.backup_id}`,
        });
        const updatedVerif = await verifSettings.get(gid);
        await sendVerifPanel(interaction.guild, updatedVerif, interaction.client).catch(() => {});
      } else {
        return interaction.update({ content: configT(language, "center.actions.invalid_critical_action"), components: [] });
      }

      if (messageId) {
        const centerMsg = await interaction.channel?.messages?.fetch(messageId).catch(() => null);
        if (centerMsg) {
          await centerMsg.edit(await buildCenterPayload(interaction.guild, ownerId, targetSection));
        }
      }

      return interaction.update({ content: configT(language, "center.actions.action_confirmed"), components: [] });
    }

    if (section === "cancel") {
      return interaction.update({ content: configT(language, "center.actions.action_canceled"), components: [] });
    }

    if (isCriticalAction(section, action)) {
      const confirmLabelMap = {
        clear_staff: configT(language, "center.actions.clear_staff"),
        clear_admin: configT(language, "center.actions.clear_admin"),
        clear_verify: configT(language, "center.actions.clear_verify"),
        clear_verified: configT(language, "center.actions.clear_verified"),
        clear_unverified: configT(language, "center.actions.clear_unverified"),
        clear_autorole: configT(language, "center.actions.clear_autorole"),
        maintenance: s.maintenance_mode ? configT(language, "center.actions.maintenance_off") : configT(language, "center.actions.maintenance_on"),
        rollback_last: configT(language, "center.actions.rollback_latest"),
      };
      const centerMsgId = interaction.message?.id || "";
      return interaction.reply({
        content: configT(language, "center.actions.confirm_prompt", {
          action: confirmLabelMap[action] || configT(language, "center.actions.confirm_fallback"),
        }),
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`cfg_center_btn|confirm|${section}:${action}:${centerMsgId}|${ownerId}`)
              .setLabel(configT(language, "center.actions.confirm"))
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(`cfg_center_btn|cancel|${section}|${ownerId}`)
              .setLabel(configT(language, "center.actions.cancel"))
              .setStyle(ButtonStyle.Secondary)
          ),
        ],
        flags: 64,
      });
    }

    if (section === "general") {
      if (action === "max_dec") await settings.update(gid, { max_tickets: Math.max(1, (s.max_tickets || 3) - 1) });
      else if (action === "max_inc") await settings.update(gid, { max_tickets: Math.min(10, (s.max_tickets || 3) + 1) });
      else if (action === "toggle_help") await settings.update(gid, { simple_help_mode: !(s.simple_help_mode === false) });
      else if (action === "dm_open") await settings.update(gid, { dm_on_open: !s.dm_on_open });
      else if (action === "dm_close") await settings.update(gid, { dm_on_close: !s.dm_on_close });
      else if (action === "log_edits") await settings.update(gid, { log_edits: !s.log_edits });
      else if (action === "log_deletes") await settings.update(gid, { log_deletes: !s.log_deletes });
      else if (action === "limits") return interaction.showModal(generalLimitsModal(ownerId, s, language));
      else if (action === "automation") return interaction.showModal(generalAutomationModal(ownerId, s, language));
      else if (action === "publish") {
        const channel = interaction.guild.channels.cache.get(s.panel_channel_id);
        if (!channel) return interaction.reply({ content: configT(language, "center.actions.set_panel_channel_first"), flags: 64 });
        const msg = await TH.sendPanel(channel, interaction.guild);
        if (msg?.id) await settings.update(gid, { panel_message_id: msg.id });
        await interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
        return interaction.followUp({ content: configT(language, "center.actions.panel_published", { channel: String(channel) }), flags: 64 });
      }
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "roles") {
      if (action === "clear_staff") {
        await settings.update(gid, { support_role: null });
      } else if (action === "clear_admin") {
        await settings.update(gid, { admin_role: null });
      } else if (action === "clear_verify") {
        await settings.update(gid, { verify_role: null });
      }
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "verify") {
      if (action === "toggle") await verifSettings.update(gid, { enabled: !v.enabled });
      else if (action === "mode") await verifSettings.update(gid, { mode: modeCycle(v.mode || "button") });
      else if (action === "clear_verified") await verifSettings.update(gid, { verified_role: null });
      else if (action === "clear_unverified") await verifSettings.update(gid, { unverified_role: null });
      else if (action === "panel") {
        await sendVerifPanel(interaction.guild, v, interaction.client);
        await interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
        return interaction.followUp({ content: configT(language, "center.actions.verification_panel_refreshed"), flags: 64 });
      } else if (action === "question") {
        return interaction.showModal(verifyQuestionModal(ownerId, language));
      } else if (action === "stats") {
        const stats = await verifLogs.getStats(gid);
        const recents = await verifLogs.getRecent(gid, 5);
        return interaction.reply({
          embeds: [buildVerificationStatsEmbed(language, stats, recents)],
          flags: 64,
        });
      }
      const updatedV = await verifSettings.get(gid);
      await sendVerifPanel(interaction.guild, updatedV, interaction.client).catch(() => {});
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "verify-advanced") {
      if (action === "antiraid") await verifSettings.update(gid, { antiraid_enabled: !v.antiraid_enabled });
      else if (action === "autokick") {
        const cycle = [0, 24, 48, 72];
        const current = cycle.indexOf(v.kick_unverified_hours || 0);
        const next = cycle[(current + 1) % cycle.length];
        await verifSettings.update(gid, { kick_unverified_hours: next });
      } else if (action === "clear_unverified") {
        await verifSettings.update(gid, { unverified_role: null });
      } else if (action === "stats") {
        const stats = await verifLogs.getStats(gid);
        const recents = await verifLogs.getRecent(gid, 5);
        return interaction.reply({
          embeds: [buildVerificationStatsEmbed(language, stats, recents)],
          flags: 64,
        });
      } else if (action === "antiraid_cfg") {
        return interaction.showModal(antiRaidModal(ownerId, v, language));
      } else if (action === "panel_text") {
        return interaction.showModal(verifyPanelModal(ownerId, v, language));
      } else if (action === "dm") {
        await verifSettings.update(gid, { dm_on_verify: !v.dm_on_verify });
      }
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "modlogs") {
      const ml = await modlogSettings.get(gid);
      const toggleMap = {
        bans: "log_bans",
        unbans: "log_unbans",
        kicks: "log_kicks",
        nick: "log_nickname",
        msg_delete: "log_msg_delete",
        msg_edit: "log_msg_edit",
        role_add: "log_role_add",
        role_remove: "log_role_remove",
        joins: "log_joins",
        leaves: "log_leaves",
      };

      if (action === "toggle") {
        await modlogSettings.update(gid, { enabled: !ml.enabled });
      } else if (toggleMap[action]) {
        const key = toggleMap[action];
        await modlogSettings.update(gid, { [key]: !ml[key] });
      }
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "sistema") {
      if (action === "maintenance") {
        await settings.update(gid, { maintenance_mode: !s.maintenance_mode });
      } else if (action === "maintenance_reason") {
        return interaction.showModal(maintenanceReasonModal(ownerId, s, language));
      } else if (action === "rate_toggle") {
        await settings.update(gid, { rate_limit_enabled: !s.rate_limit_enabled });
      } else if (action === "rate_cfg") {
        return interaction.showModal(rateLimitModal(ownerId, s, language));
      } else if (action === "cmd_rate_toggle") {
        await settings.update(gid, { command_rate_limit_enabled: !s.command_rate_limit_enabled });
      } else if (action === "cmd_rate_cfg") {
        return interaction.showModal(commandRateLimitModal(ownerId, s, language));
      } else if (action === "dm_transcripts") {
        await settings.update(gid, { dm_transcripts: !s.dm_transcripts });
      } else if (action === "dm_alerts") {
        await settings.update(gid, { dm_alerts: !s.dm_alerts });
      } else if (action === "import_json") {
        return interaction.showModal(importConfigModal(ownerId, language));
      } else if (action === "rollback_id") {
        return interaction.showModal(rollbackByIdModal(ownerId, language));
      } else if (action === "backup_list") {
        const recent = await configBackups.listRecent(gid, 8);
        return interaction.reply({
          content: configT(language, "center.actions.recent_backups", {
            list: buildBackupListMessage(recent, language),
          }),
          flags: 64,
        });
      } else if (action === "export_json") {
        const backup = await buildCurrentConfigSnapshot(gid);
        const saved = await configBackups.create(gid, backup, {
          source: "export_json",
          actorId: interaction.user.id,
        });
        const exportPayload = {
          ...(saved?.backup_id ? { backup_id: saved.backup_id } : {}),
          ...backup,
        };
        const raw = JSON.stringify(exportPayload, null, 2);
        const filename = `config-backup-${interaction.guild.id}.json`;
        return interaction.reply({
          content: saved?.backup_id
            ? configT(language, "center.actions.export_with_id", { backupId: saved.backup_id })
            : configT(language, "center.actions.export_without_id"),
          files: [new AttachmentBuilder(Buffer.from(raw, "utf8"), { name: filename })],
          flags: 64,
        });
      }
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "autorespuestas") {
      if (action === "add") return interaction.showModal(autoresponseAddModal(ownerId, language));
      if (action === "toggle") return interaction.showModal(autoresponseTriggerModal(ownerId, "toggle", language));
      if (action === "delete") return interaction.showModal(autoresponseTriggerModal(ownerId, "delete", language));
      if (action === "refresh") return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
      return interaction.reply({ content: configT(language, "center.actions.invalid_action_autoresponses"), flags: 64 });
    }

    if (section === "blacklist") {
      if (action === "add") return interaction.showModal(blacklistAddModal(ownerId, language));
      if (action === "remove") return interaction.showModal(blacklistUserModal(ownerId, "remove", language));
      if (action === "check") return interaction.showModal(blacklistUserModal(ownerId, "check", language));
      if (action === "refresh") return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
      return interaction.reply({ content: configT(language, "center.actions.invalid_action_blacklist"), flags: 64 });
    }

    if (section === "bienvenida") {
      if (action === "toggle") await welcomeSettings.update(gid, { welcome_enabled: !w.welcome_enabled });
      else if (action === "avatar") await welcomeSettings.update(gid, { welcome_thumbnail: !(w.welcome_thumbnail !== false) });
      else if (action === "dm") await welcomeSettings.update(gid, { welcome_dm: !w.welcome_dm });
      else if (action === "clear_autorole") await welcomeSettings.update(gid, { welcome_autorole: null });
      else if (action === "test") return sendWelcomeTest(interaction, w, language);
      else if (action === "texts") return interaction.showModal(welcomeTextsModal(ownerId, w, language));
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "despedida") {
      if (action === "toggle") await welcomeSettings.update(gid, { goodbye_enabled: !w.goodbye_enabled });
      else if (action === "avatar") await welcomeSettings.update(gid, { goodbye_thumbnail: !(w.goodbye_thumbnail !== false) });
      else if (action === "test") return sendGoodbyeTest(interaction, w, language);
      else if (action === "texts") return interaction.showModal(goodbyeTextsModal(ownerId, w, language));
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "sugerencias") {
      if (action === "toggle") await suggestSettings.update(gid, { enabled: !sg.enabled });
      else if (action === "anon") await suggestSettings.update(gid, { anonymous: !sg.anonymous });
      else if (action === "reason") await suggestSettings.update(gid, { require_reason: !sg.require_reason });
      else if (action === "dm") await suggestSettings.update(gid, { dm_on_result: !sg.dm_on_result });
      else if (action === "cooldown") {
        const cycle = [0, 1, 5, 10, 30];
        const current = cycle.indexOf(sg.cooldown_minutes || 0);
        const next = cycle[(current + 1) % cycle.length];
        await suggestSettings.update(gid, { cooldown_minutes: next });
      }
    }

    return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
  },
};

