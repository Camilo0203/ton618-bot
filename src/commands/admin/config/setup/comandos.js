const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { settings } = require("../../../../utils/database");
const { normalizeCommandName } = require("../../../../utils/commandToggles");
const E = require("../../../../utils/embeds");
const { resolveInteractionLanguage, t } = require("../../../../utils/i18n");
const { withDescriptionLocalizations } = require("../../../../utils/slashLocalizations");

const GROUP_ALIASES = {
  comandos: "commands",
};

const SUB_ALIASES = {
  deshabilitar: "disable",
  habilitar: "enable",
  estado: "status",
  listar: "list",
};

const MODE_ALIASES = {
  deshabilitar: "disable",
  habilitar: "enable",
  estado: "status",
};

const COMMAND_PANEL_MODES = new Set(["disable", "enable", "status"]);
const MAX_PANEL_OPTIONS = 25;

function normalizeSetupGroup(group) {
  return GROUP_ALIASES[group] || group;
}

function normalizeSetupSubcommand(sub) {
  return SUB_ALIASES[sub] || sub;
}

function getCommandOption(interaction) {
  return interaction.options.getString("command")
    || interaction.options.getString("comando");
}

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    withDescriptionLocalizations(
      group
        .setName("commands")
        .setDescription(t("en", "setup.slash.groups.commands.description"))
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("disable")
            .setDescription(t("en", "setup.slash.groups.commands.subcommands.disable.description"))
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("command")
                .setDescription(t("en", "setup.slash.groups.commands.options.command_required"))
                .setRequired(true)
                .setAutocomplete(true),
              "setup.slash.groups.commands.options.command_required"
            )
          ),
          "setup.slash.groups.commands.subcommands.disable.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("enable")
            .setDescription(t("en", "setup.slash.groups.commands.subcommands.enable.description"))
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("command")
                .setDescription(t("en", "setup.slash.groups.commands.options.command_required"))
                .setRequired(true)
                .setAutocomplete(true),
              "setup.slash.groups.commands.options.command_required"
            )
          ),
          "setup.slash.groups.commands.subcommands.enable.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("status")
            .setDescription(t("en", "setup.slash.groups.commands.subcommands.status.description"))
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("command")
                .setDescription(t("en", "setup.slash.groups.commands.options.command_optional"))
                .setRequired(false)
                .setAutocomplete(true),
              "setup.slash.groups.commands.options.command_optional"
            )
          ),
          "setup.slash.groups.commands.subcommands.status.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("reset")
            .setDescription(t("en", "setup.slash.groups.commands.subcommands.reset.description")),
          "setup.slash.groups.commands.subcommands.reset.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("list")
            .setDescription(t("en", "setup.slash.groups.commands.subcommands.list.description")),
          "setup.slash.groups.commands.subcommands.list.description"
        )
      )
      .addSubcommand((sub) =>
        withDescriptionLocalizations(
          sub
            .setName("panel")
            .setDescription(t("en", "setup.slash.groups.commands.subcommands.panel.description")),
          "setup.slash.groups.commands.subcommands.panel.description"
        )
      ),
      "setup.slash.groups.commands.description"
    )
  );
}

function getAvailableCommandNames(interaction) {
  const names = [];
  const collection = interaction?.client?.commands;
  if (!collection) return names;

  for (const [name] of collection) {
    const normalized = normalizeCommandName(name);
    if (normalized) names.push(normalized);
  }

  return Array.from(new Set(names)).sort();
}

function getDisabledCommandNames(settingsObj) {
  const source = Array.isArray(settingsObj?.disabled_commands)
    ? settingsObj.disabled_commands
    : [];

  return Array.from(
    new Set(
      source
        .map((item) => normalizeCommandName(item))
        .filter(Boolean),
    ),
  ).sort();
}

function formatCommandList(list, language, max = 10) {
  if (!Array.isArray(list) || !list.length) return t(language, "common.value.none");
  const visible = list.slice(0, max).map((name) => `- \`/${name}\``).join("\n");
  const remaining = list.length - max;
  if (remaining <= 0) return visible;
  return `${visible}\n${t(language, "setup.commands.format_more", { count: remaining })}`;
}

function normalizePanelMode(mode) {
  const normalized = normalizeCommandName(mode);
  const alias = MODE_ALIASES[normalized] || normalized;
  if (COMMAND_PANEL_MODES.has(alias)) return alias;
  return "disable";
}

function getPanelCandidates(mode, availableCommands, disabledCommands) {
  const safeMode = normalizePanelMode(mode);
  if (safeMode === "disable") {
    return availableCommands.filter((name) => !disabledCommands.includes(name) && name !== "setup");
  }
  if (safeMode === "enable") {
    return disabledCommands;
  }
  return availableCommands;
}

function buildModeLabel(mode, language) {
  const safeMode = normalizePanelMode(mode);
  if (safeMode === "enable") return t(language, "setup.commands.mode_enable");
  if (safeMode === "status") return t(language, "setup.commands.mode_status");
  return t(language, "setup.commands.mode_disable");
}

function buildPanelPayload({ interaction, settingsObj, ownerId, mode = "disable", notice = null }) {
  const language = resolveInteractionLanguage(interaction, settingsObj);
  const availableCommands = getAvailableCommandNames(interaction);
  const disabledCommands = getDisabledCommandNames(settingsObj);
  const safeMode = normalizePanelMode(mode);
  const candidates = getPanelCandidates(safeMode, availableCommands, disabledCommands);
  const visibleCandidates = candidates.slice(0, MAX_PANEL_OPTIONS);
  const hiddenCount = Math.max(0, candidates.length - visibleCandidates.length);

  const summaryLines = [
    t(language, "setup.commands.summary_available", { count: availableCommands.length }),
    t(language, "setup.commands.summary_disabled", { count: disabledCommands.length }),
    t(language, "setup.commands.summary_current_mode", { mode: buildModeLabel(safeMode, language) }),
    t(language, "setup.commands.summary_candidates", {
      visible: visibleCandidates.length,
      hiddenText: hiddenCount ? t(language, "setup.commands.hidden_suffix", { count: hiddenCount }) : "",
    }),
  ];
  if (notice) {
    summaryLines.push("", t(language, "setup.commands.summary_result", { notice }));
  }

  const embed = E.infoEmbed(t(language, "setup.commands.panel_title"), summaryLines.join("\n"));

  const actionMenu = new StringSelectMenuBuilder()
    .setCustomId(`setup_cmd_panel_action|${ownerId}`)
    .setPlaceholder(t(language, "setup.commands.placeholder_action"))
    .addOptions([
      {
        label: t(language, "setup.commands.option_disable_label"),
        description: t(language, "setup.commands.option_disable_description"),
        value: "disable",
        default: safeMode === "disable",
      },
      {
        label: t(language, "setup.commands.option_enable_label"),
        description: t(language, "setup.commands.option_enable_description"),
        value: "enable",
        default: safeMode === "enable",
      },
      {
        label: t(language, "setup.commands.option_status_label"),
        description: t(language, "setup.commands.option_status_description"),
        value: "status",
        default: safeMode === "status",
      },
      {
        label: t(language, "setup.commands.option_list_label"),
        description: t(language, "setup.commands.option_list_description"),
        value: "list",
      },
      {
        label: t(language, "setup.commands.option_reset_label"),
        description: t(language, "setup.commands.option_reset_description"),
        value: "reset",
      },
    ]);

  const targetMenu = new StringSelectMenuBuilder()
    .setCustomId(`setup_cmd_panel_target|${ownerId}|${safeMode}`)
    .setPlaceholder(t(language, "setup.commands.placeholder_target", { action: buildModeLabel(safeMode, language).toLowerCase() }));

  if (!visibleCandidates.length) {
    targetMenu
      .setDisabled(true)
      .addOptions([
        {
          label: t(language, "setup.commands.no_candidates_label"),
          description: t(language, "setup.commands.no_candidates_description"),
          value: "__none__",
        },
      ]);
  } else {
    targetMenu.addOptions(
      visibleCandidates.map((name) => ({
        label: `/${name}`,
        description: safeMode === "status"
          ? t(language, "setup.commands.candidate_description_status")
          : safeMode === "enable"
            ? t(language, "setup.commands.candidate_description_enable")
            : t(language, "setup.commands.candidate_description_disable"),
        value: name,
      })),
    );
  }

  return {
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(actionMenu),
      new ActionRowBuilder().addComponents(targetMenu),
    ],
  };
}

function buildListMessage(available, disabled, language) {
  const enabledCount = Math.max(0, available.length - disabled.length);
  if (!disabled.length) {
    return t(language, "setup.commands.list_none", {
      available: available.length,
      enabled: enabledCount,
    });
  }

  const body = disabled.map((name) => `- \`/${name}\``).join("\n");
  return (
    `${t(language, "setup.commands.list_heading", { count: disabled.length })}\n${body}\n\n` +
    t(language, "setup.commands.list_footer", { available: available.length, enabled: enabledCount })
  );
}

async function sendCommandAuditLog({ interaction, settingsObj, action, commandName, before, after }) {
  const language = resolveInteractionLanguage(interaction, settingsObj);
  const logChannelId = settingsObj?.log_channel;
  if (!logChannelId) return;

  const logChannel = interaction.guild?.channels?.cache?.get(logChannelId);
  if (!logChannel) return;

  const normalizedAction = normalizePanelMode(action) === action ? action : normalizePanelMode(action);
  const actionLabel = {
    disable: t(language, "setup.commands.audit_disabled"),
    enable: t(language, "setup.commands.audit_enabled"),
    reset: t(language, "setup.commands.audit_reset"),
  }[normalizedAction] || t(language, "setup.commands.audit_updated");

  const embed = new EmbedBuilder()
    .setColor(normalizedAction === "enable" ? 0x57F287 : normalizedAction === "reset" ? 0xFEE75C : 0xED4245)
    .setTitle(actionLabel)
    .setDescription(commandName ? t(language, "setup.commands.audit_affected", { command: commandName }) : t(language, "setup.commands.audit_global"))
    .addFields(
      { name: t(language, "setup.commands.audit_executed_by"), value: `<@${interaction.user.id}>`, inline: true },
      { name: t(language, "setup.commands.audit_server"), value: interaction.guild?.name || interaction.guildId || "Unknown", inline: true },
      { name: t(language, "setup.commands.audit_before"), value: formatCommandList(before, language), inline: false },
      { name: t(language, "setup.commands.audit_after"), value: formatCommandList(after, language), inline: false },
    )
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(() => {});
}

async function autocomplete(ctx) {
  const { interaction, group, sub, s } = ctx;
  if (normalizeSetupGroup(group) !== "commands") return false;

  const focused = interaction.options.getFocused(true);
  if (focused?.name !== "command" && focused?.name !== "comando") {
    return false;
  }

  const normalizedSub = normalizeSetupSubcommand(sub);
  const query = normalizeCommandName(focused.value);
  const availableCommands = getAvailableCommandNames(interaction);
  const disabledCommands = getDisabledCommandNames(s);

  let candidates = [];
  if (normalizedSub === "disable") {
    candidates = availableCommands.filter((name) => !disabledCommands.includes(name) && name !== "setup");
  } else if (normalizedSub === "enable") {
    candidates = disabledCommands;
  } else if (normalizedSub === "status") {
    candidates = availableCommands;
  }

  const choices = candidates
    .filter((name) => !query || name.includes(query))
    .slice(0, 25)
    .map((name) => ({ name: `/${name}`, value: name }));

  await interaction.respond(choices).catch(() => {});
  return true;
}

async function execute(ctx) {
  const { interaction, group, sub, gid, s, ok, er } = ctx;
  if (normalizeSetupGroup(group) !== "commands") return false;
  const language = resolveInteractionLanguage(interaction, s);

  const normalizedSub = normalizeSetupSubcommand(sub);
  const availableCommands = getAvailableCommandNames(interaction);
  const disabledCommands = getDisabledCommandNames(s);

  if (normalizedSub === "list") {
    await interaction.reply({
      embeds: [E.infoEmbed(t(language, "setup.commands.list_embed_title"), buildListMessage(availableCommands, disabledCommands, language))],
      flags: 64,
    });
    return true;
  }

  if (normalizedSub === "status") {
    const rawName = getCommandOption(interaction);
    if (!rawName) {
      await interaction.reply({
        embeds: [E.infoEmbed(t(language, "setup.commands.status_embed_title"), buildListMessage(availableCommands, disabledCommands, language))],
        flags: 64,
      });
      return true;
    }

    const commandName = normalizeCommandName(rawName);
    if (!commandName || !availableCommands.includes(commandName)) {
      return er(t(language, "setup.commands.unknown_command", { command: commandName || rawName }));
    }

    const disabled = disabledCommands.includes(commandName);
    return ok(t(language, "setup.commands.status_result", {
      command: commandName,
      state: t(language, disabled ? "common.state.disabled" : "common.state.enabled"),
      count: disabledCommands.length,
    }));
  }

  if (normalizedSub === "panel") {
    const ownerId = interaction.user.id;
    const payload = buildPanelPayload({
      interaction,
      settingsObj: s,
      ownerId,
      mode: "disable",
      notice: t(language, "setup.commands.panel_notice"),
    });
    await interaction.reply({ ...payload, flags: 64 });
    return true;
  }

  if (normalizedSub === "reset") {
    if (!disabledCommands.length) {
      return ok(t(language, "setup.commands.reset_noop"));
    }

    await settings.update(gid, { disabled_commands: [] });
    await sendCommandAuditLog({
      interaction,
      settingsObj: s,
      action: "reset",
      commandName: null,
      before: disabledCommands,
      after: [],
    });
    return ok(t(language, "setup.commands.reset_done", { count: disabledCommands.length }));
  }

  const rawName = getCommandOption(interaction);
  const commandName = normalizeCommandName(rawName);
  if (!commandName) {
    return er(t(language, "setup.commands.missing_command_name"));
  }

  if (!availableCommands.includes(commandName)) {
    return er(t(language, "setup.commands.unknown_command", { command: commandName }));
  }

  if (commandName === "setup" && normalizedSub === "disable") {
    return er(t(language, "setup.commands.disable_setup_forbidden"));
  }

  if (normalizedSub === "disable") {
    if (disabledCommands.includes(commandName)) {
      return ok(t(language, "setup.commands.already_disabled", { command: commandName }));
    }

    const updated = [...disabledCommands, commandName].sort();
    await settings.update(gid, { disabled_commands: updated });
    await sendCommandAuditLog({
      interaction,
      settingsObj: s,
      action: "disable",
      commandName,
      before: disabledCommands,
      after: updated,
    });
    return ok(t(language, "setup.commands.disabled_success", { command: commandName }));
  }

  if (normalizedSub === "enable") {
    if (!disabledCommands.includes(commandName)) {
      return ok(t(language, "setup.commands.already_enabled", { command: commandName }));
    }

    const updated = disabledCommands.filter((name) => name !== commandName);
    await settings.update(gid, { disabled_commands: updated });
    await sendCommandAuditLog({
      interaction,
      settingsObj: s,
      action: "enable",
      commandName,
      before: disabledCommands,
      after: updated,
    });
    return ok(t(language, "setup.commands.enabled_success", { command: commandName }));
  }

  return false;
}

module.exports = {
  register,
  execute,
  autocomplete,
  buildPanelPayload,
  __test: {
    getAvailableCommandNames,
    getDisabledCommandNames,
    buildListMessage,
    formatCommandList,
    getPanelCandidates,
    normalizePanelMode,
  },
  __internal: {
    getAvailableCommandNames,
    getDisabledCommandNames,
    buildListMessage,
    sendCommandAuditLog,
    buildPanelPayload,
    getPanelCandidates,
    normalizePanelMode,
  },
};
