const { PermissionFlagsBits, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require("discord.js");
const { settings, verifSettings, welcomeSettings, suggestSettings, verifLogs, modlogSettings, configBackups } = require("../../../../utils/database");
const TH = require("../../../../handlers/ticketHandler");
const { buildCenterPayload } = require("./index");
const { sendVerifPanel } = require("../verify");
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

async function sendWelcomeTest(interaction, w) {
  if (!w.welcome_channel) {
    return interaction.reply({ content: "Set a welcome channel first.", flags: 64 });
  }
  const channel = interaction.guild.channels.cache.get(w.welcome_channel);
  if (!channel) return interaction.reply({ content: "Welcome channel not found.", flags: 64 });

  const embed = new EmbedBuilder()
    .setColor(parseInt(w.welcome_color || "5865F2", 16))
    .setTitle(w.welcome_title || "ðŸ‘‹ Â¡Bienvenido/a!")
    .setDescription((w.welcome_message || "Bienvenido {mention}!").replace("{mention}", interaction.user.toString()).replace("{user}", interaction.user.username).replace("{server}", interaction.guild.name))
    .setTimestamp();
  if (w.welcome_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));
  if (w.welcome_banner) embed.setImage(w.welcome_banner);
  if (w.welcome_footer) embed.setFooter({ text: w.welcome_footer.replace("{server}", interaction.guild.name) });

  await channel.send({ embeds: [embed], content: `${interaction.user} *(welcome test)*` });
  return interaction.reply({ content: `Test sent to ${channel}.`, flags: 64 });
}

async function sendGoodbyeTest(interaction, w) {
  if (!w.goodbye_channel) {
    return interaction.reply({ content: "Set a goodbye channel first.", flags: 64 });
  }
  const channel = interaction.guild.channels.cache.get(w.goodbye_channel);
  if (!channel) return interaction.reply({ content: "Goodbye channel not found.", flags: 64 });

  const embed = new EmbedBuilder()
    .setColor(parseInt(w.goodbye_color || "ED4245", 16))
    .setTitle(w.goodbye_title || "ðŸ‘‹ Hasta luego")
    .setDescription((w.goodbye_message || "{user} ha salido del servidor.").replace("{user}", interaction.user.username).replace("{server}", interaction.guild.name))
    .setTimestamp();
  if (w.goodbye_thumbnail !== false) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));
  if (w.goodbye_footer) embed.setFooter({ text: w.goodbye_footer.replace("{server}", interaction.guild.name) });

  await channel.send({ embeds: [embed], content: `*(goodbye test)*` });
  return interaction.reply({ content: `Test sent to ${channel}.`, flags: 64 });
}

function verifyQuestionModal(ownerId) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|verify|question|${ownerId}`)
    .setTitle("Verification question")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("question").setLabel("Question").setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(200)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("answer").setLabel("Correct answer").setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100)
      )
    );
}

function verifyPanelModal(ownerId, v) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|verify-advanced|panel_text|${ownerId}`)
    .setTitle("Verification panel")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("title").setLabel("Title").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(100).setValue(v.panel_title || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("description").setLabel("Description").setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(1000).setValue(v.panel_description || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("color").setLabel("HEX color (without #)").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(6).setValue(v.panel_color || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("image").setLabel("Image URL").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(500).setValue(v.panel_image || "")
      )
    );
}

function welcomeTextsModal(ownerId, w) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|bienvenida|texts|${ownerId}`)
    .setTitle("Welcome text")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("title").setLabel("Title").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(100).setValue(w.welcome_title || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("message").setLabel("Message").setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(1000).setValue(w.welcome_message || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("footer").setLabel("Footer").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(200).setValue(w.welcome_footer || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("color").setLabel("HEX color (without #)").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(6).setValue(w.welcome_color || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("banner").setLabel("Banner URL").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(500).setValue(w.welcome_banner || "")
      )
    );
}

function goodbyeTextsModal(ownerId, w) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|despedida|texts|${ownerId}`)
    .setTitle("Goodbye text")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("title").setLabel("Title").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(100).setValue(w.goodbye_title || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("message").setLabel("Message").setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(1000).setValue(w.goodbye_message || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("footer").setLabel("Footer").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(200).setValue(w.goodbye_footer || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("color").setLabel("HEX color (without #)").setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(6).setValue(w.goodbye_color || "")
      )
    );
}

function generalLimitsModal(ownerId, s) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|general|limits|${ownerId}`)
    .setTitle("Limits and access")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("global_limit").setLabel("Global ticket limit (0=off)").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.global_ticket_limit || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("cooldown").setLabel("Cooldown minutes").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.cooldown_minutes || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("min_days").setLabel("Minimum days in server").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.min_days || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("transcript_channel").setLabel("Transcript channel ID").setStyle(TextInputStyle.Short).setRequired(false).setValue(s.transcript_channel || "")
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("weekly_report_channel").setLabel("Weekly report channel ID").setStyle(TextInputStyle.Short).setRequired(false).setValue(s.weekly_report_channel || "")
      )
    );
}

function generalAutomationModal(ownerId, s) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|general|automation|${ownerId}`)
    .setTitle("Ticket automation")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("auto_close").setLabel("Auto-close minutes (0=off)").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.auto_close_minutes || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("sla").setLabel("SLA minutes (0=off)").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.sla_minutes || 0))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("smart_ping").setLabel("Smart ping minutes (0=off)").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.smart_ping_minutes || 0))
      )
    );
}

function antiRaidModal(ownerId, v) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|verify-advanced|antiraid_cfg|${ownerId}`)
    .setTitle("Anti-raid config")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("joins").setLabel("Joins to trigger (3-50)").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(v.antiraid_joins || 10))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("seconds").setLabel("Window seconds (5-60)").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(v.antiraid_seconds || 10))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("action").setLabel("Action: kick or pause").setStyle(TextInputStyle.Short).setRequired(false).setValue(v.antiraid_action || "pause")
      )
    );
}

function maintenanceReasonModal(ownerId, s) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|maintenance_reason|${ownerId}`)
    .setTitle("Maintenance reason")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("reason")
          .setLabel("Reason (leave empty to clear)")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
          .setMaxLength(500)
          .setValue(s.maintenance_reason || "")
      )
    );
}

function rateLimitModal(ownerId, s) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|rate_cfg|${ownerId}`)
    .setTitle("Rate limit")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("window").setLabel("Window seconds (3-120)").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.rate_limit_window_seconds || 10))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("max_actions").setLabel("Max actions (1-50)").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.rate_limit_max_actions || 8))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("bypass_admin").setLabel("Bypass admin: true/false").setStyle(TextInputStyle.Short).setRequired(false).setValue(String(s.rate_limit_bypass_admin !== false))
      )
    );
}

function commandRateLimitModal(ownerId, s) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|cmd_rate_cfg|${ownerId}`)
    .setTitle("Command rate limit")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("window")
          .setLabel("Window seconds (1-300)")
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setValue(String(s.command_rate_limit_window_seconds || 20))
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("max_actions")
          .setLabel("Max per command (1-50)")
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setValue(String(s.command_rate_limit_max_actions || 4))
      )
    );
}

function autoresponseAddModal(ownerId) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|autorespuestas|add|${ownerId}`)
    .setTitle("Add auto response")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("trigger").setLabel("Trigger").setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("response").setLabel("Response").setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(1000)
      )
    );
}

function autoresponseTriggerModal(ownerId, action) {
  const titleMap = { toggle: "Toggle auto response", delete: "Delete auto response" };
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|autorespuestas|${action}|${ownerId}`)
    .setTitle(titleMap[action] || "Auto response")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("trigger").setLabel("Exact trigger").setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100)
      )
    );
}

function blacklistAddModal(ownerId) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|blacklist|add|${ownerId}`)
    .setTitle("Block user")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("user_id").setLabel("User ID or @mention").setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(40)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("reason").setLabel("Reason").setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(500)
      )
    );
}

function blacklistUserModal(ownerId, action) {
  const titleMap = { remove: "Unblock user", check: "Check user" };
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|blacklist|${action}|${ownerId}`)
    .setTitle(titleMap[action] || "Blacklist")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("user_id").setLabel("User ID or @mention").setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(40)
      )
    );
}

function importConfigModal(ownerId) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|import_json|${ownerId}`)
    .setTitle("Import configuration")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("json")
          .setLabel("Paste the exported JSON")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000)
      )
    );
}

function rollbackByIdModal(ownerId) {
  return new ModalBuilder()
    .setCustomId(`cfg_center_modal|sistema|rollback_id|${ownerId}`)
    .setTitle("Rollback by backup ID")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("backup_id")
          .setLabel("Exact backup ID")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(80)
      )
    );
}

function toRelativeDiscordTime(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "invalid date";
  return `<t:${Math.floor(date.getTime() / 1000)}:R>`;
}

function buildBackupListMessage(backups) {
  if (!Array.isArray(backups) || backups.length === 0) {
    return "No saved backups yet.";
  }

  return backups
    .map((item, index) => {
      const id = item.backup_id || "sin-id";
      const source = item.source || "manual";
      return `${index + 1}. \`${id}\` â€¢ ${source} â€¢ ${toRelativeDiscordTime(item.created_at)}`;
    })
    .join("\n");
}

module.exports = {
  customId: "cfg_center_btn|*",

  async execute(interaction) {
    const { section, action, ownerId } = parseCustomId(interaction.customId);

    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: "Only the person who opened this center can use it.", flags: 64 });
    }
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: "Only administrators can configure the bot.", flags: 64 });
    }

    const gid = interaction.guild.id;
    const s = await settings.get(gid);
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
          return interaction.update({ content: "There are no backups available for rollback.", components: [] });
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
        return interaction.update({ content: "Invalid critical action.", components: [] });
      }

      if (messageId) {
        const centerMsg = await interaction.channel?.messages?.fetch(messageId).catch(() => null);
        if (centerMsg) {
          await centerMsg.edit(await buildCenterPayload(interaction.guild, ownerId, targetSection));
        }
      }

      return interaction.update({ content: "Action confirmed and applied.", components: [] });
    }

    if (section === "cancel") {
      return interaction.update({ content: "Action canceled.", components: [] });
    }

    if (isCriticalAction(section, action)) {
      const confirmLabelMap = {
        clear_staff: "clear the staff role",
        clear_admin: "clear the admin role",
        clear_verify: "clear the minimum verify role",
        clear_verified: "clear the verified role",
        clear_unverified: "clear the unverified role",
        clear_autorole: "clear the welcome auto-role",
        maintenance: s.maintenance_mode ? "disable maintenance" : "enable maintenance",
        rollback_last: "restore the latest backup",
      };
      const centerMsgId = interaction.message?.id || "";
      return interaction.reply({
        content: `Please confirm that you want to **${confirmLabelMap[action] || "run this action"}**.`,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`cfg_center_btn|confirm|${section}:${action}:${centerMsgId}|${ownerId}`)
              .setLabel("Confirm")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(`cfg_center_btn|cancel|${section}|${ownerId}`)
              .setLabel("Cancel")
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
      else if (action === "limits") return interaction.showModal(generalLimitsModal(ownerId, s));
      else if (action === "automation") return interaction.showModal(generalAutomationModal(ownerId, s));
      else if (action === "publish") {
        const channel = interaction.guild.channels.cache.get(s.panel_channel_id);
        if (!channel) return interaction.reply({ content: "Set the panel channel first.", flags: 64 });
        const msg = await TH.sendPanel(channel, interaction.guild);
        if (msg?.id) await settings.update(gid, { panel_message_id: msg.id });
        await interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
        return interaction.followUp({ content: `Panel published in ${channel}.`, flags: 64 });
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
        return interaction.followUp({ content: "Verification panel sent or refreshed.", flags: 64 });
      } else if (action === "question") {
        return interaction.showModal(verifyQuestionModal(ownerId));
      } else if (action === "stats") {
        const stats = await verifLogs.getStats(gid);
        const recents = await verifLogs.getRecent(gid, 5);
        const recentText = recents.length
          ? recents.map((l) => {
              const icon = l.status === "verified" ? "âœ…" : l.status === "failed" ? "âŒ" : "ðŸš«";
              return `${icon} <@${l.user_id}> â€” <t:${Math.floor(new Date(l.created_at).getTime() / 1000)}:R>`;
            }).join("\n")
          : "No recent activity";
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x57f287)
              .setTitle("Verification stats")
              .addFields(
                { name: "Verified", value: `\`${stats.verified}\``, inline: true },
                { name: "Failed", value: `\`${stats.failed}\``, inline: true },
                { name: "Kicked", value: `\`${stats.kicked}\``, inline: true },
                { name: "Total", value: `\`${stats.total}\``, inline: true },
                { name: "Recent activity", value: recentText, inline: false }
              )
              .setTimestamp(),
          ],
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
        const recentText = recents.length
          ? recents.map((l) => {
              const icon = l.status === "verified" ? "âœ…" : l.status === "failed" ? "âŒ" : "ðŸš«";
              return `${icon} <@${l.user_id}> â€” <t:${Math.floor(new Date(l.created_at).getTime() / 1000)}:R>`;
            }).join("\n")
          : "No recent activity";
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x57f287)
              .setTitle("Verification stats")
              .addFields(
                { name: "Verified", value: `\`${stats.verified}\``, inline: true },
                { name: "Failed", value: `\`${stats.failed}\``, inline: true },
                { name: "Kicked", value: `\`${stats.kicked}\``, inline: true },
                { name: "Total", value: `\`${stats.total}\``, inline: true },
                { name: "Recent activity", value: recentText, inline: false }
              )
              .setTimestamp(),
          ],
          flags: 64,
        });
      } else if (action === "antiraid_cfg") {
        return interaction.showModal(antiRaidModal(ownerId, v));
      } else if (action === "panel_text") {
        return interaction.showModal(verifyPanelModal(ownerId, v));
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
        return interaction.showModal(maintenanceReasonModal(ownerId, s));
      } else if (action === "rate_toggle") {
        await settings.update(gid, { rate_limit_enabled: !s.rate_limit_enabled });
      } else if (action === "rate_cfg") {
        return interaction.showModal(rateLimitModal(ownerId, s));
      } else if (action === "cmd_rate_toggle") {
        await settings.update(gid, { command_rate_limit_enabled: !s.command_rate_limit_enabled });
      } else if (action === "cmd_rate_cfg") {
        return interaction.showModal(commandRateLimitModal(ownerId, s));
      } else if (action === "dm_transcripts") {
        await settings.update(gid, { dm_transcripts: !s.dm_transcripts });
      } else if (action === "dm_alerts") {
        await settings.update(gid, { dm_alerts: !s.dm_alerts });
      } else if (action === "import_json") {
        return interaction.showModal(importConfigModal(ownerId));
      } else if (action === "rollback_id") {
        return interaction.showModal(rollbackByIdModal(ownerId));
      } else if (action === "backup_list") {
        const recent = await configBackups.listRecent(gid, 8);
        return interaction.reply({
          content: `Recent backups:\n${buildBackupListMessage(recent)}`,
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
            ? `Backup generated with ID \`${saved.backup_id}\`. You can import it from /config center > System > Import JSON.`
            : "Backup generated. You can import it in another server from /config center > System > Import JSON.",
          files: [new AttachmentBuilder(Buffer.from(raw, "utf8"), { name: filename })],
          flags: 64,
        });
      }
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "autorespuestas") {
      if (action === "add") return interaction.showModal(autoresponseAddModal(ownerId));
      if (action === "toggle") return interaction.showModal(autoresponseTriggerModal(ownerId, "toggle"));
      if (action === "delete") return interaction.showModal(autoresponseTriggerModal(ownerId, "delete"));
      if (action === "refresh") return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
      return interaction.reply({ content: "Invalid action for auto responses.", flags: 64 });
    }

    if (section === "blacklist") {
      if (action === "add") return interaction.showModal(blacklistAddModal(ownerId));
      if (action === "remove") return interaction.showModal(blacklistUserModal(ownerId, "remove"));
      if (action === "check") return interaction.showModal(blacklistUserModal(ownerId, "check"));
      if (action === "refresh") return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
      return interaction.reply({ content: "Invalid action for blacklist.", flags: 64 });
    }

    if (section === "bienvenida") {
      if (action === "toggle") await welcomeSettings.update(gid, { welcome_enabled: !w.welcome_enabled });
      else if (action === "avatar") await welcomeSettings.update(gid, { welcome_thumbnail: !(w.welcome_thumbnail !== false) });
      else if (action === "dm") await welcomeSettings.update(gid, { welcome_dm: !w.welcome_dm });
      else if (action === "clear_autorole") await welcomeSettings.update(gid, { welcome_autorole: null });
      else if (action === "test") return sendWelcomeTest(interaction, w);
      else if (action === "texts") return interaction.showModal(welcomeTextsModal(ownerId, w));
      return interaction.update(await buildCenterPayload(interaction.guild, ownerId, section));
    }

    if (section === "despedida") {
      if (action === "toggle") await welcomeSettings.update(gid, { goodbye_enabled: !w.goodbye_enabled });
      else if (action === "avatar") await welcomeSettings.update(gid, { goodbye_thumbnail: !(w.goodbye_thumbnail !== false) });
      else if (action === "test") return sendGoodbyeTest(interaction, w);
      else if (action === "texts") return interaction.showModal(goodbyeTextsModal(ownerId, w));
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

