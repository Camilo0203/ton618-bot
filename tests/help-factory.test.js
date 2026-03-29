const test = require("node:test");
const assert = require("node:assert/strict");
const { Collection, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const db = require("../src/utils/database");
const { clearGuildSettingsCache } = require("../src/utils/accessControl");
const helpCommand = require("../src/commands/public/utility/help");
const helpFactory = require("../src/utils/helpFactory");

const originalSettingsGet = db.settings.get;

function createPermissionBag(bits = []) {
  const allowed = new Set(bits.map((bit) => BigInt(bit)));
  const adminBit = BigInt(PermissionFlagsBits.Administrator);

  return {
    has: (requested) => {
      if (allowed.has(adminBit)) return true;
      if (requested === null || requested === undefined) return false;

      try {
        return allowed.has(BigInt(requested));
      } catch {
        return false;
      }
    },
  };
}

function createMember({ permissions = [], roles = [] } = {}) {
  const roleSet = new Set(roles);
  const permissionBag = createPermissionBag(permissions);

  return {
    permissions: permissionBag,
    roles: {
      cache: {
        has: (id) => roleSet.has(id),
      },
    },
  };
}

function createCommand({
  name,
  description,
  category = "utility",
  scope = "public",
  hidden = false,
  defaultMemberPermissions,
  build,
}) {
  let data = new SlashCommandBuilder().setName(name).setDescription(description);
  if (defaultMemberPermissions !== undefined) {
    data = data.setDefaultMemberPermissions(defaultMemberPermissions);
  }
  if (typeof build === "function") {
    data = build(data);
  }

  return {
    data,
    meta: { category, scope, hidden },
    execute: async () => {},
  };
}

function createHelpInteraction({
  commands,
  input = null,
  focused = "",
  locale = "es-ES",
  permissions = [],
  roles = [],
  userId = "u1",
} = {}) {
  const member = createMember({ permissions, roles });
  const calls = {
    reply: [],
    respond: [],
    editReply: [],
  };

  return {
    guildId: "g1",
    guild: { id: "g1", name: "GuildX" },
    locale,
    user: { id: userId },
    member,
    memberPermissions: member.permissions,
    client: { commands },
    options: {
      getString: (name) => (name === "comando" ? input : null),
      getFocused: () => focused,
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    respond: async (payload) => {
      calls.respond.push(payload);
    },
    fetchReply: async () => ({
      createMessageComponentCollector: () => ({
        on: () => {},
      }),
    }),
    editReply: async (payload) => {
      calls.editReply.push(payload);
    },
    __calls: calls,
  };
}

function collectEmbedText(payload) {
  return (payload.embeds || [])
    .map((embed) => {
      const data = embed.data || {};
      const fields = Array.isArray(data.fields)
        ? data.fields.map((field) => `${field.name}\n${field.value}`).join("\n")
        : "";
      return [data.title, data.description, fields].filter(Boolean).join("\n");
    })
    .join("\n");
}

function collectSelectMenuData(payload) {
  return payload.components?.[0]?.toJSON?.()?.components?.[0] || null;
}

function createLocalizedAlphaCommand() {
  return createCommand({
    name: "alpha",
    description: "Manage alpha workflows",
    category: "utility",
    build: (builder) =>
      builder
        .setDescriptionLocalizations({
          "es-ES": "Gestiona flujos alpha",
          "es-419": "Gestiona flujos alpha",
        })
        .addSubcommand((sub) =>
          sub
            .setName("open")
            .setDescription("Open an alpha case")
            .setDescriptionLocalizations({
              "es-ES": "Abre un caso alpha",
              "es-419": "Abre un caso alpha",
            })
            .addStringOption((option) =>
              option
                .setName("reason")
                .setDescription("Reason")
                .setDescriptionLocalizations({
                  "es-ES": "Motivo",
                  "es-419": "Motivo",
                })
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("priority")
                .setDescription("Priority")
                .setDescriptionLocalizations({
                  "es-ES": "Prioridad",
                  "es-419": "Prioridad",
                })
                .setRequired(false)
            )
        )
        .addSubcommandGroup((group) =>
          group
            .setName("review")
            .setDescription("Review tools")
            .setDescriptionLocalizations({
              "es-ES": "Herramientas de revision",
              "es-419": "Herramientas de revision",
            })
            .addSubcommand((sub) =>
              sub
                .setName("list")
                .setDescription("List active alpha cases")
                .setDescriptionLocalizations({
                  "es-ES": "Lista los casos alpha activos",
                  "es-419": "Lista los casos alpha activos",
                })
            )
        ),
  });
}

test.beforeEach(() => {
  clearGuildSettingsCache("*");
  db.settings.get = async () => ({
    bot_language: "es",
    simple_help_mode: true,
    admin_role: "role-admin",
    support_role: "role-support",
    disabled_commands: [],
  });
});

test.after(() => {
  db.settings.get = originalSettingsGet;
  clearGuildSettingsCache("*");
});

test("help home usa bot_language=es y localiza embed y menu", async () => {
  db.settings.get = async () => ({
    bot_language: "es",
    simple_help_mode: true,
    admin_role: null,
    support_role: null,
    disabled_commands: ["beta"],
  });

  const commands = new Collection();
  commands.set("alpha", createLocalizedAlphaCommand());
  commands.set(
    "beta",
    createCommand({
      name: "beta",
      description: "Beta ticket command",
      category: "tickets",
    })
  );

  const interaction = createHelpInteraction({ commands, input: null, locale: "en-US" });

  await helpCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const payload = interaction.__calls.reply[0];
  assert.equal(payload.embeds[0].data.title, "Centro de ayuda de TON618");

  const embedText = collectEmbedText(payload);
  const selectMenu = collectSelectMenuData(payload);

  assert.match(
    embedText,
    /Explora los comandos disponibles para ti en \*\*GuildX\*\*\. Los comandos ocultos, deshabilitados o inaccesibles se excluyen automáticamente\./
  );
  assert.match(embedText, /Resumen general/);
  assert.match(embedText, /Visibilidad/);
  assert.match(embedText, /- \*\*Utilidades\*\*: 1 comando, 2 entradas visibles/);
  assert.doesNotMatch(embedText, /\*\*Tickets\*\*/);
  assert.doesNotMatch(embedText, /TON618 Help Center|Overview|Visible commands/);
  assert.equal(selectMenu.placeholder, "Selecciona una categoría");
  assert.equal(selectMenu.options[0].label, "Inicio");
  assert.deepEqual(
    selectMenu.options.map((option) => option.label),
    ["Inicio", "Utilidades"]
  );
});

test("help home usa locale como fallback y muestra ingles real", async () => {
  db.settings.get = async () => ({
    bot_language: null,
    simple_help_mode: true,
    admin_role: null,
    support_role: null,
    disabled_commands: [],
  });

  const commands = new Collection();
  commands.set("alpha", createLocalizedAlphaCommand());

  const interaction = createHelpInteraction({
    commands,
    input: null,
    locale: "en-GB",
  });

  await helpCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const payload = interaction.__calls.reply[0];
  assert.equal(payload.embeds[0].data.title, "TON618 Help Center");

  const embedText = collectEmbedText(payload);
  const selectMenu = collectSelectMenuData(payload);

  assert.match(
    embedText,
    /Browse the commands currently available to you in \*\*GuildX\*\*\. Hidden, disabled, and inaccessible commands are excluded automatically\./
  );
  assert.match(embedText, /Overview/);
  assert.match(embedText, /Visibility/);
  assert.match(embedText, /- \*\*Utilities\*\*: 1 command, 2 visible entries/);
  assert.doesNotMatch(embedText, /Centro de ayuda de TON618|Resumen general|Categorías visibles/);
  assert.equal(selectMenu.placeholder, "Select a category");
  assert.equal(selectMenu.options[0].label, "Home");
  assert.deepEqual(
    selectMenu.options.map((option) => option.label),
    ["Home", "Utilities"]
  );
});

test("help directo de un comando usa espanol cuando bot_language es es", async () => {
  db.settings.get = async () => ({
    bot_language: "es",
    simple_help_mode: true,
    admin_role: null,
    support_role: null,
    disabled_commands: [],
  });

  const commands = new Collection();
  commands.set("alpha", createLocalizedAlphaCommand());

  const interaction = createHelpInteraction({
    commands,
    input: "alpha open",
    locale: "en-US",
  });

  await helpCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const payload = interaction.__calls.reply[0];
  const embedText = collectEmbedText(payload);

  assert.equal(payload.embeds[0].data.title, "Ayuda: /alpha");
  assert.match(embedText, /Categoría: \*\*Utilidades\*\*/);
  assert.match(embedText, /Nivel de acceso: \*\*Público\*\*/);
  assert.match(embedText, /Coincidencia destacada: `\/alpha open`/);
  assert.match(embedText, /Entradas visibles/);
  assert.match(embedText, /Abre un caso alpha\. Obligatorio: motivo\. Opcional: prioridad\./);
  assert.doesNotMatch(embedText, /Category:|Access level:|Focused match:|Key input:/);
});

test("help directo de un comando usa ingles cuando bot_language es en", async () => {
  db.settings.get = async () => ({
    bot_language: "en",
    simple_help_mode: true,
    admin_role: null,
    support_role: null,
    disabled_commands: [],
  });

  const commands = new Collection();
  commands.set("alpha", createLocalizedAlphaCommand());

  const interaction = createHelpInteraction({
    commands,
    input: "alpha open",
    locale: "es-419",
  });

  await helpCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const payload = interaction.__calls.reply[0];
  const embedText = collectEmbedText(payload);

  assert.equal(payload.embeds[0].data.title, "Help: /alpha");
  assert.match(embedText, /Category: \*\*Utilities\*\*/);
  assert.match(embedText, /Access level: \*\*Public\*\*/);
  assert.match(embedText, /Focused match: `\/alpha open`/);
  assert.match(embedText, /Visible Entries/);
  assert.match(embedText, /Open an alpha case\. Key input: reason\. Optional: priority\./);
  assert.doesNotMatch(embedText, /Categoria:|Nivel de acceso:|Coincidencia destacada:|Obligatorio:/);
});

test("category help usa espanol real para una vista de categoria", () => {
  const commands = [createLocalizedAlphaCommand()];
  const catalog = helpFactory.__test.buildCommandCatalog(commands, "es");
  const embeds = helpFactory.__test.buildCategoryEmbeds("utility", catalog, "GuildX", "es");
  const embedText = collectEmbedText({ embeds });

  assert.match(embedText, /Comandos de Utilidades/);
  assert.match(embedText, /\/alpha \[Público\]/);
  assert.match(embedText, /`\/alpha open`/);
  assert.match(embedText, /`\/alpha review list`/);
  assert.match(embedText, /Comandos visibles: \*\*1\*\*/);
  assert.match(embedText, /Entradas visibles: \*\*2\*\*/);
  assert.match(embedText, /Resumen: Gestiona flujos alpha\./);
  assert.match(embedText, /Obligatorio: motivo\. Opcional: prioridad\./);
  assert.doesNotMatch(embedText, /Overview:|Visible commands:|Key input:/);
});

test("help command registration expone localizaciones completas en ingles y espanol", () => {
  const data = helpCommand.data.toJSON();

  assert.equal(
    data.description,
    "Interactive help center for the commands available in this server"
  );
  assert.equal(
    data.description_localizations["en-US"],
    "Interactive help center for the commands available in this server"
  );
  assert.equal(
    data.description_localizations["en-GB"],
    "Interactive help center for the commands available in this server"
  );
  assert.equal(
    data.description_localizations["es-ES"],
    "Centro de ayuda interactivo con los comandos disponibles en este servidor"
  );
  assert.equal(
    data.description_localizations["es-419"],
    "Centro de ayuda interactivo con los comandos disponibles en este servidor"
  );
  assert.equal(
    data.options[0].description,
    "Command name or usage path for direct help"
  );
  assert.equal(
    data.options[0].description_localizations["es-ES"],
    "Nombre del comando o ruta de uso para ver ayuda directa"
  );
  assert.equal(
    data.options[0].description_localizations["es-419"],
    "Nombre del comando o ruta de uso para ver ayuda directa"
  );
  assert.equal(
    data.options[0].description_localizations["en-US"],
    "Command name or usage path for direct help"
  );
  assert.equal(
    data.options[0].description_localizations["en-GB"],
    "Command name or usage path for direct help"
  );
});

test("help autocomplete only suggests commands the member can really see", async () => {
  db.settings.get = async () => ({
    bot_language: "en",
    simple_help_mode: false,
    admin_role: "role-admin",
    support_role: "role-support",
    disabled_commands: ["beta"],
  });

  const commands = new Collection();
  commands.set(
    "alpha",
    createCommand({
      name: "alpha",
      description: "Alpha utility command",
      category: "utility",
    })
  );
  commands.set(
    "beta",
    createCommand({
      name: "beta",
      description: "Disabled utility command",
      category: "utility",
    })
  );
  commands.set(
    "gamma",
    createCommand({
      name: "gamma",
      description: "Admin command",
      category: "config",
      scope: "admin",
      defaultMemberPermissions: PermissionFlagsBits.Administrator,
    })
  );
  commands.set(
    "staffops",
    createCommand({
      name: "staffops",
      description: "Staff command",
      category: "moderation",
      scope: "staff",
    })
  );
  commands.set(
    "hidden",
    createCommand({
      name: "hidden",
      description: "Hidden command",
      category: "utility",
      hidden: true,
    })
  );

  const interaction = createHelpInteraction({
    commands,
    focused: "",
    roles: ["role-support"],
    permissions: [],
  });

  await helpCommand.autocomplete(interaction);

  assert.equal(interaction.__calls.respond.length, 1);
  const choices = interaction.__calls.respond[0].map((choice) => choice.value);
  assert.deepEqual(choices, ["alpha"]);
});

test("help exposes inferred staff commands when the required permission is present", async () => {
  db.settings.get = async () => ({
    bot_language: "en",
    simple_help_mode: false,
    admin_role: "role-admin",
    support_role: "role-support",
    disabled_commands: [],
  });

  const commands = new Collection();
  commands.set(
    "staffops",
    createCommand({
      name: "staffops",
      description: "Staff command",
      category: "moderation",
      scope: "staff",
    })
  );

  const interaction = createHelpInteraction({
    commands,
    focused: "staff",
    roles: ["role-support"],
    permissions: [PermissionFlagsBits.ManageMessages],
  });

  await helpCommand.autocomplete(interaction);

  assert.equal(interaction.__calls.respond.length, 1);
  const choices = interaction.__calls.respond[0].map((choice) => choice.value);
  assert.deepEqual(choices, ["staffops"]);
});
