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

test("help home usa el idioma configurado del servidor y excluye comandos deshabilitados", async () => {
  db.settings.get = async () => ({
    bot_language: "es",
    simple_help_mode: true,
    admin_role: null,
    support_role: null,
    disabled_commands: ["beta"],
  });

  const commands = new Collection();
  commands.set("help", helpCommand);
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
  assert.match(embedText, /Los comandos ocultos, deshabilitados o inaccesibles se excluyen automaticamente\./);
  assert.doesNotMatch(embedText, /Hidden, disabled, and inaccessible commands are excluded automatically\./);
  assert.doesNotMatch(embedText, /\*\*Tickets\*\*/);
  assert.match(embedText, /\*\*Utilidades\*\*/);
});

test("direct help lookup expands visible subcommands and subcommand groups in English", async () => {
  db.settings.get = async () => ({
    bot_language: "en",
    simple_help_mode: true,
    admin_role: null,
    support_role: null,
    disabled_commands: [],
  });

  const commands = new Collection();
  commands.set("help", helpCommand);
  commands.set(
    "ticket",
    createCommand({
      name: "ticket",
      description: "Ticket operations",
      category: "tickets",
      build: (builder) =>
        builder
          .addSubcommand((sub) =>
            sub
              .setName("open")
              .setDescription("Open a support ticket")
              .setDescriptionLocalizations({
                "es-ES": "Abre un ticket de soporte",
              })
          )
          .addSubcommandGroup((group) =>
            group
              .setName("note")
              .setDescription("Internal notes")
              .setDescriptionLocalizations({
                "es-ES": "Notas internas",
              })
              .addSubcommand((sub) =>
                sub
                  .setName("add")
                  .setDescription("Add an internal note")
                  .setDescriptionLocalizations({
                    "es-ES": "Agrega una nota interna",
                  })
              )
              .addSubcommand((sub) =>
                sub
                  .setName("list")
                  .setDescription("List the notes")
                  .setDescriptionLocalizations({
                    "es-ES": "Lista las notas",
                  })
              )
          ),
    })
  );

  const interaction = createHelpInteraction({
    commands,
    input: "ticket",
    locale: "es-ES",
  });

  await helpCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const payload = interaction.__calls.reply[0];
  assert.equal(payload.embeds[0].data.title, "Help: /ticket");

  const embedText = collectEmbedText(payload);
  assert.match(embedText, /Category: \*\*Tickets\*\*/);
  assert.match(embedText, /`\/ticket open`/);
  assert.match(embedText, /`\/ticket note add`/);
  assert.match(embedText, /`\/ticket note list`/);
  assert.match(embedText, /internal staff note/i);
});

test("category help changes language for a category view", () => {
  const commands = [
    createCommand({
      name: "ticket",
      description: "Ticket operations",
      category: "tickets",
      build: (builder) =>
        builder
          .setDescriptionLocalizations({
            "es-ES": "Operaciones de tickets",
          })
          .addSubcommand((sub) =>
            sub
              .setName("open")
              .setDescription("Open a support ticket")
              .setDescriptionLocalizations({
                "es-ES": "Abre un ticket de soporte",
              })
          )
          .addSubcommandGroup((group) =>
            group
              .setName("note")
              .setDescription("Internal notes")
              .setDescriptionLocalizations({
                "es-ES": "Notas internas",
              })
              .addSubcommand((sub) =>
                sub
                  .setName("add")
                  .setDescription("Add an internal note")
                  .setDescriptionLocalizations({
                    "es-ES": "Agrega una nota interna",
                  })
              )
          ),
    }),
  ];

  const catalog = helpFactory.__test.buildCommandCatalog(commands, "es");
  const embeds = helpFactory.__test.buildCategoryEmbeds("tickets", catalog, "GuildX", "es");
  const embedText = collectEmbedText({ embeds });

  assert.match(embedText, /Comandos de Tickets/);
  assert.match(embedText, /\/ticket \[Publico\]/);
  assert.match(embedText, /`\/ticket open`/);
  assert.match(embedText, /`\/ticket note add`/);
  assert.match(embedText, /Comandos visibles: \*\*1\*\*/);
  assert.doesNotMatch(embedText, /Overview:|Visible commands:/);
  assert.match(
    embedText,
    /Abre un nuevo ticket privado de soporte y entra en el flujo de tickets del servidor\.|Guarda una nota interna del staff en el ticket actual para relevos y seguimiento posterior\./
  );
});

test("help command registration exposes Spanish description localizations", () => {
  const data = helpCommand.data.toJSON();

  assert.equal(data.description, "Public help for server members and customers");
  assert.equal(
    data.description_localizations["es-ES"],
    "Ayuda publica para miembros y clientes del servidor"
  );
  assert.equal(
    data.options[0].description_localizations["es-ES"],
    "Nombre del comando o ruta de uso para ayuda directa"
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
