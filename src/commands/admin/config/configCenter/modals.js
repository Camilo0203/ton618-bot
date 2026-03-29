const { PermissionFlagsBits } = require("discord.js");
const { settings, verifSettings, welcomeSettings, suggestSettings, modlogSettings, autoResponses, blacklist, configBackups } = require("../../../../utils/database");
const { resolveGuildLanguage } = require("../../../../utils/i18n");
const { buildCenterPayload } = require("./index");
const { sendVerifPanel } = require("../verify");
const { parseAndSanitizeBackup, saveCurrentConfigBackup, applyBackupSnapshot } = require("./backup");
const { configT } = require("../i18n");

function parseCustomId(customId) {
  const [prefix, section, action, ownerId] = customId.split("|");
  return { prefix, section, action, ownerId };
}

function readField(interaction, id) {
  try {
    return interaction.fields.getTextInputValue(id)?.trim() || "";
  } catch {
    return "";
  }
}

function parseBool(raw, fallback = true) {
  const value = String(raw || "").trim().toLowerCase();
  if (!value) return fallback;
  if (["true", "1", "on", "si", "yes", "y"].includes(value)) return true;
  if (["false", "0", "off", "no", "n"].includes(value)) return false;
  return fallback;
}

function parseUserId(raw) {
  const id = String(raw || "").replace(/[^\d]/g, "");
  return /^\d{16,22}$/.test(id) ? id : null;
}

async function refreshCenterMessage(interaction, ownerId, section) {
  if (!interaction.message) return;
  const payload = await buildCenterPayload(interaction.guild, ownerId, section);
  await interaction.message.edit(payload).catch(() => {});
}

module.exports = {
  customId: "cfg_center_modal|*",

  async execute(interaction) {
    const { section, action, ownerId } = parseCustomId(interaction.customId);
    const gid = interaction.guild.id;
    const guildSettings = await settings.get(gid);
    const language = resolveGuildLanguage(guildSettings);

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: configT(language, "center.access.owner_only"), flags: 64 });
    }
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: configT(language, "center.access.admin_only"), flags: 64 });
    }

    if (section === "general" && action === "limits") {
      const globalLimit = Number(readField(interaction, "global_limit") || 0);
      const cooldown = Number(readField(interaction, "cooldown") || 0);
      const minDays = Number(readField(interaction, "min_days") || 0);
      const transcriptChannel = readField(interaction, "transcript_channel");
      const weeklyReportChannel = readField(interaction, "weekly_report_channel");

      const update = {
        global_ticket_limit: Number.isFinite(globalLimit) ? Math.max(0, Math.min(500, Math.floor(globalLimit))) : 0,
        cooldown_minutes: Number.isFinite(cooldown) ? Math.max(0, Math.min(1440, Math.floor(cooldown))) : 0,
        min_days: Number.isFinite(minDays) ? Math.max(0, Math.min(365, Math.floor(minDays))) : 0,
      };

      if (transcriptChannel && !/^\d{16,22}$/.test(transcriptChannel)) {
        return interaction.reply({ content: configT(language, "center.responses.invalid_transcript_channel_id"), flags: 64 });
      }
      if (weeklyReportChannel && !/^\d{16,22}$/.test(weeklyReportChannel)) {
        return interaction.reply({ content: configT(language, "center.responses.invalid_weekly_report_channel_id"), flags: 64 });
      }

      if (transcriptChannel) update.transcript_channel = transcriptChannel;
      if (weeklyReportChannel) update.weekly_report_channel = weeklyReportChannel;

      await settings.update(gid, update);
      await refreshCenterMessage(interaction, ownerId, "general");
      return interaction.reply({ content: configT(language, "center.responses.limits_updated"), flags: 64 });
    }

    if (section === "general" && action === "automation") {
      const autoClose = Number(readField(interaction, "auto_close") || 0);
      const sla = Number(readField(interaction, "sla") || 0);
      const smartPing = Number(readField(interaction, "smart_ping") || 0);
      await settings.update(gid, {
        auto_close_minutes: Number.isFinite(autoClose) ? Math.max(0, Math.min(10080, Math.floor(autoClose))) : 0,
        sla_minutes: Number.isFinite(sla) ? Math.max(0, Math.min(1440, Math.floor(sla))) : 0,
        smart_ping_minutes: Number.isFinite(smartPing) ? Math.max(0, Math.min(1440, Math.floor(smartPing))) : 0,
      });
      await refreshCenterMessage(interaction, ownerId, "general");
      return interaction.reply({ content: configT(language, "center.responses.automation_updated"), flags: 64 });
    }

    if (section === "sistema" && action === "maintenance_reason") {
      const reason = readField(interaction, "reason");
      await settings.update(gid, { maintenance_reason: reason || null });
      await refreshCenterMessage(interaction, ownerId, "sistema");
      return interaction.reply({ content: configT(language, "center.responses.maintenance_reason_updated"), flags: 64 });
    }

    if (section === "sistema" && action === "rate_cfg") {
      const window = Number(readField(interaction, "window") || 10);
      const maxActions = Number(readField(interaction, "max_actions") || 8);
      const bypassAdmin = parseBool(readField(interaction, "bypass_admin"), true);
      await settings.update(gid, {
        rate_limit_window_seconds: Number.isFinite(window) ? Math.max(3, Math.min(120, Math.floor(window))) : 10,
        rate_limit_max_actions: Number.isFinite(maxActions) ? Math.max(1, Math.min(50, Math.floor(maxActions))) : 8,
        rate_limit_bypass_admin: bypassAdmin,
      });
      await refreshCenterMessage(interaction, ownerId, "sistema");
      return interaction.reply({ content: configT(language, "center.responses.rate_limit_updated"), flags: 64 });
    }

    if (section === "sistema" && action === "cmd_rate_cfg") {
      const window = Number(readField(interaction, "window") || 20);
      const maxActions = Number(readField(interaction, "max_actions") || 4);
      await settings.update(gid, {
        command_rate_limit_window_seconds: Number.isFinite(window) ? Math.max(1, Math.min(300, Math.floor(window))) : 20,
        command_rate_limit_max_actions: Number.isFinite(maxActions) ? Math.max(1, Math.min(50, Math.floor(maxActions))) : 4,
      });
      await refreshCenterMessage(interaction, ownerId, "sistema");
      return interaction.reply({ content: configT(language, "center.responses.command_rate_limit_updated"), flags: 64 });
    }

    if (section === "sistema" && action === "import_json") {
      const json = readField(interaction, "json");
      if (!json) return interaction.reply({ content: configT(language, "center.responses.import_payload_required"), flags: 64 });

      let parsed;
      try {
        parsed = parseAndSanitizeBackup(json);
      } catch {
        return interaction.reply({ content: configT(language, "center.responses.invalid_json"), flags: 64 });
      }

      await saveCurrentConfigBackup({
        guildId: gid,
        actorId: interaction.user.id,
        source: "pre_import_json",
      });
      await applyBackupSnapshot(gid, parsed);
      await saveCurrentConfigBackup({
        guildId: gid,
        actorId: interaction.user.id,
        source: "import_applied",
      });

      const newVerify = await verifSettings.get(gid);
      await sendVerifPanel(interaction.guild, newVerify, interaction.client).catch(() => {});
      await refreshCenterMessage(interaction, ownerId, "sistema");
      return interaction.reply({ content: configT(language, "center.responses.import_success"), flags: 64 });
    }

    if (section === "sistema" && action === "rollback_id") {
      const backupId = readField(interaction, "backup_id");
      if (!backupId) {
        return interaction.reply({ content: configT(language, "center.responses.backup_id_required"), flags: 64 });
      }

      const backup = await configBackups.getById(gid, backupId);
      if (!backup?.payload) {
        return interaction.reply({ content: configT(language, "center.responses.backup_not_found"), flags: 64 });
      }

      await saveCurrentConfigBackup({
        guildId: gid,
        actorId: interaction.user.id,
        source: "pre_rollback_id",
      });
      await applyBackupSnapshot(gid, backup.payload);
      await saveCurrentConfigBackup({
        guildId: gid,
        actorId: interaction.user.id,
        source: `rollback_applied:${backup.backup_id}`,
      });

      const newVerify = await verifSettings.get(gid);
      await sendVerifPanel(interaction.guild, newVerify, interaction.client).catch(() => {});
      await refreshCenterMessage(interaction, ownerId, "sistema");
      return interaction.reply({
        content: configT(language, "center.responses.rollback_applied", { backupId: backup.backup_id }),
        flags: 64,
      });
    }

    if (section === "autorespuestas" && action === "add") {
      const trigger = readField(interaction, "trigger").toLowerCase();
      const response = readField(interaction, "response");
      if (!trigger || !response) {
        return interaction.reply({ content: configT(language, "center.responses.trigger_and_response_required"), flags: 64 });
      }
      await autoResponses.create(gid, trigger, response, interaction.user.id);
      await refreshCenterMessage(interaction, ownerId, "autorespuestas");
      return interaction.reply({ content: configT(language, "center.responses.auto_response_saved", { trigger }), flags: 64 });
    }

    if (section === "autorespuestas" && action === "toggle") {
      const trigger = readField(interaction, "trigger").toLowerCase();
      if (!trigger) return interaction.reply({ content: configT(language, "center.responses.trigger_required"), flags: 64 });
      const updated = await autoResponses.toggle(gid, trigger);
      if (!updated) return interaction.reply({ content: configT(language, "center.responses.trigger_missing"), flags: 64 });
      await refreshCenterMessage(interaction, ownerId, "autorespuestas");
      return interaction.reply({ content: configT(language, "center.responses.trigger_state", { trigger, state: updated.enabled ? configT(language, "common.on") : configT(language, "common.off") }), flags: 64 });
    }

    if (section === "autorespuestas" && action === "delete") {
      const trigger = readField(interaction, "trigger").toLowerCase();
      if (!trigger) return interaction.reply({ content: configT(language, "center.responses.trigger_required"), flags: 64 });
      const ok = await autoResponses.delete(gid, trigger);
      if (!ok) return interaction.reply({ content: configT(language, "center.responses.trigger_missing"), flags: 64 });
      await refreshCenterMessage(interaction, ownerId, "autorespuestas");
      return interaction.reply({ content: configT(language, "center.responses.trigger_deleted", { trigger }), flags: 64 });
    }

    if (section === "blacklist" && action === "add") {
      const userId = parseUserId(readField(interaction, "user_id"));
      const reason = readField(interaction, "reason") || configT(language, "center.blacklist.no_reason");
      if (!userId) return interaction.reply({ content: configT(language, "center.responses.invalid_user_id"), flags: 64 });
      if (userId === interaction.user.id) {
        return interaction.reply({ content: configT(language, "center.responses.cannot_block_self"), flags: 64 });
      }
      await blacklist.add(userId, gid, reason, interaction.user.id);
      await refreshCenterMessage(interaction, ownerId, "blacklist");
      return interaction.reply({ content: configT(language, "center.responses.user_blocked", { userId }), flags: 64 });
    }

    if (section === "blacklist" && action === "remove") {
      const userId = parseUserId(readField(interaction, "user_id"));
      if (!userId) return interaction.reply({ content: configT(language, "center.responses.invalid_user_id"), flags: 64 });
      const result = await blacklist.remove(userId, gid);
      await refreshCenterMessage(interaction, ownerId, "blacklist");
      return interaction.reply({
        content: result.changes
          ? configT(language, "center.responses.user_removed", { userId })
          : configT(language, "center.responses.user_not_blacklisted"),
        flags: 64,
      });
    }

    if (section === "blacklist" && action === "check") {
      const userId = parseUserId(readField(interaction, "user_id"));
      if (!userId) return interaction.reply({ content: configT(language, "center.responses.invalid_user_id"), flags: 64 });
      const entry = await blacklist.check(userId, gid);
      await refreshCenterMessage(interaction, ownerId, "blacklist");
      return interaction.reply({
        content: entry
          ? configT(language, "center.responses.blacklist_entry", { userId, reason: entry.reason || configT(language, "center.blacklist.no_reason") })
          : configT(language, "center.responses.blacklist_not_found", { userId }),
        flags: 64,
      });
    }

    if (section === "verify" && action === "question") {
      const question = readField(interaction, "question");
      const answer = readField(interaction, "answer");
      if (!question || !answer) {
        return interaction.reply({ content: configT(language, "center.responses.question_answer_required"), flags: 64 });
      }
      await verifSettings.update(gid, { question, question_answer: answer.toLowerCase() });
      await refreshCenterMessage(interaction, ownerId, "verify");
      await interaction.reply({ content: configT(language, "center.responses.verification_question_updated"), flags: 64 });
      return;
    }

    if (section === "verify-advanced" && action === "panel_text") {
      const title = readField(interaction, "title");
      const description = readField(interaction, "description");
      const color = readField(interaction, "color");
      const image = readField(interaction, "image");
      if (color && !/^[0-9A-Fa-f]{6}$/.test(color)) {
        return interaction.reply({ content: configT(language, "center.responses.invalid_color"), flags: 64 });
      }
      if (image && !/^https?:\/\//i.test(image)) {
        return interaction.reply({ content: configT(language, "center.responses.invalid_image"), flags: 64 });
      }
      const update = {};
      if (title) update.panel_title = title;
      if (description) update.panel_description = description;
      if (color) update.panel_color = color;
      if (image) update.panel_image = image;
      await verifSettings.update(gid, update);
      const v = await verifSettings.get(gid);
      await sendVerifPanel(interaction.guild, v, interaction.client).catch(() => {});
      await refreshCenterMessage(interaction, ownerId, "verify-advanced");
      return interaction.reply({ content: configT(language, "center.responses.verification_panel_updated"), flags: 64 });
    }

    if (section === "verify-advanced" && action === "antiraid_cfg") {
      const joins = Number(readField(interaction, "joins") || 10);
      const seconds = Number(readField(interaction, "seconds") || 10);
      const actionValue = readField(interaction, "action").toLowerCase();
      if (!["kick", "pause", ""].includes(actionValue)) {
        return interaction.reply({ content: configT(language, "center.responses.invalid_antiraid_action"), flags: 64 });
      }
      await verifSettings.update(gid, {
        antiraid_joins: Number.isFinite(joins) ? Math.max(3, Math.min(50, Math.floor(joins))) : 10,
        antiraid_seconds: Number.isFinite(seconds) ? Math.max(5, Math.min(60, Math.floor(seconds))) : 10,
        ...(actionValue ? { antiraid_action: actionValue } : {}),
      });
      await refreshCenterMessage(interaction, ownerId, "verify-advanced");
      return interaction.reply({ content: configT(language, "center.responses.antiraid_updated"), flags: 64 });
    }

    if (section === "bienvenida" && action === "texts") {
      const title = readField(interaction, "title");
      const message = readField(interaction, "message");
      const footer = readField(interaction, "footer");
      const color = readField(interaction, "color");
      const banner = readField(interaction, "banner");

      if (color && !/^[0-9A-Fa-f]{6}$/.test(color)) {
        return interaction.reply({ content: configT(language, "center.responses.invalid_color"), flags: 64 });
      }
      if (banner && !/^https?:\/\//i.test(banner)) {
        return interaction.reply({ content: configT(language, "center.responses.invalid_banner"), flags: 64 });
      }

      const update = {};
      if (title) update.welcome_title = title;
      if (message) update.welcome_message = message;
      if (footer) update.welcome_footer = footer;
      if (color) update.welcome_color = color;
      if (banner !== "") update.welcome_banner = banner || null;

      await welcomeSettings.update(gid, update);
      await refreshCenterMessage(interaction, ownerId, "bienvenida");
      return interaction.reply({ content: configT(language, "center.responses.welcome_text_updated"), flags: 64 });
    }

    if (section === "despedida" && action === "texts") {
      const title = readField(interaction, "title");
      const message = readField(interaction, "message");
      const footer = readField(interaction, "footer");
      const color = readField(interaction, "color");

      if (color && !/^[0-9A-Fa-f]{6}$/.test(color)) {
        return interaction.reply({ content: configT(language, "center.responses.invalid_color"), flags: 64 });
      }

      const update = {};
      if (title) update.goodbye_title = title;
      if (message) update.goodbye_message = message;
      if (footer) update.goodbye_footer = footer;
      if (color) update.goodbye_color = color;

      await welcomeSettings.update(gid, update);
      await refreshCenterMessage(interaction, ownerId, "despedida");
      return interaction.reply({ content: configT(language, "center.responses.goodbye_text_updated"), flags: 64 });
    }

    return interaction.reply({ content: configT(language, "center.responses.unsupported_modal"), flags: 64 });
  },
};
