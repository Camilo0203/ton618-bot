const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const {
  buildHealthSnapshot,
  getPersistedHealthSnapshot,
} = require("../../../utils/healthMonitor");
const { getBuildInfo } = require("../../../utils/buildInfo");

function formatUptime(secondsTotal) {
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = Math.floor(secondsTotal % 60);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function formatHeartbeatAge(lastSeen) {
  if (!lastSeen) return "Sin heartbeat persistido";
  const ageMs = Date.now() - new Date(lastSeen).getTime();
  if (!Number.isFinite(ageMs) || ageMs < 0) return "Dato invalido";
  const sec = Math.floor(ageMs / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  return `${h}h ${min % 60}m`;
}

function formatBuildValue(buildInfo) {
  return [
    `Fingerprint: \`${buildInfo.fingerprint}\``,
    `Version: \`${buildInfo.version}\``,
    `Commit: \`${buildInfo.shortCommit || "unknown"}\``,
    buildInfo.deployTag ? `Tag: \`${buildInfo.deployTag}\`` : null,
  ].filter(Boolean).join("\n");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Herramientas de debug para administradores")
    .addSubcommand((s) => s.setName("status").setDescription("Ver estado del bot y metricas"))
    .addSubcommand((s) => s.setName("salud").setDescription("Ver salud operativa y heartbeat"))
    .addSubcommand((s) => s.setName("memory").setDescription("Ver uso de memoria"))
    .addSubcommand((s) => s.setName("cache").setDescription("Ver cache del bot"))
    .addSubcommand((s) => s.setName("guilds").setDescription("Listar servidores conectados"))
    .addSubcommand((s) => s.setName("voice").setDescription("Ver estado de musica")),
  meta: {
    hidden: true,
  },

  async execute(interaction) {
    const ownerId = process.env.OWNER_ID || interaction.client.application?.owner?.id;
    if (ownerId && interaction.user.id !== ownerId) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xED4245)
            .setDescription("No tienes permiso para usar comandos de debug."),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    const sub = interaction.options.getSubcommand();
    if (sub === "status") return this.status(interaction);
    if (sub === "salud") return this.salud(interaction);
    if (sub === "memory") return this.memory(interaction);
    if (sub === "cache") return this.cache(interaction);
    if (sub === "guilds") return this.guilds(interaction);
    if (sub === "voice") return this.voice(interaction);

    return interaction.reply({
      content: "Subcomando desconocido.",
      flags: MessageFlags.Ephemeral,
    });
  },

  async status(interaction) {
    const client = interaction.client;
    const buildInfo = getBuildInfo();
    const embed = new EmbedBuilder()
      .setTitle("Estado del Bot")
      .setColor(0x5865F2)
      .addFields(
        { name: "Ping API", value: `\`${client.ws.ping}ms\``, inline: true },
        { name: "Uptime", value: `\`${formatUptime(process.uptime())}\``, inline: true },
        { name: "Servidores", value: `\`${client.guilds.cache.size}\``, inline: true },
        { name: "Usuarios cache", value: `\`${client.users.cache.size}\``, inline: true },
        { name: "Canales cache", value: `\`${client.channels.cache.size}\``, inline: true },
        { name: "Deploy", value: formatBuildValue(buildInfo), inline: false }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async salud(interaction) {
    const buildInfo = getBuildInfo();
    const pingWarnMs = Math.max(50, Number(process.env.HEALTH_PING_WARN_MS || 300));
    const errorWarnPct = Math.max(1, Number(process.env.HEALTH_ERROR_RATE_WARN_PCT || 25));

    const snapshot = buildHealthSnapshot(interaction.client);
    const persisted = await getPersistedHealthSnapshot();
    const topErrors = snapshot.summary?.topErrors || [];

    const pingState = snapshot.pingMs >= pingWarnMs ? "ALTO" : "OK";
    const errorState = snapshot.errorRatePct >= errorWarnPct ? "ALTO" : "OK";

    const embed = new EmbedBuilder()
      .setColor(errorState === "ALTO" || pingState === "ALTO" ? 0xE67E22 : 0x57F287)
      .setTitle("Salud del Bot")
      .setDescription("Snapshot de ventana activa + ultimo heartbeat persistido.")
      .addFields(
        {
          name: "Estado rapido",
          value:
            `Ping: **${pingState}** (${snapshot.pingMs}ms, umbral ${pingWarnMs}ms)\n` +
            `Error rate: **${errorState}** (${snapshot.errorRatePct}%, umbral ${errorWarnPct}%)`,
          inline: false,
        },
        {
          name: "Interacciones ventana",
          value:
            `Total: \`${snapshot.interactionsTotal}\`\n` +
            `OK/Error/Denied/Rate: \`${snapshot.byStatus.ok}/${snapshot.byStatus.errors}/${snapshot.byStatus.denied}/${snapshot.byStatus.rateLimited}\``,
          inline: false,
        },
        {
          name: "Heartbeat",
          value:
            `Ultimo: \`${formatHeartbeatAge(persisted?.last_seen)}\`\n` +
            `Guilds: \`${persisted?.guilds ?? interaction.client.guilds.cache.size}\``,
          inline: false,
        },
        {
          name: "Deploy",
          value: formatBuildValue(buildInfo),
          inline: false,
        }
      )
      .setTimestamp();

    if (topErrors.length) {
      const lines = topErrors
        .slice(0, 3)
        .map((item, idx) => `${idx + 1}. ${item.kind}:${item.name} -> ${item.errors} errores`);
      embed.addFields({
        name: "Top errores",
        value: lines.join("\n").slice(0, 1024),
        inline: false,
      });
    }

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async memory(interaction) {
    const memory = process.memoryUsage();
    const formatMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

    const embed = new EmbedBuilder()
      .setTitle("Uso de Memoria")
      .setColor(0xFEE75C)
      .addFields(
        { name: "RSS", value: `\`${formatMB(memory.rss)}\``, inline: true },
        { name: "Heap Total", value: `\`${formatMB(memory.heapTotal)}\``, inline: true },
        { name: "Heap Used", value: `\`${formatMB(memory.heapUsed)}\``, inline: true },
        { name: "External", value: `\`${formatMB(memory.external)}\``, inline: true }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async cache(interaction) {
    const client = interaction.client;
    const embed = new EmbedBuilder()
      .setTitle("Cache")
      .setColor(0x57F287)
      .setDescription("Discord.js gestiona cache automaticamente.")
      .addFields(
        { name: "Usuarios", value: `\`${client.users.cache.size}\``, inline: true },
        { name: "Canales", value: `\`${client.channels.cache.size}\``, inline: true },
        { name: "Servidores", value: `\`${client.guilds.cache.size}\``, inline: true }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async guilds(interaction) {
    const guilds = interaction.client.guilds.cache.map((g) => ({
      name: g.name,
      id: g.id,
      members: g.memberCount,
    }));

    if (!guilds.length) {
      return interaction.reply({
        content: "No hay servidores conectados.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Servidores Conectados")
      .setColor(0x5865F2)
      .setDescription(
        guilds
          .slice(0, 20)
          .map((g) => `**${g.name}** (\`${g.id}\`) - ${g.members} miembros`)
          .join("\n")
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },

  async voice(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Estado de Musica")
      .setColor(0x57F287)
      .setDescription("Las colas de musica se gestionan por servidor.")
      .setTimestamp();

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};

module.exports.alias = {
  help: { redirect: "help" },
  soporte: { redirect: "help", options: { seccion: "tickets" } },
  estadisticas: { redirect: "stats", subcommand: "server" },
};
