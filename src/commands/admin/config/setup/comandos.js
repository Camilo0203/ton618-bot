const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { settings } = require("../../../../utils/database");
const { normalizeCommandName } = require("../../../../utils/commandToggles");
const E = require("../../../../utils/embeds");

const COMMAND_PANEL_MODES = new Set(["deshabilitar", "habilitar", "estado"]);
const MAX_PANEL_OPTIONS = 25;

function register(builder) {
  return builder.addSubcommandGroup((group) =>
    group
      .setName("comandos")
      .setDescription("Gestionar comandos habilitados por servidor")
      .addSubcommand((s) =>
        s
          .setName("deshabilitar")
          .setDescription("Deshabilitar un comando para este servidor")
          .addStringOption((o) =>
            o
              .setName("comando")
              .setDescription("Nombre del comando sin / (ej: ping)")
              .setRequired(true)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("habilitar")
          .setDescription("Volver a habilitar un comando deshabilitado")
          .addStringOption((o) =>
            o
              .setName("comando")
              .setDescription("Nombre del comando sin / (ej: ping)")
              .setRequired(true)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("estado")
          .setDescription("Ver estado de un comando o resumen general")
          .addStringOption((o) =>
            o
              .setName("comando")
              .setDescription("Comando sin / (opcional)")
              .setRequired(false)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((s) =>
        s
          .setName("reset")
          .setDescription("Rehabilitar todos los comandos deshabilitados")
      )
      .addSubcommand((s) =>
        s
          .setName("listar")
          .setDescription("Ver comandos deshabilitados en este servidor")
      )
      .addSubcommand((s) =>
        s
          .setName("panel")
          .setDescription("Abrir panel interactivo con menus para gestionar comandos")
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
        .filter(Boolean)
    )
  ).sort();
}

function formatCommandList(list, max = 10) {
  if (!Array.isArray(list) || !list.length) return "Ninguno";
  const visible = list.slice(0, max).map((name) => `- \`/${name}\``).join("\n");
  const remaining = list.length - max;
  if (remaining <= 0) return visible;
  return `${visible}\n- ... y ${remaining} mas`;
}

function normalizePanelMode(mode) {
  const normalized = normalizeCommandName(mode);
  if (COMMAND_PANEL_MODES.has(normalized)) return normalized;
  return "deshabilitar";
}

function getPanelCandidates(mode, availableCommands, disabledCommands) {
  const safeMode = normalizePanelMode(mode);
  if (safeMode === "deshabilitar") {
    return availableCommands.filter((name) => !disabledCommands.includes(name) && name !== "setup");
  }
  if (safeMode === "habilitar") {
    return disabledCommands;
  }
  return availableCommands;
}

function buildModeLabel(mode) {
  const safeMode = normalizePanelMode(mode);
  if (safeMode === "habilitar") return "Habilitar";
  if (safeMode === "estado") return "Estado";
  return "Deshabilitar";
}

function buildPanelPayload({ interaction, settingsObj, ownerId, mode = "deshabilitar", notice = null }) {
  const availableCommands = getAvailableCommandNames(interaction);
  const disabledCommands = getDisabledCommandNames(settingsObj);
  const safeMode = normalizePanelMode(mode);
  const candidates = getPanelCandidates(safeMode, availableCommands, disabledCommands);
  const visibleCandidates = candidates.slice(0, MAX_PANEL_OPTIONS);
  const hiddenCount = Math.max(0, candidates.length - visibleCandidates.length);

  const title = "Panel de comandos por servidor";
  const summaryLines = [
    `Disponibles: **${availableCommands.length}**`,
    `Deshabilitados: **${disabledCommands.length}**`,
    `Modo activo: **${buildModeLabel(safeMode)}**`,
    `Candidatos en menu: **${visibleCandidates.length}**${hiddenCount ? ` (+${hiddenCount} ocultos)` : ""}`,
  ];
  if (notice) {
    summaryLines.push("", `Resultado: ${notice}`);
  }

  const embed = E.infoEmbed(title, summaryLines.join("\n"));

  const actionMenu = new StringSelectMenuBuilder()
    .setCustomId(`setup_cmd_panel_action|${ownerId}`)
    .setPlaceholder("Selecciona accion")
    .addOptions([
      {
        label: "Deshabilitar comando",
        description: "Bloquea un comando en este servidor",
        value: "deshabilitar",
        default: safeMode === "deshabilitar",
      },
      {
        label: "Habilitar comando",
        description: "Vuelve a habilitar un comando",
        value: "habilitar",
        default: safeMode === "habilitar",
      },
      {
        label: "Estado de comando",
        description: "Verifica si un comando esta activo o no",
        value: "estado",
        default: safeMode === "estado",
      },
      {
        label: "Listar deshabilitados",
        description: "Muestra el resumen de comandos bloqueados",
        value: "listar",
      },
      {
        label: "Reset de bloqueos",
        description: "Rehabilita todos los comandos deshabilitados",
        value: "reset",
      },
    ]);

  const targetMenu = new StringSelectMenuBuilder()
    .setCustomId(`setup_cmd_panel_target|${ownerId}|${safeMode}`)
    .setPlaceholder(`Comando para ${buildModeLabel(safeMode).toLowerCase()}`);

  if (!visibleCandidates.length) {
    targetMenu
      .setDisabled(true)
      .addOptions([
        {
          label: "Sin comandos disponibles",
          description: "Cambia de accion para ver otras opciones",
          value: "__none__",
        },
      ]);
  } else {
    targetMenu.addOptions(
      visibleCandidates.map((name) => ({
        label: `/${name}`,
        description: safeMode === "estado"
          ? "Consultar estado actual"
          : safeMode === "habilitar"
            ? "Volver a habilitar"
            : "Deshabilitar",
        value: name,
      }))
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
    return `No hay comandos deshabilitados en este servidor.\nDisponibles: **${available.length}** | Habilitados: **${enabledCount}**.`;
  }

  const body = disabled.map((name) => `- \`/${name}\``).join("\n");
  return (
    `Comandos deshabilitados (${disabled.length}):\n${body}\n\n` +
    `Disponibles: **${available.length}** | Habilitados: **${enabledCount}**.`
  );
}

async function sendCommandAuditLog({ interaction, settingsObj, action, commandName, before, after }) {
  const logChannelId = settingsObj?.log_channel;
  if (!logChannelId) return;

  const logChannel = interaction.guild?.channels?.cache?.get(logChannelId);
  if (!logChannel) return;

  const actionLabel = {
    deshabilitar: "Comando deshabilitado",
    habilitar: "Comando habilitado",
    reset: "Reset de comandos",
  }[action] || "Cambio en comandos";

  const embed = new EmbedBuilder()
    .setColor(action === "habilitar" ? 0x57F287 : action === "reset" ? 0xFEE75C : 0xED4245)
    .setTitle(actionLabel)
    .setDescription(commandName ? `Comando afectado: \`/${commandName}\`` : "Se aplico un cambio global.")
    .addFields(
      { name: "Ejecutado por", value: `<@${interaction.user.id}>`, inline: true },
      { name: "Servidor", value: interaction.guild?.name || interaction.guildId || "Desconocido", inline: true },
      { name: "Antes", value: formatCommandList(before), inline: false },
      { name: "Despues", value: formatCommandList(after), inline: false }
    )
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(() => {});
}

async function autocomplete(ctx) {
  const { interaction, group, sub, s } = ctx;
  if (group !== "comandos") return false;

  const focused = interaction.options.getFocused(true);
  if (focused?.name !== "comando") {
    return false;
  }

  const query = normalizeCommandName(focused.value);
  const availableCommands = getAvailableCommandNames(interaction);
  const disabledCommands = getDisabledCommandNames(s);

  let candidates = [];
  if (sub === "deshabilitar") {
    candidates = availableCommands.filter((name) => !disabledCommands.includes(name) && name !== "setup");
  } else if (sub === "habilitar") {
    candidates = disabledCommands;
  } else if (sub === "estado") {
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
  if (group !== "comandos") return false;

  const availableCommands = getAvailableCommandNames(interaction);
  const disabledCommands = getDisabledCommandNames(s);

  if (sub === "listar") {
    await interaction.reply({
      embeds: [E.infoEmbed("Comandos del servidor", buildListMessage(availableCommands, disabledCommands))],
      flags: 64,
    });
    return true;
  }

  if (sub === "estado") {
    const rawName = interaction.options.getString("comando");
    if (!rawName) {
      await interaction.reply({
        embeds: [E.infoEmbed("Estado de comandos", buildListMessage(availableCommands, disabledCommands))],
        flags: 64,
      });
      return true;
    }

    const commandName = normalizeCommandName(rawName);
    if (!commandName || !availableCommands.includes(commandName)) {
      return er(`No existe el comando \`/${commandName || rawName}\` en este bot.`);
    }

    const disabled = disabledCommands.includes(commandName);
    return ok(
      `Estado de \`/${commandName}\`: **${disabled ? "Deshabilitado" : "Habilitado"}**.\n` +
      `Comandos deshabilitados actuales: **${disabledCommands.length}**.`
    );
  }

  if (sub === "panel") {
    const ownerId = interaction.user.id;
    const payload = buildPanelPayload({
      interaction,
      settingsObj: s,
      ownerId,
      mode: "deshabilitar",
      notice: "Usa los menus para gestionar comandos sin escribir nombres.",
    });
    await interaction.reply({ ...payload, flags: 64 });
    return true;
  }

  if (sub === "reset") {
    if (!disabledCommands.length) {
      return ok("No habia comandos deshabilitados. Nada para resetear.");
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
    return ok(`Se rehabilitaron **${disabledCommands.length}** comando(s).`);
  }

  const rawName = interaction.options.getString("comando");
  const commandName = normalizeCommandName(rawName);
  if (!commandName) {
    return er("Debes indicar un comando valido.");
  }

  if (!availableCommands.includes(commandName)) {
    return er(`No existe el comando \`/${commandName}\` en este bot.`);
  }

  if (commandName === "setup" && sub === "deshabilitar") {
    return er("No puedes deshabilitar `/setup` para evitar bloqueo de administracion.");
  }

  if (sub === "deshabilitar") {
    if (disabledCommands.includes(commandName)) {
      return ok(`El comando \`/${commandName}\` ya estaba deshabilitado.`);
    }

    const updated = [...disabledCommands, commandName].sort();
    await settings.update(gid, { disabled_commands: updated });
    await sendCommandAuditLog({
      interaction,
      settingsObj: s,
      action: "deshabilitar",
      commandName,
      before: disabledCommands,
      after: updated,
    });
    return ok(`Comando \`/${commandName}\` deshabilitado para este servidor.`);
  }

  if (sub === "habilitar") {
    if (!disabledCommands.includes(commandName)) {
      return ok(`El comando \`/${commandName}\` ya estaba habilitado.`);
    }

    const updated = disabledCommands.filter((name) => name !== commandName);
    await settings.update(gid, { disabled_commands: updated });
    await sendCommandAuditLog({
      interaction,
      settingsObj: s,
      action: "habilitar",
      commandName,
      before: disabledCommands,
      after: updated,
    });
    return ok(`Comando \`/${commandName}\` habilitado nuevamente.`);
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
