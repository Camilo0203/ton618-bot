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

test("help home stays in English and excludes disabled commands", async () => {
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

  const interaction = createHelpInteraction({ commands, input: null, locale: "es-ES" });

  await helpCommand.execute(interaction);

  assert.equal(interaction.__calls.reply.length, 1);
  const payload = interaction.__calls.reply[0];
  assert.equal(payload.embeds[0].data.title, "TON618 Help Center");

  const embedText = collectEmbedText(payload);
  assert.match(embedText, /Hidden, disabled, and inaccessible commands are excluded automatically\./);
  assert.doesNotMatch(embedText, /\*\*Tickets\*\*/);
  assert.match(embedText, /\*\*Utilities\*\*/);
});

test("direct help lookup expands visible subcommands and subcommand groups in English", async () => {
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
          .addSubcommand((sub) => sub.setName("open").setDescription("Open a support ticket"))
          .addSubcommandGroup((group) =>
            group
              .setName("note")
              .setDescription("Internal notes")
              .addSubcommand((sub) => sub.setName("add").setDescription("Add an internal note"))
              .addSubcommand((sub) => sub.setName("list").setDescription("List the notes"))
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

test("category help groups entries under the top-level command", () => {
  const commands = [
    createCommand({
      name: "ticket",
      description: "Ticket operations",
      category: "tickets",
      build: (builder) =>
        builder
          .addSubcommand((sub) => sub.setName("open").setDescription("Open a support ticket"))
          .addSubcommandGroup((group) =>
            group
              .setName("note")
              .setDescription("Internal notes")
              .addSubcommand((sub) => sub.setName("add").setDescription("Add an internal note"))
          ),
    }),
  ];

  const catalog = helpFactory.__test.buildCommandCatalog(commands);
  const embeds = helpFactory.__test.buildCategoryEmbeds("tickets", catalog, "GuildX");
  const embedText = collectEmbedText({ embeds });

  assert.match(embedText, /Tickets Commands/);
  assert.match(embedText, /\/ticket \[Public\]/);
  assert.match(embedText, /`\/ticket open`/);
  assert.match(embedText, /`\/ticket note add`/);
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
