const test = require("node:test");
const assert = require("node:assert/strict");
const { Collection } = require("discord.js");

const db = require("../src/utils/database");
const comandosSetup = require("../src/commands/admin/config/setup/comandos");

const originalSettingsUpdate = db.settings.update;

function createInteraction({
  commandName = "ping",
  available = ["setup", "ping", "music"],
  focusedValue = "p",
  focusedName = "comando",
} = {}) {
  const calls = { reply: [], respond: [] };
  const commands = new Collection();
  for (const name of available) {
    commands.set(name, { data: { name }, execute: async () => {} });
  }

  return {
    client: { commands },
    guild: {
      id: "g1",
      name: "Guild 1",
      channels: { cache: new Collection() },
    },
    user: { id: "u1" },
    options: {
      getString: () => commandName,
      getFocused: () => ({ name: focusedName, value: focusedValue }),
    },
    reply: async (payload) => {
      calls.reply.push(payload);
    },
    respond: async (payload) => {
      calls.respond.push(payload);
    },
    __calls: calls,
  };
}

test.beforeEach(() => {
  db.settings.update = async () => true;
});

test.after(() => {
  db.settings.update = originalSettingsUpdate;
});

test("setup/comandos deshabilitar persiste el comando", async () => {
  let updated = null;
  db.settings.update = async (_gid, data) => {
    updated = data;
    return true;
  };

  const interaction = createInteraction({ commandName: "ping" });
  const ctx = {
    interaction,
    group: "comandos",
    sub: "deshabilitar",
    gid: "g1",
    s: { disabled_commands: [] },
    ok: async () => true,
    er: async () => false,
  };

  const handled = await comandosSetup.execute(ctx);
  assert.equal(handled, true);
  assert.deepEqual(updated, { disabled_commands: ["ping"] });
});

test("setup/comandos no permite deshabilitar setup", async () => {
  let updated = null;
  db.settings.update = async (_gid, data) => {
    updated = data;
    return true;
  };

  let errorMsg = null;
  const interaction = createInteraction({ commandName: "setup" });
  const ctx = {
    interaction,
    group: "comandos",
    sub: "deshabilitar",
    gid: "g1",
    s: { disabled_commands: [] },
    ok: async () => true,
    er: async (msg) => {
      errorMsg = msg;
      return true;
    },
  };

  const handled = await comandosSetup.execute(ctx);
  assert.equal(handled, true);
  assert.equal(updated, null);
  assert.match(errorMsg, /cannot disable/i);
});

test("setup/comandos listar responde embed informativo", async () => {
  const interaction = createInteraction();
  const ctx = {
    interaction,
    group: "comandos",
    sub: "listar",
    gid: "g1",
    s: { disabled_commands: ["music"] },
    ok: async () => true,
    er: async () => true,
  };

  const handled = await comandosSetup.execute(ctx);
  assert.equal(handled, true);
  assert.equal(interaction.__calls.reply.length, 1);
});

test("setup/comandos reset limpia la lista de deshabilitados", async () => {
  let updated = null;
  db.settings.update = async (_gid, data) => {
    updated = data;
    return true;
  };

  const interaction = createInteraction();
  const ctx = {
    interaction,
    group: "comandos",
    sub: "reset",
    gid: "g1",
    s: { disabled_commands: ["music", "ping"] },
    ok: async () => true,
    er: async () => true,
  };

  const handled = await comandosSetup.execute(ctx);
  assert.equal(handled, true);
  assert.deepEqual(updated, { disabled_commands: [] });
});

test("setup/comandos estado devuelve estado de comando puntual", async () => {
  let okMsg = null;
  const interaction = createInteraction({ commandName: "music" });
  const ctx = {
    interaction,
    group: "comandos",
    sub: "estado",
    gid: "g1",
    s: { disabled_commands: ["music"] },
    ok: async (msg) => {
      okMsg = msg;
      return true;
    },
    er: async () => true,
  };

  const handled = await comandosSetup.execute(ctx);
  assert.equal(handled, true);
  assert.match(okMsg, /Disabled/i);
});

test("setup/comandos autocomplete sugiere comandos segun subcomando", async () => {
  const interaction = createInteraction({ focusedValue: "p", available: ["setup", "ping", "poll"] });
  const ctx = {
    interaction,
    group: "comandos",
    sub: "deshabilitar",
    gid: "g1",
    s: { disabled_commands: ["poll"] },
  };

  const handled = await comandosSetup.autocomplete(ctx);
  assert.equal(handled, true);
  assert.equal(interaction.__calls.respond.length, 1);
  const values = interaction.__calls.respond[0].map((choice) => choice.value);
  assert.deepEqual(values, ["ping"]);
});

test("setup/comandos panel responde con dos menus select", async () => {
  const interaction = createInteraction();
  const ctx = {
    interaction,
    group: "comandos",
    sub: "panel",
    gid: "g1",
    s: { disabled_commands: [] },
    ok: async () => true,
    er: async () => true,
  };

  const handled = await comandosSetup.execute(ctx);
  assert.equal(handled, true);
  assert.equal(interaction.__calls.reply.length, 1);
  const payload = interaction.__calls.reply[0];
  assert.equal(Array.isArray(payload.components), true);
  assert.equal(payload.components.length, 2);
});

test("setup/comandos panel desactiva menu objetivo cuando no hay candidatos", () => {
  const interaction = createInteraction({ available: ["setup", "ping"] });
  const payload = comandosSetup.buildPanelPayload({
    interaction,
    settingsObj: { disabled_commands: [] },
    ownerId: "u1",
    mode: "habilitar",
  });

  const targetRow = payload.components[1];
  const targetMenu = targetRow.components[0];
  assert.equal(targetMenu.data.disabled, true);
});
