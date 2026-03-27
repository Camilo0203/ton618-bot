const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { settings } = require("../../../../utils/database");
const { normalizeCommandName } = require("../../../../utils/commandToggles");
const E = require("../../../../utils/embeds");

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
    group
      .setName("commands")
      .setDescription("Control which commands are enabled for this server")
      .addSubcommand((sub) =>
        sub
          .setName("disable")
          .setDescription("Disable a command in this server")
          .addStringOption((option) =>
            option
              .setName("command")
              .setDescription("Command name without /, for example ping")
              .setRequired(true)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("enable")
          .setDescription("Re-enable a command that was previously disabled")
          .addStringOption((option) =>
            option
              .setName("command")
              .setDescription("Command name without /, for example ping")
              .setRequired(true)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("status")
          .setDescription("View the status of one command or the full summary")
          .addStringOption((option) =>
            option
              .setName("command")
              .setDescription("Command name without / (optional)")
              .setRequired(false)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("reset")
          .setDescription("Re-enable every disabled command")
      )
      .addSubcommand((sub) =>
        sub
          .setName("list")
          .setDescription("List the commands currently disabled in this server")
      )
      .addSubcommand((sub) =>
        sub
          .setName("panel")
          .setDescription("Open an interactive command management panel")
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

function formatCommandList(list, max = 10) {
  if (!Array.isArray(list) || !list.length) return "None";
  const visible = list.slice(0, max).map((name) => `- \`/${name}\``).join("\n");
  const remaining = list.length - max;
  if (remaining <= 0) return visible;
  return `${visible}\n- ... and ${remaining} more`;
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

function buildModeLabel(mode) {
  const safeMode = normalizePanelMode(mode);
  if (safeMode === "enable") return "Enable";
  if (safeMode === "status") return "Status";
  return "Disable";
}

function buildPanelPayload({ interaction, settingsObj, ownerId, mode = "disable", notice = null }) {
  const availableCommands = getAvailableCommandNames(interaction);
  const disabledCommands = getDisabledCommandNames(settingsObj);
  const safeMode = normalizePanelMode(mode);
  const candidates = getPanelCandidates(safeMode, availableCommands, disabledCommands);
  const visibleCandidates = candidates.slice(0, MAX_PANEL_OPTIONS);
  const hiddenCount = Math.max(0, candidates.length - visibleCandidates.length);

  const summaryLines = [
    `Available: **${availableCommands.length}**`,
    `Disabled: **${disabledCommands.length}**`,
    `Current mode: **${buildModeLabel(safeMode)}**`,
    `Candidates in menu: **${visibleCandidates.length}**${hiddenCount ? ` (+${hiddenCount} hidden)` : ""}`,
  ];
  if (notice) {
    summaryLines.push("", `Result: ${notice}`);
  }

  const embed = E.infoEmbed("Server command controls", summaryLines.join("\n"));

  const actionMenu = new StringSelectMenuBuilder()
    .setCustomId(`setup_cmd_panel_action|${ownerId}`)
    .setPlaceholder("Select an action")
    .addOptions([
      {
        label: "Disable command",
        description: "Block a command in this server",
        value: "disable",
        default: safeMode === "disable",
      },
      {
        label: "Enable command",
        description: "Restore a previously disabled command",
        value: "enable",
        default: safeMode === "enable",
      },
      {
        label: "Command status",
        description: "Check whether a command is enabled",
        value: "status",
        default: safeMode === "status",
      },
      {
        label: "List disabled",
        description: "Show the disabled command summary",
        value: "list",
      },
      {
        label: "Reset all",
        description: "Re-enable every disabled command",
        value: "reset",
      },
    ]);

  const targetMenu = new StringSelectMenuBuilder()
    .setCustomId(`setup_cmd_panel_target|${ownerId}|${safeMode}`)
    .setPlaceholder(`Command to ${buildModeLabel(safeMode).toLowerCase()}`);

  if (!visibleCandidates.length) {
    targetMenu
      .setDisabled(true)
      .addOptions([
        {
          label: "No commands available",
          description: "Switch actions to see more options",
          value: "__none__",
        },
      ]);
  } else {
    targetMenu.addOptions(
      visibleCandidates.map((name) => ({
        label: `/${name}`,
        description: safeMode === "status"
          ? "Check current status"
          : safeMode === "enable"
            ? "Enable command"
            : "Disable command",
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

function buildListMessage(available, disabled) {
  const enabledCount = Math.max(0, available.length - disabled.length);
  if (!disabled.length) {
    return `No commands are disabled in this server.\nAvailable: **${available.length}** | Enabled: **${enabledCount}**.`;
  }

  const body = disabled.map((name) => `- \`/${name}\``).join("\n");
  return (
    `Disabled commands (${disabled.length}):\n${body}\n\n` +
    `Available: **${available.length}** | Enabled: **${enabledCount}**.`
  );
}

async function sendCommandAuditLog({ interaction, settingsObj, action, commandName, before, after }) {
  const logChannelId = settingsObj?.log_channel;
  if (!logChannelId) return;

  const logChannel = interaction.guild?.channels?.cache?.get(logChannelId);
  if (!logChannel) return;

  const normalizedAction = normalizePanelMode(action) === action ? action : normalizePanelMode(action);
  const actionLabel = {
    disable: "Command disabled",
    enable: "Command enabled",
    reset: "Command reset",
  }[normalizedAction] || "Command update";

  const embed = new EmbedBuilder()
    .setColor(normalizedAction === "enable" ? 0x57F287 : normalizedAction === "reset" ? 0xFEE75C : 0xED4245)
    .setTitle(actionLabel)
    .setDescription(commandName ? `Affected command: \`/${commandName}\`` : "A global command change was applied.")
    .addFields(
      { name: "Executed by", value: `<@${interaction.user.id}>`, inline: true },
      { name: "Server", value: interaction.guild?.name || interaction.guildId || "Unknown", inline: true },
      { name: "Before", value: formatCommandList(before), inline: false },
      { name: "After", value: formatCommandList(after), inline: false },
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

  const normalizedSub = normalizeSetupSubcommand(sub);
  const availableCommands = getAvailableCommandNames(interaction);
  const disabledCommands = getDisabledCommandNames(s);

  if (normalizedSub === "list") {
    await interaction.reply({
      embeds: [E.infoEmbed("Server commands", buildListMessage(availableCommands, disabledCommands))],
      flags: 64,
    });
    return true;
  }

  if (normalizedSub === "status") {
    const rawName = getCommandOption(interaction);
    if (!rawName) {
      await interaction.reply({
        embeds: [E.infoEmbed("Command status", buildListMessage(availableCommands, disabledCommands))],
        flags: 64,
      });
      return true;
    }

    const commandName = normalizeCommandName(rawName);
    if (!commandName || !availableCommands.includes(commandName)) {
      return er(`The command \`/${commandName || rawName}\` does not exist in this bot.`);
    }

    const disabled = disabledCommands.includes(commandName);
    return ok(
      `Status for \`/${commandName}\`: **${disabled ? "Disabled" : "Enabled"}**.\n` +
      `Currently disabled commands: **${disabledCommands.length}**.`,
    );
  }

  if (normalizedSub === "panel") {
    const ownerId = interaction.user.id;
    const payload = buildPanelPayload({
      interaction,
      settingsObj: s,
      ownerId,
      mode: "disable",
      notice: "Use the menus below to manage commands without typing names manually.",
    });
    await interaction.reply({ ...payload, flags: 64 });
    return true;
  }

  if (normalizedSub === "reset") {
    if (!disabledCommands.length) {
      return ok("No commands were disabled. Nothing to reset.");
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
    return ok(`Re-enabled **${disabledCommands.length}** command(s).`);
  }

  const rawName = getCommandOption(interaction);
  const commandName = normalizeCommandName(rawName);
  if (!commandName) {
    return er("You must provide a valid command name.");
  }

  if (!availableCommands.includes(commandName)) {
    return er(`The command \`/${commandName}\` does not exist in this bot.`);
  }

  if (commandName === "setup" && normalizedSub === "disable") {
    return er("You cannot disable `/setup`, otherwise you could lock yourself out of configuration.");
  }

  if (normalizedSub === "disable") {
    if (disabledCommands.includes(commandName)) {
      return ok(`The command \`/${commandName}\` was already disabled.`);
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
    return ok(`Command \`/${commandName}\` disabled for this server.`);
  }

  if (normalizedSub === "enable") {
    if (!disabledCommands.includes(commandName)) {
      return ok(`The command \`/${commandName}\` was already enabled.`);
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
    return ok(`Command \`/${commandName}\` enabled again.`);
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
